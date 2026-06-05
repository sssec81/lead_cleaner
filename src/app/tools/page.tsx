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

const routeNotes = [
  "Start with the spreadsheet if one already exists.",
  "Use the helper tools only when the data is still raw text.",
  "Think of this page as a workflow map, not a feature gallery.",
];

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Explore LeadCleanr CSV-first lead cleaning tools and supporting text extractors.",
};

export default function ToolsPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 rounded-[2.25rem] border border-[color:rgba(16,37,52,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,247,250,0.82))] p-6 shadow-[var(--shadow)] lg:grid-cols-[0.9fr_0.08fr_1fr] lg:items-start lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-strong)]">
              Tools
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[0.96] sm:text-[3.3rem] lg:text-[4.3rem]">
              Start with the CSV path. Use the text helpers only before the
              mess becomes a spreadsheet.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
              The default answer should appear fast here: if the list already
              lives in rows and columns, go straight to the cleanup workflow.
            </p>
          </div>
          <div className="hidden h-full w-px bg-[color:rgba(16,37,52,0.12)] lg:block" />
          <div className="max-w-3xl space-y-5 text-base leading-8 text-[color:var(--muted)]">
            <p>
              LeadCleanr is no longer a bucket of equal tools. The main product
              is the CSV workflow: clean the file before CRM import, recruiting
              outreach, enrichment, or agency handoff. The text utilities still
              matter, but they should support that story instead of replacing it.
            </p>
            <div className="rounded-[1.5rem] border border-[color:rgba(16,37,52,0.08)] bg-white/70 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                Route notes
              </p>
              <div className="mt-3 space-y-3">
                {routeNotes.map((note) => (
                  <p
                    key={note}
                    className="text-sm leading-7 text-[color:var(--foreground)]"
                  >
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <FlagshipCard tool={flagshipTools[0]} featured />
          <FlagshipCard tool={flagshipTools[1]} />
        </section>
      </section>

      <section className="bg-[color:#153246] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:#d8a15d]">
                Working order
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Spreadsheet first. Report second. Helper tools only when the
                data is still in pieces.
              </h2>
            </div>
            <div className="space-y-5">
              <NarrativeRow
                number="01"
                text="If the list already lives in a CSV, open the CSV Lead Cleaner first."
              />
              <NarrativeRow
                number="02"
                text="If you only need one field from the file, the CSV email extractor is the faster side path."
              />
              <NarrativeRow
                number="03"
                text="If the data is still copied text, use a text helper, then move the cleaned output back into a spreadsheet workflow."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Helper tools
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
              Useful, but intentionally secondary.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              These tools handle the step before the spreadsheet exists. Paste
              copied text, pull out what you need, then move it into a CSV for
              the main cleanup workflow.
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              6 tools · all browser-side · no login required
            </p>
            <Link
              href="/tools/csv-lead-cleaner"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]"
            >
              CSV Lead Cleaner is the main tool
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-5 border-t border-[color:rgba(16,37,52,0.12)] pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {helperTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="block">
                <h3 className="font-display text-2xl font-semibold text-[color:var(--foreground)]">
                  {tool.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                  {tool.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]">
                  Open tool
                  <ArrowRight className="h-4 w-4" />
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
      className={`rounded-[2.2rem] border p-7 shadow-[var(--shadow)] sm:p-8 ${
        featured
          ? "border-[color:rgba(15,118,110,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(236,252,250,0.86))]"
          : "border-[color:var(--line)] bg-white/82"
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
