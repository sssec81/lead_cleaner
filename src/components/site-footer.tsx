"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, MessageCircle, Mail, Shield, Lock } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
 { href: "/tools", label: "All Tools" },
 { href: "/pricing", label: "Pricing & Limits" },
 { href: "/privacy", label: "Privacy Policy" },
 { href: "/terms", label: "Terms of Service" },
 { href: "/contact", label: "Contact Us" },
];

function getFooterContent(pathname: string) {
 if (pathname === "/terms" || pathname === "/privacy") {
 return {
 title: "Need to keep moving after checking the rules?",
 ctaHref: "/tools",
 ctaLabel: "Return to tools",
 ctaIntro: "Browse the free browser-based cleanup tools.",
 ctaHeading: "Back to the product?",
 };
 }

 if (pathname === "/tools/validate-email-list") {
 return {
 title: "Validate email lists before outreach, CRM import, or campaign launch.",
 ctaHref: "/tools/validate-email-list",
 ctaLabel: "Validate Emails Free",
 ctaIntro: "No account required for fast syntax checks.",
 ctaHeading: "Ready to validate a list?",
 };
 }

 if (pathname === "/tools/convert-csv-to-json") {
 return {
 title: "Convert CSV files to clean JSON in your browser.",
 ctaHref: "/tools/convert-csv-to-json",
 ctaLabel: "Convert CSV to JSON",
 ctaIntro: "No account required. Free forever.",
 ctaHeading: "Ready to convert a file?",
 };
 }

 if (pathname === "/tools/extract-phone-numbers-from-text") {
 return {
 title: "Extract clean phone numbers from messy text in your browser.",
 ctaHref: "/tools/extract-phone-numbers-from-text",
 ctaLabel: "Extract Numbers Free",
 ctaIntro: "No account required for text-based phone extraction.",
 ctaHeading: "Ready to extract numbers?",
 };
 }

 return {
 title: "Clean messy lead CSVs before they break your CRM import.",
 ctaHref: "/tools/csv-lead-cleaner",
 ctaLabel: "Clean CSV Free",
 ctaIntro: "No account required for the MVP.",
 ctaHeading: "Ready to clean a file?",
 };
}

export function SiteFooter() {
 const pathname = usePathname();
 const footer = getFooterContent(pathname);

 return (
 <footer className="relative mt-20 overflow-hidden bg-slate-950 pt-20 pb-10 text-white">
 {/* Background Gradients */}
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.16),transparent_40%),radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.18),transparent_52%)]"></div>
 <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:34px_34px]"></div>
 <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

 <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="grid gap-12 lg:grid-cols-[1.3fr_0.95fr] lg:items-center">
 
 {/* Brand & Value Prop */}
 <div>
 <div className="flex items-center gap-2 mb-6">
 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#1d4ed8,#0f766e)] shadow-[0_12px_28px_rgba(29,78,216,0.3)]">
 <Sparkles className="h-4 w-4 text-white" />
 </div>
 <p className="font-display text-xl font-bold tracking-tight">LeadCleanr</p>
 </div>
 <h2 className="mb-4 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.5rem]">
 {footer.title}
 </h2>
 <p className="max-w-xl text-lg text-slate-400">
 Raw pasted text and uploaded CSV files are not sent to our servers for processing. Keep your data locally secured.
 </p>
 </div>

 {/* Quick CTA */}
 <div className="lg:justify-self-end w-full max-w-sm rounded-[1.75rem] border border-white/12 bg-white/6 p-8 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-md">
 <h3 className="text-lg font-semibold mb-2">{footer.ctaHeading}</h3>
 <p className="text-sm text-slate-400 mb-6">{footer.ctaIntro}</p>
 <Link
 href={footer.ctaHref}
 className="btn-primary group flex w-full min-h-12 rounded-xl px-6 text-sm font-semibold"
 >
 {footer.ctaLabel}
 <ArrowRight className="h-4 w-4 text-blue-100 transition-transform group-hover:translate-x-1 group-hover:text-white" />
 </Link>
 </div>
 </div>

 {/* Feature Strip + Security Badge */}
 <div className="mt-16 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
 <div className="grid gap-6 sm:grid-cols-3">
 <div className="flex items-start gap-3">
 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
 <Shield className="h-4 w-4" />
 </div>
 <div>
 <p className="text-sm font-semibold text-white">Browser-first processing</p>
 <p className="mt-0.5 text-xs text-slate-400">CSV files are parsed and cleaned locally in your browser.</p>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
 <Lock className="h-4 w-4" />
 </div>
 <div>
 <p className="text-sm font-semibold text-white">No signup required</p>
 <p className="mt-0.5 text-xs text-slate-400">Start cleaning immediately. No account, no credit card.</p>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
 <ArrowRight className="h-4 w-4" />
 </div>
 <div>
 <p className="text-sm font-semibold text-white">Export to any CRM</p>
 <p className="mt-0.5 text-xs text-slate-400">Clean CSV works with HubSpot, Apollo, Clay, and more.</p>
 </div>
 </div>
 </div>
 </div>

 {/* Bottom Bar: Links & Legal */}
 <div className="mt-20 border-t border-white/10 pt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
 
 <div className="flex flex-wrap gap-x-8 gap-y-4">
 {links.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
 >
 {link.label}
 </Link>
 ))}
 </div>

 <div className="flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center">
 <div className="flex items-center gap-4">
 <span className="inline-flex items-center gap-1.5 text-slate-500">
 <MessageCircle className="h-4 w-4" />
 <span className="text-xs font-medium">Community soon</span>
 </span>
 <a href="/contact" className="hover:text-white transition-colors" aria-label="Email">
 <Mail className="h-4 w-4" />
 </a>
 </div>
 <span className="hidden md:inline text-white/20">|</span>
 <p>Built for the modern sales ops workflow.</p>
 </div>
 </div>
 </div>
 </footer>
 );
}
