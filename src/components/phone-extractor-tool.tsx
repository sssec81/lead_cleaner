"use client";

import { Check, Clipboard, Download, FileText, Phone } from "lucide-react";
import { useState } from "react";

import { copyTextToClipboard } from "@/lib/clipboard";
import { downloadCsvFile, downloadTextFile } from "@/lib/export";
import { extractPhoneNumbersFromText } from "@/lib/text-tools";

const SAMPLE_TEXT = `Call sales at +1 (415) 555-0101 or support on 415-555-0101.
Our London line is +44 20 7946 0958 and backup is (020) 7946 0958.`;

export function PhoneExtractorTool() {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);

  const { results, stats } = extractPhoneNumbersFromText(input);
  const resultText = results.join("\n");

  async function handleCopy() {
    if (!results.length) {
      return;
    }

    const didCopy = await copyTextToClipboard(resultText);

    if (!didCopy) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.14)] text-[color:var(--brand-strong)]">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Extract phone numbers from text
            </h2>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Paste messy text, extract phone numbers, normalize formatting,
              remove duplicates, and export the clean list.
            </p>
          </div>
        </div>

        <label htmlFor="phone-raw-text" className="mb-2 block text-sm font-semibold">
          Paste your text
        </label>
        <textarea
          id="phone-raw-text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-h-[18rem] w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white/70 px-4 py-4 text-base text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:rgba(217,119,6,0.12)]"
          placeholder="Paste copied profiles, CRM notes, website text, or any messy block with phone numbers."
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!results.length}
            className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            {copied ? "Copied" : "Copy results"}
          </button>
          <button
            type="button"
            onClick={() => downloadTextFile("leadcleanr-phone-numbers.txt", resultText)}
            disabled={!results.length}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/70 px-5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            Download TXT
          </button>
          <button
            type="button"
            onClick={() =>
              downloadCsvFile("leadcleanr-phone-numbers.csv", results, "phone")
            }
            disabled={!results.length}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/70 px-5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-5 shadow-[var(--shadow)] sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Cleaning stats
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatCard label="Numbers found" value={stats.totalFound} />
            <StatCard
              label="Duplicates removed"
              value={stats.duplicatesRemoved}
            />
            <StatCard
              label="Invalid entries removed"
              value={stats.invalidRemoved}
            />
            <StatCard
              label="Clean numbers ready"
              value={stats.cleanResults}
              accent
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold">
                Clean result
              </h3>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                Normalized and deduplicated for fast export.
              </p>
            </div>
            <span className="rounded-full bg-[color:rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
              Ready
            </span>
          </div>
          <div className="mt-4 min-h-[22rem] rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-white/70 p-4">
            {results.length ? (
              <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-7 text-[color:var(--foreground)]">
                {resultText}
              </pre>
            ) : (
              <p className="text-sm leading-7 text-[color:var(--muted)]">
                No phone numbers detected yet. Paste text with numbers to
                generate a clean list.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border p-4 ${
        accent
          ? "border-[color:rgba(15,118,110,0.16)] bg-[color:rgba(15,118,110,0.08)]"
          : "border-[color:var(--line)] bg-white/75"
      }`}
    >
      <div className="text-sm text-[color:var(--muted)]">{label}</div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
