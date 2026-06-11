"use client";

import { Link as LinkIcon } from "lucide-react";

import { TextProcessingTool } from "@/components/text-processing-tool";
import { extractUrlsFromText } from "@/lib/text-tools";

const SAMPLE_TEXT = `https://leadcleanr.com
www.leadcleanr.com
http://docs.leadcleanr.com/start
www.leadcleanr.com/blog
https://leadcleanr.com`;

export function RemoveDuplicateUrlsTool() {
 return (
 <TextProcessingTool
 title="Remove duplicate URLs"
 description="Paste a messy list of URLs and we'll automatically normalize formats and strip out any duplicates."
 icon={LinkIcon}
 iconToneClassName="bg-blue-50 text-blue-700 ring-1 ring-blue-100"
 sampleInput={SAMPLE_TEXT}
 placeholder="Paste a list of URLs here to instantly remove duplicates."
 trackName="remove-duplicate-urls"
 processInput={extractUrlsFromText}
 statLabels={{
 scanned: "Items scanned",
 found: "Found",
 duplicatesRemoved: "Duplicates removed",
 invalidRemoved: "Invalid removed",
 finalCount: "Clean URLs ready",
 }}
 csvHeader="url"
 copyLabel="Copy unique list"
 primaryActionLabel="Remove Duplicates"
 resultTitle="Deduplication complete"
 resultDescription="Here are your unique URLs with standard formatting applied."
 emptyMessage="No URLs detected yet. Paste a list to remove duplicates."
 />
 );
}
