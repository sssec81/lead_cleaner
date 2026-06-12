import type { Metadata } from "next";
import { Shield, Users, BarChart3 } from "lucide-react";
import { Suspense } from "react";
import { ExtractPhonesFromCsvTool } from "@/components/extract-phones-from-csv-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Extract Phone Numbers from CSV Online — Free Tool",
 description:
 "Upload a CSV file to automatically detect the phone column, pull phone numbers out of messy cell text, normalize valid matches, and export a clean list locally in your browser.",
 path: "/tools/extract-phone-numbers-from-csv",
 keywords: [
 "extract phone numbers from csv",
 "csv phone extractor",
 "pull phone numbers from spreadsheet",
 "clean phone numbers csv",
 ],
});

export default function ExtractPhoneNumbersFromCsvPage() {
  const pageHeader = (
    <div className="mx-auto max-w-3xl pt-12 pb-8 text-center">
      <div className="mb-4 text-[0.75rem] font-bold tracking-[0.22em] uppercase text-[var(--lc-accent)]">
        CSV TOOL
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
        Extract Phones from CSV
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
        Upload your CSV. We'll automatically find the column containing phone numbers, pull valid numbers out of messy cells, strip out the broken ones, normalize the clean matches, and give you a clean export.
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
          <span className="font-medium text-[var(--lc-ink)]">Up to 5MB free</span>
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
          { name: "Extract Phone Numbers from CSV", url: "/tools/extract-phone-numbers-from-csv" },
        ]}
      />
      <ToolJsonLd
        title="Extract Phone Numbers from CSV Online — Free Tool"
        description="Upload a CSV file to automatically detect the phone column, pull phone numbers out of messy cell text, normalize valid matches, and export a clean list locally in your browser."
        path="/tools/extract-phone-numbers-from-csv"
        category="BusinessApplication"
      />
      <main className="relative min-h-screen pt-4 pb-24 lg:pb-32 bg-[var(--lc-bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pageHeader}
          <Suspense fallback={<div className="h-96 flex items-center justify-center text-[var(--lc-muted)]">Loading tool...</div>}>
            <ExtractPhonesFromCsvTool />
          </Suspense>
        </div>
      </main>
    </PageFrame>
  );
}
