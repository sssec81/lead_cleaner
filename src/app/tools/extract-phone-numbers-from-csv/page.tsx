import type { Metadata } from "next";

import { ExtractPhonesFromCsvTool } from "@/components/extract-phones-from-csv-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Phone Numbers from CSV Online — Free Tool",
  description:
    "Upload a CSV file to automatically detect the phone column, filter out invalid formats, normalize to E.164, and export a clean list of phone numbers.",
  path: "/tools/extract-phone-numbers-from-csv",
  keywords: [
    "extract phone numbers from csv",
    "csv phone extractor",
    "pull phone numbers from spreadsheet",
    "clean phone numbers csv",
  ],
});

export default function ExtractPhoneNumbersFromCsvPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          {
            name: "Extract Phone Numbers from CSV",
            url: "/tools/extract-phone-numbers-from-csv",
          },
        ]}
      />
      <ToolJsonLd
        title="Extract Phone Numbers from CSV Online — Free Tool"
        description="Upload a CSV file to automatically detect the phone column, filter out invalid formats, normalize to E.164, and export a clean list of phone numbers."
        path="/tools/extract-phone-numbers-from-csv"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract Phones from CSV"
        title="Pull clean phone numbers from any messy spreadsheet."
        intro="Upload your CSV. We'll automatically find the column containing phone numbers, strip out the broken ones, normalize them to standard E.164 format, and give you a clean export."
        quote="Stop fighting with Excel text-to-columns to fix phone numbers."
        tool={<ExtractPhonesFromCsvTool />}
      />
    </>
  );
}
