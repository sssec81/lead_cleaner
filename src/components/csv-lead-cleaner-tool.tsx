"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  type CleanedResult,
  type CleaningSummary,
  type DuplicateMode,
  type EmailFilterMode,
} from "@/lib/csv-cleaner";
import { trackToolEvent } from "@/lib/telemetry";
import { LocalWorkspaceHistory } from "@/components/local-workspace-history";
import { CsvCleanerQuickGuide } from "@/components/csv-cleaner-quick-guide";
import {
  CsvCleanerUploadPanel,
  CsvCleanerWorkspaceView,
  type PendingCsvFile,
  type PreviewMode,
} from "@/components/csv-lead-cleaner-view";
import type { LocalWorkspaceSnapshot } from "@/lib/local-workspace-history";
import {
  CRM_EXPORT_FORMAT_OPTIONS,
  type CrmExportFormat,
  type CrmFieldOverrides,
} from "@/lib/crm-export";
import type { CleanupPresetRules } from "@/lib/cleanup-presets";
import { writeLocalStorage } from "@/lib/browser-storage";
import { useCsvCleanerWorker } from "@/hooks/use-csv-cleaner-worker";

type UploadStatus = "idle" | "parsing" | "ready" | "error";

const PREVIEW_LIMIT = 100;
const MAX_CSV_CONFIG_HISTORY = 30;
const DEMO_CSV = `name,email,company,website,phone
Jane Doe,jane@acme.com,Acme,https://acme.com,+1 (415) 555-0101
Support Team,support@acme.com,Acme,https://acme.com,415-555-0101
Broken,not-an-email,Example Co,exampleco.com,
John Smith,john@northstar.io,Northstar,https://northstar.io,+44 20 7946 0958
Duplicate,jane@acme.com,Acme,https://acme.com,+1 (415) 555-0101`;

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
 const [pendingFile, setPendingFile] = useState<PendingCsvFile | null>(null);
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

  const {
    result: cleaned,
    isProcessing: isCleaning,
  }: { result: CleanedResult; isProcessing: boolean } = useCsvCleanerWorker(
    rows,
    headers,
    selectedColumn,
    duplicateMode,
    emailFilter,
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

    writeLocalStorage(
      "leadcleanr:csv-cleaner:preferred-column",
      selectedColumn,
    );
  }, [selectedColumn]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    writeLocalStorage(
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
 const hasLoadedFile = headers.length > 0 && status === "ready";

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
        <CsvCleanerUploadPanel
          crmFormat={crmFormat}
          isParsing={isParsing}
          progress={progress}
          error={error}
          pendingFile={pendingFile}
          onCrmFormatChange={setCrmFormat}
          onFileUpload={handleFileUpload}
          onLoadDemo={loadDemoCsv}
        />
      ) : (
        <CsvCleanerWorkspaceView
          fileName={fileName}
          headers={headers}
          detections={detections}
          selectedColumn={selectedColumn}
          duplicateMode={duplicateMode}
          emailFilter={emailFilter}
          showEmailEnrichment={Boolean(showEmailEnrichment)}
          toastVisible={toastVisible}
          canUndo={pastConfigs.length > 0}
          canRedo={futureConfigs.length > 0}
          summary={summary}
          isCleaning={isCleaning}
          workspaceWarning={workspaceWarning}
          previewMode={previewMode}
          availablePreviewModes={availablePreviewModes}
          previewLabel={previewLabel}
          previewDescription={previewDescription}
          reportHeaders={reportHeaders}
          visiblePreviewRows={visiblePreviewRows}
          cleanRows={isCleaning ? [] : cleaned.rows}
          previewHeaders={previewHeaders}
          crmFormat={crmFormat}
          activeCrmOverrides={activeCrmOverrides}
          onReplace={() => resetState()}
          onApplyConfigChange={applyConfigChange}
          onUndo={undoConfigChange}
          onRedo={redoConfigChange}
          onPreviewModeChange={setPreviewMode}
          onApplySavedWorkflow={applySavedWorkflow}
          onCrmFormatChange={setCrmFormat}
          onCrmOverridesChange={(overrides) => {
            if (crmFormat === "clean_csv") return;
            setCrmOverridesByFormat((current) => ({
              ...current,
              [crmFormat]: overrides,
            }));
          }}
        />

      )}
    </div>
  );
}

function parseCrmFormat(value: string | null): CrmExportFormat {
 return CRM_EXPORT_FORMAT_OPTIONS.some((option) => option.value === value)
 ? value as CrmExportFormat
 : "hubspot";
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

function buildWarningSummary(warnings: string[]) {
 const preview = warnings.slice(0, 2).join(" ");
 const suffix =
 warnings.length > 2 ? ` ${warnings.length - 2} more parsing issues found.` : "";
 return `We imported the readable rows, but found CSV formatting issues. ${preview}${suffix}`;
}
