"use client";

import type { ReactNode } from "react";
import { ShieldCheck, Zap } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

type TextToolPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  quote: string;
  tool: ReactNode;
};

export function TextToolPageShell({
  eyebrow,
  title,
  intro,
  quote,
  tool,
}: TextToolPageShellProps) {
  return (
    <PageFrame>
      {/* Tool Hero Section with Radiant Gradients */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,white,var(--background))]"></div>
        <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-[120px]"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            
            {/* Left Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm backdrop-blur-md">
                <Zap className="h-4 w-4" />
                <span>{eyebrow}</span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.05]">
                {title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                {intro}
              </p>
            </div>

            {/* Right Aside (Glassmorphism Quote Card) */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 p-8 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/80 sm:p-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-5 inline-flex h-10 items-center justify-center rounded-xl bg-blue-50 px-4 text-blue-600">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Browser-First Workflow</span>
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold text-slate-900 leading-tight">
                  {quote}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  The tool opens directly in the browser, keeps the workflow focused, and gives you a clean handoff to the next step—processing happens safely on your device.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Embedded Tool Section */}
      <section className="relative z-10 -mt-20 pb-24 lg:-mt-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-xl shadow-slate-200/40 sm:p-6 lg:p-8">
            {tool}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
