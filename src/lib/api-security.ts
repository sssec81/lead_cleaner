const DEFAULT_MAX_JSON_BYTES = 16 * 1024;

export async function readLimitedJson<T>(
  request: Request,
  maxBytes = DEFAULT_MAX_JSON_BYTES,
): Promise<T> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new ApiPayloadError("Request body is too large.", 413);
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    throw new ApiPayloadError("Request body is too large.", 413);
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new ApiPayloadError("Invalid JSON body.", 400);
  }
}

export class ApiPayloadError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function sanitizeTelemetryMetadata(
  value: unknown,
): Record<string, string | number | boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const sanitized: Record<string, string | number | boolean> = {};
  for (const [key, entry] of Object.entries(value).slice(0, 20)) {
    const safeKey = key.replace(/[^a-z0-9_.-]/gi, "").slice(0, 50);
    if (!safeKey) continue;

    if (typeof entry === "string") {
      sanitized[safeKey] = entry.slice(0, 200);
    } else if (typeof entry === "number" && Number.isFinite(entry)) {
      sanitized[safeKey] = entry;
    } else if (typeof entry === "boolean") {
      sanitized[safeKey] = entry;
    }
  }
  return sanitized;
}
