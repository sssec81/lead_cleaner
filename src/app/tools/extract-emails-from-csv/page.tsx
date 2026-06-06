import type { Metadata } from "next";

import { ExtractEmailsFromCsvTool } from "@/components/extract-emails-from-csv-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
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
    <>
      <ToolJsonLd
        title="Extract Emails from CSV"
        description="Extract emails from a CSV online. Upload a file, choose the email column, remove duplicates, and export the result in your browser."
        path="/tools/extract-emails-from-csv"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract Emails from CSV"
        title="Pull one clean email column out of a spreadsheet without rebuilding the whole file."
        intro="Upload a CSV, choose the email column, deduplicate it, remove invalid entries, and export a focused result when the rest of the sheet is not the real problem."
        quote="This is the narrower spreadsheet path when the file mostly works and the address column does not."
        narrativeLabel="Best use cases"
        narrativeIntro="Use it when the sheet is already structured and you only need the email list cleaned and separated."
        narrativePoints={[
          "Good for CRM exports, newsletter prep, sourcing sheets, and lists headed into enrichment tools.",
          "It saves time when the main spreadsheet does not need a full review report or broader cleanup logic.",
          "If multiple columns feel unreliable, move to the CSV Lead Cleaner instead of forcing this page to do too much.",
        ]}
        darkLabel="Narrow by design"
        darkTitle="A lighter workflow is useful when the only real question is whether the email column can be trusted."
        darkPoints={[
          "Core extraction, cleanup, and export stay in the browser during normal use.",
          "The page keeps the scope tight so the result is fast to review and easy to move downstream.",
          "It is a supporting workflow beside the main CSV cleanup product, not a replacement for it.",
        ]}
        relatedLabel="Related paths"
        relatedTitle="Use the focused email-column workflow here, then escalate only if the rest of the data needs attention."
        relatedLinks={[
          {
            href: "/tools/csv-lead-cleaner",
            title: "CSV Lead Cleaner",
            text: "Choose the main spreadsheet workflow when multiple fields need cleanup, review, or export reporting.",
          },
          {
            href: "/tools/clean-email-list",
            title: "Clean Email List",
            text: "Use the pasted-text version when the addresses are no longer tied to a CSV file.",
          },
          {
            href: "/tools/remove-duplicate-emails",
            title: "Remove Duplicate Emails",
            text: "Take the faster dedupe-only route when invalid formatting is not the main issue.",
          },
        ]}
        tool={<ExtractEmailsFromCsvTool />}
      />
    </>
  );
}
