import type { Metadata } from "next";
import { ArrowRight, MessageSquare, LifeBuoy, Bug, Briefcase, FileSpreadsheet, AlertCircle, PlayCircle, Code2 } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { getSiteUrl } from "@/lib/seo";

const launchInbox = "hello@leadcleanr.xyz";

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
 title: "Contact Us — LeadCleanr",
 description: "Get in touch with LeadCleanr support, report bugs, or request custom API access and business limits.",
 alternates: { canonical: `${getSiteUrl()}/contact` },
};

export default function ContactPage() {
 return (
 <PageFrame>
  {/* Hero Section */}
  <section className="pt-24 pb-20 lg:pt-36 lg:pb-32">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
  <div className="mx-auto max-w-3xl text-center">
  <div className="mb-8 section-eyebrow inline-flex items-center gap-2">
  <MessageSquare className="h-4 w-4" />
  <span>Direct Access</span>
  </div>
  <h1 className="mb-8 font-display text-5xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-7xl">
  Talk to a human, not a maze.
  </h1>
  <p className="text-lg leading-8 text-[var(--lc-muted)] sm:text-xl">
  Reach out when the workflow gets weird, not only when it breaks. The most useful note is the one that shows the exact moment the result stopped feeling correct.
  </p>
  </div>
  </div>
  </section>

  {/* Best Practices Section */}
  <section className="relative z-10 pb-24 lg:pb-32">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
  
  {/* Context Card */}
  <div className="group relative overflow-hidden surface-card rounded-[1.25rem] p-8 transition-all duration-300 hover:-translate-y-1 sm:p-10 flex flex-col justify-center">
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
  <div className="group relative overflow-hidden surface-card rounded-[1.25rem] p-8 transition-all duration-300 hover:-translate-y-1 sm:p-10">
  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--lc-ink)] mb-8">What to include</h3>
  <div className="grid gap-4 sm:grid-cols-2">
  {messageTips.map((tip) => {
  const Icon = tip.icon;
  return (
  <div key={tip.text} className="flex flex-col gap-3 rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] p-5 transition-colors group-hover:border-[var(--lc-border-mid)]">
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
  <section className="relative overflow-hidden bg-[var(--lc-dark-bg)] py-24 sm:py-32">
  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-3xl text-center mb-16">
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
  className="group relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-[var(--shadow-strong)]"
  >
  <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-500 group-hover:scale-125 group-hover:opacity-20">
  <Icon className="h-24 w-24 text-[var(--lc-surface)]" />
  </div>
  
  <div className="relative">
  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-[var(--lc-surface)] backdrop-blur-md border border-white/10">
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
