"use client";

import { Globe } from "lucide-react";

import { TextProcessingTool } from "@/components/text-processing-tool";
import { extractDomainsFromEmails } from "@/lib/text-tools";

const SAMPLE_TEXT = `Sales team: sales@leadcleanr.com and support@LeadCleanr.com
Partners: hello@agencystack.io
Sites: https://leadcleanr.com/pricing, www.agencystack.io/about, and http://blog.leadcleanr.com/start`;

export function DomainExtractorTool() {
 return (
 <TextProcessingTool
 title="Extract domains from emails and URLs"
 description="Paste emails or website links, pull out the root domains, remove duplicates, and export the clean list."
 icon={Globe}
 iconToneClassName="bg-[var(--lc-accent-bg)] text-[var(--lc-accent-strong)] ring-1 ring-[var(--lc-accent-border)]"
 sampleInput={SAMPLE_TEXT}
 placeholder="Paste email addresses, website URLs, or any messy lead text with domains."
 trackName="extract-domains-from-emails"
 processInput={extractDomainsFromEmails}
 statLabels={{
 scanned: "Items scanned",
 found: "Found",
 duplicatesRemoved: "Duplicates removed",
 invalidRemoved: "Invalid removed",
 finalCount: "Clean domains ready",
 }}
 csvHeader="domain"
 copyLabel="Copy results"
 primaryActionLabel="Extract domains"
 resultTitle="Clean result"
 resultDescription="Preview the extracted domains, remove noise, and export only what is useful."
 emptyMessage="No domains detected yet. Paste emails or URLs to generate a clean list."
 />
 );
}
