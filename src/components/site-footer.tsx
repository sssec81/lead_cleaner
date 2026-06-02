import Link from "next/link";

const links = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--line)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-[color:var(--muted)] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>
          Basic cleaning runs in your browser. We do not store pasted text or
          uploaded CSV files in the MVP.
        </p>
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
