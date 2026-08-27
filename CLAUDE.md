# Saastro UI

Block registry and showcase site for the Saastro ecosystem.

## Structure

```
packages/
  ui-registry/     → @saastro/ui-registry     (41 items: 15 bloques de landing
                                                + 26 primitivos registry:ui)
apps/
  ui-docs/         → @saastro/ui-docs         (showcase site at ui.saastro.io)
```

## Tech Stack

- **Runtime/PM**: Node 24 + pnpm 10.33.2 — pinned via `package.json#packageManager`
  (SSOT, read by CI and corepack) and `mise.toml` for local dev. Workspace globs
  live in `pnpm-workspace.yaml`. **No uses `bun`/`bunx` en este repo.**
- **Orchestration**: Turborepo
- **Language**: TypeScript strict
- **Blocks**: 12 `.astro` cero-JS + 3 islas React sobre primitivos `@saastro/*`
- **Docs site**: Astro 6 estático servido por un Worker CF de static assets (deploy vía Actions + wrangler)
- **Publishing**: NADA. `@saastro/ui-registry` es `private: true` y el modelo es copy-in vía `ui.saastro.io/r/{name}.json` (regla 2)

## Commands

```bash
pnpm install              # Install deps
pnpm run build            # Build all
pnpm run dev              # Dev mode (docs + rebuild del registry)
pnpm run typecheck        # Type check all
pnpm run format           # Prettier write

# Publishing
pnpm run changeset        # Create changeset
pnpm run version-packages # Bump versions
pnpm run release          # Build + publish to npm
```

## Products

- **Blocks**: `npx shadcn@latest add @saastro/hero-01`
- **Primitivos**: `npx shadcn@latest add @saastro/button` — 25, todos sobre Base UI
- **Docs**: ui.saastro.io

**Por qué los primitivos están aquí y no se cogen de shadcn.** Un
`registryDependencies: ["button"]` a secas lo resuelve el CLI contra el registry
de shadcn, que sirve las versiones **Radix**. Instalar un bloque de Saastro te
traía primitivos de otra base UI, justo lo contrario de la regla del ecosistema.
Por eso todo item declara `@saastro/<nombre>` y ninguna dependencia sale fuera:
un bloque de Saastro se instala entero desde Saastro. Los 26 se cosecharon de
`saastro-theme`, donde llevan en producción desde el 17-ago.

## Rules

1. **`.astro` para lo visual, isla `.tsx` para lo interactivo.** No es una
   preferencia: es la frontera real del adaptador. Hoy son 12 `.astro` (cero JS,
   cero `registryDependencies`) y 3 `.tsx` — `faq-01`, `navbar-01` y
   `pricing-01`, que son justo los que llevan estado. Los primitivos son **Base
   UI**, no shadcn: de shadcn solo queda el CLI que construye el registry.
2. `@saastro/ui-registry` es **`private: true`** y NO se publica a npm: los bloques se
   consumen copy-in con el CLI de shadcn contra `ui.saastro.io/r/{name}.json`, nunca por
   `npm install`. Ojo: la sección Publishing de arriba describe el flujo genérico de
   changesets del monorepo — sobre este paquete `changeset publish` no hace nada, porque
   salta los `private` en silencio
3. Docs site serves registry JSON at `/r/{name}.json`
4. Conventional commits: `feat(blocks):`, `docs(ui-docs):`

## Dónde está la frontera: `.astro` vs isla

Lo aprendimos rompiéndolo, así que queda escrito.

**Las props de un componente Astro cruzan serializadas.** Una función NO cruza.
`newsletter-01` era React con un `onSubmit` por props y era inutilizable desde
Astro: el handler llegaba `undefined`. Se rehizo con `action` + `method`
nativos, y ahora funciona incluso con JavaScript desactivado.

De ahí la regla:

| Qué | Cómo | Por qué |
|---|---|---|
| Secciones visuales (hero, features, stats, footer, logos, testimonials…) | `.astro` | Cero JS al cliente. Es todo lo que necesitan |
| Formulario de captura simple | `.astro` con `action`/`method` nativos | Funciona sin JS. Nada de handlers por props |
| Acordeón, menú, toggles, estado local | isla `.tsx` + `client:*` | Necesitan React de verdad |
| **Formularios con validación, pasos, lógica condicional o submit a API** | isla `.tsx` con **`@saastro/forms`** | Nunca `.astro`: eso es RHF + Zod + plugins, no HTML |

**El registry no es el sitio de los formularios de negocio.** Para eso está
`@saastro/forms`, que se instala por npm y se monta como isla. Un bloque del
registry puede traer el *maquetado* de un formulario; la *lógica* no.

Y una trampa de Base UI específica de Astro: **`render={<a/>}` no funciona
dentro de un `.astro`** — ahí las llaves no son JSX de React, Astro compila su
propio elemento y React recibe `undefined`. En `.astro` se usa
`class={buttonVariants(...)}` sobre el elemento nativo.

## External Dependencies

- `@saastro-io/config` (from saastro-infra, GitHub Packages) — la única
- `shadcn` (devDependency): **solo el CLI** que construye el registry a
  `apps/ui-docs/public/r`. No aporta primitivos: ésos son Base UI desde el 17-ago

## Dónde buscar

| workspace | sección | ficha |
|---|---|---|
| packages/ui-registry | registry | `packages/ui-registry/knowledge/registry.snap.md` (+ `.md`) |
| packages/ui-registry/registry | bloques | `packages/ui-registry/knowledge/bloques.snap.md` (+ `.md`) |
| apps/ui-docs | ui-docs | `apps/ui-docs/knowledge/ui-docs.snap.md` (+ `.md`) |
| apps/ui-docs/src/theme | tema | `apps/ui-docs/knowledge/tema.snap.md` (+ `.md`) |
| apps/ui-docs/src/content | guias | `apps/ui-docs/knowledge/guias.snap.md` (+ `.md`) |
| apps/ui-docs/src/pages | sitio | `apps/ui-docs/knowledge/sitio.snap.md` (+ `.md`) |
| apps/ui-docs/scripts | previews | `apps/ui-docs/knowledge/previews.snap.md` (+ `.md`) |

`knowledge/` en la raíz es una vista de symlinks (`pnpm office:link`, check
con `office:check`): la ficha vive en su workspace.

**De quién dependo**
- dev: nadie — este repo ES la fuente: theme y los sites consumen el registry.
- ops: nadie — el registry se publica, no se opera.

El detalle de símbolos está en el snap, no aquí. El contexto vivo se pide
con `office_context`/`office_search`. El mapa del ecosistema lo tiene el
jefe (`office_brief`), no este fichero.

## saastro-office
- `office_init` con project `saastro-ui` al empezar la sesión.
- `office_state` con done/next/needs antes de parar. El hook de Stop la exige.
- Lo que no puedas decidir: `office_decide` (`guarded` si es dinero, legal, destructivo o producción).
- Encargos a otro proyecto: `SendMessage` a su sesión, no por la office.
