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

test("parseCsvText preserves quoted commas inside fields", () => {
  const result = parseCsvText('name,notes\nJane,"hello, world"');

  assert.deepEqual(result.rows[0], {
    name: "Jane",
    notes: "hello, world",
  });
});

test("parseCsvText removes fully empty rows from the result set", () => {
  const result = parseCsvText("name,email\n\nJane,jane@acme.com\n,\nJohn,john@acme.com\n");

  assert.equal(result.rows.length, 2);
  assert.deepEqual(
    result.rows.map((row) => row.email),
    ["jane@acme.com", "john@acme.com"],
  );
});

test("parseCsvText keeps duplicate headers by using renamed field keys", () => {
  const result = parseCsvText("name,name,email\nJane,Alias,jane@acme.com");

  assert.deepEqual(result.headers, ["name", "name_1", "email"]);
  assert.deepEqual(result.rows[0], {
    name: "Jane",
    name_1: "Alias",
    email: "jane@acme.com",
  });
});

test("parseCsvText surfaces warnings for malformed CSV input", () => {
  const result = parseCsvText('name,email\n"Jane,jane@acme.com\nJohn,john@acme.com');

  assert.equal(result.headers.length, 2);
  assert.ok(result.warnings.some((warning) => warning.includes("Quoted field unterminated")));
  assert.ok(result.warnings.some((warning) => warning.includes("Too few fields")));
});

test("parseCsvText handles large CSV inputs without dropping rows", () => {
  const lines = ["name,email"];

  for (let index = 0; index < 2500; index += 1) {
    lines.push(`User ${index},user${index}@example.com`);
  }

  const result = parseCsvText(lines.join("\n"));

  assert.equal(result.rows.length, 2500);
  assert.equal(result.rows[0]?.email, "user0@example.com");
  assert.equal(result.rows[2499]?.email, "user2499@example.com");
});
