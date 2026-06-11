"use client";

import {
 Check,
 Download,
 FileMinus,
 FileSpreadsheet,
 FlaskConical,
 LoaderCircle,
 Upload,
} from "lucide-react";
import { useState } from "react";

import {
 type CsvParseProgress,
 type CsvRow,
 inspectCsvFile,
 isLikelyCsvFile,
 MAX_CSV_FILE_SIZE,
 parseCsvFile,
 parseCsvText,
} from "@/lib/csv";
import { downloadCsvRecords } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";

type UploadStatus = "idle" | "parsing" | "ready" | "error";

const DEMO_CSV = `name,email,company
Jane Doe,jane@acme.com,Acme
,,
Support Team,support@acme.com,Acme

John Smith,john@northstar.io,Northstar
,,`;

export function RemoveEmptyRowsCsvTool() {
 const [fileName, setFileName] = useState("");
 const [headers, setHeaders] = useState<string[]>([]);
 const [rows, setRows] = useState<CsvRow[]>([]);
 const [error, setError] = useState("");
 const [status, setStatus] = useState<UploadStatus>("idle");
 const [progress, setProgress] = useState<CsvParseProgress>({
 percentage: 0,
 rowsProcessed: 0,
 });

 const emptyRowsCount = rows.filter((r) => Object.values(r).every((v) => v === "")).length;
 const cleanRowsCount = rows.length - emptyRowsCount;

 function resetState(nextFileName = "") {
 setFileName(nextFileName);
 setHeaders([]);
 setRows([]);
 setProgress({
 percentage: 0,
 rowsProcessed: 0,
 });
 }

 async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
 const file = event.target.files?.[0];

 if (!file) {
 return;
 }

 trackToolEvent("remove-empty-rows", "upload_started", {
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
 if (!result.headers.length) {
 resetState(file.name);
 setStatus("error");
 setError("We could not detect any CSV columns in that file.");
 return;
 }

 setHeaders(result.headers);
 setRows(result.rows);
 setStatus("ready");

 trackToolEvent("remove-empty-rows", "upload_completed", {
 row_count: result.rows.length,
 });
 },
 onError: (message) => {
 resetState(file.name);
 setStatus("error");
 setError(message);
 },
 });
 }

 function loadDemoCsv() {
 const result = parseCsvText(DEMO_CSV);
 resetState("leadcleanr-demo.csv");
 setError("");
 setHeaders(result.headers);
 setRows(result.rows);
 setStatus("ready");
 trackToolEvent("remove-empty-rows", "load_demo");
 }

 function handleExport() {
 const cleanRows = rows.filter((r) => !Object.values(r).every((v) => v === ""));
 downloadCsvRecords(buildExportName(fileName), cleanRows);
 trackToolEvent("remove-empty-rows", "download_csv", {
 result_count: cleanRows.length,
 });
 }

 const isParsing = status === "parsing";

 return (
 <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
 <div className="panel-soft w-full xl:w-[380px] shrink-0 rounded-xl p-5 sm:p-7 flex flex-col">
 <div className="flex items-center gap-3">
 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:rgba(37,99,235,0.08)] text-[color:#2563eb]">
 <FileSpreadsheet className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
 Remove Empty Rows
 </p>
 <p className="text-sm leading-6 text-[color:var(--muted)]">
 Upload CSV and export
 </p>
 </div>
 </div>

 <label
 htmlFor="csv-upload"
 className="group mt-5 flex min-h-[20rem] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-8 text-center transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/50"
 >
 <div className="flex flex-col items-center">
 <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[color:rgba(37,99,235,0.1)] bg-[color:rgba(37,99,235,0.04)] text-[color:#2563eb] shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white">
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
 <span className="text-[11px] text-slate-400 font-medium">(Supports files up to 5 MB)</span>
 </p>

 <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-slate-50 p-3">
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
 <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-white/75 p-4">
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
 <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
 <div className="panel-soft rounded-xl p-5 sm:p-7">
 <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
 CSV Stats
 </p>
 <div className="mt-5 rounded-xl bg-[linear-gradient(180deg,rgba(37,99,235,0.05),rgba(255,255,255,0.9))] p-6 border border-slate-200 shadow-sm relative overflow-hidden">
 <div className="absolute right-0 top-0 h-40 w-40 bg-[color:rgba(37,99,235,0.04)] rounded-full blur-2xl -mr-10 -mt-10" />
 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 relative z-10">
 Empty rows found
 </p>
 <p className="mt-3 font-display text-6xl font-bold leading-none tabular-nums text-slate-900 sm:text-7xl relative z-10">
 {emptyRowsCount.toLocaleString()}
 </p>
 </div>

 <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
 <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
 <FileSpreadsheet className="h-4 w-4 text-blue-500" />
 </div>
 <div>
 <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Rows scanned</p>
 <p className="text-lg font-bold text-slate-900 tabular-nums">{rows.length.toLocaleString()}</p>
 </div>
 </div>
 <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
 <Check className="h-4 w-4 text-emerald-600" />
 </div>
 <div>
 <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Clean rows remaining</p>
 <p className="text-lg font-bold text-slate-900 tabular-nums">{cleanRowsCount.toLocaleString()}</p>
 </div>
 </div>
 </div>
 </div>

 <div className="panel-soft rounded-xl p-5 sm:p-7">
 <div className="flex items-center justify-between gap-4">
 <div>
 <h3 className="font-display text-xl font-semibold">
 Export Clean CSV
 </h3>
 <p className="text-sm leading-6 text-[color:var(--muted)]">
 Download the file with all empty rows deleted.
 </p>
 </div>
 </div>
 <div className="mt-4 flex flex-col gap-3">
 <button
 type="button"
 onClick={handleExport}
 disabled={rows.length === 0}
 className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold shadow-sm transition cursor-pointer ${
 rows.length > 0
 ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
 : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
 } px-5`}
 >
 <Download className="h-4 w-4" />
 Download CSV Without Empty Rows
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}

function buildExportName(fileName: string) {
 const baseName = fileName.replace(/\.csv$/i, "") || "leadcleanr-data";
 return `${baseName}-cleaned.csv`;
}
