"use client";

import Link from "next/link";
import { ArrowRight, Hexagon, Sparkles } from "lucide-react";
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
    <header className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-full border border-white/40 bg-white/60 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:bg-white/80 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          
          {/* Logo / Branding */}
          <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
              <Sparkles className="h-5 w-5 text-white/90" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
                LeadCleanr
              </div>
              <div className="mt-0.5 hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500 sm:flex">
                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Browser-First
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 lg:flex"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-2 text-sm font-bold tracking-wide transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 -bottom-1 mx-auto h-0.5 rounded-full bg-blue-600 transition-all duration-300 ease-out ${
                      active
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions & Badge */}
          <div className="flex items-center gap-4">
            <div className="hidden xl:flex">
              <LocalProcessingBadge compact />
            </div>
            <Link
              href="/tools/csv-lead-cleaner"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-sky-600 hover:-translate-y-0.5"
            >
              <span className="sm:hidden">Open</span>
              <span className="hidden sm:inline">Open App</span>
              <ArrowRight className="h-4 w-4 text-sky-100 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation (Hidden on large screens) */}
        <div className="mt-4 flex flex-col gap-3 lg:hidden">
          <nav
            aria-label="Mobile primary"
            className="grid grid-cols-4 gap-2 text-xs font-semibold text-slate-500"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center justify-center rounded-xl p-2 transition-all ${
                    active
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50/80 px-4 py-3 border border-slate-100">
            <LocalProcessingBadge compact className="shrink-0" />
            <Link
              href="/tools/csv-lead-cleaner"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
            >
              CSV Workflow
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
