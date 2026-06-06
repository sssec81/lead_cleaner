"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { PageHero } from "@/components/page-hero";
import { PageSectionHeading } from "@/components/page-section-heading";

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
  quote,
  narrativeLabel,
  narrativeIntro,
  narrativePoints,
  darkLabel,
  darkTitle,
  darkPoints,
  relatedLabel,
  relatedTitle,
  relatedLinks,
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
        className="pt-10 lg:pt-12"
      />

      <section className="page-section">
        {tool}
      </section>

      <section className="page-section pb-16 lg:pb-20">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="panel-soft rounded-[2rem] p-6 sm:p-8">
            <PageSectionHeading
              eyebrow={narrativeLabel}
              title={narrativeIntro}
            />
            <div className="mt-6 space-y-4">
              {narrativePoints.map((point, index) => (
                <div
                  key={point}
                  className="flex gap-4 border-t border-[color:rgba(16,37,52,0.1)] pt-4 first:border-t-0 first:pt-0"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:rgba(37,99,235,0.18)] bg-[color:rgba(37,99,235,0.07)] text-sm font-semibold text-[color:var(--brand-strong)]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-[color:var(--foreground)] sm:text-base">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[color:#153246] p-6 text-white shadow-[0_28px_60px_rgba(15,23,42,0.18)] sm:p-8">
            <p className="section-eyebrow text-[color:#93c5fd]">{darkLabel}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-[2.4rem]">
              {darkTitle}
            </h2>
            <div className="mt-6 space-y-4">
              {darkPoints.map((point) => (
                <p
                  key={point}
                  className="border-t border-[color:rgba(255,255,255,0.14)] pt-4 text-sm leading-7 text-[color:rgba(255,255,255,0.78)] sm:text-base"
                >
                  {point}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 panel-soft rounded-[2rem] p-6 sm:p-8">
          <PageSectionHeading
            eyebrow={relatedLabel}
            title={relatedTitle}
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/82 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:rgba(37,99,235,0.18)] hover:bg-white"
              >
                <h3 className="font-display text-xl font-semibold text-[color:var(--foreground)]">
                  {link.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {link.text}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-strong)]">
                  Open path
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
