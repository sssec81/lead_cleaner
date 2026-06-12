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
 title="Your pasted text and CSV files are processed in your browser."
 className={`inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/78 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-sm ${className}`.trim()}
 >
 <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
 <span className="hidden sm:inline">Runs locally</span>
 <span className="sm:hidden">Local</span>
 </div>
 );
 }

 return (
 <div
 className={`panel-soft rounded-xl p-4 ${className}`.trim()}
 >
 <div className="flex flex-wrap items-start gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#153246,#244255)] text-white shadow-sm">
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
