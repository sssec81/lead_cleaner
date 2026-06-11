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
  Sparkles,
  Upload,
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
import { extractPhoneMatches } from "@/lib/text-tools";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";

type ExtractionSummary = {
  totalRows: number;
  blankRowsSkipped: number;
  invalidPhonesRemoved: number;
  duplicatesRemoved: number;
  cleanPhonesReady: number;
};

type UploadStatus = "idle" | "parsing" | "ready" | "error";
const PREVIEW_LIMIT = 100;
const DEMO_CSV = `name,phone,company
Jane Doe,+14155550101,Acme
Support Team,415-555-0101,Acme
Broken,not-a-phone,Example Co
John Smith,+44 20 7946 0958,Northstar
Duplicate,(415) 555-0101,Acme`;

export function ExtractPhonesFromCsvTool() {
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
    () => extractPhonesFromCsvRows(rows, selectedColumn),
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
      "leadcleanr:extract-phone-csv:preferred-column",
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

    trackToolEvent("extract-phones-from-csv", "upload_started", {
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
          trackToolEvent("extract-phones-from-csv", "upload_failed", {
            reason: "missing_headers",
          });
          return;
        }

        const nextDetections = detectCsvColumns(nextHeaders, nextRows);
        const storedPreferredColumn =
          typeof window !== "undefined"
            ? window.localStorage.getItem("leadcleanr:extract-phone-csv:preferred-column")
            : null;
        setHeaders(nextHeaders);
        setRows(nextRows);
        setDetections(nextDetections);
        setSelectedColumn((current) =>
          current && nextHeaders.includes(current)
            ? current
            : storedPreferredColumn && nextHeaders.includes(storedPreferredColumn)
              ? storedPreferredColumn
            : pickDefaultPhoneColumn(nextHeaders, nextDetections),
        );
        setStatus("ready");

        if (!nextRows.length) {
          setWarning(
            "We found the header row, but there are no data rows to extract from yet.",
          );
        } else if (result.warnings.length) {
          setWarning(buildWarningSummary(result.warnings));
        }

        trackToolEvent("extract-phones-from-csv", "upload_completed", {
          row_count: nextRows.length,
          warning_count: result.warnings.length,
        });
      },
      onError: (message) => {
        resetState(file.name);
        setStatus("error");
        setError(message);
        trackToolEvent("extract-phones-from-csv", "upload_failed", {
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
    setSelectedColumn(pickDefaultPhoneColumn(result.headers, nextDetections));
    setStatus("ready");

    if (result.warnings.length) {
      setWarning(buildWarningSummary(result.warnings));
    }

    trackToolEvent("extract-phones-from-csv", "load_demo");
  }

  async function handleCopy() {
    if (!extracted.results.length) {
      return;
    }

    const didCopy = await copyTextToClipboard(extracted.results.join("\n"));

    if (!didCopy) {
      return;
    }

    trackToolEvent("extract-phones-from-csv", "copy_results", {
      result_count: extracted.results.length,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const isParsing = status === "parsing";
  const recommendedDetection = pickBestDetection(detections, ["phone"]);
  const selectedDetection = detections.find(
    (detection) => detection.header === selectedColumn,
  );

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="panel-soft w-full xl:w-[380px] shrink-0 rounded-[2.2rem] p-5 sm:p-7 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:rgba(37,99,235,0.08)] text-[color:#2563eb]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                Extract Phones from CSV
              </p>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                Upload, isolate, export
              </p>
            </div>
          </div>

          <label
            htmlFor="csv-phone-upload"
            className="group mt-5 flex min-h-[20rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-8 text-center transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/50"
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
              <span className="mt-2 max-w-sm text-xs leading-relaxed text-[color:var(--muted)]">
                or click to browse local files.
              </span>
              {!isParsing && (
                <div className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md cursor-pointer">
                  Upload CSV to Start
                </div>
              )}
            </div>
            <input
              id="csv-phone-upload"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={handleFileUpload}
              disabled={isParsing}
            />
          </label>

          <p className="mt-3 text-xs leading-relaxed text-slate-500 text-center">
            Processed locally in your browser. Your CSV is never uploaded.<br />
            <span className="text-[11px] text-slate-400 font-medium">(Supports files up to 5 MB)</span>
          </p>

          {/* Workflow Stepper */}
          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Workflow Steps
            </p>
            <div className="space-y-3">
              {[
                { step: 1, label: "Upload CSV" },
                { step: 2, label: "Choose phone column" },
                { step: 3, label: "Preview clean phones" },
                { step: 4, label: "Export list" }
              ].map(({ step, label }) => {
                const isActive = currentStep === step;
                const isCompleted = currentStep > step;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold border transition ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : isCompleted
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-white text-slate-400 border-slate-200"
                      }`}
                    >
                      {isCompleted ? <Check className="h-3 w-3 text-emerald-600" /> : step}
                    </div>
                    <span
                      className={`text-xs font-medium transition ${
                        isActive
                          ? "text-slate-900 font-semibold"
                          : isCompleted
                            ? "text-slate-500 font-medium"
                            : "text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:rgba(248,250,252,0.82)] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:#38586b]">
              Quick start
            </p>
            <div className="mt-2">
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
                  htmlFor="phone-column-select"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]"
                >
                  Phone column
                </label>
                <select
                  id="phone-column-select"
                  value={selectedColumn}
                  onChange={(event) => {
                    setSelectedColumn(event.target.value);
                    trackToolEvent("extract-phones-from-csv", "change_column", {
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
        <div className="panel-soft rounded-[2.2rem] p-5 sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
              Extraction stats
            </p>
            <div className="mt-5 rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(37,99,235,0.05),rgba(255,255,255,0.9))] p-6 border border-slate-200/60 shadow-[0_14px_30px_rgba(15,23,42,0.04)] relative overflow-hidden">
                <div className="absolute right-0 top-0 h-40 w-40 bg-[color:rgba(37,99,235,0.04)] rounded-full blur-2xl -mr-10 -mt-10" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 relative z-10">
                  Clean phones ready
                </p>
                <p className="mt-3 font-display text-6xl font-bold leading-none tabular-nums text-slate-900 sm:text-7xl relative z-10">
                  {extracted.summary.cleanPhonesReady.toLocaleString()}
                </p>
                {selectedColumn && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-100 relative z-10">
                    <span className="font-bold uppercase tracking-wider text-[10px]">Active Column:</span>
                    <span className="font-mono font-semibold bg-white px-1.5 py-0.5 rounded border border-blue-200/50 text-slate-800">{selectedColumn}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Rows scanned" value={extracted.summary.totalRows} icon={<FileSpreadsheet className="h-4 w-4 text-blue-500" />} />
                <StatCard
                  label="Blank rows removed"
                  value={extracted.summary.blankRowsSkipped}
                  icon={<FileMinus className="h-4 w-4 text-slate-400" />}
                />
                <StatCard
                  label="Invalid removed"
                  value={extracted.summary.invalidPhonesRemoved}
                  icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
                />
                <StatCard
                  label="Duplicates removed"
                  value={extracted.summary.duplicatesRemoved}
                  icon={<CopyMinus className="h-4 w-4 text-amber-500" />}
                />
              </div>
            </div>

            <div className="panel-soft rounded-[2.2rem] p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold">
                    Preview extracted phones
                  </h3>
                  <p className="text-sm leading-6 text-[color:var(--muted)]">
                    Showing up to {PREVIEW_LIMIT} clean phones after extraction.
                  </p>
                </div>
                <span className="rounded-full bg-[color:rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                  Preview
                </span>
              </div>

              <div
                className={`mt-4 rounded-[1.5rem] border border-slate-200/80 bg-white/60 p-4 shadow-xs flex flex-col ${
                  extracted.results.length
                    ? "justify-start"
                    : "min-h-[22rem] justify-center"
                }`}
              >
                {extracted.results.length ? (
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 p-2">
                    {extracted.results.slice(0, PREVIEW_LIMIT).join("\n")}
                  </pre>
                ) : status === "ready" && headers.length ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                    <AlertCircle className="h-8 w-8 text-amber-500 mb-3" />
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">No clean phones found</h4>
                    <p className="max-w-md text-xs leading-relaxed text-slate-500">
                      This file uploaded successfully, but the chosen column did not contain any valid phone addresses. Please try selecting a different column.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs mb-4">
                      <ScanSearch className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Ready to Preview</h4>
                    <p className="max-w-md text-xs leading-relaxed text-slate-500 mb-6">
                      Upload a CSV to detect phone columns, choose the one you want, and preview clean extracted phones before export.
                    </p>
                    <div className="grid gap-3 w-full sm:grid-cols-3">
                      {[
                        {
                          title: "Phone columns detected",
                          desc: "Scans headers and analyzes row contents.",
                        },
                        {
                          title: "Invalid & blank skipped",
                          desc: "Trims whitespace, filters missing values, and validates formats.",
                        },
                        {
                          title: "Duplicates removed",
                          desc: "Deduplicates entries instantly to keep your list unique.",
                        },
                      ].map((benefit, i) => (
                        <div key={i} className="rounded-xl border border-slate-100 bg-white p-3 text-left">
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600 border border-blue-100/50">
                              {i + 1}
                            </div>
                            <p className="text-xs font-semibold text-slate-800 leading-tight">{benefit.title}</p>
                          </div>
                          <p className="mt-1.5 text-[10px] leading-relaxed text-slate-400">{benefit.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {!extracted.results.length && (
                  <p className="text-xs leading-relaxed text-slate-400">
                    Export unlocks after a CSV is uploaded and an phone column is selected.
                  </p>
                )}
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!extracted.results.length}
                    className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold shadow-sm transition cursor-pointer ${
                      extracted.results.length
                        ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                        : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    } px-5`}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy phones"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      trackToolEvent("extract-phones-from-csv", "download_txt", {
                        result_count: extracted.results.length,
                      });
                      downloadTextFile(
                        buildExportName(fileName, "txt"),
                        extracted.results.join("\n"),
                      );
                    }}
                    disabled={!extracted.results.length}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    Download TXT
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      trackToolEvent("extract-phones-from-csv", "download_csv", {
                        result_count: extracted.results.length,
                      });
                      downloadCsvFile(
                        buildExportName(fileName, "csv"),
                        extracted.results,
                        "phone",
                      );
                    }}
                    disabled={!extracted.results.length}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </button>
                </div>
              </div>
            </div>

            <ProWaitlistCard
              trackSource="extract_csv_sidebar"
              title="Want saved workflows and export presets?"
              description="Join the Pro waitlist to get notified when we launch saved cleanup presets, CSV presets for CRM (HubSpot, Salesforce), and outreach tools."
              className="mt-5"
            />
        </div>
      </div>
  );
}

function extractPhonesFromCsvRows(
  rows: CsvRow[],
  selectedColumn: string,
): { results: string[]; summary: ExtractionSummary } {
  if (!selectedColumn) {
    return {
      results: [],
      summary: {
        totalRows: rows.length,
        blankRowsSkipped: 0,
        invalidPhonesRemoved: 0,
        duplicatesRemoved: 0,
        cleanPhonesReady: 0,
      },
    };
  }

  let blankRowsSkipped = 0;
  let invalidPhonesRemoved = 0;
  let duplicatesRemoved = 0;
  const seen = new Set<string>();
  const cleanPhones: string[] = [];

  rows.forEach((row) => {
    const rawValue = String(row[selectedColumn] ?? "").trim();

    if (!rawValue) {
      blankRowsSkipped += 1;
      return;
    }

    const extractedPhones = extractPhoneMatches(rawValue);

    if (!extractedPhones.length) {
      invalidPhonesRemoved += 1;
      return;
    }

    extractedPhones.forEach((phone) => {
      if (seen.has(phone)) {
        duplicatesRemoved += 1;
        return;
      }

      seen.add(phone);
      cleanPhones.push(phone);
    });
  });

  return {
    results: cleanPhones,
    summary: {
      totalRows: rows.length,
      blankRowsSkipped,
      invalidPhonesRemoved,
      duplicatesRemoved,
      cleanPhonesReady: cleanPhones.length,
    },
  };
}

function pickDefaultPhoneColumn(
  headers: string[],
  detections: CsvColumnDetection[],
) {
  const recommendedDetection = pickBestDetection(detections, ["phone"]);
  if (recommendedDetection) {
    return recommendedDetection.header;
  }

  return (
    headers.find((header) => header.toLowerCase().includes("phone")) ??
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
  const baseName = fileName.replace(/\.csv$/i, "") || "leadcleanr-phones";
  return `${baseName}-phones.${extension}`;
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
