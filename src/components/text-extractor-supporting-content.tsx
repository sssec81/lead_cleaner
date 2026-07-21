import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type RelatedTool = {
 href: string;
 label: string;
};

type TextExtractorSupportingContentProps = {
 title: string;
 description: string;
 useCases: Array<{
 title: string;
 description: string;
 }>;
 faqs: Array<{
 question: string;
 answer: string;
 }>;
 relatedTools?: RelatedTool[];
};

export function TextExtractorSupportingContent({
 title,
 description,
 useCases,
 faqs,
 relatedTools = [],
}: TextExtractorSupportingContentProps) {
 return (
 <section className="lc-card p-6 sm:p-8">
 <div className="max-w-4xl">
 <p className="section-eyebrow">
 Browser-first text cleanup
 </p>
 <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--lc-ink)] sm:text-3xl">
 {title}
 </h2>
 <p className="mt-3 text-sm leading-7 text-[var(--lc-muted)] sm:text-base">
 {description}
 </p>
 </div>

 <div className="mt-8 grid gap-4 md:grid-cols-3">
 {useCases.map((useCase) => (
 <div
 key={useCase.title}
 className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] p-5"
 >
 <div className="lc-icon-tile mb-3 h-10 w-10">
 <CheckCircle2 className="h-4 w-4" />
 </div>
 <h3 className="font-semibold text-[var(--lc-ink)]">{useCase.title}</h3>
 <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
 {useCase.description}
 </p>
 </div>
 ))}
 </div>

 <div className="mt-8 grid gap-4 lg:grid-cols-2">
 {faqs.map((faq) => (
 <div
 key={faq.question}
 className="rounded-xl border border-[var(--lc-border)] bg-white p-5"
 >
 <h3 className="text-sm font-semibold text-[var(--lc-ink)]">
 {faq.question}
 </h3>
 <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
 {faq.answer}
 </p>
 </div>
 ))}
 </div>

 {relatedTools.length ? (
 <div className="mt-8 rounded-xl border border-[var(--lc-accent)]/15 bg-[var(--lc-accent-bg)] p-5">
 <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--lc-accent-strong)]">
 Related tools
 </p>
 <div className="mt-4 flex flex-wrap gap-3">
 {relatedTools.map((tool) => (
 <Link
 key={tool.href}
 href={tool.href}
 className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--lc-accent-border)] bg-white px-4 text-sm font-semibold text-[var(--lc-accent-strong)] transition hover:border-[var(--lc-accent)] hover:bg-[var(--lc-accent-bg)]"
 >
 {tool.label}
 <ArrowRight className="h-4 w-4" />
 </Link>
 ))}
 </div>
 </div>
 ) : null}
 </section>
 );
}
