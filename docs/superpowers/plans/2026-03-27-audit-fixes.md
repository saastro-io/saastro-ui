# Saastro UI Audit Fixes — Implementation Plan

> **Documento histórico (ejecutado el 2026-03-27).** Los comandos `bun install` /
> `bun run build` / `oven-sh/setup-bun` que aparecen abajo eran correctos
> entonces. El repo migró a pnpm el 2026-08-17: hoy el equivalente es
> `pnpm install` / `pnpm run build` / `pnpm/action-setup@v6`. No se reescribe el
> cuerpo del plan para no falsear el registro.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 12 technical debt issues (2 critical, 2 high, 5 medium, 3 low) identified in the saastro-ui project audit.

**Architecture:** All changes are config/docs/metadata fixes — no business logic changes. Tasks are independent and can be parallelized. Verification is a successful `bun run build`.

**Tech Stack:** Astro 6, TypeScript, Bun, Turborepo

**Dropped from audit:** Issue #8 (navbar-01 missing `navigation-menu` in blocks.ts dependencies) — verified that `navbar-01.tsx` does NOT import `navigation-menu`. The dependency list `['button', 'sheet']` is correct.

---

## File Map

| Action | File | Task |
|--------|------|------|
| Delete | `docs/ui-docs/src/pages/docs/introduction.mdx` | 1 |
| Delete | `docs/ui-docs/context.md` | 1 |
| Modify | `docs/ui-docs/src/data/settings.yaml` | 2 |
| Modify | `docs/ui-docs/src/navigation/footer.ts` | 3 |
| Modify | `knowledge/ui-docs.md` | 4 |
| Modify | `knowledge/ui-registry.md` | 4 |
| Modify | `CLAUDE.md` | 5 |
| Remove task | `turbo.json` (typecheck + lint) | 6 |
| Remove step | `.github/workflows/ci.yml` (typecheck) | 6 |
| Remove script | `package.json` (root: typecheck + lint) | 6 |
| Modify | `docs/ui-docs/tsconfig.json` | 7 |
| Modify | `docs/ui-docs/package.json` | 8 |
| Modify | `docs/ui-docs/astro.config.mjs` | 9 |
| Modify | `knowledge/INDEX.md` | 10 |

---

### Task 1: Delete stale enloAstro files (Critical #1 + Medium #9)

**Files:**
- Delete: `docs/ui-docs/src/pages/docs/introduction.mdx`
- Delete: `docs/ui-docs/context.md`

**Why:** `introduction.mdx` contains enloAstro-era content about "saastro/ui vs shadcn/ui" vanilla JS comparison that doesn't match the current project (which uses React + shadcn). It also creates a routing conflict with the content collection in `pages/docs/[...slug].astro`. `context.md` is a 334-line enloAstro architectural guide that's completely outdated.

- [ ] **Step 1: Delete introduction.mdx**

```bash
rm docs/ui-docs/src/pages/docs/introduction.mdx
```

- [ ] **Step 2: Delete context.md**

```bash
rm docs/ui-docs/context.md
```

- [ ] **Step 3: Verify build still passes**

```bash
cd docs/ui-docs && bun run build
```

Expected: Build succeeds without errors.

- [ ] **Step 4: Commit**

```bash
git add -u docs/ui-docs/src/pages/docs/introduction.mdx docs/ui-docs/context.md
git commit -m "chore(ui-docs): delete stale enloAstro files

Remove introduction.mdx (routing conflict with content collections)
and context.md (outdated architectural guide)."
```

---

### Task 2: Fix settings.yaml placeholder values (Critical #2)

**Files:**
- Modify: `docs/ui-docs/src/data/settings.yaml`

**Why:** All branding values are still "TuMarca" / "tumarca.com" placeholders from the template. Analytics IDs are dummy values.

- [ ] **Step 1: Update settings.yaml**

Replace the full file content with:

```yaml
site:
  name: "Saastro UI"
  site: "https://ui.saastro.io"
  base: "/"
  trailingSlash: "never"
  googleSiteVerificationId:
  favicon:
    colors:
      icon: "#00a897"
      theme: "#00a897"

i18n:
  language: "en"
  textDirection: "ltr"

metadata:
  title:
    default: "Saastro UI"
    template: "%s | Saastro UI"
  description: "Open-source landing page blocks for Astro. Install via shadcn CLI."
  robots:
    index: true
    follow: true
  openGraph:
    type: "website"
    site_name: "Saastro UI"
    images: []
  twitter:
    card: "summary_large_image"

apps:
  blog:
    isEnabled: false
    list:
      pathname: "blog"
      robots: { index: true, follow: true }
    category: { pathname: "category" }
    tag: { pathname: "tag" }
    post:
      permalink: "/blog/%slug%"
      robots: { index: true, follow: true }
    postsPerPage: 6
ui:
  theme: "system"

analytics:
  googleAnalytics:
    id: ""
  googleTagManager:
    id: ""

cookieConsent:
  privacyPolicyUrl: "/privacy"
  position: "bottom"
  theme: "auto"
```

Key changes:
- `name`: "TuMarca" -> "Saastro UI"
- `site`: "https://tumarca.com" -> "https://ui.saastro.io"
- `language`: "es" -> "en"
- `title.default` / `title.template` / `openGraph.site_name`: "TuMarca" -> "Saastro UI"
- `description`: generic template text -> actual project description
- `analytics.googleAnalytics.id`: "G-XXXXXXXXXX" -> "" (empty until real ID is available)
- `analytics.googleTagManager.id`: "GTM-XXXXXXX" -> "" (empty until real ID is available)

- [ ] **Step 2: Verify build still passes**

```bash
cd docs/ui-docs && bun run build
```

Expected: Build succeeds. The settings.yaml is parsed at build time by `astro.config.mjs` and `content.config.ts`.

- [ ] **Step 3: Commit**

```bash
git add docs/ui-docs/src/data/settings.yaml
git commit -m "fix(ui-docs): replace placeholder branding with Saastro UI values

Update site name, URL, language, metadata, and clear dummy analytics IDs."
```

---

### Task 3: Fix footer.ts dead links and wrong GitHub URL (High #3)

**Files:**
- Modify: `docs/ui-docs/src/navigation/footer.ts:20-75`

**Why:** Footer has links to non-existent pages (`/docs/components`, `/privacy`, `/terms`) and GitHub points to `saastro-hub` instead of `saastro-ui`.

- [ ] **Step 1: Update getFooterMenu()**

In `docs/ui-docs/src/navigation/footer.ts`, replace the `getFooterMenu()` function body:

```typescript
export function getFooterMenu(): FooterData {
  return {
    tagline: 'UI components for Astro',
    links: [
      {
        title: 'Resources',
        links: [
          { text: 'Blocks', href: '/blocks' },
          { text: 'UI Primitives', href: '/ui' },
          { text: 'GitHub', href: 'https://github.com/saastro-io/saastro-ui' },
        ],
      },
    ],
    socialLinks: [
      { text: 'GitHub', href: 'https://github.com/saastro-io', icon: 'tabler:brand-github' },
      { text: 'X', href: 'https://x.com/saastro', icon: 'tabler:brand-x' },
    ],
  };
}
```

Changes:
- Removed "Components" link (`/docs/components` doesn't exist) -> replaced with "Blocks" (`/blocks`) and "UI Primitives" (`/ui`)
- Removed entire "Legal" group (`/privacy` and `/terms` don't exist)
- Fixed GitHub URL: `saastro-hub` -> `saastro-ui`

- [ ] **Step 2: Update getFooterData() legacy function**

In the same file, replace `getFooterData()`:

```typescript
export function getFooterData(helpers?: { getPermalink?: (path: string) => string }): FooterData {
  const getPermalink = helpers?.getPermalink || ((path: string) => path);

  return {
    tagline: 'UI components for Astro',
    links: [
      {
        title: 'Resources',
        links: [
          { text: 'Blocks', href: getPermalink('/blocks') },
          { text: 'UI Primitives', href: getPermalink('/ui') },
        ],
      },
    ],
    socialLinks: [
      { text: 'GitHub', href: 'https://github.com/saastro-io', icon: 'tabler:brand-github' },
      { text: 'X', href: 'https://x.com/saastro', icon: 'tabler:brand-x' },
    ],
  };
}
```

- [ ] **Step 3: Verify build**

```bash
cd docs/ui-docs && bun run build
```

- [ ] **Step 4: Commit**

```bash
git add docs/ui-docs/src/navigation/footer.ts
git commit -m "fix(ui-docs): remove dead footer links and fix GitHub URL

Replace /docs/components, /privacy, /terms with existing pages.
Fix GitHub link: saastro-hub -> saastro-ui."
```

---

### Task 4: Update knowledge documentation (High #4 + Low #11)

**Files:**
- Modify: `knowledge/ui-docs.md`
- Modify: `knowledge/ui-registry.md`

**Why:** Knowledge docs reference `@saastro/shell` (old scope, should be `@saastro-io/shell`), say "15 blocks" (now 16), and are missing the `button-pro` UI component.

- [ ] **Step 1: Update knowledge/ui-docs.md**

Apply these changes:

1. Line 9: `@saastro/shell` -> `@saastro-io/shell`
2. Line 12: `## Bloques (15 free)` -> `## Bloques (16 free)`
3. After line 23, add new category line: `- **Buttons** (1): Button Pro (UI primitive)`
4. Line 29: `npx shadcn@latest add @saastro/hero-01` -> `npx shadcn@latest add saastro/hero-01`
5. Line 41: `Config del usuario en \`components.json\` apunta al registry \`@saastro\`.` -> `Config del usuario en \`components.json\` apunta al registry \`saastro\`.`
6. Line 79: `Importa los 15 bloques` -> `Importa los 16 bloques`
7. Line 82: `@saastro/{name}` -> `saastro/{name}`
8. Line 86: `Header: Home, Blocks, Docs` -> `Header: Home, GitHub`
9. Line 102: `15 bloques free` -> `16 bloques free`

- [ ] **Step 2: Update knowledge/ui-registry.md**

After line 68 (the block list), add `button-pro` to the list:

Change:
```
`hero-01`, `hero-02`, `hero-03`, `features-01`, `features-02`, `pricing-01`, `cta-01`, `faq-01`, `testimonials-01`, `footer-01`, `navbar-01`, `blog-grid-01`, `newsletter-01`, `stats-01`, `logos-01`
```

To:
```
`hero-01`, `hero-02`, `hero-03`, `features-01`, `features-02`, `pricing-01`, `cta-01`, `faq-01`, `testimonials-01`, `footer-01`, `navbar-01`, `blog-grid-01`, `newsletter-01`, `stats-01`, `logos-01`, `button-pro`
```

- [ ] **Step 3: Commit**

```bash
git add knowledge/ui-docs.md knowledge/ui-registry.md
git commit -m "docs: update knowledge base with correct scope and block count

Fix @saastro -> @saastro-io scope, 15 -> 16 blocks, add button-pro,
update header nav description, fix registry name format."
```

---

### Task 5: Fix CLAUDE.md scope references (Medium #5 + Low #11)

**Files:**
- Modify: `CLAUDE.md` (root, lines 52-53)

- [ ] **Step 1: Fix external dependencies section**

Replace:
```markdown
## External Dependencies

- `@saastro/config` (from saastro-infra, npm)
- `@saastro/shell` (from saastro-infra, npm) — used by ui-docs for layout
```

With:
```markdown
## External Dependencies

- `@saastro-io/config` (from saastro-infra, GitHub Packages)
- `@saastro-io/shell` (from saastro-infra, GitHub Packages) — used by ui-docs for layout
```

- [ ] **Step 2: Fix block count if mentioned**

Search for "15" in CLAUDE.md. If any reference says "15 blocks", update to "16 blocks" (15 landing blocks + 1 UI primitive).

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: fix package scope and registry references in CLAUDE.md

@saastro/* -> @saastro-io/*, npm -> GitHub Packages."
```

---

### Task 6: Remove unimplemented typecheck and lint tasks (Medium #6)

**Files:**
- Modify: `turbo.json`
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json` (root)

**Why:** `typecheck` and `lint` tasks are defined in turbo.json and called in CI, but no package implements these scripts. CI will fail silently or error.

- [ ] **Step 1: Remove typecheck and lint from turbo.json**

Replace full `turbo.json` content:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "public/r/**"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 2: Remove typecheck from ci.yml**

Replace full `.github/workflows/ci.yml` content:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    name: Build & Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: "1.2.4"

      - run: bun install --frozen-lockfile
      - run: bun run build
```

- [ ] **Step 3: Remove typecheck and lint from root package.json**

In `package.json`, remove lines 12-13:
```json
    "typecheck": "turbo run typecheck",
    "lint": "turbo run lint",
```

Resulting scripts section:
```json
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,json,md}\"",
    "clean": "turbo run clean && rm -rf node_modules",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build --filter=@saastro/ui-registry && changeset publish"
  },
```

- [ ] **Step 4: Commit**

```bash
git add turbo.json .github/workflows/ci.yml package.json
git commit -m "chore: remove unimplemented typecheck and lint tasks

No package defines these scripts. Remove from turbo.json, CI, and root package.json."
```

---

### Task 7: Add missing @ui-registry path alias to tsconfig (Medium #7)

**Files:**
- Modify: `docs/ui-docs/tsconfig.json`

**Why:** The Vite config in `astro.config.mjs` defines `@ui-registry` alias, but `tsconfig.json` is missing the corresponding path mapping. TypeScript won't resolve imports using this alias.

- [ ] **Step 1: Add @ui-registry path**

Replace `docs/ui-docs/tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/env.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@blocks/*": ["../../packages/ui-registry/registry/default/blocks/*"],
      "@ui-registry/*": ["../../packages/ui-registry/registry/default/ui/*"]
    }
  }
}
```

Added: `"@ui-registry/*": ["../../packages/ui-registry/registry/default/ui/*"]`

- [ ] **Step 2: Verify build**

```bash
cd docs/ui-docs && bun run build
```

- [ ] **Step 3: Commit**

```bash
git add docs/ui-docs/tsconfig.json
git commit -m "fix(ui-docs): add missing @ui-registry path alias to tsconfig

Aligns TypeScript path resolution with Vite alias in astro.config.mjs."
```

---

### Task 8: Clean up ui-docs package.json (Medium #10)

**Files:**
- Modify: `docs/ui-docs/package.json`

**Why:** `analyze:bundle` script references `astro-bundle-analyzer` which is not installed. `astro-seo` is in dependencies but never imported anywhere in `src/`.

- [ ] **Step 1: Remove analyze:bundle script**

In `docs/ui-docs/package.json`, remove the `analyze:bundle` script line:

```json
    "analyze:bundle": "astro build && npx astro-bundle-analyzer"
```

Keep `analyze:performance` (it uses a local script).

- [ ] **Step 2: Remove astro-seo dependency**

In the `dependencies` section, remove:

```json
    "astro-seo": "^0.8.4",
```

- [ ] **Step 3: Install to update lockfile**

```bash
bun install
```

- [ ] **Step 4: Verify build**

```bash
cd docs/ui-docs && bun run build
```

- [ ] **Step 5: Commit**

```bash
git add docs/ui-docs/package.json bun.lock
git commit -m "chore(ui-docs): remove unused astro-seo dep and broken analyze:bundle script

astro-seo is never imported. astro-bundle-analyzer is not installed."
```

---

### Task 9: Remove dead @stores alias (Low #12)

**Files:**
- Modify: `docs/ui-docs/astro.config.mjs`

**Why:** The `@stores` Vite alias points to `./src/stores` which doesn't exist (no stores directory).

- [ ] **Step 1: Remove @stores alias**

In `docs/ui-docs/astro.config.mjs`, in the `vite.resolve.alias` section, remove:

```javascript
        "@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
```

The alias block should become:

```javascript
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@blocks": fileURLToPath(new URL("../../packages/ui-registry/registry/default/blocks", import.meta.url)),
        "@ui-registry": fileURLToPath(new URL("../../packages/ui-registry/registry/default/ui", import.meta.url)),
        "debug": fileURLToPath(new URL("./src/lib/debug-stub.ts", import.meta.url)),
        "limax": fileURLToPath(new URL("./src/lib/speakingurl-stub.ts", import.meta.url)),
      },
```

- [ ] **Step 2: Verify build**

```bash
cd docs/ui-docs && bun run build
```

- [ ] **Step 3: Commit**

```bash
git add docs/ui-docs/astro.config.mjs
git commit -m "chore(ui-docs): remove dead @stores Vite alias

src/stores directory does not exist."
```

---

### Task 10: Fix knowledge/INDEX.md placeholder (Low #13)

**Files:**
- Modify: `knowledge/INDEX.md`

- [ ] **Step 1: Update INDEX.md**

Replace the `## active` section:

```markdown
## active
working-on: audit fixes and documentation cleanup
```

- [ ] **Step 2: Commit**

```bash
git add knowledge/INDEX.md
git commit -m "docs: update knowledge INDEX active status"
```

---

## Final Verification

After all tasks are complete:

- [ ] **Full build from root**

```bash
bun run build
```

Expected: Both `ui-registry` and `ui-docs` build successfully.

- [ ] **Verify dev server starts**

```bash
bun run dev
```

Expected: Dev server starts on port 4911 without errors.

---

## Parallelization Guide

These tasks are fully independent and can be run in parallel:

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 1, 2, 3 | Critical + High: different files |
| B | 4, 5 | Documentation: different files |
| C | 6, 7, 8, 9 | Config: different files |
| D | 10 | Low priority: quick fix |

**Recommended:** Dispatch Tasks 1-9 in parallel via subagents, then Task 10 + final verification.
