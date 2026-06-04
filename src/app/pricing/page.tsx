import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ScanSearch, ShieldCheck } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "/month",
    description:
      "For trying the product, cleaning small files, and using the text tools as often as you need.",
    badge: "Best to start",
    ctaLabel: "Start Free",
    ctaHref: "/tools/csv-lead-cleaner",
    secondary: true,
    features: [
      "Text extractors stay free",
      "CSV cleanup for small files",
      "Up to 200 rows per CSV workflow",
      "1 CSV export per day",
      "No login required for the MVP",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "/month",
    description:
      "For recruiters, agencies, sales ops teams, and freelancers who clean lead spreadsheets regularly.",
    badge: "Recommended",
    ctaLabel: "Choose Pro",
    ctaHref: "/contact",
    highlighted: true,
    features: [
      "Up to 10,000 rows per CSV workflow",
      "Unlimited exports",
      "Advanced dedupe modes and cleanup reports",
      "Domain generation and inbox-type flags",
      "Priority support and faster feature access",
    ],
  },
];

const futureItems = [
  "Saved workflows and cleanup history",
  "Email verification credits",
  "CRM export paths and API access",
  "Larger file limits for repeat operations teams",
];

const whyThisWorks = [
  {
    title: "Free brings in SEO and trust",
    text: "The text tools and small CSV limits let people test the workflow before paying.",
    icon: ScanSearch,
  },
  {
    title: "Pro is the money tier",
    text: "Serious spreadsheet cleanup users usually care more about limits, repeat use, and cleaner reporting than fancy branding.",
    icon: CheckCircle2,
  },
  {
    title: "Paid features stay aligned with privacy",
    text: "The value is workflow speed and cleanup quality, not invasive ads or noisy upsells.",
    icon: ShieldCheck,
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "LeadCleanr pricing for browser-first CSV lead cleanup workflows, from free discovery to a practical Pro plan.",
};

export default function PricingPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Pricing
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Start free. Upgrade when lead cleanup becomes real work.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[color:var(--muted)]">
            LeadCleanr should feel easy to try and easy to justify. The free
            tier helps people test the workflow. Pro is built for recurring CSV
            cleanup jobs where limits, speed, and cleaner exports matter.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          {plans.map((plan) => (
            <section
              key={plan.name}
              className={`flex flex-col rounded-[2rem] border p-7 shadow-[var(--shadow)] sm:p-8 ${
                plan.highlighted
                  ? "border-[color:rgba(15,118,110,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(236,252,250,0.9))]"
                  : "border-[color:var(--line)] bg-white/76"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-3xl font-semibold">
                  {plan.name}
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                    plan.highlighted
                      ? "bg-[color:rgba(15,118,110,0.12)] text-[color:var(--accent)]"
                      : "bg-[color:rgba(217,119,6,0.12)] text-[color:var(--brand-strong)]"
                  }`}
                >
                  {plan.badge}
                </span>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="font-display text-5xl font-semibold">
                  {plan.price}
                </span>
                <span className="pb-1 text-sm font-medium text-[color:var(--muted)]">
                  {plan.cadence}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                {plan.description}
              </p>

              <div className="mt-6 grid gap-3">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 rounded-[1.3rem] border border-[color:var(--line)] bg-white/80 px-4 py-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
                    <p className="text-sm leading-6 text-[color:var(--foreground)]">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href={plan.ctaHref}
                className={`mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:-translate-y-0.5 ${
                  plan.secondary
                    ? "border border-[color:var(--line)] bg-white text-[color:var(--foreground)]"
                    : "bg-[color:var(--foreground)] text-white"
                }`}
              >
                {plan.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Later expansion
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Business and API should come after repeat user demand, not before.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
            The first paid motion should be simple: free for discovery, Pro for
            recurring cleanup work. Once teams start asking for more, the next
            layer can grow around workflow history, verification credits, and
            integrations.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {futureItems.map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/80 px-4 py-4 text-sm font-medium"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          {whyThisWorks.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-[color:var(--line)] bg-white/76 p-6 shadow-[var(--shadow)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.12)] text-[color:var(--brand-strong)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </section>
      </section>
    </PageFrame>
  );
}
