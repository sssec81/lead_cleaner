# Future Enhancements & Tech Debt

Based on current repository audits, the following items are logged for future implementation:

## Completed: Bound Undo/Redo Memory
Text and CSV configuration history now enforce a maximum depth of 30 steps.

## 2. Standardize Extraction Statistics
The [ExtractionStats](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L9) objects returned by different [text-tools.ts](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts) functions are calculated inconsistently. For example, [cleanEmailList](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L36) accurately tracks `invalidRemoved` based on split strings, while [extractEmailsFromText](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L16) hardcodes `invalidRemoved` to `0` because of how `.match()` behaves.
*   **Action:** Standardize the definition of "Total Found" and "Invalid Removed" so the workspace stats UI conveys a consistent meaning regardless of which text tool is active.

## Completed: Enhance Phone Number Parsing
International parsing and formatting now use `libphonenumber-js`, with the lightweight expression retained only for candidate discovery.

## 4. UI Hydration Polish
To prevent any visual popping or layout shifts when `localStorage` loads the previous session into the workspace, the tool should implement a skeleton loader or an `opacity-0` transition tied to the `isHydrated` state flag.

## Completed: Web Workers for CSV Processing
Uploaded files use Papa Parse worker mode, and the main CSV cleanup calculation runs in a dedicated worker with a safe browser fallback. Synchronous text parsing remains limited to samples and small in-memory inputs.
