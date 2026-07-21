"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  tools: "Tools",
  pricing: "Pricing",
  privacy: "Privacy",
  terms: "Terms",
  contact: "Contact",
  "csv-lead-cleaner": "CSV Lead Cleaner",
  "extract-emails-from-csv": "Extract Emails from CSV",
  "extract-phone-numbers-from-csv": "Extract Phone Numbers from CSV",
  "remove-empty-rows-from-csv": "Remove Empty CSV Rows",
  "merge-csv-files": "Merge CSV Files",
  "split-csv-files": "Split CSV Files",
  "convert-csv-to-json": "CSV to JSON",
  "extract-emails-from-text": "Extract Emails from Text",
  "extract-phone-numbers-from-text": "Extract Phone Numbers from Text",
  "extract-urls-from-text": "Extract URLs from Text",
  "extract-domains-from-emails": "Extract Domains from Emails",
  "clean-email-list": "Clean Email List",
  "validate-email-list": "Email Syntax Validator",
  "remove-duplicate-emails": "Remove Duplicate Emails",
  "remove-duplicate-phone-numbers": "Remove Duplicate Phone Numbers",
  "remove-duplicate-urls": "Remove Duplicate URLs",
  "count-words-characters-text": "Word and Character Counter",
  "hubspot-csv-import-cleaner": "HubSpot CSV Cleaner",
  "salesforce-csv-import-cleaner": "Salesforce CSV Cleaner",
  "apollo-csv-import-cleaner": "Apollo CSV Cleaner",
  "pipedrive-csv-import-cleaner": "Pipedrive CSV Cleaner",
};

export function SiteBreadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const items = segments.map((segment, index) => ({
    href: `/${segments.slice(0, index + 1).join("/")}`,
    label: LABELS[segment] ?? segment.replaceAll("-", " "),
  }));

  return (
    <div className="border-b border-[var(--lc-border)] bg-[var(--lc-surface-subtle)]">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol className="flex min-h-10 items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs text-[var(--lc-muted)]">
          <li>
            <Link href="/" className="inline-flex min-h-10 items-center hover:text-[var(--lc-ink)]">
              Home
            </Link>
          </li>
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-[var(--lc-hint)]" aria-hidden="true" />
                {isCurrent ? (
                  <span aria-current="page" className="font-medium text-[var(--lc-ink)]">{item.label}</span>
                ) : (
                  <Link href={item.href} className="inline-flex min-h-10 items-center hover:text-[var(--lc-ink)]">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
