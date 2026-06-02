# LeadCleanr — Tech Stack Document

## 1. Project Overview

**Project Name:** LeadCleanr

**Product Type:** Online utility SaaS tool

**Core Purpose:**

LeadCleanr helps users clean messy lead lists by extracting emails, phone numbers, URLs, and domains from text or CSV files. It also removes duplicates, cleans email lists, and exports clean results as TXT or CSV.

---

# 2. Final MVP Tech Stack

## Core App Stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js |
| UI Library | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| CSV Parsing | PapaParse |
| Icons | lucide-react |
| Text Processing | TypeScript regex and string functions |
| File Export | Browser Blob API |
| Hosting | DigitalOcean Droplet |
| Domain | Namecheap |
| Server OS | Ubuntu LTS |
| Web Server | Nginx |
| Process Manager | PM2 |
| SSL | Let’s Encrypt / Certbot |
| Deployment | GitHub pull + build + PM2 restart |
| Database | None for MVP |
| Auth/Login | None for MVP |
| Payments | Later |
| Rust | Later, not MVP |

---

# 3. Hosting Setup

## Selected Hosting Option

**Option B: DigitalOcean Droplet + Namecheap Domain**

This setup gives more control than platform hosting like Vercel.

---

## Hosting Architecture

```
User visits leadcleanr.com
        ↓
Namecheap domain points to server IP
        ↓
Nginx receives request
        ↓
Nginx forwards request to Next.js app
        ↓
Next.js app runs on localhost:3000 using PM2
```

---

## Hosting Components

| Component | Use |
| --- | --- |
| Namecheap | Buy and manage domain |
| DigitalOcean Droplet | Host the web app |
| Ubuntu LTS | Server operating system |
| Nginx | Reverse proxy and web server |
| PM2 | Keeps Next.js app running |
| Certbot | Adds free SSL certificate |
| GitHub | Code repository |
| SSH | Server access and deployment |

---

# 4. Why This Stack?

## Why Next.js?

Next.js is good for LeadCleanr because the product needs many SEO-focused tool pages.

Example pages:

```
/tools/extract-emails-from-text
/tools/remove-duplicate-emails
/tools/clean-email-list
/tools/csv-lead-cleaner
```

Next.js is useful for:

- SEO pages
- Fast routing
- Reusable layouts
- Future API routes
- Landing pages
- Tool pages
- Blog pages

---

## Why TypeScript?

TypeScript helps reduce bugs while building data-cleaning tools.

Use TypeScript for:

- Email extraction functions
- Phone extraction functions
- URL extraction functions
- Domain extraction functions
- CSV cleaning logic
- Validation
- Result formatting
- Export functions

---

## Why Tailwind CSS?

Tailwind CSS helps build UI quickly.

Use Tailwind for:

- Landing page design
- Tool cards
- Form layouts
- Result boxes
- Buttons
- Responsive design
- Dashboard-style UI later

---

## Why PapaParse?

PapaParse is used for CSV upload and processing.

Use PapaParse for:

- Uploading CSV files
- Parsing CSV rows
- Previewing CSV data
- Selecting columns
- Removing duplicates
- Exporting clean CSV files

---

## Why Nginx?

Nginx is used as a reverse proxy.

Its job:

```
Public request on leadcleanr.com
        ↓
Nginx
        ↓
Next.js app running on port 3000
```

Nginx also helps with:

- SSL setup
- Domain routing
- Future subdomains
- Request handling
- Basic performance control

---

## Why PM2?

PM2 keeps the Next.js app alive on the server.

PM2 helps with:

- Starting the app
- Restarting app after crashes
- Running app in background
- Viewing logs
- Restarting after deployment

---

# 5. MVP Processing Strategy

For MVP, most processing should happen inside the browser.

## Local Browser Processing

```
User pastes text or uploads CSV
        ↓
Browser processes data locally
        ↓
LeadCleanr extracts and cleans data
        ↓
User downloads TXT or CSV
```

---

## Why Browser Processing?

Benefits:

- Lower server cost
- Faster result
- Better privacy
- No file storage needed
- No database needed
- Easier MVP launch

---

# 6. MVP Features and Tech Mapping

| Feature | Technology |
| --- | --- |
| Extract emails from text | TypeScript regex |
| Extract phone numbers from text | TypeScript regex |
| Extract URLs from text | TypeScript regex |
| Extract domains from emails/URLs | TypeScript string logic |
| Remove duplicate emails | JavaScript Set |
| Clean email list | TypeScript string functions |
| Sort results | JavaScript array sort |
| Copy results | Clipboard API |
| Download TXT | Blob API |
| Download CSV | Blob API / PapaParse |
| Upload CSV | File input + PapaParse |
| Preview CSV | React table |
| Select CSV column | React state |
| Deduplicate CSV rows | TypeScript logic |
| Export cleaned CSV | PapaParse unparse |
| SEO pages | Next.js metadata |
| Hosting | DigitalOcean Droplet |
| SSL | Let’s Encrypt |

---

# 7. Project Folder Structure

```
leadcleanr/
  app/
    page.tsx
    layout.tsx
    globals.css

    tools/
      page.tsx

      extract-emails-from-text/
        page.tsx

      extract-phone-numbers-from-text/
        page.tsx

      extract-urls-from-text/
        page.tsx

      extract-domains-from-emails/
        page.tsx

      remove-duplicate-emails/
        page.tsx

      clean-email-list/
        page.tsx

      csv-lead-cleaner/
        page.tsx

      extract-emails-from-csv/
        page.tsx

    pricing/
      page.tsx

    privacy/
      page.tsx

    terms/
      page.tsx

    contact/
      page.tsx

  components/
    Navbar.tsx
    Footer.tsx
    ToolLayout.tsx
    TextToolBox.tsx
    CsvUploader.tsx
    ResultBox.tsx
    StatsBox.tsx
    DownloadButtons.tsx
    ToolCard.tsx
    SeoContent.tsx

  lib/
    extractors.ts
    cleaners.ts
    validators.ts
    csv.ts
    downloads.ts
    tool-data.ts

  public/
    logo.svg
```

---

# 8. Recommended Libraries

## Required Libraries

```
npm install papaparse lucide-react
```

## TypeScript Types

```
npm install -D @types/papaparse
```

## Optional Later Libraries

```
npm install zod clsx tailwind-merge
```

Use optional libraries later only if needed.

---

# 9. Initial Setup Command

Create the project:

```
npx create-next-app@latest leadcleanr
```

Recommended choices:

```
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
App Router: Yes
src directory: No
Import alias: Yes
```

---

# 10. Deployment Flow

## Manual Deployment Flow

1. Push code to GitHub
2. SSH into DigitalOcean server
3. Pull latest code
4. Install dependencies
5. Build Next.js app
6. Restart app using PM2

---

## Deployment Commands

```
git pull origin main
npm install
npm run build
pm2 restart leadcleanr
```

---

# 11. Server Runtime Plan

Next.js app should run on port `3000`.

Build app:

```
npm run build
```

Start app with PM2:

```
pm2 start npm --name "leadcleanr" -- start
```

Nginx will forward public traffic to:

```
http://localhost:3000
```

---

# 12. Recommended DigitalOcean Droplet

## Minimum

```
1 vCPU
1 GB RAM
Ubuntu LTS
```

## Better For Smooth Builds

```
1 vCPU
2 GB RAM
Ubuntu LTS
```

The 2 GB RAM option is safer because `npm run build` can sometimes use more memory.

---

# 13. What Not To Add In MVP

Do not add these in version 1:

- User login
- Database
- Stripe payments
- AI extraction
- Email SMTP verification
- Team workspace
- Dashboard
- API access
- Cloud file storage
- Background jobs
- Rust backend
- Rust WebAssembly
- CRM integrations
- Google Sheets integration

These should come after traffic or user demand.

---

# 14. Future Stack

Add these only after users start using the product.

## Version 2 Stack

| Need | Recommended Tech |
| --- | --- |
| Database | PostgreSQL |
| Managed DB | Supabase or Neon |
| Auth | Clerk or Supabase Auth |
| Payments | Stripe |
| Analytics | Plausible, Umami, or PostHog |
| File Storage | Cloudflare R2 |
| API Routes | Next.js Route Handlers |
| Background Jobs | Inngest or Trigger.dev |

---

# 15. Rust Future Plan

Rust should not be used in the MVP.

Rust can be added later when LeadCleanr needs faster processing or paid large-file features.

---

## Rust Option 1: WebAssembly

Use Rust + WebAssembly for fast browser-side processing.

Good for:

- Large CSV cleaning
- Fast deduplication
- Large text parsing
- Email/domain extraction
- Privacy-first local processing

Future structure:

```
leadcleanr-wasm/
  Rust extraction engine
  compiled to WebAssembly
  imported into Next.js frontend
```

---

## Rust Option 2: Backend Microservice

Use Rust for server-side paid features.

Good for:

- Large file processing
- Batch CSV cleaning
- Email verification pipeline
- API processing
- Background jobs

Future architecture:

```
Next.js frontend
        ↓
Rust API service
        ↓
PostgreSQL / Redis
```

---

# 16. Development Roadmap

## Version 1: MVP

Build with:

```
Next.js + TypeScript + Tailwind CSS + PapaParse
DigitalOcean Droplet + Ubuntu + Nginx + PM2
```

MVP features:

- Extract emails
- Extract phone numbers
- Extract URLs
- Extract domains
- Remove duplicates
- Clean email list
- Upload CSV
- Preview CSV
- Clean CSV
- Export TXT
- Export CSV

---

## Version 2: Monetization

Add:

- Pro plan
- Stripe
- User login
- Larger file limits
- Saved workflows
- Email verification credits
- API access

---

## Version 3: Performance Upgrade

Add Rust only if needed:

- Rust + WebAssembly for browser-side speed
- Rust backend microservice for paid batch processing

---

# 17. Final Locked Stack

```
App: Next.js + TypeScript + Tailwind CSS
CSV: PapaParse
Text Processing: TypeScript regex and string functions
Hosting: DigitalOcean Droplet
Server: Ubuntu + Nginx + PM2
Domain: Namecheap
SSL: Let’s Encrypt
Database: None for MVP
Login: None for MVP
Payments: Later
Rust: Later, not MVP
```

---

# 18. Final Decision

LeadCleanr MVP should be built with a simple browser-first architecture.

The goal is not to build a complex SaaS on day one.

The goal is to launch fast, rank SEO pages, validate demand, and then add paid features later.