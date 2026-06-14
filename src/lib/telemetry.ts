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
 }
}

type AnalyticsDispatch = () => boolean;

const ANALYTICS_RETRY_DELAY_MS = 250;
const ANALYTICS_RETRY_ATTEMPTS = 20;

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

function dispatchWithRetry(dispatchers: AnalyticsDispatch[], attemptsLeft = ANALYTICS_RETRY_ATTEMPTS) {
 if (typeof window === "undefined") {
 return;
 }

 const pendingDispatchers = dispatchers.filter((dispatch) => !dispatch());
 if (!pendingDispatchers.length || attemptsLeft <= 0) {
 return;
 }

 window.setTimeout(() => {
 dispatchWithRetry(pendingDispatchers, attemptsLeft - 1);
 }, ANALYTICS_RETRY_DELAY_MS);
}

export function trackEvent(name: string, props: TelemetryProps = {}) {
 if (typeof window === "undefined") {
 return;
 }

 const normalizedProps = normalizeProps(props);
 const gaId = process.env.NEXT_PUBLIC_GA_ID;

 dispatchWithRetry([
 () => {
 if (!gaId) {
 return true;
 }
 if (!window.gtag) {
 return false;
 }
 window.gtag("event", name, normalizedProps);
 return true;
 },
 ]);
}

export function trackPageView(path: string) {
 if (typeof window === "undefined") {
 return;
 }

 const pageUrl = new URL(path, window.location.origin).toString();
 const gaId = process.env.NEXT_PUBLIC_GA_ID;

 dispatchWithRetry([
 () => {
 if (!gaId) {
 return true;
 }
 if (!window.gtag) {
 return false;
 }
 window.gtag("config", gaId, {
 page_path: path,
 page_location: pageUrl,
 page_title: document.title,
 });
 return true;
 },
 ]);
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
