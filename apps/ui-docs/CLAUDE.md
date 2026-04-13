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
- Output: static (all pages prerendered at build time)
- No SSR adapter — pure static HTML served by Cloudflare Pages CDN

## Dependencies

- `@saastro/shell` — Header, Footer, SEO, Analytics
- `astro` ^6.0.3 + `@astrojs/cloudflare`
- Full Radix UI + Tailwind CSS 4 stack

## Dev Server

```bash
bun run dev      # Port 4911
bun run build    # Build for production
```

## Deployment — Cloudflare Pages (Static)

Production: `ui.saastro.io` · Pages project: `saastro-ui`

Switched from SSR to Static on 2026-04-03. All pages are prerendered at build
time — no Cloudflare Worker, no adapter, no wrangler.jsonc.

### Pages dashboard config (already applied)

| Field | Value |
|-------|-------|
| Framework preset | Astro |
| Root directory | `apps/ui-docs` |
| Build command | `cd ../.. && echo "//npm.pkg.github.com/:_authToken=${GH_PACKAGES_TOKEN}" >> .npmrc && bun install && bunx turbo run build --filter=@saastro/ui-docs` |
| Build output directory | `dist` |

**Env vars (Prod + Preview):**

| Variable | Value | Notes |
|----------|-------|-------|
| `GH_PACKAGES_TOKEN` | PAT with `read:packages` | For `@saastro-io/*` from GitHub Packages |
| `NODE_VERSION` | `22` | Required by Astro 6+ |
| `SKIP_DEPENDENCY_INSTALL` | `true` | Prevents Pages from running `npm install` before build command |

No GitHub Actions workflow, no `CLOUDFLARE_API_TOKEN`, no `CLOUDFLARE_ACCOUNT_ID`
needed. Pages git integration handles deploy on push to main.

### Why static, not SSR

1. All pages use `getCollection`/`getStaticPaths` — no server-side logic
2. `@astrojs/cloudflare` v13 generates Workers-model output that Pages git
   integration cannot deploy (requires `wrangler pages deploy` via GitHub Actions)
3. Static removes the Worker middleman — CDN serves HTML directly (faster, simpler)

### If SSR is ever needed again

See `saastro-docs/cloudflare-pages.md` for the full SSR setup (GitHub Actions
workflow, wrangler.jsonc, adapter config, and how to switch between modes).

### Known Issues

- **Glob paths in `[name].astro`**: Uses 5 levels of `../` from `src/pages/blocks/` to reach `packages/ui-registry/registry/default/blocks/*.tsx`. If source code shows "Source not found", check the relative path depth.
- **Zod v4 in Astro 6**: Complex union/record schemas crash content store JSON schema generation. Settings schema uses `z.any()` for non-critical fields as workaround.

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


<claude-mem-context>
# Recent Activity

<!-- This section is auto-generated by claude-mem. Edit content outside the tags. -->

### Mar 27, 2026

| ID | Time | T | Title | Read |
|----|------|---|-------|------|
| #811 | 7:01 PM | 🔵 | Cloudflare Pages SSR deployment configuration analyzed across projects | ~437 |
| #623 | 1:21 PM | 🔵 | @saastro-io package usage comparison across monorepos | ~435 |

### Apr 13, 2026

| ID | Time | T | Title | Read |
|----|------|---|-------|------|
| #4457 | 10:59 AM | ✅ | Pinned docs-theme dependency to version 0.2.0 | ~220 |
</claude-mem-context>