import assert from "node:assert/strict";
import test from "node:test";

import {
  ApiPayloadError,
  readLimitedJson,
  sanitizeTelemetryMetadata,
} from "../src/lib/api-security.ts";
import { readLocalStorage, writeLocalStorage } from "../src/lib/browser-storage.ts";
import {
  FREE_CSV_LIMIT_BYTES,
  FREE_CSV_LIMIT_MB,
} from "../src/lib/product-config.ts";
import { TOOL_COUNT, TOOL_REGISTRY } from "../src/lib/tool-registry.ts";

test("tool registry has unique paths and includes every supported tool", () => {
  const paths = TOOL_REGISTRY.map((tool) => tool.path);
  assert.equal(new Set(paths).size, paths.length);
  assert.equal(TOOL_COUNT, 21);
  assert.ok(paths.includes("/tools/count-words-characters-text"));
  assert.ok(paths.includes("/tools/hubspot-csv-import-cleaner"));
});

test("free CSV limit has one canonical byte value", () => {
  assert.equal(FREE_CSV_LIMIT_MB, 5);
  assert.equal(FREE_CSV_LIMIT_BYTES, 5 * 1024 * 1024);
});

test("safe local storage helpers degrade gracefully outside a browser", () => {
  assert.equal(readLocalStorage("missing"), null);
  assert.equal(writeLocalStorage("key", "value"), false);
});

test("limited JSON reader rejects oversized bodies", async () => {
  const request = new Request("http://localhost/test", {
    method: "POST",
    body: JSON.stringify({ value: "x".repeat(100) }),
  });

  await assert.rejects(
    () => readLimitedJson(request, 20),
    (error) => error instanceof ApiPayloadError && error.status === 413,
  );
});

test("telemetry metadata keeps only bounded scalar values", () => {
  const sanitized = sanitizeTelemetryMetadata({
    "valid.key": "x".repeat(300),
    count: 4,
    active: true,
    nested: { secret: "no" },
    "bad key!": "kept under a safe key",
  });

  assert.equal(sanitized["valid.key"], "x".repeat(200));
  assert.equal(sanitized.count, 4);
  assert.equal(sanitized.active, true);
  assert.equal("nested" in sanitized, false);
  assert.equal(sanitized.badkey, "kept under a safe key");
});
