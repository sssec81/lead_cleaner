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
 const [warning, setWarning] = useState("");
 const [status, setStatus] = useState<UploadStatus>("idle");
 const [progress, setProgress] = useState<CsvParseProgress>({
 percentage: 0,
 rowsProcessed: 0,
 });

 const emptyRowsCount = rows.filter((r) => Object.values(r).every((v) => v === "")).length;
 const cleanRowsCount = rows.length - emptyRowsCount;
 const currentStep = status === "idle" || status === "parsing"
 ? 1
 : cleanRowsCount > 0
 ? 4
 : 3;

 function resetState(nextFileName = "") {
 setFileName(nextFileName);
 setHeaders([]);
 setRows([]);
 setWarning("");
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
 preserveBlankRows: true,
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
 setWarning(formatCsvWarnings(result.warnings));
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
 const result = parseCsvText(DEMO_CSV, { preserveBlankRows: true });
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
      steps={["Upload CSV", "Confirm rule", "Review rows", "Export"]}
      currentStep={currentStep}
      rulesTitle="Row Rule"
      reviewTitle="Review Rows"
      exportTitle="Export Clean CSV"
      error={error}
      warning={warning}
      emptyStateTitle="Remove Empty Rows"
      emptyStateSubtitle="Upload your CSV to instantly drop blank rows. Processed locally in your browser."
      emptyStateIcon={<Eraser className="h-8 w-8" />}
      onFileUpload={handleFileUpload}
      onLoadDemo={loadDemoCsv}
      uploadId="csv-empty-upload"
      toolbar={
        <div className="flex-1">
          <p className="text-[13px] font-medium text-[var(--lc-ink)] mb-1">Removing rows where ALL columns are empty</p>
          <p className="text-[12px] text-[var(--lc-muted)]">Empty rows are automatically dropped.</p>
        </div>
      }
      summary={
        <>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] mb-1">Rows scanned</p>
            <p className="font-mono text-xl font-semibold text-[var(--lc-ink)] tabular-nums">{rows.length.toLocaleString()}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[var(--lc-border-mid)]"></div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] mb-1">Empty rows removed</p>
            <p className="font-mono text-xl font-semibold text-[var(--lc-ink)] tabular-nums">{emptyRowsCount.toLocaleString()}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[var(--lc-border-mid)]"></div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] mb-1">Columns preserved</p>
            <p className="font-mono text-xl font-semibold text-[var(--lc-ink)] tabular-nums">{headers.length.toLocaleString()}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[var(--lc-border-mid)]"></div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-1">Clean rows ready</p>
            <p className="font-mono text-xl font-semibold text-[var(--lc-accent)] tabular-nums">{cleanRowsCount.toLocaleString()}</p>
          </div>
        </>
      }
      preview={
        <div className="flex-1 overflow-auto bg-[var(--lc-surface)] min-h-[300px]">
          {cleanRowsCount > 0 ? (
            <div className="lc-table-scroll">
              <table aria-label="Clean CSV row preview" className="lc-data-table lc-data-table-compact">
                <caption className="sr-only">CSV rows remaining after empty rows were removed.</caption>
                <thead>
                  <tr>
                    <th scope="col" className="lc-data-table-index">#</th>
                    {headers.slice(0, 5).map(header => (
                      <th scope="col" key={header} className="max-w-[200px] truncate" title={header}>{header}</th>
                    ))}
                    {headers.length > 5 && <th scope="col" aria-label="Additional columns">More</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.filter((r) => !Object.values(r).every((v) => v === "")).slice(0, 100).map((row, idx) => (
                    <tr key={idx}>
                      <td className="lc-data-table-index">{idx + 1}</td>
                      {headers.slice(0, 5).map(header => (
                        <td key={header} className="lc-data-table-value max-w-[200px]" title={row[header]}>{row[header] || <span className="text-[var(--lc-hint)]">—</span>}</td>
                      ))}
                      {headers.length > 5 && <td className="font-mono text-xs text-[var(--lc-hint)]">+{headers.length - 5}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : status === "ready" && headers.length ? (
            <div className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[300px]">
              <FileMinus className="h-8 w-8 text-[var(--lc-muted)] mb-3" />
              <h4 className="text-sm font-semibold text-[var(--lc-ink)] mb-1">No clean rows found</h4>
              <p className="max-w-md text-sm leading-relaxed text-[var(--lc-muted)]">
                This file uploaded successfully, but all rows were empty.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-sm font-medium text-[var(--lc-muted)]">
              Upload a file to see preview.
            </div>
          )}
        </div>
      }
      exportControls={
        cleanRowsCount > 0 && (
          <>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center rounded-md bg-[var(--lc-ink)] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed gap-2 flex-1 sm:flex-none"
            >
              Export CSV <Download className="h-4 w-4" />
            </button>
          </>
        )
      }
    />
  );
}

function formatCsvWarnings(warnings: string[]) {
 if (!warnings.length) return "";
 const preview = warnings.slice(0, 2).join(" ");
 return `Imported with ${warnings.length} parsing warning${warnings.length === 1 ? "" : "s"}. ${preview}`;
}

function buildExportName(fileName: string) {
 const baseName = fileName.replace(/\.csv$/i, "") || "leadcleanr-data";
 return `${baseName}-cleaned.csv`;
}
