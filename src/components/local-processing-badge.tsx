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
        className={`inline-flex items-center gap-2 rounded-full border border-[color:rgba(15,23,42,0.08)] bg-white/82 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:#244255] shadow-[0_8px_18px_rgba(15,23,42,0.05)] ${className}`.trim()}
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Local only
      </div>
    );
  }

  return (
    <div
      className={`panel-soft rounded-[1.5rem] p-4 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#153246,#244255)] text-white shadow-[0_10px_24px_rgba(21,50,70,0.16)]">
          <HardDriveDownload className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:#38586b]">
            Local Processing
          </p>
          <p className="mt-1 text-sm font-semibold text-[color:#102534]">
            Core processing happens in your browser on this device.
          </p>
          <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
            Uploads, extraction, cleanup, and export stay local in the MVP
            workflow. Optional analytics, error reporting, and saved workspace
            state can still run separately.
          </p>
        </div>
      </div>
    </div>
  );
}
