# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio for "Aman" (a.k.a. kagiyanagi / ren / aqua), deployed to https://kagiyanagi.vercel.app. Terminal/CRT aesthetic — mono fonts, scanline overlay, custom pixel cursors, fake terminal caret in form inputs. See `README.md` for full user-facing docs.

## Commands

Package manager is **pnpm** (Node 22 per `engines`). There is **no test suite or linter** — only `astro check` and Prettier.

- `pnpm dev` — Astro dev server (default port 4321)
- `pnpm build` — production build (also emits `.vercel/output/` via the Vercel adapter)
- `pnpm preview` — preview built site
- `pnpm check` — `astro check` (type checks `.astro` + `.ts`)
- `pnpm fmt` / `pnpm fmt:check` — Prettier with `prettier-plugin-astro`

## Architecture

**Static Astro site** (`output: "static"` in `astro.config.mjs`) with one prerender-disabled API route, hence the Vercel adapter is required. Path alias `@/*` → `./src/*` — always import via the alias.

### Single source of truth: `src/consts.ts`

Every piece of user-facing content (`SITE_TITLE`, `SITE_DESCRIPTION`, `SEO_KEYWORDS`, `NAV_LINKS`, `KNOWN_TECH`, `PROJECTS`, `ABOUT_ME`, `GITHUB_USERNAME`, `GITHUB_REPO`, `TWITTER_HANDLE`) is exported from here. Templates only reference these — do not hardcode strings in pages or components. SEO output (`BaseHead.astro` JSON-LD) depends on this file being accurate.

### Layout / page composition

`src/layouts/Layout.astro` is the shell for every page: `<BaseHead>` → fixed `<Navbar>` → `<main><slot/></main>` → `<Footer>` → global `<Notification>` toast root. `src/pages/index.astro` is the only content page; `src/pages/404.astro` reuses the same Layout.

`src/pages/index.astro` fetches the latest commit timestamp from `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1` **at build time** and ships it as a `data-commit` attribute that a client-side script counts up from. The repo identifier comes from `consts.ts` — change `GITHUB_USERNAME` there if forking.

### `/api/send-message` (the only dynamic route)

`src/pages/api/send-message.ts` has `export const prerender = false;`. Reads secrets via `readTelegramConfig()` from `src/lib/env.ts` (canonical keys `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`; `BOT_TOKEN` / `CHAT_ID` accepted as fallback). Validates JSON, caps bodies at 32 KB, enforces a 30-second per-IP in-memory rate limit (resets on cold start — not durable across serverless instances), and forwards to Telegram's `sendMessage`. Upstream Telegram errors are logged but never returned to the client.

### Assets

- `src/assets/{hero.png, villain.png, house.gif}` — imported via `@/assets/*` and processed by Astro (fingerprinted, optimized).
- `public/*` — copied verbatim (fonts, favicons, OG image, terminal bell sound, Google Search Console verification HTML, pixel cursors).
- The blog collection (`src/content.config.ts`) is defined but no posts exist; `src/pages/rss.xml.js` currently emits an empty feed.

### Styling

- Tailwind v3 via `@astrojs/tailwind` + `@tailwindcss/typography` (typography plugin loaded but unused, kept for future MDX).
- `src/styles/global.css` (imported once via `BaseHead.astro`) owns: `@font-face` declarations (`VCR`, `RetroByte`), per-element pixel cursors, the CRT scanline/flicker/glow classes, the `.hero-bg` binary field, and the `.fake-caret` used by the contact form.

### Components worth knowing

- `BinaryBackground.astro` — generates a random 0/1 field on resize/interval. The Footer also reuses the same `data-binary-bg` hook.
- `Navbar.astro` — resolves nav hrefs: external (protocol-relative or `https://`) gets `target="_blank"`; internal gets a leading `/` and an active-state highlight. Don't reintroduce the old `/${href}` concatenation — it breaks protocol-relative URLs.
- `Contact.astro` — client validation + 30s cooldown + fake terminal caret (mirrors input styles into a hidden div to compute caret position) + terminal-bell sound on backspace in empty inputs.
- `Notification.astro` — defines `window.showNotification(message, type, ttl)` used by `Contact.astro`. Not typed globally; callers null-check before use.

## Security history

A prior commit (`e7e847f`) committed a hardcoded Telegram bot token and chat id as fallback defaults in `send-message.ts`. The current source is clean, but the token remains in public git history. If the user mentions secrets or asks to clean history, raise this and recommend revoking the token via @BotFather first.

## Conventions

- Use the `@/...` alias for every internal import.
- Don't add `vercel-build` back to `package.json` — Vercel picks up `pnpm build` automatically.
- Don't commit anything matching `.env*` except `.env.example` (enforced by `.gitignore`).
- Run `pnpm fmt` before committing (no pre-commit hook).
