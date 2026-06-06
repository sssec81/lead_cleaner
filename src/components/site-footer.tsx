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
    <footer className="mx-auto mt-16 max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="border-t border-[color:rgba(16,37,52,0.08)] pt-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
              LeadCleanr
            </p>
            <p className="mt-3 max-w-2xl font-display text-2xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-[2rem]">
              Browser-first cleanup for messy lead spreadsheets before import.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Raw pasted text and uploaded CSV files are not sent to our app backend for normal processing.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <Link
              href="/tools/csv-lead-cleaner"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color:rgba(21,50,70,0.12)] bg-white/84 px-5 text-sm font-semibold text-[color:#153246] transition hover:border-[color:rgba(37,99,235,0.18)] hover:bg-white"
            >
              Open CSV Cleaner
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[color:rgba(16,37,52,0.08)] pt-5 text-sm text-[color:var(--muted)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[color:var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-sm text-[color:var(--muted)]">
            Made by one person who got tired of fixing lead spreadsheets by hand.
          </p>
        </div>
      </div>
    </footer>
  );
}
