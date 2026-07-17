import assert from "node:assert/strict";
import test from "node:test";

import {
  createLocalWorkspaceSnapshot,
  isWorkspaceSnapshotExpired,
  MAX_WORKSPACE_SNAPSHOTS,
  parseLocalWorkspaceSnapshots,
  WORKSPACE_HISTORY_RETENTION_DAYS,
} from "../src/lib/local-workspace-history.ts";

const draft = {
  fileName: "leads.csv",
  headers: ["name", "email"],
  rows: [{ name: "Jane Doe", email: "jane@acme.com" }],
  selectedColumn: "email",
  duplicateMode: "email" as const,
  emailFilter: "business_only" as const,
};

test("createLocalWorkspaceSnapshot creates an independent 30-day snapshot", () => {
  const now = new Date("2026-07-18T00:00:00.000Z");
  const snapshot = createLocalWorkspaceSnapshot(draft, {
    id: "workspace-1",
    now,
  });

  assert.equal(snapshot.id, "workspace-1");
  assert.equal(snapshot.createdAt, now.toISOString());
  assert.equal(
    snapshot.expiresAt,
    new Date(
      now.getTime() + WORKSPACE_HISTORY_RETENTION_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString(),
  );

  draft.rows[0]!.email = "changed@example.com";
  assert.equal(snapshot.rows[0]?.email, "jane@acme.com");
  draft.rows[0]!.email = "jane@acme.com";
});

test("isWorkspaceSnapshotExpired treats the expiry boundary as expired", () => {
  const snapshot = createLocalWorkspaceSnapshot(draft, {
    now: new Date("2026-07-01T00:00:00.000Z"),
  });

  assert.equal(
    isWorkspaceSnapshotExpired(snapshot, new Date("2026-07-30T23:59:59.999Z")),
    false,
  );
  assert.equal(
    isWorkspaceSnapshotExpired(snapshot, new Date("2026-07-31T00:00:00.000Z")),
    true,
  );
});

test("parseLocalWorkspaceSnapshots removes expired and malformed records", () => {
  const current = createLocalWorkspaceSnapshot(draft, {
    id: "current",
    now: new Date("2026-07-10T00:00:00.000Z"),
  });
  const expired = createLocalWorkspaceSnapshot(draft, {
    id: "expired",
    now: new Date("2026-05-01T00:00:00.000Z"),
  });
  const result = parseLocalWorkspaceSnapshots(
    [expired, { id: "broken" }, current],
    new Date("2026-07-18T00:00:00.000Z"),
  );

  assert.deepEqual(result.map((snapshot) => snapshot.id), ["current"]);
});

test("parseLocalWorkspaceSnapshots sorts newest first and enforces the cap", () => {
  const values = Array.from({ length: MAX_WORKSPACE_SNAPSHOTS + 3 }, (_, index) =>
    createLocalWorkspaceSnapshot(draft, {
      id: `workspace-${index}`,
      now: new Date(`2026-07-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`),
    }),
  );
  const result = parseLocalWorkspaceSnapshots(
    values,
    new Date("2026-07-18T00:00:00.000Z"),
  );

  assert.equal(result.length, MAX_WORKSPACE_SNAPSHOTS);
  assert.equal(result[0]?.id, `workspace-${MAX_WORKSPACE_SNAPSHOTS + 2}`);
  assert.equal(result.at(-1)?.id, "workspace-3");
});

test("parseLocalWorkspaceSnapshots rejects invalid cleanup modes and row values", () => {
  const snapshot = createLocalWorkspaceSnapshot(draft, { id: "valid" });
  const invalidMode = { ...snapshot, duplicateMode: "unknown" };
  const invalidRows = { ...snapshot, id: "invalid-rows", rows: [{ email: 42 }] };

  assert.deepEqual(parseLocalWorkspaceSnapshots([invalidMode, invalidRows]), []);
});
