type TelemetryValue = string | number | boolean;

type TelemetryProps = Record<string, TelemetryValue | undefined>;

type ErrorPayload = {
 message: string;
 stack?: string;
 source?: string;
 metadata?: TelemetryProps;
};

declare global {
 interface Window {
 gtag?: (
 command: "config" | "event",
 targetId: string,
 config?: Record<string, unknown>,
 ) => void;
 plausible?: (
 eventName: string,
 options?: {
 props?: Record<string, TelemetryValue>;
 u?: string;
 },
 ) => void;
 }
}

function normalizeProps(props: TelemetryProps = {}) {
 return Object.fromEntries(
 Object.entries(props).filter((entry): entry is [string, TelemetryValue] => {
 return entry[1] !== undefined;
 }),
 );
}

function sanitizeErrorText(value: string) {
 return value
 .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
 .replace(/https?:\/\/\S+/gi, "[redacted-url]")
 .replace(/www\.\S+/gi, "[redacted-url]")
 .replace(/\+?\d[\d()\-\s]{6,}\d/g, "[redacted-number]");
}

export function trackEvent(name: string, props: TelemetryProps = {}) {
 if (typeof window === "undefined") {
 return;
 }

 const normalizedProps = normalizeProps(props);

 window.plausible?.(name, { props: normalizedProps });

 const gaId = process.env.NEXT_PUBLIC_GA_ID;
 if (gaId && window.gtag) {
 window.gtag("event", name, normalizedProps);
 }
}

export function trackPageView(path: string) {
 if (typeof window === "undefined") {
 return;
 }

 const pageUrl = new URL(path, window.location.origin).toString();

 window.plausible?.("pageview", { u: pageUrl });

 const gaId = process.env.NEXT_PUBLIC_GA_ID;
 if (gaId && window.gtag) {
 window.gtag("config", gaId, {
 page_path: path,
 page_location: pageUrl,
 page_title: document.title,
 });
 }
}

export function trackToolEvent(
 tool: string,
 action: string,
 props: TelemetryProps = {},
) {
 trackEvent("tool_interaction", {
 tool,
 action,
 ...props,
 });
}

export async function reportClientError(payload: ErrorPayload) {
 if (typeof window === "undefined") {
 return;
 }

 const sanitizedMessage = sanitizeErrorText(payload.message).slice(0, 120);
 const sanitizedStack = payload.stack
 ? sanitizeErrorText(payload.stack).slice(0, 1000)
 : undefined;

 trackEvent("client_error", {
 source: payload.source ?? "unknown",
 message: sanitizedMessage,
 ...payload.metadata,
 });

 try {
 await fetch("/api/telemetry/error", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 ...payload,
 message: sanitizedMessage,
 stack: sanitizedStack,
 }),
 keepalive: true,
 });
 } catch {
 // Swallow network failures to avoid recursive error noise.
 }
}
