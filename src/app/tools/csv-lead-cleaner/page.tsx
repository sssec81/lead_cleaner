import type { Metadata } from "next";
import Link from "next/link";

import { CsvLeadCleanerTool } from "@/components/csv-lead-cleaner-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

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
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          CSV lead cleaner
        </p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Clean messy lead CSV files before CRM import
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
          Upload a spreadsheet, choose the cleanup rule, review a clear
          cleaning report, and export a cleaner file for outreach, recruiting,
          agency delivery, or your next CRM import without sending raw lead
          data to a backend.
        </p>

        <div className="mt-6">
          <CsvLeadCleanerTool />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <InfoCard
            title="How to use"
            text="Upload a CSV, pick the main cleanup column, choose a dedupe mode, review the report, then export the cleaned file."
          />
          <InfoCard
            title="Use cases"
            text="CRM imports, recruiter spreadsheets, agency lead handoffs, outbound prospect lists, and virtual assistant cleanup work."
          />
          <InfoCard
            title="Why it stands out"
            text="The CSV workflow now includes dedupe modes, generated domains, business vs personal email hints, role inbox detection, and a report before export."
          />
        </div>

        <div className="mt-10 rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)]">
          <h2 className="font-display text-2xl font-semibold">
            Related tools
          </h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              className="rounded-full border border-[color:var(--line)] px-4 py-2 transition hover:bg-white"
              href="/tools/extract-emails-from-csv"
            >
              Extract Emails from CSV
            </Link>
            <Link
              className="rounded-full border border-[color:var(--line)] px-4 py-2 transition hover:bg-white"
              href="/tools/extract-emails-from-text"
            >
              Extract Emails from Text
            </Link>
            <Link
              className="rounded-full border border-[color:var(--line)] px-4 py-2 transition hover:bg-white"
              href="/tools/extract-domains-from-emails"
            >
              Extract Domains from Emails
            </Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)]">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
        {text}
      </p>
    </div>
  );
}
