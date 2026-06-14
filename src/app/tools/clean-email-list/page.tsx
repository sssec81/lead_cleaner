import type { Metadata } from "next";

import { CleanEmailListTool } from "@/components/clean-email-list-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { ToolSeoSections } from "@/components/tool-seo-sections";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Clean Email List Online — Remove Duplicates & Invalid Emails",
 description:
 "Clean email lists online. Lowercase addresses, filter duplicates, remove invalid syntax, and download a clean list. Core cleanup runs locally in your browser, with no signup required.",
 path: "/tools/clean-email-list",
 keywords: [
 "clean email list",
 "email list cleaner",
 "dedupe email list",
 "lead list cleanup",
 ],
});

export default function CleanEmailListPage() {
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "Clean Email List", url: "/tools/clean-email-list" },
 ]}
 />
 <ToolJsonLd
 title="Clean Email List Online — Remove Duplicates & Invalid Emails"
 name="Clean Email List"
 description="Clean email lists online. Lowercase addresses, filter duplicates, remove invalid syntax, and download a clean list. Core cleanup runs locally in your browser, with no signup required."
 path="/tools/clean-email-list"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="Clean Email List"
 title="Normalize the addresses and make the list usable again."
 intro="Paste a messy email list from outreach notes, spreadsheet exports, or copied lead sources. This tool trims noise, lowercases the addresses, removes invalid entries, and prepares a cleaner output."
 quote="The difference between a messy list and a usable one is usually ten small fixes repeated hundreds of times."
 tool={<CleanEmailListTool />}
 toolSupportingContent={
  <ToolSeoSections
  howItWorksTitle="Normalize a messy list until the addresses are usable again"
  howItWorksIntro="Clean Email List is the broader cleanup step for pasted email blocks. It helps when the source data has mixed casing, extra spaces, invalid entries, duplicates, or rough formatting from spreadsheets and copied notes. Instead of fixing one row at a time, you can paste the list, clean it in one pass, and move a more usable version into the next tool."
  howItWorksSteps={[
  {
  title: "Paste the messy list",
  text: "Start with the block of email data copied from notes, exports, enrichment sources, or teammate handoff docs.",
  },
  {
  title: "Run the cleanup pass",
  text: "The tool normalizes formatting, removes invalid entries, and reduces the list to cleaner output that is easier to trust.",
  },
  {
  title: "Export the cleaned addresses",
  text: "Copy or download the result once the addresses look ready for validation, dedupe, or outreach prep.",
  },
  ]}
  useCasesTitle="Common use cases"
  useCases={[
  {
  title: "Outreach list prep",
  text: "Clean a raw block of copied lead emails before it goes into a campaign or sequence build.",
  },
  {
  title: "Spreadsheet rescue",
  text: "Fix casing and formatting issues from exports that were fine structurally but messy at the address level.",
  },
  {
  title: "Teammate handoff cleanup",
  text: "Normalize a rough email list before another person validates, enriches, or imports it.",
  },
  ]}
  relatedTools={[
  {
  href: "/tools/remove-duplicate-emails",
  title: "Remove Duplicate Emails",
  description: "Use the narrower dedupe path when the list is already valid and only repeated addresses remain.",
  },
  {
  href: "/tools/validate-email-list",
  title: "Validate Email List",
  description: "Run a focused syntax check after cleaning when you want a final pass before outreach or import.",
  },
  {
  href: "/tools/extract-domains-from-emails",
  title: "Extract Domains from Emails",
  description: "Turn the cleaned email output into a company-domain list for enrichment and account research.",
  },
  ]}
  faqs={[
  {
  question: "How is this different from Validate Email List?",
  answer: "Validate Email List is a narrower syntax checker. Clean Email List is the broader cleanup step when the pasted data also needs normalization and list cleanup.",
  },
  {
  question: "Does this run in the browser?",
  answer: "Yes. The cleanup runs locally in your browser, so your pasted list is not sent to a server for processing.",
  },
  {
  question: "What is the usual next step?",
  answer: "Most people use Validate Email List for a final syntax pass or Remove Duplicate Emails when the remaining issue is only repetition.",
  },
  ]}
  />
 }
 />
 </>
);
}
