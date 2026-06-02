"use client";

import { Check, Clipboard, Download, FileText, Sparkles } from "lucide-react";
import { useState } from "react";

import { copyTextToClipboard } from "@/lib/clipboard";
import { downloadCsvFile, downloadTextFile } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import { cleanEmailList } from "@/lib/text-tools";

const SAMPLE_EMAIL_LIST = ` Sales@LeadCleanr.com
support@leadcleanr.com
invalid-email
hello@leadcleanr.com
sales@leadcleanr.com
 MEDIA@LeadCleanr.com `;

export function CleanEmailListTool() {
  const [input, setInput] = useState(SAMPLE_EMAIL_LIST);
  const [copied, setCopied] = useState(false);

  const { results, stats } = cleanEmailList(input);
  const resultText = results.join("\n");

  async function handleCopy() {
    if (!results.length) {
      return;
    }

    const didCopy = await copyTextToClipboard(resultText);

    if (!didCopy) {
      return;
    }

    trackToolEvent("clean-email-list", "copy_results", {
      result_count: results.length,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:rgba(15,118,110,0.14)] text-[color:var(--accent)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Clean email list online
            </h2>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Paste a raw email list to lowercase addresses, remove blanks,
              filter invalid entries, and deduplicate the final output.
            </p>
          </div>
        </div>

        <label htmlFor="email-list" className="mb-2 block text-sm font-semibold">
          Paste your email list
        </label>
        <textarea
          id="email-list"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-h-[18rem] w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white/70 px-4 py-4 text-base text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:rgba(15,118,110,0.12)]"
          placeholder="Paste one email per line or a mixed list separated by commas, spaces, or tabs."
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!results.length}
            className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy clean list"}
          </button>
          <button
            type="button"
            onClick={() => {
              trackToolEvent("clean-email-list", "download_txt", {
                result_count: results.length,
              });
              downloadTextFile("leadcleanr-clean-emails.txt", resultText);
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
              trackToolEvent("clean-email-list", "download_csv", {
                result_count: results.length,
              });
              downloadCsvFile("leadcleanr-clean-emails.csv", results);
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
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
            Cleaning stats
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatCard label="Entries scanned" value={stats.totalFound} />
            <StatCard
              label="Duplicates removed"
              value={stats.duplicatesRemoved}
            />
            <StatCard
              label="Invalid entries removed"
              value={stats.invalidRemoved}
            />
            <StatCard
              label="Clean emails ready"
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
                Ready for outreach tools, CRM imports, and CSV export.
              </p>
            </div>
            <span className="rounded-full bg-[color:rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
              Cleaned
            </span>
          </div>
          <div className="mt-4 min-h-[22rem] rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-white/70 p-4">
            {results.length ? (
              <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-7 text-[color:var(--foreground)]">
                {resultText}
              </pre>
            ) : (
              <p className="text-sm leading-7 text-[color:var(--muted)]">
                No valid email addresses detected yet. Paste a raw list to
                generate a cleaned result.
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
