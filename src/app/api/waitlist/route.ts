import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
    }

    console.log(`[WAITLIST] New signup: ${email} from ${source}`);
    
    // For MVP testing without a DB, store to a local text file.
    // The user can read waitlist.txt from their Droplet/server.
    try {
       const filePath = path.join(process.cwd(), "waitlist.txt");
       fs.appendFileSync(filePath, `${new Date().toISOString()},${email},${source}\n`);
    } catch (e) {
       console.error("Failed to write to waitlist.txt", e);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
