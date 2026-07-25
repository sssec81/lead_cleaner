"use client";

import { useState } from "react";
import {
 Upload,
 Download,
 LoaderCircle,
 FileSpreadsheet,
 Scissors,
 Settings2,
} from "lucide-react";
import { zipSync, strToU8 } from "fflate";

import {
 type CsvRow,
 type CsvParseResult,
 isLikelyCsvFile,
 MAX_CSV_FILE_SIZE,
 parseCsvFile,
} from "@/lib/csv";
import { buildCsvTextFromRecordsWithOptions } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";

type UploadStatus = "idle" | "parsing" | "ready" | "error";

export function SplitCsvFilesTool() {
 const [status, setStatus] = useState<UploadStatus>("idle");
 const [error, setError] = useState<string | null>(null);
 const [warning, setWarning] = useState<string | null>(null);
 
 const [fileName, setFileName] = useState("");
 const [rows, setRows] = useState<CsvRow[]>([]);
 const [headers, setHeaders] = useState<string[]>([]);
 
 const [rowsPerFile, setRowsPerFile] = useState<number>(1000);
 const [keepHeaderRow, setKeepHeaderRow] = useState<boolean>(true);
 
 const [isDragging, setIsDragging] = useState(false);

 function resetState() {
 setStatus("idle");
 setError(null);
 setWarning(null);
 setFileName("");
 setRows([]);
 setHeaders([]);
 }

 async function handleFileUpload(file: File) {
 if (!file) return;
 
 resetState();
 setStatus("parsing");

 if (file.size > MAX_CSV_FILE_SIZE) {
 setError(`File is too large. Maximum supported size is 5 MB.`);
 setStatus("error");
 return;
 }

 if (!isLikelyCsvFile(file)) {
 setError(`File doesn't look like a valid CSV.`);
 setStatus("error");
 return;
 }

 try {
 const result = await new Promise<CsvParseResult>((resolve, reject) => {
 parseCsvFile({
 file,
 onComplete: resolve,
 onError: reject
 });
 });
 
 setFileName(file.name);
 setHeaders(result.headers);
 setRows(result.rows);
 setWarning(formatCsvWarnings(result.warnings));
 setStatus("ready");
 
 trackToolEvent("split-csv-files", "file_uploaded", {
 file_size_kb: Math.round(file.size / 1024),
 total_rows: result.rows.length
 });

 } catch (err) {
 setError(
 `Error parsing ${file.name}: ${err instanceof Error ? err.message : String(err)}`
 );
 setStatus("error");
 }
 }

 function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
 if (e.target.files?.[0]) {
 void handleFileUpload(e.target.files[0]);
 }
 if (e.target) e.target.value = "";
 }

 function handleDrop(e: React.DragEvent) {
 e.preventDefault();
 setIsDragging(false);
 if (e.dataTransfer.files?.[0]) {
 void handleFileUpload(e.dataTransfer.files[0]);
 }
 }

 function handleExport() {
 if (rows.length === 0) return;

 try {
 const chunks = [];
 for (let i = 0; i < rows.length; i += rowsPerFile) {
 chunks.push(rows.slice(i, i + rowsPerFile));
 }

 const archive: Record<string, Uint8Array> = {};
 const baseName = fileName.replace(/\.[^/.]+$/, "");

 chunks.forEach((chunkRows, index) => {
 const csvString = buildCsvTextFromRecordsWithOptions(chunkRows, {
 headers,
 includeHeader: keepHeaderRow,
 });
 
 archive[`${baseName}_part_${index + 1}.csv`] = strToU8(csvString);
 });

 const zipFile = zipSync(archive, { level: 6 });
 const blob = new Blob([zipFile], { type: "application/zip" });
 
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `${baseName}_split.zip`;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 URL.revokeObjectURL(url);

 trackToolEvent("split-csv-files", "download_zip", {
 row_count_bucket: Math.floor(rows.length / 1000) * 1000,
 chunk_count_bucket: chunks.length,
 rows_per_file: rowsPerFile,
 keep_header: keepHeaderRow
 });
 } catch (err) {
 console.error("Export failed:", err);
 setError("Failed to generate ZIP file.");
 }
 }

 const isParsing = status === "parsing";
 const chunkCount = Math.ceil(rows.length / rowsPerFile) || 0;

 return (
 <div className="lc-tool-grid">
 {/* Left column: Upload & Config */}
 <div className="lc-tool-sidebar flex flex-col">
 <div className="flex items-center gap-4 border-b border-[color:var(--line)] pb-5">
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--brand)]/10 text-[color:var(--brand-strong)] ring-1 ring-[color:var(--brand)]/20 shadow-sm">
 <Scissors className="h-6 w-6" />
 </div>
 <div>
 <p className="font-display text-xl font-bold tracking-tight text-[color:var(--foreground)]">
 Split CSV
 </p>
 <p className="text-sm leading-6 text-[color:var(--muted)]">
 Break large lists into chunks
 </p>
 </div>
 </div>

 <label
 htmlFor="csv-upload"
 onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
 onDragLeave={() => setIsDragging(false)}
 onDrop={handleDrop}
 className={`lc-dropzone group mt-5 transition-colors ${
 isDragging
 ? "border-[var(--lc-accent)] bg-[var(--lc-accent-bg)]"
 : ""
 }`}
 >
 <div className="flex flex-col items-center pointer-events-none">
 <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--lc-accent-border)] bg-[var(--lc-accent-bg)] text-[color:var(--lc-accent)] shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white">
 {isParsing ? (
 <LoaderCircle className="h-6 w-6 animate-spin text-[color:var(--brand-strong)]" />
 ) : (
 <Upload className="h-6 w-6 text-[color:var(--brand-strong)]" />
 )}
 </div>
 <span className="mt-4 text-base font-semibold text-[var(--lc-ink)]">
 {isParsing ? "Parsing file..." : "Drop a CSV file here"}
 </span>
 <span className="mt-2 max-w-sm text-sm leading-relaxed text-[color:var(--muted)]">
 Up to 5 MB. All data stays in your browser.
 </span>
 </div>
 <input
 id="csv-upload"
 type="file"
 accept=".csv,text/csv"
 className="sr-only"
 onChange={onFileInputChange}
 disabled={isParsing}
 />
 </label>

 {fileName && (
 <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface-subtle)] p-3">
 <div className="flex items-center gap-3 overflow-hidden">
 <FileSpreadsheet className="h-4 w-4 shrink-0 text-[var(--lc-muted)]" />
 <div className="min-w-0">
 <p className="truncate text-xs font-semibold text-[var(--lc-ink)]">{fileName}</p>
 <p className="mt-0.5 text-[11px] text-[var(--lc-muted)]">{rows.length.toLocaleString()} rows</p>
 </div>
 </div>
 </div>
 )}

 {rows.length > 0 && (
 <div className="mt-6 space-y-4 rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface-subtle)] p-4">
 <div className="flex items-center gap-2 mb-2">
 <Settings2 className="h-4 w-4 text-[var(--lc-accent)]" />
 <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--lc-ink)]">Split settings</h3>
 </div>
 
 <div>
 <label htmlFor="rows-per-file" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
 Rows per chunk
 </label>
 <select
 id="rows-per-file"
 value={rowsPerFile}
 onChange={(e) => setRowsPerFile(Number(e.target.value))}
 className="lc-select mt-2 w-full"
 >
 <option value={500}>500 rows</option>
 <option value={1000}>1,000 rows</option>
 <option value={5000}>5,000 rows</option>
 <option value={10000}>10,000 rows</option>
 </select>
 </div>

 <label className="group flex min-h-11 cursor-pointer items-center gap-3 py-2">
 <input
 type="checkbox"
 checked={keepHeaderRow}
 onChange={(e) => setKeepHeaderRow(e.target.checked)}
 className="h-5 w-5 rounded border-[var(--lc-border-mid)] text-[var(--lc-accent)] focus:ring-[var(--lc-accent)]"
 />
 <span className="text-sm font-medium text-[var(--lc-ink)]">
 Keep header row in every file
 </span>
 </label>
 </div>
 )}

 {error ? <div role="alert" className="mt-4 rounded-xl border px-4 py-3 text-sm border-[color:rgba(185,28,28,0.18)] bg-[color:rgba(254,242,242,0.9)] text-red-700">{error}</div> : null}
 {warning ? <div role="status" aria-live="polite" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{warning}</div> : null}
 </div>

 {/* Right column: Results */}
 <div className="lc-tool-output flex flex-col">
 <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[color:var(--line)] pb-6 mb-6">
 <div>
 <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lc-accent-border)] bg-[var(--lc-accent-bg)] px-3 py-1 mb-3">
 <span className="flex h-2 w-2 rounded-full bg-[var(--lc-accent)] shadow-sm"></span>
 <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--lc-accent-strong)]">CSV Splitter</p>
 </div>
 <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-3xl">
 Export Chunks
 </h2>
 <p className="mt-1 text-sm font-medium text-[color:var(--muted)]">
 Break large lists to bypass CRM import limits.
 </p>
 </div>
 </div>

 <div className="lc-empty-state flex-col">
 {rows.length === 0 ? (
 <div className="max-w-sm">
 <div className="lc-icon-tile mx-auto mb-5 h-14 w-14 rounded-xl">
 <Scissors className="h-6 w-6" />
 </div>
 <h3 className="text-lg font-semibold text-[var(--lc-ink)]">Waiting for file</h3>
 <p className="mt-2 text-sm leading-relaxed text-[var(--lc-muted)]">
 Upload a CSV file to split it into smaller chunks. You will receive a ZIP file containing all the pieces.
 </p>
 </div>
 ) : (
 <div className="w-full flex flex-col items-start text-left">
 <div className="w-full rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface-subtle)] p-5">
 <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <p className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)]">
 {chunkCount} <span className="text-base font-medium text-[var(--lc-muted)]">files ready</span>
 </p>
 <p className="mt-2 text-sm text-[var(--lc-muted)]">
 Your <span className="font-medium text-[var(--lc-ink)]">{rows.length.toLocaleString()} rows</span> will be split into chunks of <span className="font-medium text-[var(--lc-ink)]">{rowsPerFile.toLocaleString()}</span>.
 </p>
 </div>
 <div className="flex flex-wrap items-center gap-3">
 <button
 type="button"
 onClick={handleExport}
 className="lc-button-primary group inline-flex min-h-12 px-6 text-sm font-semibold"
 >
 <Download className="h-4 w-4" />
 Download ZIP
 </button>
 </div>
 </div>
 </div>

 <div className="mt-5 w-full rounded-xl border border-[var(--lc-border)] bg-white p-5">
 <h3 className="mb-4 text-sm font-semibold text-[var(--lc-ink)]">Export summary</h3>
 <ul className="space-y-3 text-sm text-[var(--lc-muted)]">
 <li className="flex items-center justify-between border-b border-[var(--lc-border)] pb-3">
 <span>Original rows</span>
 <span className="font-semibold text-[var(--lc-ink)]">{rows.length.toLocaleString()}</span>
 </li>
 <li className="flex items-center justify-between border-b border-[var(--lc-border)] pb-3">
 <span>Rows per file</span>
 <span className="font-semibold text-[var(--lc-ink)]">{rowsPerFile.toLocaleString()}</span>
 </li>
 <li className="flex items-center justify-between border-b border-[var(--lc-border)] pb-3">
 <span>Files generated</span>
 <span className="font-semibold text-[var(--lc-ink)]">{chunkCount} files</span>
 </li>
 <li className="flex items-center justify-between">
 <span>Header row included</span>
 <span className="font-semibold text-[var(--lc-ink)]">{keepHeaderRow ? "Yes" : "No"}</span>
 </li>
 </ul>
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
