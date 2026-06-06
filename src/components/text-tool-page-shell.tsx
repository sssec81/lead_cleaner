"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  title,
  intro,
  tool,
}: TextToolPageShellProps) {
  return (
    <PageFrame>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
            {intro}
          </p>
        </div>

        <div className="mt-6">{tool}</div>
      </section>
    </PageFrame>
  );
}
