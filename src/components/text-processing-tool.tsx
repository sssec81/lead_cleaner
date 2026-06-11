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
import { useEffect, useMemo, useState } from "react";

import { copyTextToClipboard } from "@/lib/clipboard";
import { downloadCsvFile, downloadTextFile } from "@/lib/export";
import { trackToolEvent } from "@/lib/telemetry";
import type { CleaningStats } from "@/lib/text-tools";
import { ProWaitlistCard } from "@/components/pro-waitlist-card";
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
 "rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-4 transition-all duration-200 focus-within:border-blue-500 focus-within:bg-blue-50/30 sm:px-5 sm:py-5";
const TEXT_INPUT_ACTION_CLASS_NAME =
 "inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 shadow-2xs";

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
 } else {
 setInput(sampleInput);
 setWorkspace(
 createWorkspaceFromValues(processInput(sampleInput).results, "Sample"),
 );
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
 <div className="grid items-start gap-6 lg:grid-cols-[1.02fr_0.98fr]">
 <div className="flex h-full flex-col gap-6">
 <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
 <div className="mb-6 flex items-start gap-4">
 <div
 className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconToneClassName}`}
 >
 <Icon className="h-5 w-5" />
 </div>
 <div className="min-w-0">
 <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
 <p className="mt-1 text-sm leading-6 text-slate-500">
 {description}
 </p>
 </div>
 </div>

 <div className="flex flex-col">
 <div className={TEXT_INPUT_BOX_CLASS_NAME}>
 <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
 <div>
 <h3 className="text-sm font-semibold text-slate-900">{inputLabel}</h3>
 <p className="text-xs text-slate-500">{inputHelpText}</p>
 </div>
 <div className="flex flex-wrap items-center gap-1.5">
 <button
 type="button"
 onClick={handlePasteFromClipboard}
 className={TEXT_INPUT_ACTION_CLASS_NAME}
 title="Paste from clipboard"
 >
 <Clipboard className="h-3.5 w-3.5" />
 <span>Paste</span>
 </button>
 <button
 type="button"
 onClick={loadSampleInput}
 className={TEXT_INPUT_ACTION_CLASS_NAME}
 title="Load sample"
 >
 <FlaskConical className="h-3.5 w-3.5" />
 <span>Sample</span>
 </button>
 <button
 type="button"
 onClick={useSelectedText}
 className={TEXT_INPUT_ACTION_CLASS_NAME}
 title="Import highlighted text from this page"
 >
 <MousePointerClick className="h-3.5 w-3.5" />
 <span>Use selected</span>
 </button>
 <button
 type="button"
 onClick={toggleBatchMode}
 className={`inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold transition shadow-2xs ${
 batchMode
 ? "border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-50"
 : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
 }`}
 title={batchMode ? "Disable batch mode" : "Enable batch mode (one item per line)"}
 >
 <span className="font-mono text-xs leading-none">#</span>
 <span>{batchMode ? "Batch mode" : "Batch"}</span>
 </button>
 <button
 type="button"
 onClick={() => setFreshInput("")}
 disabled={!input}
 className={`${TEXT_INPUT_ACTION_CLASS_NAME} disabled:cursor-not-allowed disabled:opacity-40`}
 title="Clear input"
 >
 <Trash2 className="h-3.5 w-3.5" />
 <span>Clear</span>
 </button>
 </div>
 </div>

 {restoredSession && (
 <p className="mb-3 text-xs leading-5 text-emerald-700 bg-emerald-50/60 border border-emerald-100/50 rounded-xl px-3 py-2">
 Restored your last workspace on this device so you can keep cleaning without starting over.
 </p>
 )}

 {batchMode && (
 <div className="mb-3 rounded-xl border border-teal-100 bg-teal-50/40 px-3.5 py-2.5 text-xs">
 <p className="font-semibold text-teal-950">One snippet per line mode enabled</p>
 <p className="mt-0.5 leading-relaxed text-teal-700">
 {batchLineCount} line{batchLineCount === 1 ? "" : "s"} detected. Each line is treated as a separate item.
 </p>
 </div>
 )}

 {inputControls ? <div className="mb-3">{inputControls}</div> : null}

 <textarea
 id={`${trackName}-input`}
 aria-label={inputLabel}
 value={input}
 onChange={(event) => setFreshInput(event.target.value)}
 className={`w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${inputMinHeightClassName}`}
 placeholder={placeholder}
 />

 <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
 <div className="flex items-center gap-1">
 <Lock className="h-3 w-3 text-slate-400" />
 <span>Processed locally in your browser.</span>
 </div>
 <div className="font-mono text-slate-400">
 {input.length.toLocaleString()} / 50,000 characters
 </div>
 </div>
 </div>
 </div>
 </section>

 <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
 <h3 className="text-base font-semibold text-slate-900">Workflow</h3>
 <p className="mt-1 text-sm text-slate-500">
 Note the classic validation flow designed dashboard by words, hugging and lines. Inspired by Linear.
 </p>
 <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3 py-2">
 <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-sm">
 <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Paste / Import</span>
 </div>
 <div className="h-[2px] w-4 sm:w-8 bg-slate-200 shrink-0"></div>
 <div className="flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 shadow-sm">
 <span className="text-xs font-semibold text-blue-700 whitespace-nowrap">Analyze</span>
 </div>
 <div className="h-[2px] w-4 sm:w-8 bg-slate-200 shrink-0"></div>
 <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
 <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Export</span>
 </div>
 </div>
 </section>

 <div className="flex flex-wrap items-center gap-3 mt-auto">
 <button
 type="button"
 onClick={replaceWorkspaceFromCurrentInput}
 disabled={processed.results.length === 0}
 className="inline-flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md sm:flex-none cursor-pointer"
 >
 <RefreshCw className="h-4 w-4" />
 {primaryActionLabel}
 </button>

 </div>
 </div>

 <div className="space-y-6">
 {/* WORKSPACE SUMMARY */}
 <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
 <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
 WORKSPACE SUMMARY
 </p>
 <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
 <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
 {statLabels.finalCount}
 </p>
 <p className="mt-2 font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
 {workspaceValues.length.toLocaleString()}
 </p>
 </div>

 <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 <StatCard label={statLabels.scanned} value={processed.stats.scanned} />
 <StatCard label={statLabels.found} value={processed.stats.found} />
 <StatCard
 label={statLabels.duplicatesRemoved}
 value={processed.stats.duplicatesRemoved}
 />
 <StatCard
 label={statLabels.invalidRemoved}
 value={processed.stats.invalidRemoved}
 />
 {processed.stats.blankRemoved !== undefined && processed.stats.blankRemoved > 0 && (
 <StatCard
 label={statLabels.blankRemoved ?? "Blank rows removed"}
 value={processed.stats.blankRemoved}
 />
 )}
 <StatCard label="Locked rows" value={lockedCount} />
 <StatCard label="Selected rows" value={selectedCount} />
 </div>
 </div>

 {/* MAIN RESULTS SECTION */}
 <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
 <div className="flex flex-col gap-4">
 <div>
 <h3 className="font-display text-xl font-bold text-slate-900">
 {typeof resultTitle === "function" ? resultTitle(workspaceValues.length) : resultTitle}
 </h3>
 {resultDescription && (
 <p className="mt-1 text-sm leading-6 text-slate-500">
 {typeof resultDescription === "function" ? resultDescription(workspaceValues.length) : resultDescription}
 </p>
 )}
 </div>
 <div className="flex items-center self-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
 <button
 type="button"
 onClick={() => setResultDensity("comfortable")}
 className={`rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
 resultDensity === "comfortable"
 ? "bg-white text-slate-900 shadow-sm"
 : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
 }`}
 >
 Comfortable
 </button>
 <button
 type="button"
 onClick={() => setResultDensity("compact")}
 className={`rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
 resultDensity === "compact"
 ? "bg-white text-slate-900 shadow-sm"
 : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
 }`}
 >
 Compact
 </button>
 </div>
 </div>

 <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
 <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
 Workspace actions
 </p>
 {collapseWorkspaceActions ? (
 <button
 type="button"
 onClick={() => setShowWorkspaceActions((current) => !current)}
 disabled={!workspaceValues.length}
 className="inline-flex h-7 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
 >
 {showWorkspaceActions ? "Hide actions" : "More actions"}
 </button>
 ) : null}
 </div>
 <div className="flex flex-wrap gap-3">
 <button
 type="button"
 onClick={() => void handleCopy()}
 disabled={!workspaceValues.length}
 className="group inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
 >
 {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
 {copied ? "Copied" : copyLabel}
 </button>
 <button
 type="button"
 onClick={handleDownloadCsv}
 disabled={!workspaceValues.length}
 className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
 >
 <Download className="h-3.5 w-3.5 text-slate-400" />
 Download CSV
 </button>
 <button
 type="button"
 onClick={handleDownloadTxt}
 disabled={!workspaceValues.length}
 className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
 >
 <FileText className="h-3.5 w-3.5 text-slate-400" />
 Download TXT
 </button>
 </div>
 {showWorkspaceActions ? (
 <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
 <button
 type="button"
 onClick={() => setShowBulkEditor((current) => !current)}
 disabled={!workspaceValues.length}
 className={`inline-flex min-h-8 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${showBulkEditor ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
 >
 <PencilLine className="h-3.5 w-3.5" />
 {showBulkEditor ? "Close editor" : "Edit all"}
 </button>
 <button
 type="button"
 onClick={toggleSelectAllPreviewed}
 disabled={!workspaceValues.length}
 className="inline-flex min-h-8 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
 >
 Select preview rows
 </button>
 <button
 type="button"
 onClick={deleteSelectedRows}
 disabled={!selectedCount}
 className="inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
 >
 <Trash2 className="h-3.5 w-3.5" />
 Delete selected
 </button>
 <button
 type="button"
 onClick={undoWorkspace}
 disabled={!pastWorkspace.length}
 className="inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
 >
 <Undo2 className="h-3.5 w-3.5" />
 Undo
 </button>
 <button
 type="button"
 onClick={redoWorkspace}
 disabled={!futureWorkspace.length}
 className="inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
 >
 <Redo2 className="h-3.5 w-3.5" />
 Redo
 </button>
 </div>
 ) : null}
 </div>

 <div className="mt-6 flex flex-col gap-6">
 {/* Step 3 header removed to match mockup */}


 {workspaceValues.length ? (
 showBulkEditor ? (
 <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
 <textarea
 aria-label="Bulk editor"
 value={resultText}
 onChange={(event) => applyBulkEditor(event.target.value)}
 className="min-h-[24rem] w-full rounded-xl bg-slate-50 px-6 py-6 font-mono text-sm leading-relaxed text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-sky-500/20"
 />
 </div>
 ) : (
 <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
 <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50 px-6 py-3">
 <button
 type="button"
 onClick={toggleSelectAllPreviewed}
 className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white hover:border-sky-400"
 >
 {/* Master checkbox placeholder */}
 </button>
 <div className="flex-1 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
 <span className="w-16">STATUS</span>
 <span>{csvHeader.toUpperCase()}</span>
 </div>
 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ACTIONS</span>
 </div>
 <div className="divide-y divide-slate-100 bg-white">
 {workspace.slice(0, WORKSPACE_PREVIEW_LIMIT).map((item, index) => (
 <div
 key={item.id}
 className={`group relative flex items-center gap-4 px-6 py-3 transition-colors hover:bg-slate-50 ${
 item.selected ? "bg-sky-50/40" : ""
 }`}
 >
 <button
 type="button"
 onClick={() => toggleWorkspaceSelection(item.id)}
 className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-all ${
 item.selected
 ? "border-sky-500 bg-sky-500 text-white"
 : "border-slate-300 bg-white group-hover:border-sky-400"
 }`}
 aria-label={`Select row ${index + 1}`}
 >
 {item.selected && <Check className="h-3 w-3" />}
 </button>
 
 <div className="flex w-16 shrink-0 items-center gap-2">
 <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 border border-emerald-200/50">
 Valid
 </span>
 </div>
 
 <div className="flex flex-1 items-center gap-3">
 <input
 aria-label="Edit item value"
 value={item.value}
 onChange={(event) => updateWorkspaceItem(item.id, event.target.value)}
 className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none focus:bg-slate-100 focus:ring-2 focus:ring-sky-100 rounded px-2 py-1 transition-all"
 />
 </div>

 <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 pl-4">
 <button
 type="button"
 onClick={() => toggleWorkspaceLock(item.id)}
 className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
 aria-label={item.locked ? "Unlock row" : "Lock row"}
 >
 {item.locked ? <Lock className="h-4 w-4 text-amber-500" /> : <LockOpen className="h-4 w-4" />}
 </button>
 <button
 type="button"
 onClick={() => removeWorkspaceItem(item.id)}
 className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-100 hover:text-red-600"
 aria-label={`Remove row ${index + 1}`}
 >
 <Trash2 className="h-4 w-4" />
 </button>
 </div>
 </div>
 ))}
 </div>
 <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
 SHOWING {Math.min(WORKSPACE_PREVIEW_LIMIT, workspace.length)} OUT OF {workspace.length} ROWS
 </p>
 </div>
 </div>
 )
 ) : (
 <p className="text-sm leading-7 text-[color:var(--muted)]">
 {emptyMessage}
 </p>
 )}
 </div>

 {processed.invalidResults && processed.invalidResults.length > 0 && (
 <div className="mt-6 rounded-xl border border-red-200/60 bg-red-50/50 p-6">
 <h4 className="text-sm font-semibold text-red-900">Broken entries detected</h4>
 <p className="mt-1 text-xs text-red-700">These items have invalid syntax and were automatically excluded from your clean workspace.</p>
 <div className="mt-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
 {processed.invalidResults.map((item, i) => (
 <span key={i} className="inline-flex items-center rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-800 shadow-sm">
 {item}
 </span>
 ))}
 </div>
 </div>
 )}

 {showShortcuts ? (
 <div className="mt-4 rounded-xl border border-[color:rgba(15,118,110,0.16)] bg-[color:rgba(15,118,110,0.08)] p-4 text-sm">
 <p className="font-semibold text-[color:var(--foreground)]">
 Keyboard shortcuts
 </p>
 <div className="mt-3 grid gap-2 text-[color:var(--muted)] sm:grid-cols-2">
 <p>`?` toggle shortcuts</p>
 <p>`s` load sample</p>
 <p>`b` toggle batch mode</p>
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

 <ProWaitlistCard
 trackSource={`text_tool_${trackName}`}
 title="Want saved workflows and export presets?"
 description="Join the Pro waitlist to get notified when we launch saved cleanup presets, CSV presets for CRM (HubSpot, Salesforce), and outreach tools."
 />
 </div>
 </div>
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
