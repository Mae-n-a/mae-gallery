# Handoff: Mae — Artist Portfolio (Editorial direction)

## Overview
A single-page portfolio website for **Mae**, a visual artist working primarily in acrylic. The site presents a hero, a gallery of four painting series (29 works total), an about/CV section, and a contact form. Navigation is a single scrolling page with four anchored sections: **Home → Gallery → About → Contact**.

This is the **"Editorial"** design direction — a fine-art-magazine aesthetic: an oversized serif name, a numbered "index" of series (rather than a grid of thumbnails), a cursor-following preview image on hover, and a full-screen lightbox viewer for browsing each series.

## About the Design Files
The files in this bundle are **design references created in HTML/CSS/vanilla JS** — a working prototype that demonstrates the intended look, layout, and interactions. They are **not** meant to be shipped as-is.

Your task is to **recreate this design in the target codebase's environment**, using its established patterns and component library. If the project is React/Next, Vue/Nuxt, Astro, SwiftUI, etc., build it with idiomatic components and that stack's routing/state conventions. If no codebase exists yet, **Astro or Next.js (static export) is recommended** — this is a content-driven static marketing/portfolio site with no backend beyond the contact form, so a static-site generator with an image pipeline (e.g. `next/image`, `astro:assets`, or `@astrojs/image`) is the best fit.

The prototype is a faithful, near-pixel-perfect reference. Reproduce its spacing, type, and behavior closely; substitute the codebase's primitives where they exist.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all specified below and present in the HTML. Recreate the UI to match. The only intentionally-unfinished data points are noted under "Open content questions."

---

## Design Tokens

### Colors
| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#14203c` | Primary text, nav, buttons, borders/rules, dots (active) |
| `--steel` | `#90a3c0` | Accent — series years, numerals, labels, hover color, italic accents |
| `--paper` | `#f7f6f1` | Page background (warm off-white) |
| `--line` | `#dedacf` | Hairline dividers, row borders, inactive dots |
| `--muted` | `#6f7689` | Secondary/body copy, captions |
| image frame bg | `#dfe3ea` | Fallback behind painting images while loading |

`::selection` = `--ink` background, `--paper` text.

### Typography
Two Google Fonts:
- **Spectral** (serif) — weights 300/400/500/600 + italics 300/400. Display/editorial type: hero name, section titles, series titles, statement, captions, CV entries.
- **Space Grotesk** (sans) — weights 400/500. UI/labels: nav, eyebrows/kickers, field labels, buttons, blurbs, footer. All-caps with wide letter-spacing for the "mono"-style labels.

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Space+Grotesk:wght@400;500&display=swap
```

Type scale (key roles):
| Role | Font | Size | Weight | Style | Tracking |
|---|---|---|---|---|---|
| Hero name | Spectral | `clamp(96px, 18vw, 230px)` | 300 | — | -0.02em, line-height .82 |
| Section title | Spectral | `clamp(40px, 5vw, 64px)` | 400 | — | line-height 1 |
| Section number | Spectral | 18px | 400 | italic | — |
| Series title (index row) | Spectral | `clamp(34px, 5vw, 58px)` | 400 | — | line-height 1 |
| Series year (index) | Spectral | 22px | 400 | italic | — |
| Statement | Spectral | `clamp(24px, 3vw, 34px)` | 300 | — | line-height 1.4; first-letter 1.1em italic steel |
| Body / meta paragraph | Spectral | 17px | 400 | — | line-height 1.5 |
| CV year | Spectral | 19px | 400 | italic | — |
| CV entry | Spectral | 17px | 400 | — | — |
| Eyebrow / kicker / label ("mono") | Space Grotesk | 11–12px | 400 | — | .16–.20em, UPPERCASE |
| Nav links | Space Grotesk | 12px | 400 | — | .18em, UPPERCASE |
| Blurb (under series title) | Space Grotesk | 13px | 400 | — | .02em, sentence case |
| Button | Space Grotesk | 12px | 500 | — | .20em, UPPERCASE |
| Footer | Space Grotesk | 11px | 400 | — | .16em, UPPERCASE |

### Spacing & layout
- Content max-width: **1280px**, side padding **48px** (24px on mobile ≤900px).
- Section vertical padding: **130px** (84px on mobile).
- Hero: CSS grid `1.25fr 0.75fr`, `gap:50px`, `align-items:end`, top padding 150px.
- About grid: `1fr 0.9fr`, `gap:80px`.
- Contact grid: `1fr 1fr`, `gap:80px`.
- All multi-element rows/groups use **flex/grid with `gap`** (no margin hacks).

### Borders, radius, shadows
- **No border-radius anywhere** — everything is square-cornered (deliberate editorial feel).
- Hairlines: `1px solid var(--line)`; emphasis rules (under section heads, footer top): `1px solid var(--ink)`.
- Floating cursor preview shadow: `0 30px 60px -30px rgba(20,32,60,.5)`.
- Lightbox frame shadow: `0 40px 80px -40px rgba(20,32,60,.5)`.

### Motion
- Reveal-on-scroll: elements start `opacity:0; translateY(30px)`, transition to visible over **1s ease** when they enter the viewport (IntersectionObserver, threshold 0.12).
- Hero name: each letter animates in (rise + fade) staggered by 90ms, starting 200ms after load (`opacity .8s, transform .8s cubic-bezier(.2,.8,.2,1)`). **Important:** the visible state is the base; the pre-animation hidden state is applied via JS (`.pre` class) and removed on a timer — so with JS off / reduced-motion / SSR the name is visible by default. Respect `prefers-reduced-motion`.
- Index row hover: `padding-left` 0→24px over .4s, title color → steel, a `→` arrow fades in at the left.
- Nav: transparent over hero; on scroll past 40px gains `--paper` background + bottom hairline and tighter padding.

---

## Screens / Views (sections)

### 1. Navigation (fixed header)
- Fixed top, full width, z-index 40. Left: brand **"Mae"** in italic Spectral 26px. Right: nav `<ul>` with four links, each `NN Label` (number in steel 10px + label in Space Grotesk 12px uppercase).
- Links: `01 Home`, `02 Gallery`, `03 About`, `04 Contact` → anchor-scroll to `#home/#gallery/#about/#contact` (smooth scroll).
- Scrolled state (scrollY > 40): background `--paper`, padding 14px 48px, bottom border `--line`.
- Mobile (≤900px): nav list hidden; an "Index" button toggles a full-width dropdown panel.

### 2. Hero (`#home`)
- Two-column grid. **Left:** kicker "Visual Artist — Acrylic Painting" (mono label with a 54px ink rule before it); huge hero name **"Mae"** (animated letters); a meta row of three blocks — **Based in** (`Milan, Italy`), **Practice** ("Painting bodies and landscapes caught mid-collapse."), **Series** ("Four bodies of work, 2012—2021.").
- **Right:** portrait, `aspect-ratio:3/4`, filled with the artist photo (`assets/profile.jpg`, `background-position: center 18%`, cover). Placeholder striped gradient if no photo.
- Min-height 100vh, content aligned to bottom.

### 3. Gallery (`#gallery`) — the signature view
- Section head: left = `02 — Selected Works` (italic number) + "Gallery" title; right = caption "Four series in acrylic. Click any title to enter the series." Bottom border `--ink`.
- **Index rows** (one per series, generated from data): grid `90px 1fr auto`:
  - Col 1: series index `01`–`04` in italic steel 26px.
  - Col 2: series **title** (large Spectral) + a **blurb** beneath (small Space Grotesk, muted).
  - Col 3 (right-aligned): **years** (italic) + **"N works"** count (steel uppercase).
  - Absolutely-positioned `→` arrow at far left, hidden until hover.
  - Hover: row shifts right 24px, title turns steel, arrow appears.
  - Click: opens the **lightbox viewer** at that series, work index 0.
- **Floating cursor preview** (`.float-prev`): a 230px, 4:3 fixed element that follows the mouse (`mousemove` sets left/top). On row hover it fades/scales in showing that series' **cover** image (`background: url(cover) center/cover`). Hidden on mouse-leave. Pointer-events none. *(Recommend disabling on touch / coarse pointers.)*

### 4. About (`#about`)
- Section head: `03 — Biography` / "About"; right caption "Tehran → Milan. Trained between two academies."
- Grid `1fr 0.9fr`. **Left:** the **statement** paragraph (large Spectral 300; first-letter enlarged italic steel). **Right:** a CV column with two blocks:
  - **Education** — 3 entries.
  - **Exhibitions** — 4 entries.
  - Each CV row: grid `60px 1fr`, top border `--line`; year (italic steel) + bold-ish title with a muted sub-line (`place`) beneath.

### 5. Contact (`#contact`)
- Section head: `04 — Enquiries` / "Contact"; right caption "For acquisitions, exhibitions & studio visits."
- Grid `1fr 1fr`. **Left:** lead paragraph + `Milan, Italy` + mailto link (`hello@mae.gallery`). **Right:** form with three fields — **Your Name** (text), **Your Mail** (email), **Your Message** (textarea, 3 rows) — each an underlined input (border-bottom only, transparent bg, Spectral 19px; focus turns border steel). Submit button: solid `--ink`, `--paper` text, uppercase Space Grotesk, padding 18×42px; hover → steel.
- Submit behavior in prototype: `preventDefault`, button text → "Sent ✓" for 2.2s, then resets. **Wire to a real backend/email service in production** (see notes).

### 6. Footer
- Top border `--ink`, flex space-between: left "Mae — Visual Artist", right "© {year} · Milan". Uppercase Space Grotesk 11px.

### Lightbox viewer (overlay, all series)
- Fixed full-screen overlay, `--paper` background, z-index 80, fades in (`opacity .4s`) when `.open`. Locks body scroll while open.
- **Top bar:** series name + years (italic steel) on left; "Close ✕" button right.
- **Stage:** prev `‹` arrow, centered image frame, next `›` arrow. Arrows are large Spectral glyphs at .5 opacity → 1 on hover.
  - **Frame sizing (important):** each work has a `ratio` (= width/height). Frame is set to `aspect-ratio: ratio; height:auto; width: min(86vw, {64*ratio}vh)`. This makes tall works (e.g. ratio 0.385 diptychs) fit the viewport height and wide works (e.g. ratio 2.339 triptych) fit the width. Preserve this behavior. Image shown via `background: url(work.img) center/cover`.
- **Bottom bar:** work **title** (Spectral 24px) + a caption line composed as `medium · dim · year` (omitting any null parts — currently dimensions are null so it reads e.g. "Acrylic on canvas · 2021"). Right side: **progress dots** — one 24×2px bar per work, active = `--ink`, click jumps to that work.
- **Keyboard:** `Esc` closes, `←/→` step prev/next. Stepping wraps around within the series.

---

## Interactions & Behavior summary
- Smooth-scroll anchor nav; sticky header with scrolled state.
- IntersectionObserver reveal animations (respect `prefers-reduced-motion`).
- Hero per-letter entrance (visible-by-default fallback).
- Gallery index hover (shift + arrow + cursor-following cover preview).
- Lightbox: open from any series, prev/next/dots, keyboard nav, body-scroll lock, ratio-based responsive frame.
- Contact form: client-side only in prototype — **needs real submission** in production.

## State Management
Minimal. In a component framework, model:
- `navScrolled: boolean` (scroll listener > 40px).
- `mobileMenuOpen: boolean`.
- Lightbox: `{ open: boolean, collectionIndex: number, workIndex: number }`. Derive current collection/work from these. `step(±1)` wraps modulo works length.
- Cursor preview: `{ visible: boolean, x, y, coverSrc }` (skip on touch).
- Contact form: standard controlled fields + submit state (`idle | sending | sent`).
- All content is static data (see Data model) — no fetching required unless the gallery becomes CMS-driven.

## Data model
All content is driven by a single object (`window.MAE_DATA` in `assets/data.js`). Port this to typed data / JSON / CMS. Shape:

```ts
type Work = {
  title: string;
  year: string;
  medium: string;          // e.g. "Acrylic on canvas"
  dim: string | null;      // dimensions, currently null → omitted from caption
  ratio: number;           // width / height — drives frame sizing
  img: string;             // full image path
  thumb: string;           // detail-crop / thumbnail path (currently unused in Editorial; see notes)
};
type Collection = {
  id: string;              // "exile" | "unstable" | "blue" | "other"
  title: string;
  years: string;           // e.g. "2015 / 16"
  hue: number;             // oklch hue for placeholder tint (fallback only)
  blurb: string;
  cover: string;           // cover image path (used in hover preview)
  works: Work[];
};
type PortfolioData = {
  name; role; tagline; photo; email; location: string;
  education: { year; text; place: string }[];
  exhibitions: { year; text; place: string }[];
  statement: string;
  collections: Collection[];
};
```

Current content: 4 collections — **Exile** (5), **Unstable Falls** (7), **Blue** (9), **Other** (8) = **29 works**. Full values are in `assets/data.js`.

## Assets
Provided in `assets/` within this bundle:
- `assets/profile.jpg` — artist portrait (hero + about).
- `assets/paintings/<series>/<n>.jpg` — full painting images.
- `assets/paintings/<series>/<n>_t.jpg` — detail-crop / thumbnail variants of each painting.
- `assets/data.js` — the content data object.

All artwork and the portrait are **the artist's own work** — © Mae. In production, run images through the framework's image optimizer (responsive sizes, lazy-loading, AVIF/WebP). Original aspect ratios are encoded as `ratio` per work; keep them intact (the lightbox math depends on them).

## Open content questions (carry these forward)
- **Titles are placeholders** — works are named `Series I…N` (roman numerals). Replace with real titles when available.
- **Dimensions are `null`** — captions currently show `medium · year` only. When real cm/in dimensions exist, set `dim` and they'll appear automatically.
- **Years were inferred** from signatures; confirm.
- **`thumb` images exist but aren't used** in the Editorial layout (the lightbox uses full `img`). They're detail crops — optionally use them for faster-loading previews or a future grid view.
- **Contact form** needs a real endpoint (e.g. Formspree, Resend, a serverless function, or `mailto:` fallback).
- **Email** in use: `hello@mae.gallery`.

## Files in this bundle
- `Mae — Editorial.html` — the complete, runnable prototype (HTML + CSS + vanilla JS). Open in a browser to see all behavior. This is the source of truth for layout, type, and interactions.
- `assets/data.js` — content data.
- `assets/profile.jpg`, `assets/paintings/**` — all images.

To preview the reference: serve the bundle folder over a static server (e.g. `npx serve .`) and open `Mae — Editorial.html` (it loads `assets/data.js` and images via relative paths).
