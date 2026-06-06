import type { Metadata } from "next";

import { SplitCsvFilesTool } from "@/components/split-csv-files-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";

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
  return (
    <>
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
      <TextToolPageShell
        eyebrow="Data Splitter"
        title="Split a large CSV into chunks."
        intro="Upload a large lead CSV and slice it into smaller pieces to fit CRM import limits. Everything is processed securely in your browser and exported as a ZIP."
        quote="Bypass strict import limits instantly."
        tool={
          <div className="flex flex-col gap-12">
            <SplitCsvFilesTool />
            <ProWaitlistCard trackSource="split-csv-files" />
          </div>
        }
      />
    </>
  );
}
