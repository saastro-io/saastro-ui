# ui-docs

Site de documentación y showcase de bloques para Saastro UI. Tres propósitos: galería de bloques con previews live, endpoint de registry para el shadcn CLI, y documentación de instalación/configuración.

**Ubicación: `apps/ui-docs`.** Se movió desde `docs/ui-docs` en el commit `a3f0b7e` (2026-04-13); cualquier ruta `docs/ui-docs/...` en documentos antiguos está obsoleta.

## Stack
- Astro 6 (`^6.0.3`), **sin adapter** — `output` estático por defecto
- Tailwind CSS 4 vía `@tailwindcss/vite`
- Radix UI + shadcn/ui patterns, React 19
- `@saastro-io/shell` 0.2.0 (Header, Footer, SEO, Analytics) + `@saastro-io/docs-theme` 0.2.0
- Integraciones: `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/mdx`, `astro-icon`
- Dev: puerto **4911**, `allowedHosts: ["ui-docs.saastro.test"]`
- Build actual: **29 páginas**

La config del site (`site`, `trailingSlash`) no está hardcodeada: sale de `src/data/settings.yaml`, parseado con `yaml` en tiempo de config.

## Resolución de bloques
`astro.config.mjs` define alias de Vite en vez de una dependencia de package.json:

- `@blocks` → `../../packages/ui-registry/registry/default/blocks`
- `@ui-registry` → `../../packages/ui-registry/registry/default/ui`
- `@` → `./src`

Además `dedupe` de `react`, `react-dom`, `class-variance-authority`, `@radix-ui/react-slot`, `@saastro-io/shell` y `@saastro-io/docs-theme` — necesario porque pnpm no aplana `node_modules` como hacía Bun y la duplicación de estos rompe contexto de React / estilos.

## Deployment — Cloudflare Pages (estático)

Producción: `ui.saastro.io` · Proyecto Pages: `saastro-ui`

**Estático desde el 2026-04-03.** Todas las páginas se prerenderizan en build: no hay Worker, no hay `@astrojs/cloudflare`, no hay `wrangler.jsonc` (verificado: cero ficheros `wrangler*` en el repo). El CDN sirve el HTML directamente. Deploy por git integration en push a main — no hay workflow de Actions ni `CLOUDFLARE_API_TOKEN`.

### Config del dashboard

| Campo | Valor |
|-------|-------|
| Framework preset | Astro |
| Root directory | `apps/ui-docs` |
| Build output | `dist` |
| Build command | `cd ../.. && echo "//npm.pkg.github.com/:_authToken=${GH_PACKAGES_TOKEN}" >> .npmrc && pnpm install --frozen-lockfile && pnpm exec turbo run build --filter=@saastro/ui-docs` |

Env vars (**Production Y Preview** — son separadas; ponerlas solo en Production deja los builds de PR en rojo):
`GH_PACKAGES_TOKEN` (PAT con `read:packages`), `NODE_VERSION=24`, `PNPM_VERSION=10.33.2`, `SKIP_DEPENDENCY_INSTALL=true`.

⚠️ **Estado a 2026-08-17: el build command y `PNPM_VERSION` están PENDIENTES de aplicar en el dashboard.** El repo migró a pnpm y ya no tiene `bun.lock`, pero el proyecto de Pages sigue con `bun install && bunx turbo`. Hay tarea abierta P2 en la lista maestra.

### Por qué estático y no SSR
1. Todas las páginas usan `getCollection`/`getStaticPaths` — no hay lógica server-side.
2. `@astrojs/cloudflare` v13 genera output Workers-model que la git integration de Pages no sabe desplegar (exigiría `wrangler pages deploy` desde Actions).
3. Sin Worker de por medio: más rápido y más simple.

Si algún día hace falta SSR: `output: "server"` + adapter, y entonces hay que deshabilitar el auto-deploy del dashboard y desplegar `dist/client` desde un workflow.

## Bloques y registry
16 items (15 bloques + el primitive `button-pro`). El registry se sirve desde `ui.saastro.io/r/*.json`; instalación con `npx shadcn@latest add saastro/hero-01`. Pipeline: `registry.json` → `npx shadcn@latest build` → `packages/ui-registry/public/r/*.json`.

## Historial de bugs resueltos — no reintroducir
- **Root `wrangler.jsonc`**: config Workers-model en la raíz del repo causaba 404 en producción (2026-04-02). Eliminado. **Nunca crear un `wrangler.jsonc` en la raíz.**
- **`.wrangler/deploy/config.json` commiteado**: rompía el build de Pages (resolvía `dist/server/wrangler.json` antes del build). Eliminado y gitignoreado.
- **Imports `.d.astro.js`**: workaround retirado al subir `@saastro-io/shell` a 0.2.0 (`a77ef11`).
- **`@source` de docs-theme/shell para Tailwind**: debe apuntar a `node_modules`, no a la ruta del workspace (`0a4a84a`).

## Workarounds vigentes
- `debug` module: alias a un stub por incompatibilidad CJS.
- Zod v4: `z.any()` en los campos OG/twitter.
