import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileSpreadsheet, Globe, Mail, Phone, Sparkles } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const tools = [
  {
    href: "/tools/extract-emails-from-text",
    title: "Extract Emails from Text",
    description: "Find and clean email addresses from copied text blocks.",
    category: "Extract",
    icon: Mail,
  },
  {
    href: "/tools/remove-duplicate-emails",
    title: "Remove Duplicate Emails",
    description: "Deduplicate repeated email addresses before export.",
    category: "Clean",
    icon: Sparkles,
  },
  {
    href: "/tools/extract-phone-numbers-from-text",
    title: "Extract Phone Numbers from Text",
    description: "Find and normalize phone numbers from copied text blocks.",
    category: "Extract",
    icon: Phone,
  },
  {
    href: "/tools/extract-urls-from-text",
    title: "Extract URLs from Text",
    description: "Find and normalize links from copied text blocks.",
    category: "Extract",
    icon: Globe,
  },
  {
    href: "/tools/extract-domains-from-emails",
    title: "Extract Domains from Emails",
    description: "Pull domains from email addresses and website links.",
    category: "Extract",
    icon: Globe,
  },
  {
    href: "/tools/clean-email-list",
    title: "Clean Email List",
    description: "Lowercase, trim, and prepare email lists for outreach.",
    category: "Clean",
    icon: Sparkles,
  },
  {
    href: "/tools/csv-lead-cleaner",
    title: "CSV Lead Cleaner",
    description: "Preview rows and clean lead columns from CSV uploads.",
    category: "CSV",
    icon: FileSpreadsheet,
  },
  {
    href: "/tools/extract-emails-from-csv",
    title: "Extract Emails from CSV",
    description: "Pull valid email addresses from a selected CSV column.",
    category: "CSV",
    icon: FileSpreadsheet,
  },
];

const categories = [
  {
    name: "Extract",
    description: "Pull structured data out of copied text fast.",
  },
  {
    name: "Clean",
    description: "Normalize and deduplicate lists before export.",
  },
  {
    name: "CSV",
    description: "Upload, preview, clean, and export spreadsheet data.",
  },
];

export const metadata: Metadata = {
  title: "All Tools",
  description: "Explore LeadCleanr browser-first lead cleaning tools.",
};

export default function ToolsPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          Free tools
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
          Pick the cleaner you need
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          LeadCleanr is built as one focused product with separate SEO-friendly
          tools for the exact cleanup job you need.
        </p>
        <div className="mt-10 rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                Choose the tool by workflow, not by guesswork
              </h2>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                Each tool is focused on one cleanup job so you can land on the
                right route quickly, get the result above the fold, and export
                without extra setup.
              </p>
            </div>
            <Link
              href="/tools/csv-lead-cleaner"
              className="btn-primary inline-flex min-h-11 items-center justify-center rounded-full bg-[color:var(--foreground)] px-6 text-sm font-semibold text-white"
            >
              Start with CSV cleaner
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.name}
                className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                  {category.name}
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {categories.map((category) => (
            <section key={category.name}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                    {category.name}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold">
                    {category.description}
                  </h2>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {tools
                  .filter((tool) => tool.category === category.name)
                  .map((tool) => {
                    const Icon = tool.icon;

                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="surface-card rounded-[2rem] p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.12)] text-[color:var(--brand-strong)]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-display text-2xl font-semibold">
                              {tool.title}
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                              {tool.description}
                            </p>
                            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]">
                              Open tool
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
