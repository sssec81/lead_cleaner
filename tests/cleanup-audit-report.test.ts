import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCleanupAuditFileName,
  buildCleanupAuditReport,
} from "../src/lib/cleanup-audit-report.ts";

test("buildCleanupAuditReport describes rules and before/after metrics", () => {
  const report = buildCleanupAuditReport({
    fileName: "client-leads.csv",
    generatedAt: new Date("2026-07-18T12:00:00.000Z"),
    selectedColumn: "email",
    duplicateMode: "email",
    emailFilter: "business_only",
    summary: {
      totalRows: 100,
      emptyRowsRemoved: 5,
      invalidRowsRemoved: 10,
      duplicatesRemoved: 15,
      filteredRowsRemoved: 20,
      cleanRowsReady: 50,
      businessEmails: 50,
      personalEmails: 20,
      roleBasedEmails: 4,
      generatedDomains: 50,
    },
  });

  assert.match(report, /File: client-leads\.csv/);
  assert.match(report, /Deduplicate by: Email/);
  assert.match(report, /Email filter: Business Only/);
  assert.match(report, /Rows before cleanup: 100/);
  assert.match(report, /Rows ready after cleanup: 50/);
  assert.match(report, /Rows removed: 50/);
  assert.match(report, /Ready rate: 50%/);
  assert.match(report, /source CSV not uploaded/);
});

test("buildCleanupAuditFileName creates a readable text filename", () => {
  assert.equal(
    buildCleanupAuditFileName("client-leads.csv"),
    "client-leads-cleanup-audit.txt",
  );
});
