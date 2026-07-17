"use client";

import { FileCheck2, HelpCircle, SlidersHorizontal, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

const GUIDE_STORAGE_KEY = "leadcleanr:csv-cleaner:guide-dismissed:v1";

export function CsvCleanerQuickGuide({ onLoadSample }: { onLoadSample: () => void }) {
  const [initialized, setInitialized] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      let dismissed = false;
      try {
        dismissed = window.localStorage.getItem(GUIDE_STORAGE_KEY) === "1";
      } catch {
        // The guide still works when storage is restricted.
      }
      setOpen(!dismissed);
      setInitialized(true);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!initialized) return null;

  if (!open) {
    return (
      <div className="mb-3 flex justify-end">
        <button type="button" onClick={() => setOpen(true)} className="lc-button-quiet min-h-11 px-3 text-xs font-semibold">
          <HelpCircle className="h-4 w-4" aria-hidden="true" /> Quick guide
        </button>
      </div>
    );
  }

  return (
    <aside aria-labelledby="csv-guide-title" className="mb-3 rounded-2xl border border-[var(--lc-accent)]/20 bg-[var(--lc-accent-bg)]/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lc-accent)]">Start here</p>
          <h2 id="csv-guide-title" className="mt-1 text-base font-semibold text-[var(--lc-ink)]">Clean a lead list in three steps</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            try { window.localStorage.setItem(GUIDE_STORAGE_KEY, "1"); } catch { /* Storage is optional. */ }
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--lc-muted)] hover:bg-white hover:text-[var(--lc-ink)]"
          aria-label="Dismiss quick guide"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <ol className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          { icon: Upload, title: "1. Load", text: "Upload a CSV or start with the sample." },
          { icon: SlidersHorizontal, title: "2. Clean", text: "Choose the target column, deduplication, and email rules." },
          { icon: FileCheck2, title: "3. Review and export", text: "Inspect removed rows, map CRM fields, and download." },
        ].map((step) => (
          <li key={step.title} className="rounded-xl border border-[var(--lc-border)] bg-white p-3">
            <step.icon className="h-4 w-4 text-[var(--lc-accent)]" aria-hidden="true" />
            <p className="mt-2 text-xs font-semibold text-[var(--lc-ink)]">{step.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--lc-muted)]">{step.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-[var(--lc-muted)]">Keyboard: ⌘/Ctrl+Z undo · ⌘/Ctrl+Shift+Z redo</p>
        <button type="button" onClick={onLoadSample} className="lc-button-secondary min-h-11 px-4 text-xs font-semibold">Try the sample CSV</button>
      </div>
    </aside>
  );
}
