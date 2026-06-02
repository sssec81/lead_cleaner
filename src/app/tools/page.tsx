import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileSpreadsheet,
  Globe,
  Mail,
  Phone,
  ScanSearch,
  Sparkles,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const flagshipTools = [
  {
    href: "/tools/csv-lead-cleaner",
    title: "CSV Lead Cleaner",
    description:
      "Main workflow for CRM imports, recruiting spreadsheets, agency handoffs, and outreach list cleanup.",
    accent: "Flagship",
    bullets: [
      "Column cleanup + dedupe modes",
      "Cleaning report before export",
      "Personal vs business email hints",
    ],
  },
  {
    href: "/tools/extract-emails-from-csv",
    title: "Extract Emails from CSV",
    description:
      "Pull a clean email list out of a chosen CSV column before uploading into another workflow.",
    accent: "CSV support",
    bullets: [
      "Invalid email filtering",
      "Duplicate removal",
      "TXT and CSV export",
    ],
  },
];

const helperTools = [
  {
    href: "/tools/extract-emails-from-text",
    title: "Extract Emails from Text",
    description: "Turn copied text blocks into clean email lists.",
    icon: Mail,
  },
  {
    href: "/tools/extract-phone-numbers-from-text",
    title: "Extract Phone Numbers from Text",
    description: "Find phone numbers in notes, profiles, or directories.",
    icon: Phone,
  },
  {
    href: "/tools/extract-urls-from-text",
    title: "Extract URLs from Text",
    description: "Pull links out of messy text before review or export.",
    icon: Globe,
  },
  {
    href: "/tools/extract-domains-from-emails",
    title: "Extract Domains from Emails",
    description: "Generate domain lists from email or website data.",
    icon: ScanSearch,
  },
  {
    href: "/tools/clean-email-list",
    title: "Clean Email List",
    description: "Normalize and deduplicate email lists quickly.",
    icon: Sparkles,
  },
  {
    href: "/tools/remove-duplicate-emails",
    title: "Remove Duplicate Emails",
    description: "Keep one clean copy of each valid address.",
    icon: Sparkles,
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
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          Tools
        </p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold sm:text-5xl">
          Start with the CSV workflow. Use the extractors when you need them.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
          LeadCleanr is positioned around cleaning messy lead CSV files before
          CRM import, outreach, recruiting, and agency delivery. The text
          tools stay here as focused helpers and SEO entry points.
        </p>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,238,0.92))] p-6 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Recommended path
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Clean the spreadsheet first, then route the clean data where it
              needs to go.
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <PathCard
                step="1"
                title="Upload CSV"
                text="Bring in a CRM export, recruiter sheet, or client handoff."
              />
              <PathCard
                step="2"
                title="Review report"
                text="Check duplicates, blanks, invalid values, and email quality hints."
              />
              <PathCard
                step="3"
                title="Export clean file"
                text="Leave with a cleaner CSV ready for import or outreach."
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--line)] bg-white/76 p-6 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
              Why this order
            </p>
            <div className="mt-4 grid gap-4">
              <ReasonCard
                title="Higher-value buyer"
                text="Sales ops, recruiters, agencies, VAs, and marketers usually need spreadsheet cleanup more than one-off text extraction."
              />
              <ReasonCard
                title="Closer to monetization"
                text="CSV workflows feel like product work, not just a free utility. That makes upgrades, reports, and limits easier to justify later."
              />
              <ReasonCard
                title="Clearer product promise"
                text="“Clean messy lead CSV files before CRM import” is sharper than a generic email extractor pitch."
              />
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Flagship tools
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                The productized CSV workflow
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {flagshipTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] transition hover:-translate-y-1"
              >
                <span className="inline-flex rounded-full bg-[color:rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  {tool.accent}
                </span>
                <h3 className="mt-4 font-display text-3xl font-semibold">
                  {tool.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {tool.description}
                </p>
                <div className="mt-5 grid gap-2">
                  {tool.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-xl border border-[color:var(--line)] bg-white/80 px-4 py-3 text-sm font-medium"
                    >
                      {bullet}
                    </div>
                  ))}
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]">
                  Open workflow
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Supporting helpers
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Use these when the data is still outside a spreadsheet
            </h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {helperTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)] transition hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.12)] text-[color:var(--brand-strong)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold">
                    {tool.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                    {tool.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]">
                    Open tool
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </PageFrame>
  );
}

function PathCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
        Step {step}
      </p>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{text}</p>
    </div>
  );
}

function ReasonCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{text}</p>
    </div>
  );
}
