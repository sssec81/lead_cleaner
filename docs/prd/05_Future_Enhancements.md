# Future Enhancements & Tech Debt

Based on current repository audits, the following items are logged for future implementation:

## 1. Prevent Memory Leaks in Undo/Redo
Currently, the [TextProcessingTool](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/components/text-processing-tool.tsx) copies the entire [WorkspaceItem](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/components/text-processing-tool.tsx#L50) array into the [pastWorkspace](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/components/text-processing-tool.tsx#L91) and [futureWorkspace](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/components/text-processing-tool.tsx#L92) history stacks on every user action. For users performing hundreds of actions on massive datasets, this unbounded stack will eventually cause browser tab crashes due to out-of-memory exceptions.
*   **Action:** Implement a hard ceiling (e.g., maximum depth of 30 steps) on the undo/redo stack using `.slice(-30)`.

## 2. Standardize Extraction Statistics
The [ExtractionStats](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L9) objects returned by different [text-tools.ts](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts) functions are calculated inconsistently. For example, [cleanEmailList](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L36) accurately tracks `invalidRemoved` based on split strings, while [extractEmailsFromText](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L16) hardcodes `invalidRemoved` to `0` because of how `.match()` behaves.
*   **Action:** Standardize the definition of "Total Found" and "Invalid Removed" so the workspace stats UI conveys a consistent meaning regardless of which text tool is active.

## 3. Enhance Phone Number Parsing
The current [PHONE_REGEX](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/text-tools.ts#L3) is a lightweight heuristic `/(?:\+?\d[\d().\-\s]{6,}\d)/g`. While fast, it is prone to capturing non-phone-number digits (like serial numbers or equations).
*   **Action:** Integrate a specialized parsing library such as `libphonenumber-js` to vastly improve international phone number detection and formatting accuracy.

## 4. UI Hydration Polish
To prevent any visual popping or layout shifts when `localStorage` loads the previous session into the workspace, the tool should implement a skeleton loader or an `opacity-0` transition tied to the `isHydrated` state flag.

## 5. Web Workers for PapaParse
While PapaParse is fast, extremely large CSVs (1M+ rows) parsed on the main thread will cause the UI to lock up.
*   **Action:** Move [parseCsvText](file:///Users/shamanjungshah/Desktop/money/lead_cleaner/src/lib/csv.ts#L159) logic into a background Web Worker so the UI can remain responsive and display accurate progress bars (`isParsing` state) without stuttering.

