// DNaI access registration endpoint (Cloudflare Pages Function)
//
// POST /api/register  { name, email, org? }
//   Stores a PENDING registration in D1 (binding: DB, table: registrations) and
//   emails everett@cloudcontrolllc.com via Web3Forms with subject
//   "new DNaI Registration", including one-click Approve / Deny links.
//   Access is NOT automatic — the owner approves each registration.
//
// GET /api/register?action=approve&token=...   owner-only (token lives in the email)
// GET /api/register?action=deny&token=...      owner-only
// GET /api/register?action=status&email=...    visitor polls their status
//
// Table (created in the dnai-reservations D1 database):
//   CREATE TABLE IF NOT EXISTS registrations (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, org TEXT,
//     status TEXT NOT NULL DEFAULT 'pending',
//     token TEXT NOT NULL, created_at TEXT NOT NULL,
//     decided_at TEXT, user_agent TEXT
//   );

const SITE = 'https://cloudcontrolllc.com';
const OWNER_EMAIL = 'everett@cloudcontrolllc.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function htmlPage(title, body, status = 200) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
<style>body{margin:0;font-family:Georgia,'Times New Roman',serif;background:#081a2b;color:#f5efe2;display:grid;place-items:center;min-height:100vh;padding:24px}
.card{max-width:560px;background:#0d2337;border:1px solid rgba(230,196,124,.35);border-radius:18px;padding:36px 32px;box-shadow:0 24px 60px rgba(0,0,0,.45)}
h1{font-size:26px;margin:0 0 12px;color:#e6c47c}p{line-height:1.6;margin:10px 0;color:#cfe3f4}
a.btn{display:inline-block;margin-top:16px;background:#e6c47c;color:#081a2b;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:999px;font-family:system-ui,sans-serif;font-size:14px}
code{background:rgba(255,255,255,.08);padding:2px 6px;border-radius:6px;font-size:14px}</style></head>
<body><div class="card">${body}</div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

function newToken() {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch (e) {
    return json({ ok: false, error: 'invalid JSON' }, 400);
  }

  // Honeypot: real form never fills this field — silently accept bots.
  if (data.website) return json({ ok: true, status: 'pending' });

  const name = String(data.name || '').trim().slice(0, 120);
  const email = String(data.email || '').trim().toLowerCase().slice(0, 200);
  const org = String(data.org || '').trim().slice(0, 160);

  if (!name || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'missing or invalid fields' }, 400);
  }
  if (!env.DB) return json({ ok: false, error: 'registration unavailable' }, 503);

  // Already registered? Return current status instead of re-inserting.
  try {
    const existing = await env.DB.prepare('SELECT status FROM registrations WHERE email = ?').bind(email).first();
    if (existing) return json({ ok: true, status: existing.status });
  } catch (e) {
    return json({ ok: false, error: 'registration unavailable' }, 503);
  }

  const token = newToken();
  const createdAt = new Date().toISOString();
  try {
    await env.DB.prepare(
      'INSERT INTO registrations (name, email, org, status, token, created_at, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(name, email, org, 'pending', token, createdAt, request.headers.get('user-agent') || '')
      .run();
  } catch (e) {
    return json({ ok: false, error: 'could not store registration' }, 500);
  }

  let emailed = false;
  if (env.WEB3FORMS_KEY) {
    const approveUrl = `${SITE}/api/register?action=approve&token=${token}`;
    const denyUrl = `${SITE}/api/register?action=deny&token=${token}`;
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: env.WEB3FORMS_KEY,
          subject: 'new DNaI Registration',
          from_name: 'DNaI Registration Gate',
          name,
          email,
          message:
            `New DNaI access request — awaiting YOUR approval.\n\n` +
            `Name: ${name}\nEmail: ${email}\nOrganization: ${org || '(none given)'}\nRequested: ${createdAt}\n\n` +
            `APPROVE (one click):\n${approveUrl}\n\n` +
            `DENY:\n${denyUrl}\n\n` +
            `Nothing is unlocked until you click Approve.`,
        }),
      });
      emailed = r.ok;
    } catch (e) {
      // stored either way; owner can approve from the D1 table if email failed
    }
  }

  return json({ ok: true, status: 'pending', emailed });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action') || '';
  if (!env.DB) return json({ ok: false, error: 'unavailable' }, 503);

  if (action === 'status') {
    const email = String(url.searchParams.get('email') || '').trim().toLowerCase().slice(0, 200);
    if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'invalid email' }, 400);
    const row = await env.DB.prepare('SELECT status FROM registrations WHERE email = ?').bind(email).first();
    return json({ ok: true, status: row ? row.status : 'none' });
  }

  if (action === 'approve' || action === 'deny') {
    const token = String(url.searchParams.get('token') || '').slice(0, 64);
    if (!/^[0-9a-f]{40,64}$/.test(token)) return htmlPage('Invalid link', '<h1>Invalid link</h1><p>This approval link is not valid.</p>', 400);
    const row = await env.DB.prepare('SELECT id, name, email, status FROM registrations WHERE token = ?').bind(token).first();
    if (!row) return htmlPage('Not found', '<h1>Not found</h1><p>No registration matches this link.</p>', 404);

    const newStatus = action === 'approve' ? 'approved' : 'denied';
    if (row.status !== newStatus) {
      await env.DB.prepare('UPDATE registrations SET status = ?, decided_at = ? WHERE id = ?')
        .bind(newStatus, new Date().toISOString(), row.id)
        .run();
    }

    if (newStatus === 'approved') {
      const mailto = `mailto:${encodeURIComponent(row.email)}?subject=${encodeURIComponent('Your DNaI access is approved')}&body=${encodeURIComponent(
        `Hi ${row.name},\n\nYour access to DNaI has been approved. Visit the page below, choose "Already registered?", and enter this email address to unlock it on your device:\n\n${SITE}/dnai/\n\nWelcome aboard,\nEverett Morton\nCloud Control LLC`
      )}`;
      return htmlPage(
        'Approved',
        `<h1>Approved ✓</h1><p><strong>${row.name}</strong> (<code>${row.email}</code>) can now unlock the DNaI page.</p><p>They unlock it by entering their email under &ldquo;Already registered?&rdquo; on the page. Want to let them know?</p><a class="btn" href="${mailto}">Email them the good news</a>`
      );
    }
    return htmlPage('Denied', `<h1>Denied</h1><p>The request from <strong>${row.name}</strong> (<code>${row.email}</code>) has been marked denied. They will not get access.</p>`);
  }

  return json({ ok: false, error: 'unknown action' }, 400);
}
