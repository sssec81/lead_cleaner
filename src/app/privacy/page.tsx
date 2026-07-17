import type { Metadata } from "next";
import { Shield, Lock, HardDrive, EyeOff, ServerOff, Database } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { getSiteUrl } from "@/lib/seo";

const snapshot = [
 {
 icon: ServerOff,
 label: "Zero Server Processing",
 text: "Your core cleanup runs entirely in your browser. No data leaves your machine during the MVP flow.",
 },
 {
 icon: Database,
 label: "No Raw Data Stored",
 text: "Pasted text and uploaded CSV contents are never stored on our backend databases.",
 },
 {
 icon: HardDrive,
 label: "Local Persistence",
 text: "Workspace persistence safely keeps your current text and results in your local browser storage.",
 },
 {
 icon: EyeOff,
 label: "No Account Needed",
 text: "Start cleaning immediately without handing over your email or creating an account.",
 },
];

const sections = [
 {
 icon: Shield,
 title: "What we process",
 text: "LeadCleanr handles text you paste and CSV files you choose to upload so the selected tool can clean, extract, deduplicate, or format the data. Everything happens where you can see it.",
 },
 {
 icon: Lock,
 title: "What stays local",
 text: "For the MVP, the core cleanup and extraction flow runs purely in your browser's memory. That keeps the raw working data securely on your device during normal use.",
 },
 {
 icon: HardDrive,
 title: "What can persist",
 text: "If you use workspace persistence, current text and results can live in local browser storage on your device until you clear them.",
 },
 {
 icon: ServerOff,
 title: "What can still transmit",
 text: "If analytics or client-error reporting are enabled, they should stay focused on workflow events and sanitized error details rather than raw lead or contact contents.",
 },
 {
 icon: EyeOff,
 title: "Acceptable use",
 text: "LeadCleanr is for cleaning data you own or have permission to process. Do not use it for spam, scraping abuse, or unsolicited outreach.",
 },
];

export const metadata: Metadata = {
  title: "Privacy Policy — LeadCleanr",
  description: "LeadCleanr privacy policy. Your raw CSV and pasted text stay in your browser during normal cleanup operations.",
  alternates: { canonical: `${getSiteUrl()}/privacy` },
};

export default function PrivacyPage() {
 return (
 <PageFrame>
  {/* Hero Section */}
  <section className="pb-20 pt-16 lg:pb-24 lg:pt-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
  <div className="mx-auto max-w-3xl text-center">
  <div className="mb-8 section-eyebrow inline-flex items-center gap-2">
  <Shield className="h-4 w-4" />
  <span>Trust Boundary</span>
  </div>
  <h1 className="mb-8 font-display text-5xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-7xl">
  Your data never leaves your screen.
  </h1>
  <p className="text-lg leading-8 text-[var(--lc-muted)] sm:text-xl">
  This page answers one question quickly: what happens to your raw data while you use LeadCleanr? The short version: <strong>The cleanup flow runs locally in your browser.</strong>
  </p>
  </div>

  {/* Floating Glassmorphic Cards */}
  <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
  {snapshot.map((item) => {
  const Icon = item.icon;
  return (
  <div 
  key={item.label}
  className="group relative overflow-hidden surface-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--lc-border-mid)]"
  >
  <div className="relative">
  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] text-[var(--lc-accent)] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 group-hover:bg-[var(--lc-accent-bg)]">
  <Icon className="h-6 w-6" />
  </div>
  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--lc-ink)]">{item.label}</h3>
  <p className="text-sm leading-relaxed text-[var(--lc-muted)]">{item.text}</p>
  </div>
  </div>
  );
  })}
  </div>
  </div>
  </section>

  {/* Dark Mode "The Boundary" Section */}
  <section className="relative overflow-hidden bg-[var(--lc-dark-bg)] py-16 sm:py-20">
  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
  <div>
  <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[var(--lc-surface)]">The Boundary</p>
  <h2 className="mb-6 font-display text-4xl font-semibold tracking-tight text-[var(--lc-surface)] sm:text-5xl">
  Local cleanup has a clear, physical edge.
  </h2>
  <p className="text-lg leading-8 text-[#e4e4e1]">
  The cleanup work stays on your device. Product telemetry and browser storage are separate behaviors, named plainly. We don&apos;t hide behind legal fog.
  </p>
  </div>
  <div className="grid gap-8">
  <BoundaryCard 
  number="01"
  title="Cleanup Operations" 
  text="Text extraction, CSV parsing, preview generation, and final export file creation happen entirely in your browser's local memory." 
  />
  <BoundaryCard 
  number="02"
  title="Browser State" 
  text="Saved workspaces and tool preferences can live in local storage on your specific device, meaning we can't see them." 
  />
  <BoundaryCard 
  number="03"
  title="Telemetry" 
  text="Anonymous analytics or sanitized error reporting are treated as separate product behavior, completely isolated from raw file contents." 
  />
  </div>
  </div>
  </div>
  </section>

  {/* Modern Accordion/List Section */}
  <section className="py-16 sm:py-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mx-auto mb-10 max-w-3xl text-center">
  <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
  Privacy details, without the jargon.
  </h2>
  <p className="text-lg text-[var(--lc-muted)]">
  Short answers for the checks people make before uploading a lead file.
  </p>
  </div>

  <div className="mx-auto max-w-4xl space-y-6">
  {sections.map((section) => {
  const Icon = section.icon;
  return (
  <div 
  key={section.title}
  className="group flex flex-col gap-6 rounded-[1.25rem] surface-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--lc-border-mid)] sm:flex-row"
  >
  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] text-[var(--lc-accent)] transition-colors duration-300 group-hover:bg-[var(--lc-accent-bg)]">
  <Icon className="h-6 w-6" />
  </div>
  <div>
  <h3 className="mb-3 font-display text-2xl font-semibold text-[var(--lc-ink)]">
  {section.title}
  </h3>
  <p className="text-base leading-relaxed text-[var(--lc-muted)]">
  {section.text}
  </p>
  </div>
  </div>
  );
  })}
  </div>
  </div>
  </section>
 </PageFrame>
 );
}

function BoundaryCard({ number, title, text }: { number: string; title: string; text: string }) {
 return (
 <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10">
 <div className="absolute -right-10 -top-10 text-9xl font-black text-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-white/10">
 {number}
 </div>
 <div className="relative">
 <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
 <p className="text-base leading-relaxed text-slate-500">{text}</p>
 </div>
 </div>
 );
}
