import type { Metadata } from "next";

import { RemoveDuplicateEmailsTool } from "@/components/remove-duplicate-emails-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Remove Duplicate Emails Online — Private Email Deduper",
 description:
 "Remove duplicate emails online. Keep one clean copy of each valid address and export the result. Core cleanup runs locally in your browser, with no signup required.",
 path: "/tools/remove-duplicate-emails",
 keywords: [
 "remove duplicate emails",
 "deduplicate email list",
 "email deduper",
 "clean lead emails",
 ],
});

export default function RemoveDuplicateEmailsPage() {
 return (
 <>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "Remove Duplicate Emails", url: "/tools/remove-duplicate-emails" },
 ]}
 />
 <ToolJsonLd
 title="Remove Duplicate Emails Online — Private Email Deduper"
 description="Remove duplicate emails online. Keep one clean copy of each valid address and export the result. Core cleanup runs locally in your browser, with no signup required."
 path="/tools/remove-duplicate-emails"
 category="BusinessApplication"
 />
 <TextToolPageShell
 eyebrow="Remove Duplicate Emails"
 title="Keep one clean copy of each address and drop the repetition."
 intro="Paste repeated lead lists, newsletter exports, or CRM contact blocks. This tool is for the narrower case where the addresses themselves are mostly fine but the list keeps echoing the same rows."
 quote="Sometimes the list is not broken. It is just louder than it needs to be."
 tool={<RemoveDuplicateEmailsTool />}
 />
 </>
 );
}
