import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";

const snapshot = [
  {
    label: "Core cleanup",
    text: "Runs in your browser for the MVP flow.",
  },
  {
    label: "Raw data",
    text: "Pasted text and uploaded CSV contents are not sent to the app backend for normal processing.",
  },
  {
    label: "Saved state",
    text: "Workspace persistence can keep current text and results in local browser storage on your device.",
  },
  {
    label: "Accounts",
    text: "No account is required for the first release.",
  },
];

const sections = [
  {
    title: "What we process",
    text: "LeadCleanr handles text you paste and CSV files you choose to upload so the selected tool can clean, extract, deduplicate, or format the data.",
  },
  {
    title: "What stays local",
    text: "For the MVP, the core cleanup and extraction flow runs in your browser. That keeps the raw working data on your device during normal use.",
  },
  {
    title: "What can persist",
    text: "If you use workspace persistence, current text and results can live in local browser storage on your device until you clear them.",
  },
  {
    title: "What can still transmit",
    text: "If analytics or client-error reporting are enabled, they should stay focused on workflow events and sanitized error details rather than raw lead or contact contents.",
  },
  {
    title: "Acceptable use",
    text: "LeadCleanr is for cleaning data you own or have permission to process. Do not use it for spam, scraping abuse, or unsolicited outreach.",
  },
];

export const metadata: Metadata = {
  title: "Privacy",
  description: "LeadCleanr privacy policy for the MVP.",
};

export default function PrivacyPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 xl:grid-cols-[1.02fr_0.98fr] xl:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-strong)]">
              Privacy
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.06] sm:text-5xl lg:text-6xl">
              A plain-language privacy boundary for a browser-first tool.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
              This page should answer one question quickly: what happens to the
              raw data while you use LeadCleanr? The short version is that the
              normal cleanup flow runs locally in your browser, while local
              workspace persistence and optional telemetry are called out
              directly instead of buried behind vague claims.
            </p>
          </div>

          <div className="rounded-[2.2rem] border border-[color:rgba(16,37,52,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,243,236,0.96))] p-6 shadow-[0_24px_50px_rgba(15,23,42,0.12)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
              Quick snapshot
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {snapshot.map((item, index) => (
                <div
                  key={item.label}
                  className={`rounded-[1.25rem] border px-4 py-4 ${
                    index === 0
                      ? "border-[color:rgba(184,106,25,0.16)] bg-white"
                      : "border-[color:var(--line)] bg-white/80"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--foreground)]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[color:#153246] py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:#d8a15d]">
              The boundary
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.06] sm:text-4xl lg:text-5xl">
              The processing job stays local. Any surrounding product behavior
              should be described separately.
            </h2>
          </div>
          <div className="space-y-4 text-base leading-8 text-[color:rgba(255,255,255,0.82)]">
            <p>
              “Local cleanup” should mean something specific, not magical. In
              LeadCleanr, it means the main text and CSV cleanup work happens
              on your device during normal use.
            </p>
            <p>
              It does not mean the page can never load analytics, never store
              anything locally, or never send sanitized error information if
              those features are enabled.
            </p>
            <p>
              The point of this page is to make that boundary easy to
              understand.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Details
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Specific answers for careful readers.
          </h2>
        </div>

        <div className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.title}
              className="border-t border-[color:rgba(16,37,52,0.1)] pt-5"
            >
              <h3 className="font-display text-2xl font-semibold text-[color:var(--foreground)] sm:text-3xl">
                {section.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
