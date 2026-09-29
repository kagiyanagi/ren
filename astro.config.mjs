// @ts-check
import { defineConfig, envField } from "astro/config";
import path from "node:path";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercelAdapter from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://kagiyanagi.vercel.app",
  output: "static",
  adapter: vercelAdapter(),
  integrations: [sitemap(), tailwind()],
  env: {
    schema: {
      TELEGRAM_BOT_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      TELEGRAM_CHAT_ID: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      GITHUB_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      GOOGLE_SITE_VERIFICATION: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
    },
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
