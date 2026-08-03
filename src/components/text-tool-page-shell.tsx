"use client";

import { Suspense, type ReactNode } from "react";
import { PageFrame } from "@/components/page-frame";

type TextToolPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  tool: ReactNode;
  asideDescription?: string;
  asideContent?: ReactNode;
  toolSupportingContent?: ReactNode;
  heroVariant?: "default" | "streamlined";
};

export function TextToolPageShell({
  eyebrow,
  title,
  intro,
  asideDescription,
  asideContent,
  tool,
  toolSupportingContent,
  heroVariant = "default",
}: TextToolPageShellProps) {
  const isStreamlined = heroVariant === "streamlined";

  return (
    <PageFrame>
      <div className="bg-[var(--lc-bg)] pb-12">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 lg:items-start">
            
            {/* Left Column 7/12 */}
            <div className="lg:col-span-7 pt-2">
              <p className="mb-5 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--lc-muted)] before:h-px before:w-8 before:bg-[var(--lc-border-mid)]">
                {eyebrow}
              </p>
              <h1 className="mb-3 font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.04em] text-[var(--lc-ink)]">
                {title}
              </h1>
              <p className="font-sans text-[15px] text-[var(--lc-muted)] leading-relaxed max-w-lg mb-6">
                {intro}
              </p>
              <div className="trust-chip-row font-mono text-xs text-[var(--lc-muted)]">
                <span className="trust-chip">Browser-only</span>
                <span className="trust-chip">No account needed</span>
                <span className="trust-chip">Processed locally in your browser</span>
              </div>
            </div>

            {/* Right Column 5/12 */}
            <div className="lg:col-span-5">
              {asideContent ? (
                asideContent
              ) : (
                <div className="lc-card relative overflow-hidden border-t-2 border-t-[var(--lc-ink)] p-6">
                  <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[var(--lc-muted)]">
                    Use This When
                  </p>
                  <h3 className="font-sans font-semibold text-[1.125rem] text-[var(--lc-ink)]">
                    One compact tool for one cleanup job.
                  </h3>
                  <p className="font-sans text-[14px] text-[var(--lc-muted)] mt-2 mb-4">
                    {asideDescription ??
                      "Use this page when you already know the exact transformation you need and want the shortest path from raw input to clean export."}
                  </p>

                  <div className="border-t border-[var(--lc-border)] my-4"></div>

                  <h4 className="font-sans font-medium text-[13px] text-[var(--lc-ink)] mb-3">
                    What happens here
                  </h4>
                  <div className="flex flex-col relative">
                    <div className="absolute bottom-3 left-[4px] top-3 w-px bg-[var(--lc-border)]"></div>
                    {[
                      "Paste the source content or list",
                      "Run the focused extraction",
                      "Copy or export the cleaned result",
                    ].map((item, index) => (
                      <div key={item} className="flex items-start gap-3 py-2 relative z-10">
                        <div className="mt-1.5 h-[9px] w-[9px] shrink-0 rounded-full bg-[var(--lc-accent)] outline outline-[4px] outline-[var(--lc-surface)]"></div>
                        <span className="font-sans text-[14px] text-[var(--lc-muted)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-96 flex items-center justify-center text-[var(--lc-muted)]">Loading workspace...</div>}>
            {tool}
          </Suspense>
          {toolSupportingContent ? (
            <div className="mt-8 lg:mt-10">{toolSupportingContent}</div>
          ) : null}
        </div>
      </div>
    </PageFrame>
  );
}
