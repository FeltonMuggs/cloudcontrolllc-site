# Cloud Control LLC — Website

A high-performance, animated marketing site built in the style of
[thisismagma.com](https://thisismagma.com): Next.js + Tailwind, Lenis smooth
scrolling, and GSAP/ScrollTrigger driving a scroll-scrubbing HTML5 canvas hero.

Configured for **static export** so it deploys directly to **Cloudflare Pages**
with no server runtime.

## Tech stack

- **Next.js 14** (App Router) — static export (`output: 'export'`)
- **Tailwind CSS** — styling
- **Lenis** — smooth scroll, wired into the GSAP ticker
- **GSAP + ScrollTrigger** — timeline + scroll-driven animation
- **HTML5 Canvas** — the hero renders a 3D node-network projected to 2D and
  scrubbed by scroll position (no image sequence or WebGL required)

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

## Production build

```bash
npm run build        # outputs static site to ./out
```

The `out/` directory is the deployable artifact.

## Deploy to Cloudflare Pages

### Option A — Git (recommended, auto-deploys on every push)

1. Push this folder to a GitHub/GitLab repo.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
4. Deploy. Add the custom domain `cloudcontrolllc.com` under the project's
   **Custom domains** tab (DNS is already on Cloudflare, so it provisions
   automatically).

### Option B — Wrangler CLI (direct upload)

```bash
npm run build
npx wrangler pages deploy out --project-name=cloudcontrolllc
```

(Requires `wrangler login` or a `CLOUDFLARE_API_TOKEN` once.)

### Option C — Dashboard direct upload

Workers & Pages → Create → Pages → **Upload assets** → upload the `out` folder.

## Customizing the hero

The canvas lives in `app/components/HeroCanvas.js`. To swap in a true
Magma-style pre-rendered image sequence later, replace the `draw()` body with a
frame blit:

```js
ctx.drawImage(frames[Math.round(progress * (frames.length - 1))], 0, 0, w, h);
```

## Structure

```
app/
  layout.js              # root layout, metadata, smooth-scroll wrapper
  page.js                # all page sections + content
  globals.css            # Tailwind + Lenis styles
  components/
    SmoothScroll.js      # Lenis ↔ GSAP ticker integration
    HeroCanvas.js        # scroll-scrubbing canvas hero
    Reveal.js            # scroll-triggered reveal animations
    Nav.js               # sticky navigation
```
