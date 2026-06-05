import Link from "next/link";

const links = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--line)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-[color:var(--muted)] sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-2xl space-y-2">
          <p>
            Basic cleaning runs in your browser. Raw pasted text and uploaded
            CSV files are not sent to our app backend for normal processing.
          </p>
          <p className="text-[13px] uppercase tracking-[0.16em] text-[color:var(--brand-strong)]">
            Made by one person who got tired of fixing lead spreadsheets by
            hand.
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
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
      </div>
    </footer>
  );
}
