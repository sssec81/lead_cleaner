import type { Metadata } from "next";
import { BarChart3, Shield, Users } from "lucide-react";
import { Suspense } from "react";

import { ExtractEmailsFromCsvTool } from "@/components/extract-emails-from-csv-tool";
import { PageFrame } from "@/components/page-frame";
import { ToolSeoSections } from "@/components/tool-seo-sections";
import { BreadcrumbJsonLd, buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Emails from CSV Online — Private Browser Tool",
  description:
    "Extract and clean emails from CSV files. Detect the email column, pull addresses out of messy cell text, remove duplicates and invalid rows, and download a clean list locally in your browser.",
  path: "/tools/extract-emails-from-csv",
  keywords: [
    "extract emails from csv",
    "csv email extractor",
    "email column cleaner",
    "lead csv email export",
  ],
});

export default function ExtractEmailsFromCsvPage() {
  return (
    <PageFrame>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Extract Emails from CSV", url: "/tools/extract-emails-from-csv" },
        ]}
      />
      <ToolJsonLd
        name="Extract Emails from CSV"
        title="Extract Emails from CSV Online — Private Browser Tool"
        description="Extract and clean emails from CSV files. Detect the email column, pull addresses out of messy cell text, remove duplicates and invalid rows, and download a clean list locally in your browser."
        path="/tools/extract-emails-from-csv"
        category="BusinessApplication"
      />
      <main className="relative bg-[var(--lc-bg)] pb-16 pt-4 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl pb-6 pt-12 text-center sm:mx-0 sm:text-left">
            <div className="section-eyebrow mb-4">CSV TOOL</div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
              Extract Emails from CSV
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
              Upload any CSV, detect the email column, pull addresses out of
              messy cells, remove blanks and duplicates, and export a clean
              email list without changing the rest of the sheet.
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
              <ExtractEmailsFromCsvTool />
            </Suspense>
          </div>

          <ToolSeoSections
            howItWorksTitle="Pull only the email addresses out of a larger spreadsheet"
            howItWorksIntro="This tool is useful when the spreadsheet already has the right rows but the email data is buried inside one noisy column. LeadCleanr scans the file, suggests the likely email column, extracts valid addresses from messy cells, and gives you a focused export you can validate, deduplicate, or hand off to another workflow."
            howItWorksSteps={[
              {
                title: "Upload the CSV",
                text: "Load the spreadsheet you already received from sourcing, scraping, recruiting, or a previous export.",
              },
              {
                title: "Confirm the email column",
                text: "Pick the column with emails or mixed contact text so the extractor knows which cells to scan.",
              },
              {
                title: "Review and export",
                text: "Check the extracted output, then download a clean email-only CSV for the next step in your workflow.",
              },
            ]}
            useCasesTitle="Common use cases"
            useCases={[
              {
                title: "Lead list cleanup",
                text: "Separate the email field from a broader prospect spreadsheet before validation or campaign prep.",
              },
              {
                title: "Recruiter sourcing notes",
                text: "Pull addresses from messy CSV exports where candidate notes and contact details are mixed together.",
              },
              {
                title: "Vendor or client data",
                text: "Normalize email output from outside sources before it moves into your internal CRM or enrichment process.",
              },
            ]}
            relatedTools={[
              {
                href: "/tools/validate-email-list",
                title: "Validate Email List",
                description: "Check the extracted addresses for syntax issues before you import or send from the cleaned list.",
              },
              {
                href: "/tools/clean-email-list",
                title: "Clean Email List",
                description: "Normalize casing and strip extra formatting when the exported addresses still need one more cleanup pass.",
              },
              {
                href: "/tools/remove-duplicate-emails",
                title: "Remove Duplicate Emails",
                description: "Keep one clean copy of each address when you only need a dedupe step after extraction.",
              },
            ]}
            faqs={[
              {
                question: "Does this change the rest of my spreadsheet?",
                answer:
                  "No. This page is focused on extracting email output. It does not try to rewrite the full spreadsheet workflow.",
              },
              {
                question: "Can it pull emails from messy cell text?",
                answer:
                  "Yes. The extractor is designed for columns where addresses may be mixed with names, notes, or extra copied text.",
              },
              {
                question: "What should I do after extraction?",
                answer:
                  "The most common next steps are Validate Email List, Clean Email List, or Remove Duplicate Emails depending on how polished the source data already is.",
              },
              {
                question: "Is the file uploaded anywhere?",
                answer:
                  "No. The CSV is processed locally in your browser, so the email extraction happens on your device.",
              },
            ]}
          />
        </div>
      </main>
    </PageFrame>
  );
}
