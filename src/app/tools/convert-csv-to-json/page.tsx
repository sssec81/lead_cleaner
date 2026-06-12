import type { Metadata } from "next";
import { Briefcase, Code2, Database, FileJson, FileSpreadsheet, Sparkles } from "lucide-react";

import { ConvertCsvToJsonTool } from "@/components/convert-csv-to-json-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Free CSV to JSON Converter — Convert CSV Online",
  description:
    "Upload a CSV file and convert it into a structured JSON array instantly. Runs locally in your browser, with no signup and no server upload.",
  path: "/tools/convert-csv-to-json",
  keywords: [
    "csv to json converter",
    "free csv to json",
    "convert csv to json online",
    "csv json converter",
    "parse csv to json array",
    "csv to json free tool",
  ],
});

const EXAMPLE_CSV = `name,email,company
Jane,jane@acme.com,Acme`;

const EXAMPLE_JSON = `[
  {
    "name": "Jane",
    "email": "jane@acme.com",
    "company": "Acme"
  }
]`;

const seoUseCases = [
  {
    icon: Briefcase,
    title: "For sales & ops teams",
    text: "Convert exported lead lists into JSON for CRM integrations, webhooks, and automation pipelines.",
  },
  {
    icon: Code2,
    title: "For developers",
    text: "Transform CSV data into structured JSON arrays or NDJSON for APIs, scripts, and data processing.",
  },
  {
    icon: Database,
    title: "For data imports",
    text: "Prepare CSV exports from spreadsheets as JSON for database seeding, migrations, and bulk uploads.",
  },
];

export default function ConvertCsvToJsonPage() {
  const asideContent = (
    <div className="glass-panel relative overflow-hidden rounded-[1.5rem] p-5 sm:p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-white/30 to-blue-50/40" />
      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-700">
          <Sparkles className="h-4 w-4" />
          Format Converter
        </div>
        <h3 className="font-display text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
          See the structure before you upload.
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
          Each CSV row is transformed into a clean JSON object using the header row as keys.
        </p>

        <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-200 shadow-sm">
          {/* CSV side */}
          <div className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2 border-b border-slate-200/60 px-3 py-2">
              <FileSpreadsheet className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CSV Input</span>
            </div>
            <pre className="overflow-x-auto p-3 text-[10px] font-mono leading-relaxed text-slate-600">{EXAMPLE_CSV}</pre>
          </div>
          {/* JSON side */}
          <div className="bg-slate-900">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-3 py-2">
              <FileJson className="h-4 w-4 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">JSON Output</span>
            </div>
            <div className="overflow-x-auto p-3">
              <pre className="text-[10px] font-mono leading-relaxed text-emerald-300">{EXAMPLE_JSON}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const supportingContent = (
    <section className="mt-16 lg:mt-20 border-t border-slate-200 pt-16">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl mb-5">
          Convert CSV to JSON for any workflow
        </h2>
        <p className="text-base leading-7 text-slate-600 sm:text-lg">
          Whether you're building integrations, feeding APIs, or preparing data imports, this converter transforms flat CSV rows into clean, structured JSON—entirely in your browser.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
        {seoUseCases.map((useCase) => {
          const Icon = useCase.icon;
          return (
            <div key={useCase.title} className="group rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-slate-900">{useCase.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{useCase.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Convert CSV to JSON", url: "/tools/convert-csv-to-json" },
        ]}
      />
      <ToolJsonLd
        title="Free CSV to JSON Converter — Convert CSV Online"
        description="Upload a CSV file and convert it into a structured JSON array instantly. Runs locally in your browser, with no signup and no server upload."
        path="/tools/convert-csv-to-json"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Format Converter"
        title="Free CSV to JSON Converter"
        intro="Upload a CSV file and convert it into a structured JSON array instantly. Runs locally in your browser, with no signup and no server upload."
        quote="Transforms flat CSV rows into clean, structured JSON arrays—entirely in your browser."
        asideContent={asideContent}
        tool={<ConvertCsvToJsonTool />}
        toolSupportingContent={supportingContent}
      />
    </>
  );
}
