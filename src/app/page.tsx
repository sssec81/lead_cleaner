import Link from "next/link";
import { ArrowRight, Shield, Zap, FileSpreadsheet, CheckCircle2, Lock, ArrowUpRight, Copy } from "lucide-react";
import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";

const workflowSteps = [
  {
    number: "01",
    title: "Upload Messy CSV",
    text: "Drop in your raw list. The cleaning begins locally without sending contact records to external servers.",
  },
  {
    number: "02",
    title: "Choose Rules",
    text: "Isolate duplicate rows, filter missing fields, and analyze domain structures directly in the dashboard preview.",
  },
  {
    number: "03",
    title: "Export Database",
    text: "Download a structured list ready for import into HubSpot, Clay, Apollo, or outreach pipelines.",
  },
];

const productSignals = [
  {
    label: "Catches duplicates before import",
    text: "Scans record fields to deduplicate rows, preventing dirty lists from bloating CRM or outreach pipelines.",
    icon: Copy,
  },
  {
    label: "Flags email quality signals",
    text: "Filters invalid domains, detects generic role addresses, and separates business vs. personal Gmail accounts.",
    icon: Zap,
  },
  {
    label: "Keeps cleanup visible",
    text: "Previews your processed records and inspects error reports in real-time so you trust the data before downloading.",
    icon: Shield,
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
    answer: "Cleaning messy lead CSVs before CRM import, outreach, recruiting, and agency handoff work. The text tools help with discovery and edge cases, but the main product is the CSV workflow.",
  },
  {
    question: "Does it process the file on the server?",
    answer: "The core cleanup flow runs entirely in your browser. Raw file contents are not sent to the app backend for routine processing.",
  },
  {
    question: "Who gets value first?",
    answer: "Sales ops teams, recruiters, agencies, marketers, and assistants who inherit spreadsheets they did not create and still have to make usable.",
  },
];

export const metadata: Metadata = {
  title: "LeadCleanr — Private CSV Lead Cleaner for CRM & Outreach Lists",
  description: "Instantly clean messy lead CSVs before importing into CRM or outreach platforms. 100% locally in your browser with no signup required.",
  alternates: { canonical: "https://leadcleanr.com" },
};

export default function HomePage() {
  return (
    <PageFrame>
      {/* Massive Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-40 lg:pb-48">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,white,var(--background))]"></div>
        <div className="absolute top-0 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-blue-400/20 blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-emerald-400/20 blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            
            {/* Hero Content */}
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm backdrop-blur-md">
                <Lock className="h-4 w-4" />
                <span>Private CSV Cleanup</span>
              </div>
              <h1 className="mb-8 font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl xl:text-[5rem] leading-[1.05]">
                Clean messy lead CSVs before import.
              </h1>
              <p className="mb-10 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Instantly clean messy lead CSVs before importing into CRM or outreach platforms. Deduplicate rows, filter invalid emails, and flag role-based addresses—<strong className="text-slate-900">100% locally in your browser.</strong>
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/tools/csv-lead-cleaner"
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-8 text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.8)] hover:-translate-y-0.5"
                >
                  Clean a CSV Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-slate-200 bg-white/50 px-8 text-base font-semibold text-slate-700 backdrop-blur-md transition-colors hover:border-slate-300 hover:bg-white"
                >
                  View limits
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-3 text-sm font-medium text-slate-500">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                No signup required. Start immediately.
              </div>
            </div>

            {/* Live Workspace Mockup */}
            <div className="relative lg:ml-10">
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-blue-500/10 to-emerald-500/10 blur-2xl"></div>
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-6 backdrop-blur-xl shadow-[0_30px_80px_rgba(15,23,42,0.1)] sm:p-8">
                
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200/50">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Live Workspace</p>
                    <p className="text-sm font-semibold text-slate-900">100% Local Processing</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <WorkspaceRowMock index={1} value="michael.chen@acmecorp.com" source="Cleaned" locked />
                  <WorkspaceRowMock index={2} value="sarah.jenkins@techlogistics.net" source="Cleaned" />
                  <WorkspaceRowMock index={3} value="contact@innovatesolutions.io" source="Role Inbox" highlight />
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200/50 pt-8">
                  <MetricNote value="412" label="Ready" />
                  <MetricNote value="43" label="Deduped" />
                  <MetricNote value="11" label="Flagged" />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Product Signals Section */}
      <section className="relative z-10 pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {productSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div key={signal.label} className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-blue-200 hover:-translate-y-1">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold text-slate-900">{signal.label}</h3>
                  <p className="text-base leading-relaxed text-slate-600">{signal.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dark Mode Workflow Section */}
      <section className="relative overflow-hidden bg-slate-950 py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_50%)]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-sky-400">The Workflow</p>
              <h2 className="mb-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Clean, review, export.
              </h2>
              <p className="mb-10 text-lg leading-8 text-slate-400">
                The workflow is intentionally short: load the file, choose the field that matters, then export only after the report makes sense.
              </p>
              <Link
                href="/tools/csv-lead-cleaner"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sky-500 px-8 text-sm font-bold text-slate-950 transition-all hover:bg-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]"
              >
                Clean a CSV Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-8">
              {workflowSteps.map((step) => (
                <div key={step.number} className="group flex gap-8 rounded-3xl border border-white/5 bg-white/5 p-8 transition-colors hover:bg-white/10 hover:border-white/10">
                  <div className="font-display text-4xl font-bold text-sky-400/30 transition-colors group-hover:text-sky-400">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="mb-3 text-2xl font-semibold text-white">{step.title}</h3>
                    <p className="text-base leading-relaxed text-slate-400">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-slate-50 py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            
            <div className="lg:sticky lg:top-32">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-600">Where it fits</p>
              <h2 className="mb-6 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                For the messy handoff before import.
              </h2>
              <p className="mb-10 text-lg leading-8 text-slate-600">
                LeadCleanr earns its place when a file is captured, but not yet safe enough for CRM, outreach, recruiting, or client delivery.
              </p>
            </div>

            <div className="grid gap-6">
              {useCases.map((useCase, index) => (
                <UseCaseRow key={useCase.kicker} {...useCase} index={index + 1} primary={index === 0} />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Helper Tools Section */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl mb-6">
              Quick helper utilities.
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              Use these when the data is still copied text, notes, or snippets before the CSV workflow. Perfect for pasting emails, support logs, or signatures.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {supportTools.map((tool, index) => (
              <SupportLink key={tool.href} {...tool} index={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & FAQ Section */}
      <section className="bg-slate-50 py-32 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
            
            <div className="space-y-8">
              <div className="rounded-3xl border border-blue-100 bg-white p-10 shadow-sm">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="mb-4 font-display text-3xl font-semibold text-slate-900">
                  Your data remains on your machine.
                </h2>
                <p className="text-base leading-relaxed text-slate-600">
                  Your raw CSV and pasted text stay in your browser during normal cleanup. All file parsing, cleaning filters, and table preview generation are executed locally.
                </p>
              </div>
              
              <ProWaitlistCard
                trackSource="home_bottom"
                title="Want saved workflows and export presets?"
                description="Join the Pro waitlist to get notified when we launch saved cleanup presets, advanced domain filters, and custom CRM export options."
              />
            </div>

            <div className="space-y-8">
              <h2 className="font-display text-3xl font-semibold text-slate-900 mb-8">
                Frequently asked questions
              </h2>
              <div className="space-y-8">
                {faqEntries.map((faq) => (
                  <div key={faq.question} className="border-b border-slate-200 pb-8 last:border-0">
                    <h3 className="mb-3 text-lg font-bold text-slate-900">{faq.question}</h3>
                    <p className="text-base leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </PageFrame>
  );
}

// Subcomponents

function WorkspaceRowMock({ index, value, source, locked = false, highlight = false }: any) {
  return (
    <div className={`rounded-2xl border bg-white p-4 transition-colors ${highlight ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-xs font-bold text-slate-400">
          {index}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${highlight ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
              {source}
            </span>
            {locked && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                Verified
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-900 font-mono">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MetricNote({ value, label }: any) {
  return (
    <div>
      <p className="font-display text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
    </div>
  );
}

function UseCaseRow({ kicker, title, text, index, primary = false }: any) {
  return (
    <div className={`group rounded-3xl border p-8 transition-all hover:shadow-md ${primary ? 'border-blue-200 bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
            0{index}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{kicker}</span>
        </div>
        {primary && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">
            Main Path
          </span>
        )}
      </div>
      <h3 className="mb-4 font-display text-2xl font-bold text-slate-900">{title}</h3>
      <p className="text-base leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}

function SupportLink({ href, title, text, index }: any) {
  return (
    <Link href={href} className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 font-bold">
        0{index}
      </div>
      <h3 className="mb-3 font-display text-xl font-bold text-slate-900">{title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-slate-600">{text}</p>
      <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
        Open tool
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
