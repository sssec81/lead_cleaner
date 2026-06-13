"use client";

import {
 Check,
 Download,
 FileMinus,
 FileSpreadsheet,
 FlaskConical,
 LoaderCircle,
 ShieldCheck,
 Upload,
} from "lucide-react";
import { useState } from "react";
import { CsvWorkspaceShell } from "./csv-workspace-shell";
import { Eraser } from "lucide-react";

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

 const isParsing = status === "parsing";  return (
    <CsvWorkspaceShell
      hasLoadedFile={headers.length > 0}
      isParsing={isParsing}
      progress={progress}
      fileName={fileName}
      rowCount={rows.length}
      onReplaceFile={() => {
        resetState();
        setStatus("idle");
        setError("");
      }}
      error={error}
      warning=""
      emptyStateTitle="Remove Empty Rows"
      emptyStateSubtitle="Upload your CSV to instantly drop blank rows. Processed locally in your browser."
      emptyStateIcon={<Eraser className="h-8 w-8" />}
      onFileUpload={handleFileUpload}
      onLoadDemo={loadDemoCsv}
      uploadId="csv-empty-upload"
      toolbar={
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">Removing rows where ALL columns are empty</p>
          <p className="mt-1 text-sm text-slate-500">Empty rows are automatically dropped.</p>
        </div>
      }
      summary={
        <>
          <div className="flex-1 bg-transparent p-5 sm:px-6 transition-colors hover:bg-slate-50/50 min-w-[140px]">
            <p className="stat-kicker text-slate-500">Rows Scanned</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{rows.length.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-transparent p-5 sm:px-6 transition-colors hover:bg-slate-50/50 min-w-[140px]">
            <p className="stat-kicker text-slate-500">Empty Rows Removed</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{emptyRowsCount.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-indigo-50/30 p-5 sm:px-6 transition-colors hover:bg-indigo-50/60 relative overflow-hidden min-w-[160px]">
            <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500"></div>
            <p className="stat-kicker text-indigo-600">Clean Rows Ready</p>
            <p className="mt-1.5 text-3xl font-bold text-indigo-700 tabular-nums tracking-tight">{cleanRowsCount.toLocaleString()}</p>
          </div>
        </>
      }
      preview={
        <div className="flex-1 overflow-auto bg-white min-h-[300px]">
          {cleanRowsCount > 0 ? (
            <table className="min-w-full text-left text-sm whitespace-nowrap border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_#e2e8f0]">
                <tr>
                  <th className="px-5 py-3.5 font-bold text-slate-500 w-16 border-r border-slate-200">#</th>
                  {headers.slice(0, 5).map(header => (
                    <th key={header} className="px-5 py-3.5 font-bold text-slate-900 max-w-[200px] truncate border-r border-slate-200">{header}</th>
                  ))}
                  {headers.length > 5 && <th className="px-5 py-3.5 font-bold text-slate-500">...</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {rows.filter((r) => !Object.values(r).every((v) => v === "")).slice(0, 100).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-slate-500 bg-slate-50/50 border-r border-slate-200">{idx + 1}</td>
                    {headers.slice(0, 5).map(header => (
                      <td key={header} className="px-5 py-3 text-slate-700 max-w-[200px] truncate border-r border-slate-200">{row[header]}</td>
                    ))}
                    {headers.length > 5 && <td className="px-5 py-3 text-slate-500 italic">...</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : status === "ready" && headers.length ? (
            <div className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[300px]">
              <FileMinus className="h-8 w-8 text-amber-500 mb-3" />
              <h4 className="text-sm font-semibold text-slate-900 mb-1">No clean rows found</h4>
              <p className="max-w-md text-sm leading-relaxed text-slate-500">
                This file uploaded successfully, but all rows were empty.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-sm font-medium text-slate-500">
              Upload a file to see preview.
            </div>
          )}
        </div>
      }
      exportControls={
        cleanRowsCount > 0 && (
          <>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Ready to Export</h3>
                <p className="text-sm text-slate-500 mt-0.5">{cleanRowsCount.toLocaleString()} clean rows remaining.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] px-8 text-sm font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-300 hover:bg-[position:right_center] hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] cursor-pointer flex-1 sm:flex-none"
              >
                <Download className="h-5 w-5" /> Download Clean CSV
              </button>
            </div>
          </>
        )
      }
    />
  );
}

function buildExportName(fileName: string) {
 const baseName = fileName.replace(/\.csv$/i, "") || "leadcleanr-data";
 return `${baseName}-cleaned.csv`;
}
