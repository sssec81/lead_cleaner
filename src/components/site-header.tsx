"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import { LocalProcessingBadge } from "@/components/local-processing-badge";

const navItems = [
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-4 z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/65 bg-[linear-gradient(180deg,rgba(248,250,253,0.92),rgba(241,245,251,0.78))] px-4 py-3 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#2563eb,#1d4ed8)] text-[13px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(37,99,235,0.24)]">
              LC
            </div>
            <div>
              <div className="font-display text-lg font-semibold leading-none text-slate-900">
                LeadCleanr
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-[color:var(--muted)] leading-none">
                <span>Browser-first lead cleaning</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
                <span className="hidden sm:inline">CSV-first workflow</span>
              </div>
            </div>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 rounded-full border border-[color:rgba(15,23,42,0.06)] bg-white/72 p-1.5 text-sm font-medium text-[color:var(--muted)] lg:flex"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full px-4 transition ${
                    active
                      ? "bg-[color:rgba(21,50,70,0.08)] text-[color:#153246] ring-1 ring-[color:rgba(21,50,70,0.08)]"
                      : "hover:bg-white hover:text-[color:#153246]"
                  }`}
                >
                  <span className="relative">
                    {item.label}
                    {active ? (
                      <span className="absolute inset-x-0 -bottom-1.5 mx-auto h-0.5 w-5 rounded-full bg-[color:#153246]" />
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden xl:flex">
              <LocalProcessingBadge compact />
            </div>
            <Link
              href="/tools/csv-lead-cleaner"
              className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:#153246] px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(21,50,70,0.18)] transition hover:bg-[color:#102534] hover:shadow-[0_18px_34px_rgba(21,50,70,0.2)] active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span className="sm:hidden">Open</span>
              <span className="hidden sm:inline">Open CSV Cleaner</span>
            </Link>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 lg:hidden">
          <nav
            aria-label="Mobile primary"
            className="grid grid-cols-2 gap-2 text-sm font-semibold text-[color:var(--muted)]"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center justify-center rounded-2xl border px-4 py-2 transition ${
                    active
                      ? "border-[color:rgba(21,50,70,0.12)] bg-[color:rgba(21,50,70,0.08)] text-[color:#153246]"
                      : "border-[color:var(--line)] bg-white/72 hover:border-[color:rgba(37,99,235,0.16)] hover:bg-white hover:text-[color:var(--brand)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-[color:rgba(15,23,42,0.06)] bg-white/58 px-3 py-3">
            <LocalProcessingBadge compact className="shrink-0" />
            <Link
              href="/tools/csv-lead-cleaner"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:rgba(21,50,70,0.12)] bg-white px-4 text-sm font-semibold text-[color:#153246] transition hover:bg-[color:#f8fafc]"
            >
              Open flagship tool
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
