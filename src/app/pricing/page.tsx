import type { Metadata } from "next";
import Link from "next/link";

import { PageFrame } from "@/components/page-frame";

const plans = [
  {
    name: "Free",
    price: "0",
    description:
      "For quick lead cleanup jobs and browser-first extraction tasks.",
    features: [
      "Paste text tools",
      "Small CSV upload",
      "TXT and CSV export",
      "No login required",
    ],
  },
  {
    name: "Pro",
    price: "Coming soon",
    description:
      "For heavier cleanup workflows once the core product is proven.",
    features: [
      "Larger CSV limits",
      "Batch processing",
      "Saved workflows",
      "Priority speed",
    ],
  },
  {
    name: "Business / API",
    price: "Coming soon",
    description:
      "For teams, integrations, and repeat operational cleanup work.",
    features: [
      "API access",
      "Team workflows",
      "Bulk processing",
      "Support options",
    ],
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description: "LeadCleanr pricing and future upgrade path.",
};

export default function PricingPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-[color:var(--muted)]">
            Start cleaning your lead lists for free. Upgrade when you need more power.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="flex flex-col rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-8 shadow-[var(--shadow)]">
              <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-4 text-3xl font-bold">{plan.price === "0" ? "$0" : plan.price}</p>
              <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">{plan.description}</p>
              <ul className="mt-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm font-medium">
                    <span className="mr-3 text-[color:var(--brand-strong)]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
