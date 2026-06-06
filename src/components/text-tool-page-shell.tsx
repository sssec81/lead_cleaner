"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { PageHero } from "@/components/page-hero";

type TextToolPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  quote: string;
  tool: ReactNode;
};

export function TextToolPageShell({
  eyebrow,
  title,
  intro,
  quote,
  tool,
}: TextToolPageShellProps) {
  return (
    <PageFrame>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        aside={(
          <div className="panel-strong rounded-[1.9rem] p-6 sm:p-7">
            <p className="section-eyebrow">Browser-first workflow</p>
            <p className="mt-4 font-display text-2xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-[2rem]">
              {quote}
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              The tool opens directly in the browser, keeps the workflow focused,
              and gives you a clean handoff to the next step instead of making
              the page feel heavier than the job.
            </p>
          </div>
        )}
        className="pt-6 lg:pt-8"
      />

      <section className="page-section">
        {tool}
      </section>
    </PageFrame>
  );
}
