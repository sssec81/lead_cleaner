import { ShieldCheck } from "lucide-react";
import React from "react";

export interface TextWorkspaceShellProps {
  // Header
  title: string;
  description: string;
  icon: React.ElementType;
  iconToneClassName: string;

  // Input Area
  inputArea: React.ReactNode;

  // Summary
  summary: React.ReactNode;
  summaryClassName?: string;

  // Toolbar
  toolbar: React.ReactNode;

  // Preview / Editor Table
  preview: React.ReactNode;

  // Export
  exportControls?: React.ReactNode;
  currentStep?: 0 | 1 | 2;
  showShortcuts?: boolean;
  onToggleShortcuts?: () => void;
}

export function TextWorkspaceShell({
  title,
  description,
  icon: Icon,
  iconToneClassName,
  inputArea,
  summary,
  summaryClassName,
  toolbar,
  preview,
  exportControls,
  currentStep = 0,
  showShortcuts = false,
  onToggleShortcuts,
}: TextWorkspaceShellProps) {
  const steps = ["Paste", "Review", "Export"];

  return (
    <div className="bg-[var(--lc-surface)] border border-[var(--lc-border)] rounded-xl w-full flex flex-col">
      {/* ── Workspace Header ── */}
      <div className="px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconToneClassName}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[1.125rem] font-bold text-[var(--lc-ink)] leading-tight">{title}</h2>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  <ShieldCheck className="h-3 w-3" />
                  Processed locally
                </div>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--lc-muted)]">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="group relative flex h-10 w-10 items-center justify-center self-start rounded-md border border-[var(--lc-border)] text-[var(--lc-muted)] hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] transition-colors"
            aria-label="Keyboard shortcuts"
            aria-expanded={showShortcuts}
            aria-haspopup="dialog"
            onClick={onToggleShortcuts}
          >
            <span className="font-mono text-sm font-semibold">?</span>
            {(showShortcuts) ? (
              <div
                role="dialog"
                aria-label="Keyboard shortcuts"
                className="absolute right-0 top-full z-50 mt-2 w-52 rounded-md border border-[var(--lc-border)] bg-[var(--lc-surface)] p-3 text-left shadow-lg"
              >
                <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[var(--lc-muted)]">Keyboard Shortcuts</p>
                <div className="flex flex-col gap-1.5 text-xs text-[var(--lc-ink)]">
                  <div className="flex justify-between"><span>Copy results</span> <kbd className="font-mono text-[11px] bg-[var(--lc-bg)] border border-[var(--lc-border)] rounded px-1">C</kbd></div>
                  <div className="flex justify-between"><span>Try sample</span> <kbd className="font-mono text-[11px] bg-[var(--lc-bg)] border border-[var(--lc-border)] rounded px-1">S</kbd></div>
                  <div className="flex justify-between"><span>Batch mode</span> <kbd className="font-mono text-[11px] bg-[var(--lc-bg)] border border-[var(--lc-border)] rounded px-1">B</kbd></div>
                  <div className="flex justify-between"><span>Download CSV</span> <kbd className="font-mono text-[11px] bg-[var(--lc-bg)] border border-[var(--lc-border)] rounded px-1">D</kbd></div>
                  <div className="flex justify-between"><span>Download TXT</span> <kbd className="font-mono text-[11px] bg-[var(--lc-bg)] border border-[var(--lc-border)] rounded px-1">T</kbd></div>
                </div>
              </div>
            ) : null}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-[var(--lc-border)] pb-3">
          {steps.map((label, index) => {
            const isDone = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={label}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isDone
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : isCurrent
                      ? "border-[var(--lc-accent)] bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]"
                      : "border-[var(--lc-border)] bg-white text-[var(--lc-muted)]"
                }`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">
                  {isDone ? "✓" : index + 1}
                </span>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Text Input Area ── */}
      <div className="border-b border-[var(--lc-border)] bg-[var(--lc-bg)]/30 p-4 sm:p-6">
        {inputArea}
      </div>

      {/* ── Results Summary Row ── */}
      <div
        className={`flex flex-nowrap items-stretch border-b border-[var(--lc-border)] bg-[var(--lc-surface)] overflow-x-auto ${summaryClassName ?? ""}`}
      >
        {summary}
      </div>

      {/* ── Workspace Controls Toolbar ── */}
      <div className="border-b border-[var(--lc-border)] bg-[var(--lc-surface)] px-4 py-3 flex flex-wrap items-center gap-4 sm:px-6">
        {toolbar}
      </div>

      {/* ── Data Preview / Editor Area ── */}
      <div className="flex-1 flex flex-col min-h-[400px] bg-[var(--lc-surface)] rounded-b-xl overflow-hidden">
        {preview}
        
        {/* Export Section */}
        {exportControls && (
          <div className="mt-auto border-t border-[var(--lc-border)] bg-[var(--lc-surface)] p-4 sm:p-6">
            {exportControls}
          </div>
        )}
      </div>
    </div>
  );
}
