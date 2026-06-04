"use client";

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  LoaderCircle,
  ScanSearch,
  Upload,
} from "lucide-react";
import Papa from "papaparse";
import { useMemo, useState } from "react";

import {
  type CsvParseProgress,
  type CsvRow,
  isLikelyCsvFile,
  MAX_CSV_FILE_SIZE,
  parseCsvFile,
} from "@/lib/csv";
import { downloadCsvContent } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import { normalizeUrlValue } from "@/lib/text-tools";

type UploadStatus = "idle" | "parsing" | "ready" | "error";

type DuplicateMode = "selected" | "email" | "phone" | "domain" | "entire_row";

type CleaningSummary = {
  totalRows: number;
  emptyRowsRemoved: number;
  invalidRowsRemoved: number;
  duplicatesRemoved: number;
  cleanRowsReady: number;
  businessEmails: number;
  personalEmails: number;
  roleBasedEmails: number;
  generatedDomains: number;
};

type PreviewRow = CsvRow & {
  leadcleanr_generated_domain?: string;
  leadcleanr_email_type?: string;
  leadcleanr_role_email?: string;
};

type CleanedResult = {
  rows: PreviewRow[];
  summary: CleaningSummary;
};

const PREVIEW_LIMIT = 100;
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "live.com",
  "msn.com",
  "gmx.com",
  "ymail.com",
]);

const ROLE_EMAIL_PREFIXES = new Set([
  "info",
  "support",
  "sales",
  "admin",
  "hello",
  "team",
  "contact",
  "help",
  "office",
  "billing",
  "careers",
]);

const DUPLICATE_MODE_OPTIONS: Array<{
  value: DuplicateMode;
  label: string;
  description: string;
}> = [
  {
    value: "selected",
    label: "Selected column",
    description: "Best default when one field is the source of truth.",
  },
  {
    value: "email",
    label: "Email",
    description: "Use the first email value found in each row.",
  },
  {
    value: "phone",
    label: "Phone",
    description: "Use the first phone-like value found in each row.",
  },
  {
    value: "domain",
    label: "Domain",
    description: "Group rows by company domain from email or website data.",
  },
  {
    value: "entire_row",
    label: "Entire row",
    description: "Only remove rows that are fully duplicated across all columns.",
  },
];

export function CsvLeadCleanerTool() {
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [duplicateMode, setDuplicateMode] = useState<DuplicateMode>("selected");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState<CsvParseProgress>({
    percentage: 0,
    rowsProcessed: 0,
  });

  const cleaned = useMemo(
    () => cleanCsvRows(rows, headers, selectedColumn, duplicateMode),
    [duplicateMode, headers, rows, selectedColumn],
  );

  const previewRows = cleaned.rows.slice(0, PREVIEW_LIMIT);
  const isParsing = status === "parsing";
  const showEmailEnrichment =
    selectedColumn &&
    (selectedColumn.toLowerCase().includes("email") || cleaned.summary.generatedDomains > 0);

  function resetState(nextFileName = "") {
    setFileName(nextFileName);
    setHeaders([]);
    setRows([]);
    setSelectedColumn("");
    setDuplicateMode("selected");
    setWarning("");
    setProgress({
      percentage: 0,
      rowsProcessed: 0,
    });
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    trackToolEvent("csv-lead-cleaner", "upload_started", {
      file_size_kb: Math.round(file.size / 1024),
    });

    if (!isLikelyCsvFile(file)) {
      resetState();
      setStatus("error");
      setError("Please upload a real CSV file with a .csv extension.");
      return;
    }

    if (file.size > MAX_CSV_FILE_SIZE) {
      resetState();
      setStatus("error");
      setError("Please upload a CSV file smaller than 2 MB.");
      return;
    }

    resetState(file.name);
    setError("");
    setStatus("parsing");

    parseCsvFile({
      file,
      onProgress: setProgress,
      onComplete: (result) => {
        if (!result.headers.length) {
          resetState(file.name);
          setStatus("error");
          setError("We could not detect any CSV columns in that file.");
          trackToolEvent("csv-lead-cleaner", "upload_failed", {
            reason: "missing_headers",
          });
          return;
        }

        setHeaders(result.headers);
        setRows(result.rows);
        setSelectedColumn(pickDefaultColumn(result.headers));
        setStatus("ready");

        if (!result.rows.length) {
          setWarning(
            "We found the header row, but there are no data rows to clean yet.",
          );
        } else if (result.warnings.length) {
          setWarning(buildWarningSummary(result.warnings));
        }

        trackToolEvent("csv-lead-cleaner", "upload_completed", {
          row_count: result.rows.length,
          warning_count: result.warnings.length,
        });
      },
      onError: (message) => {
        resetState(file.name);
        setStatus("error");
        setError(message);
        trackToolEvent("csv-lead-cleaner", "upload_failed", {
          reason: "parse_error",
        });
      },
    });
  }

  const previewHeaders = useMemo(() => {
    const nextHeaders = [...headers];
    if (!showEmailEnrichment) {
      return nextHeaders;
    }

    if (!nextHeaders.includes("leadcleanr_generated_domain")) {
      nextHeaders.push("leadcleanr_generated_domain");
    }
    if (!nextHeaders.includes("leadcleanr_email_type")) {
      nextHeaders.push("leadcleanr_email_type");
    }
    if (!nextHeaders.includes("leadcleanr_role_email")) {
      nextHeaders.push("leadcleanr_role_email");
    }
    return nextHeaders;
  }, [headers, showEmailEnrichment]);

  return (
    <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
      <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.14)] text-[color:var(--brand-strong)]">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
              Flagship workflow
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold sm:text-2xl">
              Clean lead CSVs before import
            </h2>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Upload a spreadsheet, choose the cleanup rule, review the report,
              and export a cleaner file for CRM, outreach, or agency delivery.
            </p>
          </div>
        </div>

        <label
          htmlFor="csv-upload"
          className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-white/70 px-6 py-6 text-center transition hover:border-[color:var(--brand)] hover:bg-white"
        >
          {isParsing ? (
            <LoaderCircle className="h-6 w-6 animate-spin text-[color:var(--brand-strong)]" />
          ) : (
            <Upload className="h-6 w-6 text-[color:var(--brand-strong)]" />
          )}
          <span className="mt-3 text-base font-semibold">
            {isParsing ? "Parsing your CSV..." : "Upload a CSV file"}
          </span>
          <span className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Up to 2 MB. Processing stays in your browser for the MVP.
          </span>
          <input
            id="csv-upload"
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={handleFileUpload}
            disabled={isParsing}
          />
        </label>

        {isParsing ? (
          <div className="mt-4 rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-[color:var(--foreground)]">
                Reading rows
              </span>
              <span className="tabular-nums text-[color:var(--muted)]">
                {progress.percentage}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:rgba(17,36,51,0.08)]">
              <div
                className="h-full rounded-full bg-[color:var(--brand)] transition-[width]"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              {progress.rowsProcessed.toLocaleString()} rows processed so far.
            </p>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4">
          <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
              File
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">
              {fileName || "No CSV uploaded yet"}
            </p>
            {rows.length ? (
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                {rows.length} rows loaded
              </p>
            ) : null}
          </div>

          <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-4">
            <label
              htmlFor="column-select"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]"
            >
              Main cleanup column
            </label>
            <select
              id="column-select"
              value={selectedColumn}
              onChange={(event) => {
                setSelectedColumn(event.target.value);
                trackToolEvent("csv-lead-cleaner", "change_column", {
                  column: event.target.value,
                });
              }}
              disabled={!headers.length || isParsing}
              className="mt-2 min-h-11 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--brand)]"
            >
              {!headers.length ? (
                <option value="">Upload a CSV first</option>
              ) : (
                headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-4">
            <label
              htmlFor="duplicate-mode"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]"
            >
              Deduplicate by
            </label>
            <select
              id="duplicate-mode"
              value={duplicateMode}
              onChange={(event) => {
                const nextMode = event.target.value as DuplicateMode;
                setDuplicateMode(nextMode);
                trackToolEvent("csv-lead-cleaner", "change_duplicate_mode", {
                  mode: nextMode,
                });
              }}
              disabled={!headers.length || isParsing}
              className="mt-2 min-h-11 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--brand)]"
            >
              {DUPLICATE_MODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              {
                DUPLICATE_MODE_OPTIONS.find((option) => option.value === duplicateMode)
                  ?.description
              }
            </p>
          </div>
        </div>

        {error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
        {warning ? <InlineMessage tone="warning">{warning}</InlineMessage> : null}

        <div className="mt-5 rounded-[1.5rem] border border-[color:rgba(15,118,110,0.14)] bg-[color:rgba(15,118,110,0.08)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
            What this now reports
          </p>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            Clean rows, duplicates removed, invalid and blank rows, generated
            domains, business vs personal inboxes, and role-based email counts
            when email data is present.
          </p>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => {
              trackToolEvent("csv-lead-cleaner", "export_csv", {
                row_count: cleaned.rows.length,
                duplicate_mode: duplicateMode,
              });
              downloadCsvContent(
                buildCleanFileName(fileName),
                Papa.unparse(cleaned.rows),
              );
            }}
            disabled={!cleaned.rows.length}
            className="btn-primary inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export Clean CSV
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,248,238,0.92))] p-5 shadow-[var(--shadow)] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Cleaning report
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold">
                Review what changed before export
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[color:rgba(15,118,110,0.12)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
              <ScanSearch className="h-4 w-4" />
              Report
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <StatCard label="Rows uploaded" value={cleaned.summary.totalRows} />
            <StatCard label="Clean rows ready" value={cleaned.summary.cleanRowsReady} accent />
            <StatCard
              label="Duplicates removed"
              value={cleaned.summary.duplicatesRemoved}
            />
            <StatCard
              label="Invalid rows removed"
              value={cleaned.summary.invalidRowsRemoved}
            />
            <StatCard
              label="Blank rows removed"
              value={cleaned.summary.emptyRowsRemoved}
            />
            <StatCard
              label="Generated domains"
              value={cleaned.summary.generatedDomains}
            />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <InsightTile
              label="Business emails"
              value={cleaned.summary.businessEmails}
              tone="teal"
            />
            <InsightTile
              label="Personal emails"
              value={cleaned.summary.personalEmails}
              tone="amber"
            />
            <InsightTile
              label="Role-based inboxes"
              value={cleaned.summary.roleBasedEmails}
              tone="slate"
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold">
                Preview cleaned CSV
              </h3>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                Showing up to {PREVIEW_LIMIT} rows after cleanup.
              </p>
            </div>
            <span className="rounded-full bg-[color:rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
              Preview
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-white/80">
            {previewHeaders.length && previewRows.length ? (
              <div className="max-h-[38rem] overflow-auto">
                <table className="min-w-[980px] border-collapse text-left text-sm">
                  <thead className="sticky top-0 bg-[#f6efe5]">
                    <tr>
                      <th className="border-b border-[color:var(--line)] px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                        #
                      </th>
                      {previewHeaders.map((header) => (
                        <th
                          key={header}
                          className="border-b border-[color:var(--line)] px-4 py-3 font-semibold text-[color:var(--foreground)]"
                        >
                          {prettyHeader(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, index) => (
                      <tr
                        key={`${index}-${duplicateMode}-${selectedColumn}-${row[selectedColumn] ?? ""}`}
                      >
                        <td className="border-b border-[color:rgba(17,36,51,0.08)] px-3 py-3 align-top text-xs font-semibold text-[color:var(--muted)]">
                          {index + 1}
                        </td>
                        {previewHeaders.map((header) => (
                          <td
                            key={`${index}-${header}`}
                            className="border-b border-[color:rgba(17,36,51,0.08)] px-4 py-3 align-top text-[color:var(--muted)]"
                          >
                            <div className="max-w-[16rem] whitespace-normal break-words">
                              {row[header] || "—"}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title={
                  status === "ready" && headers.length
                    ? "No clean rows yet"
                    : "Upload a CSV to start"
                }
                description={
                  status === "ready" && headers.length
                    ? "This file uploaded successfully, but none of the rows survived the current cleanup and deduplication rules."
                    : "Upload a CSV to preview rows and review the cleaned spreadsheet here."
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function cleanCsvRows(
  rows: CsvRow[],
  headers: string[],
  selectedColumn: string,
  duplicateMode: DuplicateMode,
): CleanedResult {
  const emptySummary: CleaningSummary = {
    totalRows: rows.length,
    emptyRowsRemoved: 0,
    invalidRowsRemoved: 0,
    duplicatesRemoved: 0,
    cleanRowsReady: 0,
    businessEmails: 0,
    personalEmails: 0,
    roleBasedEmails: 0,
    generatedDomains: 0,
  };

  if (!headers.length || !selectedColumn) {
    return {
      rows: [],
      summary: emptySummary,
    };
  }

  const nonEmptyRows = rows.filter((row) =>
    headers.some((header) => String(row[header] ?? "").trim() !== ""),
  );

  const emptyRowsRemoved = rows.length - nonEmptyRows.length;
  let invalidRowsRemoved = 0;
  let duplicatesRemoved = 0;
  let personalEmails = 0;
  let businessEmails = 0;
  let roleBasedEmails = 0;
  let generatedDomains = 0;
  const seen = new Set<string>();
  const cleanedRows: PreviewRow[] = [];

  nonEmptyRows.forEach((row) => {
    const normalizedRow = normalizeCsvRow(row, headers, selectedColumn);
    const selectedValue = normalizedRow[selectedColumn];

    if (!selectedValue) {
      invalidRowsRemoved += 1;
      return;
    }

    const duplicateKey = buildDuplicateKey(
      normalizedRow,
      headers,
      selectedColumn,
      duplicateMode,
    );

    if (!duplicateKey) {
      invalidRowsRemoved += 1;
      return;
    }

    if (seen.has(duplicateKey)) {
      duplicatesRemoved += 1;
      return;
    }

    seen.add(duplicateKey);

    const nextRow: PreviewRow = { ...normalizedRow };
    const emailCandidate = getEmailCandidate(normalizedRow, headers, selectedColumn);

    if (emailCandidate) {
      const domain = extractDomainFromEmail(emailCandidate);

      if (domain) {
        nextRow.leadcleanr_generated_domain = domain;
        generatedDomains += 1;
      }

      const emailType = PERSONAL_EMAIL_DOMAINS.has(domain) ? "personal" : "business";
      nextRow.leadcleanr_email_type = emailType;
      if (emailType === "personal") {
        personalEmails += 1;
      } else {
        businessEmails += 1;
      }

      const localPart = emailCandidate.split("@")[0] ?? "";
      const isRoleBased = ROLE_EMAIL_PREFIXES.has(localPart);
      nextRow.leadcleanr_role_email = isRoleBased ? "role-based" : "direct";
      if (isRoleBased) {
        roleBasedEmails += 1;
      }
    }

    cleanedRows.push(nextRow);
  });

  return {
    rows: cleanedRows,
    summary: {
      totalRows: rows.length,
      emptyRowsRemoved,
      invalidRowsRemoved,
      duplicatesRemoved,
      cleanRowsReady: cleanedRows.length,
      personalEmails,
      businessEmails,
      roleBasedEmails,
      generatedDomains,
    },
  };
}

function normalizeCsvRow(
  row: CsvRow,
  headers: string[],
  selectedColumn: string,
): CsvRow {
  const nextRow: CsvRow = {};

  headers.forEach((header) => {
    const rawValue = String(row[header] ?? "").trim();
    nextRow[header] =
      header === selectedColumn
        ? normalizeSelectedValue(rawValue, selectedColumn)
        : rawValue;
  });

  return nextRow;
}

function normalizeSelectedValue(value: string, columnName: string) {
  const normalizedColumn = columnName.toLowerCase();

  if (normalizedColumn.includes("email")) {
    return normalizeEmailValue(value) ?? "";
  }

  if (normalizedColumn.includes("phone") || normalizedColumn.includes("tel")) {
    return normalizePhoneValue(value) ?? "";
  }

  if (
    normalizedColumn.includes("website") ||
    normalizedColumn.includes("url") ||
    normalizedColumn.includes("link")
  ) {
    return normalizeUrlValue(value) ?? "";
  }

  if (normalizedColumn.includes("domain")) {
    return normalizeDomainValue(value) ?? "";
  }

  return value.trim();
}

function buildDuplicateKey(
  row: CsvRow,
  headers: string[],
  selectedColumn: string,
  duplicateMode: DuplicateMode,
) {
  if (duplicateMode === "selected") {
    return row[selectedColumn]?.trim() || "";
  }

  if (duplicateMode === "entire_row") {
    return headers
      .map((header) => String(row[header] ?? "").trim())
      .join("|");
  }

  if (duplicateMode === "email") {
    return getEmailCandidate(row, headers, selectedColumn) ?? "";
  }

  if (duplicateMode === "phone") {
    return getFirstNormalizedValue(row, headers, ["phone", "tel"], normalizePhoneValue);
  }

  if (duplicateMode === "domain") {
    return getDomainCandidate(row, headers, selectedColumn) ?? "";
  }

  return "";
}

function getEmailCandidate(row: CsvRow, headers: string[], selectedColumn: string) {
  const selectedValue = row[selectedColumn] ?? "";
  if (selectedColumn.toLowerCase().includes("email")) {
    return normalizeEmailValue(selectedValue) ?? null;
  }

  return (
    getFirstNormalizedValue(row, headers, ["email"], normalizeEmailValue) || null
  );
}

function getDomainCandidate(row: CsvRow, headers: string[], selectedColumn: string) {
  const selectedValue = row[selectedColumn] ?? "";
  const normalizedColumn = selectedColumn.toLowerCase();

  if (normalizedColumn.includes("domain")) {
    return normalizeDomainValue(selectedValue) ?? null;
  }

  if (normalizedColumn.includes("email")) {
    const email = normalizeEmailValue(selectedValue);
    return email ? extractDomainFromEmail(email) : null;
  }

  if (
    normalizedColumn.includes("website") ||
    normalizedColumn.includes("url") ||
    normalizedColumn.includes("link")
  ) {
    const url = normalizeUrlValue(selectedValue);
    return url ? extractDomainFromUrl(url) : null;
  }

  const emailDomain = getFirstNormalizedValue(
    row,
    headers,
    ["email"],
    (value) => {
      const email = normalizeEmailValue(value);
      return email ? extractDomainFromEmail(email) : null;
    },
  );

  if (emailDomain) {
    return emailDomain;
  }

  return (
    getFirstNormalizedValue(
      row,
      headers,
      ["domain", "website", "url", "link"],
      (value, header) => {
        if (header.toLowerCase().includes("domain")) {
          return normalizeDomainValue(value);
        }
        const normalizedUrl = normalizeUrlValue(value);
        return normalizedUrl ? extractDomainFromUrl(normalizedUrl) : null;
      },
    ) || null
  );
}

function getFirstNormalizedValue(
  row: CsvRow,
  headers: string[],
  columnHints: string[],
  normalizer: (value: string, header: string) => string | null,
) {
  for (const header of headers) {
    const normalizedHeader = header.toLowerCase();
    if (!columnHints.some((hint) => normalizedHeader.includes(hint))) {
      continue;
    }

    const value = String(row[header] ?? "").trim();
    const normalized = normalizer(value, header);
    if (normalized) {
      return normalized;
    }
  }

  return "";
}

function normalizeEmailValue(value: string) {
  const nextValue = value.trim().toLowerCase();
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(nextValue)
    ? nextValue
    : null;
}

function normalizePhoneValue(value: string) {
  const trimmed = value.trim();
  const hasLeadingPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");

  if (digitsOnly.length < 7) {
    return null;
  }

  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
}

function normalizeDomainValue(value: string) {
  const nextValue = value.trim().toLowerCase().replace(/^www\./, "");
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(nextValue) ? nextValue : null;
}

function extractDomainFromEmail(email: string) {
  return email.split("@")[1] ?? "";
}

function extractDomainFromUrl(url: string) {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return normalizeDomainValue(parsed.hostname) ?? "";
  } catch {
    return "";
  }
}

function pickDefaultColumn(headers: string[]) {
  return (
    headers.find((header) => header.toLowerCase().includes("email")) ??
    headers.find((header) => header.toLowerCase().includes("phone")) ??
    headers.find((header) => header.toLowerCase().includes("domain")) ??
    headers[0] ??
    ""
  );
}

function buildCleanFileName(fileName: string) {
  if (!fileName) {
    return "leadcleanr-clean.csv";
  }

  return fileName.toLowerCase().endsWith(".csv")
    ? fileName.replace(/\.csv$/i, "-clean.csv")
    : `${fileName}-clean.csv`;
}

function buildWarningSummary(warnings: string[]) {
  const preview = warnings.slice(0, 2).join(" ");
  const suffix =
    warnings.length > 2 ? ` ${warnings.length - 2} more parsing issues found.` : "";
  return `We imported the readable rows, but found CSV formatting issues. ${preview}${suffix}`;
}

function prettyHeader(header: string) {
  if (header.startsWith("leadcleanr_")) {
    return header
      .replace("leadcleanr_", "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }
  return header;
}

function InlineMessage({
  children,
  tone,
}: {
  children: string;
  tone: "error" | "warning";
}) {
  const palette =
    tone === "error"
      ? "border-[color:rgba(185,28,28,0.18)] bg-[color:rgba(254,242,242,0.9)] text-red-700"
      : "border-[color:rgba(217,119,6,0.18)] bg-[color:rgba(255,247,237,0.9)] text-amber-800";

  return (
    <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${palette}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{children}</p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6">
      <p className="text-base font-semibold text-[color:var(--foreground)]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border p-4 ${
        accent
          ? "border-[color:rgba(15,118,110,0.16)] bg-[color:rgba(15,118,110,0.08)]"
          : "border-[color:var(--line)] bg-white/80"
      }`}
    >
      <div className="text-sm text-[color:var(--muted)]">{label}</div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function InsightTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "teal" | "amber" | "slate";
}) {
  const palette = {
    teal: "border-[color:rgba(15,118,110,0.16)] bg-[color:rgba(15,118,110,0.08)] text-[color:var(--accent)]",
    amber:
      "border-[color:rgba(217,119,6,0.18)] bg-[color:rgba(255,247,237,0.9)] text-[color:var(--brand-strong)]",
    slate:
      "border-[color:rgba(17,36,51,0.1)] bg-[color:rgba(17,36,51,0.05)] text-[color:var(--foreground)]",
  }[tone];

  return (
    <div className={`rounded-[1.4rem] border px-4 py-4 ${palette}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
