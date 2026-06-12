"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import { LocalProcessingBadge } from "@/components/local-processing-badge";

const navItems = [
 { href: "/tools", label: "Tools" },
 { href: "/privacy", label: "Privacy" },
 { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
 const pathname = usePathname();
 const headerCta = getHeaderCta(pathname);

 function isActive(href: string) {
 if (href === "/") {
 return pathname === "/";
 }
 return pathname === href || pathname.startsWith(`${href}/`);
 }

 return (
 <header className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="rounded-[2rem] border border-white/50 bg-white/30 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:bg-white/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:px-6">
 <div className="flex items-center justify-between gap-5">
 
 {/* Logo / Branding */}
 <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-3">
 <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#1d4ed8,#0f766e)] text-white shadow-[0_14px_32px_rgba(29,78,216,0.28)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.45),transparent_52%)]"></div>
 <Sparkles className="h-5 w-5 text-white/90" />
 </div>
 <div className="min-w-0">
 <div className="font-display text-lg font-bold tracking-tight text-[color:var(--foreground)] transition-colors group-hover:text-blue-700">
 LeadCleanr
 </div>
 <div className="mt-0.5 hidden items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 sm:flex">
 <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
 Private Lead Workflow
 </div>
 </div>
 </Link>

 {/* Desktop Navigation */}
 <nav
 aria-label="Primary"
 className="hidden items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-2 py-1.5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] lg:flex"
 >
 {navItems.map((item) => {
 const active = isActive(item.href);

 return (
 <Link
 key={item.href}
 href={item.href}
 aria-current={active ? "page" : undefined}
 className={`group relative rounded-full px-4 py-2 text-sm font-bold tracking-wide transition-colors ${
 active
 ? "bg-white/80 text-blue-700 shadow-sm"
 : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
 }`}
 >
 {item.label}
 <span
 className={`absolute inset-x-4 -bottom-0.5 mx-auto h-0.5 rounded-full bg-blue-600 transition-all duration-300 ease-out ${
 active
 ? "w-0 opacity-0"
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
 href={headerCta.href}
 className="btn-primary group min-h-11 rounded-full px-6 text-sm font-semibold"
 >
 <span className="sm:hidden">{headerCta.compactLabel}</span>
 <span className="hidden sm:inline">{headerCta.label}</span>
 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
 </Link>
 </div>
 </div>

 {/* Mobile Navigation (Hidden on large screens) */}
 <div className="mt-4 flex flex-col gap-3 lg:hidden">
 <nav
 aria-label="Mobile primary"
 className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-500"
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
 ? "bg-blue-50 text-blue-700 shadow-sm"
 : "bg-white/45 hover:bg-white hover:text-slate-900"
 }`}
 >
 {item.label}
 </Link>
 );
 })}
 </nav>

 <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/30 bg-white/20 px-4 py-3 shadow-sm backdrop-blur-md">
 <LocalProcessingBadge compact className="shrink-0" />
 <Link
 href={headerCta.href}
 className="btn-primary min-h-10 rounded-xl px-4 text-xs font-bold"
 >
 {headerCta.mobileLabel}
 <ArrowRight className="h-3 w-3" />
 </Link>
 </div>
 </div>
 </div>
 </header>
 );
}

function getHeaderCta(pathname: string) {
 if (pathname === "/tools/validate-email-list") {
 return {
 href: "/tools/validate-email-list",
 label: "Validate Emails Free",
 mobileLabel: "Validate Emails",
 compactLabel: "Validate",
 };
 }

 if (pathname === "/tools/extract-phone-numbers-from-text") {
 return {
 href: "/tools/extract-phone-numbers-from-text",
 label: "Extract Numbers Free",
 mobileLabel: "Extract Numbers",
 compactLabel: "Extract",
 };
 }

 return {
 href: "/tools/csv-lead-cleaner",
 label: "Clean CSV Free",
 mobileLabel: "CSV Workflow",
 compactLabel: "Clean",
 };
}
