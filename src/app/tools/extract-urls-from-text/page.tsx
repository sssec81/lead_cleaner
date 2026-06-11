import type { Metadata } from "next";

import { UrlExtractorTool } from "@/components/url-extractor-tool";
import { TextExtractorSupportingContent } from "@/components/text-extractor-supporting-content";
import { TextTransformationPreviewCard } from "@/components/text-transformation-preview-card";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/lib/seo";

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

const faqEntries = [
 {
 question: "Can this extract URLs without https?",
 answer:
 "Yes. The tool detects common web links such as www.leadcleanr.com and normalizes them into cleaner URL output.",
 },
 {
 question: "Is pasted text uploaded?",
 answer:
 "No. Extraction runs locally in your browser, so copied notes and lead data stay on your device.",
 },
];

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
 <FaqJsonLd faqEntries={faqEntries} />
 <TextToolPageShell
 eyebrow="Extract URLs from Text"
 title="Pull the links out of copied text and make the list less chaotic."
 intro="Paste copied website text, notes, research documents, or lead blocks. This tool isolates URLs, normalizes them into a cleaner shape, removes duplicates, and keeps export simple."
 quote="The first cleanup step is often just separating the links from everything pretending to be useful around them."
 asideContent={
 <TextTransformationPreviewCard
 messyLabel="Messy Input"
 messyLines={[
 "Visit https://leadcleaner.com/tools for the main site.",
 "Docs live at https://docs.leadcleaner.com/start",
 "The blog preview is www.leadcleaner.com/blog",
 "Random text mixed everywhere.",
 ]}
 actionLabel="Extract URLs"
 detectedLabel="4 URLs detected"
 resultLabel="Clean URL List"
 resultLines={[
 "https://docs.leadcleaner.com/start",
 "https://leadcleaner.com/",
 "https://leadcleaner.com/blog",
 "https://leadcleaner.com/tools",
 ]}
 />
 }
 tool={<UrlExtractorTool />}
 toolSupportingContent={
 <TextExtractorSupportingContent
 title="Extract URLs from copied pages, notes, and lead research"
 description="Use LeadCleanr when URLs are buried inside paragraphs, scraped text, emails, research notes, or CRM comments. The URL extractor normalizes protocols, removes duplicates, trims punctuation, and gives you a clean list you can copy or export."
 useCases={[
 {
 title: "Research cleanup",
 description: "Pull websites from pasted browser notes, directories, and copied search results.",
 },
 {
 title: "Lead list prep",
 description: "Turn messy outreach notes into clean company website links before enrichment.",
 },
 {
 title: "Content audits",
 description: "Extract links from drafts, pages, and reports without manually scanning every line.",
 },
 ]}
 faqs={faqEntries}
 relatedTools={[
 { href: "/tools/extract-domains-from-emails", label: "Extract domains" },
 { href: "/tools/remove-duplicate-urls", label: "Remove duplicate URLs" },
 { href: "/tools/extract-emails-from-text", label: "Extract emails" },
 ]}
 />
 }
 />
 </>
 );
}
