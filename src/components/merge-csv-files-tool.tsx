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
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="flex flex-col gap-8 xl:flex-row">
        {/* Left column: Upload & Config */}
        <div className="flex flex-col min-w-[360px] xl:w-[360px] xl:shrink-0 rounded-[2rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.4)] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-4 border-b border-[color:var(--line)] pb-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--brand)]/10 text-[color:var(--brand-strong)] ring-1 ring-[color:var(--brand)]/20 shadow-sm">
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
            className={`group mt-5 flex min-h-[16rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 ${
              isDragging
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50/50"
            }`}
          >
            <div className="flex flex-col items-center pointer-events-none">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[color:rgba(37,99,235,0.1)] bg-[color:rgba(37,99,235,0.04)] text-[color:#2563eb] shadow-[0_8px_24px_rgba(37,99,235,0.02)] transition-all duration-300 group-hover:scale-105 group-hover:bg-white">
                {isParsing ? (
                  <LoaderCircle className="h-6 w-6 animate-spin text-[color:var(--brand-strong)]" />
                ) : (
                  <Upload className="h-6 w-6 text-[color:var(--brand-strong)]" />
                )}
              </div>
              <span className="mt-4 text-base font-semibold text-slate-800">
                {isParsing ? "Parsing files..." : "Drop CSV files here"}
              </span>
              <span className="mt-2 max-w-sm text-xs leading-relaxed text-[color:var(--muted)]">
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

          <p className="mt-3 text-xs leading-relaxed text-slate-500 text-center">
            Processed locally in your browser. Files are never uploaded.<br />
            <span className="text-[11px] text-slate-400 font-medium">Any unique columns across files will be kept.</span>
          </p>

          {fileEntries.length > 0 && (
             <div className="mt-6 flex flex-col gap-3">
               <div className="flex items-center justify-between">
                 <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:#38586b]">
                   Loaded Files ({fileEntries.length})
                 </p>
                 <button onClick={resetState} className="text-xs text-red-600 hover:text-red-700 font-medium">Clear all</button>
               </div>
               <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
                 {fileEntries.map((f, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileSpreadsheet className="h-4 w-4 text-slate-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate">{f.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{f.rows.toLocaleString()} rows</p>
                        </div>
                      </div>
                    </div>
                 ))}
               </div>
             </div>
          )}

          {mergedHeaders.length > 0 && (
             <div className="mt-6 rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
               <label htmlFor="duplicate-mode" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                 Deduplicate
               </label>
               <select
                 id="duplicate-mode"
                 value={duplicateMode}
                 onChange={(e) => setDuplicateMode(e.target.value as "none" | "exact_row" | "column")}
                 className="mt-2 min-h-11 w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 text-sm text-slate-800 outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-blue-500/10"
               >
                 <option value="none">Do not deduplicate</option>
                 <option value="exact_row">Exact row match</option>
                 <option value="column">By specific column</option>
               </select>

               {duplicateMode === "column" && (
                 <div className="mt-3">
                   <label htmlFor="selected-column" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                     Column to check
                   </label>
                   <select
                     id="selected-column"
                     value={selectedColumn}
                     onChange={(e) => setSelectedColumn(e.target.value)}
                     className="mt-2 min-h-11 w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 text-sm text-slate-800 outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-blue-500/10"
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

          {error ? <div className="mt-4 rounded-xl border px-4 py-3 text-sm border-[color:rgba(185,28,28,0.18)] bg-[color:rgba(254,242,242,0.9)] text-red-700">{error}</div> : null}
        </div>

      {/* Right column: Results */}
      <div className="flex-1 min-w-0 space-y-6">
        <div className="rounded-[2.5rem] bg-white p-6 sm:p-10 shadow-sm border border-[color:var(--line)] min-h-[30rem] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.05),transparent_70%)] pointer-events-none"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[color:var(--line)] pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 mb-3">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">CSV Merger</p>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Master Dataset
              </h2>
              <p className="mt-1 text-sm font-medium text-[color:var(--muted)]">
                All uploaded CSV rows combined into one file.
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {mergedRows.length === 0 ? (
              <div className="max-w-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 border border-slate-100 shadow-inner">
                   <Combine className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Waiting for files</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Upload multiple CSV files to merge them. The column headers will automatically align and any unique columns will be preserved.
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-start text-left">
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-4xl font-display font-bold text-slate-900 tracking-tight">
                        {finalRows.length.toLocaleString()} <span className="text-slate-500 font-medium text-lg">merged rows.</span>
                      </p>
                      {mergedRows.length !== finalRows.length && (
                        <p className="mt-1 text-xs font-semibold text-amber-600">
                          {Math.max(0, mergedRows.length - finalRows.length).toLocaleString()} duplicates removed
                        </p>
                      )}
                      <p className="mt-1 text-sm text-slate-500">Across {mergedHeaders.length} unique columns.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleExport}
                        className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800"
                      >
                        <Download className="h-4 w-4" />
                        Download Merged CSV
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-6 overflow-x-auto">
                   <h3 className="text-sm font-semibold text-slate-800 mb-4">Column Mapping Preview</h3>
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead>
                       <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                         <th className="pb-3 pr-6 font-medium">Merged Column</th>
                         <th className="pb-3 font-medium">Found in Files</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
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
                           <tr key={i}>
                             <td className="py-3 pr-6 font-medium text-slate-800">{h}</td>
                             <td className="py-3 text-slate-600">
                               <div className="flex flex-wrap gap-1.5">
                                 {foundIn.map((entry, idx) => (
                                   <span key={idx} className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
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
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
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
  return value.trim().toLowerCase().replace(/^www\./, "");
}
