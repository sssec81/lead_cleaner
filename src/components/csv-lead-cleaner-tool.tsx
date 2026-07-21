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
import {
 type KeyboardEvent as ReactKeyboardEvent,
 useCallback,
 useEffect,
 useMemo,
 useState,
} from "react";
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
import {
  cleanCsvRows,
  type CleanedResult,
  type CleaningSummary,
  type DuplicateMode,
  type EmailFilterMode,
  type PreviewRow,
  type RemovalReason,
} from "@/lib/csv-cleaner";
import { downloadCsvRecords } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import { CleanupPresetControls } from "@/components/cleanup-preset-controls";
import { CrmExportControls } from "@/components/crm-export-controls";
import { LocalWorkspaceHistory } from "@/components/local-workspace-history";
import { CsvCleanerQuickGuide } from "@/components/csv-cleaner-quick-guide";
import type { LocalWorkspaceSnapshot } from "@/lib/local-workspace-history";
import {
  CRM_EXPORT_FORMAT_OPTIONS,
  type CrmExportFormat,
  type CrmFieldOverrides,
} from "@/lib/crm-export";
import type { CleanupPresetRules } from "@/lib/cleanup-presets";

type UploadStatus = "idle" | "parsing" | "ready" | "error";
type PreviewMode = "clean" | "removed" | "invalid";

const PREVIEW_LIMIT = 100;
const MAX_CSV_CONFIG_HISTORY = 30;
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
	 const requestedCrm = parseCrmFormat(searchParams.get("crm"));
 const [fileName, setFileName] = useState("");
 const [headers, setHeaders] = useState<string[]>([]);
 const [rows, setRows] = useState<CsvRow[]>([]);
 const [detections, setDetections] = useState<CsvColumnDetection[]>([]);
 const [selectedColumn, setSelectedColumn] = useState("");
 const [duplicateMode, setDuplicateMode] = useState<DuplicateMode>("selected");
	 const [emailFilter, setEmailFilter] = useState<EmailFilterMode>("all");
	 const [crmFormat, setCrmFormat] = useState<CrmExportFormat>(requestedCrm);
	 const [crmOverridesByFormat, setCrmOverridesByFormat] = useState<
	 Partial<Record<Exclude<CrmExportFormat, "clean_csv">, CrmFieldOverrides>>
	 >({});
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
 const [previewMode, setPreviewMode] = useState<PreviewMode>(
 "clean",
 );
 const [hasAppliedQuerySample, setHasAppliedQuerySample] = useState(false);
 const [toastVisible, setToastVisible] = useState(false);
	 const [mounted, setMounted] = useState(false);
	 const activeCrmOverrides = crmFormat === "clean_csv"
	 ? {}
	 : crmOverridesByFormat[crmFormat] ?? {};

  const resetState = useCallback((nextFileName = "") => {
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
  }, []);

  const loadDemoCsv = useCallback(() => {
    const result = parseCsvText(DEMO_CSV, { preserveBlankRows: true });
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
  }, [resetState]);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const cleaned: CleanedResult = useMemo(
    () => cleanCsvRows(rows, headers, selectedColumn, duplicateMode, emailFilter),
    [duplicateMode, headers, rows, selectedColumn, emailFilter],
  );
  const summary: CleaningSummary = cleaned.summary;
  const workspaceWarning = [warning, cleaned.warning].filter(Boolean).join(" ");

  const previewRows = cleaned.rows.slice(0, PREVIEW_LIMIT);
  const isParsing = status === "parsing";
  const showEmailEnrichment =
    selectedColumn &&
    (selectedColumn.toLowerCase().includes("email") || summary.generatedDomains > 0);

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

    setTimeout(() => {
      loadDemoCsv();
      setHasAppliedQuerySample(true);
    }, 0);
  }, [hasAppliedQuerySample, shouldLoadSampleFromQuery, loadDemoCsv]);




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
      setError(err instanceof Error ? err.message : "Failed to read file.");
      trackToolEvent("csv-lead-cleaner", "upload_failed", {
        reason: "inspection_error",
      });
      return;
    }

    if (!isLikelyCsvFile(file)) {
      resetState();
      setStatus("error");
      setError("Please upload a valid CSV file (.csv extension or comma/semicolon/tab separated text).");
      trackToolEvent("csv-lead-cleaner", "upload_failed", {
        reason: "invalid_mime",
      });
      return;
    }

    resetState(file.name);
    setPendingFile({
      name: file.name,
      sizeMb: file.size / (1024 * 1024),
      exceedsFreeLimit: file.size > MAX_CSV_FILE_SIZE,
      estimatedRows: inspection.estimatedRows,
      estimatedRowsWithinFreeLimit: inspection.estimatedRowsWithinFreeLimit,
    });

    if (file.size > MAX_CSV_FILE_SIZE) {
      setStatus("error");
      setError(`CSV files up to 5 MB can be cleaned completely free in the browser. This file exceeds the limit.`);
      trackToolEvent("csv-lead-cleaner", "upload_failed", {
        reason: "file_too_large",
      });
      return;
    }

    setStatus("parsing");
    setProgress({ percentage: 0, rowsProcessed: 0 });

    parseCsvFile({
      file,
      preserveBlankRows: true,
      onProgress: (prog) => {
        setProgress(prog);
      },
      onComplete: (result) => {
        setStatus("ready");
        setError("");
        setHeaders(result.headers);
        setRows(result.rows);

        const nextDetections = detectCsvColumns(result.headers, result.rows);
        setDetections(nextDetections);
        setSelectedColumn(pickDefaultColumn(result.headers, nextDetections));

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
 ].slice(-MAX_CSV_CONFIG_HISTORY));
 setFutureConfigs([]);
 setSelectedColumn(nextConfig.selectedColumn);
 setDuplicateMode(nextConfig.duplicateMode);
 setEmailFilter(nextEmailFilter);

 setToastVisible(true);
 setTimeout(() => setToastVisible(false), 1500);
 }

 const undoConfigChange = useCallback(() => {
 setPastConfigs((current) => {
 const previous = current.at(-1);
 if (!previous) {
 return current;
 }

 setFutureConfigs((future) => [
 { selectedColumn, duplicateMode, emailFilter },
 ...future,
 ].slice(0, MAX_CSV_CONFIG_HISTORY));
 setSelectedColumn(previous.selectedColumn);
 setDuplicateMode(previous.duplicateMode);
 setEmailFilter(previous.emailFilter);

 return current.slice(0, -1);
 });
 }, [duplicateMode, emailFilter, selectedColumn]);

 const redoConfigChange = useCallback(() => {
 setFutureConfigs((current) => {
 const next = current[0];
 if (!next) {
 return current;
 }

 setPastConfigs((past) => [
 ...past,
 { selectedColumn, duplicateMode, emailFilter },
 ].slice(-MAX_CSV_CONFIG_HISTORY));
 setSelectedColumn(next.selectedColumn);
 setDuplicateMode(next.duplicateMode);
 setEmailFilter(next.emailFilter);

 return current.slice(1);
 });
 }, [duplicateMode, emailFilter, selectedColumn]);

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

 useEffect(() => {
 const handleShortcut = (event: globalThis.KeyboardEvent) => {
 const target = event.target as HTMLElement | null;
 const isEditing = target?.matches("input, textarea, select, [contenteditable='true']");
 if (!hasLoadedFile || isEditing || !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;

 event.preventDefault();
 if (event.shiftKey) redoConfigChange();
 else undoConfigChange();
 };

 window.addEventListener("keydown", handleShortcut);
 return () => window.removeEventListener("keydown", handleShortcut);
 }, [hasLoadedFile, redoConfigChange, undoConfigChange]);
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
 const availablePreviewModes: Array<{ mode: PreviewMode; label: string }> = [
 { mode: "clean", label: "Clean rows" },
 ...(cleaned.removedRows.length
 ? [{ mode: "removed" as const, label: "Removed rows" }]
 : []),
 ...(cleaned.invalidRows.length
 ? [{ mode: "invalid" as const, label: "Invalid rows" }]
 : []),
 ];

 function handlePreviewTabKeyDown(
 event: ReactKeyboardEvent<HTMLButtonElement>,
 mode: PreviewMode,
 ) {
 if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
 event.preventDefault();

 const currentIndex = availablePreviewModes.findIndex((item) => item.mode === mode);
 const nextIndex =
 event.key === "Home"
 ? 0
 : event.key === "End"
 ? availablePreviewModes.length - 1
 : event.key === "ArrowRight"
 ? (currentIndex + 1) % availablePreviewModes.length
 : (currentIndex - 1 + availablePreviewModes.length) % availablePreviewModes.length;
 const nextMode = availablePreviewModes[nextIndex]?.mode;

 if (nextMode) {
 setPreviewMode(nextMode);
 document.getElementById(`preview-tab-${nextMode}`)?.focus();
 }
 }

	 function restoreLocalWorkspace(snapshot: LocalWorkspaceSnapshot) {
 const nextDetections = detectCsvColumns(snapshot.headers, snapshot.rows);
 const estimatedBytes = new Blob([JSON.stringify(snapshot.rows)]).size;

 resetState(snapshot.fileName);
 setPendingFile({
 name: snapshot.fileName,
 sizeMb: estimatedBytes / (1024 * 1024),
 exceedsFreeLimit: false,
 estimatedRows: snapshot.rows.length,
 estimatedRowsWithinFreeLimit: snapshot.rows.length,
 });
 setError("");
 setHeaders(snapshot.headers);
 setRows(snapshot.rows);
 setDetections(nextDetections);
 setSelectedColumn(
 snapshot.headers.includes(snapshot.selectedColumn)
 ? snapshot.selectedColumn
 : pickDefaultColumn(snapshot.headers, nextDetections),
 );
 setDuplicateMode(snapshot.duplicateMode);
 setEmailFilter(snapshot.emailFilter);
	 setStatus("ready");
	 }

	 function applySavedWorkflow(rules: CleanupPresetRules) {
	 applyConfigChange(rules);
	 const nextFormat = rules.crmFormat ?? "clean_csv";
	 setCrmFormat(nextFormat);
	 if (nextFormat !== "clean_csv") {
	 setCrmOverridesByFormat((current) => ({
	 ...current,
	 [nextFormat]: { ...(rules.crmFieldOverrides ?? {}) },
	 }));
	 }
	 }

      return (
    <div className={`w-full transition-opacity duration-200 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <CsvCleanerQuickGuide onLoadSample={loadDemoCsv} />
      <LocalWorkspaceHistory
        currentWorkspace={hasLoadedFile ? {
          fileName,
          headers,
          rows,
          selectedColumn,
          duplicateMode,
          emailFilter,
        } : null}
        onRestore={restoreLocalWorkspace}
      />
      {!hasLoadedFile ? (
        /* ── Main Upload Panel (Empty State) ── */
	        <div className="flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 bg-white border border-[var(--lc-border)] rounded-[28px] shadow-[var(--shadow-elevated)]">
	          <div className="mb-6 w-full max-w-3xl">
	            <CrmDestinationPicker value={crmFormat} onChange={setCrmFormat} />
	          </div>
	          <label
            htmlFor="csv-upload"
            className={`group relative flex w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 px-6 py-10 text-center transition-all bg-[var(--lc-surface-muted)] hover:bg-black/[0.01] ${
              isParsing ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <input id="csv-upload" type="file" accept=".csv,text/csv" className="sr-only" onChange={handleFileUpload} disabled={isParsing} />
            
            <Upload className="h-6 w-6 text-[var(--lc-accent)] mb-2" />
            
            <p className="text-[15px] font-semibold text-[var(--lc-ink)] mb-1">
	              {crmFormat === "clean_csv" ? "Drop your messy lead CSV" : `Drop the CSV you want to import into ${crmFormatLabel(crmFormat)}`}
            </p>
            <p className="text-[13px] text-[var(--lc-muted)] mb-5">
	              {crmFormat === "clean_csv"
	                ? "We'll detect email, phone, URL, and domain columns automatically."
	                : `We'll clean, map, and run row-level ${crmFormatLabel(crmFormat)} preflight checks locally.`}
            </p>
            
            <div className="flex items-center justify-center gap-3">
              {isParsing ? (
                <LoaderCircle className="h-5 w-5 animate-spin text-[var(--lc-muted)]" />
              ) : (
                <>
                  <span className="lc-button-primary">
                    Browse CSV
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      loadDemoCsv();
                    }}
                    className="lc-button-secondary"
                  >
                    Try sample CSV
                  </button>
                </>
              )}
            </div>
          </label>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 font-sans text-[11px] text-[var(--lc-muted)]">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Processed locally</span>
            <span className="text-black/10">·</span>
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Browser-only</span>
            <span className="text-black/10">·</span>
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Max 5MB file</span>
          </div>

          {error && (
            <div role="alert" className="mt-5 w-full max-w-xl rounded-xl border border-red-100 bg-red-50/50 p-4 text-left">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-[var(--lc-danger)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-[var(--lc-ink)]">Upload failed</h4>
                  <p className="mt-0.5 text-xs text-[var(--lc-muted)]">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {pendingFile ? (
            <div className="mt-5 w-full max-w-xl">
              <FileSizeNotice pendingFile={pendingFile} />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col flex-1 bg-white border border-[var(--lc-border)] rounded-[28px] shadow-[var(--shadow-elevated)] overflow-hidden">
          
          {/* ── Workspace Header ── */}
          <div className="flex items-center justify-between border-b border-[var(--lc-border)] p-4 bg-[var(--lc-surface-raised)]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <span className="font-semibold text-[13px] text-[var(--lc-ink)] truncate max-w-[200px] sm:max-w-[300px]" title={fileName}>
                {fileName}
              </span>
            </div>

            <button
              onClick={() => resetState()}
              className="lc-button-secondary py-1 px-3 text-[12px]"
            >
              Replace CSV
            </button>
          </div>

          {/* Cleanup Controls Toolbar */}
          <div className="border-b border-[var(--lc-border)] p-4 bg-[var(--lc-surface-raised)] flex flex-col gap-3.5 z-10">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium tracking-tight text-[var(--lc-muted)]">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700"><Check className="h-3 w-3" aria-hidden="true" /> Upload CSV</span>
              <span className="text-black/10">·</span>
              <span className="bg-[var(--lc-accent-bg)] text-[var(--lc-accent)] font-semibold px-2 py-0.5 rounded-full">2 Choose cleanup rules</span>
              <span className="text-black/10">·</span>
              <span>3 Review rows</span>
              <span className="text-black/10">·</span>
              <span>4 Export</span>
            </div>

	            <CleanupPresetControls
	              currentRules={{
	                selectedColumn,
	                duplicateMode,
	                emailFilter,
	                crmFormat,
	                crmFieldOverrides: activeCrmOverrides,
	              }}
	              availableColumns={headers}
	              onApply={applySavedWorkflow}
	            />
            
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-tight text-[var(--lc-muted)] mb-1.5">Cleaning Rules</h3>
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label htmlFor="column-select" className="block text-[12px] font-medium text-[var(--lc-muted)] mb-1">Target column</label>
                  <select
                    id="column-select"
                    value={selectedColumn}
                    onChange={(event) => {
                      const nextColumn = event.target.value;
                      const nextDetection = detections.find(d => d.header === nextColumn);
                      applyConfigChange({ selectedColumn: nextColumn, duplicateMode });
                      trackToolEvent("csv-lead-cleaner", "change_column", { column_type: nextDetection?.type ?? "unknown" });
                    }}
                    className="lc-select w-full"
                  >
                    {headers.map((header) => (<option key={header} value={header}>{header}</option>))}
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label htmlFor="duplicate-mode" className="block text-[12px] font-medium text-[var(--lc-muted)] mb-1">Deduplicate by</label>
                  <select
                    id="duplicate-mode"
                    value={duplicateMode}
                    onChange={(event) => {
                      const nextMode = event.target.value as DuplicateMode;
                      applyConfigChange({ selectedColumn, duplicateMode: nextMode });
                      trackToolEvent("csv-lead-cleaner", "change_duplicate_mode", { mode: nextMode });
                    }}
                    className="lc-select w-full"
                  >
                    {DUPLICATE_MODE_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                  </select>
                </div>

                {showEmailEnrichment && (
                  <div className="flex-1 min-w-[200px]">
                    <label htmlFor="email-filter" className="block text-[12px] font-medium text-[var(--lc-muted)] mb-1">Email filter</label>
                    <select
                      id="email-filter"
                      value={emailFilter}
                      onChange={(event) => {
                        const nextFilter = event.target.value as EmailFilterMode;
                        applyConfigChange({ selectedColumn, duplicateMode, emailFilter: nextFilter });
                        trackToolEvent("csv-lead-cleaner", "change_email_filter", { filter: nextFilter });
                      }}
                      className="lc-select w-full"
                    >
                      <option value="all">Keep all valid emails</option>
                      <option value="business_only">Business emails only</option>
                      <option value="personal_only">Personal emails only</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {toastVisible && (
                    <div role="status" aria-live="polite" className="flex items-center gap-1.5 px-2 py-1 text-[13px] font-medium text-[var(--lc-green)] animate-in fade-in zoom-in duration-200">
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Cleanup settings updated.</span>
                    </div>
                  )}
                  <div className="flex gap-1">
                    <button type="button" onClick={undoConfigChange} disabled={!pastConfigs.length} aria-keyshortcuts="Control+Z Meta+Z" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-white text-[var(--lc-muted)] hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] transition-colors disabled:opacity-50" aria-label="Undo cleanup setting change" title="Undo">
                      <Undo2 className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={redoConfigChange} disabled={!futureConfigs.length} aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-white text-[var(--lc-muted)] hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] transition-colors disabled:opacity-50" aria-label="Redo cleanup setting change" title="Redo">
                      <Redo2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Strip */}
          <div className="lc-status-strip" role="status" aria-label="Cleanup results summary">
            <span><strong>{summary.totalRows.toLocaleString()}</strong> total rows</span>
            <span className="text-black/10" aria-hidden="true">·</span>
            <span><strong>{summary.duplicatesRemoved.toLocaleString()}</strong> duplicates removed</span>
            <span className="text-black/10" aria-hidden="true">·</span>
            <span><strong>{(summary.invalidRowsRemoved + summary.emptyRowsRemoved + summary.filteredRowsRemoved).toLocaleString()}</strong> invalid/blank removed</span>
            <span className="text-black/10" aria-hidden="true">·</span>
            <span className="text-[var(--lc-accent)] font-semibold"><strong>{summary.cleanRowsReady.toLocaleString()}</strong> ready</span>
          </div>

          {/* Warning Banner */}
          {workspaceWarning && (
            <div role="status" aria-live="polite" className="flex items-center gap-2 bg-amber-50/50 px-4 py-2 border-b border-[var(--lc-border)] text-amber-900">
              <AlertTriangle className="h-4 w-4 text-[var(--lc-warning)] shrink-0" />
              <p className="text-xs font-medium">{workspaceWarning}</p>
            </div>
          )}

          {/* Data Preview Area */}
          <div className="flex-1 flex flex-col p-4">
            <div className="flex flex-col border border-[var(--lc-border)] rounded-2xl overflow-hidden flex-1 bg-white">
              {/* Tab Row */}
              <div className="flex flex-col items-start gap-2 border-b border-[var(--lc-border)] bg-[var(--lc-surface-raised)] px-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div role="tablist" aria-label="CSV row previews" className="flex flex-wrap items-center gap-1">
                  {availablePreviewModes.map(({ mode, label }) => (
                    <button
                      key={mode}
                      id={`preview-tab-${mode}`}
                      type="button"
                      role="tab"
                      aria-selected={previewMode === mode}
                      aria-controls="preview-tab-panel"
                      tabIndex={previewMode === mode ? 0 : -1}
                      onClick={() => setPreviewMode(mode)}
                      onKeyDown={(event) => handlePreviewTabKeyDown(event, mode)}
                      className={`min-h-11 rounded-t-md px-4 py-2 text-xs transition-colors ${previewMode === mode ? "translate-y-px border border-[var(--lc-border)] border-b-white bg-white font-semibold text-[var(--lc-ink)]" : "text-[var(--lc-muted)] hover:text-[var(--lc-ink)]"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* The Table */}
              <div
                id="preview-tab-panel"
                role="tabpanel"
                aria-labelledby={`preview-tab-${previewMode}`}
                tabIndex={0}
                className="min-h-[300px] flex-1 overflow-auto bg-white"
              >
                {reportHeaders.length && visiblePreviewRows.length ? (
                  <div className="lc-table-scroll">
                    <table aria-label={previewLabel} className="lc-data-table lc-data-table-compact">
                      <caption className="sr-only">{previewDescription}</caption>
                      <thead>
                        <tr>
                          <th scope="col" className="lc-data-table-index">#</th>
                          {previewMode !== "clean" && <th scope="col">Reason</th>}
                          {reportHeaders.map((header) => {
                            const isComputed = header.startsWith("leadcleanr_");
                            return (
                              <th scope="col" key={header} title={isComputed ? "Added by LeadCleanr" : prettyHeader(header)} className={isComputed ? "text-[var(--lc-accent)]" : undefined}>
                                {isComputed && <Sparkles aria-hidden="true" className="mr-1 inline h-3 w-3" />}
                                {prettyHeader(header)}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {visiblePreviewRows.map((row, index) => (
                          <tr key={index}>
                            <td className="lc-data-table-index">{index + 1}</td>
                            {previewMode !== "clean" && "leadcleanr_reason" in row && (
                              <td className="px-3 py-2">
                                <span className="lc-status-pill lc-status-pill-danger">
                                  {(row as any).leadcleanr_reason}
                                </span>
                              </td>
                            )}
                            {reportHeaders.map((header) => {
                              const val = row[header];
                              const isMono = header.toLowerCase().includes("email") || header.toLowerCase().includes("phone") || header.toLowerCase().includes("domain");
                              return <td key={header} className={`max-w-[280px] truncate ${isMono ? "lc-data-table-value" : ""}`} title={String(val || "")}>{val || <span className="text-[var(--lc-hint)]">—</span>}</td>;
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center text-xs text-[var(--lc-muted)]">
                    No rows available.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Export Footer */}
          <div className="border-t border-[var(--lc-border)] bg-[var(--lc-surface-raised)] p-4">
            <CrmExportControls
              rows={cleaned.rows}
              sourceHeaders={previewHeaders}
              fileName={fileName}
              duplicateMode={duplicateMode}
              selectedColumn={selectedColumn}
              emailFilter={emailFilter}
	              summary={summary}
	              format={crmFormat}
	              overrides={activeCrmOverrides}
	              onFormatChange={setCrmFormat}
	              onOverridesChange={(overrides) => {
	                if (crmFormat === "clean_csv") return;
	                setCrmOverridesByFormat((current) => ({
	                  ...current,
	                  [crmFormat]: overrides,
	                }));
	              }}
	            />
          </div>
        </div>
      )}
    </div>
  );
}

function CrmDestinationPicker({
 value,
 onChange,
}: {
 value: CrmExportFormat;
 onChange: (format: CrmExportFormat) => void;
}) {
 return (
 <fieldset>
 <legend className="text-center font-display text-xl font-bold tracking-[-0.025em] text-[var(--lc-ink)] sm:text-2xl">
 Where is this CSV going?
 </legend>
 <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-6 text-[var(--lc-muted)]">
 Choose a destination first so cleanup, mapping, and readiness checks work toward the actual import.
 </p>
 <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
 {CRM_EXPORT_FORMAT_OPTIONS.map((option) => {
 const selected = value === option.value;
 return (
 <button
 key={option.value}
 type="button"
 aria-pressed={selected}
 onClick={() => {
 onChange(option.value);
 trackToolEvent("csv-lead-cleaner", "choose_crm_destination", { export_format: option.value });
 }}
 className={`min-h-12 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lc-accent)] ${
 selected
 ? "border-[var(--lc-accent)] bg-[var(--lc-accent-bg)] text-[var(--lc-accent)] shadow-sm"
 : "border-[var(--lc-border)] bg-white text-[var(--lc-muted)] hover:border-[var(--lc-border-mid)] hover:text-[var(--lc-ink)]"
 }`}
 >
 {option.value === "clean_csv" ? "Just clean it" : crmFormatLabel(option.value)}
 </button>
 );
 })}
 </div>
 </fieldset>
 );
}

function parseCrmFormat(value: string | null): CrmExportFormat {
 return CRM_EXPORT_FORMAT_OPTIONS.some((option) => option.value === value)
 ? value as CrmExportFormat
 : "hubspot";
}

function crmFormatLabel(format: CrmExportFormat) {
 if (format === "hubspot") return "HubSpot";
 if (format === "salesforce") return "Salesforce";
 if (format === "apollo") return "Apollo";
 if (format === "pipedrive") return "Pipedrive";
 return "a clean CSV";
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
 <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--lc-muted)]">
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
 ? "bg-[var(--lc-accent)] text-white border-[var(--lc-accent)] shadow-2xs"
 : isCompleted
 ? "bg-[var(--lc-green-bg)] text-[var(--lc-green)] border-[var(--lc-green-bg)]"
 : "bg-white text-[var(--lc-muted)] border-[var(--lc-border)]"
 }`}
 >
 {isCompleted ? <Check className="h-4 w-4" /> : step.num}
 </div>
 <span
 className={`text-xs font-medium transition ${
 isActive
 ? "text-[var(--lc-ink)] font-semibold"
 : isCompleted
 ? "text-[var(--lc-muted)] font-medium"
 : "text-[var(--lc-muted)]"
 }`}
 >
 {step.label}
 </span>
 </div>
 {index < steps.length - 1 && (
 <div className="hidden h-px w-6 bg-[var(--lc-border)] sm:block" />
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
  removedRows: Array<PreviewRow & { leadcleanr_reason: RemovalReason }>;
  invalidRows: Array<PreviewRow & { leadcleanr_reason: "invalid" }>;
  duplicateMode: DuplicateMode;
  fileName: string;
}) {
  const fileUploaded = Boolean(fileName);
  const exportUnlocked = cleanedRows.length > 0;

  return (
    <div className={`rounded-xl border p-5 sm:p-7 transition-all duration-300 ${exportUnlocked ? 'border-[var(--lc-green)]/30 bg-[var(--lc-green-bg)]/20 shadow-sm' : 'panel-soft'}`}>
      {/* Step 3 Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border ${exportUnlocked ? 'bg-[var(--lc-green)] text-white border-[var(--lc-green)]' : 'bg-white text-[var(--lc-muted)] border-[var(--lc-border)]'}`}>
          {exportUnlocked ? <Check className="h-4 w-4" /> : '3'}
        </span>
        <span className={`text-xs font-bold uppercase tracking-wider ${exportUnlocked ? 'text-[var(--lc-green)]' : 'text-[var(--lc-muted)]'}`}>Export</span>
        {exportUnlocked && (
          <span className="ml-auto rounded-full bg-[var(--lc-green-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--lc-green)] border border-[var(--lc-green)]/10">
            Local only
          </span>
        )}
      </div>

      {exportUnlocked ? (
        <>
          {/* Success Count */}
          <div className="rounded-xl bg-white border border-[var(--lc-green)]/10 p-4 mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--lc-green)] mb-1">Clean leads ready</p>
            <p className="font-display text-3xl font-bold text-[var(--lc-green)] tabular-nums">
              {cleanedRows.length.toLocaleString()}
            </p>
            <p className="mt-1 text-[11px] text-[var(--lc-muted)]">Ready for CRM, outreach, or recruiting import.</p>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] p-3.5 space-y-2 mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--lc-muted)]">
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
                      ? "bg-[var(--lc-green-bg)] text-[var(--lc-green)] border-[var(--lc-green)]/20"
                      : "bg-white text-[var(--lc-muted)] border-[var(--lc-border)]"
                  }`}>
                    {isDone ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </span>
                  <span className={isDone ? "text-[var(--lc-muted)] font-medium" : "text-[var(--lc-ink)] font-medium"}>
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
          className={`w-full ${
            exportUnlocked
              ? "lc-button-primary cursor-pointer"
              : "bg-[var(--lc-bg)] text-[var(--lc-muted)] border border-[var(--lc-border)] cursor-not-allowed inline-flex h-11 items-center justify-center gap-1.5 rounded-full text-sm font-semibold"
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
            className="lc-button-secondary w-full"
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
            className="lc-button-secondary w-full"
          >
            <Download className="h-4 w-4" />
            Download Invalid Rows
          </button>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[var(--lc-muted)] text-center">
        {exportUnlocked
          ? "Processed in your browser. CSV never uploaded."
          : "Export unlocks after upload and cleanup."}
      </p>
    </div>
  );
}
