"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

export default function GlobalError({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useEffect(() => {
 // Rely on TelemetryProvider to catch this naturally, 
 // but we can log to console as a fallback.
 console.error("Global boundary caught:", error);
 }, [error]);

 return (
 <PageFrame>
 <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
 <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-red-50 text-red-500 shadow-sm border border-red-100">
 <AlertCircle className="h-8 w-8" />
 </div>
 <h1 className="mb-4 font-display text-3xl font-bold tracking-tight text-slate-900">
 Something went wrong
 </h1>
 <p className="mb-8 max-w-md text-lg text-slate-600">
 A client-side error occurred while rendering this page or tool. We have been notified of the issue.
 </p>
 <button
 onClick={reset}
 className="btn-primary inline-flex h-11 rounded-xl px-6 font-semibold active:scale-[0.98]"
 >
 <RotateCcw className="h-4 w-4" />
 Try Again
 </button>
 </div>
 </PageFrame>
 );
}
