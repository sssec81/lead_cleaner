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
  Shield,
  ShieldCheck,
  Upload,
  Users,
  Wand2,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { FaqJsonLd, SiteJsonLd, type FaqItem, getSiteUrl } from "@/lib/seo";
import { FaqAccordion } from "@/components/faq-accordion";
import { FREE_CSV_LIMIT_MB } from "@/lib/product-config";
import { TOOL_COUNT } from "@/lib/tool-registry";

const processSteps = [
  {
    title: "Choose the CRM destination",
    text: "Start with HubSpot, Salesforce, Apollo, Pipedrive, or a clean CSV.",
    icon: Users,
  },
  {
    title: "Clean, map, and preflight",
    text: "Apply cleanup rules, map fields, and check every row before import.",
    icon: Wand2,
  },
  {
    title: "Export or repair failures",
    text: "Download importable rows, then repair any CRM error file locally.",
    icon: Download,
  },
];

const quickStarts = [
  {
    href: "/tools/hubspot-csv-import-cleaner",
    title: "HubSpot import preflight",
    text: "Map contact properties and catch blocked rows before HubSpot import.",
    icon: FileSpreadsheet,
    cta: "Prepare for HubSpot"
  },
  {
    href: "/tools/salesforce-csv-import-cleaner",
    title: "Salesforce lead preflight",
    text: "Validate required lead values and export Salesforce-ready columns.",
    icon: Users,
    cta: "Prepare for Salesforce"
  },
  {
    href: "/tools/apollo-csv-import-cleaner",
    title: "Apollo contact preflight",
    text: "Map contact identity and company fields before uploading to Apollo.",
    icon: Mail,
    cta: "Prepare for Apollo"
  },
  {
    href: "/tools/pipedrive-csv-import-cleaner",
    title: "Pipedrive people preflight",
    text: "Build person and organization fields with row-level readiness checks.",
    icon: Globe,
    cta: "Prepare for Pipedrive"
  },
];

const audiences = [
  {
    title: "Sales teams",
    text: "Clean prospect CSVs before they reach Apollo, Outreach, HubSpot, or your sales workflow.",
    icon: FileSpreadsheet,
  },
  {
    title: "Recruiters",
    text: "Extract candidate emails and phone numbers from ATS exports, sourcing lists, and copied notes.",
    icon: Users,
  },
  {
    title: "Marketers",
    text: "Turn mixed email lists into cleaner company-domain data for enrichment and campaign prep.",
    icon: Globe,
  },
  {
    title: "Agencies & VAs",
    text: "Prepare client lead sheets for handoff without sending private contact data to another server.",
    icon: Wand2,
  },
];

const cleanupGroups = [
  {
    title: "Duplicates and gaps",
    text: "Remove repeated contacts, empty rows, and incomplete records before they block an import.",
    icon: FileSpreadsheet,
  },
  {
    title: "Email readiness",
    text: "Catch invalid formats and separate personal addresses such as Gmail or Yahoo.",
    icon: Mail,
  },
  {
    title: "CRM-ready structure",
    text: "Map and export cleaner columns for HubSpot, Salesforce, Apollo, and Pipedrive.",
    icon: Users,
  },
  {
    title: "Private by default",
    text: "Parse and clean on your device, with no lead-list upload required for the free workflow.",
    icon: Shield,
  },
];

export const metadata: Metadata = {
  title: { absolute: "LeadCleanr — Clean Lead CSVs Before CRM Import" },
  description:
    "Clean lead CSVs before CRM import. Remove duplicates, invalid emails, blank rows, and personal addresses locally in your browser. No signup required.",
  alternates: { canonical: `${getSiteUrl()}/` },
  openGraph: {
    title: "LeadCleanr — Clean Lead CSVs Before CRM Import",
    description:
      "Clean lead CSVs before CRM import. Remove duplicates, invalid emails, blank rows, and personal addresses locally in your browser.",
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
    title: "LeadCleanr — Clean Lead CSVs Before CRM Import",
    description:
      "Clean lead CSVs before CRM import. Remove duplicates, invalid emails, blank rows, and personal addresses locally in your browser.",
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
    answer: `The free browser workflow supports CSV files up to ${FREE_CSV_LIMIT_MB} MB.`,
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
      <SiteJsonLd />
      <section className="home-hero mx-auto max-w-7xl overflow-hidden px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--lc-muted)]">
              <span className="h-px w-8 bg-[var(--lc-border-mid)]" aria-hidden="true" />
              <ShieldCheck className="h-4 w-4 text-[var(--lc-green)]" aria-hidden="true" />
              Private lead operations, in your browser
            </div>
            <h1 className="font-display text-[38px] font-bold leading-[1.06] tracking-[-0.045em] text-[var(--lc-ink)] sm:text-[50px] lg:text-[60px]">
              Clean lead CSVs.
              <span className="mt-1 block text-[var(--lc-accent)]">Import with confidence.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-7 text-[var(--lc-muted)] sm:text-[18px]">
              Clean, map, preflight, and repair HubSpot, Salesforce, Apollo, and Pipedrive imports without uploading sensitive lead information.
            </p>
 
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools/csv-lead-cleaner?crm=hubspot"
                className="lc-button-primary py-2.5 px-6"
              >
                Start CRM preflight
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

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 border-t border-[var(--lc-border)] pt-6" aria-label="Product facts">
              <div className="lc-metric">
                <p className="font-display text-lg font-bold text-[var(--lc-ink)]">{TOOL_COUNT}</p>
                <p className="mt-0.5 text-[11px] leading-4 text-[var(--lc-muted)]">focused tools</p>
              </div>
              <div className="lc-metric">
                <p className="font-display text-lg font-bold text-[var(--lc-ink)]">{FREE_CSV_LIMIT_MB} MB</p>
                <p className="mt-0.5 text-[11px] leading-4 text-[var(--lc-muted)]">free CSV limit</p>
              </div>
              <div className="lc-metric">
                <p className="font-display text-lg font-bold text-[var(--lc-ink)]">0</p>
                <p className="mt-0.5 text-[11px] leading-4 text-[var(--lc-muted)]">uploads needed</p>
              </div>
            </div>
          </div>
 
          <div className="lc-hero-panel relative">
            <div className="lc-workspace-shell">
              {/* App Window Top Bar */}
              <div className="flex items-center justify-between border-b border-[var(--lc-border)] bg-[var(--background-strong)] px-4 py-2">
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
                <div className="border-b border-[var(--lc-border)] lg:border-r lg:border-b-0 flex flex-col bg-[var(--lc-surface-muted)] p-5">
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
              <div className="border-t border-[var(--lc-border)] bg-[var(--lc-surface-muted)] px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--lc-muted)] font-medium">
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

      <section className="border-b border-[var(--lc-border)] bg-[var(--lc-surface)] py-12">
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
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience) => {
            const Icon = audience.icon;
            return (
              <article key={audience.title} className="lc-card lc-audience-card p-6">
                <div className="lc-icon-tile h-10 w-10">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-[15px] font-semibold text-[var(--lc-ink)]">{audience.title}</h3>
                <p className="relative z-10 mt-2 text-[14px] leading-6 text-[var(--lc-muted)]">{audience.text}</p>
              </article>
            );
          })}
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
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {cleanupGroups.map((group) => {
              const Icon = group.icon;
              return (
                <article key={group.title} className="lc-card flex items-start gap-4 p-5 sm:p-6">
                  <div className="lc-icon-tile h-11 w-11 shrink-0">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[var(--lc-ink)]">{group.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-6 text-[var(--lc-muted)]">{group.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="section-eyebrow">CRM Import Workflows</p>
        <div className="mt-3 flex items-end justify-between gap-6">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-3xl">
            Start with the system receiving the data.
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
                <div className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-[var(--lc-border-mid)] py-1 text-sm font-semibold text-[var(--lc-ink)] transition-colors group-hover:border-[var(--lc-accent)] group-hover:text-[var(--lc-accent)]">
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
