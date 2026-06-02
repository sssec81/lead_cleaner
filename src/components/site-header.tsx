import Link from "next/link";

const navItems = [
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[color:rgba(249,243,235,0.9)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--foreground)] text-sm font-semibold uppercase tracking-[0.18em] text-white">
            LC
          </div>
          <div>
            <div className="font-display text-xl font-semibold">LeadCleanr</div>
            <div className="text-sm text-[color:var(--muted)]">
              Browser-first lead cleaning
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[color:var(--muted)] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[color:var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/tools/extract-emails-from-text"
          className="btn-primary inline-flex min-h-11 items-center justify-center rounded-full bg-[color:var(--foreground)] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 sm:px-5"
        >
          <span className="sm:hidden">Start</span>
          <span className="hidden sm:inline">Start Free</span>
        </Link>
      </div>
      <div className="border-t border-[color:rgba(17,36,51,0.08)] md:hidden">
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 text-sm font-medium text-[color:var(--muted)] sm:px-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-[color:var(--line)] bg-white/70 px-4 py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
