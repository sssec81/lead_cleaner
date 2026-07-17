import type { CleaningSummary, DuplicateMode, EmailFilterMode } from "./csv-cleaner.ts";

export type CleanupAuditInput = {
  fileName: string;
  generatedAt?: Date;
  selectedColumn: string;
  duplicateMode: DuplicateMode;
  emailFilter: EmailFilterMode;
  summary: CleaningSummary;
};

export function buildCleanupAuditReport({
  fileName,
  generatedAt = new Date(),
  selectedColumn,
  duplicateMode,
  emailFilter,
  summary,
}: CleanupAuditInput): string {
  const removedRows =
    summary.emptyRowsRemoved +
    summary.invalidRowsRemoved +
    summary.duplicatesRemoved +
    summary.filteredRowsRemoved;
  const readyRate = summary.totalRows
    ? Math.round((summary.cleanRowsReady / summary.totalRows) * 1000) / 10
    : 0;

  return [
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
    "",
    "Review the cleaned CSV before importing it into another system.",
  ].join("\n");
}

export function buildCleanupAuditFileName(fileName: string): string {
  const base = (fileName || "leadcleanr").replace(/\.csv$/i, "");
  return `${base}-cleanup-audit.txt`;
}

function prettyValue(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
