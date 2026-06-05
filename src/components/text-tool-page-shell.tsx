"use client";

import type { ReactNode } from "react";

import { PageFrame } from "@/components/page-frame";

type TextToolPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  quote: string;
  narrativeLabel: string;
  narrativeIntro: string;
  narrativePoints: string[];
  darkLabel: string;
  darkTitle: string;
  darkPoints: string[];
  relatedLabel: string;
  relatedTitle: string;
  relatedLinks: Array<{
    href: string;
    title: string;
    text: string;
  }>;
  tool: ReactNode;
};

export function TextToolPageShell({
  eyebrow,
  tool,
}: TextToolPageShellProps) {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
          {eyebrow}
        </p>

        <div className="mt-6">{tool}</div>
      </section>
    </PageFrame>
  );
}
