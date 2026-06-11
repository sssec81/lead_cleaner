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
      <section className="relative overflow-hidden pt-20 pb-14 lg:pt-28 lg:pb-20">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_76%,#ffffff_100%)]" />
        <div className="absolute right-[-10rem] top-8 -z-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute left-[-8rem] bottom-0 -z-10 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
              <Scale className="h-4 w-4 text-blue-600" />
              Terms of Service
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Clear rules for using LeadCleanr responsibly.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              These terms explain what LeadCleanr does, what stays your responsibility,
              and how to think about local processing, commercial use, and best-effort output.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/privacy"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
              >
                Privacy Policy
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 hover:shadow-[0_12px_28px_rgba(37,99,235,0.22)]"
              >
                Return to tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Quick answers
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-950">
                  What people usually check first.
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {quickAnswers.map((item) => (
                <div key={item.question} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-950">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">
                Product boundary
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
                The tool can make messy data more workable. It cannot remove the need for judgment.
              </h2>
            </div>
            <blockquote className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-xl font-semibold leading-8 text-white/90 sm:text-2xl">
              “The safest default is to treat cleaned output as a better draft,
              not unquestionable truth.”
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
              Usage guidelines
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Easier to scan, harder to misuse.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              LeadCleanr is built for legitimate cleanup work. These guidelines keep the tool useful and the expectations honest.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {usageGuidelines.map((section) => (
              <div key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-display text-2xl font-semibold text-slate-950">{section.title}</h3>
                <div className="mt-5 space-y-5">
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

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <div className="sticky top-24">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Plain-language legal terms.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                The practical version: use data you are allowed to process, review the output, and do not treat the tool as a guarantee.
              </p>
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <p className="text-sm leading-6 text-amber-900">
                    If your workflow has legal, compliance, or contractual requirements, review the results and your obligations before acting.
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
                className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 open:border-blue-200/60 open:shadow-md hover:border-slate-300"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-slate-50/50 p-5 sm:p-6 text-left transition-colors hover:bg-slate-50 group-open:bg-blue-50/30">
                  <span className="font-display text-xl font-semibold text-slate-900 group-open:text-blue-900">{term.title}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200/60 text-sm font-bold text-slate-500 transition-transform duration-300 group-open:rotate-45 group-open:bg-blue-200/50 group-open:text-blue-600">
                    +
                  </span>
                </summary>
                <div className="border-t border-slate-100/60 p-5 sm:px-6 sm:py-5 group-open:animate-in group-open:fade-in group-open:slide-in-from-top-2 duration-300">
                  <p className="text-sm leading-7 text-slate-600 sm:text-base">{term.text}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Need the privacy version?
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-slate-950">
              Read how local processing and browser storage work.
            </h2>
          </div>
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            View Privacy Policy
            <Shield className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageFrame>
  );
}
