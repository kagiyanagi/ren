# ren - kagiyanagi's portfolio

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

| Variable                   | Required | Purpose                                                                                                                                                                                                                       |
| -------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`       | yes      | Bot token from [@BotFather](https://t.me/BotFather).                                                                                                                                                                          |
| `TELEGRAM_CHAT_ID`         | yes      | Your numeric Telegram chat id (where messages get sent).                                                                                                                                                                      |
| `GITHUB_TOKEN`             | optional | Used at build time by `src/lib/github.ts` to fetch pinned repos via GraphQL. Any classic token with no scopes works - pinned repo metadata is public. Without it, the static `PROJECTS` list is shown.                        |
| `GOOGLE_SITE_VERIFICATION` | optional | The `content` value from Google Search Console's "HTML tag" method. When set, `BaseHead.astro` emits a `<meta name="google-site-verification">` tag at build time. Set this in Vercel env vars to avoid committing the token. |

All four are declared in the `env.schema` block of `astro.config.mjs` and imported from `astro:env/server`.

For Vercel, add both variables under **Project → Settings → Environment Variables** for the `Production` and `Preview` environments.

### Local override file precedence

Astro loads `.env`, `.env.production`, `.env.development`, and `.env.*.local`. All of these are gitignored except `.env.example`.

---

## Architecture

### Rendering model

- `astro.config.mjs` sets `output: "static"` - the site is fully prerendered…
- …with **one exception**: `src/pages/api/send-message.ts` declares `export const prerender = false`, which is why the project ships the Vercel adapter. Vercel deploys that single file as a serverless function and serves everything else as static assets.

### Source layout

```
src/
├── assets/          # Build-time images (imported via @/assets/*). Astro fingerprints + optimizes these.
│   ├── hero.png       - used in <Hero>
│   ├── house.gif      - used in the "Contact me" section
│   └── villain.png    - used in the "About me" section
├── components/      # Astro components, all server-rendered. Per-component <script> tags ship client JS.
│   ├── BaseHead.astro       - <head> contents, OG/Twitter/JSON-LD, font preload, pre-paint phosphor/boot check
│   ├── Boot.astro           - once-per-session MAGI boot screen + CRT power-on
│   ├── Breadcrumb.astro     - white "tech" sticker with a data-tip note (TECH_NOTES)
│   ├── CRT.astro            - full-page WebGL shader: 0/1 glyph field, glitches, matrix/alert modes
│   ├── Contact.astro        - contact form (native validation, underscore caret, cooldown)
│   ├── Extras.astro         - custom [data-tip] tooltip, typed-word + konami easter eggs, idle screensaver, tab title, console note
│   ├── Footer.astro         - footer with dynamic year and my IST clock
│   ├── Hero.astro           - landing hero block
│   ├── Navbar.astro         - top nav, scroll-styled logo
│   ├── Notification.astro   - global toast root, exposes window.showNotification
│   ├── ProjectCard.astro    - project tile (composed inside WindowCard)
│   ├── Section.astro        - titled section wrapper (`<Title />` styling, decodes on scroll)
│   ├── Terminal.astro       - `~` drop-down terminal (<dialog>), all the commands live here
│   └── WindowCard.astro     - "macOS window" frame used by ProjectCard / Contact (working dots)
├── layouts/
│   └── Layout.astro         - shared HTML shell (head + nav + main + footer + notification root)
├── lib/
│   ├── fx.ts                - client-side helpers: text scramble, phosphor themes, shared easter eggs
│   └── github.ts            - build-time fetcher for GitHub pinned repos + latest commit
├── pages/
│   ├── 404.astro            - uses <Layout>, links to /index, the contact form, and a refresh
│   ├── api/
│   │   └── send-message.ts  - only dynamic route; rate-limited proxy to Telegram
│   └── index.astro          - the entire homepage
├── styles/
│   └── global.css           - fonts, custom cursors, scanline/flicker effects, scrollbar
└── consts.ts                - site metadata, projects, nav links, GitHub repo

public/
├── cursors/         # Pixel-art cursors used in global.css
├── fonts/           # VCR OSD NEUE, RetroByte (preloaded in <head>)
├── favicon.ico      - actual favicon
├── muichiro.ico     - alternate favicon
├── muichiro.svg     - SVG favicon
├── humans.txt       - credits, linked from the footer
├── robots.txt       - allow all + sitemap
├── image.jpg        - default OG/Twitter share image
├── terminal_bell.mp3 - sound played on backspace in empty input
└── google5ebaed34e5db2abf.html - Google Search Console verification
```

### Path aliasing

`vite.resolve.alias` maps `@/*` → `./src/*`. Always import via the alias (`@/components/...`, `@/lib/github`, `@/assets/...`) - never relative paths.

### Single source of truth: `src/consts.ts`

Everything user-facing is driven from this file. Edit here, not in templates:

- `SITE_TITLE`, `SITE_DESCRIPTION`, `TWITTER_HANDLE` → fed into `<BaseHead>` and JSON-LD.
- `KNOWN_TECH` → renders the "Technologies I like" pills; `TECH_NOTES` → their hover notes.
- `TAGLINES` → the hero subtitle rotation (first one is what ships in the HTML).
- `PROJECTS` → project cards, used when pinned repos can't be fetched.
- `NAV_LINKS` → top-nav entries (external `https://…` URLs, opened in a new tab).
- `GITHUB_USERNAME` / `GITHUB_REPO` → used by the index page's last-commit fetch, the footer link, and the pinned-repos fetcher.

### Pinned repos as projects

At build time `src/lib/github.ts` makes one GraphQL request (requires `GITHUB_TOKEN`) for your pinned repos' name, description, and `pushedAt`. If it returns at least one project, those replace `PROJECTS`. With no token, or on any failure, the static `PROJECTS` constant is used as a safety net. Updating your pinned repos on GitHub is enough - no commits, no redeploys until the next site rebuild.

### Layout flow

`Layout.astro` is the shell every page uses. It renders `<BaseHead>` (meta + JSON-LD + fonts), a `<Navbar>` (fixed from `md` up), a `<main>` slot, `<Footer>`, and the `<Notification>` toast root. `<BaseHead>` also pulls in `src/styles/global.css` once, which is responsible for the CRT aesthetic (scanlines, flicker, custom cursors, fonts).

### Contact form flow

1. `Contact.astro` relies on native HTML validation (`required`, `type="email"`, `maxlength`), enforces a 30s cooldown, and POSTs JSON to `/api/send-message`.
2. `send-message.ts`:
   - Reads `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` from `astro:env/server`.
   - Rejects non-JSON requests with `415` and oversized bodies (`> 32 KB`).
   - Applies an in-memory per-IP rate limit (`30s`, counted only for valid requests); resets on cold start, so this is best-effort not durable.
   - Validates fields (lengths, email regex).
   - Forwards a formatted string to `https://api.telegram.org/bot<token>/sendMessage`.
   - Never echoes upstream Telegram errors back to the client.
3. The client renders the result via `window.showNotification` (defined by `Notification.astro`).

### Last-updated timestamp

`fetchLatestCommitDate()` in `src/lib/github.ts` fetches `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1` **at build time** (authenticated when `GITHUB_TOKEN` is set) and ships the resulting ISO timestamp as a `data-commit` attribute. A small inline script counts up from it. If you fork, change `GITHUB_USERNAME` in `consts.ts`.

---

## Styling

- **Tailwind v3** via `@astrojs/tailwind`, configured in `tailwind.config.mjs` (scans `./src/**/*`).
- **Global CSS** in `src/styles/global.css` declares:
  - `@font-face` for `VCR` and `RetroByte` (loaded from `/public/fonts/`).
  - Custom pixel cursors mapped per-element type (body, text inputs, links/buttons).
  - The CRT effects: `.terminal-overlay` (scanlines), `.terminal-flicker`, `.terminal-glow`, `.terminal-scanline`, `.blinking-cursor`, `.hero-bg`. Inputs use native `caret-shape: underscore` (Chromium; other browsers show a normal caret).
- **Theme:** black background, white text, `font-pixel` (RetroByte) for headings, `VCR` for body. Selection inverts to white/black.
- **CRT glass:** `body::before` lays scanlines, vignette and grain over everything. Picking a phosphor (`theme green|amber` in the terminal) sets `html[data-phosphor]`, and `body::after` multiplies the whole page with that colour.
- **Scroll reveals** use native `animation-timeline: view()` inside `@supports`, so browsers without it just show the content.

### Effects and easter eggs

The shader (`CRT.astro`) listens for `fx` events (`glitch`, `mode`), and everything else fires them through `src/lib/fx.ts`. The boot screen, typewriter, glitches and screensaver all turn off under `prefers-reduced-motion`, and the shader renders a single still frame.

Spoilers: `~` opens a terminal (`help`, plus a few hidden commands), the konami code, typing `arch` / `sudo` / `nerv` / `matrix` / `degauss` / `:q` on the page, poking the logo or Shinji, the window dots on the cards, and leaving the tab alone for 90 seconds.

---

## Deployment (Vercel)

1. Connect the GitHub repo on Vercel.
2. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in **Settings → Environment Variables** for Production and Preview.
3. Vercel auto-detects Astro; no `vercel.json` is needed. The default install (`pnpm install`) and build (`astro build` via `pnpm build`) commands work.
4. The `@astrojs/vercel` adapter emits the function for `/api/send-message` into `.vercel/output/functions/`.

---

## Security notes

- The `/api/send-message` endpoint is the only attack surface that touches real secrets. It hard-caps body size to 32 KB, requires `application/json`, validates field lengths, and rate-limits per IP.
- The rate limiter is process-local - on Vercel's serverless runtime, multiple instances do not share state. For stronger protection, swap `getRateLimitStore()` for an external KV.
- **Never commit `.env`.** The gitignore blocks `.env*` except `.env.example`. If you accidentally commit a token: revoke it via @BotFather first, then rewrite history.

---

## Customization checklist

If you're forking this:

1. Replace everything in `src/consts.ts` (title, description, projects, nav, GitHub repo). Set `GITHUB_TOKEN` and pin repos on GitHub to have them listed automatically; otherwise `PROJECTS` is shown.
2. Swap `src/assets/{hero,villain,house}.{png,gif}` with your own images (same import paths).
3. Update `site:` in `astro.config.mjs` to your own URL.
4. Replace `public/favicon.ico`, `public/muichiro.{ico,svg}`, `public/image.jpg`.
5. Delete `public/google5ebaed34e5db2abf.html` (it's tied to my Google Search Console account).
6. If you want to change cursors or fonts, edit `src/styles/global.css` and `public/{fonts,cursors}/`.
7. Register your bot via @BotFather and set the env vars.

---

## Credits

Theme concept by [@ArnavK-09](https://github.com/ArnavK-09). Everything else built by **kagiyanagi** (Aman). Distributed under the [ISC License](./LICENSE).
