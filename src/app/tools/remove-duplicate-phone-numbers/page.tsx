import type { Metadata } from "next";

import { RemoveDuplicatePhonesTool } from "@/components/remove-duplicate-phones-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Remove Duplicate Phone Numbers — Free Online Tool",
 description:
 "Paste a list of phone numbers to automatically remove duplicates, filter out invalid formats, and normalize the remaining numbers. 100% free and runs locally in your browser.",
 path: "/tools/remove-duplicate-phone-numbers",
 keywords: [
 "remove duplicate phone numbers",
 "deduplicate phone numbers",
 "clean phone number list",
 "phone number cleaner",
 ],
});

export default function RemoveDuplicatePhoneNumbersPage() {
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "Remove Duplicate Phone Numbers", url: "/tools/remove-duplicate-phone-numbers" },
 ]}
 />
 <ToolJsonLd
 title="Remove Duplicate Phone Numbers — Free Online Tool"
 description="Paste a list of phone numbers to automatically remove duplicates, filter out invalid formats, and normalize the remaining numbers. 100% free and runs locally in your browser."
 path="/tools/remove-duplicate-phone-numbers"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="Remove Duplicate Phone Numbers"
 title="Clean and deduplicate your phone lists instantly."
 intro="Paste a messy list of phone numbers. We'll extract the valid ones, format them consistently, and strip out any duplicates so your call list is clean and ready."
 quote="A clean list saves your sales team from dialing the same number twice."
 tool={<RemoveDuplicatePhonesTool />}
 />
 </>
 );
}
