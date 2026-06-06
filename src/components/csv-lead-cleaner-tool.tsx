"use client";

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FlaskConical,
  LoaderCircle,
  Redo2,
  ScanSearch,
  Undo2,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  detectCsvColumns,
  type CsvColumnDetection,
  type CsvParseProgress,
  type CsvRow,
  inspectCsvFile,
  isLikelyCsvFile,
  MAX_CSV_FILE_SIZE,
  parseCsvFile,
  parseCsvText,
} from "@/lib/csv";
import { downloadCsvRecords } from "@/lib/export";
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
const DEMO_CSV = `name,email,company,website,phone
Jane Doe,jane@acme.com,Acme,https://acme.com,+1 (415) 555-0101
Support Team,support@acme.com,Acme,https://acme.com,415-555-0101
Broken,not-an-email,Example Co,exampleco.com,
John Smith,john@northstar.io,Northstar,https://northstar.io,+44 20 7946 0958
Duplicate,jane@acme.com,Acme,https://acme.com,+1 (415) 555-0101`;

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
  const [detections, setDetections] = useState<CsvColumnDetection[]>([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [duplicateMode, setDuplicateMode] = useState<DuplicateMode>("selected");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [pendingFile, setPendingFile] = useState<{
    name: string;
    sizeMb: number;
    exceedsFreeLimit: boolean;
    estimatedRows: number | null;
    estimatedRowsWithinFreeLimit: number | null;
  } | null>(null);
  const [progress, setProgress] = useState<CsvParseProgress>({
    percentage: 0,
    rowsProcessed: 0,
  });
  const [pastConfigs, setPastConfigs] = useState<
    Array<{ selectedColumn: string; duplicateMode: DuplicateMode }>
  >([]);
  const [futureConfigs, setFutureConfigs] = useState<
    Array<{ selectedColumn: string; duplicateMode: DuplicateMode }>
  >([]);

  const cleaned = useMemo(
    () => cleanCsvRows(rows, headers, selectedColumn, duplicateMode),
    [duplicateMode, headers, rows, selectedColumn],
  );

  const previewRows = cleaned.rows.slice(0, PREVIEW_LIMIT);
  const isParsing = status === "parsing";
  const showEmailEnrichment =
    selectedColumn &&
    (selectedColumn.toLowerCase().includes("email") || cleaned.summary.generatedDomains > 0);

  useEffect(() => {
    if (typeof window === "undefined" || !selectedColumn) {
      return;
    }

    window.localStorage.setItem(
      "leadcleanr:csv-cleaner:preferred-column",
      selectedColumn,
    );
  }, [selectedColumn]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      "leadcleanr:csv-cleaner:duplicate-mode",
      duplicateMode,
    );
  }, [duplicateMode]);

  function resetState(nextFileName = "") {
    setFileName(nextFileName);
    setHeaders([]);
    setRows([]);
    setDetections([]);
    setSelectedColumn("");
    setDuplicateMode("selected");
    setWarning("");
    setPastConfigs([]);
    setFutureConfigs([]);
    setProgress({
      percentage: 0,
      rowsProcessed: 0,
    });
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const inspection = await inspectCsvFile(file);

    setPendingFile({
      name: file.name,
      sizeMb: file.size / (1024 * 1024),
      exceedsFreeLimit: file.size > MAX_CSV_FILE_SIZE,
      estimatedRows: inspection.estimatedRows,
      estimatedRowsWithinFreeLimit: inspection.estimatedRowsWithinFreeLimit,
    });

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
      setError(
        "The free CSV limit is 2 MB. Upgrade to Pro when you need larger file cleanup.",
      );
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

        const nextDetections = detectCsvColumns(result.headers, result.rows);
        const storedPreferredColumn =
          typeof window !== "undefined"
            ? window.localStorage.getItem("leadcleanr:csv-cleaner:preferred-column")
            : null;
        const storedDuplicateMode =
          typeof window !== "undefined"
            ? window.localStorage.getItem("leadcleanr:csv-cleaner:duplicate-mode")
            : null;
        setHeaders(result.headers);
        setRows(result.rows);
        setDetections(nextDetections);
        setSelectedColumn(
          storedPreferredColumn && result.headers.includes(storedPreferredColumn)
            ? storedPreferredColumn
            : pickDefaultColumn(result.headers, nextDetections),
        );
        if (isDuplicateMode(storedDuplicateMode)) {
          setDuplicateMode(storedDuplicateMode);
        }
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

  function loadDemoCsv() {
    const result = parseCsvText(DEMO_CSV);
    const nextDetections = detectCsvColumns(result.headers, result.rows);

    resetState("leadcleanr-demo.csv");
    setPendingFile({
      name: "leadcleanr-demo.csv",
      sizeMb: DEMO_CSV.length / (1024 * 1024),
      exceedsFreeLimit: false,
      estimatedRows: result.rows.length,
      estimatedRowsWithinFreeLimit: result.rows.length,
    });
    setError("");
    setHeaders(result.headers);
    setRows(result.rows);
    setDetections(nextDetections);
    setSelectedColumn(pickDefaultColumn(result.headers, nextDetections));
    setStatus("ready");

    if (result.warnings.length) {
      setWarning(buildWarningSummary(result.warnings));
    }

    trackToolEvent("csv-lead-cleaner", "load_demo");
  }

  function applyConfigChange(nextConfig: {
    selectedColumn: string;
    duplicateMode: DuplicateMode;
  }) {
    if (
      nextConfig.selectedColumn === selectedColumn &&
      nextConfig.duplicateMode === duplicateMode
    ) {
      return;
    }

    setPastConfigs((current) => [
      ...current,
      { selectedColumn, duplicateMode },
    ]);
    setFutureConfigs([]);
    setSelectedColumn(nextConfig.selectedColumn);
    setDuplicateMode(nextConfig.duplicateMode);
  }

  function undoConfigChange() {
    setPastConfigs((current) => {
      const previous = current.at(-1);
      if (!previous) {
        return current;
      }

      setFutureConfigs((future) => [
        { selectedColumn, duplicateMode },
        ...future,
      ]);
      setSelectedColumn(previous.selectedColumn);
      setDuplicateMode(previous.duplicateMode);

      return current.slice(0, -1);
    });
  }

  function redoConfigChange() {
    setFutureConfigs((current) => {
      const next = current[0];
      if (!next) {
        return current;
      }

      setPastConfigs((past) => [...past, { selectedColumn, duplicateMode }]);
      setSelectedColumn(next.selectedColumn);
      setDuplicateMode(next.duplicateMode);

      return current.slice(1);
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
  const recommendedDetection = pickBestDetection(detections, [
    "email",
    "phone",
    "domain",
    "url",
  ]);
  const selectedDetection = detections.find(
    (detection) => detection.header === selectedColumn,
  );
  const hasLoadedFile = headers.length > 0 && status === "ready";

  return (
    <section className="rounded-[2.2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(246,249,252,0.92))] shadow-[var(--shadow)]">
      <div className="grid gap-0 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="flex h-full flex-col p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:rgba(21,50,70,0.08)] text-[color:#153246]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                CSV Lead Cleaner
              </p>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                Upload, review, export
              </p>
            </div>
          </div>

          <label
            htmlFor="csv-upload"
            className="mt-5 flex min-h-[17rem] cursor-pointer flex-col items-center justify-center rounded-[1.8rem] border-2 border-dashed border-[color:rgba(184,106,25,0.34)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,247,237,0.94))] px-6 py-8 text-center transition hover:border-[color:var(--brand)] hover:shadow-[0_18px_36px_rgba(184,106,25,0.12)]"
          >
            {isParsing ? (
              <LoaderCircle className="h-8 w-8 animate-spin text-[color:var(--brand-strong)]" />
            ) : (
              <Upload className="h-8 w-8 text-[color:var(--brand-strong)]" />
            )}
            <span className="mt-4 text-lg font-semibold sm:text-xl">
              {isParsing ? "Parsing your CSV..." : "Upload CSV"}
            </span>
            <span className="mt-3 max-w-sm text-sm leading-6 text-[color:var(--muted)]">
              Drag a file here or click to choose one. Free supports up to 2 MB
              per CSV.
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

          <p className="mt-3 text-xs leading-6 text-[color:var(--muted)]">
            Core processing happens in your browser on this device. Optional
            analytics, error reporting, and saved workspace state can still run
            separately.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadDemoCsv}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/80 px-5 text-sm font-semibold transition hover:-translate-y-0.5"
            >
              <FlaskConical className="h-4 w-4" />
              Try sample CSV
            </button>
            {hasLoadedFile ? (
              <>
                <button
                  type="button"
                  onClick={undoConfigChange}
                  disabled={!pastConfigs.length}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/80 px-5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Undo2 className="h-4 w-4" />
                  Undo
                </button>
                <button
                  type="button"
                  onClick={redoConfigChange}
                  disabled={!futureConfigs.length}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/80 px-5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Redo2 className="h-4 w-4" />
                  Redo
                </button>
              </>
            ) : null}
          </div>

          {pendingFile ? <FileSizeNotice pendingFile={pendingFile} /> : null}

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

          {hasLoadedFile ? (
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
                    applyConfigChange({
                      selectedColumn: event.target.value,
                      duplicateMode,
                    });
                    trackToolEvent("csv-lead-cleaner", "change_column", {
                      column: event.target.value,
                    });
                  }}
                  disabled={!headers.length || isParsing}
                  className="mt-2 min-h-11 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--brand)]"
                >
                  {headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
                {selectedDetection ? (
                  <div className="mt-3 rounded-[1rem] border border-[color:rgba(15,118,110,0.14)] bg-[color:rgba(15,118,110,0.08)] px-3 py-3 text-sm">
                    <div className="flex items-center gap-2 font-medium text-[color:var(--foreground)]">
                      <ScanSearch className="h-4 w-4 text-[color:var(--accent)]" />
                      Detected as {prettyColumnType(selectedDetection.type)}
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      {selectedDetection.confidence}% confidence
                    </p>
                  </div>
                ) : null}
                {recommendedDetection &&
                recommendedDetection.header !== selectedColumn ? (
                  <button
                    type="button"
                    onClick={() =>
                      applyConfigChange({
                        selectedColumn: recommendedDetection.header,
                        duplicateMode,
                      })
                    }
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]"
                  >
                    Use suggested column: {recommendedDetection.header} (
                    {recommendedDetection.confidence}%)
                  </button>
                ) : null}
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
                    applyConfigChange({
                      selectedColumn,
                      duplicateMode: nextMode,
                    });
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
                    DUPLICATE_MODE_OPTIONS.find(
                      (option) => option.value === duplicateMode,
                    )?.description
                  }
                </p>
              </div>
            </div>
          ) : null}

          {error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
          {warning ? <InlineMessage tone="warning">{warning}</InlineMessage> : null}

          {hasLoadedFile ? (
            <>
              <div className="mt-5 rounded-[1.5rem] border border-[color:rgba(15,118,110,0.14)] bg-[color:rgba(15,118,110,0.08)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  What this now reports
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  Clean rows, duplicates removed, invalid and blank rows,
                  generated domains, business vs personal inboxes, and
                  role-based email counts when email data is present.
                </p>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-[color:rgba(16,37,52,0.1)] bg-[color:rgba(244,247,250,0.92)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:#38586b]">
                  Operation transparency
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--foreground)]">
                  {selectedColumn
                    ? `Current cleanup on "${selectedColumn}" will leave ${cleaned.summary.cleanRowsReady.toLocaleString()} rows ready for export, remove ${cleaned.summary.duplicatesRemoved.toLocaleString()} duplicates, and drop ${cleaned.summary.invalidRowsRemoved.toLocaleString()} invalid rows plus ${cleaned.summary.emptyRowsRemoved.toLocaleString()} blanks.`
                    : "Upload a CSV and choose a source column to see the expected cleanup effect before you export."}
                </p>
              </div>
            </>
          ) : null}

          <div className="mt-auto pt-5">
            <button
              type="button"
              onClick={() => {
                trackToolEvent("csv-lead-cleaner", "export_csv", {
                  row_count: cleaned.rows.length,
                  duplicate_mode: duplicateMode,
                });
                downloadCsvRecords(buildCleanFileName(fileName), cleaned.rows);
              }}
              disabled={!cleaned.rows.length}
              className="btn-primary inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export Clean CSV
            </button>
          </div>
        </div>

        <div className="border-t border-[color:var(--line)] xl:border-l xl:border-t-0">
          <div className="space-y-6 p-5 sm:p-7">
            <div className="rounded-[1.7rem] border border-[color:rgba(16,37,52,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,248,238,0.92))] p-5">
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

              <div className="mt-5 rounded-[1.7rem] border border-[color:rgba(15,118,110,0.14)] bg-[linear-gradient(180deg,rgba(15,118,110,0.1),rgba(255,255,255,0.96))] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  Clean rows ready
                </p>
                <p className="mt-3 font-display text-6xl font-semibold leading-none tabular-nums text-[color:var(--foreground)] sm:text-7xl">
                  {cleaned.summary.cleanRowsReady.toLocaleString()}
                </p>
                <p className="mt-3 max-w-lg text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                  This is the number that should feel safe enough to move into
                  the next system after cleanup.
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <StatCard label="Rows uploaded" value={cleaned.summary.totalRows} />
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
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
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

            <div className="rounded-[1.7rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 backdrop-blur">
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
                    <table className="min-w-[980px] w-full border-collapse text-left text-sm">
                      <thead className="sticky top-0 bg-[#f6efe5]">
                        <tr>
                          <th className="border-b border-[color:var(--line)] px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                            #
                          </th>
                          {previewHeaders.map((header) => (
                            <th
                              key={header}
                              className="border-b border-[color:var(--line)] px-4 py-3 font-semibold text-[color:var(--foreground)] whitespace-nowrap"
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

function pickDefaultColumn(
  headers: string[],
  detections: CsvColumnDetection[],
) {
  const recommendedDetection = pickBestDetection(detections, [
    "email",
    "phone",
    "domain",
    "url",
  ]);
  if (recommendedDetection) {
    return recommendedDetection.header;
  }

  return (
    headers.find((header) => header.toLowerCase().includes("email")) ??
    headers.find((header) => header.toLowerCase().includes("phone")) ??
    headers.find((header) => header.toLowerCase().includes("domain")) ??
    headers[0] ??
    ""
  );
}

function pickBestDetection(
  detections: CsvColumnDetection[],
  preferredTypes: Array<CsvColumnDetection["type"]>,
) {
  return detections
    .filter((detection) => preferredTypes.includes(detection.type))
    .sort((left, right) => right.confidence - left.confidence)[0];
}

function isDuplicateMode(value: string | null): value is DuplicateMode {
  return DUPLICATE_MODE_OPTIONS.some((option) => option.value === value);
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

function FileSizeNotice({
  pendingFile,
}: {
  pendingFile: {
    name: string;
    sizeMb: number;
    exceedsFreeLimit: boolean;
    estimatedRows: number | null;
    estimatedRowsWithinFreeLimit: number | null;
  };
}) {
  const toneClasses = pendingFile.exceedsFreeLimit
    ? "border-[color:rgba(217,119,6,0.2)] bg-[color:rgba(255,247,237,0.92)]"
    : "border-[color:rgba(15,118,110,0.18)] bg-[color:rgba(240,253,250,0.9)]";

  return (
    <div className={`mt-3 rounded-[1.3rem] border p-4 ${toneClasses}`}>
      <p className="text-sm font-semibold text-[color:var(--foreground)]">
        {pendingFile.name} · {pendingFile.sizeMb.toFixed(1)} MB
      </p>
      <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
        {pendingFile.exceedsFreeLimit
          ? `This file is over the 2 MB free limit. It looks like about ${formatRowEstimate(pendingFile.estimatedRows)} rows. Free typically fits around ${formatRowEstimate(pendingFile.estimatedRowsWithinFreeLimit)} rows of this density.`
          : `This file fits inside the free 2 MB limit and looks like about ${formatRowEstimate(pendingFile.estimatedRows)} rows for browser-side cleanup.`}
      </p>
    </div>
  );
}

function formatRowEstimate(value: number | null) {
  if (!value) {
    return "a few thousand";
  }

  return value.toLocaleString();
}

function prettyColumnType(type: CsvColumnDetection["type"]) {
  if (type === "url") {
    return "URL";
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
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
