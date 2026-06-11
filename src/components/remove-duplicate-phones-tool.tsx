"use client";

import { CopyMinus } from "lucide-react";

import { TextProcessingTool } from "@/components/text-processing-tool";
import { removeDuplicatePhoneNumbers } from "@/lib/text-tools";

const SAMPLE_PHONE_LIST = `+1 (415) 555-0198
415-555-0198
+44 20 7946 0958
+1 415 555 0198
invalid-phone
(415) 555-0198`;

export function RemoveDuplicatePhonesTool() {
 return (
 <TextProcessingTool
 title="Remove duplicate phones"
 description="Paste a repeated phone number list to keep one clean, formatted copy of each valid number and drop the rest."
 icon={CopyMinus}
 iconToneClassName="bg-blue-50 text-blue-700 ring-1 ring-blue-100"
 sampleInput={SAMPLE_PHONE_LIST}
 placeholder="Paste phone numbers (one per line or mixed in text) separated by commas, spaces, or tabs."
 trackName="remove-duplicate-phones"
 processInput={removeDuplicatePhoneNumbers}
 statLabels={{
 scanned: "Lines scanned",
 found: "Found",
 duplicatesRemoved: "Duplicates removed",
 invalidRemoved: "Invalid removed",
 finalCount: "Unique phones ready",
 }}
 csvHeader="phone"
 copyLabel="Copy deduplicated list"
 primaryActionLabel="Remove duplicates"
 resultTitle="Deduplicated result"
 resultDescription="Preview the unique formatted list, make quick fixes, and export only what you want to keep."
 emptyMessage="No valid phone numbers detected yet. Paste a repeated list to generate a unique result."
 />
 );
}
