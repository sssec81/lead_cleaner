import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCleanupAuditFileName,
  buildCleanupAuditReport,
} from "../src/lib/cleanup-audit-report.ts";
import { buildCrmReadinessReport } from "../src/lib/crm-readiness.ts";

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

test("buildCleanupAuditReport includes CRM preflight results", () => {
  const readiness = buildCrmReadinessReport("salesforce", [
    { "Last Name": "", Company: "Acme", Email: "jane@acme.com" },
  ]);
  const report = buildCleanupAuditReport({
    fileName: "salesforce.csv",
    selectedColumn: "Email",
    duplicateMode: "email",
    emailFilter: "all",
    summary: {
      totalRows: 1,
      emptyRowsRemoved: 0,
      invalidRowsRemoved: 0,
      duplicatesRemoved: 0,
      filteredRowsRemoved: 0,
      cleanRowsReady: 1,
      businessEmails: 1,
      personalEmails: 0,
      roleBasedEmails: 0,
      generatedDomains: 1,
    },
    crmFormat: "salesforce",
    readiness,
  });

  assert.match(report, /CRM import preflight/);
  assert.match(report, /Rows blocked: 1/);
});
