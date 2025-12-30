import type { APIRoute } from 'astro';

// Ensure this endpoint runs server-side so request headers/body are available
export const prerender = false;

const TELEGRAM_TOKEN = process.env.BOT_TOKEN || process.env.TELEGRAM_TOKEN || "7699522419:AAH1qfYBP3pf3F3mzZIzmuPGRy0Z5IPNys4";
const TELEGRAM_CHAT_ID = process.env.CHAT_ID || process.env.TELEGRAM_CHAT_ID || "6310601796";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Diagnostic: log incoming request metadata (not body content)
    const ct = request.headers.get('content-type');
    const cl = request.headers.get('content-length');
    console.log('[send-message] Incoming', { method: request.method, ct, cl });
    console.log('[send-message] headers', Object.fromEntries(request.headers.entries()));

    // Try reading raw bytes first to avoid any text()/json() edge cases
    let raw = '';
    try {
      const buf = await request.arrayBuffer();
      console.log('[send-message] arrayBuffer.byteLength', buf.byteLength);
      if (buf && buf.byteLength > 0) {
        raw = new TextDecoder().decode(buf);
      }
    } catch (e) {
      console.warn('[send-message] request.arrayBuffer() failed', String(e));
    }

    // If arrayBuffer read nothing, try using clone().text() then direct text()
    if (!raw) {
      try {
        raw = await request.clone().text();
      } catch (e) {
        console.warn('[send-message] clone().text() failed', String(e));
      }
    }

    if (!raw) {
      try {
        raw = await request.text();
      } catch (e) {
        console.warn('[send-message] request.text() failed', String(e));
      }
    }

    // If still empty, try formData fallback (some clients send urlencoded/form-data)
    if (!raw) {
      try {
        const form = await request.formData();
        const obj: any = {};
        for (const [k, v] of form.entries()) obj[k] = String(v);
        if (Object.keys(obj).length > 0) {
          // use form-derived body
          const name = obj.name || 'Anonymous';
          const email = obj.email || 'No email';
          const message = obj.message || '';
          console.log('[send-message] Parsed formData', obj);
          return await sendToTelegram({ name, email, message });
        }
      } catch (e) {
        console.warn('[send-message] formData() failed', String(e));
      }
    }

    if (!raw) {
      return new Response(JSON.stringify({ ok: false, error: 'Empty request body', diag: { ct, cl } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[send-message] raw body length', raw.length, 'snippet', raw.slice(0, 200));

    let body: any;
    try {
      body = JSON.parse(raw);
    } catch (e: any) {
      return new Response(JSON.stringify({ ok: false, error: `Invalid JSON: ${e?.message || String(e)}`, raw }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const name = body.name || 'Anonymous';
    const email = body.email || 'No email';
    const message = body.message || '';

    const text = `📬 New Message from Contact Form\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    return await sendToTelegram({ name, email, message });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

async function sendToTelegram({ name, email, message }: { name: string; email: string; message: string }) {
  const text = `📬 New Message from Contact Form\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
  });

  const respText = await resp.text().catch(() => '');

  if (!resp.ok) {
    return new Response(JSON.stringify({ ok: false, error: 'Telegram API error', details: respText || null }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, telegram: respText || null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
