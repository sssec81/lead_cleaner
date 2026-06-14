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
    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium tracking-tight text-[var(--lc-muted)]">
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
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[9px]">
                {isDone ? "✓" : stepNumber}
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
        <div className="flex flex-col items-center justify-center p-8 lg:p-16 bg-white">
          <label
            htmlFor={uploadId}
            className={`group relative flex w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 px-6 py-10 text-center transition-all bg-[#F9F9FB] hover:bg-black/[0.01] ${
              isParsing ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <input id={uploadId} type="file" accept=".csv,text/csv" className="sr-only" onChange={onFileUpload} disabled={isParsing} />
            
            <div className="mb-3 text-[var(--lc-accent)]">
              {emptyStateIcon}
            </div>
            
            <p className="text-[15px] font-semibold text-[var(--lc-ink)] mb-1">
              {emptyStateTitle}
            </p>
            <p className="text-[13px] text-[var(--lc-muted)] mb-5">
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
            <div className="mt-5 w-full max-w-xl rounded-xl border border-red-100 bg-red-50/50 p-4 text-left">
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
          <div className="flex items-center justify-between border-b border-[var(--lc-border)] p-4 bg-[#FDFDFD]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
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
          <div className="border-b border-[var(--lc-border)] p-4 bg-[#FDFDFD] flex flex-col gap-3.5 z-10">
            <div className="flex items-center justify-between">
              {stepper}
            </div>
            
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-tight text-[var(--lc-muted)] mb-1.5">{rulesTitle}</h3>
              {toolbar}
            </div>
          </div>

          {/* Results Summary Row */}
          <div className="lc-status-strip">
            {summary}
          </div>

          {/* Warning Banner */}
          {warning && (
            <div className="flex items-center gap-2 bg-amber-50/50 px-4 py-2 border-b border-[var(--lc-border)] text-amber-900">
              <AlertTriangle className="h-4 w-4 text-[var(--lc-warning)] shrink-0" />
              <p className="text-xs font-medium">{warning}</p>
            </div>
          )}

          {/* Workspace Body */}
          <div className="flex flex-1 flex-col overflow-hidden bg-white">
            <div className="flex-1 overflow-auto p-4 flex flex-col">
              <div className="bg-white border border-[var(--lc-border)] rounded-2xl overflow-hidden flex flex-col max-h-[800px]">
                
                {/* Table Header */}
                <div className="border-b border-[var(--lc-border)] p-3 bg-[#FDFDFD] flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase tracking-tight text-[var(--lc-muted)]">{reviewTitle}</h3>
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
            <div className="border-t border-[var(--lc-border)] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FDFDFD]">
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
