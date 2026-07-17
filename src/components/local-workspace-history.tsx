"use client";

import { Clock3, Download, FolderOpen, History, LoaderCircle, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cleanCsvRows } from "@/lib/csv-cleaner";
import { downloadCsvRecords } from "@/lib/export";
import {
  clearLocalWorkspaceSnapshots,
  createLocalWorkspaceSnapshot,
  deleteLocalWorkspaceSnapshot,
  type LocalWorkspaceDraft,
  type LocalWorkspaceSnapshot,
  listLocalWorkspaceSnapshots,
  saveLocalWorkspaceSnapshot,
  WORKSPACE_HISTORY_RETENTION_DAYS,
} from "@/lib/local-workspace-history";
import { trackToolEvent } from "@/lib/telemetry";

type LocalWorkspaceHistoryProps = {
  currentWorkspace: LocalWorkspaceDraft | null;
  onRestore: (snapshot: LocalWorkspaceSnapshot) => void;
};

export function LocalWorkspaceHistory({
  currentWorkspace,
  onRestore,
}: LocalWorkspaceHistoryProps) {
  const [snapshots, setSnapshots] = useState<LocalWorkspaceSnapshot[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void refreshSnapshots(), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  async function refreshSnapshots() {
    try {
      setSnapshots(await listLocalWorkspaceSnapshots());
      setError("");
    } catch {
      setError("Local history is unavailable. Check this browser’s storage settings.");
    } finally {
      setLoading(false);
    }
  }

  async function saveCurrentWorkspace() {
    if (!currentWorkspace || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const snapshot = createLocalWorkspaceSnapshot(currentWorkspace);
      await saveLocalWorkspaceSnapshot(snapshot);
      await refreshSnapshots();
      setExpanded(true);
      setMessage(`Saved “${snapshot.fileName}” to this device.`);
      trackToolEvent("csv-lead-cleaner", "save_local_workspace");
    } catch {
      setError("Could not save this cleanup. Free some browser storage and try again.");
    } finally {
      setBusy(false);
    }
  }

  function restoreSnapshot(snapshot: LocalWorkspaceSnapshot) {
    onRestore(snapshot);
    setExpanded(false);
    setMessage(`Opened “${snapshot.fileName}”.`);
    trackToolEvent("csv-lead-cleaner", "restore_local_workspace");
  }

  function exportSnapshot(snapshot: LocalWorkspaceSnapshot) {
    const cleaned = cleanCsvRows(
      snapshot.rows,
      snapshot.headers,
      snapshot.selectedColumn,
      snapshot.duplicateMode,
      snapshot.emailFilter,
    );
    downloadCsvRecords(buildHistoryExportFileName(snapshot.fileName), cleaned.rows);
    setMessage(`Exported “${snapshot.fileName}”.`);
    trackToolEvent("csv-lead-cleaner", "export_local_workspace");
  }

  async function deleteSnapshot(id: string) {
    setBusy(true);
    try {
      await deleteLocalWorkspaceSnapshot(id);
      await refreshSnapshots();
      setPendingDeleteId("");
      setMessage("Removed the saved cleanup from this device.");
      trackToolEvent("csv-lead-cleaner", "delete_local_workspace");
    } catch {
      setError("Could not delete that saved cleanup. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function clearHistory() {
    setBusy(true);
    try {
      await clearLocalWorkspaceSnapshots();
      setSnapshots([]);
      setConfirmClear(false);
      setMessage("Local cleanup history cleared.");
      trackToolEvent("csv-lead-cleaner", "clear_local_workspace_history");
    } catch {
      setError("Could not clear local history. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="local-history-title" className="mb-3 rounded-2xl border border-[var(--lc-border)] bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]">
            <History className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 id="local-history-title" className="text-sm font-semibold text-[var(--lc-ink)]">Local cleanup history</h2>
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--lc-muted)]">
              Opt-in snapshots stay on this device and expire after {WORKSPACE_HISTORY_RETENTION_DAYS} days.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveCurrentWorkspace}
            disabled={!currentWorkspace || busy}
            className="lc-button-primary min-h-11 px-4 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
            Save snapshot
          </button>
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
            aria-controls="local-history-list"
            className="lc-button-secondary min-h-11 px-4 text-xs font-semibold"
          >
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            History {snapshots.length ? `(${snapshots.length})` : ""}
          </button>
        </div>
      </div>

      <div role="status" aria-live="polite" className="mt-2 min-h-4 text-xs">
        {error ? <span className="text-[var(--lc-danger)]">{error}</span> : message ? <span className="text-[var(--lc-green)]">{message}</span> : null}
      </div>

      {expanded ? (
        <div id="local-history-list" className="mt-2 border-t border-[var(--lc-border)] pt-3">
          {loading ? (
            <div className="flex min-h-20 items-center justify-center gap-2 text-xs text-[var(--lc-muted)]">
              <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Loading local history…
            </div>
          ) : snapshots.length ? (
            <>
              <ul className="space-y-2">
                {snapshots.map((snapshot) => (
                  <li key={snapshot.id} className="rounded-xl border border-[var(--lc-border)] bg-[var(--lc-bg)] p-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--lc-ink)]" title={snapshot.fileName}>{snapshot.fileName}</p>
                        <p className="mt-1 text-[11px] text-[var(--lc-muted)]">
                          {snapshot.rows.length.toLocaleString()} rows · {formatSavedDate(snapshot.createdAt)} · expires {formatSavedDate(snapshot.expiresAt)}
                        </p>
                      </div>
                      {pendingDeleteId === snapshot.id ? (
                        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={`Confirm deletion of ${snapshot.fileName}`}>
                          <span className="text-xs font-medium text-red-900">Delete this snapshot?</span>
                          <button type="button" onClick={() => setPendingDeleteId("")} className="lc-button-secondary min-h-11 px-3 text-xs font-semibold">Cancel</button>
                          <button type="button" onClick={() => void deleteSnapshot(snapshot.id)} disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--lc-danger)] px-3 text-xs font-semibold text-white disabled:opacity-50">
                            <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => restoreSnapshot(snapshot)} className="lc-button-secondary min-h-11 px-3 text-xs font-semibold"><FolderOpen className="h-4 w-4" aria-hidden="true" /> Open</button>
                          <button type="button" onClick={() => exportSnapshot(snapshot)} className="lc-button-secondary min-h-11 px-3 text-xs font-semibold"><Download className="h-4 w-4" aria-hidden="true" /> Export</button>
                          <button type="button" onClick={() => setPendingDeleteId(snapshot.id)} aria-label={`Delete ${snapshot.fileName}`} className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-white text-[var(--lc-muted)] hover:border-red-200 hover:bg-red-50 hover:text-[var(--lc-danger)]"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-end">
                {confirmClear ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-red-900">Delete all saved snapshots?</span>
                    <button type="button" onClick={() => setConfirmClear(false)} className="lc-button-secondary min-h-11 px-3 text-xs font-semibold"><X className="h-4 w-4" aria-hidden="true" /> Cancel</button>
                    <button type="button" onClick={() => void clearHistory()} disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--lc-danger)] px-3 text-xs font-semibold text-white disabled:opacity-50"><Trash2 className="h-4 w-4" aria-hidden="true" /> Clear all</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmClear(true)} className="lc-button-quiet min-h-11 px-3 text-xs font-semibold text-[var(--lc-danger)]">Clear history</button>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--lc-border)] bg-[var(--lc-bg)] p-5 text-center">
              <p className="text-sm font-semibold text-[var(--lc-ink)]">No saved cleanups yet</p>
              <p className="mt-1 text-xs text-[var(--lc-muted)]">Load a CSV and choose Save snapshot when you want to keep it on this device.</p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

function buildHistoryExportFileName(fileName: string): string {
  const base = (fileName || "leadcleanr").replace(/\.csv$/i, "");
  return `${base}-history-clean.csv`;
}

function formatSavedDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}
