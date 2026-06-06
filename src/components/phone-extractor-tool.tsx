"use client";

import { Phone } from "lucide-react";

import { TextProcessingTool } from "@/components/text-processing-tool";
import { extractPhoneNumbersFromText } from "@/lib/text-tools";

const SAMPLE_TEXT = `Call sales at +1 (415) 555-0101 or support on 415-555-0101.
Our London line is +44 20 7946 0958 and backup is (020) 7946 0958.`;

export function PhoneExtractorTool() {
  return (
    <TextProcessingTool
      title="Extract phone numbers from text"
      description="Paste messy text, extract phone numbers, normalize formatting, remove duplicates, and export the clean list."
      icon={Phone}
      iconToneClassName="bg-[color:rgba(37,99,235,0.08)] text-[color:var(--brand-strong)]"
      sampleInput={SAMPLE_TEXT}
      placeholder="Paste copied profiles, CRM notes, website text, or any messy block with phone numbers."
      trackName="extract-phone-numbers-from-text"
      processInput={extractPhoneNumbersFromText}
      statLabels={{
        total: "Numbers found",
        duplicates: "Duplicates removed",
        invalid: "Invalid entries removed",
        ready: "Clean numbers ready",
      }}
      csvHeader="phone"
      copyLabel="Copy results"
      primaryActionLabel="Extract phone numbers"
      resultTitle="Clean result"
      resultDescription="Preview normalized phone numbers before you download or paste them elsewhere."
      emptyMessage="No phone numbers detected yet. Paste text with numbers to generate a clean list."
    />
  );
}
