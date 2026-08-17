## ⚠️ Gotcha estructural: hay DOS copias de `public/r/` commiteadas

El JSON del registry existe por duplicado, y ambas copias están en git:

| Ruta | Qué es | Quién la genera |
|---|---|---|
| `packages/ui-registry/public/r/` | salida real de `npx shadcn@latest build` | el build de ui-registry |
| `apps/ui-docs/public/r/` | **la que se sirve** en `ui.saastro.io/r/` | copiada a mano |

No hay symlink ni paso de copia automático: se sincronizan a mano. Y el build de
producción de CF Pages corre con `--filter=@saastro/ui-docs`, que **no** construye
ui-registry — o sea, lo que se publica es siempre la copia commiteada en
`apps/ui-docs/public/r/`, nunca una salida fresca. Si tocas un bloque, hay que
rebuildear ui-registry Y copiar el resultado a `apps/ui-docs/public/r/`.

**Drift detectado el 2026-08-17:** los 16 ficheros de bloque son idénticos entre
las dos copias, pero el índice no. `apps/ui-docs/public/r/registry.json` lista
**15 items** (le falta `button-pro`); la salida real lista 16. Confirmado en
producción: `ui.saastro.io/r/registry.json` → 15 items, pero
`ui.saastro.io/r/button-pro.json` → HTTP 200 y la galería muestra el bloque. O
sea, `button-pro` es instalable por nombre pero invisible en el índice. Sin
resolver: puede ser drift (el índice de ui-docs no se ha tocado desde `a3f0b7e`)
o gating deliberado del bloque Pro. Hay tarea abierta en la lista maestra.

## Why a Registry, Not a Package

The central architectural decision in `ui-registry` is distribution model: blocks are not published to npm. Instead, they're served as JSON artifacts via the shadcn CLI protocol. When a user runs `npx shadcn@latest add @saastro/hero-01`, they receive the component's source code copied directly into their project. They own it, can modify it freely, and have no runtime dependency on `@saastro/ui-registry`. This is the shadcn philosophy applied to a product suite — distribute source, not black-box abstractions.

## React in an Astro Context

Blocks are React components, but the target is Astro. This works because Astro renders React server-side by default — zero JavaScript ships to the browser unless the user adds a `client:*` directive. The decision to use React (rather than Astro components) is deliberate: React gives users maximum composability and lets them opt into interactivity on a per-block basis without architectural changes. The blocks behave as static HTML in performance-sensitive contexts but can become islands when needed.

## Numbered Variants as a Design Contract

Each block category ships multiple numbered variants (`hero-01`, `hero-02`, `hero-03`). This reflects a deliberate choice against a single mega-component with dozens of props. Variants are opinionated, distinct designs — users pick the aesthetic they want and install just that file. This reduces cognitive overhead and avoids the prop-explosion that comes from trying to make one component serve every use case.

## The Build Pipeline

The two-stage pipeline (source → build → deploy) separates concerns cleanly. `registry.json` is the authoritative definition of what blocks exist and what they depend on. `npx shadcn build` transforms this into installable JSON artifacts in `public/r/`. This means the source stays readable and the distribution format stays in sync with shadcn's evolving CLI spec without manual artifact management.

## Shared Utilities

The `cn()` helper (clsx + tailwind-merge) is the only shared utility. Its presence here rather than in a separate package is intentional: when a block is installed, `cn` is copied alongside it. Users get a self-contained file with no invisible peer dependencies back to a registry package.

---

## Guía de uso — Instalar bloques (usuario final)

### 1. Prerequisitos
Proyecto Astro con React y Tailwind CSS configurados, y shadcn inicializado.

### 2. Configurar el registry

En `components.json` del proyecto, añadir el registry de Saastro:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "saastro": {
      "url": "https://ui.saastro.io/r"
    }
  }
}
```

### 3. Instalar un bloque

```bash
npx shadcn@latest add saastro/hero-01
```

shadcn descarga el JSON desde `ui.saastro.io/r/hero-01.json`, resuelve las dependencias (Button, Badge, etc.) y copia el componente al proyecto.

### 4. Usar el bloque

```tsx
import { Hero01 } from '@/components/blocks/hero-01'

<Hero01
  badge="Nuevo"
  title="Tu título"
  description="Tu descripción"
  primaryCta={{ label: "Empezar", href: "/signup" }}
  secondaryCta={{ label: "Ver demo", href: "/demo" }}
/>
```

En Astro, renderiza server-side como HTML — zero JS al cliente salvo que se use `client:*`.

### Bloques disponibles
`hero-01`, `hero-02`, `hero-03`, `features-01`, `features-02`, `pricing-01`, `cta-01`, `faq-01`, `testimonials-01`, `footer-01`, `navbar-01`, `blog-grid-01`, `newsletter-01`, `stats-01`, `logos-01`, `button-pro`

---

## Guía de desarrollo — Añadir un bloque nuevo

### 1. Crear el componente

Crear un `.tsx` en `registry/default/blocks/` siguiendo las convenciones: imports de `@/components/ui/*`, `cn()` de `@/lib/utils`, props tipadas, export named.

### 2. Registrarlo en `registry.json`

```json
{
  "name": "contact-01",
  "type": "registry:block",
  "title": "Contact Form — Simple",
  "description": "Simple contact form with name, email, and message.",
  "registryDependencies": ["button", "input", "textarea", "label"],
  "files": [
    {
      "path": "registry/default/blocks/contact-01.tsx",
      "type": "registry:component"
    }
  ],
  "categories": ["contact", "landing"]
}
```

- `registryDependencies` — componentes shadcn que el bloque necesita (se instalan automáticamente con el bloque)
- `categories` — para filtro en la galería de ui-docs

### 3. Build del registry

```bash
pnpm --filter @saastro/ui-registry run build
# equivale a: cd packages/ui-registry && npx shadcn@latest build --output ./public/r
```

El script sigue invocando `npx shadcn@latest` a propósito (el CLI de shadcn se
baja siempre en su última versión); el resto del repo usa pnpm desde la
migración del 2026-08-17.

Genera `public/r/contact-01.json` con el source code inlined y las deps resueltas.

### 4. Añadir al showcase

En `apps/ui-docs/src/data/blocks.ts`, añadir la metadata del bloque para que aparezca en la galería con preview live. (Ojo: `docs/ui-docs` es la ruta vieja — el app se movió a `apps/` en `a3f0b7e`.)

### 5. Verificar

```bash
npx shadcn@latest add saastro/contact-01
```