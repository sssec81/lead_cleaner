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
      "The main workflow for CRM imports, recruiting spreadsheets, agency handoffs, and outreach list cleanup.",
    accent: "Flagship",
    bullets: [
      "Column cleanup and dedupe modes",
      "Cleaning report before export",
      "Personal vs business email hints",
    ],
  },
  {
    href: "/tools/extract-emails-from-csv",
    title: "Extract Emails from CSV",
    description:
      "Pull a clean email list out of a chosen CSV column before routing the data somewhere else.",
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

const routeSteps = [
  {
    step: "1",
    title: "Start with the spreadsheet",
    text: "Bring in the CRM export, recruiter sheet, or client handoff that needs cleanup before it creates downstream problems.",
  },
  {
    step: "2",
    title: "Review what changed",
    text: "Check duplicates, blanks, invalid values, and email quality hints before you export anything.",
  },
  {
    step: "3",
    title: "Use helper tools only when needed",
    text: "The text extractors are still useful, but they should support the workflow rather than replace it.",
  },
];

const reasons = [
  {
    title: "Higher-value buyer",
    text: "Sales ops, recruiters, agencies, VAs, and marketers usually need spreadsheet cleanup more than one-off text extraction.",
  },
  {
    title: "Closer to monetization",
    text: "CSV workflows feel like product work instead of a free utility, which makes larger-file upgrades much easier to justify later.",
  },
  {
    title: "Clearer product promise",
    text: "“Clean messy lead CSV files before CRM import” is sharper, more believable, and easier to remember than a generic extractor pitch.",
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
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-strong)]">
              Tools
            </p>
            <h1 className="mt-4 max-w-5xl font-display text-4xl font-semibold leading-[0.95] sm:text-5xl lg:text-6xl">
              Start with the CSV workflow.
              <br />
              Reach for the helper tools only when the data is still messy text.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
              LeadCleanr is built around cleaning messy lead CSV files before
              CRM import, outreach, recruiting, and agency delivery. The text
              tools stay here as useful entry points, but they are no longer
              the center of the product story.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[color:rgba(15,118,110,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(236,252,250,0.74))] p-6 shadow-[var(--shadow)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
              Recommended path
            </p>
            <p className="mt-3 text-base leading-7 text-[color:var(--foreground)]">
              Clean the spreadsheet first, then route the clean data where it
              needs to go. The flagship tools should handle the serious work.
            </p>
          </div>
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              How to use the toolset
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
              Treat this like a workflow map, not a gallery.
            </h2>
            <div className="mt-6 space-y-4">
              {routeSteps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/82 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                    Step {step.step}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--line)] bg-white/76 p-6 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
              Why this structure
            </p>
            <div className="mt-4 grid gap-4">
              {reasons.map((reason) => (
                <ReasonCard
                  key={reason.title}
                  title={reason.title}
                  text={reason.text}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Flagship workflows
              </p>
              <h2 className="mt-3 max-w-4xl font-display text-3xl font-semibold sm:text-4xl">
                The productized part of LeadCleanr
              </h2>
            </div>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-[color:var(--brand-strong)]"
            >
              See pricing
            </Link>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <FlagshipToolCard tool={flagshipTools[0]} featured />
            <FlagshipToolCard tool={flagshipTools[1]} />
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-[color:var(--line)] bg-white/76 p-6 shadow-[var(--shadow)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Supporting helpers
              </p>
              <h2 className="mt-3 max-w-4xl font-display text-3xl font-semibold sm:text-4xl">
                Useful when the data has not made it into a spreadsheet yet
              </h2>
            </div>
            <div className="rounded-full border border-[color:var(--line)] bg-[#fffaf3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
              SEO entry points
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {helperTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-[1.8rem] border border-[color:var(--line)] bg-white/84 p-6 shadow-[var(--shadow)] transition hover:-translate-y-1"
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

function FlagshipToolCard({
  tool,
  featured = false,
}: {
  tool: (typeof flagshipTools)[number];
  featured?: boolean;
}) {
  return (
    <Link
      href={tool.href}
      className={`rounded-[2rem] border p-6 shadow-[var(--shadow)] transition hover:-translate-y-1 sm:p-8 ${
        featured
          ? "border-[color:rgba(15,118,110,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(236,252,250,0.88))]"
          : "border-[color:var(--line)] bg-[color:var(--surface)]"
      }`}
    >
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
          featured
            ? "bg-[color:rgba(15,118,110,0.12)] text-[color:var(--accent)]"
            : "bg-[color:rgba(217,119,6,0.12)] text-[color:var(--brand-strong)]"
        }`}
      >
        {tool.accent}
      </span>
      <h3 className="mt-4 font-display text-3xl font-semibold">{tool.title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
        {tool.description}
      </p>
      <div className="mt-6 grid gap-2">
        {tool.bullets.map((bullet) => (
          <div
            key={bullet}
            className="rounded-[1.2rem] border border-[color:var(--line)] bg-white/84 px-4 py-3 text-sm font-medium"
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
  );
}

function ReasonCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.55rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{text}</p>
    </div>
  );
}
