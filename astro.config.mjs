// @ts-check
import { defineConfig } from 'astro/config';

// Static portfolio site. Built to ./dist, then served by a Cloudflare Worker
// (src/worker.js) which also handles the /api/contact form endpoint.
// If you later add a custom domain, set `site` so canonical/OG URLs resolve.
export default defineConfig({
  // ⚠️ Change this to your real domain — used for canonical URLs, sitemap, OG tags & JSON-LD.
  site: 'https://mae.gallery',
  output: 'static',
  build: {
    // Inline tiny stylesheets to cut requests; keep the editorial feel snappy.
    inlineStylesheets: 'auto',
  },
});
