"use client";

import { AlertTriangle, CheckCircle2, ChevronDown, Download, FileText, Workflow } from "lucide-react";
import { useMemo, useState } from "react";

import {
  buildCrmExport,
  buildCrmExportFileName,
  type CrmExportFormat,
  type CrmFieldOverrides,
  CRM_EXPORT_FORMAT_OPTIONS,
} from "@/lib/crm-export";
import {
  buildCleanupAuditFileName,
  buildCleanupAuditReport,
} from "@/lib/cleanup-audit-report";
import type { CleaningSummary, DuplicateMode, EmailFilterMode } from "@/lib/csv-cleaner";
import { downloadCsvRecords, downloadTextFile } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";

type CrmExportControlsProps = {
  rows: Array<Record<string, unknown>>;
  sourceHeaders: string[];
  fileName: string;
  duplicateMode: DuplicateMode;
  selectedColumn: string;
  emailFilter: EmailFilterMode;
  summary: CleaningSummary;
};

export function CrmExportControls({
  rows,
  sourceHeaders,
  fileName,
  duplicateMode,
  selectedColumn,
  emailFilter,
  summary,
}: CrmExportControlsProps) {
  const [format, setFormat] = useState<CrmExportFormat>("clean_csv");
  const [overridesByFormat, setOverridesByFormat] = useState<
    Partial<Record<Exclude<CrmExportFormat, "clean_csv">, CrmFieldOverrides>>
  >({});
  const exportReady = rows.length > 0;
  const crmExport = useMemo(
    () =>
      format === "clean_csv"
        ? null
        : buildCrmExport(format, sourceHeaders, rows, overridesByFormat[format] ?? {}),
    [format, overridesByFormat, rows, sourceHeaders],
  );
  const selectedOption = CRM_EXPORT_FORMAT_OPTIONS.find(
    (option) => option.value === format,
  );
  const canDownload =
    exportReady && (format === "clean_csv" || Boolean(crmExport?.mappedFieldCount));
  const activeOverrides = format === "clean_csv" ? {} : overridesByFormat[format] ?? {};

  function updateFieldOverride(targetHeader: string, value: string) {
    if (format === "clean_csv") return;
    setOverridesByFormat((current) => {
      const nextFormatOverrides = { ...(current[format] ?? {}) };
      if (value === "__auto__") delete nextFormatOverrides[targetHeader];
      else nextFormatOverrides[targetHeader] = value === "__skip__" ? "" : value;
      return { ...current, [format]: nextFormatOverrides };
    });
  }

  function downloadExport() {
    if (!canDownload) return;

    const isCleanCsv = format === "clean_csv";
    const exportRows = isCleanCsv ? rows : crmExport?.rows ?? [];
    const exportFileName = isCleanCsv
      ? buildCleanFileName(fileName)
      : buildCrmExportFileName(fileName, format);

    trackToolEvent("csv-lead-cleaner", "export_csv", {
      row_count_bucket: getRowCountBucket(rows.length),
      duplicate_mode: duplicateMode,
      export_format: format,
      mapped_field_count: crmExport?.mappedFieldCount ?? sourceHeaders.length,
      missing_required_count: crmExport?.missingRequiredFields.length ?? 0,
    });
    downloadCsvRecords(exportFileName, exportRows);
  }

  return (
    <section aria-labelledby="export-format-title" className="w-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <label
            id="export-format-title"
            htmlFor="crm-export-format"
            className="mb-1 block text-[12px] font-medium text-[var(--lc-muted)]"
          >
            Export format
          </label>
          <select
            id="crm-export-format"
            value={format}
            onChange={(event) => {
              const nextFormat = event.target.value as CrmExportFormat;
              setFormat(nextFormat);
              trackToolEvent("csv-lead-cleaner", "change_export_format", {
                export_format: nextFormat,
              });
            }}
            className="lc-select min-h-11 w-full lg:max-w-sm"
          >
            {CRM_EXPORT_FORMAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--lc-muted)]">
            {selectedOption?.description} Export creation stays in your browser.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <button
            type="button"
            onClick={() => {
              downloadTextFile(
                buildCleanupAuditFileName(fileName),
                buildCleanupAuditReport({ fileName, selectedColumn, duplicateMode, emailFilter, summary }),
              );
              trackToolEvent("csv-lead-cleaner", "export_cleanup_audit");
            }}
            disabled={!exportReady}
            className="lc-button-secondary min-h-11 w-full gap-2 px-4 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Audit report
          </button>
          <button
            type="button"
            onClick={downloadExport}
            disabled={!canDownload}
            className="lc-button-primary min-h-11 w-full gap-2 px-6 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {format === "clean_csv" ? "Export clean CSV" : `Export for ${selectedOption?.label}`}
          </button>
        </div>
      </div>

      {crmExport ? (
        <div className="mt-4 rounded-xl border border-[var(--lc-border)] bg-white">
          <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <Workflow className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lc-accent)]" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-[var(--lc-ink)]">
                  {crmExport.mappedFieldCount} fields mapped automatically
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--lc-muted)]">
                  Only mapped columns are included in this CRM export. Review the mapping during import.
                </p>
              </div>
            </div>
            {crmExport.missingRequiredFields.length ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                {crmExport.missingRequiredFields.length} required field missing
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lc-green-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--lc-green)]">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Mapping ready
              </span>
            )}
          </div>

          {crmExport.missingRequiredFields.length ? (
            <div role="status" className="border-t border-amber-100 bg-amber-50/70 px-3 py-2.5 text-xs leading-relaxed text-amber-950">
              Add {formatList(crmExport.missingRequiredFields)} before importing. You can still export and complete those fields in your spreadsheet.
            </div>
          ) : null}

          <details className="group border-t border-[var(--lc-border)]">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-xs font-semibold text-[var(--lc-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lc-accent)]">
              Review field mapping
              <ChevronDown className="h-4 w-4 text-[var(--lc-muted)] transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
            </summary>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--lc-border)] bg-[var(--lc-bg)] px-3 py-2">
              <p className="text-[11px] text-[var(--lc-muted)]">Change any automatic match before downloading.</p>
              {Object.keys(activeOverrides).length ? (
                <button
                  type="button"
                  onClick={() => {
                    if (format === "clean_csv") return;
                    setOverridesByFormat((current) => ({ ...current, [format]: {} }));
                  }}
                  className="lc-button-quiet min-h-11 shrink-0 px-3 text-xs font-semibold"
                >
                  Reset mapping
                </button>
              ) : null}
            </div>
            <div className="grid gap-px border-t border-[var(--lc-border)] bg-[var(--lc-border)] sm:grid-cols-2 xl:grid-cols-3">
              {crmExport.mappings.map((mapping) => (
                <div key={mapping.targetHeader} className="min-w-0 bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-[var(--lc-ink)]" title={mapping.targetHeader}>
                      {mapping.targetHeader}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        mapping.status === "missing"
                          ? "bg-[var(--lc-bg)] text-[var(--lc-muted)]"
                          : mapping.status === "derived"
                            ? "bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]"
                            : "bg-[var(--lc-green-bg)] text-[var(--lc-green)]"
                      }`}
                    >
                      {mapping.status === "missing" ? "Missing" : mapping.status === "derived" ? "Derived" : "Mapped"}
                    </span>
                  </div>
                  <label htmlFor={`crm-map-${format}-${slugify(mapping.targetHeader)}`} className="sr-only">
                    Source column for {mapping.targetHeader}
                  </label>
                  <select
                    id={`crm-map-${format}-${slugify(mapping.targetHeader)}`}
                    value={Object.hasOwn(activeOverrides, mapping.targetHeader)
                      ? activeOverrides[mapping.targetHeader] || "__skip__"
                      : "__auto__"}
                    onChange={(event) => updateFieldOverride(mapping.targetHeader, event.target.value)}
                    className="lc-select mt-2 min-h-11 w-full text-xs"
                  >
                    <option value="__auto__">Auto: {mapping.sourceLabel}</option>
                    <option value="__skip__">Do not export</option>
                    {sourceHeaders.map((header) => <option key={header} value={header}>{header}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </details>
        </div>
      ) : null}
    </section>
  );
}

function buildCleanFileName(fileName: string): string {
  if (!fileName) return "leadcleanr-clean.csv";
  return fileName.toLowerCase().endsWith(".csv")
    ? fileName.replace(/\.csv$/i, "-clean.csv")
    : `${fileName}-clean.csv`;
}

function getRowCountBucket(count: number): string {
  if (count < 100) return "0-100";
  if (count < 500) return "100-500";
  if (count < 1000) return "500-1k";
  if (count < 5000) return "1k-5k";
  if (count < 10000) return "5k-10k";
  if (count < 50000) return "10k-50k";
  return "50k+";
}

function formatList(items: string[]): string {
  if (items.length < 2) return items[0] ?? "the required fields";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
