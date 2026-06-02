"use client";

import { Download, FileSpreadsheet, Upload } from "lucide-react";
import Papa from "papaparse";
import { useMemo, useState } from "react";

import { downloadCsvContent } from "@/lib/export";
import { normalizeUrlValue } from "@/lib/text-tools";

type CsvRow = Record<string, string>;

type CleaningSummary = {
  totalRows: number;
  emptyRowsRemoved: number;
  invalidRowsRemoved: number;
  duplicatesRemoved: number;
  cleanRowsReady: number;
};

const PREVIEW_LIMIT = 100;
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export function CsvLeadCleanerTool() {
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [error, setError] = useState("");

  const cleaned = useMemo(
    () => cleanCsvRows(rows, headers, selectedColumn),
    [headers, rows, selectedColumn],
  );

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Please upload a CSV file smaller than 2 MB.");
      setFileName("");
      setHeaders([]);
      setRows([]);
      setSelectedColumn("");
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
            : pickDefaultColumn(metaFields),
        );

        if (!metaFields.length) {
          setError("We could not detect any CSV columns in that file.");
        }
      },
      error: () => {
        setError("We could not parse that CSV file. Please try another file.");
        setHeaders([]);
        setRows([]);
        setSelectedColumn("");
      },
    });
  }

  const previewRows = cleaned.rows.slice(0, PREVIEW_LIMIT);

  return (
    <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-start">
      <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.14)] text-[color:var(--brand-strong)]">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
              Browser-first cleanup
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold sm:text-2xl">
              Clean your CSV
            </h2>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Upload a CSV, pick a column, remove duplicates and blanks, then
              export the cleaned file.
            </p>
          </div>
        </div>

        <label
          htmlFor="csv-upload"
          className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-white/70 px-6 py-6 text-center transition hover:border-[color:var(--brand)] hover:bg-white"
        >
          <Upload className="h-6 w-6 text-[color:var(--brand-strong)]" />
          <span className="mt-3 text-base font-semibold">
            Upload a CSV file
          </span>
          <span className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Up to 2 MB. Parsing stays in your browser for the MVP.
          </span>
          <input
            id="csv-upload"
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={handleFileUpload}
          />
        </label>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
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
              Clean By
            </label>
            <select
              id="column-select"
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

        <div className="mt-5 rounded-[1.5rem] border border-[color:rgba(15,118,110,0.14)] bg-[color:rgba(15,118,110,0.08)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
            What this does
          </p>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            The cleaner removes fully empty rows, validates the selected
            column, deduplicates matching entries, and keeps the remaining row
            data intact for export.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              downloadCsvContent(
                buildCleanFileName(fileName),
                Papa.unparse(cleaned.rows),
              )
            }
            disabled={!cleaned.rows.length}
            className="btn-primary inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export Clean CSV
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-5 shadow-[var(--shadow)] sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Cleaning stats
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <StatCard label="Rows scanned" value={cleaned.summary.totalRows} />
            <StatCard
              label="Empty rows removed"
              value={cleaned.summary.emptyRowsRemoved}
            />
            <StatCard
              label="Invalid rows removed"
              value={cleaned.summary.invalidRowsRemoved}
            />
            <StatCard
              label="Duplicates removed"
              value={cleaned.summary.duplicatesRemoved}
            />
            <StatCard
              label="Clean rows ready"
              value={cleaned.summary.cleanRowsReady}
              accent
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
            {headers.length && previewRows.length ? (
              <div className="max-h-[38rem] overflow-auto">
                <table className="min-w-[860px] border-collapse text-left text-sm">
                  <thead className="sticky top-0 bg-[#f6efe5]">
                    <tr>
                      <th className="border-b border-[color:var(--line)] px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                        #
                      </th>
                      {headers.map((header) => (
                        <th
                          key={header}
                          className="border-b border-[color:var(--line)] px-4 py-3 font-semibold text-[color:var(--foreground)]"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, index) => (
                      <tr key={`${index}-${selectedColumn}-${row[selectedColumn] ?? ""}`}>
                        <td className="border-b border-[color:rgba(17,36,51,0.08)] px-3 py-3 align-top text-xs font-semibold text-[color:var(--muted)]">
                          {index + 1}
                        </td>
                        {headers.map((header) => (
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
              <div className="p-6 text-sm leading-7 text-[color:var(--muted)]">
                Upload a CSV to preview rows and see the cleaned output here.
              </div>
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
): { rows: CsvRow[]; summary: CleaningSummary } {
  if (!headers.length || !selectedColumn) {
    return {
      rows: [],
      summary: {
        totalRows: rows.length,
        emptyRowsRemoved: 0,
        invalidRowsRemoved: 0,
        duplicatesRemoved: 0,
        cleanRowsReady: 0,
      },
    };
  }

  const nonEmptyRows = rows.filter((row) =>
    headers.some((header) => String(row[header] ?? "").trim() !== ""),
  );

  const emptyRowsRemoved = rows.length - nonEmptyRows.length;
  let invalidRowsRemoved = 0;
  let duplicatesRemoved = 0;
  const seen = new Set<string>();
  const cleanedRows: CsvRow[] = [];

  nonEmptyRows.forEach((row) => {
    const normalizedRow = normalizeCsvRow(row, headers, selectedColumn);
    const key = normalizedRow[selectedColumn];

    if (!key) {
      invalidRowsRemoved += 1;
      return;
    }

    if (seen.has(key)) {
      duplicatesRemoved += 1;
      return;
    }

    seen.add(key);
    cleanedRows.push(normalizedRow);
  });

  return {
    rows: cleanedRows,
    summary: {
      totalRows: rows.length,
      emptyRowsRemoved,
      invalidRowsRemoved,
      duplicatesRemoved,
      cleanRowsReady: cleanedRows.length,
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
    const nextValue = value.toLowerCase();
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(nextValue)
      ? nextValue
      : "";
  }

  if (normalizedColumn.includes("phone") || normalizedColumn.includes("tel")) {
    const trimmed = value.trim();
    const hasLeadingPlus = trimmed.startsWith("+");
    const digitsOnly = trimmed.replace(/\D/g, "");

    if (digitsOnly.length < 7) {
      return "";
    }

    return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
  }

  if (
    normalizedColumn.includes("website") ||
    normalizedColumn.includes("url") ||
    normalizedColumn.includes("link")
  ) {
    return normalizeUrlValue(value) ?? "";
  }

  return value.trim();
}

function pickDefaultColumn(headers: string[]) {
  return (
    headers.find((header) => header.toLowerCase().includes("email")) ??
    headers.find((header) => header.toLowerCase().includes("phone")) ??
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
