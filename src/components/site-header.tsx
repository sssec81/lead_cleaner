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

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerCta = getHeaderCta(pathname);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-[1.25rem] border border-[var(--lc-border)] bg-white/85 px-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-[var(--lc-accent)]" />
          <span className="text-sm font-medium text-[var(--lc-ink)]">LeadCleanr</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm transition-colors ${
                isActive(item.href)
                  ? "text-[var(--lc-ink)]"
                  : "text-[var(--lc-muted)] hover:text-[var(--lc-ink)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lc-accent-bg)] px-3 py-1 font-mono text-[11px] text-[var(--lc-accent)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Browser-only
          </div>
          <Link
            href={headerCta.href}
            className="btn-primary min-h-10 px-4 py-2 text-sm"
          >
            {headerCta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--lc-border)] bg-white text-[var(--lc-ink)] lg:hidden"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="mx-auto mt-2 max-w-7xl rounded-[1.25rem] border border-[var(--lc-border)] bg-white/95 shadow-sm backdrop-blur-md lg:hidden">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <nav aria-label="Mobile primary" className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm ${
                    isActive(item.href) ? "text-[var(--lc-ink)]" : "text-[var(--lc-muted)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--lc-accent-bg)] px-3 py-1 font-mono text-[11px] text-[var(--lc-accent)]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Browser-only
              </div>
              <Link
                href={headerCta.href}
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full min-h-10 px-4 py-2 text-sm"
              >
                {headerCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function getHeaderCta(pathname: string) {
  if (pathname.startsWith("/tools/validate-email-list")) {
    return { href: "/tools/remove-duplicate-emails", label: "Deduplicate Emails" };
  }

  if (pathname.startsWith("/tools/extract-phone-numbers-from-text")) {
    return { href: "/tools/remove-duplicate-phone-numbers", label: "Deduplicate Numbers" };
  }

  if (pathname.startsWith("/tools/convert-csv-to-json")) {
    return { href: "/tools/csv-lead-cleaner", label: "Clean CSV Free" };
  }

  return { href: "/tools/csv-lead-cleaner", label: "Clean CSV Free" };
}
