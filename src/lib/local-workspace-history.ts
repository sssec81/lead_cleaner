import type { CsvRow } from "./csv.ts";
import type { DuplicateMode, EmailFilterMode } from "./csv-cleaner.ts";

export const WORKSPACE_HISTORY_RETENTION_DAYS = 30;
export const MAX_WORKSPACE_SNAPSHOTS = 10;

const DATABASE_NAME = "leadcleanr-local-workspaces";
const DATABASE_VERSION = 1;
const STORE_NAME = "snapshots";
const RETENTION_MS = WORKSPACE_HISTORY_RETENTION_DAYS * 24 * 60 * 60 * 1000;
const DUPLICATE_MODES = new Set<DuplicateMode>([
  "selected",
  "email",
  "phone",
  "domain",
  "entire_row",
]);
const EMAIL_FILTERS = new Set<EmailFilterMode>([
  "all",
  "business_only",
  "personal_only",
]);

export type LocalWorkspaceSnapshot = {
  id: string;
  fileName: string;
  headers: string[];
  rows: CsvRow[];
  selectedColumn: string;
  duplicateMode: DuplicateMode;
  emailFilter: EmailFilterMode;
  createdAt: string;
  expiresAt: string;
};

export type LocalWorkspaceDraft = Omit<
  LocalWorkspaceSnapshot,
  "id" | "createdAt" | "expiresAt"
>;

export function createLocalWorkspaceSnapshot(
  draft: LocalWorkspaceDraft,
  options: { id?: string; now?: Date } = {},
): LocalWorkspaceSnapshot {
  const now = options.now ?? new Date();
  return {
    ...draft,
    headers: [...draft.headers],
    rows: draft.rows.map((row) => ({ ...row })),
    id: options.id ?? createSnapshotId(),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + RETENTION_MS).toISOString(),
  };
}

export function parseLocalWorkspaceSnapshots(
  values: unknown[],
  now = new Date(),
): LocalWorkspaceSnapshot[] {
  return values
    .filter(isLocalWorkspaceSnapshot)
    .filter((snapshot) => !isWorkspaceSnapshotExpired(snapshot, now))
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )
    .slice(0, MAX_WORKSPACE_SNAPSHOTS)
    .map((snapshot) => ({
      ...snapshot,
      headers: [...snapshot.headers],
      rows: snapshot.rows.map((row) => ({ ...row })),
    }));
}

export function isWorkspaceSnapshotExpired(
  snapshot: Pick<LocalWorkspaceSnapshot, "expiresAt">,
  now = new Date(),
): boolean {
  const expiresAt = new Date(snapshot.expiresAt).getTime();
  return !Number.isFinite(expiresAt) || expiresAt <= now.getTime();
}

export async function listLocalWorkspaceSnapshots(): Promise<LocalWorkspaceSnapshot[]> {
  const database = await openHistoryDatabase();
  const values = await runRequest<unknown[]>(
    database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll(),
  );
  const snapshots = parseLocalWorkspaceSnapshots(values);
  const retainedIds = new Set(snapshots.map((snapshot) => snapshot.id));
  const staleIds = values
    .filter(isLocalWorkspaceSnapshot)
    .map((snapshot) => snapshot.id)
    .filter((id) => !retainedIds.has(id));

  if (staleIds.length) {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    staleIds.forEach((id) => transaction.objectStore(STORE_NAME).delete(id));
    await waitForTransaction(transaction);
  }

  database.close();
  return snapshots;
}

export async function saveLocalWorkspaceSnapshot(
  snapshot: LocalWorkspaceSnapshot,
): Promise<void> {
  const database = await openHistoryDatabase();
  const transaction = database.transaction(STORE_NAME, "readwrite");
  transaction.objectStore(STORE_NAME).put(snapshot);
  await waitForTransaction(transaction);
  database.close();

  await listLocalWorkspaceSnapshots();
}

export async function deleteLocalWorkspaceSnapshot(id: string): Promise<void> {
  const database = await openHistoryDatabase();
  const transaction = database.transaction(STORE_NAME, "readwrite");
  transaction.objectStore(STORE_NAME).delete(id);
  await waitForTransaction(transaction);
  database.close();
}

export async function clearLocalWorkspaceSnapshots(): Promise<void> {
  const database = await openHistoryDatabase();
  const transaction = database.transaction(STORE_NAME, "readwrite");
  transaction.objectStore(STORE_NAME).clear();
  await waitForTransaction(transaction);
  database.close();
}

function isLocalWorkspaceSnapshot(value: unknown): value is LocalWorkspaceSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<LocalWorkspaceSnapshot>;
  return Boolean(
    typeof snapshot.id === "string" &&
      snapshot.id &&
      typeof snapshot.fileName === "string" &&
      Array.isArray(snapshot.headers) &&
      snapshot.headers.every((header) => typeof header === "string") &&
      Array.isArray(snapshot.rows) &&
      snapshot.rows.every(isCsvRow) &&
      typeof snapshot.selectedColumn === "string" &&
      DUPLICATE_MODES.has(snapshot.duplicateMode as DuplicateMode) &&
      EMAIL_FILTERS.has(snapshot.emailFilter as EmailFilterMode) &&
      typeof snapshot.createdAt === "string" &&
      Number.isFinite(new Date(snapshot.createdAt).getTime()) &&
      typeof snapshot.expiresAt === "string" &&
      Number.isFinite(new Date(snapshot.expiresAt).getTime()),
  );
}

function isCsvRow(value: unknown): value is CsvRow {
  return Boolean(
    value &&
      typeof value === "object" &&
      Object.values(value).every((cell) => typeof cell === "string"),
  );
}

function openHistoryDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("Local workspace history is unavailable."));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open local history."));
  });
}

function runRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Local history request failed."));
  });
}

function waitForTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Local history update failed."));
    transaction.onabort = () => reject(transaction.error ?? new Error("Local history update was cancelled."));
  });
}

function createSnapshotId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `workspace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
