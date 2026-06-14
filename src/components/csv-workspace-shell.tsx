"use client";

import { AlertCircle, AlertTriangle, FileSpreadsheet, LoaderCircle, ShieldCheck, Upload, ArrowRight } from "lucide-react";
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
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < normalizedCurrentStep;
        const isCurrent = stepNumber === normalizedCurrentStep;

        return (
          <React.Fragment key={step}>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                isDone
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : isCurrent
                    ? "border-[var(--lc-accent)] bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]"
                    : "border-[var(--lc-border)] bg-[var(--lc-surface)] text-[var(--lc-muted)]"
              }`}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">
                {isDone ? "✓" : stepNumber}
              </span>
              <span>{step}</span>
            </span>
            {index < steps.length - 1 ? (
              <ArrowRight className="h-3.5 w-3.5 text-[var(--lc-border-mid)]" />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className="w-full bg-[var(--lc-surface)] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[var(--lc-border)] overflow-hidden flex flex-col">
      {!hasLoadedFile ? (
        /* ── Main Upload Panel (Empty State) ── */
        <div className="flex flex-col items-center justify-center p-12 lg:p-24 bg-[var(--lc-surface)] rounded-xl border border-[var(--lc-border)] shadow-sm">
          <label
            htmlFor={uploadId}
            className={`group relative flex w-full max-w-2xl cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all ${
              isParsing
                ? "border-[var(--lc-border-mid)] bg-[var(--lc-bg)] opacity-60 cursor-not-allowed"
                : "border-[var(--lc-border-mid)] bg-[var(--lc-bg)] hover:border-[var(--lc-accent)] hover:bg-[var(--lc-accent-bg)]"
            }`}
          >
            <input id={uploadId} type="file" accept=".csv,text/csv" className="sr-only" onChange={onFileUpload} disabled={isParsing} />
            
            <div className="mb-4 text-[var(--lc-accent)]">
              {emptyStateIcon}
            </div>
            
            <p className="text-[16px] font-semibold text-[var(--lc-ink)] mb-1">
              {emptyStateTitle}
            </p>
            <p className="text-[14px] text-[var(--lc-muted)] mb-6">
              {emptyStateSubtitle}
            </p>
            
            <div className="flex items-center justify-center gap-3">
              {isParsing ? (
                <LoaderCircle className="h-6 w-6 animate-spin text-[var(--lc-muted)]" />
              ) : (
                <>
                  <span className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--lc-accent)] px-5 text-sm font-medium text-white transition-opacity hover:opacity-90">
                    Browse CSV
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onLoadDemo();
                    }}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-[var(--lc-surface)] px-5 text-sm font-medium text-[var(--lc-ink)] transition-colors hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)]"
                  >
                    Try sample CSV
                  </button>
                </>
              )}
            </div>
          </label>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-[var(--lc-muted)]">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[var(--lc-accent)]" /> No upload</span>
            <span className="text-[var(--lc-hint)]">·</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[var(--lc-accent)]" /> Processed locally</span>
            <span className="text-[var(--lc-hint)]">·</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[var(--lc-accent)]" /> 5MB free</span>
          </div>

          <div className="mt-6 flex justify-center">
            {stepper}
          </div>

          {error && (
            <div className="mt-6 w-full max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-left shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-900">Upload failed</h4>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {pendingFileNotice && (
            <div className="mt-6 w-full max-w-2xl">
              {pendingFileNotice}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1 bg-[var(--lc-surface)] rounded-xl border border-[var(--lc-border)] shadow-sm">
          
          {/* ── Workspace Header ── */}
          <div className="flex items-center justify-between border-b border-[var(--lc-border)] p-4 bg-[#FDFDFD] rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[14px] text-[var(--lc-ink)] truncate max-w-[200px] sm:max-w-[300px]" title={fileName}>
                  {fileName}
                </span>
              </div>
            </div>

            <button
              onClick={onReplaceFile}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-[var(--lc-surface)] px-3 text-[13px] font-medium text-[var(--lc-muted)] transition hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] gap-1.5"
            >
              Replace CSV
            </button>
          </div>

          {/* Cleanup Controls Toolbar */}
          <div className="border-b border-[var(--lc-border)] p-4 bg-[#FDFDFD] flex flex-col gap-4 z-10">
            {stepper}
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--lc-muted)] mb-2">{rulesTitle}</h3>
              {toolbar}
            </div>
          </div>

          {/* Results Summary Row */}
          <div className="p-4 border-b border-[var(--lc-border)] bg-[var(--lc-surface)]">
            <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
              {summary}
            </div>
          </div>

          {/* Warning Banner */}
          {warning && (
            <div className="flex items-center gap-3 bg-amber-50 px-6 py-3 border-b border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-sm font-medium text-amber-800">{warning}</p>
            </div>
          )}

          {/* Workspace Body */}
          <div className="flex flex-1 flex-col overflow-hidden bg-[var(--lc-bg)]">
            <div className="flex-1 overflow-auto p-4 flex flex-col">
              <div className="bg-[var(--lc-surface)] border border-[var(--lc-border)] rounded-xl overflow-hidden shadow-sm flex flex-col max-h-[800px]">
                
                {/* Table Header */}
                <div className="border-b border-[var(--lc-border)] p-4 bg-[#FDFDFD] flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--lc-muted)]">{reviewTitle}</h3>
                  </div>
                </div>

                {/* The Table */}
                <div className={`flex-1 overflow-auto bg-[var(--lc-surface)] min-h-[300px]`}>
                   {preview}
                </div>
              </div>
            </div>
          </div>

          {/* Export Footer */}
          {exportControls && (
            <div className="border-t border-[var(--lc-border)] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FDFDFD] rounded-b-xl">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--lc-muted)] hidden sm:block">{exportTitle}</h3>
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
