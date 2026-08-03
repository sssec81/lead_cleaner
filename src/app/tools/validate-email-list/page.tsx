import type { Metadata } from "next";

import { ToolSeoSections } from "@/components/tool-seo-sections";
import { ValidateEmailListTool } from "@/components/validate-email-list-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Email List Syntax Validator",
 description:
 "Check an email list for invalid syntax, missing @ symbols, duplicates, and formatting errors before CRM import. This does not verify mailboxes.",
 path: "/tools/validate-email-list",
 keywords: [
 "validate email list",
 "email list validator",
 "check email syntax",
 "email format checker",
 "verify email list formatting",
 ],
});

export default function ValidateEmailListPage() {
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "Validate Email List", url: "/tools/validate-email-list" },
 ]}
 />
 <ToolJsonLd
 name="Validate Email List"
 title="Email List Syntax Validator"
 description="Paste your email list to find invalid addresses, missing @ symbols, duplicate emails, and formatting errors before sending or importing to your CRM."
 path="/tools/validate-email-list"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="Email List Validator"
 title="Validate email list syntax before CRM import."
 intro="Paste your email list to find invalid addresses, missing @ symbols, duplicate emails, and formatting errors before sending or importing to your CRM."
 asideDescription="Checks formatting only. Domain, MX, and mailbox verification are coming to Pro. You can fix syntax now without treating it as a deliverability check."
 tool={<ValidateEmailListTool />}
 toolSupportingContent={
  <ToolSeoSections
  howItWorksTitle="Check email list formatting before outreach or CRM import"
  howItWorksIntro="Validate Email List is the fast syntax pass for pasted email blocks. Use it when you want to catch obvious format problems before a campaign launch, import, or handoff. It checks for malformed addresses, trims the list down to cleaner output, and helps you spot issues before the data reaches another tool."
  howItWorksSteps={[
  {
  title: "Paste the email list",
  text: "Start with the addresses copied from a spreadsheet, outreach tool, or rough source notes.",
  },
  {
  title: "Run the syntax check",
  text: "The validator flags missing @ symbols, malformed domains, blank rows, and repeated formatting issues.",
  },
  {
  title: "Copy or export the clean result",
  text: "Use the cleaned output for the next workflow once the obvious formatting problems are removed.",
  },
  ]}
  useCasesTitle="Common use cases"
  useCases={[
  {
  title: "Pre-send QA",
  text: "Check a pasted list before a campaign or sequence so obvious formatting mistakes do not move downstream.",
  },
  {
  title: "CRM import prep",
  text: "Catch broken addresses before a contact list is uploaded into your CRM or enrichment workflow.",
  },
  {
  title: "Team review",
  text: "Clean a rough block of copied emails before sharing it with another person for outreach or enrichment.",
  },
  ]}
  relatedTools={[
  {
  href: "/tools/clean-email-list",
  title: "Clean Email List",
  description: "Normalize casing and clean surrounding noise when the list needs more than a simple syntax check.",
  },
  {
  href: "/tools/remove-duplicate-emails",
  title: "Remove Duplicate Emails",
  description: "Keep one clean copy of each address when the formatting is fine but the list repeats itself.",
  },
  {
  href: "/tools/extract-domains-from-emails",
  title: "Extract Domains from Emails",
  description: "Turn valid email output into a company-domain list for enrichment or account-based workflows.",
  },
  ]}
  faqs={[
  {
  question: "Does this verify mailbox existence?",
  answer: "No. This tool checks formatting and list cleanliness only. Full deliverability and mailbox verification are separate problems.",
  },
  {
  question: "What kinds of issues does it catch?",
  answer: "It catches common syntax problems like missing @ symbols, invalid domain structure, blank rows, and obvious formatting noise.",
  },
  {
  question: "What should I use after this?",
  answer: "Use Clean Email List for broader normalization or Remove Duplicate Emails if the main remaining issue is repetition.",
  },
  ]}
  />
 }
 />
 </>
 );
}
