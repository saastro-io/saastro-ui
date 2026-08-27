# @saastro/ui-registry

shadcn-compatible block registry for Astro sites. Private package — serves blocks via the shadcn CLI.

## Purpose

Provides landing page blocks (hero, features, pricing, testimonials, etc.) that users install via:

```bash
npx shadcn@latest add @saastro/hero-01
```

Los bloques estáticos son componentes `.astro` puros (cero JS, cero dependencias — instalables en un proyecto Astro sin React); los interactivos son React sobre Base UI y se hidratan con `client:*`.

## Structure

```
packages/ui-registry/
├── registry.json                    # shadcn v4 registry definition
├── registry/default/
│   ├── blocks/                      # Block components (.tsx)
│   │   ├── hero-01.astro
│   │   ├── hero-02.astro
│   │   ├── hero-03.astro
│   │   ├── features-01.astro
│   │   ├── features-02.astro
│   │   ├── pricing-01.tsx
│   │   ├── cta-01.astro
│   │   ├── faq-01.tsx
│   │   ├── testimonials-01.astro
│   │   ├── footer-01.astro
│   │   ├── navbar-01.tsx
│   │   ├── blog-grid-01.astro
│   │   ├── newsletter-01.astro
│   │   ├── stats-01.astro
│   │   └── logos-01.astro
│   └── lib/
│       └── utils.ts                 # cn() helper (clsx + tailwind-merge)
├── public/r/                        # Built JSON output (shadcn build)
└── package.json
```

## How It Works

```
registry.json (item definitions)
    ↓ shadcn build --output ../../apps/ui-docs/public/r
public/r/*.json (consumable by shadcn CLI)
    ↓ deployed to
ui.saastro.io/r/{name}.json
    ↓ installed via
npx shadcn@latest add @saastro/hero-01
```

## User Setup

```json
// components.json in user's Astro project
{
  "registries": {
    "@saastro": "https://ui.saastro.io/r/{name}.json"
  }
}
```

## Block Categories

| Category     | Blocks                    | Description                |
| ------------ | ------------------------- | -------------------------- |
| Hero         | hero-01, hero-02, hero-03 | Landing page hero sections |
| Features     | features-01, features-02  | Feature showcases          |
| Pricing      | pricing-01                | Pricing tier cards         |
| CTA          | cta-01                    | Call-to-action banners     |
| FAQ          | faq-01                    | Accordion FAQ sections     |
| Testimonials | testimonials-01           | Customer quote grids       |
| Navigation   | navbar-01, footer-01      | Header and footer blocks   |
| Blog         | blog-grid-01              | Blog post card layouts     |
| Newsletter   | newsletter-01             | Email signup sections      |
| Stats        | stats-01                  | Key metrics display        |
| Logos        | logos-01                  | Logo cloud / "Trusted by"  |

## registry.json es la ÚNICA fuente de verdad

Títulos, descripciones, grupos (`meta.group`), deps, `docs`, `author` y
`meta.iframeHeight` viven en `registry.json`; el catálogo del showcase
(`apps/ui-docs/src/lib/catalog.ts`) se DERIVA de él importando el JSON.
No existe ningún otro sitio que editar.

⚠️ **El ORDEN del array `items` es semántico**: define prev/next en
`/blocks/[name]`, el orden de la galería y el sidebar de docs. Reordenar
items = reordenar la navegación (JSON no admite comentarios; por eso el
aviso vive aquí).

## Block Design Rules

**Astro-first (desde ago-2026):** un bloque nace `.astro` salvo que necesite
estado o primitivas interactivas en cliente.

Bloques `.astro` (12 de 16 — todos los estáticos):
- **Cero JS y cero dependencias**: ni React, ni primitivas, ni `cn()`. Un
  proyecto Astro sin la integración de React puede instalarlos y compilar
  (smoke verificado). Las clases de botón/badge/card replican el estilo
  base-nova inline — el bloque es copy-in autocontenido.
- **Props serializables SIEMPRE**: nada de ReactNode/funciones. Iconos = clave
  de un set interno de SVGs inline (`icon: 'zap' | 'shield' | …`); logos =
  string. Formularios = submit NATIVO (`action`/`method`), nunca handlers.
- Un componente por fichero (limitación de `.astro`); helpers como funciones
  planas en el frontmatter. Import por DEFAULT:
  `import Hero01 from '@/components/blocks/hero-01.astro'`.
- Si un item necesitara sub-partes: item multi-fichero del registry (un
  `.astro` por parte) — `registry/astro.d.ts` ya tipa `module '*.astro'`.

Bloques `.tsx` (solo interactivos: faq-01, navbar-01, pricing-01 + button-pro):
- React sobre primitivas Base UI (`@/components/ui/*`), `cn()` de `@/lib/utils`.
- Named exports (not default). En Astro se hidratan con `client:load`/`client:visible`.

Comunes:
- Props para todo el contenido — nada hardcodeado.
- SVGs inline — sin dependencia de librería de iconos.
- Responsive por defecto (mobile-first Tailwind).
- Al tocar un bloque: `pnpm --filter @saastro/ui-docs build && pnpm --filter
  @saastro/ui-docs capture --force --only=<name>` y commitear los PNG.

### Base de primitivas: Base UI, no Radix (migración de agosto 2026)

Los bloques asumen que el consumidor inyecta `@/components/ui/*` construidos
sobre **Base UI**. En la práctica, al escribir o tocar un bloque:

- **`asChild` ya no existe** — se sustituye por la prop `render` (y
  `nativeButton` en los triggers de popover/tooltip/dialog).
- El `Slot` de Radix es ahora el hook `useRender`.
- La variable CSS `--radix-popover-trigger-width` es `--anchor-width`.

Del lado del consumidor, la base va codificada **dentro del campo `style` de su
`components.json`**: `"style": "base-nova"`, no `radix-nova`. Un consumidor que
siga en `radix-*` recibirá bloques que no casan con sus primitivas. Ver la
migración hermana en `saastro-theme` y el contrato de `@saastro/forms`
(`.changeset/base-ui-only.md` en `saastro-forms`).

## Scripts

```bash
pnpm run build   # Build registry JSON to public/r/
pnpm run dev     # Build in watch mode
```

## Consumers

- `apps/ui-docs` (ui.saastro.io) — showcase site, serves registry JSON
- End users — install blocks via shadcn CLI
