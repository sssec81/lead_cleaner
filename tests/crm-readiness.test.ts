import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCrmReadinessReport,
  filterCrmRowsByStatus,
} from "../src/lib/crm-readiness.ts";

test("Salesforce readiness validates required values on every row", () => {
  const rows = [
    { "Last Name": "Doe", Company: "Acme", Email: "jane@acme.com" },
    { "Last Name": "", Company: "Acme", Email: "john@acme.com" },
    { "Last Name": "Smith", Company: "", Email: "broken" },
  ];
  const report = buildCrmReadinessReport("salesforce", rows);

  assert.equal(report.readyRows, 1);
  assert.equal(report.blockedRows, 2);
  assert.ok(report.issues.some((issue) => issue.field === "Last Name"));
  assert.ok(report.issues.some((issue) => issue.code === "invalid_email"));
});

test("HubSpot readiness catches missing identity and duplicate emails", () => {
  const rows = [
    { Email: "same@acme.com", "First name": "Jane" },
    { Email: "same@acme.com", "First name": "John" },
    { Email: "", "First name": "", "Last name": "" },
  ];
  const report = buildCrmReadinessReport("hubspot", rows);

  assert.equal(report.reviewRows, 2);
  assert.equal(report.blockedRows, 1);
  assert.equal(report.issues.filter((issue) => issue.code === "duplicate_email").length, 2);
});

test("filterCrmRowsByStatus returns only the requested readiness groups", () => {
  const rows = [
    { "Person Name": "Jane Doe", "Person Email": "jane@acme.com" },
    { "Person Name": "", "Person Email": "john@acme.com" },
  ];
  const report = buildCrmReadinessReport("pipedrive", rows);

  assert.deepEqual(filterCrmRowsByStatus(rows, report, ["ready"]), [rows[0]]);
  assert.deepEqual(filterCrmRowsByStatus(rows, report, ["blocked"]), [rows[1]]);
});
