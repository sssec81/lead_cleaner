"use client";

import { useState } from "react";
import { Type, FileText, Hash, Pilcrow, AlignLeft } from "lucide-react";
import { trackToolEvent } from "@/lib/telemetry";
import { copyTextToClipboard } from "@/lib/clipboard";

export function CountWordsCharactersTool() {
 const [text, setText] = useState("");

 const characters = text.length;
 const charactersNoSpaces = text.replace(/\s/g, "").length;
 
 // Word count logic: split on whitespace, filter out empty strings
 const words = text.trim() ? text.trim().split(/\s+/).length : 0;
 
 // Line count: number of newlines + 1 (if text is not empty)
 const lines = text ? text.split(/\r?\n/).length : 0;
 
 // Sentence count (estimate)
 const sentences = text.trim() ? text.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0).length : 0;
 
 // Paragraph count: split on double newlines
 const paragraphs = text.trim() ? text.trim().split(/\r?\n\s*\r?\n/).length : 0;

 function handleClear() {
 setText("");
 trackToolEvent("count-words", "clear");
 }

 async function handleCopy() {
 if (!text) return;
 const didCopy = await copyTextToClipboard(text);
 if (!didCopy) return;
 trackToolEvent("count-words", "copy");
 }

 return (
 <div className="flex flex-col lg:flex-row gap-8 items-start">
 {/* Left Panel: Input */}
 <section className="flex flex-col flex-1 w-full max-w-3xl min-w-0 rounded-xl border border-[var(--lc-border)] bg-white p-6 sm:p-8 shadow-sm">
 <div className="flex items-center gap-4 mb-6">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--lc-accent-bg)] text-[var(--lc-accent)] ring-1 ring-[var(--lc-border)] shadow-sm">
 <Type className="h-6 w-6" />
 </div>
 <div>
 <label htmlFor="text-counter-input" className="block text-xl font-bold text-[var(--lc-ink)] tracking-tight">
 Paste your text
 </label>
 <p className="text-sm text-[var(--lc-muted)]">
 Metrics update automatically as you type.
 </p>
 </div>
 </div>

 <textarea
 id="text-counter-input"
 value={text}
 onChange={(e) => setText(e.target.value)}
 aria-label="Text to analyze"
 placeholder="Paste or type your text here to instantly see word, character, and line counts..."
 className="w-full flex-1 min-h-[24rem] rounded-xl border border-[var(--lc-border-mid)] bg-white p-4 text-base leading-relaxed text-[var(--lc-ink)] placeholder:text-[var(--lc-hint)] outline-none transition focus:border-[var(--lc-accent)] focus:ring-4 focus:ring-[var(--lc-accent-bg)] resize-y"
 />

 <div className="flex flex-wrap items-center gap-3 mt-4">
 <button
 type="button"
 onClick={handleCopy}
 disabled={!text}
 className="lc-button-primary px-5 text-sm font-semibold disabled:opacity-50"
 >
 Copy Text
 </button>
 <button
 type="button"
 onClick={handleClear}
 disabled={!text}
 className="lc-button-secondary px-5 text-sm font-semibold disabled:opacity-50"
 >
 Clear
 </button>
 </div>
 </section>

 {/* Right Panel: Stats */}
 <section className="w-full lg:w-[360px] shrink-0 space-y-6">
 <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] p-6 sm:p-8">
 <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--lc-accent)] mb-6">
 Text Metrics
 </p>

 <div className="grid gap-4">
 <StatTile label="Words" value={words} icon={FileText} />
 <StatTile label="Characters" value={characters} icon={Hash} />
 <StatTile label="Characters (no spaces)" value={charactersNoSpaces} icon={Hash} />
 <StatTile label="Lines" value={lines} icon={AlignLeft} />
 <StatTile label="Sentences (est.)" value={sentences} icon={FileText} />
 <StatTile label="Paragraphs" value={paragraphs} icon={Pilcrow} />
 </div>
 </div>
 </section>
 </div>
 );
}

function StatTile({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
 return (
 <div className="flex items-center justify-between rounded-xl bg-white p-4 border border-[var(--lc-border)] shadow-sm">
 <div className="flex items-center gap-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
 <Icon className="h-4 w-4" />
 </div>
 <span className="text-sm font-semibold text-[var(--lc-muted)]">{label}</span>
 </div>
 <span className="text-xl font-display font-bold text-[var(--lc-ink)] tabular-nums">
 {value.toLocaleString()}
 </span>
 </div>
 );
}
