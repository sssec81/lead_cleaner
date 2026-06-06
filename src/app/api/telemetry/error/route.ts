import { NextResponse } from "next/server";

type ErrorBody = {
  message?: string;
  stack?: string;
  source?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
};

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

  const secret = request.headers.get("x-telemetry-secret");
  if (process.env.TELEMETRY_SECRET && secret !== process.env.TELEMETRY_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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
