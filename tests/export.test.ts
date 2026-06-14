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

test("buildCsvTextFromLines keeps leading plus for phone exports", () => {
  const csv = buildCsvTextFromLines(["+14155550101"], "phone", {
    allowLeadingPlus: true,
  });

  assert.match(csv, /\+14155550101/);
  assert.ok(!csv.includes("'+14155550101"));
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

test("buildCsvTextFromRecords keeps leading plus for phone-like columns", () => {
  const csv = buildCsvTextFromRecords([
    {
      phone: "+14155550101",
      mobile: "+442079460958",
    },
  ]);

  assert.match(csv, /\+14155550101/);
  assert.match(csv, /\+442079460958/);
  assert.ok(!csv.includes("'+14155550101"));
  assert.ok(!csv.includes("'+442079460958"));
});

test("buildCsvTextFromRecords quotes comma-containing cells while keeping formula-safe guards", () => {
  const csv = buildCsvTextFromRecords([
    {
      name: "Jane Doe",
      note: "=SUM(A1:A2), with comma",
    },
  ]);

  assert.ok(csv.includes('"\'=SUM(A1:A2), with comma"'));
  assert.ok(csv.includes("Jane Doe"));
});
