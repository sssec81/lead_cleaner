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
      description="Paste your email list to find invalid addresses, missing @ symbols, duplicate emails, and formatting errors before sending or importing."
      icon={CheckCircle2}
      iconToneClassName="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
      sampleInput={SAMPLE_EMAIL_LIST}
      placeholder="Paste an email list to check for syntax issues, extra spaces, duplicates, and broken formatting."
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
      resultDescription="This free validator checks formatting only. Domain, MX, SMTP, and mailbox verification are planned for Pro."
      emptyMessage="No valid email addresses detected yet. Paste a list to run a syntax check."
      inputMinHeightClassName="min-h-[11rem] sm:min-h-[13rem]"
      inputLabel="Email list input"
      inputHelpText="Paste one email per line or drop in a rough list copied from your CRM, spreadsheet, or notes."
      collapseWorkspaceActions
    />
  );
}
