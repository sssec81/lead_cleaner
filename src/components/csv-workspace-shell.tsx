"use client";

import { AlertCircle, AlertTriangle, Check, FileSpreadsheet, LoaderCircle, ShieldCheck, Upload } from "lucide-react";
import React from "react";
import type { CsvParseProgress } from "@/lib/csv";

export interface CsvWorkspaceShellProps {
  // Global State
  hasLoadedFile: boolean;
  isParsing: boolean;
  progress: CsvParseProgress;
  fileName: string;
  rowCount: number;
  onReplaceFile: () => void;
  error: string;
  warning: string;

  // Empty State
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateIcon?: React.ReactNode;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadDemo: () => void;
  pendingFileNotice?: React.ReactNode;
  uploadId?: string;

  // Loaded State
  toolbar: React.ReactNode;
  summary: React.ReactNode;
  preview: React.ReactNode;
  exportControls?: React.ReactNode;
  steps?: string[];
  currentStep?: number;
  rulesTitle?: string;
  reviewTitle?: string;
  exportTitle?: string;
}

export function CsvWorkspaceShell({
  hasLoadedFile,
  isParsing,
  progress,
  fileName,
  rowCount,
  onReplaceFile,
  error,
  warning,
  emptyStateTitle = "Upload a CSV to begin",
  emptyStateSubtitle = "Drop your raw lead list here. The data is parsed and cleaned entirely on your device for maximum privacy.",
  emptyStateIcon = <Upload className="h-8 w-8" />,
  onFileUpload,
  onLoadDemo,
  pendingFileNotice,
  uploadId = "csv-upload-shell",
  toolbar,
  summary,
  preview,
  exportControls,
  steps = ["Upload CSV", "Choose cleanup rules", "Review rows", "Export"],
  currentStep = 1,
  rulesTitle = "Cleaning Rules",
  reviewTitle = "Review",
  exportTitle = "Export",
}: CsvWorkspaceShellProps) {
  const normalizedCurrentStep = Math.min(
    Math.max(currentStep, 1),
    Math.max(steps.length, 1),
  );

  const stepper = (
    <div aria-label={`Step ${normalizedCurrentStep} of ${steps.length}`} className="flex flex-wrap items-center gap-1.5 text-xs font-medium tracking-tight text-[var(--lc-muted)]">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < normalizedCurrentStep;
        const isCurrent = stepNumber === normalizedCurrentStep;

        return (
          <React.Fragment key={step}>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
                isDone
                  ? "bg-emerald-50 text-emerald-700"
                  : isCurrent
                    ? "bg-[var(--lc-accent-bg)] text-[var(--lc-accent)] font-semibold"
                    : "text-[var(--lc-muted)]"
              }`}
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px]">
                {isDone ? <Check aria-hidden="true" className="h-2.5 w-2.5" /> : stepNumber}
              </span>
              <span>{step}</span>
            </span>
            {index < steps.length - 1 ? (
              <span className="text-black/10">·</span>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className="w-full lc-workspace-shell flex flex-col">
      {!hasLoadedFile ? (
        /* ── Main Upload Panel (Empty State) ── */
        <div className="flex flex-col items-center justify-center bg-[var(--lc-surface-subtle)] p-6 sm:p-10 lg:p-14">
          <label
            htmlFor={uploadId}
            className={`group relative flex w-full max-w-2xl cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--lc-border-mid)] bg-white px-6 py-10 text-center transition-colors hover:border-[var(--lc-accent)] sm:py-12 ${
              isParsing ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <input id={uploadId} type="file" accept=".csv,text/csv" className="sr-only" onChange={onFileUpload} disabled={isParsing} />
            
            <div className="lc-icon-tile mb-4 h-14 w-14">
              {emptyStateIcon}
            </div>
            
            <p className="mb-1 text-[17px] font-semibold tracking-[-0.015em] text-[var(--lc-ink)]">
              {emptyStateTitle}
            </p>
            <p className="mb-6 max-w-lg text-[13px] leading-6 text-[var(--lc-muted)]">
              {emptyStateSubtitle}
            </p>
            
            <div className="flex items-center justify-center gap-3">
              {isParsing ? (
                <LoaderCircle className="h-5 w-5 animate-spin text-[var(--lc-muted)]" />
              ) : (
                <>
                  <span className="lc-button-primary">
                    Choose CSV
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onLoadDemo();
                    }}
                    className="lc-button-secondary"
                  >
                    Try sample
                  </button>
                </>
              )}
            </div>
          </label>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 font-sans text-[11px] text-[var(--lc-muted)]">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Processed locally</span>
            <span className="text-black/10">·</span>
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Browser-only</span>
            <span className="text-black/10">·</span>
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Max 5MB file</span>
          </div>

          <div className="mt-6 flex justify-center">
            {stepper}
          </div>

          {error && (
            <div role="alert" className="mt-5 w-full max-w-xl rounded-xl border border-red-100 bg-red-50/50 p-4 text-left">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-[var(--lc-danger)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-[var(--lc-ink)]">Upload failed</h4>
                  <p className="mt-0.5 text-xs text-[var(--lc-muted)]">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {pendingFileNotice && (
            <div className="mt-5 w-full max-w-xl">
              {pendingFileNotice}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1 bg-white">
          
          {/* ── Workspace Header ── */}
          <div className="flex items-center justify-between border-b border-[var(--lc-border)] bg-[var(--lc-surface-subtle)] p-4">
            <div className="flex items-center gap-2.5">
              <div className="lc-icon-tile h-8 w-8 rounded-lg">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <span className="font-semibold text-[13px] text-[var(--lc-ink)] truncate max-w-[200px] sm:max-w-[300px]" title={fileName}>
                {fileName}
              </span>
            </div>

            <button
              onClick={onReplaceFile}
              className="lc-button-secondary py-1 px-3 text-[12px]"
            >
              Replace CSV
            </button>
          </div>

          {/* Cleanup Controls Toolbar */}
          <div className="z-10 flex flex-col gap-3.5 border-b border-[var(--lc-border)] bg-white p-4">
            <div className="flex items-center justify-between">
              {stepper}
            </div>
            
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-tight text-[var(--lc-muted)] mb-1.5">{rulesTitle}</h3>
              {toolbar}
            </div>
          </div>

          {/* Results Summary Row */}
          <div className="lc-status-strip" role="status" aria-label="CSV processing summary">
            {summary}
          </div>

          {/* Warning Banner */}
          {warning && (
            <div role="status" aria-live="polite" className="flex items-center gap-2 bg-amber-50/50 px-4 py-2 border-b border-[var(--lc-border)] text-amber-900">
              <AlertTriangle className="h-4 w-4 text-[var(--lc-warning)] shrink-0" />
              <p className="text-xs font-medium">{warning}</p>
            </div>
          )}

          {/* Workspace Body */}
          <div className="flex flex-1 flex-col overflow-hidden bg-white">
            <div className="flex-1 overflow-auto p-4 flex flex-col">
              <div className="flex max-h-[800px] flex-col overflow-hidden rounded-2xl border border-[var(--lc-border-mid)] bg-white shadow-sm">
                
                {/* Table Header */}
                <div className="flex items-center justify-between border-b border-[var(--lc-border)] bg-[var(--lc-surface-subtle)] p-3">
                  <h3 className="text-xs font-bold uppercase tracking-tight text-[var(--lc-muted)]">{reviewTitle}</h3>
                </div>

                {/* The Table */}
                <div className="flex-1 overflow-auto bg-white min-h-[300px]">
                   {preview}
                </div>
              </div>
            </div>
          </div>

          {/* Export Footer */}
          {exportControls && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--lc-border)] bg-[var(--lc-surface-subtle)] p-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <h3 className="text-[11px] font-bold uppercase tracking-tight text-[var(--lc-muted)] hidden sm:block">{exportTitle}</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full sm:w-auto">
                {exportControls}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
