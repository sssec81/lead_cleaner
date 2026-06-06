import type { Metadata } from "next";

import { EmailExtractorTool } from "@/components/email-extractor-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Emails from Text Online — Free Browser Tool",
  description:
    "Paste messy text, CRM notes, or website pages to extract and clean email addresses. Deduplicate the final list and export locally in your browser with no signup.",
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
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Extract Emails from Text", url: "/tools/extract-emails-from-text" },
        ]}
      />
      <ToolJsonLd
        title="Extract Emails from Text Online — Free Browser Tool"
        description="Paste messy text, CRM notes, or website pages to extract and clean email addresses. Deduplicate the final list and export locally in your browser with no signup."
        path="/tools/extract-emails-from-text"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract Emails from Text"
        title="Pull the useful email addresses out of messy copied text."
        intro="Paste copied website text, CRM notes, resumes, or lead blocks. This is the text-first path for the moment before the data becomes a spreadsheet again."
        quote="This is the tool for when the list still looks like a paragraph."
        tool={<EmailExtractorTool />}
      />
    </>
  );
}
