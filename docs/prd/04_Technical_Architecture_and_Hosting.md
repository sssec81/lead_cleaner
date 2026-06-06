# Technical Architecture, Hosting & SEO

This document outlines the system architecture, hosting setup, page routing structure, and SEO implementation for LeadCleanr.

## 1. System Architecture

LeadCleanr is built as a static/client-side focused application using Next.js. Most data processing occurs locally within the client browser.

```
[User Input/File] ──> [React Tool State] ──> [TypeScript Parser Engine (regex/cleaners)] 
                                                                │
                                                                ▼
[Instant Local Export] <── [Browser Blob API] <── [Updated Results & Stats State]
```

### Core Technologies
- **Framework:** Next.js (App Router) for static rendering and page layouts.
- **Language:** TypeScript for strong-typed parsing logic and utility structures.
- **Styling:** Tailwind CSS for a premium dark-mode styling scheme.
- **CSV Engine:** `PapaParse` for browser streaming.
- **Icons:** `lucide-react`.

---

## 2. Page & Directory Structure

The project structure organizes routes under the App Router model, with components separated for modularity.

- **Main Route Config:** [src/app/layout.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/app/layout.tsx)
- **Tools Catalog Page:** [src/app/tools/page.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/app/tools/page.tsx)
- **Shared Components:**
  - [TextProcessingTool](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/components/text-processing-tool.tsx)
  - [CsvUploader](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/components/csv-uploader.tsx)
- **Utility Logic:**
  - [text-tools.ts](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts)
  - [csv.ts](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/csv.ts)

---

## 3. Programmatic SEO Strategy

Growth relies on ranking for tool-specific, long-tail keywords. Each tool page is deployed as a standalone, crawlable landing page.

### Sitemap & Keyword Mapping

| Route Slug | Target Keyword | H1 Page Title | SEO Helper |
| :--- | :--- | :--- | :--- |
| `/` | LeadCleanr | Clean Messy Lead Lists Instantly | [sitemap.ts](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/app/sitemap.ts) |
| `/tools` | Lead cleaning tools | Standalone Lead Cleaning & Formatting Tools | [tools/page.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/app/tools/page.tsx) |
| `/tools/extract-emails-from-text` | extract emails from text | Extract Emails from Text Online | [seo.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/seo.tsx) |
| `/tools/extract-phone-numbers-from-text` | extract phone numbers from text | Extract Phone Numbers from Text Online | [seo.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/seo.tsx) |
| `/tools/extract-urls-from-text` | extract URLs from text | Extract URLs from Text Online | [seo.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/seo.tsx) |
| `/tools/extract-domains-from-emails` | extract domains from email list | Extract Domains from Email List | [seo.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/seo.tsx) |
| `/tools/remove-duplicate-emails` | remove duplicate emails | Remove Duplicate Emails Online | [seo.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/seo.tsx) |
| `/tools/clean-email-list` | clean email list online | Clean Email List Online | [seo.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/seo.tsx) |
| `/tools/csv-lead-cleaner` | CSV lead cleaner | CSV Lead Cleaner & Deduplicator | [seo.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/seo.tsx) |
| `/tools/extract-emails-from-csv` | extract emails from CSV | Extract Emails from CSV Online | [seo.tsx](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/seo.tsx) |

---

## 4. Hosting & Deployment Setup (DigitalOcean)

The application is deployed on a Linux Ubuntu droplet with a simple reverse proxy structure:
1. **Server Platform:** DigitalOcean Droplet (1 vCPU, 2GB RAM).
2. **Reverse Proxy:** Nginx (listening on 80/443 and routing to port 3000).
3. **SSL Management:** Let's Encrypt managed by Certbot.
4. **Process Management:** PM2 daemon to manage the Next.js production server.

Detailed droplet deployment steps are maintained in [DEPLOYMENT_DO_DROPLET.md](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/DEPLOYMENT_DO_DROPLET.md).

---

## 5. Privacy & Acceptable Use Policies

Due to GDPR/SOC2 compliance concerns when handling B2B leads, the following guidelines are hardcoded in application layouts:
- **Zero Storage policy:** Processing occurs 100% locally in the browser. Pasted text or uploaded CSV content is never transmitted to an external server.
- **Acceptable Use:** Users are solely responsible for compliance with local regulations (CAN-SPAM, GDPR). The product must not be utilized for bulk spam enrichment or malicious scraping.
