"use client";

import {
  Check,
  Clipboard,
  Download,
  FileText,
  FlaskConical,
  Keyboard,
  Lock,
  LockOpen,
  MousePointerClick,
  PencilLine,
  Plus,
  Redo2,
  RefreshCw,
  Trash2,
  Undo2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { copyTextToClipboard } from "@/lib/clipboard";
import { downloadCsvFile, downloadTextFile } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import type { ExtractionStats } from "@/lib/text-tools";

type TextProcessingToolProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconToneClassName: string;
  sampleInput: string;
  placeholder: string;
  trackName: string;
  processInput: (input: string) => { results: string[]; stats: ExtractionStats };
  statLabels: {
    total: string;
    duplicates: string;
    invalid: string;
    ready: string;
  };
  csvHeader?: string;
  copyLabel: string;
  resultTitle: string;
  resultDescription: string;
  emptyMessage: string;
};

type WorkspaceItem = {
  id: string;
  value: string;
  locked: boolean;
  selected: boolean;
  source: string;
};

type PersistedWorkspaceItem = Pick<WorkspaceItem, "value" | "locked" | "source">;

type PersistedState = {
  input: string;
  batchMode: boolean;
  workspace: PersistedWorkspaceItem[];
};

const WORKSPACE_PREVIEW_LIMIT = 8;

export function TextProcessingTool({
  title,
  description,
  icon: Icon,
  iconToneClassName,
  sampleInput,
  placeholder,
  trackName,
  processInput,
  statLabels,
  csvHeader = "value",
  copyLabel,
  resultTitle,
  resultDescription,
  emptyMessage,
}: TextProcessingToolProps) {
  const storageKey = `leadcleanr:text-tool:${trackName}`;
  const [input, setInput] = useState(sampleInput);
  const [copied, setCopied] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceItem[]>(() =>
    createWorkspaceFromValues(processInput(sampleInput).results, "Sample"),
  );
  const [pastWorkspace, setPastWorkspace] = useState<WorkspaceItem[][]>([]);
  const [futureWorkspace, setFutureWorkspace] = useState<WorkspaceItem[][]>([]);
  const [restoredSession, setRestoredSession] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const processed = useMemo(() => processInput(input), [input, processInput]);
  const workspaceValues = workspace.map((item) => item.value);
  const resultText = workspaceValues.join("\n");
  const batchLineCount = useMemo(
    () => input.split("\n").filter((line) => line.trim()).length,
    [input],
  );
  const currentPreview = processed.results.slice(0, 4);
  const selectedCount = workspace.filter((item) => item.selected).length;
  const lockedCount = workspace.filter((item) => item.locked).length;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const restoreTimer = window.setTimeout(() => {
      const rawState = window.localStorage.getItem(storageKey);

      if (rawState) {
        try {
          const parsed = JSON.parse(rawState) as Partial<PersistedState>;
          const nextInput =
            typeof parsed.input === "string" ? parsed.input : sampleInput;
          const nextWorkspace = Array.isArray(parsed.workspace)
            ? createWorkspaceFromPersistedItems(parsed.workspace)
            : createWorkspaceFromValues(
                processInput(nextInput).results,
                "Restored",
              );

          setInput(nextInput);
          setBatchMode(Boolean(parsed.batchMode));
          setWorkspace(nextWorkspace);
          setRestoredSession(true);
        } catch {
          setInput(sampleInput);
          setWorkspace(
            createWorkspaceFromValues(processInput(sampleInput).results, "Sample"),
          );
        }
      }

      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, [processInput, sampleInput, storageKey]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    const payload: PersistedState = {
      input,
      batchMode,
      workspace: workspace.map(({ value, locked, source }) => ({
        value,
        locked,
        source,
      })),
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [batchMode, input, isHydrated, storageKey, workspace]);

  function pushWorkspaceUpdate(nextWorkspace: WorkspaceItem[]) {
    const previous = cloneWorkspace(workspace);
    setPastWorkspace((current) => [...current, previous]);
    setFutureWorkspace([]);
    setWorkspace(nextWorkspace);
  }

  function setFreshInput(nextInput: string) {
    setInput(nextInput);
    setCopied(false);
  }

  function replaceWorkspaceFromCurrentInput() {
    const lockedRows = workspace.filter((item) => item.locked);
    const nextWorkspace = mergeWorkspace(
      lockedRows.length ? cloneWorkspace(lockedRows) : [],
      processed.results,
      "Current extraction",
    );

    pushWorkspaceUpdate(nextWorkspace);
    trackToolEvent(trackName, "replace_workspace", {
      extracted_count: processed.results.length,
      preserved_locked_count: lockedRows.length,
    });
  }

  function appendCurrentExtraction() {
    const nextWorkspace = mergeWorkspace(
      cloneWorkspace(workspace),
      processed.results,
      "Current extraction",
    );

    pushWorkspaceUpdate(nextWorkspace);
    trackToolEvent(trackName, "append_workspace", {
      extracted_count: processed.results.length,
      workspace_count: nextWorkspace.length,
    });
  }

  function loadSampleInput() {
    setFreshInput(sampleInput);
    const sampleWorkspace = createWorkspaceFromValues(
      processInput(sampleInput).results,
      "Sample",
    );
    setWorkspace(sampleWorkspace);
    setPastWorkspace([]);
    setFutureWorkspace([]);
    setShowBulkEditor(false);
    setRestoredSession(false);
    trackToolEvent(trackName, "load_sample_input");
  }

  function useSelectedText() {
    const selection = window.getSelection?.()?.toString().trim() ?? "";

    if (!selection) {
      return;
    }

    setFreshInput(selection);
    trackToolEvent(trackName, "use_selected_text", {
      input_length: selection.length,
    });
  }

  function toggleBatchMode() {
    setBatchMode((current) => !current);
    trackToolEvent(trackName, "toggle_batch_mode", {
      enabled: !batchMode,
    });
  }

  function updateWorkspaceItem(id: string, value: string) {
    const nextWorkspace = workspace.map((item) =>
      item.id === id ? { ...item, value } : item,
    );
    pushWorkspaceUpdate(nextWorkspace);
    trackToolEvent(trackName, "edit_result_item");
  }

  function removeWorkspaceItem(id: string) {
    const nextWorkspace = workspace.filter((item) => item.id !== id);
    pushWorkspaceUpdate(nextWorkspace);
    trackToolEvent(trackName, "remove_result_item");
  }

  function toggleWorkspaceLock(id: string) {
    const nextWorkspace = workspace.map((item) =>
      item.id === id ? { ...item, locked: !item.locked } : item,
    );
    pushWorkspaceUpdate(nextWorkspace);
    trackToolEvent(trackName, "toggle_result_lock");
  }

  function toggleWorkspaceSelection(id: string) {
    const nextWorkspace = workspace.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item,
    );
    setWorkspace(nextWorkspace);
  }

  function toggleSelectAllPreviewed() {
    const previewIds = new Set(
      workspace.slice(0, WORKSPACE_PREVIEW_LIMIT).map((item) => item.id),
    );
    const shouldSelect = workspace
      .slice(0, WORKSPACE_PREVIEW_LIMIT)
      .some((item) => !item.selected);

    setWorkspace((current) =>
      current.map((item) =>
        previewIds.has(item.id) ? { ...item, selected: shouldSelect } : item,
      ),
    );
  }

  function deleteSelectedRows() {
    if (!selectedCount) {
      return;
    }

    const nextWorkspace = workspace.filter((item) => !item.selected);
    pushWorkspaceUpdate(nextWorkspace);
    trackToolEvent(trackName, "delete_selected_results", {
      selected_count: selectedCount,
    });
  }

  function applyBulkEditor(value: string) {
    const nextWorkspace = createWorkspaceFromValues(
      value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      "Manual edit",
    );

    pushWorkspaceUpdate(nextWorkspace);
    trackToolEvent(trackName, "bulk_edit_results", {
      result_count: nextWorkspace.length,
    });
  }

  function undoWorkspace() {
    if (!pastWorkspace.length) {
      return;
    }

    const previous = pastWorkspace.at(-1);
    if (!previous) {
      return;
    }

    setPastWorkspace((current) => current.slice(0, -1));
    setFutureWorkspace((current) => [cloneWorkspace(workspace), ...current]);
    setWorkspace(cloneWorkspace(previous));
    trackToolEvent(trackName, "undo_result_edit");
  }

  function redoWorkspace() {
    const next = futureWorkspace[0];
    if (!next) {
      return;
    }

    setPastWorkspace((current) => [...current, cloneWorkspace(workspace)]);
    setFutureWorkspace((current) => current.slice(1));
    setWorkspace(cloneWorkspace(next));
    trackToolEvent(trackName, "redo_result_edit");
  }

  async function handleCopy() {
    if (!workspaceValues.length) {
      return;
    }

    const didCopy = await copyTextToClipboard(resultText);

    if (!didCopy) {
      return;
    }

    trackToolEvent(trackName, "copy_results", {
      result_count: workspaceValues.length,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function handleDownloadTxt() {
    if (!workspaceValues.length) {
      return;
    }

    trackToolEvent(trackName, "download_txt", {
      result_count: workspaceValues.length,
    });
    downloadTextFile(`leadcleanr-${trackName}.txt`, resultText);
  }

  function handleDownloadCsv() {
    if (!workspaceValues.length) {
      return;
    }

    trackToolEvent(trackName, "download_csv", {
      result_count: workspaceValues.length,
    });
    downloadCsvFile(`leadcleanr-${trackName}.csv`, workspaceValues, csvHeader);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const activeElement = document.activeElement;
      const isTypingTarget =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement;

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isTypingTarget && event.key !== "?") {
        return;
      }

      const normalizedKey = event.key.toLowerCase();

      switch (normalizedKey) {
        case "?":
          event.preventDefault();
          setShowShortcuts((current) => !current);
          return;
        case "c":
          event.preventDefault();
          if (workspaceValues.length) {
            void handleCopy();
          }
          return;
        case "d":
          event.preventDefault();
          handleDownloadCsv();
          return;
        case "t":
          event.preventDefault();
          handleDownloadTxt();
          return;
        case "s":
          event.preventDefault();
          loadSampleInput();
          return;
        case "b":
          event.preventDefault();
          toggleBatchMode();
          return;
        case "e":
          event.preventDefault();
          setShowBulkEditor((current) => !current);
          return;
        case "a":
          event.preventDefault();
          appendCurrentExtraction();
          return;
        case "r":
          event.preventDefault();
          replaceWorkspaceFromCurrentInput();
          return;
        case "z":
          event.preventDefault();
          undoWorkspace();
          return;
        case "y":
          event.preventDefault();
          redoWorkspace();
          return;
        default:
          return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <section className="rounded-[2.2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(246,249,252,0.92))] shadow-[var(--shadow)]">
      <div className="grid items-start gap-0 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="flex h-full flex-col p-5 sm:p-7">
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconToneClassName}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">{title}</h2>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={loadSampleInput}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-5 text-sm font-semibold"
            >
              <FlaskConical className="h-4 w-4" />
              Load sample
            </button>
            <button
              type="button"
              onClick={useSelectedText}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-5 text-sm font-semibold"
            >
              <MousePointerClick className="h-4 w-4" />
              Use selected text
            </button>
            <button
              type="button"
              onClick={toggleBatchMode}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-5 text-sm font-semibold"
            >
              <span className="text-base leading-none">#</span>
              {batchMode ? "Single input mode" : "Batch mode"}
            </button>
            <button
              type="button"
              onClick={() => setShowShortcuts((current) => !current)}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-5 text-sm font-semibold"
            >
              <Keyboard className="h-4 w-4" />
              Shortcuts
            </button>
          </div>

          {restoredSession ? (
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              Restored your last workspace on this device so you can keep cleaning
              without starting over.
            </p>
          ) : null}

          {batchMode ? (
            <div className="mt-4 rounded-[1.35rem] border border-[color:rgba(15,118,110,0.14)] bg-[color:rgba(15,118,110,0.08)] px-4 py-4 text-sm">
              <p className="font-semibold text-[color:var(--foreground)]">
                One snippet per line
              </p>
              <p className="mt-1 leading-6 text-[color:var(--muted)]">
                {batchLineCount} non-empty line{batchLineCount === 1 ? "" : "s"}{" "}
                detected. Useful when you are pasting many repeated snippets from
                LinkedIn, email signatures, or Slack.
              </p>
            </div>
          ) : null}

          <textarea
            id={`${trackName}-input`}
            value={input}
            onChange={(event) => setFreshInput(event.target.value)}
            className="mt-4 min-h-[18rem] w-full rounded-[1.6rem] border border-[color:var(--line)] bg-white px-4 py-4 text-base text-[color:var(--foreground)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:rgba(184,106,25,0.12)] sm:min-h-[22rem]"
            placeholder={placeholder}
          />

          <p className="mt-3 text-xs leading-6 text-[color:var(--muted)]">
            Processed in your browser. Nothing sent to a server.
          </p>

          <div className="mt-4 rounded-[1.4rem] border border-[color:rgba(16,37,52,0.1)] bg-[color:rgba(244,247,250,0.9)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:#38586b]">
                  Current extraction preview
                </p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--foreground)]">
                  {processed.results.length} match
                  {processed.results.length === 1 ? "" : "es"} will be added from
                  this input.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={replaceWorkspaceFromCurrentInput}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 text-sm font-semibold"
                >
                  <RefreshCw className="h-4 w-4" />
                  Replace workspace
                </button>
                <button
                  type="button"
                  onClick={appendCurrentExtraction}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 text-sm font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  Append to workspace
                </button>
              </div>
            </div>
            {currentPreview.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {currentPreview.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full border border-[color:rgba(16,37,52,0.1)] bg-white px-3 py-2 text-sm text-[color:var(--foreground)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                Nothing valid is being matched yet. Paste a noisy block of text and
                this panel will show exactly what the tool sees before you export.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-[color:var(--line)] lg:border-l lg:border-t-0">
          <div className="space-y-5 p-5 sm:p-7">
            <div className="rounded-[1.7rem] border border-[color:rgba(16,37,52,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,248,238,0.92))] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-strong)]">
                Workspace stats
              </p>
              <div className="mt-5 rounded-[1.7rem] border border-[color:rgba(15,118,110,0.14)] bg-[linear-gradient(180deg,rgba(15,118,110,0.1),rgba(255,255,255,0.96))] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  {statLabels.ready}
                </p>
                <p className="mt-3 font-display text-6xl font-semibold leading-none tabular-nums text-[color:var(--foreground)] sm:text-7xl">
                  {workspaceValues.length.toLocaleString()}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label={statLabels.total} value={processed.stats.totalFound} />
                <StatCard
                  label={statLabels.duplicates}
                  value={processed.stats.duplicatesRemoved}
                />
                <StatCard
                  label={statLabels.invalid}
                  value={processed.stats.invalidRemoved}
                />
                <StatCard label="Locked rows" value={lockedCount} />
                <StatCard label="Selected rows" value={selectedCount} />
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold">{resultTitle}</h3>
                  <p className="text-sm leading-6 text-[color:var(--muted)]">
                    {resultDescription}
                  </p>
                </div>
                <span className="rounded-full bg-[color:rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                  Live workspace
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowBulkEditor((current) => !current)}
                  disabled={!workspaceValues.length}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PencilLine className="h-4 w-4" />
                  {showBulkEditor ? "Close editor" : "Edit all"}
                </button>
                <button
                  type="button"
                  onClick={toggleSelectAllPreviewed}
                  disabled={!workspaceValues.length}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Select preview rows
                </button>
                <button
                  type="button"
                  onClick={deleteSelectedRows}
                  disabled={!selectedCount}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[color:rgba(153,27,27,0.14)] bg-[color:rgba(254,242,242,0.92)] px-4 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete selected
                </button>
                <button
                  type="button"
                  onClick={undoWorkspace}
                  disabled={!pastWorkspace.length}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Undo2 className="h-4 w-4" />
                  Undo
                </button>
                <button
                  type="button"
                  onClick={redoWorkspace}
                  disabled={!futureWorkspace.length}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Redo2 className="h-4 w-4" />
                  Redo
                </button>
              </div>

              <div className="mt-4 min-h-[22rem] rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-white/80 p-4">
                {workspaceValues.length ? (
                  showBulkEditor ? (
                    <textarea
                      value={resultText}
                      onChange={(event) => applyBulkEditor(event.target.value)}
                      className="min-h-[20rem] w-full rounded-[1rem] border border-[color:var(--line)] bg-white px-4 py-4 text-sm leading-7 text-[color:var(--foreground)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:rgba(184,106,25,0.12)]"
                    />
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                        Previewing the first {Math.min(WORKSPACE_PREVIEW_LIMIT, workspace.length)} of{" "}
                        {workspace.length}
                      </p>
                      {workspace.slice(0, WORKSPACE_PREVIEW_LIMIT).map((item, index) => (
                        <div
                          key={item.id}
                          className={`rounded-[1rem] border px-3 py-3 ${
                            item.selected
                              ? "border-[color:rgba(15,118,110,0.2)] bg-[color:rgba(240,253,250,0.9)]"
                              : "border-[color:var(--line)] bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => toggleWorkspaceSelection(item.id)}
                              className="mt-1 h-5 w-5 rounded border border-[color:var(--line)] bg-white text-xs font-semibold text-[color:var(--muted)]"
                              aria-label={`Select row ${index + 1}`}
                            >
                              {item.selected ? "x" : ""}
                            </button>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                                  Row {index + 1}
                                </span>
                                <span className="rounded-full border border-[color:rgba(16,37,52,0.08)] bg-[color:rgba(244,247,250,0.92)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:#38586b]">
                                  {item.source}
                                </span>
                                {item.locked ? (
                                  <span className="rounded-full bg-[color:rgba(15,118,110,0.12)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">
                                    Locked
                                  </span>
                                ) : null}
                              </div>
                              <input
                                value={item.value}
                                onChange={(event) =>
                                  updateWorkspaceItem(item.id, event.target.value)
                                }
                                className="mt-3 min-h-10 w-full rounded-lg border border-[color:var(--line)] bg-transparent px-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--brand)]"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleWorkspaceLock(item.id)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-[color:var(--muted)]"
                                aria-label={item.locked ? "Unlock row" : "Lock row"}
                              >
                                {item.locked ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  <LockOpen className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeWorkspaceItem(item.id)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-[color:var(--muted)]"
                                aria-label={`Remove row ${index + 1}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <p className="text-sm leading-7 text-[color:var(--muted)]">
                    {emptyMessage}
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  disabled={!workspaceValues.length}
                  className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:#153246] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  {copied ? "Copied" : copyLabel}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  disabled={!workspaceValues.length}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileText className="h-4 w-4" />
                  Download TXT
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  disabled={!workspaceValues.length}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </div>

              {showShortcuts ? (
                <div className="mt-4 rounded-[1.35rem] border border-[color:rgba(15,118,110,0.16)] bg-[color:rgba(15,118,110,0.08)] p-4 text-sm">
                  <p className="font-semibold text-[color:var(--foreground)]">
                    Keyboard shortcuts
                  </p>
                  <div className="mt-3 grid gap-2 text-[color:var(--muted)] sm:grid-cols-2">
                    <p>`?` toggle shortcuts</p>
                    <p>`s` load sample</p>
                    <p>`b` toggle batch mode</p>
                    <p>`a` append extraction</p>
                    <p>`r` replace workspace</p>
                    <p>`e` edit all rows</p>
                    <p>`c` copy workspace</p>
                    <p>`t` download TXT</p>
                    <p>`d` download CSV</p>
                    <p>`z` undo</p>
                    <p>`y` redo</p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  Press `?` for keyboard shortcuts
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border p-4 ${
        accent
          ? "border-[color:rgba(15,118,110,0.16)] bg-[color:rgba(15,118,110,0.08)]"
          : "border-[color:var(--line)] bg-white/75"
      }`}
    >
      <div className="text-sm text-[color:var(--muted)]">{label}</div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function createWorkspaceFromValues(values: string[], source: string): WorkspaceItem[] {
  return values.map((value) => createWorkspaceItem(value, source));
}

function createWorkspaceFromPersistedItems(
  items: PersistedWorkspaceItem[],
): WorkspaceItem[] {
  return items
    .map((item) => ({
      value: normalizeWorkspaceValue(item.value),
      locked: Boolean(item.locked),
      source: item.source || "Restored",
    }))
    .filter((item) => item.value)
    .map((item) => createWorkspaceItem(item.value, item.source, item.locked));
}

function cloneWorkspace(workspace: WorkspaceItem[]) {
  return workspace.map((item) => ({ ...item }));
}

function mergeWorkspace(
  existingWorkspace: WorkspaceItem[],
  incomingValues: string[],
  source: string,
) {
  const seen = new Set(
    existingWorkspace.map((item) => normalizeWorkspaceValue(item.value).toLowerCase()),
  );
  const nextWorkspace = cloneWorkspace(existingWorkspace);

  incomingValues.forEach((value) => {
    const normalized = normalizeWorkspaceValue(value);

    if (!normalized) {
      return;
    }

    const fingerprint = normalized.toLowerCase();

    if (seen.has(fingerprint)) {
      return;
    }

    seen.add(fingerprint);
    nextWorkspace.push(createWorkspaceItem(normalized, source));
  });

  return nextWorkspace;
}

function createWorkspaceItem(
  value: string,
  source: string,
  locked = false,
): WorkspaceItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    value: normalizeWorkspaceValue(value),
    locked,
    selected: false,
    source,
  };
}

function normalizeWorkspaceValue(value: string) {
  return value.trim();
}
