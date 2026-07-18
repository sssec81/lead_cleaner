export type ImportRepairMatch = {
  errorRowIndex: number;
  sourceRowIndex: number | null;
  error: string;
  hint: string;
  matchedBy: "identity" | "row_number" | "unmatched";
  row: Record<string, unknown> | null;
};

export type ImportRepairReport = {
  totalErrors: number;
  matchedErrors: number;
  unmatchedErrors: number;
  matches: ImportRepairMatch[];
  retryRows: Array<Record<string, unknown>>;
};

const ERROR_HEADER_ALIASES = [
  "error",
  "errors",
  "error message",
  "error_message",
  "message",
  "reason",
  "failure reason",
  "status message",
];
const ROW_NUMBER_ALIASES = ["row", "row number", "row_number", "rownum", "line", "line number"];
const IDENTITY_ALIASES = [
  "email",
  "contact email",
  "person email",
  "email address",
  "record id",
  "salesforce id",
  "hubspot id",
  "contact id",
  "id",
];

export function buildImportRepairReport(
  sourceRows: Array<Record<string, unknown>>,
  errorHeaders: string[],
  errorRows: Array<Record<string, unknown>>,
): ImportRepairReport {
  const normalizedErrorHeaders = new Map(
    errorHeaders.map((header) => [normalizeHeader(header), header]),
  );
  const errorHeader = findHeader(normalizedErrorHeaders, ERROR_HEADER_ALIASES);
  const rowNumberHeader = findHeader(normalizedErrorHeaders, ROW_NUMBER_ALIASES);
  const identityHeaders = IDENTITY_ALIASES
    .map((alias) => normalizedErrorHeaders.get(normalizeHeader(alias)))
    .filter((header): header is string => Boolean(header));
  const sourceIdentityIndex = buildSourceIdentityIndex(sourceRows);

  const matches = errorRows.map((errorRow, errorRowIndex): ImportRepairMatch => {
    const error = errorHeader
      ? String(errorRow[errorHeader] ?? "").trim()
      : findLikelyErrorText(errorRow);
    const hint = buildRepairHint(error);

    for (const header of identityHeaders) {
      const identity = normalizeIdentity(errorRow[header]);
      const sourceRowIndex = sourceIdentityIndex.get(identity);
      if (identity && sourceRowIndex !== undefined) {
        return createMatch(errorRowIndex, sourceRowIndex, error, hint, "identity", sourceRows);
      }
    }

    if (rowNumberHeader) {
      const rowNumber = Number.parseInt(String(errorRow[rowNumberHeader] ?? ""), 10);
      if (Number.isFinite(rowNumber)) {
        // CRM error files typically count the header as line 1. Fall back to a
        // one-based data-row index when they do not.
        const candidates = [rowNumber - 2, rowNumber - 1];
        const sourceRowIndex = candidates.find((index) => index >= 0 && index < sourceRows.length);
        if (sourceRowIndex !== undefined) {
          return createMatch(errorRowIndex, sourceRowIndex, error, hint, "row_number", sourceRows);
        }
      }
    }

    return {
      errorRowIndex,
      sourceRowIndex: null,
      error: error || "Import error",
      hint,
      matchedBy: "unmatched",
      row: null,
    };
  });

  const retryRows = matches.flatMap((match) => {
    if (!match.row) return [];
    return [{
      ...match.row,
      leadcleanr_import_error: match.error,
      leadcleanr_repair_hint: match.hint,
      leadcleanr_error_row: match.errorRowIndex + 1,
    }];
  });
  const matchedErrors = matches.filter((match) => match.row).length;

  return {
    totalErrors: errorRows.length,
    matchedErrors,
    unmatchedErrors: errorRows.length - matchedErrors,
    matches,
    retryRows,
  };
}

export function buildRepairHint(error: string): string {
  const normalized = error.toLowerCase();
  if (/duplicate|already exists|matching record/.test(normalized)) {
    return "Review the existing CRM record and update or merge instead of creating a new record.";
  }
  if (/required|missing|cannot be blank|must specify/.test(normalized)) {
    return "Fill the required field, then retry this row.";
  }
  if (/picklist|allowed value|invalid (?:property )?option|enumeration/.test(normalized)) {
    return "Replace the value with one of the property options configured in the CRM.";
  }
  if (/email/.test(normalized) && /invalid|format|malformed/.test(normalized)) {
    return "Correct or remove the malformed email address before retrying.";
  }
  if (/owner/.test(normalized)) {
    return "Use a valid CRM owner ID or remove the owner field before retrying.";
  }
  if (/date|datetime|timestamp/.test(normalized)) {
    return "Convert the value to the date format expected by the CRM.";
  }
  return "Review the reported value, correct the source row, and retry only the failed record.";
}

function createMatch(
  errorRowIndex: number,
  sourceRowIndex: number,
  error: string,
  hint: string,
  matchedBy: "identity" | "row_number",
  sourceRows: Array<Record<string, unknown>>,
): ImportRepairMatch {
  return {
    errorRowIndex,
    sourceRowIndex,
    error: error || "Import error",
    hint,
    matchedBy,
    row: sourceRows[sourceRowIndex] ?? null,
  };
}

function buildSourceIdentityIndex(rows: Array<Record<string, unknown>>) {
  const index = new Map<string, number>();
  rows.forEach((row, rowIndex) => {
    Object.entries(row).forEach(([header, value]) => {
      if (!IDENTITY_ALIASES.some((alias) => normalizeHeader(alias) === normalizeHeader(header))) return;
      const identity = normalizeIdentity(value);
      if (identity && !index.has(identity)) index.set(identity, rowIndex);
    });
  });
  return index;
}

function findLikelyErrorText(row: Record<string, unknown>): string {
  const entry = Object.entries(row).find(([header, value]) =>
    /error|message|reason|status/i.test(header) && String(value ?? "").trim(),
  );
  return String(entry?.[1] ?? "Import error").trim();
}

function findHeader(headers: Map<string, string>, aliases: string[]) {
  return aliases.map((alias) => headers.get(normalizeHeader(alias))).find(Boolean);
}

function normalizeHeader(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "");
}

function normalizeIdentity(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}
