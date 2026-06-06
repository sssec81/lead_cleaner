import type { Metadata } from "next";

import { PhoneExtractorTool } from "@/components/phone-extractor-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Phone Numbers from Text",
  description:
    "Extract phone numbers from text online. Paste messy text, normalize numbers, remove duplicates, and export the result in your browser.",
  path: "/tools/extract-phone-numbers-from-text",
  keywords: [
    "extract phone numbers from text",
    "phone number extractor",
    "find phone numbers in text",
    "lead cleaner phone tool",
  ],
});

export default function ExtractPhoneNumbersFromTextPage() {
  return (
    <>
      <ToolJsonLd
        title="Extract Phone Numbers from Text"
        description="Extract phone numbers from text online. Paste messy text, normalize numbers, remove duplicates, and export the result in your browser."
        path="/tools/extract-phone-numbers-from-text"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract Phone Numbers from Text"
        title="Pull phone numbers out of messy text and normalize them into something usable."
        intro="Use this when the phone field is trapped inside notes, copied pages, support logs, or research scraps and you need a cleaner list before you paste it somewhere else."
        quote="The list gets easier to trust as soon as the phone numbers stop hiding inside the paragraph."
        narrativeLabel="Where it fits"
        narrativeIntro="Use it when copied text contains useful phone data, but the first job is isolating and standardizing the numbers."
        narrativePoints={[
          "Helpful for recruiter notes, event lists, copied directories, and customer-support exports.",
          "Normalization matters because the same number can look different enough to create noise downstream.",
          "If the numbers already live in a structured spreadsheet, the broader CSV workflow is usually a better final stop.",
        ]}
        darkLabel="Focused utility"
        darkTitle="This page is for extracting and cleaning phone fields, not for governing the full lead file."
        darkPoints={[
          "Core number extraction and deduplication run locally in your browser.",
          "The output is meant to be easy to review and reuse without introducing another complicated step.",
          "Treat it as a supporting pass before the spreadsheet workflow when the project keeps expanding.",
        ]}
        relatedLabel="Related paths"
        relatedTitle="Isolate the phone list here, then move to the tool that matches the rest of the cleanup job."
        relatedLinks={[
          {
            href: "/tools/extract-emails-from-text",
            title: "Extract Emails from Text",
            text: "Useful when the same source text also contains email addresses that need their own cleanup pass.",
          },
          {
            href: "/tools/extract-urls-from-text",
            title: "Extract URLs from Text",
            text: "Helpful when research notes include websites, contact info, and raw copy all mixed together.",
          },
          {
            href: "/tools/csv-lead-cleaner",
            title: "CSV Lead Cleaner",
            text: "Move here once the extracted fields belong back inside a spreadsheet that needs broader review.",
          },
        ]}
        tool={<PhoneExtractorTool />}
      />
    </>
  );
}
