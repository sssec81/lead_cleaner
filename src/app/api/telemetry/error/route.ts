import { NextResponse } from "next/server";

type ErrorBody = {
 message?: string;
 stack?: string;
 source?: string;
 metadata?: Record<string, string | number | boolean | undefined>;
};

const ipRates = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
 const now = Date.now();
 const limit = 20; // 20 errors per minute per IP
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

export async function POST(request: Request) {
 let body: ErrorBody;

 try {
 body = (await request.json()) as ErrorBody;
 } catch {
 return NextResponse.json(
 { ok: false, error: "Invalid JSON body." },
 { status: 400 },
 );
 }

 const ip = request.headers.get("x-forwarded-for") || "unknown";
 
 if (isRateLimited(ip)) {
 return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
 }

 if (!body.message) {
 return NextResponse.json(
 { ok: false, error: "Error message is required." },
 { status: 400 },
 );
 }

 const payload = {
 source: body.source ?? "client",
 message: body.message.slice(0, 500),
 stack: body.stack?.slice(0, 4000),
 metadata: body.metadata ?? {},
 receivedAt: new Date().toISOString(),
 };

 const webhookUrl = process.env.ERROR_TRACKING_WEBHOOK_URL;

 if (webhookUrl) {
 try {
 await fetch(webhookUrl, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify(payload),
 });
 } catch (error) {
 console.error("LeadCleanr error webhook failed", error, payload);
 return NextResponse.json(
 { ok: false, error: "Webhook delivery failed." },
 { status: 502 },
 );
 }
 } else {
 console.error("LeadCleanr client error", payload);
 }

 return NextResponse.json({ ok: true });
}
