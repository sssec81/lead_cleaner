import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";

const sections = [
  {
    title: "What we process",
    text: "LeadCleanr processes text you paste and CSV files you choose to upload so the selected tool can clean, extract, deduplicate, or format the data.",
  },
  {
    title: "Browser-first processing",
    text: "For the MVP, basic cleaning runs in your browser. That keeps processing fast and reduces the need to send raw lead data to a backend service.",
  },
  {
    title: "Storage",
    text: "We do not store pasted text or uploaded CSV file contents in the MVP product flow. No login is required for the first release.",
  },
  {
    title: "Analytics and tracking",
    text: "If analytics are added later, lead or contact contents should not be tracked or sent to analytics tools. Product usage can be measured without capturing your raw lists.",
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
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          Privacy
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold sm:text-5xl">
          Your raw lead data should stay yours
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
          Lead and contact cleanup often involves sensitive business data. The
          MVP is built around a simple promise: basic cleaning runs in your
          browser, no login is required, and we do not store pasted text or
          uploaded CSV files in the product flow.
        </p>

        <div className="mt-10 space-y-5">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-[2rem] border border-[color:var(--line)] bg-white/75 p-6 shadow-[var(--shadow)]"
            >
              <h2 className="font-display text-2xl font-semibold">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

