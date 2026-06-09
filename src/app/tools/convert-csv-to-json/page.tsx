import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileJson, FileSpreadsheet, Briefcase, Code2, Database } from "lucide-react";

import { ConvertCsvToJsonTool } from "@/components/convert-csv-to-json-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";

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
Jane,jane@acme.com,Acme
John,john@northstar.io,Northstar`;

const EXAMPLE_JSON = `[
  {
    "name": "Jane",
    "email": "jane@acme.com",
    "company": "Acme"
  },
  {
    "name": "John",
    "email": "john@northstar.io",
    "company": "Northstar"
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
  return (
    <PageFrame>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 lg:pt-16 lg:pb-12">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,white,var(--background))]"></div>
        <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-400/15 blur-[120px]"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left Content */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-700 shadow-sm backdrop-blur-md">
                <FileJson className="h-4 w-4" />
                <span>Format Converter</span>
              </div>
              <h1 className="mb-5 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.05]">
                Free CSV to JSON Converter
              </h1>
              <p className="mb-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Upload a CSV file and convert it into a structured JSON array instantly. Runs locally in your browser, with no signup and no server upload.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="#converter"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.8)] hover:-translate-y-0.5"
                >
                  Convert CSV to JSON
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right: Before/After Example */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-blue-500/8 to-indigo-500/8 blur-xl"></div>
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md">
                <div className="grid grid-cols-2">
                  {/* CSV side */}
                  <div className="border-r border-slate-200/60">
                    <div className="flex items-center gap-2 bg-slate-50/80 px-4 py-2.5 border-b border-slate-100">
                      <FileSpreadsheet className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CSV Input</span>
                    </div>
                    <pre className="p-4 text-xs font-mono leading-relaxed text-slate-600 overflow-hidden">{EXAMPLE_CSV}</pre>
                  </div>
                  {/* JSON side */}
                  <div>
                    <div className="flex items-center gap-2 bg-slate-900 px-4 py-2.5 border-b border-white/10">
                      <FileJson className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">JSON Output</span>
                    </div>
                    <div className="bg-slate-900 p-4 overflow-hidden">
                      <pre className="text-xs font-mono leading-relaxed text-emerald-400">{EXAMPLE_JSON}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Converter Tool Section */}
      <section id="converter" className="relative z-10 pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ConvertCsvToJsonTool />
        </div>
      </section>

      {/* SEO Use-Case Section */}
      <section className="relative border-t border-slate-200/60 bg-slate-50/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl mb-5">
              Convert CSV to JSON for any workflow
            </h2>
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              Whether you&apos;re building integrations, feeding APIs, or preparing data imports, this converter transforms flat CSV rows into clean, structured JSON—entirely in your browser.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
            {seoUseCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div key={useCase.title} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-slate-900">{useCase.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{useCase.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Waitlist — placed low, after use cases */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <ProWaitlistCard
            trackSource="convert-csv-to-json"
            title="Want batch conversions and API access?"
            description="Join the Pro waitlist to get notified when we launch batch file processing, API endpoints, custom delimiter support, and more export formats."
          />
        </div>
      </section>
    </PageFrame>
  );
}

