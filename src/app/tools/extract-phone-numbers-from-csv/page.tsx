import type { Metadata } from "next";
import { BarChart3, Shield, Users } from "lucide-react";
import { Suspense } from "react";

import { ExtractPhonesFromCsvTool } from "@/components/extract-phones-from-csv-tool";
import { PageFrame } from "@/components/page-frame";
import { ToolSeoSections } from "@/components/tool-seo-sections";
import { BreadcrumbJsonLd, buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Phone Numbers from CSV",
  description:
    "Extract phone numbers from CSV files, detect the correct column, normalize valid matches, and export a clean list locally in your browser.",
  path: "/tools/extract-phone-numbers-from-csv",
  keywords: [
    "extract phone numbers from csv",
    "csv phone extractor",
    "pull phone numbers from spreadsheet",
    "clean phone numbers csv",
  ],
});

export default function ExtractPhoneNumbersFromCsvPage() {
  return (
    <PageFrame>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Extract Phone Numbers from CSV", url: "/tools/extract-phone-numbers-from-csv" },
        ]}
      />
      <ToolJsonLd
        name="Extract Phone Numbers from CSV"
        title="Extract Phone Numbers from CSV"
        description="Upload a CSV file to automatically detect the phone column, pull phone numbers out of messy cell text, normalize valid matches, and export a clean list locally in your browser."
        path="/tools/extract-phone-numbers-from-csv"
        category="BusinessApplication"
      />
      <main className="relative bg-[var(--lc-bg)] pb-16 pt-4 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl pb-6 pt-12 text-center sm:mx-0 sm:text-left">
            <div className="section-eyebrow mb-4">CSV TOOL</div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
              Extract Phone Numbers from CSV
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
              Upload your CSV, find the phone column, normalize clean matches,
              and export a focused phone list without moving the source file off
              your device.
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
              <ExtractPhonesFromCsvTool />
            </Suspense>
          </div>

          <ToolSeoSections
            howItWorksTitle="Extract clean phone output without reworking the whole spreadsheet"
            howItWorksIntro="Use this when the CSV already contains the rows you want but the phone data needs to be isolated and normalized. LeadCleanr detects likely phone columns, pulls valid numbers from messy cells, removes broken entries, and prepares an export that is easier to review before dialer import or enrichment."
            howItWorksSteps={[
              {
                title: "Load the CSV file",
                text: "Start with the spreadsheet that already contains your source contacts, notes, or mixed outreach data.",
              },
              {
                title: "Choose the phone column",
                text: "Confirm which column contains the phone values so the extractor can focus on the right cell content.",
              },
              {
                title: "Review the normalized result",
                text: "Inspect the clean matches, then export the phone-only CSV for the next stage of your workflow.",
              },
            ]}
            useCasesTitle="Common use cases"
            useCases={[
              {
                title: "Outbound call prep",
                text: "Build a cleaner call list before numbers move into a dialer, VOIP platform, or sales sequence.",
              },
              {
                title: "Sourcing exports",
                text: "Pull valid phone data from recruiter sheets or scraped exports that mix numbers with text noise.",
              },
              {
                title: "Operational cleanup",
                text: "Separate usable phone records from a larger spreadsheet before you merge, dedupe, or hand off the list.",
              },
            ]}
            relatedTools={[
              {
                href: "/tools/csv-lead-cleaner",
                title: "Clean CSV Free",
                description: "Use the full CSV cleanup workflow when the spreadsheet needs broader dedupe, blank-row cleanup, or email filtering too.",
              },
              {
                href: "/tools/remove-empty-rows-from-csv",
                title: "Remove Empty Rows from CSV",
                description: "Clear blank lines out of the spreadsheet before you extract phone numbers if the source file is structurally noisy.",
              },
              {
                href: "/tools/merge-csv-files",
                title: "Merge CSV Files",
                description: "Combine several source sheets first when the phone data is split across multiple exports.",
              },
            ]}
            faqs={[
              {
                question: "Can this pull numbers out of messy text cells?",
                answer:
                  "Yes. The extractor is designed for columns where phone numbers may be mixed with labels, formatting noise, or surrounding text.",
              },
              {
                question: "Does it upload the spreadsheet?",
                answer:
                  "No. The extraction happens locally in your browser so the source CSV stays on your device.",
              },
              {
                question: "When should I use the full CSV Lead Cleaner instead?",
                answer:
                  "Use the full cleaner when the file also needs duplicate removal, invalid email cleanup, or a broader CRM import review rather than a phone-only export.",
              },
            ]}
          />
        </div>
      </main>
    </PageFrame>
  );
}
