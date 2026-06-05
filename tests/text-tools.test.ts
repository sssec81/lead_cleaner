import assert from "node:assert/strict";
import test from "node:test";

import {
  cleanEmailList,
  extractDomainsFromEmails,
  extractEmailsFromText,
  extractPhoneNumbersFromText,
  extractUrlsFromText,
} from "../src/lib/text-tools.ts";

test("extractEmailsFromText keeps plus tags and deduplicates results", () => {
  const input = [
    "Reach user+tag@example.co.uk today.",
    "Backup: USER+tag@example.co.uk",
    "Other: person@company.com",
  ].join("\n");

  const result = extractEmailsFromText(input);

  assert.deepEqual(result.results, [
    "person@company.com",
    "user+tag@example.co.uk",
  ]);
  assert.equal(result.stats.totalFound, 3);
  assert.equal(result.stats.duplicatesRemoved, 1);
});

test("cleanEmailList filters invalid entries", () => {
  const result = cleanEmailList(
    "valid@example.com invalid-email another@company.io valid@example.com",
  );

  assert.deepEqual(result.results, ["another@company.io", "valid@example.com"]);
  assert.equal(result.stats.invalidRemoved, 1);
});

test("extractPhoneNumbersFromText normalizes international and local numbers", () => {
  const result = extractPhoneNumbersFromText(
    "Call +44 20 7946 0958 or (415) 555-0101 today.",
  );

  assert.deepEqual(result.results, ["+442079460958", "4155550101"]);
});

test("extractUrlsFromText normalizes URLs and drops punctuation", () => {
  const result = extractUrlsFromText(
    "Docs: https://Example.com/path?a=1. Mirror: www.acme.com/test.",
  );

  assert.deepEqual(result.results, [
    "https://acme.com/test",
    "https://example.com/path?a=1",
  ]);
});

test("extractDomainsFromEmails combines email and URL domains", () => {
  const result = extractDomainsFromEmails(
    "hello@northstar.io and https://www.acme.com/pricing",
  );

  assert.deepEqual(result.results, ["acme.com", "northstar.io"]);
});
