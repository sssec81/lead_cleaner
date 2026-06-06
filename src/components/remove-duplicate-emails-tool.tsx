"use client";

import { CopyMinus } from "lucide-react";

import { TextProcessingTool } from "@/components/text-processing-tool";
import { removeDuplicateEmails } from "@/lib/text-tools";

const SAMPLE_EMAIL_LIST = `team@leadcleanr.com
sales@leadcleanr.com
TEAM@LEADCLEANR.COM
hello@leadcleanr.com
invalid-email
sales@leadcleanr.com
media@leadcleanr.com`;

export function RemoveDuplicateEmailsTool() {
  return (
    <TextProcessingTool
      title="Remove duplicate emails"
      description="Paste a repeated email list to keep one clean copy of each valid address and drop the rest."
      icon={CopyMinus}
      iconToneClassName="bg-[color:rgba(37,99,235,0.08)] text-[color:var(--brand-strong)]"
      sampleInput={SAMPLE_EMAIL_LIST}
      placeholder="Paste one email per line or a mixed list separated by commas, spaces, or tabs."
      trackName="remove-duplicate-emails"
      processInput={removeDuplicateEmails}
      statLabels={{
        total: "Valid emails scanned",
        duplicates: "Duplicates removed",
        invalid: "Invalid entries removed",
        ready: "Unique emails ready",
      }}
      csvHeader="email"
      copyLabel="Copy deduplicated list"
      primaryActionLabel="Remove duplicates"
      resultTitle="Deduplicated result"
      resultDescription="Preview the unique list, make quick fixes, and export only what you want to keep."
      emptyMessage="No valid email addresses detected yet. Paste a repeated list to generate a unique result."
    />
  );
}
