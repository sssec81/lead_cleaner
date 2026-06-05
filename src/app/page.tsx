import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileSpreadsheet,
  Mail,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { PageFrame } from "@/components/page-frame";

const workflowStats = [
  { label: "Rows uploaded", value: "500" },
  { label: "Clean rows", value: "412" },
  { label: "Duplicates removed", value: "43" },
  { label: "Invalid or blank", value: "45" },
];

const heroChecklist = [
  "Choose email, phone, domain, or whole-row deduplication",
  "Flag personal inboxes like Gmail, Yahoo, and Outlook",
  "Spot role-based emails like info@, sales@, and support@",
  "Generate domain values from email addresses before export",
];

const featureCards = [
  {
    title: "Pre-import CRM cleanup",
    text: "Clean exports before HubSpot, Close, Apollo, Clay, or your next agency handoff.",
    icon: FileSpreadsheet,
  },
  {
    title: "Recruiting and sourcing",
    text: "Deduplicate candidate lists, isolate work emails, and remove weak contact rows fast.",
    icon: Users,
  },
  {
    title: "Agency operations",
    text: "Turn messy client spreadsheets into consistent, ready-to-upload lists with one pass.",
    icon: BriefcaseBusiness,
  },
];

const supportingTools = [
  {
    href: "/tools/extract-emails-from-text",
    title: "Extract Emails from Text",
    text: "SEO-friendly helper for copied text blocks and quick lead scraping cleanup.",
  },
  {
    href: "/tools/extract-phone-numbers-from-text",
    title: "Extract Phone Numbers",
    text: "Pull phone numbers from copied notes, resumes, and directories before CSV cleanup.",
  },
  {
    href: "/tools/extract-domains-from-emails",
    title: "Extract Domains",
    text: "Create domain lists from emails and URLs when you need a supporting enrichment step.",
  },
];

const steps = [
  {
    eyebrow: "Step 1",
    title: "Upload the spreadsheet you actually work with",
    text: "Bring in the CRM export, recruiter list, agency handoff, or VA-built prospect sheet instead of reformatting it somewhere else first.",
  },
  {
    eyebrow: "Step 2",
    title: "Clean around the field that matters most",
    text: "Pick the main column, switch dedupe mode, review personal vs business inboxes, and catch role-based emails before export.",
  },
  {
    eyebrow: "Step 3",
    title: "Export a file you can trust again",
    text: "Leave with a cleaner CSV and a more believable report before import, outreach, enrichment, or handoff.",
  },
];

const faqs = [
  {
    question: "What is LeadCleanr really for?",
    answer:
      "LeadCleanr is built for cleaning messy CSV lead lists before CRM import, outreach, recruiting, and agency delivery work. The text extractors help bring traffic and support edge cases, but the main product is CSV cleanup.",
  },
  {
    question: "Does LeadCleanr store my CSV rows?",
    answer:
      "No for the MVP flow. CSV parsing and cleanup run in your browser, and raw file contents are not stored by default.",
  },
  {
    question: "Who benefits most from this?",
    answer:
      "Sales ops teams, recruiters, marketers, agencies, virtual assistants, and freelancers who inherit messy spreadsheets and need them cleaned quickly.",
  },
  {
    question: "What makes the CSV cleaner different from generic extractors?",
    answer:
      "It is workflow-first: dedupe modes, invalid row handling, email-type hints, role-based detection, domain generation, and a cleanup report built around real spreadsheet work.",
  },
];

export default function HomePage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-start">
          <div>
            <p className="inline-flex rounded-full border border-[color:rgba(217,119,6,0.18)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-strong)]">
              CSV-first lead cleaning
            </p>
            <h1 className="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[0.94] sm:text-6xl xl:text-7xl">
              Clean the messy lead spreadsheet before it touches your CRM
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
              LeadCleanr is built for the operational moment after lead capture
              and before import. Upload a CSV, clean the rows that matter,
              review what changed, and export a file that is easier to trust.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools/csv-lead-cleaner"
                className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Open CSV Lead Cleaner
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-white/80 px-6 text-sm font-semibold transition hover:-translate-y-0.5"
              >
                See pricing
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {heroChecklist.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[1.45rem] border border-[color:var(--line)] bg-white/72 px-4 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
                  <p className="text-sm leading-6 text-[color:var(--foreground)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[2.3rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,248,238,0.92))] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                    Sample cleaning report
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
                    Feels like a working desk tool, not a toy extractor
                  </h2>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-[color:rgba(15,118,110,0.12)] text-[color:var(--accent)] sm:flex">
                  <ScanSearch className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {workflowStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/84 p-4"
                  >
                    <p className="text-sm text-[color:var(--muted)]">{item.label}</p>
                    <p className="mt-2 text-4xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.6rem] border border-[color:rgba(15,118,110,0.14)] bg-[color:rgba(15,118,110,0.08)] p-5">
                <div className="flex flex-wrap gap-2">
                  <Tag>Business emails: 298</Tag>
                  <Tag>Personal emails: 71</Tag>
                  <Tag>Role-based inboxes: 18</Tag>
                  <Tag>Domains generated: 352</Tag>
                </div>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                  Built around the spreadsheet step before outreach, import,
                  enrichment, or delivery to a client team.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.9rem] border border-[color:var(--line)] bg-white/78 p-5 shadow-[var(--shadow)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                  Why people use it
                </p>
                <p className="mt-3 text-base leading-7 text-[color:var(--foreground)]">
                  When the real pain is not finding one email, but fixing an
                  entire spreadsheet before somebody imports it into a system
                  that amplifies mistakes.
                </p>
              </div>

              <div className="rounded-[1.9rem] border border-[color:var(--line)] bg-[#fffaf3] p-5 shadow-[var(--shadow)]">
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <MiniMetric label="Duplicate mode" value="Email / Domain / Row" />
                  <MiniMetric label="Processing" value="Browser-side only" />
                  <MiniMetric label="Best for" value="CRM imports" />
                  <MiniMetric label="Export" value="Clean CSV" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-[2rem] border border-[color:var(--line)] bg-white/76 p-6 shadow-[var(--shadow)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.14)] text-[color:var(--brand-strong)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {card.text}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              How it works
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
              Keep the product centered on the spreadsheet you already have
            </h2>
            <div className="mt-6 space-y-4">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/82 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                    {step.eyebrow}
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
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-[color:var(--accent)]" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
                  Privacy-first workflow
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                  Keep raw lead data inside the browser
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <InfoRow
                title="Browser-side processing"
                text="Basic cleanup, parsing, deduplication, and report generation run in the browser for the MVP flow."
              />
              <InfoRow
                title="CSV-first reporting"
                text="Review what changed before import: clean rows, duplicates removed, invalid values, blank rows, and email quality hints."
              />
              <InfoRow
                title="Supporting tools still included"
                text="Text extractors stay available for discovery and edge cases, but the CSV cleaner remains the main product path."
              />
            </div>

            <div className="mt-6 rounded-[1.7rem] border border-[color:var(--line)] bg-[#fffaf3] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Primary product path
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <FlowChip
                  icon={<FileSpreadsheet className="h-4 w-4" />}
                  text="Upload CSV"
                />
                <FlowChip
                  icon={<Sparkles className="h-4 w-4" />}
                  text="Clean and review"
                />
                <FlowChip
                  icon={<Mail className="h-4 w-4" />}
                  text="Import or outreach"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Supporting SEO tools
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold sm:text-4xl">
                Keep the helper tools alive, but let the CSV workflow carry the
                product story
              </h2>
            </div>
            <Link
              href="/tools"
              className="text-sm font-semibold text-[color:var(--brand-strong)]"
            >
              Browse all tools
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {supportingTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)] transition hover:-translate-y-1"
              >
                <h3 className="font-display text-2xl font-semibold">
                  {tool.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {tool.text}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]">
                  Open tool
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-[color:var(--line)] bg-white/76 p-6 shadow-[var(--shadow)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                FAQ
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                A few practical questions before you try it
              </h2>
            </div>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-[color:var(--brand-strong)]"
            >
              See plan details
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[1.45rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </PageFrame>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[color:rgba(15,118,110,0.18)] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">
      {children}
    </span>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--line)] bg-white/80 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function FlowChip({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold">
      {icon}
      {text}
    </div>
  );
}

function InfoRow({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
        {text}
      </p>
    </div>
  );
}
