"use client";

import { Check, Clipboard, Download, FileText, Globe } from "lucide-react";
import { useState } from "react";

import { copyTextToClipboard } from "@/lib/clipboard";
import { downloadCsvFile, downloadTextFile } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import { extractDomainsFromEmails } from "@/lib/text-tools";

const SAMPLE_TEXT = `Sales team: sales@leadcleanr.com and support@LeadCleanr.com
Partners: hello@agencystack.io
Sites: https://leadcleanr.com/pricing, www.agencystack.io/about, and http://blog.leadcleanr.com/start`;

export function DomainExtractorTool() {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);

  const { results, stats } = extractDomainsFromEmails(input);
  const resultText = results.join("\n");

  async function handleCopy() {
    if (!results.length) {
      return;
    }

    const didCopy = await copyTextToClipboard(resultText);

    if (!didCopy) {
      return;
    }

    trackToolEvent("extract-domains-from-emails", "copy_results", {
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
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Extract domains from emails and URLs
            </h2>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Paste emails or website links, pull out the root domains, remove
              duplicates, and export the clean list.
            </p>
          </div>
        </div>

        <label htmlFor="domain-raw-text" className="mb-2 block text-sm font-semibold">
          Paste your text
        </label>
        <textarea
          id="domain-raw-text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-h-[18rem] w-full rounded-[1.5rem] border border-[color:var(--line)] bg-white/70 px-4 py-4 text-base text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:rgba(217,119,6,0.12)]"
          placeholder="Paste email addresses, website URLs, or any messy lead text with domains."
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
            onClick={() => {
              trackToolEvent("extract-domains-from-emails", "download_txt", {
                result_count: results.length,
              });
              downloadTextFile("leadcleanr-domains.txt", resultText);
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
              trackToolEvent("extract-domains-from-emails", "download_csv", {
                result_count: results.length,
              });
              downloadCsvFile("leadcleanr-domains.csv", results, "domain");
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
            Cleaning stats
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatCard label="Domains found" value={stats.totalFound} />
            <StatCard label="Duplicates removed" value={stats.duplicatesRemoved} />
            <StatCard label="Invalid entries removed" value={stats.invalidRemoved} />
            <StatCard label="Clean domains ready" value={stats.cleanResults} accent />
          </div>
        </div>

        <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold">
                Clean result
              </h3>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                Lowercased and deduplicated for fast export.
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
                No domains detected yet. Paste emails or URLs to generate a
                clean list.
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
