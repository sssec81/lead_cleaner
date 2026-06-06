# LeadCleanr (v1.0.0-mvp)

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

## ✨ Core Features (v1.0.0 MVP)

### Text Input Tools
- **Extract Emails**: Detect and return email addresses from pasted text.
- **Extract Phone Numbers**: Detect phone numbers with smart international fallback logic.
- **Extract URLs**: Detect website links and cleanly strip trailing punctuation.
- **Extract Domains**: Extract domains from emails or URLs.
- **Defensive Parsing**: Hard character limits to prevent ReDoS (Regular Expression Denial of Service) browser hangs.

### CSV Upload Tools
- **Client-Side Chunking**: Upload `.csv` files and parse them using `PapaParse` via 64KB chunk streaming to keep the browser thread unblocked.
- **Smart Column Detection**: Automatically detects email, phone, and url columns based on regex scoring of the first 3 rows of data.
- **Deduplicate**: Remove duplicate rows based on a selected column or a safe JSON-stringified entire row hash.
- **Trim & Format**: Clean specific data, lowercase emails, and delete empty rows.

### Export & UI
- **SaaS Aesthetic**: Crisp, utilitarian interface replacing oversized glassmorphic elements for professional usability.
- **Instant Download**: Download cleaned results as `.txt` or `.csv`.
- **Copy**: One-click copy clean data to clipboard.
- **Metrics**: Instantly view stats on total items found, duplicates removed, and valid leads ready.

## 💻 Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
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

- **V1 (MVP)**: Browser-first text extraction, basic CSV cleaning, and SEO pages. *(Current)*
- **V2 (Monetization Layer)**: User accounts, Stripe integration, larger file limits, saved workflows.
- **V3 (Business/API Layer)**: API access, team workspaces, CRM exports, email verification credits.

## ⚠️ Acceptable Use Policy
**LeadCleanr is for cleaning data you own or have permission to process.** Do not use it for spam, scraping abuse, or sending unsolicited messages. Ensure you comply with email marketing and privacy laws in your region.