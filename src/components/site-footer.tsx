"use client";

import Link from "next/link";
import { ArrowRight, Lock, Mail, Shield, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/tools", label: "All Tools" },
  { href: "/pricing", label: "Pricing & Limits" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact Us" },
];

const TOOL_NEXT_STEP: Array<{ match: string; href: string; label: string; intro: string }> = [
  {
    match: "/tools/validate-email-list",
    href: "/tools/remove-duplicate-emails",
    label: "Remove Duplicate Emails",
    intro: "Next step after validation for cleaner export lists.",
  },
  {
    match: "/tools/extract-emails-from-text",
    href: "/tools/clean-email-list",
    label: "Clean Email List",
    intro: "Turn the extracted emails into a cleaner list before export.",
  },
  {
    match: "/tools/extract-emails-from-csv",
    href: "/tools/validate-email-list",
    label: "Validate List",
    intro: "Check the extracted emails for structure and formatting before you export.",
  },
  {
    match: "/tools/extract-phone-numbers-from-text",
    href: "/tools/remove-duplicate-phone-numbers",
    label: "Remove Duplicate Numbers",
    intro: "Take the extracted list into the next cleanup step.",
  },
  {
    match: "/tools/extract-phone-numbers-from-csv",
    href: "/tools/csv-lead-cleaner",
    label: "Clean CSV Free",
    intro: "Run the full sheet through the main cleanup workflow next.",
  },
  {
    match: "/tools/remove-duplicate-emails",
    href: "/tools/validate-email-list",
    label: "Validate Email List",
    intro: "Check structure and formatting before the list leaves your browser.",
  },
  {
    match: "/tools/merge-csv-files",
    href: "/tools/csv-lead-cleaner",
    label: "Clean Merged CSV",
    intro: "Run the combined sheet through the main cleanup workflow next.",
  },
  {
    match: "/tools/split-csv-files",
    href: "/tools/csv-lead-cleaner",
    label: "Clean the Split",
    intro: "Take one of the smaller files into the cleaner for the next pass.",
  },
  {
    match: "/tools/convert-csv-to-json",
    href: "/tools/csv-lead-cleaner",
    label: "Clean CSV First",
    intro: "Fix duplicates and broken fields before you convert.",
  },
];

function getFooterCta(pathname: string) {
  for (const step of TOOL_NEXT_STEP) {
    if (pathname.startsWith(step.match)) {
      return {
        href: step.href,
        label: step.label,
        intro: step.intro,
      };
    }
  }

  return {
    href: "/tools/csv-lead-cleaner",
    label: "Clean CSV Free",
    intro: "No account required for the MVP.",
  };
}

export function SiteFooter() {
  const pathname = usePathname();
  const cta = getFooterCta(pathname);
 
  return (
    <footer className="mt-20 border-t border-[var(--lc-border)] bg-[#F5F5F7] text-[var(--lc-ink)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-[var(--lc-accent)]" />
          <p className="text-[15px] font-semibold tracking-tight">LeadCleanr</p>
        </div>
 
        <div className="mt-8 max-w-3xl">
          <h2 className="font-sans text-[28px] font-bold leading-tight tracking-tight text-[var(--lc-ink)] sm:text-[34px]">
            Your next CRM import starts here.
          </h2>
          <div className="mt-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={cta.href}
              className="lc-button-primary"
            >
              {cta.label}
            </Link>
            <p className="text-[13px] text-[var(--lc-muted)]">{cta.intro}</p>
          </div>
        </div>
 
        <div className="mt-12 border-t border-black/5 pt-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.03] text-[var(--lc-accent)]">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--lc-ink)]">Browser-only processing</p>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--lc-muted)]">
                  CSV files are parsed and cleaned locally in your browser.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.03] text-emerald-600">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--lc-ink)]">No account needed</p>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--lc-muted)]">
                  Start cleaning immediately. No account, no credit card.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.03] text-[var(--lc-accent)]">
                <ArrowRight className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--lc-ink)]">Export to any CRM</p>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--lc-muted)]">
                  Clean CSV works with HubSpot, Apollo, Clay, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
 
        <div className="mt-12 flex flex-col gap-6 border-t border-black/5 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-[var(--lc-muted)] transition-colors hover:text-[var(--lc-ink)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
 
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-[13px] text-[var(--lc-muted)] transition-colors hover:text-[var(--lc-ink)]"
          >
            <Mail className="h-4 w-4" />
            Contact support
          </Link>
        </div>
      </div>
    </footer>
  );
}
