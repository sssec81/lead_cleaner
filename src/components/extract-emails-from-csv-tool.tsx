"use client";

import {
  AlertCircle,
  Check,
  Clipboard,
  Download,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";

import { copyTextToClipboard } from "@/lib/clipboard";
import {
  type CsvParseProgress,
  type CsvRow,
  isLikelyCsvFile,
  MAX_CSV_FILE_SIZE,
  parseCsvFile,
} from "@/lib/csv";
import { downloadCsvFile, downloadTextFile } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";

type ExtractionSummary = {
  totalRows: number;
  blankRowsSkipped: number;
  invalidEmailsRemoved: number;
  duplicatesRemoved: number;
  cleanEmailsReady: number;
};

type UploadStatus = "idle" | "parsing" | "ready" | "error";

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const PREVIEW_LIMIT = 100;

export function ExtractEmailsFromCsvTool() {
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState<CsvParseProgress>({
    percentage: 0,
    rowsProcessed: 0,
  });

  const extracted = useMemo(
    () => extractEmailsFromCsvRows(rows, selectedColumn),
    [rows, selectedColumn],
  );

  function resetState(nextFileName = "") {
    setFileName(nextFileName);
    setHeaders([]);
    setRows([]);
    setSelectedColumn("");
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

    trackToolEvent("extract-emails-from-csv", "upload_started", {
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
      onProgress: (nextProgress) => {
        setProgress(nextProgress);
      },
      onComplete: (result) => {
        const nextHeaders = result.headers;
        const nextRows = result.rows;

        if (!nextHeaders.length) {
          resetState(file.name);
          setStatus("error");
          setError("We could not detect any CSV columns in that file.");
          trackToolEvent("extract-emails-from-csv", "upload_failed", {
            reason: "missing_headers",
          });
          return;
        }

        setHeaders(nextHeaders);
        setRows(nextRows);
        setSelectedColumn((current) =>
          current && nextHeaders.includes(current)
            ? current
            : pickDefaultEmailColumn(nextHeaders),
        );
        setStatus("ready");

        if (!nextRows.length) {
          setWarning(
            "We found the header row, but there are no data rows to extract from yet.",
          );
        } else if (result.warnings.length) {
          setWarning(buildWarningSummary(result.warnings));
        }

        trackToolEvent("extract-emails-from-csv", "upload_completed", {
          row_count: nextRows.length,
          warning_count: result.warnings.length,
        });
      },
      onError: (message) => {
        resetState(file.name);
        setStatus("error");
        setError(message);
        trackToolEvent("extract-emails-from-csv", "upload_failed", {
          reason: "parse_error",
        });
      },
    });
  }

  async function handleCopy() {
    if (!extracted.results.length) {
      return;
    }

    const didCopy = await copyTextToClipboard(extracted.results.join("\n"));

    if (!didCopy) {
      return;
    }

    trackToolEvent("extract-emails-from-csv", "copy_results", {
      result_count: extracted.results.length,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const isParsing = status === "parsing";

  return (
    <section className="grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.14)] text-[color:var(--brand-strong)]">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Extract emails from a CSV file
            </h2>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Upload a CSV, choose the email column, extract valid addresses,
              remove duplicates, and export the clean list.
            </p>
          </div>
        </div>

        <label
          htmlFor="csv-email-upload"
          className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-white/70 px-6 py-8 text-center transition hover:border-[color:var(--brand)] hover:bg-white"
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
            Up to 2 MB. Parsing stays in your browser for the MVP.
          </span>
          <input
            id="csv-email-upload"
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

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              htmlFor="email-column-select"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]"
            >
              Email Column
            </label>
            <select
              id="email-column-select"
              value={selectedColumn}
              onChange={(event) => {
                setSelectedColumn(event.target.value);
                trackToolEvent("extract-emails-from-csv", "change_column", {
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
        </div>

        {error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
        {warning ? <InlineMessage tone="warning">{warning}</InlineMessage> : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!extracted.results.length}
            className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            {copied ? "Copied" : "Copy emails"}
          </button>
          <button
            type="button"
            onClick={() => {
              trackToolEvent("extract-emails-from-csv", "download_txt", {
                result_count: extracted.results.length,
              });
              downloadTextFile(
                buildExportName(fileName, "txt"),
                extracted.results.join("\n"),
              );
            }}
            disabled={!extracted.results.length}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/70 px-5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            Download TXT
          </button>
          <button
            type="button"
            onClick={() => {
              trackToolEvent("extract-emails-from-csv", "download_csv", {
                result_count: extracted.results.length,
              });
              downloadCsvFile(
                buildExportName(fileName, "csv"),
                extracted.results,
                "email",
              );
            }}
            disabled={!extracted.results.length}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/70 px-5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-5 shadow-[var(--shadow)] sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Extraction stats
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatCard label="Rows scanned" value={extracted.summary.totalRows} />
            <StatCard
              label="Blank rows skipped"
              value={extracted.summary.blankRowsSkipped}
            />
            <StatCard
              label="Invalid emails removed"
              value={extracted.summary.invalidEmailsRemoved}
            />
            <StatCard
              label="Duplicates removed"
              value={extracted.summary.duplicatesRemoved}
            />
            <StatCard
              label="Clean emails ready"
              value={extracted.summary.cleanEmailsReady}
              accent
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold">
                Preview extracted emails
              </h3>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                Showing up to {PREVIEW_LIMIT} clean emails after extraction.
              </p>
            </div>
            <span className="rounded-full bg-[color:rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
              Preview
            </span>
          </div>

          <div className="mt-4 min-h-[22rem] rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-white/70 p-4">
            {extracted.results.length ? (
              <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-7 text-[color:var(--foreground)]">
                {extracted.results.slice(0, PREVIEW_LIMIT).join("\n")}
              </pre>
            ) : (
              <EmptyState
                title={
                  status === "ready" && headers.length
                    ? "No clean emails found"
                    : "Upload a CSV to start"
                }
                description={
                  status === "ready" && headers.length
                    ? "This file uploaded successfully, but the chosen column did not contain any valid email addresses yet."
                    : "Upload a CSV and choose a column to preview the extracted email list here."
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function extractEmailsFromCsvRows(
  rows: CsvRow[],
  selectedColumn: string,
): { results: string[]; summary: ExtractionSummary } {
  if (!selectedColumn) {
    return {
      results: [],
      summary: {
        totalRows: rows.length,
        blankRowsSkipped: 0,
        invalidEmailsRemoved: 0,
        duplicatesRemoved: 0,
        cleanEmailsReady: 0,
      },
    };
  }

  let blankRowsSkipped = 0;
  let invalidEmailsRemoved = 0;
  let duplicatesRemoved = 0;
  const seen = new Set<string>();
  const cleanEmails: string[] = [];

  rows.forEach((row) => {
    const rawValue = String(row[selectedColumn] ?? "").trim();

    if (!rawValue) {
      blankRowsSkipped += 1;
      return;
    }

    const normalized = rawValue.toLowerCase();

    if (!EMAIL_REGEX.test(normalized)) {
      invalidEmailsRemoved += 1;
      return;
    }

    if (seen.has(normalized)) {
      duplicatesRemoved += 1;
      return;
    }

    seen.add(normalized);
    cleanEmails.push(normalized);
  });

  return {
    results: cleanEmails,
    summary: {
      totalRows: rows.length,
      blankRowsSkipped,
      invalidEmailsRemoved,
      duplicatesRemoved,
      cleanEmailsReady: cleanEmails.length,
    },
  };
}

function pickDefaultEmailColumn(headers: string[]) {
  return (
    headers.find((header) => header.toLowerCase().includes("email")) ??
    headers[0] ??
    ""
  );
}

function buildExportName(fileName: string, extension: "txt" | "csv") {
  const baseName = fileName.replace(/\.csv$/i, "") || "leadcleanr-emails";
  return `${baseName}-emails.${extension}`;
}

function buildWarningSummary(warnings: string[]) {
  const preview = warnings.slice(0, 2).join(" ");
  const suffix =
    warnings.length > 2 ? ` ${warnings.length - 2} more parsing issues found.` : "";
  return `We imported the readable rows, but found CSV formatting issues. ${preview}${suffix}`;
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
    <div>
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
          : "border-[color:var(--line)] bg-white/75"
      }`}
    >
      <div className="text-sm text-[color:var(--muted)]">{label}</div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
