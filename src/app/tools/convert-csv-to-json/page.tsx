import type { Metadata } from "next";
import { Briefcase, Code2, Database, FileJson, FileSpreadsheet, Shield, Users, BarChart3 } from "lucide-react";
import { Suspense } from "react";
import { ConvertCsvToJsonTool } from "@/components/convert-csv-to-json-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "CSV to JSON Converter Online",
  description:
    "Convert a CSV file into structured JSON locally in your browser. Preview the output and download JSON without signup or server upload.",
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
  const pageHeader = (
    <div className="max-w-2xl pb-8 pt-12">
      <div className="section-eyebrow mb-4">
        CSV TOOL
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
        Free CSV to JSON Converter
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
        Upload a CSV file and convert it into a structured JSON array instantly. Runs locally in your browser, with no signup and no server upload.
      </p>
      
      <div className="trust-chip-row mt-6">
        <div className="trust-chip">
          <Shield className="h-4 w-4 text-[var(--lc-accent)]" />
          <span>Browser-only</span>
        </div>
        <div className="trust-chip">
          <Users className="h-4 w-4 text-[var(--lc-accent)]" />
          <span>No account needed</span>
        </div>
        <div className="trust-chip">
          <BarChart3 className="h-4 w-4 text-[var(--lc-accent)]" />
          <span>Up to 5MB free</span>
        </div>
      </div>
    </div>
  );

  const supportingContent = (
    <section className="mt-12 border-t border-[var(--lc-border)] pt-12 lg:mt-14">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h2 className="mb-5 font-display text-3xl font-semibold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
          Convert CSV to JSON for any workflow
        </h2>
        <p className="text-base leading-7 text-[var(--lc-muted)] sm:text-lg">
          Whether you&apos;re building integrations, feeding APIs, or preparing data imports, this converter transforms flat CSV rows into clean, structured JSON—entirely in your browser.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
        {seoUseCases.map((useCase) => {
          const Icon = useCase.icon;
          return (
            <div key={useCase.title} className="lc-card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lc-accent-bg)] text-[var(--lc-accent)] transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-[var(--lc-ink)]">{useCase.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--lc-muted)]">{useCase.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );

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
        title="CSV to JSON Converter Online"
        description="Upload a CSV file and convert it into a structured JSON array instantly. Runs locally in your browser, with no signup and no server upload."
        path="/tools/convert-csv-to-json"
        category="BusinessApplication"
      />
      <main className="relative bg-[var(--lc-bg)] pb-16 pt-4 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pageHeader}
          <Suspense fallback={<div className="h-96 flex items-center justify-center text-[var(--lc-muted)]">Loading tool...</div>}>
            <ConvertCsvToJsonTool />
          </Suspense>
        </div>
      </main>
      <div className="bg-white">
        {supportingContent}
      </div>
    </PageFrame>
  );
}
