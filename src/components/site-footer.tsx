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

function getFooterCta(pathname: string) {
  if (pathname.startsWith("/tools/validate-email-list")) {
    return {
      href: "/tools/remove-duplicate-emails",
      label: "Remove Duplicate Emails",
      intro: "Next step after validation for cleaner export lists.",
    };
  }

  if (pathname.startsWith("/tools/extract-phone-numbers-from-text")) {
    return {
      href: "/tools/remove-duplicate-phone-numbers",
      label: "Remove Duplicate Numbers",
      intro: "Take the extracted list into the next cleanup step.",
    };
  }

  if (pathname.startsWith("/tools/convert-csv-to-json")) {
    return {
      href: "/tools/csv-lead-cleaner",
      label: "Clean CSV First",
      intro: "Fix duplicates and broken fields before you convert.",
    };
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
    <footer className="mt-20 bg-[var(--lc-dark-bg)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-300" />
          <p className="text-sm font-medium">LeadCleanr</p>
        </div>

        <div className="mt-8 max-w-3xl">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-[-0.03em]">
            Your next CRM import
            <br />
            starts here.
          </h2>
          <div className="mt-6">
            <Link
              href={cta.href}
              className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-lg bg-[var(--lc-accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-sm text-[var(--lc-hint)]">{cta.intro}</p>
          </div>
        </div>

        <div className="mt-12 border-t border-[#2A2A28] pt-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/6 text-blue-300">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Browser-first processing</p>
                <p className="mt-1 text-xs text-[var(--lc-hint)]">
                  CSV files are parsed and cleaned locally in your browser.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/6 text-emerald-300">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">No signup required</p>
                <p className="mt-1 text-xs text-[var(--lc-hint)]">
                  Start cleaning immediately. No account, no credit card.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/6 text-blue-300">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Export to any CRM</p>
                <p className="mt-1 text-xs text-[var(--lc-hint)]">
                  Clean CSV works with HubSpot, Apollo, Clay, and more.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--lc-hint)] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm text-[var(--lc-hint)] transition-colors hover:text-white"
          >
            <Mail className="h-4 w-4" />
            Contact support
          </Link>
        </div>
      </div>
    </footer>
  );
}
