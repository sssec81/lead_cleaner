import type { Metadata } from "next";
import Link from "next/link";
import {
 AlertTriangle,
 ArrowRight,
 Check,
 FileText,
 HelpCircle,
 Scale,
 Shield,
 X,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const quickAnswers = [
 {
 question: "Are my files uploaded?",
 answer:
 "No. CSV and text cleanup run locally in your browser during normal tool use.",
 },
 {
 question: "Do you store CSV data?",
 answer:
 "No. Raw pasted text and uploaded CSV contents are not stored on LeadCleanr servers.",
 },
 {
 question: "Can I use this commercially?",
 answer:
 "Yes. You may use LeadCleanr for legitimate business, client, and internal cleanup work.",
 },
 {
 question: "Is the output guaranteed?",
 answer:
 "No. Extraction, validation, and normalization are best-effort. Review results before using them downstream.",
 },
];

const usageGuidelines = [
 {
 title: "Acceptable use",
 allow: ["Clean data you own", "Process data with permission", "Prepare exports for legitimate workflows"],
 avoid: ["Spam or unsolicited campaigns", "Scraping abuse", "Processing data you have no right to use"],
 },
 {
 title: "Tool accuracy",
 allow: ["Treat output as a cleaner draft", "Review exports before CRM import", "Check edge cases manually"],
 avoid: ["Assuming every match is perfect", "Using results without review", "Treating validation as legal or compliance advice"],
 },
 {
 title: "User responsibility",
 allow: ["Follow applicable laws", "Respect recipient consent", "Validate business-critical data"],
 avoid: ["Using LeadCleanr to bypass rules", "Relying on the tool as the final authority", "Uploading data you should not process"],
 },
];

const legalTerms = [
 {
 title: "Service scope",
 text: "LeadCleanr provides browser-based utilities for cleaning, extracting, deduplicating, converting, and formatting lead data. Features, limits, supported formats, and exports may change as the product evolves.",
 },
 {
 title: "Your data and permissions",
 text: "You are responsible for ensuring you have the right to process any data you paste, upload, clean, export, or use with LeadCleanr.",
 },
 {
 title: "Local processing",
 text: "The core cleanup flow is designed to run in your browser. Browser storage, analytics, and sanitized error reporting may be separate product behaviors, as described in the Privacy Policy.",
 },
 {
 title: "No accuracy guarantee",
 text: "LeadCleanr is best-effort software. It may miss valid data, include incorrect matches, normalize values imperfectly, or produce exports that need review.",
 },
 {
 title: "Limitation of liability",
 text: "LeadCleanr is provided as-is for utility and workflow assistance. You use it at your own risk and should validate results before relying on them operationally.",
 },
 {
 title: "Changes to these terms",
 text: "We may update these terms as the product changes. Continued use of LeadCleanr means you accept the current terms posted on this page.",
 },
];

const operatingRules = [
 "Use only data you own or have permission to process.",
 "Review outputs before CRM import, outreach, or automation.",
 "Treat LeadCleanr as workflow assistance, not legal or factual certainty.",
];

export const metadata: Metadata = {
 title: "Terms of Service — LeadCleanr",
 description:
 "LeadCleanr terms of service, acceptable use, data handling answers, accuracy expectations, and product rules.",
 alternates: {
 canonical: "https://leadcleanr.com/terms",
 },
};

export default function TermsPage() {
 return (
 <PageFrame>
 <section className="relative overflow-hidden pt-20 pb-12 lg:pt-28 lg:pb-16">
 <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fffef8_0%,#f5f8fd_52%,#f3f6fb_100%)]" />
 <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-[linear-gradient(180deg,rgba(15,23,42,0.03),transparent)]" />
 <div className="absolute left-[-10rem] top-12 -z-10 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
 <div className="absolute right-[-10rem] top-10 -z-10 h-80 w-80 rounded-full bg-blue-200/35 blur-3xl" />
 <div className="absolute left-1/3 bottom-0 -z-10 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />

 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
 <div className="relative overflow-hidden rounded-xl border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.97),rgba(248,250,252,0.92))] p-7 shadow-sm sm:p-10">
 <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />
 <div className="relative">
 <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm">
 <Scale className="h-4 w-4 text-blue-600" />
 Terms of Service
 </div>
 <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.8rem] lg:leading-[1.02]">
 Clear rules, plain language, and no legal fog.
 </h1>
 <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
 LeadCleanr is built to clean data, not obscure responsibility.
 These terms explain where the product helps, where judgment still matters,
 and what responsible use looks like.
 </p>

 <div className="mt-8 grid gap-3 sm:grid-cols-3">
 {operatingRules.map((rule, index) => (
 <div
 key={rule}
 className="rounded-xl border border-slate-200 bg-white/85 p-4 shadow-sm"
 >
 <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-700">
 Rule {index + 1}
 </p>
 <p className="mt-2 text-sm leading-6 text-slate-700">{rule}</p>
 </div>
 ))}
 </div>

 <div className="mt-8 flex flex-wrap gap-3">
 <Link
 href="/tools"
 className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
 >
 Back to tools
 <ArrowRight className="h-4 w-4" />
 </Link>
 <Link
 href="/privacy"
 className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
 >
 Privacy Policy
 <ArrowRight className="h-4 w-4" />
 </Link>
 </div>
 </div>
 </div>

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
 <div className="rounded-lg border border-slate-200 bg-slate-50 p-7 shadow-sm">
 <div className="flex items-start gap-4">
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600 shadow-sm">
 <HelpCircle className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
 Fast answers
 </p>
 <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900">
 The questions people ask before trusting the page.
 </h2>
 </div>
 </div>
 </div>

 {quickAnswers.map((item, index) => (
 <div
 key={item.question}
 className={`rounded-xl border p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 ${
 index === 0
 ? "border-blue-200/70 bg-[linear-gradient(180deg,rgba(239,246,255,0.92),rgba(255,255,255,0.96))]"
 : "border-slate-200 bg-white/92"
 }`}
 >
 <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
 Quick check
 </p>
 <h3 className="mt-2 text-base font-semibold text-slate-950">{item.question}</h3>
 <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 <section className="px-4 py-6 sm:px-6 lg:px-8">
 <div className="mx-auto max-w-7xl overflow-hidden rounded-xl border border-slate-200 bg-[linear-gradient(135deg,#122131_0%,#17344b_52%,#214763_100%)] p-6 text-white shadow-sm sm:p-8 lg:p-10">
 <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
 <div>
 <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
 Product boundary
 </p>
 <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
 LeadCleanr can make messy data more workable. It cannot replace review, consent, or judgment.
 </h2>
 </div>
 <blockquote className="rounded-xl border border-white/10 bg-white/8 p-6 text-lg leading-8 text-white/90 sm:text-xl">
 “Use the output like a cleaner draft. If the decision matters, verify it before you act.”
 </blockquote>
 </div>
 </div>
 </section>

 <section className="py-16 lg:py-20">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="max-w-3xl">
 <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
 Usage guidelines
 </p>
 <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
 Designed to be easy to scan and hard to misunderstand.
 </h2>
 <p className="mt-4 text-base leading-7 text-slate-600">
 These guidelines are the practical layer under the legal terms. They set the tone for how the product should be used in real workflows.
 </p>
 </div>

 <div className="mt-10 grid gap-5 lg:grid-cols-3">
 {usageGuidelines.map((section, index) => (
 <div
 key={section.title}
 className={`overflow-hidden rounded-xl border shadow-sm ${
 index === 1
 ? "border-blue-200/80 bg-[linear-gradient(180deg,rgba(247,250,255,0.98),rgba(255,255,255,0.95))]"
 : "border-slate-200 bg-white/95"
 }`}
 >
 <div className="border-b border-slate-100/80 px-6 py-5">
 <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
 Guideline
 </p>
 <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950">
 {section.title}
 </h3>
 </div>
 <div className="space-y-5 p-6">
 <div>
 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
 Good use
 </p>
 <ul className="mt-3 space-y-3">
 {section.allow.map((item) => (
 <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
 <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
 <span>{item}</span>
 </li>
 ))}
 </ul>
 </div>
 <div className="border-t border-slate-100 pt-5">
 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
 Avoid
 </p>
 <ul className="mt-3 space-y-3">
 {section.avoid.map((item) => (
 <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
 <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
 <span>{item}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section className="pb-16 lg:pb-20">
 <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
 <div className="lg:sticky lg:top-24 lg:self-start">
 <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] p-6 shadow-sm sm:p-7">
 <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
 <FileText className="h-6 w-6" />
 </div>
 <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
 Plain-language legal terms.
 </h2>
 <p className="mt-4 text-base leading-7 text-slate-600">
 This is the operational version of the legal page: what the product does, what you remain responsible for, and where the limits are.
 </p>
 <div className="mt-6 rounded-xl border border-amber-200 bg-[linear-gradient(180deg,rgba(255,251,235,0.95),rgba(255,247,220,0.92))] p-4">
 <div className="flex gap-3">
 <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
 <p className="text-sm leading-6 text-amber-950">
 If your workflow has legal, compliance, or contractual requirements, review both the output and your obligations before acting.
 </p>
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 {legalTerms.map((term, index) => (
 <details
 key={term.title}
 open={index === 0}
 className="group overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-sm transition-all duration-300 open:border-blue-200 open:shadow-sm hover:border-slate-300"
 >
 <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6">
 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500 transition-colors duration-300 group-open:bg-blue-100 group-open:text-blue-700">
 {String(index + 1).padStart(2, "0")}
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
 Term
 </p>
 <span className="mt-1 block font-display text-xl font-semibold text-slate-950 group-open:text-blue-950">
 {term.title}
 </span>
 </div>
 <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-bold text-slate-500 transition-all duration-300 group-open:rotate-45 group-open:border-blue-200 group-open:bg-blue-50 group-open:text-blue-700">
 +
 </span>
 </summary>
 <div className="border-t border-slate-100 px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
 <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
 <p className="text-sm leading-7 text-slate-600 sm:text-base">{term.text}</p>
 </div>
 </div>
 </details>
 ))}
 </div>
 </div>
 </section>

 </PageFrame>
 );
}
