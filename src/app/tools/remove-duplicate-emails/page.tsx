import type { Metadata } from "next";

import { RemoveDuplicateEmailsTool } from "@/components/remove-duplicate-emails-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Remove Duplicate Emails",
  description:
    "Remove duplicate emails online. Keep one clean copy of each valid address and export the result in your browser.",
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
      <ToolJsonLd
        title="Remove Duplicate Emails"
        description="Remove duplicate emails online. Keep one clean copy of each valid address and export the result in your browser."
        path="/tools/remove-duplicate-emails"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Remove Duplicate Emails"
        title="Keep one clean copy of each address and drop the repetition."
        intro="Paste repeated lead lists, newsletter exports, or CRM contact blocks. This tool is for the narrower case where the addresses themselves are mostly fine but the list keeps echoing the same rows."
        quote="Sometimes the list is not broken. It is just louder than it needs to be."
        narrativeLabel="Best use"
        narrativeIntro="Use this when duplicate addresses are the real problem and you do not need a broader cleanup pass."
        narrativePoints={[
          "Helpful for merged spreadsheets, recurring outreach exports, and newsletter cleanup.",
          "It keeps the workflow simple: deduplicate, review, export, move on.",
          "If the list is also full of formatting problems, the email cleaner or CSV workflow will give you a better result.",
        ]}
        darkLabel="Narrow by design"
        darkTitle="This tool does one thing on purpose, which is part of why it feels fast."
        darkPoints={[
          "Core deduplication runs locally in your browser for the MVP flow.",
          "It is most useful as a cleanup side step, not the center of the product.",
          "If the whole lead file feels suspect, move to the CSV cleaner instead of forcing this page to do too much.",
        ]}
        relatedLabel="Related paths"
        relatedTitle="Use the focused dedupe path when repetition is the issue, then escalate if the list needs more judgment."
        relatedLinks={[
          {
            href: "/tools/extract-emails-from-text",
            title: "Extract Emails from Text",
            text: "Start here if the list has not been isolated from the source text yet.",
          },
          {
            href: "/tools/clean-email-list",
            title: "Clean Email List",
            text: "Use the broader cleaner when invalid formatting and noise matter too.",
          },
          {
            href: "/tools/csv-lead-cleaner",
            title: "CSV Lead Cleaner",
            text: "The main workflow once the list is part of a spreadsheet and needs fuller review.",
          },
        ]}
        tool={<RemoveDuplicateEmailsTool />}
      />
    </>
  );
}
