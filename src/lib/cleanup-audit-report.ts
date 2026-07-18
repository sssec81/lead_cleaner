import type { CleaningSummary, DuplicateMode, EmailFilterMode } from "./csv-cleaner.ts";
import type { CrmExportFormat } from "./crm-export.ts";
import type { CrmReadinessReport } from "./crm-readiness.ts";

export type CleanupAuditInput = {
  fileName: string;
  generatedAt?: Date;
  selectedColumn: string;
  duplicateMode: DuplicateMode;
  emailFilter: EmailFilterMode;
  summary: CleaningSummary;
  crmFormat?: CrmExportFormat;
  readiness?: CrmReadinessReport | null;
};

export function buildCleanupAuditReport({
  fileName,
  generatedAt = new Date(),
  selectedColumn,
  duplicateMode,
  emailFilter,
  summary,
  crmFormat = "clean_csv",
  readiness = null,
}: CleanupAuditInput): string {
  const removedRows =
    summary.emptyRowsRemoved +
    summary.invalidRowsRemoved +
    summary.duplicatesRemoved +
    summary.filteredRowsRemoved;
  const readyRate = summary.totalRows
    ? Math.round((summary.cleanRowsReady / summary.totalRows) * 1000) / 10
    : 0;

  const report = [
    "LeadCleanr Cleanup Audit Report",
    "================================",
    `File: ${fileName || "Untitled CSV"}`,
    `Generated: ${generatedAt.toISOString()}`,
    "Processing: Local browser session (source CSV not uploaded)",
    "",
    "Cleanup rules",
    "-------------",
    `Target column: ${selectedColumn || "None"}`,
    `Deduplicate by: ${prettyValue(duplicateMode)}`,
    `Email filter: ${prettyValue(emailFilter)}`,
    "",
    "Before and after",
    "----------------",
    `Rows before cleanup: ${summary.totalRows}`,
    `Rows ready after cleanup: ${summary.cleanRowsReady}`,
    `Rows removed: ${removedRows}`,
    `Ready rate: ${readyRate}%`,
    "",
    "Removal details",
    "---------------",
    `Duplicates removed: ${summary.duplicatesRemoved}`,
    `Invalid rows removed: ${summary.invalidRowsRemoved}`,
    `Blank rows removed: ${summary.emptyRowsRemoved}`,
    `Rows removed by email filter: ${summary.filteredRowsRemoved}`,
    "",
    "Email insights",
    "--------------",
    `Business emails: ${summary.businessEmails}`,
    `Personal emails: ${summary.personalEmails}`,
    `Role-based emails: ${summary.roleBasedEmails}`,
    `Company domains generated: ${summary.generatedDomains}`,
  ];

  if (crmFormat !== "clean_csv" && readiness) {
    report.push(
      "",
      "CRM import preflight",
      "--------------------",
      `Destination: ${prettyValue(crmFormat)}`,
      `Readiness score: ${readiness.readinessScore}/100`,
      `Rows ready: ${readiness.readyRows}`,
      `Rows needing review: ${readiness.reviewRows}`,
      `Rows blocked: ${readiness.blockedRows}`,
      `Preflight issues: ${readiness.issues.length}`,
    );
  }

  report.push("", "Review the cleaned CSV before importing it into another system.");
  return report.join("\n");
}

export function buildCleanupAuditFileName(fileName: string): string {
  const base = (fileName || "leadcleanr").replace(/\.csv$/i, "");
  return `${base}-cleanup-audit.txt`;
}

function prettyValue(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
