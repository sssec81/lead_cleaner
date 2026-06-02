import type { Metadata } from "next";
import Link from "next/link";

import { ExtractEmailsFromCsvTool } from "@/components/extract-emails-from-csv-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Emails from CSV",
  description:
    "Extract emails from a CSV online. Upload a file, choose the email column, remove duplicates, and export the result in your browser.",
  path: "/tools/extract-emails-from-csv",
  keywords: [
    "extract emails from csv",
    "csv email extractor",
    "email column cleaner",
    "lead csv email export",
  ],
});

export default function ExtractEmailsFromCsvPage() {
  return (
    <PageFrame>
      <ToolJsonLd
        title="Extract Emails from CSV"
        description="Extract emails from a CSV online. Upload a file, choose the email column, remove duplicates, and export the result in your browser."
        path="/tools/extract-emails-from-csv"
        category="BusinessApplication"
      />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          Extract emails from CSV
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Extract clean email addresses from a CSV file
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          Upload a small CSV, pick the email column, strip invalid entries,
          remove duplicates, and export a clean email list without sending the
          raw file to a backend.
        </p>

        <div className="mt-6">
          <ExtractEmailsFromCsvTool />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <InfoCard
            title="How to use"
            text="Upload a CSV, choose the email column, review the clean list, then copy or download the extracted emails."
          />
          <InfoCard
            title="Use cases"
            text="CRM exports, newsletter subscribers, recruiter spreadsheets, agency handoff files, and prospecting lists."
          />
          <InfoCard
            title="Privacy"
            text="Basic cleaning runs in your browser. We do not store pasted text or uploaded CSV files in the MVP."
          />
        </div>

        <div className="mt-10 rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)]">
          <h2 className="font-display text-2xl font-semibold">
            Related tools
          </h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              className="rounded-full border border-[color:var(--line)] px-4 py-2 transition hover:bg-white"
              href="/tools/csv-lead-cleaner"
            >
              CSV Lead Cleaner
            </Link>
            <Link
              className="rounded-full border border-[color:var(--line)] px-4 py-2 transition hover:bg-white"
              href="/tools/extract-emails-from-text"
            >
              Extract Emails from Text
            </Link>
            <Link
              className="rounded-full border border-[color:var(--line)] px-4 py-2 transition hover:bg-white"
              href="/tools/clean-email-list"
            >
              Clean Email List
            </Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)]">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
        {text}
      </p>
    </div>
  );
}
