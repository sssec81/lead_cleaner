export type ToolCategory = "primary" | "crm" | "csv" | "text" | "cleanup";

export type ToolDefinition = {
  path: `/tools/${string}`;
  title: string;
  description: string;
  category: ToolCategory;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

export const TOOL_REGISTRY = [
  {
    path: "/tools/csv-lead-cleaner",
    title: "CSV Lead Cleaner",
    description: "Clean, deduplicate, review, map, and export lead CSV files.",
    category: "primary",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/tools/hubspot-csv-import-cleaner",
    title: "HubSpot CSV Import Cleaner",
    description: "Map contact properties and catch blocked rows before HubSpot import.",
    category: "crm",
    changeFrequency: "monthly",
    priority: 0.88,
  },
  {
    path: "/tools/salesforce-csv-import-cleaner",
    title: "Salesforce CSV Import Cleaner",
    description: "Validate required lead values and export Salesforce-ready columns.",
    category: "crm",
    changeFrequency: "monthly",
    priority: 0.86,
  },
  {
    path: "/tools/apollo-csv-import-cleaner",
    title: "Apollo CSV Import Cleaner",
    description: "Map contact identity and company fields before uploading to Apollo.",
    category: "crm",
    changeFrequency: "monthly",
    priority: 0.84,
  },
  {
    path: "/tools/pipedrive-csv-import-cleaner",
    title: "Pipedrive CSV Import Cleaner",
    description: "Build person and organization fields with row-level readiness checks.",
    category: "crm",
    changeFrequency: "monthly",
    priority: 0.82,
  },
  {
    path: "/tools/extract-emails-from-csv",
    title: "Extract Emails from CSV",
    description: "Pull, validate, and export the email column only.",
    category: "csv",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/tools/extract-phone-numbers-from-csv",
    title: "Extract Phones from CSV",
    description: "Detect phone columns and standardize formats quickly.",
    category: "csv",
    changeFrequency: "weekly",
    priority: 0.88,
  },
  {
    path: "/tools/remove-empty-rows-from-csv",
    title: "Remove Empty CSV Rows",
    description: "Delete blank spreadsheet rows before import or merge.",
    category: "csv",
    changeFrequency: "weekly",
    priority: 0.82,
  },
  {
    path: "/tools/merge-csv-files",
    title: "Merge CSV Files",
    description: "Combine multiple CSVs and align headers automatically.",
    category: "csv",
    changeFrequency: "weekly",
    priority: 0.84,
  },
  {
    path: "/tools/split-csv-files",
    title: "Split CSV Files",
    description: "Break large CSVs into smaller chunks for upload limits.",
    category: "csv",
    changeFrequency: "weekly",
    priority: 0.82,
  },
  {
    path: "/tools/convert-csv-to-json",
    title: "Convert CSV to JSON",
    description: "Turn rows into structured JSON arrays instantly.",
    category: "csv",
    changeFrequency: "monthly",
    priority: 0.72,
  },
  {
    path: "/tools/extract-emails-from-text",
    title: "Extract Emails",
    description: "Pull email addresses out of copied blocks of text.",
    category: "text",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/tools/extract-phone-numbers-from-text",
    title: "Extract Phone Numbers",
    description: "Find and normalize phone numbers in raw pasted text.",
    category: "text",
    changeFrequency: "monthly",
    priority: 0.78,
  },
  {
    path: "/tools/extract-urls-from-text",
    title: "Extract URLs",
    description: "Pull links out of noisy copied content.",
    category: "text",
    changeFrequency: "monthly",
    priority: 0.72,
  },
  {
    path: "/tools/extract-domains-from-emails",
    title: "Extract Domains",
    description: "Get domains from email lists for enrichment workflows.",
    category: "text",
    changeFrequency: "monthly",
    priority: 0.76,
  },
  {
    path: "/tools/validate-email-list",
    title: "Validate Email List",
    description: "Check list structure and syntax before sending.",
    category: "cleanup",
    changeFrequency: "weekly",
    priority: 0.88,
  },
  {
    path: "/tools/clean-email-list",
    title: "Clean Email List",
    description: "Normalize and tidy a pasted email list.",
    category: "cleanup",
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    path: "/tools/remove-duplicate-emails",
    title: "Remove Duplicate Emails",
    description: "Keep only unique email values.",
    category: "cleanup",
    changeFrequency: "weekly",
    priority: 0.84,
  },
  {
    path: "/tools/remove-duplicate-phone-numbers",
    title: "Remove Duplicate Phones",
    description: "Deduplicate phone numbers from raw input.",
    category: "cleanup",
    changeFrequency: "monthly",
    priority: 0.72,
  },
  {
    path: "/tools/remove-duplicate-urls",
    title: "Remove Duplicate URLs",
    description: "Deduplicate copied links and URL lists.",
    category: "cleanup",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/tools/count-words-characters-text",
    title: "Count Words / Characters",
    description: "Quick counts for copied text and drafts.",
    category: "cleanup",
    changeFrequency: "monthly",
    priority: 0.65,
  },
] as const satisfies readonly ToolDefinition[];

export const TOOL_COUNT = TOOL_REGISTRY.length;

export function getToolByPath(path: ToolDefinition["path"]): ToolDefinition {
  const tool = TOOL_REGISTRY.find((entry) => entry.path === path);
  if (!tool) {
    throw new Error(`Unknown tool path: ${path}`);
  }
  return tool;
}
