# Mae — Artist Portfolio (Astro)

Editorial single-page portfolio for **Mae**, a visual artist working in acrylic.
Rebuilt from the design handoff prototype as a static [Astro](https://astro.build)
site, deployed as a **Cloudflare Worker** that serves the static build and
handles the contact form with Cloudflare's **native email sending**.

The original design reference lives untouched in
`design_handoff_editorial_portfolio/` for comparison.

## Stack

- **Astro 4** — static output, zero client framework (just small vanilla scripts).
- **Cloudflare Workers** — static assets + a Worker for the contact form, which
  sends mail via the native `send_email` binding (no third-party service).
- Content is one typed file: [`src/data/portfolio.ts`](src/data/portfolio.ts).

## Project structure

```
src/
  data/portfolio.ts      ← all content (artist, CV, 4 collections, 29 works)
  layouts/Base.astro     ← <head>, fonts, SEO/OG meta, footer
  components/
    Nav.astro            ← sticky header + mobile "Index" menu
    Hero.astro           ← animated name, portrait, meta
    Gallery.astro        ← numbered series index + cursor-follow preview
    About.astro          ← statement + CV (education / exhibitions)
    Contact.astro        ← accessible form, posts to /api/contact
    Lightbox.astro       ← full-screen viewer (keyboard, focus trap, dots)
  pages/index.astro      ← assembles the page + reveal-on-scroll
  styles/global.css      ← design tokens + all styles
  worker.js              ← Cloudflare Worker: serves the build + /api/contact
public/
  assets/                ← paintings + profile photo
  favicon.svg
wrangler.toml            ← Worker config (assets + send_email binding)
```

## Develop

```bash
npm install
npm run dev        # Astro dev server (UI work) → http://localhost:4321
npm run cf-dev     # build + `wrangler dev` → full Worker incl. /api/contact (:8787)
```

Use `npm run dev` for fast UI iteration; use `npm run cf-dev` to exercise the
contact endpoint under the real Worker runtime.

## Build & deploy (Cloudflare Workers)

```bash
npm run build      # static site → ./dist
npm run deploy     # build + `wrangler deploy`
```

First time: `npx wrangler login`, then `npm run deploy`. The site goes live at
`mae-gallery.<your-subdomain>.workers.dev`. (You can also connect the repo via
Cloudflare's **Workers Builds** for Git-based deploys.)

### The contact email — Cloudflare native `send_email`

The Worker (`src/worker.js`) sends mail with Cloudflare's built-in `send_email`
binding — **no API key, no third-party service**. It validates input, traps bots
with a honeypot, and sets `Reply-To` to the visitor so you reply directly.

**It needs a custom domain to actually deliver.** `send_email` works through
Cloudflare **Email Routing**, which can only be enabled on a real domain you've
added to Cloudflare — *not* on `*.workers.dev`. Until then the form returns a
graceful "not configured" and the UI falls back to the `mailto:` link.

To turn email on once you have a domain:

1. Add the domain to Cloudflare → **Email → Email Routing → Enable**.
2. **Verify your inbox** as a destination address.
3. In `wrangler.toml`, uncomment the `[[send_email]]` block and set
   `destination_address` to that verified inbox; point `CONTACT_TO` /
   `CONTACT_FROM` at the domain.
4. `npm run deploy`.

> **Limitation vs. an API sender:** `send_email` can only deliver to your
> *verified* address (i.e. you). It can't send a confirmation email to the
> visitor. That's exactly right for "email me each enquiry," but if you ever want
> visitor autoresponders you'd add a service like Resend instead.

## Editing content

Everything is in `src/data/portfolio.ts`. To add a work, drop the image in
`public/assets/paintings/<series>/`, add an entry with its `ratio`
(width ÷ height — the lightbox sizing depends on it), and rebuild.

### Carried-over TODOs from the handoff

- Work **titles** are placeholders (`Exile I…V` etc.) — replace with real titles.
- **Dimensions** are `null` (captions show `medium · year`); set `dim` to show them.
- **Years** were inferred from signatures — confirm.
