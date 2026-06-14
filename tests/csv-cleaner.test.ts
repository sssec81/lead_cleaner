import assert from "node:assert/strict";
import test from "node:test";

import { cleanCsvRows, normalizeDomainValue } from "../src/lib/csv-cleaner.ts";

test("cleanCsvRows keeps rows with valid phone keys when selected email column is blank", () => {
  const rows = [
    { email: "", phone: "+14155550101", website: "", name: "Jane" },
    { email: "", phone: "+14155550101", website: "", name: "Jane Copy" },
  ];

  const result = cleanCsvRows(
    rows,
    ["email", "phone", "website", "name"],
    "email",
    "phone",
    "all",
  );

  assert.equal(result.rows.length, 1);
  assert.equal(result.summary.duplicatesRemoved, 1);
  assert.equal(result.summary.invalidRowsRemoved, 0);
  assert.equal(result.rows[0]?.phone, "+14155550101");
});

test("cleanCsvRows accepts URL-like values in domain columns", () => {
  const rows = [
    { domain: "https://www.acme.com/pricing", email: "", phone: "", name: "Acme" },
    { domain: "acme.com", email: "", phone: "", name: "Acme Copy" },
  ];

  const result = cleanCsvRows(
    rows,
    ["domain", "email", "phone", "name"],
    "domain",
    "domain",
    "all",
  );

  assert.equal(result.rows.length, 1);
  assert.equal(result.summary.duplicatesRemoved, 1);
  assert.equal(result.summary.invalidRowsRemoved, 0);
});

test("cleanCsvRows business_only on phone-only CSV keeps rows and warns", () => {
  const rows = [
    { email: "", phone: "+14155550101", website: "", name: "Jane" },
    { email: "", phone: "+14155550102", website: "", name: "Sara" },
  ];

  const result = cleanCsvRows(
    rows,
    ["email", "phone", "website", "name"],
    "phone",
    "phone",
    "business_only",
  );

  assert.equal(result.rows.length, 2);
  assert.equal(result.summary.filteredRowsRemoved, 0);
  assert.equal(result.warning, "Email filter ignored because no email column was found.");
});

test("normalizeDomainValue accepts bare domains and URL-like domain values", () => {
  assert.equal(normalizeDomainValue("acme.com"), "acme.com");
  assert.equal(normalizeDomainValue("www.acme.com"), "acme.com");
  assert.equal(normalizeDomainValue("https://acme.com/pricing"), "acme.com");
  assert.equal(normalizeDomainValue("acme.com/"), "acme.com");
});

// New tests requested to cover specific duplicate modes and categories
test("cleanCsvRows covers different duplicate modes", () => {
  const rows = [
    { email: "jane@acme.com", phone: "+14155550101", domain: "acme.com", name: "Jane" },
    { email: "jane@acme.com", phone: "+14155550102", domain: "acme.com", name: "Jane Different Phone" },
    { email: "bob@acme.com", phone: "+14155550101", domain: "acme.com", name: "Bob Same Phone" },
  ];

  // 1. selected duplicate mode (on name column, which is distinct)
  const resultSelected = cleanCsvRows(rows, ["email", "phone", "domain", "name"], "name", "selected", "all");
  assert.equal(resultSelected.rows.length, 3);
  assert.equal(resultSelected.summary.duplicatesRemoved, 0);

  // 2. email duplicate mode
  const resultEmail = cleanCsvRows(rows, ["email", "phone", "domain", "name"], "name", "email", "all");
  assert.equal(resultEmail.rows.length, 2); // jane@acme.com is de-duplicated
  assert.equal(resultEmail.summary.duplicatesRemoved, 1);

  // 3. phone duplicate mode
  const resultPhone = cleanCsvRows(rows, ["email", "phone", "domain", "name"], "name", "phone", "all");
  assert.equal(resultPhone.rows.length, 2); // +14155550101 is de-duplicated
  assert.equal(resultPhone.summary.duplicatesRemoved, 1);

  // 4. domain duplicate mode
  const resultDomain = cleanCsvRows(rows, ["email", "phone", "domain", "name"], "name", "domain", "all");
  assert.equal(resultDomain.rows.length, 1); // all share acme.com domain
  assert.equal(resultDomain.summary.duplicatesRemoved, 2);

  // 5. entire_row duplicate mode
  const resultEntireRow = cleanCsvRows(rows, ["email", "phone", "domain", "name"], "name", "entire_row", "all");
  assert.equal(resultEntireRow.rows.length, 3); // no rows are completely identical
  assert.equal(resultEntireRow.summary.duplicatesRemoved, 0);
});

test("cleanCsvRows personal_only on phone-only CSV keeps rows and warns", () => {
  const rows = [
    { email: "", phone: "+14155550101", website: "", name: "Jane" },
    { email: "", phone: "+14155550102", website: "", name: "Sara" },
  ];

  const result = cleanCsvRows(
    rows,
    ["email", "phone", "website", "name"],
    "phone",
    "phone",
    "personal_only",
  );

  assert.equal(result.rows.length, 2);
  assert.equal(result.summary.filteredRowsRemoved, 0);
  assert.equal(result.warning, "Email filter ignored because no email column was found.");
});

test("cleanCsvRows business_only removes personal and missing-email rows when email data exists", () => {
  const rows = [
    { name: "Business", email: "jane@acme.com", phone: "+14155550101" },
    { name: "Personal", email: "sara@gmail.com", phone: "+14155550102" },
    { name: "Missing", email: "", phone: "+14155550103" },
  ];

  const result = cleanCsvRows(
    rows,
    ["name", "email", "phone"],
    "name",
    "selected",
    "business_only",
  );

  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0]?.email, "jane@acme.com");
  assert.equal(result.summary.filteredRowsRemoved, 2);
  assert.equal(result.summary.invalidRowsRemoved, 0);
  assert.equal(result.warning, undefined);
});

test("cleanCsvRows personal_only removes business and missing-email rows when email data exists", () => {
  const rows = [
    { name: "Business", email: "jane@acme.com", phone: "+14155550101" },
    { name: "Personal", email: "sara@gmail.com", phone: "+14155550102" },
    { name: "Missing", email: "", phone: "+14155550103" },
  ];

  const result = cleanCsvRows(
    rows,
    ["name", "email", "phone"],
    "name",
    "selected",
    "personal_only",
  );

  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0]?.email, "sara@gmail.com");
  assert.equal(result.summary.filteredRowsRemoved, 2);
  assert.equal(result.summary.invalidRowsRemoved, 0);
  assert.equal(result.warning, undefined);
});

test("cleanCsvRows handles blank rows and categorizes them correctly", () => {
  const rows = [
    { email: "   ", phone: "", name: "" }, // Blank row
    { email: "jane@acme.com", phone: "+14155550101", name: "Jane" },
  ];

  const result = cleanCsvRows(
    rows,
    ["email", "phone", "name"],
    "email",
    "selected",
    "all",
  );

  assert.equal(result.rows.length, 1);
  assert.equal(result.blankRows.length, 1);
  assert.equal(result.summary.emptyRowsRemoved, 1);
  assert.equal(result.removedRows.length, 1);
  assert.equal(result.removedRows[0]?.leadcleanr_reason, "blank");
});

test("cleanCsvRows duplicateRows / invalidRows / removedRows summaries", () => {
  const rows = [
    { email: "invalid-email", phone: "", name: "Invalid" },
    { email: "jane@acme.com", phone: "", name: "Jane" },
    { email: "jane@acme.com", phone: "", name: "Jane Copy" },
  ];

  const result = cleanCsvRows(
    rows,
    ["email", "phone", "name"],
    "email",
    "selected",
    "all",
  );

  // invalid-email has invalid format under email duplicate mode / selected column
  assert.equal(result.rows.length, 1); // Only jane@acme.com is ready
  assert.equal(result.invalidRows.length, 1);
  assert.equal(result.duplicateRows.length, 1);
  assert.equal(result.removedRows.length, 2);
  assert.ok(result.removedRows.some(r => r.leadcleanr_reason === "invalid"));
  assert.ok(result.removedRows.some(r => r.leadcleanr_reason === "duplicate"));
});
