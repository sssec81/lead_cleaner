import type { Metadata } from "next";

import { PhoneExtractorTool } from "@/components/phone-extractor-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd } from "@/lib/seo";

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
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Extract Phone Numbers from Text
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Pull phone numbers out of messy text and normalize them into
            something usable.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
            Use this when the phone field is trapped inside notes, copied
            pages, support logs, or research scraps and you need a cleaner
            list before you paste it somewhere else.
          </p>
        </div>

        <div className="mt-6">
          <PhoneExtractorTool />
        </div>
      </section>
    </PageFrame>
  );
}
