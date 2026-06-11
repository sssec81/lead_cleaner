import type { Metadata } from "next";

import { ValidateEmailListTool } from "@/components/validate-email-list-tool";
import { TextToolPageShell } from "@/components/text-tool-page-shell";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Free Email List Validator for Syntax Checks",
  description:
    "Paste your email list to find invalid addresses, missing @ symbols, duplicate emails, and formatting errors before sending or importing to your CRM.",
  path: "/tools/validate-email-list",
  keywords: [
    "validate email list",
    "email list validator",
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
        title="Free Email List Validator for Syntax Checks"
        description="Paste your email list to find invalid addresses, missing @ symbols, duplicate emails, and formatting errors before sending or importing to your CRM."
        path="/tools/validate-email-list"
        category="BusinessApplication"
      />
      <TextToolPageShell
        eyebrow="Email List Validator"
        title="Free Email List Validator for Syntax Checks"
        intro="Paste your email list to find invalid addresses, missing @ symbols, duplicate emails, and formatting errors before sending or importing to your CRM."
        quote="Catch invalid email formats before outreach."
        asideDescription="Checks formatting only. Domain, MX, and mailbox verification are coming to Pro — so you can fix syntax now without worrying about deliverability."
        tool={<ValidateEmailListTool />}
        toolSupportingContent={
          <section className="rounded-[2rem] border border-slate-200/70 bg-white/85 p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              What this email validator checks
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Use it to clean pasted email lists before outreach, CRM import, or campaign launch.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Missing @ symbols",
                "Invalid domain format",
                "Duplicate emails",
                "Blank rows",
                "Extra spaces and formatting issues",
                "Clean export-ready email list",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
              Full deliverability, MX, SMTP, and mailbox checks are planned for Pro.
            </p>
          </section>
        }
      />
    </>
  );
}
