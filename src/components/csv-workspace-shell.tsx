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
}: CsvWorkspaceShellProps) {
  return (
    <div className="workspace-shell w-full overflow-hidden rounded-[1.75rem] flex flex-col">
      {/* ── Workspace Header ── */}
      <div className="workspace-topbar flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1d4ed8,#0f766e)] text-white shadow-[0_14px_28px_rgba(29,78,216,0.24)]">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">LeadCleanr Workspace</h1>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Processed locally in browser</span>
            </div>
          </div>
        </div>

        {hasLoadedFile && (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-[300px]" title={fileName}>
                {fileName}
              </span>
              <span className="text-xs text-slate-500">{rowCount.toLocaleString()} rows</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <button
              type="button"
              onClick={onReplaceFile}
              className="btn-secondary h-9 rounded-lg px-3 text-xs font-semibold"
            >
              Replace file
            </button>
          </div>
        )}
      </div>

      {!hasLoadedFile ? (
        /* ── Main Upload Panel (Empty State) ── */
      <div className="workspace-subtle flex flex-1 flex-col items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="glass-panel relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 group">
            
            {/* ── Header Section ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white/60 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700 shadow-sm">
                  {emptyStateIcon}
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{emptyStateTitle}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onLoadDemo}
                  disabled={isParsing}
                  className="btn-ghost h-8 rounded-md px-3 text-xs font-semibold"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Try Sample CSV
                </button>
              </div>
            </div>

            {/* ── Middle Section (Dropzone) ── */}
            <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center p-6 sm:p-8">
              <p className="mb-6 max-w-md text-center text-sm leading-relaxed text-slate-500">
                {emptyStateSubtitle}
              </p>

              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Browser-only processing
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  Free limit: 5 MB per CSV
                </span>
              </div>

              <div className="mb-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600">
                <span className="rounded-full border border-slate-200/80 bg-white/84 px-3 py-1.5 shadow-sm">1. Upload</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                <span className="rounded-full border border-slate-200/80 bg-white/84 px-3 py-1.5 shadow-sm">2. Review</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                <span className="rounded-full border border-slate-200/80 bg-white/84 px-3 py-1.5 shadow-sm">3. Export</span>
              </div>

              <label
                htmlFor={uploadId}
                className={`group relative flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all ${
                  isParsing
                    ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                    : "border-slate-300 bg-white/60 hover:border-blue-500 hover:bg-blue-50/60 hover:shadow-[0_18px_40px_rgba(59,130,246,0.12)]"
                }`}
              >
                <input id={uploadId} type="file" accept=".csv,text/csv" className="sr-only" onChange={onFileUpload} disabled={isParsing} />
                
                <div className="flex items-center justify-center gap-3">
                  {isParsing ? (
                    <LoaderCircle className="h-6 w-6 animate-spin text-slate-500" />
                  ) : (
                    <span className="inline-flex h-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#09111f,#1d4ed8)] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(29,78,216,0.24)] transition-all duration-300 group-hover:-translate-y-0.5">
                      Browse Files
                    </span>
                  )}
                </div>
                <p className="mt-4 text-xs font-medium text-slate-500">Supports CSV files up to 5 MB</p>
                <p className="mt-2 text-[11px] font-medium text-slate-400">Larger files are reserved for the Pro workflow.</p>
              </label>

              {isParsing && (
                <div className="mt-6 w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm text-left">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-900">Reading rows</span>
                    <span className="tabular-nums text-slate-500">{progress.percentage}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-[width]"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {progress.rowsProcessed.toLocaleString()} rows processed so far.
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-6 w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-4 text-left shadow-sm">
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
                <div className="mt-6 w-full max-w-md text-left">
                  {pendingFileNotice}
                </div>
              )}
            </div>

            {/* ── Footer Section ── */}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white/84 px-5 py-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <ShieldCheck className="h-4 w-4" />
                <span>Processed locally in your browser</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Unified Application Workspace ── */
        <div className="workspace-subtle flex flex-1 flex-col">
          <div className="border-b border-slate-200/80 bg-blue-50/55 px-6 py-3 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="rounded-full bg-white px-3 py-1 shadow-sm text-blue-700">1. Upload</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="rounded-full bg-white px-3 py-1 shadow-sm text-blue-700">2. Review</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="rounded-full bg-white px-3 py-1 shadow-sm text-blue-700">3. Export</span>
            </div>
          </div>
          
          {/* Cleanup Controls Toolbar */}
          <div className="border-b border-slate-200/80 bg-white/86 px-6 py-4 flex flex-wrap items-end gap-4 shadow-sm z-10 backdrop-blur-sm">
            {toolbar}
          </div>

          {/* Results Summary Row */}
          <div className="flex flex-nowrap items-stretch divide-x divide-slate-100 bg-white/88 border-b border-slate-200 z-0 overflow-x-auto backdrop-blur-sm">
            {summary}
          </div>

          {/* Warning Banner */}
          {warning && (
            <div className="flex items-center gap-3 bg-amber-50 px-6 py-3 border-b border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-sm font-medium text-amber-800">{warning}</p>
            </div>
          )}

          {/* Data Preview Area */}
          <div className="flex-1 flex flex-col min-h-[400px]">
            {preview}
            
            {/* Export Section */}
            {exportControls && (
              <div className="border-t border-slate-200 bg-white/70 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 z-10 shadow-[0_-1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm">
                {exportControls}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
