# CODEX.md

## Project

LeadCleanr is a browser-first utility product for cleaning messy lead and contact data.

Core promise:

Paste messy text or upload a CSV. Instantly extract, clean, deduplicate, and export lead data.

## Source Docs

Primary planning context lives in:

- `Web2 Startup/LeadCleanr — Product Requirements Document 3737115532d180f59d3eded01157a6bf.md`
- `Web2 Startup/LeadCleanr — MVP Feature List 3737115532d180ca850cd8f8cee03ecc.md`
- `Web2 Startup/LeadCleanr — Tech Stack Document 3737115532d1805e88b8e4685e2cd954.md`
- `Web2 Startup/LeadCleanr — Website Page Structure 3737115532d1808aaf13cf1f3a8f4c5a.md`

If there is any conflict, prefer the latest explicit user instruction, then this file, then the source docs.

## Product Positioning

- Users: sales teams, recruiters, marketers, agencies, virtual assistants, small businesses, freelancers, and data-entry workers.
- Main value: turn messy text or CSV lead data into clean, usable lists quickly.
- Privacy positioning: basic processing should happen in the browser whenever possible.
- Trust positioning: do not store pasted text or uploaded CSV files in the MVP.

## Locked MVP Scope

Build only the simple MVP first.

Included:

1. Paste text input
2. Extract emails
3. Extract phone numbers
4. Extract URLs
5. Extract domains
6. Remove duplicates
7. Clean and lowercase emails
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

Explicitly out of scope for MVP:

- User login
- Dashboard
- Database
- Stripe payments
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

## Tech Direction

Use this stack unless the user asks to change it:

- Next.js
- React
- TypeScript
- Tailwind CSS
- PapaParse
- `lucide-react`

Implementation guidance:

- Keep the first version mostly client-side.
- Use TypeScript regex and string utilities for extraction and cleaning.
- Use browser Blob APIs for TXT/CSV export.
- Prefer simple, readable utility functions over premature abstraction.

Deployment target for later:

- DigitalOcean Droplet
- Ubuntu
- Nginx
- PM2
- Namecheap domain
- Let's Encrypt SSL

## Website Structure

Main pages:

- `/`
- `/tools`
- `/pricing`
- `/privacy`
- `/terms`
- `/contact`

Initial SEO tool pages:

- `/tools/extract-emails-from-text`
- `/tools/extract-phone-numbers-from-text`
- `/tools/extract-urls-from-text`
- `/tools/extract-domains-from-emails`
- `/tools/remove-duplicate-emails`
- `/tools/clean-email-list`
- `/tools/csv-lead-cleaner`
- `/tools/extract-emails-from-csv`

## Build Order

Build in this order unless the user reprioritizes:

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

## UX Requirements

- Keep the product simple, fast, and useful.
- Put the working tool above the fold on tool pages.
- Show clear stats after processing.
- Support copy and download actions.
- Make mobile layout work well.
- Emphasize privacy and browser-first processing.
- Do not overbuild with dashboard-style complexity in MVP.

Suggested home page sections:

- Navbar
- Hero
- Mini tool preview
- Popular tool cards
- How it works
- Use cases
- Privacy section
- Pricing CTA
- FAQ
- Footer

## Tool Page Template

Each tool page should generally include:

1. SEO-focused H1
2. Short description
3. Working tool UI
4. Stats box
5. How-to-use section
6. Use cases
7. Privacy message
8. Related tools
9. FAQ

## SEO Rules

- Each tool page should target one primary keyword.
- Each page should have a unique title tag, meta description, and H1.
- Keep URLs clean and descriptive.
- Add related internal links between tools.
- The actual tool should be visible above the fold.

Primary keyword mapping:

- `extract emails from text`
- `extract phone numbers from text`
- `extract URLs from text`
- `extract domains from email list`
- `remove duplicate emails`
- `clean email list online`
- `CSV lead cleaner`
- `extract emails from CSV`

## Privacy And Compliance

Always preserve these product messages unless the user changes them:

- Basic cleaning runs in your browser.
- We do not store pasted text or uploaded CSV files in the MVP.
- No login is required for MVP.
- Do not track or store user CSV contents or pasted text in analytics.

Important acceptable-use line:

LeadCleanr is for cleaning data you own or have permission to process. Do not use it for spam, scraping abuse, or sending unsolicited messages.

## Acceptance Criteria

Text tool is complete when:

- User can paste text
- User can run extraction
- Tool displays clean results
- Tool removes duplicates
- Tool shows stats
- User can copy results
- User can download TXT
- User can download CSV
- Page includes basic SEO metadata
- Page includes privacy and related-tools sections

CSV tool is complete when:

- User can upload CSV
- CSV is parsed in the browser
- Tool previews first 100 to 500 rows
- User can select a column
- Tool can deduplicate by selected column
- Tool can remove empty rows
- Tool shows cleaning stats
- User can download clean CSV
- Tool handles invalid CSV gracefully

## Working Preferences For Codex

- Start with the MVP and do not add future-scope features without being asked.
- Prefer browser-side implementation over backend work.
- Optimize for fast launch and clarity over cleverness.
- When making tradeoffs, protect privacy messaging and SEO page usefulness.
- If implementation details are unclear, align with the product docs above rather than inventing a broader SaaS.
