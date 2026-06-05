import type { Metadata } from "next";

import { CleanEmailListTool } from "@/components/clean-email-list-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Clean Email List",
  description:
    "Clean email lists online. Lowercase addresses, remove duplicates, filter invalid entries, and export the result in your browser.",
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
      <ToolJsonLd
        title="Clean Email List"
        description="Clean email lists online. Lowercase addresses, remove duplicates, filter invalid entries, and export the result in your browser."
        path="/tools/clean-email-list"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Clean Email List"
        title="Normalize the addresses and make the list usable again."
        intro="Paste a messy email list from outreach notes, spreadsheet exports, or copied lead sources. This tool trims noise, lowercases the addresses, removes invalid entries, and prepares a cleaner output."
        quote="The difference between a messy list and a usable one is usually ten small fixes repeated hundreds of times."
        narrativeLabel="Where this fits"
        narrativeIntro="Use it when the addresses already exist and the real job is fixing the quality of the list rather than extracting from raw text."
        narrativePoints={[
          "Good for old outreach lists, CRM exports, newsletter prep, and hand-built contact sheets.",
          "This is the tightening step after extraction, not the discovery step before it.",
          "If the data is already in a CSV with multiple messy columns, jump to the CSV cleaner instead.",
        ]}
        darkLabel="Quiet utility"
        darkTitle="A good cleaner does not need to be dramatic. It just needs to leave fewer bad rows behind."
        darkPoints={[
          "Core cleanup runs in your browser for the MVP flow.",
          "Exports stay simple because the job is about confidence, not novelty.",
          "This is one of the supporting tools around the broader CSV-first product story.",
        ]}
        relatedLabel="Related paths"
        relatedTitle="Use it after extraction, or skip ahead to the spreadsheet workflow."
        relatedLinks={[
          {
            href: "/tools/extract-emails-from-text",
            title: "Extract Emails from Text",
            text: "Start here if the contact data still lives in copied blocks of text.",
          },
          {
            href: "/tools/remove-duplicate-emails",
            title: "Remove Duplicate Emails",
            text: "Use the narrower dedupe path when invalid formatting is not the main issue.",
          },
          {
            href: "/tools/csv-lead-cleaner",
            title: "CSV Lead Cleaner",
            text: "The better path when the whole spreadsheet needs cleaning instead of just the email list.",
          },
        ]}
        tool={<CleanEmailListTool />}
      />
    </>
  );
}
