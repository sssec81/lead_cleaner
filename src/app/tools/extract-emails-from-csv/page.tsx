import type { Metadata } from "next";
import { ShieldCheck, Sparkles } from "lucide-react";

import { ExtractEmailsFromCsvTool } from "@/components/extract-emails-from-csv-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Emails from CSV Online — Private Browser Tool",
  description:
    "Extract and clean emails from CSV files. Detect the email column, pull addresses out of messy cell text, remove duplicates and invalid rows, and download a clean list locally in your browser.",
  path: "/tools/extract-emails-from-csv",
  keywords: [
    "extract emails from csv",
    "csv email extractor",
    "email column cleaner",
    "lead csv email export",
  ],
});

export default function ExtractEmailsFromCsvPage() {
  const asideContent = (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 p-8 shadow-sm backdrop-blur-md sm:p-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/30 to-emerald-50/40" />
      <div className="relative">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
          <Sparkles className="h-4 w-4" />
          Output Preview
        </div>
        <h3 className="font-display text-2xl font-bold leading-tight text-slate-900">
          See the clean list before you upload anything.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The result is a focused export-ready email column with duplicates, blanks, and broken addresses removed.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-[0_20px_45px_rgba(15,23,42,0.16)]">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Detected Email Column
            </span>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Export Ready
            </span>
          </div>
          <div className="space-y-2 px-4 py-4 font-mono text-sm text-emerald-300">
            <div>jane@acme.com</div>
            <div>john@northstar.io</div>
            <div>sarah@agency.co</div>
            <div>team@riverlabs.ai</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {["No signup", "Browser only", "CSV never uploaded"].map((item) => (
            <div
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700"
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
          { name: "Extract Emails from CSV", url: "/tools/extract-emails-from-csv" },
        ]}
      />
      <ToolJsonLd
        title="Extract Emails from CSV Online — Private Browser Tool"
        description="Extract and clean emails from CSV files. Detect the email column, pull addresses out of messy cell text, remove duplicates and invalid rows, and download a clean list locally in your browser."
        path="/tools/extract-emails-from-csv"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract Emails from CSV"
        title="Extract clean email lists from messy spreadsheets in seconds."
        intro="Upload any CSV, detect the email column, pull email addresses out of messy cells, remove blanks, invalid rows, and duplicates, then export an outreach-ready list without touching the rest of the sheet."
        quote="Turn a messy spreadsheet into a clean email list you can use right away."
        asideContent={asideContent}
        tool={<ExtractEmailsFromCsvTool />}
      />
    </>
  );
}
