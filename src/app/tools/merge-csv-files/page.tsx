import type { Metadata } from "next";

import { MergeCsvFilesTool } from "@/components/merge-csv-files-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";

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
  return (
    <>
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
      <TextToolPageShell
        eyebrow="Data Merger"
        title="Combine multiple CSV files."
        intro="Drop multiple CSV files here to instantly merge them into a single master dataset. Column headers will automatically align across files, and your data never leaves your browser."
        quote="Stop copying and pasting rows between spreadsheets."
        tool={
          <div className="flex flex-col gap-12">
            <MergeCsvFilesTool />
            <ProWaitlistCard trackSource="merge-csv-files" />
          </div>
        }
      />
    </>
  );
}
