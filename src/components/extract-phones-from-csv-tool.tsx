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
import { extractPhoneMatches } from "@/lib/text-tools";
import { CsvWorkspaceShell } from "./csv-workspace-shell";
import { ScanSearch as PhoneIcon } from "lucide-react";

type ExtractionSummary = {
 totalRows: number;
 blankRowsSkipped: number;
 invalidPhonesRemoved: number;
 duplicatesRemoved: number;
 cleanPhonesReady: number;
};

type UploadStatus = "idle" | "parsing" | "ready" | "error";
const PREVIEW_LIMIT = 100;
const DEMO_CSV = `name,phone,company
Jane Doe,+14155550101,Acme
Support Team,415-555-0101,Acme
Broken,not-a-phone,Example Co
John Smith,+44 20 7946 0958,Northstar
Duplicate,(415) 555-0101,Acme`;

export function ExtractPhonesFromCsvTool() {
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
 () => extractPhonesFromCsvRows(rows, selectedColumn),
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
 "leadcleanr:extract-phone-csv:preferred-column",
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

 trackToolEvent("extract-phones-from-csv", "upload_started", {
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
 trackToolEvent("extract-phones-from-csv", "upload_failed", {
 reason: "missing_headers",
 });
 return;
 }

 const nextDetections = detectCsvColumns(nextHeaders, nextRows);
 const storedPreferredColumn =
 typeof window !== "undefined"
 ? window.localStorage.getItem("leadcleanr:extract-phone-csv:preferred-column")
 : null;
 setHeaders(nextHeaders);
 setRows(nextRows);
 setDetections(nextDetections);
 setSelectedColumn((current) =>
 current && nextHeaders.includes(current)
 ? current
 : storedPreferredColumn && nextHeaders.includes(storedPreferredColumn)
 ? storedPreferredColumn
 : pickDefaultPhoneColumn(nextHeaders, nextDetections),
 );
 setStatus("ready");

 if (!nextRows.length) {
 setWarning(
 "We found the header row, but there are no data rows to extract from yet.",
 );
 } else if (result.warnings.length) {
 setWarning(buildWarningSummary(result.warnings));
 }

 trackToolEvent("extract-phones-from-csv", "upload_completed", {
 row_count: nextRows.length,
 warning_count: result.warnings.length,
 });
 },
 onError: (message) => {
 resetState(file.name);
 setStatus("error");
 setError(message);
 trackToolEvent("extract-phones-from-csv", "upload_failed", {
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
 setSelectedColumn(pickDefaultPhoneColumn(result.headers, nextDetections));
 setStatus("ready");

 if (result.warnings.length) {
 setWarning(buildWarningSummary(result.warnings));
 }

 trackToolEvent("extract-phones-from-csv", "load_demo");
 }

 async function handleCopy() {
 if (!extracted.results.length) {
 return;
 }

 const didCopy = await copyTextToClipboard(extracted.results.join("\n"));

 if (!didCopy) {
 return;
 }

 trackToolEvent("extract-phones-from-csv", "copy_results", {
 result_count: extracted.results.length,
 });
 setCopied(true);
 window.setTimeout(() => setCopied(false), 1800);
 }

 const isParsing = status === "parsing";
 const recommendedDetection = pickBestDetection(detections, ["phone"]);
 const selectedDetection = detections.find(
 (detection) => detection.header === selectedColumn,
 );  return (
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
      steps={["Upload CSV", "Choose column", "Review results", "Export"]}
      currentStep={currentStep}
      error={error}
      warning={warning}
      emptyStateTitle="Extract Phones from CSV"
      emptyStateSubtitle="Upload your CSV to isolate and export phone numbers instantly. Processed locally in your browser."
      emptyStateIcon={<PhoneIcon className="h-8 w-8" />}
      onFileUpload={handleFileUpload}
      onLoadDemo={loadDemoCsv}
      pendingFileNotice={pendingFile ? <FileSizeNotice pendingFile={pendingFile} /> : null}
      uploadId="csv-phone-upload"
      toolbar={
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="phone-column-select" className="block text-[13px] font-medium text-[var(--lc-muted)] mb-1">
            Target column
          </label>
          <select
            id="phone-column-select"
            value={selectedColumn}
            onChange={(event) => {
              setSelectedColumn(event.target.value);
              trackToolEvent("extract-phones-from-csv", "change_column", {
                column: event.target.value,
              });
            }}
            disabled={!headers.length || isParsing}
            className="w-full max-w-sm rounded-md border border-[var(--lc-border-mid)] bg-[var(--lc-surface)] px-3 py-2 text-sm text-[var(--lc-ink)] focus:border-[var(--lc-accent)] focus:ring-1 focus:ring-[var(--lc-accent)] focus:outline-none transition-colors cursor-pointer"
          >
            {headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
          {recommendedDetection && recommendedDetection.header !== selectedColumn && (
            <button
              type="button"
              onClick={() => setSelectedColumn(recommendedDetection.header)}
              className="mt-2 flex items-center gap-1.5 text-xs text-[var(--lc-accent)] hover:underline"
            >
              <Sparkles className="h-3 w-3" />
              Use suggested: {recommendedDetection.header} ({recommendedDetection.confidence}%)
            </button>
          )}
        </div>
      }
      summary={
        <>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] mb-1">Rows scanned</p>
            <p className="font-mono text-xl font-semibold text-[var(--lc-ink)] tabular-nums">{extracted.summary.totalRows.toLocaleString()}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[var(--lc-border-mid)]"></div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] mb-1">Duplicates removed</p>
            <p className="font-mono text-xl font-semibold text-[var(--lc-ink)] tabular-nums">{extracted.summary.duplicatesRemoved.toLocaleString()}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[var(--lc-border-mid)]"></div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] mb-1">Invalid / Blank</p>
            <p className="font-mono text-xl font-semibold text-[var(--lc-ink)] tabular-nums">{(extracted.summary.blankRowsSkipped + extracted.summary.invalidPhonesRemoved).toLocaleString()}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[var(--lc-border-mid)]"></div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-1">Clean phones</p>
            <p className="font-mono text-xl font-semibold text-[var(--lc-accent)] tabular-nums">{extracted.summary.cleanPhonesReady.toLocaleString()}</p>
          </div>
        </>
      }
      preview={
        <div className="flex-1 overflow-auto bg-[var(--lc-surface)] min-h-[300px]">
          {extracted.results.length ? (
            <table className="min-w-full text-left text-sm whitespace-nowrap border-collapse">
              <thead className="sticky top-0 z-10 bg-[#FDFDFD]">
                <tr>
                  <th className="px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] w-8 border-b border-[var(--lc-border)]">#</th>
                  <th className="px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] border-b border-[var(--lc-border)]">STATUS</th>
                  <th className="px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] border-b border-[var(--lc-border)]">PHONE</th>
                </tr>
              </thead>
              <tbody>
                {extracted.results.slice(0, PREVIEW_LIMIT).map((phone, idx) => (
                  <tr key={phone} className="hover:bg-[var(--lc-bg)] border-b border-[var(--lc-border)] last:border-0 transition-colors group">
                    <td className="px-3 py-2.5 font-mono text-[12px] text-[var(--lc-hint)] w-8">{idx + 1}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
                        Valid
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[13px] text-[var(--lc-ink)] max-w-[280px] truncate" title={phone}>{phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : status === "ready" && headers.length ? (
            <div className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[300px]">
              <AlertCircle className="h-8 w-8 text-[var(--lc-muted)] mb-3" />
              <h4 className="text-sm font-semibold text-[var(--lc-ink)] mb-1">No clean phones found</h4>
              <p className="max-w-md text-sm leading-relaxed text-[var(--lc-muted)]">
                This file uploaded successfully, but the chosen column did not contain any valid phone numbers.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-sm font-medium text-[var(--lc-muted)]">
              Select a column to preview extracted phones.
            </div>
          )}
        </div>
      }
      exportControls={
        extracted.results.length > 0 && (
          <>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--lc-border-mid)] bg-[var(--lc-surface)] px-4 text-[13px] font-medium text-[var(--lc-ink)] transition-colors hover:bg-[var(--lc-bg)] flex-1 sm:flex-none gap-2"
            >
              {copied ? <Check className="h-4 w-4 text-[var(--lc-green)]" /> : <Clipboard className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => {
                trackToolEvent("extract-phones-from-csv", "download_txt", { result_count: extracted.results.length });
                downloadTextFile(buildExportName(fileName, "txt"), extracted.results.join("\n"));
              }}
              className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--lc-border-mid)] bg-[var(--lc-surface)] px-4 text-[13px] font-medium text-[var(--lc-ink)] transition-colors hover:bg-[var(--lc-bg)] flex-1 sm:flex-none gap-2"
            >
              <FileText className="h-4 w-4" /> TXT
            </button>
            <button
              type="button"
              onClick={() => {
                trackToolEvent("extract-phones-from-csv", "download_csv", { result_count: extracted.results.length });
                downloadCsvFile(buildExportName(fileName, "csv"), extracted.results, "phone");
              }}
              className="inline-flex items-center justify-center rounded-md bg-[var(--lc-ink)] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed gap-2 flex-1 sm:flex-none"
            >
              Export Phones CSV <Download className="h-4 w-4" />
            </button>
          </>
        )
      }
    />
  );
}

function extractPhonesFromCsvRows(
 rows: CsvRow[],
 selectedColumn: string,
): { results: string[]; summary: ExtractionSummary } {
 if (!selectedColumn) {
 return {
 results: [],
 summary: {
 totalRows: rows.length,
 blankRowsSkipped: 0,
 invalidPhonesRemoved: 0,
 duplicatesRemoved: 0,
 cleanPhonesReady: 0,
 },
 };
 }

 let blankRowsSkipped = 0;
 let invalidPhonesRemoved = 0;
 let duplicatesRemoved = 0;
 const seen = new Set<string>();
 const cleanPhones: string[] = [];

 rows.forEach((row) => {
 const rawValue = String(row[selectedColumn] ?? "").trim();

 if (!rawValue) {
 blankRowsSkipped += 1;
 return;
 }

 const extractedPhones = extractPhoneMatches(rawValue);

 if (!extractedPhones.length) {
 invalidPhonesRemoved += 1;
 return;
 }

 extractedPhones.forEach((phone) => {
 if (seen.has(phone)) {
 duplicatesRemoved += 1;
 return;
 }

 seen.add(phone);
 cleanPhones.push(phone);
 });
 });

 return {
 results: cleanPhones,
 summary: {
 totalRows: rows.length,
 blankRowsSkipped,
 invalidPhonesRemoved,
 duplicatesRemoved,
 cleanPhonesReady: cleanPhones.length,
 },
 };
}

function pickDefaultPhoneColumn(
 headers: string[],
 detections: CsvColumnDetection[],
) {
 const recommendedDetection = pickBestDetection(detections, ["phone"]);
 if (recommendedDetection) {
 return recommendedDetection.header;
 }

 return (
 headers.find((header) => header.toLowerCase().includes("phone")) ??
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
 const baseName = fileName.replace(/\.csv$/i, "") || "leadcleanr-phones";
 return `${baseName}-phones.${extension}`;
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
