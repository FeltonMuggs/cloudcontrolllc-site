// DNaI Genomic Wallet — VIP waitlist reservation endpoint (Cloudflare Pages Function)
// POST /api/reserve  { first, last, email, rail }
// Writes every reservation to the dnai-reservations D1 database (binding: DB).
// If a WEB3FORMS_KEY env var is ever configured, also forwards each lead as an
// instant email via Web3Forms — no code change needed to switch that on.

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch (e) {
    return json({ ok: false, error: 'invalid JSON' }, 400);
  }

  // Honeypot: real form never fills this field — silently accept bots.
  if (data.website) return json({ ok: true });

  const first = String(data.first || '').trim().slice(0, 100);
  const last = String(data.last || '').trim().slice(0, 100);
  const email = String(data.email || '').trim().slice(0, 200);
  const rail = String(data.rail || '').trim().slice(0, 40);

  if (!first || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'missing or invalid fields' }, 400);
  }

  const createdAt = new Date().toISOString();
  let stored = false;
  let emailed = false;

  if (env.DB) {
    try {
      await env.DB.prepare(
        'INSERT INTO reservations (first_name, last_name, email, rail, created_at, user_agent, source) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
        .bind(first, last, email, rail, createdAt, request.headers.get('user-agent') || '', 'dnai-wallet')
        .run();
      stored = true;
    } catch (e) {
      // fall through — emailed path may still succeed
    }
  }

  if (env.WEB3FORMS_KEY) {
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: env.WEB3FORMS_KEY,
          subject: 'DNaI Genomic Wallet — VIP Waitlist reservation',
          from_name: 'DNaI Wallet Waitlist',
          name: (first + ' ' + last).trim(),
          email,
          message:
            'New VIP waitlist reservation:\n\n' +
            'Name: ' + first + ' ' + last + '\n' +
            'Email: ' + email + '\n' +
            'Preferred deposit method: ' + rail + '\n' +
            'Bundle: $250 founding VIP (hardware slot + software priority)\n' +
            'Received: ' + createdAt,
        }),
      });
      emailed = r.ok;
    } catch (e) {
      // non-fatal
    }
  }

  if (!stored && !emailed) {
    return json({ ok: false, error: 'storage unavailable' }, 500);
  }
  return json({ ok: true, stored, emailed });
}
