import type { CsvRow } from "@/lib/csv";

export type MergeHeaderMapping = {
  originalHeader: string;
  mergedHeader: string;
};

export type CanonicalizedCsvRows = {
  headers: string[];
  rows: CsvRow[];
  headerMappings: MergeHeaderMapping[];
};

export function canonicalizeMergeHeader(header: string) {
  const trimmed = header.trim();
  const normalized = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "");

  if (
    normalized === "name" ||
    normalized === "fullname" ||
    normalized === "contactname"
  ) {
    return "name";
  }

  if (
    normalized === "email" ||
    normalized === "emailaddress" ||
    normalized === "workemail"
  ) {
    return "email";
  }

  if (
    normalized === "phone" ||
    normalized === "phonenumber" ||
    normalized === "mobile" ||
    normalized === "telephone" ||
    normalized === "tel" ||
    normalized === "cell"
  ) {
    return "phone";
  }

  if (
    normalized === "company" ||
    normalized === "companyname" ||
    normalized === "organization" ||
    normalized === "organisation"
  ) {
    return "company";
  }

  if (
    normalized === "website" ||
    normalized === "websiteurl" ||
    normalized === "url" ||
    normalized === "site" ||
    normalized === "link"
  ) {
    return "website";
  }

  if (normalized === "domain" || normalized === "companydomain") {
    return "domain";
  }

  if (normalized === "source" || normalized === "origin" || normalized === "listsource") {
    return "source";
  }

  if (normalized === "notes" || normalized === "note" || normalized === "remarks") {
    return "notes";
  }

  return trimmed;
}

export function canonicalizeCsvRows(headers: string[], rows: CsvRow[]): CanonicalizedCsvRows {
  const mergedHeaders: string[] = [];
  const seenHeaders = new Set<string>();
  const headerMappings = headers.map((originalHeader) => {
    const mergedHeader = canonicalizeMergeHeader(originalHeader);

    if (!seenHeaders.has(mergedHeader)) {
      seenHeaders.add(mergedHeader);
      mergedHeaders.push(mergedHeader);
    }

    return {
      originalHeader,
      mergedHeader,
    };
  });

  const normalizedRows = rows.map((row) => {
    const normalizedRow: CsvRow = {};

    headerMappings.forEach(({ originalHeader, mergedHeader }) => {
      const nextValue = String(row[originalHeader] ?? "").trim();

      if (!nextValue) {
        if (normalizedRow[mergedHeader] === undefined) {
          normalizedRow[mergedHeader] = "";
        }
        return;
      }

      if (!normalizedRow[mergedHeader]) {
        normalizedRow[mergedHeader] = nextValue;
      }
    });

    mergedHeaders.forEach((header) => {
      if (normalizedRow[header] === undefined) {
        normalizedRow[header] = "";
      }
    });

    return normalizedRow;
  });

  return {
    headers: mergedHeaders,
    rows: normalizedRows,
    headerMappings,
  };
}
