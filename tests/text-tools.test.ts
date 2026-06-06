import assert from "node:assert/strict";
import test from "node:test";

import {
  cleanEmailList,
  extractDomainsFromEmails,
  extractEmailsFromText,
  extractPhoneNumbersFromText,
  extractUrlsFromText,
  parseAndFormatPhone,
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
  assert.equal(result.stats.found, 3);
  assert.equal(result.stats.duplicatesRemoved, 1);
});

test("cleanEmailList filters invalid entries", () => {
  const result = cleanEmailList(
    "valid@example.com invalid-email another@company.io valid@example.com",
  );

  assert.deepEqual(result.results, ["another@company.io", "valid@example.com"]);
  assert.equal(result.stats.invalidRemoved, 1);
});

test("extractPhoneNumbersFromText normalizes international and local numbers with libphonenumber-js", () => {
  const result = extractPhoneNumbersFromText(
    "Call +44 20 7946 0958 or (415) 555-0101 today.",
  );

  assert.deepEqual(result.results, ["+14155550101", "+442079460958"]);
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

// Task 1 Stats Behavior Tests
test("stats behavior - uppercase/lowercase duplicates", () => {
  const result = cleanEmailList("info@LeadCleanr.com INFO@leadcleanr.com info@leadcleanr.com");
  assert.equal(result.stats.scanned, 3);
  assert.equal(result.stats.found, 3);
  assert.equal(result.stats.duplicatesRemoved, 2);
  assert.equal(result.stats.finalCount, 1);
  assert.deepEqual(result.results, ["info@leadcleanr.com"]);
});

test("stats behavior - blank lines in input", () => {
  const input = "info@leadcleanr.com\n\n\nsupport@leadcleanr.com";
  const result = extractEmailsFromText(input);
  assert.equal(result.stats.scanned, 4);
  assert.equal(result.stats.blankRemoved, 2);
  assert.equal(result.stats.finalCount, 2);
});

test("stats behavior - invalid emails", () => {
  const result = cleanEmailList("valid@leadcleanr.com invalid-email-format notvalid.com");
  assert.equal(result.stats.found, 3);
  assert.equal(result.stats.invalidRemoved, 2);
  assert.equal(result.stats.finalCount, 1);
});

test("stats behavior - repeated emails list", () => {
  const result = cleanEmailList("a@b.com a@b.com a@b.com a@b.com");
  assert.equal(result.stats.duplicatesRemoved, 3);
  assert.equal(result.stats.finalCount, 1);
});

test("stats behavior - no matches found in text", () => {
  const result = extractEmailsFromText("This text does not have any emails.");
  assert.equal(result.stats.found, 0);
  assert.equal(result.stats.finalCount, 0);
});

test("stats behavior - mixed valid and invalid input", () => {
  const result = cleanEmailList("valid@email.com invalid1 valid@email.com invalid2");
  assert.equal(result.stats.scanned, 4);
  assert.equal(result.stats.found, 4);
  assert.equal(result.stats.invalidRemoved, 2);
  assert.equal(result.stats.duplicatesRemoved, 1);
  assert.equal(result.stats.finalCount, 1);
});

// Task 4 Phone Number Parsing Validation Tests
test("phone verification - US number", () => {
  assert.equal(parseAndFormatPhone("4155550101"), "+14155550101");
});

test("phone verification - UK number", () => {
  assert.equal(parseAndFormatPhone("+44 20 7946 0958"), "+442079460958");
  assert.equal(parseAndFormatPhone("020 7946 0958"), "+442079460958");
});

test("phone verification - number with spaces", () => {
  assert.equal(parseAndFormatPhone("+1 415 555 0101"), "+14155550101");
});

test("phone verification - number with parentheses", () => {
  assert.equal(parseAndFormatPhone("(415) 555-0101"), "+14155550101");
});

test("phone verification - number with hyphens", () => {
  assert.equal(parseAndFormatPhone("415-555-0101"), "+14155550101");
});

test("phone verification - random serial number should be rejected", () => {
  assert.equal(parseAndFormatPhone("98765432109876"), null);
});

test("phone verification - too-short number should be rejected", () => {
  assert.equal(parseAndFormatPhone("12345"), null);
});

test("phone verification - duplicated number in different formatting deduplicated", () => {
  const result = extractPhoneNumbersFromText("Call (415) 555-0101 and 415-555-0101 or +1 415 555 0101");
  assert.equal(result.stats.found, 3);
  assert.equal(result.stats.duplicatesRemoved, 2);
  assert.equal(result.stats.finalCount, 1);
  assert.deepEqual(result.results, ["+14155550101"]);
});
