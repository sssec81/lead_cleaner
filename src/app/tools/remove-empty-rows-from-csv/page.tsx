import type { Metadata } from "next";
import { Shield, Users, BarChart3 } from "lucide-react";
import { Suspense } from "react";
import { RemoveEmptyRowsCsvTool } from "@/components/remove-empty-rows-csv-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

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
  const pageHeader = (
    <div className="mx-auto max-w-3xl pt-12 pb-8 text-center">
      <div className="mb-4 text-[0.75rem] font-bold tracking-[0.22em] uppercase text-[var(--lc-accent)]">
        CSV TOOL
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
        Remove Empty Rows from CSV
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
        Upload your messy CSV file. We'll automatically find and delete any row that is completely empty, saving you the hassle of sorting and filtering in Excel.
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
          { name: "Remove Empty Rows from CSV", url: "/tools/remove-empty-rows-from-csv" },
        ]}
      />
      <ToolJsonLd
        title="Remove Empty Rows from CSV Online — Free Tool"
        description="Upload a CSV to instantly delete all empty and blank rows. Export a perfectly clean spreadsheet without opening Excel."
        path="/tools/remove-empty-rows-from-csv"
        category="BusinessApplication"
      />
      <main className="relative min-h-screen pt-4 pb-24 lg:pb-32 bg-[var(--lc-bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pageHeader}
          <Suspense fallback={<div className="h-96 flex items-center justify-center text-[var(--lc-muted)]">Loading tool...</div>}>
            <RemoveEmptyRowsCsvTool />
          </Suspense>
        </div>
      </main>
    </PageFrame>
  );
}
