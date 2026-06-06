import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";
import { PageHero } from "@/components/page-hero";
import { PageSectionHeading } from "@/components/page-section-heading";

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
      <PageHero
        eyebrow="Privacy"
        title="A plain-language privacy boundary for a browser-first tool."
        intro="This page should answer one question quickly: what happens to the raw data while you use LeadCleanr? The short version is that the normal cleanup flow runs locally in your browser, while local workspace persistence and optional telemetry are called out directly instead of buried behind vague claims."
        aside={(
          <div className="panel-strong rounded-[1.75rem] p-6 sm:p-8">
            <p className="section-eyebrow">Quick snapshot</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {snapshot.map((item, index) => (
                <div
                  key={item.label}
                  className={`rounded-[1.25rem] border px-4 py-4 ${
                    index === 0
                      ? "border-[color:rgba(37,99,235,0.16)] bg-white"
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
        )}
        className="pt-10 lg:pt-12"
      />

      <section className="bg-[color:#153246] py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8 lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:#93c5fd]">
              The boundary
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.85rem]">
              Local cleanup has a clear edge.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[color:rgba(255,255,255,0.72)]">
              The cleanup work stays on your device. Product telemetry and
              browser storage are separate behaviors, named plainly.
            </p>
          </div>
          <div className="grid gap-3">
            <BoundaryCard
              title="Cleanup"
              text="Text extraction, CSV parsing, preview, and export happen in your browser during normal use."
            />
            <BoundaryCard
              title="Browser state"
              text="Saved workspaces and preferences can live in local storage on the same device."
            />
            <BoundaryCard
              title="Telemetry"
              text="Analytics or sanitized error reporting are treated as separate product behavior, not part of raw file cleanup."
            />
          </div>
        </div>
      </section>

      <section className="page-section pb-16 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <PageSectionHeading
              eyebrow="Details"
              title="Privacy details, without legal fog."
              intro="Short answers for the checks people make before uploading a lead file: what is touched, what stays on-device, and what should never be treated like raw contact data."
            />
            <div className="mt-8 rounded-[1.15rem] border border-[color:rgba(37,99,235,0.16)] bg-white/70 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-[color:var(--foreground)]">
                Plain-language policy
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                The goal is not to sound bigger than the product. It is to make
                the browser-first boundary easy to verify.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.35rem] border border-[color:rgba(16,37,52,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,251,255,0.82))] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            {sections.map((section, index) => (
              <div
                key={section.title}
                className="grid gap-4 border-t border-[color:rgba(16,37,52,0.09)] px-5 py-5 first:border-t-0 sm:grid-cols-[4.5rem_1fr] sm:px-6 sm:py-6"
              >
                <div className="flex items-start">
                  <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[color:rgba(37,99,235,0.18)] bg-[color:rgba(37,99,235,0.07)] font-display text-sm font-semibold tabular-nums text-[color:var(--brand-strong)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold leading-tight text-[color:var(--foreground)]">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                    {section.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

function BoundaryCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-[color:rgba(255,255,255,0.14)] py-5 first:border-t-0 first:pt-0">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:#93c5fd]">
        {title}
      </p>
      <p className="mt-2 max-w-3xl text-base leading-8 text-[color:rgba(255,255,255,0.76)]">
        {text}
      </p>
    </div>
  );
}
