import type { Metadata } from "next";

import { RemoveEmptyRowsCsvTool } from "@/components/remove-empty-rows-csv-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
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
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 {
 name: "Remove Empty Rows from CSV",
 url: "/tools/remove-empty-rows-from-csv",
 },
 ]}
 />
 <ToolJsonLd
 title="Remove Empty Rows from CSV Online — Free Tool"
 description="Upload a CSV to instantly delete all empty and blank rows. Export a perfectly clean spreadsheet without opening Excel."
 path="/tools/remove-empty-rows-from-csv"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="Remove Empty Rows from CSV"
 title="Delete blank rows from your spreadsheet instantly."
 intro="Upload your messy CSV file. We'll automatically find and delete any row that is completely empty, saving you the hassle of sorting and filtering in Excel."
 quote="A one-click fix for the most annoying problem in CSV formatting."
 tool={<RemoveEmptyRowsCsvTool />}
 />
 </>
 );
}
