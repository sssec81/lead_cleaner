import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Globe,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Upload,
  Users,
  Wand2,
  Plus,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { FaqJsonLd, type FaqItem, getSiteUrl } from "@/lib/seo";
import { FaqAccordion } from "@/components/faq-accordion";

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
      <section className="mx-auto max-w-7xl overflow-hidden px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--lc-border)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--lc-muted)] shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-[var(--lc-green)]" aria-hidden="true" />
              Private lead operations, in your browser
            </div>
            <h1 className="font-display text-[38px] font-bold leading-[1.06] tracking-[-0.045em] text-[var(--lc-ink)] sm:text-[50px] lg:text-[60px]">
              Clean messy lead lists.
              <span className="mt-1 block text-[var(--lc-accent)]">Export with confidence.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-7 text-[var(--lc-muted)] sm:text-[18px]">
              Turn raw CSVs and contact lists into CRM-ready data without uploading sensitive lead information.
            </p>
 
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools/csv-lead-cleaner"
                className="lc-button-primary py-2.5 px-6"
              >
                Try CSV Cleaner
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/tools"
                className="lc-button-secondary py-2.5 px-6"
              >
                Browse Tools
              </Link>
            </div>
 
            <div className="mt-6 flex flex-wrap items-center gap-2 font-sans text-xs text-[var(--lc-muted)]" aria-label="Product benefits">
              <span className="lc-chip lc-chip-success"><Check className="h-3 w-3" aria-hidden="true" /> Runs locally</span>
              <span className="lc-chip"><Check className="h-3 w-3" aria-hidden="true" /> No signup</span>
              <span className="lc-chip"><Check className="h-3 w-3" aria-hidden="true" /> CSV + text tools</span>
            </div>
          </div>
 
          <div className="lc-hero-panel relative">
            <div className="lc-workspace-shell">
              {/* App Window Top Bar */}
              <div className="flex items-center justify-between border-b border-[var(--lc-border)] bg-[#F1F1F4] px-4 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-black/10"></span>
                  <span className="h-2 w-2 rounded-full bg-black/10"></span>
                  <span className="h-2 w-2 rounded-full bg-black/10"></span>
                </div>
                <span className="text-[11px] font-medium text-[var(--lc-muted)] font-sans">leadcleanr-demo.csv</span>
                <div className="w-10"></div>
              </div>
              <div className="grid lg:grid-cols-2">
                {/* Left Panel: Upload/Paste/Options */}
                <div className="border-b border-[var(--lc-border)] lg:border-r lg:border-b-0 flex flex-col bg-[#F9F9FB] p-5">
                  <div className="border border-dashed border-black/10 rounded-xl p-6 text-center bg-white flex flex-col items-center justify-center">
                    <Upload className="h-6 w-6 text-[var(--lc-accent)] mb-2" />
                    <p className="text-[13px] font-semibold text-[var(--lc-ink)]">Drop CSV here</p>
                    <p className="text-[11px] text-[var(--lc-muted)] mt-0.5">or choose a file</p>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-tight text-[var(--lc-muted)]">Target Column</span>
                      <div className="mt-1 w-full rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-[var(--lc-ink)] flex items-center justify-between">
                        <span>Email</span>
                        <ChevronDown className="h-3.5 w-3.5 text-black/30" aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-tight text-[var(--lc-muted)]">Deduplicate</span>
                      <div className="mt-1 w-full rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-[var(--lc-ink)] flex items-center justify-between">
                        <span>Remove duplicates</span>
                        <ChevronDown className="h-3.5 w-3.5 text-black/30" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
 
                {/* Right Panel: Clean Preview / Export */}
                <div className="relative flex flex-col bg-white p-5">
                  <span className="text-[11px] font-bold uppercase tracking-tight text-[var(--lc-muted)] mb-2">Cleaned Rows Preview</span>
                  <div className="flex-1 space-y-2">
                    {[
                      { type: "Clean", value: "jane@acme.com", tone: "bg-emerald-50 text-emerald-700 border border-emerald-100", extra: "business" },
                      { type: "Removed", value: "jane@acme.com", tone: "bg-amber-50 text-amber-700 border border-amber-100", extra: "duplicate" },
                      { type: "Removed", value: "bob@gmail.com", tone: "bg-red-50 text-red-700 border border-red-100", extra: "personal" },
                    ].map((item, index) => (
                      <div
                        key={item.value + item.extra}
                        className="homepage-demo-row flex items-center justify-between gap-2 rounded-lg border border-black/5 bg-black/[0.01] px-2.5 py-1.5 last:mb-0"
                        style={{ animationDelay: `${index * 120}ms` }}
                      >
                        <div className="min-w-0">
                          <span className={`rounded px-1.5 py-0.5 font-sans text-[10px] font-medium ${item.tone}`}>
                            {item.type}
                          </span>
                          <p className="mt-1 truncate font-mono text-[11px] text-[var(--lc-ink)]">
                            {item.value} <span className="text-[var(--lc-muted)]">· {item.extra}</span>
                          </p>
                        </div>
                        <Check className="h-3.5 w-3.5 shrink-0 text-[var(--lc-green)]" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 border-t border-black/5 pt-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700">1,145 ready leads</span>
                    <Link href="/tools/csv-lead-cleaner" className="lc-button-primary px-3.5 text-xs font-semibold">
                      Open cleaner
                    </Link>
                  </div>
                </div>
              </div>
 
              {/* Bottom: Slim Stats Strip */}
              <div className="border-t border-[var(--lc-border)] bg-[#F9F9FB] px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--lc-muted)] font-medium">
                <span>1,361 total rows</span>
                <span className="text-black/10">·</span>
                <span>184 duplicates removed</span>
                <span className="text-black/10">·</span>
                <span>32 invalid removed</span>
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
                <div key={step.title} className="flex items-start gap-4 rounded-2xl p-2 transition-colors hover:bg-[var(--lc-bg)]">
                  <div className="lc-icon-tile h-11 w-11 shrink-0">
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

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-4xl">
            Built for messy lead workflows
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--lc-muted)]">
            LeadCleanr is designed for the small cleanup jobs that happen before CRM imports, outreach campaigns, recruiting handoffs, and agency delivery.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lc-card p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-3">Sales teams</p>
            <p className="text-[14px] leading-relaxed text-[var(--lc-muted)]">
              Clean scraped prospect CSVs before importing into Apollo, Outreach, HubSpot, or another sales tool.
            </p>
          </div>
          <div className="lc-card p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-3">Recruiters</p>
            <p className="text-[14px] leading-relaxed text-[var(--lc-muted)]">
              Extract candidate emails and phone numbers from sourcing lists, ATS exports, and copied profile notes.
            </p>
          </div>
          <div className="lc-card p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-3">Marketers</p>
            <p className="text-[14px] leading-relaxed text-[var(--lc-muted)]">
              Turn messy email lists into cleaner company-domain lists for ABM, enrichment, and campaign prep.
            </p>
          </div>
          <div className="lc-card p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-3">Agencies & VAs</p>
            <p className="text-[14px] leading-relaxed text-[var(--lc-muted)]">
              Clean client lead sheets before delivery without uploading private contact data to a third-party server.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--lc-border)] bg-[var(--lc-bg)] py-12">
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
              <div key={item} className="lc-card flex items-start gap-3 p-4">
                <Check className="h-5 w-5 shrink-0 text-[var(--lc-green)]" />
                <span className="text-[14px] font-medium text-[var(--lc-ink)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
                className="lc-card-interactive group p-5"
              >
                <div className="lc-icon-tile h-12 w-12 transition-transform duration-200 group-hover:scale-105">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--lc-ink)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">{item.text}</p>
                <div className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--lc-border-mid)] px-4 py-1 text-sm font-semibold text-[var(--lc-ink)] transition-colors group-hover:border-[var(--lc-accent)] group-hover:text-[var(--lc-accent)]">
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-[var(--lc-border)] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)]">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--lc-muted)]">
              Answers about privacy, file limits, exports, and how browser-only CSV cleaning works.
            </p>
          </div>
          <div>
            <FaqAccordion items={homepageFaqs} defaultOpenIndex={0} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-[var(--lc-border)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="lc-card p-6">
            <div className="lc-icon-tile h-12 w-12">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.03em] text-[var(--lc-ink)]">
              Your data never leaves
              <br />
              your browser.
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-6 text-[var(--lc-muted)]">
              <p className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[var(--lc-green)]" aria-hidden="true" /> CSV parsing and text cleanup happen locally on this device.</p>
              <p className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[var(--lc-green)]" aria-hidden="true" /> You can test the free workflow without creating an account first.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="lc-card p-6">
              <div className="lc-icon-tile h-10 w-10">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--lc-ink)]">No signup</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                Open a tool, load a sample, and see the output before committing to anything.
              </p>
            </div>
            <div className="lc-card p-6">
              <div className="lc-icon-tile h-10 w-10">
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
