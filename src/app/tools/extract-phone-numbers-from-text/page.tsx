import type { Metadata } from "next";

import { PhoneExtractorTool } from "@/components/phone-extractor-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Extract Phone Numbers from Text Online",
  description:
    "Extract and format phone numbers from text. Validates international phone prefixes and formats numbers into standard E.164 locally in your browser with no signup required.",
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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Extract Phone Numbers from Text", url: "/tools/extract-phone-numbers-from-text" },
        ]}
      />
      <ToolJsonLd
        title="Extract Phone Numbers from Text Online"
        description="Extract and format phone numbers from text. Validates international phone prefixes and formats numbers into standard E.164 locally in your browser with no signup required."
        path="/tools/extract-phone-numbers-from-text"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Extract Phone Numbers from Text"
        title="Pull phone numbers out of messy text and normalize them into something usable."
        intro="Use this when the phone field is trapped inside notes, copied pages, support logs, or research scraps and you need a cleaner list before you paste it somewhere else."
        quote="The list gets easier to trust as soon as the phone numbers stop hiding inside the paragraph."
        tool={<PhoneExtractorTool />}
      />
    </>
  );
}
