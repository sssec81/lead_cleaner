import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ipRates = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = 20; // 20 signups per minute per IP
  const windowMs = 60 * 1000;

  const record = ipRates.get(ip);
  if (!record || now > record.resetTime) {
    ipRates.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count += 1;
  return record.count > limit;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (isRateLimited(ip)) {
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

    const maskedEmail = email.replace(/(^..)(.*)(@.*)$/, "$1***$3");
    console.log(`[WAITLIST] New signup: ${maskedEmail} from ${source}`);

    // For MVP testing without a DB, store to a local text file.
    // The user can read waitlist.txt from their Droplet/server.
    try {
      const filePath = path.join(process.cwd(), "waitlist.txt");
      fs.appendFileSync(filePath, `${new Date().toISOString()},${email},${source}\n`);
    } catch (e) {
      console.error("Failed to write to waitlist.txt", e);
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
