import assert from "node:assert/strict";
import test from "node:test";

import {
  addCleanupPreset,
  createCleanupPreset,
  deleteCleanupPreset,
  MAX_CLEANUP_PRESETS,
  normalizePresetName,
  parseCleanupPresets,
  renameCleanupPreset,
} from "../src/lib/cleanup-presets.ts";

const rules = {
  selectedColumn: "email",
  duplicateMode: "email" as const,
  emailFilter: "business_only" as const,
  crmFormat: "hubspot" as const,
  crmFieldOverrides: { Email: "work_email" },
};

test("createCleanupPreset normalizes its name and preserves cleanup rules", () => {
  const preset = createCleanupPreset("  Business   leads  ", rules, {
    id: "preset-1",
    now: "2026-07-18T00:00:00.000Z",
  });

  assert.equal(preset.name, "Business leads");
  assert.deepEqual(preset.rules, rules);
  assert.equal(preset.id, "preset-1");
  assert.equal(preset.createdAt, preset.updatedAt);
});

test("createCleanupPreset rejects an empty normalized name", () => {
  assert.throws(() => createCleanupPreset("   ", rules), /Enter a name/);
});

test("parseCleanupPresets safely handles corrupt and incompatible storage", () => {
  assert.deepEqual(parseCleanupPresets("not-json"), []);
  assert.deepEqual(parseCleanupPresets(JSON.stringify({ presets: [] })), []);
  assert.deepEqual(
    parseCleanupPresets(
      JSON.stringify([
        {
          id: "bad-mode",
          name: "Invalid",
          rules: { ...rules, duplicateMode: "unknown" },
          createdAt: "2026-07-18T00:00:00.000Z",
          updatedAt: "2026-07-18T00:00:00.000Z",
        },
      ]),
    ),
    [],
  );
});

test("parseCleanupPresets keeps valid presets and removes invalid entries", () => {
  const preset = createCleanupPreset("Email cleanup", rules, {
    id: "preset-1",
    now: "2026-07-18T00:00:00.000Z",
  });
  const parsed = parseCleanupPresets(
    JSON.stringify([preset, { id: "incomplete" }]),
  );

  assert.deepEqual(parsed, [preset]);
});

test("parseCleanupPresets upgrades legacy presets with CRM defaults", () => {
  const legacy = {
    id: "legacy",
    name: "Legacy cleanup",
    rules: {
      selectedColumn: "email",
      duplicateMode: "email",
      emailFilter: "all",
    },
    createdAt: "2026-07-18T00:00:00.000Z",
    updatedAt: "2026-07-18T00:00:00.000Z",
  };

  const [parsed] = parseCleanupPresets(JSON.stringify([legacy]));
  assert.equal(parsed?.rules.crmFormat, "clean_csv");
  assert.deepEqual(parsed?.rules.crmFieldOverrides, {});
});

test("addCleanupPreset puts the newest preset first and enforces the limit", () => {
  const existing = Array.from({ length: MAX_CLEANUP_PRESETS }, (_, index) =>
    createCleanupPreset(`Preset ${index}`, rules, {
      id: `preset-${index}`,
      now: "2026-07-18T00:00:00.000Z",
    }),
  );
  const newest = createCleanupPreset("Newest", rules, {
    id: "newest",
    now: "2026-07-18T01:00:00.000Z",
  });
  const result = addCleanupPreset(existing, newest);

  assert.equal(result.length, MAX_CLEANUP_PRESETS);
  assert.equal(result[0]?.id, "newest");
  assert.equal(result.at(-1)?.id, `preset-${MAX_CLEANUP_PRESETS - 2}`);
});

test("renameCleanupPreset updates only the selected preset", () => {
  const first = createCleanupPreset("First", rules, {
    id: "first",
    now: "2026-07-18T00:00:00.000Z",
  });
  const second = createCleanupPreset("Second", rules, {
    id: "second",
    now: "2026-07-18T00:00:00.000Z",
  });
  const result = renameCleanupPreset(
    [first, second],
    "second",
    "  Renamed   preset ",
    "2026-07-18T01:00:00.000Z",
  );

  assert.equal(result[0]?.name, "First");
  assert.equal(result[1]?.name, "Renamed preset");
  assert.equal(result[1]?.updatedAt, "2026-07-18T01:00:00.000Z");
});

test("deleteCleanupPreset removes only the matching preset", () => {
  const first = createCleanupPreset("First", rules, { id: "first" });
  const second = createCleanupPreset("Second", rules, { id: "second" });

  assert.deepEqual(deleteCleanupPreset([first, second], "first"), [second]);
});

test("normalizePresetName caps long names", () => {
  assert.equal(normalizePresetName("a".repeat(100)).length, 60);
});
