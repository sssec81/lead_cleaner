import type { CrmExportFormat } from "./crm-export.ts";
import { isValidEmailSyntax, parseAndFormatPhone } from "./text-tools.ts";

export type CrmReadinessSeverity = "blocked" | "review";
export type CrmRowStatus = "ready" | "review" | "blocked";

export type CrmReadinessIssue = {
  rowIndex: number;
  severity: CrmReadinessSeverity;
  code: string;
  field: string;
  message: string;
};

export type CrmReadinessRow = {
  rowIndex: number;
  status: CrmRowStatus;
  issues: CrmReadinessIssue[];
};

export type CrmReadinessReport = {
  format: Exclude<CrmExportFormat, "clean_csv">;
  totalRows: number;
  readyRows: number;
  reviewRows: number;
  blockedRows: number;
  readinessScore: number;
  rows: CrmReadinessRow[];
  issues: CrmReadinessIssue[];
};

const EMAIL_FIELDS = ["Email", "Contact Email", "Person Email"];
const PHONE_FIELDS = ["Phone number", "Phone", "Mobile Phone", "Person Phone"];
const WEBSITE_FIELDS = ["Website URL", "Website", "Company Website", "Organization Website"];

export function buildCrmReadinessReport(
  format: Exclude<CrmExportFormat, "clean_csv">,
  rows: Array<Record<string, unknown>>,
): CrmReadinessReport {
  const duplicateEmails = findDuplicateValues(rows, EMAIL_FIELDS);
  const readinessRows = rows.map((row, rowIndex) => {
    const issues: CrmReadinessIssue[] = [];
    const addIssue = (
      severity: CrmReadinessSeverity,
      code: string,
      field: string,
      message: string,
    ) => issues.push({ rowIndex, severity, code, field, message });

    validateRequiredIdentity(format, row, addIssue);

    for (const field of EMAIL_FIELDS) {
      const value = cell(row, field);
      if (!value) continue;
      if (!isValidEmailSyntax(value)) {
        addIssue("blocked", "invalid_email", field, `${field} is not a valid email address.`);
      } else if (duplicateEmails.has(value.toLowerCase())) {
        addIssue("review", "duplicate_email", field, `${field} appears more than once in this export.`);
      }
    }

    for (const field of PHONE_FIELDS) {
      const value = cell(row, field);
      if (value && !parseAndFormatPhone(value)) {
        addIssue("review", "invalid_phone", field, `${field} could not be normalized confidently.`);
      }
    }

    for (const field of WEBSITE_FIELDS) {
      const value = cell(row, field);
      if (value && !isUsableUrl(value)) {
        addIssue("review", "invalid_url", field, `${field} does not look like a usable website URL.`);
      }
    }

    const status: CrmRowStatus = issues.some((issue) => issue.severity === "blocked")
      ? "blocked"
      : issues.length
        ? "review"
        : "ready";

    return { rowIndex, status, issues };
  });
  const issues = readinessRows.flatMap((row) => row.issues);
  const readyRows = readinessRows.filter((row) => row.status === "ready").length;
  const reviewRows = readinessRows.filter((row) => row.status === "review").length;
  const blockedRows = readinessRows.filter((row) => row.status === "blocked").length;
  const readinessScore = rows.length
    ? Math.round(((readyRows + reviewRows * 0.5) / rows.length) * 100)
    : 0;

  return {
    format,
    totalRows: rows.length,
    readyRows,
    reviewRows,
    blockedRows,
    readinessScore,
    rows: readinessRows,
    issues,
  };
}

export function filterCrmRowsByStatus(
  rows: Array<Record<string, unknown>>,
  report: CrmReadinessReport,
  statuses: CrmRowStatus[],
): Array<Record<string, unknown>> {
  const allowed = new Set(statuses);
  return report.rows
    .filter((row) => allowed.has(row.status))
    .map((row) => rows[row.rowIndex])
    .filter((row): row is Record<string, unknown> => Boolean(row));
}

function validateRequiredIdentity(
  format: Exclude<CrmExportFormat, "clean_csv">,
  row: Record<string, unknown>,
  addIssue: (severity: CrmReadinessSeverity, code: string, field: string, message: string) => void,
) {
  if (format === "salesforce") {
    if (!cell(row, "Last Name")) {
      addIssue("blocked", "missing_required", "Last Name", "Salesforce leads require a Last Name on every row.");
    }
    if (!cell(row, "Company")) {
      addIssue("blocked", "missing_required", "Company", "Salesforce leads require a Company on every row.");
    }
    return;
  }

  if (format === "hubspot") {
    if (!hasAnyValue(row, ["First name", "Last name", "Email"])) {
      addIssue("blocked", "missing_identity", "Contact identity", "Add a first name, last name, or email before HubSpot import.");
    }
    return;
  }

  if (format === "apollo") {
    if (!hasAnyValue(row, ["Contact Email", "Contact LinkedIn URL", "Company Name", "Company Website"])) {
      addIssue("blocked", "missing_identity", "Contact identity", "Apollo needs an email, LinkedIn URL, company name, or company website.");
    }
    return;
  }

  if (!cell(row, "Person Name")) {
    addIssue("blocked", "missing_required", "Person Name", "Pipedrive people require a Person Name on every row.");
  }
}

function findDuplicateValues(rows: Array<Record<string, unknown>>, fields: string[]) {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    fields.forEach((field) => {
      const value = cell(row, field).toLowerCase();
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    });
  });
  return new Set(Array.from(counts).filter(([, count]) => count > 1).map(([value]) => value));
}

function cell(row: Record<string, unknown>, field: string): string {
  return String(row[field] ?? "").trim();
}

function hasAnyValue(row: Record<string, unknown>, fields: string[]): boolean {
  return fields.some((field) => Boolean(cell(row, field)));
}

function isUsableUrl(value: string): boolean {
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return Boolean(url.hostname.includes(".") && !url.hostname.includes(" "));
  } catch {
    return false;
  }
}
