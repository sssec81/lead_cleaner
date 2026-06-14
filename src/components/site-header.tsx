"use client";

import Link from "next/link";
import { ArrowRight, Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
];

const TOOL_NEXT_STEP: Array<{ match: string; href: string; label: string }> = [
  { match: "/tools/validate-email-list", href: "/tools/remove-duplicate-emails", label: "Deduplicate Emails" },
  { match: "/tools/extract-emails-from-text", href: "/tools/clean-email-list", label: "Clean Email List" },
  { match: "/tools/extract-emails-from-csv", href: "/tools/validate-email-list", label: "Validate List" },
  { match: "/tools/extract-phone-numbers-from-text", href: "/tools/remove-duplicate-phone-numbers", label: "Deduplicate Numbers" },
  { match: "/tools/extract-phone-numbers-from-csv", href: "/tools/csv-lead-cleaner", label: "Clean CSV Free" },
  { match: "/tools/remove-duplicate-emails", href: "/tools/validate-email-list", label: "Validate List" },
  { match: "/tools/remove-duplicate-phone-numbers", href: "/tools/csv-lead-cleaner", label: "Clean CSV Free" },
  { match: "/tools/remove-duplicate-urls", href: "/tools/extract-urls-from-text", label: "Extract More URLs" },
  { match: "/tools/merge-csv-files", href: "/tools/csv-lead-cleaner", label: "Clean Merged CSV" },
  { match: "/tools/split-csv-files", href: "/tools/csv-lead-cleaner", label: "Clean the Split" },
  { match: "/tools/convert-csv-to-json", href: "/tools/csv-lead-cleaner", label: "Clean CSV Free" },
  { match: "/tools/clean-email-list", href: "/tools/validate-email-list", label: "Validate List" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerCta = getHeaderCta(pathname);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--lc-border)] bg-white/72 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-[var(--lc-accent)]" />
          <span className="text-[15px] font-semibold tracking-tight text-[var(--lc-ink)]">LeadCleanr</span>
        </Link>
 
        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`px-1 py-1 text-[14px] font-medium transition-colors ${
                isActive(item.href)
                  ? "text-[var(--lc-accent)]"
                  : "text-[var(--lc-muted)] hover:text-[var(--lc-ink)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
 
        <div className="hidden items-center gap-4 lg:flex">
          <div className="inline-flex items-center gap-1 rounded-full bg-black/[0.03] border border-black/5 px-2.5 py-0.5 font-sans text-[11px] text-[var(--lc-muted)]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Processed locally
          </div>
          <Link
            href={headerCta.href}
            className="lc-button-primary"
          >
            {headerCta.label}
          </Link>
        </div>
 
        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-white text-[var(--lc-ink)] lg:hidden"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
 
      {mobileOpen ? (
        <div className="border-t border-[var(--lc-border)] bg-white/95 backdrop-blur-md lg:hidden">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <nav aria-label="Mobile primary" className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]"
                      : "text-[var(--lc-muted)] hover:bg-black/[0.03] hover:text-[var(--lc-ink)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
 
            <div className="mt-4 flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/[0.03] border border-black/5 px-2.5 py-0.5 font-sans text-[11px] text-[var(--lc-muted)]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Processed locally
              </div>
              <Link
                href={headerCta.href}
                onClick={() => setMobileOpen(false)}
                className="lc-button-primary w-full text-center"
              >
                {headerCta.label}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function getHeaderCta(pathname: string) {
  for (const step of TOOL_NEXT_STEP) {
    if (pathname.startsWith(step.match)) {
      return { href: step.href, label: step.label };
    }
  }

  return { href: "/tools/csv-lead-cleaner", label: "Clean CSV Free" };
}
