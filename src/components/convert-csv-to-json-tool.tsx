"use client";

import { useState } from "react";

import {
  Upload,
  FileJson,
  Download,
  AlertCircle,
  Check,
  FlaskConical,
  LoaderCircle,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";

import {
  type CsvParseProgress,
  type CsvRow,
  isLikelyCsvFile,
  MAX_CSV_FILE_SIZE,
  parseCsvFile,
  parseCsvText,
} from "@/lib/csv";
import { downloadJsonFile } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";

type UploadStatus = "idle" | "parsing" | "ready" | "error";

const SAMPLE_CSV = `id,name,email,role,status
1,John Doe,john@example.com,admin,active
2,Jane Smith,jane@example.com,user,pending
3,Bob Wilson,bob@example.com,user,active`;

export function ConvertCsvToJsonTool() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [progress, setProgress] = useState<CsvParseProgress>({
    percentage: 0,
    rowsProcessed: 0,
  });

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [copied, setCopied] = useState(false);

  function resetState() {
    setStatus("idle");
    setError(null);
    setFileName("");
    setHeaders([]);
    setRows([]);
    setCopied(false);
    setProgress({
      percentage: 0,
      rowsProcessed: 0,
    });
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    resetState();
    setFileName(file.name);

    if (file.size > MAX_CSV_FILE_SIZE) {
      setError("File is too large. Maximum supported size is 2 MB.");
      setStatus("error");
      return;
    }

    if (!isLikelyCsvFile(file)) {
      setError(
        "This doesn't look like a valid CSV file. Please check the format.",
      );
      setStatus("error");
      return;
    }

    try {
      setStatus("parsing");
      trackToolEvent("convert-csv-to-json", "upload_start", {
        file_size: file.size,
      });

      parseCsvFile({
        file,
        onProgress: (p) => setProgress(p),
        onComplete: (result) => {
          if (result.headers.length === 0) {
            setError("No headers found in the CSV file.");
            setStatus("error");
            return;
          }

          setHeaders(result.headers);
          setRows(result.rows);
          setStatus("ready");
          trackToolEvent("convert-csv-to-json", "upload_success", {
            row_count: result.rows.length,
          });
        },
        onError: (errMessage) => {
          setError(errMessage || "Unable to read the uploaded file.");
          setStatus("error");
          trackToolEvent("convert-csv-to-json", "upload_error", {
            error: errMessage || "Unknown error",
          });
        }
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during parsing.",
      );
      setStatus("error");
      trackToolEvent("convert-csv-to-json", "upload_error", {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    if (event.target) {
      event.target.value = "";
    }
  }

  function loadDemoCsv() {
    resetState();
    setStatus("parsing");
    setFileName("sample-data.csv");

    setTimeout(() => {
      const result = parseCsvText(SAMPLE_CSV);
      setHeaders(result.headers);
      setRows(result.rows);
      setStatus("ready");
      setProgress({
        percentage: 100,
        rowsProcessed: result.rows.length,
      });
      trackToolEvent("convert-csv-to-json", "load_demo", {
        row_count: result.rows.length,
      });
    }, 400);
  }

  function buildExportName(originalName: string) {
    if (!originalName || originalName === "sample-data.csv")
      return "converted-data.json";
    const base = originalName.replace(/\.[^/.]+$/, "");
    return `${base}-converted.json`;
  }

  function handleExport() {
    const jsonContent = JSON.stringify(rows, null, 2);
    downloadJsonFile(buildExportName(fileName), jsonContent);
    trackToolEvent("convert-csv-to-json", "download_json", {
      result_count: rows.length,
    });
  }

  function handleCopy() {
    const jsonContent = JSON.stringify(rows, null, 2);
    navigator.clipboard.writeText(jsonContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackToolEvent("convert-csv-to-json", "copy_json", {
      result_count: rows.length,
    });
  }

  const isParsing = status === "parsing";
  const jsonPreview = JSON.stringify(rows.slice(0, 3), null, 2);

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="flex flex-col gap-8 xl:flex-row">
        {/* Left column: Upload & Config */}
        <div className="flex flex-col min-w-[360px] xl:w-[360px] xl:shrink-0 rounded-[2rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.4)] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-4 border-b border-[color:var(--line)] pb-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--brand)]/10 text-[color:var(--brand-strong)] ring-1 ring-[color:var(--brand)]/20 shadow-sm">
              <FileJson className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-xl font-bold tracking-tight text-[color:var(--foreground)]">
                Input Data
              </p>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                Upload CSV and export
              </p>
            </div>
          </div>

          <label
            htmlFor="csv-upload"
            className="group mt-5 flex min-h-[20rem] cursor-pointer flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-[color:rgba(37,99,235,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,244,255,0.92))] px-6 py-8 text-center transition duration-200 hover:border-[color:var(--brand)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(235,241,255,0.96))] hover:shadow-[0_18px_36px_rgba(37,99,235,0.08)]"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:rgba(37,99,235,0.04)] border border-[color:rgba(37,99,235,0.1)] text-[color:#2563eb] shadow-[0_8px_24px_rgba(37,99,235,0.02)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] group-hover:bg-white">
                {isParsing ? (
                  <LoaderCircle className="h-6 w-6 animate-spin text-[color:var(--brand-strong)]" />
                ) : (
                  <Upload className="h-6 w-6 text-[color:var(--brand-strong)]" />
                )}
              </div>
              <span className="mt-4 text-base font-semibold text-slate-800">
                {isParsing ? "Parsing your CSV..." : "Drag and drop your messy CSV here"}
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
              id="csv-upload"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={handleFileUpload}
              disabled={isParsing}
            />
          </label>

          <p className="mt-3 text-xs leading-relaxed text-slate-500 text-center">
            Processed locally in your browser. Your CSV is never uploaded.<br />
            <span className="text-[11px] text-slate-400 font-medium">(Supports files up to 2 MB)</span>
          </p>

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
              </div>
            </div>
          ) : null}

          {error ? <div className="mt-4 rounded-xl border px-4 py-3 text-sm border-[color:rgba(185,28,28,0.18)] bg-[color:rgba(254,242,242,0.9)] text-red-700">{error}</div> : null}
        </div>

      <div className="flex-1 min-w-0 space-y-6">
        <div className="rounded-[2.5rem] bg-white p-6 sm:p-10 shadow-sm border border-[color:var(--line)] min-h-[30rem] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.05),transparent_70%)] pointer-events-none"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[color:var(--line)] pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 mb-3">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">JSON Converter</p>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Format Conversion
              </h2>
              <p className="mt-1 text-sm font-medium text-[color:var(--muted)]">
                Transforms flat rows into a structured JSON array.
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {status === "idle" || status === "parsing" || status === "error" ? (
              <div className="max-w-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 border border-slate-100 shadow-inner">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-6 w-6 text-slate-400" />
                    <ArrowRight className="h-4 w-4 text-slate-300" />
                    <FileJson className="h-6 w-6 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Waiting for CSV file</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Upload a CSV file in the left panel to automatically convert it to a structured JSON array.
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col h-full items-start text-left max-h-[35rem]">
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-[color:rgba(37,99,235,0.08)] px-3 py-1.5 mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--brand-strong)]">Export Ready</p>
                      </div>
                      <p className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                        {rows.length.toLocaleString()} <span className="text-slate-500 font-medium text-lg">JSON objects.</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!rows.length}
                        className="group inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:hover:bg-blue-600"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <FileJson className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy JSON"}
                      </button>
                      <button
                        type="button"
                        onClick={handleExport}
                        disabled={!rows.length}
                        className="group inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 disabled:opacity-50"
                      >
                        <Download className="h-4 w-4" />
                        Download .json
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 w-full flex-1 min-h-0 relative rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden">
                   <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                           <div className="h-2.5 w-2.5 rounded-full bg-slate-700"></div>
                           <div className="h-2.5 w-2.5 rounded-full bg-slate-700"></div>
                           <div className="h-2.5 w-2.5 rounded-full bg-slate-700"></div>
                        </div>
                        <span className="text-xs font-mono text-slate-400 ml-2">preview.json</span>
                      </div>
                   </div>
                   <div className="p-4 overflow-y-auto max-h-[22rem]">
                       <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                        {rows.length > 3 ? jsonPreview.replace(/\n\]$/, ",\n  ...\n]") : jsonPreview}
                      </pre>
                   </div>
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
