import type { Metadata } from "next";

import { RemoveDuplicateUrlsTool } from "@/components/remove-duplicate-urls-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Remove Duplicate URLs Online",
 description:
 "Remove duplicate URLs, normalize inconsistent links, filter invalid entries, and export a clean list locally in your browser.",
 path: "/tools/remove-duplicate-urls",
 keywords: [
 "remove duplicate urls",
 "deduplicate links",
 "clean url list",
 "unique urls only",
 ],
});

export default function RemoveDuplicateUrlsPage() {
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "Remove Duplicate URLs", url: "/tools/remove-duplicate-urls" },
 ]}
 />
 <ToolJsonLd
 title="Remove Duplicate URLs Online"
 description="Paste a messy list of URLs and instantly remove all duplicates. Browser-first processing keeps your data secure without uploading."
 path="/tools/remove-duplicate-urls"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="URL Deduplicator"
 title="Remove duplicate URLs instantly."
 intro="Paste a messy list of website links. We'll normalize the formatting, strip out the invalid ones, and leave you with a perfectly clean, unique list of URLs."
 quote="Keep your lists clean and save time before export."
 tool={<RemoveDuplicateUrlsTool />}
 />
 </>
 );
}
