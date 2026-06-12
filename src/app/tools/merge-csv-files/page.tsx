import type { Metadata } from "next";

import { Shield, Users, BarChart3 } from "lucide-react";
import { Suspense } from "react";
import { MergeCsvFilesTool } from "@/components/merge-csv-files-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Merge CSV Files Online — Free Data Tool",
 description:
 "Combine multiple CSV files into one master dataset. Headers are automatically aligned and matched. Free, secure, browser-side processing.",
 path: "/tools/merge-csv-files",
 keywords: [
 "merge csv files",
 "combine csv",
 "join csv files",
 "csv merger",
 ],
});

export default function MergeCsvFilesPage() {
  const pageHeader = (
    <div className="mx-auto max-w-3xl pt-12 pb-8 text-center">
      <div className="mb-4 text-[0.75rem] font-bold tracking-[0.22em] uppercase text-[var(--lc-accent)]">
        CSV TOOL
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
        Merge CSV Files
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
        Drop multiple CSV files here to instantly merge them into a single master dataset. Column headers will automatically align across files, and your data never leaves your browser.
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
          { name: "Merge CSV Files", url: "/tools/merge-csv-files" },
        ]}
      />
      <ToolJsonLd
        title="Merge CSV Files Online — Free Data Tool"
        description="Combine multiple CSV files into one master dataset. Headers are automatically aligned and matched. Free, secure, browser-side processing."
        path="/tools/merge-csv-files"
        category="BusinessApplication"
      />
      <main className="relative min-h-screen pt-4 pb-24 lg:pb-32 bg-[var(--lc-bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pageHeader}
          <Suspense fallback={<div className="h-96 flex items-center justify-center text-[var(--lc-muted)]">Loading tool...</div>}>
            <MergeCsvFilesTool />
          </Suspense>
        </div>
      </main>
    </PageFrame>
  );
}
