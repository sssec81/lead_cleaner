import type { Metadata } from "next";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

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
    text: "Product usage can be measured without capturing raw lead or contact contents. Any future analytics should stay focused on workflow events, not list data.",
  },
  {
    title: "Acceptable use",
    text: "LeadCleanr is for cleaning data you own or have permission to process. Do not use it for spam, scraping abuse, or unsolicited outreach.",
  },
];

const promises = [
  "Basic cleanup runs in your browser for the MVP flow.",
  "Raw pasted text and uploaded CSV file contents are not stored by default.",
  "No account is required to use the first release.",
];

export const metadata: Metadata = {
  title: "Privacy",
  description: "LeadCleanr privacy policy for the MVP.",
};

export default function PrivacyPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Privacy
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Your raw lead data should stay yours
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
              Lead and contact cleanup often involves sensitive business data.
              The MVP is built around a simple promise: basic cleaning runs in
              your browser, no login is required, and we do not store pasted
              text or uploaded CSV files in the product flow.
            </p>

            <div className="mt-8 rounded-[2rem] border border-[color:rgba(15,118,110,0.14)] bg-[color:rgba(15,118,110,0.08)] p-6 shadow-[var(--shadow)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-[color:var(--accent)]">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                    Privacy-first promise
                  </p>
                  <div className="mt-4 grid gap-3">
                    {promises.map((item) => (
                      <div
                        key={item}
                        className="rounded-[1.2rem] border border-[color:rgba(15,118,110,0.14)] bg-white/80 px-4 py-3 text-sm font-medium text-[color:var(--foreground)]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {sections.map((section, index) => (
              <div
                key={section.title}
                className={`rounded-[2rem] border p-6 shadow-[var(--shadow)] ${
                  index === 0
                    ? "border-[color:rgba(217,119,6,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,238,0.92))]"
                    : "border-[color:var(--line)] bg-white/76"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.12)] text-[color:var(--brand-strong)]">
                    {index === 0 ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                      {section.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
