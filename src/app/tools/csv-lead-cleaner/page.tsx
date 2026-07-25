import type { Metadata } from "next";
import { BarChart3, CheckCircle2, Shield, Users } from "lucide-react";
import { Suspense } from "react";

import { CsvLeadCleanerTool } from "@/components/csv-lead-cleaner-tool";
import { PageFrame } from "@/components/page-frame";
import { ToolSeoSections } from "@/components/tool-seo-sections";
import { BreadcrumbJsonLd, buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "CSV Lead Cleaner for CRM Imports",
  description:
    "Clean lead CSVs before CRM import. Remove duplicate rows, invalid emails, blank fields, and personal addresses locally in your browser.",
  path: "/tools/csv-lead-cleaner",
  keywords: [
    "csv lead cleaner",
    "clean csv online",
    "dedupe csv leads",
    "crm import cleanup",
    "lead list csv cleanup",
  ],
});

export default function CsvLeadCleanerPage() {
  return (
    <PageFrame>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "CSV Lead Cleaner", url: "/tools/csv-lead-cleaner" },
        ]}
      />
      <ToolJsonLd
        name="CSV Lead Cleaner"
        title="CSV Lead Cleaner for CRM Imports"
        description="Clean messy lead CSVs before CRM import. Remove duplicate rows, invalid emails, blank fields, personal emails, and role-based inboxes locally in your browser."
        path="/tools/csv-lead-cleaner"
        category="BusinessApplication"
      />
      <main className="relative bg-[var(--lc-bg)] pb-16 pt-4 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 pb-8 pt-12 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div className="max-w-3xl text-center sm:text-left">
              <div className="section-eyebrow mb-4">CRM IMPORT PREFLIGHT</div>
              <h1 className="font-display text-[clamp(2.25rem,6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[var(--lc-ink)]">
                Turn a messy CSV into an import-ready file.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--lc-muted)]">
                Clean, map, and validate rows for HubSpot, Salesforce, Apollo,
                or Pipedrive—without uploading sensitive lead data.
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

            <aside className="lc-card hidden p-5 lg:block" aria-label="CSV cleaning workflow">
              <p className="section-eyebrow">Four-step workflow</p>
              <ol className="mt-4 space-y-3">
                {["Choose CRM destination", "Upload and set rules", "Review removed rows", "Export a clean CSV"].map((step, index) => (
                  <li key={step} className="flex items-center gap-3 text-sm text-[var(--lc-muted)]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--lc-green)]" aria-hidden="true" />
                    <span><span className="font-semibold text-[var(--lc-ink)]">{index + 1}.</span> {step}</span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>

          <div className="mb-10">
            <Suspense
              fallback={
                <div className="flex h-96 items-center justify-center text-[var(--lc-muted)]">
                  Loading tool...
                </div>
              }
            >
              <CsvLeadCleanerTool />
            </Suspense>
          </div>

          <section className="rounded-[var(--radius-panel)] border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6 shadow-[var(--shadow)] sm:p-8">
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-3xl">
                What the CSV Lead Cleaner catches before import
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-[var(--lc-muted)]">
                This is the broader cleanup workspace for people who need more
                than one narrow fix. Instead of hopping between tools before a
                CRM import, you can review the most common contact-list
                problems in one place and export only when the sheet looks
                ready.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Duplicate rows",
                  text: "Useful when merged exports or teammate handoffs repeat the same contact more than once.",
                },
                {
                  title: "Invalid email formatting",
                  text: "Flags broken addresses before they create bad records or failed sends in your outbound stack.",
                },
                {
                  title: "Blank rows and thin records",
                  text: "Removes structural noise so the spreadsheet is easier to review and safer to import.",
                },
                {
                  title: "Personal and role inboxes",
                  text: "Filters addresses like Gmail, Yahoo, info@, or support@ when you want a more business-focused list.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] p-5"
                >
                  <h3 className="text-base font-semibold text-[var(--lc-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <ToolSeoSections
            howItWorksTitle="Clean lead CSVs before importing to HubSpot, Salesforce, or Apollo"
            howItWorksIntro="This workflow is built for the last cleanup pass before CRM import. Upload the spreadsheet, choose the cleanup rules that matter, review what changed, and export only when the rows look right. LeadCleanr keeps the process short while still letting you inspect duplicates, invalid emails, blank rows, and filtered personal inboxes before the file leaves your browser."
            howItWorksSteps={[
              {
                title: "Upload the raw spreadsheet",
                text: "Start with the CSV you already have from prospecting, recruiting, enrichment, or a teammate handoff.",
              },
              {
                title: "Choose the cleanup rules",
                text: "Turn on the filters you need for duplicates, personal domains, role-based inboxes, blank rows, or invalid email formatting.",
              },
              {
                title: "Review before export",
                text: "Check the clean rows and the removed rows separately so you can export a file that is easier to trust in your CRM.",
              },
            ]}
            useCasesTitle="Common use cases"
            useCases={[
              {
                title: "Sales operations",
                text: "Clean scraped prospect lists before importing them into outbound tools, sequences, or contact databases.",
              },
              {
                title: "Recruiting handoffs",
                text: "Remove noisy candidate rows before ATS imports or recruiter outreach so the team is not working from duplicate records.",
              },
              {
                title: "Agency delivery",
                text: "Tidy client lead sheets locally when you need a fast cleanup pass without uploading private data to another platform.",
              },
            ]}
            relatedTools={[
              {
                href: "/tools/extract-emails-from-csv",
                title: "Extract Emails from CSV",
                description: "Pull only the email addresses out of a larger spreadsheet when you do not need the full row cleanup workflow.",
              },
              {
                href: "/tools/validate-email-list",
                title: "Validate Email List",
                description: "Run a focused syntax pass on pasted email lists when you need a quick check before sending or importing.",
              },
              {
                href: "/tools/remove-empty-rows-from-csv",
                title: "Remove Empty Rows from CSV",
                description: "Use the narrow blank-row cleanup path when the main problem is spreadsheet spacing rather than email quality.",
              },
              {
                href: "/tools/merge-csv-files",
                title: "Merge CSV Files",
                description: "Combine several source files into one sheet before you run the full LeadCleanr cleanup workflow.",
              },
            ]}
            faqs={[
              {
                question: "Does the CSV Lead Cleaner upload my file?",
                answer:
                  "No. The cleanup runs in your browser, so the CSV is processed locally on the device you are using.",
              },
              {
                question: "Can I review removed rows before I export?",
                answer:
                  "Yes. The workflow is designed to show both the clean output and the removed records so you can spot-check the result before download.",
              },
              {
                question: "What does this tool remove?",
                answer:
                  "It can remove duplicate rows, invalid email formats, blank rows, personal inboxes like Gmail or Yahoo, and role-based inboxes when those rules are enabled.",
              },
              {
                question: "When should I use a smaller tool instead?",
                answer:
                  "Use a smaller tool when you only need one step, such as extracting emails from a CSV or removing empty rows without a broader CRM import cleanup pass.",
              },
            ]}
          />
        </div>
      </main>
    </PageFrame>
  );
}
