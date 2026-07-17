import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  BarChart3,
  CheckCircle2,
  CopyX,
  FileJson,
  FileSpreadsheet,
  FolderDown,
  Globe,
  Link as LinkIcon,
  Mail,
  Phone,
  Rows3,
  Scissors,
  Sparkles,
  Type,
  Combine,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { BreadcrumbJsonLd, getSiteUrl } from "@/lib/seo";

const csvTools = [
  {
    href: "/tools/extract-emails-from-csv",
    title: "Extract Emails from CSV",
    description: "Pull, validate, and export the email column only.",
    icon: FolderDown,
    tag: "Email column",
  },
  {
    href: "/tools/extract-phone-numbers-from-csv",
    title: "Extract Phones from CSV",
    description: "Detect phone columns and standardize formats quickly.",
    icon: Phone,
    tag: "Phone column",
  },
  {
    href: "/tools/remove-empty-rows-from-csv",
    title: "Remove Empty CSV Rows",
    description: "Delete blank spreadsheet rows before import or merge.",
    icon: Rows3,
    tag: "Blank rows",
  },
  {
    href: "/tools/merge-csv-files",
    title: "Merge CSV Files",
    description: "Combine multiple CSVs and align headers automatically.",
    icon: Combine,
    tag: "Combine files",
  },
  {
    href: "/tools/split-csv-files",
    title: "Split CSV Files",
    description: "Break large CSVs into smaller chunks for upload limits.",
    icon: Scissors,
    tag: "Upload limits",
  },
  {
    href: "/tools/convert-csv-to-json",
    title: "Convert CSV to JSON",
    description: "Turn rows into structured JSON arrays instantly.",
    icon: FileJson,
    tag: "Format export",
  },
];

const textExtractionTools = [
  {
    href: "/tools/extract-emails-from-text",
    title: "Extract Emails",
    description: "Pull email addresses out of copied blocks of text.",
    icon: Mail,
  },
  {
    href: "/tools/extract-phone-numbers-from-text",
    title: "Extract Phone Numbers",
    description: "Find and normalize phone numbers in raw pasted text.",
    icon: Phone,
  },
  {
    href: "/tools/extract-urls-from-text",
    title: "Extract URLs",
    description: "Pull links out of noisy copied content.",
    icon: LinkIcon,
  },
  {
    href: "/tools/extract-domains-from-emails",
    title: "Extract Domains",
    description: "Get domains from email lists for enrichment workflows.",
    icon: Globe,
  },
];

const cleanupTools = [
  {
    href: "/tools/validate-email-list",
    title: "Validate Email List",
    description: "Check list structure and syntax before sending.",
    icon: CheckCircle2,
  },
  {
    href: "/tools/clean-email-list",
    title: "Clean Email List",
    description: "Normalize and tidy a pasted email list.",
    icon: Sparkles,
  },
  {
    href: "/tools/remove-duplicate-emails",
    title: "Remove Duplicate Emails",
    description: "Keep only unique email values.",
    icon: CopyX,
  },
  {
    href: "/tools/remove-duplicate-phone-numbers",
    title: "Remove Duplicate Phones",
    description: "Deduplicate phone numbers from raw input.",
    icon: Phone,
  },
  {
    href: "/tools/remove-duplicate-urls",
    title: "Remove Duplicate URLs",
    description: "Deduplicate copied links and URL lists.",
    icon: LinkIcon,
  },
  {
    href: "/tools/count-words-characters-text",
    title: "Count Words / Characters",
    description: "Quick counts for copied text and drafts.",
    icon: Type,
  },
];

export const metadata: Metadata = {
  title: "All Lead Cleaning Tools — LeadCleanr",
  description:
    "Choose the right LeadCleanr workflow fast. Start with the CSV cleaner for spreadsheets, then use compact helper tools only when the input is still raw text.",
  alternates: {
    canonical: `${getSiteUrl()}/tools`,
  },
};

const workflowSteps = [
  {
    question: "Have a spreadsheet?",
    label: "Use CSV Lead Cleaner",
    href: "/tools/csv-lead-cleaner",
  },
  {
    question: "Copied or pasted text?",
    label: "Use text extractors",
    href: "#text-extraction",
  },
  {
    question: "Done extracting text?",
    label: "Now clean your CSV",
    href: "/tools/csv-lead-cleaner",
  },
];

export default function ToolsPage() {
  return (
    <PageFrame>
      <div className="bg-[var(--lc-bg)] pb-12">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "/" },
            { name: "Tools", url: "/tools" },
          ]}
        />

        {/* Zone 1: Page header */}
        <section className="pb-8 pt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="section-anchor-row mb-4">
                <span className="section-anchor-label">
                  All Tools
                </span>
                <div className="section-anchor-line h-px flex-1 max-w-28" />
              </div>
              <h1 className="font-display text-[clamp(2.25rem,7vw,2.75rem)] font-bold tracking-[-0.025em] text-[var(--lc-ink)] leading-tight mb-4">
                Pick the right tool in one pass.
              </h1>
              <p className="font-sans text-[15px] text-[var(--lc-muted)] leading-relaxed max-w-xl">
                Upload your spreadsheet or paste raw text. LeadCleanr helps you
                clean, deduplicate, and prep it for your CRM in seconds.
              </p>
            </div>
          </div>
        </section>

        {/* Zone 2: Featured tool + workflow logic */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-12">

              {/* Left Card 7/12 */}
              <div className="lg:col-span-7">
                <div className="relative flex h-full flex-col items-start overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,#111827_0%,#1d1d1f_55%,#10233b_100%)] p-6 text-white shadow-[var(--shadow-strong)] sm:p-8">
                  <div aria-hidden="true" className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
                  <div className="relative mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-blue-100">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Start here
                  </div>
                  <h2 className="relative mb-2 font-display text-[1.875rem] font-bold tracking-[-0.025em] text-white">
                    CSV Lead Cleaner
                  </h2>
                  <p className="relative max-w-md font-sans text-[15px] leading-7 text-white/75">
                    The default path for CRM imports, recruiter sheets, agency handoffs, and outreach lists that need a full cleanup pass.
                  </p>
                  <p className="relative mt-3 text-sm text-white/60">
                    Deduplicate · Review · Export - all in-browser
                  </p>

                  <Link
                    href="/tools/csv-lead-cleaner"
                    className="lc-button-primary relative mt-6 min-h-11 px-5 py-2.5 text-sm font-semibold"
                  >
                    Open CSV workflow
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right Panel 5/12 */}
              <div className="lg:col-span-5">
                <div className="lc-card h-full p-5 sm:p-6">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[var(--lc-muted)] mb-6">
                    Workflow Logic
                  </p>

                  <div className="flex flex-col gap-3">
                    {workflowSteps.map((step, index) => (
                      <div
                        key={step.question}
                        className="rounded-lg border border-[var(--lc-border)] bg-[var(--lc-bg)] px-4 py-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--lc-accent-bg)] text-[11px] font-semibold text-[var(--lc-accent)]">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1 border-l-2 border-[var(--lc-accent)] pl-3">
                            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--lc-muted)]">
                              {step.question}
                            </p>
                            <Link
                              href={step.href}
                              className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[var(--lc-accent)] hover:text-[var(--brand-strong)]"
                            >
                              {step.label}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Zone 3: Tool Directory */}
        <section className="border-t border-[var(--lc-border)] py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lc-muted)]">
                    CSV Helpers
                  </span>
                  <div className="h-px w-16 bg-[var(--lc-border)]" />
                </div>
                <h2 className="font-sans text-[1.25rem] font-semibold text-[var(--lc-ink)]">
                  One focused action on your spreadsheet.
                </h2>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full border border-[var(--lc-ink)] bg-[var(--lc-ink)] px-3 py-1 text-xs font-medium text-white">
                  Showing all
                </span>
                <span className="rounded-full border border-[var(--lc-border)] bg-transparent px-3 py-1 text-xs font-medium text-[var(--lc-muted)]">
                  CSV-first order
                </span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {csvTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    aria-label={`Open ${tool.title}`}
                    className="lc-card-interactive group flex flex-col gap-3 p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="lc-icon-tile h-10 w-10 transition-transform duration-200 group-hover:scale-105">
                        <Icon className="h-5 w-5 text-[var(--lc-accent)]" />
                      </div>
                      <span className="rounded border border-[var(--lc-border)] bg-[var(--lc-bg)] px-2 py-0.5 font-mono text-[11px] uppercase text-[var(--lc-muted)]">
                        {tool.tag}
                      </span>
                    </div>
                    <h3 className="font-sans text-[15px] font-medium text-[var(--lc-ink)] mt-2">
                      {tool.title}
                    </h3>
                    <p className="font-sans text-[13px] leading-relaxed text-[var(--lc-muted)]">
                      {tool.description}
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-auto inline-flex min-h-11 items-center pt-3 text-sm font-semibold text-[var(--lc-accent)]"
                    >
                      Open tool →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section id="text-extraction" className="border-t border-[var(--lc-border)] py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">

              <div className="lc-card border-l-2 border-l-[var(--lc-accent)] p-5 sm:p-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[var(--lc-muted)] mb-2">
                  Text Extraction
                </p>
                <h2 className="font-sans text-[1.25rem] font-semibold text-[var(--lc-ink)] mb-2">
                  Input is still messy copied text.
                </h2>
                <p className="mb-6 font-sans text-sm text-[var(--lc-muted)]">
                  Use these when you have notes, pasted pages, or signatures.
                </p>

                <div className="flex flex-col">
                  {textExtractionTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link key={tool.href} href={tool.href} className="group -mx-4 flex min-h-14 cursor-pointer items-start gap-3 border-b border-[var(--lc-border)] px-4 py-3 transition-colors last:border-0 hover:rounded-lg hover:bg-[var(--lc-bg)]">
                        <Icon className="h-[18px] w-[18px] mt-0.5 text-[var(--lc-muted)] transition-colors group-hover:text-[var(--lc-accent)] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-sans text-[14px] font-medium text-[var(--lc-ink)]">{tool.title}</h3>
                          <p className="font-sans text-sm text-[var(--lc-muted)]">{tool.description}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 mt-1 text-[var(--lc-hint)] transition-colors group-hover:text-[var(--lc-accent)] shrink-0 ml-auto" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="lc-card border-l-2 border-l-[var(--lc-accent)] p-5 sm:p-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[var(--lc-muted)] mb-2">
                  Quick Cleanup
                </p>
                <h2 className="font-sans text-[1.25rem] font-semibold text-[var(--lc-ink)] mb-2">
                  You only need one cleanup utility.
                </h2>
                <p className="mb-6 font-sans text-sm text-[var(--lc-muted)]">
                  Small sharp tools for validation, dedupe, or quick measurement.
                </p>

                <div className="flex flex-col">
                  {cleanupTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link key={tool.href} href={tool.href} className="group -mx-4 flex min-h-14 cursor-pointer items-start gap-3 border-b border-[var(--lc-border)] px-4 py-3 transition-colors last:border-0 hover:rounded-lg hover:bg-[var(--lc-bg)]">
                        <Icon className="h-[18px] w-[18px] mt-0.5 text-[var(--lc-muted)] transition-colors group-hover:text-[var(--lc-accent)] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-sans text-[14px] font-medium text-[var(--lc-ink)]">{tool.title}</h3>
                          <p className="font-sans text-sm text-[var(--lc-muted)]">{tool.description}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 mt-1 text-[var(--lc-hint)] transition-colors group-hover:text-[var(--lc-accent)] shrink-0 ml-auto" />
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </PageFrame>
  );
}
