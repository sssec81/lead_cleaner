"use client";

import { ArrowRight, CheckCircle2, LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

import { trackEvent } from "@/lib/telemetry";

type SubmitState = "idle" | "submitting" | "success" | "error";

const roleOptions = [
  ["", "Select your role"],
  ["agency", "Agency or virtual assistant"],
  ["sales", "Sales or revenue operations"],
  ["recruiting", "Recruiting or talent operations"],
  ["marketing", "Marketing or growth"],
  ["founder", "Founder or small business"],
  ["other", "Other"],
] as const;

const fileSizeOptions = [
  ["", "Select a typical file size"],
  ["under_5mb", "Under 5 MB"],
  ["5_25mb", "5–25 MB"],
  ["25_100mb", "25–100 MB"],
  ["over_100mb", "More than 100 MB"],
  ["not_sure", "Not sure"],
] as const;

const crmOptions = [
  ["", "Select your main destination"],
  ["hubspot", "HubSpot"],
  ["apollo", "Apollo"],
  ["salesforce", "Salesforce"],
  ["pipedrive", "Pipedrive"],
  ["other", "Another CRM"],
  ["none", "No CRM yet"],
] as const;

const frequencyOptions = [
  ["", "Select cleanup frequency"],
  ["daily", "Daily"],
  ["weekly", "Every week"],
  ["monthly", "Every month"],
  ["occasional", "A few times per year"],
] as const;

export function ProWaitlistForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? ""),
      fileSize: String(formData.get("fileSize") ?? ""),
      crm: String(formData.get("crm") ?? ""),
      frequency: String(formData.get("frequency") ?? ""),
      intendedUse: String(formData.get("intendedUse") ?? ""),
      companyWebsite: String(formData.get("companyWebsite") ?? ""),
      source: "pricing_pro_waitlist",
    };

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Could not join the waitlist right now.");
      }

      setSubmitState("success");
      setMessage("You are on the Pro early-access list. We will email you when testing opens.");
      form.reset();
      trackEvent("pro_waitlist_submitted", {
        source: payload.source,
        role: payload.role,
        file_size: payload.fileSize,
        crm: payload.crm,
        frequency: payload.frequency,
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Could not join the waitlist right now.";
      setSubmitState("error");
      setMessage(errorMessage);
      trackEvent("pro_waitlist_failed", { source: payload.source });
    }
  }

  return (
    <section id="pro-waitlist" aria-labelledby="pro-waitlist-title" className="scroll-mt-24 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-[var(--lc-border-mid)] bg-[var(--lc-surface)]">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative overflow-hidden border-b border-white/15 bg-[var(--lc-ink)] p-7 text-white sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <div className="relative flex h-full flex-col">
                <div className="mb-8 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/75">
                  <span className="h-px w-8 bg-white/40" aria-hidden="true" />
                  Pro early access
                </div>
                <h2 id="pro-waitlist-title" className="font-display text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
                  Help shape the paid workflow.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
                  Join the list for larger files, saved cleanup presets, and CRM-ready exports. No payment is required today.
                </p>

                <div className="mt-10 space-y-4 border-t border-white/15 pt-8">
                  {[
                    "Early access before the public Pro launch",
                    "A chance to influence CRM presets and limits",
                    "No card and no automatic subscription",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12">
              {submitState === "success" ? (
                <div role="status" aria-live="polite" className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--lc-green-bg)] text-[var(--lc-green)]">
                    <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold tracking-[-0.03em] text-[var(--lc-ink)]">
                    You are on the list.
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-[var(--lc-muted)]">{message}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitState("idle");
                      setMessage("");
                    }}
                    className="lc-button-secondary mt-6"
                  >
                    Add another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-[-0.03em] text-[var(--lc-ink)]">
                      Join the Pro waitlist
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--lc-muted)]">
                      Tell us enough to prioritize the features your workflow actually needs.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="pro-waitlist-email" className="mb-1.5 block text-sm font-semibold text-[var(--lc-ink)]">
                      Work email <span aria-hidden="true" className="text-[var(--lc-danger)]">*</span>
                    </label>
                    <div className="lc-input-icon-wrap relative">
                      <Mail className="lc-input-leading-icon pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--lc-muted)]" aria-hidden="true" />
                      <input
                        id="pro-waitlist-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        placeholder="you@company.com"
                        className="lc-input lc-input-with-icon min-h-12"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <WaitlistSelect id="pro-waitlist-role" name="role" label="Your role" options={roleOptions} />
                    <WaitlistSelect id="pro-waitlist-size" name="fileSize" label="Typical CSV size" options={fileSizeOptions} />
                    <WaitlistSelect id="pro-waitlist-crm" name="crm" label="Main CRM" options={crmOptions} />
                    <WaitlistSelect id="pro-waitlist-frequency" name="frequency" label="Cleanup frequency" options={frequencyOptions} />
                  </div>

                  <div>
                    <label htmlFor="pro-waitlist-use" className="mb-1.5 block text-sm font-semibold text-[var(--lc-ink)]">
                      What should Pro solve first? <span className="font-normal text-[var(--lc-muted)]">(optional)</span>
                    </label>
                    <textarea
                      id="pro-waitlist-use"
                      name="intendedUse"
                      rows={3}
                      maxLength={500}
                      placeholder="Example: apply the same HubSpot cleanup rules to client exports every week."
                      className="lc-input min-h-24 resize-y"
                    />
                  </div>

                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="pro-waitlist-website">Company website</label>
                    <input id="pro-waitlist-website" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  {submitState === "error" ? (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                      {message}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="lc-button-primary min-h-12 w-full text-sm font-semibold"
                  >
                    {submitState === "submitting" ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Joining waitlist…
                      </>
                    ) : (
                      <>
                        Join Pro waitlist
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  <p className="flex items-start gap-2 text-xs leading-5 text-[var(--lc-muted)]">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lc-green)]" aria-hidden="true" />
                    We only use this information to plan Pro and contact you about early access.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WaitlistSelect({
  id,
  name,
  label,
  options,
}: {
  id: string;
  name: string;
  label: string;
  options: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[var(--lc-ink)]">
        {label} <span aria-hidden="true" className="text-[var(--lc-danger)]">*</span>
      </label>
      <select id={id} name={name} required className="lc-select min-h-12 w-full">
        {options.map(([value, text]) => (
          <option key={value || "placeholder"} value={value} disabled={!value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}
