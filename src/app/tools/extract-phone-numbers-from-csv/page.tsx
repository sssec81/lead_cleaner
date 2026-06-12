import type { Metadata } from "next";
import { ShieldCheck, Smartphone, Sparkles } from "lucide-react";

import { ExtractPhonesFromCsvTool } from "@/components/extract-phones-from-csv-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Extract Phone Numbers from CSV Online — Free Tool",
 description:
 "Upload a CSV file to automatically detect the phone column, pull phone numbers out of messy cell text, normalize valid matches, and export a clean list locally in your browser.",
 path: "/tools/extract-phone-numbers-from-csv",
 keywords: [
 "extract phone numbers from csv",
 "csv phone extractor",
 "pull phone numbers from spreadsheet",
 "clean phone numbers csv",
 ],
});

export default function ExtractPhoneNumbersFromCsvPage() {
 const asideContent = (
 <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
 <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/30 to-emerald-50/40" />
 <div className="relative">
 <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
 <Sparkles className="h-4 w-4" />
 Output Preview
 </div>
 <h3 className="font-display text-2xl font-bold leading-tight text-slate-900">
 Normalize the keepers before they leave the page.
 </h3>
 <p className="mt-3 text-sm leading-relaxed text-slate-600">
 The result is a deduplicated phone list with valid matches standardized for CRM imports and outreach tools.
 </p>

 <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm">
 <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
 <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
 Clean Phone Export
 </span>
 <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
 E.164 Ready
 </span>
 </div>
 <div className="space-y-2 px-4 py-4 font-mono text-sm text-emerald-300">
 <div>+14155550101</div>
 <div>+442079460958</div>
 <div>+61290123456</div>
 <div>+918527001234</div>
 </div>
 </div>

 <div className="mt-5 flex flex-wrap gap-2">
 {["No signup", "Private in browser", "Ready for import"].map((item) => (
 <div
 key={item}
 className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
 >
 {item === "Ready for import" ? (
 <Smartphone className="h-3.5 w-3.5 text-blue-600" />
 ) : (
 <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
 )}
 {item}
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 {
 name: "Extract Phone Numbers from CSV",
 url: "/tools/extract-phone-numbers-from-csv",
 },
 ]}
 />
 <ToolJsonLd
 title="Extract Phone Numbers from CSV Online — Free Tool"
 description="Upload a CSV file to automatically detect the phone column, pull phone numbers out of messy cell text, normalize valid matches, and export a clean list locally in your browser."
 path="/tools/extract-phone-numbers-from-csv"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="Extract Phones from CSV"
 title="Pull clean phone numbers from any messy spreadsheet."
 intro="Upload your CSV. We'll automatically find the column containing phone numbers, pull valid numbers out of messy cells, strip out the broken ones, normalize the clean matches, and give you a clean export."
 quote="Stop fighting with Excel text-to-columns to fix phone numbers."
 asideContent={asideContent}
 tool={<ExtractPhonesFromCsvTool />}
 />
 </>
 );
}
