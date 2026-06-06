"use client";

import { useState } from "react";
import { Type, FileText, Hash, Pilcrow, AlignLeft } from "lucide-react";
import { trackToolEvent } from "@/lib/telemetry";

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

  function handleCopy() {
    if (!text) return;
    navigator.clipboard.writeText(text);
    trackToolEvent("count-words", "copy");
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Left Panel: Input */}
      <section className="flex flex-col flex-1 w-full max-w-3xl min-w-0 rounded-3xl border border-slate-200/60 bg-white/50 p-6 sm:p-8 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 shadow-sm">
            <Type className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Paste your text
            </h2>
            <p className="text-sm text-slate-500">
              Metrics update automatically as you type.
            </p>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here to instantly see word, character, and line counts..."
          className="w-full flex-1 min-h-[24rem] rounded-xl border border-slate-200 bg-white/80 p-4 text-sm leading-relaxed text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 resize-y"
        />

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50"
          >
            Copy Text
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!text}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </section>

      {/* Right Panel: Stats */}
      <section className="w-full lg:w-[360px] shrink-0 space-y-6">
        <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600 mb-6">
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
    <div className="flex items-center justify-between rounded-xl bg-white p-4 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <span className="text-xl font-display font-bold text-slate-900 tabular-nums">
        {value.toLocaleString()}
      </span>
    </div>
  );
}
