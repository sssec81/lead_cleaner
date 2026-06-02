# LeadCleanr

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

## ✨ Core Features (MVP)

### Text Input Tools
- **Extract Emails**: Detect and return email addresses from pasted text.
- **Extract Phone Numbers**: Detect phone numbers from messy text.
- **Extract URLs**: Detect website links and URLs.
- **Extract Domains**: Extract domains from emails or URLs.
- **Clean & Deduplicate**: Trim spaces, lowercase emails, remove broken entries, and remove duplicate entries.

### CSV Upload Tools
- **Upload & Preview**: Upload a `.csv` file (up to 2MB) and preview the first 100-500 rows.
- **Targeted Cleaning**: Select target columns (email, phone, etc.).
- **Deduplicate**: Remove duplicate rows based on a selected column.
- **Trim & Format**: Clean specific data, lowercase emails, and delete empty rows with no useful data.

### Export
- **Instant Download**: Download cleaned results as `.txt` or `.csv`.
- **Copy**: One-click copy clean data to clipboard.
- **Metrics**: Instantly view stats on total items found, duplicates removed, and valid leads ready.

## 💻 Tech Stack
- **Framework**: Next.js (App Router)
- **UI Library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CSV Parsing**: PapaParse
- **Icons**: `lucide-react`
- **File Export**: Browser Blob API
- **Hosting**: DigitalOcean Droplet + Nginx + PM2
- **Database/Auth**: None (for MVP)

## 🚀 Getting Started

First, clone the repo and install the dependencies:
```bash
npm install
```
*(Note: MVP requires `papaparse` and `lucide-react`)*

Run the development server:
```bash
npm run dev
```
Open http://localhost:3000 with your browser.

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
│   │   ├── Navbar.tsx
│   │   ├── ToolLayout.tsx
│   │   ├── TextToolBox.tsx
│   │   ├── CsvUploader.tsx
│   │   └── StatsBox.tsx
│   └── lib/                       # Core Logic (Browser-side)
│       ├── extractors.ts          # Regex extraction logic
│       ├── cleaners.ts            # String cleaning functions
│       ├── csv.ts                 # PapaParse wrappers
│       └── export.ts              # Blob/download logic
```

## 🚢 Deployment (DigitalOcean Droplet)

1. Push code to your GitHub repository.
2. SSH into your DigitalOcean server (Ubuntu LTS).
3. Pull the latest code:
   ```bash
   git pull origin main
   ```
4. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
5. Start or restart the PM2 process:
   ```bash
   pm2 start npm --name "leadcleanr" -- start
   # OR if already running:
   pm2 restart leadcleanr
   ```

## 🗺️ Roadmap

- **V1 (MVP)**: Browser-first text extraction, basic CSV cleaning, and SEO pages. *(Current)*
- **V2 (Monetization Layer)**: User accounts, Stripe integration, larger file limits, saved workflows.
- **V3 (Business/API Layer)**: API access, team workspaces, CRM exports, email verification credits.
- **V4 (Performance Upgrade)**: Rust + WebAssembly for heavy, browser-side CSV processing and batch processing.

## ⚠️ Acceptable Use Policy
**LeadCleanr is for cleaning data you own or have permission to process.** Do not use it for spam, scraping abuse, or sending unsolicited messages. Ensure you comply with email marketing and privacy laws in your region.