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
 Redo2,
 RefreshCw,
 Trash2,
 Undo2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { copyTextToClipboard } from "@/lib/clipboard";
import { downloadCsvFile, downloadTextFile } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import type { CleaningStats } from "@/lib/text-tools";
import { TextWorkspaceShell } from "./text-workspace-shell";
import type { ReactNode } from "react";

type TextProcessingToolProps = {
 title: string;
 description: string;
 icon: LucideIcon;
 iconToneClassName: string;
 sampleInput: string;
 placeholder: string;
 trackName: string;
 processInput: (input: string) => { results: string[]; stats: CleaningStats; invalidResults?: string[] };
 statLabels: {
 scanned: string;
 found: string;
 duplicatesRemoved: string;
 invalidRemoved: string;
 blankRemoved?: string;
 finalCount: string;
 };
 csvHeader?: string;
 copyLabel: string;
 primaryActionLabel: string;
 resultTitle: React.ReactNode | ((count: number) => React.ReactNode);
 resultDescription?: React.ReactNode | ((count: number) => React.ReactNode);
 emptyMessage: string;
 inputMinHeightClassName?: string;
 inputLabel?: string;
 inputHelpText?: string;
 collapseWorkspaceActions?: boolean;
 inputControls?: ReactNode;
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
const TEXT_INPUT_BOX_CLASS_NAME =
  "rounded-2xl border border-[var(--lc-border)] bg-white overflow-hidden flex flex-col relative group";
const TEXT_INPUT_ACTION_CLASS_NAME =
  "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[var(--lc-muted)] hover:bg-black/[0.03] hover:text-[var(--lc-ink)] transition-colors";

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
 primaryActionLabel,
 resultTitle,
 resultDescription,
 emptyMessage,
 inputMinHeightClassName = "min-h-[14rem] sm:min-h-[16rem]",
 inputLabel = "Input text",
 inputHelpText = "Paste messy notes, copied pages, logs, or lead snippets.",
 collapseWorkspaceActions = false,
 inputControls,
}: TextProcessingToolProps) {
 const searchParams = useSearchParams();
 const shouldLoadSampleFromQuery = searchParams.get("sample") === "1";
 const storageKey = `leadcleanr:text-tool:${trackName}`;
 const [input, setInput] = useState("");
 const [copied, setCopied] = useState(false);
 const [batchMode, setBatchMode] = useState(false);
 const [showBulkEditor, setShowBulkEditor] = useState(false);
 const [showShortcuts, setShowShortcuts] = useState(false);
 const [showWorkspaceActions, setShowWorkspaceActions] = useState(!collapseWorkspaceActions);
 const [resultDensity, setResultDensity] = useState<"comfortable" | "compact">(
 "comfortable",
 );
 const [workspace, setWorkspace] = useState<WorkspaceItem[]>([]);
 const [pastWorkspace, setPastWorkspace] = useState<WorkspaceItem[][]>([]);
 const [futureWorkspace, setFutureWorkspace] = useState<WorkspaceItem[][]>([]);
 const [restoredSession, setRestoredSession] = useState(false);
 const [isHydrated, setIsHydrated] = useState(false);
 const [hasAppliedQuerySample, setHasAppliedQuerySample] = useState(false);

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
 const currentStep: 0 | 1 | 2 =
 input.trim().length === 0 ? 0 : workspaceValues.length === 0 ? 1 : 2;

 useEffect(() => {
 if (typeof window === "undefined") {
 return;
 }

 const restoreTimer = window.setTimeout(() => {
 const rawState = window.localStorage.getItem(storageKey);

 if (shouldLoadSampleFromQuery) {
 setInput(sampleInput);
 setWorkspace(
 createWorkspaceFromValues(processInput(sampleInput).results, "Sample"),
 );
 } else if (rawState) {
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
 setRestoredSession(nextInput.trim().length > 0 && nextInput !== sampleInput);
 } catch {
 setInput(sampleInput);
 setWorkspace(
 createWorkspaceFromValues(processInput(sampleInput).results, "Sample"),
 );
 }
 } else {
 setInput(sampleInput);
 setWorkspace(
 createWorkspaceFromValues(processInput(sampleInput).results, "Sample"),
 );
 }

 setIsHydrated(true);
 }, 0);

 return () => window.clearTimeout(restoreTimer);
 }, [processInput, sampleInput, shouldLoadSampleFromQuery, storageKey]);



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
 setPastWorkspace((current) => [...current, previous].slice(-30));
 setFutureWorkspace([]);
 setWorkspace(nextWorkspace);
 }

 function setFreshInput(nextInput: string) {
 if (nextInput.length > 50000) {
 nextInput = nextInput.slice(0, 50000);
 }
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

  const loadSampleInput = useCallback(() => {
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
  }, [sampleInput, processInput, trackName]);

  useEffect(() => {
    if (!isHydrated || !shouldLoadSampleFromQuery || hasAppliedQuerySample) {
      return;
    }

    setTimeout(() => {
      loadSampleInput();
      setHasAppliedQuerySample(true);
    }, 0);
  }, [hasAppliedQuerySample, isHydrated, shouldLoadSampleFromQuery, loadSampleInput]);

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

 async function handlePasteFromClipboard() {
 try {
 const text = await navigator.clipboard.readText();
 if (text) {
 setFreshInput(text);
 trackToolEvent(trackName, "paste_from_clipboard", {
 input_length: text.length,
 });
 }
 } catch (err) {
 console.warn("Failed to read clipboard:", err);
 }
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
 setFutureWorkspace((current) => [cloneWorkspace(workspace), ...current].slice(0, 30));
 setWorkspace(cloneWorkspace(previous));
 trackToolEvent(trackName, "undo_result_edit");
 }

 function redoWorkspace() {
 const next = futureWorkspace[0];
 if (!next) {
 return;
 }

 setPastWorkspace((current) => [...current, cloneWorkspace(workspace)].slice(-30));
 setFutureWorkspace((current) => current.slice(1));
 setWorkspace(cloneWorkspace(next));
 trackToolEvent(trackName, "redo_result_edit");
 }

  async function handleCopy() {
    try {
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
    } catch (err) {
      console.warn("Failed to copy:", err);
    }
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

 // We intentionally omit the dependency array so this effect re-runs on every render.
 // This ensures the keyboard handlers always have access to the freshest state closures
 // (like workspaceValues) without needing to wrap 15+ functions in useCallback.
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
    <>
      <TextWorkspaceShell
        title={title}
        description={description}
        icon={Icon}
        iconToneClassName={iconToneClassName}
        currentStep={currentStep}
        showShortcuts={showShortcuts}
        onToggleShortcuts={() => setShowShortcuts((current) => !current)}
        inputArea={
          <div className={TEXT_INPUT_BOX_CLASS_NAME}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] bg-[#FDFDFD] px-4 py-2.5">
              <div>
                <h3 className="text-[13px] font-semibold text-[var(--lc-ink)]">{inputLabel}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <button type="button" onClick={handlePasteFromClipboard} className={TEXT_INPUT_ACTION_CLASS_NAME} title="Paste from clipboard">
                  <Clipboard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Paste</span>
                </button>
                <button type="button" onClick={loadSampleInput} className={TEXT_INPUT_ACTION_CLASS_NAME} title="Load sample">
                  <FlaskConical className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Try sample</span>
                </button>
                <button type="button" onClick={useSelectedText} className={TEXT_INPUT_ACTION_CLASS_NAME} title="Import highlighted text from this page">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Selected</span>
                </button>
                <button type="button" onClick={toggleBatchMode} className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-colors ${batchMode ? "bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]" : "text-[var(--lc-muted)] hover:bg-black/[0.03] hover:text-[var(--lc-ink)]"}`} title={batchMode ? "Disable batch mode" : "Enable batch mode"}>
                  <span className="font-mono text-[10px] leading-none px-1 rounded bg-black/5 text-[var(--lc-muted)]">#</span>
                  <span>Batch</span>
                </button>
                <div className="w-px h-4 bg-black/5 mx-1"></div>
                <button type="button" onClick={() => setFreshInput("")} disabled={!input} className={`${TEXT_INPUT_ACTION_CLASS_NAME} disabled:opacity-50`} title="Clear input">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>
            
            {restoredSession && (
              <div className="px-4 pt-3 sm:px-5">
                <p className="text-xs leading-5 text-emerald-700 bg-emerald-50/60 border border-emerald-100/50 rounded-lg px-3 py-2">
                  Restored your last workspace on this device.
                </p>
              </div>
            )}
            
            {batchMode && (
              <div className="px-4 pt-3 sm:px-5">
                <div className="rounded-lg border border-teal-100 bg-teal-50/40 px-3.5 py-2.5 text-xs">
                  <p className="font-semibold text-teal-950">One snippet per line mode enabled</p>
                  <p className="mt-0.5 leading-relaxed text-teal-700">
                    {batchLineCount} line{batchLineCount === 1 ? "" : "s"} detected.
                  </p>
                </div>
              </div>
            )}
            
            {inputControls && (
              <div className="px-4 pt-3 sm:px-5">
                {inputControls}
              </div>
            )}
            
            <textarea
              id={`${trackName}-input`}
              aria-label={inputLabel}
              value={input}
              onChange={(event) => setFreshInput(event.target.value)}
              className={`w-full flex-1 resize-y bg-transparent p-4 sm:p-5 font-mono text-sm leading-relaxed text-[var(--lc-ink)] placeholder-[var(--lc-muted)] outline-none border-none focus:ring-0 min-h-[200px] ${inputMinHeightClassName}`}
              placeholder={placeholder}
            />
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.06] bg-white px-4 py-3 mt-auto">
              <div className="flex items-center gap-4 text-xs font-medium text-[var(--lc-muted)]">
                <div className="font-mono bg-black/5 border border-black/5 px-2 py-0.5 rounded-md">
                  {input.length.toLocaleString()} / 50k
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[var(--lc-muted)]">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Processed locally</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={replaceWorkspaceFromCurrentInput}
                disabled={processed.results.length === 0}
                className="lc-button-primary py-2 px-5"
              >
                {primaryActionLabel}
              </button>
            </div>
          </div>
        }
        summary={
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-2 text-xs text-[var(--lc-muted)] font-medium">
            <span>{statLabels.scanned}: <strong>{processed.stats.scanned.toLocaleString()}</strong></span>
            <span className="text-black/10">·</span>
            <span>{statLabels.found}: <strong>{processed.stats.found.toLocaleString()}</strong></span>
            {processed.stats.duplicatesRemoved > 0 && (
              <>
                <span className="text-black/10">·</span>
                <span>{statLabels.duplicatesRemoved}: <strong>{processed.stats.duplicatesRemoved.toLocaleString()}</strong></span>
              </>
            )}
            {processed.stats.invalidRemoved > 0 && (
              <>
                <span className="text-black/10">·</span>
                <span>{statLabels.invalidRemoved}: <strong>{processed.stats.invalidRemoved.toLocaleString()}</strong></span>
              </>
            )}
            <span className="text-black/10">·</span>
            <span className="text-[var(--lc-accent)] font-semibold">{statLabels.finalCount}: <strong>{workspaceValues.length.toLocaleString()}</strong></span>
          </div>
        }
        toolbar={
          <>
            <div className="flex flex-1 flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowBulkEditor((current) => !current)}
                disabled={!workspaceValues.length}
                className={`inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-colors ${showBulkEditor ? "bg-[var(--lc-accent-bg)] text-[var(--lc-accent)]" : "text-[var(--lc-muted)] hover:bg-black/[0.03] hover:text-[var(--lc-ink)]"} disabled:opacity-50`}
              >
                <PencilLine className="h-3.5 w-3.5" />
                {showBulkEditor ? "Close editor" : "Edit all"}
              </button>
              <div className="w-px h-4 bg-black/5 mx-1"></div>
              <button
                type="button"
                onClick={toggleSelectAllPreviewed}
                disabled={!workspaceValues.length}
                className="inline-flex min-h-8 items-center justify-center rounded-lg px-2.5 text-xs font-semibold text-[var(--lc-muted)] hover:bg-black/[0.03] hover:text-[var(--lc-ink)] transition-colors disabled:opacity-50"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={deleteSelectedRows}
                disabled={!selectedCount}
                className="inline-flex min-h-8 items-center justify-center rounded-lg px-2.5 text-xs font-semibold text-[var(--lc-danger)] hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
              <div className="w-px h-4 bg-black/5 mx-1"></div>
              <div className="flex items-center gap-1 rounded-lg border border-[var(--lc-border)] bg-white p-0.5">
                <button
                  type="button"
                  onClick={undoWorkspace}
                  disabled={!pastWorkspace.length}
                  className="inline-flex h-7 w-7 items-center justify-center rounded text-[var(--lc-muted)] hover:bg-black/[0.03] hover:text-[var(--lc-ink)] transition-colors disabled:opacity-50"
                  aria-label="Undo"
                  title="Undo"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={redoWorkspace}
                  disabled={!futureWorkspace.length}
                  className="inline-flex h-7 w-7 items-center justify-center rounded text-[var(--lc-muted)] hover:bg-black/[0.03] hover:text-[var(--lc-ink)] transition-colors disabled:opacity-50"
                  aria-label="Redo"
                  title="Redo"
                >
                  <Redo2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowShortcuts(true)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded text-[var(--lc-muted)] hover:bg-black/[0.03] hover:text-[var(--lc-ink)] transition-colors"
                  aria-label="Show keyboard shortcuts"
                  title="Keyboard shortcuts (?)"
                >
                  <Keyboard className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-[var(--lc-bg)] p-0.5 border border-[var(--lc-border)]">
              <button
                type="button"
                onClick={() => setResultDensity("comfortable")}
                className={`${resultDensity === "comfortable" ? "bg-white text-[var(--lc-ink)] shadow-sm" : "text-[var(--lc-muted)] hover:text-[var(--lc-ink)] hover:bg-white/50"} rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide transition-colors`}
              >
                Comfortable
              </button>
              <button
                type="button"
                onClick={() => setResultDensity("compact")}
                className={`${resultDensity === "compact" ? "bg-white text-[var(--lc-ink)] shadow-sm" : "text-[var(--lc-muted)] hover:text-[var(--lc-ink)] hover:bg-white/50"} rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide transition-colors`}
              >
                Compact
              </button>
            </div>
          </>
        }
        preview={
          <>
            {workspaceValues.length ? (
              showBulkEditor ? (
                <div className="p-4">
                  <textarea
                    aria-label="Bulk editor"
                    value={resultText}
                    onChange={(event) => applyBulkEditor(event.target.value)}
                    className="min-h-[200px] w-full rounded-xl border border-[var(--lc-border)] bg-[#FDFDFD] px-4 py-3 font-mono text-sm leading-relaxed text-[var(--lc-ink)] outline-none focus:bg-white focus:border-[var(--lc-accent)] focus:ring-1 focus:ring-[var(--lc-accent)] transition-colors"
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 border-b border-[var(--lc-border)] bg-[#FDFDFD] px-6 py-2">
                    <button
                      type="button"
                      onClick={toggleSelectAllPreviewed}
                      className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border border-[var(--lc-border-mid)] bg-white hover:border-[var(--lc-accent)] transition-colors"
                    >
                      {workspace.slice(0, WORKSPACE_PREVIEW_LIMIT).some((i) => i.selected) && <Check className="h-2.5 w-2.5 text-[var(--lc-accent)]" />}
                    </button>
                    <div className="flex-1 flex items-center gap-4 font-mono text-[9px] uppercase tracking-wider text-[var(--lc-hint)]">
                      <span className="w-16">STATUS</span>
                      <span>{csvHeader.toUpperCase()}</span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--lc-hint)]">ACTIONS</span>
                  </div>
                  <div className="divide-y divide-[var(--lc-border)] bg-white">
                    {workspace.slice(0, WORKSPACE_PREVIEW_LIMIT).map((item, index) => (
                      <div
                        key={item.id}
                        className={`group relative flex items-center gap-4 px-6 py-2 transition-colors hover:bg-black/[0.005] ${item.selected ? "bg-[var(--lc-accent-bg)]" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleWorkspaceSelection(item.id)}
                          className={`flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border transition-all ${item.selected ? "border-[var(--lc-accent)] bg-[var(--lc-accent)] text-white" : "border-[var(--lc-border-mid)] bg-white group-hover:border-[var(--lc-accent)]"}`}
                          aria-label={`Select row ${index + 1}`}
                        >
                          {item.selected && <Check className="h-2.5 w-2.5" />}
                        </button>
                        
                        <div className="flex w-16 shrink-0 items-center">
                          <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100">
                            Valid
                          </span>
                        </div>
                        
                        <div className="flex flex-1 items-center">
                          <input
                            aria-label="Edit item value"
                            value={item.value}
                            onChange={(event) => updateWorkspaceItem(item.id, event.target.value)}
                            className={`w-full bg-transparent font-mono text-[13px] text-[var(--lc-ink)] outline-none focus:bg-black/[0.02] focus:ring-1 focus:ring-[var(--lc-accent)]/20 rounded px-1.5 transition-all ${resultDensity === "compact" ? "py-0.5" : "py-1"}`}
                          />
                        </div>
 
                        <div className="flex shrink-0 items-center gap-0.5 pl-4 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => toggleWorkspaceLock(item.id)}
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-[var(--lc-muted)] hover:bg-black/[0.03] hover:text-[var(--lc-ink)]"
                            aria-label={item.locked ? "Unlock row" : "Lock row"}
                          >
                            {item.locked ? <Lock className="h-3.5 w-3.5 text-amber-500" /> : <LockOpen className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeWorkspaceItem(item.id)}
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-[var(--lc-muted)] hover:bg-red-50 hover:text-red-600"
                            aria-label={`Remove row ${index + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[var(--lc-border)] bg-[#FDFDFD] px-6 py-2">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--lc-hint)] text-center">
                      {workspace.length > WORKSPACE_PREVIEW_LIMIT
                        ? `SHOWING ${WORKSPACE_PREVIEW_LIMIT} OUT OF ${workspace.length} ROWS`
                        : `ALL ${workspace.length} RESULTS SHOWN`}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[200px]">
                <p className="text-xs text-[var(--lc-muted)]">{emptyMessage}</p>
              </div>
            )}
 
            {processed.invalidResults && processed.invalidResults.length > 0 && (
              <div className="m-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                <h4 className="text-xs font-semibold text-amber-950">Broken entries detected</h4>
                <p className="mt-0.5 text-[11px] text-amber-700">These items have invalid syntax and were automatically excluded.</p>
                <div className="mt-3 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-2">
                  {processed.invalidResults.map((item, i) => (
                    <span key={i} className="inline-flex items-center rounded border border-amber-200 bg-white px-2 py-0.5 font-mono text-[10px] text-amber-800">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        }
        exportControls={
          workspaceValues.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--lc-green-bg)] text-emerald-600 border border-emerald-100">
                  <Check className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[var(--lc-ink)]">Extraction Complete</h3>
                  <p className="text-xs text-[var(--lc-muted)] mt-0.5">{workspaceValues.length.toLocaleString()} items ready to export.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  className="lc-button-secondary py-1.5 px-4 text-xs font-semibold"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Clipboard className="h-3.5 w-3.5 text-[var(--lc-muted)]" />} {copied ? "Copied" : copyLabel}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="lc-button-secondary py-1.5 px-4 text-xs font-semibold"
                >
                  <FileText className="h-3.5 w-3.5 text-[var(--lc-muted)]" /> TXT
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="lc-button-primary py-1.5 px-6 text-xs font-semibold"
                >
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
              </div>
            </div>
          )
        }
      />
    </>
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
      className={`rounded-xl border p-4 transition-all hover:shadow-xs ${
        accent
          ? "border-[color:rgba(15,118,110,0.1)] bg-[color:rgba(15,118,110,0.04)]"
          : "border-[color:rgba(16,37,52,0.05)] bg-white"
      }`}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{label}</div>
      <div className="mt-2 text-2xl font-bold tabular-nums text-[color:var(--foreground)]">
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

function getItemNoun(trackName: string): string {
 const name = trackName.toLowerCase();
 if (name.includes("phone")) return "phone numbers";
 if (name.includes("email") && name.includes("duplicate")) return "duplicate emails";
 if (name.includes("email")) return "emails";
 if (name.includes("url")) return "URLs";
 if (name.includes("domain")) return "domains";
 return "items";
}
