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
      title="Email list validator"
      description="Find invalid addresses, duplicates, and formatting errors before you send or import."
      icon={CheckCircle2}
      iconToneClassName="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
      sampleInput={SAMPLE_EMAIL_LIST}
      placeholder="Paste a list of emails, one per line."
      trackName="validate-email-list"
      processInput={validateEmailListSyntax}
      statLabels={{
        scanned: "Emails scanned",
        found: "Valid found",
        invalidRemoved: "Invalid removed",
        finalCount: "Clean emails ready",
        duplicatesRemoved: "Duplicates removed",
      }}
      csvHeader="email"
      copyLabel="Copy valid list"
      primaryActionLabel="Validate emails"
      resultTitle={(count) => count > 0 ? `${count} valid addresses ready` : null}
      resultDescription="Syntax only — no MX, SMTP, or send required. Deliverability checks are coming to Pro."
      emptyMessage="Paste a list above and valid addresses will appear here."
      inputMinHeightClassName="min-h-[11rem] sm:min-h-[13rem]"
      inputLabel="Email list input"
      inputHelpText="One email per line. Messy or mixed lists are fine."
      collapseWorkspaceActions
    />
  );
}
