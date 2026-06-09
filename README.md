# Mae — Artist Portfolio (Astro)

Editorial single-page portfolio for **Mae**, a visual artist and art educator.
A static [Astro](https://astro.build) site deployed as a **Cloudflare Worker**
that serves the build and runs a contact pipeline (spam filtering + D1 storage +
native email). Live at **https://mae.gallery**.

## Stack

- **Astro 4** — static output, no client framework (just small vanilla scripts).
- **Cloudflare Workers** — serves `./dist` via the `[assets]` binding; the Worker
  handles `/api/contact` and an Access-protected `/admin` dashboard.
- **Cloudflare D1** — every contact submission is stored (`mae-gallery-db`).
- **Cloudflare Turnstile** + in-Worker heuristics — anti-bot / spam filtering.
- **send_email** (Email Routing) — native email, no third-party service.
- **Cloudflare Web Analytics** — privacy-friendly, cookieless.
- Content is one typed file: [`src/data/portfolio.ts`](src/data/portfolio.ts).

## Project structure

```
src/
  data/portfolio.ts      ← all content (artist, bio, CV, 4 collections, 27 works)
  layouts/Base.astro     ← <head>, fonts, SEO/OG meta, JSON-LD, analytics, footer
  components/
    Nav.astro            ← centered sticky header + mobile menu
    Hero.astro           ← animated name, portrait, "Based in"
    Gallery.astro        ← numbered series index + cursor-follow preview
    SeriesGrid.astro     ← tiled contact-sheet of a series (opens before lightbox)
    About.astro          ← statement + CV (education / exhibitions)
    Contact.astro        ← accessible form (+ Turnstile), posts to /api/contact
    Lightbox.astro       ← full-screen viewer (responsive <picture>, keyboard, dots)
  pages/index.astro      ← assembles the page + reveal-on-scroll
  styles/global.css      ← design tokens + all styles
  worker.js              ← Worker: /api/contact pipeline + /admin dashboard
public/
  assets/paintings/      ← WebP works: <slug>-NN.webp + -NN-sm.webp (mobile)
  assets/profile.webp, assets/og.jpg, robots.txt, sitemap.xml, favicon.svg
schema.sql               ← D1 submissions table
wrangler.toml            ← Worker config (assets, D1, send_email, Access, [build] hook)
.github/workflows/deploy.yml  ← auto-deploy to Cloudflare on push to main
```

## Develop

```bash
npm install
npm run dev        # Astro dev server (UI work) → http://localhost:4321
npm run cf-dev     # build + `wrangler dev` → full Worker incl. /api/contact
```

## Deploy

**Automatic:** every push to `main` builds and deploys via GitHub Actions
(`.github/workflows/deploy.yml`), using repo secrets `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`.

**Manual:**

```bash
npm run deploy     # = wrangler deploy; the wrangler.toml [build] hook runs the Astro build
```

The custom domain (`mae.gallery`) is configured as a route in `wrangler.toml`.

## Contact pipeline (`src/worker.js`)

`POST /api/contact` →
1. **Sanitize** — strip control chars (header-injection safe), length caps.
2. **Turnstile** — verify the anti-bot token (skipped until `TURNSTILE_SECRET` set).
3. **Spam score** — in-Worker heuristics (links, spam terms, markup, caps, …) + honeypot.
4. **Store** — every submission is written to **D1** (spam or not).
5. **Email** — `send_email` forwards to the verified inbox **only if not flagged spam**.

Email uses Cloudflare **Email Routing** on `mae.gallery` (no API key). It can only
deliver to the verified destination (the owner) — not to the visitor.

### Admin dashboard — `/admin`

Lists every submission (HTML-escaped, spam badges, emailed status). Protected by
**Cloudflare Access** — the Worker verifies the `Cf-Access-Jwt-Assertion` JWT, and
`workers_dev = false` removes the bypass URL. It returns **403 until Access is
configured**: create an Access app for `mae.gallery/admin`, then set
`ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` in `wrangler.toml` and redeploy.

## Editing content

Everything is in `src/data/portfolio.ts`. To add a work:

1. Convert the source image to WebP with `cwebp` — a full size (long edge ≈2048)
   and a mobile `-sm` variant (long edge ≈1280); name them descriptively (e.g.
   `mae-blue-acrylic-painting-09.webp`).
2. Drop both in `public/assets/paintings/<series>/`.
3. Add an entry with the correct `ratio` (width ÷ height — drives lightbox sizing).

## Carried-over TODOs

- Work **titles** are placeholders (`Exile I…`, `Blue I…`) — replace with real titles.
- **Dimensions** are `null` (captions show `medium · year`); set `dim` to show them.
- **Years** were inferred — confirm.
