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
- `src/components/ui/` — 9 primitivas **Base UI** (accordion, badge, button,
  card, input, label, separator, sheet, textarea). Nadie de ui-docs las importa
  directamente: las cargan los ficheros del registry, que importan con rutas de
  consumidor (`@/components/ui/button`) y el alias `@` de este sitio las resuelve
  aquí. Las 34 que nadie cargaba se quitaron el 30-sep (medido con el build).

## Comandos

```bash
pnpm dev                  # dev server (puerto 4911)
pnpm build                # turbo construye ui-registry ANTES (dep workspace)
pnpm capture              # captura lo que falta y lo CADUCADO → public/previews/ (COMMITEAR
                          # los PNG y public/previews/fuentes.json)
pnpm capture --force --only=<name>   # forzar uno
node scripts/check-previews.mjs      # gate de CI: 2 PNG por item Y al día con su fuente
```

Puppeteer: pnpm 10 bloquea su postinstall — una vez por máquina:
`pnpm exec puppeteer browsers install chrome-headless-shell` (lo usan `capture`
y `comprobar:previews`, los dos con `headless: 'shell'`).

## Al tocar un bloque

1. Editar en `packages/ui-registry/registry/default/blocks/`.
2. Si cambian props → actualizar `src/demos/<name>.ts` y el `docs` del item.
3. `pnpm build && pnpm capture` y commitear los PNG **con `public/previews/fuentes.json`**.
   El gate compara el sha256 de la fuente de cada item (sus ficheros, sus demos y lo
   local que importan, transitivamente) con el apuntado ahí al capturar: tocar un
   bloque o un primitivo sin recapturar deja CI en rojo. `capture` se niega si
   `dist/` es más viejo que la fuente.

## Deploy

Push a `main` (paths de ui-docs/ui-registry) → `deploy-ui-docs.yml` → wrangler
deploy del Worker `saastro-ui`. Si el build falla, el commit queda en rojo —
ese es el motivo del cambio desde Pages (un deploy de Pages fallido dejaba lo
viejo publicado en silencio).
