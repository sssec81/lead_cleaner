import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function PageFrame({ children }: { children: ReactNode }) {
 return (
 <div className="page-shell">
 <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-24 bg-gradient-to-b from-white/70 to-transparent backdrop-blur-[2px]" />
 <SiteHeader />
 <main id="main-content" className="relative z-10">{children}</main>
 <SiteFooter />
 </div>
 );
}
