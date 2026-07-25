import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Info, Check, ShieldCheck } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { ProWaitlistForm } from "@/components/pro-waitlist-form";
import { getSiteUrl } from "@/lib/seo";
import { FREE_CSV_LIMIT_MB, PRO_CSV_LIMIT_LABEL } from "@/lib/product-config";

const freePoints = [
 "All text extraction tools stay open",
 `CSV uploads work up to ${FREE_CSV_LIMIT_MB} MB`,
 "CSV exports stay entirely unlimited",
 "No login required for core workflow",
];

const proPoints = [
 `Massive CSV uploads (${PRO_CSV_LIMIT_LABEL} limits)`,
 "Built for recruiters, agencies & sales ops",
 "Saved cleanup workflow presets",
 "Direct exports to HubSpot & Apollo",
];

const freeUseCases = [
 "One-off sales lists",
 "CSV cleanup before import",
 "Testing whether LeadCleanr fits",
];

const proUseCases = [
 "Recruiters with recurring lists",
 "Agencies cleaning client exports",
 "Sales teams with repeat operations",
];

const decisionRules = [
 {
 label: "Choose Free",
 icon: ShieldCheck,
 text: "When you are testing the workflow, cleaning a smaller file, or checking whether the product feels trustworthy enough to keep around.",
 color: "blue",
 },
 {
 label: "Choose Pro",
 icon: Zap,
 text: `When cleanup is becoming part of your recurring job and the ${FREE_CSV_LIMIT_MB} MB file size limit itself starts creating operational friction.`,
 color: "emerald",
 },
 {
 label: "Do not pay yet",
 icon: Info,
 text: "If the product has not yet earned a place in your actual workflow. The free tier should prove the case first.",
 color: "slate",
 },
];

export const metadata: Metadata = {
 title: "Pricing",
 description: "LeadCleanr pricing for browser-first CSV lead cleanup workflows, from free discovery to heavier operational use.",
 alternates: { canonical: `${getSiteUrl()}/pricing` },
};

export default function PricingPage() {
 return (
 <PageFrame>
  {/* Hero Section */}
  <section className="border-b border-[var(--lc-border-mid)] pb-14 pt-14 lg:pb-20 lg:pt-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mx-auto mb-7 max-w-3xl text-center font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--lc-muted)]">
  01 / Pricing
  </div>
  <div className="mx-auto max-w-4xl text-center">
  <h1 className="mx-auto mb-7 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-[var(--lc-ink)] sm:text-6xl">
  Free should feel useful on purpose.
  </h1>
  <p className="mx-auto max-w-3xl text-lg leading-8 text-[var(--lc-muted)] sm:text-xl">
  LeadCleanr is not priced like a trap. The free tier lets you test the product honestly. Pro starts only when spreadsheet work gets heavier and larger files create friction.
  </p>
  <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--lc-hint)]">
  Most users never need Pro. Pay only when larger files and recurring workflows become part of the job.
  </p>
  </div>
  </div>
  </section>

 {/* Pricing Cards Section */}
 <section className="relative z-10 pb-16 pt-12 lg:pb-20 lg:pt-16">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="mx-auto grid max-w-5xl overflow-hidden rounded-xl border border-[var(--lc-border-mid)] bg-[var(--lc-border-mid)] gap-px lg:grid-cols-2 lg:items-stretch">
  {/* Free Tier Card */}
  <div className="relative flex flex-col bg-[var(--lc-surface)] p-8 sm:p-12">
  <div className="relative flex-1">
  <div className="flex items-center justify-between mb-8">
  <div>
  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--lc-accent)]">Free</h3>
  <div className="mt-4 flex items-baseline gap-2">
  <span className="text-6xl font-display font-bold tracking-tight text-[var(--lc-ink)]">$0</span>
  <span className="text-lg text-[var(--lc-muted)]">/mo</span>
  </div>
  </div>
  <div className="border border-[var(--lc-border-mid)] px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--lc-muted)]">
  Available now
  </div>
  </div>

  <p className="mb-8 text-base leading-relaxed text-[var(--lc-muted)]">
  Free is for the first real pass. Clean what you need, export it, and decide whether the product deserves to stay in your workflow.
  </p>

  <div className="mb-10 space-y-4">
  {freePoints.map((point) => (
  <div key={point} className="flex items-start gap-3">
  <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--lc-accent)]" />
  <span className="text-sm text-[var(--lc-ink)]">{point}</span>
  </div>
  ))}
  </div>

  <div className="mb-8 border-t border-[var(--lc-border-mid)] pt-5">
  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--lc-accent)]">
  Good for
  </p>
  <div className="mt-3 grid gap-2">
  {freeUseCases.map((item) => (
  <div key={item} className="flex items-center gap-2 text-sm text-[var(--lc-ink)]">
  <Check className="h-4 w-4 text-[var(--lc-accent)]" />
  <span>{item}</span>
  </div>
  ))}
  </div>
  </div>
  </div>

  <div className="mt-auto pt-4">
  <Link
  href="/tools/csv-lead-cleaner"
  className="lc-button-primary w-full min-h-12 text-sm font-semibold"
  >
  <span>Try the free workflow</span>
  <ArrowRight className="h-4 w-4" />
  </Link>
  </div>
  </div>

  {/* Pro Tier Card */}
  <div className="relative flex flex-col overflow-hidden bg-[var(--lc-dark-bg)] p-8 sm:p-12">
  
  <div className="relative flex-1">
  <div className="flex items-center justify-between mb-8">
  <div>
  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--lc-surface)]">Pro</h3>
  <div className="mt-4 flex items-baseline gap-2">
  <span className="text-6xl font-display font-bold tracking-tight text-[var(--lc-surface)]">$12</span>
  <span className="text-lg text-white/50">/mo</span>
  </div>
  </div>
  <div className="border border-white/25 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-white/70">
  Early access
  </div>
  </div>

  <p className="mb-8 text-base leading-relaxed text-white/65">
  Pro is the exact same product, but built for when the cleanup becomes repeat work and file-size boundaries interrupt the job.
  </p>

  <div className="mb-10 space-y-4">
  {proPoints.map((point) => (
  <div key={point} className="flex items-start gap-3">
  <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--lc-surface)]" />
  <span className="text-sm text-white/80">{point}</span>
  </div>
  ))}
  </div>

  <div className="mb-8 border-t border-white/20 pt-5">
  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">
  Good for
  </p>
  <div className="mt-3 grid gap-2">
  {proUseCases.map((item) => (
  <div key={item} className="flex items-center gap-2 text-sm text-white/80">
  <Check className="h-4 w-4 text-[var(--lc-surface)]" />
  <span>{item}</span>
  </div>
  ))}
  </div>
  </div>
  </div>

  <div className="relative mt-auto pt-4">
  <Link
  href="#pro-waitlist"
  className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--lc-surface)] px-6 text-sm font-semibold text-[var(--lc-ink)] transition-colors hover:bg-[var(--lc-surface-muted)]"
  >
  <span>Join Pro waitlist</span>
  <ArrowRight className="h-4 w-4" />
  </Link>
  </div>
  </div>

 </div>
 </div>
 </section>

  <ProWaitlistForm />

  {/* Decision Rules / How to Choose Section */}
  <section className="border-t border-[var(--lc-border-mid)] py-16 lg:py-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mx-auto mb-10 max-w-3xl text-center">
  <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--lc-muted)]">02 / Decision guide</p>
  <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--lc-ink)] sm:text-4xl mb-4">
  How to choose your plan
  </h2>
  <p className="text-lg text-[var(--lc-muted)]">
  Choose based on the weight of the spreadsheet job.
  </p>
  </div>

  <div className="mx-auto max-w-6xl divide-y divide-[var(--lc-border-mid)] border-y border-[var(--lc-border-mid)]">
  {decisionRules.map((rule) => {
  const Icon = rule.icon;

  return (
  <div 
  key={rule.label}
  className="grid gap-5 py-7 md:grid-cols-[4rem_11rem_1fr] md:items-start md:gap-8"
  >
  <div className="flex h-11 w-11 items-center justify-center border border-[var(--lc-border-mid)] text-[var(--lc-accent)]">
  <Icon className="h-5 w-5" />
  </div>
  <h3 className="pt-2 text-sm font-bold uppercase tracking-widest text-[var(--lc-ink)]">{rule.label}</h3>
  <p className="max-w-2xl pt-1 text-sm leading-7 text-[var(--lc-muted)]">{rule.text}</p>
  </div>
  );
  })}
  </div>
  </div>
  </section>

 </PageFrame>
 );
}
