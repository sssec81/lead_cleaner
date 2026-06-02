import type { Metadata } from "next";
import Link from "next/link";

import { DomainExtractorTool } from "@/components/domain-extractor-tool";
import { PageFrame } from "@/components/page-frame";

export const metadata: Metadata = {
  title: "Extract Domains from Emails",
  description:
    "Extract domains from emails and URLs online. Paste messy text, remove duplicates, and export the result in your browser.",
};

export default function ExtractDomainsFromEmailsPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          Extract domains from email list
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Extract domains from emails and URLs into a clean export list
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          Paste email addresses, website links, or mixed lead text. LeadCleanr
          pulls out the domains, lowercases them, removes duplicates, and keeps
          export simple.
        </p>

        <div className="mt-6">
          <DomainExtractorTool />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <InfoCard
            title="How to use"
            text="Paste emails or URLs, review the clean domain list, then copy or download as TXT or CSV."
          />
          <InfoCard
            title="Use cases"
            text="Agency lead cleanup, website prospecting, CRM exports, supplier directories, and enrichment prep."
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
              href="/tools/extract-urls-from-text"
            >
              Extract URLs from Text
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
