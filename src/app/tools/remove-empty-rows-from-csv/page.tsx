import type { Metadata } from "next";
import { Eraser, ShieldCheck, Sparkles } from "lucide-react";

import { RemoveEmptyRowsCsvTool } from "@/components/remove-empty-rows-csv-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Remove Empty Rows from CSV Online — Free Tool",
 description:
 "Upload a CSV to instantly delete all empty and blank rows. Export a perfectly clean spreadsheet without opening Excel.",
 path: "/tools/remove-empty-rows-from-csv",
 keywords: [
 "remove empty rows from csv",
 "delete blank rows csv",
 "clean empty cells csv",
 "csv empty row remover",
 ],
});

export default function RemoveEmptyRowsFromCsvPage() {
 const asideContent = (
 <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
 <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/30 to-emerald-50/40" />
 <div className="relative">
 <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
 <Sparkles className="h-4 w-4" />
 Cleanup Preview
 </div>
 <h3 className="font-display text-2xl font-bold leading-tight text-slate-900">
 Remove blank rows before they become import noise.
 </h3>
 <p className="mt-3 text-sm leading-relaxed text-slate-600">
 This pass deletes fully empty rows, fixes phantom spreadsheet spacing, and gives you a cleaner export instantly.
 </p>

 <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
 <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
 <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
 What gets removed
 </span>
 <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
 1-click clean
 </span>
 </div>
 <div className="divide-y divide-slate-100 px-4 py-1">
 {["Completely blank rows", "Empty spacer lines", "Excel phantom rows"].map((item) => (
 <div key={item} className="flex items-center justify-between gap-3 py-3">
 <span className="text-sm font-medium text-slate-700">{item}</span>
 <Eraser className="h-4 w-4 text-blue-600" />
 </div>
 ))}
 </div>
 </div>

 <div className="mt-5 flex flex-wrap gap-2">
 {["No mapping needed", "Browser only", "CSV never uploaded"].map((item) => (
 <div
 key={item}
 className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
 >
 <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
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
 name: "Remove Empty Rows from CSV",
 url: "/tools/remove-empty-rows-from-csv",
 },
 ]}
 />
 <ToolJsonLd
 title="Remove Empty Rows from CSV Online — Free Tool"
 description="Upload a CSV to instantly delete all empty and blank rows. Export a perfectly clean spreadsheet without opening Excel."
 path="/tools/remove-empty-rows-from-csv"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="Remove Empty Rows from CSV"
 title="Delete blank rows from your spreadsheet instantly."
 intro="Upload your messy CSV file. We'll automatically find and delete any row that is completely empty, saving you the hassle of sorting and filtering in Excel."
 quote="A one-click fix for the most annoying problem in CSV formatting."
 asideContent={asideContent}
 tool={<RemoveEmptyRowsCsvTool />}
 />
 </>
 );
}
