# LeadCleanr

LeadCleanr is a browser-first Next.js app for cleaning messy lead lists before CRM import. It helps users extract emails, phone numbers, URLs, and domains from raw text or CSV files, then review and export clean results without sending the source data to a backend for processing.

## What This Project Does

- Cleans lead data locally in the browser
- Extracts emails, phones, URLs, and domains from pasted text
- Cleans and filters CSV lead lists before import
- Removes duplicates, blank rows, and invalid records
- Saves reusable cleanup presets in browser storage
- Saves opt-in cleanup snapshots locally for 30 days
- Maps clean rows into HubSpot, Salesforce, Apollo, and Pipedrive CSV formats
- Lets users review and override CRM field mappings before export
- Generates a data-free cleanup audit report with before/after metrics
- Includes a dismissible first-run guide and keyboard undo/redo
- Exports cleaned output as `.txt`, `.csv`, or `.json` depending on the tool

## Core Tool Set

### CSV tools

- `CSV Lead Cleaner` for full spreadsheet cleanup
- `Extract Emails from CSV`
- `Extract Phone Numbers from CSV`
- `Remove Empty Rows from CSV`
- `Merge CSV Files`
- `Split CSV Files`
- `Convert CSV to JSON`

### Text tools

- `Extract Emails from Text`
- `Extract Phone Numbers from Text`
- `Extract URLs from Text`
- `Extract Domains from Emails`
- `Clean Email List`
- `Validate Email List`
- `Remove Duplicate Emails`
- `Remove Duplicate Phone Numbers`
- `Remove Duplicate URLs`
- `Count Words / Characters`

## Privacy Model

Lead cleaning runs locally in the browser. Pasted text and uploaded CSV files are not sent to the server for processing.

This repo does include optional server-side features for:

- anonymous analytics
- sanitized client error reporting
- waitlist submissions

Those flows are separate from the core cleaning pipeline.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- PapaParse
- `libphonenumber-js`
- `fflate`

## Project Structure

```text
src/
├── app/              # App Router pages, metadata, API routes
├── components/       # UI and tool components
├── lib/              # CSV, text cleanup, export, SEO, telemetry helpers
tests/                # Node test suite for core logic
test-fixtures/        # Sample inputs for realistic/manual testing
docs/                 # PRD and supporting product docs
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Build for production:

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
```

## Environment Variables

Copy `.env.example` to `.env.local` and set values as needed.

```env
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
ERROR_TRACKING_WEBHOOK_URL=
WAITLIST_WEBHOOK_URL=
WAITLIST_FILE_PATH=
```

Notes:

- `NEXT_PUBLIC_GA_ID` enables Google Analytics 4
- `NEXT_PUBLIC_SITE_URL` optionally overrides the canonical site URL used in metadata
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` adds the Google Search Console verification tag
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` adds the Bing Webmaster Tools verification tag
- `ERROR_TRACKING_WEBHOOK_URL` is an optional webhook for client error reports
- `WAITLIST_WEBHOOK_URL` is the recommended production waitlist sink; LeadCleanr sends email, role, typical file size, CRM, cleanup frequency, intended use, source, and timestamp
- `WAITLIST_FILE_PATH` is an optional single-server fallback for waitlist storage

## Testing

This project includes logic tests for CSV parsing, CSV cleaning, export behavior, and text-processing helpers.

Run them with:

```bash
npm run test
```

Useful sample inputs live under:

- `test-fixtures/realistic`
- `test-fixtures/upload-limits`

## Deployment

This app is designed for either:

- Vercel
- DigitalOcean Droplet with Nginx and PM2

Deployment notes are documented here:

- [DEPLOYMENT.md](/Users/shamanjungshah/Desktop/money/lead_cleaner/DEPLOYMENT.md)
- [DEPLOYMENT_DO_DROPLET.md](/Users/shamanjungshah/Desktop/money/lead_cleaner/DEPLOYMENT_DO_DROPLET.md)

## Related Docs

- [docs/PRD.md](/Users/shamanjungshah/Desktop/money/lead_cleaner/docs/PRD.md)
- [BUSINESS_PLAN.md](/Users/shamanjungshah/Desktop/money/lead_cleaner/BUSINESS_PLAN.md)
- [CODEX.md](/Users/shamanjungshah/Desktop/money/lead_cleaner/CODEX.md)

## Current Notes

- The free browser workflow currently supports CSV files up to `5 MB` per file
- Local development and production builds use `--webpack` in this repo's scripts
- The repository homepage is `https://leadcleanr.com`

## Acceptable Use

Use LeadCleanr only for data you own or are authorized to process. Do not use it for scraping abuse, spam, or unsolicited outreach that violates privacy or marketing laws.
