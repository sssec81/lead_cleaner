import Papa from "papaparse";

type CsvSanitizeOptions = {
 allowLeadingPlus?: boolean;
};

type CsvRecordExportOptions = {
 headers?: string[];
 includeHeader?: boolean;
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
 return buildCsvTextFromRecordsWithOptions(rows);
}

export function buildCsvTextFromRecordsWithOptions(
 rows: Array<Record<string, unknown>>,
 { headers, includeHeader = true }: CsvRecordExportOptions = {},
) {
 const exportHeaders =
 headers ?? Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

 const sanitizedRows = rows.map((row) =>
 exportHeaders.map((header) =>
 sanitizeCsvCell(row[header], getCsvSanitizeOptions(header)),
 ),
 );

 return Papa.unparse(
 {
 fields: exportHeaders.map((header) =>
 sanitizeCsvCell(header, getCsvSanitizeOptions(header)),
 ),
 data: sanitizedRows,
 },
 { header: includeHeader },
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
