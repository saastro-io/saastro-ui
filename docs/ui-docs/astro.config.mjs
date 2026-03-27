// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";
import { readFileSync } from 'node:fs';
import icon from "astro-icon";

import yaml from 'yaml';

import mdx from "@astrojs/mdx";
import { fileURLToPath } from "node:url";

const raw = readFileSync(fileURLToPath(new URL('./src/data/settings.yaml', import.meta.url)), 'utf-8');
const cfg = yaml.parse(raw) || {};

export default defineConfig({
  site: cfg.site.site,
  trailingSlash: cfg.site.trailingSlash,
  output: "server",
  server: {
    port: 4911,
    host: true,
    allowedHosts: ["ui-docs.saastro.test"],
  },
  adapter: cloudflare({
    // Use passthrough: no image processing (Sharp not available in Workers runtime)
    imageService: 'passthrough',
  }),
  integrations: [react(), sitemap(), icon(), mdx()],
  vite: {
    //@ts-ignore
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@blocks": fileURLToPath(new URL("../../packages/ui-registry/registry/default/blocks", import.meta.url)),
        "@ui-registry": fileURLToPath(new URL("../../packages/ui-registry/registry/default/ui", import.meta.url)),
        "debug": fileURLToPath(new URL("./src/lib/debug-stub.ts", import.meta.url)),
        "limax": fileURLToPath(new URL("./src/lib/speakingurl-stub.ts", import.meta.url)),
      },
      dedupe: ['class-variance-authority', '@radix-ui/react-slot', 'react', 'react-dom'],
    },
    build: {
      minify: 'esbuild',
      cssMinify: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    ssr: {
      noExternal: ['class-variance-authority', '@radix-ui/react-slot'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'class-variance-authority', '@radix-ui/react-slot'],
    },
  },
});