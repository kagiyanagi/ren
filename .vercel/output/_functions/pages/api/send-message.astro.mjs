export { renderers } from '../../renderers.mjs';

const prerender = false;
const TELEGRAM_TOKEN = process.env.BOT_TOKEN || process.env.TELEGRAM_TOKEN || "7699522419:AAH1qfYBP3pf3F3mzZIzmuPGRy0Z5IPNys4";
const TELEGRAM_CHAT_ID = process.env.CHAT_ID || process.env.TELEGRAM_CHAT_ID || "6310601796";
const POST = async ({ request }) => {
  try {
    const ct = request.headers.get("content-type");
    const cl = request.headers.get("content-length");
    console.log("[send-message] Incoming", { method: request.method, ct, cl });
    console.log("[send-message] headers", Object.fromEntries(request.headers.entries()));
    let raw = "";
    try {
      const buf = await request.arrayBuffer();
      console.log("[send-message] arrayBuffer.byteLength", buf.byteLength);
      if (buf && buf.byteLength > 0) {
        raw = new TextDecoder().decode(buf);
      }
    } catch (e) {
      console.warn("[send-message] request.arrayBuffer() failed", String(e));
    }
    if (!raw) {
      try {
        raw = await request.clone().text();
      } catch (e) {
        console.warn("[send-message] clone().text() failed", String(e));
      }
    }
    if (!raw) {
      try {
        raw = await request.text();
      } catch (e) {
        console.warn("[send-message] request.text() failed", String(e));
      }
    }
    if (!raw) {
      try {
        const form = await request.formData();
        const obj = {};
        for (const [k, v] of form.entries()) obj[k] = String(v);
        if (Object.keys(obj).length > 0) {
          const name2 = obj.name || "Anonymous";
          const email2 = obj.email || "No email";
          const message2 = obj.message || "";
          console.log("[send-message] Parsed formData", obj);
          return await sendToTelegram({ name: name2, email: email2, message: message2 });
        }
      } catch (e) {
        console.warn("[send-message] formData() failed", String(e));
      }
    }
    if (!raw) {
      return new Response(JSON.stringify({ ok: false, error: "Empty request body", diag: { ct, cl } }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("[send-message] raw body length", raw.length, "snippet", raw.slice(0, 200));
    let body;
    try {
      body = JSON.parse(raw);
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: `Invalid JSON: ${e?.message || String(e)}`, raw }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const name = body.name || "Anonymous";
    const email = body.email || "No email";
    const message = body.message || "";
    const text = `📬 New Message from Contact Form

Name: ${name}
Email: ${email}

Message:
${message}`;
    return await sendToTelegram({ name, email, message });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function sendToTelegram({ name, email, message }) {
  const text = `📬 New Message from Contact Form

Name: ${name}
Email: ${email}

Message:
${message}`;
  const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
  });
  const respText = await resp.text().catch(() => "");
  if (!resp.ok) {
    return new Response(JSON.stringify({ ok: false, error: "Telegram API error", details: respText || null }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({ ok: true, telegram: respText || null }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
