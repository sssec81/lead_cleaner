import type { Metadata } from "next";
import { CsvLeadCleanerTool } from "@/components/csv-lead-cleaner-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "CSV Lead Cleaner",
  description:
    "Clean messy lead CSV files before CRM import. Upload a CSV, choose a cleanup rule, review the report, and export a cleaner file in your browser.",
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
      <ToolJsonLd
        title="CSV Lead Cleaner"
        description="Clean messy lead CSV files before CRM import. Upload a CSV, choose a cleanup rule, review the report, and export a cleaner file in your browser."
        path="/tools/csv-lead-cleaner"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Primary workflow"
        title="Clean, deduplicate, and review your lead spreadsheets in one pass."
        intro="Upload a messy CSV, choose the column that should guide cleanup, inspect duplicate and quality signals, and export a cleaner file without leaving the browser."
        quote="This is the main workflow when the spreadsheet itself has stopped feeling trustworthy."
        narrativeLabel="What this page handles"
        narrativeIntro="Use it when the file already exists and the job is making that spreadsheet safe enough to import or hand off."
        narrativePoints={[
          "Best for CRM imports, recruiter handoffs, agency delivery files, and sales ops cleanup.",
          "The preview and report matter because this workflow is about trust, not only about deleting rows.",
          "If the data is still unstructured copied text, start with one of the extraction tools first.",
        ]}
        darkLabel="Why it feels central"
        darkTitle="The product works best when the whole CSV can be reviewed with one consistent cleanup logic."
        darkPoints={[
          "Core parsing, cleanup, and export stay in the browser during the MVP flow.",
          "The page is intentionally broader than the helper tools because the file itself needs judgment.",
          "Use the supporting text tools only before or around this workflow, not instead of it.",
        ]}
        relatedLabel="Related paths"
        relatedTitle="Use the supporting tools when the source is still messy, then return here for the final spreadsheet pass."
        relatedLinks={[
          {
            href: "/tools/extract-emails-from-csv",
            title: "Extract Emails from CSV",
            text: "Use the narrower email-column workflow when the sheet is mostly fine and only the address list needs cleanup.",
          },
          {
            href: "/tools/extract-emails-from-text",
            title: "Extract Emails from Text",
            text: "Start here when the contact data still lives in copied notes or pasted lead blocks.",
          },
          {
            href: "/tools/extract-domains-from-emails",
            title: "Extract Domains from Emails",
            text: "Helpful after cleanup when you need account-level domain lists for enrichment or segmentation.",
          },
        ]}
        tool={<CsvLeadCleanerTool />}
      />
    </>
  );
}
