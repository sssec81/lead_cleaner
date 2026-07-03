import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ipRates = new Map<string, { count: number; resetTime: number }>();

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

function sanitizeWaitlistField(value: unknown) {
 return String(value ?? "")
 .replace(/[\r\n]+/g, " ")
 .replace(/,/g, " ")
 .trim();
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

async function deliverWaitlistSignup(payload: {
 email: string;
 source: string;
 receivedAt: string;
}) {
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
 fs.appendFileSync(
 filePath,
 `${payload.receivedAt},${payload.email},${payload.source}\n`,
 );
}

export async function POST(request: Request) {
 try {
 const ip = getClientIp(request);

 if (ip && isRateLimited(ip)) {
 return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
 }

 const { email, source } = await request.json();

 if (!email || typeof email !== "string") {
 return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
 }

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!emailRegex.test(email)) {
 return NextResponse.json({ ok: false, error: "Invalid email format" }, { status: 400 });
 }

 const normalizedEmail = email.trim().toLowerCase();
 const safeSource = sanitizeWaitlistField(source) || "unknown";
 const receivedAt = new Date().toISOString();
 const maskedEmail = normalizedEmail.replace(/(^..)(.*)(@.*)$/, "$1***$3");
 console.log(`[WAITLIST] New signup: ${maskedEmail} from ${safeSource}`);

 try {
 await deliverWaitlistSignup({
 email: normalizedEmail,
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
