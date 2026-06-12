import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Info, Check, ShieldCheck } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";
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
 {/* Hero Section with Beautiful Gradients */}
 <section className="relative overflow-hidden pt-24 pb-20 lg:pt-36 lg:pb-32">
 <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,white,var(--background))]"></div>
 <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]"></div>
 <div className="absolute bottom-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-[120px]"></div>

 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
 <div className="mx-auto max-w-3xl text-center">
 <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm">
 <Zap className="h-4 w-4" />
 <span>Fair Pricing Model</span>
 </div>
 <h1 className="mb-8 bg-[linear-gradient(to_right,theme(colors.slate.900),theme(colors.slate.600))] bg-clip-text font-display text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
 Free should feel useful on purpose.
 </h1>
 <p className="text-lg leading-8 text-slate-600 sm:text-xl">
 LeadCleanr is not priced like a trap. The free tier lets you test the product honestly. Pro starts only when spreadsheet work gets heavier and larger files create friction.
 </p>
 <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">
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
 <div className="group relative overflow-hidden rounded-xl border border-blue-200 bg-white p-8 shadow-sm ring-1 ring-blue-100 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-sm sm:p-12">
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.12),transparent_45%),linear-gradient(135deg,rgba(239,246,255,0.9),rgba(255,255,255,0.82))]"></div>
 <div className="relative">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600">Free</h3>
 <div className="mt-4 flex items-baseline gap-2">
 <span className="text-6xl font-display font-bold tracking-tight text-slate-900">$0</span>
 <span className="text-lg text-slate-500">/mo</span>
 </div>
 </div>
 <div className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-700">
 Featured
 </div>
 </div>

 <p className="mb-8 text-base leading-relaxed text-slate-600">
 Free is for the first real pass. Clean what you need, export it, and decide whether the product deserves to stay in your workflow.
 </p>

 <div className="mb-10 space-y-4">
 {freePoints.map((point) => (
 <div key={point} className="flex items-start gap-3">
 <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-500" />
 <span className="text-sm text-slate-700">{point}</span>
 </div>
 ))}
 </div>

 <div className="mb-8 rounded-xl border border-blue-100 bg-white p-4">
 <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
 Good for
 </p>
 <div className="mt-3 grid gap-2">
 {freeUseCases.map((item) => (
 <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
 <Check className="h-4 w-4 text-blue-500" />
 <span>{item}</span>
 </div>
 ))}
 </div>
 </div>

 <Link
 href="/tools/csv-lead-cleaner"
 className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md"
 >
 <span>Try the free workflow</span>
 <ArrowRight className="h-4 w-4" />
 </Link>
 </div>
 </div>

 {/* Pro Tier Card */}
 <div className="group relative overflow-hidden rounded-xl bg-slate-950 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm sm:p-12">
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.12),transparent_52%)]"></div>
 <div className="absolute inset-0 border border-white/10 rounded-xl"></div>
 
 <div className="relative">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-sm font-bold uppercase tracking-widest text-sky-400">Pro</h3>
 <div className="mt-4 flex items-baseline gap-2">
 <span className="text-6xl font-display font-bold tracking-tight text-white">$12</span>
 <span className="text-lg text-slate-400">/mo</span>
 </div>
 </div>
 <div className="inline-flex items-center justify-center rounded-full bg-sky-400/10 border border-sky-400/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-sky-400">
 Heavy Use
 </div>
 </div>

 <p className="mb-8 text-base leading-relaxed text-slate-400">
 Pro is the exact same product, but built for when the cleanup becomes repeat work and file-size boundaries interrupt the job.
 </p>

 <div className="mb-10 space-y-4">
 {proPoints.map((point) => (
 <div key={point} className="flex items-start gap-3">
 <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-400" />
 <span className="text-sm text-slate-300">{point}</span>
 </div>
 ))}
 </div>

 <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-4">
 <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300">
 Good for
 </p>
 <div className="mt-3 grid gap-2">
 {proUseCases.map((item) => (
 <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
 <Check className="h-4 w-4 text-sky-400" />
 <span>{item}</span>
 </div>
 ))}
 </div>
 </div>

 <ProWaitlistCard
 trackSource="pricing_pro_card"
 theme="dark"
 title="Join the Pro Waitlist"
 description="Join the waitlist to get notified when we launch paid limits, saved workflows, and export presets."
 />
 </div>
 </div>

 </div>
 </div>
 </section>

 {/* Decision Rules / How to Choose Section */}
 <section className="bg-slate-50 py-24 lg:py-32">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="mx-auto max-w-3xl text-center mb-16">
 <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl mb-4">
 How to choose your plan
 </h2>
 <p className="text-lg text-slate-600">
 Choose based on the weight of the spreadsheet job.
 </p>
 </div>

 <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
 {decisionRules.map((rule) => {
 const Icon = rule.icon;
 const colorStyles = 
 rule.color === 'blue' ? 'text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-100' :
 rule.color === 'emerald' ? 'text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100' :
 'text-slate-600 bg-slate-100 border-slate-200 group-hover:bg-slate-200';

 return (
 <div 
 key={rule.label}
 className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-sm hover:border-slate-300"
 >
 <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl border transition-colors duration-300 ${colorStyles}`}>
 <Icon className="h-6 w-6" />
 </div>
 <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3">{rule.label}</h3>
 <p className="text-sm leading-relaxed text-slate-600">{rule.text}</p>
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
 <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
 Compare by how much work you need to do
 </h2>
 <p className="mt-4 text-base leading-7 text-slate-600">
 The free plan is a real workflow. Pro is for scale, presets, and repeat cleanup jobs.
 </p>
 </div>

 <div className="mt-12 grid gap-6 md:grid-cols-2">
 <div className="rounded-xl border border-blue-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
 <div className="flex items-center justify-between gap-4">
 <div>
 <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
 Free
 </p>
 <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">
 Useful without pressure
 </h3>
 </div>
 <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
 $0
 </span>
 </div>

 <div className="mt-6 grid gap-3">
 {freeComparison.map((item) => (
 <div key={item} className="flex items-start gap-3 rounded-xl bg-blue-50/50 px-4 py-3">
 <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
 <span className="text-sm font-medium text-slate-700">{item}</span>
 </div>
 ))}
 </div>
 </div>

 <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-sm">
 <div className="flex items-center justify-between gap-4">
 <div>
 <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
 Pro
 </p>
 <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">
 Scale when it becomes repeat work
 </h3>
 </div>
 <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-700">
 $12/mo
 </span>
 </div>

 <div className="mt-6 grid gap-3">
 {proComparison.map((item) => (
 <div key={item} className="flex items-start gap-3 rounded-xl bg-white px-4 py-3">
 <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
 <span className="text-sm font-medium text-slate-700">{item}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
 <p className="text-sm leading-relaxed text-slate-600">
 <strong>Note:</strong> Business and API features should appear only after repeat demand proves they belong here. Until then, pricing stays easy to explain.
 </p>
 </div>
 </div>
 </section>
 </PageFrame>
 );
}
