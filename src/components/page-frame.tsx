import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function PageFrame({ children }: { children: ReactNode }) {
 return (
 <div className="page-shell flex min-h-[100dvh] flex-col">
 <SiteHeader />
 <main id="main-content" className="relative z-10 flex-1">{children}</main>
 <SiteFooter />
 </div>
 );
}
