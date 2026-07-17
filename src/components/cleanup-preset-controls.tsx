"use client";

import { BookmarkPlus, Check, Pencil, Save, Trash2, X } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import {
  addCleanupPreset,
  CLEANUP_PRESETS_STORAGE_KEY,
  type CleanupPreset,
  type CleanupPresetRules,
  createCleanupPreset,
  deleteCleanupPreset,
  MAX_PRESET_NAME_LENGTH,
  parseCleanupPresets,
  renameCleanupPreset,
} from "@/lib/cleanup-presets";
import { trackToolEvent } from "@/lib/telemetry";

type EditorMode = "closed" | "save" | "rename";

type CleanupPresetControlsProps = {
  currentRules: CleanupPresetRules;
  availableColumns: string[];
  onApply: (rules: CleanupPresetRules) => void;
};

export function CleanupPresetControls({
  currentRules,
  availableColumns,
  onApply,
}: CleanupPresetControlsProps) {
  const [presets, setPresets] = useState<CleanupPreset[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [editorMode, setEditorMode] = useState<EditorMode>("closed");
  const [name, setName] = useState("");
  const [pendingDelete, setPendingDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const storedPresets = parseCleanupPresets(
          window.localStorage.getItem(CLEANUP_PRESETS_STORAGE_KEY),
        );
        setPresets(storedPresets);
        setSelectedId(storedPresets[0]?.id ?? "");
      } catch {
        setError("Saved presets are unavailable in this browser.");
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const selectedPreset = useMemo(
    () => presets.find((preset) => preset.id === selectedId),
    [presets, selectedId],
  );

  function persist(nextPresets: CleanupPreset[]) {
    try {
      window.localStorage.setItem(
        CLEANUP_PRESETS_STORAGE_KEY,
        JSON.stringify(nextPresets),
      );
      setPresets(nextPresets);
      setError("");
      return true;
    } catch {
      setError("Could not save presets. Check your browser storage settings.");
      return false;
    }
  }

  function openSaveEditor() {
    setEditorMode("save");
    setName("");
    setPendingDelete(false);
    setMessage("");
    setError("");
  }

  function openRenameEditor() {
    if (!selectedPreset) return;
    setEditorMode("rename");
    setName(selectedPreset.name);
    setPendingDelete(false);
    setMessage("");
    setError("");
  }

  function closeEditor() {
    setEditorMode("closed");
    setName("");
    setError("");
  }

  function submitEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (editorMode === "save") {
        const preset = createCleanupPreset(name, currentRules);
        const nextPresets = addCleanupPreset(presets, preset);
        if (!persist(nextPresets)) return;
        setSelectedId(preset.id);
        setMessage(`Saved “${preset.name}”.`);
        trackToolEvent("csv-lead-cleaner", "save_cleanup_preset");
      } else if (editorMode === "rename" && selectedPreset) {
        const nextPresets = renameCleanupPreset(
          presets,
          selectedPreset.id,
          name,
        );
        if (!persist(nextPresets)) return;
        const renamed = nextPresets.find((preset) => preset.id === selectedPreset.id);
        setMessage(`Renamed preset to “${renamed?.name ?? name}”.`);
        trackToolEvent("csv-lead-cleaner", "rename_cleanup_preset");
      }

      setEditorMode("closed");
      setName("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not update preset.");
    }
  }

  function applySelectedPreset() {
    if (!selectedPreset) return;

    const hasSavedColumn = availableColumns.includes(
      selectedPreset.rules.selectedColumn,
    );
    onApply({
      ...selectedPreset.rules,
      selectedColumn: hasSavedColumn
        ? selectedPreset.rules.selectedColumn
        : currentRules.selectedColumn,
    });
    setMessage(
      hasSavedColumn
        ? `Applied “${selectedPreset.name}”.`
        : `Applied “${selectedPreset.name}”. Its saved target column was not in this CSV, so the current column was kept.`,
    );
    setError("");
    setPendingDelete(false);
    trackToolEvent("csv-lead-cleaner", "apply_cleanup_preset", {
      target_column_available: hasSavedColumn,
    });
  }

  function confirmDelete() {
    if (!selectedPreset) return;
    const nextPresets = deleteCleanupPreset(presets, selectedPreset.id);
    if (!persist(nextPresets)) return;

    setSelectedId(nextPresets[0]?.id ?? "");
    setMessage(`Deleted “${selectedPreset.name}”.`);
    setPendingDelete(false);
    setEditorMode("closed");
    trackToolEvent("csv-lead-cleaner", "delete_cleanup_preset");
  }

  return (
    <section
      aria-labelledby="cleanup-presets-title"
      className="rounded-xl border border-[var(--lc-border)] bg-white p-3"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-3">
            <label
              id="cleanup-presets-title"
              htmlFor="cleanup-preset-select"
              className="text-[12px] font-medium text-[var(--lc-muted)]"
            >
              Saved cleanup presets
            </label>
            <span className="text-[11px] text-[var(--lc-hint)]">
              Stored only in this browser
            </span>
          </div>
          <select
            id="cleanup-preset-select"
            value={selectedId}
            disabled={!presets.length}
            onChange={(event) => {
              setSelectedId(event.target.value);
              setPendingDelete(false);
              setEditorMode("closed");
              setMessage("");
            }}
            className="lc-select min-h-11 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {!presets.length ? (
              <option value="">No saved presets yet</option>
            ) : null}
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applySelectedPreset}
            disabled={!selectedPreset}
            className="lc-button-secondary min-h-11 px-4 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            Apply
          </button>
          <button
            type="button"
            onClick={openSaveEditor}
            className="lc-button-primary min-h-11 px-4 text-xs font-semibold"
          >
            <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
            Save current
          </button>
          <button
            type="button"
            onClick={openRenameEditor}
            disabled={!selectedPreset}
            aria-label="Rename selected preset"
            title="Rename preset"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-white text-[var(--lc-muted)] transition-colors hover:bg-[var(--lc-bg)] hover:text-[var(--lc-ink)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPendingDelete(true);
              setEditorMode("closed");
              setMessage("");
            }}
            disabled={!selectedPreset}
            aria-label="Delete selected preset"
            title="Delete preset"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--lc-border)] bg-white text-[var(--lc-muted)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-[var(--lc-danger)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {editorMode !== "closed" ? (
        <form onSubmit={submitEditor} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <div className="min-w-0 flex-1">
            <label htmlFor="cleanup-preset-name" className="sr-only">
              Preset name
            </label>
            <input
              id="cleanup-preset-name"
              type="text"
              value={name}
              maxLength={MAX_PRESET_NAME_LENGTH}
              autoFocus
              required
              onChange={(event) => setName(event.target.value)}
              placeholder="Example: Business email cleanup"
              className="lc-input min-h-11 w-full"
            />
          </div>
          <button
            type="submit"
            className="lc-button-primary min-h-11 px-4 text-xs font-semibold"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {editorMode === "save" ? "Save preset" : "Save name"}
          </button>
          <button
            type="button"
            onClick={closeEditor}
            className="lc-button-secondary min-h-11 px-4 text-xs font-semibold"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </button>
        </form>
      ) : null}

      {pendingDelete && selectedPreset ? (
        <div className="mt-3 flex flex-col gap-3 rounded-lg border border-red-100 bg-red-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-red-900">
            Delete “{selectedPreset.name}”? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPendingDelete(false)}
              className="lc-button-secondary min-h-11 px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--lc-danger)] px-4 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete preset
            </button>
          </div>
        </div>
      ) : null}

      <div aria-live="polite" role="status" className="mt-2 min-h-4 text-xs">
        {error ? (
          <span className="text-[var(--lc-danger)]">{error}</span>
        ) : message ? (
          <span className="text-[var(--lc-green)]">{message}</span>
        ) : (
          <span className="text-[var(--lc-hint)]">
            Save these rules once, then reuse them on another CSV.
          </span>
        )}
      </div>
    </section>
  );
}
