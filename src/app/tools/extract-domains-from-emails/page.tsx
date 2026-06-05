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

export default function ExtractDomainsFromEmailsPage() {
  return (
    <PageFrame>
      <ToolJsonLd
        title="Extract Domains from Emails"
        description="Extract domains from emails and URLs online. Paste messy text, remove duplicates, and export the result in your browser."
        path="/tools/extract-domains-from-emails"
        category="BusinessApplication"
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          Extract Domains from Emails
        </p>

        <div className="mt-6">
          <DomainExtractorTool />
        </div>
      </section>
    </PageFrame>
  );
}
