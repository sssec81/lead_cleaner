# MVP Functional Scope

This document specifies the feature requirements for the initial launch (MVP) of LeadCleanr, mapping specific utility requirements to their client-side implementations in the codebase.

## 1. Text Processing Utilities (Client-Side)

All text tools run client-side to ensure user privacy. They take an input string, apply cleaning/extraction logic, and output a list of matches along with stats. The core functions reside in [text-tools.ts](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts).

| Utility Tool | Core Regex / Logic Specification | Output Actions | Core Code Reference |
| :--- | :--- | :--- | :--- |
| **Extract Emails** | Matching pattern: `\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b` (Global, Case-Insensitive) | Copy to clipboard, Download TXT, Download CSV | [extractEmailsFromText](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L16) |
| **Extract Phone Numbers** | Matching pattern: `(?:\+?\d[\d().\-\s]{6,}\d)` normalized to strip formatting. | Copy to clipboard, Download TXT, Download CSV | [extractPhoneNumbersFromText](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L82) |
| **Extract URLs** | Matching pattern: `\b(?:https?:\/\/\|www\.)[^\s<>"'()]+...` to extract valid web links. | Copy to clipboard, Download TXT, Download CSV | [extractUrlsFromText](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L102) |
| **Extract Domains** | Extracts domains from emails (splits `@` suffix) or URL hosts. | Copy to clipboard, Download TXT, Download CSV | [extractDomainsFromEmails](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L122) |
| **Remove Duplicates** | Client-side deduplication using Javascript `Set`. | Real-time cleanup, updates Workspace state | [removeDuplicateEmails](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L58) |
| **Clean Email List** | Formats emails: trim whitespaces, convert to lowercase, discard invalid strings. | Cleaned array populated back to results box | [cleanEmailList](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L36) |
| **Sort Results** | Alphabetical sorting (A-Z) of extracted strings. | Re-renders sorted output list | Client-side sorting array logic |

---

## 2. CSV Processing Suite

The CSV clean-up path is the primary workspace utility. All data is processed using browser-side libraries to avoid server overhead and maintain privacy.

### Core CSV Features:
- **Local Parsing:** Handled via [csv.ts](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/csv.ts) utilizing `PapaParse` with a **2 MB** soft limit.
- **Interactive Grid Preview:** Renders the first 100–500 rows in memory before committing to export.
- **Smart Column Detection:** Scans the headers and sample row values (confidence scores are generated to auto-categorize columns as emails, phone numbers, URLs, or domains).
- **Targeted Sanitization:**
  - **Deduplication:** Remove entire rows containing duplicate values in the selected column.
  - **Whitespace & Format Normalization:** Trim whitespace, lowercase emails, and normalize phone numbers.
  - **Blank Row Purging:** Remove rows with blank or invalid values in the targeted column.
- **Blob Export:** Output files generated client-side using the browser `Blob` API in [export.ts](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/export.ts) for immediate download.

---

## 3. Real-Time Workspace Metrics

Every tool page rendering the workspace requires a stats display showing:
1. **Total Found:** Gross entries matched or parsed.
2. **Duplicates Removed:** Records stripped out due to duplicate presence.
3. **Invalid Entries Removed:** Number of entries that failed formatting or syntax validation (e.g. invalid emails).
4. **Final Clean Leads:** Net count of ready-to-export items.

---

## 4. MVP Limits

To preserve client-side performance, the following limits are enforced:
- **Maximum Text Paste Size:** 50,000 characters.
- **Maximum CSV Upload Size:** 2 MB.
- **CSV Preview Row Limit:** Up to 500 rows.

---

## 5. Non-Goals for MVP

The following items are out of scope for the MVP:
- **User Authentication / DB Persistence:** Workspace is stored only in browser `localStorage`.
- **Payments Integration:** No checkout pages or billing gateways.
- **Cloud Storage:** No server databases or cloud file stores for CSV logs.
- **AI-based Extraction / Server-side validation:** Out-of-scope until demand is proven.
