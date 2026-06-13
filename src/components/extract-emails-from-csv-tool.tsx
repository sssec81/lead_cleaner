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
 ShieldCheck,
 Sparkles,
 Upload,
 Zap,
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
import { extractEmailMatches } from "@/lib/text-tools";
import { CsvWorkspaceShell } from "./csv-workspace-shell";
import { Mail } from "lucide-react";

type ExtractionSummary = {
 totalRows: number;
 blankRowsSkipped: number;
 invalidEmailsRemoved: number;
 duplicatesRemoved: number;
 cleanEmailsReady: number;
};

type UploadStatus = "idle" | "parsing" | "ready" | "error";

const PREVIEW_LIMIT = 100;
const DEMO_CSV = `name,email,company
Jane Doe,jane@acme.com,Acme
Support Team,support@acme.com,Acme
Broken,not-an-email,Example Co
John Smith,john@northstar.io,Northstar
Duplicate,jane@acme.com,Acme`;

export function ExtractEmailsFromCsvTool() {
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
 () => extractEmailsFromCsvRows(rows, selectedColumn),
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
 "leadcleanr:extract-email-csv:preferred-column",
 selectedColumn,
 );
 }, [selectedColumn]);

async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
 const file = event.target.files?.[0];

 if (!file) {
 return;
 }

 let inspection;
 try {
 inspection = await inspectCsvFile(file);
 } catch (err) {
 resetState();
 setStatus("error");
 setError(coerceUploadErrorMessage(err));
 return;
 }

 setPendingFile({
 name: file.name,
 sizeMb: file.size / (1024 * 1024),
 exceedsFreeLimit: file.size > MAX_CSV_FILE_SIZE,
 estimatedRows: inspection.estimatedRows,
 estimatedRowsWithinFreeLimit: inspection.estimatedRowsWithinFreeLimit,
 });

 trackToolEvent("extract-emails-from-csv", "upload_started", {
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
 trackToolEvent("extract-emails-from-csv", "upload_failed", {
 reason: "missing_headers",
 });
 return;
 }

 const nextDetections = detectCsvColumns(nextHeaders, nextRows);
 const storedPreferredColumn =
 typeof window !== "undefined"
 ? window.localStorage.getItem("leadcleanr:extract-email-csv:preferred-column")
 : null;
 setHeaders(nextHeaders);
 setRows(nextRows);
 setDetections(nextDetections);
 setSelectedColumn((current) =>
 current && nextHeaders.includes(current)
 ? current
 : storedPreferredColumn && nextHeaders.includes(storedPreferredColumn)
 ? storedPreferredColumn
 : pickDefaultEmailColumn(nextHeaders, nextDetections),
 );
 setStatus("ready");

 if (!nextRows.length) {
 setWarning(
 "We found the header row, but there are no data rows to extract from yet.",
 );
 } else if (result.warnings.length) {
 setWarning(buildWarningSummary(result.warnings));
 }

 trackToolEvent("extract-emails-from-csv", "upload_completed", {
 row_count: nextRows.length,
 warning_count: result.warnings.length,
 });
 },
 onError: (message) => {
 resetState(file.name);
 setStatus("error");
 setError(message);
 trackToolEvent("extract-emails-from-csv", "upload_failed", {
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
 setSelectedColumn(pickDefaultEmailColumn(result.headers, nextDetections));
 setStatus("ready");

 if (result.warnings.length) {
 setWarning(buildWarningSummary(result.warnings));
 }

 trackToolEvent("extract-emails-from-csv", "load_demo");
 }

 async function handleCopy() {
 if (!extracted.results.length) {
 return;
 }

 const didCopy = await copyTextToClipboard(extracted.results.join("\n"));

 if (!didCopy) {
 return;
 }

 trackToolEvent("extract-emails-from-csv", "copy_results", {
 result_count: extracted.results.length,
 });
 setCopied(true);
 window.setTimeout(() => setCopied(false), 1800);
 }

 const isParsing = status === "parsing";
 const recommendedDetection = pickBestDetection(detections, ["email"]);
 const selectedDetection = detections.find(
 (detection) => detection.header === selectedColumn,
 );
 const hasReadyResults = extracted.results.length > 0;
 const hasUploadedRows = status === "ready" && rows.length > 0;
 const showStats = hasUploadedRows;  return (
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
        setWarning("");
      }}
      error={error}
      warning={warning}
      emptyStateTitle="Extract Emails from CSV"
      emptyStateSubtitle="Upload your CSV to isolate and export email addresses instantly. Processed locally in your browser."
      emptyStateIcon={<Mail className="h-8 w-8" />}
      onFileUpload={handleFileUpload}
      onLoadDemo={loadDemoCsv}
      pendingFileNotice={pendingFile ? <FileSizeNotice pendingFile={pendingFile} /> : null}
      uploadId="csv-email-upload"
      toolbar={
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="email-column-select" className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
            Target Column
          </label>
          <select
            id="email-column-select"
            value={selectedColumn}
            onChange={(event) => {
              setSelectedColumn(event.target.value);
              trackToolEvent("extract-emails-from-csv", "change_column", {
                column: event.target.value,
              });
            }}
            disabled={!headers.length || isParsing}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            {headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
          {recommendedDetection && recommendedDetection.header !== selectedColumn && (
            <button
              type="button"
              onClick={() => setSelectedColumn(recommendedDetection.header)}
              className="btn-link-inline mt-2.5 flex items-center gap-1.5 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              Use suggested: {recommendedDetection.header} ({recommendedDetection.confidence}%)
            </button>
          )}
        </div>
      }
      summary={
        <>
          <div className="flex-1 bg-transparent p-5 sm:px-6 transition-colors hover:bg-slate-50/50 min-w-[140px]">
            <p className="stat-kicker text-slate-500">Rows Scanned</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{extracted.summary.totalRows.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-transparent p-5 sm:px-6 transition-colors hover:bg-slate-50/50 min-w-[140px]">
            <p className="stat-kicker text-slate-500">Duplicates Removed</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{extracted.summary.duplicatesRemoved.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-transparent p-5 sm:px-6 transition-colors hover:bg-slate-50/50 min-w-[140px]">
            <p className="stat-kicker text-slate-500">Invalid / Blank</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{(extracted.summary.blankRowsSkipped + extracted.summary.invalidEmailsRemoved).toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-indigo-50/30 p-5 sm:px-6 transition-colors hover:bg-indigo-50/60 relative overflow-hidden min-w-[160px]">
            <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500"></div>
            <p className="stat-kicker text-indigo-600">Clean Emails</p>
            <p className="mt-1.5 text-3xl font-bold text-indigo-700 tabular-nums tracking-tight">{extracted.summary.cleanEmailsReady.toLocaleString()}</p>
          </div>
        </>
      }
      preview={
        <div className="flex-1 overflow-auto bg-white min-h-[300px]">
          {extracted.results.length ? (
            <table className="min-w-full text-left text-sm whitespace-nowrap border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_#e2e8f0]">
                <tr>
                  <th className="px-5 py-3.5 font-bold text-slate-500 w-16 border-r border-slate-200">#</th>
                  <th className="px-5 py-3.5 font-bold text-slate-500 w-24 border-r border-slate-200">STATUS</th>
                  <th className="px-5 py-3.5 font-bold text-slate-900">EMAIL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {extracted.results.slice(0, PREVIEW_LIMIT).map((email, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-3 text-slate-500 bg-slate-50/30 group-hover:bg-slate-100/50 border-r border-slate-200">{idx + 1}</td>
                    <td className="px-5 py-3 border-r border-slate-200">
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200/50 bg-emerald-50/80 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        Valid
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-700 max-w-[280px] truncate" title={email}>{email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : status === "ready" && headers.length ? (
            <div className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[300px]">
              <AlertCircle className="h-8 w-8 text-amber-500 mb-3" />
              <h4 className="text-sm font-semibold text-slate-900 mb-1">No clean emails found</h4>
              <p className="max-w-md text-sm leading-relaxed text-slate-500">
                This file uploaded successfully, but the chosen column did not contain any valid email addresses.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-sm font-medium text-slate-500">
              Select a column to preview extracted emails.
            </div>
          )}
        </div>
      }
      exportControls={
        extracted.results.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Extraction Complete</h3>
                <p className="text-sm text-slate-500 mt-0.5">{extracted.summary.cleanEmailsReady.toLocaleString()} valid emails found.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopy}
                className="btn-secondary h-11 rounded-xl px-4 text-sm font-bold flex-1 sm:flex-none"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Clipboard className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={() => {
                  trackToolEvent("extract-emails-from-csv", "download_txt", { result_count: extracted.results.length });
                  downloadTextFile(buildExportName(fileName, "txt"), extracted.results.join("\n"));
                }}
                className="btn-secondary h-11 rounded-xl px-4 text-sm font-bold flex-1 sm:flex-none"
              >
                <FileText className="h-4 w-4" /> TXT
              </button>
              <button
                type="button"
                onClick={() => {
                  trackToolEvent("extract-emails-from-csv", "download_csv", { result_count: extracted.results.length });
                  downloadCsvFile(buildExportName(fileName, "csv"), extracted.results, "email");
                }}
                className="btn-primary h-12 rounded-xl px-8 text-sm font-bold flex-1 sm:flex-none"
              >
                <Download className="h-5 w-5" /> Download CSV
              </button>
            </div>
          </div>
        )
      }
    />
  );
}

function extractEmailsFromCsvRows(
 rows: CsvRow[],
 selectedColumn: string,
): { results: string[]; summary: ExtractionSummary } {
 if (!selectedColumn) {
 return {
 results: [],
 summary: {
 totalRows: rows.length,
 blankRowsSkipped: 0,
 invalidEmailsRemoved: 0,
 duplicatesRemoved: 0,
 cleanEmailsReady: 0,
 },
 };
 }

 let blankRowsSkipped = 0;
 let invalidEmailsRemoved = 0;
 let duplicatesRemoved = 0;
 const seen = new Set<string>();
 const cleanEmails: string[] = [];

 rows.forEach((row) => {
 const rawValue = String(row[selectedColumn] ?? "").trim();

 if (!rawValue) {
 blankRowsSkipped += 1;
 return;
 }

 const extractedEmails = extractEmailMatches(rawValue);

 if (!extractedEmails.length) {
 invalidEmailsRemoved += 1;
 return;
 }

 extractedEmails.forEach((email) => {
 if (seen.has(email)) {
 duplicatesRemoved += 1;
 return;
 }

 seen.add(email);
 cleanEmails.push(email);
 });
 });

 return {
 results: cleanEmails,
 summary: {
 totalRows: rows.length,
 blankRowsSkipped,
 invalidEmailsRemoved,
 duplicatesRemoved,
 cleanEmailsReady: cleanEmails.length,
 },
 };
}

function pickDefaultEmailColumn(
 headers: string[],
 detections: CsvColumnDetection[],
) {
 const recommendedDetection = pickBestDetection(detections, ["email"]);
 if (recommendedDetection) {
 return recommendedDetection.header;
 }

 return (
 headers.find((header) => header.toLowerCase().includes("email")) ??
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
 const baseName = fileName.replace(/\.csv$/i, "") || "leadcleanr-emails";
 return `${baseName}-emails.${extension}`;
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
 <div className={`mt-3 rounded-xl border p-4 ${toneClasses}`}>
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
 
 </div>
 );
}

function formatRowEstimate(value: number | null) {
 if (!value) {
 return "a few thousand";
 }

 return value.toLocaleString();
}

function coerceUploadErrorMessage(error: unknown) {
 if (error instanceof Error && error.message.trim()) {
 return error.message;
 }

 return "We couldn't read that file in the browser. Please try the upload again.";
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
 className={`rounded-xl border p-4 transition-all duration-300 hover:shadow-xs ${
 accent
 ? "border-emerald-100 bg-emerald-50/40"
 : "border-slate-200 bg-white hover:border-slate-300"
 }`}
 >
 <div className="flex items-center justify-between gap-2">
 <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
 {label}
 </span>
 {icon && <div className="text-slate-500">{icon}</div>}
 </div>
 <div className="mt-3 text-2xl font-bold tabular-nums text-slate-900">
 {value.toLocaleString()}
 </div>
 </div>
 );
}
