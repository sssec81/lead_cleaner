import type { Metadata } from "next";

import { Shield, Users, BarChart3 } from "lucide-react";
import { Suspense } from "react";
import { SplitCsvFilesTool } from "@/components/split-csv-files-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Split CSV into Multiple Files | LeadCleanr",
 description:
 "Split large lead list CSV files into smaller chunks to bypass CRM import limits. Generate a ZIP file with your separated rows instantly in the browser.",
 path: "/tools/split-csv-files",
 keywords: [
 "split csv files",
 "divide csv",
 "split spreadsheet",
 "csv splitter",
 ],
});

export default function SplitCsvPage() {
  const pageHeader = (
    <div className="mx-auto max-w-3xl pt-12 pb-8 text-center">
      <div className="mb-4 text-[0.75rem] font-bold tracking-[0.22em] uppercase text-[var(--lc-accent)]">
        CSV TOOL
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
        Split CSV Files
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
        Upload a large lead CSV and slice it into smaller pieces to fit CRM import limits. Everything is processed securely in your browser and exported as a ZIP.
      </p>
      
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--lc-muted)]">
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-[var(--lc-accent)]" />
          <span className="font-medium text-[var(--lc-ink)]">Browser-only</span>
        </div>
        <span className="text-[var(--lc-border-mid)]">·</span>
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-[var(--lc-accent)]" />
          <span className="font-medium text-[var(--lc-ink)]">No account needed</span>
        </div>
        <span className="text-[var(--lc-border-mid)]">·</span>
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4 text-[var(--lc-accent)]" />
          <span className="font-medium text-[var(--lc-ink)]">Up to 2MB free</span>
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
          { name: "Split CSV Files", url: "/tools/split-csv-files" },
        ]}
      />
      <ToolJsonLd
        title="Split CSV into Multiple Files"
        description="Split large lead list CSV files into smaller chunks to bypass CRM import limits. Generate a ZIP file with your separated rows instantly in the browser."
        path="/tools/split-csv-files"
        category="BusinessApplication"
      />
      <main className="relative min-h-screen pt-4 pb-24 lg:pb-32 bg-[var(--lc-bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pageHeader}
          <Suspense fallback={<div className="h-96 flex items-center justify-center text-[var(--lc-muted)]">Loading tool...</div>}>
            <SplitCsvFilesTool />
          </Suspense>
        </div>
      </main>
    </PageFrame>
  );
}
