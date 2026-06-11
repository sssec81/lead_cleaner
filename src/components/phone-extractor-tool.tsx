"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

import { TextProcessingTool } from "@/components/text-processing-tool";
import {
 extractPhoneNumbersFromText,
 type PhoneExtractionOptions,
 type PhoneOutputFormat,
} from "@/lib/text-tools";

const SAMPLE_TEXT = `Call sales at +1 (415) 555-0101 or support on 415-555-0101.
Our London line is +44 20 7946 0958 and backup is (020) 7946 0958.`;

export function PhoneExtractorTool() {
 const [defaultCountry, setDefaultCountry] =
 useState<PhoneExtractionOptions["defaultCountry"]>("US");
 const [outputFormat, setOutputFormat] = useState<PhoneOutputFormat>("international");

 return (
 <TextProcessingTool
 title="Phone number extractor"
 description="Paste messy notes, copied pages, logs, or research scraps to extract phone numbers, remove duplicates, and export a clean list."
 icon={Phone}
 iconToneClassName="bg-blue-50 text-blue-700 ring-1 ring-blue-100"
 sampleInput={SAMPLE_TEXT}
 placeholder="Paste copied profiles, CRM notes, website text, or any messy block with phone numbers."
 trackName="extract-phone-numbers-from-text"
 processInput={(input) =>
 extractPhoneNumbersFromText(input, {
 defaultCountry,
 outputFormat,
 })
 }
 statLabels={{
 scanned: "Items scanned",
 found: "Found",
 duplicatesRemoved: "Duplicates removed",
 invalidRemoved: "Invalid removed",
 finalCount: "Clean numbers ready",
 }}
 csvHeader="phone"
 copyLabel="Copy numbers"
 primaryActionLabel="Extract phone numbers"
 resultTitle="Clean numbers ready"
 resultDescription="This tool extracts likely phone numbers from text. Choose a default country before export when you need country-specific validation."
 emptyMessage="No phone numbers detected yet. Paste text with numbers to generate a clean list."
 inputMinHeightClassName="min-h-[12rem] sm:min-h-[14rem]"
 inputLabel="Text input"
 inputHelpText="Paste copied pages, notes, support logs, or lead research blocks."
 collapseWorkspaceActions
 inputControls={
 <div className="space-y-3">
 <div className="grid gap-3 sm:grid-cols-2">
 <label className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
 <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
 Default country
 </span>
 <select
 value={defaultCountry}
 onChange={(event) =>
 setDefaultCountry(event.target.value as PhoneExtractionOptions["defaultCountry"])
 }
 className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
 >
 <option value="US">United States (+1)</option>
 <option value="GB">United Kingdom (+44)</option>
 <option value="IN">India (+91)</option>
 <option value="NP">Nepal (+977)</option>
 </select>
 </label>

 <label className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
 <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
 Output format
 </span>
 <select
 value={outputFormat}
 onChange={(event) => setOutputFormat(event.target.value as PhoneOutputFormat)}
 className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
 >
 <option value="international">International format</option>
 <option value="digits-only">Digits only</option>
 <option value="original">Keep original format</option>
 </select>
 </label>
 </div>

 <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900">
 This tool extracts likely phone numbers from text. For country-specific validation, choose a default country before export.
 </p>
 </div>
 }
 />
 );
}
