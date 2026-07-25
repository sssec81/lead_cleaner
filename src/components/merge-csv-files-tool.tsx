"use client";

import { useState, useMemo } from "react";

import {
 Upload,
 Download,
 Check,
 LoaderCircle,
 FileSpreadsheet,
 Combine,
 X,
} from "lucide-react";

import {
 type CsvRow,
 type CsvParseResult,
 isLikelyCsvFile,
 MAX_CSV_FILE_SIZE,
 parseCsvFile,
} from "@/lib/csv";
import {
 canonicalizeCsvRows,
 type MergeHeaderMapping,
} from "@/lib/csv-merge";
import { downloadCsvRecords } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import { normalizeUrlValue, parseAndFormatPhone } from "@/lib/text-tools";

type UploadStatus = "idle" | "parsing" | "ready" | "error";

interface FileEntry {
 name: string;
 size: number;
 rows: number;
 headers: string[];
 headerMappings: MergeHeaderMapping[];
}

export function MergeCsvFilesTool() {
 const [status, setStatus] = useState<UploadStatus>("idle");
 const [error, setError] = useState<string | null>(null);
 const [warning, setWarning] = useState<string | null>(null);
 
 const [fileEntries, setFileEntries] = useState<FileEntry[]>([]);
 const [mergedRows, setMergedRows] = useState<CsvRow[]>([]);
 const [mergedHeaders, setMergedHeaders] = useState<string[]>([]);
 
 const [duplicateMode, setDuplicateMode] = useState<"none" | "exact_row" | "column">("none");
 const [selectedColumn, setSelectedColumn] = useState("");
 
 const [isDragging, setIsDragging] = useState(false);

 const finalRows = useMemo(() => {
 if (duplicateMode === "none") return mergedRows;
 
 if (duplicateMode === "exact_row") {
 const seen = new Set<string>();
 return mergedRows.filter(row => {
 const hash = JSON.stringify(row);
 if (seen.has(hash)) return false;
 seen.add(hash);
 return true;
 });
 }
 
 if (duplicateMode === "column" && selectedColumn) {
 const seen = new Set<string>();
 return mergedRows.filter(row => {
 const val = normalizeMergeDedupValue(
 String(row[selectedColumn] ?? ""),
 selectedColumn,
 );
 if (!val) return true; // Don't dedupe empty cells, keep them
 if (seen.has(val)) return false;
 seen.add(val);
 return true;
 });
 }
 
 return mergedRows;
 }, [mergedRows, duplicateMode, selectedColumn]);

 function resetState() {
 setStatus("idle");
 setError(null);
 setWarning(null);
 setFileEntries([]);
 setMergedRows([]);
 setMergedHeaders([]);
 }

 async function handleFileUpload(files: File[]) {
 if (!files || files.length === 0) return;
 
 setError(null);
 setStatus("parsing");

 if (fileEntries.length + files.length > 5) {
 setError("Maximum of 5 files can be merged at once.");
 setStatus("idle");
 return;
 }

 let currentMergedRows = [...mergedRows];
 const newFileEntries: FileEntry[] = [];
 const parseWarnings: string[] = [];
 
 // Create a Set of existing headers
 const currentHeaderSet = new Set(mergedHeaders);

 for (const file of files) {
 if (fileEntries.some(f => f.name === file.name) || newFileEntries.some(f => f.name === file.name)) {
 continue;
 }

 if (file.size > MAX_CSV_FILE_SIZE) {
 setError(`File ${file.name} is too large. Maximum supported size is 5 MB.`);
 setStatus("error");
 return;
 }

 if (!isLikelyCsvFile(file)) {
 setError(
 `File ${file.name} doesn't look like a valid CSV file.`,
 );
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
 
 if (result.headers.length === 0) {
 throw new Error("No headers found.");
 }

 parseWarnings.push(...result.warnings);

 const canonicalized = canonicalizeCsvRows(result.headers, result.rows);

 currentMergedRows = currentMergedRows.concat(canonicalized.rows);
 canonicalized.headers.forEach((header) => currentHeaderSet.add(header));
 
 newFileEntries.push({
 name: file.name,
 size: file.size,
 rows: canonicalized.rows.length,
 headers: canonicalized.headers,
 headerMappings: canonicalized.headerMappings,
 });

 } catch (err) {
 setError(
 `Error parsing ${file.name}: ${err instanceof Error ? err.message : String(err)}`
 );
 setStatus("error");
 return;
 }
 }

 const updatedHeaders = Array.from(currentHeaderSet);
 
 // Normalize rows to ensure every row has all headers (even if empty)
 // This isn't strictly necessary for papa.unparse, but good for consistency
 const normalizedRows = currentMergedRows.map(row => {
 const normalizedRow: CsvRow = {};
 updatedHeaders.forEach(h => {
 normalizedRow[h] = row[h] !== undefined ? row[h] : "";
 });
 return normalizedRow;
 });

 setMergedHeaders(updatedHeaders);
 setMergedRows(normalizedRows);
 setFileEntries(prev => [...prev, ...newFileEntries]);
 setWarning(formatCsvWarnings(parseWarnings));
 setStatus("ready");
 
 if (!selectedColumn) {
 const emailHeader = updatedHeaders.find(h => h.toLowerCase().includes("email"));
 if (emailHeader) {
 setSelectedColumn(emailHeader);
 setDuplicateMode("column");
 }
 }
 
 trackToolEvent("merge-csv-files", "files_added", {
 count: files.length,
 total_rows: normalizedRows.length
 });
 }

 function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
 if (e.target.files) {
 void handleFileUpload(Array.from(e.target.files));
 }
 if (e.target) e.target.value = "";
 }

 function handleDrop(e: React.DragEvent) {
 e.preventDefault();
 setIsDragging(false);
 if (e.dataTransfer.files) {
 void handleFileUpload(Array.from(e.dataTransfer.files));
 }
 }

 function handleExport() {
 downloadCsvRecords("merged-data.csv", finalRows);
 trackToolEvent("merge-csv-files", "download_csv", {
 result_count: finalRows.length,
 file_count: fileEntries.length,
 duplicate_mode: duplicateMode
 });
 }

 const isParsing = status === "parsing";

 return (
 <div className="lc-tool-grid">
 {/* Left column: Upload & Config */}
 <div className="lc-tool-sidebar flex flex-col">
 <div className="flex items-center gap-4 border-b border-[color:var(--line)] pb-5">
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--brand)]/10 text-[color:var(--brand-strong)] ring-1 ring-[color:var(--brand)]/20 shadow-sm">
 <Combine className="h-6 w-6" />
 </div>
 <div>
 <p className="font-display text-xl font-bold tracking-tight text-[color:var(--foreground)]">
 Merge Files
 </p>
 <p className="text-sm leading-6 text-[color:var(--muted)]">
 Upload multiple CSVs
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
 {isParsing ? "Parsing files..." : "Drop CSV files here"}
 </span>
 <span className="mt-2 max-w-sm text-sm leading-relaxed text-[color:var(--muted)]">
 You can select up to 5 files at once (max 5 MB each).
 </span>
 </div>
 <input
 id="csv-upload"
 type="file"
 accept=".csv,text/csv"
 multiple
 className="sr-only"
 onChange={onFileInputChange}
 disabled={isParsing}
 />
 </label>

 <p className="mt-3 text-center text-sm leading-relaxed text-[var(--lc-muted)]">
 Processed locally in your browser. Files are never uploaded.<br />
 <span className="text-xs font-medium">Any unique columns across files will be kept.</span>
 </p>

 {fileEntries.length > 0 && (
 <div className="mt-6 flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--lc-muted)]">
 Loaded Files ({fileEntries.length})
 </p>
 <button type="button" onClick={resetState} className="inline-flex min-h-11 items-center px-2 text-xs font-medium text-[var(--lc-danger)] hover:bg-[var(--lc-danger-bg)]">Clear all</button>
 </div>
 <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
 {fileEntries.map((f, i) => (
 <div key={i} className="flex items-center justify-between rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface-subtle)] p-3">
 <div className="flex items-center gap-3 overflow-hidden">
 <FileSpreadsheet className="h-4 w-4 shrink-0 text-[var(--lc-muted)]" />
 <div className="min-w-0">
 <p className="truncate text-xs font-semibold text-[var(--lc-ink)]">{f.name}</p>
 <p className="mt-0.5 text-[11px] text-[var(--lc-muted)]">{f.rows.toLocaleString()} rows</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {mergedHeaders.length > 0 && (
 <div className="mt-6 rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface-subtle)] p-4">
 <label htmlFor="duplicate-mode" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
 Deduplicate
 </label>
 <select
 id="duplicate-mode"
 value={duplicateMode}
 onChange={(e) => setDuplicateMode(e.target.value as "none" | "exact_row" | "column")}
 className="lc-select mt-2 w-full"
 >
 <option value="none">Do not deduplicate</option>
 <option value="exact_row">Exact row match</option>
 <option value="column">By specific column</option>
 </select>

 {duplicateMode === "column" && (
 <div className="mt-3">
 <label htmlFor="selected-column" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
 Column to check
 </label>
 <select
 id="selected-column"
 value={selectedColumn}
 onChange={(e) => setSelectedColumn(e.target.value)}
 className="lc-select mt-2 w-full"
 >
 <option value="" disabled>Select a column...</option>
 {mergedHeaders.map(h => (
 <option key={h} value={h}>{h}</option>
 ))}
 </select>
 </div>
 )}
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
 <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--lc-accent-strong)]">CSV Merger</p>
 </div>
 <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--lc-ink)] sm:text-3xl">
 Master Dataset
 </h2>
 <p className="mt-1 text-sm font-medium text-[color:var(--muted)]">
 All uploaded CSV rows combined into one file.
 </p>
 </div>
 </div>

 <div className="lc-empty-state flex-col">
 {mergedRows.length === 0 ? (
 <div className="max-w-sm">
 <div className="lc-icon-tile mx-auto mb-5 h-14 w-14 rounded-xl">
 <Combine className="h-6 w-6" />
 </div>
 <h3 className="text-lg font-semibold text-[var(--lc-ink)]">Waiting for files</h3>
 <p className="mt-2 text-sm leading-relaxed text-[var(--lc-muted)]">
 Upload multiple CSV files to merge them. The column headers will automatically align and any unique columns will be preserved.
 </p>
 </div>
 ) : (
 <div className="w-full flex flex-col items-start text-left">
 <div className="w-full rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface-subtle)] p-5">
 <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <p className="font-display text-3xl font-bold tracking-tight text-[var(--lc-ink)]">
 {finalRows.length.toLocaleString()} <span className="text-base font-medium text-[var(--lc-muted)]">merged rows</span>
 </p>
 {mergedRows.length !== finalRows.length && (
 <p className="mt-1 text-xs font-semibold text-amber-600">
 {Math.max(0, mergedRows.length - finalRows.length).toLocaleString()} duplicates removed
 </p>
 )}
 <p className="mt-1 text-sm text-[var(--lc-muted)]">Across {mergedHeaders.length} unique columns.</p>
 </div>
 <div className="flex flex-wrap items-center gap-3">
 <button
 type="button"
 onClick={handleExport}
 className="lc-button-primary group inline-flex min-h-12 px-6 text-sm font-semibold"
 >
 <Download className="h-4 w-4" />
 Download Merged CSV
 </button>
 </div>
 </div>
 </div>

 <div className="mt-6 w-full overflow-hidden rounded-xl border border-[var(--lc-border)] bg-[var(--lc-surface)]">
 <div className="flex items-center justify-between border-b border-[var(--lc-border)] bg-[var(--lc-surface-raised)] px-4 py-3 sm:px-5">
 <h3 className="text-sm font-semibold text-[var(--lc-ink)]">Column mapping</h3>
 <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)]">{mergedHeaders.length} columns</span>
 </div>
 <div className="lc-table-scroll">
 <table aria-label="Merged CSV column mapping" className="lc-data-table">
 <caption className="sr-only">How source CSV columns map into the merged output.</caption>
 <thead>
 <tr>
 <th scope="col">Merged column</th>
 <th scope="col">Source columns</th>
 </tr>
 </thead>
 <tbody>
 {mergedHeaders.map((h, i) => {
 const foundIn = fileEntries.flatMap((fileEntry) =>
 fileEntry.headerMappings
 .filter((mapping) => mapping.mergedHeader === h)
 .map((mapping) => ({
 fileName: fileEntry.name,
 originalHeader: mapping.originalHeader,
 })),
 );
 return (
 <tr key={h}>
 <td className="font-medium text-[var(--lc-ink)]">{h}</td>
 <td>
 <div className="flex flex-wrap gap-1.5">
 {foundIn.map((entry, idx) => (
 <span key={`${entry.fileName}-${entry.originalHeader}-${idx}`} className="inline-flex items-center rounded-md border border-[var(--lc-border)] bg-[var(--lc-surface-raised)] px-2 py-1 font-mono text-[11px] text-[var(--lc-muted)]">
 {entry.fileName}: {entry.originalHeader}
 </span>
 ))}
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
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

function normalizeMergeDedupValue(value: string, columnName: string) {
 const rawValue = value.trim();
 if (!rawValue) {
 return "";
 }

 const normalizedColumn = columnName.toLowerCase();

 if (normalizedColumn.includes("email")) {
 return normalizeEmailValue(rawValue);
 }

 if (normalizedColumn.includes("phone") || normalizedColumn.includes("tel")) {
 return parseAndFormatPhone(rawValue) ?? rawValue.toLowerCase();
 }

 if (
 normalizedColumn.includes("website") ||
 normalizedColumn.includes("url") ||
 normalizedColumn.includes("link")
 ) {
 return normalizeUrlValue(rawValue) ?? rawValue.toLowerCase();
 }

 if (normalizedColumn.includes("domain")) {
 return normalizeDomainValue(rawValue);
 }

 return rawValue.toLowerCase();
}

function normalizeEmailValue(value: string) {
 return value.trim().toLowerCase();
}

function normalizeDomainValue(value: string) {
 const trimmed = value.trim().toLowerCase();
 const fromUrl = normalizeUrlValue(trimmed);

 if (fromUrl) {
  try {
   const parsed = new URL(fromUrl);
   return parsed.hostname.replace(/^www\./, "");
  } catch {
   // Fall through to looser normalization.
  }
 }

 return trimmed
  .replace(/^https?:\/\//, "")
  .replace(/^www\./, "")
  .split(/[/?#]/)[0]
  ?.replace(/:\d+$/, "") ?? "";
}
