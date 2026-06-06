"use client";

import { Link as LinkIcon } from "lucide-react";

import { TextProcessingTool } from "@/components/text-processing-tool";
import { extractUrlsFromText } from "@/lib/text-tools";

const SAMPLE_TEXT = `Visit https://leadcleanr.com for the main site, or browse www.leadcleanr.com/tools.
Docs live at http://docs.leadcleanr.com/start and the blog preview is www.leadcleanr.com/blog.`;

export function UrlExtractorTool() {
  return (
    <TextProcessingTool
      title="Extract URLs from text"
      description="Paste messy text, pull out website links, normalize the format, remove duplicates, and export the clean list."
      icon={LinkIcon}
      iconToneClassName="bg-[color:rgba(37,99,235,0.08)] text-[color:var(--brand-strong)]"
      sampleInput={SAMPLE_TEXT}
      placeholder="Paste copied website text, notes, or any messy block with links and URLs."
      trackName="extract-urls-from-text"
      processInput={extractUrlsFromText}
      statLabels={{
        total: "URLs found",
        duplicates: "Duplicates removed",
        invalid: "Invalid entries removed",
        ready: "Clean URLs ready",
      }}
      csvHeader="url"
      copyLabel="Copy results"
      primaryActionLabel="Extract URLs"
      resultTitle="Clean result"
      resultDescription="Preview the cleaned links before they become a download or a spreadsheet paste."
      emptyMessage="No URLs detected yet. Paste text with links to generate a clean list."
    />
  );
}
