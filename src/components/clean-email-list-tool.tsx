"use client";

import { Sparkles } from "lucide-react";

import { TextProcessingTool } from "@/components/text-processing-tool";
import { cleanEmailList } from "@/lib/text-tools";

const SAMPLE_EMAIL_LIST = ` Sales@LeadCleanr.com
support@leadcleanr.com
invalid-email
hello@leadcleanr.com
sales@leadcleanr.com
 MEDIA@LeadCleanr.com `;

export function CleanEmailListTool() {
 return (
 <TextProcessingTool
 title="Clean email list online"
 description="Paste a raw email list to lowercase addresses, remove blanks, filter invalid entries, and deduplicate the final output."
 icon={Sparkles}
 iconToneClassName="bg-teal-50 text-teal-700 ring-1 ring-teal-100"
 sampleInput={SAMPLE_EMAIL_LIST}
 placeholder="Paste one email per line or a mixed list separated by commas, spaces, or tabs."
 trackName="clean-email-list"
 processInput={cleanEmailList}
 statLabels={{
 scanned: "Items scanned",
 found: "Found",
 duplicatesRemoved: "Duplicates removed",
 invalidRemoved: "Invalid removed",
 finalCount: "Clean emails ready",
 }}
 csvHeader="email"
 copyLabel="Copy clean list"
 primaryActionLabel="Clean email list"
 resultTitle="Clean result"
 resultDescription="Review the cleaned list before exporting it to outreach tools or a CRM."
 emptyMessage="No valid email addresses detected yet. Paste a raw list to generate a cleaned result."
 />
 );
}
