import type { Metadata } from "next";
import Link from "next/link";

import { PageFrame } from "@/components/page-frame";
import { RemoveDuplicateEmailsTool } from "@/components/remove-duplicate-emails-tool";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Remove Duplicate Emails",
  description:
    "Remove duplicate emails online. Keep one clean copy of each valid address and export the result in your browser.",
  path: "/tools/remove-duplicate-emails",
  keywords: [
    "remove duplicate emails",
    "deduplicate email list",
    "email deduper",
    "clean lead emails",
  ],
});

export default function RemoveDuplicateEmailsPage() {
  return (
    <PageFrame>
      <ToolJsonLd
        title="Remove Duplicate Emails"
        description="Remove duplicate emails online. Keep one clean copy of each valid address and export the result in your browser."
        path="/tools/remove-duplicate-emails"
        category="BusinessApplication"
      />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          Remove duplicate emails
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Remove duplicate emails and keep one clean copy of each address
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          Paste repeated lead lists, newsletter exports, or CRM contact blocks.
          LeadCleanr normalizes the addresses, removes repeats, filters invalid
          entries, and prepares a cleaner list for export.
        </p>

        <div className="mt-6">
          <RemoveDuplicateEmailsTool />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <InfoCard
            title="How to use"
            text="Paste your repeated email list, review the unique output, then copy or download TXT and CSV exports."
          />
          <InfoCard
            title="Use cases"
            text="Newsletter cleanup, merged spreadsheets, CRM contact imports, agency lead lists, and recurring outreach exports."
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
              href="/tools/csv-lead-cleaner"
            >
              CSV Lead Cleaner
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
