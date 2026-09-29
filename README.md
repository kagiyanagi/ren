# ren

My personal site. Astro + Tailwind, CRT/terminal theme, deployed on Vercel.

https://kagiyanagi.vercel.app

## Setup

Requires Node 22 and pnpm.

```sh
pnpm install
cp .env.example .env
pnpm dev
```

| Command          | Description                            |
| ---------------- | -------------------------------------- |
| `pnpm dev`       | Dev server on `localhost:4321`         |
| `pnpm build`     | Build to `dist/` and `.vercel/output/` |
| `pnpm preview`   | Serve the build locally                |
| `pnpm check`     | Type-check with `astro check`          |
| `pnpm fmt`       | Format with Prettier                   |
| `pnpm fmt:check` | Check formatting                       |

## Environment

All optional. Declared in `astro.config.mjs` and read through `astro:env/server`.

| Variable                   | Used for                                                                        |
| -------------------------- | ------------------------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`       | Contact form. Bot token from [@BotFather](https://t.me/BotFather).              |
| `TELEGRAM_CHAT_ID`         | Contact form. Chat that receives messages.                                      |
| `GITHUB_TOKEN`             | Build-time fetch of pinned repos and latest commit. A classic token, no scopes. |
| `GOOGLE_SITE_VERIFICATION` | Emits the Search Console `<meta>` tag.                                          |

## How it works

The site is fully static except `src/pages/api/send-message.ts` (`prerender = false`), which Vercel deploys as a serverless function. That route is the reason for the Vercel adapter.

- **Content** lives in `src/consts.ts`: site metadata, projects, nav links, taglines, tech list.
- **Projects** come from GitHub pinned repos at build time (`src/lib/github.ts`). With no token or on failure, it falls back to `PROJECTS` in `consts.ts`.
- **Contact form** POSTs JSON to `/api/send-message`, which checks content type, caps the body at 32 KB, validates fields, rate-limits by IP (30s, in memory, per instance), and forwards to Telegram. Upstream errors are not passed back to the client.
- **CRT effect** is a WebGL shader in `src/components/CRT.astro`. Other components trigger glitches and mode changes through `src/lib/fx.ts`. Motion effects are disabled under `prefers-reduced-motion`.
- **Terminal**: press `~`. Try `help`.

Imports use the `@/` alias for `src/`.

```
src/
├── assets/       images processed at build time
├── components/   Astro components, client JS in per-component <script>
├── layouts/      Layout.astro, the shared page shell
├── lib/          fx.ts (client effects), github.ts (build-time fetch)
├── pages/        index, 404, api/send-message
├── styles/       global.css: fonts, cursors, scanlines
└── consts.ts
```

## Deploy

Import the repo in Vercel and set the env vars for Production and Preview. It picks up Astro and pnpm without extra config. Pinned repos and the commit timestamp are fetched at build time, so they only update on the next deploy.

## Forking

1. Edit `src/consts.ts` and `site` in `astro.config.mjs`.
2. Replace the images in `src/assets/` and the icons and `image.jpg` in `public/`.
3. Delete `public/google5ebaed34e5db2abf.html`. It's tied to my Search Console account.

## License

[ISC](./LICENSE). Original theme by [@ArnavK-09](https://github.com/ArnavK-09).
