import type { Metadata } from "next";

import { ExtractEmailsFromCsvTool } from "@/components/extract-emails-from-csv-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Emails from CSV",
  description:
    "Extract emails from a CSV online. Upload a file, choose the email column, remove duplicates, and export the result in your browser.",
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
      <ToolJsonLd
        title="Extract Emails from CSV"
        description="Extract emails from a CSV online. Upload a file, choose the email column, remove duplicates, and export the result in your browser."
        path="/tools/extract-emails-from-csv"
        category="BusinessApplication"
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-strong)]">
          Extract Emails from CSV
        </p>

        <div className="mt-6">
          <ExtractEmailsFromCsvTool />
        </div>
      </section>
    </PageFrame>
  );
}
