# ui-docs

Site de documentación y showcase de bloques para Saastro UI. Sirve tres propósitos: galería de bloques con previews live, endpoint de registry para shadcn CLI, y documentación de instalación/configuración.

## Stack
- Astro 6.0.8 con Cloudflare adapter v13.1.3
- Tailwind CSS 4 con `@tailwindcss/vite`
- 43+ componentes React de Radix UI (shadcn/ui patterns)
- @saastro-io/shell para layout compartido (Header, Footer, SEO, Analytics)
- Puerto dev: 4911 (ui.saastro.io en prod)

## Deployment — Cloudflare Pages

Producción: `ui.saastro.io` · Proyecto Pages: `saastro-ui`

**Estado actual (2026-04-02):** Sitio desplegado manualmente con `wrangler pages deploy`. Git integration configurada con `root_dir: docs/ui-docs` y `SKIP_DEPENDENCY_INSTALL=true`. Actualmente en modo SSR (`output: "server"`) pero todas las páginas son prerender.

### Modo A: Static — para cuando todas las páginas son prerender
- `output: "static"` (sin adapter cloudflare)
- Pages git integration funciona automáticamente
- `root_dir: docs/ui-docs`, `destination_dir: dist`

### Modo B: SSR — cuando hay páginas server-rendered
- `output: "server"` + `adapter: cloudflare()`
- **Pages git integration NO funciona** (adapter v13 genera Workers-model, incompatible)
- Desplegar via GitHub Actions con `wrangler pages deploy dist/client`
- Deshabilitar auto-deploy en Pages dashboard

### Bug resuelto (2026-04-02)
Root `wrangler.jsonc` con Workers-model config causaba 404 en producción. Eliminado. `.wrangler/deploy/config.json` estaba committed y causaba fallo en build de Pages (resolvía dist/server/wrangler.json antes del build). Eliminado y añadido a .gitignore.

## Bloques y sistema de registry
16 bloques free en 7+ categorías. Registry via shadcn CLI (`npx shadcn@latest add saastro/hero-01`). Build pipeline: registry.json → `npx shadcn@latest build` → public/r/*.json → servidos en ui.saastro.io/r/

## Workarounds conocidos
- `debug` module: alias stub por CJS incompatibility con Workers
- Zod v4: `z.any()` para campos OG/twitter
- Glob paths: 5 niveles de `../` en [name].astro
- `.wrangler/deploy/`: gitignored, generado por adapter
- Root wrangler.jsonc: NUNCA crear en raíz del repo