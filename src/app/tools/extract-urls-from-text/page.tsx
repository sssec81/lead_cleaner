import type { Metadata } from "next";

import { UrlExtractorTool } from "@/components/url-extractor-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract URLs from Text",
  description:
    "Extract URLs from text online. Paste messy text, normalize links, remove duplicates, and export the result in your browser.",
  path: "/tools/extract-urls-from-text",
  keywords: [
    "extract urls from text",
    "url extractor",
    "find links in text",
    "website link cleaner",
  ],
});

export default function ExtractUrlsFromTextPage() {
  return (
    <>
      <ToolJsonLd
        title="Extract URLs from Text"
        description="Extract URLs from text online. Paste messy text, normalize links, remove duplicates, and export the result in your browser."
        path="/tools/extract-urls-from-text"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract URLs from Text"
        title="Pull the links out of copied text and make the list less chaotic."
        intro="Paste copied website text, notes, research documents, or lead blocks. This tool isolates URLs, normalizes them into a cleaner shape, removes duplicates, and keeps export simple."
        quote="The first cleanup step is often just separating the links from everything pretending to be useful around them."
        narrativeLabel="Where it fits"
        narrativeIntro="Use it when the links still live inside noisy copied text and the immediate goal is extracting a clean list of destinations."
        narrativePoints={[
          "Helpful for directory cleanup, research notes, copied landing pages, and outreach source documents.",
          "Normalization matters here because tiny inconsistencies make link lists feel worse than they are.",
          "If the URLs are already part of a spreadsheet that needs broader review, the CSV workflow is the stronger next step.",
        ]}
        darkLabel="Supporting role"
        darkTitle="This page helps when the links are still in pieces, not when the whole dataset needs governing."
        darkPoints={[
          "Core link extraction runs in your browser during the MVP flow.",
          "The result is meant to be cleaner and easier to move, not more complicated than the original text.",
          "Treat it as a preparation step before the spreadsheet workflow when the job keeps growing.",
        ]}
        relatedLabel="Related paths"
        relatedTitle="Isolate the links, then decide whether the rest of the lead data needs a bigger cleanup pass."
        relatedLinks={[
          {
            href: "/tools/extract-emails-from-text",
            title: "Extract Emails from Text",
            text: "Useful when the same copied source contains both addresses and links.",
          },
          {
            href: "/tools/extract-phone-numbers-from-text",
            title: "Extract Phone Numbers from Text",
            text: "Another supporting step when contact fields are scattered through copied text.",
          },
          {
            href: "/tools/csv-lead-cleaner",
            title: "CSV Lead Cleaner",
            text: "The better workflow when the cleaned links need to live inside a broader lead spreadsheet again.",
          },
        ]}
        tool={<UrlExtractorTool />}
      />
    </>
  );
}
