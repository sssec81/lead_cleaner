import type { Metadata } from "next";
import { ArrowRight, MessageSquare, LifeBuoy, Bug, Briefcase, FileSpreadsheet, AlertCircle, PlayCircle, Code2 } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { getSiteUrl } from "@/lib/seo";

const launchInbox = "leadcleanrapp@gmail.com";

const contactItems = [
 {
 icon: LifeBuoy,
 label: "General Support",
 description: "Questions about a tool, confusing output, or a workflow you want to test before moving a massive file.",
 value: launchInbox,
 cta: "Email Support",
 color: "blue",
 },
 {
 icon: Bug,
 label: "Bug Reports",
 description: "Found a parsing issue, export problem, or route that feels broken on your device.",
 value: launchInbox,
 cta: "Report a Bug",
 color: "emerald",
 },
 {
 icon: Briefcase,
 label: "Business & API",
 description: "Need larger limits, team workflows, or want to shape future paid CRM export features.",
 value: launchInbox,
 cta: "Talk Business",
 color: "slate",
 },
];

const messageTips = [
 {
 icon: PlayCircle,
 text: "The exact tool URL you were using.",
 },
 {
 icon: FileSpreadsheet,
 text: "A safe, redacted sample of what you pasted or uploaded.",
 },
 {
 icon: Code2,
 text: "What you expected to happen vs what actually happened.",
 },
 {
 icon: AlertCircle,
 text: "The exact moment the workflow stopped feeling believable.",
 },
];

export const metadata: Metadata = {
 title: "Contact",
 description: "Get in touch with LeadCleanr support, report bugs, or request custom API access and business limits.",
 alternates: { canonical: `${getSiteUrl()}/contact` },
};

export default function ContactPage() {
 return (
 <PageFrame>
  {/* Hero Section */}
  <section className="pb-10 pt-16 lg:pb-12 lg:pt-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
  <div className="mx-auto max-w-4xl text-center">
  <div className="mb-7 section-eyebrow inline-flex items-center gap-2">
  <MessageSquare className="h-4 w-4" />
  <span>Direct Access</span>
  </div>
  <h1 className="mx-auto mb-7 max-w-3xl font-display text-4xl font-bold leading-[1.03] tracking-[-0.045em] text-[var(--lc-ink)] sm:text-6xl">
  Talk to a human, not a maze.
  </h1>
  <p className="mx-auto max-w-3xl text-lg leading-8 text-[var(--lc-muted)] sm:text-xl">
  Reach out when the workflow gets weird, not only when it breaks. The most useful note is the one that shows the exact moment the result stopped feeling correct.
  </p>
  </div>
  </div>
  </section>

  {/* Best Practices Section */}
  <section className="relative z-10 pb-16 lg:pb-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
  
  {/* Context Card */}
  <div className="relative flex flex-col justify-center overflow-hidden rounded-xl surface-card p-8 sm:p-10">
  <div className="relative">
  <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--lc-ink)] mb-4">
  A short, concrete message beats a long one.
  </h2>
  <p className="text-base leading-relaxed text-[var(--lc-muted)]">
  You don&apos;t need to send your actual lead list. Providing clear context on the problem with a sanitized dummy spreadsheet saves everyone time and keeps your data secure.
  </p>
  </div>
  </div>

  {/* Checklist Grid */}
  <div className="relative overflow-hidden rounded-xl surface-card p-8 sm:p-10">
  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--lc-ink)] mb-8">What to include</h3>
  <div className="grid gap-4 sm:grid-cols-2">
  {messageTips.map((tip) => {
  const Icon = tip.icon;
  return (
  <div key={tip.text} className="flex flex-col gap-3 rounded-lg border border-[var(--lc-border)] bg-[var(--lc-bg)] p-5">
  <Icon className="h-5 w-5 text-[var(--lc-accent)]" />
  <p className="text-sm leading-relaxed text-[var(--lc-ink)] font-medium">{tip.text}</p>
  </div>
  );
  })}
  </div>
  </div>

  </div>
  </div>
  </section>

  {/* Dark Mode Inboxes Section */}
  <section className="relative overflow-hidden bg-[var(--lc-dark-bg)] py-16 sm:py-20">
  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mx-auto mb-10 max-w-3xl text-center">
  <h2 className="mb-6 font-display text-4xl font-semibold tracking-tight text-[var(--lc-surface)] sm:text-5xl">
  Direct inboxes
  </h2>
  <p className="text-lg leading-8 text-[#e4e4e1]">
  A small product deserves a direct human contact path. Choose the best inbox for your request below.
  </p>
  </div>

  <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
  {contactItems.map((item) => {
  const Icon = item.icon;
  return (
  <div 
  key={item.label}
  className="relative overflow-hidden border border-white/15 bg-white/[0.04] p-8"
  >
  <div className="relative">
  <div className="mb-6 flex h-12 w-12 items-center justify-center border border-white/20 text-[var(--lc-surface)]">
  <Icon className="h-6 w-6" />
  </div>
  
  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--lc-surface)] mb-3">{item.label}</h3>
  <p className="text-sm leading-relaxed text-[#e4e4e1] mb-6 h-20">
  {item.description}
  </p>
  
  <div className="mb-6 rounded-xl bg-black/40 px-4 py-3 font-mono text-sm text-[#e4e4e1] border border-white/10">
  <span className="block truncate">{item.value}</span>
  </div>

  <a
  href={`mailto:${item.value}`}
  className="lc-button-primary w-full min-h-12 text-sm font-semibold"
  >
  {item.cta}
  <ArrowRight className="h-4 w-4" />
  </a>
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
