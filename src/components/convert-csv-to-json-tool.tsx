"use client";

import { useMemo, useState } from "react";

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
  CheckCircle2,
  Copy,
  Settings2,
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
type JsonFormat = "pretty" | "minified";
type JsonStructure = "array" | "ndjson";

const SAMPLE_CSV = `name,email,company
Jane Doe,jane@acme.com,Acme
John Smith,john@northstar.io,Northstar
Support Team,support@acme.com,Acme`;

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

  // Conversion options
  const [jsonFormat, setJsonFormat] = useState<JsonFormat>("pretty");
  const [jsonStructure, setJsonStructure] = useState<JsonStructure>("array");

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
      setError("File is too large. Maximum supported size is 5 MB.");
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

  const jsonOutput = useMemo(() => {
    if (!rows.length) return "";
    if (jsonStructure === "ndjson") {
      return rows.map((row) => JSON.stringify(row)).join("\n");
    }
    return jsonFormat === "pretty"
      ? JSON.stringify(rows, null, 2)
      : JSON.stringify(rows);
  }, [rows, jsonFormat, jsonStructure]);

  const previewRowCount = Math.min(rows.length, 5);
  const jsonPreview = useMemo(() => {
    if (!rows.length) return "";
    const preview = rows.slice(0, previewRowCount);
    if (jsonStructure === "ndjson") {
      return preview.map((row) => JSON.stringify(row)).join("\n");
    }
    return jsonFormat === "pretty"
      ? JSON.stringify(preview, null, 2)
      : JSON.stringify(preview);
  }, [rows, previewRowCount, jsonFormat, jsonStructure]);

  function handleExport() {
    const extension = jsonStructure === "ndjson" ? ".ndjson" : ".json";
    const exportName = buildExportName(fileName).replace(/\.json$/, extension);
    downloadJsonFile(exportName, jsonOutput);
    trackToolEvent("convert-csv-to-json", "download_json", {
      result_count: rows.length,
      format: jsonFormat,
      structure: jsonStructure,
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackToolEvent("convert-csv-to-json", "copy_json", {
      result_count: rows.length,
      format: jsonFormat,
      structure: jsonStructure,
    });
  }

  const isParsing = status === "parsing";
  const hasData = rows.length > 0 && status === "ready";

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* Left column: Upload & Config */}
        <div className="flex flex-col min-w-[360px] xl:w-[400px] xl:shrink-0 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-6 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:rgba(37,99,235,0.08)] text-[color:#2563eb]">
              <FileJson className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                CSV to JSON Converter
              </p>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                Upload, convert, export
              </p>
            </div>
          </div>

          <label
            htmlFor="csv-upload"
            className={`group mt-6 flex min-h-[14rem] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-6 text-center transition-all duration-200 ${
              isParsing
                ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                : "cursor-pointer border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50/50"
            }`}
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
                {isParsing ? "Parsing your CSV..." : "Drag and drop your CSV file here"}
              </span>
              <span className="mt-2 max-w-sm text-xs leading-relaxed text-[color:var(--muted)]">
                or click to browse local files.
              </span>
              {!isParsing && (
                <div className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                  Upload CSV to Convert
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

          <div className="mt-4 flex flex-col gap-2 border-b border-slate-200/60 pb-5">
            <p className="text-xs font-semibold leading-relaxed text-slate-700 bg-emerald-50/60 border border-emerald-100/50 rounded-lg px-3 py-2">
              🔒 Your CSV is processed locally in your browser and is never uploaded to our servers.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No account needed
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Download .json instantly
            </div>
            <p className="mt-1 text-xs text-slate-400 font-medium ml-5">Supports files up to 5 MB</p>
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

          {/* Conversion Options */}
          <div className="mt-5 rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Settings2 className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--brand-strong)]">
                Output Options
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Format</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setJsonFormat("pretty")}
                    className={`flex-1 min-h-9 rounded-lg text-xs font-semibold transition ${
                      jsonFormat === "pretty"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Pretty
                  </button>
                  <button
                    type="button"
                    onClick={() => setJsonFormat("minified")}
                    className={`flex-1 min-h-9 rounded-lg text-xs font-semibold transition ${
                      jsonFormat === "minified"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Minified
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Structure</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setJsonStructure("array")}
                    className={`flex-1 min-h-9 rounded-lg text-xs font-semibold transition ${
                      jsonStructure === "array"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    JSON Array
                  </button>
                  <button
                    type="button"
                    onClick={() => setJsonStructure("ndjson")}
                    className={`flex-1 min-h-9 rounded-lg text-xs font-semibold transition ${
                      jsonStructure === "ndjson"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    NDJSON
                  </button>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-400">
                {jsonStructure === "ndjson"
                  ? "One JSON object per line. Great for streaming and log-style data."
                  : jsonFormat === "pretty"
                    ? "Indented JSON array with readable formatting."
                    : "Compact single-line JSON for minimal file size."}
              </p>
            </div>
          </div>

          {/* Auto-detect settings */}
          <div className="mt-3 rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="font-medium">First row used as headers (auto-detected)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="font-medium">Delimiter auto-detected (comma, tab, semicolon)</span>
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
            <div className="mt-5 rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                Active File
              </p>
              <p className="mt-1 text-sm font-semibold truncate text-slate-800">
                {fileName || "No CSV uploaded yet"}
              </p>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                {rows.length.toLocaleString()} rows · {headers.length} columns
              </p>
            </div>
          ) : null}

          {error ? <div className="mt-4 rounded-xl border px-4 py-3 text-sm border-[color:rgba(185,28,28,0.18)] bg-[color:rgba(254,242,242,0.9)] text-red-700">{error}</div> : null}
        </div>

        {/* Right column: JSON output */}
        <div className="flex-1 min-w-0 space-y-5">
          <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-sm border border-slate-200/60 min-h-[30rem] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.05),transparent_70%)] pointer-events-none"></div>
            
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[color:var(--line)] pb-5 mb-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 mb-2">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">JSON Output</p>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {hasData ? "Conversion Complete" : "JSON Preview"}
                </h2>
                <p className="mt-1 text-sm font-medium text-[color:var(--muted)]">
                  {hasData
                    ? `${rows.length.toLocaleString()} rows converted to ${jsonStructure === "ndjson" ? "NDJSON" : "JSON array"}.`
                    : "Upload a CSV to see structured JSON output here."}
                </p>
              </div>
              {hasData && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!rows.length}
                    className="group inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:hover:bg-blue-600"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy JSON"}
                  </button>
                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={!rows.length}
                    className="group inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    Download {jsonStructure === "ndjson" ? ".ndjson" : ".json"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center">
              {!hasData ? (
                <div className="max-w-sm">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-slate-400" />
                      <ArrowRight className="h-4 w-4 text-slate-300" />
                      <FileJson className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Upload a CSV to convert</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Your CSV will be instantly transformed into structured JSON. Use the options on the left to control format and structure.
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col h-full items-start text-left max-h-[35rem]">
                  <div className="w-full flex-1 min-h-0 relative rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-slate-700"></div>
                          <div className="h-2.5 w-2.5 rounded-full bg-slate-700"></div>
                          <div className="h-2.5 w-2.5 rounded-full bg-slate-700"></div>
                        </div>
                        <span className="text-xs font-mono text-slate-400 ml-2">
                          {jsonStructure === "ndjson" ? "output.ndjson" : "output.json"}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {jsonFormat === "pretty" ? "Pretty" : "Minified"} · {jsonStructure === "ndjson" ? "NDJSON" : "Array"}
                      </span>
                    </div>
                    <div className="p-4 overflow-y-auto max-h-[22rem]">
                      {rows.length > previewRowCount ? (
                        <p className="mb-3 text-[11px] font-medium text-slate-400">
                          Showing the first {previewRowCount} of {rows.length.toLocaleString()} {jsonStructure === "ndjson" ? "lines" : "JSON objects"}.
                        </p>
                      ) : null}
                      <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap break-all">
                        {jsonPreview}
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
