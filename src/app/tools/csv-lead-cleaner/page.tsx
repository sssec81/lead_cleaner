import type { Metadata } from "next";
import { Suspense } from "react";
import { Zap, Users, Briefcase, Database, BarChart3, Shield, X, AlertTriangle, CopyMinus, MailX, Eraser, Building, MailWarning, LayoutGrid } from "lucide-react";
import { CsvLeadCleanerTool } from "@/components/csv-lead-cleaner-tool";
import { PageFrame } from "@/components/page-frame";
import { buildToolMetadata, ToolJsonLd, BreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildToolMetadata({
 title: "Free CSV Lead Cleaner for Sales, CRM & Outreach Lists",
 description:
 "Remove duplicate rows, invalid emails, blank fields, personal emails, and role-based inboxes before importing to HubSpot, Salesforce, Apollo, or outreach tools.",
 path: "/tools/csv-lead-cleaner",
 keywords: [
 "csv lead cleaner",
 "clean csv online",
 "dedupe csv leads",
 "lead list csv cleanup",
 "invalid emails",
 "CRM import",
 "outreach lists"
 ],
});

const seoUseCases = [
 {
 icon: Briefcase,
 title: "For sales teams",
 text: "Clean prospecting lists before outreach to protect sender scores and improve deliverability.",
 },
 {
 icon: Users,
 title: "For recruiters",
 text: "Remove duplicate or invalid candidate emails before uploading into ATS or outreach sequences.",
 },
 {
 icon: Database,
 title: "For CRM imports",
 text: "Avoid messy imports and bad contact records in HubSpot, Salesforce, or Close.",
 },
];

export default function CsvLeadCleanerPage() {
  const pageHeader = (
    <div className="mx-auto max-w-2xl pt-12 pb-6 text-center sm:text-left sm:mx-0">
      <div className="mb-4 text-[0.75rem] font-bold tracking-[0.22em] uppercase text-[var(--lc-accent)]">
        CSV TOOL
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-4xl">
        CSV lead cleaner
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-[var(--lc-muted)]">
        Upload your spreadsheet to remove duplicates, clean emails, and export a CRM-ready file.
      </p>
      
      <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-[var(--lc-muted)]">
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-[var(--lc-accent)]" />
          <span className="font-medium text-[var(--lc-ink)]">Browser-only</span>
        </div>
        <span className="text-[var(--lc-border-mid)]">·</span>
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-[var(--lc-accent)]" />
          <span className="font-medium text-[var(--lc-ink)]">No account needed</span>
        </div>
        <span className="text-[var(--lc-border-mid)]">·</span>
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4 text-[var(--lc-accent)]" />
          <span className="font-medium text-[var(--lc-ink)]">Up to 2MB free</span>
        </div>
      </div>
    </div>
  );

 return (
 <PageFrame>
 <BreadcrumbJsonLd
 items={[
 { name: "Home", url: "/" },
 { name: "Tools", url: "/tools" },
 { name: "CSV Lead Cleaner", url: "/tools/csv-lead-cleaner" },
 ]}
 />
 <ToolJsonLd
 title="Free CSV Lead Cleaner for Sales, CRM & Outreach Lists"
 description="Remove duplicate rows, invalid emails, blank fields, personal emails, and role-based inboxes before importing to HubSpot, Salesforce, Apollo, or outreach tools."
 path="/tools/csv-lead-cleaner"
 category="BusinessApplication"
 />
  <main className="relative min-h-screen pt-4 pb-24 lg:pb-32 bg-[var(--lc-bg)]">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {pageHeader}
  <Suspense fallback={<div className="h-96 flex items-center justify-center text-[var(--lc-muted)]">Loading tool...</div>}>
    <CsvLeadCleanerTool />
  </Suspense>
  </div>
  </main>

  {/* SEO Use-Case Section */}
  <section className="border-t border-[var(--lc-border)] bg-[var(--lc-bg)] pt-16 pb-16">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="max-w-2xl mb-12">
  <div className="mb-4 text-[0.75rem] font-bold tracking-[0.22em] uppercase text-[var(--lc-accent)]">
  WHO USES THIS
  </div>
  <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--lc-ink)] sm:text-4xl mb-4">
  Clean lead CSVs before importing to your CRM
  </h2>
  <p className="text-[15px] leading-relaxed text-[var(--lc-muted)]">
  LeadCleanr helps remove duplicate rows, invalid emails, blank fields, personal emails, and role-based inboxes before importing contact lists into HubSpot, Salesforce, Apollo, Instantly, Lemlist, or other outreach tools.
  </p>
  </div>

  <div className="grid gap-5 sm:grid-cols-3">
  {seoUseCases.map((useCase) => {
  const Icon = useCase.icon;
  return (
  <div key={useCase.title} className="bg-[var(--lc-surface)] border border-[var(--lc-border)] rounded-xl p-5 transition-all hover:border-[var(--lc-border-mid)] hover:shadow-sm">
  <div className="bg-[var(--lc-accent-bg)] rounded-lg p-2.5 w-fit mb-4 text-[var(--lc-accent)]">
  <Icon className="h-5 w-5" />
  </div>
  <h3 className="font-medium text-[15px] text-[var(--lc-ink)]">{useCase.title}</h3>
  <p className="text-[13px] leading-relaxed text-[var(--lc-muted)] mt-1">{useCase.text}</p>
  </div>
  );
  })}
  </div>
  </div>
  </section>
  </PageFrame>
 );
}
