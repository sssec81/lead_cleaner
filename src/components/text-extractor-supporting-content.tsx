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
    <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm sm:p-8">
      <div className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          Browser-first text cleanup
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {useCases.map((useCase) => (
          <div
            key={useCase.title}
            className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-900">{useCase.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {useCase.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-2xl border border-slate-200/80 bg-white p-5"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              {faq.question}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {relatedTools.length ? (
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Related tools
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-4 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
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
