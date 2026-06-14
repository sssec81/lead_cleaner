import type { Metadata } from "next";
import { BarChart3, Shield, Users } from "lucide-react";
import { Suspense } from "react";

import { PageFrame } from "@/components/page-frame";
import { SplitCsvFilesTool } from "@/components/split-csv-files-tool";
import { ToolSeoSections } from "@/components/tool-seo-sections";
import { BreadcrumbJsonLd, buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Split CSV into Multiple Files | LeadCleanr",
  description:
    "Split large lead list CSV files into smaller chunks to bypass CRM import limits. Generate a ZIP file with your separated rows instantly in the browser.",
  path: "/tools/split-csv-files",
  keywords: ["split csv files", "divide csv", "split spreadsheet", "csv splitter"],
});

export default function SplitCsvPage() {
  return (
    <PageFrame>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Split CSV Files", url: "/tools/split-csv-files" },
        ]}
      />
      <ToolJsonLd
        name="Split CSV Files"
        title="Split CSV into Multiple Files"
        description="Split large lead list CSV files into smaller chunks to bypass CRM import limits. Generate a ZIP file with your separated rows instantly in the browser."
        path="/tools/split-csv-files"
        category="UtilitiesApplication"
      />
      <main className="relative min-h-screen bg-[var(--lc-bg)] pb-24 pt-4 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl pb-8 pt-12 text-center">
            <div className="section-eyebrow mb-4">CSV TOOL</div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
              Split CSV Files
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
              Upload a large lead CSV and break it into smaller pieces to match
              CRM import limits. Everything is processed in your browser and
              exported as a ZIP.
            </p>

            <div className="trust-chip-row mt-6 justify-center">
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

          <Suspense
            fallback={
              <div className="flex h-96 items-center justify-center text-[var(--lc-muted)]">
                Loading tool...
              </div>
            }
          >
            <SplitCsvFilesTool />
          </Suspense>

          <ToolSeoSections
            howItWorksTitle="Break one large spreadsheet into smaller import-ready files"
            howItWorksIntro="Split CSV Files is useful after the cleanup work is finished and the only remaining blocker is file size or row-count limits in your CRM. Instead of editing rows manually, you can load the cleaned CSV, define the chunk size, and download a ZIP with smaller files that are easier to import in sequence."
            howItWorksSteps={[
              {
                title: "Upload the finished CSV",
                text: "Start with the spreadsheet you want to break into smaller pieces for import or handoff.",
              },
              {
                title: "Choose the split size",
                text: "Set the number of rows per file based on the limit of your CRM, email tool, or delivery workflow.",
              },
              {
                title: "Download the ZIP",
                text: "Export the smaller files in one package so the handoff stays organized and easy to track.",
              },
            ]}
            useCasesTitle="Common use cases"
            useCases={[
              {
                title: "CRM import limits",
                text: "Split one large cleaned CSV into several smaller imports when the destination platform limits row count or file size.",
              },
              {
                title: "Client delivery",
                text: "Package a large final spreadsheet into smaller files that are easier for a client or teammate to review.",
              },
              {
                title: "Operational batching",
                text: "Create manageable chunks for staggered enrichment, upload, or QA when one huge file is hard to work through.",
              },
            ]}
            relatedTools={[
              {
                href: "/tools/csv-lead-cleaner",
                title: "Clean CSV Free",
                description: "Run the file through the full cleanup workflow before splitting if you still need dedupe or email filtering.",
              },
              {
                href: "/tools/merge-csv-files",
                title: "Merge CSV Files",
                description: "Use the reverse workflow when you need to combine several sheets into one master dataset first.",
              },
              {
                href: "/tools/remove-empty-rows-from-csv",
                title: "Remove Empty Rows from CSV",
                description: "Clear blank lines before splitting if the source file still has spacing issues that make chunk counts less predictable.",
              },
            ]}
            faqs={[
              {
                question: "When should I split a CSV?",
                answer:
                  "Split the file when your destination system has import limits or when smaller batches are easier to review and hand off.",
              },
              {
                question: "Does the split happen locally?",
                answer:
                  "Yes. The file is processed in your browser and exported as a ZIP without sending the CSV to a server.",
              },
              {
                question: "Should I clean the file before splitting it?",
                answer:
                  "Usually yes. It is easier to clean one master CSV first, then split the final version into smaller import-ready files.",
              },
            ]}
          />
        </div>
      </main>
    </PageFrame>
  );
}
