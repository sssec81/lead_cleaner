import type { Metadata } from "next";
import { BarChart3, Shield, Users } from "lucide-react";
import { Suspense } from "react";

import { MergeCsvFilesTool } from "@/components/merge-csv-files-tool";
import { PageFrame } from "@/components/page-frame";
import { ToolSeoSections } from "@/components/tool-seo-sections";
import { BreadcrumbJsonLd, buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Merge CSV Files Online",
  description:
    "Merge multiple CSV files into one dataset. Align matching headers automatically, preview the result, and export locally in your browser.",
  path: "/tools/merge-csv-files",
  keywords: ["merge csv files", "combine csv", "join csv files", "csv merger"],
});

export default function MergeCsvFilesPage() {
  return (
    <PageFrame>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Merge CSV Files", url: "/tools/merge-csv-files" },
        ]}
      />
      <ToolJsonLd
        name="Merge CSV Files"
        title="Merge CSV Files Online"
        description="Combine multiple CSV files into one master dataset. Headers are automatically aligned and matched. Free, secure, browser-side processing."
        path="/tools/merge-csv-files"
        category="UtilitiesApplication"
      />
      <main className="relative bg-[var(--lc-bg)] pb-16 pt-4 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl pb-8 pt-12 text-center">
            <div className="section-eyebrow mb-4">CSV TOOL</div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
              Merge CSV Files
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
              Drop multiple CSV files here to combine them into one master
              dataset. Headers are aligned automatically and the merge stays in
              your browser.
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
            <MergeCsvFilesTool />
          </Suspense>

          <ToolSeoSections
            howItWorksTitle="Combine several spreadsheets before you clean or import them"
            howItWorksIntro="Merge CSV Files is for the prep step before deeper cleanup. When contacts arrive from multiple exports, teammates, or vendors, you can combine them into one aligned spreadsheet first. That makes it easier to run one dedupe pass, remove empty rows, or prepare a single CRM-ready file afterward."
            howItWorksSteps={[
              {
                title: "Add the source CSV files",
                text: "Drop the spreadsheets you want to combine into one working dataset.",
              },
              {
                title: "Align the headers",
                text: "LeadCleanr matches related column names so the merged output is easier to review than a manual copy-and-paste merge.",
              },
              {
                title: "Export the combined file",
                text: "Download the merged CSV, then move into the next cleanup step only if you still need dedupe or structural fixes.",
              },
            ]}
            useCasesTitle="Common use cases"
            useCases={[
              {
                title: "Vendor list consolidation",
                text: "Combine several prospect exports into one file before you clean, score, or import them.",
              },
              {
                title: "Team handoffs",
                text: "Join multiple teammate spreadsheets into one master CSV before CRM upload or agency delivery.",
              },
              {
                title: "Monthly source rollups",
                text: "Merge recurring exports from the same workflow so you can review everything in one place before dedupe.",
              },
            ]}
            relatedTools={[
              {
                href: "/tools/csv-lead-cleaner",
                title: "Clean CSV Free",
                description: "Run the merged file through the main cleanup workspace when you want duplicate removal, personal email filtering, or invalid-row review.",
              },
              {
                href: "/tools/remove-empty-rows-from-csv",
                title: "Remove Empty Rows from CSV",
                description: "Strip blank rows after the merge if the combined sheet still has spacing noise.",
              },
              {
                href: "/tools/split-csv-files",
                title: "Split CSV Files",
                description: "Break the combined file back into smaller chunks later if your destination tool has import limits.",
              },
            ]}
            faqs={[
              {
                question: "Does Merge CSV Files upload my spreadsheets?",
                answer:
                  "No. The merge runs locally in your browser, so your source files stay on your device during processing.",
              },
              {
                question: "Should I merge before or after cleaning?",
                answer:
                  "Merge first when the files belong to the same dataset and you want one unified cleanup pass afterward.",
              },
              {
                question: "What should I do after merging?",
                answer:
                  "The most common next step is Clean CSV Free for a full cleanup pass, followed by Remove Empty Rows from CSV if the combined sheet still has structural noise.",
              },
            ]}
          />
        </div>
      </main>
    </PageFrame>
  );
}
