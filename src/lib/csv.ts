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

type ParseCsvFileOptions = {
  file: File;
  onProgress?: (progress: CsvParseProgress) => void;
  onComplete: (result: CsvParseResult) => void;
  onError: (message: string) => void;
};

export const MAX_CSV_FILE_SIZE = 2 * 1024 * 1024;

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

function normalizeHeaders(headers: string[]) {
  return headers.map((header) => header.trim()).filter(Boolean);
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
