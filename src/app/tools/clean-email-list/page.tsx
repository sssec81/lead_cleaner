import type { Metadata } from "next";

import { CleanEmailListTool } from "@/components/clean-email-list-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Clean Email List Online — Remove Duplicates & Invalid Emails",
 description:
 "Clean email lists online. Lowercase addresses, filter duplicates, remove invalid syntax, and download a clean list. Core cleanup runs locally in your browser, with no signup required.",
 path: "/tools/clean-email-list",
 keywords: [
 "clean email list",
 "email list cleaner",
 "dedupe email list",
 "lead list cleanup",
 ],
});

export default function CleanEmailListPage() {
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "Clean Email List", url: "/tools/clean-email-list" },
 ]}
 />
 <ToolJsonLd
 title="Clean Email List Online — Remove Duplicates & Invalid Emails"
 description="Clean email lists online. Lowercase addresses, filter duplicates, remove invalid syntax, and download a clean list. Core cleanup runs locally in your browser, with no signup required."
 path="/tools/clean-email-list"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="Clean Email List"
 title="Normalize the addresses and make the list usable again."
 intro="Paste a messy email list from outreach notes, spreadsheet exports, or copied lead sources. This tool trims noise, lowercases the addresses, removes invalid entries, and prepares a cleaner output."
 quote="The difference between a messy list and a usable one is usually ten small fixes repeated hundreds of times."
 tool={<CleanEmailListTool />}
 />
 </>
 );
}
