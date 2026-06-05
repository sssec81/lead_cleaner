"use client";

import { HardDriveDownload, ShieldCheck } from "lucide-react";

type LocalProcessingBadgeProps = {
  compact?: boolean;
  className?: string;
};

export function LocalProcessingBadge({
  compact = false,
  className = "",
}: LocalProcessingBadgeProps) {
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-[color:rgba(15,23,42,0.14)] bg-[color:rgba(244,247,250,0.92)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:#244255] ${className}`.trim()}
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Local only
      </div>
    );
  }

  return (
    <div
      className={`rounded-[1.35rem] border border-[color:rgba(15,23,42,0.12)] bg-[linear-gradient(180deg,rgba(244,247,250,0.96),rgba(236,242,247,0.92))] p-4 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:#153246] text-white">
          <HardDriveDownload className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:#38586b]">
            Local Processing
          </p>
          <p className="mt-1 text-sm font-semibold text-[color:#102534]">
            Processed in your browser. 0 bytes sent to our server.
          </p>
          <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
            Uploads, extraction, cleanup, and export all stay on your device in
            this MVP workflow.
          </p>
        </div>
      </div>
    </div>
  );
}
