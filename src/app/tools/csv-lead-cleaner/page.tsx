import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileSpreadsheet, ShieldCheck, Sparkles } from "lucide-react";

import { CsvLeadCleanerTool } from "@/components/csv-lead-cleaner-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

const workflowPoints = [
  "Choose the cleanup field that should drive deduplication",
  "Review invalid rows, blanks, and duplicate removals before export",
  "Flag personal inboxes, role-based emails, and generated domains when available",
];

const useCases = [
  "CRM imports that need one clean pass before upload",
  "Recruiter spreadsheets with duplicates, weak rows, or mixed inbox types",
  "Agency lead handoffs that need a clearer, more trustworthy export",
];

const trustNotes = [
  {
    title: "Browser-side processing",
    text: "Basic CSV parsing and cleanup stay in the browser for the MVP flow.",
  },
  {
    title: "Free plan boundary",
    text: "Free supports CSV uploads up to 2 MB. Larger files are the future Pro upgrade path.",
  },
  {
    title: "Workflow-first output",
    text: "The goal is not just extraction. It is leaving with a file that is easier to import and easier to trust.",
  },
];

export const metadata: Metadata = buildToolMetadata({
  title: "CSV Lead Cleaner",
  description:
    "Clean messy lead CSV files before CRM import. Upload a CSV, choose a cleanup rule, review the report, and export a cleaner file in your browser.",
  path: "/tools/csv-lead-cleaner",
  keywords: [
    "csv lead cleaner",
    "clean csv online",
    "dedupe csv leads",
    "lead list csv cleanup",
  ],
});

export default function CsvLeadCleanerPage() {
  return (
    <PageFrame>
      <ToolJsonLd
        title="CSV Lead Cleaner"
        description="Clean messy lead CSV files before CRM import. Upload a CSV, choose a cleanup rule, review the report, and export a cleaner file in your browser."
        path="/tools/csv-lead-cleaner"
        category="BusinessApplication"
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-strong)]">
              CSV lead cleaner
            </p>
            <h1 className="mt-4 max-w-5xl font-display text-4xl font-semibold leading-[0.95] sm:text-5xl lg:text-6xl">
              Clean the spreadsheet before it creates a mess somewhere else
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
              Upload a lead CSV, clean around the field that matters most,
              review the changes, and export a more believable file for CRM
              import, outreach, recruiting, or agency delivery.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[color:rgba(15,118,110,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(236,252,250,0.74))] p-6 shadow-[var(--shadow)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
              What this page is for
            </p>
            <p className="mt-3 text-base leading-7 text-[color:var(--foreground)]">
              This is the core workflow page in LeadCleanr. The tool is meant
              to feel like a working desk utility, not a one-off regex helper.
            </p>
          </div>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Before you upload
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
              This works best when you already know which column drives the cleanup
            </h2>
            <div className="mt-6 grid gap-3">
              {workflowPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-[1.45rem] border border-[color:var(--line)] bg-white/82 px-4 py-4"
                >
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-strong)]" />
                  <p className="text-sm leading-6 text-[color:var(--foreground)]">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--line)] bg-white/76 p-6 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
              Best fit
            </p>
            <div className="mt-4 grid gap-4">
              {useCases.map((item) => (
                <UseCaseCard key={item} text={item} />
              ))}
            </div>
          </div>
        </section>

        <div className="mt-8">
          <CsvLeadCleanerTool />
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-white/76 p-6 shadow-[var(--shadow)] sm:p-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-[color:var(--accent)]" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
                  Trust notes
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                  Keep the workflow believable
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {trustNotes.map((note) => (
                <InfoCard key={note.title} title={note.title} text={note.text} />
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Related paths
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Keep the CSV workflow central, then branch out only when needed
            </h2>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 transition hover:-translate-y-0.5"
                href="/tools/extract-emails-from-csv"
              >
                Extract Emails from CSV
              </Link>
              <Link
                className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 transition hover:-translate-y-0.5"
                href="/tools/extract-emails-from-text"
              >
                Extract Emails from Text
              </Link>
              <Link
                className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 transition hover:-translate-y-0.5"
                href="/tools/extract-domains-from-emails"
              >
                Extract Domains from Emails
              </Link>
            </div>

            <Link
              href="/tools"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]"
            >
              Browse the full tool map
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </section>
    </PageFrame>
  );
}

function UseCaseCard({ text }: { text: string }) {
  return (
    <div className="rounded-[1.55rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
      <div className="flex items-start gap-3">
        <FileSpreadsheet className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-strong)]" />
        <p className="text-sm leading-7 text-[color:var(--muted)]">{text}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.55rem] border border-[color:var(--line)] bg-white/82 p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{text}</p>
    </div>
  );
}
