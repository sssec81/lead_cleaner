import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";

const comparisonRows = [
  {
    label: "Text tools",
    free: "Included",
    pro: "Included",
  },
  {
    label: "CSV upload size",
    free: "Up to 2 MB",
    pro: "Larger files for heavier cleanup",
  },
  {
    label: "Exports",
    free: "Unlimited",
    pro: "Unlimited",
  },
  {
    label: "Best for",
    free: "Trying the workflow",
    pro: "Recurring operational cleanup",
  },
];

const freePlanPoints = [
  "Text extractors stay free",
  "CSV cleanup for smaller files",
  "Unlimited exports",
  "No login required during the MVP",
];

const proPlanPoints = [
  "Larger CSV uploads for real spreadsheet work",
  "Built for recruiting, agency, and sales ops workflows",
  "Priority support and earlier access to premium tools",
  "Future workflow history and saved cleanup features",
];

const principles = [
  {
    title: "Charge for heavier use, not fake friction",
    text: "Because the app runs in the browser, export clicks are not the cost center. Larger file support is the more honest upgrade trigger.",
    icon: ShieldCheck,
  },
  {
    title: "Free should feel useful on purpose",
    text: "A generous free tier builds trust faster than a stingy one, especially for spreadsheet tools people want to test before they commit.",
    icon: Sparkles,
  },
  {
    title: "Pro should map to a real work pattern",
    text: "The paid plan is for people doing repeat cleanup jobs, not casual one-off extraction. That keeps the offer understandable.",
    icon: FileSpreadsheet,
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "LeadCleanr pricing for browser-first CSV lead cleanup workflows, from free discovery to heavier operational use.",
};

export default function PricingPage() {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-strong)]">
              Pricing
            </p>
            <h1 className="mt-4 max-w-5xl font-display text-4xl font-semibold leading-[0.95] sm:text-5xl lg:text-6xl">
              A free tier that feels generous.
              <br />
              A paid tier that earns its place.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
              LeadCleanr should not feel like a trap. The free plan is for
              trying the browser-side workflow on small files. Pro is for the
              moment CSV cleanup becomes a recurring operational job.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[color:rgba(15,118,110,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(236,252,250,0.74))] p-6 shadow-[var(--shadow)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
              Practical model
            </p>
            <p className="mt-3 text-base leading-7 text-[color:var(--foreground)]">
              Free keeps exports unlimited and caps CSV uploads at{" "}
              <span className="font-semibold">2 MB</span>. Pro is where larger
              file support, heavier cleanup, and later workflow features live.
            </p>
          </div>
        </div>

        <section className="mt-12 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.76)] p-6 shadow-[var(--shadow)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                  Free
                </p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-6xl font-semibold">$0</span>
                  <span className="pb-2 text-base text-[color:var(--muted)]">
                    /month
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-[color:rgba(217,119,6,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                Best to start
              </span>
            </div>

            <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--muted)]">
              For trying the product, cleaning smaller spreadsheets, and using
              the text tools without friction.
            </p>

            <div className="mt-7 grid gap-3">
              {freePlanPoints.map((point) => (
                <FeaturePill key={point} text={point} />
              ))}
            </div>

            <div className="mt-7 rounded-[1.5rem] border border-[color:var(--line)] bg-[#fffaf3] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                File limit
              </p>
              <p className="mt-2 text-base leading-7 text-[color:var(--foreground)]">
                Upload CSV files up to <span className="font-semibold">2 MB</span>{" "}
                on the free plan and export results as often as you need.
              </p>
            </div>

            <Link
              href="/tools/csv-lead-cleaner"
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-6 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5"
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-[2.1rem] border border-[color:rgba(15,118,110,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(233,249,246,0.9))] p-6 shadow-[var(--shadow)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
                  Pro
                </p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-6xl font-semibold">$12</span>
                  <span className="pb-2 text-base text-[color:var(--muted)]">
                    /month
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                Recommended
              </span>
            </div>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
              For recruiters, agencies, sales ops teams, and freelancers who
              keep inheriting messy lead spreadsheets and need a cleaner system
              for repeat work.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {proPlanPoints.map((point) => (
                <FeaturePill key={point} text={point} strong />
              ))}
            </div>

            <div className="mt-7 overflow-hidden rounded-[1.6rem] border border-[color:rgba(15,118,110,0.14)] bg-white/78">
              <div className="grid grid-cols-[1.15fr_0.85fr_0.85fr] border-b border-[color:var(--line)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                <span>Plan comparison</span>
                <span>Free</span>
                <span>Pro</span>
              </div>
              {comparisonRows.map((row, index) => (
                <ComparisonRow
                  key={row.label}
                  label={row.label}
                  free={row.free}
                  pro={row.pro}
                  last={index === comparisonRows.length - 1}
                />
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Choose Pro
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools/csv-lead-cleaner"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-white/80 px-6 text-sm font-semibold transition hover:-translate-y-0.5"
              >
                Try the workflow first
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          {principles.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-[color:var(--line)] bg-white/72 p-6 shadow-[var(--shadow)]"
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

        <section className="mt-12 rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Later expansion
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Business and API should arrive after repeat demand, not before.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
            Once teams consistently ask for more, the next layer can grow
            around workflow history, verification credits, CRM exports, and API
            access. Until then, the page should stay simple and believable.
          </p>
        </section>
      </section>
    </PageFrame>
  );
}

function FeaturePill({ text, strong = false }: { text: string; strong?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-[1.35rem] border px-4 py-4 ${
        strong
          ? "border-[color:rgba(15,118,110,0.14)] bg-white/86"
          : "border-[color:var(--line)] bg-white/82"
      }`}
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
      <p className="text-sm leading-6 text-[color:var(--foreground)]">{text}</p>
    </div>
  );
}

function ComparisonRow({
  label,
  free,
  pro,
  last = false,
}: {
  label: string;
  free: string;
  pro: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[1.15fr_0.85fr_0.85fr] gap-4 px-5 py-4 text-sm ${
        last ? "" : "border-b border-[color:rgba(17,36,51,0.08)]"
      }`}
    >
      <div className="font-medium text-[color:var(--foreground)]">{label}</div>
      <div className="text-[color:var(--muted)]">{free}</div>
      <div className="font-medium text-[color:var(--foreground)]">{pro}</div>
    </div>
  );
}
