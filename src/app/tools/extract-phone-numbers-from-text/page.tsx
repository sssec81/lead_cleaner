import type { Metadata } from "next";
import Link from "next/link";

import { PageFrame } from "@/components/page-frame";
import { PhoneExtractorTool } from "@/components/phone-extractor-tool";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Phone Numbers from Text",
  description:
    "Extract phone numbers from text online. Paste messy text, normalize numbers, remove duplicates, and export the result in your browser.",
  path: "/tools/extract-phone-numbers-from-text",
  keywords: [
    "extract phone numbers from text",
    "phone number extractor",
    "find phone numbers in text",
    "lead cleaner phone tool",
  ],
});

export default function ExtractPhoneNumbersFromTextPage() {
  return (
    <PageFrame>
      <ToolJsonLd
        title="Extract Phone Numbers from Text"
        description="Extract phone numbers from text online. Paste messy text, normalize numbers, remove duplicates, and export the result in your browser."
        path="/tools/extract-phone-numbers-from-text"
        category="BusinessApplication"
      />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          Extract phone numbers from text
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Extract phone numbers from messy text and export a clean list
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          Paste copied website text, resumes, contact notes, or lead blocks.
          LeadCleanr finds phone numbers, normalizes them into a cleaner format,
          removes duplicates, and keeps export simple.
        </p>

        <div className="mt-6">
          <PhoneExtractorTool />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <InfoCard
            title="How to use"
            text="Paste text, review the clean result, then copy or download as TXT or CSV."
          />
          <InfoCard
            title="Use cases"
            text="Resume parsing, copied directories, CRM notes, customer support records, and messy outreach research."
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
