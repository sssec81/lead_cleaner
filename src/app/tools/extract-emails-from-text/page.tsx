import type { Metadata } from "next";

import { EmailExtractorTool } from "@/components/email-extractor-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Emails from Text",
  description:
    "Extract emails from text online. Paste messy text, remove duplicates, clean addresses, and export the result in your browser.",
  path: "/tools/extract-emails-from-text",
  keywords: [
    "extract emails from text",
    "email extractor",
    "find emails in text",
    "lead cleaning tool",
  ],
});

export default function ExtractEmailsFromTextPage() {
  return (
    <>
      <ToolJsonLd
        title="Extract Emails from Text"
        description="Extract emails from text online. Paste messy text, remove duplicates, clean addresses, and export the result in your browser."
        path="/tools/extract-emails-from-text"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract Emails from Text"
        title="Pull the useful email addresses out of messy copied text."
        intro="Paste copied website text, CRM notes, resumes, or lead blocks. This is the text-first path for the moment before the data becomes a spreadsheet again."
        quote="This is the tool for when the list still looks like a paragraph."
        narrativeLabel="When this tool makes sense"
        narrativeIntro="Use it when the data is still trapped in copied text and the first job is simply isolating the addresses."
        narrativePoints={[
          "Useful for copied directories, event lead dumps, CRM notes, and sourcing scraps.",
          "The live workspace preview matters here because you can inspect the extracted rows before exporting.",
          "If the data already lives in a spreadsheet, the CSV workflow is usually the better first stop.",
        ]}
        darkLabel="Keep it narrow"
        darkTitle="This page is for extracting the addresses, not pretending to solve the whole spreadsheet."
        darkPoints={[
          "Core extraction runs in your browser during the MVP flow.",
          "Raw pasted text is not sent to the app backend for normal processing.",
          "Once the list is clean enough to live in a CSV, the bigger workflow should move there.",
        ]}
        relatedLabel="Related paths"
        relatedTitle="Use this to isolate the emails, then move to the next real workflow."
        relatedLinks={[
          {
            href: "/tools/remove-duplicate-emails",
            title: "Remove Duplicate Emails",
            text: "Best when the list is already mostly clean and repetition is the main problem.",
          },
          {
            href: "/tools/clean-email-list",
            title: "Clean Email List",
            text: "Useful when the job is tightening up the addresses after extraction.",
          },
          {
            href: "/tools/csv-lead-cleaner",
            title: "CSV Lead Cleaner",
            text: "The main workflow once the data belongs in a spreadsheet.",
          },
        ]}
        tool={<EmailExtractorTool />}
      />
    </>
  );
}
