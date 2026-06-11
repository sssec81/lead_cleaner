"use client";

import {
  AlertCircle,
  AlertTriangle,
  Check,
  Clipboard,
  CopyMinus,
  Download,
  FileMinus,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  LoaderCircle,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { copyTextToClipboard } from "@/lib/clipboard";
import {
  detectCsvColumns,
  type CsvColumnDetection,
  type CsvParseProgress,
  type CsvRow,
  inspectCsvFile,
  isLikelyCsvFile,
  MAX_CSV_FILE_SIZE,
  parseCsvFile,
  parseCsvText,
} from "@/lib/csv";
import { downloadCsvFile, downloadTextFile } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import { extractEmailMatches } from "@/lib/text-tools";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";

type ExtractionSummary = {
  totalRows: number;
  blankRowsSkipped: number;
  invalidEmailsRemoved: number;
  duplicatesRemoved: number;
  cleanEmailsReady: number;
};

type UploadStatus = "idle" | "parsing" | "ready" | "error";

const PREVIEW_LIMIT = 100;
const DEMO_CSV = `name,email,company
Jane Doe,jane@acme.com,Acme
Support Team,support@acme.com,Acme
Broken,not-an-email,Example Co
John Smith,john@northstar.io,Northstar
Duplicate,jane@acme.com,Acme`;

export function ExtractEmailsFromCsvTool() {
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [detections, setDetections] = useState<CsvColumnDetection[]>([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [pendingFile, setPendingFile] = useState<{
    name: string;
    sizeMb: number;
    exceedsFreeLimit: boolean;
    estimatedRows: number | null;
    estimatedRowsWithinFreeLimit: number | null;
  } | null>(null);
  const [progress, setProgress] = useState<CsvParseProgress>({
    percentage: 0,
    rowsProcessed: 0,
  });

  const extracted = useMemo(
    () => extractEmailsFromCsvRows(rows, selectedColumn),
    [rows, selectedColumn],
  );

  const currentStep = useMemo(() => {
    if (status === "idle" || status === "parsing") {
      return 1;
    }
    if (status === "ready") {
      if (!selectedColumn) {
        return 2;
      }
      if (extracted.results.length === 0) {
        return 3;
      }
      return 4;
    }
    return 1;
  }, [status, selectedColumn, extracted.results]);

  function resetState(nextFileName = "") {
    setFileName(nextFileName);
    setHeaders([]);
    setRows([]);
    setDetections([]);
    setSelectedColumn("");
    setWarning("");
    setProgress({
      percentage: 0,
      rowsProcessed: 0,
    });
  }

  useEffect(() => {
    if (typeof window === "undefined" || !selectedColumn) {
      return;
    }

    window.localStorage.setItem(
      "leadcleanr:extract-email-csv:preferred-column",
      selectedColumn,
    );
  }, [selectedColumn]);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const inspection = await inspectCsvFile(file);

    setPendingFile({
      name: file.name,
      sizeMb: file.size / (1024 * 1024),
      exceedsFreeLimit: file.size > MAX_CSV_FILE_SIZE,
      estimatedRows: inspection.estimatedRows,
      estimatedRowsWithinFreeLimit: inspection.estimatedRowsWithinFreeLimit,
    });

    trackToolEvent("extract-emails-from-csv", "upload_started", {
      file_size_kb: Math.round(file.size / 1024),
    });

    if (!isLikelyCsvFile(file)) {
      resetState();
      setStatus("error");
      setError("Please upload a real CSV file with a .csv extension.");
      return;
    }

    if (file.size > MAX_CSV_FILE_SIZE) {
      resetState();
      setStatus("error");
      setError(
        "The free CSV limit is 5 MB. Upgrade to Pro when you need larger file cleanup.",
      );
      return;
    }

    resetState(file.name);
    setError("");
    setStatus("parsing");

    parseCsvFile({
      file,
      onProgress: (nextProgress) => {
        setProgress(nextProgress);
      },
      onComplete: (result) => {
        const nextHeaders = result.headers;
        const nextRows = result.rows;

        if (!nextHeaders.length) {
          resetState(file.name);
          setStatus("error");
          setError("We could not detect any CSV columns in that file.");
          trackToolEvent("extract-emails-from-csv", "upload_failed", {
            reason: "missing_headers",
          });
          return;
        }

        const nextDetections = detectCsvColumns(nextHeaders, nextRows);
        const storedPreferredColumn =
          typeof window !== "undefined"
            ? window.localStorage.getItem("leadcleanr:extract-email-csv:preferred-column")
            : null;
        setHeaders(nextHeaders);
        setRows(nextRows);
        setDetections(nextDetections);
        setSelectedColumn((current) =>
          current && nextHeaders.includes(current)
            ? current
            : storedPreferredColumn && nextHeaders.includes(storedPreferredColumn)
              ? storedPreferredColumn
            : pickDefaultEmailColumn(nextHeaders, nextDetections),
        );
        setStatus("ready");

        if (!nextRows.length) {
          setWarning(
            "We found the header row, but there are no data rows to extract from yet.",
          );
        } else if (result.warnings.length) {
          setWarning(buildWarningSummary(result.warnings));
        }

        trackToolEvent("extract-emails-from-csv", "upload_completed", {
          row_count: nextRows.length,
          warning_count: result.warnings.length,
        });
      },
      onError: (message) => {
        resetState(file.name);
        setStatus("error");
        setError(message);
        trackToolEvent("extract-emails-from-csv", "upload_failed", {
          reason: "parse_error",
        });
      },
    });
  }

  function loadDemoCsv() {
    const result = parseCsvText(DEMO_CSV);
    const nextDetections = detectCsvColumns(result.headers, result.rows);

    resetState("leadcleanr-demo.csv");
    setPendingFile({
      name: "leadcleanr-demo.csv",
      sizeMb: DEMO_CSV.length / (1024 * 1024),
      exceedsFreeLimit: false,
      estimatedRows: result.rows.length,
      estimatedRowsWithinFreeLimit: result.rows.length,
    });
    setError("");
    setHeaders(result.headers);
    setRows(result.rows);
    setDetections(nextDetections);
    setSelectedColumn(pickDefaultEmailColumn(result.headers, nextDetections));
    setStatus("ready");

    if (result.warnings.length) {
      setWarning(buildWarningSummary(result.warnings));
    }

    trackToolEvent("extract-emails-from-csv", "load_demo");
  }

  async function handleCopy() {
    if (!extracted.results.length) {
      return;
    }

    const didCopy = await copyTextToClipboard(extracted.results.join("\n"));

    if (!didCopy) {
      return;
    }

    trackToolEvent("extract-emails-from-csv", "copy_results", {
      result_count: extracted.results.length,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const isParsing = status === "parsing";
  const recommendedDetection = pickBestDetection(detections, ["email"]);
  const selectedDetection = detections.find(
    (detection) => detection.header === selectedColumn,
  );
  const hasReadyResults = extracted.results.length > 0;
  const hasUploadedRows = status === "ready" && rows.length > 0;
  const showStats = hasUploadedRows;

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="flex w-full flex-col gap-6 xl:w-[380px] shrink-0">
        <section className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color:rgba(37,99,235,0.08)] text-[color:#2563eb]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-slate-950">
                Extract Emails from CSV
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Upload, isolate, export
              </p>
            </div>
          </div>

          <label
            htmlFor="csv-email-upload"
            className="group mt-2 flex min-h-[16rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-8 text-center transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/50"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[color:rgba(37,99,235,0.1)] bg-[color:rgba(37,99,235,0.04)] text-[color:#2563eb] shadow-[0_8px_24px_rgba(37,99,235,0.02)] transition-all duration-300 group-hover:scale-105 group-hover:bg-white">
                {isParsing ? (
                  <LoaderCircle className="h-6 w-6 animate-spin text-[color:var(--brand-strong)]" />
                ) : (
                  <Upload className="h-6 w-6 text-[color:var(--brand-strong)]" />
                )}
              </div>
              <span className="mt-4 text-base font-semibold text-slate-800">
                {isParsing ? "Parsing your CSV..." : "Drag and drop your lead CSV here"}
              </span>
              <span className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                or click to browse local files.
              </span>
              {!isParsing && (
                <div className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md cursor-pointer">
                  Upload CSV to Start
                </div>
              )}
            </div>
            <input
              id="csv-email-upload"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={handleFileUpload}
              disabled={isParsing}
            />
          </label>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: ShieldCheck, label: "Processed locally", color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: FileSpreadsheet, label: "Never uploaded", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Zap, label: "Browser only", color: "text-amber-600", bg: "bg-amber-50" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-2 py-3 text-center shadow-sm"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.bg} ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700 leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 text-center">
            Supports files up to 5 MB on the free plan.
          </p>

        </section>

        <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-base font-semibold text-slate-900">Workflow</h3>
          <p className="mt-1 text-sm text-slate-500">
            Note the classic validation flow designed dashboard by words, hugging and lines. Inspired by Linear.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3 py-2">
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 shadow-sm">
              <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Upload CSV</span>
            </div>
            <div className="h-[2px] w-4 sm:w-8 bg-slate-200 shrink-0"></div>
            <div className="flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 shadow-sm">
              <span className="text-xs font-semibold text-blue-700 whitespace-nowrap">Extract</span>
            </div>
            <div className="h-[2px] w-4 sm:w-8 bg-slate-200 shrink-0"></div>
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Export</span>
            </div>
          </div>
        </section>

          <div className="mt-4 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:rgba(248,250,252,0.82)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:#38586b]">
              Quick start
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Try the sample to see the exact before-to-after flow.
            </p>
            <div className="mt-3">
              <button
                type="button"
                onClick={loadDemoCsv}
                className="w-full inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 hover:shadow-2xs active:bg-slate-100"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                Try sample CSV
              </button>
            </div>
          </div>

          {pendingFile ? <FileSizeNotice pendingFile={pendingFile} /> : null}

          {isParsing ? (
            <div className="mt-4 rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-[color:var(--foreground)]">
                  Reading rows
                </span>
                <span className="tabular-nums text-[color:var(--muted)]">
                  {progress.percentage}%
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:rgba(17,36,51,0.08)]">
                <div
                  className="h-full rounded-full bg-[color:var(--brand)] transition-[width]"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {progress.rowsProcessed.toLocaleString()} rows processed so far.
              </p>
            </div>
          ) : null}

          {headers.length ? (
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                  Active File
                </p>
                <p className="mt-1 text-sm font-semibold truncate text-slate-800">
                  {fileName || "No CSV uploaded yet"}
                </p>
                {rows.length ? (
                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    {rows.length.toLocaleString()} raw rows loaded
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
                <label
                  htmlFor="email-column-select"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]"
                >
                  Email column
                </label>
                <select
                  id="email-column-select"
                  value={selectedColumn}
                  onChange={(event) => {
                    setSelectedColumn(event.target.value);
                    trackToolEvent("extract-emails-from-csv", "change_column", {
                      column: event.target.value,
                    });
                  }}
                  disabled={!headers.length || isParsing}
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white px-3 text-sm text-slate-800 outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-blue-500/10 transition"
                >
                  {headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
                {selectedDetection ? (
                  <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-teal-50/50 border border-teal-100/50 px-3 py-1.5 text-xs text-teal-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ScanSearch className="h-3.5 w-3.5 text-teal-600" />
                      Type: {prettyColumnType(selectedDetection.type)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600/80">
                      {selectedDetection.confidence}% match
                    </span>
                  </div>
                ) : null}
                {recommendedDetection &&
                recommendedDetection.header !== selectedColumn ? (
                  <button
                    type="button"
                    onClick={() => setSelectedColumn(recommendedDetection.header)}
                    className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                    Use suggested column: {recommendedDetection.header} ({recommendedDetection.confidence}%)
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
          {warning ? <InlineMessage tone="warning">{warning}</InlineMessage> : null}
        </div>

      <div className="flex-1 min-w-0 space-y-6">
        <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-5 sm:p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Workspace Summary
            </p>
            {showStats ? (
              <>
                <div className="mt-4 flex flex-col gap-4">
                  <div className={`rounded-2xl p-6 border relative overflow-hidden transition-all duration-300 ${
                    extracted.summary.cleanEmailsReady > 0
                      ? 'bg-[linear-gradient(180deg,rgba(16,185,129,0.06),rgba(255,255,255,0.94))] border-emerald-200/60 shadow-sm'
                      : 'bg-[linear-gradient(180deg,rgba(37,99,235,0.04),rgba(255,255,255,0.94))] border-slate-200/60 shadow-[0_12px_24px_rgba(15,23,42,0.03)]'
                  }`}>
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full blur-2xl -mr-10 -mt-10"
                      style={{ backgroundColor: extracted.summary.cleanEmailsReady > 0 ? 'rgba(16,185,129,0.06)' : 'rgba(37,99,235,0.04)' }}
                    />
                    <div className="flex items-baseline gap-4">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-[0.18em] relative z-10 ${
                          extracted.summary.cleanEmailsReady > 0 ? 'text-emerald-600' : 'text-slate-500'
                        }`}>
                          FINAL COUNT
                        </p>
                        <p className={`mt-2 font-display text-5xl font-bold leading-none tabular-nums sm:text-6xl relative z-10 ${
                          extracted.summary.cleanEmailsReady > 0 ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          {extracted.summary.cleanEmailsReady.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {extracted.summary.cleanEmailsReady > 0 && (
                      <p className="mt-2 text-sm text-emerald-600/80 relative z-10 max-w-lg">Ready for outreach, CRM, or recruiting import.</p>
                    )}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Rows scanned" value={extracted.summary.totalRows} icon={<FileSpreadsheet className="h-4 w-4 text-blue-500" />} />
                    <StatCard
                      label="Blank rows removed"
                      value={extracted.summary.blankRowsSkipped}
                      icon={<FileMinus className="h-4 w-4 text-slate-400" />}
                    />
                    <StatCard
                      label="Invalid removed"
                      value={extracted.summary.invalidEmailsRemoved}
                      icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
                    />
                    <StatCard
                      label="Duplicates removed"
                      value={extracted.summary.duplicatesRemoved}
                      icon={<CopyMinus className="h-4 w-4 text-amber-500" />}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-[1.7rem] border border-dashed border-slate-200 bg-white/60 p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <p className="text-base font-semibold text-slate-900">
                  Upload a CSV to see extraction results
                </p>
                <p className="mt-2 mx-auto max-w-md text-sm leading-6 text-slate-500">
                  Once your file is loaded, we’ll show rows scanned, invalid emails removed, duplicates removed, and the final clean count.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display text-xl font-semibold">
                    Results
                  </h3>
                  <p className="text-sm leading-6 text-slate-500">
                    {hasReadyResults
                      ? `Showing up to ${PREVIEW_LIMIT} clean emails after extraction.`
                      : "This is the output you will get after upload, column selection, and cleanup."}
                  </p>
                </div>
                
                {hasReadyResults && (
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 cursor-pointer"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy All"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        trackToolEvent("extract-emails-from-csv", "download_txt", {
                          result_count: extracted.results.length,
                        });
                        downloadTextFile(
                          buildExportName(fileName, "txt"),
                          extracted.results.join("\n"),
                        );
                      }}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition shadow-xs cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      TXT
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        trackToolEvent("extract-emails-from-csv", "download_csv", {
                          result_count: extracted.results.length,
                        });
                        downloadCsvFile(
                          buildExportName(fileName, "csv"),
                          extracted.results,
                          "email",
                        );
                      }}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition shadow-xs cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      CSV
                    </button>
                  </div>
                )}
              </div>

              <div
                className={`mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col ${
                  extracted.results.length
                    ? "justify-start"
                    : "min-h-[22rem] justify-center"
                }`}
              >
                {extracted.results.length ? (
                  <div className="max-h-[52rem] overflow-auto">
                    <table className="w-full min-w-[500px] border-collapse text-left text-sm">
                      <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/90 backdrop-blur-sm">
                        <tr>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 w-16">
                            #
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 w-24">
                            STATUS
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            VALUE
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {extracted.results.slice(0, PREVIEW_LIMIT).map((email, idx) => (
                          <tr key={idx} className="group hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-3.5 text-xs font-medium text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200/50 bg-emerald-50/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                Valid
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-sm font-medium text-slate-700">
                              {email}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : status === "ready" && headers.length ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                    <AlertCircle className="h-8 w-8 text-amber-500 mb-3" />
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">No clean emails found</h4>
                    <p className="max-w-md text-xs leading-relaxed text-slate-500">
                      This file uploaded successfully, but the chosen column did not contain any valid email addresses. Please try selecting a different column.
                    </p>
                  </div>
                ) : (
                  <div className="h-full">
                    <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          Sample extracted list
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          The preview becomes your real cleaned list after upload.
                        </p>
                      </div>
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                        Export Ready
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                      <div className="border-b border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        email
                      </div>
                      <div className="space-y-2 px-4 py-4 font-mono text-sm text-emerald-300 blur-[0.3px]">
                        <div>jane@acme.com</div>
                        <div>john@northstar.io</div>
                        <div>sarah@agency.co</div>
                        <div>team@riverlabs.ai</div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {[
                        "Upload your CSV",
                        "Choose the detected email column",
                        "Export a clean deduplicated list",
                      ].map((step, index) => (
                        <div key={step} className="rounded-xl border border-slate-100 bg-white p-3 text-left">
                          <div className="mb-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <p className="text-xs font-semibold leading-relaxed text-slate-800">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function extractEmailsFromCsvRows(
  rows: CsvRow[],
  selectedColumn: string,
): { results: string[]; summary: ExtractionSummary } {
  if (!selectedColumn) {
    return {
      results: [],
      summary: {
        totalRows: rows.length,
        blankRowsSkipped: 0,
        invalidEmailsRemoved: 0,
        duplicatesRemoved: 0,
        cleanEmailsReady: 0,
      },
    };
  }

  let blankRowsSkipped = 0;
  let invalidEmailsRemoved = 0;
  let duplicatesRemoved = 0;
  const seen = new Set<string>();
  const cleanEmails: string[] = [];

  rows.forEach((row) => {
    const rawValue = String(row[selectedColumn] ?? "").trim();

    if (!rawValue) {
      blankRowsSkipped += 1;
      return;
    }

    const extractedEmails = extractEmailMatches(rawValue);

    if (!extractedEmails.length) {
      invalidEmailsRemoved += 1;
      return;
    }

    extractedEmails.forEach((email) => {
      if (seen.has(email)) {
        duplicatesRemoved += 1;
        return;
      }

      seen.add(email);
      cleanEmails.push(email);
    });
  });

  return {
    results: cleanEmails,
    summary: {
      totalRows: rows.length,
      blankRowsSkipped,
      invalidEmailsRemoved,
      duplicatesRemoved,
      cleanEmailsReady: cleanEmails.length,
    },
  };
}

function pickDefaultEmailColumn(
  headers: string[],
  detections: CsvColumnDetection[],
) {
  const recommendedDetection = pickBestDetection(detections, ["email"]);
  if (recommendedDetection) {
    return recommendedDetection.header;
  }

  return (
    headers.find((header) => header.toLowerCase().includes("email")) ??
    headers[0] ??
    ""
  );
}

function pickBestDetection(
  detections: CsvColumnDetection[],
  preferredTypes: Array<CsvColumnDetection["type"]>,
) {
  return detections
    .filter((detection) => preferredTypes.includes(detection.type))
    .sort((left, right) => right.confidence - left.confidence)[0];
}

function buildExportName(fileName: string, extension: "txt" | "csv") {
  const baseName = fileName.replace(/\.csv$/i, "") || "leadcleanr-emails";
  return `${baseName}-emails.${extension}`;
}

function buildWarningSummary(warnings: string[]) {
  const preview = warnings.slice(0, 2).join(" ");
  const suffix =
    warnings.length > 2 ? ` ${warnings.length - 2} more parsing issues found.` : "";
  return `We imported the readable rows, but found CSV formatting issues. ${preview}${suffix}`;
}

function InlineMessage({
  children,
  tone,
}: {
  children: string;
  tone: "error" | "warning";
}) {
  const palette =
    tone === "error"
      ? "border-[color:rgba(185,28,28,0.18)] bg-[color:rgba(254,242,242,0.9)] text-red-700"
      : "border-[color:rgba(217,119,6,0.18)] bg-[color:rgba(255,247,237,0.9)] text-amber-800";

  return (
    <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${palette}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{children}</p>
      </div>
    </div>
  );
}

function FileSizeNotice({
  pendingFile,
}: {
  pendingFile: {
    name: string;
    sizeMb: number;
    exceedsFreeLimit: boolean;
    estimatedRows: number | null;
    estimatedRowsWithinFreeLimit: number | null;
  };
}) {
  const toneClasses = pendingFile.exceedsFreeLimit
    ? "border-[color:rgba(217,119,6,0.2)] bg-[color:rgba(255,247,237,0.92)]"
    : "border-[color:rgba(15,118,110,0.18)] bg-[color:rgba(240,253,250,0.9)]";

  return (
    <div className="space-y-4">
      <div className={`mt-3 rounded-[1.3rem] border p-4 ${toneClasses}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[color:var(--foreground)]">
              {pendingFile.name} · {pendingFile.sizeMb.toFixed(1)} MB
            </p>
            <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
              {pendingFile.exceedsFreeLimit
                ? `This file is over the 5 MB free limit. It looks like about ${formatRowEstimate(pendingFile.estimatedRows)} rows. Free typically fits around ${formatRowEstimate(pendingFile.estimatedRowsWithinFreeLimit)} rows of this density.`
                : `This file fits inside the free 5 MB limit and looks like about ${formatRowEstimate(pendingFile.estimatedRows)} rows for browser-side processing.`}
            </p>
          </div>
        </div>
      </div>
      {pendingFile.exceedsFreeLimit && (
        <ProWaitlistCard
          trackSource="extract_csv_limit"
          title="Need larger CSV files?"
          description="Join the Pro waitlist to get notified when we support uploads up to 100MB / 100,000+ rows, saved cleanup workflows, and export presets."
        />
      )}
    </div>
  );
}

function formatRowEstimate(value: number | null) {
  if (!value) {
    return "a few thousand";
  }

  return value.toLocaleString();
}

function prettyColumnType(type: CsvColumnDetection["type"]) {
  if (type === "url") {
    return "URL";
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-base font-semibold text-[color:var(--foreground)]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 hover:shadow-xs ${
        accent
          ? "border-emerald-100 bg-emerald-50/40"
          : "border-slate-200/60 bg-white/70 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="mt-3 text-2xl font-bold tabular-nums text-slate-900">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
