import Link from "next/link";
import type { FaqItem } from "@/lib/seo";
import { FaqAccordion } from "@/components/faq-accordion";

type ContentItem = {
  title: string;
  text: string;
};

type RelatedTool = {
  href: string;
  title: string;
  description: string;
};

type ToolSeoSectionsProps = {
  howItWorksTitle: string;
  howItWorksIntro: string;
  howItWorksSteps: ContentItem[];
  useCasesTitle: string;
  useCases: ContentItem[];
  relatedTools: RelatedTool[];
  faqs: FaqItem[];
};

export function ToolSeoSections({
  howItWorksTitle,
  howItWorksIntro,
  howItWorksSteps,
  useCasesTitle,
  useCases,
  relatedTools,
  faqs,
}: ToolSeoSectionsProps) {
  return (
    <div className="mt-12 space-y-12 border-t border-[var(--lc-border)] pt-12">
      <section>
        <div className="section-anchor-row mb-4">
          <span className="section-anchor-label">How it works</span>
          <div className="section-anchor-line h-px w-20"></div>
        </div>
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-4xl">
            {howItWorksTitle}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[var(--lc-muted)]">
            {howItWorksIntro}
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {howItWorksSteps.map((step) => (
            <div
              key={step.title}
              className="lc-card p-5"
            >
              <h3 className="text-base font-semibold text-[var(--lc-ink)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-3xl">
            {useCasesTitle}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[var(--lc-muted)]">
            These are the workflows where this tool saves the most time without
            changing the rest of your spreadsheet process.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {useCases.map((item) => (
            <div
              key={item.title}
              className="lc-card p-5"
            >
              <h3 className="text-base font-semibold text-[var(--lc-ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-3xl">
            Related tools
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[var(--lc-muted)]">
            Use these next when the cleanup job grows beyond one narrow step.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="lc-card-interactive p-5"
            >
              <h3 className="text-base font-semibold text-[var(--lc-ink)]">
                {tool.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-[760px]">
        <div>
          <h2 className="font-sans text-2xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-3xl">
            FAQ
          </h2>
          <p className="mt-2 text-[14px] text-[var(--lc-muted)] mb-8">
            Short answers to the questions people usually ask before they clean or export the file.
          </p>
        </div>
        <div>
          <FaqAccordion items={faqs} defaultOpenIndex={0} />
        </div>
      </section>
    </div>
  );
}
