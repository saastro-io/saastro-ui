# @saastro/docs-theme — Design Spec

**Date:** 2026-04-08
**Status:** Approved

## Problem

`forms-docs` and `ui-docs` share ~80% of their infrastructure (layouts, styles, content schemas, navigation patterns). Changes must be duplicated manually, causing drift.

## Solution

Extract shared documentation infrastructure into `@saastro/docs-theme` — an npm package that sits between `@saastro-io/shell` and individual doc sites.

```
@saastro-io/shell       -> Header, Footer, Meta, Analytics, URLs
    |
@saastro/docs-theme     -> BaseLayout, DocsLayout, Sidebar, content schemas, styles
    |
forms-docs / ui-docs    -> Content, project-specific components, pages
```

## Package Structure

```
themes/docs-theme/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                # Re-exports: types, schemas, utils
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Shell wrapper (Header, Footer, Meta, Analytics)
│   │   └── DocsLayout.astro    # Sidebar + content area
│   ├── components/
│   │   └── Sidebar.astro       # Renders SidebarSection[] -> HTML
│   ├── content/
│   │   └── schemas.ts          # settingsSchema + docsSchema (Zod)
│   ├── styles/
│   │   └── global.css          # Tailwind v4 + CSS variables + dark mode
│   ├── types.ts                # SidebarSection, SidebarItem, etc.
│   └── lib/
│       └── utils.ts            # cn()
└── CHANGELOG.md
```

## What It Includes

| Layer | Files | Responsibility |
|-------|-------|----------------|
| Layouts | BaseLayout, DocsLayout | Shell wrapper + two-column sidebar |
| Components | Sidebar | Data-driven sidebar renderer |
| Content schemas | schemas.ts | Reusable Zod schemas for settings + docs |
| Styles | global.css | Tailwind v4 base + CSS variables + dark mode |
| Types | types.ts | SidebarSection, SidebarItem, DocsEntry |
| Utilities | utils.ts | cn() helper |

## What It Does NOT Include

- shadcn/ui components (installed per-project via CLI)
- Content (each project writes its own docs)
- Project-specific components (block renderer, form provider)
- Pages (each project defines its own routes)

## Sidebar API

```ts
type SidebarItem = {
  label: string
  href: string
  badge?: string
  active?: boolean
}

type SidebarSection = {
  title: string
  items: SidebarItem[]
}
```

DocsLayout receives `sidebar: SidebarSection[]` and renders it. Each project builds its own array from whatever data source it uses.

## Consumer Usage

### Content config
```ts
import { settingsSchema, docsSchema } from '@saastro/docs-theme/content/schemas'
```

### Layout
```astro
import DocsLayout from '@saastro/docs-theme/layouts/DocsLayout.astro'
```

### Styles
```css
@import '@saastro/docs-theme/styles/global.css';
```

## Dependencies

- **Peer:** astro ^6.0.0, @saastro-io/shell ^0.1.0, @astrojs/mdx ^5.0.0, @astrojs/react ^5.0.0, tailwindcss ^4.0.0
- **Direct:** zod, clsx, tailwind-merge

## Publishing

- Lives in `themes/docs-theme/` in saastro-ui monorepo
- Added to workspaces in root package.json
- Published to npm (public) via Changesets
