"use client";

import { AlertTriangle, CheckCircle2, Download, RotateCcw, Upload } from "lucide-react";
import { useState } from "react";

import { buildImportRepairReport, type ImportRepairReport } from "@/lib/crm-import-repair";
import type { CrmExportFormat } from "@/lib/crm-export";
import { parseCsvText } from "@/lib/csv";
import { downloadCsvRecords } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";

type CrmImportRepairPanelProps = {
  format: Exclude<CrmExportFormat, "clean_csv">;
  sourceRows: Array<Record<string, unknown>>;
  fileName: string;
};

export function CrmImportRepairPanel({
  format,
  sourceRows,
  fileName,
}: CrmImportRepairPanelProps) {
  const [report, setReport] = useState<ImportRepairReport | null>(null);
  const [error, setError] = useState("");
  const [uploadedName, setUploadedName] = useState("");

  async function handleErrorFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setReport(null);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Choose the CSV error file downloaded from your CRM.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("The CRM error file must be 5 MB or smaller.");
      return;
    }

    try {
      const parsed = parseCsvText(await file.text());
      if (!parsed.headers.length || !parsed.rows.length) {
        setError("No error rows were found in that CSV.");
        return;
      }
      const nextReport = buildImportRepairReport(sourceRows, parsed.headers, parsed.rows);
      setUploadedName(file.name);
      setReport(nextReport);
      trackToolEvent("csv-lead-cleaner", "analyze_crm_error_file", {
        export_format: format,
        error_count: nextReport.totalErrors,
        matched_count: nextReport.matchedErrors,
      });
    } catch {
      setError("That CRM error file could not be parsed. Export it as CSV and try again.");
    }
  }

  function reset() {
    setReport(null);
    setError("");
    setUploadedName("");
  }

  return (
    <details className="group border-t border-[var(--lc-border)]">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-xs font-semibold text-[var(--lc-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lc-accent)]">
        <span className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-[var(--lc-accent)]" aria-hidden="true" />
          Repair a failed {formatLabel(format)} import
        </span>
        <span className="text-[11px] font-normal text-[var(--lc-muted)]">Upload CRM error CSV</span>
      </summary>

      <div className="border-t border-[var(--lc-border)] bg-[var(--lc-bg)] p-3 sm:p-4">
        {!report ? (
          <div>
            <label
              htmlFor={`crm-error-file-${format}`}
              className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--lc-border-mid)] bg-white px-4 text-sm font-semibold text-[var(--lc-ink)] transition-colors hover:border-[var(--lc-accent)] hover:bg-[var(--lc-accent-bg)]"
            >
              <Upload className="h-4 w-4 text-[var(--lc-accent)]" aria-hidden="true" />
              Choose {formatLabel(format)} error CSV
              <input
                id={`crm-error-file-${format}`}
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(event) => void handleErrorFile(event.target.files?.[0])}
              />
            </label>
            <p className="mt-2 text-[11px] leading-5 text-[var(--lc-muted)]">
              LeadCleanr matches failed records locally by identity or row number. Nothing is uploaded.
            </p>
            {error ? <p role="alert" className="mt-2 text-xs font-medium text-[var(--lc-danger)]">{error}</p> : null}
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-[var(--lc-ink)]">
                  {report.unmatchedErrors ? (
                    <AlertTriangle className="h-4 w-4 text-[var(--lc-warning)]" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-[var(--lc-green)]" aria-hidden="true" />
                  )}
                  {report.matchedErrors} of {report.totalErrors} failed rows matched
                </p>
                <p className="mt-1 text-[11px] text-[var(--lc-muted)]">
                  {uploadedName}{report.unmatchedErrors ? ` · ${report.unmatchedErrors} need manual matching` : " · Ready for repair"}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={reset} className="lc-button-secondary min-h-11 px-4 text-xs font-semibold">
                  Replace file
                </button>
                <button
                  type="button"
                  disabled={!report.retryRows.length}
                  onClick={() => {
                    downloadCsvRecords(buildRepairFileName(fileName, format), report.retryRows);
                    trackToolEvent("csv-lead-cleaner", "download_crm_repair_rows", {
                      export_format: format,
                      row_count: report.retryRows.length,
                    });
                  }}
                  className="lc-button-primary min-h-11 px-4 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download repair worksheet
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {report.matches.slice(0, 6).map((match) => (
                <div key={match.errorRowIndex} className="rounded-lg border border-[var(--lc-border)] bg-white p-3">
                  <p className="text-xs font-semibold text-[var(--lc-ink)]">
                    Error row {match.errorRowIndex + 1} · {match.matchedBy === "unmatched" ? "Not matched" : `Matched by ${match.matchedBy.replace("_", " ")}`}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[var(--lc-muted)]">{match.error}</p>
                  <p className="mt-1 text-[11px] leading-5 text-[var(--lc-accent)]">{match.hint}</p>
                </div>
              ))}
            </div>
            {report.matches.length > 6 ? (
              <p className="mt-2 text-[11px] text-[var(--lc-muted)]">Showing 6 of {report.matches.length} errors. The worksheet includes every matched row.</p>
            ) : null}
          </div>
        )}
      </div>
    </details>
  );
}

function formatLabel(format: Exclude<CrmExportFormat, "clean_csv">) {
  return format === "salesforce" ? "Salesforce" : format === "hubspot" ? "HubSpot" : format === "pipedrive" ? "Pipedrive" : "Apollo";
}

function buildRepairFileName(fileName: string, format: Exclude<CrmExportFormat, "clean_csv">) {
  return `${(fileName || "leadcleanr").replace(/\.csv$/i, "")}-${format}-repair.csv`;
}
