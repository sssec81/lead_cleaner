import type { Metadata } from "next";

import { ValidateEmailListTool } from "@/components/validate-email-list-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";

export const metadata: Metadata = buildToolMetadata({
  title: "Validate Email List Syntax Online — Free Checker",
  description:
    "Check your email list for formatting errors, typos, and broken syntax. Run a free browser-side check before uploading to your CRM or verification tool.",
  path: "/tools/validate-email-list",
  keywords: [
    "validate email list",
    "check email syntax",
    "email format checker",
    "verify email list formatting",
  ],
});

export default function ValidateEmailListPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Validate Email List", url: "/tools/validate-email-list" },
        ]}
      />
      <ToolJsonLd
        title="Validate Email List Syntax Online — Free Checker"
        description="Check your email list for formatting errors, typos, and broken syntax. Run a free browser-side check before uploading to your CRM or verification tool."
        path="/tools/validate-email-list"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Validate Email Syntax"
        title="Find the broken email addresses before you send."
        intro="Paste your list to instantly identify emails with missing @ symbols, bad domain formats, or invisible formatting errors. We'll separate the structurally valid emails from the broken ones."
        quote="Catch the typos before they become hard bounces."
        tool={<ValidateEmailListTool />}
      />
    </>
  );
}
