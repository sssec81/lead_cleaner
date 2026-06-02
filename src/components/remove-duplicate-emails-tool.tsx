"use client";

import { Check, Clipboard, CopyMinus, Download, FileText } from "lucide-react";
import { useState } from "react";

import { copyTextToClipboard } from "@/lib/clipboard";
import { downloadCsvFile, downloadTextFile } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import { removeDuplicateEmails } from "@/lib/text-tools";

const SAMPLE_EMAIL_LIST = `team@leadcleanr.com
sales@leadcleanr.com
TEAM@LEADCLEANR.COM
hello@leadcleanr.com
invalid-email
sales@leadcleanr.com
media@leadcleanr.com`;

export function RemoveDuplicateEmailsTool() {
  const [input, setInput] = useState(SAMPLE_EMAIL_LIST);
  const [copied, setCopied] = useState(false);

  const { results, stats } = removeDuplicateEmails(input);
  const resultText = results.join("\n");

  async function handleCopy() {
    if (!results.length) {
      return;
    }

    const didCopy = await copyTextToClipboard(resultText);

    if (!didCopy) {
      return;
    }

    trackToolEvent("remove-duplicate-emails", "copy_results", {
      result_count: results.length,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:rgba(217,119,6,0.14)] text-[color:var(--brand-strong)]">
            <CopyMinus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Remove duplicate emails
            </h2>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Paste a repeated email list to keep one clean copy of each valid
              address and drop the rest.
            </p>
          </div>
        </div>

        <label htmlFor="duplicate-email-list" className="mb-2 block text-sm font-semibold">
          Paste your email list
        </label>
        <textarea
          id="duplicate-email-list"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-h-[18rem] w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white/70 px-4 py-4 text-base text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:rgba(217,119,6,0.12)]"
          placeholder="Paste one email per line or a mixed list separated by commas, spaces, or tabs."
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!results.length}
            className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            {copied ? "Copied" : "Copy deduplicated list"}
          </button>
          <button
            type="button"
            onClick={() => {
              trackToolEvent("remove-duplicate-emails", "download_txt", {
                result_count: results.length,
              });
              downloadTextFile("leadcleanr-deduplicated-emails.txt", resultText);
            }}
            disabled={!results.length}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white/70 px-5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            Download TXT
          </button>
          <button
            type="button"
            onClick={() => {
              trackToolEvent("remove-duplicate-emails", "download_csv", {
                result_count: results.length,
              });
              downloadCsvFile("leadcleanr-deduplicated-emails.csv", results);
            }}
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
            Deduplication stats
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatCard label="Valid emails scanned" value={stats.totalFound} />
            <StatCard
              label="Duplicates removed"
              value={stats.duplicatesRemoved}
            />
            <StatCard
              label="Invalid entries removed"
              value={stats.invalidRemoved}
            />
            <StatCard
              label="Unique emails ready"
              value={stats.cleanResults}
              accent
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold">
                Deduplicated result
              </h3>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                One lowercase copy of each valid email, sorted for export.
              </p>
            </div>
            <span className="rounded-full bg-[color:rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
              Unique
            </span>
          </div>
          <div className="mt-4 min-h-[22rem] rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-white/70 p-4">
            {results.length ? (
              <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-7 text-[color:var(--foreground)]">
                {resultText}
              </pre>
            ) : (
              <p className="text-sm leading-7 text-[color:var(--muted)]">
                No valid email addresses detected yet. Paste a repeated list to
                generate a unique result.
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
