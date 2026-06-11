import type { Metadata } from "next";
import { Zap, Users, Briefcase, Database, BarChart3, Shield, X, AlertTriangle } from "lucide-react";
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
  const heroContent = (
    <div className="max-w-2xl pt-4 xl:pt-8">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm backdrop-blur-md">
        <Zap className="h-4 w-4" />
        <span>B2B CSV Lead Cleaner</span>
      </div>
      <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.75rem] lg:text-5xl leading-[1.08]">
        Free CSV Lead Cleaner for Sales, CRM & Outreach Lists
      </h1>
      <p className="mb-8 text-lg leading-8 text-slate-600 sm:text-xl">
        Remove duplicate rows, invalid emails, blank fields, personal emails, and role-based inboxes before importing to HubSpot, Salesforce, Apollo, or outreach tools.
      </p>

      {/* Before/After Example Table */}
      <div className="overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-200/60 bg-white/60 shadow-sm backdrop-blur-md">
        <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">What happens to your CSV?</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500">
              <th className="px-6 py-3 font-medium">Before</th>
              <th className="px-6 py-3 font-medium">After</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            <tr>
              <td className="px-6 py-3">Duplicate rows</td>
              <td className="px-6 py-3"><span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><X className="h-3 w-3" /></span> Removed</span></td>
            </tr>
            <tr>
              <td className="px-6 py-3">Invalid emails</td>
              <td className="px-6 py-3"><span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><X className="h-3 w-3" /></span> Skipped</span></td>
            </tr>
            <tr>
              <td className="px-6 py-3">Blank rows</td>
              <td className="px-6 py-3"><span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><X className="h-3 w-3" /></span> Cleaned</span></td>
            </tr>
            <tr>
              <td className="px-6 py-3">Role emails (info@, support@)</td>
              <td className="px-6 py-3"><span className="inline-flex items-center gap-1.5 text-amber-600 font-semibold"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 text-amber-600"><AlertTriangle className="h-3 w-3" /></span> Flagged</span></td>
            </tr>
            <tr className="border-b-0">
              <td className="px-6 py-3">Gmail/Yahoo emails</td>
              <td className="px-6 py-3"><span className="inline-flex items-center gap-1.5 text-amber-600 font-semibold"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 text-amber-600"><AlertTriangle className="h-3 w-3" /></span> Separated</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Social Proof Strip */}
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-500">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-slate-700 tabular-nums">4,000+</span> sales professionals
        </div>
        <span className="text-slate-300">·</span>
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4 text-emerald-500" />
          <span className="font-semibold text-slate-700 tabular-nums">2.1M+</span> rows processed
        </div>
        <span className="text-slate-300">·</span>
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-amber-500" />
          <span className="font-semibold text-slate-700">100%</span> browser-local
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
      <main className="relative min-h-screen overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,white,var(--background))]"></div>
        <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-[120px]"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CsvLeadCleanerTool heroContent={heroContent} />
        </div>
      </main>

      {/* SEO Use-Case Section */}
      <section className="relative border-t border-slate-200/60 bg-slate-50/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl mb-5">
              Clean lead CSVs before importing to your CRM
            </h2>
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              LeadCleanr helps remove duplicate rows, invalid emails, blank fields, personal emails, and role-based inboxes before importing contact lists into HubSpot, Salesforce, Apollo, Instantly, Lemlist, or other outreach tools.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
            {seoUseCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div key={useCase.title} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-slate-900">{useCase.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{useCase.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

