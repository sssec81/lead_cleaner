import type { Metadata } from "next";

import { UrlExtractorTool } from "@/components/url-extractor-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract URLs from Text Online",
  description:
    "Extract and clean URLs from text. Normalize web protocols, clean trailing punctuation, filter duplicates, and download results—100% locally in your browser with no signup required.",
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
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Extract URLs from Text", url: "/tools/extract-urls-from-text" },
        ]}
      />
      <ToolJsonLd
        title="Extract URLs from Text Online"
        description="Extract and clean URLs from text. Normalize web protocols, clean trailing punctuation, filter duplicates, and download results—100% locally in your browser with no signup required."
        path="/tools/extract-urls-from-text"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract URLs from Text"
        title="Pull the links out of copied text and make the list less chaotic."
        intro="Paste copied website text, notes, research documents, or lead blocks. This tool isolates URLs, normalizes them into a cleaner shape, removes duplicates, and keeps export simple."
        quote="The first cleanup step is often just separating the links from everything pretending to be useful around them."
        tool={<UrlExtractorTool />}
      />
    </>
  );
}
