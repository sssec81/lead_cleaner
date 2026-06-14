import type { Metadata } from "next";
import { Shield, Users, BarChart3 } from "lucide-react";
import { Suspense } from "react";
import { ExtractEmailsFromCsvTool } from "@/components/extract-emails-from-csv-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

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
  const pageHeader = (
    <div className="mx-auto max-w-2xl pt-12 pb-6 text-center sm:text-left sm:mx-0">
      <div className="section-eyebrow mb-4">
        CSV TOOL
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
        Extract Emails from CSV
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
        Upload any CSV, detect the email column, pull email addresses out of messy cells, remove blanks, invalid rows, and duplicates, then export an outreach-ready list without touching the rest of the sheet.
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
  );

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
        title="Extract Emails from CSV Online — Private Browser Tool"
        description="Extract and clean emails from CSV files. Detect the email column, pull addresses out of messy cell text, remove duplicates and invalid rows, and download a clean list locally in your browser."
        path="/tools/extract-emails-from-csv"
        category="BusinessApplication"
      />
      <main className="relative min-h-screen pt-4 pb-24 lg:pb-32 bg-[var(--lc-bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pageHeader}
          <div className="mb-16">
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-[var(--lc-muted)]">Loading tool...</div>}>
              <ExtractEmailsFromCsvTool />
            </Suspense>
          </div>
        </div>
      </main>
    </PageFrame>
  );
}
