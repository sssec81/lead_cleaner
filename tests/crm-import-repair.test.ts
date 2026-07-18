import assert from "node:assert/strict";
import test from "node:test";

import {
  buildImportRepairReport,
  buildRepairHint,
} from "../src/lib/crm-import-repair.ts";

test("import repair matches failed rows by CRM identity", () => {
  const sourceRows = [
    { Email: "jane@acme.com", "First name": "Jane" },
    { Email: "john@acme.com", "First name": "John" },
  ];
  const errorRows = [
    { Email: "john@acme.com", Error: "Invalid property option" },
  ];
  const report = buildImportRepairReport(sourceRows, ["Email", "Error"], errorRows);

  assert.equal(report.matchedErrors, 1);
  assert.equal(report.matches[0]?.sourceRowIndex, 1);
  assert.equal(report.retryRows[0]?.Email, "john@acme.com");
  assert.match(String(report.retryRows[0]?.leadcleanr_repair_hint), /property options/);
});

test("import repair falls back to CRM line numbers", () => {
  const sourceRows = [{ Email: "first@acme.com" }, { Email: "second@acme.com" }];
  const errorRows = [{ "Row Number": "3", Message: "Company is required" }];
  const report = buildImportRepairReport(
    sourceRows,
    ["Row Number", "Message"],
    errorRows,
  );

  assert.equal(report.matches[0]?.matchedBy, "row_number");
  assert.equal(report.retryRows[0]?.Email, "second@acme.com");
});

test("import repair keeps unmatched errors visible", () => {
  const report = buildImportRepairReport(
    [{ Email: "jane@acme.com" }],
    ["Email", "Error"],
    [{ Email: "unknown@acme.com", Error: "Duplicate record" }],
  );

  assert.equal(report.unmatchedErrors, 1);
  assert.equal(report.retryRows.length, 0);
  assert.match(buildRepairHint("Duplicate record"), /merge/);
});
