import { NextResponse } from "next/server.js";
import fs from "fs";
import path from "path";

const ipRates = new Map<string, { count: number; resetTime: number }>();

const WAITLIST_ROLES = new Set(["agency", "sales", "recruiting", "marketing", "founder", "other"]);
const WAITLIST_FILE_SIZES = new Set(["under_5mb", "5_25mb", "25_100mb", "over_100mb", "not_sure"]);
const WAITLIST_CRMS = new Set(["hubspot", "apollo", "salesforce", "pipedrive", "other", "none"]);
const WAITLIST_FREQUENCIES = new Set(["daily", "weekly", "monthly", "occasional"]);

type WaitlistSignup = {
 email: string;
 role: string;
 fileSize: string;
 crm: string;
 frequency: string;
 intendedUse: string;
 source: string;
 receivedAt: string;
};

function isRateLimited(ip: string): boolean {
 const now = Date.now();
 const limit = 20; // 20 signups per minute per IP
 const windowMs = 60 * 1000;

 pruneExpiredRateLimits(ipRates, now);

 const record = ipRates.get(ip);
 if (!record || now > record.resetTime) {
 ipRates.set(ip, { count: 1, resetTime: now + windowMs });
 return false;
 }

 record.count += 1;
 return record.count > limit;
}

function pruneExpiredRateLimits(
 map: Map<string, { count: number; resetTime: number }>,
 now: number,
) {
 for (const [key, record] of map) {
  if (now > record.resetTime) {
   map.delete(key);
  }
 }
}

function sanitizeWaitlistField(value: unknown, maxLength = 500) {
 return String(value ?? "")
 .replace(/[\r\n]+/g, " ")
 .trim()
 .slice(0, maxLength);
}

function formatWaitlistCsvCell(value: string) {
 const spreadsheetSafeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
 return `"${spreadsheetSafeValue.replace(/"/g, '""')}"`;
}

function isAllowedChoice(value: string, allowedValues: Set<string>) {
 return Boolean(value) && allowedValues.has(value);
}

function getClientIp(request: Request) {
 const candidates = [
  request.headers.get("x-real-ip"),
  request.headers.get("cf-connecting-ip"),
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
 ];

 for (const candidate of candidates) {
  const normalized = candidate?.trim();
  if (normalized && /^[a-f0-9:.]+$/i.test(normalized)) {
   return normalized;
  }
 }

 return null;
}

async function deliverWaitlistSignup(payload: WaitlistSignup) {
 const webhookUrl = process.env.WAITLIST_WEBHOOK_URL?.trim();
 if (webhookUrl) {
 const response = await fetch(webhookUrl, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify(payload),
 });

 if (!response.ok) {
 throw new Error(`Waitlist webhook failed with status ${response.status}`);
 }

 return;
 }

 const storagePath = process.env.WAITLIST_FILE_PATH?.trim();
 const canUseLocalFileFallback = Boolean(storagePath) || process.env.NODE_ENV !== "production";

 if (!canUseLocalFileFallback) {
 throw new Error(
 "Waitlist storage is not configured. Set WAITLIST_WEBHOOK_URL in production, or WAITLIST_FILE_PATH for single-server file storage.",
 );
 }

 const filePath = storagePath
 ? path.resolve(storagePath)
 : path.join(process.cwd(), "waitlist.txt");
 const needsHeader = !fs.existsSync(filePath) || fs.statSync(filePath).size === 0;
 const header = "receivedAt,email,role,fileSize,crm,frequency,intendedUse,source\n";
 const row = [
 payload.receivedAt,
 payload.email,
 payload.role,
 payload.fileSize,
 payload.crm,
 payload.frequency,
 payload.intendedUse,
 payload.source,
 ].map(formatWaitlistCsvCell).join(",");
 fs.appendFileSync(
 filePath,
 `${needsHeader ? header : ""}${row}\n`,
 );
}

export async function POST(request: Request) {
 try {
 const ip = getClientIp(request);

 if (ip && isRateLimited(ip)) {
 return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
 }

 const {
 email,
 role,
 fileSize,
 crm,
 frequency,
 intendedUse,
 companyWebsite,
 source,
 } = await request.json();

 if (sanitizeWaitlistField(companyWebsite, 200)) {
 return NextResponse.json({ ok: true });
 }

 if (!email || typeof email !== "string") {
 return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
 }

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (email.length > 254 || !emailRegex.test(email.trim())) {
 return NextResponse.json({ ok: false, error: "Invalid email format" }, { status: 400 });
 }

 const safeRole = sanitizeWaitlistField(role, 40);
 const safeFileSize = sanitizeWaitlistField(fileSize, 40);
 const safeCrm = sanitizeWaitlistField(crm, 40);
 const safeFrequency = sanitizeWaitlistField(frequency, 40);

 if (!isAllowedChoice(safeRole, WAITLIST_ROLES)) {
 return NextResponse.json({ ok: false, error: "Please select your role" }, { status: 400 });
 }
 if (!isAllowedChoice(safeFileSize, WAITLIST_FILE_SIZES)) {
 return NextResponse.json({ ok: false, error: "Please select a typical CSV size" }, { status: 400 });
 }
 if (!isAllowedChoice(safeCrm, WAITLIST_CRMS)) {
 return NextResponse.json({ ok: false, error: "Please select your main CRM" }, { status: 400 });
 }
 if (!isAllowedChoice(safeFrequency, WAITLIST_FREQUENCIES)) {
 return NextResponse.json({ ok: false, error: "Please select cleanup frequency" }, { status: 400 });
 }

 const normalizedEmail = email.trim().toLowerCase();
 const safeSource = sanitizeWaitlistField(source, 80) || "unknown";
 const safeIntendedUse = sanitizeWaitlistField(intendedUse, 500);
 const receivedAt = new Date().toISOString();
 const maskedEmail = normalizedEmail.replace(/(^..)(.*)(@.*)$/, "$1***$3");
 console.log(`[WAITLIST] New signup: ${maskedEmail} from ${safeSource} (${safeRole}, ${safeCrm})`);

 try {
 await deliverWaitlistSignup({
 email: normalizedEmail,
 role: safeRole,
 fileSize: safeFileSize,
 crm: safeCrm,
 frequency: safeFrequency,
 intendedUse: safeIntendedUse,
 source: safeSource,
 receivedAt,
 });
 } catch (e) {
 console.error("Failed to persist waitlist signup", e);
 return NextResponse.json(
 { ok: false, error: "Could not store your signup right now." },
 { status: 500 },
 );
 }

 return NextResponse.json({ ok: true });
 } catch {
 return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
 }
}
