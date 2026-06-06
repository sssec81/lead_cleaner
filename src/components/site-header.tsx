"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      <div className="rounded-[1.35rem] border border-white/70 bg-[linear-gradient(180deg,rgba(250,252,255,0.94),rgba(241,246,251,0.84))] px-4 py-3 shadow-[0_16px_42px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[color:rgba(255,255,255,0.72)] bg-[linear-gradient(180deg,#5d98fb,#2563eb)] text-white shadow-[0_14px_26px_rgba(37,99,235,0.18)]">
              <div className="absolute inset-x-1 top-1 h-3 rounded-full bg-white/14 blur-sm" />
              <div className="relative flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/88" />
                  <span className="h-1.5 w-4 rounded-full bg-white/78" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/88" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-2.5 rounded-full bg-white/72" />
                  <span className="h-1.5 w-5 rounded-full bg-white" />
                  <span className="text-[10px] font-bold leading-none text-white">✓</span>
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <div className="font-display text-[1.05rem] font-semibold leading-none tracking-[-0.02em] text-slate-950 sm:text-[1.15rem]">
                LeadCleanr
              </div>
              <div className="mt-1 hidden items-center gap-2 text-[11px] font-medium leading-none text-[color:var(--muted)] sm:flex">
                <span className="inline-flex h-1 w-1 rounded-full bg-[color:rgba(37,99,235,0.55)]" />
                <span className="block truncate tracking-[0.01em]">Browser-first lead cleaning</span>
              </div>
            </div>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 border-x border-[color:rgba(15,23,42,0.08)] px-7 text-sm font-semibold text-[color:var(--muted)] lg:flex"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative inline-flex min-h-11 items-center transition ${
                    active
                      ? "text-[color:#102534]"
                      : "hover:text-[color:#153246]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 rounded-full transition-all ${
                      active
                        ? "w-7 bg-[color:#153246]"
                        : "w-0 bg-[color:rgba(21,50,70,0.36)] group-hover:w-5"
                    }`}
                  />
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
              className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.95rem] bg-[color:#153246] px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(21,50,70,0.16)] transition hover:bg-[color:#102534] hover:shadow-[0_18px_34px_rgba(21,50,70,0.2)] active:scale-95"
            >
              <span className="sm:hidden">Open</span>
              <span className="hidden sm:inline">Open CSV Cleaner</span>
              <ArrowRight className="h-4 w-4" />
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
                  className={`inline-flex min-h-11 items-center justify-center rounded-[0.95rem] border px-4 py-2 transition ${
                    active
                      ? "border-[color:rgba(21,50,70,0.14)] bg-white text-[color:#153246] shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
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
              className="inline-flex min-h-11 items-center gap-2 rounded-[0.95rem] border border-[color:rgba(21,50,70,0.12)] bg-white px-4 text-sm font-semibold text-[color:#153246] transition hover:bg-[color:#f8fafc]"
            >
              Open flagship tool
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
