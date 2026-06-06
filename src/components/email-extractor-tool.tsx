"use client";

import { Mail } from "lucide-react";

import { TextProcessingTool } from "@/components/text-processing-tool";
import { extractEmailsFromText } from "@/lib/text-tools";

const SAMPLE_TEXT = `Reach our team at Sales@LeadCleanr.com, support@leadcleanr.com, or sales@leadcleanr.com.
For partnerships email Hello@LeadCleanr.com and media@leadcleanr.com.`;

export function EmailExtractorTool() {
  return (
    <TextProcessingTool
      title="Extract emails from text"
      description="Paste messy text, pull out email addresses, remove duplicates, then copy or export the clean list."
      icon={Mail}
      iconToneClassName="bg-[color:rgba(37,99,235,0.08)] text-[color:var(--brand-strong)]"
      sampleInput={SAMPLE_TEXT}
      placeholder="Paste website text, copied profiles, CRM notes, or any messy lead block here."
      trackName="extract-emails-from-text"
      processInput={extractEmailsFromText}
      statLabels={{
        total: "Emails found",
        duplicates: "Duplicates removed",
        invalid: "Invalid entries removed",
        ready: "Clean emails ready",
      }}
      csvHeader="email"
      copyLabel="Copy results"
      resultTitle="Clean result"
      resultDescription="Preview, edit, and export the extracted list before it leaves the page."
      emptyMessage="No email addresses detected yet. Paste text with emails to generate a clean list."
    />
  );
}
