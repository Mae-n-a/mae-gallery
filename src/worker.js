/**
 * Cloudflare Worker — serves the static Astro build and powers the contact form.
 *
 * POST /api/contact
 *   - validates + sanitizes input (header-injection safe, length-capped)
 *   - verifies Cloudflare Turnstile (anti-bot) when TURNSTILE_SECRET is set
 *   - scores the message for spam with lightweight in-Worker heuristics
 *   - stores EVERY submission in D1 (env.DB), spam or not
 *   - emails (send_email / SEB) ONLY submissions not flagged as spam
 *
 * GET /admin
 *   - dashboard listing all submissions, every field HTML-escaped
 *   - protected by Cloudflare Access: the Cf-Access-Jwt-Assertion JWT is verified
 *     against the team's public keys (signature + aud + iss + exp). With
 *     workers_dev disabled, the only entrypoint is the Access-protected domain.
 *
 * Static assets are matched and served by Cloudflare BEFORE this Worker runs
 * (see `[assets]` in wrangler.toml); this code handles the routes above and any
 * path with no matching file.
 */
import { EmailMessage } from 'cloudflare:email';
// Browser build avoids Node builtins so it bundles for Workers.
import { createMimeMessage, Mailbox } from 'mimetext/browser';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// --- input hygiene ----------------------------------------------------------
// Remove control characters (codepoints < 0x20 and DEL 0x7f). When keepBreaks
// is true, newline (0x0a) and tab (0x09) are preserved; otherwise they become
// spaces. Done by codepoint (no literal control chars in source).
function stripControl(s, keepBreaks) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 0x7f) continue;
    if (c < 0x20) {
      if (keepBreaks) {
        if (c === 0x0a || c === 0x09) out += s[i]; // keep \n and \t, drop the rest
      } else {
        out += ' ';
      }
      continue;
    }
    out += s[i];
  }
  return out;
}

// Single-line value: header-injection safe (no CR/LF), whitespace collapsed, capped.
const sanitizeLine = (s, max = 200) =>
  stripControl((s ?? '').toString(), false)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

// Multi-line value: keeps newlines/tabs, drops other control chars, capped.
const sanitizeText = (s, max = 5000) =>
  stripControl((s ?? '').toString(), true).trim().slice(0, max);

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (s) => (s ?? '').toString().replace(/[&<>"']/g, (c) => ESC[c]);

// --- spam heuristics --------------------------------------------------------
const SPAM_WORDS =
  /\b(viagra|cialis|casino|porn|crypto|bitcoin|forex|payday loan|mortgage|seo services|backlinks|cheap meds|weight loss|click here|buy now|limited offer|act now|guaranteed income|earn \$|make money fast|work from home|nigerian prince|inheritance fund|lottery winner)\b/gi;

function scoreSpam({ name, message }) {
  const reasons = [];
  let score = 0;

  const links = (message.match(/https?:\/\/|www\.|\[url|<a\s/gi) || []).length;
  if (links >= 1) {
    score += links * 2;
    reasons.push(`${links} link(s)`);
  }

  const hits = message.match(SPAM_WORDS) || [];
  if (hits.length) {
    score += hits.length * 2;
    reasons.push(`spam terms: ${[...new Set(hits.map((w) => w.toLowerCase()))].slice(0, 4).join(', ')}`);
  }

  // BBCode / HTML tags in a plaintext contact message ⇒ almost always spam.
  if (/\[\/?\w+\]|<\/?[a-z][\s\S]*?>/i.test(message)) {
    score += 3;
    reasons.push('embedded markup');
  }

  // Shouting.
  const letters = message.replace(/[^a-zA-Z]/g, '');
  const caps = message.replace(/[^A-Z]/g, '');
  if (letters.length > 20 && caps.length / letters.length > 0.6) {
    score += 2;
    reasons.push('all caps');
  }

  // Long runs of the same character.
  if (/(.)\1{7,}/.test(message)) {
    score += 2;
    reasons.push('char repetition');
  }

  // Very short message that carries a link.
  if (message.length < 25 && links) {
    score += 2;
    reasons.push('short + link');
  }

  // A URL inside the name field.
  if (/https?:\/\/|www\./i.test(name)) {
    score += 3;
    reasons.push('url in name');
  }

  return { score, reasons };
}

const SPAM_THRESHOLD = 5;

// --- Turnstile (anti-bot) ---------------------------------------------------
async function verifyTurnstile(token, ip, secret) {
  if (!secret) return { ok: true, skipped: true }; // not configured yet → don't block
  if (!token) return { ok: false };
  try {
    const body = new FormData();
    body.append('secret', secret);
    body.append('response', token);
    if (ip) body.append('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const data = await r.json();
    return { ok: !!data.success };
  } catch {
    return { ok: false };
  }
}

// --- Cloudflare Access JWT verification (admin) -----------------------------
let _jwks = null;
let _jwksAt = 0;
async function getJwks(teamDomain) {
  const now = Date.now();
  if (_jwks && now - _jwksAt < 3600_000) return _jwks;
  const r = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  const data = await r.json();
  _jwks = data.keys || [];
  _jwksAt = now;
  return _jwks;
}

function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4;
  if (pad) s += '='.repeat(4 - pad);
  const bin = atob(s);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
const b64urlToJson = (s) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

async function verifyAccess(request, env) {
  const teamDomain = env.ACCESS_TEAM_DOMAIN;
  const aud = env.ACCESS_AUD;
  // Fail closed if Access isn't configured yet.
  if (!teamDomain || !aud || teamDomain.startsWith('REPLACE') || aud.startsWith('REPLACE')) {
    return { ok: false, reason: 'access-not-configured' };
  }
  const cookie = request.headers.get('Cookie') || '';
  const token =
    request.headers.get('Cf-Access-Jwt-Assertion') || cookie.match(/CF_Authorization=([^;]+)/)?.[1];
  if (!token) return { ok: false, reason: 'no-token' };

  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'malformed' };
  const [h, p, sig] = parts;

  let header, payload;
  try {
    header = b64urlToJson(h);
    payload = b64urlToJson(p);
  } catch {
    return { ok: false, reason: 'decode' };
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) return { ok: false, reason: 'expired' };
  const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!auds.includes(aud)) return { ok: false, reason: 'aud' };
  if (payload.iss && payload.iss !== `https://${teamDomain}`) return { ok: false, reason: 'iss' };

  const jwk = (await getJwks(teamDomain)).find((k) => k.kid === header.kid);
  if (!jwk) return { ok: false, reason: 'kid' };
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlToBytes(sig),
    new TextEncoder().encode(`${h}.${p}`)
  );
  if (!valid) return { ok: false, reason: 'signature' };
  return { ok: true, email: payload.email };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      }
      return handleContact(request, env);
    }

    if (url.pathname === '/admin' || url.pathname === '/admin/') {
      return handleAdmin(request, env);
    }

    // Fallback for anything not served as a static asset.
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  let name, email, message, company, token;
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const b = await request.json();
      ({ name, email, message, company } = b);
      token = b['cf-turnstile-response'] || b.turnstileToken;
    } else {
      const form = await request.formData();
      name = form.get('name');
      email = form.get('email');
      message = form.get('message');
      company = form.get('company');
      token = form.get('cf-turnstile-response');
    }
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400);
  }

  name = sanitizeLine(name, 120);
  email = sanitizeLine(email, 200).toLowerCase();
  message = sanitizeText(message, 5000);

  // Real input errors → tell the user (so they can correct / fall back to mailto).
  if (!name || !email || !message) {
    return json({ ok: false, error: 'Please fill in every field.' }, 422);
  }
  if (!isEmail(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 422);
  }

  const ip = request.headers.get('CF-Connecting-IP') || '';
  const ua = sanitizeLine(request.headers.get('User-Agent') || '', 300);

  // --- spam signals ---
  const reasons = [];
  let score = 0;

  // Honeypot: real visitors never fill `company`.
  if (company && company.toString().trim()) {
    score += 100;
    reasons.push('honeypot');
  }

  // Turnstile (skipped gracefully until the secret is configured).
  const ts = await verifyTurnstile(token, ip, env.TURNSTILE_SECRET);
  if (!ts.ok) {
    score += 100;
    reasons.push('turnstile failed');
  }

  const heur = scoreSpam({ name, message });
  score += heur.score;
  reasons.push(...heur.reasons);

  const isSpam = score >= SPAM_THRESHOLD;

  // Email ONLY clean submissions.
  let emailed = 0;
  if (!isSpam) {
    emailed = (await sendEmail(env, { name, email, message })) ? 1 : 0;
  }

  // Store EVERY submission (spam or not).
  try {
    await env.DB.prepare(
      `INSERT INTO submissions (name, email, message, is_spam, spam_score, spam_reasons, emailed, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(name, email, message, isSpam ? 1 : 0, score, reasons.join(', ') || null, emailed, ip || null, ua || null)
      .run();
  } catch (err) {
    console.error('D1 insert failed', err);
  }

  // A clean message that failed to email → surface the error so the UI can fall
  // back to mailto. Spam is silently accepted (don't tip off bots).
  if (!isSpam && !emailed) {
    return json({ ok: false, error: 'Could not send right now.' }, 502);
  }
  return json({ ok: true });
}

async function sendEmail(env, { name, email, message }) {
  if (!env.SEB) {
    console.warn('send_email binding (SEB) not configured — see wrangler.toml');
    return false;
  }
  const from = env.CONTACT_FROM || 'noreply@mae.gallery';
  const to = env.CONTACT_TO || 'maedeh.n.a@gmail.com';
  try {
    const mime = createMimeMessage();
    mime.setSender({ name: 'Mae Gallery', addr: from });
    mime.setRecipient(to);
    // Reply-To must be a Mailbox instance — setHeader (unlike setRecipient) does not wrap it.
    mime.setHeader('Reply-To', new Mailbox({ addr: email, name }));
    mime.setSubject(sanitizeLine(`New enquiry from ${name}`, 150));
    mime.addMessage({ contentType: 'text/plain', data: `From: ${name} <${email}>\n\n${message}` });
    await env.SEB.send(new EmailMessage(from, to, mime.asRaw()));
    return true;
  } catch (err) {
    console.error('send_email failed', err);
    return false;
  }
}

async function handleAdmin(request, env) {
  const auth = await verifyAccess(request, env);
  if (!auth.ok) {
    // 403 with no detail; Cloudflare Access handles the login UI at the edge.
    return new Response('Forbidden', { status: 403, headers: { 'cache-control': 'no-store' } });
  }

  let rows = [];
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, name, email, message, is_spam, spam_score, spam_reasons, emailed, created_at
       FROM submissions ORDER BY created_at DESC LIMIT 500`
    ).all();
    rows = results || [];
  } catch (err) {
    console.error('D1 read failed', err);
    return new Response('Database unavailable', { status: 500, headers: { 'cache-control': 'no-store' } });
  }

  const total = rows.length;
  const clean = rows.filter((r) => !r.is_spam).length;
  const bodyRows = rows
    .map(
      (r) => `<tr class="${r.is_spam ? 'spam' : ''}">
      <td class="num">${r.id}</td>
      <td class="when">${escapeHtml(r.created_at)}</td>
      <td class="who">${escapeHtml(r.name)}<br><a href="mailto:${escapeHtml(r.email)}">${escapeHtml(r.email)}</a></td>
      <td class="msg">${escapeHtml(r.message)}</td>
      <td class="flag">${
        r.is_spam
          ? `<span class="badge spam">spam · ${escapeHtml(String(r.spam_score))}</span>`
          : `<span class="badge ok">clean</span>`
      }${r.spam_reasons ? `<br><small>${escapeHtml(r.spam_reasons)}</small>` : ''}</td>
      <td class="sent">${r.emailed ? '✓ emailed' : '—'}</td>
    </tr>`
    )
    .join('');

  const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Inbox — Mae</title>
<style>
  :root { --ink:#14203c; --line:#e3e1d9; --muted:#6f7689; --spam:#b23b3b; }
  * { box-sizing:border-box; } body { margin:0; font:14px/1.5 "Space Grotesk",system-ui,sans-serif; color:var(--ink); background:#fff; }
  header { padding:22px 28px; border-bottom:1px solid var(--line); display:flex; align-items:baseline; gap:20px; }
  h1 { font:400 22px/1 "Spectral",Georgia,serif; margin:0; } .meta { color:var(--muted); }
  table { width:100%; border-collapse:collapse; } th,td { text-align:left; padding:14px 18px; border-bottom:1px solid var(--line); vertical-align:top; }
  th { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
  td.num { color:var(--muted); } td.when { color:var(--muted); white-space:nowrap; font-size:12px; }
  td.who { white-space:nowrap; } td.who a { color:var(--ink); }
  td.msg { max-width:540px; white-space:pre-wrap; word-break:break-word; }
  tr.spam { background:#fbf3f3; } tr.spam td.msg { color:var(--muted); }
  .badge { display:inline-block; font-size:11px; letter-spacing:.08em; text-transform:uppercase; padding:3px 8px; border-radius:3px; }
  .badge.ok { background:#eef3ee; color:#3a6a3a; } .badge.spam { background:#f6e0e0; color:var(--spam); }
  small { color:var(--muted); } td.sent { white-space:nowrap; color:var(--muted); }
</style></head><body>
<header><h1>Inbox</h1><span class="meta">${total} message${total === 1 ? '' : 's'} · ${clean} clean · ${total - clean} spam</span></header>
${
  total
    ? `<table><thead><tr><th>#</th><th>Received</th><th>From</th><th>Message</th><th>Status</th><th>Mail</th></tr></thead><tbody>${bodyRows}</tbody></table>`
    : `<p style="padding:28px;color:var(--muted)">No submissions yet.</p>`
}
</body></html>`;

  return new Response(html, {
    headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}
