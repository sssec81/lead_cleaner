"use client";

import {
 AlertCircle,
 AlertTriangle,
 Building2,
 Check,
 CheckCircle2,
 Circle,
 CopyMinus,
 Download,
 ExternalLink,
 FileMinus,
 FileSpreadsheet,
 FileText,
 FlaskConical,
 LoaderCircle,
 Mail,
 Redo2,
 RotateCcw,
 ScanSearch,
 ShieldAlert,
 ShieldCheck,
 Sparkles,
 Undo2,
 Upload,
 X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

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
import { downloadCsvRecords } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import { normalizeUrlValue, parseAndFormatPhone } from "@/lib/text-tools";

type UploadStatus = "idle" | "parsing" | "ready" | "error";

type DuplicateMode = "selected" | "email" | "phone" | "domain" | "entire_row";

type EmailFilterMode = "all" | "business_only" | "personal_only";

type CleaningSummary = {
 totalRows: number;
 emptyRowsRemoved: number;
 invalidRowsRemoved: number;
 duplicatesRemoved: number;
 filteredRowsRemoved: number;
 cleanRowsReady: number;
 businessEmails: number;
 personalEmails: number;
 roleBasedEmails: number;
 generatedDomains: number;
};

type PreviewRow = CsvRow & {
 leadcleanr_generated_domain?: string;
 leadcleanr_email_type?: string;
 leadcleanr_role_email?: string;
};

type RemovalReason = "duplicate" | "invalid" | "blank" | "personal_email" | "business_email";

type CleanedResult = {
 rows: PreviewRow[];
 summary: CleaningSummary;
 removedRows: Array<PreviewRow & { leadcleanr_reason: RemovalReason }>;
 invalidRows: Array<PreviewRow & { leadcleanr_reason: "invalid" }>;
 blankRows: Array<PreviewRow & { leadcleanr_reason: "blank" }>;
 duplicateRows: Array<PreviewRow & { leadcleanr_reason: "duplicate" }>;
};

const PREVIEW_LIMIT = 100;
const PERSONAL_EMAIL_DOMAINS = new Set([
 "gmail.com",
 "yahoo.com",
 "hotmail.com",
 "outlook.com",
 "icloud.com",
 "aol.com",
 "proton.me",
 "protonmail.com",
 "live.com",
 "msn.com",
 "gmx.com",
 "ymail.com",
]);

const ROLE_EMAIL_PREFIXES = new Set([
 "info",
 "support",
 "sales",
 "admin",
 "hello",
 "team",
 "contact",
 "help",
 "office",
 "billing",
 "careers",
]);
const DEMO_CSV = `name,email,company,website,phone
Jane Doe,jane@acme.com,Acme,https://acme.com,+1 (415) 555-0101
Support Team,support@acme.com,Acme,https://acme.com,415-555-0101
Broken,not-an-email,Example Co,exampleco.com,
John Smith,john@northstar.io,Northstar,https://northstar.io,+44 20 7946 0958
Duplicate,jane@acme.com,Acme,https://acme.com,+1 (415) 555-0101`;

const DUPLICATE_MODE_OPTIONS: Array<{
 value: DuplicateMode;
 label: string;
 description: string;
}> = [
 {
 value: "selected",
 label: "Selected column",
 description: "Best default when one field is the source of truth.",
 },
 {
 value: "email",
 label: "Email",
 description: "Use the first email value found in each row.",
 },
 {
 value: "phone",
 label: "Phone",
 description: "Use the first phone-like value found in each row.",
 },
 {
 value: "domain",
 label: "Domain",
 description: "Group rows by company domain from email or website data.",
 },
 {
 value: "entire_row",
 label: "Entire row",
 description: "Only remove rows that are fully duplicated across all columns.",
 },
];

function getFileSizeBucket(bytes: number): string {
 if (bytes < 1024 * 1024) return "0-1mb";
 if (bytes < 2 * 1024 * 1024) return "1-2mb";
 if (bytes < 5 * 1024 * 1024) return "2-5mb";
 return "5mb+";
}

function getRowCountBucket(count: number): string {
 if (count < 100) return "0-100";
 if (count < 500) return "100-500";
 if (count < 1000) return "500-1k";
 if (count < 5000) return "1k-5k";
 if (count < 10000) return "5k-10k";
 if (count < 50000) return "10k-50k";
 return "50k+";
}

export function CsvLeadCleanerTool() {
 const searchParams = useSearchParams();
 const shouldLoadSampleFromQuery = searchParams.get("sample") === "1";
 const [fileName, setFileName] = useState("");
 const [headers, setHeaders] = useState<string[]>([]);
 const [rows, setRows] = useState<CsvRow[]>([]);
 const [detections, setDetections] = useState<CsvColumnDetection[]>([]);
 const [selectedColumn, setSelectedColumn] = useState("");
 const [duplicateMode, setDuplicateMode] = useState<DuplicateMode>("selected");
 const [emailFilter, setEmailFilter] = useState<EmailFilterMode>("all");
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
 const [pastConfigs, setPastConfigs] = useState<
 Array<{ selectedColumn: string; duplicateMode: DuplicateMode; emailFilter: EmailFilterMode }>
 >([]);
 const [futureConfigs, setFutureConfigs] = useState<
 Array<{ selectedColumn: string; duplicateMode: DuplicateMode; emailFilter: EmailFilterMode }>
 >([]);
 const [previewMode, setPreviewMode] = useState<"clean" | "removed" | "invalid">(
 "clean",
 );
 const [hasAppliedQuerySample, setHasAppliedQuerySample] = useState(false);
 const [toastVisible, setToastVisible] = useState(false);

 const cleaned = useMemo(
 () => cleanCsvRows(rows, headers, selectedColumn, duplicateMode, emailFilter),
 [duplicateMode, headers, rows, selectedColumn, emailFilter],
 );

 const previewRows = cleaned.rows.slice(0, PREVIEW_LIMIT);
 const isParsing = status === "parsing";
 const showEmailEnrichment =
 selectedColumn &&
 (selectedColumn.toLowerCase().includes("email") || cleaned.summary.generatedDomains > 0);

 useEffect(() => {
 if (typeof window === "undefined" || !selectedColumn) {
 return;
 }

 window.localStorage.setItem(
 "leadcleanr:csv-cleaner:preferred-column",
 selectedColumn,
 );
 }, [selectedColumn]);

 useEffect(() => {
 if (typeof window === "undefined") {
 return;
 }

 window.localStorage.setItem(
 "leadcleanr:csv-cleaner:duplicate-mode",
 duplicateMode,
 );
 }, [duplicateMode]);

 useEffect(() => {
 if (!shouldLoadSampleFromQuery || hasAppliedQuerySample) {
 return;
 }

 loadDemoCsv();
 setHasAppliedQuerySample(true);
 }, [hasAppliedQuerySample, shouldLoadSampleFromQuery]);

 function resetState(nextFileName = "") {
 setFileName(nextFileName);
 setHeaders([]);
 setRows([]);
 setDetections([]);
 setSelectedColumn("");
 setDuplicateMode("selected");
 setEmailFilter("all");
 setWarning("");
 setPastConfigs([]);
 setFutureConfigs([]);
 setPreviewMode("clean");
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

 trackToolEvent("csv-lead-cleaner", "upload_started", {
 file_size_bucket: getFileSizeBucket(file.size),
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
 onProgress: setProgress,
 onComplete: (result) => {
 if (!result.headers.length) {
 resetState(file.name);
 setStatus("error");
 setError("We could not detect any CSV columns in that file.");
 trackToolEvent("csv-lead-cleaner", "upload_failed", {
 reason: "missing_headers",
 });
 return;
 }

 const nextDetections = detectCsvColumns(result.headers, result.rows);
 const storedPreferredColumn =
 typeof window !== "undefined"
 ? window.localStorage.getItem("leadcleanr:csv-cleaner:preferred-column")
 : null;
 const storedDuplicateMode =
 typeof window !== "undefined"
 ? window.localStorage.getItem("leadcleanr:csv-cleaner:duplicate-mode")
 : null;
 setHeaders(result.headers);
 setRows(result.rows);
 setDetections(nextDetections);
 setSelectedColumn(
 storedPreferredColumn && result.headers.includes(storedPreferredColumn)
 ? storedPreferredColumn
 : pickDefaultColumn(result.headers, nextDetections),
 );
 if (isDuplicateMode(storedDuplicateMode)) {
 setDuplicateMode(storedDuplicateMode);
 }
 setStatus("ready");

 if (!result.rows.length) {
 setWarning(
 "We found the header row, but there are no data rows to clean yet.",
 );
 } else if (result.warnings.length) {
 setWarning(buildWarningSummary(result.warnings));
 }

 trackToolEvent("csv-lead-cleaner", "upload_completed", {
 row_count_bucket: getRowCountBucket(result.rows.length),
 warning_count: result.warnings.length,
 });
 },
 onError: (message) => {
 resetState(file.name);
 setStatus("error");
 setError(message);
 trackToolEvent("csv-lead-cleaner", "upload_failed", {
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
 setSelectedColumn(pickDefaultColumn(result.headers, nextDetections));
 setStatus("ready");

 if (result.warnings.length) {
 setWarning(buildWarningSummary(result.warnings));
 }

 trackToolEvent("csv-lead-cleaner", "load_demo");
 }

 function applyConfigChange(nextConfig: {
 selectedColumn: string;
 duplicateMode: DuplicateMode;
 emailFilter?: EmailFilterMode;
 }) {
 const nextEmailFilter = nextConfig.emailFilter ?? emailFilter;
 if (
 nextConfig.selectedColumn === selectedColumn &&
 nextConfig.duplicateMode === duplicateMode &&
 nextEmailFilter === emailFilter
 ) {
 return;
 }

 setPastConfigs((current) => [
 ...current,
 { selectedColumn, duplicateMode, emailFilter },
 ]);
 setFutureConfigs([]);
 setSelectedColumn(nextConfig.selectedColumn);
 setDuplicateMode(nextConfig.duplicateMode);
 setEmailFilter(nextEmailFilter);

 setToastVisible(true);
 setTimeout(() => setToastVisible(false), 1500);
 }

 function undoConfigChange() {
 setPastConfigs((current) => {
 const previous = current.at(-1);
 if (!previous) {
 return current;
 }

 setFutureConfigs((future) => [
 { selectedColumn, duplicateMode, emailFilter },
 ...future,
 ]);
 setSelectedColumn(previous.selectedColumn);
 setDuplicateMode(previous.duplicateMode);
 setEmailFilter(previous.emailFilter);

 return current.slice(0, -1);
 });
 }

 function redoConfigChange() {
 setFutureConfigs((current) => {
 const next = current[0];
 if (!next) {
 return current;
 }

 setPastConfigs((past) => [...past, { selectedColumn, duplicateMode, emailFilter }]);
 setSelectedColumn(next.selectedColumn);
 setDuplicateMode(next.duplicateMode);
 setEmailFilter(next.emailFilter);

 return current.slice(1);
 });
 }

 function resetCleanupConfig() {
 if (!headers.length) {
 return;
 }

 const nextColumn = pickDefaultColumn(headers, detections);
 setSelectedColumn(nextColumn);
 setDuplicateMode("selected");
 setEmailFilter("all");
 setPreviewMode("clean");
 setPastConfigs([]);
 setFutureConfigs([]);
 trackToolEvent("csv-lead-cleaner", "reset_cleanup");
 }

 const previewHeaders = useMemo(() => {
 const nextHeaders = [...headers];
 if (!showEmailEnrichment) {
 return nextHeaders;
 }

 if (!nextHeaders.includes("leadcleanr_generated_domain")) {
 nextHeaders.push("leadcleanr_generated_domain");
 }
 if (!nextHeaders.includes("leadcleanr_email_type")) {
 nextHeaders.push("leadcleanr_email_type");
 }
 if (!nextHeaders.includes("leadcleanr_role_email")) {
 nextHeaders.push("leadcleanr_role_email");
 }
 return nextHeaders;
 }, [headers, showEmailEnrichment]);
 const recommendedDetection = pickBestDetection(detections, [
 "email",
 "phone",
 "domain",
 "url",
 ]);
 const selectedDetection = detections.find(
 (detection) => detection.header === selectedColumn,
 );
 const hasLoadedFile = headers.length > 0 && status === "ready";
 const exportReady = hasLoadedFile && cleaned.rows.length > 0;
 const reportRows =
 previewMode === "removed"
 ? cleaned.removedRows
 : previewMode === "invalid"
 ? cleaned.invalidRows
 : cleaned.rows;
 const reportHeaders =
 previewMode === "clean"
 ? previewHeaders
 : headers;
 const previewLabel =
 previewMode === "removed"
 ? "Preview removed rows"
 : previewMode === "invalid"
 ? "Preview invalid rows"
 : "Preview cleaned CSV";
 const previewDescription =
 previewMode === "removed"
 ? "Rows removed because they were duplicate, blank, or invalid under the current cleanup rules."
 : previewMode === "invalid"
 ? "Rows removed because the selected cleanup field was blank or could not be normalized."
 : `Showing up to ${PREVIEW_LIMIT} rows after cleanup.`;
 const visiblePreviewRows = reportRows.slice(0, PREVIEW_LIMIT);

      return (
    <div className="w-full bg-[var(--lc-surface)] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[var(--lc-border)] overflow-hidden flex flex-col">
      {!hasLoadedFile ? (
        /* ── Main Upload Panel (Empty State) ── */
        <div className="flex flex-col items-center justify-center p-12 lg:p-24 bg-[var(--lc-surface)] rounded-xl border border-[var(--lc-border)] shadow-sm">
          <label
            htmlFor="csv-upload"
            className={`group relative flex w-full max-w-2xl cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all ${
              isParsing
                ? "border-[var(--lc-border-mid)] bg-[var(--lc-bg)] opacity-60 cursor-not-allowed"
                : "border-[var(--lc-border-mid)] bg-[var(--lc-bg)] hover:border-[var(--lc-accent)] hover:bg-[var(--lc-accent-bg)]"
            }`}
          >
            <input id="csv-upload" type="file" accept=".csv,text/csv" className="sr-only" onChange={handleFileUpload} disabled={isParsing} />
            
            <Upload className="h-8 w-8 text-[var(--lc-accent)] mb-4" />
            
            <p className="text-[16px] font-semibold text-[var(--lc-ink)] mb-1">
              Drop your messy lead CSV
            </p>
            <p className="text-[14px] text-[var(--lc-muted)] mb-6">
              We'll detect email, phone, URL, and domain columns automatically.
            </p>
            
            <div className="flex items-center justify-center gap-3">
              {isParsing ? (
                <LoaderCircle className="h-6 w-6 animate-spin text-[var(--lc-muted)]" />
              ) : (
                <>
                  <span className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--lc-accent)] px-5 text-sm font-medium text-white transition-opacity hover:opacity-90">
                    Browse CSV
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      loadDemoCsv();
                    }}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-[var(--lc-surface)] px-5 text-sm font-medium text-[var(--lc-ink)] transition-colors hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)]"
                  >
                    Try sample CSV
                  </button>
                </>
              )}
            </div>
          </label>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-[var(--lc-muted)]">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--lc-accent)]" /> No upload</span>
            <span className="text-[var(--lc-hint)]">·</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--lc-accent)]" /> Processed locally</span>
            <span className="text-[var(--lc-hint)]">·</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--lc-accent)]" /> 5MB free</span>
          </div>

          {error && (
            <div className="mt-6 w-full max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-left shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-900">Upload failed</h4>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {pendingFile ? (
            <div className="mt-6 w-full max-w-2xl">
              <FileSizeNotice pendingFile={pendingFile} />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col flex-1 bg-[var(--lc-surface)] rounded-xl border border-[var(--lc-border)] shadow-sm">
          
          {/* ── Workspace Header ── */}
          <div className="flex items-center justify-between border-b border-[var(--lc-border)] p-4 bg-[#FDFDFD]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[14px] text-[var(--lc-ink)] truncate max-w-[200px] sm:max-w-[300px]" title={fileName}>
                  {fileName}
                </span>
              </div>
            </div>

            <button
              onClick={() => resetState()}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-[var(--lc-surface)] px-3 text-[13px] font-medium text-[var(--lc-muted)] transition hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] gap-1.5"
            >
              Replace CSV <RotateCcw className="h-3 w-3" />
            </button>
          </div>

          {/* Cleanup Controls Toolbar */}
          <div className="border-b border-[var(--lc-border)] p-4 bg-[#FDFDFD] flex flex-col gap-4 z-10">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--lc-muted)]">
              <span className="text-[var(--lc-ink)]">1 Upload CSV</span>
              <span className="text-[var(--lc-border-mid)]">→</span>
              <span className="text-[var(--lc-ink)]">2 Choose cleanup rules</span>
              <span className="text-[var(--lc-border-mid)]">→</span>
              <span>3 Review rows</span>
              <span className="text-[var(--lc-border-mid)]">→</span>
              <span>4 Export</span>
            </div>
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--lc-muted)] mb-2">Cleaning Rules</h3>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="column-select" className="block text-[13px] font-medium text-[var(--lc-muted)] mb-1">Target column</label>
                <select
                  id="column-select"
                  value={selectedColumn}
                  onChange={(event) => {
                    const nextColumn = event.target.value;
                    const nextDetection = detections.find(d => d.header === nextColumn);
                    applyConfigChange({ selectedColumn: nextColumn, duplicateMode });
                    trackToolEvent("csv-lead-cleaner", "change_column", { column_type: nextDetection?.type ?? "unknown" });
                  }}
                  className="w-full rounded-md border border-[var(--lc-border-mid)] bg-[var(--lc-surface)] px-3 py-2 text-sm text-[var(--lc-ink)] focus:border-[var(--lc-accent)] focus:ring-1 focus:ring-[var(--lc-accent)] focus:outline-none transition-colors cursor-pointer"
                >
                  {headers.map((header) => (<option key={header} value={header}>{header}</option>))}
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label htmlFor="duplicate-mode" className="block text-[13px] font-medium text-[var(--lc-muted)] mb-1">Deduplicate by</label>
                <select
                  id="duplicate-mode"
                  value={duplicateMode}
                  onChange={(event) => {
                    const nextMode = event.target.value as DuplicateMode;
                    applyConfigChange({ selectedColumn, duplicateMode: nextMode });
                    trackToolEvent("csv-lead-cleaner", "change_duplicate_mode", { mode: nextMode });
                  }}
                  className="w-full rounded-md border border-[var(--lc-border-mid)] bg-[var(--lc-surface)] px-3 py-2 text-sm text-[var(--lc-ink)] focus:border-[var(--lc-accent)] focus:ring-1 focus:ring-[var(--lc-accent)] focus:outline-none transition-colors cursor-pointer"
                >
                  {DUPLICATE_MODE_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                </select>
              </div>

              {showEmailEnrichment && (
                <div className="flex-1 min-w-[200px]">
                  <label htmlFor="email-filter" className="block text-[13px] font-medium text-[var(--lc-muted)] mb-1">Email filter</label>
                  <select
                    id="email-filter"
                    value={emailFilter}
                    onChange={(event) => {
                      const nextFilter = event.target.value as EmailFilterMode;
                      applyConfigChange({ selectedColumn, duplicateMode, emailFilter: nextFilter });
                      trackToolEvent("csv-lead-cleaner", "change_email_filter", { filter: nextFilter });
                    }}
                    className="w-full rounded-md border border-[var(--lc-border-mid)] bg-[var(--lc-surface)] px-3 py-2 text-sm text-[var(--lc-ink)] focus:border-[var(--lc-accent)] focus:ring-1 focus:ring-[var(--lc-accent)] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="all">Keep all valid emails</option>
                    <option value="business_only">Business emails only</option>
                    <option value="personal_only">Personal emails only</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2">
                {toastVisible && (
                  <div className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[var(--lc-green)] animate-in fade-in zoom-in duration-200">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="flex gap-1">
                  <button type="button" onClick={undoConfigChange} disabled={!pastConfigs.length} className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--lc-border-mid)] text-[var(--lc-muted)] transition hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] disabled:opacity-50" title="Undo">
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={redoConfigChange} disabled={!futureConfigs.length} className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--lc-border-mid)] text-[var(--lc-muted)] transition hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] disabled:opacity-50" title="Redo">
                    <Redo2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Results Summary Row */}
          <div className="p-4 border-b border-[var(--lc-border)] bg-[var(--lc-surface)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--lc-muted)] mb-3">Cleaning Report</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] mb-1">Total rows</p>
                <p className="font-mono text-xl font-semibold text-[var(--lc-ink)] tabular-nums">{cleaned.summary.totalRows.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] mb-1">Duplicates removed</p>
                <p className="font-mono text-xl font-semibold text-[var(--lc-ink)] tabular-nums">{cleaned.summary.duplicatesRemoved.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] mb-1">Invalid removed</p>
                <div className="group relative w-fit">
                  <p className="font-mono text-xl font-semibold text-[var(--lc-ink)] tabular-nums cursor-help border-b border-dashed border-[var(--lc-border-mid)]">{(cleaned.summary.invalidRowsRemoved + cleaned.summary.emptyRowsRemoved + cleaned.summary.filteredRowsRemoved).toLocaleString()}</p>
                  <div className="absolute top-full left-0 mt-1 hidden w-48 rounded bg-[var(--lc-ink)] px-2 py-1 text-[11px] text-white group-hover:block z-50">
                    Includes invalid, blank, and filtered rows
                  </div>
                </div>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--lc-accent)] mb-1">Clean rows</p>
                <p className="font-mono text-xl font-semibold text-[var(--lc-accent)] tabular-nums">{cleaned.summary.cleanRowsReady.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          {warning && (
            <div className="mx-4 mt-4 flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-[13px] font-medium text-amber-800">{warning}</p>
            </div>
          )}

          {/* Data Preview Area */}
          <div className="flex-1 flex flex-col p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--lc-muted)] mb-3">Review</h3>
            <div className="flex flex-col border border-[var(--lc-border)] rounded-lg overflow-hidden flex-1 bg-[var(--lc-surface)]">
              {/* Tab Row */}
              <div className="flex flex-col items-start gap-2 border-b border-[var(--lc-border)] bg-[#FDFDFD] px-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-1">
                  <button type="button" onClick={() => setPreviewMode("clean")} className={`px-4 py-2 text-[13px] rounded-t-md transition-colors ${previewMode === "clean" ? "bg-[var(--lc-surface)] border border-[var(--lc-border)] border-b-[var(--lc-surface)] text-[var(--lc-ink)] font-medium translate-y-px" : "text-[var(--lc-muted)] hover:text-[var(--lc-ink)] border border-transparent"}`}>Clean rows</button>
                  {cleaned.removedRows.length > 0 && <button type="button" onClick={() => setPreviewMode("removed")} className={`px-4 py-2 text-[13px] rounded-t-md transition-colors ${previewMode === "removed" ? "bg-[var(--lc-surface)] border border-[var(--lc-border)] border-b-[var(--lc-surface)] text-[var(--lc-ink)] font-medium translate-y-px" : "text-[var(--lc-muted)] hover:text-[var(--lc-ink)] border border-transparent"}`}>Removed rows</button>}
                  {cleaned.invalidRows.length > 0 && <button type="button" onClick={() => setPreviewMode("invalid")} className={`px-4 py-2 text-[13px] rounded-t-md transition-colors ${previewMode === "invalid" ? "bg-[var(--lc-surface)] border border-[var(--lc-border)] border-b-[var(--lc-surface)] text-[var(--lc-ink)] font-medium translate-y-px" : "text-[var(--lc-muted)] hover:text-[var(--lc-ink)] border border-transparent"}`}>Invalid rows</button>}
                </div>
              </div>
              
              {/* The Table */}
              <div className={`flex-1 overflow-auto bg-[var(--lc-surface)] min-h-[300px]`}>
                {reportHeaders.length && visiblePreviewRows.length ? (
                  <table className="min-w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead className="sticky top-0 z-10 bg-[#FDFDFD]">
                      <tr>
                        <th className="px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] w-8 border-b border-[var(--lc-border)]">#</th>
                        {previewMode !== "clean" && <th className="px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[var(--lc-hint)] border-b border-[var(--lc-border)]">REASON</th>}
                        {reportHeaders.map((header) => {
                          const isComputed = header.startsWith("leadcleanr_");
                          return (
                            <th key={header} title={isComputed ? "Added by LeadCleanr" : undefined} className={`px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider border-b border-[var(--lc-border)] ${isComputed ? "text-[var(--lc-accent)]" : "text-[var(--lc-hint)]"}`}>
                              {isComputed && <span className="mr-1">✦</span>}
                              {prettyHeader(header)}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {visiblePreviewRows.map((row, index) => (
                        <tr key={index} className="hover:bg-[var(--lc-bg)] border-b border-[var(--lc-border)] last:border-0 transition-colors">
                          <td className="px-3 py-2.5 font-mono text-[12px] text-[var(--lc-hint)] w-8">{index + 1}</td>
                          {previewMode !== "clean" && "leadcleanr_reason" in row && (
                            <td className="px-3 py-2.5">
                              <span className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-700">
                                {(row as any).leadcleanr_reason}
                              </span>
                            </td>
                          )}
                          {reportHeaders.map((header) => {
                            const val = row[header];
                            const isMono = header.toLowerCase().includes("email") || header.toLowerCase().includes("phone") || header.toLowerCase().includes("domain");
                            return <td key={header} className={`px-3 py-2.5 text-[14px] text-[var(--lc-ink)] max-w-[280px] truncate ${isMono ? "font-mono text-[13px]" : ""}`} title={String(val || "")}>{val || <span className="text-[var(--lc-border-mid)]">—</span>}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex h-[200px] items-center justify-center text-sm text-[var(--lc-muted)]">
                    No rows available.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Export Footer */}
          <div className="border-t border-[var(--lc-border)] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FDFDFD] rounded-b-xl">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--lc-muted)] hidden sm:block">Export</h3>
            </div>
            
            <button
              type="button"
              onClick={() => {
                trackToolEvent("csv-lead-cleaner", "export_csv", {
                  row_count_bucket: getRowCountBucket(cleaned.rows.length),
                  duplicate_mode: duplicateMode,
                });
                downloadCsvRecords(buildCleanFileName(fileName), cleaned.rows);
              }}
              disabled={!exportReady}
              className="inline-flex items-center justify-center rounded-md bg-[var(--lc-ink)] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed gap-2 w-full sm:w-auto"
            >
              Export CSV <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function cleanCsvRows(
 rows: CsvRow[],
 headers: string[],
 selectedColumn: string,
 duplicateMode: DuplicateMode,
 emailFilter: EmailFilterMode,
): CleanedResult {
 const emptySummary: CleaningSummary = {
 totalRows: rows.length,
 emptyRowsRemoved: 0,
 invalidRowsRemoved: 0,
 duplicatesRemoved: 0,
 filteredRowsRemoved: 0,
 cleanRowsReady: 0,
 businessEmails: 0,
 personalEmails: 0,
 roleBasedEmails: 0,
 generatedDomains: 0,
 };

 if (!headers.length || !selectedColumn) {
 return {
 rows: [],
 summary: emptySummary,
 removedRows: [],
 invalidRows: [],
 blankRows: [],
 duplicateRows: [],
 };
 }

 const nonEmptyRows = rows.filter((row) =>
 headers.some((header) => String(row[header] ?? "").trim() !== ""),
 );

 const emptyRowsRemoved = rows.length - nonEmptyRows.length;
 let invalidRowsRemoved = 0;
 let duplicatesRemoved = 0;
 let filteredRowsRemoved = 0;
 let personalEmails = 0;
 let businessEmails = 0;
 let roleBasedEmails = 0;
 let generatedDomains = 0;
 const seen = new Set<string>();
 const cleanedRows: PreviewRow[] = [];
 const removedRows: Array<PreviewRow & { leadcleanr_reason: RemovalReason }> = [];
 const invalidRows: Array<PreviewRow & { leadcleanr_reason: "invalid" }> = [];
 const blankRows: Array<PreviewRow & { leadcleanr_reason: "blank" }> = [];
 const duplicateRows: Array<PreviewRow & { leadcleanr_reason: "duplicate" }> = [];

 rows.forEach((row) => {
 const hasValues = headers.some((header) => String(row[header] ?? "").trim() !== "");
 if (!hasValues) {
 const nextRow = {
 ...row,
 leadcleanr_reason: "blank" as const,
 };
 removedRows.push(nextRow);
 blankRows.push(nextRow);
 }
 });

 nonEmptyRows.forEach((row) => {
 const normalizedRow = normalizeCsvRow(row, headers, selectedColumn);

 const duplicateKey = buildDuplicateKey(
 normalizedRow,
 headers,
 selectedColumn,
 duplicateMode,
 );

 if (!duplicateKey) {
 invalidRowsRemoved += 1;
 const nextRow = {
 ...normalizedRow,
 leadcleanr_reason: "invalid" as const,
 };
 removedRows.push(nextRow);
 invalidRows.push(nextRow);
 return;
 }

 if (seen.has(duplicateKey)) {
 duplicatesRemoved += 1;
 const nextRow = {
 ...normalizedRow,
 leadcleanr_reason: "duplicate" as const,
 };
 removedRows.push(nextRow);
 duplicateRows.push(nextRow);
 return;
 }

 seen.add(duplicateKey);

 const nextRow: PreviewRow = { ...normalizedRow };
 const emailCandidate = getEmailCandidate(normalizedRow, headers, selectedColumn);

 if (emailCandidate) {
 const domain = extractDomainFromEmail(emailCandidate);

 if (domain) {
 nextRow.leadcleanr_generated_domain = domain;
 generatedDomains += 1;
 }

 const emailType = PERSONAL_EMAIL_DOMAINS.has(domain) ? "personal" : "business";
 nextRow.leadcleanr_email_type = emailType;
 if (emailType === "personal") {
 personalEmails += 1;
 } else {
 businessEmails += 1;
 }

 const localPart = emailCandidate.split("@")[0] ?? "";
 const isRoleBased = ROLE_EMAIL_PREFIXES.has(localPart);
 nextRow.leadcleanr_role_email = isRoleBased ? "role-based" : "direct";
 if (isRoleBased) {
 roleBasedEmails += 1;
 }
 }

 if (emailFilter === "business_only" && nextRow.leadcleanr_email_type === "personal") {
 filteredRowsRemoved += 1;
 const removedRow = { ...nextRow, leadcleanr_reason: "personal_email" as const };
 removedRows.push(removedRow);
 return;
 }

 if (emailFilter === "personal_only" && nextRow.leadcleanr_email_type === "business") {
 filteredRowsRemoved += 1;
 const removedRow = { ...nextRow, leadcleanr_reason: "business_email" as const };
 removedRows.push(removedRow);
 return;
 }

 cleanedRows.push(nextRow);
 });

 return {
 rows: cleanedRows,
 summary: {
 totalRows: rows.length,
 emptyRowsRemoved,
 invalidRowsRemoved,
 duplicatesRemoved,
 filteredRowsRemoved,
 cleanRowsReady: cleanedRows.length,
 personalEmails,
 businessEmails,
 roleBasedEmails,
 generatedDomains,
 },
 removedRows,
 invalidRows,
 blankRows,
 duplicateRows,
 };
}

function normalizeCsvRow(
 row: CsvRow,
 headers: string[],
 selectedColumn: string,
): CsvRow {
 const nextRow: CsvRow = {};

 headers.forEach((header) => {
 const rawValue = String(row[header] ?? "").trim();
 nextRow[header] =
 header === selectedColumn
 ? normalizeSelectedValue(rawValue, selectedColumn)
 : rawValue;
 });

 return nextRow;
}

function normalizeSelectedValue(value: string, columnName: string) {
 const normalizedColumn = columnName.toLowerCase();

 if (normalizedColumn.includes("email")) {
 return normalizeEmailValue(value) ?? "";
 }

 if (normalizedColumn.includes("phone") || normalizedColumn.includes("tel")) {
 return normalizePhoneValue(value) ?? "";
 }

 if (
 normalizedColumn.includes("website") ||
 normalizedColumn.includes("url") ||
 normalizedColumn.includes("link")
 ) {
 return normalizeUrlValue(value) ?? "";
 }

 if (normalizedColumn.includes("domain")) {
 return normalizeDomainValue(value) ?? "";
 }

 return value.trim();
}

function buildDuplicateKey(
 row: CsvRow,
 headers: string[],
 selectedColumn: string,
 duplicateMode: DuplicateMode,
) {
 if (duplicateMode === "selected") {
 return normalizeSelectedValue(row[selectedColumn] ?? "", selectedColumn);
 }

 if (duplicateMode === "entire_row") {
 return JSON.stringify(
 headers.map((header) => String(row[header] ?? "").trim())
 );
 }

 if (duplicateMode === "email") {
 return getEmailCandidate(row, headers, selectedColumn) ?? "";
 }

 if (duplicateMode === "phone") {
 return getFirstNormalizedValue(row, headers, ["phone", "tel"], normalizePhoneValue);
 }

 if (duplicateMode === "domain") {
 return getDomainCandidate(row, headers, selectedColumn) ?? "";
 }

 return "";
}

function getEmailCandidate(row: CsvRow, headers: string[], selectedColumn: string) {
 const selectedValue = row[selectedColumn] ?? "";
 if (selectedColumn.toLowerCase().includes("email")) {
 return normalizeEmailValue(selectedValue) ?? null;
 }

 return (
 getFirstNormalizedValue(row, headers, ["email"], normalizeEmailValue) || null
 );
}

function getDomainCandidate(row: CsvRow, headers: string[], selectedColumn: string) {
 const selectedValue = row[selectedColumn] ?? "";
 const normalizedColumn = selectedColumn.toLowerCase();

 if (normalizedColumn.includes("domain")) {
 return normalizeDomainValue(selectedValue) ?? null;
 }

 if (normalizedColumn.includes("email")) {
 const email = normalizeEmailValue(selectedValue);
 return email ? extractDomainFromEmail(email) : null;
 }

 if (
 normalizedColumn.includes("website") ||
 normalizedColumn.includes("url") ||
 normalizedColumn.includes("link")
 ) {
 const url = normalizeUrlValue(selectedValue);
 return url ? extractDomainFromUrl(url) : null;
 }

 const emailDomain = getFirstNormalizedValue(
 row,
 headers,
 ["email"],
 (value) => {
 const email = normalizeEmailValue(value);
 return email ? extractDomainFromEmail(email) : null;
 },
 );

 if (emailDomain) {
 return emailDomain;
 }

 return (
 getFirstNormalizedValue(
 row,
 headers,
 ["domain", "website", "url", "link"],
 (value, header) => {
 if (header.toLowerCase().includes("domain")) {
 return normalizeDomainValue(value);
 }
 const normalizedUrl = normalizeUrlValue(value);
 return normalizedUrl ? extractDomainFromUrl(normalizedUrl) : null;
 },
 ) || null
 );
}

function getFirstNormalizedValue(
 row: CsvRow,
 headers: string[],
 columnHints: string[],
 normalizer: (value: string, header: string) => string | null,
) {
 for (const header of headers) {
 const normalizedHeader = header.toLowerCase();
 if (!columnHints.some((hint) => normalizedHeader.includes(hint))) {
 continue;
 }

 const value = String(row[header] ?? "").trim();
 const normalized = normalizer(value, header);
 if (normalized) {
 return normalized;
 }
 }

 return "";
}

function normalizeEmailValue(value: string) {
 const nextValue = value.trim().toLowerCase();
 return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(nextValue)
 ? nextValue
 : null;
}

function normalizePhoneValue(value: string) {
 return parseAndFormatPhone(value);
}

function normalizeDomainValue(value: string) {
 const nextValue = value.trim().toLowerCase().replace(/^www\./, "");
 return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(nextValue) ? nextValue : null;
}

function extractDomainFromEmail(email: string) {
 return email.split("@")[1] ?? "";
}

function extractDomainFromUrl(url: string) {
 try {
 const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
 return normalizeDomainValue(parsed.hostname) ?? "";
 } catch {
 return "";
 }
}

function pickDefaultColumn(
 headers: string[],
 detections: CsvColumnDetection[],
) {
 const recommendedDetection = pickBestDetection(detections, [
 "email",
 "phone",
 "domain",
 "url",
 ]);
 if (recommendedDetection) {
 return recommendedDetection.header;
 }

 return (
 headers.find((header) => header.toLowerCase().includes("email")) ??
 headers.find((header) => header.toLowerCase().includes("phone")) ??
 headers.find((header) => header.toLowerCase().includes("domain")) ??
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

function isDuplicateMode(value: string | null): value is DuplicateMode {
 return DUPLICATE_MODE_OPTIONS.some((option) => option.value === value);
}

function buildCleanFileName(fileName: string) {
 if (!fileName) {
 return "leadcleanr-clean.csv";
 }

 return fileName.toLowerCase().endsWith(".csv")
 ? fileName.replace(/\.csv$/i, "-clean.csv")
 : `${fileName}-clean.csv`;
}

function buildOriginalBackupFileName(fileName: string) {
 if (!fileName) {
 return "leadcleanr-original-backup.csv";
 }

 return fileName.toLowerCase().endsWith(".csv")
 ? fileName.replace(/\.csv$/i, "-original-backup.csv")
 : `${fileName}-original-backup.csv`;
}

function buildWarningSummary(warnings: string[]) {
 const preview = warnings.slice(0, 2).join(" ");
 const suffix =
 warnings.length > 2 ? ` ${warnings.length - 2} more parsing issues found.` : "";
 return `We imported the readable rows, but found CSV formatting issues. ${preview}${suffix}`;
}

function prettyHeader(header: string) {
 if (header.startsWith("leadcleanr_")) {
 return header
 .replace("leadcleanr_", "")
 .replaceAll("_", " ")
 .replace(/\b\w/g, (match) => match.toUpperCase());
 }
 return header;
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
 <p className="text-sm font-semibold text-[color:var(--foreground)]">
 {pendingFile.name} · {pendingFile.sizeMb.toFixed(1)} MB
 </p>
 <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
 {pendingFile.exceedsFreeLimit
 ? `This file is over the 5 MB free limit. It looks like about ${formatRowEstimate(pendingFile.estimatedRows)} rows. Free typically fits around ${formatRowEstimate(pendingFile.estimatedRowsWithinFreeLimit)} rows of this density.`
 : `This file fits inside the free 5 MB limit and looks like about ${formatRowEstimate(pendingFile.estimatedRows)} rows for browser-side cleanup.`}
 </p>
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
 points,
}: {
 title: string;
 description: string;
 points?: string[];
}) {
 return (
 <div className="p-6">
 <p className="text-base font-semibold text-[color:var(--foreground)]">
 {title}
 </p>
 <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
 {description}
 </p>
 {points?.length ? (
 <div className="mt-4 grid gap-3 sm:grid-cols-3">
 {points.map((point) => (
 <div
 key={point}
 className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-[color:var(--foreground)]"
 >
 {point}
 </div>
 ))}
 </div>
 ) : null}
 </div>
 );
}

function WorkflowSteps({
 hasLoadedFile,
 exportReady,
}: {
 hasLoadedFile: boolean;
 exportReady: boolean;
}) {
 const steps = [
 { num: 1, label: "Upload CSV" },
 { num: 2, label: "Review cleanup" },
 { num: 3, label: "Export clean file" },
 ];

 const currentStep = useMemo(() => {
 if (!hasLoadedFile) return 1;
 if (!exportReady) return 2;
 return 3;
 }, [hasLoadedFile, exportReady]);

 return (
 <div className="w-full">
 <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
 Workflow Steps
 </p>
 <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:gap-4">
 {steps.map((step, index) => {
 const isActive = currentStep === step.num;
 const isCompleted = currentStep > step.num;

 return (
 <div key={step.num} className="flex items-center gap-3">
 <div className="flex items-center gap-2">
 <div
 className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold border transition ${
 isActive
 ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
 : isCompleted
 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
 : "bg-white text-slate-500 border-slate-200"
 }`}
 >
 {isCompleted ? <Check className="h-4 w-4" /> : step.num}
 </div>
 <span
 className={`text-xs font-medium transition ${
 isActive
 ? "text-slate-900 font-semibold"
 : isCompleted
 ? "text-slate-500 font-medium"
 : "text-slate-500"
 }`}
 >
 {step.label}
 </span>
 </div>
 {index < steps.length - 1 && (
 <div className="hidden h-px w-6 bg-slate-200 sm:block" />
 )}
 </div>
 );
 })}
 </div>
 </div>
 );
}

function ExportActions({
 cleanedRows,
 removedRows,
 invalidRows,
 duplicateMode,
 fileName,
}: {
 cleanedRows: PreviewRow[];
 removedRows: PreviewRow[];
 invalidRows: PreviewRow[];
 duplicateMode: DuplicateMode;
 fileName: string;
}) {
 const fileUploaded = Boolean(fileName);
 const exportUnlocked = cleanedRows.length > 0;

 return (
 <div className={`rounded-xl border p-5 sm:p-7 transition-all duration-300 ${exportUnlocked ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/60 to-white shadow-sm' : 'panel-soft'}`}>
 {/* Step 3 Header */}
 <div className="flex items-center gap-2 mb-4">
 <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border ${exportUnlocked ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-500 border-slate-200'}`}>
 {exportUnlocked ? <Check className="h-4 w-4" /> : '3'}
 </span>
 <span className={`text-xs font-bold uppercase tracking-wider ${exportUnlocked ? 'text-emerald-800' : 'text-slate-500'}`}>Export</span>
 {exportUnlocked && (
 <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/50">
 Local only
 </span>
 )}
 </div>

 {exportUnlocked ? (
 <>
 {/* Success Count */}
 <div className="rounded-xl bg-white border border-emerald-100 p-4 mb-4">
 <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Clean leads ready</p>
 <p className="font-display text-3xl font-bold text-emerald-700 tabular-nums">
 {cleanedRows.length.toLocaleString()}
 </p>
 <p className="mt-1 text-[11px] text-slate-500">Ready for CRM, outreach, or recruiting import.</p>
 </div>
 </>
 ) : (
 <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2 mb-4">
 <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
 Export Summary
 </p>
 <div className="space-y-1.5">
 {[
 { label: "Waiting for CSV", checked: fileUploaded },
 { label: "Clean rows not ready yet", checked: exportUnlocked },
 { label: "Export locked", checked: exportUnlocked },
 ].map((item, i) => {
 const isDone = item.checked;
 return (
 <div key={i} className="flex items-center gap-2 text-xs">
 <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold ${
 isDone
 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
 : "bg-white text-slate-500 border-slate-200"
 }`}>
 {isDone ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
 </span>
 <span className={isDone ? "text-slate-500 font-medium" : "text-slate-600 font-medium"}>
 {item.label}
 </span>
 </div>
 );
 })}
 </div>
 </div>
 )}

 <div className="space-y-3">
 <button
 type="button"
 onClick={() => {
 trackToolEvent("csv-lead-cleaner", "export_csv", {
 row_count_bucket: getRowCountBucket(cleanedRows.length),
 duplicate_mode: duplicateMode,
 });
 downloadCsvRecords(buildCleanFileName(fileName), cleanedRows);
 }}
 disabled={!exportUnlocked}
 className={`inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
 exportUnlocked
 ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm cursor-pointer"
 : "bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed"
 }`}
 >
 <Download className="h-4 w-4" />
 Export Clean CSV
 </button>

 {removedRows.length > 0 && (
 <button
 type="button"
 onClick={() => {
 downloadCsvRecords(fileName.replace(/\.csv$/i, "-removed.csv"), removedRows);
 }}
 className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition shadow-xs cursor-pointer"
 >
 <Download className="h-4 w-4" />
 Download Removed Rows
 </button>
 )}

 {invalidRows.length > 0 && (
 <button
 type="button"
 onClick={() => {
 downloadCsvRecords(fileName.replace(/\.csv$/i, "-invalid.csv"), invalidRows);
 }}
 className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition shadow-xs cursor-pointer"
 >
 <Download className="h-4 w-4" />
 Download Invalid Rows
 </button>
 )}
 </div>

 <p className="mt-4 text-xs leading-relaxed text-slate-500 text-center">
 {exportUnlocked
 ? "Processed in your browser. CSV never uploaded."
 : "Export unlocks after upload and cleanup."}
 </p>
 </div>
 );
}

function ChecklistMetric({
 label,
 value,
}: {
 label: string;
 value: number;
}) {
 return (
 <div className="rounded-xl border border-[color:rgba(15,118,110,0.1)] bg-white/82 px-3 py-3">
 <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
 {label}
 </p>
 <p className="mt-1 text-xl font-semibold tabular-nums text-[color:var(--foreground)]">
 {value.toLocaleString()}
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
 <div className="flex items-start justify-between gap-2">
 <span className="text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">
 {label}
 </span>
 {icon && <div className="text-slate-500 shrink-0">{icon}</div>}
 </div>
 <div className="mt-3 text-2xl font-bold tabular-nums text-slate-900">
 {value.toLocaleString()}
 </div>
 </div>
 );
}

function InsightTile({
 label,
 value,
 tone,
 icon,
}: {
 label: string;
 value: number;
 tone: "teal" | "amber" | "slate";
 icon?: React.ReactNode;
}) {
 const actualTone = value === 0 && tone === "amber" ? "slate" : tone;
 const palette = {
 teal: "border-teal-100 bg-teal-50/30 text-teal-800 hover:border-teal-200",
 amber: "border-amber-100 bg-amber-50/30 text-amber-800 hover:border-amber-200",
 slate: "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300",
 }[actualTone];

 return (
 <div className={`rounded-xl border px-4 py-4 transition-all duration-300 hover:shadow-xs ${palette}`}>
 <div className="flex items-start justify-between gap-2">
 <span className="text-xs font-bold uppercase tracking-wider leading-tight">
 {label}
 </span>
 {icon && <div className="opacity-80 shrink-0">{icon}</div>}
 </div>
 <p className="mt-3 text-2xl font-bold tabular-nums">
 {value.toLocaleString()}
 </p>
 </div>
 );
}
