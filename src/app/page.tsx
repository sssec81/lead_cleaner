import Link from "next/link";
import {
  ArrowRight,
  FileSpreadsheet,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { PageFrame } from "@/components/page-frame";

const toolCards = [
  {
    href: "/tools/extract-emails-from-text",
    title: "Extract Emails from Text",
    text: "Paste messy text and pull out clean email addresses in seconds.",
  },
  {
    href: "/tools/extract-phone-numbers-from-text",
    title: "Extract Phone Numbers",
    text: "Find phone numbers in copied notes, resumes, directories, and lead blocks.",
  },
  {
    href: "/tools/extract-urls-from-text",
    title: "Extract URLs from Text",
    text: "Pull website links out of mixed text and normalize them for export.",
  },
  {
    href: "/tools/extract-domains-from-emails",
    title: "Extract Domains",
    text: "Turn email addresses and URLs into a clean list of domains.",
  },
  {
    href: "/tools/clean-email-list",
    title: "Clean Email List",
    text: "Lowercase, deduplicate, and filter invalid addresses before outreach.",
  },
  {
    href: "/tools/csv-lead-cleaner",
    title: "CSV Lead Cleaner",
    text: "Upload a CSV, preview rows, choose a column, and export a cleaner file.",
  },
];

const steps = [
  {
    title: "Paste text or upload a CSV",
    text: "Bring in copied text, messy notes, exports, or a small spreadsheet you need to clean quickly.",
  },
  {
    title: "Choose the cleanup job",
    text: "Extract emails, phone numbers, URLs, domains, or clean and deduplicate a CSV column.",
  },
  {
    title: "Copy or export the result",
    text: "Review the cleaned output, copy it to your clipboard, or download TXT and CSV files instantly.",
  },
];

const useCases = [
  "Sales teams cleaning prospect lists before CRM import",
  "Recruiters pulling contact data from resumes and copied profiles",
  "Agencies cleaning repeated client lead files",
  "Virtual assistants removing duplicates from spreadsheets",
];

const faqs = [
  {
    question: "Does LeadCleanr store my pasted text or CSV files?",
    answer:
      "No for the MVP flow. Basic cleaning runs in your browser and we do not store pasted text or uploaded CSV file contents.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. The MVP is built to work without login, so you can open a tool and start cleaning right away.",
  },
  {
    question: "What can I export?",
    answer:
      "Text-based tools support TXT and CSV export. The CSV cleaner exports a cleaned CSV file after preview and deduplication.",
  },
  {
    question: "Who is this for?",
    answer:
      "LeadCleanr is built for sales teams, recruiters, marketers, agencies, freelancers, and anyone cleaning small lead or contact lists.",
  },
];

export default function HomePage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-[color:var(--line)] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Browser-first lead cleaning
            </p>
            <h1 className="font-display text-5xl font-semibold leading-tight sm:text-6xl">
              Clean messy lead lists instantly
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
              Paste text or upload a CSV to extract emails, phone numbers, URLs,
              and domains, remove duplicates, and export cleaner lead data
              without sending raw list contents to a backend.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools/extract-emails-from-text"
                className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Start Cleaning Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools/csv-lead-cleaner"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-white/75 px-6 text-sm font-semibold transition hover:-translate-y-0.5"
              >
                Upload CSV
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureBadge
                icon={<Mail className="h-5 w-5" />}
                title="Extract emails"
                text="Find addresses from copied text and deduplicate them automatically."
              />
              <FeatureBadge
                icon={<Phone className="h-5 w-5" />}
                title="Extract phones"
                text="Pull out phone numbers and normalize them into a cleaner format."
              />
              <FeatureBadge
                icon={<FileSpreadsheet className="h-5 w-5" />}
                title="Clean CSVs"
                text="Preview rows, choose a column, remove blanks, and export a better file."
              />
              <FeatureBadge
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Privacy first"
                text="Basic processing runs in your browser and no login is required."
              />
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)] sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Mini tool preview
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Open a tool and get usable output above the fold
              </h2>
              <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">
                Every core tool is built for one fast job: paste or upload,
                clean the data, inspect the stats, and export the result.
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] border border-[color:var(--line)] bg-[#fffaf3] p-5 sm:min-w-[22rem]">
              <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3">
                <Mail className="h-4 w-4 text-[color:var(--brand-strong)]" />
                <span className="text-sm font-medium">Extract Emails from Text</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3">
                <Globe className="h-4 w-4 text-[color:var(--brand-strong)]" />
                <span className="text-sm font-medium">Extract Domains from Emails</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3">
                <FileSpreadsheet className="h-4 w-4 text-[color:var(--brand-strong)]" />
                <span className="text-sm font-medium">CSV Lead Cleaner</span>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Popular tools
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Built for specific cleanup jobs
              </h2>
            </div>
            <Link
              href="/tools"
              className="hidden text-sm font-semibold text-[color:var(--brand-strong)] md:inline-flex"
            >
              View all tools
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {toolCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)] transition hover:-translate-y-1"
              >
                <h3 className="font-display text-2xl font-semibold">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {card.text}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]">
                  Open tool
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Fast enough for everyday cleanup work
            </h2>
            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-5"
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                    Step {index + 1}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Use cases
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Useful for small teams and repeat cleanup tasks
            </h2>
            <div className="mt-6 grid gap-4">
              {useCases.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[1.5rem] border border-[color:var(--line)] bg-[#fffaf3] px-5 py-4"
                >
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                  <p className="text-sm leading-7 text-[color:var(--muted)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-[color:rgba(15,118,110,0.16)] bg-[color:rgba(15,118,110,0.08)] p-5">
              <h3 className="text-lg font-semibold">Acceptable use</h3>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                LeadCleanr is for cleaning data you own or have permission to
                process. Do not use it for spam, scraping abuse, or unsolicited
                outreach.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-[color:rgba(15,118,110,0.16)] bg-[color:rgba(15,118,110,0.08)] p-6 shadow-[var(--shadow)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
            Privacy
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Your data should not need an account just to get cleaned
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[color:var(--muted)]">
            The MVP is intentionally browser-first. Basic cleaning runs on your
            device, no login is required, and we do not store pasted text or
            uploaded CSV contents in the product flow.
          </p>
          <div className="mt-6">
            <Link
              href="/privacy"
              className="btn-primary inline-flex min-h-11 items-center justify-center rounded-full bg-[color:var(--foreground)] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Read Privacy Details
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                FAQ
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Common questions before you start
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-white/75 px-6 text-sm font-semibold transition hover:-translate-y-0.5"
            >
              Contact us
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)]"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
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

function FeatureBadge({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.12)] text-[color:var(--brand-strong)]">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
        {text}
      </p>
    </div>
  );
}
