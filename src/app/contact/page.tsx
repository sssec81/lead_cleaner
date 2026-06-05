import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";

const contactItems = [
  {
    label: "Support",
    description:
      "Questions about a tool, confusing output, or a workflow you want to test.",
    value: "support@leadcleanr.com",
  },
  {
    label: "Bug reports",
    description:
      "Found a parsing issue, export problem, or route that feels broken on your device.",
    value: "bugs@leadcleanr.com",
  },
  {
    label: "Business and API interest",
    description:
      "Need larger limits, team workflows, or want to shape future paid features.",
    value: "hello@leadcleanr.com",
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
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 rounded-[2.25rem] border border-[color:rgba(16,37,52,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,247,250,0.82))] p-6 shadow-[var(--shadow)] lg:grid-cols-[0.9fr_0.08fr_1fr] lg:items-start lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Contact
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[0.96] sm:text-[3.3rem] lg:text-[4.1rem]">
              Reach out when the workflow gets weird, not only when it breaks.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
              The most useful note is the one that shows the exact moment the
              result stopped feeling believable.
            </p>
          </div>
          <div className="hidden h-full w-px bg-[color:rgba(16,37,52,0.12)] lg:block" />
          <div className="max-w-3xl space-y-5 text-base leading-8 text-[color:var(--muted)]">
            <p>
              This product is still small on purpose. If a tool feels
              confusing, a result looks wrong, or you have a heavier use case
              that should shape what gets built next, send a note.
            </p>
            <div className="rounded-[1.5rem] border border-[color:rgba(16,37,52,0.08)] bg-white/70 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                Best message format
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">
                Show the tool, the expectation, and the exact point where the
                workflow started to feel off.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.64fr_1.36fr]">
          <div className="rounded-[1.9rem] border border-[color:rgba(16,37,52,0.1)] bg-white/72 p-6 shadow-[var(--shadow)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              What to include
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              A short, concrete message beats a long one. Redacted samples are
              enough.
            </p>
          </div>
          <div className="rounded-[1.9rem] border border-[color:rgba(16,37,52,0.1)] bg-white/72 p-6 shadow-[var(--shadow)]">
            <div className="space-y-4">
            {messageTips.map((tip) => (
              <p
                key={tip}
                className="border-t border-[color:rgba(16,37,52,0.1)] pt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base"
              >
                {tip}
              </p>
            ))}
            </div>
          </div>
        </section>
      </section>

      <section className="bg-[color:#153246] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:#d8a15d]">
                Direct inboxes
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                A small product deserves a human contact path, not a help-center
                maze.
              </h2>
            </div>
            <div className="space-y-6">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="border-t border-[color:rgba(255,255,255,0.14)] pt-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:#d8a15d]">
                    {item.label}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:rgba(255,255,255,0.78)] sm:text-base">
                    {item.description}
                  </p>
                  <a
                    href={`mailto:${item.value}`}
                    className="mt-3 inline-flex text-sm font-semibold text-white"
                  >
                    {item.value}
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
