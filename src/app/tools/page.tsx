import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const flagshipTools = [
  {
    href: "/tools/csv-lead-cleaner",
    label: "Flagship workflow",
    title: "CSV Lead Cleaner",
    description:
      "The full cleanup pass for CRM imports, recruiter spreadsheets, agency handoffs, and outreach lists that stopped being trustworthy.",
    notes: [
      "Column cleanup and dedupe modes",
      "Review report before export",
      "Business versus personal inbox hints",
    ],
  },
  {
    href: "/tools/extract-emails-from-csv",
    label: "CSV support",
    title: "Extract Emails from CSV",
    description:
      "When the spreadsheet is mostly fine and you only need the email column cleaned, deduplicated, and ready to move.",
    notes: [
      "Pick the email column",
      "Remove invalid entries and duplicates",
      "Export as TXT or CSV",
    ],
  },
];

const helperTools = [
  {
    href: "/tools/extract-emails-from-text",
    title: "Extract Emails from Text",
    description: "For copied blocks that have not made it into a spreadsheet yet.",
  },
  {
    href: "/tools/extract-phone-numbers-from-text",
    title: "Extract Phone Numbers from Text",
    description: "Useful for notes, sourcing scraps, and messy pasted directories.",
  },
  {
    href: "/tools/extract-urls-from-text",
    title: "Extract URLs from Text",
    description: "Pull links out of noisy copied text before you organize the rest.",
  },
  {
    href: "/tools/extract-domains-from-emails",
    title: "Extract Domains from Emails",
    description: "A supporting step when you need a quick domain list for enrichment.",
  },
  {
    href: "/tools/clean-email-list",
    title: "Clean Email List",
    description: "Normalize a pasted list when the only job is fixing the addresses.",
  },
  {
    href: "/tools/remove-duplicate-emails",
    title: "Remove Duplicate Emails",
    description: "Use this when the main problem is repeated addresses and nothing else.",
  },
];

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Explore LeadCleanr CSV-first lead cleaning tools and supporting text extractors.",
};

export default function ToolsPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Tools
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Start with the CSV path.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
            If your lead list already lives in rows and columns, go straight to the CSV Lead Cleaner. Use the helper tools only when the data is still raw text.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <FlagshipCard tool={flagshipTools[0]} featured />
          <FlagshipCard tool={flagshipTools[1]} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Helper tools
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
              Useful, but secondary.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)]">
              These tools handle the step before the spreadsheet exists. Paste
              copied text, pull out what you need, then move it into a CSV for
              the main cleanup workflow.
            </p>
            <div className="panel-soft mt-6 rounded-[1.6rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                Workflow guide
              </p>
              <ol className="mt-3 space-y-3 text-sm leading-6 text-[color:var(--foreground)]">
                <li>1. Start with the spreadsheet if one already exists.</li>
                <li>2. Use a helper tool only when the data is still raw text.</li>
                <li>3. Return to the CSV cleaner for the final cleanup pass.</li>
              </ol>
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              6 tools · browser-side · no login
            </p>
            <Link
              href="/tools/csv-lead-cleaner"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--line)] bg-white/88 px-5 text-sm font-semibold text-[color:var(--brand-strong)] transition hover:border-[color:rgba(37,99,235,0.18)] hover:bg-white"
            >
              CSV Lead Cleaner is the main tool
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {helperTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="panel-soft block rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:rgba(37,99,235,0.16)] hover:bg-white/92 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              >
                <h3 className="font-display text-base font-semibold text-[color:var(--foreground)]">
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {tool.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand-strong)]">
                  Open tool
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

function FlagshipCard({
  tool,
  featured = false,
}: {
  tool: (typeof flagshipTools)[number];
  featured?: boolean;
}) {
  return (
    <Link
      href={tool.href}
      className={`p-7 sm:p-8 transition hover:-translate-y-0.5 duration-200 rounded-[2.2rem] ${
        featured
          ? "panel-strong border-[color:rgba(37,99,235,0.16)]"
          : "panel-soft"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
          featured
            ? "text-[color:var(--accent)]"
            : "text-[color:var(--brand-strong)]"
        }`}
      >
        {tool.label}
      </p>
      <h2
        className={`mt-4 font-display font-semibold leading-[1.02] ${
          featured ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {tool.title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
        {tool.description}
      </p>
      <div className="mt-6 grid gap-3">
        {tool.notes.map((note) => (
          <p
            key={note}
            className="border-t border-[color:rgba(16,37,52,0.1)] pt-3 text-sm leading-7 text-[color:var(--foreground)]"
          >
            {note}
          </p>
        ))}
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]">
        Open workflow
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

function NarrativeRow({ number, text }: { number: string; text: string }) {
  return (
    <div className="grid gap-3 border-t border-[color:rgba(255,255,255,0.14)] pt-5 sm:grid-cols-[92px_1fr] sm:items-start">
      <div className="font-display text-5xl leading-none text-[color:#d8a15d] sm:text-6xl">
        {number}
      </div>
      <p className="max-w-2xl text-base leading-8 text-[color:rgba(255,255,255,0.82)]">
        {text}
      </p>
    </div>
  );
}
