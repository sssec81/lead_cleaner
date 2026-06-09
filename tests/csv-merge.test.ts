import assert from "node:assert/strict";
import test from "node:test";

import { canonicalizeCsvRows, canonicalizeMergeHeader } from "../src/lib/csv-merge.ts";

test("canonicalizeMergeHeader aligns common merge header variants", () => {
  assert.equal(canonicalizeMergeHeader("email_address"), "email");
  assert.equal(canonicalizeMergeHeader("work_email"), "email");
  assert.equal(canonicalizeMergeHeader("mobile"), "phone");
  assert.equal(canonicalizeMergeHeader("contact_name"), "name");
  assert.equal(canonicalizeMergeHeader("organization"), "company");
  assert.equal(canonicalizeMergeHeader("website_url"), "website");
});

test("canonicalizeCsvRows merges synonymous headers into canonical columns", () => {
  const result = canonicalizeCsvRows(
    ["full_name", "email_address", "mobile", "company_name", "website_url"],
    [
      {
        full_name: "Alice Johnson",
        email_address: "alice@example.com",
        mobile: "+14155550101",
        company_name: "Northstar Labs",
        website_url: "https://northstarlabs.com",
      },
    ],
  );

  assert.deepEqual(result.headers, ["name", "email", "phone", "company", "website"]);
  assert.deepEqual(result.rows[0], {
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+14155550101",
    company: "Northstar Labs",
    website: "https://northstarlabs.com",
  });
});
