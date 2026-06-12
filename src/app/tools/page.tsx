import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CopyX,
  FileJson,
  FileSpreadsheet,
  FolderDown,
  Globe,
  Link as LinkIcon,
  Mail,
  Phone,
  Rows3,
  Scissors,
  ShieldCheck,
  Sparkles,
  Type,
  Users,
  Zap,
  Combine,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { BreadcrumbJsonLd, getSiteUrl } from "@/lib/seo";

const workflowSteps = [
  {
    step: "01",
    title: "Start with CSV if you already have rows",
    text: "Use the CSV tools when the list already lives in a spreadsheet and needs cleanup before export or import.",
  },
  {
    step: "02",
    title: "Use text helpers only for messy copied input",
    text: "Paste copied notes, signatures, or pages when the data is not in spreadsheet form yet.",
  },
  {
    step: "03",
    title: "Return to the main cleaner for the final pass",
    text: "After extracting emails, phones, or domains, move back into the CSV workflow for the actual cleanup review.",
  },
];

const primaryPath = {
  href: "/tools/csv-lead-cleaner",
  title: "CSV Lead Cleaner",
  description:
    "The default path for CRM imports, recruiter sheets, agency handoffs, and outreach lists that need a full cleanup pass.",
  points: [
    "Deduplicate and clean columns",
    "Review what changed before export",
    "Keep processing local in the browser",
  ],
};

const csvTools = [
  {
    href: "/tools/extract-emails-from-csv",
    title: "Extract Emails from CSV",
    description: "Pull, validate, and export the email column only.",
    icon: FolderDown,
    tag: "Email column",
  },
  {
    href: "/tools/extract-phone-numbers-from-csv",
    title: "Extract Phones from CSV",
    description: "Detect phone columns and standardize formats quickly.",
    icon: Phone,
    tag: "Phone column",
  },
  {
    href: "/tools/remove-empty-rows-from-csv",
    title: "Remove Empty CSV Rows",
    description: "Delete blank spreadsheet rows before import or merge.",
    icon: Rows3,
    tag: "Blank rows",
  },
  {
    href: "/tools/merge-csv-files",
    title: "Merge CSV Files",
    description: "Combine multiple CSVs and align headers automatically.",
    icon: Combine,
    tag: "Combine files",
  },
  {
    href: "/tools/split-csv-files",
    title: "Split CSV Files",
    description: "Break large CSVs into smaller chunks for upload limits.",
    icon: Scissors,
    tag: "Upload limits",
  },
  {
    href: "/tools/convert-csv-to-json",
    title: "Convert CSV to JSON",
    description: "Turn rows into structured JSON arrays instantly.",
    icon: FileJson,
    tag: "Format export",
  },
];

const textExtractionTools = [
  {
    href: "/tools/extract-emails-from-text",
    title: "Extract Emails",
    description: "Pull email addresses out of copied blocks of text.",
    icon: Mail,
  },
  {
    href: "/tools/extract-phone-numbers-from-text",
    title: "Extract Phone Numbers",
    description: "Find and normalize phone numbers in raw pasted text.",
    icon: Phone,
  },
  {
    href: "/tools/extract-urls-from-text",
    title: "Extract URLs",
    description: "Pull links out of noisy copied content.",
    icon: LinkIcon,
  },
  {
    href: "/tools/extract-domains-from-emails",
    title: "Extract Domains",
    description: "Get domains from email lists for enrichment workflows.",
    icon: Globe,
  },
];

const cleanupTools = [
  {
    href: "/tools/validate-email-list",
    title: "Validate Email List",
    description: "Check list structure and syntax before sending.",
    icon: CheckCircle2,
  },
  {
    href: "/tools/clean-email-list",
    title: "Clean Email List",
    description: "Normalize and tidy a pasted email list.",
    icon: Sparkles,
  },
  {
    href: "/tools/remove-duplicate-emails",
    title: "Remove Duplicate Emails",
    description: "Keep only unique email values.",
    icon: CopyX,
  },
  {
    href: "/tools/remove-duplicate-phone-numbers",
    title: "Remove Duplicate Phones",
    description: "Deduplicate phone numbers from raw input.",
    icon: Phone,
  },
  {
    href: "/tools/remove-duplicate-urls",
    title: "Remove Duplicate URLs",
    description: "Deduplicate copied links and URL lists.",
    icon: LinkIcon,
  },
  {
    href: "/tools/count-words-characters-text",
    title: "Count Words / Characters",
    description: "Quick counts for copied text and drafts.",
    icon: Type,
  },
];

export const metadata: Metadata = {
  title: "All Lead Cleaning Tools — LeadCleanr",
  description:
    "Choose the right LeadCleanr workflow fast. Start with the CSV cleaner for spreadsheets, then use compact helper tools only when the input is still raw text.",
  alternates: {
    canonical: `${getSiteUrl()}/tools`,
  },
};

export default function ToolsPage() {
  return (
    <PageFrame>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
        ]}
      />

      <section className="grid-glow relative overflow-hidden pt-24 pb-14 lg:pt-36 lg:pb-18">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.86),var(--background))]" />
        <div className="absolute top-0 right-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-blue-400/18 blur-[110px]" />
        <div className="absolute bottom-0 left-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-emerald-400/14 blur-[110px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="metric-chip mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              <span>Compact Workflow Map</span>
            </div>
            <h1 className="aurora-text mb-6 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Pick the right tool in one pass.
            </h1>
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              Most users should start with the CSV workflow. Only branch into helper tools when the input is still copied text or you need one small cleanup step.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-10 lg:pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <Link
              href={primaryPath.href}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/88 p-6 shadow-[0_22px_60px_-44px_rgba(15,23,42,0.42)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_72px_-42px_rgba(37,99,235,0.24)] sm:p-7"
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(242,247,252,0.94))]" />
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-400/12 blur-[90px]" />
              <div className="relative">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
                    <Zap className="h-3.5 w-3.5" />
                    Start Here
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1d4ed8,#0f766e)] text-white shadow-[0_12px_26px_rgba(29,78,216,0.24)]">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                </div>

                <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
                  {primaryPath.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  {primaryPath.description}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {primaryPath.points.map((point) => (
                    <div
                      key={point}
                      className="rounded-2xl border border-slate-200/80 bg-white/84 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
                    >
                      {point}
                    </div>
                  ))}
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                  Open main workflow
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            <div className="glass-panel rounded-[1.75rem] p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                <BarChart3 className="h-4 w-4" />
                Workflow Logic
              </div>
              <div className="space-y-3">
                {workflowSteps.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4"
                  >
                    <div className="mb-1 flex items-center gap-3">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold tracking-widest text-blue-700">
                        {item.step}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                ))}
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
                CSV Helpers
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Spreadsheet already exists, but you only need one focused action.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              <span className="metric-chip rounded-full px-3 py-1.5">Fast picks</span>
              <span className="metric-chip rounded-full px-3 py-1.5">CSV-only</span>
              <span className="metric-chip rounded-full px-3 py-1.5">Compact cards</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {csvTools.map((tool) => (
              <CompactToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(240,245,251,0.92))] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <ToolGroup
              eyebrow="Text Extraction"
              title="Input is still messy copied text."
              intro="Use these when you have notes, pasted pages, recruiter scraps, or signatures instead of a clean table."
              tools={textExtractionTools}
            />
            <ToolGroup
              eyebrow="Quick Cleanup"
              title="You only need one cleanup utility."
              intro="These are the small sharp tools for validation, dedupe, normalization, or quick measurement."
              tools={cleanupTools}
            />
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

function ToolGroup({
  eyebrow,
  title,
  intro,
  tools,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  tools: Array<{
    href: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}) {
  return (
    <div className="glass-panel rounded-[1.75rem] p-6 sm:p-7">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
        {eyebrow}
      </p>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{intro}</p>

      <div className="mt-5 grid gap-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/82 px-4 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
              <tool.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">{tool.title}</h3>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600" />
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CompactToolCard({
  tool,
}: {
  tool: {
    href: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    tag: string;
  };
}) {
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className="surface-card group rounded-[1.5rem] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-blue-700">
          {tool.tag}
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold text-slate-900">{tool.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
        Open tool
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
