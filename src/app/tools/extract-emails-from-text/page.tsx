import type { Metadata } from "next";

import { EmailExtractorTool } from "@/components/email-extractor-tool";
import { TextExtractorSupportingContent } from "@/components/text-extractor-supporting-content";
import { TextTransformationPreviewCard } from "@/components/text-transformation-preview-card";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Extract Emails from Text Online",
 description:
 "Extract emails from text, CRM notes, or copied pages. Remove duplicates and export a clean list locally in your browser without signing up.",
 path: "/tools/extract-emails-from-text",
 keywords: [
 "extract emails from text",
 "email extractor",
 "find emails in text",
 "lead cleaning tool",
 ],
});

const faqEntries = [
 {
 question: "Does it remove duplicate emails?",
 answer:
 "Yes. Matching emails are normalized to lowercase, deduplicated, and shown as a clean list.",
 },
 {
 question: "Do I need an account?",
 answer: "No. The email extractor works in your browser with no signup and no server upload.",
 },
];

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
 title="Extract Emails from Text Online"
 description="Paste messy text, CRM notes, or website pages to extract and clean email addresses. Deduplicate the final list and export locally in your browser with no signup."
 path="/tools/extract-emails-from-text"
 category="BusinessApplication"
 />
 <FaqJsonLd faqEntries={faqEntries} />
 <TextToolPageShell
 eyebrow="Extract Emails from Text"
 title="Extract email addresses from messy text."
 heroVariant="streamlined"
 intro="Paste copied website text, CRM notes, resumes, or lead blocks. This is the text-first path for the moment before the data becomes a spreadsheet again."
 quote="This is the tool for when the list still looks like a paragraph."
 asideContent={
 <TextTransformationPreviewCard
 messyLabel="Messy Input"
 messyLines={[
 "Jane from Acme: jane@acme.com, copied from a footer.",
 "Reach support@northstar.io after the demo.",
 "Duplicate note: JANE@ACME.COM appears again.",
 "Noise, names, titles, and random spacing.",
 ]}
 actionLabel="Extract Emails"
 detectedLabel="2 emails detected"
 resultLabel="Clean Email List"
 resultTone="green"
 resultLines={[
 "jane@acme.com",
 "support@northstar.io",
 ]}
 />
 }
 tool={<EmailExtractorTool />}
 toolSupportingContent={
 <TextExtractorSupportingContent
 title="Stop copying emails by hand and clean the list in one pass."
 description="Paste website copy, CRM notes, resumes, inbox exports, event lists, or lead research. LeadCleanr finds email addresses, lowercases duplicates, removes repeated matches, and prepares a clean export-ready email list."
 useCases={[
 {
 title: "Sales prospecting",
 description: "Pull emails from company pages, notes, and copied lead blocks before outreach.",
 },
 {
 title: "Recruiting workflows",
 description: "Extract candidate emails from resumes, sourcing notes, and pasted profile text.",
 },
 {
 title: "List cleanup",
 description: "Deduplicate raw email text before moving it into a CSV, CRM, or outreach tool.",
 },
 ]}
 faqs={faqEntries}
 relatedTools={[
 { href: "/tools/clean-email-list", label: "Clean email list" },
 { href: "/tools/validate-email-list", label: "Validate emails" },
 { href: "/tools/extract-emails-from-csv", label: "Extract emails from CSV" },
 ]}
 />
 }
 />
 </>
 );
}
