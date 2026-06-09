# CLAUDE.md

Static Astro portfolio for the artist **Mae**, served by a Cloudflare Worker. Live at **https://mae.gallery**.

## Commands
- `npm run dev` — Astro dev server (UI work, http://localhost:4321)
- `npm run cf-dev` — build + `wrangler dev` (exercises the Worker / `/api/contact`)
- `npm run deploy` — manual deploy (`wrangler deploy`; the `wrangler.toml` `[build]` hook runs the Astro build)
- **Push to `main` auto-deploys** via GitHub Actions (`.github/workflows/deploy.yml`).

## Content
- **All content is in `src/data/portfolio.ts`** (single source of truth: bio, CV, 4 collections, works). Edit there, not in components.
- Each work needs an accurate `ratio` (width ÷ height) — it drives lightbox/grid sizing.

## Images — WebP only
- Paintings live in `public/assets/paintings/<series>/` as `<slug>-NN.webp` (≈2048px) **plus** a `<slug>-NN-sm.webp` (≈1280px) used for mobile (`<picture>`) and grid tiles.
- Generate with `cwebp` (no Sharp/Next). Always make both sizes; never commit raw JPGs.

## Worker (`src/worker.js`)
- `/api/contact`: sanitize (strip control chars — header-injection safe) → verify Turnstile → score spam (heuristics + honeypot) → **store every submission in D1** → `send_email` **only if not spam**.
- `/admin`: lists submissions (HTML-escaped) behind **Cloudflare Access** (verifies `Cf-Access-Jwt-Assertion`). Returns 403 until `ACCESS_TEAM_DOMAIN` + `ACCESS_AUD` are set in `wrangler.toml`.
- Secrets go via `wrangler secret put` (e.g. `TURNSTILE_SECRET`) — **never commit secrets**. D1 is `mae-gallery-db` (binding `DB`); schema in `schema.sql`.

## Conventions
- **No em dashes (—)** in copy — user preference; use periods/commas or "to".
- Background is white; keep it white in any new UI.
- If the domain changes, update `site` in `astro.config.mjs`, the route in `wrangler.toml`, and `robots.txt` / `sitemap.xml`.
