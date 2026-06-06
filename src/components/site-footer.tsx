import Link from "next/link";

const links = [
  { href: "/tools", label: "All tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="rounded-[2.25rem] border border-[color:rgba(16,37,52,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(243,247,252,0.94))] px-6 py-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:px-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
              LeadCleanr
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-3xl">
              Browser-first cleanup for the spreadsheet you need to trust again.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Basic cleaning runs in your browser. Raw pasted text and uploaded
              CSV files are not sent to our app backend for normal processing.
            </p>
            <p className="mt-5 text-[13px] uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
              Made by one person who got tired of fixing lead spreadsheets by hand.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/72 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                Best entry point
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">
                Start with the CSV cleaner if your data already lives in rows and columns.
              </p>
              <Link
                href="/tools/csv-lead-cleaner"
                className="mt-4 inline-flex items-center text-sm font-semibold text-[color:#153246] transition hover:text-[color:var(--brand)]"
              >
                Open CSV Cleaner
              </Link>
            </div>

            <div className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/72 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                Need help
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">
                Use the contact page if a result looks wrong or a workflow feels unclear.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center text-sm font-semibold text-[color:#153246] transition hover:text-[color:var(--brand)]"
              >
                Contact LeadCleanr
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-[color:rgba(16,37,52,0.08)] pt-6 text-sm text-[color:var(--muted)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-10 items-center rounded-full border border-[color:var(--line)] bg-white/78 px-4 transition hover:border-[color:rgba(21,50,70,0.12)] hover:text-[color:var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-sm text-[color:var(--muted)]">
            Private by default for routine cleanup.
          </p>
        </div>
      </div>
    </footer>
  );
}
