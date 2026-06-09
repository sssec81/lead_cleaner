# LeadCleanr (v1.1.1)

**Clean messy lead lists instantly.**

LeadCleanr is an online utility SaaS tool that helps sales teams, recruiters, marketers, agencies, and virtual assistants clean messy lead lists by extracting emails, phone numbers, URLs, and domains from text or CSV files.

## 🛡️ Privacy-First Processing
Basic cleaning runs entirely in your browser. **We do not store your pasted text or uploaded CSV files.** Data is processed locally using browser APIs to ensure maximum security for sensitive lead lists.

## 🎯 Target Audience
- Sales Teams & Cold Outreach
- Recruiters & HR Teams
- Marketers & Newsletter Operators
- Agencies & Freelancers
- Virtual Assistants & Data Entry Workers

## ✨ Core Features (v1.1.1)

### Text Input Tools
- **Extract Emails**: Detect and return email addresses from pasted text.
- **Extract Phone Numbers**: Detect phone numbers with smart international fallback logic.
- **Extract URLs**: Detect website links and cleanly strip trailing punctuation.
- **Extract Domains**: Extract domains from emails or URLs.
- **Clean Email List**: Standardize and validate syntax for messy email lists.
- **Remove Duplicate Emails**: Fast deduplication for email lists.
- **Remove Duplicate Phone Numbers**: Fast deduplication for phone lists.
- **Remove Duplicate URLs**: Fast deduplication for link lists.
- **Validate Email List**: Check syntax validity of bulk emails.
- **Count Words / Characters**: Real-time writing statistics and estimates.
- **Defensive Parsing**: Hard character limits to prevent ReDoS (Regular Expression Denial of Service) browser hangs.

### CSV Upload Tools
- **Client-Side Chunking**: Upload `.csv` files and parse them using `PapaParse` via 64KB chunk streaming to keep the browser thread unblocked.
- **CSV Lead Cleaner**: Smart column detection, row deduplication, invalid/blank row removal, and email-type filtering for messy lead sheets.
- **Extract Emails from CSV**: Bulk extract emails hidden inside CSV cells.
- **Extract Phone Numbers from CSV**: Bulk extract phone numbers hidden inside CSV cells.
- **Remove Empty Rows from CSV**: Instantly strip blank lines from large files.
- **Merge CSV Files**: Combine up to 5 CSV files with header mapping previews and normalized column-based deduplication for emails, phones, URLs, and domains.
- **Convert CSV to JSON**: Transform flat spreadsheet rows into structured JSON arrays.

### Export & UI
- **SaaS Aesthetic**: Crisp, utilitarian interface replacing oversized glassmorphic elements for professional usability.
- **Instant Download**: Download cleaned results as `.txt` or `.csv`.
- **Copy**: One-click copy clean data to clipboard.
- **Review States**: Preview cleaned rows, removed rows, and invalid rows before exporting.
- **Metrics**: Instantly view stats on duplicates removed, invalid rows, blank rows, email-filter removals, and clean leads ready.

## 💻 Tech Stack
- **Framework**: Next.js 16 (App Router, Webpack on this platform)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **CSV Parsing**: PapaParse
- **Icons**: `lucide-react`
- **Phone Parsing**: `libphonenumber-js`
- **Hosting**: Designed for Vercel or DigitalOcean Droplet + Nginx + PM2

## 🚀 Getting Started

First, clone the repo and install the dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
Open http://localhost:3000 with your browser.
On Apple Silicon machines without native Turbopack bindings, this project uses Webpack for local development too.

Create a production build:
```bash
npm run build
```
On Apple Silicon machines without native Turbopack bindings, this project uses Webpack for production builds.

## 📂 Project Structure

```text
leadcleanr/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Home Page
│   │   ├── tools/                 # SEO Tool Pages
│   │   │   ├── extract-emails-from-text/
│   │   │   ├── clean-email-list/
│   │   │   ├── csv-lead-cleaner/
│   │   │   └── ...
│   │   ├── pricing/               # Pricing Page
│   │   ├── privacy/               # Privacy Policy
│   │   ├── terms/                 # Terms of Service
│   │   └── contact/               # Contact Form
│   ├── components/                # Reusable UI Components
│   │   ├── page-frame.tsx         # Main Shell layout
│   │   ├── site-header.tsx        # Navigation
│   │   ├── csv-lead-cleaner-tool.tsx
│   │   └── text-processing-tool.tsx
│   └── lib/                       # Core Logic (Browser-side)
│       ├── text-tools.ts          # Regex extraction & string cleaning
│       ├── csv.ts                 # PapaParse wrappers & chunking
│       └── export.ts              # Blob/download logic
```

## 🗺️ Roadmap

- **V1 (Current)**: Browser-first text extraction, CSV cleaning, merge/export tooling, and SEO pages.
- **V2 (Monetization Layer)**: User accounts, Stripe integration, larger file limits, saved workflows.
- **V3 (Business/API Layer)**: API access, team workspaces, CRM exports, email verification credits.

## 📝 Release Notes

### v1.1.1
- Waitlist signups now fail honestly if persistence fails instead of returning a false success response.
- CSV lead cleaner now reports rows removed by email-type filters and fully resets cleanup settings.
- Merge CSV column deduplication now normalizes emails, phones, URLs, and domains before comparing values.

## ⚠️ Acceptable Use Policy
**LeadCleanr is for cleaning data you own or have permission to process.** Do not use it for spam, scraping abuse, or sending unsolicited messages. Ensure you comply with email marketing and privacy laws in your region.
