import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { POST } from "../src/app/api/waitlist/route.ts";

function createWaitlistRequest(
  payload: Record<string, unknown>,
  ip = "127.0.0.1",
) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-real-ip": ip,
    },
    body: JSON.stringify(payload),
  });
}

test("waitlist stores a qualified Pro signup locally", async () => {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "leadcleanr-waitlist-"));
  const waitlistPath = path.join(tempDirectory, "waitlist.csv");
  const previousPath = process.env.WAITLIST_FILE_PATH;
  process.env.WAITLIST_FILE_PATH = waitlistPath;

  try {
    const response = await POST(createWaitlistRequest({
      email: "  OWNER@ACME.COM ",
      role: "agency",
      fileSize: "5_25mb",
      crm: "hubspot",
      frequency: "weekly",
      intendedUse: "Weekly, recurring client exports",
      source: "pricing_pro_waitlist",
      companyWebsite: "",
    }));

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });

    const stored = fs.readFileSync(waitlistPath, "utf8");
    assert.match(stored, /^receivedAt,email,role,fileSize,crm,frequency,intendedUse,source/m);
    assert.match(stored, /"owner@acme\.com","agency","5_25mb","hubspot","weekly","Weekly, recurring client exports","pricing_pro_waitlist"/);
  } finally {
    if (previousPath === undefined) {
      delete process.env.WAITLIST_FILE_PATH;
    } else {
      process.env.WAITLIST_FILE_PATH = previousPath;
    }
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
});

test("waitlist rejects missing qualification fields", async () => {
  const response = await POST(createWaitlistRequest({
    email: "owner@acme.com",
    role: "",
    fileSize: "5_25mb",
    crm: "hubspot",
    frequency: "weekly",
  }, "127.0.0.2"));

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "Please select your role",
  });
});

test("waitlist silently accepts honeypot submissions without storing them", async () => {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "leadcleanr-waitlist-bot-"));
  const waitlistPath = path.join(tempDirectory, "waitlist.csv");
  const previousPath = process.env.WAITLIST_FILE_PATH;
  process.env.WAITLIST_FILE_PATH = waitlistPath;

  try {
    const response = await POST(createWaitlistRequest({
      email: "bot@example.com",
      companyWebsite: "https://spam.example",
    }, "127.0.0.3"));

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(fs.existsSync(waitlistPath), false);
  } finally {
    if (previousPath === undefined) {
      delete process.env.WAITLIST_FILE_PATH;
    } else {
      process.env.WAITLIST_FILE_PATH = previousPath;
    }
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
});
