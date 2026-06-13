import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Download,
  FileSpreadsheet,
  Globe,
  Mail,
  Phone,
  Shield,
  Upload,
  Users,
  Wand2,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const processSteps = [
  {
    title: "Upload or paste the raw list",
    text: "Start with a CSV when the spreadsheet already exists.",
    icon: Upload,
  },
  {
    title: "Clean only what matters",
    text: "Extract emails, phones, domains, or remove the duplicates.",
    icon: Wand2,
  },
  {
    title: "Review, then export",
    text: "Download the cleaned output only when it looks right.",
    icon: Download,
  },
];

const quickStarts = [
  {
    href: "/tools/csv-lead-cleaner",
    title: "Full CSV cleanup",
    text: "Best for CRM imports, recruiter sheets, and agency delivery.",
    icon: FileSpreadsheet,
  },
  {
    href: "/tools/extract-emails-from-text?sample=1",
    title: "Emails from pasted text",
    text: "Use when the contacts still live in copied notes or rough blocks.",
    icon: Mail,
  },
  {
    href: "/tools/extract-phone-numbers-from-text?sample=1",
    title: "Phones from pasted text",
    text: "Pull phone numbers out of raw sourcing notes or messy directories.",
    icon: Phone,
  },
  {
    href: "/tools/extract-domains-from-emails?sample=1",
    title: "Domains for enrichment",
    text: "Turn messy emails and URLs into a clean company-domain list.",
    icon: Globe,
  },
];

export const metadata: Metadata = {
  title: "LeadCleanr — Private CSV Lead Cleaner for CRM & Outreach Lists",
  description:
    "Paste a messy list or upload a CSV. LeadCleanr extracts emails, phones, and domains in your browser with no account needed.",
  alternates: { canonical: "https://leadcleanr.com" },
};

export default function HomePage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16">
          <div>
            <p className="section-eyebrow">Workflow Tool</p>
            <h1 className="section-title mt-4 max-w-none font-display text-[clamp(2.5rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--lc-ink)]">
              Clean messy lead CSVs
              <br />
              before they break
              <br />
              your CRM import.
            </h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-[var(--lc-muted)]">
              Paste a messy list or upload a CSV. LeadCleanr extracts emails,
              phones, and domains in your browser. Nothing gets uploaded.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools/csv-lead-cleaner?sample=1"
                className="btn-primary min-h-11 rounded-lg px-5 py-2.5 text-[15px] font-medium"
              >
                Start CSV Workflow
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools"
                className="btn-secondary min-h-11 rounded-lg px-5 py-2.5 text-[15px] font-medium"
              >
                Browse all tools
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--lc-muted)]">
              <span>✓ No account needed</span>
              <span className="text-[var(--lc-hint)]">·</span>
              <span>✓ 5MB free</span>
              <span className="text-[var(--lc-hint)]">·</span>
              <span>✓ Processed locally in your browser</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)]">
              <div className="grid lg:grid-cols-2">
              <div className="border-b border-[var(--lc-border)] lg:border-r lg:border-b-0 flex flex-col">
                <div className="border-b border-[var(--lc-border)] bg-[#F4F4F2] px-4 py-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--lc-hint)]">
                    Messy Input
                  </p>
                </div>
                <div className="flex-1 px-4 py-4 font-mono text-[13px] leading-relaxed text-[var(--lc-muted)]">
                  <p>Jane - JANE@acme.com, copied from footer</p>
                  <p>support@northstar.io after demo call</p>
                  <p>(415) 555-0101 in notes again</p>
                  <p>www.riverlabs.ai/contact from research</p>
                </div>
              </div>

              <div className="relative flex flex-col bg-[#141412]">
                <div className="bg-[var(--lc-ink)] px-4 py-2 shrink-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--lc-hint)]">
                    Clean Output
                  </p>
                </div>
                <div className="flex-1 px-4 py-4">
                  {[
                    { type: "Email", value: "jane@acme.com", tone: "bg-blue-950 text-blue-300" },
                    { type: "Email", value: "support@northstar.io", tone: "bg-blue-950 text-blue-300" },
                    { type: "Phone", value: "+14155550101", tone: "bg-emerald-950 text-emerald-300" },
                    { type: "Domain", value: "riverlabs.ai", tone: "bg-violet-950 text-violet-300" },
                  ].map((item, index) => (
                    <div
                      key={item.value}
                      className="homepage-demo-row mb-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 last:mb-0"
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      <div className="min-w-0">
                        <span className={`rounded-full px-2 py-1 font-mono text-[11px] ${item.tone}`}>
                          {item.type}
                        </span>
                        <p className="mt-2 truncate font-mono text-[13px] text-white">
                          {item.value}
                        </p>
                      </div>
                      <Check className="h-4 w-4 shrink-0 text-[var(--lc-green)]" />
                    </div>
                  ))}
                </div>
              </div>
              </div>

              <div className="border-t border-[var(--lc-border)] bg-[var(--lc-surface)] px-4 py-4">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tools/extract-emails-from-text?sample=1"
                    className="btn-secondary min-h-10 rounded-md px-4 py-2 text-sm font-medium"
                  >
                    Try text sample
                  </Link>
                  <Link
                    href="/tools/csv-lead-cleaner?sample=1"
                    className="btn-primary min-h-10 rounded-md px-4 py-2 text-sm font-medium"
                  >
                    Open CSV sample
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--lc-border)] bg-[var(--lc-surface)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 md:items-start">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-semibold text-[var(--lc-ink)]">{step.title}</h2>
                      {index < processSteps.length - 1 ? (
                        <span className="hidden text-[var(--lc-hint)] md:inline">→</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="section-eyebrow">Quick Start Paths</p>
        <div className="mt-3 flex items-end justify-between gap-6">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-3xl">
            Pick the workflow that matches the mess.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickStarts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-5 transition-colors hover:border-[var(--lc-accent)] hover:shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--lc-ink)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">{item.text}</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-[var(--lc-border-mid)] px-3 py-1 text-sm font-medium text-[var(--lc-ink)] transition-colors hover:border-[var(--lc-accent)]">
                  Open path
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.03em] text-[var(--lc-ink)]">
              Your data never leaves
              <br />
              your browser.
            </h2>
            <div className="mt-5 space-y-2 text-sm leading-6 text-[var(--lc-muted)]">
              <p>✓ CSV parsing and text cleanup happen locally on this device.</p>
              <p>✓ You can test the free workflow without creating an account first.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--lc-ink)]">No signup</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                Open a tool, load a sample, and see the output before committing to anything.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--lc-ink)]">Built for lead ops</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                Designed for CRM imports, outbound cleanup, recruiter sourcing, and agency handoff workflows.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
