"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/lib/seo";

interface FaqAccordionProps {
  items: FaqItem[];
  defaultOpenIndex?: number;
}

export function FaqAccordion({ items, defaultOpenIndex = 0 }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`group rounded-2xl border transition-all duration-300 ${
              isOpen
                ? "border-[var(--lc-accent)] bg-white shadow-md ring-1 ring-[var(--lc-accent-bg)]"
                : "border-[var(--lc-border)] bg-[var(--lc-surface)] hover:border-[var(--lc-border-mid)] hover:shadow-sm"
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="flex w-full cursor-pointer items-center justify-between px-5 py-4.5 text-left font-semibold text-[15px] text-[var(--lc-ink)] select-none focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className={`transition-colors duration-200 ${isOpen ? "text-[var(--lc-accent)] font-bold" : "group-hover:text-[var(--lc-accent)]"}`}>
                {item.question}
              </span>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--lc-bg)] transition-all duration-300 group-hover:bg-[var(--lc-accent-bg)] group-hover:text-[var(--lc-accent)] ${
                  isOpen ? "rotate-45 bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]" : "text-[var(--lc-muted)]"
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-[var(--lc-muted)] border-t border-[var(--lc-border)]/5">
                  <div className="rounded-xl bg-[var(--lc-bg)]/30 p-3 mt-1">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
