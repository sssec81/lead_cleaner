import assert from "node:assert/strict";
import test from "node:test";

import { detectCsvColumns, parseCsvText } from "../src/lib/csv.ts";

test("parseCsvText returns headers and rows from a basic CSV", () => {
  const result = parseCsvText("name,email\nJane,jane@acme.com\nJohn,john@acme.com");

  assert.deepEqual(result.headers, ["name", "email"]);
  assert.equal(result.rows.length, 2);
  assert.equal(result.rows[0]?.email, "jane@acme.com");
});

test("parseCsvText preserves values when headers contain surrounding spaces", () => {
  const result = parseCsvText(" name , email ,company\nJane,jane@acme.com,Acme");

  assert.deepEqual(result.headers, ["name", "email", "company"]);
  assert.deepEqual(result.rows[0], {
    name: "Jane",
    email: "jane@acme.com",
    company: "Acme",
  });
});

test("detectCsvColumns identifies email and url columns", () => {
  const parsed = parseCsvText(
    "company,email,website\nAcme,hello@acme.com,https://acme.com",
  );

  const detections = detectCsvColumns(parsed.headers, parsed.rows);
  const emailDetection = detections.find((item) => item.header === "email");
  const websiteDetection = detections.find((item) => item.header === "website");

  assert.equal(emailDetection?.type, "email");
  assert.equal(websiteDetection?.type, "url");
});
