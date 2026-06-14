import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Info, Check, ShieldCheck } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { getSiteUrl } from "@/lib/seo";

const freePoints = [
 "All text extraction tools stay open",
 "CSV uploads work up to 5 MB",
 "CSV exports stay entirely unlimited",
 "No login required for core workflow",
];

const proPoints = [
 "Massive CSV uploads (10MB+ limits)",
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
 text: "When cleanup is becoming part of your recurring job and the 5 MB file size limit itself starts creating operational friction.",
 color: "emerald",
 },
 {
 label: "Do not pay yet",
 icon: Info,
 text: "If the product has not yet earned a place in your actual workflow. The free tier should prove the case first.",
 color: "slate",
 },
];

const freeComparison = [
 "Up to 5 MB CSV uploads",
 "Unlimited browser exports",
 "No signup for core tools",
 "Local processing by default",
];

const proComparison = [
 "10 MB+ CSV uploads",
 "Saved cleanup workflows",
 "CRM export presets",
 "Priority support channel",
];

export const metadata: Metadata = {
 title: "Pricing — LeadCleanr",
 description: "LeadCleanr pricing for browser-first CSV lead cleanup workflows, from free discovery to heavier operational use.",
 alternates: { canonical: `${getSiteUrl()}/pricing` },
};

export default function PricingPage() {
 return (
 <PageFrame>
  {/* Hero Section */}
  <section className="pt-24 pb-20 lg:pt-36 lg:pb-32">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
  <div className="mx-auto max-w-3xl text-center">
  <div className="mb-8 section-eyebrow inline-flex items-center gap-2">
  <Zap className="h-4 w-4" />
  <span>Fair Pricing Model</span>
  </div>
  <h1 className="mb-8 font-display text-5xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-7xl">
  Free should feel useful on purpose.
  </h1>
  <p className="text-lg leading-8 text-[var(--lc-muted)] sm:text-xl">
  LeadCleanr is not priced like a trap. The free tier lets you test the product honestly. Pro starts only when spreadsheet work gets heavier and larger files create friction.
  </p>
  <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--lc-hint)]">
  Most users never need Pro. Pay only when larger files and recurring workflows become part of the job.
  </p>
  </div>
  </div>
  </section>

 {/* Pricing Cards Section */}
 <section className="relative pb-24 lg:pb-32 z-10">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-start">
  {/* Free Tier Card */}
  <div className="group relative flex flex-col overflow-hidden surface-card rounded-[1.5rem] p-8 sm:p-12 transition-all duration-300 hover:-translate-y-1">
  <div className="relative flex-1">
  <div className="flex items-center justify-between mb-8">
  <div>
  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--lc-accent)]">Free</h3>
  <div className="mt-4 flex items-baseline gap-2">
  <span className="text-6xl font-display font-bold tracking-tight text-[var(--lc-ink)]">$0</span>
  <span className="text-lg text-[var(--lc-muted)]">/mo</span>
  </div>
  </div>
  <div className="inline-flex items-center justify-center rounded-full border border-[var(--lc-border)] bg-[var(--lc-surface)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--lc-accent)] shadow-sm">
  Featured
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

  <div className="mb-8 rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] p-4">
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
  <div className="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-[var(--lc-dark-bg)] p-8 shadow-[var(--shadow-strong)] transition-all duration-300 hover:-translate-y-1 sm:p-12">
  <div className="absolute inset-0 border border-white/10 rounded-[1.5rem]"></div>
  
  <div className="relative flex-1">
  <div className="flex items-center justify-between mb-8">
  <div>
  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--lc-surface)]">Pro</h3>
  <div className="mt-4 flex items-baseline gap-2">
  <span className="text-6xl font-display font-bold tracking-tight text-[var(--lc-surface)]">$12</span>
  <span className="text-lg text-[var(--lc-hint)]">/mo</span>
  </div>
  </div>
  <div className="inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--lc-surface)]">
  Heavy Use
  </div>
  </div>

  <p className="mb-8 text-base leading-relaxed text-[var(--lc-hint)]">
  Pro is the exact same product, but built for when the cleanup becomes repeat work and file-size boundaries interrupt the job.
  </p>

  <div className="mb-10 space-y-4">
  {proPoints.map((point) => (
  <div key={point} className="flex items-start gap-3">
  <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--lc-surface)]" />
  <span className="text-sm text-[#e4e4e1]">{point}</span>
  </div>
  ))}
  </div>

  <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-4">
  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e4e4e1]">
  Good for
  </p>
  <div className="mt-3 grid gap-2">
  {proUseCases.map((item) => (
  <div key={item} className="flex items-center gap-2 text-sm text-[#e4e4e1]">
  <Check className="h-4 w-4 text-[var(--lc-surface)]" />
  <span>{item}</span>
  </div>
  ))}
  </div>
  </div>
  </div>

  <div className="relative mt-auto pt-4">
  <Link
  href="#"
  className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--lc-surface)] px-6 text-sm font-semibold text-[var(--lc-ink)] transition-all hover:bg-[#e4e4e1]"
  >
  <span>Get Pro Access</span>
  <ArrowRight className="h-4 w-4" />
  </Link>
  </div>
  </div>

 </div>
 </div>
 </section>

  {/* Decision Rules / How to Choose Section */}
  <section className="py-24 lg:py-32">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-3xl text-center mb-16">
  <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--lc-ink)] sm:text-4xl mb-4">
  How to choose your plan
  </h2>
  <p className="text-lg text-[var(--lc-muted)]">
  Choose based on the weight of the spreadsheet job.
  </p>
  </div>

  <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
  {decisionRules.map((rule) => {
  const Icon = rule.icon;

  return (
  <div 
  key={rule.label}
  className="group relative overflow-hidden surface-card rounded-[1.25rem] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--lc-border-mid)]"
  >
  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] text-[var(--lc-accent)] transition-colors duration-300 group-hover:bg-[var(--lc-accent-bg)]">
  <Icon className="h-6 w-6" />
  </div>
  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--lc-ink)] mb-3">{rule.label}</h3>
  <p className="text-sm leading-relaxed text-[var(--lc-muted)]">{rule.text}</p>
  </div>
  );
  })}
  </div>
  </div>
  </section>

  {/* Comparison Cards Section */}
  <section className="py-24 lg:py-32">
  <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-3xl text-center">
  <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
  Compare by how much work you need to do
  </h2>
  <p className="mt-4 text-base leading-7 text-[var(--lc-muted)]">
  The free plan is a real workflow. Pro is for scale, presets, and repeat cleanup jobs.
  </p>
  </div>

  <div className="mt-12 grid gap-6 md:grid-cols-2">
  <div className="surface-card rounded-[1.25rem] p-8 transition-all duration-300 hover:-translate-y-1">
  <div className="flex items-center justify-between gap-4">
  <div>
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--lc-accent)]">
  Free
  </p>
  <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--lc-ink)]">
  Useful without pressure
  </h3>
  </div>
  <span className="rounded-full border border-[var(--lc-border)] bg-[var(--lc-bg)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--lc-ink)]">
  $0
  </span>
  </div>

  <div className="mt-6 grid gap-3">
  {freeComparison.map((item) => (
  <div key={item} className="flex items-start gap-3 rounded-xl bg-[var(--lc-bg)] px-4 py-3">
  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--lc-accent)]" />
  <span className="text-sm font-medium text-[var(--lc-ink)]">{item}</span>
  </div>
  ))}
  </div>
  </div>

  <div className="surface-card rounded-[1.25rem] p-8 transition-all duration-300 hover:-translate-y-1">
  <div className="flex items-center justify-between gap-4">
  <div>
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--lc-ink)]">
  Pro
  </p>
  <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--lc-ink)]">
  Scale when it becomes repeat work
  </h3>
  </div>
  <span className="rounded-full border border-[var(--lc-border)] bg-[var(--lc-surface)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--lc-ink)]">
  $12/mo
  </span>
  </div>

  <div className="mt-6 grid gap-3">
  {proComparison.map((item) => (
  <div key={item} className="flex items-start gap-3 rounded-xl bg-[var(--lc-surface)] border border-[var(--lc-border)] px-4 py-3">
  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--lc-ink)]" />
  <span className="text-sm font-medium text-[var(--lc-ink)]">{item}</span>
  </div>
  ))}
  </div>
  </div>
  </div>

  <div className="mt-8 surface-card rounded-xl p-6 text-center">
  <p className="text-sm leading-relaxed text-[var(--lc-muted)]">
  <strong>Note:</strong> Business and API features should appear only after repeat demand proves they belong here. Until then, pricing stays easy to explain.
  </p>
  </div>
  </div>
  </section>
 </PageFrame>
 );
}
