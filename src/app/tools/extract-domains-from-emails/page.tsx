import type { Metadata } from "next";

import { DomainExtractorTool } from "@/components/domain-extractor-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Domains from Emails Online",
  description:
    "Extract domains from emails and URLs. Parse unique domains from contact records to isolate corporate websites and accounts—100% locally on-device with no signup required.",
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
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Extract Domains from Emails", url: "/tools/extract-domains-from-emails" },
        ]}
      />
      <ToolJsonLd
        title="Extract Domains from Emails Online"
        description="Extract domains from emails and URLs. Parse unique domains from contact records to isolate corporate websites and accounts—100% locally on-device with no signup required."
        path="/tools/extract-domains-from-emails"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract Domains from Emails"
        title="Isolate company domains from lead emails and URLs."
        intro="Paste a raw list of prospect emails or web links. This tool strips out the personal prefixes and outputs a clean, deduplicated list of unique domains, perfect for CRM account mapping and target enrichment."
        quote="Outreach targets companies, not just addresses. Clean the domains first."
        tool={<DomainExtractorTool />}
      />
    </>
  );
}
