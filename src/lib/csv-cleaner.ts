import type { CsvRow } from "./csv.ts";
import { normalizeUrlValue, parseAndFormatPhone } from "./text-tools.ts";

export type DuplicateMode =
  | "selected"
  | "email"
  | "phone"
  | "domain"
  | "entire_row";

export type EmailFilterMode = "all" | "business_only" | "personal_only";

export type CleaningSummary = {
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

export type PreviewRow = CsvRow & {
  leadcleanr_generated_domain?: string;
  leadcleanr_email_type?: string;
  leadcleanr_role_email?: string;
};

export type RemovalReason =
  | "duplicate"
  | "invalid"
  | "blank"
  | "personal_email"
  | "business_email";

export type CleanedResult = {
  rows: PreviewRow[];
  summary: CleaningSummary;
  removedRows: Array<PreviewRow & { leadcleanr_reason: RemovalReason }>;
  invalidRows: Array<PreviewRow & { leadcleanr_reason: "invalid" }>;
  blankRows: Array<PreviewRow & { leadcleanr_reason: "blank" }>;
  duplicateRows: Array<PreviewRow & { leadcleanr_reason: "duplicate" }>;
};

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

export function cleanCsvRows(
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

    if (emailFilter === "business_only" && nextRow.leadcleanr_email_type !== "business") {
      filteredRowsRemoved += 1;
      if (nextRow.leadcleanr_email_type === "personal") {
        removedRows.push({
          ...nextRow,
          leadcleanr_reason: "personal_email",
        });
      } else {
        const removedRow = {
          ...nextRow,
          leadcleanr_reason: "invalid" as const,
        };
        removedRows.push(removedRow);
        invalidRows.push(removedRow);
      }
      return;
    }

    if (emailFilter === "personal_only" && nextRow.leadcleanr_email_type !== "personal") {
      filteredRowsRemoved += 1;
      if (nextRow.leadcleanr_email_type === "business") {
        removedRows.push({
          ...nextRow,
          leadcleanr_reason: "business_email",
        });
      } else {
        const removedRow = {
          ...nextRow,
          leadcleanr_reason: "invalid" as const,
        };
        removedRows.push(removedRow);
        invalidRows.push(removedRow);
      }
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
    return JSON.stringify(headers.map((header) => String(row[header] ?? "").trim()));
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

  return getFirstNormalizedValue(row, headers, ["email"], normalizeEmailValue) || null;
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

export function normalizeDomainValue(value: string) {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }

  const fromUrl = normalizeUrlValue(trimmed);
  if (fromUrl) {
    try {
      const parsed = new URL(fromUrl);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      // Fall through to looser string cleanup.
    }
  }

  const cleaned = trimmed
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#]/)[0]
    ?.replace(/:\d+$/, "") ?? "";

  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(cleaned) ? cleaned : null;
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
