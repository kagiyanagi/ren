import type { APIRoute } from "astro";

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

export const POST: APIRoute = async ({ request }) => {
  try {
    const env = readTelegramEnv();

    const contentType = request.headers.get("content-type") ?? "";
    const isJson = contentType.toLowerCase().includes("application/json");

    if (!isJson) {
      return json(
        415,
        {
          ok: false,
          error: "Unsupported Media Type. Please send application/json.",
        },
        {
          "Accept-Post": "application/json",
        },
      );
    }

    const raw = await safeReadText(request, 32_768); // 32KB max
    if (!raw) {
      return json(400, { ok: false, error: "Empty request body." });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json(400, { ok: false, error: "Invalid JSON." });
    }

    const validated = validateIncomingBody(parsed);
    if (!validated.ok) {
      return json(400, { ok: false, error: validated.error });
    }

    const { name, email, message } = validated.value;

    const text = formatTelegramMessage({ name, email, message });

    const telegramResp = await fetch(
      `https://api.telegram.org/bot${env.token}/sendMessage`,
      {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({
          chat_id: env.chatId,
          text,
          // Keep it conservative; users often paste code/URLs that don't play well with Markdown
          // parse_mode: "MarkdownV2",
          disable_web_page_preview: true,
        }),
      },
    );

    // Avoid returning upstream response bodies directly; they can include details you don't want to leak.
    if (!telegramResp.ok) {
      const details = await safeReadText(telegramResp, 8_192);
      return json(502, {
        ok: false,
        error: "Failed to deliver message.",
        upstream: {
          status: telegramResp.status,
          body: details || null,
        },
      });
    }

    return json(200, { ok: true });
  } catch (err) {
    return json(500, { ok: false, error: errorMessage(err) });
  }
};

function readTelegramEnv(): { token: string; chatId: string } {
  // Prefer explicit names, but support common alternatives.
  const token =
    process.env.BOT_TOKEN?.trim() ?? process.env.TELEGRAM_TOKEN?.trim() ?? "";
  const chatId =
    process.env.CHAT_ID?.trim() ?? process.env.TELEGRAM_CHAT_ID?.trim() ?? "";

  if (!token || !chatId) {
    // Fail fast with a clear message for deploy-time configuration.
    // This is safe to return to the client: it does not include secrets.
    throw new Error(
      "Server is not configured: missing TELEGRAM_TOKEN/BOT_TOKEN and/or TELEGRAM_CHAT_ID/CHAT_ID.",
    );
  }

  // Light sanity checks (don’t overfit).
  if (!token.includes(":")) {
    throw new Error("Server is not configured: Telegram token looks invalid.");
  }

  return { token, chatId };
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
  const message = normalizeString(b.message);

  if (!name) return { ok: false, error: "Name is required." };
  if (!email) return { ok: false, error: "Email is required." };
  if (!message) return { ok: false, error: "Message is required." };

  if (name.length > 80) return { ok: false, error: "Name is too long." };
  if (email.length > 254) return { ok: false, error: "Email is too long." };
  if (message.length > 4000)
    return { ok: false, error: "Message is too long." };

  if (!isValidEmail(email)) {
    return { ok: false, error: "Email is invalid." };
  }

  return { ok: true, value: { name, email, message } };
}

function normalizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  // Trim and collapse excessive whitespace
  return value.trim().replace(/\s+/g, " ");
}

function isValidEmail(email: string): boolean {
  // Basic but practical email validation.
  // If you need stricter validation later, consider delegating to a library.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatTelegramMessage(input: ValidatedInput): string {
  // Keep it plain-text. Telegram supports it well and avoids escaping issues.
  const safeName = clampForTelegram(input.name, 200);
  const safeEmail = clampForTelegram(input.email, 300);
  const safeMessage = clampForTelegram(input.message, 3500);

  return [
    "📬 New Message from Contact Form",
    "",
    `Name: ${safeName}`,
    `Email: ${safeEmail}`,
    "",
    "Message:",
    safeMessage,
  ].join("\n");
}

function clampForTelegram(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, Math.max(0, maxLen - 1)) + "…";
}

async function safeReadText(
  input: Request | Response,
  maxBytes: number,
): Promise<string> {
  // Read as text with a hard cap to avoid abuse.
  // We use ArrayBuffer to apply the cap reliably.
  const buf = await input.arrayBuffer().catch(() => null);
  if (!buf) return "";

  const view = new Uint8Array(buf);
  if (view.byteLength === 0) return "";

  if (view.byteLength > maxBytes) {
    throw new Error("Request body is too large.");
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(view);
}

function json(
  status: number,
  payload: unknown,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...(extraHeaders ?? {}),
    },
  });
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
