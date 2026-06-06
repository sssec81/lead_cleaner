import type { Metadata } from "next";

import { ExtractEmailsFromCsvTool } from "@/components/extract-emails-from-csv-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Emails from CSV Online — Private Browser Tool",
  description:
    "Extract and clean emails from CSV files. Pick your email column, filter duplicates, remove invalid rows, and download a clean list—100% locally on-device with no signup required.",
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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Extract Emails from CSV", url: "/tools/extract-emails-from-csv" },
        ]}
      />
      <ToolJsonLd
        title="Extract Emails from CSV Online — Private Browser Tool"
        description="Extract and clean emails from CSV files. Pick your email column, filter duplicates, remove invalid rows, and download a clean list—100% locally on-device with no signup required."
        path="/tools/extract-emails-from-csv"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract Emails from CSV"
        title="Pull one clean email column out of a spreadsheet without rebuilding the whole file."
        intro="Upload a CSV, choose the email column, deduplicate it, remove invalid entries, and export a focused result when the rest of the sheet is not the real problem."
        quote="This is the narrower spreadsheet path when the file mostly works and the address column does not."
        tool={<ExtractEmailsFromCsvTool />}
      />
    </>
  );
}
