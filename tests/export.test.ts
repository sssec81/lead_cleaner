import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCsvTextFromLines,
  buildCsvTextFromRecords,
  sanitizeCsvCell,
} from "../src/lib/export.ts";

test("sanitizeCsvCell guards spreadsheet formula prefixes", () => {
  assert.equal(sanitizeCsvCell("=SUM(A1:A2)"), "'=SUM(A1:A2)");
  assert.equal(sanitizeCsvCell("+cmd"), "'+cmd");
  assert.equal(sanitizeCsvCell("-10"), "'-10");
  assert.equal(sanitizeCsvCell("@malicious"), "'@malicious");
  assert.equal(sanitizeCsvCell("safe@example.com"), "safe@example.com");
});

test("buildCsvTextFromLines sanitizes exported line items", () => {
  const csv = buildCsvTextFromLines(["=SUM(A1:A2)", "safe@example.com"], "email");

  assert.match(csv, /'=SUM\(A1:A2\)/);
  assert.match(csv, /safe@example\.com/);
});

test("buildCsvTextFromRecords sanitizes dangerous record cells", () => {
  const csv = buildCsvTextFromRecords([
    {
      email: "safe@example.com",
      note: "=HYPERLINK(\"http://bad\")",
    },
  ]);

  assert.match(csv, /safe@example\.com/);
  assert.ok(csv.includes("'=HYPERLINK"));
});
