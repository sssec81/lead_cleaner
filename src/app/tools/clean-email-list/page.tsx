import type { Metadata } from "next";
import Link from "next/link";

import { CleanEmailListTool } from "@/components/clean-email-list-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Clean Email List",
  description:
    "Clean email lists online. Lowercase addresses, remove duplicates, filter invalid entries, and export the result in your browser.",
  path: "/tools/clean-email-list",
  keywords: [
    "clean email list",
    "email list cleaner",
    "dedupe email list",
    "lead list cleanup",
  ],
});

export default function CleanEmailListPage() {
  return (
    <PageFrame>
      <ToolJsonLd
        title="Clean Email List"
        description="Clean email lists online. Lowercase addresses, remove duplicates, filter invalid entries, and export the result in your browser."
        path="/tools/clean-email-list"
        category="BusinessApplication"
      />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          Clean email list online
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Lowercase, deduplicate, and clean your email list for export
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          Paste a messy email list from outreach notes, spreadsheet exports, or
          copied lead sources. LeadCleanr trims noise, removes invalid entries,
          and gives you a clean list ready for the next step.
        </p>

        <div className="mt-6">
          <CleanEmailListTool />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <InfoCard
            title="How to use"
            text="Paste your list, review the cleaned output, then copy it or download TXT and CSV exports."
          />
          <InfoCard
            title="Use cases"
            text="Old outreach lists, CRM exports, newsletter prep, recruiter contact lists, and hand-built lead sheets."
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
              href="/tools/remove-duplicate-emails"
            >
              Remove Duplicate Emails
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
