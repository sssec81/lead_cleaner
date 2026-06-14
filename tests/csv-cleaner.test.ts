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

test("cleanCsvRows business_only removes rows without a business email", () => {
  const rows = [
    { email: "jane@acme.com", phone: "", website: "", name: "Business" },
    { email: "sara@gmail.com", phone: "", website: "", name: "Personal" },
    { email: "", phone: "+14155550101", website: "", name: "No Email" },
  ];

  const result = cleanCsvRows(
    rows,
    ["email", "phone", "website", "name"],
    "email",
    "selected",
    "business_only",
  );

  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0]?.email, "jane@acme.com");
  assert.equal(result.summary.filteredRowsRemoved, 1);
  assert.equal(result.summary.invalidRowsRemoved, 1);
});

test("normalizeDomainValue accepts bare domains and URL-like domain values", () => {
  assert.equal(normalizeDomainValue("acme.com"), "acme.com");
  assert.equal(normalizeDomainValue("www.acme.com"), "acme.com");
  assert.equal(normalizeDomainValue("https://acme.com/pricing"), "acme.com");
  assert.equal(normalizeDomainValue("acme.com/"), "acme.com");
});
