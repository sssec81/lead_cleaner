import Papa from "papaparse";

type CsvSanitizeOptions = {
  allowLeadingPlus?: boolean;
};

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  triggerDownload(blob, filename);
}

export function downloadJsonFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  triggerDownload(blob, filename);
}

export function downloadCsvFile(
  filename: string,
  rows: string[],
  header = "email",
) {
  const csvBody = buildCsvTextFromLines(rows, header, getCsvSanitizeOptions(header));
  const blob = new Blob([csvBody], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

export function downloadCsvRecords(
  filename: string,
  rows: Array<Record<string, unknown>>,
) {
  const csvContent = buildCsvTextFromRecords(rows);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

export function sanitizeCsvCell(
  value: unknown,
  options: CsvSanitizeOptions = {},
) {
  const normalized = String(value ?? "");
  const guardPattern = options.allowLeadingPlus
    ? /^[\t\r ]*[=\-@]/
    : /^[\t\r ]*[=+\-@]/;

  return guardPattern.test(normalized) ? `'${normalized}` : normalized;
}

export function buildCsvTextFromLines(
  rows: string[],
  header = "email",
  options: CsvSanitizeOptions = {},
) {
  return Papa.unparse([
    [sanitizeCsvCell(header, options)],
    ...rows.map((row) => [sanitizeCsvCell(row, options)]),
  ]);
}

export function buildCsvTextFromRecords(rows: Array<Record<string, unknown>>) {
  return Papa.unparse(
    rows.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          sanitizeCsvCell(value, getCsvSanitizeOptions(key)),
        ]),
      ),
    ),
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getCsvSanitizeOptions(header: string): CsvSanitizeOptions {
  return {
    allowLeadingPlus: isPhoneLikeHeader(header),
  };
}

function isPhoneLikeHeader(header: string) {
  return /phone|tel|mobile|cell/i.test(header.trim());
}
