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
  "Select email, phone, domain, or whole-row deduplication",
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
    title: "Upload your lead CSV",
    text: "Bring in the messy file you actually work with: CRM export, recruiter list, agency handoff, or VA-assembled prospect sheet.",
  },
  {
    title: "Choose what to clean and deduplicate",
    text: "Select the main column, switch dedupe mode, review personal vs business email mix, and spot role-based inboxes before export.",
  },
  {
    title: "Export the cleaned file",
    text: "Leave with a cleaner CSV plus a report you can trust before importing or handing the file off.",
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
        <div className="grid gap-8 xl:grid-cols-[1.03fr_0.97fr] xl:items-center">
          <div>
            <p className="inline-flex rounded-full border border-[color:rgba(217,119,6,0.18)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              CSV-first lead cleaning
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.96] sm:text-6xl xl:text-7xl">
              Clean messy lead CSV files before CRM import
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
              Upload a CSV, choose email, phone, domain, or whole-row
              deduplication, remove blanks and invalid entries, flag personal
              and role-based inboxes, and export a cleaner file entirely in
              your browser.
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
                href="/tools"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-white/80 px-6 text-sm font-semibold transition hover:-translate-y-0.5"
              >
                See all supporting tools
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {heroChecklist.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[1.4rem] border border-[color:var(--line)] bg-white/70 px-4 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
                  <p className="text-sm leading-6 text-[color:var(--foreground)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,238,0.92))] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                  Sample cleaning report
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold">
                  Feels like a workflow, not a regex toy
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
                  className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-4"
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
                Built for the real spreadsheet step before outreach, import,
                enrichment, or delivery to a client team.
              </p>
            </div>

            <div className="mt-5 rounded-[1.6rem] border border-[color:var(--line)] bg-[#fffaf3] p-5">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <MiniMetric label="Duplicate mode" value="Email / Domain / Row" />
                <MiniMetric label="Processing" value="Browser-side only" />
                <MiniMetric label="Best for" value="CRM imports" />
                <MiniMetric label="Export" value="Clean CSV" />
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

        <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.04fr]">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Center the product around the spreadsheet you already have
            </h2>
            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                    Step {index + 1}
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
                  Keep raw lead data in the browser
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
                text="Know what changed before import: clean rows, duplicates removed, invalid values, blank rows, and email quality hints."
              />
              <InfoRow
                title="SEO helper tools still included"
                text="Text extractors stay available for edge cases and discovery, but the CSV cleaner is the main conversion path."
              />
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-[color:var(--line)] bg-[#fffaf3] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Primary product path
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <FlowChip icon={<FileSpreadsheet className="h-4 w-4" />} text="Upload CSV" />
                <FlowChip icon={<Sparkles className="h-4 w-4" />} text="Clean and review" />
                <FlowChip icon={<Mail className="h-4 w-4" />} text="Import or outreach" />
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
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Keep the extractors as entry points, not the main pitch
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
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            FAQ
          </p>
          <div className="mt-6 grid gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[1.4rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5"
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
