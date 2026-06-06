import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";

const workflowSteps = [
  {
    number: "01",
    title: "Upload Messy Lead CSV",
    text: "Drop in your raw list. The cleaning begins locally without sending contact records to external servers.",
  },
  {
    number: "02",
    title: "Choose Rules & Review",
    text: "Isolate duplicate rows, filter missing fields, and analyze domain structures directly in the dashboard preview.",
  },
  {
    number: "03",
    title: "Export Clean Database",
    text: "Download a structured list ready for import into HubSpot, Clay, Apollo, or outreach pipelines.",
  },
];

const productSignals = [
  {
    label: "Catches duplicates before import",
    text: "Scans record fields to deduplicate rows, preventing dirty lists from bloating HubSpot, Salesforce, Apollo, or outreach pipelines.",
  },
  {
    label: "Flags email quality signals",
    text: "Filters invalid domains, detects generic role addresses (support@, info@), and separates business vs. personal Gmail accounts.",
  },
  {
    label: "Keeps cleanup visible",
    text: "Previews your processed records and inspects error reports in real-time so you trust the data before downloading.",
  },
];

const useCases = [
  {
    kicker: "Sales ops",
    title: "Protect outreach sender scores and clean CRM pipelines.",
    text: "Clean your raw prospecting exports before importing into Apollo, HubSpot, Close, or Clay. Prevent bounce rates and keep datasets tidy.",
  },
  {
    kicker: "Recruiters",
    title: "Isolate direct work emails from personal inboxes.",
    text: "Separate candidate personal emails from business addresses. Spot generic inbox prefixes and optimize candidate response rates.",
  },
  {
    kicker: "Agencies",
    title: "Audit and deliver clean database sheets to clients.",
    text: "Format unorganized files and hand over clean lead sheets with a clear record audit showing duplicate and invalid counts.",
  },
];

const supportTools = [
  {
    href: "/tools/extract-emails-from-text",
    title: "Extract Emails from Text",
    text: "Useful when contact data still lives in notes, signatures, or copied directories instead of rows and columns.",
  },
  {
    href: "/tools/extract-phone-numbers-from-text",
    title: "Extract Phone Numbers",
    text: "Helpful for recruiter notes, event lists, and pasted pages where phone fields need one fast pass.",
  },
  {
    href: "/tools/extract-domains-from-emails",
    title: "Extract Domains",
    text: "A supporting enrichment step after the main spreadsheet cleanup work is already under control.",
  },
];

const faqEntries = [
  {
    question: "What is LeadCleanr actually for?",
    answer:
      "Cleaning messy lead CSVs before CRM import, outreach, recruiting, and agency handoff work. The text tools help with discovery and edge cases, but the main product is the CSV workflow.",
  },
  {
    question: "Does it process the file on the server?",
    answer:
      "The core cleanup flow runs in your browser. Raw file contents are not sent to the app backend for routine processing.",
  },
  {
    question: "Who gets value first?",
    answer:
      "Sales ops teams, recruiters, agencies, marketers, and assistants who inherit spreadsheets they did not create and still have to make usable.",
  },
];

export const metadata: Metadata = {
  title: "LeadCleanr — Private CSV Lead Cleaner for CRM & Outreach Lists",
  description:
    "Instantly clean messy lead CSVs before importing into CRM or outreach platforms. Deduplicate rows, filter invalid emails, spot personal vs. business inboxes, and flag role-based addresses—100% locally in your browser with no signup required.",
  alternates: {
    canonical: "https://leadcleanr.com",
  },
};

export default function HomePage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="grid gap-10 xl:grid-cols-[1.02fr_0.98fr] xl:items-start">
          <div>
            <p className="inline-flex rounded-full border border-[color:rgba(37,99,235,0.18)] bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-strong)]">
              Private CSV cleanup
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.02] sm:text-6xl xl:text-[4.75rem]">
              Clean messy lead CSVs before import.
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-[color:var(--muted)]">
              Instantly clean messy lead CSVs before importing into CRM or outreach platforms. 
              Deduplicate rows, filter invalid emails, spot personal vs. business inboxes, and flag role-based addresses—100% locally in your browser.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools/csv-lead-cleaner"
                className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
              >
                Clean a CSV Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[color:var(--line)] bg-white/88 px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                View free limits
              </Link>
            </div>

            <div className="mt-8 border-t border-[color:rgba(16,37,52,0.12)] pt-5">
              <p className="max-w-3xl text-sm leading-relaxed text-[color:var(--foreground)]">
                <span className="font-semibold">Core Cleanup:</span> Deduplicates row records, matches email syntax, categorizes business vs personal inboxes, highlights role addresses, and structures unformatted database fields before CRM import.
              </p>
            </div>
          </div>

          <div className="relative mt-10 min-w-0 xl:mt-0 xl:pl-10">
            <div className="absolute -left-6 top-10 hidden h-[82%] w-[88%] rounded-[1.75rem] bg-[color:rgba(37,99,235,0.08)] blur-3xl lg:block" />
            <div className="overflow-hidden rounded-[1.75rem] border border-[color:rgba(16,37,52,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,253,0.96))] p-5 shadow-[0_24px_56px_rgba(15,23,42,0.14)] sm:p-7">
              <div className="flex items-center justify-between border-b border-[color:rgba(16,37,52,0.1)] pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                    Live workspace
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    The part people trust first
                  </p>
                </div>
                <div className="shrink-0 rounded-full border border-[color:rgba(15,118,110,0.16)] bg-[color:rgba(15,118,110,0.1)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  Local preview
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <WorkspaceRowMock
                  index={1}
                  value="michael.chen@acmecorp.com"
                  source="Current extraction"
                  locked
                />
                <WorkspaceRowMock
                  index={2}
                  value="sarah.jenkins@techlogistics.net"
                  source="Current extraction"
                />
                <WorkspaceRowMock
                  index={3}
                  value="robert.williams@globalfinance.org"
                  source="Manual edit"
                />
                <WorkspaceRowMock
                  index={4}
                  value="contact@innovatesolutions.io"
                  source="Locked row"
                  locked
                />
              </div>

              <div className="mt-5 grid gap-3 border-t border-[color:rgba(16,37,52,0.1)] pt-5 sm:grid-cols-3">
                <MetricNote value="412" label="Rows ready" />
                <MetricNote value="43" label="Duplicates removed" />
                <MetricNote value="11" label="Role inboxes flagged" />
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {productSignals.map((signal) => (
            <div
              key={signal.label}
              className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-2xs flex flex-col justify-between hover:border-slate-350 transition-colors"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)] mb-2">
                  {signal.label}
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-[color:var(--muted)]">
                  {signal.text}
                </p>
              </div>
            </div>
          ))}
        </section>
      </section>

      <section className="bg-[color:#153246] py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:#93c5fd]">
                Workflow
              </p>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.85rem]">
                Clean, review, export.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:rgba(255,255,255,0.72)]">
                The workflow is intentionally short: load the file, choose the
                field that matters, then export only after the report makes
                sense.
              </p>
              <div className="mt-6">
                <Link
                  href="/tools/csv-lead-cleaner"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
                >
                  Clean a CSV Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {workflowSteps.map((step) => (
                <div
                  key={step.number}
                  className="grid gap-4 border-t border-[color:rgba(255,255,255,0.14)] py-5 first:border-t-0 first:pt-0 sm:grid-cols-[72px_1fr] sm:items-start"
                >
                  <div className="font-display text-3xl leading-none text-[color:#93c5fd] sm:text-4xl">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:rgba(255,255,255,0.7)] sm:text-base">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Where it fits
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.65rem]">
              For the messy handoff before import.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[color:var(--muted)]">
              LeadCleanr earns its place when a file is captured, but not yet
              safe enough for CRM, outreach, recruiting, or client delivery.
            </p>
            <Link
              href="/tools/csv-lead-cleaner"
              className="btn-primary mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              Clean a CSV Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[1.35rem] border border-[color:rgba(16,37,52,0.11)] bg-white/74 shadow-[0_24px_70px_rgba(15,23,42,0.07)]">
            {useCases.map((useCase, index) => (
              <UseCaseRow
                key={useCase.kicker}
                {...useCase}
                index={index + 1}
                primary={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[color:rgba(16,37,52,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(239,246,255,0.34))] py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Helper tools
              </p>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.55rem]">
                Quick helper utilities for raw text blocks
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[color:var(--muted)]">
                Use these when the data is still copied text, notes, or snippets before the CSV workflow. Perfect for pasting emails, support logs, website snippets, or signatures.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.35rem] border border-[color:rgba(16,37,52,0.1)] bg-white/80 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
              {supportTools.map((tool, index) => (
                <SupportLink key={tool.href} {...tool} index={index + 1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-6">
            <div className="panel-soft rounded-[2rem] p-6 bg-slate-50 border border-slate-200/60 shadow-2xs">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Trust boundary
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl text-slate-950">
                Your data remains on your machine.
              </h2>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[color:var(--muted)]">
                Your raw CSV and pasted text stay in your browser during normal cleanup. All file parsing, cleaning filters, and table preview generation are executed locally.
              </p>
            </div>
            
            <ProWaitlistCard
              trackSource="home_bottom"
              title="Want saved workflows and export presets?"
              description="Join the Pro waitlist to get notified when we launch saved cleanup presets, advanced domain filters, and custom CRM export options."
            />
          </div>

          <div className="space-y-5">
            {faqEntries.map((faq, index) => (
              <div
                key={faq.question}
                className={index === 0 ? "" : "border-t border-[color:rgba(16,37,52,0.1)] pt-5"}
              >
                <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                  {faq.question}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                  {faq.answer}
                </p>
              </div>
            ))}
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-[color:var(--brand-strong)]"
            >
              Read the pricing philosophy
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

function WorkspaceRowMock({
  index,
  value,
  source,
  locked = false,
}: {
  index: number;
  value: string;
  source: string;
  locked?: boolean;
}) {
  return (
    <div className="rounded-[1.2rem] border border-[color:rgba(16,37,52,0.12)] bg-white/94 p-3 shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-[color:rgba(16,37,52,0.12)] text-[11px] font-semibold text-[color:var(--muted)]">
          {index}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[color:rgba(16,37,52,0.08)] bg-[color:rgba(244,247,250,0.96)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:#38586b]">
              {source}
            </span>
            {locked ? (
              <span className="rounded-full bg-[color:rgba(15,118,110,0.1)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">
                Locked
              </span>
            ) : null}
          </div>
          <p className="mt-3 rounded-[0.95rem] border border-[color:rgba(16,37,52,0.1)] bg-[color:rgba(240,244,255,0.9)] px-3 py-3 text-sm leading-6 text-[color:var(--foreground)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricNote({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tabular-nums text-[color:var(--foreground)]">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
        {label}
      </p>
    </div>
  );
}

function UseCaseRow({
  kicker,
  title,
  text,
  index,
  primary = false,
}: {
  kicker: string;
  title: string;
  text: string;
  index: number;
  primary?: boolean;
}) {
  return (
    <div
      className={`grid gap-4 border-t border-[color:rgba(16,37,52,0.09)] px-5 py-5 first:border-t-0 sm:grid-cols-[4rem_1fr] sm:px-6 sm:py-6 ${
        primary
          ? "bg-[linear-gradient(90deg,rgba(37,99,235,0.07),rgba(255,255,255,0.72))]"
          : ""
      }`}
    >
      <div className="font-display text-3xl font-semibold leading-none tabular-nums text-[color:rgba(29,78,216,0.38)]">
        {String(index).padStart(2, "0")}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
            {kicker}
          </p>
          {primary ? (
            <span className="rounded-full border border-[color:rgba(37,99,235,0.16)] bg-white/78 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
              Main path
            </span>
          ) : null}
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-[1.7rem]">
          {title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
          {text}
        </p>
      </div>
    </div>
  );
}

function SupportLink({
  href,
  title,
  text,
  index,
}: {
  href: string;
  title: string;
  text: string;
  index: number;
}) {
  return (
    <Link
      href={href}
      className="group grid gap-4 border-t border-[color:rgba(16,37,52,0.08)] px-5 py-5 transition first:border-t-0 hover:bg-white sm:grid-cols-[3.25rem_1fr_auto] sm:items-center sm:px-6"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:rgba(37,99,235,0.16)] bg-[color:rgba(37,99,235,0.06)] text-xs font-semibold tabular-nums text-[color:var(--brand-strong)]">
        {String(index).padStart(2, "0")}
      </span>
      <span>
        <span className="block font-display text-xl font-semibold text-[color:var(--foreground)] sm:text-2xl">
          {title}
        </span>
        <span className="mt-1 block max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
          {text}
        </span>
      </span>
      <span className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/82 px-4 text-sm font-semibold text-[color:var(--brand-strong)] transition group-hover:border-[color:rgba(37,99,235,0.18)] group-hover:bg-[color:rgba(37,99,235,0.06)]">
        Open
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
