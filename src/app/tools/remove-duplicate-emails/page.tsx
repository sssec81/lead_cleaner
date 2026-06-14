import type { Metadata } from "next";

import { RemoveDuplicateEmailsTool } from "@/components/remove-duplicate-emails-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { ToolSeoSections } from "@/components/tool-seo-sections";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Remove Duplicate Emails Online — Private Email Deduper",
 description:
 "Remove duplicate emails online. Keep one clean copy of each valid address and export the result. Core cleanup runs locally in your browser, with no signup required.",
 path: "/tools/remove-duplicate-emails",
 keywords: [
 "remove duplicate emails",
 "deduplicate email list",
 "email deduper",
 "clean lead emails",
 ],
});

export default function RemoveDuplicateEmailsPage() {
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "Remove Duplicate Emails", url: "/tools/remove-duplicate-emails" },
 ]}
 />
 <ToolJsonLd
 name="Remove Duplicate Emails"
 title="Remove Duplicate Emails Online — Private Email Deduper"
 description="Remove duplicate emails online. Keep one clean copy of each valid address and export the result. Core cleanup runs locally in your browser, with no signup required."
 path="/tools/remove-duplicate-emails"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="Remove Duplicate Emails"
 title="Keep one clean copy of each address and drop the repetition."
 intro="Paste repeated lead lists, newsletter exports, or CRM contact blocks. This tool is for the narrower case where the addresses themselves are mostly fine but the list keeps echoing the same rows."
 quote="Sometimes the list is not broken. It is just louder than it needs to be."
 tool={<RemoveDuplicateEmailsTool />}
 toolSupportingContent={
  <ToolSeoSections
  howItWorksTitle="Keep one clean copy of each address and drop the repetition"
  howItWorksIntro="Remove Duplicate Emails is the focused tool for lists that are mostly valid but still too repetitive. Instead of cleaning formatting or checking a full spreadsheet, it reduces the list to one copy of each email address so the final output is easier to send, review, or import."
  howItWorksSteps={[
  {
  title: "Paste the repeated list",
  text: "Start with the email block copied from CRM exports, campaign drafts, or combined source lists.",
  },
  {
  title: "Remove repeated addresses",
  text: "The tool keeps one clean copy of each address so the output is shorter, quieter, and easier to trust.",
  },
  {
  title: "Copy or export the result",
  text: "Use the deduped list in the next workflow once the repeated rows are out of the way.",
  },
  ]}
  useCasesTitle="Common use cases"
  useCases={[
  {
  title: "Campaign cleanup",
  text: "Remove repeat contacts before an outreach send so the list is not bloated with duplicates.",
  },
  {
  title: "Combined source lists",
  text: "Deduplicate a list after you copy leads from several files or tools into one working block.",
  },
  {
  title: "CRM hygiene",
  text: "Reduce repetition before import when the main issue is duplicated addresses rather than formatting quality.",
  },
  ]}
  relatedTools={[
  {
  href: "/tools/clean-email-list",
  title: "Clean Email List",
  description: "Use the broader cleanup workflow when the pasted data also needs normalization or invalid-entry removal.",
  },
  {
  href: "/tools/validate-email-list",
  title: "Validate Email List",
  description: "Run a syntax-focused check when you want to confirm the remaining addresses look structurally valid.",
  },
  {
  href: "/tools/extract-emails-from-csv",
  title: "Extract Emails from CSV",
  description: "Pull the email addresses out of a spreadsheet first when the source data still lives inside a CSV column.",
  },
  ]}
  faqs={[
  {
  question: "Does this validate the addresses too?",
  answer: "This page is mainly for deduplication. If you want a syntax-focused pass afterward, use Validate Email List.",
  },
  {
  question: "When should I use Clean Email List instead?",
  answer: "Use Clean Email List when the pasted data also needs normalization, invalid-entry cleanup, or broader list cleanup beyond duplicates.",
  },
  {
  question: "Is the list processed locally?",
  answer: "Yes. The dedupe runs in your browser and does not require you to upload the pasted email list to a server.",
  },
  ]}
  />
 }
 />
 </>
);
}
