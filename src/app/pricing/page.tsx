import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Info, Zap } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { PageHero } from "@/components/page-hero";
import { PageSectionHeading } from "@/components/page-section-heading";

const freePoints = [
  "Text tools stay open.",
  "CSV uploads work up to 2 MB.",
  "Exports stay unlimited.",
  "No login required in the MVP.",
];

const proPoints = [
  "Larger CSV uploads for real operational cleanup.",
  "A better fit for recruiters, agencies, and sales ops teams.",
  "Earlier access to saved workflow features and heavier-use support.",
];

const decisionRules = [
  {
    label: "Choose Free",
    text: "when you are testing the workflow, cleaning a smaller file, or checking whether the product feels trustworthy enough to keep around.",
  },
  {
    label: "Choose Pro",
    text: "when cleanup is becoming part of your recurring job and the file size itself starts creating friction.",
  },
  {
    label: "Do not pay yet",
    text: "if the product has not yet earned a place in your actual workflow. The free tier should prove the case first.",
  },
];

const comparisonRows = [
  {
    title: "CSV limit",
    free: "Up to 2 MB",
    pro: "Larger files",
  },
  {
    title: "Exports",
    free: "Unlimited",
    pro: "Unlimited",
  },
  {
    title: "Best fit",
    free: "Trying the workflow",
    pro: "Recurring cleanup work",
  },
  {
    title: "Why it exists",
    free: "Trust-building",
    pro: "Heavier operational use",
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "LeadCleanr pricing for browser-first CSV lead cleanup workflows, from free discovery to heavier operational use.",
};

export default function PricingPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Pricing"
        title="Free should feel useful on purpose."
        intro="LeadCleanr is not priced like a trap. The free tier is supposed to let someone test the product honestly. Pro starts only when the spreadsheet work gets heavier and the larger files create real operational friction."
        aside={(
          <div className="panel-strong relative rounded-[1.75rem] p-6 sm:p-8">
            <p className="section-eyebrow">Pricing note</p>
            <p className="mt-4 font-display text-3xl font-semibold leading-[1.08] text-[color:var(--foreground)] sm:text-4xl">
              “People do not mind paying for heavier use. They mind feeling tricked into it.”
            </p>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              That is the whole model here. Free is for trust. Pro is for larger files and repeat cleanup work. Nothing else needs to be more complicated than that right now.
            </p>
          </div>
        )}
        className="pt-10 lg:pt-12"
      />

      <section className="page-section">
        <div className="grid gap-8 xl:grid-cols-[0.98fr_1.02fr] xl:items-stretch">
          <div className="panel-strong rounded-[1.75rem] p-7 sm:p-9">
            <div className="flex items-end justify-between gap-4 border-b border-[color:rgba(16,37,52,0.1)] pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                  Free
                </p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="font-display text-7xl font-semibold leading-none text-[color:var(--foreground)]">
                    $0
                  </span>
                  <span className="pb-2 text-base text-[color:var(--muted)]">
                    /month
                  </span>
                </div>
              </div>
              <span className="rounded-full border border-[color:rgba(37,99,235,0.18)] bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                Start here
              </span>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--foreground)]">
              Free is for the first real pass. Paste text, upload a smaller
              CSV, clean what you need, export it, and decide whether the
              product deserves to stay in your workflow. If the free tier feels
              stingy, the pricing is wrong.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {freePoints.map((point, index) => (
                <div
                  key={point}
                  className={`rounded-[1.5rem] border px-4 py-4 text-sm leading-6 ${
                    index === 0
                      ? "border-[color:rgba(37,99,235,0.16)] bg-white text-[color:var(--foreground)] shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
                      : "border-[color:var(--line)] bg-white/82 text-[color:var(--muted)]"
                  }`}
                >
                  {point}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/tools/csv-lead-cleaner"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-6 text-sm font-semibold text-[color:var(--foreground)]"
              >
                Try the free workflow
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-6 top-6 -z-10 h-full rounded-[1.75rem] bg-[color:rgba(21,50,70,0.08)] blur-2xl" />
            <div className="rounded-[1.75rem] bg-[color:#153246] p-7 text-white shadow-[0_30px_60px_rgba(15,23,42,0.18)] sm:p-9">
              <div className="flex items-end justify-between gap-4 border-b border-[color:rgba(255,255,255,0.12)] pb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:#93c5fd]">
                    Pro
                  </p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-display text-7xl font-semibold leading-none text-white">
                      $12
                    </span>
                    <span className="pb-2 text-base text-[color:rgba(255,255,255,0.7)]">
                      /month
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-[color:#93c5fd] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:#153246]">
                  Heavy use
                </span>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:rgba(255,255,255,0.82)]">
                Pro is not a different personality. It is the same product
                once the spreadsheets get heavier, the cleanup becomes repeat
                work, and you stop wanting the file-size boundary to interrupt
                the job.
              </p>

              <div className="mt-8 space-y-4">
                {proPoints.map((point, index) => (
                  <div
                    key={point}
                    className={`rounded-[1.45rem] border px-4 py-4 text-sm leading-7 ${
                      index === 0
                        ? "border-[color:rgba(147,197,253,0.28)] bg-[color:rgba(255,255,255,0.06)] text-white"
                        : "border-[color:rgba(255,255,255,0.12)] bg-[color:rgba(255,255,255,0.03)] text-[color:rgba(255,255,255,0.78)]"
                    }`}
                  >
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:#2563eb] hover:bg-[color:#1d4ed8] px-6 text-sm font-semibold text-white transition-colors duration-200"
                >
                  Ask about Pro
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tools/csv-lead-cleaner"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color:rgba(255,255,255,0.18)] px-6 text-sm font-semibold text-white"
                >
                  Use free first
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section pb-16 lg:pb-20">
        <div className="grid gap-12 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <PageSectionHeading
              eyebrow="How to choose"
              title="Choose the plan based on the weight of the spreadsheet job."
            />
            <div className="mt-6 space-y-4">
              {decisionRules.map((rule, index) => {
                const Icon = [Check, Zap, Info][index] || Info;
                const iconColor = [
                  "text-emerald-600 bg-emerald-50/80 border-emerald-100/80",
                  "text-blue-600 bg-blue-50/80 border-blue-100/80",
                  "text-slate-600 bg-slate-100/80 border-slate-200/80",
                ][index];

                return (
                  <div
                    key={rule.label}
                    className="panel-soft flex gap-4 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:rgba(37,99,235,0.16)] hover:bg-white/92 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground)]">
                        {rule.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        {rule.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel-soft rounded-[1.75rem] p-7 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Side-by-side only where it helps
            </p>
            <div className="mt-6 space-y-5">
              {comparisonRows.map((row, index) => (
                <div
                  key={row.title}
                  className={index === 0 ? "" : "border-t border-[color:rgba(16,37,52,0.1)] pt-5"}
                >
                  <div className="grid gap-4 sm:grid-cols-[0.8fr_0.6fr_0.6fr]">
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      {row.title}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
                        Free
                      </p>
                      <p className="mt-1 text-sm leading-7 text-[color:var(--foreground)]">
                        {row.free}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">
                        Pro
                      </p>
                      <p className="mt-1 text-sm leading-7 text-[color:var(--foreground)]">
                        {row.pro}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[color:rgba(16,37,52,0.1)] pt-5">
              <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                Business and API features should appear only after repeat
                demand proves they belong here. Until then, pricing should stay
                easy to explain: free for trust-building, Pro for heavier
                spreadsheet work.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
