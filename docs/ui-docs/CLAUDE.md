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

## Deployment — Cloudflare Pages

Production: `ui.saastro.io` · Pages project: `saastro-ui`

### Two modes depending on whether SSR is needed

#### Mode A: Static (all pages prerender) — current

When every page has `export const prerender = true`, no SSR worker is needed.
Pages git integration handles everything automatically.

**Astro config:**
```js
output: "static"     // or remove output entirely (static is default)
// adapter: cloudflare()  ← remove or comment out
```

**Pages settings:**
| Field | Value |
|-------|-------|
| root_dir | `docs/ui-docs` |
| build_command | `cd ../.. && echo "//npm.pkg.github.com/:_authToken=${GH_PACKAGES_TOKEN}" >> .npmrc && bun install && cd docs/ui-docs && bun run build` |
| destination_dir | `dist` |

**Env vars:** `GH_PACKAGES_TOKEN`, `NODE_VERSION=22`, `SKIP_DEPENDENCY_INSTALL=true`

No wrangler.jsonc needed for deployment. Pages serves static HTML natively.

#### Mode B: SSR (some pages are server-rendered)

When at least one page does NOT have `prerender = true`, the Astro Cloudflare
adapter generates a Worker that handles routing + SSR. **Pages git integration
cannot deploy this Worker** — use GitHub Actions instead.

**Astro config:**
```js
output: "server"
adapter: cloudflare({ imageService: 'passthrough' })
```

**Why git integration fails:** `@astrojs/cloudflare` v13 generates Workers-model
output (`main` + `assets` binding). Pages git integration expects either
`pages_build_output_dir` in wrangler.jsonc (which breaks the Astro build because
the `ASSETS` binding name is reserved) or `_worker.js/` in the output dir (which
the adapter doesn't generate). The Worker is required even for prerendered pages
because it handles HTML routing (e.g. `/` → `/index.html`).

**Deploy via GitHub Actions:**
```yaml
# .github/workflows/deploy-ui-docs.yml
name: Deploy ui-docs
on:
  push:
    branches: [main]
    paths: [docs/ui-docs/**, packages/ui-registry/**]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with: { bun-version: "1.2.4" }
      - run: echo "//npm.pkg.github.com/:_authToken=${{ secrets.GH_PACKAGES_TOKEN }}" >> .npmrc
      - run: bun install --frozen-lockfile
      - run: bun run build --filter=@saastro/ui-docs
      - name: Deploy
        working-directory: docs/ui-docs
        run: npx wrangler pages deploy dist/client --project-name saastro-ui --branch main
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**Pages settings:** Disable `production_deployments_enabled` and `deployments_enabled`
in the Pages project so git pushes don't trigger the broken built-in deploy.

**Secrets required:** `CLOUDFLARE_API_TOKEN` (Pages edit), `CLOUDFLARE_ACCOUNT_ID`, `GH_PACKAGES_TOKEN`

**wrangler.jsonc** (docs/ui-docs/):
```jsonc
{
  "name": "saastro-ui-docs",
  "compatibility_date": "2025-11-12",
  "compatibility_flags": ["nodejs_compat_v2"],
  "observability": { "enabled": true }
}
```
Do NOT add `main`, `assets`, or `pages_build_output_dir` — the adapter manages
these via `.wrangler/deploy/config.json` (generated at build time, gitignored).

### Switching between modes

**Static → SSR:**
1. Add `adapter: cloudflare(...)` to astro.config.mjs
2. Change `output: "server"` (or remove `output` and set per-page)
3. Create `.github/workflows/deploy-ui-docs.yml` (see Mode B above)
4. Disable Pages git integration via API or dashboard
5. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets to GitHub

**SSR → Static:**
1. Ensure ALL pages have `export const prerender = true`
2. Remove `adapter` and set `output: "static"` in astro.config.mjs
3. Re-enable Pages git integration
4. Update Pages build settings (see Mode A table)
5. Delete the GitHub Actions workflow

### Known Issues

- **`debug` CJS module**: micromark (via @astrojs/mdx → remark-gfm) imports `debug` which uses `module.exports`, breaks in Cloudflare Workers (workerd). Fixed with `src/lib/debug-stub.ts` no-op alias in `astro.config.mjs`.
- **Glob paths in `[name].astro`**: Uses 5 levels of `../` from `src/pages/blocks/` to reach `packages/ui-registry/registry/default/blocks/*.tsx`. If source code shows "Source not found", check the relative path depth.
- **Zod v4 in Astro 6**: Complex union/record schemas crash content store JSON schema generation. Settings schema uses `z.any()` for non-critical fields as workaround.
- **`.wrangler/deploy/`**: Generated by Astro adapter at build time. Must be gitignored — if committed, Pages tries to resolve `dist/server/wrangler.json` before build runs and fails.
- **Root `wrangler.jsonc`**: Do NOT create one at repo root. Pages reads it instead of `docs/ui-docs/wrangler.jsonc` and the Workers-model paths don't match the Pages environment.

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
</claude-mem-context>