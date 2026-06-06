"use client";

import {
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  CopyMinus,
  Download,
  FileMinus,
  FileSpreadsheet,
  FlaskConical,
  LoaderCircle,
  Mail,
  Redo2,
  ScanSearch,
  ShieldAlert,
  Sparkles,
  Undo2,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
import { ProWaitlistCard } from "@/components/pro-waitlist-card";

type UploadStatus = "idle" | "parsing" | "ready" | "error";

type DuplicateMode = "selected" | "email" | "phone" | "domain" | "entire_row";

type CleaningSummary = {
  totalRows: number;
  emptyRowsRemoved: number;
  invalidRowsRemoved: number;
  duplicatesRemoved: number;
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

type RemovalReason = "duplicate" | "invalid" | "blank";

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

export function CsvLeadCleanerTool() {
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [detections, setDetections] = useState<CsvColumnDetection[]>([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [duplicateMode, setDuplicateMode] = useState<DuplicateMode>("selected");
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
    Array<{ selectedColumn: string; duplicateMode: DuplicateMode }>
  >([]);
  const [futureConfigs, setFutureConfigs] = useState<
    Array<{ selectedColumn: string; duplicateMode: DuplicateMode }>
  >([]);
  const [previewMode, setPreviewMode] = useState<"clean" | "removed" | "invalid">(
    "clean",
  );

  const cleaned = useMemo(
    () => cleanCsvRows(rows, headers, selectedColumn, duplicateMode),
    [duplicateMode, headers, rows, selectedColumn],
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

  function resetState(nextFileName = "") {
    setFileName(nextFileName);
    setHeaders([]);
    setRows([]);
    setDetections([]);
    setSelectedColumn("");
    setDuplicateMode("selected");
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

    const inspection = await inspectCsvFile(file);

    setPendingFile({
      name: file.name,
      sizeMb: file.size / (1024 * 1024),
      exceedsFreeLimit: file.size > MAX_CSV_FILE_SIZE,
      estimatedRows: inspection.estimatedRows,
      estimatedRowsWithinFreeLimit: inspection.estimatedRowsWithinFreeLimit,
    });

    trackToolEvent("csv-lead-cleaner", "upload_started", {
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
        "The free CSV limit is 2 MB. Upgrade to Pro when you need larger file cleanup.",
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
          row_count: result.rows.length,
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
  }) {
    if (
      nextConfig.selectedColumn === selectedColumn &&
      nextConfig.duplicateMode === duplicateMode
    ) {
      return;
    }

    setPastConfigs((current) => [
      ...current,
      { selectedColumn, duplicateMode },
    ]);
    setFutureConfigs([]);
    setSelectedColumn(nextConfig.selectedColumn);
    setDuplicateMode(nextConfig.duplicateMode);
  }

  function undoConfigChange() {
    setPastConfigs((current) => {
      const previous = current.at(-1);
      if (!previous) {
        return current;
      }

      setFutureConfigs((future) => [
        { selectedColumn, duplicateMode },
        ...future,
      ]);
      setSelectedColumn(previous.selectedColumn);
      setDuplicateMode(previous.duplicateMode);

      return current.slice(0, -1);
    });
  }

  function redoConfigChange() {
    setFutureConfigs((current) => {
      const next = current[0];
      if (!next) {
        return current;
      }

      setPastConfigs((past) => [...past, { selectedColumn, duplicateMode }]);
      setSelectedColumn(next.selectedColumn);
      setDuplicateMode(next.duplicateMode);

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
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="w-full space-y-4 xl:hidden">
        <WorkflowSteps hasLoadedFile={hasLoadedFile} exportReady={exportReady} />
      </div>

      <div className="w-full xl:w-[360px] shrink-0 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-6 flex flex-col">
          <div className="mb-6 hidden xl:block">
            <WorkflowSteps hasLoadedFile={hasLoadedFile} exportReady={exportReady} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:rgba(37,99,235,0.08)] text-[color:#2563eb]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-strong)]">
                CSV Lead Cleaner
              </p>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                Upload, review, export
              </p>
            </div>
          </div>

          <label
            htmlFor="csv-upload"
            className="group mt-6 flex min-h-[16rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-8 text-center transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/50"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:rgba(37,99,235,0.04)] border border-[color:rgba(37,99,235,0.1)] text-[color:#2563eb] shadow-[0_8px_24px_rgba(37,99,235,0.02)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] group-hover:bg-white">
                {isParsing ? (
                  <LoaderCircle className="h-6 w-6 animate-spin text-[color:var(--brand-strong)]" />
                ) : (
                  <Upload className="h-6 w-6 text-[color:var(--brand-strong)]" />
                )}
              </div>
              <span className="mt-4 text-base font-semibold text-slate-800">
                {isParsing ? "Parsing your CSV..." : "Upload a messy CSV and start cleanup"}
              </span>
              <span className="mt-2 max-w-sm text-xs leading-relaxed text-[color:var(--muted)]">
                Drag and drop or click to browse.
              </span>
              {!isParsing && (
                <div className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 cursor-pointer">
                  Upload CSV to Start
                </div>
              )}
            </div>
            <input
              id="csv-upload"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={handleFileUpload}
              disabled={isParsing}
            />
          </label>

          <p className="mt-3 text-xs leading-relaxed text-slate-500 text-center">
            Processed locally in your browser. Your CSV is never uploaded.<br />
            <span className="text-[11px] text-slate-400 font-medium">(Supports files up to 2 MB)</span>
          </p>

          <div className="mt-4 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:rgba(248,250,252,0.82)] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:#38586b]">
              Quick start
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadDemoCsv}
                className="inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 hover:shadow-2xs active:bg-slate-100 sm:w-auto"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                Try sample CSV
              </button>
              {hasLoadedFile ? (
                <>
                  <button
                    type="button"
                    onClick={undoConfigChange}
                    disabled={!pastConfigs.length}
                    className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 hover:shadow-2xs active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                    Undo
                  </button>
                  <button
                    type="button"
                    onClick={redoConfigChange}
                    disabled={!futureConfigs.length}
                    className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 hover:shadow-2xs active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Redo2 className="h-3.5 w-3.5" />
                    Redo
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {pendingFile ? <FileSizeNotice pendingFile={pendingFile} /> : null}

          {isParsing ? (
            <div className="mt-4 rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-[color:var(--foreground)]">
                  Reading rows
                </span>
                <span className="tabular-nums text-[color:var(--muted)]">
                  {progress.percentage}%
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:rgba(17,36,51,0.08)]">
                <div
                  className="h-full rounded-full bg-[color:var(--brand)] transition-[width]"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {progress.rowsProcessed.toLocaleString()} rows processed so far.
              </p>
            </div>
          ) : null}

          {hasLoadedFile ? (
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-[color:rgba(15,118,110,0.12)] bg-[color:rgba(240,253,250,0.74)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  Before export checklist
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <ChecklistMetric label="Duplicates reviewed" value={cleaned.summary.duplicatesRemoved} />
                  <ChecklistMetric label="Invalid rows reviewed" value={cleaned.summary.invalidRowsRemoved} />
                  <ChecklistMetric label="Blank rows reviewed" value={cleaned.summary.emptyRowsRemoved} />
                  <ChecklistMetric label="Clean rows ready" value={cleaned.summary.cleanRowsReady} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cleaned.removedRows.length ? (
                    <button
                      type="button"
                      onClick={() => setPreviewMode("removed")}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-white px-4 text-xs font-semibold text-[color:var(--foreground)] hover:border-slate-300 hover:bg-slate-50"
                    >
                      View removed rows
                    </button>
                  ) : null}
                  {cleaned.invalidRows.length ? (
                    <button
                      type="button"
                      onClick={() => setPreviewMode("invalid")}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-white px-4 text-xs font-semibold text-[color:var(--foreground)] hover:border-slate-300 hover:bg-slate-50"
                    >
                      View invalid rows
                    </button>
                  ) : null}
                  {rows.length ? (
                    <button
                      type="button"
                      onClick={resetCleanupConfig}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-white px-4 text-xs font-semibold text-[color:var(--foreground)] hover:border-slate-300 hover:bg-slate-50"
                    >
                      Reset cleanup
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
                  Active File
                </p>
                <p className="mt-1 text-sm font-semibold truncate text-slate-800">
                  {fileName || "No CSV uploaded yet"}
                </p>
                {rows.length ? (
                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    {rows.length.toLocaleString()} raw rows loaded
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
                <label
                  htmlFor="column-select"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]"
                >
                  Main cleanup column
                </label>
                <select
                  id="column-select"
                  value={selectedColumn}
                  onChange={(event) => {
                    applyConfigChange({
                      selectedColumn: event.target.value,
                      duplicateMode,
                    });
                    trackToolEvent("csv-lead-cleaner", "change_column", {
                      column: event.target.value,
                    });
                  }}
                  disabled={!headers.length || isParsing}
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white px-3 text-sm text-slate-800 outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-blue-500/10 transition"
                >
                  {headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
                {selectedDetection ? (
                  <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-teal-50/50 border border-teal-100/50 px-3 py-1.5 text-xs text-teal-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ScanSearch className="h-3.5 w-3.5 text-teal-600" />
                      Type: {prettyColumnType(selectedDetection.type)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600/80">
                      {selectedDetection.confidence}% match
                    </span>
                  </div>
                ) : null}
                {recommendedDetection &&
                recommendedDetection.header !== selectedColumn ? (
                  <button
                    type="button"
                    onClick={() =>
                      applyConfigChange({
                        selectedColumn: recommendedDetection.header,
                        duplicateMode,
                      })
                    }
                    className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                    Use suggested column: {recommendedDetection.header} ({recommendedDetection.confidence}%)
                  </button>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
                <label
                  htmlFor="duplicate-mode"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]"
                >
                  Deduplicate by
                </label>
                <select
                  id="duplicate-mode"
                  value={duplicateMode}
                  onChange={(event) => {
                    const nextMode = event.target.value as DuplicateMode;
                    applyConfigChange({
                      selectedColumn,
                      duplicateMode: nextMode,
                    });
                    trackToolEvent("csv-lead-cleaner", "change_duplicate_mode", {
                      mode: nextMode,
                    });
                  }}
                  disabled={!headers.length || isParsing}
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white px-3 text-sm text-slate-800 outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-blue-500/10 transition"
                >
                  {DUPLICATE_MODE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
                  {
                    DUPLICATE_MODE_OPTIONS.find(
                      (option) => option.value === duplicateMode,
                    )?.description
                  }
                </p>
              </div>
            </div>
          ) : null}

          {error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
          {warning ? <InlineMessage tone="warning">{warning}</InlineMessage> : null}

          <div className="mt-auto hidden pt-5 xl:block space-y-5">
            <ExportActions
              cleanedRows={cleaned.rows}
              duplicateMode={duplicateMode}
              fileName={fileName}
            />
            <ProWaitlistCard
              trackSource="csv_cleaner_sidebar"
              title="Want Pro workflows?"
              description="Join the Pro waitlist to get notified when we launch saved cleanup presets, CSV presets for CRM (HubSpot, Salesforce), and outreach tools."
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-6">
          <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                    Cleaning report
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">
                    Review what changed before export
                  </h3>
                </div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${hasLoadedFile ? "bg-blue-50/50 border-blue-200 text-blue-700" : "bg-white border-slate-200 text-slate-400"}`}>
                  <ScanSearch className="h-4 w-4" />
                  {hasLoadedFile ? "Step 2 active" : "Waiting for upload"}
                </div>
              </div>

              <div className="mt-5 rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(37,99,235,0.04),rgba(255,255,255,0.94))] p-6 border border-slate-200/60 shadow-[0_12px_24px_rgba(15,23,42,0.03)] relative overflow-hidden">
                <div className="absolute right-0 top-0 h-40 w-40 bg-[color:rgba(37,99,235,0.04)] rounded-full blur-2xl -mr-10 -mt-10" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 relative z-10">
                  Clean rows ready
                </p>
                <p className={`mt-3 font-display text-6xl font-bold leading-none tabular-nums sm:text-7xl relative z-10 ${!hasLoadedFile && cleaned.summary.cleanRowsReady === 0 ? "text-slate-900/40" : "text-slate-900"}`}>
                  {!hasLoadedFile && cleaned.summary.cleanRowsReady === 0 ? "—" : cleaned.summary.cleanRowsReady.toLocaleString()}
                </p>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base relative z-10">
                  {hasLoadedFile
                    ? "This is the cleaned row count that will move forward into CRM, outreach, sales, or recruiting tools."
                    : "Upload a CSV to see duplicates, invalid rows, blank rows, business emails, personal emails, and role-based inboxes before export."}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <StatCard label="Rows scanned" value={cleaned.summary.totalRows} icon={<FileSpreadsheet className="h-4 w-4 text-blue-500" />} />
                <StatCard
                  label="Duplicates removed"
                  value={cleaned.summary.duplicatesRemoved}
                  icon={<CopyMinus className="h-4 w-4 text-amber-500" />}
                />
                <StatCard
                  label="Invalid removed"
                  value={cleaned.summary.invalidRowsRemoved}
                  icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
                />
                <StatCard
                  label="Blank rows removed"
                  value={cleaned.summary.emptyRowsRemoved}
                  icon={<FileMinus className="h-4 w-4 text-slate-400" />}
                />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <InsightTile
                  label="Business emails"
                  value={cleaned.summary.businessEmails}
                  tone="teal"
                  icon={<Building2 className="h-4 w-4 text-teal-600" />}
                />
                <InsightTile
                  label="Personal emails"
                  value={cleaned.summary.personalEmails}
                  tone="amber"
                  icon={<Mail className="h-4 w-4 text-amber-600" />}
                />
                <InsightTile
                  label="Role-based inboxes"
                  value={cleaned.summary.roleBasedEmails}
                  tone="slate"
                  icon={<ShieldAlert className="h-4 w-4 text-slate-500" />}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold">
                    {previewLabel}
                  </h3>
                  <p className="text-sm leading-6 text-[color:var(--muted)]">
                    {previewDescription}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("clean")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                      previewMode === "clean"
                        ? "bg-[color:rgba(15,118,110,0.12)] text-[color:var(--accent)]"
                        : "border border-[color:var(--line)] bg-white text-[color:var(--muted)]"
                    }`}
                  >
                    Clean
                  </button>
                  {cleaned.removedRows.length ? (
                    <button
                      type="button"
                      onClick={() => setPreviewMode("removed")}
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        previewMode === "removed"
                          ? "bg-[color:rgba(37,99,235,0.12)] text-[color:var(--brand-strong)]"
                          : "border border-[color:var(--line)] bg-white text-[color:var(--muted)]"
                      }`}
                    >
                      Removed
                    </button>
                  ) : null}
                  {cleaned.invalidRows.length ? (
                    <button
                      type="button"
                      onClick={() => setPreviewMode("invalid")}
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        previewMode === "invalid"
                          ? "bg-[color:rgba(245,158,11,0.14)] text-amber-700"
                          : "border border-[color:var(--line)] bg-white text-[color:var(--muted)]"
                      }`}
                    >
                      Invalid
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-xs">
                {reportHeaders.length && visiblePreviewRows.length ? (
                  <div className="max-h-[38rem] overflow-auto">
                    <table className="min-w-[980px] w-full border-collapse text-left text-sm">
                      <thead className="sticky top-0 bg-slate-50">
                        <tr>
                          <th className="border-b border-slate-200 px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            #
                          </th>
                          {reportHeaders.map((header) => (
                            <th
                              key={header}
                              className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-800 whitespace-nowrap"
                            >
                              {prettyHeader(header)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visiblePreviewRows.map((row, index) => (
                          <tr
                            key={`${index}-${duplicateMode}-${selectedColumn}-${row[selectedColumn] ?? ""}-${previewMode}`}
                            className="hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="border-b border-slate-100 px-3 py-3 align-top text-xs font-semibold text-slate-400">
                              {index + 1}
                            </td>
                            {reportHeaders.map((header) => {
                              const cellValue = row[header];
                              let displayElement = <>{cellValue || "—"}</>;

                              if (header === "leadcleanr_email_type" && cellValue) {
                                const isBusiness = cellValue === "business";
                                displayElement = (
                                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border ${
                                    isBusiness
                                      ? "bg-teal-50/80 text-teal-700 border-teal-200/50"
                                      : "bg-amber-50/80 text-amber-700 border-amber-200/50"
                                  }`}>
                                    {cellValue}
                                  </span>
                                );
                              } else if (header === "leadcleanr_role_email" && cellValue) {
                                const isRole = cellValue === "role-based";
                                displayElement = (
                                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border ${
                                    isRole
                                      ? "bg-purple-50/80 text-purple-700 border-purple-200/50"
                                      : "bg-slate-50/80 text-slate-600 border-slate-200/50"
                                  }`}>
                                    {cellValue}
                                  </span>
                                );
                              } else if (header === "leadcleanr_generated_domain" && cellValue) {
                                displayElement = (
                                  <code className="font-mono text-xs text-indigo-700 bg-indigo-50/50 border border-indigo-100/30 px-1.5 py-0.5 rounded">
                                    {cellValue}
                                  </code>
                                );
                              }

                              return (
                                <td
                                  key={`${index}-${header}`}
                                  className="border-b border-slate-100 px-4 py-3 align-top text-slate-600"
                                >
                                  <div className="max-w-[16rem] whitespace-normal break-words">
                                    {displayElement}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  status === "ready" && headers.length ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[16rem]">
                      <AlertCircle className="h-8 w-8 text-amber-500 mb-3" />
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">No clean rows found</h4>
                      <p className="max-w-md text-xs leading-relaxed text-slate-500">
                        This file uploaded successfully, but none of the rows survived the current cleanup and deduplication rules. Try resetting cleanup or choosing a different column.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[22rem]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs mb-4">
                        <ScanSearch className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Ready to Preview</h4>
                      <p className="max-w-md text-xs leading-relaxed text-slate-500 mb-6">
                        Upload a CSV to see duplicates, invalid rows, blank rows, business emails, personal emails, and role-based inboxes before export.
                      </p>
                      <div className="grid gap-3 w-full sm:grid-cols-3">
                        {[
                          {
                            title: "Duplicate rows removed",
                            desc: "Instantly deduplicates lead records based on chosen parameters.",
                          },
                          {
                            title: "Invalid & blank skipped",
                            desc: "Flags incomplete contact records and invalid emails early.",
                          },
                          {
                            title: "Email signals surfaced",
                            desc: "Surfaces business, personal, and role-based email categories.",
                          },
                        ].map((benefit, i) => (
                          <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600 border border-blue-100/50">
                                  {i + 1}
                                </div>
                                <p className="text-xs font-semibold text-slate-800 leading-tight">{benefit.title}</p>
                              </div>
                              <p className="mt-1.5 text-[10px] leading-relaxed text-slate-400">{benefit.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="xl:hidden space-y-5">
              <ExportActions
                cleanedRows={cleaned.rows}
                duplicateMode={duplicateMode}
                fileName={fileName}
              />
              <ProWaitlistCard
                trackSource="csv_cleaner_mobile_bottom"
                title="Want saved workflows and export presets?"
                description="Join the Pro waitlist to get notified when we launch saved cleanup presets, CSV presets for CRM (HubSpot, Salesforce), and outreach tools."
              />
            </div>
        </div>
      </div>
  );
}

function cleanCsvRows(
  rows: CsvRow[],
  headers: string[],
  selectedColumn: string,
  duplicateMode: DuplicateMode,
): CleanedResult {
  const emptySummary: CleaningSummary = {
    totalRows: rows.length,
    emptyRowsRemoved: 0,
    invalidRowsRemoved: 0,
    duplicatesRemoved: 0,
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
    const selectedValue = normalizedRow[selectedColumn];

    if (!selectedValue) {
      invalidRowsRemoved += 1;
      const nextRow = {
        ...normalizedRow,
        leadcleanr_reason: "invalid" as const,
      };
      removedRows.push(nextRow);
      invalidRows.push(nextRow);
      return;
    }

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

    cleanedRows.push(nextRow);
  });

    return {
      rows: cleanedRows,
      summary: {
      totalRows: rows.length,
      emptyRowsRemoved,
      invalidRowsRemoved,
      duplicatesRemoved,
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
    return row[selectedColumn]?.trim() || "";
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
      <div className={`mt-3 rounded-[1.3rem] border p-4 ${toneClasses}`}>
        <p className="text-sm font-semibold text-[color:var(--foreground)]">
          {pendingFile.name} · {pendingFile.sizeMb.toFixed(1)} MB
        </p>
        <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
          {pendingFile.exceedsFreeLimit
            ? `This file is over the 2 MB free limit. It looks like about ${formatRowEstimate(pendingFile.estimatedRows)} rows. Free typically fits around ${formatRowEstimate(pendingFile.estimatedRowsWithinFreeLimit)} rows of this density.`
            : `This file fits inside the free 2 MB limit and looks like about ${formatRowEstimate(pendingFile.estimatedRows)} rows for browser-side cleanup.`}
        </p>
      </div>
      {pendingFile.exceedsFreeLimit && (
        <ProWaitlistCard
          trackSource="csv_cleaner_limit"
          title="Need larger CSV files?"
          description="Join the Pro waitlist to get notified when we support uploads up to 100MB / 100,000+ rows, saved cleanup workflows, and export presets."
        />
      )}
    </div>
  );
}

function formatRowEstimate(value: number | null) {
  if (!value) {
    return "a few thousand";
  }

  return value.toLocaleString();
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
              className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-4 text-sm leading-6 text-[color:var(--foreground)]"
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
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
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
                        : "bg-white text-slate-400 border-slate-200"
                  }`}
                >
                  {isCompleted ? "✓" : step.num}
                </div>
                <span
                  className={`text-xs font-medium transition ${
                    isActive
                      ? "text-slate-900 font-semibold"
                      : isCompleted
                        ? "text-slate-500 font-medium"
                        : "text-slate-400"
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
  duplicateMode,
  fileName,
}: {
  cleanedRows: PreviewRow[];
  duplicateMode: DuplicateMode;
  fileName: string;
}) {
  const fileUploaded = Boolean(fileName);
  const exportUnlocked = cleanedRows.length > 0;

  return (
    <div className="panel-soft rounded-[2.2rem] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
            Export clean file
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {exportUnlocked ? "Clean rows are ready for export." : "Export unlocks after upload and cleanup."}
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100/50">
          Local only
        </span>
      </div>

      {!exportUnlocked && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Export Checklist
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
                      : "bg-white text-slate-400 border-slate-200"
                  }`}>
                    {isDone ? "✓" : "○"}
                  </span>
                  <span className={isDone ? "text-slate-400 font-medium" : "text-slate-600 font-medium"}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          trackToolEvent("csv-lead-cleaner", "export_csv", {
            row_count: cleanedRows.length,
            duplicate_mode: duplicateMode,
          });
          downloadCsvRecords(buildCleanFileName(fileName), cleanedRows);
        }}
        disabled={!exportUnlocked}
        className={`mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
          exportUnlocked
            ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm"
            : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
        }`}
      >
        <Download className="h-4 w-4" />
        Export Clean CSV
      </button>
      <p className="mt-3 text-xs leading-relaxed text-slate-400 text-center">
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
    <div className="rounded-[1rem] border border-[color:rgba(15,118,110,0.1)] bg-white/82 px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
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
      className={`rounded-2xl border p-4 transition-all duration-300 hover:shadow-xs ${
        accent
          ? "border-emerald-100 bg-emerald-50/40"
          : "border-slate-200/60 bg-white/70 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </span>
        {icon && <div className="text-slate-400">{icon}</div>}
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
    slate: "border-slate-200 bg-slate-50/40 text-slate-700 hover:border-slate-300",
  }[actualTone];

  return (
    <div className={`rounded-2xl border px-4 py-4 transition-all duration-300 hover:shadow-xs ${palette}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
        {icon && <div className="opacity-80">{icon}</div>}
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
