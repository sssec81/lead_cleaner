import Papa, { type ParseError } from "papaparse";

export type CsvRow = Record<string, string>;

export type CsvParseProgress = {
  percentage: number;
  rowsProcessed: number;
};

export type CsvParseResult = {
  headers: string[];
  rows: CsvRow[];
  warnings: string[];
};

export type CsvFileInspection = {
  estimatedRows: number | null;
  estimatedRowsWithinFreeLimit: number | null;
};

export type CsvColumnType = "email" | "phone" | "url" | "domain" | "unknown";

export type CsvColumnDetection = {
  header: string;
  type: CsvColumnType;
  confidence: number;
  sampleValues: string[];
};

type ParseCsvFileOptions = {
  file: File;
  onProgress?: (progress: CsvParseProgress) => void;
  onComplete: (result: CsvParseResult) => void;
  onError: (message: string) => void;
};

export const MAX_CSV_FILE_SIZE = 2 * 1024 * 1024;

export async function inspectCsvFile(file: File): Promise<CsvFileInspection> {
  if (file.size === 0) {
    return {
      estimatedRows: 0,
      estimatedRowsWithinFreeLimit: 0,
    };
  }

  const sampleText = await file.slice(0, Math.min(file.size, 128 * 1024)).text();
  const lines = sampleText
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return {
      estimatedRows: null,
      estimatedRowsWithinFreeLimit: null,
    };
  }

  const encoder = new TextEncoder();
  const dataLines = lines.slice(1, Math.min(lines.length, 101));
  const totalBytes = dataLines.reduce(
    (sum, line) => sum + encoder.encode(`${line}\n`).length,
    0,
  );
  const averageRowBytes = totalBytes / dataLines.length;

  if (!averageRowBytes) {
    return {
      estimatedRows: null,
      estimatedRowsWithinFreeLimit: null,
    };
  }

  return {
    estimatedRows: Math.max(1, Math.round(file.size / averageRowBytes)),
    estimatedRowsWithinFreeLimit: Math.max(
      1,
      Math.round(MAX_CSV_FILE_SIZE / averageRowBytes),
    ),
  };
}

export function isLikelyCsvFile(file: File) {
  if (file.name.toLowerCase().endsWith(".csv")) {
    return true;
  }

  return [
    "text/csv",
    "application/csv",
    "application/vnd.ms-excel",
    "text/plain",
  ].includes(file.type);
}

export function parseCsvFile({
  file,
  onProgress,
  onComplete,
  onError,
}: ParseCsvFileOptions) {
  if (file.size === 0) {
    onComplete({ headers: [], rows: [], warnings: [] });
    return;
  }

  let rowsProcessed = 0;
  const allRows: Record<string, unknown>[] = [];
  const allErrors: ParseError[] = [];
  let metaFields: string[] = [];

  Papa.parse<Record<string, unknown>>(file, {
    header: true,
    skipEmptyLines: false,
    chunkSize: 1024 * 64, // 64 KB chunks to stream progress smoothly on small files
    chunk: (results) => {
      rowsProcessed += results.data.length;
      allRows.push(...results.data);
      allErrors.push(...results.errors);
      if (results.meta?.fields && !metaFields.length) {
        metaFields = results.meta.fields;
      }

      onProgress?.({
        percentage: clampProgress(results.meta.cursor, file.size),
        rowsProcessed,
      });
    },
    complete: () => {
      const headers = normalizeHeaders(metaFields);
      const normalizedRows = headers.length
        ? allRows.map((row) => normalizeRow(row, headers))
        : [];
      const { rows, errorsToKeep } = removePhantomTrailingRows(
        normalizedRows,
        allErrors,
      );
      const warnings = new Set<string>();

      collectWarnings(errorsToKeep, warnings);
      onProgress?.({
        percentage: 100,
        rowsProcessed: rows.length,
      });

      onComplete({
        headers,
        rows,
        warnings: Array.from(warnings),
      });
    },
    error: (error) => {
      onError(buildParseErrorMessage(error as unknown as Error));
    },
  });
}

export function parseCsvText(content: string): CsvParseResult {
  if (!content.trim()) {
    return { headers: [], rows: [], warnings: [] };
  }

  const result = Papa.parse<Record<string, unknown>>(content, {
    header: true,
    skipEmptyLines: false,
  });

  const headers = normalizeHeaders(result.meta.fields ?? []);
  const normalizedRows = headers.length
    ? result.data.map((row) => normalizeRow(row, headers))
    : [];
  const { rows, errorsToKeep } = removePhantomTrailingRows(
    normalizedRows,
    result.errors,
  );
  const warnings = new Set<string>();

  collectWarnings(errorsToKeep, warnings);

  return {
    headers,
    rows,
    warnings: Array.from(warnings),
  };
}

export function detectCsvColumns(
  headers: string[],
  rows: CsvRow[],
): CsvColumnDetection[] {
  return headers.map((header) => detectCsvColumn(header, rows));
}

function normalizeHeaders(headers: string[]) {
  return headers.map((header) => header.trim()).filter(Boolean);
}

function detectCsvColumn(header: string, rows: CsvRow[]): CsvColumnDetection {
  const normalizedHeader = header.trim().toLowerCase();
  const sampleValues = rows
    .map((row) => String(row[header] ?? "").trim())
    .filter(Boolean)
    .slice(0, 3);

  const nameSignals = {
    email: /email|e-?mail|contact/i.test(normalizedHeader),
    phone: /phone|tel|mobile|cell|fax/i.test(normalizedHeader),
    url: /url|website|site|link/i.test(normalizedHeader),
    domain: /domain|company|company domain/i.test(normalizedHeader),
  };

  const valueMatches = sampleValues.reduce(
    (accumulator, value) => {
      const nextValue = value.trim().toLowerCase();

      if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(nextValue)) {
        accumulator.email += 1;
      }
      if (/(?:\+?\d[\d().\-\s]{6,}\d)/.test(nextValue)) {
        accumulator.phone += 1;
      }
      if (/^(https?:\/\/|www\.)/i.test(nextValue)) {
        accumulator.url += 1;
      }
      if (
        /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(nextValue) &&
        !nextValue.includes("@")
      ) {
        accumulator.domain += 1;
      }

      return accumulator;
    },
    { email: 0, phone: 0, url: 0, domain: 0 },
  );

  const sampleCount = sampleValues.length || 1;
  const scores = {
    email: (nameSignals.email ? 0.6 : 0) + (valueMatches.email / sampleCount) * 0.4,
    phone: (nameSignals.phone ? 0.6 : 0) + (valueMatches.phone / sampleCount) * 0.4,
    url: (nameSignals.url ? 0.6 : 0) + (valueMatches.url / sampleCount) * 0.4,
    domain:
      (nameSignals.domain ? 0.6 : 0) + (valueMatches.domain / sampleCount) * 0.4,
  };

  const [bestType, bestScore] = Object.entries(scores).sort(
    (left, right) => right[1] - left[1],
  )[0] as [CsvColumnType, number];

  if (bestScore < 0.35) {
    return {
      header,
      type: "unknown",
      confidence: 0,
      sampleValues,
    };
  }

  return {
    header,
    type: bestType,
    confidence: Math.round(bestScore * 100),
    sampleValues,
  };
}

function normalizeRow(
  row: Record<string, unknown>,
  headers: string[],
): CsvRow {
  const normalizedRow: CsvRow = {};

  headers.forEach((header) => {
    normalizedRow[header] = String(row[header] ?? "").trim();
  });

  return normalizedRow;
}

function clampProgress(cursor: number, size: number) {
  if (!size) {
    return 0;
  }

  const percentage = Math.round((cursor / size) * 100);
  return Math.max(1, Math.min(99, percentage));
}

function collectWarnings(errors: ParseError[], warnings: Set<string>) {
  errors.forEach((error) => {
    warnings.add(buildWarningMessage(error));
  });
}

function removePhantomTrailingRows(rows: CsvRow[], errors: ParseError[]) {
  const phantomRowIndexes = new Set<number>();

  errors.forEach((error) => {
    if (
      error.code === "TooFewFields" &&
      typeof error.row === "number" &&
      isBlankRow(rows[error.row])
    ) {
      phantomRowIndexes.add(error.row);
    }
  });

  const rowsToKeep = rows.filter((_, index) => !phantomRowIndexes.has(index));
  const errorsToKeep = errors.filter((error) => {
    return !(typeof error.row === "number" && phantomRowIndexes.has(error.row));
  });

  return {
    rows: rowsToKeep,
    errorsToKeep,
  };
}

function isBlankRow(row: CsvRow | undefined) {
  if (!row) {
    return false;
  }

  return Object.values(row).every((value) => value.trim() === "");
}

function buildWarningMessage(error: ParseError) {
  const rowLabel =
    typeof error.row === "number" ? `Row ${error.row + 1}` : "CSV";
  return `${rowLabel}: ${error.message}`;
}

function buildParseErrorMessage(error: Error) {
  const nextMessage = error.message.trim();
  return nextMessage
    ? `We could not parse that CSV file. ${nextMessage}`
    : "We could not parse that CSV file. Please try another file.";
}
