import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";
import { PageHero } from "@/components/page-hero";
import { PageSectionHeading } from "@/components/page-section-heading";

const sections = [
  {
    title: "Acceptable use",
    text: "Use LeadCleanr only for data you own or have permission to process. Do not use it for spam, scraping abuse, or sending unsolicited messages.",
  },
  {
    title: "Tool accuracy",
    text: "LeadCleanr is designed to help with common cleanup jobs, but extraction and normalization are best-effort. Results will not be perfect for every source format.",
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
    text: "LeadCleanr is provided as-is for utility and workflow assistance. Use it at your own risk and validate results before relying on them operationally.",
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
      <PageHero
        eyebrow="Terms"
        title="Use the tool responsibly and review what it gives back."
        intro="LeadCleanr is a utility for cleanup work, not a guarantee of perfect extraction. These terms keep the product tied to legitimate use and make the expectation clear: review the outputs before you rely on them."
        className="pt-10 lg:pt-12"
      />

      <section className="page-section">
          <blockquote className="max-w-5xl font-display text-3xl font-semibold leading-[1.16] text-[color:var(--foreground)] sm:text-4xl lg:text-[3.15rem]">
            “The safest default is to treat cleaned output as a better draft,
            not unquestionable truth.”
          </blockquote>
      </section>

      <section className="page-section pb-16 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <PageSectionHeading
              eyebrow="Practical reminders"
              title="Keep the product useful by keeping expectations honest."
            />
            <div className="mt-6 space-y-5">
              {reminders.map((item) => (
                <p
                  key={item}
                  className="border-t border-[color:rgba(16,37,52,0.1)] pt-4 text-sm leading-7 text-[color:var(--foreground)] sm:text-base"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="space-y-5 border-t border-[color:rgba(16,37,52,0.12)] pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {sections.map((section, index) => (
              <div
                key={section.title}
                className={index === 0 ? "" : "border-t border-[color:rgba(16,37,52,0.1)] pt-5"}
              >
                <h2 className="font-display text-2xl font-semibold text-[color:var(--foreground)]">
                  {section.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[color:#153246] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:#d8a15d]">
                Product boundary
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                The tool can make messy data more workable. It cannot remove
                the need for judgment.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="border-t border-[color:rgba(255,255,255,0.14)] pt-4 text-base leading-8 text-[color:rgba(255,255,255,0.82)]">
                If a campaign, import, or client delivery depends on the data,
                review the output before you move it downstream.
              </p>
              <p className="border-t border-[color:rgba(255,255,255,0.14)] pt-4 text-base leading-8 text-[color:rgba(255,255,255,0.82)]">
                The MVP may evolve quickly, so feature limits and supported
                formats can change as the product matures.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
