import type { Metadata } from "next";

import { CrmImportLandingPage } from "@/components/crm-import-landing-page";
import { buildToolMetadata } from "@/lib/seo";

const path = "/tools/hubspot-csv-import-cleaner";
const title = "HubSpot CSV Import Cleaner";
const description = "Clean and map a contact CSV before HubSpot import. Check identity fields, duplicate emails, blank rows, and column structure locally in your browser.";

export const metadata: Metadata = buildToolMetadata({ title, description, path });

export default function HubSpotCsvImportCleanerPage() {
  return (
    <CrmImportLandingPage
      crm="HubSpot"
      path={path}
      cleanerQuery="hubspot"
      title={title}
      intro={description}
      requirements={[
        { title: "Contact identity", text: "Keep an email address or another reliable identifier so HubSpot can create or update the intended contact." },
        { title: "Property mapping", text: "Match spreadsheet headers to HubSpot contact properties and skip columns you do not want to import." },
        { title: "Consistent values", text: "Normalize email, phone, company, and website values before they are assigned to CRM properties." },
      ]}
      failureModes={[
        "Duplicate email addresses that would update the same contact unexpectedly.",
        "Rows without a usable contact identity value.",
        "Spreadsheet headers that do not map cleanly to HubSpot properties.",
        "Invalid email formats, empty rows, and mixed personal or business addresses.",
      ]}
      steps={[
        { title: "Upload the contact CSV", text: "Load the export locally and confirm the columns containing email, name, company, phone, and website data." },
        { title: "Clean and map properties", text: "Remove bad rows, deduplicate contacts, and map source headers to the HubSpot fields you want to populate." },
        { title: "Export for HubSpot", text: "Download the reviewed CSV, then use HubSpot’s import flow to complete the upload." },
      ]}
      faqs={[
        { question: "Does LeadCleanr import contacts directly into HubSpot?", answer: "No. LeadCleanr prepares and exports the CSV locally. You complete the final import inside your HubSpot account." },
        { question: "Can it prevent duplicate HubSpot contacts?", answer: "It can remove repeated email values and flag identity problems before export. HubSpot still applies its own deduplication and update rules during import." },
        { question: "Is my HubSpot contact CSV uploaded to LeadCleanr?", answer: "No. The free cleaning and mapping workflow runs locally in your browser." },
      ]}
    />
  );
}
