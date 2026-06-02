"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { reportClientError, trackPageView } from "@/lib/telemetry";

export function TelemetryProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackPageView(pagePath);
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleWindowError(event: ErrorEvent) {
      void reportClientError({
        source: event.filename || "window.error",
        message: event.message || "Unhandled client error",
        stack: event.error instanceof Error ? event.error.stack : undefined,
        metadata: {
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const reason =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason ?? "Unknown rejection"));

      void reportClientError({
        source: "unhandledrejection",
        message: reason.message,
        stack: reason.stack,
      });
    }

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
