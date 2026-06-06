import type { Metadata } from "next";

import { PhoneExtractorTool } from "@/components/phone-extractor-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

const contextPoints = [
  "Good for copied website text, CRM notes, resumes, support transcripts, and messy research scraps.",
  "Normalization helps the result feel less noisy before export or handoff.",
  "If the rest of the dataset also needs review, the CSV workflow is the broader cleanup path.",
];

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Phone Numbers from Text",
  description:
    "Extract phone numbers from text online. Paste messy text, normalize numbers, remove duplicates, and export the result in your browser.",
  path: "/tools/extract-phone-numbers-from-text",
  keywords: [
    "extract phone numbers from text",
    "phone number extractor",
    "find phone numbers in text",
    "lead cleaner phone tool",
  ],
});

export default function ExtractPhoneNumbersFromTextPage() {
  return (
    <PageFrame>
      <ToolJsonLd
        title="Extract Phone Numbers from Text"
        description="Extract phone numbers from text online. Paste messy text, normalize numbers, remove duplicates, and export the result in your browser."
        path="/tools/extract-phone-numbers-from-text"
        category="BusinessApplication"
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Extract Phone Numbers from Text
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.06] sm:text-5xl lg:text-6xl">
              Pull phone numbers out of messy text and normalize them into
              something usable.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
              Use this when the phone field is trapped inside notes, copied
              pages, support logs, or research scraps and you need a cleaner
              list before you paste it somewhere else.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[color:rgba(16,37,52,0.1)] bg-white/82 p-6 shadow-[var(--shadow)]">
            <blockquote className="font-display text-2xl font-semibold leading-[1.18] text-[color:var(--foreground)] sm:text-3xl">
              “Phone cleanup is usually less glamorous than email cleanup and
              often just as annoying.”
            </blockquote>
            <div className="mt-5 border-t border-[color:rgba(16,37,52,0.08)] pt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                When to use it
              </p>
              <div className="mt-3 space-y-3">
                {contextPoints.map((point) => (
                  <p
                    key={point}
                    className="text-sm leading-7 text-[color:var(--muted)] sm:text-base"
                  >
                    {point}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <PhoneExtractorTool />
        </div>
      </section>
    </PageFrame>
  );
}
