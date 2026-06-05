import type { Metadata } from "next";
import { CsvLeadCleanerTool } from "@/components/csv-lead-cleaner-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

const setupNotes = [
  "This works best when you already know which column should drive the cleanup decision.",
  "The tool is most useful when the file needs reviewing, not just extraction.",
  "Treat the report as part of the output, not just the CSV export button.",
];

const useCases = [
  "CRM imports that need one careful cleanup pass before upload.",
  "Recruiter spreadsheets with duplicates, weak rows, or mixed inbox types.",
  "Agency lead handoffs that need a more defendable file before delivery.",
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
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-strong)]">
          CSV Lead Cleaner
        </p>

        <section className="mt-6 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2.2rem] border border-[color:var(--line)] bg-white/82 p-7 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Before you upload
            </p>
            <div className="mt-6 space-y-5">
              {setupNotes.map((note, index) => (
                <div
                  key={note}
                  className={index === 0 ? "" : "border-t border-[color:rgba(16,37,52,0.1)] pt-5"}
                >
                  <p className="text-sm leading-7 text-[color:var(--foreground)] sm:text-base">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 border-t border-[color:rgba(16,37,52,0.12)] pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
              Best fit
            </p>
            {useCases.map((item) => (
              <p
                key={item}
                className="border-t border-[color:rgba(16,37,52,0.1)] pt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base"
              >
                {item}
              </p>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <CsvLeadCleanerTool />
        </div>
      </section>
    </PageFrame>
  );
}
