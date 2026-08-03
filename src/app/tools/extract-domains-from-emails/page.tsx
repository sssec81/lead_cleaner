import type { Metadata } from "next";

import { DomainExtractorTool } from "@/components/domain-extractor-tool";
import { TextExtractorSupportingContent } from "@/components/text-extractor-supporting-content";
import { TextTransformationPreviewCard } from "@/components/text-transformation-preview-card";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Extract Domains from Emails Online",
 description:
 "Extract unique domains from emails and URLs for account mapping, enrichment, and CRM cleanup. Processing runs locally in your browser.",
 path: "/tools/extract-domains-from-emails",
 keywords: [
 "extract domains from emails",
 "email domain extractor",
 "domain list generator",
 "lead research domains",
 ],
});

const faqEntries = [
 {
 question: "Can it extract domains from both emails and URLs?",
 answer:
 "Yes. Paste addresses, links, or mixed text and the tool returns unique normalized domains.",
 },
 {
 question: "Will personal email domains be removed?",
 answer:
 "This tool extracts domains exactly as found. Use it when you want the domain list first, then filter based on your workflow.",
 },
];

export default function ExtractDomainsFromEmailsPage() {
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "Extract Domains from Emails", url: "/tools/extract-domains-from-emails" },
 ]}
 />
 <ToolJsonLd
 title="Extract Domains from Emails Online"
 description="Extract domains from emails and URLs. Parse unique domains from contact records to isolate corporate websites and accounts. Core cleanup runs locally in your browser, with no signup required."
 path="/tools/extract-domains-from-emails"
 category="BusinessApplication"
 />
 <FaqJsonLd faqEntries={faqEntries} />
 <TextToolPageShell
 eyebrow="Extract Domains from Emails"
 title="Extract domains from emails and URLs."
 heroVariant="streamlined"
 intro="Paste a raw list of prospect emails or web links. This tool strips out the personal prefixes and outputs a clean, deduplicated list of unique domains, perfect for CRM account mapping and target enrichment."
 asideContent={
 <TextTransformationPreviewCard
 messyLabel="Messy Input"
 messyLines={[
 "jane@acme.com from the webinar export",
 "https://northstar.io/pricing in research notes",
 "support@acme.com appears again",
 "www.riverlabs.ai/contact from copied text",
 ]}
 actionLabel="Extract Domains"
 detectedLabel="3 domains detected"
 resultLabel="Clean Domain List"
 resultLines={[
 "acme.com",
 "northstar.io",
 "riverlabs.ai",
 ]}
 />
 }
 tool={<DomainExtractorTool />}
 toolSupportingContent={
 <TextExtractorSupportingContent
 title="Extract company domains from emails and URLs"
 description="Paste prospect emails, web links, or mixed lead research and get a unique domain list. This is useful for account mapping, deduping companies, preparing enrichment jobs, and turning contact-level data into company-level targets."
 useCases={[
 {
 title: "Account mapping",
 description: "Group contacts by company domain before CRM import or enrichment.",
 },
 {
 title: "Outbound targeting",
 description: "Build a clean target account list from mixed emails and URLs.",
 },
 {
 title: "Data dedupe",
 description: "Collapse multiple contacts and links into unique company domains.",
 },
 ]}
 faqs={faqEntries}
 relatedTools={[
 { href: "/tools/extract-emails-from-text", label: "Extract emails" },
 { href: "/tools/extract-urls-from-text", label: "Extract URLs" },
 { href: "/tools/csv-lead-cleaner", label: "Clean CSV leads" },
 ]}
 />
 }
 />
 </>
 );
}
