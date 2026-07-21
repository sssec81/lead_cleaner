import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

import { FaqAccordion } from "@/components/faq-accordion";
import { PageFrame } from "@/components/page-frame";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ToolJsonLd,
  type FaqItem,
} from "@/lib/seo";

type Detail = {
  title: string;
  text: string;
};

type CrmImportLandingPageProps = {
  crm: string;
  path: string;
  cleanerQuery: string;
  title: string;
  intro: string;
  requirements: Detail[];
  failureModes: string[];
  steps: Detail[];
  faqs: FaqItem[];
};

export function CrmImportLandingPage({
  crm,
  path,
  cleanerQuery,
  title,
  intro,
  requirements,
  failureModes,
  steps,
  faqs,
}: CrmImportLandingPageProps) {
  const cleanerHref = `/tools/csv-lead-cleaner?crm=${cleanerQuery}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: `${crm} CSV Import Cleaner`, url: path },
        ]}
      />
      <ToolJsonLd
        name={`${crm} CSV Import Cleaner`}
        title={title}
        description={intro}
        path={path}
        category="BusinessApplication"
      />
      <FaqJsonLd faqEntries={faqs} />

      <PageFrame>
        <section className="border-b border-[var(--lc-border-mid)] py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.68fr_0.32fr] lg:items-end lg:px-8">
            <div>
              <p className="mb-5 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--lc-muted)] before:h-px before:w-8 before:bg-[var(--lc-border-mid)]">
                {crm} import preparation
              </p>
              <h1 className="max-w-4xl font-display text-4xl font-bold leading-[1.03] tracking-[-0.045em] text-[var(--lc-ink)] sm:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--lc-muted)]">
                {intro}
              </p>
            </div>

            <div className="border-l-2 border-[var(--lc-accent)] pl-5">
              <p className="text-sm font-semibold text-[var(--lc-ink)]">Runs locally in your browser</p>
              <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                Prepare and review the CSV without sending its contact data to LeadCleanr.
              </p>
              <Link href={cleanerHref} className="lc-button-primary mt-5 px-5">
                Open {crm} cleaner
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="section-eyebrow">Import requirements</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.035em] text-[var(--lc-ink)] sm:text-4xl">
                Prepare the fields {crm} expects to receive.
              </h2>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {requirements.map((item) => (
                <article key={item.title} className="lc-card border-t-2 border-t-[var(--lc-ink)] p-6">
                  <h3 className="text-base font-semibold text-[var(--lc-ink)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--lc-border-mid)] bg-[var(--lc-surface)] py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-8">
            <div>
              <p className="section-eyebrow">Preflight checks</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.035em] text-[var(--lc-ink)]">
                Catch common {crm} import problems before upload.
              </h2>
            </div>
            <ul className="divide-y divide-[var(--lc-border)] border-y border-[var(--lc-border-mid)]">
              {failureModes.map((item) => (
                <li key={item} className="flex items-start gap-3 py-4 text-sm leading-6 text-[var(--lc-muted)]">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--lc-green)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="section-eyebrow">Workflow</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.035em] text-[var(--lc-ink)] sm:text-4xl">
                From raw export to {crm}-ready CSV.
              </h2>
            </div>
            <ol className="mt-9 grid gap-px overflow-hidden rounded-xl border border-[var(--lc-border-mid)] bg-[var(--lc-border-mid)] md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="bg-[var(--lc-surface)] p-6">
                  <span className="font-mono text-xs text-[var(--lc-accent)]">0{index + 1}</span>
                  <h3 className="mt-5 text-base font-semibold text-[var(--lc-ink)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-[var(--lc-border-mid)] py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.36fr_0.64fr] lg:px-8">
            <div>
              <div className="lc-icon-tile h-11 w-11">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.035em] text-[var(--lc-ink)]">
                {crm} CSV import FAQ
              </h2>
            </div>
            <FaqAccordion items={faqs} defaultOpenIndex={0} />
          </div>
        </section>
      </PageFrame>
    </>
  );
}
