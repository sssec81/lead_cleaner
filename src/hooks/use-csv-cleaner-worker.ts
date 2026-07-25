"use client";

import { useEffect, useRef, useState } from "react";

import {
  cleanCsvRows,
  type CleanedResult,
  type DuplicateMode,
  type EmailFilterMode,
} from "@/lib/csv-cleaner";
import type { CsvRow } from "@/lib/csv";

type CleanerWorkerResponse = {
  requestId: number;
  result: CleanedResult;
};

const EMPTY_RESULT = cleanCsvRows([], [], "", "selected", "all");

export function useCsvCleanerWorker(
  rows: CsvRow[],
  headers: string[],
  selectedColumn: string,
  duplicateMode: DuplicateMode,
  emailFilter: EmailFilterMode,
) {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const [result, setResult] = useState<CleanedResult>(EMPTY_RESULT);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (typeof Worker === "undefined") return;

    const worker = new Worker(
      new URL("../workers/csv-cleaner.worker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<CleanerWorkerResponse>) => {
      if (event.data.requestId !== requestIdRef.current) return;
      setResult(event.data.result);
      setIsProcessing(false);
    };
    worker.onerror = () => {
      workerRef.current = null;
      setIsProcessing(false);
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const timeoutId = window.setTimeout(() => {
      if (requestId !== requestIdRef.current) return;

      if (!rows.length || !headers.length) {
        setResult(cleanCsvRows(rows, headers, selectedColumn, duplicateMode, emailFilter));
        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);
      const worker = workerRef.current;
      if (worker) {
        worker.postMessage({
          requestId,
          rows,
          headers,
          selectedColumn,
          duplicateMode,
          emailFilter,
        });
        return;
      }

      setResult(cleanCsvRows(rows, headers, selectedColumn, duplicateMode, emailFilter));
      setIsProcessing(false);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [duplicateMode, emailFilter, headers, rows, selectedColumn]);

  return { result, isProcessing };
}
