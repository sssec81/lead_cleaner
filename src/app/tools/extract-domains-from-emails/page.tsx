import type { Metadata } from "next";

import { DomainExtractorTool } from "@/components/domain-extractor-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Domains from Emails",
  description:
    "Extract domains from emails and URLs online. Paste messy text, remove duplicates, and export the result in your browser.",
  path: "/tools/extract-domains-from-emails",
  keywords: [
    "extract domains from emails",
    "email domain extractor",
    "domain list generator",
    "lead research domains",
  ],
});

import { TextToolPageShell } from "@/components/text-tool-page-shell";

export default function ExtractDomainsFromEmailsPage() {
  return (
    <>
      <ToolJsonLd
        title="Extract Domains from Emails"
        description="Extract domains from emails and URLs online. Paste messy text, remove duplicates, and export the result in your browser."
        path="/tools/extract-domains-from-emails"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract Domains from Emails"
        title="Isolate company domains from lead emails and URLs."
        intro="Paste a raw list of prospect emails or web links. This tool strips out the personal prefixes and outputs a clean, deduplicated list of unique domains, perfect for CRM account mapping and target enrichment."
        quote="Outreach targets companies, not just addresses. Clean the domains first."
        narrativeLabel="Best use cases"
        narrativeIntro="Use this when mapping contact lists back to target account domains for newsletter segmentation or LinkedIn ad matching."
        narrativePoints={[
          "Ideal for stripping email prefixes (e.g. name@) from thousands of leads instantly.",
          "Helpful for pulling company hosts out of messy research links and web files.",
          "Provides a fast, client-side domain list before you upload to ad networks.",
        ]}
        darkLabel="Browser-side security"
        darkTitle="Deduplication and processing are completed locally on your device."
        darkPoints={[
          "Raw email lists and parsed results never leave your browser context.",
          "Runs on standard client-side regex without external API lookups.",
          "Perfect for compliance-safe B2B database enrichment tasks.",
        ]}
        relatedLabel="Related paths"
        relatedTitle="Use this to isolate target company lists, then explore supporting utilities."
        relatedLinks={[
          {
            href: "/tools/extract-emails-from-text",
            title: "Extract Emails from Text",
            text: "Isolate prospect addresses from raw copied text pools.",
          },
          {
            href: "/tools/clean-email-list",
            title: "Clean Email List",
            text: "Trim spaces, lowercase, and purge invalid entries from lead lists.",
          },
          {
            href: "/tools/csv-lead-cleaner",
            title: "CSV Lead Cleaner",
            text: "The primary tool to clean and deduplicate structured spreadsheet lists.",
          },
        ]}
        tool={<DomainExtractorTool />}
      />
    </>
  );
}
