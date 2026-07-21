import type { Metadata } from "next";

import { CrmImportLandingPage } from "@/components/crm-import-landing-page";
import { buildToolMetadata } from "@/lib/seo";

const path = "/tools/salesforce-csv-import-cleaner";
const title = "Salesforce Lead CSV Import Cleaner";
const description = "Prepare a lead CSV for Salesforce import. Check required values, duplicate emails, field mappings, and invalid rows locally before using Data Import Wizard.";

export const metadata: Metadata = buildToolMetadata({ title, description, path });

export default function SalesforceCsvImportCleanerPage() {
  return (
    <CrmImportLandingPage
      crm="Salesforce"
      path={path}
      cleanerQuery="salesforce"
      title={title}
      intro={description}
      requirements={[
        { title: "Required lead fields", text: "Confirm every lead has the values your Salesforce configuration requires, commonly Last Name and Company." },
        { title: "Field mapping", text: "Align CSV headers with Salesforce lead fields and omit source columns that should not be imported." },
        { title: "Import-safe values", text: "Normalize contact fields and review rows that could fail validation rules or create unusable records." },
      ]}
      failureModes={[
        "Missing Last Name, Company, or organization-specific required fields.",
        "Duplicate email values that could create repeated leads.",
        "Headers that do not match the Salesforce fields selected during mapping.",
        "Blank rows, malformed emails, and values that are inconsistent across the file.",
      ]}
      steps={[
        { title: "Load the lead CSV", text: "Open the source file locally and identify its lead name, company, email, phone, status, and source columns." },
        { title: "Run Salesforce preflight", text: "Check required values, remove duplicate or invalid rows, and map the source fields to a cleaner export structure." },
        { title: "Use Data Import Wizard", text: "Download the prepared CSV and complete the lead import from Salesforce Setup or your preferred import workflow." },
      ]}
      faqs={[
        { question: "Which fields are required for Salesforce leads?", answer: "Salesforce commonly requires Last Name and Company for lead imports, but your organization may enforce additional validation rules and required custom fields." },
        { question: "Does this replace Salesforce Data Import Wizard?", answer: "No. LeadCleanr prepares the file. Data Import Wizard or another Salesforce import tool performs the actual upload." },
        { question: "Does the CSV leave my browser?", answer: "No. LeadCleanr performs the cleaning, readiness checks, and export locally in your browser." },
      ]}
    />
  );
}
