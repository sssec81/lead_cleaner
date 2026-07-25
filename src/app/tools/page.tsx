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
import { getToolByPath } from "@/lib/tool-registry";

const csvTools = [
  {
    ...getToolByPath("/tools/extract-emails-from-csv"),
    icon: FolderDown,
    tag: "Email column",
  },
  {
    ...getToolByPath("/tools/extract-phone-numbers-from-csv"),
    icon: Phone,
    tag: "Phone column",
  },
  {
    ...getToolByPath("/tools/remove-empty-rows-from-csv"),
    icon: Rows3,
    tag: "Blank rows",
  },
  {
    ...getToolByPath("/tools/merge-csv-files"),
    icon: Combine,
    tag: "Combine files",
  },
  {
    ...getToolByPath("/tools/split-csv-files"),
    icon: Scissors,
    tag: "Upload limits",
  },
  {
    ...getToolByPath("/tools/convert-csv-to-json"),
    icon: FileJson,
    tag: "Format export",
  },
] as const;

const textExtractionTools = [
  {
    ...getToolByPath("/tools/extract-emails-from-text"),
    icon: Mail,
  },
  {
    ...getToolByPath("/tools/extract-phone-numbers-from-text"),
    icon: Phone,
  },
  {
    ...getToolByPath("/tools/extract-urls-from-text"),
    icon: LinkIcon,
  },
  {
    ...getToolByPath("/tools/extract-domains-from-emails"),
    icon: Globe,
  },
] as const;

const cleanupTools = [
  {
    ...getToolByPath("/tools/validate-email-list"),
    icon: CheckCircle2,
  },
  {
    ...getToolByPath("/tools/clean-email-list"),
    icon: Sparkles,
  },
  {
    ...getToolByPath("/tools/remove-duplicate-emails"),
    icon: CopyX,
  },
  {
    ...getToolByPath("/tools/remove-duplicate-phone-numbers"),
    icon: Phone,
  },
  {
    ...getToolByPath("/tools/remove-duplicate-urls"),
    icon: LinkIcon,
  },
  {
    ...getToolByPath("/tools/count-words-characters-text"),
    icon: Type,
  },
] as const;

export const metadata: Metadata = {
  title: "Lead Cleaning Tools",
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
                <div className="relative flex h-full flex-col items-start overflow-hidden rounded-xl border border-black bg-[var(--lc-ink)] p-6 text-white sm:p-8">
                  <div className="relative mb-6 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                    <span className="h-px w-8 bg-white/40" aria-hidden="true" /> Start here
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
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em]">
                <span className="font-semibold text-[var(--lc-ink)]">
                  Showing all
                </span>
                <span className="h-3 w-px bg-[var(--lc-border-mid)]" aria-hidden="true" />
                <span className="text-[var(--lc-muted)]">
                  CSV-first order
                </span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {csvTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.path}
                    href={tool.path}
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
                      <Link key={tool.path} href={tool.path} className="group -mx-4 flex min-h-14 cursor-pointer items-start gap-3 border-b border-[var(--lc-border)] px-4 py-3 transition-colors last:border-0 hover:rounded-lg hover:bg-[var(--lc-bg)]">
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
                      <Link key={tool.path} href={tool.path} className="group -mx-4 flex min-h-14 cursor-pointer items-start gap-3 border-b border-[var(--lc-border)] px-4 py-3 transition-colors last:border-0 hover:rounded-lg hover:bg-[var(--lc-bg)]">
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
