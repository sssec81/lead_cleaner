import Papa from "papaparse";

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
  const csvBody = buildCsvTextFromLines(rows, header);
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

export function sanitizeCsvCell(value: unknown) {
  const normalized = String(value ?? "");

  return /^[\t\r ]*[=+\-@]/.test(normalized) ? `'${normalized}` : normalized;
}

export function buildCsvTextFromLines(rows: string[], header = "email") {
  return Papa.unparse([
    [sanitizeCsvCell(header)],
    ...rows.map((row) => [sanitizeCsvCell(row)]),
  ]);
}

export function buildCsvTextFromRecords(rows: Array<Record<string, unknown>>) {
  return Papa.unparse(
    rows.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, sanitizeCsvCell(value)]),
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
