# LeadCleanr — Product Requirements Document

## 1. Product Summary

**Product Name:** LeadCleanr

**Product Type:** Online utility SaaS tool

**Core Promise:**

Paste messy text or upload a CSV. Instantly extract, clean, deduplicate, and export lead data.

**One-Line Positioning:**

LeadCleanr helps sales teams, recruiters, marketers, agencies, and virtual assistants clean messy lead lists by extracting emails, phone numbers, URLs, and domains from text or CSV files.

---

# 2. Problem Statement

People working with lead/contact data often deal with messy, unstructured, or duplicated information.

Common problems:

- Emails are mixed inside long blocks of text
- Phone numbers are copied from messy sources
- CRM exports contain duplicate rows
- CSV files have blank rows or inconsistent columns
- Lead lists contain invalid-looking emails
- Users waste time manually cleaning data in spreadsheets
- Non-technical users do not know how to use regex
- Agencies and VAs repeat the same cleanup work again and again

LeadCleanr solves this by turning messy text or CSV data into clean, usable lead lists.

---

# 3. Target Users

## Primary Users

- Sales teams
- Recruiters
- Marketers
- Agencies
- Virtual assistants
- Small business owners
- Data entry workers
- Freelancers handling lead data

## Secondary Users

- Startup founders
- Cold outreach teams
- HR teams
- CRM users
- Newsletter operators
- Admin assistants

---

# 4. User Pain Points

| User Type | Pain Point |
| --- | --- |
| Salesperson | Has messy lead lists from websites, events, or CRM exports |
| Recruiter | Needs to extract emails/phones from resumes or copied profiles |
| Marketer | Needs to clean email lists before campaigns |
| Agency | Cleans many client lead files repeatedly |
| VA | Spends hours formatting and deduplicating contact lists |
| Small Business Owner | Wants a simple tool without Excel complexity |

---

# 5. Product Goals

## MVP Goals

1. Let users paste messy text and extract useful lead data.
2. Let users upload small CSV files and clean basic lead columns.
3. Provide instant results without login.
4. Keep basic processing browser-first for privacy.
5. Create SEO-focused tool pages.
6. Launch quickly without backend, database, or payments.
7. Validate demand before building paid features.

## Business Goals

1. Build organic SEO traffic.
2. Convert repeat users into future paid users.
3. Add paid upgrades later for large files, batch processing, saved workflows, and API access.
4. Build a simple utility product that can grow into a micro-SaaS.

---

# 6. Non-Goals For MVP

Do not build these in version 1:

- User login
- Dashboard
- Stripe payments
- Database
- AI extraction
- Email SMTP verification
- Team workspace
- API access
- Google Sheets integration
- CRM integration
- Chrome extension
- Cloud file storage
- Rust backend
- Rust WebAssembly
- Complex country-level phone validation

These can be added after traffic or user demand.

---

# 7. MVP Scope

## MVP Core Features

LeadCleanr MVP will include:

1. Paste text input
2. Extract emails
3. Extract phone numbers
4. Extract URLs
5. Extract domains
6. Remove duplicates
7. Clean/lowercase emails
8. Sort results
9. Copy results
10. Download TXT
11. Download CSV
12. Upload CSV
13. Preview CSV
14. Select CSV column
15. Deduplicate by selected column
16. Delete empty rows
17. Export clean CSV
18. Show cleaning stats
19. Separate SEO pages for each tool

---

# 8. Feature Requirements

## 8.1 Text Input Tools

Users should be able to paste messy text into a textarea and extract structured data.

| Feature | Requirement |
| --- | --- |
| Extract Emails | Detect and return email addresses from pasted text |
| Extract Phone Numbers | Detect phone numbers from pasted text |
| Extract URLs | Detect website links and URLs |
| Extract Domains | Extract domains from emails or URLs |
| Remove Duplicates | Remove repeated emails, phones, URLs, or domains |
| Clean Emails | Trim spaces, lowercase emails, remove blank/broken entries |
| Sort Results | Sort output alphabetically |
| Copy Result | Copy cleaned output to clipboard |
| Download TXT | Download cleaned result as `.txt` |
| Download CSV | Download cleaned result as `.csv` |

---

## 8.2 CSV Upload Tools

Users should be able to upload a CSV lead/contact file and clean it.

| Feature | Requirement |
| --- | --- |
| Upload CSV | User can upload a `.csv` file |
| Preview CSV | Show first 100–500 rows |
| Select Column | User can choose email, phone, name, company, or website column |
| Remove Duplicate Rows | Deduplicate rows by selected column |
| Clean Email Column | Lowercase, trim, remove blank/bad emails |
| Clean Phone Column | Trim spaces and optionally remove symbols |
| Delete Empty Rows | Remove rows with no useful data |
| Export Clean CSV | Download cleaned CSV file |

---

## 8.3 Result Summary

After extraction or cleaning, show a stats box.

Example stats:

- 2,430 emails found
- 318 duplicates removed
- 97 invalid entries removed
- 2,015 clean leads ready

Purpose:

- Show instant value
- Build user trust
- Make the tool feel useful and professional

---

# 9. MVP Limits

For launch, keep it free with soft limits.

| Feature | Free Limit |
| --- | --- |
| Text paste | Up to 50,000 characters |
| CSV upload | Up to 2 MB |
| CSV preview | Up to 500 rows |
| Export | TXT + CSV |
| Login | Not required |
| Basic tools | Free |

---

# 10. User Flows

## Flow 1: Extract From Text

1. User opens a tool page.
2. User pastes messy text.
3. User clicks an extraction button.
4. Tool extracts emails, phones, URLs, or domains.
5. Tool removes duplicates if selected.
6. Tool shows results and stats.
7. User copies result or downloads TXT/CSV.

---

## Flow 2: Clean Email List

1. User opens “Clean Email List” page.
2. User pastes a list of emails.
3. Tool trims spaces and lowercases emails.
4. Tool removes blank lines.
5. Tool removes duplicate emails.
6. Tool removes invalid-looking entries.
7. User downloads clean list.

---

## Flow 3: Clean CSV Lead File

1. User opens “CSV Lead Cleaner” page.
2. User uploads CSV file.
3. Tool previews first 100–500 rows.
4. User selects email or phone column.
5. User clicks “Clean Leads”.
6. Tool removes duplicates and blank rows.
7. Tool shows cleaning stats.
8. User downloads clean CSV.

---

# 11. Website Structure

## Main Pages

```
/
```

Home page

```
/tools
```

All tools page

```
/pricing
```

Pricing page

```
/privacy
```

Privacy page

```
/terms
```

Terms page

```
/contact
```

Contact page

---

## SEO Tool Pages

Build these first:

```
/tools/extract-emails-from-text
/tools/extract-phone-numbers-from-text
/tools/extract-urls-from-text
/tools/extract-domains-from-emails
/tools/remove-duplicate-emails
/tools/clean-email-list
/tools/csv-lead-cleaner
/tools/extract-emails-from-csv
```

---

# 12. Homepage Requirements

## Navbar

Navbar links:

- Logo
- Tools
- Pricing
- Privacy

---

## Hero Section

**Headline:**

Clean messy lead lists instantly

**Subheadline:**

Paste text or upload a CSV to extract emails, phone numbers, URLs, domains, and remove duplicates.

**CTA Buttons:**

- Start Cleaning Free
- Upload CSV

---

## Homepage Mini Tool

Homepage should include a small tool preview.

Example:

- Text input box
- Extract Emails button
- Extract Phones button
- Clean CSV button

---

## Popular Tools Section

Show tool cards:

- Extract Emails
- Remove Duplicate Emails
- Clean Email List
- CSV Lead Cleaner
- Extract Phone Numbers
- Extract Domains

---

## How It Works Section

1. Paste text or upload CSV
2. Extract and clean lead data
3. Export clean list

---

## Who It Is For Section

- Sales teams
- Recruiters
- Marketers
- Agencies
- Virtual assistants
- Small businesses

---

## Privacy Section

Message:

Basic tools run in your browser. Your pasted text and uploaded CSV files are not stored.

---

## Final CTA

Start cleaning your lead list free.

---

# 13. Individual Tool Page Template

Every tool page should follow the same structure.

Example:

```
/tools/extract-emails-from-text
```

## Tool Page Sections

### 1. SEO H1

Example:

Extract Emails from Text Online

### 2. Short Description

Example:

Paste messy text and instantly extract all email addresses. Remove duplicates, clean results, and download as TXT or CSV.

### 3. Tool Box

Left side:

- Paste text area
- Sample text button
- Clear button

Main action button:

- Extract Emails

Right side:

- Results box
- Copy button
- Download TXT
- Download CSV
- Remove Duplicates
- Sort A-Z

### 4. Stats Box

Example:

- 234 emails found
- 31 duplicates removed
- 203 clean emails ready

### 5. How To Use

1. Paste your text
2. Click Extract Emails
3. Copy or download your cleaned list

### 6. Use Cases

Useful for:

- Sales teams
- Recruiters
- Marketers
- Agencies
- Virtual assistants
- Data entry workers

### 7. Privacy Section

Message:

Your text is processed in your browser. We do not upload or store your data.

### 8. Related Tools

Show internal links:

- Remove Duplicate Emails
- Clean Email List
- Extract Domains
- CSV Lead Cleaner

### 9. FAQ

Example FAQ questions:

- Is this email extractor free?
- Can I remove duplicate emails?
- Can I download results as CSV?
- Is my data stored?
- Can I upload CSV files?
- Does this verify if emails are real?

---

# 14. Pricing Page Requirements

Even if payment is not active, create the pricing page early.

## Free Plan

Includes:

- Paste text
- Extract emails, phones, URLs, domains
- Small CSV upload
- Export TXT/CSV
- Basic cleaning tools

## Pro — Coming Soon

Future features:

- Large CSV files
- Batch cleaning
- Saved workflows
- No ads
- Faster processing

## Business/API — Coming Soon

Future features:

- API access
- Team workspace
- Email verification credits
- Bulk processing
- Priority support

---

# 15. Privacy Requirements

The privacy page should clearly state:

- Basic cleaning runs in the browser
- Pasted text is not stored
- Uploaded CSV files are not stored in MVP
- Data is processed locally where possible
- No login is required for MVP
- No payment data is collected in MVP
- Analytics/cookies may be added later and should be disclosed when added

Main privacy message:

Basic cleaning runs in your browser. We do not store your pasted text or uploaded CSV files.

---

# 16. Terms / Acceptable Use

Include this important line:

LeadCleanr is for cleaning data you own or have permission to process. Do not use it for spam, scraping abuse, or sending unsolicited messages.

Other terms should mention:

- User is responsible for their own data
- Tool may not extract data perfectly
- LeadCleanr does not guarantee email deliverability
- LeadCleanr MVP does not verify inbox existence
- Users should follow email marketing and privacy laws in their region

---

# 17. Technical Requirements

## Final MVP Stack

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
| Database | None for MVP |
| Auth/Login | None for MVP |
| Payments | Later |
| Rust | Later, not MVP |

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

## MVP Processing Strategy

Most processing should happen inside the browser.

```
User pastes text or uploads CSV
        ↓
Browser processes data locally
        ↓
LeadCleanr extracts and cleans data
        ↓
User downloads TXT or CSV
```

Benefits:

- Lower server cost
- Faster result
- Better privacy
- No file storage needed
- No database needed
- Easier MVP launch

---

# 18. Project Folder Structure

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

# 19. Required Libraries

```bash
npm install papaparse lucide-react
npm install -D @types/papaparse
```

Optional later:

```bash
npm install zod clsx tailwind-merge
```

---

# 20. SEO Requirements

Each tool page should have:

- Unique H1
- Unique title tag
- Unique meta description
- One primary keyword
- Short explanation
- Actual working tool above the fold
- FAQ section
- Related tools internal links
- Privacy/trust message
- Clean URL slug

## Primary SEO Pages

| Page | Primary Keyword |
| --- | --- |
| `/tools/extract-emails-from-text` | extract emails from text |
| `/tools/extract-phone-numbers-from-text` | extract phone numbers from text |
| `/tools/extract-urls-from-text` | extract URLs from text |
| `/tools/extract-domains-from-emails` | extract domains from email list |
| `/tools/remove-duplicate-emails` | remove duplicate emails |
| `/tools/clean-email-list` | clean email list online |
| `/tools/csv-lead-cleaner` | CSV lead cleaner |
| `/tools/extract-emails-from-csv` | extract emails from CSV |

---

# 21. Analytics Requirements

For MVP, track basic usage only.

Recommended events:

- Page view
- Tool used
- Text pasted
- CSV uploaded
- Copy clicked
- TXT downloaded
- CSV downloaded
- Duplicate removal used
- Error occurred

Do not track or store user’s pasted text or CSV content.

Possible analytics tools later:

- Plausible
- Umami
- PostHog

---

# 22. Success Metrics

## MVP Success Metrics

| Metric | Target |
| --- | --- |
| First launch | 8 tool pages live |
| Tool usage | 100+ tool uses |
| Organic impressions | Start appearing in Google Search Console |
| Download rate | Users downloading TXT/CSV |
| Repeat usage | Users returning to use tools |
| Feedback | Users requesting larger file/batch features |

## Early Business Validation

Strong signs:

- Users upload CSV files
- Users download cleaned results
- Users search specifically for lead cleaning tools
- Users ask for bulk processing
- Users ask for email verification
- Users ask for saved workflows
- Users ask for API access

---

# 23. Monetization Plan

Do not monetize too early. First validate usage.

## Future Paid Features

| Paid Feature | Reason People May Pay |
| --- | --- |
| Large CSV upload | Business users have big lead files |
| Batch file cleaning | Agencies clean many files |
| Saved workflows | Repeat same cleaning steps |
| Email verification credits | Strong monetization feature |
| API access | B2B/developer revenue |
| Team workspace | Agency/team use |
| No ads | Simple upgrade |
| Export to Google Sheets | Useful later |
| CRM export | Useful for sales teams later |

## Possible Pricing Later

Free:

- Basic text tools
- Small CSV upload
- TXT/CSV export

Pro:

- Large CSV files
- Saved workflows
- Batch cleaning
- No ads

Business/API:

- API access
- Team workspace
- Email verification credits
- Priority support

---

# 24. Build Order

Build in this order:

1. `/tools/extract-emails-from-text`
2. `/tools/remove-duplicate-emails`
3. `/tools/clean-email-list`
4. `/tools/extract-phone-numbers-from-text`
5. `/tools/extract-urls-from-text`
6. `/tools/extract-domains-from-emails`
7. `/tools/csv-lead-cleaner`
8. `/tools/extract-emails-from-csv`
9. `/tools`
10. `/`
11. `/pricing`
12. `/privacy`
13. `/terms`
14. `/contact`

---

# 25. Development Roadmap

## Version 1: MVP

Build:

- Text extraction tools
- CSV cleaner
- SEO pages
- Home page
- Tools page
- Pricing page
- Privacy page
- Terms page
- Contact page

No login, no database, no payments.

---

## Version 2: Monetization Layer

Add:

- User accounts
- Stripe payment
- Larger file limits
- Saved workflows
- Batch cleaning
- No ads
- Basic analytics dashboard

---

## Version 3: Business/API Layer

Add:

- API access
- Email verification credits
- Team workspace
- Bulk jobs
- Google Sheets export
- CRM export

---

## Version 4: Rust Performance Upgrade

Add Rust only if needed.

Possible Rust use cases:

- Rust + WebAssembly for browser-side large CSV processing
- Rust backend microservice for paid batch processing
- Faster parsing and deduplication
- Large file processing pipeline

Rust is not required for MVP.

---

# 26. Acceptance Criteria

## Text Tool Acceptance Criteria

A text tool is complete when:

- User can paste text
- User can run extraction
- Tool displays clean results
- Tool removes duplicates
- Tool shows stats
- User can copy results
- User can download TXT
- User can download CSV
- Page has SEO title and meta description
- Page has related tools links
- Page has FAQ section
- Page has privacy message

---

## CSV Tool Acceptance Criteria

CSV tool is complete when:

- User can upload CSV
- Tool parses CSV in browser
- Tool previews first 100–500 rows
- User can select column
- User can deduplicate by selected column
- User can delete empty rows
- Tool shows cleaning stats
- User can download clean CSV
- Tool does not store uploaded file
- Tool handles invalid CSV gracefully

---

## Website Acceptance Criteria

Website MVP is complete when:

- Home page is live
- All Tools page is live
- 8 SEO tool pages are live
- Pricing page is live
- Privacy page is live
- Terms page is live
- Contact page is live
- Mobile layout works
- Basic SEO metadata exists
- Internal links work
- No login is required
- No backend/database is required

---

# 27. Risks and Mitigation

| Risk | Mitigation |
| --- | --- |
| Generic tool competition | Focus on lead list cleaning niche |
| Low SEO traffic early | Build multiple specific tool pages |
| Users do not trust data handling | Emphasize browser-first privacy |
| Regex misses edge cases | Keep improving extractors based on feedback |
| CSV files have messy formats | Start with simple CSV handling, improve later |
| Too much scope | Avoid login, AI, payments, dashboard in MVP |
| Monetization unclear early | Validate usage before paid features |

---

# 28. Final Decision

LeadCleanr MVP should be a simple, browser-first utility website for cleaning lead data.

The first version should focus on:

- Fast launch
- Useful free tools
- SEO pages
- Local/browser-side processing
- TXT/CSV export
- No login
- No database
- No payment

The goal is to launch quickly, validate demand, collect usage signals, and then add monetization features later.

Final locked MVP:

```
LeadCleanr = Text extraction + CSV lead cleaning + SEO tool pages
```

Final locked stack:

```
Next.js + TypeScript + Tailwind CSS + PapaParse
DigitalOcean Droplet + Ubuntu + Nginx + PM2
Namecheap domain
Let’s Encrypt SSL
Rust later, not MVP
```