# ren — kagiyanagi's portfolio

A static, terminal/CRT-themed personal portfolio built with Astro and Tailwind CSS, deployed on Vercel.

- **Live:** https://kagiyanagi.vercel.app
- **Source:** https://github.com/kagiyanagi/ren
- **Stack:** Astro 6 · Tailwind 3 · TypeScript · Vercel (static + 1 serverless route)

---

## Quick start

```bash
git clone https://github.com/kagiyanagi/ren.git
cd ren
pnpm install
cp .env.example .env       # then fill in the Telegram values
pnpm dev
```

Open http://localhost:4321.

> Requires **Node 22** (see `engines` in `package.json`) and **pnpm** (the `pnpm-workspace.yaml` and `pnpm-lock.yaml` make pnpm the only supported package manager).

---

## Scripts

| Script             | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `pnpm dev`         | Astro dev server with HMR.                               |
| `pnpm build`       | Production build to `dist/` (and `.vercel/output/`).     |
| `pnpm preview`     | Serve the production build locally.                      |
| `pnpm check`       | Type-check `.astro` / `.ts` via `astro check`.           |
| `pnpm fmt`         | Format the repo with Prettier (`prettier-plugin-astro`). |
| `pnpm fmt:check`   | Verify formatting without writing.                       |
| `pnpm astro <cmd>` | Pass-through to the Astro CLI.                           |

There is no automated test suite. The only quality gates are `astro check` and Prettier.

---

## Environment variables

Only the contact form needs configuration. Copy `.env.example` to `.env` and fill in:

| Variable             | Required | Purpose                                                                                                                                                                                                                     |
| -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN` | yes      | Bot token from [@BotFather](https://t.me/BotFather).                                                                                                                                                                        |
| `TELEGRAM_CHAT_ID`   | yes      | Your numeric Telegram chat id (where messages get sent).                                                                                                                                                                    |
| `GITHUB_TOKEN`       | optional | Used at build time by `src/lib/github.ts` for the GraphQL pinned-repos path. Any classic token with no scopes works — pinned repo metadata is public. Without it, the build falls back to scraping the public profile page. |

The legacy aliases `BOT_TOKEN` / `CHAT_ID` are also accepted as fallbacks for the Telegram values (see `src/lib/env.ts`), but new deployments should use the canonical names above.

For Vercel, add both variables under **Project → Settings → Environment Variables** for the `Production` and `Preview` environments.

### Local override file precedence

Astro loads `.env`, `.env.production`, `.env.development`, and `.env.*.local`. All of these are gitignored except `.env.example`.

---

## Architecture

### Rendering model

- `astro.config.mjs` sets `output: "static"` — the site is fully prerendered…
- …with **one exception**: `src/pages/api/send-message.ts` declares `export const prerender = false`, which is why the project ships the Vercel adapter. Vercel deploys that single file as a serverless function and serves everything else as static assets.

### Source layout

```
src/
├── assets/          # Build-time images (imported via @/assets/*). Astro fingerprints + optimizes these.
│   ├── hero.png       — used in <Hero>
│   ├── house.gif      — used in the "Contact me" section
│   └── villain.png    — used in the "About me" section
├── components/      # Astro components, all server-rendered. Per-component <script> tags ship client JS.
│   ├── BaseHead.astro       — <head> contents, OG/Twitter/JSON-LD, font preload, ClientRouter
│   ├── BinaryBackground.astro — animated 0/1 field used behind the hero
│   ├── Breadcrumb.astro     — white "tech" pill
│   ├── Contact.astro        — contact form, client-side validation, cooldown, fake terminal caret
│   ├── Footer.astro         — footer with dynamic year
│   ├── Hero.astro           — landing hero block
│   ├── Navbar.astro         — top nav, internal vs external link handling, scroll-styled logo
│   ├── Notification.astro   — global toast root, exposes window.showNotification
│   ├── ProjectCard.astro    — project tile (composed inside WindowCard)
│   ├── Section.astro        — titled section wrapper (`<Title />` styling)
│   └── WindowCard.astro     — "macOS window" frame used by ProjectCard / Contact
├── layouts/
│   └── Layout.astro         — shared HTML shell (head + nav + main + footer + notification root)
├── lib/
│   ├── env.ts               — typed reader for Telegram secrets (single source of truth)
│   └── github.ts            — build-time fetcher for GitHub pinned repos (GraphQL → HTML scrape → null)
├── pages/
│   ├── 404.astro            — uses <Layout>, hard-codes /index and a JS-driven refresh
│   ├── api/
│   │   └── send-message.ts  — only dynamic route; rate-limited proxy to Telegram
│   ├── index.astro          — the entire homepage
│   └── rss.xml.js           — RSS feed for the `blog` collection (currently empty)
├── styles/
│   └── global.css           — fonts, custom cursors, scanline/flicker effects, scrollbar
├── consts.ts                — site metadata, projects, nav links, GitHub repo
└── content.config.ts        — defines the `blog` collection (no posts shipped yet)

public/
├── cursors/         # Pixel-art cursors used in global.css
├── fonts/           # VCR OSD NEUE, RetroByte (preloaded in <head>)
├── favicon.ico      — actual favicon
├── muichiro.ico     — alternate favicon
├── muichiro.svg     — SVG favicon
├── image.jpg        — default OG/Twitter share image
├── terminal_bell.mp3 — sound played on backspace in empty input
└── google5ebaed34e5db2abf.html — Google Search Console verification
```

### Path aliasing

`vite.resolve.alias` maps `@/*` → `./src/*`. Always import via the alias (`@/components/...`, `@/lib/env`, `@/assets/...`) — never relative paths.

### Single source of truth: `src/consts.ts`

Everything user-facing is driven from this file. Edit here, not in templates:

- `SITE_TITLE`, `SITE_DESCRIPTION`, `SEO_KEYWORDS`, `TWITTER_HANDLE` → fed into `<BaseHead>` and JSON-LD.
- `KNOWN_TECH` → renders the "Technologies I like" pills.
- `PROJECTS` → renders project cards.
- `ABOUT_ME` → reserved for the about copy.
- `NAV_LINKS` → top-nav entries. External hrefs use protocol-relative `//host/path` or `https://…`.
- `GITHUB_USERNAME` / `GITHUB_REPO` → used by the index page's last-commit fetch, the footer link, and the pinned-repos fetcher.
- `USE_PINNED_REPOS` → when `true` (default), the homepage fetches your GitHub pinned repos at build time and renders them instead of the static `PROJECTS` list. Flip to `false` if you'd rather hand-curate.

### Pinned repos as projects

When `USE_PINNED_REPOS` is enabled, `src/lib/github.ts` runs at build time and tries two paths:

1. **GraphQL** — only used if `GITHUB_TOKEN` is set. One request returns all pinned repos with title, description, and `pushedAt`.
2. **HTML scrape + REST** — no token required. Parses `github.com/${GITHUB_USERNAME}` to find pinned repo slugs, then hits `api.github.com/repos/{owner}/{name}` per repo for description and timestamp.

If either path produces at least one project, those replace `PROJECTS`. If both fail (network error, GitHub HTML reshuffle, repo not found), the static `PROJECTS` constant is used as a safety net. Updating your pinned repos on GitHub is enough — no commits, no redeploys until the next site rebuild.

### Layout flow

`Layout.astro` is the shell every page uses. It renders `<BaseHead>` (meta + JSON-LD + fonts), a fixed `<Navbar>`, a `<main>` slot, `<Footer>`, and the `<Notification>` toast root. `<BaseHead>` also pulls in `src/styles/global.css` once, which is responsible for the CRT aesthetic (scanlines, flicker, custom cursors, fonts).

### Contact form flow

1. `Contact.astro` validates `{ name, email, message }` client-side, debounces submissions for 30s, and POSTs JSON to `/api/send-message`.
2. `send-message.ts`:
   - Loads secrets via `readTelegramConfig()` from `src/lib/env.ts`.
   - Rejects non-JSON requests with `415` and oversized bodies (`> 32 KB`).
   - Applies an in-memory per-IP rate limit (`30s`); resets on cold start, so this is best-effort not durable.
   - Validates fields (lengths, email regex).
   - Forwards a formatted string to `https://api.telegram.org/bot<token>/sendMessage`.
   - Never echoes upstream Telegram errors back to the client.
3. The client renders the result via `window.showNotification` (defined by `Notification.astro`); falls back to `alert()` if that helper isn't loaded.

### Last-updated timestamp

`src/pages/index.astro` fetches `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1` **at build time** and ships the resulting ISO timestamp as a `data-commit` attribute. A small inline script counts up from it. If you fork, change `GITHUB_USERNAME` in `consts.ts`.

### Blog (stub)

`src/content.config.ts` defines a `blog` collection backed by `src/content/blog/**/*.{md,mdx}`. That directory doesn't exist yet, so `src/pages/rss.xml.js` produces an empty feed. To start blogging, create `src/content/blog/` and add MDX files matching the schema.

---

## Styling

- **Tailwind v3** via `@astrojs/tailwind`, configured in `tailwind.config.mjs` (scans `./src/**/*`). The `@tailwindcss/typography` plugin is loaded but currently unused — left in place for future MDX posts.
- **Global CSS** in `src/styles/global.css` declares:
  - `@font-face` for `VCR` and `RetroByte` (loaded from `/public/fonts/`).
  - Custom pixel cursors mapped per-element type (body, text inputs, links/buttons).
  - The CRT effects: `.terminal-overlay` (scanlines), `.terminal-flicker`, `.terminal-glow`, `.terminal-scanline`, `.blinking-cursor`, `.fake-caret`, `.hero-bg`.
- **Theme:** black background, white text, `font-pixel` (RetroByte) for headings, `VCR` for body. Selection inverts to white/black.

---

## Deployment (Vercel)

1. Connect the GitHub repo on Vercel.
2. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in **Settings → Environment Variables** for Production and Preview.
3. Vercel auto-detects Astro; no `vercel.json` is needed. The default install (`pnpm install`) and build (`astro build` via `pnpm build`) commands work.
4. The `@astrojs/vercel` adapter emits the function for `/api/send-message` into `.vercel/output/functions/`.

---

## Security notes

- The `/api/send-message` endpoint is the only attack surface that touches real secrets. It hard-caps body size to 32 KB, requires `application/json`, validates field lengths, and rate-limits per IP.
- The rate limiter is process-local — on Vercel's serverless runtime, multiple instances do not share state. For stronger protection, swap `getRateLimitStore()` for an external KV.
- **Never commit `.env`.** The gitignore blocks `.env*` except `.env.example`. If you accidentally commit a token: revoke it via @BotFather first, then rewrite history.

---

## Customization checklist

If you're forking this:

1. Replace everything in `src/consts.ts` (title, description, keywords, projects, nav, GitHub repo). Set `USE_PINNED_REPOS = false` if you want to keep a static project list; leave it `true` and just pin your repos on GitHub otherwise.
2. Swap `src/assets/{hero,villain,house}.{png,gif}` with your own images (same import paths).
3. Update `site:` in `astro.config.mjs` to your own URL.
4. Replace `public/favicon.ico`, `public/muichiro.{ico,svg}`, `public/image.jpg`.
5. Delete `public/google5ebaed34e5db2abf.html` (it's tied to my Google Search Console account).
6. If you want to change cursors or fonts, edit `src/styles/global.css` and `public/{fonts,cursors}/`.
7. Register your bot via @BotFather and set the env vars.

---

## Credits

Theme concept by [@ArnavK-09](https://github.com/ArnavK-09). Everything else built by **kagiyanagi** (Aman). Distributed under the [ISC License](./LICENSE).
