# Target Audience & Use Cases

## Target Audience
-   **Sales Development Reps (SDRs) / BDRs:** Need to format raw lists of prospects to upload into sales engagement platforms (e.g., Outreach, Apollo).
-   **Founders / Indie Hackers:** Running cold outreach campaigns and need to extract emails and domains from scraped text or messy CSV exports.
-   **Marketers:** Building Account-Based Marketing (ABM) campaigns and needing to pull domains from an existing list of emails to match against ad networks.
-   **Recruiters:** Extracting emails, phone numbers, and LinkedIn URLs from bulk resumes or applicant tracking system (ATS) text dumps.

## Primary Use Cases

### 1. The "Quick Clean" (Text Processing)
A user copies a massive, unformatted block of text from an email thread, a Slack channel, or a website. They paste it into the [Extract Emails from Text](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/app/tools/extract-emails-from-text/page.tsx) tool. LeadCleanr instantly identifies all valid emails, strips out the noise, removes duplicates, and stages them. The user then hits "Copy" or "Download TXT" to move them into their actual system.

### 2. The "Batch Paste" ([Batch Mode](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/components/text-processing-tool.tsx#L87))
A user is manually researching prospects on LinkedIn and pasting snippets one by one. By turning on batch mode, they can keep multiple snippets in one input box, run extraction across all lines together, and then replace the current clean result set with one consistent export-ready list.

### 3. Account-Based List Building
A marketer has a list of 5,000 lead emails but needs a list of the *companies* to run targeted LinkedIn ads. They paste the emails into the [Extract Domains from Emails](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/app/tools/extract-domains-from-emails/page.tsx) tool, which strips the `name@` portion, removes free domains (if configured) or duplicates, and outputs a clean list of unique company domains.

### 4. The Master CSV Cleanup
A user downloads a messy CSV from a legacy CRM. They upload it to the [CSV Lead Cleaner](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/app/tools/csv-lead-cleaner/page.tsx). The browser-side parser reads the rows, identifies the core columns (emails, phones), strips invalid data, drops duplicate rows across the file, and provides a sanitized CSV ready for immediate import into a modern tool.
