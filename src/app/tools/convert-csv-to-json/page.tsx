import type { Metadata } from "next";

import { ConvertCsvToJsonTool } from "@/components/convert-csv-to-json-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";

export const metadata: Metadata = buildToolMetadata({
  title: "Convert CSV to JSON Online — Free Data Converter",
  description:
    "Instantly convert CSV files into structured JSON arrays. Secure, browser-based conversion with zero data uploads required.",
  path: "/tools/convert-csv-to-json",
  keywords: [
    "convert csv to json",
    "csv to json",
    "csv json converter",
    "parse csv to json array",
  ],
});

export default function ConvertCsvToJsonPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Convert CSV to JSON", url: "/tools/convert-csv-to-json" },
        ]}
      />
      <ToolJsonLd
        title="Convert CSV to JSON Online — Free Data Converter"
        description="Instantly convert CSV files into structured JSON arrays. Secure, browser-based conversion with zero data uploads required."
        path="/tools/convert-csv-to-json"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Format Converter"
        title="Convert CSV to JSON instantly."
        intro="Drag and drop your spreadsheet or CSV file to immediately convert it into a structured JSON array. All processing happens locally in your browser for maximum security."
        quote="Go from flat rows to structured objects in seconds."
        tool={
          <div className="flex flex-col gap-12">
            <ConvertCsvToJsonTool />
            <ProWaitlistCard trackSource="convert-csv-to-json" />
          </div>
        }
      />
    </>
  );
}
