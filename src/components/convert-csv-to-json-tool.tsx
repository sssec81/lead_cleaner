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
 ShieldCheck,
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
import { copyTextToClipboard } from "@/lib/clipboard";

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
 const [warning, setWarning] = useState<string | null>(null);
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
 setWarning(null);
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
 setWarning(formatCsvWarnings(result.warnings));
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

 async function handleCopy() {
 const didCopy = await copyTextToClipboard(jsonOutput);
 if (!didCopy) return;
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
 <div className="lc-tool-grid">
 {/* Left column: Upload & Config */}
 <div className="lc-tool-sidebar flex flex-col bg-[var(--lc-surface-subtle)]">
 <div className="flex items-center gap-3">
 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lc-accent-bg)] text-[color:var(--lc-accent)]">
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
 className={`lc-dropzone group mt-6 transition-colors ${
 isParsing
 ? "cursor-not-allowed opacity-60"
 : ""
 }`}
 >
 <div className="flex flex-col items-center">
 <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--lc-accent-border)] bg-[var(--lc-accent-bg)] text-[color:var(--lc-accent)] shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white">
 {isParsing ? (
 <LoaderCircle className="h-6 w-6 animate-spin text-[color:var(--brand-strong)]" />
 ) : (
 <Upload className="h-6 w-6 text-[color:var(--brand-strong)]" />
 )}
 </div>
 <span className="mt-4 text-base font-semibold text-[var(--lc-ink)]">
 {isParsing ? "Parsing your CSV..." : "Drag and drop your CSV file here"}
 </span>
 <span className="mt-2 max-w-sm text-sm leading-relaxed text-[color:var(--muted)]">
 or click to browse local files.
 </span>
 {!isParsing && (
 <div className="lc-button-primary mt-5 inline-flex min-h-11 px-6 text-sm font-semibold cursor-pointer">
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

 <div className="mt-4 flex flex-col gap-2 border-b border-[var(--lc-border)] pb-5">
 <div className="flex items-start gap-2.5 rounded-lg border border-[var(--lc-mint-border)] bg-[var(--lc-mint-bg)] px-3 py-2">
 <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
 <p className="text-sm font-medium leading-relaxed text-[var(--lc-ink)]">
 Your CSV is processed locally in your browser and is never uploaded to our servers.
 </p>
 </div>
 <div className="flex items-center gap-2 text-xs font-medium text-[var(--lc-muted)]">
 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No account needed
 </div>
 <div className="flex items-center gap-2 text-xs font-medium text-[var(--lc-muted)]">
 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Download .json instantly
 </div>
 <p className="ml-5 mt-1 text-xs font-medium text-[var(--lc-muted)]">Supports files up to 5 MB</p>
 </div>

 <div className="mt-4 rounded-xl border border-[var(--lc-border)] bg-white p-3">
 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--lc-muted)]">
 Quick start
 </p>
 <div className="mt-2">
 <button
 type="button"
 onClick={loadDemoCsv}
              className="lc-button-secondary min-h-11 w-full px-4 text-xs font-semibold"
 >
 <FlaskConical className="h-3.5 w-3.5" />
 Try sample CSV
 </button>
 </div>
 </div>

 {/* Conversion Options */}
 <div className="mt-5 rounded-xl border border-[var(--lc-border)] bg-white p-4">
 <div className="flex items-center gap-2 mb-3">
 <Settings2 className="h-4 w-4 text-[var(--lc-accent)]" />
 <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--brand-strong)]">
 Output Options
 </p>
 </div>

 <div className="space-y-3">
 <div>
 <span className="mb-1.5 block text-xs font-semibold text-[var(--lc-muted)]">Format</span>
 <div className="flex gap-2">
 <button
 type="button"
 onClick={() => setJsonFormat("pretty")}
                  className={`${jsonFormat === "pretty" ? "btn-segment-active" : "btn-segment"} min-h-11 flex-1 rounded-lg text-xs font-semibold transition`}
 >
 Pretty
 </button>
 <button
 type="button"
 onClick={() => setJsonFormat("minified")}
                  className={`${jsonFormat === "minified" ? "btn-segment-active" : "btn-segment"} min-h-11 flex-1 rounded-lg text-xs font-semibold transition`}
 >
 Minified
 </button>
 </div>
 </div>

 <div>
 <span className="mb-1.5 block text-xs font-semibold text-[var(--lc-muted)]">Structure</span>
 <div className="flex gap-2">
 <button
 type="button"
 onClick={() => setJsonStructure("array")}
                  className={`${jsonStructure === "array" ? "btn-segment-active" : "btn-segment"} min-h-11 flex-1 rounded-lg text-xs font-semibold transition`}
 >
 JSON Array
 </button>
 <button
 type="button"
 onClick={() => setJsonStructure("ndjson")}
                  className={`${jsonStructure === "ndjson" ? "btn-segment-active" : "btn-segment"} min-h-11 flex-1 rounded-lg text-xs font-semibold transition`}
 >
 NDJSON
 </button>
 </div>
 </div>

 <p className="text-xs leading-relaxed text-[var(--lc-muted)]">
 {jsonStructure === "ndjson"
 ? "One JSON object per line. Great for streaming and log-style data."
 : jsonFormat === "pretty"
 ? "Indented JSON array with readable formatting."
 : "Compact single-line JSON for minimal file size."}
 </p>
 </div>
 </div>

 {/* Auto-detect settings */}
 <div className="mt-3 rounded-xl border border-[var(--lc-border)] bg-white p-4">
 <div className="flex items-center gap-2 text-xs text-[var(--lc-muted)]">
 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
 <span className="font-medium">First row used as headers (auto-detected)</span>
 </div>
 <div className="mt-2 flex items-center gap-2 text-xs text-[var(--lc-muted)]">
 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
 <span className="font-medium">Delimiter auto-detected (comma, tab, semicolon)</span>
 </div>
 </div>

 {isParsing ? (
 <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
 <div className="flex items-center justify-between gap-3 text-sm">
 <span className="font-semibold text-[color:var(--foreground)]">
 Reading rows
 </span>
 <span className="tabular-nums text-[color:var(--muted)]">
 {progress.percentage}%
 </span>
 </div>
 <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--lc-accent-bg)]">
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
 <div className="mt-5 rounded-xl border border-[var(--lc-border)] bg-white p-4">
 <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
 Active File
 </p>
 <p className="mt-1 truncate text-sm font-semibold text-[var(--lc-ink)]">
 {fileName || "No CSV uploaded yet"}
 </p>
 <p className="mt-1 text-xs font-medium text-[var(--lc-muted)]">
 {rows.length.toLocaleString()} rows · {headers.length} columns
 </p>
 </div>
 ) : null}

 {error ? <div role="alert" className="mt-4 rounded-xl border px-4 py-3 text-sm border-[color:rgba(185,28,28,0.18)] bg-[color:rgba(254,242,242,0.9)] text-red-700">{error}</div> : null}
 {warning ? <div role="status" aria-live="polite" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{warning}</div> : null}
 </div>

 {/* Right column: JSON output */}
 <div className="lc-tool-output flex flex-col">
 <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[color:var(--line)] pb-5 mb-5">
 <div>
 <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lc-accent-border)] bg-[var(--lc-accent-bg)] px-3 py-1 mb-2">
 <span className="flex h-2 w-2 rounded-full bg-[var(--lc-accent)] shadow-sm"></span>
 <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--lc-accent-strong)]">JSON Output</p>
 </div>
 <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-3xl">
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
 className="lc-button-primary group inline-flex min-h-11 px-5 text-sm font-semibold disabled:hover:bg-[var(--lc-accent)]"
 >
 {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
 {copied ? "Copied" : "Copy JSON"}
 </button>
 <button
 type="button"
 onClick={handleExport}
 disabled={!rows.length}
 className="lc-button-secondary min-h-11 px-5 text-sm"
 >
 <Download className="h-4 w-4" />
 Download {jsonStructure === "ndjson" ? ".ndjson" : ".json"}
 </button>
 </div>
 )}
 </div>

 <div className="lc-empty-state flex-col">
 {!hasData ? (
 <div className="max-w-sm">
 <div className="lc-icon-tile mx-auto mb-5 h-14 w-14 rounded-xl">
 <div className="flex items-center gap-2">
 <FileSpreadsheet className="h-5 w-5" />
 <ArrowRight className="h-4 w-4 text-[var(--lc-hint)]" />
 <FileJson className="h-5 w-5" />
 </div>
 </div>
 <h3 className="text-lg font-semibold text-[var(--lc-ink)]">Upload a CSV to convert</h3>
 <p className="mt-2 text-sm leading-relaxed text-[var(--lc-muted)]">
 Your CSV will be instantly transformed into structured JSON. Use the options on the left to control format and structure.
 </p>
 </div>
 ) : (
 <div className="w-full flex flex-col h-full items-start text-left max-h-[35rem]">
 <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-xl border border-[var(--lc-dark-surface)] bg-[var(--lc-dark-bg)]">
 <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
 <div className="flex items-center gap-2">
 <div className="flex gap-1.5">
 <div className="h-2.5 w-2.5 rounded-full bg-slate-700"></div>
 <div className="h-2.5 w-2.5 rounded-full bg-slate-700"></div>
 <div className="h-2.5 w-2.5 rounded-full bg-slate-700"></div>
 </div>
 <span className="ml-2 font-mono text-xs text-white/70">
 {jsonStructure === "ndjson" ? "output.ndjson" : "output.json"}
 </span>
 </div>
 <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
 {jsonFormat === "pretty" ? "Pretty" : "Minified"} · {jsonStructure === "ndjson" ? "NDJSON" : "Array"}
 </span>
 </div>
 <div className="p-4 overflow-y-auto max-h-[22rem]">
 {rows.length > previewRowCount ? (
 <p className="mb-3 text-xs font-medium text-white/70">
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
 );
}

function formatCsvWarnings(warnings: string[]) {
 if (!warnings.length) return null;
 const preview = warnings.slice(0, 2).join(" ");
 return `Imported with ${warnings.length} parsing warning${warnings.length === 1 ? "" : "s"}. ${preview}`;
}
