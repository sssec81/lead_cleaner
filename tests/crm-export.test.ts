import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCrmExport,
  buildCrmExportFileName,
} from "../src/lib/crm-export.ts";

const headers = [
  "Full Name",
  "Work Email",
  "Mobile",
  "Company Name",
  "Website",
  "Job Title",
  "LinkedIn URL",
];
const rows = [
  {
    "Full Name": "Jane Doe",
    "Work Email": "jane@acme.com",
    Mobile: "+14155550101",
    "Company Name": "Acme",
    Website: "https://acme.com",
    "Job Title": "VP Sales",
    "LinkedIn URL": "https://linkedin.com/in/janedoe",
  },
];

test("buildCrmExport maps HubSpot fields and derives split names", () => {
  const result = buildCrmExport("hubspot", headers, rows);

  assert.equal(result.rows[0]?.["First name"], "Jane");
  assert.equal(result.rows[0]?.["Last name"], "Doe");
  assert.equal(result.rows[0]?.Email, "jane@acme.com");
  assert.equal(result.rows[0]?.["Phone number"], "+14155550101");
  assert.equal(result.rows[0]?.["Company name"], "Acme");
  assert.equal(result.missingRequiredFields.length, 0);
  assert.ok(
    result.mappings.some(
      (mapping) =>
        mapping.targetHeader === "First name" && mapping.status === "derived",
    ),
  );
});

test("buildCrmExport uses Salesforce labels and reports required fields", () => {
  const complete = buildCrmExport("salesforce", headers, rows);
  assert.equal(complete.rows[0]?.["Last Name"], "Doe");
  assert.equal(complete.rows[0]?.Company, "Acme");
  assert.deepEqual(complete.missingRequiredFields, []);

  const incomplete = buildCrmExport(
    "salesforce",
    ["email"],
    [{ email: "jane@acme.com" }],
  );
  assert.deepEqual(incomplete.missingRequiredFields, ["Last Name", "Company"]);
});

test("buildCrmExport maps Apollo's recommended contact identity fields", () => {
  const result = buildCrmExport("apollo", headers, rows);

  assert.equal(result.rows[0]?.["Contact Email"], "jane@acme.com");
  assert.equal(result.rows[0]?.["Contact LinkedIn URL"], "https://linkedin.com/in/janedoe");
  assert.equal(result.rows[0]?.["Company Website"], "https://acme.com");
  assert.deepEqual(result.missingRequiredFields, []);
});

test("buildCrmExport joins first and last names for Pipedrive people", () => {
  const result = buildCrmExport(
    "pipedrive",
    ["First Name", "Last Name", "email"],
    [{ "First Name": "Jane", "Last Name": "Doe", email: "jane@acme.com" }],
  );

  assert.equal(result.rows[0]?.["Person Name"], "Jane Doe");
  assert.equal(result.rows[0]?.["Person Email"], "jane@acme.com");
  assert.deepEqual(result.missingRequiredFields, []);
});

test("buildCrmExport derives a website from a domain and a domain from a URL", () => {
  const apollo = buildCrmExport(
    "apollo",
    ["domain"],
    [{ domain: "acme.com" }],
  );
  assert.equal(apollo.rows[0]?.["Company Website"], "https://acme.com");

  const hubspot = buildCrmExport(
    "hubspot",
    ["website"],
    [{ website: "https://www.acme.com/pricing" }],
  );
  assert.equal(hubspot.rows[0]?.["Company domain name"], "acme.com");
});

test("buildCrmExport excludes missing optional fields from output", () => {
  const result = buildCrmExport(
    "hubspot",
    ["email"],
    [{ email: "jane@acme.com" }],
  );

  assert.deepEqual(result.headers, ["Email"]);
  assert.deepEqual(result.rows, [{ Email: "jane@acme.com" }]);
  assert.ok(
    result.mappings.some(
      (mapping) => mapping.targetHeader === "Phone number" && mapping.status === "missing",
    ),
  );
});

test("buildCrmExport reports missing identity fields for HubSpot and Apollo", () => {
  const hubspot = buildCrmExport("hubspot", ["phone"], [{ phone: "123" }]);
  const apollo = buildCrmExport("apollo", ["phone"], [{ phone: "123" }]);

  assert.deepEqual(hubspot.missingRequiredFields, [
    "First name, Last name, or Email",
  ]);
  assert.deepEqual(apollo.missingRequiredFields, [
    "Contact Email, LinkedIn URL, Company Name, or Company Website",
  ]);
});

test("buildCrmExportFileName appends the selected CRM format", () => {
  assert.equal(
    buildCrmExportFileName("client-leads.csv", "salesforce"),
    "client-leads-salesforce.csv",
  );
  assert.equal(
    buildCrmExportFileName("client-leads", "hubspot"),
    "client-leads-hubspot.csv",
  );
});

test("buildCrmExport applies custom source mappings and skipped fields", () => {
  const result = buildCrmExport(
    "hubspot",
    ["primary_email", "company_phone"],
    [{ primary_email: "jane@acme.com", company_phone: "+14155550101" }],
    {
      Email: "primary_email",
      "Phone number": "company_phone",
      "First name": "",
    },
  );

  assert.deepEqual(result.headers, ["Email", "Phone number"]);
  assert.equal(result.rows[0]?.Email, "jane@acme.com");
  assert.equal(result.rows[0]?.["Phone number"], "+14155550101");
  assert.equal(
    result.mappings.find((mapping) => mapping.targetHeader === "First name")?.sourceLabel,
    "Not exported",
  );
});
