import { Check, ShieldCheck } from "lucide-react";
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
    <div className="w-full lc-workspace-shell flex flex-col">
      {/* ── Workspace Header ── */}
      <div className="px-4 pt-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconToneClassName}`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[14px] font-bold text-[var(--lc-ink)] leading-tight">{title}</h2>
                <div className="inline-flex items-center gap-1 rounded-full bg-black/[0.03] border border-black/5 px-2.5 py-0.5 font-sans text-[11px] text-[var(--lc-muted)]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Processed locally
                </div>
              </div>
              <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-[var(--lc-muted)]">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="group relative flex h-11 w-11 items-center justify-center self-start rounded-lg border border-[var(--lc-border)] text-[var(--lc-muted)] hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] transition-colors"
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
                className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-[var(--lc-border)] bg-white p-3 text-left shadow-lg"
              >
                <p className="mb-2 font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--lc-muted)]">Keyboard Shortcuts</p>
                <div className="flex flex-col gap-1.5 text-xs text-[var(--lc-ink)]">
                  <div className="flex justify-between"><span>Copy results</span> <kbd className="font-mono text-[11px] bg-[var(--lc-bg)] border border-black/10 rounded px-1">C</kbd></div>
                  <div className="flex justify-between"><span>Try sample</span> <kbd className="font-mono text-[11px] bg-[var(--lc-bg)] border border-black/10 rounded px-1">S</kbd></div>
                  <div className="flex justify-between"><span>Batch mode</span> <kbd className="font-mono text-[11px] bg-[var(--lc-bg)] border border-black/10 rounded px-1">B</kbd></div>
                  <div className="flex justify-between"><span>Download CSV</span> <kbd className="font-mono text-[11px] bg-[var(--lc-bg)] border border-black/10 rounded px-1">D</kbd></div>
                  <div className="flex justify-between"><span>Download TXT</span> <kbd className="font-mono text-[11px] bg-[var(--lc-bg)] border border-black/10 rounded px-1">T</kbd></div>
                </div>
              </div>
            ) : null}
          </button>
        </div>

        <div aria-label={`Step ${currentStep + 1} of ${steps.length}`} className="mt-4 flex flex-wrap items-center gap-1.5 border-b border-[var(--lc-border)] pb-2.5 text-xs font-medium tracking-tight text-[var(--lc-muted)]">
          {steps.map((label, index) => {
            const isDone = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <React.Fragment key={label}>
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
                    {isDone ? <Check aria-hidden="true" className="h-2.5 w-2.5" /> : index + 1}
                  </span>
                  <span>{label}</span>
                </span>
                {index < steps.length - 1 ? (
                  <span className="text-black/10">·</span>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Text Input Area ── */}
      <div className="border-b border-[var(--lc-border)] bg-[var(--lc-surface-raised)] p-4 sm:p-5">
        {inputArea}
      </div>

      {/* ── Results Summary Row ── */}
      <div
        className={`lc-status-strip ${summaryClassName ?? ""}`}
      >
        {summary}
      </div>

      {/* ── Workspace Controls Toolbar ── */}
      <div className="border-b border-[var(--lc-border)] bg-[var(--lc-surface-raised)] px-4 py-3 flex flex-wrap items-center gap-4 sm:px-6">
        {toolbar}
      </div>

      {/* ── Data Preview / Editor Area ── */}
      <div className="flex-1 flex flex-col min-h-[400px] bg-white rounded-b-[28px] overflow-hidden">
        {preview}
        
        {/* Export Section */}
        {exportControls && (
          <div className="mt-auto border-t border-[var(--lc-border)] bg-[var(--lc-surface-raised)] p-4 sm:p-5">
            {exportControls}
          </div>
        )}
      </div>
    </div>
  );
}
