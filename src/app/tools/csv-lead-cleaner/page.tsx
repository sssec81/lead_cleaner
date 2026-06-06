import type { Metadata } from "next";
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

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Primary Workflow
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Clean, deduplicate, and enrich your lead spreadsheets.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
            Upload any messy CSV of prospects or leads. Select a primary key column to guide deduplication, flag business versus personal email types, isolate role-based support or sales addresses, and export a cleaned copy in seconds—fully processed in your browser.
          </p>
        </div>

        <div className="mt-6">
          <CsvLeadCleanerTool />
        </div>
      </section>
    </PageFrame>
  );
}

