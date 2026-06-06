import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileSpreadsheet, Mail, Phone, Link as LinkIcon, Globe, CopyX, Sparkles, FolderDown, Zap, ShieldCheck } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { BreadcrumbJsonLd } from "@/lib/seo";

const flagshipTools = [
  {
    href: "/tools/csv-lead-cleaner",
    label: "Flagship Workflow",
    title: "CSV Lead Cleaner",
    description:
      "The full cleanup pass for CRM imports, recruiter spreadsheets, agency handoffs, and outreach lists that stopped being trustworthy.",
    notes: [
      "Column cleanup and dedupe modes",
      "Review report before export",
      "Business versus personal inbox hints",
    ],
    icon: FileSpreadsheet,
    featured: true,
  },
  {
    href: "/tools/extract-emails-from-csv",
    label: "CSV Support",
    title: "Extract Emails from CSV",
    description:
      "When the spreadsheet is mostly fine and you only need the email column cleaned, deduplicated, and ready to move.",
    notes: [
      "Pick the email column",
      "Remove invalid entries and duplicates",
      "Export as TXT or CSV",
    ],
    icon: FolderDown,
    featured: false,
  },
];

const helperTools = [
  {
    href: "/tools/extract-emails-from-text",
    title: "Extract Emails from Text",
    description: "For copied blocks that have not made it into a spreadsheet yet.",
    icon: Mail,
  },
  {
    href: "/tools/extract-phone-numbers-from-text",
    title: "Extract Phone Numbers",
    description: "Useful for notes, sourcing scraps, and messy pasted directories.",
    icon: Phone,
  },
  {
    href: "/tools/extract-urls-from-text",
    title: "Extract URLs from Text",
    description: "Pull links out of noisy copied text before you organize the rest.",
    icon: LinkIcon,
  },
  {
    href: "/tools/extract-domains-from-emails",
    title: "Extract Domains",
    description: "A supporting step when you need a quick domain list for enrichment.",
    icon: Globe,
  },
  {
    href: "/tools/clean-email-list",
    title: "Clean Email List",
    description: "Normalize a pasted list when the only job is fixing the addresses.",
    icon: Sparkles,
  },
  {
    href: "/tools/remove-duplicate-emails",
    title: "Remove Duplicate Emails",
    description: "Use this when the main problem is repeated addresses and nothing else.",
    icon: CopyX,
  },
];

export const metadata: Metadata = {
  title: "All Lead Cleaning Tools — LeadCleanr",
  description:
    "Explore LeadCleanr browser-first CSV lead cleaner tools and supporting text extractors. Clean, deduplicate, and export leads 100% locally with no signup.",
  alternates: {
    canonical: "https://leadcleanr.com/tools",
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
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-36 lg:pb-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,white,var(--background))]"></div>
        <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-[120px]"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>Browser-First Tools</span>
            </div>
            <h1 className="mb-8 bg-[linear-gradient(to_right,theme(colors.slate.900),theme(colors.slate.600))] bg-clip-text font-display text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
              Start with the CSV path.
            </h1>
            <p className="text-lg leading-8 text-slate-600 sm:text-xl">
              If your lead list already lives in rows and columns, go straight to the CSV Lead Cleaner. Use the helper tools below only when the data is still raw pasted text.
            </p>
          </div>
        </div>
      </section>

      {/* Flagship Workflow Cards */}
      <section className="relative z-10 pb-20 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {flagshipTools.map((tool) => (
              <FlagshipCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Helper Tools Grid */}
      <section className="bg-slate-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            
            {/* Guide Sidebar */}
            <div className="lg:sticky lg:top-32">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl mb-4">
                Helper text tools.
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                These tools handle the step before the spreadsheet exists. Paste copied text, pull out what you need, then move it into a CSV for the main workflow.
              </p>
              
              <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-8 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-700">
                  <Zap className="h-4 w-4" />
                  Workflow Guide
                </div>
                <ol className="space-y-4 text-sm leading-relaxed text-slate-700 font-medium">
                  <li className="flex gap-3">
                    <span className="text-blue-500">01.</span>
                    <span>Start with the spreadsheet if one already exists.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-500">02.</span>
                    <span>Use a helper tool only when the data is still raw text.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-500">03.</span>
                    <span>Return to the CSV cleaner for the final cleanup pass.</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Grid of Tools */}
            <div className="grid gap-6 sm:grid-cols-2">
              {helperTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 transition-colors duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-slate-900 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 mb-6">
                      {tool.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                      Open tool
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

function FlagshipCard({ tool }: { tool: typeof flagshipTools[0] }) {
  const Icon = tool.icon;
  
  if (tool.featured) {
    return (
      <Link
        href={tool.href}
        className="group relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] transition-all duration-300 hover:shadow-[0_40px_80px_-15px_rgba(15,23,42,0.4)] sm:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 border border-white/10 rounded-[2.5rem]"></div>
        
        <div className="relative">
          <div className="mb-8 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-400/10 border border-sky-400/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400">
              {tool.label}
            </div>
            <Icon className="h-8 w-8 text-sky-400/50" />
          </div>

          <h2 className="mb-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
            {tool.title}
          </h2>
          <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-400">
            {tool.description}
          </p>

          <div className="mb-10 space-y-4">
            {tool.notes.map((note) => (
              <div key={note} className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-400"></div>
                <span className="text-sm text-slate-300">{note}</span>
              </div>
            ))}
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-bold text-sky-400">
            Open workflow
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={tool.href}
      className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white/70 p-8 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-blue-200 hover:bg-white sm:p-12"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative">
        <div className="mb-8 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">
            {tool.label}
          </div>
          <Icon className="h-8 w-8 text-blue-200" />
        </div>

        <h2 className="mb-4 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {tool.title}
        </h2>
        <p className="mb-8 max-w-lg text-base leading-relaxed text-slate-600">
          {tool.description}
        </p>

        <div className="mb-10 space-y-4">
          {tool.notes.map((note) => (
            <div key={note} className="flex items-center gap-3 border-t border-slate-100 pt-4">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
              <span className="text-sm text-slate-600">{note}</span>
            </div>
          ))}
        </div>

        <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
          Open workflow
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
