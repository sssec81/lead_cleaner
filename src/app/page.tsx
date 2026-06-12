import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Globe,
  Lock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  Upload,
  Users,
  Zap,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const workflowSteps = [
  {
    step: "01",
    title: "Upload or paste the raw list",
    text: "Start with CSV if the spreadsheet already exists. Only use text helpers when the data is still messy copied input.",
  },
  {
    step: "02",
    title: "Clean only what matters",
    text: "Run the focused tool that matches the job: full CSV cleanup, email extraction, dedupe, validation, or format conversion.",
  },
  {
    step: "03",
    title: "Review, then export",
    text: "Check the output inside the workspace and download only when the cleaned result looks right.",
  },
];

const quickStarts = [
  {
    href: "/tools/csv-lead-cleaner",
    title: "Full CSV cleanup",
    text: "Best for CRM imports, prospect lists, recruiter sheets, and agency handoffs.",
    icon: FileSpreadsheet,
    tag: "Start here",
  },
  {
    href: "/tools/extract-emails-from-text",
    title: "Emails from pasted text",
    text: "Use when contacts still live in notes, pages, signatures, or copied blocks.",
    icon: Mail,
    tag: "Text helper",
  },
  {
    href: "/tools/extract-phone-numbers-from-text",
    title: "Phones from pasted text",
    text: "Pull phone numbers out of raw sourcing notes or messy copied directories.",
    icon: Phone,
    tag: "Text helper",
  },
  {
    href: "/tools/extract-domains-from-emails",
    title: "Domains for enrichment",
    text: "Quick domain extraction when you need a list for lookup or routing.",
    icon: Globe,
    tag: "Support step",
  },
];

const trustPoints = [
  {
    title: "Browser-first processing",
    text: "CSV files and pasted content are cleaned locally in your browser during normal usage.",
    icon: Shield,
  },
  {
    title: "No signup required",
    text: "Users can start immediately without creating an account for the main workflow.",
    icon: Lock,
  },
  {
    title: "Built for lead ops",
    text: "Designed for CRM imports, outreach operations, recruiting workflows, and agency delivery.",
    icon: Users,
  },
];

const heroProofs = [
  { label: "Processed locally", value: "Browser-only", icon: Shield },
  { label: "Free path", value: "No signup", icon: Lock },
  { label: "First success", value: "Try sample fast", icon: Zap },
];

export const metadata: Metadata = {
  title: "LeadCleanr — Private CSV Lead Cleaner for CRM & Outreach Lists",
  description:
    "Clean messy lead CSVs before import. Choose the right workflow fast, process locally in your browser, and export only after review.",
  alternates: { canonical: "https://leadcleanr.com" },
};

export default function HomePage() {
  return (
    <PageFrame>
      <section className="grid-glow relative overflow-hidden pt-24 pb-14 lg:pt-36 lg:pb-18">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.84),var(--background))]" />
        <div className="absolute top-0 right-1/4 -z-10 h-[520px] w-[520px] rounded-full bg-blue-400/18 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 -z-10 h-[520px] w-[520px] rounded-full bg-emerald-400/16 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="pt-4">
              <div className="metric-chip mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700">
                <Sparkles className="h-4 w-4" />
                <span>Private Lead Workflow</span>
              </div>
              <h1 className="aurora-text max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
                Clean messy lead CSVs before they break your CRM import.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                LeadCleanr is a workflow-first set of cleanup tools. Start with the CSV cleaner when the spreadsheet already exists, then branch into helper tools only when the input is still raw text.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href="/tools/csv-lead-cleaner"
                  className="btn-primary min-h-14 rounded-full px-8 text-base font-semibold"
                >
                  Start CSV Workflow
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/tools"
                  className="btn-secondary min-h-14 rounded-full px-8 text-base font-semibold"
                >
                  Browse All Tools
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm font-medium text-slate-500">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                No signup required. Clean locally and review before export.
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {heroProofs.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-[1.2rem] border border-slate-200/80 bg-white/82 px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        <Icon className="h-3.5 w-3.5 text-blue-600" />
                        {item.label}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel rounded-[1.75rem] p-6 sm:p-7">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-blue-700">
                <BarChart3 className="h-4 w-4" />
                Live Demo
              </div>
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/86 p-4 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
                  <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50/85 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          Messy Input
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">Raw pasted lead notes</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <FileText className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-2 rounded-[1rem] border border-slate-200 bg-white px-4 py-3 font-mono text-xs leading-6 text-slate-500">
                      <p>Jane - JANE@acme.com, copied from footer</p>
                      <p>support@northstar.io after the demo call</p>
                      <p>(415) 555-0101 in notes again</p>
                      <p>www.riverlabs.ai/contact from research</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700 shadow-sm">
                      <Upload className="h-3.5 w-3.5" />
                      Clean
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div className="rounded-[1.2rem] border border-slate-800 bg-slate-950 p-4 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
                          Clean Output
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">Structured, export-ready values</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200">
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { label: "Email", value: "jane@acme.com" },
                        { label: "Email", value: "support@northstar.io" },
                        { label: "Phone", value: "+14155550101" },
                        { label: "Domain", value: "riverlabs.ai" },
                      ].map((row) => (
                        <div
                          key={row.value}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/6 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <span className="rounded-full bg-blue-500/12 px-2.5 py-1 text-[11px] font-bold tracking-wide text-blue-100">
                              {row.label}
                            </span>
                            <p className="mt-2 truncate font-mono text-sm text-slate-100">{row.value}</p>
                          </div>
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {workflowSteps.map((item) => (
                    <div key={item.step} className="rounded-[1.15rem] border border-slate-200/80 bg-white px-4 py-4">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold tracking-widest text-blue-700">
                          {item.step}
                        </span>
                        <h2 className="text-sm font-semibold text-slate-900">{item.title}</h2>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                Quick Start Paths
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Pick the workflow that matches the mess.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              <span className="metric-chip rounded-full px-3 py-1.5">CSV-first</span>
              <span className="metric-chip rounded-full px-3 py-1.5">Compact choices</span>
              <span className="metric-chip rounded-full px-3 py-1.5">Built for speed</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickStarts.map((item) => (
              <QuickStartCard key={item.href} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(240,245,251,0.92))] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="glass-panel rounded-[1.5rem] p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">{point.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{point.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

function QuickStartCard({
  item,
}: {
  item: {
    href: string;
    title: string;
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    tag: string;
  };
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="surface-card group rounded-[1.5rem] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-blue-700">
          {item.tag}
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold text-slate-900">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
        Open path
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
