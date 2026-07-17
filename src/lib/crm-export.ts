export type CrmExportFormat =
  | "clean_csv"
  | "hubspot"
  | "salesforce"
  | "apollo"
  | "pipedrive";

export type CrmFieldMapping = {
  targetHeader: string;
  sourceHeader: string | null;
  sourceLabel: string;
  status: "mapped" | "derived" | "missing";
  required: boolean;
};

export type CrmExportResult = {
  headers: string[];
  rows: Array<Record<string, unknown>>;
  mappings: CrmFieldMapping[];
  mappedFieldCount: number;
  missingRequiredFields: string[];
};

type FieldKey =
  | "first_name"
  | "last_name"
  | "full_name"
  | "email"
  | "phone"
  | "company"
  | "website"
  | "domain"
  | "title"
  | "linkedin"
  | "city"
  | "state"
  | "country"
  | "postal_code";

type TargetField = {
  key: FieldKey;
  header: string;
  required?: boolean;
};

export const CRM_EXPORT_FORMAT_OPTIONS: Array<{
  value: CrmExportFormat;
  label: string;
  description: string;
}> = [
  {
    value: "clean_csv",
    label: "Clean CSV",
    description: "Keep all cleaned and generated columns.",
  },
  {
    value: "hubspot",
    label: "HubSpot contacts",
    description: "Contact property labels for HubSpot import.",
  },
  {
    value: "salesforce",
    label: "Salesforce leads",
    description: "Standard Salesforce Lead field labels.",
  },
  {
    value: "apollo",
    label: "Apollo contacts",
    description: "Recommended contact identity and company fields.",
  },
  {
    value: "pipedrive",
    label: "Pipedrive people",
    description: "Person and organization fields for spreadsheet import.",
  },
];

const SOURCE_ALIASES: Record<FieldKey, string[]> = {
  first_name: ["first_name", "firstname", "given_name", "givenname", "first"],
  last_name: ["last_name", "lastname", "surname", "family_name", "familyname", "last"],
  full_name: ["full_name", "fullname", "contact_name", "contactname", "name"],
  email: [
    "email",
    "email_address",
    "emailaddress",
    "work_email",
    "workemail",
    "business_email",
    "contact_email",
  ],
  phone: [
    "phone",
    "phone_number",
    "phonenumber",
    "mobile",
    "mobile_phone",
    "work_phone",
    "telephone",
    "tel",
  ],
  company: [
    "company",
    "company_name",
    "companyname",
    "organization",
    "organization_name",
    "account_name",
    "business_name",
  ],
  website: [
    "website",
    "website_url",
    "company_website",
    "companywebsite",
    "account_website",
    "url",
  ],
  domain: [
    "domain",
    "company_domain",
    "companydomain",
    "company_domain_name",
    "leadcleanr_generated_domain",
  ],
  title: ["title", "job_title", "jobtitle", "position", "role"],
  linkedin: [
    "linkedin",
    "linkedin_url",
    "linkedinurl",
    "contact_linkedin_url",
    "linkedin_profile",
  ],
  city: ["city", "contact_city", "person_city"],
  state: ["state", "province", "region", "contact_state"],
  country: ["country", "country_name", "contact_country"],
  postal_code: ["postal_code", "postalcode", "zip", "zip_code", "zipcode"],
};

const TARGET_FIELDS: Record<Exclude<CrmExportFormat, "clean_csv">, TargetField[]> = {
  hubspot: [
    { key: "first_name", header: "First name" },
    { key: "last_name", header: "Last name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone number" },
    { key: "title", header: "Job title" },
    { key: "company", header: "Company name" },
    { key: "domain", header: "Company domain name" },
    { key: "website", header: "Website URL" },
    { key: "city", header: "City" },
    { key: "state", header: "State/Region" },
    { key: "country", header: "Country/Region" },
    { key: "postal_code", header: "Postal code" },
  ],
  salesforce: [
    { key: "first_name", header: "First Name" },
    { key: "last_name", header: "Last Name", required: true },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "company", header: "Company", required: true },
    { key: "title", header: "Title" },
    { key: "website", header: "Website" },
    { key: "city", header: "City" },
    { key: "state", header: "State" },
    { key: "country", header: "Country" },
    { key: "postal_code", header: "Postal Code" },
  ],
  apollo: [
    { key: "first_name", header: "First Name" },
    { key: "last_name", header: "Last Name" },
    { key: "email", header: "Contact Email" },
    { key: "phone", header: "Mobile Phone" },
    { key: "title", header: "Contact Title" },
    { key: "linkedin", header: "Contact LinkedIn URL" },
    { key: "company", header: "Company Name" },
    { key: "website", header: "Company Website" },
    { key: "city", header: "Contact Place City" },
    { key: "state", header: "Contact Place State" },
    { key: "country", header: "Contact Place Country" },
    { key: "postal_code", header: "Contact Place Postal Code" },
  ],
  pipedrive: [
    { key: "full_name", header: "Person Name", required: true },
    { key: "email", header: "Person Email" },
    { key: "phone", header: "Person Phone" },
    { key: "title", header: "Job Title" },
    { key: "company", header: "Organization Name" },
    { key: "website", header: "Organization Website" },
  ],
};

export function buildCrmExport(
  format: Exclude<CrmExportFormat, "clean_csv">,
  sourceHeaders: string[],
  rows: Array<Record<string, unknown>>,
): CrmExportResult {
  const normalizedHeaders = new Map<string, string>();
  sourceHeaders.forEach((header) => {
    const normalized = normalizeHeader(header);
    if (!normalizedHeaders.has(normalized)) normalizedHeaders.set(normalized, header);
  });

  const mappings = TARGET_FIELDS[format].map((field) =>
    resolveMapping(field, normalizedHeaders),
  );
  const activeMappings = mappings.filter((mapping) => mapping.status !== "missing");
  const exportRows = rows.map((row) => {
    const output: Record<string, unknown> = {};
    activeMappings.forEach((mapping) => {
      output[mapping.targetHeader] = resolveMappedValue(mapping, row);
    });
    return output;
  });

  const missingRequiredFields = mappings
    .filter((mapping) => mapping.required && mapping.status === "missing")
    .map((mapping) => mapping.targetHeader);

  if (
    format === "hubspot" &&
    !hasAnyMappedTarget(mappings, ["First name", "Last name", "Email"])
  ) {
    missingRequiredFields.push("First name, Last name, or Email");
  }

  if (
    format === "apollo" &&
    !hasAnyMappedTarget(mappings, [
      "Contact Email",
      "Contact LinkedIn URL",
      "Company Name",
      "Company Website",
    ])
  ) {
    missingRequiredFields.push(
      "Contact Email, LinkedIn URL, Company Name, or Company Website",
    );
  }

  return {
    headers: activeMappings.map((mapping) => mapping.targetHeader),
    rows: exportRows,
    mappings,
    mappedFieldCount: activeMappings.length,
    missingRequiredFields,
  };
}

export function buildCrmExportFileName(
  fileName: string,
  format: Exclude<CrmExportFormat, "clean_csv">,
): string {
  const base = (fileName || "leadcleanr").replace(/\.csv$/i, "");
  return `${base}-${format}.csv`;
}

function resolveMapping(
  field: TargetField,
  normalizedHeaders: Map<string, string>,
): CrmFieldMapping {
  const directHeader = SOURCE_ALIASES[field.key]
    .map(normalizeHeader)
    .map((alias) => normalizedHeaders.get(alias))
    .find(Boolean);

  if (directHeader) {
    return {
      targetHeader: field.header,
      sourceHeader: directHeader,
      sourceLabel: directHeader,
      status: "mapped",
      required: Boolean(field.required),
    };
  }

  const fullNameHeader = findSourceHeader("full_name", normalizedHeaders);
  const firstNameHeader = findSourceHeader("first_name", normalizedHeaders);
  const lastNameHeader = findSourceHeader("last_name", normalizedHeaders);

  if ((field.key === "first_name" || field.key === "last_name") && fullNameHeader) {
    return {
      targetHeader: field.header,
      sourceHeader: fullNameHeader,
      sourceLabel: `${fullNameHeader} (split)`,
      status: "derived",
      required: Boolean(field.required),
    };
  }

  if (field.key === "full_name" && (firstNameHeader || lastNameHeader)) {
    return {
      targetHeader: field.header,
      sourceHeader: [firstNameHeader, lastNameHeader].filter(Boolean).join(" + "),
      sourceLabel: [firstNameHeader, lastNameHeader].filter(Boolean).join(" + "),
      status: "derived",
      required: Boolean(field.required),
    };
  }

  if (field.key === "website") {
    const domainHeader = findSourceHeader("domain", normalizedHeaders);
    if (domainHeader) {
      return {
        targetHeader: field.header,
        sourceHeader: domainHeader,
        sourceLabel: `${domainHeader} (domain)`,
        status: "derived",
        required: Boolean(field.required),
      };
    }
  }

  if (field.key === "domain") {
    const websiteHeader = findSourceHeader("website", normalizedHeaders);
    if (websiteHeader) {
      return {
        targetHeader: field.header,
        sourceHeader: websiteHeader,
        sourceLabel: `${websiteHeader} (domain)`,
        status: "derived",
        required: Boolean(field.required),
      };
    }
  }

  return {
    targetHeader: field.header,
    sourceHeader: null,
    sourceLabel: "Not found",
    status: "missing",
    required: Boolean(field.required),
  };
}

function resolveMappedValue(
  mapping: CrmFieldMapping,
  row: Record<string, unknown>,
): unknown {
  if (!mapping.sourceHeader) return "";

  if (mapping.status === "mapped") return row[mapping.sourceHeader] ?? "";

  if (mapping.sourceLabel.endsWith("(split)")) {
    const parts = String(row[mapping.sourceHeader] ?? "").trim().split(/\s+/).filter(Boolean);
    if (mapping.targetHeader.toLowerCase().includes("first")) return parts[0] ?? "";
    return parts.length > 1 ? parts.slice(1).join(" ") : parts[0] ?? "";
  }

  if (mapping.sourceHeader.includes(" + ")) {
    return mapping.sourceHeader
      .split(" + ")
      .map((header) => String(row[header] ?? "").trim())
      .filter(Boolean)
      .join(" ");
  }

  if (mapping.sourceLabel.endsWith("(domain)")) {
    const value = String(row[mapping.sourceHeader] ?? "").trim();
    if (!value) return "";
    if (mapping.targetHeader.toLowerCase().includes("domain")) {
      return extractDomain(value);
    }
    return value.includes("://") ? value : `https://${value}`;
  }

  return row[mapping.sourceHeader] ?? "";
}

function findSourceHeader(
  key: FieldKey,
  normalizedHeaders: Map<string, string>,
): string | undefined {
  return SOURCE_ALIASES[key]
    .map(normalizeHeader)
    .map((alias) => normalizedHeaders.get(alias))
    .find(Boolean);
}

function hasAnyMappedTarget(
  mappings: CrmFieldMapping[],
  targetHeaders: string[],
): boolean {
  return mappings.some(
    (mapping) =>
      targetHeaders.includes(mapping.targetHeader) && mapping.status !== "missing",
  );
}

function normalizeHeader(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "");
}

function extractDomain(value: string): string {
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return url.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return value.replace(/^https?:\/\//i, "").split("/")[0]?.replace(/^www\./i, "") ?? value;
  }
}
