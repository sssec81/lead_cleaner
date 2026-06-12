"use client";

import type { ReactNode } from "react";
import { PageFrame } from "@/components/page-frame";

type TextToolPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  quote: string;
  tool: ReactNode;
  asideDescription?: string;
  asideContent?: ReactNode;
  toolSupportingContent?: ReactNode;
};

export function TextToolPageShell({
  tool,
  toolSupportingContent,
}: TextToolPageShellProps) {
  return (
    <PageFrame>
      <div className="min-h-[calc(100vh-140px)] bg-[#f3f6fb] pt-8 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {tool}
          {toolSupportingContent ? (
            <div className="mt-8">{toolSupportingContent}</div>
          ) : null}
        </div>
      </div>
    </PageFrame>
  );
}
