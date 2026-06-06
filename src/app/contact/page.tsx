import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import { PageFrame } from "@/components/page-frame";
import { PageHero } from "@/components/page-hero";
import { PageSectionHeading } from "@/components/page-section-heading";

const contactItems = [
  {
    label: "Support",
    description:
      "Questions about a tool, confusing output, or a workflow you want to test.",
    value: "support@leadcleanr.com",
    cta: "Email support",
  },
  {
    label: "Bug reports",
    description:
      "Found a parsing issue, export problem, or route that feels broken on your device.",
    value: "bugs@leadcleanr.com",
    cta: "Report a bug",
  },
  {
    label: "Business and API interest",
    description:
      "Need larger limits, team workflows, or want to shape future paid features.",
    value: "hello@leadcleanr.com",
    cta: "Talk about larger use",
  },
];

const messageTips = [
  "The tool URL you were using.",
  "A safe redacted sample of what you pasted or uploaded.",
  "What you expected to happen.",
  "What happened instead.",
];

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact LeadCleanr for support, bugs, or feature requests.",
};

export default function ContactPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Contact"
        title="Reach out when the workflow gets weird, not only when it breaks."
        intro="The most useful note is the one that shows the exact moment the result stopped feeling believable."
        aside={(
          <div className="panel-strong rounded-[1.75rem] p-6 sm:p-8">
            <p className="text-base leading-8 text-[color:var(--muted)]">
              This product is still small on purpose. If a tool feels confusing, a result looks wrong, or you have a heavier use case that should shape what gets built next, send a note.
            </p>
            <div className="mt-5 rounded-[1.5rem] border border-[color:rgba(16,37,52,0.08)] bg-white/70 p-5">
              <p className="section-eyebrow">Best message format</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">
                Show the tool, the expectation, and the exact point where the workflow started to feel off.
              </p>
            </div>
          </div>
        )}
        className="pt-10 lg:pt-12"
      />

      <section className="page-section">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.5rem] border border-[color:rgba(16,37,52,0.1)] bg-white/72 p-6 shadow-[var(--shadow)] sm:p-8 flex flex-col justify-center">
            <PageSectionHeading
              eyebrow="What to include"
              title="A short, concrete message beats a long one."
            />
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Sanitized or redacted profiles/spreadsheets are enough. Providing clear context on the problem saves everyone time.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[color:rgba(16,37,52,0.1)] bg-white/72 p-6 shadow-[var(--shadow)] sm:p-8">
            <PageSectionHeading
              eyebrow="Suggested details"
              title="The details below usually shorten the back-and-forth."
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {messageTips.map((tip, index) => (
                <div
                  key={tip}
                  className="flex items-start gap-3 rounded-2xl border border-[color:var(--line)] bg-white/60 p-4 transition duration-200 hover:bg-white/90 hover:shadow-xs"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:rgba(37,99,235,0.08)] text-xs font-bold text-[color:var(--brand)]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-[color:var(--foreground)]">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[color:#153246] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:#93c5fd]">
                Direct inboxes
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                A small product deserves a human contact path, not a help-center
                maze.
              </h2>
            </div>
            <div className="grid gap-5">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.25rem] border border-[color:rgba(255,255,255,0.12)] bg-[color:rgba(255,255,255,0.035)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:rgba(255,255,255,0.2)] hover:bg-[color:rgba(255,255,255,0.06)]"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:#93c5fd]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:rgba(255,255,255,0.76)]">
                    {item.description}
                  </p>
                  <p className="mt-4 break-all font-mono text-sm text-white">
                    {item.value}
                  </p>
                  <a
                    href={`mailto:${item.value}`}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[0.9rem] border border-[color:rgba(147,197,253,0.24)] bg-[color:rgba(255,255,255,0.06)] px-4 text-sm font-semibold text-white transition hover:border-[color:rgba(147,197,253,0.36)] hover:bg-[color:rgba(255,255,255,0.1)] active:scale-95"
                    aria-label={`Email ${item.label} at ${item.value}`}
                  >
                    <span
                      className="text-white"
                      style={{ WebkitTextFillColor: "#ffffff" }}
                    >
                      {item.cta}
                    </span>
                    <ArrowRight className="h-4 w-4 text-white" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
