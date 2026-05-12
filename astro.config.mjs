// @ts-check
import { defineConfig } from "astro/config";
import path from "node:path";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercelAdapter from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://kagiyanagi.vercel.app",
  output: "static",
  adapter: vercelAdapter(),
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-high-contrast",
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
