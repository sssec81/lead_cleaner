"use client";

import type { ReactNode } from "react";
import { BarChart3, CheckCircle2, Quote, ShieldCheck, Zap } from "lucide-react";
import { PageFrame } from "@/components/page-frame";

type TextToolPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  quote: string;
  tool: ReactNode;
  asideDescription?: string;
  asideContent?: ReactNode;
  toolSupportingContent?: ReactNode;
  heroVariant?: "default" | "streamlined";
};

export function TextToolPageShell({
  eyebrow,
  title,
  intro,
  quote,
  asideDescription,
  asideContent,
  tool,
  toolSupportingContent,
  heroVariant = "default",
}: TextToolPageShellProps) {
  const isStreamlined = heroVariant === "streamlined";

  return (
    <PageFrame>
      <main
        className={`grid-glow relative min-h-screen overflow-hidden pb-20 lg:pb-28 ${
          isStreamlined ? "pt-10 lg:pt-14" : "pt-12 lg:pt-16"
        }`}
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.82),var(--background))]" />
        <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className={isStreamlined ? "pb-8 lg:pb-10" : "pb-10 lg:pb-14"}>
            <div
              className={`grid lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start ${
                isStreamlined ? "gap-6" : "gap-8"
              }`}
            >
              <div className={`max-w-2xl ${isStreamlined ? "pt-1 xl:pt-3" : "pt-2 xl:pt-5"}`}>
                <div className="metric-chip mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-blue-700">
                  <Zap className="h-4 w-4" />
                  <span>{eyebrow}</span>
                </div>
                <h1
                  className={`aurora-text font-display font-bold tracking-tight leading-[1.02] ${
                    isStreamlined
                      ? "mb-4 text-[2rem] sm:text-[2.45rem] lg:text-[2.95rem]"
                      : "mb-5 text-[2.15rem] sm:text-[2.7rem] lg:text-[3.2rem]"
                  }`}
                >
                  {title}
                </h1>
                <p
                  className={`max-w-2xl text-base leading-7 text-slate-600 sm:text-lg ${
                    isStreamlined ? "mb-5" : "mb-6"
                  }`}
                >
                  {intro}
                </p>

                <div
                  className={
                    isStreamlined
                      ? "mb-5 flex flex-wrap gap-2.5"
                      : "mb-6 grid gap-3 sm:grid-cols-3"
                  }
                >
                  {[
                    "Paste or upload the raw input",
                    "Run one focused cleanup action",
                    "Review output before export",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={
                        isStreamlined
                          ? "inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/88 px-3 py-2 shadow-sm"
                          : "rounded-[1.15rem] border border-slate-200/80 bg-white/88 p-4 shadow-sm"
                      }
                    >
                      <div
                        className={`inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold tracking-widest text-blue-700 ${
                          isStreamlined ? "" : "mb-3"
                        }`}
                      >
                        0{index + 1}
                      </div>
                      <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>

                <div className={`glass-panel overflow-hidden rounded-[1.25rem] ${isStreamlined ? "mb-5" : "mb-6"}`}>
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                      <Quote className="h-4 w-4 text-blue-600" />
                      Quick read
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <p className="text-sm leading-6 text-slate-700 sm:text-[0.95rem]">{quote}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-slate-700">Browser-first</span> processing
                  </div>
                  <span className="hidden text-slate-300 sm:inline">·</span>
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-slate-700">Review output</span> before export
                  </div>
                </div>
              </div>

              <div className={isStreamlined ? "lg:pt-1" : "lg:pt-3"}>
                {asideContent ? (
                  asideContent
                ) : (
                  <div className="glass-panel relative overflow-hidden rounded-[1.5rem] p-6 sm:p-7">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(239,246,255,0.7),rgba(255,255,255,0.95),rgba(236,253,245,0.5))]" />
                    <div className="relative">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Use This When
                      </div>
                      <h3 className="font-display text-[1.45rem] font-bold leading-tight text-slate-900 sm:text-[1.7rem]">
                        One compact tool for one cleanup job.
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[0.95rem]">
                        {asideDescription ??
                          "Use this page when you already know the exact transformation you need and want the shortest path from raw input to clean export."}
                      </p>

                      <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white/88 shadow-sm">
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                          <h4 className="text-sm font-semibold text-slate-800">What happens here</h4>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {[
                            "Paste the source content or list",
                            "Run the focused extraction or cleanup",
                            "Copy or export the cleaned result",
                          ].map((item, index) => (
                            <div key={item} className="flex items-center justify-between gap-3 px-4 py-3.5">
                              <span className="text-sm font-medium text-slate-700">{item}</span>
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {tool}
          {toolSupportingContent ? (
            <div className={isStreamlined ? "mt-8" : "mt-10"}>{toolSupportingContent}</div>
          ) : null}
        </div>
      </main>
    </PageFrame>
  );
}
