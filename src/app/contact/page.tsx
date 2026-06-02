import type { Metadata } from "next";
import { Bug, Headset, Mail, Rocket } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const contactItems = [
  {
    title: "Support",
    text: "Questions about a tool, confusing output, or a workflow you want to test.",
    value: "support@leadcleanr.com",
    icon: Headset,
  },
  {
    title: "Bug reports",
    text: "Found a parsing issue, export bug, or route that feels broken on your device.",
    value: "bugs@leadcleanr.com",
    icon: Bug,
  },
  {
    title: "Business and API interest",
    text: "Need larger limits, team workflows, or want to shape future paid features.",
    value: "hello@leadcleanr.com",
    icon: Rocket,
  },
];

const messageTips = [
  "The tool URL you were using",
  "A safe redacted sample of what you pasted or uploaded",
  "What you expected to happen",
  "What happened instead",
];

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact LeadCleanr for support, bugs, or feature requests.",
};

export default function ContactPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 xl:grid-cols-[0.94fr_1.06fr] xl:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Contact
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Reach out for support, bugs, or roadmap questions
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
              The MVP keeps communication simple. If you have a workflow
              question, found a bug, or want to talk about heavier use cases,
              use one of the contacts below.
            </p>

            <div className="mt-8 rounded-[2rem] border border-[color:rgba(15,118,110,0.14)] bg-[color:rgba(15,118,110,0.08)] p-6 shadow-[var(--shadow)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-[color:var(--accent)]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Best info to include in a message
                  </h2>
                  <div className="mt-4 grid gap-3">
                    {messageTips.map((tip) => (
                      <div
                        key={tip}
                        className="rounded-[1.2rem] border border-[color:rgba(15,118,110,0.14)] bg-white/80 px-4 py-3 text-sm font-medium text-[color:var(--foreground)]"
                      >
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
            {contactItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`rounded-[2rem] border p-6 shadow-[var(--shadow)] ${
                    index === 0
                      ? "border-[color:rgba(217,119,6,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,238,0.92))]"
                      : "border-[color:var(--line)] bg-white/76"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.12)] text-[color:var(--brand-strong)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-semibold">
                        {item.title}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                        {item.text}
                      </p>
                      <a
                        href={`mailto:${item.value}`}
                        className="mt-5 inline-flex text-sm font-semibold text-[color:var(--brand-strong)]"
                      >
                        {item.value}
                      </a>
                    </div>
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
