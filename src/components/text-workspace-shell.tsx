"use client";

import { FlaskConical, ShieldCheck } from "lucide-react";
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
}: TextWorkspaceShellProps) {
  return (
    <div className="workspace-shell w-full overflow-hidden rounded-[1.75rem] flex flex-col">
      {/* ── Workspace Header ── */}
      <div className="workspace-topbar flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ${iconToneClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{title}</h1>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Processed locally in browser</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Text Input Area ── */}
      <div className="border-b border-slate-200 bg-white/88 p-6 sm:p-8 backdrop-blur-sm">
        <p className="text-sm leading-6 text-slate-500 mb-6 max-w-3xl">
          {description}
        </p>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5" />
            Browser-only processing
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <FlaskConical className="h-3.5 w-3.5" />
            Try sample to see output fast
          </span>
        </div>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {[
            "Paste the raw input",
            "Run the focused tool",
            "Copy or export the result",
          ].map((item, index) => (
            <div
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/82 px-3 py-2 shadow-sm"
            >
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold tracking-widest text-blue-700">
                0{index + 1}
              </span>
              <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
        {inputArea}
      </div>

      {/* ── Results Summary Row ── */}
      <div
        className={`flex flex-nowrap items-stretch divide-x divide-slate-100 bg-white/86 border-b border-slate-200 z-0 overflow-x-auto backdrop-blur-sm ${summaryClassName ?? ""}`}
      >
        {summary}
      </div>

      {/* ── Workspace Controls Toolbar ── */}
      <div className="border-b border-slate-200 bg-white/88 px-6 py-4 flex flex-wrap items-center gap-4 shadow-sm z-10 backdrop-blur-sm">
        {toolbar}
      </div>

      {/* ── Data Preview / Editor Area ── */}
      <div className="workspace-subtle flex-1 flex flex-col min-h-[400px]">
        {preview}
        
        {/* Export Section */}
        {exportControls && (
          <div className="border-t border-slate-200 bg-white/70 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 z-10 shadow-[0_-1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm">
            {exportControls}
          </div>
        )}
      </div>
    </div>
  );
}
