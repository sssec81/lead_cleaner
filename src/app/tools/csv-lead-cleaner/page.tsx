import type { Metadata } from "next";
import { CsvLeadCleanerTool } from "@/components/csv-lead-cleaner-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "CSV Lead Cleaner — Clean, Deduplicate & Export Lead CSVs",
  description:
    "Deduplicate rows, filter invalid emails, spot personal vs. business domains, and flag role-based addresses—100% locally in your browser with no signup required before CRM import.",
  path: "/tools/csv-lead-cleaner",
  keywords: [
    "csv lead cleaner",
    "clean csv online",
    "dedupe csv leads",
    "lead list csv cleanup",
  ],
});

export default function CsvLeadCleanerPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "CSV Lead Cleaner", url: "/tools/csv-lead-cleaner" },
        ]}
      />
      <ToolJsonLd
        title="CSV Lead Cleaner — Clean, Deduplicate & Export Lead CSVs"
        description="Deduplicate rows, filter invalid emails, spot personal vs. business domains, and flag role-based addresses—100% locally in your browser with no signup required before CRM import."
        path="/tools/csv-lead-cleaner"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="B2B CSV Lead Cleaner"
        title="Clean and Validate Lead Lists Instantly in Your Browser"
        intro="Perfect for cleaning messy CSVs with duplicate rows, invalid emails, blank fields, personal address types, role-based inboxes, and unformatted contact data before CRM or outreach tool import. 100% local processing."
        quote="Upload, filter, and export clean lead lists without sending your data to external servers."
        tool={<CsvLeadCleanerTool />}
      />
    </>
  );
}
