"use client";

import { CheckCircle2 } from "lucide-react";

import { TextProcessingTool } from "@/components/text-processing-tool";
import { validateEmailListSyntax } from "@/lib/text-tools";

const SAMPLE_EMAIL_LIST = `john.doe@company.com
invalid-email-address
test@domain
sales@startup.io
jane.smith@corporation.co.uk
missing@at-sign
support@leadcleanr.com`;

export function ValidateEmailListTool() {
  return (
    <TextProcessingTool
      title="Validate email list syntax"
      description="Paste a list of emails to verify strict formatting and separate the structurally valid addresses from the broken ones."
      icon={CheckCircle2}
      iconToneClassName="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
      sampleInput={SAMPLE_EMAIL_LIST}
      placeholder="Paste an email list to check for syntax and formatting errors."
      trackName="validate-email-list"
      processInput={validateEmailListSyntax}
      statLabels={{
        scanned: "Emails scanned",
        found: "Processed",

        invalidRemoved: "Broken Syntax",
        finalCount: "Clean emails ready",
        duplicatesRemoved: "Duplicates merged",
      }}
      csvHeader="email"
      copyLabel="Copy valid list"
      primaryActionLabel="Validate Syntax"
      resultTitle={(count) => count > 0 ? `${count} valid addresses found — syntax only. MX/SMTP check available on Pro.` : null}
      resultDescription={null}
      emptyMessage="No valid email addresses detected yet. Paste a list to run a syntax check."
    />
  );
}
