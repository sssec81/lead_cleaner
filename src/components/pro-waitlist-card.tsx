"use client";

import { useState } from "react";
import { ArrowRight, Check, Shield } from "lucide-react";
import { trackToolEvent } from "@/lib/telemetry";

type ProWaitlistCardProps = {
  title?: string;
  description?: string;
  className?: string;
  trackSource: string;
  theme?: "light" | "dark";
};

export function ProWaitlistCard({
  title = "Join the Pro Waitlist",
  description = "Get notified when we launch larger CSV limits, saved cleanup workflows, and custom export presets (HubSpot, Apollo, Outreach, Clay).",
  className = "",
  trackSource,
  theme = "light",
}: ProWaitlistCardProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: trackSource }),
      });

      if (!response.ok) {
        throw new Error("Waitlist signup failed");
      }

      trackToolEvent("waitlist", "join", {
        source: trackSource,
      });

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Waitlist submit failed", err);
      setStatus("idle");
    }
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl border p-6 shadow-2xs transition-all duration-300 ${
        isDark
          ? "border-slate-800 bg-slate-900/50 text-white"
          : "border-blue-100 bg-blue-50/50 text-slate-900"
      } ${className}`}
    >
      {status === "success" ? (
        <div className="flex flex-col items-center text-center py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
            <Check className="h-6 w-6" />
          </div>
          <h4 className={`font-display text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            You&apos;re on the list!
          </h4>
          <p className={`mt-2 text-xs sm:text-sm max-w-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Thank you for joining the Pro waitlist. We will notify you when advanced limits and export presets go live.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h4 className={`font-display text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              {title}
            </h4>
            <p className={`mt-1 text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-350" : "text-slate-600"}`}>
              {description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <input
              type="email"
              required
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full min-w-0 rounded-xl border px-4 py-2.5 text-sm outline-hidden focus:ring-1 transition ${
                isDark
                  ? "border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  : "border-slate-200 bg-white text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex w-full min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50"
            >
              {status === "submitting" ? "Joining..." : "Join waitlist"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className={`flex items-center gap-1.5 text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>No lead data is collected through this form. Your contact details are stored securely.</span>
          </div>
        </form>
      )}
    </div>
  );
}
