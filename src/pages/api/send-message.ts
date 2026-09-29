import type { APIRoute } from "astro";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "astro:env/server";

export const prerender = false;

type IncomingBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

type ValidatedInput = {
  name: string;
  email: string;
  message: string;
};

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
} as const;
const RATE_LIMIT_WINDOW_MS = 30_000;
const MAX_BODY_LEN = 32_768;
const MAX_NAME_LEN = 80;
const MAX_EMAIL_LEN = 254;
// Telegram caps a message at 4096 chars; leave room for the header lines.
const MAX_MESSAGE_LEN = 3500;

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error(
        "Server is not configured: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.",
      );
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json(
        415,
        { ok: false, error: "Unsupported Media Type. Send application/json." },
        { "Accept-Post": "application/json" },
      );
    }

    const rateLimit = getRateLimitStore();
    const clientId = getClientId(request);
    const now = Date.now();
    const lastSeen = rateLimit.get(clientId);
    if (lastSeen && now - lastSeen < RATE_LIMIT_WINDOW_MS) {
      const retryAfter = Math.ceil(
        (RATE_LIMIT_WINDOW_MS - (now - lastSeen)) / 1000,
      );
      return json(
        429,
        {
          ok: false,
          error: `Please wait ${retryAfter}s before sending another message.`,
        },
        { "Retry-After": String(retryAfter) },
      );
    }
    const raw = await request.text();
    if (!raw) return json(400, { ok: false, error: "Empty request body." });
    if (raw.length > MAX_BODY_LEN) {
      return json(413, { ok: false, error: "Request body is too large." });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json(400, { ok: false, error: "Invalid JSON." });
    }

    const validated = validateIncomingBody(parsed);
    if (!validated.ok) return json(400, { ok: false, error: validated.error });

    rateLimit.set(clientId, now);
    const text = formatTelegramMessage(validated.value);

    const telegramResp = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          disable_web_page_preview: true,
        }),
      },
    );

    if (!telegramResp.ok) {
      // Do not echo upstream details to the client to avoid leaking config.
      console.error(
        "[send-message] Telegram delivery failed",
        telegramResp.status,
        await telegramResp.text().catch(() => ""),
      );
      return json(502, { ok: false, error: "Failed to deliver message." });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error("[send-message] Unexpected error", err);
    return json(500, { ok: false, error: "Internal server error." });
  }
};

function getRateLimitStore(): Map<string, number> {
  const g = globalThis as typeof globalThis & {
    __sendMessageRateLimit?: Map<string, number>;
  };
  if (!g.__sendMessageRateLimit) g.__sendMessageRateLimit = new Map();
  return g.__sendMessageRateLimit;
}

function getClientId(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "local"
  );
}

function validateIncomingBody(
  body: unknown,
): { ok: true; value: ValidatedInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }
  const b = body as IncomingBody;
  const name = normalizeString(b.name);
  const email = normalizeString(b.email);
  const message =
    typeof b.message === "string"
      ? b.message.replace(/\r\n?/g, "\n").trim()
      : "";

  if (!name) return { ok: false, error: "Name is required." };
  if (!email) return { ok: false, error: "Email is required." };
  if (!message) return { ok: false, error: "Message is required." };
  if (name.length > MAX_NAME_LEN)
    return { ok: false, error: "Name is too long." };
  if (email.length > MAX_EMAIL_LEN)
    return { ok: false, error: "Email is too long." };
  if (message.length > MAX_MESSAGE_LEN)
    return { ok: false, error: "Message is too long." };
  if (!isValidEmail(email)) return { ok: false, error: "Email is invalid." };

  return { ok: true, value: { name, email, message } };
}

function normalizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatTelegramMessage(input: ValidatedInput): string {
  return [
    "📬 New Message from Contact Form",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    "",
    "Message:",
    input.message,
  ].join("\n");
}

function json(
  status: number,
  payload: unknown,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...JSON_HEADERS, ...(extraHeaders ?? {}) },
  });
}
