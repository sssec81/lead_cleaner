# LeadCleanr — MVP Feature List

## 1. Main MVP Promise

**“Paste messy text or upload a CSV. Instantly extract, clean, deduplicate, and export lead data.”**

LeadCleanr is a focused online utility tool for cleaning messy lead/contact data. It combines text extraction tools with CSV cleaning tools.

The MVP should stay simple, fast, and browser-first.

---

# 2. Target Users

LeadCleanr is mainly for:

- Sales teams
- Recruiters
- Marketers
- Agencies
- Virtual assistants
- Small business owners
- Data entry workers
- Freelancers handling lead lists

---

# 3. Core Use Case

Users often have messy lead data from:

- Copied website text
- LinkedIn text
- Email lists
- CRM exports
- Google Sheets exports
- CSV files
- Contact forms
- Scraped or copied business data
- Old lead databases

LeadCleanr helps them turn messy data into clean, usable lead lists.

---

# 4. Phase 1 MVP Features

## A. Text Input Tools

Users can paste messy text and extract useful data.

| Feature | What It Does |
| --- | --- |
| Extract Emails | Finds all email addresses from pasted text |
| Extract Phone Numbers | Finds phone numbers from messy text |
| Extract URLs | Finds links and website URLs |
| Extract Domains | Extracts domains from emails or URLs |
| Remove Duplicates | Removes repeated emails, phones, URLs, or domains |
| Clean Emails | Lowercase emails, trim spaces, remove broken entries |
| Sort Results | Sort results A-Z |
| Copy Result | One-click copy cleaned data |
| Download TXT | Download cleaned list as `.txt` |
| Download CSV | Download cleaned data as `.csv` |

---

## B. CSV Upload Tools

Users can upload a CSV lead/contact file and clean it.

| Feature | What It Does |
| --- | --- |
| Upload CSV | Upload messy lead/contact CSV file |
| Preview CSV | Show first 100–500 rows |
| Select Column | Choose email, phone, name, company, or website column |
| Remove Duplicate Rows | Deduplicate by email or phone |
| Clean Email Column | Lowercase, trim, remove blank/bad emails |
| Clean Phone Column | Trim spaces and optionally remove symbols |
| Delete Empty Rows | Remove rows with no useful data |
| Export Clean CSV | Download cleaned CSV file |

---

## C. Result Summary

After cleaning, show useful stats.

| Stat | Example |
| --- | --- |
| Total items found | 2,430 emails found |
| Duplicates removed | 318 duplicates removed |
| Invalid entries removed | 97 bad emails removed |
| Final clean leads | 2,015 clean leads ready |

This is important because users immediately see the value of the tool.

---

# 5. MVP Pages To Build

Build these pages first:

1. Home page
2. All Tools page
3. Extract Emails from Text
4. Extract Phone Numbers from Text
5. Extract URLs from Text
6. Extract Domains from Emails
7. Remove Duplicate Emails
8. Clean Email List
9. CSV Lead Cleaner
10. Extract Emails from CSV
11. Pricing page
12. Privacy page
13. Terms page
14. Contact page

Each tool page should target one SEO keyword.

---

# 6. Best Home Page Structure

## Hero Section

**Headline:**

Clean messy lead lists instantly

**Subheadline:**

Paste text or upload a CSV to extract emails, phone numbers, URLs, domains, and remove duplicates.

**Buttons:**

- Start Cleaning Free
- Upload CSV

---

## Tool Cards

Show cards for:

- Extract Emails
- Extract Phone Numbers
- Remove Duplicate Emails
- Clean Email List
- Extract Domains
- CSV Lead Cleaner
- Extract Emails from CSV
- Export Clean CSV

---

## Privacy Section

Very important positioning:

**Your data stays private. Basic cleaning runs in your browser.**

This builds trust because lead/contact data is sensitive.

---

# 7. Free MVP Limits

Keep launch free with soft limits.

| Feature | Free Limit |
| --- | --- |
| Text paste | Up to 50,000 characters |
| CSV upload | Up to 2 MB |
| Preview rows | 500 rows |
| Export | TXT + CSV |
| Tools | All basic tools free |
| Login | Not required |

---

# 8. Paid Features Later, Not MVP

Do not build these first. Keep them for future monetization.

| Paid Feature | Why People May Pay |
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

---

# 9. Exact MVP User Flows

## Flow 1: Paste Text

User opens tool

→ Pastes messy text

→ Clicks “Extract Emails”

→ Tool shows clean list

→ User removes duplicates

→ User copies or downloads result

---

## Flow 2: Upload CSV

User uploads CSV

→ Tool previews rows

→ User selects email or phone column

→ Clicks “Clean Leads”

→ Tool removes duplicates and blanks

→ User downloads clean CSV

---

# 10. MVP Tech Scope

Keep it simple.

| Area | Recommendation |
| --- | --- |
| Frontend | Next.js + React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| CSV Parsing | PapaParse |
| Text Extraction | TypeScript regex |
| File Export | Browser Blob API |
| Hosting | DigitalOcean Droplet |
| Domain | Namecheap |
| Server | Ubuntu + Nginx + PM2 |
| SSL | Let’s Encrypt |
| Backend | Not needed for first MVP |
| Database | Not needed for first MVP |
| Login | Not needed for first MVP |
| Payment | Later |
| Rust | Later, not MVP |

First version should be mostly client-side.

---

# 11. What Not To Build In MVP

Avoid these in version 1:

- AI extractor
- Email SMTP verification
- Login system
- Team workspace
- Dashboard
- API
- Chrome extension
- Google Sheets integration
- CRM integration
- Fancy design editor
- Complex phone validation by country
- Rust backend
- Rust WebAssembly

These can come later after traffic or user demand.

---

# 12. Safety / Compliance Note

LeadCleanr should include this message in the Privacy or Terms page:

**LeadCleanr is for cleaning data you own or have permission to process. Do not use it for spam, scraping abuse, or sending unsolicited messages.**

This protects the product positioning.

---

# 13. Final MVP Feature Set

Build only this first:

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

# 14. Final MVP Goal

The goal is not to build a complex SaaS on day one.

The goal is to launch a useful free tool, publish SEO pages, collect usage signals, and later add paid features like large files, batch processing, saved workflows, email verification, and API access.