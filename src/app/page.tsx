import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Download,
  FileSpreadsheet,
  Globe,
  Mail,
  Phone,
  Shield,
  Upload,
  Users,
  Wand2,
  Plus,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { FaqJsonLd, type FaqItem, getSiteUrl } from "@/lib/seo";

const processSteps = [
  {
    title: "Upload or paste the raw list",
    text: "Start with a CSV when the spreadsheet already exists.",
    icon: Upload,
  },
  {
    title: "Clean only what matters",
    text: "Extract emails, phones, domains, or remove the duplicates.",
    icon: Wand2,
  },
  {
    title: "Review, then export",
    text: "Download the cleaned output only when it looks right.",
    icon: Download,
  },
];

const quickStarts = [
  {
    href: "/tools/csv-lead-cleaner",
    title: "Full CSV cleanup",
    text: "Best for CRM imports, recruiter sheets, and agency delivery.",
    icon: FileSpreadsheet,
    cta: "Clean CSV"
  },
  {
    href: "/tools/extract-emails-from-text?sample=1",
    title: "Emails from pasted text",
    text: "Use when the contacts still live in copied notes or rough blocks.",
    icon: Mail,
    cta: "Extract emails"
  },
  {
    href: "/tools/extract-phone-numbers-from-text?sample=1",
    title: "Phones from pasted text",
    text: "Pull phone numbers out of raw sourcing notes or messy directories.",
    icon: Phone,
    cta: "Extract phones"
  },
  {
    href: "/tools/extract-domains-from-emails?sample=1",
    title: "Domains for enrichment",
    text: "Turn messy emails and URLs into a clean company-domain list.",
    icon: Globe,
    cta: "Extract domains"
  },
];

export const metadata: Metadata = {
  title: "LeadCleanr — Clean Messy Lead CSVs Before CRM Import",
  description:
    "Clean messy lead CSVs before CRM import. Remove duplicates, invalid emails, blank rows, and personal email addresses locally in your browser — no signup or upload.",
  alternates: { canonical: `${getSiteUrl()}/` },
  openGraph: {
    title: "LeadCleanr — Clean Messy Lead CSVs Before CRM Import",
    description:
      "Clean messy lead CSVs before CRM import. Remove duplicates, invalid emails, blank rows, and personal email addresses locally in your browser — no signup or upload.",
    url: `${getSiteUrl()}/`,
    siteName: "LeadCleanr",
    type: "website",
    images: [
      {
        url: `${getSiteUrl()}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "LeadCleanr homepage preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadCleanr — Clean Messy Lead CSVs Before CRM Import",
    description:
      "Clean messy lead CSVs before CRM import. Remove duplicates, invalid emails, blank rows, and personal email addresses locally in your browser — no signup or upload.",
    images: [`${getSiteUrl()}/twitter-image`],
  },
};

const homepageFaqs: FaqItem[] = [
  {
    question: "Is my CSV uploaded to a server?",
    answer:
      "No. LeadCleanr processes CSV files locally in your browser. Your pasted text and uploaded files are not sent to our server for cleaning.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. The free tools can be used without signup, login, or a credit card.",
  },
  {
    question: "What CSV size is supported?",
    answer: "The free browser workflow supports CSV files up to 5MB.",
  },
  {
    question: "Can LeadCleanr remove Gmail and Yahoo addresses?",
    answer:
      "Yes. The CSV Lead Cleaner can filter personal email domains so you can focus on business emails.",
  },
  {
    question: "Can I review removed rows before export?",
    answer:
      "Yes. The CSV workflow lets you review clean rows, removed duplicates, invalid rows, and filtered rows before downloading.",
  },
  {
    question: "What can I export?",
    answer:
      "Depending on the tool, you can export cleaned results as CSV, TXT, or copied text.",
  },
];

export default function HomePage() {
  return (
    <PageFrame>
      <FaqJsonLd faqEntries={homepageFaqs} />
      <section className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16">
          <div>
            <h1 className="section-title mt-4 max-w-none font-display text-[clamp(2.5rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--lc-ink)]">
              Clean messy lead CSVs before CRM import
            </h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-[var(--lc-muted)]">
              Remove duplicates, invalid emails, blank rows, and personal email addresses — 100% in your browser.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools/csv-lead-cleaner"
                className="btn-primary min-h-11 rounded-lg px-5 py-2.5 text-[15px] font-medium"
              >
                Clean CSV Free
              </Link>
              <Link
                href="/tools/csv-lead-cleaner?sample=1"
                className="btn-secondary min-h-11 rounded-lg px-5 py-2.5 text-[15px] font-medium"
              >
                Try Sample CSV
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--lc-muted)]">
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--lc-accent)]" /> No signup</span>
              <span className="text-[var(--lc-hint)]">·</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--lc-accent)]" /> No upload</span>
              <span className="text-[var(--lc-hint)]">·</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--lc-accent)]" /> Browser-only</span>
              <span className="text-[var(--lc-hint)]">·</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--lc-accent)]" /> 5MB free</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)]">
              <div className="grid lg:grid-cols-2">
              <div className="border-b border-[var(--lc-border)] lg:border-r lg:border-b-0 flex flex-col">
                <div className="border-b border-[var(--lc-border)] bg-[#F4F4F2] px-4 py-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--lc-hint)]">
                    Messy CSV
                  </p>
                </div>
                <div className="flex-1 px-4 py-4 font-mono text-[13px] leading-relaxed text-[var(--lc-muted)]">
                  <p>name,email,company,status</p>
                  <p>Jane,JANE@acme.com,Acme,</p>
                  <p>Jane,jane@acme.com,Acme,</p>
                  <p>Bob,bob@gmail.com,Northstar,</p>
                </div>
              </div>

              <div className="relative flex flex-col bg-[#141412]">
                <div className="bg-[var(--lc-ink)] px-4 py-2 shrink-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--lc-hint)]">
                    Cleaned CSV
                  </p>
                </div>
                <div className="flex-1 px-4 py-4">
                  {[
                    { type: "Clean row", value: "jane@acme.com", tone: "bg-emerald-950 text-emerald-300", extra: "business email" },
                    { type: "Removed", value: "jane@acme.com", tone: "bg-amber-950 text-amber-300", extra: "duplicate" },
                    { type: "Removed", value: "bob@gmail.com", tone: "bg-red-950 text-red-300", extra: "personal email" },
                  ].map((item, index) => (
                    <div
                      key={item.value + item.extra}
                      className="homepage-demo-row mb-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 last:mb-0"
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      <div className="min-w-0">
                        <span className={`rounded-full px-2 py-1 font-mono text-[11px] ${item.tone}`}>
                          {item.type}
                        </span>
                        <p className="mt-2 truncate font-mono text-[13px] text-white">
                          {item.value} <span className="text-[var(--lc-muted)]">· {item.extra}</span>
                        </p>
                      </div>
                      <Check className="h-4 w-4 shrink-0 text-[var(--lc-green)]" />
                    </div>
                  ))}
                </div>
              </div>
              </div>

              <div className="border-t border-[var(--lc-border)] bg-[var(--lc-surface)] px-4 py-4">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tools/csv-lead-cleaner?sample=1"
                    className="btn-primary min-h-10 rounded-md px-4 py-2 text-sm font-medium"
                  >
                    Open CSV sample
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/tools/extract-emails-from-text?sample=1"
                    className="btn-secondary min-h-10 rounded-md px-4 py-2 text-sm font-medium"
                  >
                    Try text sample
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--lc-border)] bg-[var(--lc-surface)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 md:items-start">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-semibold text-[var(--lc-ink)]">{step.title}</h2>
                      {index < processSteps.length - 1 ? (
                        <span className="hidden text-[var(--lc-hint)] md:inline">→</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-4xl">
            Built for messy lead workflows
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--lc-muted)]">
            LeadCleanr is designed for the small cleanup jobs that happen before CRM imports, outreach campaigns, recruiting handoffs, and agency delivery.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-3">Sales teams</p>
            <p className="text-[14px] leading-relaxed text-[var(--lc-muted)]">
              Clean scraped prospect CSVs before importing into Apollo, Outreach, HubSpot, or another sales tool.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-3">Recruiters</p>
            <p className="text-[14px] leading-relaxed text-[var(--lc-muted)]">
              Extract candidate emails and phone numbers from sourcing lists, ATS exports, and copied profile notes.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-3">Marketers</p>
            <p className="text-[14px] leading-relaxed text-[var(--lc-muted)]">
              Turn messy email lists into cleaner company-domain lists for ABM, enrichment, and campaign prep.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-3">Agencies & VAs</p>
            <p className="text-[14px] leading-relaxed text-[var(--lc-muted)]">
              Clean client lead sheets before delivery without uploading private contact data to a third-party server.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--lc-border)] bg-[var(--lc-bg)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-4xl">
              What LeadCleanr fixes
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--lc-muted)]">
              Common CSV problems that slow down CRM imports and outreach workflows.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Duplicate emails and repeated rows",
              "Blank rows and missing lead fields",
              "Invalid email formats",
              "Personal email domains like Gmail/Yahoo",
              "Messy phone numbers",
              "Domains extracted from emails",
              "CSV exports ready for CRM import",
              "Browser-only processing with no upload"
            ].map(item => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-[var(--lc-border)] bg-[var(--lc-surface)] p-4 shadow-sm">
                <Check className="h-5 w-5 shrink-0 text-[var(--lc-green)]" />
                <span className="text-[14px] font-medium text-[var(--lc-ink)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="section-eyebrow">Quick Start Paths</p>
        <div className="mt-3 flex items-end justify-between gap-6">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-3xl">
            Pick the workflow that matches the mess.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickStarts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-5 transition-colors hover:border-[var(--lc-accent)] hover:shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--lc-ink)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">{item.text}</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-[var(--lc-border-mid)] px-3 py-1 text-sm font-medium text-[var(--lc-ink)] transition-colors hover:border-[var(--lc-accent)]">
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-[var(--lc-border)]">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)]">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--lc-muted)]">
              Answers about privacy, file limits, exports, and how browser-only CSV cleaning works.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <details className="group rounded-2xl border border-[var(--lc-border)] bg-[var(--lc-surface)] px-5 py-4" open>
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-[15px] text-[var(--lc-ink)] [&::-webkit-details-marker]:hidden">
                Is my CSV uploaded to a server?
                <span className="text-[var(--lc-muted)] transition-transform duration-200 group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <div className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                No. LeadCleanr processes CSV files locally in your browser. Your pasted text and uploaded files are not sent to our server for cleaning.
              </div>
            </details>
            <details className="group rounded-2xl border border-[var(--lc-border)] bg-[var(--lc-surface)] px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-[15px] text-[var(--lc-ink)] [&::-webkit-details-marker]:hidden">
                Do I need an account?
                <span className="text-[var(--lc-muted)] transition-transform duration-200 group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <div className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                No. The free tools can be used without signup, login, or a credit card.
              </div>
            </details>
            <details className="group rounded-2xl border border-[var(--lc-border)] bg-[var(--lc-surface)] px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-[15px] text-[var(--lc-ink)] [&::-webkit-details-marker]:hidden">
                What CSV size is supported?
                <span className="text-[var(--lc-muted)] transition-transform duration-200 group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <div className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                The free browser workflow supports CSV files up to 5MB.
              </div>
            </details>
            <details className="group rounded-2xl border border-[var(--lc-border)] bg-[var(--lc-surface)] px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-[15px] text-[var(--lc-ink)] [&::-webkit-details-marker]:hidden">
                Can LeadCleanr remove Gmail and Yahoo addresses?
                <span className="text-[var(--lc-muted)] transition-transform duration-200 group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <div className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                Yes. The CSV Lead Cleaner can filter personal email domains so you can focus on business emails.
              </div>
            </details>
            <details className="group rounded-2xl border border-[var(--lc-border)] bg-[var(--lc-surface)] px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-[15px] text-[var(--lc-ink)] [&::-webkit-details-marker]:hidden">
                Can I review removed rows before export?
                <span className="text-[var(--lc-muted)] transition-transform duration-200 group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <div className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                Yes. The CSV workflow lets you review clean rows, removed duplicates, invalid rows, and filtered rows before downloading.
              </div>
            </details>
            <details className="group rounded-2xl border border-[var(--lc-border)] bg-[var(--lc-surface)] px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-[15px] text-[var(--lc-ink)] [&::-webkit-details-marker]:hidden">
                What can I export?
                <span className="text-[var(--lc-muted)] transition-transform duration-200 group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <div className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                Depending on the tool, you can export cleaned results as CSV, TXT, or copied text.
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 border-t border-[var(--lc-border)]">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.03em] text-[var(--lc-ink)]">
              Your data never leaves
              <br />
              your browser.
            </h2>
            <div className="mt-5 space-y-2 text-sm leading-6 text-[var(--lc-muted)]">
              <p>✓ CSV parsing and text cleanup happen locally on this device.</p>
              <p>✓ You can test the free workflow without creating an account first.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--lc-ink)]">No signup</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                Open a tool, load a sample, and see the output before committing to anything.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--lc-ink)]">Built for lead ops</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                Designed for CRM imports, outbound cleanup, recruiter sourcing, and agency handoff workflows.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
