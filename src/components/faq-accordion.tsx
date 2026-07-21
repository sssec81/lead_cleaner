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
    <div className="border-y border-[var(--lc-border-mid)]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="group overflow-hidden border-b border-[var(--lc-border)] bg-transparent last:border-b-0"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-1 py-4 text-left font-semibold text-[15px] text-[var(--lc-ink)] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--lc-accent)]"
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
                <div className="max-w-3xl px-1 pb-5 text-sm leading-7 text-[var(--lc-muted)]">
                  <div>
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
