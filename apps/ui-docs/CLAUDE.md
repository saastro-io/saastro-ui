# @saastro/ui-docs

Showcase + servidor del registry en **ui.saastro.io**. Astro estático (sin
adapter), desplegado como **Worker de Cloudflare de static assets** (ya NO es
Pages) vía `.github/workflows/deploy-ui-docs.yml` + `wrangler.jsonc`.

## Arquitectura (Registry v2, ago-2026)

```
packages/ui-registry/registry.json      ← ÚNICA fuente de verdad (items, meta, docs)
    ├─→ src/lib/catalog.ts              ← catálogo DERIVADO (import directo del JSON)
    ├─→ shadcn build --output public/r  ← lo corre el build de ui-registry (turbo ordena
    │                                     por la dep workspace); public/r está GITIGNORADO
    ├─→ src/pages/preview/[name].astro  ← preview aislado sin chrome (iframe + capturas)
    └─→ scripts/capture.mts             ← PNG light/dark COMMITEADOS en public/previews/
```

- `src/demos/<name>.ts` — demo props por bloque (serializables). Los 3 bloques
  interactivos + button-pro tienen wrapper `.preview.astro` con **import
  literal** + `client:load` (la hidratación no admite componentes dinámicos de
  glob — el compiler no emite `client:component-path`).
- Galería `/blocks` y `/ui`: tarjetas con PNG dual-theme (`dark:hidden` /
  `hidden dark:block`) — cero islands.
- Detalle `/blocks/[name]`: iframe vivo de `/preview/<name>` en md+ (altura
  `meta.iframeHeight`, toggle de anchos) + PNG en móvil + código shiki
  (`<Code>` de astro/components, temas github-light/dark).
- `src/components/ui/` — 41 primitivas shadcn **base-nova (Base UI)** usadas
  por los bloques `.tsx` interactivos en los previews.

## Comandos

```bash
pnpm dev                  # dev server (puerto 4911)
pnpm build                # turbo construye ui-registry ANTES (dep workspace)
pnpm capture              # screenshots light+dark → public/previews/ (COMMITEAR)
pnpm capture --force --only=<name>   # regenerar uno tras tocarlo
node scripts/check-previews.mjs      # gate de CI: 2 PNG por item
```

Puppeteer: pnpm 10 bloquea su postinstall — una vez por máquina:
`pnpm exec puppeteer browsers install chrome`.

## Al tocar un bloque

1. Editar en `packages/ui-registry/registry/default/blocks/`.
2. Si cambian props → actualizar `src/demos/<name>.ts` y el `docs` del item.
3. `pnpm build && pnpm capture --force --only=<name>` y commitear el PNG.

## Deploy

Push a `main` (paths de ui-docs/ui-registry) → `deploy-ui-docs.yml` → wrangler
deploy del Worker `saastro-ui`. Si el build falla, el commit queda en rojo —
ese es el motivo del cambio desde Pages (un deploy de Pages fallido dejaba lo
viejo publicado en silencio).
