# @saastro/ui-docs

Block showcase and registry site for @saastro/ui-registry.
Deployed at ui.saastro.io via Cloudflare Pages.

## Purpose

1. **Block showcase** — Live previews, source code, and install commands for all Saastro blocks
2. **Registry endpoint** — Serves `public/r/*.json` for shadcn CLI consumption
3. **Documentation** — How to install, configure, and use blocks in Astro projects

## Structure

```
src/
├── pages/
│   ├── index.astro                  # Landing page — "Blocks for Astro"
│   ├── blocks/
│   │   ├── index.astro              # Block gallery with category filter
│   │   └── [name].astro             # Block detail (preview + code + install)
│   ├── docs.astro                   # Docs listing
│   └── docs/[...slug].astro         # Dynamic doc pages
├── components/
│   ├── ui/                          # 43 React components (shadcn/Radix primitives)
│   ├── block-renderer.tsx           # Renders blocks with sample data (client:visible)
│   └── code-viewer.tsx              # Code display + copy button, install command
├── data/
│   ├── blocks.ts                    # Block metadata (name, title, category, deps)
│   └── settings.yaml                # Site configuration (i18n, metadata, analytics)
├── content/
│   └── docs/                        # Markdown documentation pages
│       ├── introduction/
│       ├── installation/
│       ├── cli/
│       ├── components-json/
│       ├── dark-mode/
│       ├── theming/
│       ├── typography/
│       └── changelog/
├── layouts/
│   ├── BaseLayout.astro             # Root layout (shell header/footer/meta)
│   └── DocsLayout.astro             # Sidebar layout (docs + block categories)
├── navigation/
│   ├── header.ts                    # Header nav (Home, Blocks, Docs)
│   └── footer.ts                    # Footer links
└── styles/
    └── global.css                   # Tailwind + theme variables
```

## Registry Serving

Registry JSON files in `public/r/` served at `https://ui.saastro.io/r/{name}.json`.

Users configure in their `components.json`:

```json
{
  "registries": {
    "@saastro": "https://ui.saastro.io/r/{name}.json"
  }
}
```

## Block Preview System

- `block-renderer.tsx` — Imports all 15 blocks from `@blocks/*` alias
- Each block rendered with hardcoded sample data for showcase
- Uses `client:visible` for lazy hydration (only on interactive blocks)
- Source code read at build time via `import.meta.glob` with `?raw`

## Vite Aliases

- `@` → `./src`
- `@blocks` → `../../packages/ui-registry/registry/default/blocks`

## Key Details

- Port: 4911 (`ui-docs.saastro.test`)
- Output: SSR (server) with Cloudflare adapter
- Prerendered: block detail pages + doc pages (uses Node.js APIs)

## Dependencies

- `@saastro/shell` — Header, Footer, SEO, Analytics
- `astro` ^6.0.3 + `@astrojs/cloudflare`
- Full Radix UI + Tailwind CSS 4 stack

## Dev Server

```bash
bun run dev      # Port 4911
bun run build    # Build for production
```

### Known Issues

- **`debug` CJS module**: micromark (via @astrojs/mdx → remark-gfm) imports `debug` which uses `module.exports`, breaks in Cloudflare Workers (workerd). Fixed with `src/lib/debug-stub.ts` no-op alias in `astro.config.mjs`.
- **Glob paths in `[name].astro`**: Uses 5 levels of `../` from `src/pages/blocks/` to reach `packages/ui-registry/registry/default/blocks/*.tsx`. If source code shows "Source not found", check the relative path depth.
- **Zod v4 in Astro 6**: Complex union/record schemas crash content store JSON schema generation. Settings schema uses `z.any()` for non-critical fields as workaround.
- **wrangler.jsonc**: Astro 6 Cloudflare adapter manages the `main` entry point — do NOT add `main` or `assets` fields.

## Pro/Monetization (FUTURE)

Pro blocks will live in a **separate private repo** (`saastro/blocks-pro`), NOT in this monorepo.

- Free blocks (15): `packages/ui-registry/` in Saastro-HUB monorepo → served at `ui.saastro.io/r/`
- Pro blocks: `saastro/blocks-pro` repo → served at `pro.ui.saastro.io/r/`
- Users configure two registries in `components.json`:
  ```json
  {
    "registries": {
      "@saastro": "https://ui.saastro.io/r/{name}.json",
      "@saastro-pro": "https://pro.ui.saastro.io/r/{name}.json"
    }
  }
  ```
- Purchase = GitHub access to the private repo (via Lemon Squeezy / Gumroad)
- No auth middleware, no Stripe, no license tokens needed
- See `TODO-UI-PIVOT.md` Phase 5 for full details
