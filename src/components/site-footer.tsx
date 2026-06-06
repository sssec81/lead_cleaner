import Link from "next/link";
import { ArrowRight, Sparkles, Code, MessageCircle, Mail } from "lucide-react";

const links = [
  { href: "/tools", label: "All Tools" },
  { href: "/pricing", label: "Pricing & Limits" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-slate-950 pt-20 pb-10 text-white">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.15),transparent_50%)]"></div>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          
          {/* Brand & Value Prop */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <p className="font-display text-xl font-bold tracking-tight">LeadCleanr</p>
            </div>
            <h2 className="mb-4 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.5rem]">
              Browser-first cleanup for messy lead lists.
            </h2>
            <p className="max-w-xl text-lg text-slate-400">
              Raw pasted text and uploaded CSV files are not sent to our servers for processing. Keep your data locally secured.
            </p>
          </div>

          {/* Quick CTA */}
          <div className="lg:justify-self-end rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Ready to clean a file?</h3>
            <p className="text-sm text-slate-400 mb-6">No account required for the MVP.</p>
            <Link
              href="/tools/csv-lead-cleaner"
              className="group flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              Open CSV Cleaner
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar: Links & Legal */}
        <div className="mt-20 border-t border-white/10 pt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                <Code className="h-4 w-4" />
              </a>
              <a href="/contact" className="hover:text-white transition-colors" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <span className="hidden md:inline text-white/20">|</span>
            <p>Built for the modern sales ops workflow.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
