import type { Metadata } from "next";
import { BarChart3, Shield, Users } from "lucide-react";
import { Suspense } from "react";

import { PageFrame } from "@/components/page-frame";
import { RemoveEmptyRowsCsvTool } from "@/components/remove-empty-rows-csv-tool";
import { ToolSeoSections } from "@/components/tool-seo-sections";
import { BreadcrumbJsonLd, buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Remove Empty Rows from CSV Online — Free Tool",
  description:
    "Upload a CSV to instantly delete all empty and blank rows. Export a perfectly clean spreadsheet without opening Excel.",
  path: "/tools/remove-empty-rows-from-csv",
  keywords: [
    "remove empty rows from csv",
    "delete blank rows csv",
    "clean empty cells csv",
    "csv empty row remover",
  ],
});

export default function RemoveEmptyRowsFromCsvPage() {
  return (
    <PageFrame>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Remove Empty Rows from CSV", url: "/tools/remove-empty-rows-from-csv" },
        ]}
      />
      <ToolJsonLd
        name="Remove Empty Rows from CSV"
        title="Remove Empty Rows from CSV Online — Free Tool"
        description="Upload a CSV to instantly delete all empty and blank rows. Export a perfectly clean spreadsheet without opening Excel."
        path="/tools/remove-empty-rows-from-csv"
        category="UtilitiesApplication"
      />
      <main className="relative bg-[var(--lc-bg)] pb-16 pt-4 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl pb-6 pt-12 text-center sm:mx-0 sm:text-left">
            <div className="section-eyebrow mb-4">CSV TOOL</div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
              Remove Empty Rows from CSV
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
              Upload your CSV and drop rows that are completely empty, so the
              spreadsheet is easier to review, merge, and import afterward.
            </p>

            <div className="trust-chip-row mt-6 justify-center sm:justify-start">
              <div className="trust-chip">
                <Shield className="h-4 w-4 text-[var(--lc-accent)]" />
                <span>Browser-only</span>
              </div>
              <div className="trust-chip">
                <Users className="h-4 w-4 text-[var(--lc-accent)]" />
                <span>No account needed</span>
              </div>
              <div className="trust-chip">
                <BarChart3 className="h-4 w-4 text-[var(--lc-accent)]" />
                <span>Up to 5MB free</span>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <Suspense
              fallback={
                <div className="flex h-96 items-center justify-center text-[var(--lc-muted)]">
                  Loading tool...
                </div>
              }
            >
              <RemoveEmptyRowsCsvTool />
            </Suspense>
          </div>

          <ToolSeoSections
            howItWorksTitle="Remove blank spreadsheet rows without changing the rest of the file"
            howItWorksIntro="This tool is for the narrow structural cleanup pass that often happens before dedupe, merge, or CRM import. Instead of sorting manually in Excel, you can upload the CSV, remove rows where every column is blank, review the cleaned row count, and export a tidier file that keeps the original columns intact."
            howItWorksSteps={[
              {
                title: "Upload the CSV",
                text: "Start with the spreadsheet that has blank lines from exports, edits, or repeated copy-and-paste work.",
              },
              {
                title: "Apply the empty-row rule",
                text: "The tool removes rows only when all columns in that row are empty, so the rest of the structure stays unchanged.",
              },
              {
                title: "Review and export",
                text: "Check the remaining rows, then download the cleaned CSV for the next stage of your workflow.",
              },
            ]}
            useCasesTitle="Common use cases"
            useCases={[
              {
                title: "Pre-import cleanup",
                text: "Remove spacing noise before CRM import so row counts are easier to trust and review.",
              },
              {
                title: "Post-merge cleanup",
                text: "Clear blank lines after combining multiple spreadsheets into one master file.",
              },
              {
                title: "Team handoff prep",
                text: "Make a spreadsheet easier for another person to scan without changing the actual contact data.",
              },
            ]}
            relatedTools={[
              {
                href: "/tools/csv-lead-cleaner",
                title: "Clean CSV Free",
                description: "Use the full workflow next if the file also needs duplicate removal, invalid email cleanup, or personal-domain filtering.",
              },
              {
                href: "/tools/merge-csv-files",
                title: "Merge CSV Files",
                description: "Combine several sheets first, then use Remove Empty Rows from CSV to clean up structural noise in the merged export.",
              },
              {
                href: "/tools/split-csv-files",
                title: "Split CSV Files",
                description: "Break the cleaned spreadsheet into smaller import-ready files once the blank rows are gone.",
              },
            ]}
            faqs={[
              {
                question: "Does this delete rows with some data in them?",
                answer:
                  "No. The tool only removes rows where every column is empty, so partially filled rows stay in the output.",
              },
              {
                question: "Will the columns stay the same?",
                answer:
                  "Yes. The export keeps the original columns so you are only changing the row structure, not the schema of the file.",
              },
              {
                question: "Does the file leave my browser?",
                answer:
                  "No. The cleanup runs locally in your browser and the CSV is not uploaded to a server for processing.",
              },
            ]}
          />
        </div>
      </main>
    </PageFrame>
  );
}
