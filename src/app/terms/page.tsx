import type { Metadata } from "next";
import { BadgeAlert, ClipboardCheck, Scale } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const sections = [
  {
    title: "Acceptable use",
    text: "Use LeadCleanr only for data you own or have permission to process. Do not use it for spam, scraping abuse, or sending unsolicited messages.",
  },
  {
    title: "Tool accuracy",
    text: "LeadCleanr is designed to help with common cleanup jobs, but extraction and normalization are best-effort. Results may not be perfect for every source format.",
  },
  {
    title: "User responsibility",
    text: "You are responsible for reviewing the output before using it in downstream tools, campaigns, or business workflows.",
  },
  {
    title: "Availability",
    text: "The MVP may change, improve, or remove features as the product evolves. Limits, exports, and supported formats can be adjusted over time.",
  },
  {
    title: "Limitation of liability",
    text: "LeadCleanr is provided as-is for utility and workflow assistance. Use the product at your own risk and validate results before relying on them operationally.",
  },
];

const reminders = [
  "Review exports before importing them into your CRM or outreach stack.",
  "Treat extracted or normalized data as best-effort, not guaranteed truth.",
  "Use the product for legitimate cleanup work, not scraping abuse or spam.",
];

export const metadata: Metadata = {
  title: "Terms",
  description: "LeadCleanr terms and acceptable use guidance.",
};

export default function TermsPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Terms
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Use LeadCleanr responsibly and review your outputs
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
              LeadCleanr is a utility tool for cleaning data, not a guarantee
              of perfect extraction. These terms keep the product focused on
              legitimate cleanup work and set clear expectations about how the
              MVP should be used.
            </p>

            <div className="mt-8 rounded-[2rem] border border-[color:rgba(15,118,110,0.14)] bg-[color:rgba(15,118,110,0.08)] p-6 shadow-[var(--shadow)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-[color:var(--accent)]">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Practical reminders
                  </h2>
                  <div className="mt-4 grid gap-3">
                    {reminders.map((item) => (
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
                      <Scale className="h-5 w-5" />
                    ) : (
                      <BadgeAlert className="h-5 w-5" />
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
