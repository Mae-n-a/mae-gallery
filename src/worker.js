/**
 * Cloudflare Worker entry — serves the static Astro build and handles the
 * contact form at POST /api/contact using Cloudflare's NATIVE email sending
 * (the `send_email` binding, via Email Routing — no API key, no third party).
 *
 * Static assets are matched and served by Cloudflare BEFORE this Worker runs
 * (see `[assets]` in wrangler.toml), so this code only executes for /api/contact
 * and any path with no matching file.
 *
 * IMPORTANT — the email part only works once you have a custom domain:
 *   `send_email` requires Cloudflare Email Routing, which can only be enabled on
 *   a real domain (not *.workers.dev). Until the `SEB` binding is configured
 *   (see wrangler.toml) the form responds gracefully and the UI falls back to
 *   the mailto: link.
 */
import { EmailMessage } from 'cloudflare:email';
// Browser build avoids Node builtins (node:os / path) so it bundles for Workers.
import { createMimeMessage } from 'mimetext/browser';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      }
      return handleContact(request, env);
    }

    // Fallback for anything not served as a static asset.
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  let name, email, message, company;
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      ({ name, email, message, company } = await request.json());
    } else {
      const form = await request.formData();
      name = form.get('name');
      email = form.get('email');
      message = form.get('message');
      company = form.get('company');
    }
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400);
  }

  // Honeypot: real visitors never fill this. Pretend success for bots.
  if (company) return json({ ok: true });

  name = (name || '').toString().trim();
  email = (email || '').toString().trim();
  message = (message || '').toString().trim();

  if (!name || !email || !message) {
    return json({ ok: false, error: 'Please fill in every field.' }, 422);
  }
  if (!isEmail(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 422);
  }
  if (message.length > 5000) {
    return json({ ok: false, error: 'Message is too long.' }, 422);
  }

  // No binding yet (e.g. still on workers.dev without a domain) → graceful.
  if (!env.SEB) {
    console.warn('send_email binding (SEB) not configured — see wrangler.toml');
    return json({ ok: false, error: 'Mail is not configured yet.' }, 503);
  }

  // FROM must be an address on your Email-Routing-enabled domain.
  // TO must be your verified destination address (set in the binding).
  const from = env.CONTACT_FROM || 'noreply@mae.gallery';
  const to = env.CONTACT_TO || 'hello@mae.gallery';

  const mime = createMimeMessage();
  mime.setSender({ name: 'Mae Gallery', addr: from });
  mime.setRecipient(to);
  mime.setHeader('Reply-To', `${name} <${email}>`);
  mime.setSubject(`New enquiry from ${name}`);
  mime.addMessage({
    contentType: 'text/plain',
    data: `From: ${name} <${email}>\n\n${message}`,
  });

  try {
    const msg = new EmailMessage(from, to, mime.asRaw());
    await env.SEB.send(msg);
    return json({ ok: true });
  } catch (err) {
    console.error('send_email failed', err);
    return json({ ok: false, error: 'Could not send right now.' }, 502);
  }
}
