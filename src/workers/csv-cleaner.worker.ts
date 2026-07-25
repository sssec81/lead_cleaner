import {
  cleanCsvRows,
  type DuplicateMode,
  type EmailFilterMode,
} from "../lib/csv-cleaner";
import type { CsvRow } from "../lib/csv";

type CleanerWorkerRequest = {
  requestId: number;
  rows: CsvRow[];
  headers: string[];
  selectedColumn: string;
  duplicateMode: DuplicateMode;
  emailFilter: EmailFilterMode;
};

const workerScope = globalThis as unknown as {
  onmessage: ((event: MessageEvent<CleanerWorkerRequest>) => void) | null;
  postMessage: (value: unknown) => void;
};

workerScope.onmessage = (event) => {
  const {
    requestId,
    rows,
    headers,
    selectedColumn,
    duplicateMode,
    emailFilter,
  } = event.data;

  workerScope.postMessage({
    requestId,
    result: cleanCsvRows(
      rows,
      headers,
      selectedColumn,
      duplicateMode,
      emailFilter,
    ),
  });
};
