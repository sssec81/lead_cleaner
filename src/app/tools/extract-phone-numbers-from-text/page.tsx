import type { Metadata } from "next";

import { PhoneExtractorTool } from "@/components/phone-extractor-tool";
import { TextExtractorSupportingContent } from "@/components/text-extractor-supporting-content";
import { TextTransformationPreviewCard } from "@/components/text-transformation-preview-card";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Extract Phone Numbers from Text",
 description:
 "Extract phone numbers from text, notes, and copied pages. Normalize valid matches, remove duplicates, and export a clean list in your browser.",
 path: "/tools/extract-phone-numbers-from-text",
 keywords: [
 "extract phone numbers from text",
 "phone number extractor",
 "extract phone numbers online",
 "phone number parser",
 "find phone numbers in text",
 ],
});

const faqEntries = [
 {
 question: "Can I choose phone number formatting?",
 answer:
 "Yes. The tool supports international formatting, digits-only output, and original formatting options.",
 },
 {
 question: "Does it work with local numbers?",
 answer:
 "Yes. Choose a default country to help local phone numbers normalize more consistently.",
 },
];

export default function ExtractPhoneNumbersFromTextPage() {
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "Extract Phone Numbers from Text", url: "/tools/extract-phone-numbers-from-text" },
 ]}
 />
 <ToolJsonLd
 title="Extract Phone Numbers from Text"
 description="Paste messy notes, copied pages, logs, or research scraps to extract phone numbers, remove duplicates, and export a clean list."
 path="/tools/extract-phone-numbers-from-text"
 category="BusinessApplication"
 />
 <FaqJsonLd faqEntries={faqEntries} />
 <TextToolPageShell
 eyebrow="Phone Number Extractor"
 title="Extract Phone Numbers from Text"
 heroVariant="streamlined"
 intro="Paste messy notes, copied pages, logs, or research scraps to extract phone numbers, remove duplicates, and export a clean list."
 asideDescription="Choose a default country and output format before export when you need more consistent phone normalization across international and local number patterns."
 asideContent={
 <TextTransformationPreviewCard
 messyLabel="Messy Input"
 messyLines={[
 "Call Jane at (415) 555-0101 after the intro.",
 "UK office: +44 20 7946 0958",
 "Duplicate: 415-555-0101 in the notes again.",
 "Follow-up text and CRM comments mixed in.",
 ]}
 actionLabel="Extract Phones"
 detectedLabel="2 numbers detected"
 resultLabel="Clean Phone List"
 resultLines={[
 "+1 415 555 0101",
 "+44 20 7946 0958",
 ]}
 />
 }
 tool={<PhoneExtractorTool />}
 toolSupportingContent={
 <TextExtractorSupportingContent
 title="Extract phone numbers from messy text"
 description="Use this tool to pull phone numbers from copied web pages, notes, support logs, CRM exports, lead research, and raw text blocks. LeadCleanr removes duplicates and gives you a clean list you can copy or export."
 useCases={[
 {
 title: "Sales teams",
 description: "Extract numbers from lead notes and prospect research before outreach.",
 },
 {
 title: "Recruiters",
 description: "Clean candidate phone lists copied from resumes, forms, and sourcing notes.",
 },
 {
 title: "Operations",
 description: "Pull numbers from logs, reports, and pasted support text without spreadsheet cleanup.",
 },
 ]}
 faqs={faqEntries}
 relatedTools={[
 { href: "/tools/extract-phone-numbers-from-csv", label: "Extract phones from CSV" },
 { href: "/tools/remove-duplicate-phone-numbers", label: "Remove duplicate phones" },
 { href: "/tools/extract-emails-from-text", label: "Extract emails" },
 ]}
 />
 }
 />
 </>
 );
}
