import type { Metadata } from "next";
import Link from "next/link";

import { CsvLeadCleanerTool } from "@/components/csv-lead-cleaner-tool";
import { PageFrame } from "@/components/page-frame";

export const metadata: Metadata = {
  title: "CSV Lead Cleaner",
  description:
    "Clean lead CSV files online. Upload a CSV, preview rows, remove duplicates, clean columns, and export in your browser.",
};

export default function CsvLeadCleanerPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          CSV lead cleaner
        </p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Upload, preview, clean, and export lead CSV files
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
          Upload a small CSV, choose the column you want to clean, remove
          duplicates and blank rows, and export a cleaner file without sending
          your lead data to a backend.
        </p>

        <div className="mt-6">
          <CsvLeadCleanerTool />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <InfoCard
            title="How to use"
            text="Upload a CSV, select the column to clean, preview the updated rows, then export the cleaned file."
          />
          <InfoCard
            title="Use cases"
            text="CRM exports, newsletter lists, recruiter spreadsheets, agency lead handoffs, and messy prospect files."
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
            <Link
              className="rounded-full border border-[color:var(--line)] px-4 py-2 transition hover:bg-white"
              href="/tools/extract-domains-from-emails"
            >
              Extract Domains from Emails
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
