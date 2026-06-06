import type { Metadata } from "next";
import { ArrowRight, MessageSquare, LifeBuoy, Bug, Briefcase, FileSpreadsheet, AlertCircle, PlayCircle, Code2, Copy } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const contactItems = [
  {
    icon: LifeBuoy,
    label: "General Support",
    description: "Questions about a tool, confusing output, or a workflow you want to test before moving a massive file.",
    value: "support@leadcleanr.com",
    cta: "Email Support",
    color: "blue",
  },
  {
    icon: Bug,
    label: "Bug Reports",
    description: "Found a parsing issue, export problem, or route that feels broken on your device.",
    value: "bugs@leadcleanr.com",
    cta: "Report a Bug",
    color: "emerald",
  },
  {
    icon: Briefcase,
    label: "Business & API",
    description: "Need larger limits, team workflows, or want to shape future paid CRM export features.",
    value: "hello@leadcleanr.com",
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
  alternates: { canonical: "https://leadcleanr.com/contact" },
};

export default function ContactPage() {
  return (
    <PageFrame>
      {/* Hero Section with Radiant Gradients */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-36 lg:pb-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,white,var(--background))]"></div>
        <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-[120px]"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm">
              <MessageSquare className="h-4 w-4" />
              <span>Direct Access</span>
            </div>
            <h1 className="mb-8 bg-[linear-gradient(to_right,theme(colors.slate.900),theme(colors.slate.600))] bg-clip-text font-display text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
              Talk to a human, not a maze.
            </h1>
            <p className="text-lg leading-8 text-slate-600 sm:text-xl">
              Reach out when the workflow gets weird, not only when it breaks. The most useful note is the one that shows the exact moment the result stopped feeling correct.
            </p>
          </div>
        </div>
      </section>

      {/* Best Practices Section (Glassmorphism) */}
      <section className="relative z-10 pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            
            {/* Context Card */}
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white/70 p-8 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-blue-200 hover:bg-white sm:p-10 flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 mb-4">
                  A short, concrete message beats a long one.
                </h2>
                <p className="text-base leading-relaxed text-slate-600">
                  You don&apos;t need to send your actual lead list. Providing clear context on the problem with a sanitized dummy spreadsheet saves everyone time and keeps your data secure.
                </p>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white/70 p-8 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-slate-300 hover:bg-white sm:p-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-8">What to include</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {messageTips.map((tip) => {
                  const Icon = tip.icon;
                  return (
                    <div key={tip.text} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-colors hover:bg-blue-50/50 hover:border-blue-100">
                      <Icon className="h-5 w-5 text-blue-500" />
                      <p className="text-sm leading-relaxed text-slate-700 font-medium">{tip.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dark Mode Inboxes Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.1),transparent_50%)]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Direct inboxes
            </h2>
            <p className="text-lg leading-8 text-slate-400">
              A small product deserves a direct human contact path, not an endless AI chatbot loop. Choose the best inbox for your request below.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.label}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-500 group-hover:scale-125 group-hover:opacity-20">
                    <Icon className="h-24 w-24 text-white" />
                  </div>
                  
                  <div className="relative">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <h3 className="text-sm font-bold uppercase tracking-widest text-sky-400 mb-3">{item.label}</h3>
                    <p className="text-sm leading-relaxed text-slate-300 mb-6 h-20">
                      {item.description}
                    </p>
                    
                    <div className="mb-6 rounded-xl bg-black/40 px-4 py-3 font-mono text-sm text-slate-300 border border-white/5 flex items-center justify-between">
                      <span className="truncate">{item.value}</span>
                      <Copy className="h-4 w-4 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                    </div>

                    <a
                      href={`mailto:${item.value}`}
                      className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-white/10 px-6 text-sm font-semibold text-white transition-all hover:bg-sky-500 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]"
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
