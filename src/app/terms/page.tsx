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
import { getSiteUrl } from "@/lib/seo";

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
  title: "Terms of Service",
  description:
    "LeadCleanr terms of service, acceptable use, data handling answers, accuracy expectations, and product rules.",
  alternates: {
    canonical: `${getSiteUrl()}/terms`,
  },
};

export default function TermsPage() {
  return (
    <PageFrame>
      <section className="pb-10 pt-14 lg:pb-12 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="relative overflow-hidden surface-card rounded-[1.5rem] p-7 sm:p-10">
              <div className="relative">
                <div className="section-eyebrow mb-6 inline-flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Terms of Service
                </div>
                <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight text-[var(--lc-ink)] sm:text-5xl lg:text-[3.8rem] lg:leading-[1.02]">
                  Clear rules, plain language, and no legal fog.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--lc-muted)] sm:text-lg">
                  LeadCleanr is built to clean data, not obscure responsibility.
                  These terms explain where the product helps, where judgment still matters,
                  and what responsible use looks like.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {operatingRules.map((rule, index) => (
                    <div
                      key={rule}
                      className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] p-4"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--lc-accent)]">
                        Rule {index + 1}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--lc-ink)]">{rule}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/tools"
                    className="lc-button-primary min-h-11 px-6 text-sm font-semibold"
                  >
                    Back to tools
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/privacy"
                    className="lc-button-secondary min-h-11 px-6 text-sm font-semibold"
                  >
                    Privacy Policy
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="surface-card rounded-[1.25rem] p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] text-[var(--lc-accent)]">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--lc-accent)]">
                      Fast answers
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-semibold text-[var(--lc-ink)]">
                      The questions people ask before trusting the page.
                    </h2>
                  </div>
                </div>
              </div>

              {quickAnswers.map((item) => (
                <div
                  key={item.question}
                  className="surface-card rounded-[1.25rem] p-5 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--lc-accent)]">
                    Quick check
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-[var(--lc-ink)]">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] bg-[var(--lc-dark-bg)] p-6 shadow-[var(--shadow-strong)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--lc-surface)]">
                Product boundary
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl text-[var(--lc-surface)]">
                LeadCleanr can make messy data more workable. It cannot replace review, consent, or judgment.
              </h2>
            </div>
            <blockquote className="rounded-xl border border-white/10 bg-white/5 p-6 text-lg leading-8 text-white/80 sm:text-xl">
              “Use the output like a cleaner draft. If the decision matters, verify it before you act.”
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="section-eyebrow">
              Usage guidelines
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
              Designed to be easy to scan and hard to misunderstand.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--lc-muted)]">
              These guidelines are the practical layer under the legal terms. They set the tone for how the product should be used in real workflows.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {usageGuidelines.map((section) => (
              <div
                key={section.title}
                className="surface-card overflow-hidden rounded-[1.25rem]"
              >
                <div className="border-b border-[var(--lc-border)] bg-[var(--lc-bg)] px-6 py-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--lc-accent)]">
                    Guideline
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--lc-ink)]">
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-5 p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--lc-green)]">
                      Good use
                    </p>
                    <ul className="mt-3 space-y-3">
                      {section.allow.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--lc-ink)]">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lc-green)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-[var(--lc-border)] pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
                      Avoid
                    </p>
                    <ul className="mt-3 space-y-3">
                      {section.avoid.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--lc-ink)]">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
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

      <section className="pb-12 lg:pb-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card rounded-[1.5rem] p-6 sm:p-7">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--lc-bg)] border border-[var(--lc-border)] text-[var(--lc-accent)]">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
                Plain-language legal terms.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--lc-muted)]">
                This is the operational version of the legal page: what the product does, what you remain responsible for, and where the limits are.
              </p>
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
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
                className="group overflow-hidden surface-card rounded-[1.25rem] transition-all duration-300 open:border-[var(--lc-border-mid)] hover:border-[var(--lc-border-mid)]"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--lc-bg)] border border-[var(--lc-border)] text-sm font-bold text-[var(--lc-muted)] transition-colors duration-300 group-open:bg-[var(--lc-accent-bg)] group-open:text-[var(--lc-accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--lc-muted)]">
                      Term
                    </p>
                    <span className="mt-1 block font-display text-xl font-semibold text-[var(--lc-ink)] group-open:text-[var(--lc-accent)]">
                      {term.title}
                    </span>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--lc-border)] bg-[var(--lc-bg)] text-sm font-bold text-[var(--lc-muted)] transition-all duration-300 group-open:rotate-45 group-open:border-[var(--lc-accent-bg)] group-open:bg-[var(--lc-accent-bg)] group-open:text-[var(--lc-accent)]">
                    +
                  </span>
                </summary>
                <div className="border-t border-[var(--lc-border)] px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
                  <div className="rounded-xl bg-[var(--lc-bg)] p-4 sm:p-5 mt-4">
                    <p className="text-sm leading-7 text-[var(--lc-muted)] sm:text-base">{term.text}</p>
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
