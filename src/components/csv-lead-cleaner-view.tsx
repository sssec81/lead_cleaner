"use client";

import {
  AlertCircle,
  AlertTriangle,
  Check,
  FileSpreadsheet,
  LoaderCircle,
  Redo2,
  ShieldCheck,
  Sparkles,
  Undo2,
  Upload,
} from "lucide-react";
import type { ChangeEvent, KeyboardEvent } from "react";

import { CleanupPresetControls } from "@/components/cleanup-preset-controls";
import { CrmExportControls } from "@/components/crm-export-controls";
import type { CleanupPresetRules } from "@/lib/cleanup-presets";
import type {
  CleaningSummary,
  DuplicateMode,
  EmailFilterMode,
  PreviewRow,
  RemovalReason,
} from "@/lib/csv-cleaner";
import type { CsvColumnDetection, CsvParseProgress } from "@/lib/csv";
import {
  CRM_EXPORT_FORMAT_OPTIONS,
  type CrmExportFormat,
  type CrmFieldOverrides,
} from "@/lib/crm-export";
import { FREE_CSV_LIMIT_MB } from "@/lib/product-config";
import { trackToolEvent } from "@/lib/telemetry";

export type PreviewMode = "clean" | "removed" | "invalid";

export type PendingCsvFile = {
  name: string;
  sizeMb: number;
  exceedsFreeLimit: boolean;
  estimatedRows: number | null;
  estimatedRowsWithinFreeLimit: number | null;
};

type ConfigChange = {
  selectedColumn: string;
  duplicateMode: DuplicateMode;
  emailFilter?: EmailFilterMode;
};

const DUPLICATE_MODE_OPTIONS: Array<{
  value: DuplicateMode;
  label: string;
}> = [
  { value: "selected", label: "Selected column" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "domain", label: "Domain" },
  { value: "entire_row", label: "Entire row" },
];

export function CsvCleanerUploadPanel({
  crmFormat,
  isParsing,
  progress,
  error,
  pendingFile,
  onCrmFormatChange,
  onFileUpload,
  onLoadDemo,
}: {
  crmFormat: CrmExportFormat;
  isParsing: boolean;
  progress: CsvParseProgress;
  error: string;
  pendingFile: PendingCsvFile | null;
  onCrmFormatChange: (format: CrmExportFormat) => void;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onLoadDemo: () => void;
}) {
  return (
    <div className="lc-workspace-shell flex flex-col items-center justify-center p-5 sm:p-8 lg:p-10">
      <div className="mb-6 w-full max-w-4xl">
        <CrmDestinationPicker value={crmFormat} onChange={onCrmFormatChange} />
      </div>
      <label
        htmlFor="csv-upload"
        className={`group relative flex w-full max-w-2xl cursor-pointer flex-col items-center justify-center rounded-[var(--radius-panel)] border border-dashed border-[var(--lc-border-mid)] bg-[var(--lc-surface-subtle)] px-5 py-10 text-center transition-all hover:border-[var(--lc-accent)] hover:bg-[var(--lc-accent-bg)] sm:px-8 sm:py-12 ${
          isParsing ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        <input
          id="csv-upload"
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={onFileUpload}
          disabled={isParsing}
        />

        <span className="lc-icon-tile mb-4 h-12 w-12 rounded-xl">
          <Upload className="h-5 w-5 text-[var(--lc-accent)]" aria-hidden="true" />
        </span>
        <p className="mb-1 text-[15px] font-semibold text-[var(--lc-ink)]">
          {crmFormat === "clean_csv"
            ? "Drop your messy lead CSV"
            : `Drop the CSV you want to import into ${crmFormatLabel(crmFormat)}`}
        </p>
        <p className="mb-5 text-[13px] text-[var(--lc-muted)]">
          {crmFormat === "clean_csv"
            ? "We'll detect email, phone, URL, and domain columns automatically."
            : `We'll clean, map, and run row-level ${crmFormatLabel(crmFormat)} preflight checks locally.`}
        </p>

        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {isParsing ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin text-[var(--lc-muted)]" aria-hidden="true" />
              <span className="text-sm font-medium text-[var(--lc-muted)]">
                Parsing locally… {Math.round(progress.percentage)}%
              </span>
            </>
          ) : (
            <>
              <span className="lc-button-primary">Browse CSV</span>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onLoadDemo();
                }}
                className="lc-button-secondary"
              >
                Try sample CSV
              </button>
            </>
          )}
        </div>
      </label>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 font-sans text-[11px] text-[var(--lc-muted)]">
        <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Processed locally</span>
        <span className="text-black/10" aria-hidden="true">·</span>
        <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Browser-only</span>
        <span className="text-black/10" aria-hidden="true">·</span>
        <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Max {FREE_CSV_LIMIT_MB} MB file</span>
      </div>

      {error ? (
        <div role="alert" className="mt-5 w-full max-w-xl rounded-xl border border-red-100 bg-red-50/50 p-4 text-left">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lc-danger)]" aria-hidden="true" />
            <div>
              <h4 className="text-xs font-semibold text-[var(--lc-ink)]">Upload failed</h4>
              <p className="mt-0.5 text-xs text-[var(--lc-muted)]">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {pendingFile ? (
        <div className="mt-5 w-full max-w-xl">
          <FileSizeNotice pendingFile={pendingFile} />
        </div>
      ) : null}
    </div>
  );
}

export function CsvCleanerWorkspaceView({
  fileName,
  headers,
  detections,
  selectedColumn,
  duplicateMode,
  emailFilter,
  showEmailEnrichment,
  toastVisible,
  canUndo,
  canRedo,
  summary,
  isCleaning,
  workspaceWarning,
  previewMode,
  availablePreviewModes,
  previewLabel,
  previewDescription,
  reportHeaders,
  visiblePreviewRows,
  cleanRows,
  previewHeaders,
  crmFormat,
  activeCrmOverrides,
  onReplace,
  onApplyConfigChange,
  onUndo,
  onRedo,
  onPreviewModeChange,
  onApplySavedWorkflow,
  onCrmFormatChange,
  onCrmOverridesChange,
}: {
  fileName: string;
  headers: string[];
  detections: CsvColumnDetection[];
  selectedColumn: string;
  duplicateMode: DuplicateMode;
  emailFilter: EmailFilterMode;
  showEmailEnrichment: boolean;
  toastVisible: boolean;
  canUndo: boolean;
  canRedo: boolean;
  summary: CleaningSummary;
  isCleaning: boolean;
  workspaceWarning: string;
  previewMode: PreviewMode;
  availablePreviewModes: Array<{ mode: PreviewMode; label: string }>;
  previewLabel: string;
  previewDescription: string;
  reportHeaders: string[];
  visiblePreviewRows: Array<PreviewRow & { leadcleanr_reason?: RemovalReason }>;
  cleanRows: PreviewRow[];
  previewHeaders: string[];
  crmFormat: CrmExportFormat;
  activeCrmOverrides: CrmFieldOverrides;
  onReplace: () => void;
  onApplyConfigChange: (config: ConfigChange) => void;
  onUndo: () => void;
  onRedo: () => void;
  onPreviewModeChange: (mode: PreviewMode) => void;
  onApplySavedWorkflow: (rules: CleanupPresetRules) => void;
  onCrmFormatChange: (format: CrmExportFormat) => void;
  onCrmOverridesChange: (overrides: CrmFieldOverrides) => void;
}) {
  function handlePreviewTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    mode: PreviewMode,
  ) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    const currentIndex = availablePreviewModes.findIndex((item) => item.mode === mode);
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? availablePreviewModes.length - 1
          : event.key === "ArrowRight"
            ? (currentIndex + 1) % availablePreviewModes.length
            : (currentIndex - 1 + availablePreviewModes.length) % availablePreviewModes.length;
    const nextMode = availablePreviewModes[nextIndex]?.mode;
    if (!nextMode) return;

    onPreviewModeChange(nextMode);
    requestAnimationFrame(() => document.getElementById(`preview-tab-${nextMode}`)?.focus());
  }

  return (
    <div className="lc-workspace-shell flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-[var(--lc-border)] bg-[var(--lc-surface-raised)] p-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
            <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="max-w-[200px] truncate text-[13px] font-semibold text-[var(--lc-ink)] sm:max-w-[300px]" title={fileName}>
            {fileName}
          </span>
        </div>
        <button type="button" onClick={onReplace} className="lc-button-secondary px-3 py-1 text-[12px]">
          Replace CSV
        </button>
      </div>

      <div className="z-10 flex flex-col gap-4 border-b border-[var(--lc-border)] bg-[var(--lc-surface-subtle)] p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-[var(--lc-border)] bg-white p-1 text-[11px] font-medium text-[var(--lc-muted)] sm:grid-cols-4">
          <span className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg bg-[var(--lc-green-bg)] px-2 text-[var(--lc-green)]"><Check className="h-3 w-3" aria-hidden="true" /> 1. Upload</span>
          <span className="inline-flex min-h-9 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] px-2 font-semibold text-[var(--lc-accent)]">2. Clean</span>
          <span className="inline-flex min-h-9 items-center justify-center px-2">3. Review</span>
          <span className="inline-flex min-h-9 items-center justify-center px-2">4. Export</span>
        </div>

        <CleanupPresetControls
          currentRules={{
            selectedColumn,
            duplicateMode,
            emailFilter,
            crmFormat,
            crmFieldOverrides: activeCrmOverrides,
          }}
          availableColumns={headers}
          onApply={onApplySavedWorkflow}
        />

        <div>
          <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--lc-muted)]">Cleaning rules</h3>
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[200px] flex-1">
              <label htmlFor="column-select" className="mb-1 block text-[12px] font-medium text-[var(--lc-muted)]">Target column</label>
              <select
                id="column-select"
                value={selectedColumn}
                onChange={(event) => {
                  const nextColumn = event.target.value;
                  const detection = detections.find((entry) => entry.header === nextColumn);
                  onApplyConfigChange({ selectedColumn: nextColumn, duplicateMode });
                  trackToolEvent("csv-lead-cleaner", "change_column", { column_type: detection?.type ?? "unknown" });
                }}
                className="lc-select w-full"
              >
                {headers.map((header) => <option key={header} value={header}>{header}</option>)}
              </select>
            </div>

            <div className="min-w-[200px] flex-1">
              <label htmlFor="duplicate-mode" className="mb-1 block text-[12px] font-medium text-[var(--lc-muted)]">Deduplicate by</label>
              <select
                id="duplicate-mode"
                value={duplicateMode}
                onChange={(event) => {
                  const nextMode = event.target.value as DuplicateMode;
                  onApplyConfigChange({ selectedColumn, duplicateMode: nextMode });
                  trackToolEvent("csv-lead-cleaner", "change_duplicate_mode", { mode: nextMode });
                }}
                className="lc-select w-full"
              >
                {DUPLICATE_MODE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>

            {showEmailEnrichment ? (
              <div className="min-w-[200px] flex-1">
                <label htmlFor="email-filter" className="mb-1 block text-[12px] font-medium text-[var(--lc-muted)]">Email filter</label>
                <select
                  id="email-filter"
                  value={emailFilter}
                  onChange={(event) => {
                    const nextFilter = event.target.value as EmailFilterMode;
                    onApplyConfigChange({ selectedColumn, duplicateMode, emailFilter: nextFilter });
                    trackToolEvent("csv-lead-cleaner", "change_email_filter", { filter: nextFilter });
                  }}
                  className="lc-select w-full"
                >
                  <option value="all">Keep all valid emails</option>
                  <option value="business_only">Business emails only</option>
                  <option value="personal_only">Personal emails only</option>
                </select>
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              {toastVisible ? (
                <div role="status" aria-live="polite" className="flex items-center gap-1.5 px-2 py-1 text-[13px] font-medium text-[var(--lc-green)]">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Cleanup settings updated.</span>
                </div>
              ) : null}
              <div className="flex gap-1">
                <button type="button" onClick={onUndo} disabled={!canUndo} aria-keyshortcuts="Control+Z Meta+Z" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-white text-[var(--lc-muted)] transition-colors hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] disabled:opacity-50" aria-label="Undo cleanup setting change" title="Undo">
                  <Undo2 className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" onClick={onRedo} disabled={!canRedo} aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-white text-[var(--lc-muted)] transition-colors hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] disabled:opacity-50" aria-label="Redo cleanup setting change" title="Redo">
                  <Redo2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lc-status-strip lc-stat-grid" role="status" aria-label="Cleanup results summary">
        <span><strong>{summary.totalRows.toLocaleString()}</strong> total rows</span>
        <span className="text-black/10" aria-hidden="true">·</span>
        <span><strong>{summary.duplicatesRemoved.toLocaleString()}</strong> duplicates removed</span>
        <span className="text-black/10" aria-hidden="true">·</span>
        <span><strong>{(summary.invalidRowsRemoved + summary.emptyRowsRemoved + summary.filteredRowsRemoved).toLocaleString()}</strong> invalid/blank removed</span>
        <span className="text-black/10" aria-hidden="true">·</span>
        <span className="font-semibold text-[var(--lc-accent)]"><strong>{summary.cleanRowsReady.toLocaleString()}</strong> ready</span>
        {isCleaning ? <span aria-live="polite" className="font-medium text-[var(--lc-muted)]">Updating preview…</span> : null}
      </div>

      {workspaceWarning ? (
        <div role="status" aria-live="polite" className="flex items-center gap-2 border-b border-[var(--lc-border)] bg-amber-50/50 px-4 py-2 text-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--lc-warning)]" aria-hidden="true" />
          <p className="text-xs font-medium">{workspaceWarning}</p>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--lc-border)] bg-white">
          <div className="flex flex-col items-start gap-2 border-b border-[var(--lc-border)] bg-[var(--lc-surface-raised)] px-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div role="tablist" aria-label="CSV row previews" className="flex flex-wrap items-center gap-1">
              {availablePreviewModes.map(({ mode, label }) => (
                <button
                  key={mode}
                  id={`preview-tab-${mode}`}
                  type="button"
                  role="tab"
                  aria-selected={previewMode === mode}
                  aria-controls="preview-tab-panel"
                  tabIndex={previewMode === mode ? 0 : -1}
                  onClick={() => onPreviewModeChange(mode)}
                  onKeyDown={(event) => handlePreviewTabKeyDown(event, mode)}
                  className={`min-h-11 rounded-t-md px-4 py-2 text-xs transition-colors ${previewMode === mode ? "translate-y-px border border-[var(--lc-border)] border-b-white bg-white font-semibold text-[var(--lc-ink)]" : "text-[var(--lc-muted)] hover:text-[var(--lc-ink)]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div id="preview-tab-panel" role="tabpanel" aria-labelledby={`preview-tab-${previewMode}`} tabIndex={0} className="min-h-[300px] flex-1 overflow-auto bg-white">
            {reportHeaders.length && visiblePreviewRows.length ? (
              <div className="lc-table-scroll">
                <table aria-label={previewLabel} className="lc-data-table lc-data-table-compact">
                  <caption className="sr-only">{previewDescription}</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="lc-data-table-index">#</th>
                      {previewMode !== "clean" ? <th scope="col">Reason</th> : null}
                      {reportHeaders.map((header) => {
                        const isComputed = header.startsWith("leadcleanr_");
                        return (
                          <th scope="col" key={header} title={isComputed ? "Added by LeadCleanr" : prettyHeader(header)} className={isComputed ? "text-[var(--lc-accent)]" : undefined}>
                            {isComputed ? <Sparkles aria-hidden="true" className="mr-1 inline h-3 w-3" /> : null}
                            {prettyHeader(header)}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {visiblePreviewRows.map((row, index) => (
                      <tr key={index}>
                        <td className="lc-data-table-index">{index + 1}</td>
                        {previewMode !== "clean" && row.leadcleanr_reason ? (
                          <td className="px-3 py-2"><span className="lc-status-pill lc-status-pill-danger">{row.leadcleanr_reason}</span></td>
                        ) : null}
                        {reportHeaders.map((header) => {
                          const value = row[header];
                          const isMono = /email|phone|domain/i.test(header);
                          return (
                            <td key={header} className={`max-w-[280px] truncate ${isMono ? "lc-data-table-value" : ""}`} title={String(value || "")}>
                              {value || <span className="text-[var(--lc-hint)]">Empty</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-xs text-[var(--lc-muted)]">No rows available.</div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--lc-border)] bg-[var(--lc-surface-raised)] p-4">
        <CrmExportControls
          rows={cleanRows}
          sourceHeaders={previewHeaders}
          fileName={fileName}
          duplicateMode={duplicateMode}
          selectedColumn={selectedColumn}
          emailFilter={emailFilter}
          summary={summary}
          format={crmFormat}
          overrides={activeCrmOverrides}
          onFormatChange={onCrmFormatChange}
          onOverridesChange={onCrmOverridesChange}
        />
      </div>
    </div>
  );
}

function CrmDestinationPicker({
  value,
  onChange,
}: {
  value: CrmExportFormat;
  onChange: (format: CrmExportFormat) => void;
}) {
  return (
    <fieldset>
      <legend className="text-center font-display text-xl font-bold tracking-[-0.025em] text-[var(--lc-ink)] sm:text-2xl">
        Where is this CSV going?
      </legend>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-6 text-[var(--lc-muted)]">
        Choose a destination first so cleanup, mapping, and readiness checks work toward the actual import.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {CRM_EXPORT_FORMAT_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                onChange(option.value);
                trackToolEvent("csv-lead-cleaner", "choose_crm_destination", { export_format: option.value });
              }}
              className={`min-h-12 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lc-accent)] ${
                selected
                  ? "border-[var(--lc-accent)] bg-[var(--lc-accent-bg)] text-[var(--lc-accent)] shadow-sm"
                  : "border-[var(--lc-border)] bg-white text-[var(--lc-muted)] hover:border-[var(--lc-border-mid)] hover:text-[var(--lc-ink)]"
              }`}
            >
              {option.value === "clean_csv" ? "Just clean it" : crmFormatLabel(option.value)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function FileSizeNotice({ pendingFile }: { pendingFile: PendingCsvFile }) {
  const toneClasses = pendingFile.exceedsFreeLimit
    ? "border-[color:rgba(217,119,6,0.2)] bg-[color:rgba(255,247,237,0.92)]"
    : "border-[color:rgba(15,118,110,0.18)] bg-[color:rgba(240,253,250,0.9)]";

  return (
    <div className={`rounded-xl border p-4 ${toneClasses}`}>
      <p className="text-sm font-semibold text-[color:var(--foreground)]">
        {pendingFile.name} · {pendingFile.sizeMb.toFixed(1)} MB
      </p>
      <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
        {pendingFile.exceedsFreeLimit
          ? `This file is over the ${FREE_CSV_LIMIT_MB} MB free limit. It looks like about ${formatRowEstimate(pendingFile.estimatedRows)} rows. Free typically fits around ${formatRowEstimate(pendingFile.estimatedRowsWithinFreeLimit)} rows of this density.`
          : `This file fits inside the free ${FREE_CSV_LIMIT_MB} MB limit and looks like about ${formatRowEstimate(pendingFile.estimatedRows)} rows for browser-side cleanup.`}
      </p>
    </div>
  );
}

function crmFormatLabel(format: CrmExportFormat) {
  if (format === "hubspot") return "HubSpot";
  if (format === "salesforce") return "Salesforce";
  if (format === "apollo") return "Apollo";
  if (format === "pipedrive") return "Pipedrive";
  return "a clean CSV";
}

function formatRowEstimate(value: number | null) {
  return value ? value.toLocaleString() : "a few thousand";
}

function prettyHeader(header: string) {
  if (!header.startsWith("leadcleanr_")) return header;
  return header
    .replace("leadcleanr_", "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}
