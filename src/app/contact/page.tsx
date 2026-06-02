import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";

const contactItems = [
  {
    title: "Support",
    text: "Questions about a tool, confusing output, or a workflow you want to test.",
    value: "support@leadcleanr.com",
  },
  {
    title: "Bug reports",
    text: "Found a parsing issue, export bug, or route that feels broken on your device.",
    value: "bugs@leadcleanr.com",
  },
  {
    title: "Business and API interest",
    text: "Need larger limits, team workflows, or want to shape future paid features.",
    value: "hello@leadcleanr.com",
  },
];

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact LeadCleanr for support, bugs, or feature requests.",
};

export default function ContactPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          Contact
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold sm:text-5xl">
          Reach out for support, bugs, or roadmap questions
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
          The MVP keeps communication simple. If you have a workflow question,
          found a bug, or want to talk about heavier use cases, use one of the
          contacts below.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {contactItems.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-[color:var(--line)] bg-white/75 p-6 shadow-[var(--shadow)]"
            >
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
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-[color:rgba(15,118,110,0.16)] bg-[color:rgba(15,118,110,0.08)] p-6 shadow-[var(--shadow)]">
          <h2 className="font-display text-3xl font-semibold">
            Best info to include in a message
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            If you are reporting a bug, include the tool URL, what you pasted or
            uploaded in a safe redacted form, what result you expected, and what
            happened instead. That usually makes fixes much faster.
          </p>
        </div>
      </section>
    </PageFrame>
  );
}
