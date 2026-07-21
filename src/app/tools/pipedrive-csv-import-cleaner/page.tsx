import type { Metadata } from "next";

import { CrmImportLandingPage } from "@/components/crm-import-landing-page";
import { buildToolMetadata } from "@/lib/seo";

const path = "/tools/pipedrive-csv-import-cleaner";
const title = "Pipedrive People CSV Import Cleaner";
const description = "Prepare people and organization data for Pipedrive CSV import. Clean names, emails, phones, companies, duplicates, and field mappings in your browser.";

export const metadata: Metadata = buildToolMetadata({ title, description, path });

export default function PipedriveCsvImportCleanerPage() {
  return (
    <CrmImportLandingPage
      crm="Pipedrive"
      path={path}
      cleanerQuery="pipedrive"
      title={title}
      intro={description}
      requirements={[
        { title: "Person names", text: "Prepare a usable person name or split first and last name values that can be mapped consistently during import." },
        { title: "Contact channels", text: "Normalize email and phone values and remove repeated contacts before they enter the people database." },
        { title: "Organization links", text: "Keep organization names and websites consistent so people can be associated with the intended companies." },
      ]}
      failureModes={[
        "People records without a usable name or contact identity.",
        "Duplicate email and phone values across combined source lists.",
        "Organization names that vary enough to create separate company records.",
        "Blank rows, malformed contact details, and unclear source-to-Pipedrive mappings.",
      ]}
      steps={[
        { title: "Load people data", text: "Open the CSV locally and identify person, email, phone, organization, owner, and label columns." },
        { title: "Clean and associate", text: "Normalize contact values, remove duplicate people, and prepare organization fields for mapping." },
        { title: "Export for Pipedrive", text: "Download the cleaned CSV and complete the people and organization import inside Pipedrive." },
      ]}
      faqs={[
        { question: "Can this prepare both people and organizations?", answer: "Yes. The cleaner can preserve and map person contact fields alongside organization name, website, and domain data." },
        { question: "Does it create records in Pipedrive automatically?", answer: "No. LeadCleanr prepares the CSV. You review field mappings and run the actual import in Pipedrive." },
        { question: "Is the Pipedrive CSV uploaded to a server?", answer: "No. The free preparation workflow processes and exports the file locally in your browser." },
      ]}
    />
  );
}
