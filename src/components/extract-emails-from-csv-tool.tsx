"use client";

import { Check, Clipboard, Download, FileSpreadsheet, FileText, Upload } from "lucide-react";
import Papa from "papaparse";
import { useMemo, useState } from "react";

import { copyTextToClipboard } from "@/lib/clipboard";
import { downloadCsvFile, downloadTextFile } from "@/lib/export";

type CsvRow = Record<string, string>;

type ExtractionSummary = {
  totalRows: number;
  blankRowsSkipped: number;
  invalidEmailsRemoved: number;
  duplicatesRemoved: number;
  cleanEmailsReady: number;
};

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const PREVIEW_LIMIT = 100;
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export function ExtractEmailsFromCsvTool() {
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const extracted = useMemo(
    () => extractEmailsFromCsvRows(rows, selectedColumn),
    [rows, selectedColumn],
  );

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      resetState();
      setError("Please upload a CSV file smaller than 2 MB.");
      return;
    }

    setError("");
    setFileName(file.name);

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: false,
      complete: (result) => {
        const metaFields = (result.meta.fields ?? [])
          .map((field) => field.trim())
          .filter(Boolean);

        const normalizedRows = (result.data ?? []).map((row) => {
          const normalizedRow: CsvRow = {};

          metaFields.forEach((field) => {
            normalizedRow[field] = String(row[field] ?? "").trim();
          });

          return normalizedRow;
        });

        setHeaders(metaFields);
        setRows(normalizedRows);
        setSelectedColumn((current) =>
          current && metaFields.includes(current)
            ? current
            : pickDefaultEmailColumn(metaFields),
        );

        if (!metaFields.length) {
          setError("We could not detect any CSV columns in that file.");
        }
      },
      error: () => {
        resetState();
        setError("We could not parse that CSV file. Please try another file.");
      },
    });
  }

  function resetState() {
    setFileName("");
    setHeaders([]);
    setRows([]);
    setSelectedColumn("");
  }

  async function handleCopy() {
    if (!extracted.results.length) {
      return;
    }

    const didCopy = await copyTextToClipboard(extracted.results.join("\n"));

    if (!didCopy) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

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
          <Upload className="h-6 w-6 text-[color:var(--brand-strong)]" />
          <span className="mt-3 text-base font-semibold">
            Upload a CSV file
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
          />
        </label>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
              File
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">
              {fileName || "No CSV uploaded yet"}
            </p>
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
              onChange={(event) => setSelectedColumn(event.target.value)}
              disabled={!headers.length}
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

        {error ? (
          <p className="mt-4 rounded-xl border border-[color:rgba(185,28,28,0.18)] bg-[color:rgba(254,242,242,0.9)] px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

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
            onClick={() =>
              downloadTextFile(
                buildExportName(fileName, "txt"),
                extracted.results.join("\n"),
              )
            }
            disabled={!extracted.results.length}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/70 px-5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            Download TXT
          </button>
          <button
            type="button"
            onClick={() =>
              downloadCsvFile(
                buildExportName(fileName, "csv"),
                extracted.results,
                "email",
              )
            }
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
              <p className="text-sm leading-7 text-[color:var(--muted)]">
                Upload a CSV and choose a column to preview the extracted email
                list here.
              </p>
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
