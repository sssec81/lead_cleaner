import type { DuplicateMode, EmailFilterMode } from "./csv-cleaner.ts";
import type { CrmExportFormat, CrmFieldOverrides } from "./crm-export.ts";

export const CLEANUP_PRESETS_STORAGE_KEY = "leadcleanr:csv-cleaner:presets:v1";
export const MAX_CLEANUP_PRESETS = 20;
export const MAX_PRESET_NAME_LENGTH = 60;

const DUPLICATE_MODES = new Set<DuplicateMode>([
  "selected",
  "email",
  "phone",
  "domain",
  "entire_row",
]);
const EMAIL_FILTER_MODES = new Set<EmailFilterMode>([
  "all",
  "business_only",
  "personal_only",
]);
const CRM_EXPORT_FORMATS = new Set<CrmExportFormat>([
  "clean_csv",
  "hubspot",
  "salesforce",
  "apollo",
  "pipedrive",
]);

export type CleanupPresetRules = {
  selectedColumn: string;
  duplicateMode: DuplicateMode;
  emailFilter: EmailFilterMode;
  crmFormat?: CrmExportFormat;
  crmFieldOverrides?: CrmFieldOverrides;
};

export type CleanupPreset = {
  id: string;
  name: string;
  rules: CleanupPresetRules;
  createdAt: string;
  updatedAt: string;
};

type PresetOptions = {
  id?: string;
  now?: string;
};

export function normalizePresetName(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_PRESET_NAME_LENGTH);
}

export function createCleanupPreset(
  name: string,
  rules: CleanupPresetRules,
  options: PresetOptions = {},
): CleanupPreset {
  const normalizedName = normalizePresetName(name);
  if (!normalizedName) {
    throw new Error("Enter a name for this preset.");
  }

  const now = options.now ?? new Date().toISOString();
  return {
    id: options.id ?? createPresetId(),
    name: normalizedName,
    rules: {
      ...rules,
      crmFieldOverrides: rules.crmFieldOverrides
        ? { ...rules.crmFieldOverrides }
        : undefined,
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function parseCleanupPresets(rawValue: string | null): CleanupPreset[] {
  if (!rawValue) return [];

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isCleanupPreset)
      .slice(0, MAX_CLEANUP_PRESETS)
      .map((preset) => ({
        ...preset,
        name: normalizePresetName(preset.name),
        rules: {
          ...preset.rules,
          crmFormat: preset.rules.crmFormat ?? "clean_csv",
          crmFieldOverrides: preset.rules.crmFieldOverrides
            ? { ...preset.rules.crmFieldOverrides }
            : {},
        },
      }));
  } catch {
    return [];
  }
}

export function addCleanupPreset(
  presets: CleanupPreset[],
  preset: CleanupPreset,
): CleanupPreset[] {
  return [preset, ...presets.filter((item) => item.id !== preset.id)].slice(
    0,
    MAX_CLEANUP_PRESETS,
  );
}

export function renameCleanupPreset(
  presets: CleanupPreset[],
  id: string,
  name: string,
  now = new Date().toISOString(),
): CleanupPreset[] {
  const normalizedName = normalizePresetName(name);
  if (!normalizedName) {
    throw new Error("Enter a name for this preset.");
  }

  return presets.map((preset) =>
    preset.id === id
      ? { ...preset, name: normalizedName, updatedAt: now }
      : preset,
  );
}

export function deleteCleanupPreset(
  presets: CleanupPreset[],
  id: string,
): CleanupPreset[] {
  return presets.filter((preset) => preset.id !== id);
}

function isCleanupPreset(value: unknown): value is CleanupPreset {
  if (!value || typeof value !== "object") return false;

  const preset = value as Partial<CleanupPreset>;
  const rules = preset.rules as Partial<CleanupPresetRules> | undefined;
  return Boolean(
    typeof preset.id === "string" &&
      preset.id &&
      typeof preset.name === "string" &&
      normalizePresetName(preset.name) &&
      typeof preset.createdAt === "string" &&
      typeof preset.updatedAt === "string" &&
      rules &&
      typeof rules.selectedColumn === "string" &&
      DUPLICATE_MODES.has(rules.duplicateMode as DuplicateMode) &&
      EMAIL_FILTER_MODES.has(rules.emailFilter as EmailFilterMode) &&
      (rules.crmFormat === undefined ||
        CRM_EXPORT_FORMATS.has(rules.crmFormat as CrmExportFormat)) &&
      (rules.crmFieldOverrides === undefined ||
        isCrmFieldOverrides(rules.crmFieldOverrides)),
  );
}

function isCrmFieldOverrides(value: unknown): value is CrmFieldOverrides {
  return Boolean(
    value &&
      typeof value === "object" &&
      Object.entries(value).every(
        ([key, source]) => typeof key === "string" && typeof source === "string",
      ),
  );
}

function createPresetId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `preset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
