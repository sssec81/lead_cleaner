import type { Metadata } from "next";

import { CrmImportLandingPage } from "@/components/crm-import-landing-page";
import { buildToolMetadata } from "@/lib/seo";

const path = "/tools/apollo-csv-import-cleaner";
const title = "Apollo Contact CSV Import Cleaner";
const description = "Clean a contact CSV before Apollo import. Review email identity, names, companies, websites, duplicates, and field mappings locally in your browser.";

export const metadata: Metadata = buildToolMetadata({ title, description, path });

export default function ApolloCsvImportCleanerPage() {
  return (
    <CrmImportLandingPage
      crm="Apollo"
      path={path}
      cleanerQuery="apollo"
      title={title}
      intro={description}
      requirements={[
        { title: "Contact identity", text: "Keep a reliable email address and supporting name data so imported people can be matched and used in Apollo workflows." },
        { title: "Company context", text: "Prepare company name, website, and domain values for cleaner account association and enrichment." },
        { title: "Mapped contact fields", text: "Align source headers with Apollo contact attributes before downloading the import-ready CSV." },
      ]}
      failureModes={[
        "Contacts missing the email or identity data required for the intended workflow.",
        "Repeated people caused by duplicate or differently formatted email values.",
        "Company websites and domains stored in inconsistent columns or formats.",
        "Personal addresses, blank rows, and malformed contact values mixed into a business list.",
      ]}
      steps={[
        { title: "Open the source list", text: "Load the contact export locally and identify email, name, title, company, website, and phone columns." },
        { title: "Clean contact identity", text: "Normalize values, remove duplicate contacts, filter unwanted rows, and map the fields Apollo should receive." },
        { title: "Export and import", text: "Download the reviewed CSV and upload it using Apollo’s contact import workflow." },
      ]}
      faqs={[
        { question: "Can LeadCleanr upload contacts directly to Apollo?", answer: "No. It creates a cleaner CSV locally. You upload that exported file from inside Apollo." },
        { question: "Can I filter personal email addresses?", answer: "Yes. The main cleaner can separate common personal domains from business email addresses before export." },
        { question: "Is Apollo contact data stored by LeadCleanr?", answer: "No. The free CSV preparation workflow runs locally and does not upload the contact file to LeadCleanr." },
      ]}
    />
  );
}
