# saastro-ui

UI toolkit y block registry del ecosistema Saastro.

## URL de producción
**ui.saastro.io** — LIVE. Cloudflare Pages en modo **estático** (proyecto Pages `saastro-ui`, root dir `apps/ui-docs`, deploy por git integration en push a main). Migrado de SSR a estático el 2026-04-03: sin adapter, sin Worker, sin `wrangler.jsonc` en ningún nivel del repo.

## Qué es
- **ui-registry** (`packages/ui-registry`) — Registry de bloques React (patrón shadcn) para landing pages. Privado: no se publica a npm, se consume por shadcn CLI.
- **ui-docs** (`apps/ui-docs`) — Site de documentación y showcase con previews live + endpoint de registry en `/r/*.json`.

## Stack
TypeScript, Astro 6, React 19, Radix UI, Tailwind CSS 4, shadcn/ui, Cloudflare Pages (estático), **Node 24 + pnpm 10.33.2**, Turborepo.

## Package manager
**pnpm**, desde el 2026-08-17 (antes Bun). Pineado en `package.json#packageManager` como SSOT (lo leen CI y corepack) y replicado en `mise.toml` para dev local. Los globs del workspace viven en `pnpm-workspace.yaml`, no en `package.json`. `onlyBuiltDependencies` allow-listea `esbuild` y `sharp`, los dos únicos paquetes del grafo con install scripts. **No usar `bun`/`bunx` en este repo.**

## Modelo
15 bloques free (más el primitive `button-pro` = 16 items en `registry.json`) en repo público. Bloques Pro en repo privado (saastro/blocks-pro). Compra = acceso GitHub al repo. Referencia: shadcnblocks.com

## Dependencias cross-repo
Desde **saastro-infra**, vía **GitHub Packages privado** (`@saastro-io:registry=https://npm.pkg.github.com`), NO vía `link:`:

| Paquete | Versión | Uso |
|---|---|---|
| `@saastro-io/shell` | `0.2.0` (exacta) | Header, Footer, SEO, Analytics de ui-docs |
| `@saastro-io/docs-theme` | `0.2.0` (exacta) | Tema del site de docs |
| `@saastro-io/config` | `^0.1.0` | Presets compartidos (también devDep de ui-registry) |

El token sale de 1Password: `~/.npmrc` global referencia `${GH_PACKAGES_TOKEN}`, inyectado por `~/SAASTRO/.envrc` (direnv). En CI se inyecta el `GITHUB_TOKEN` del workflow; en CF Pages es una env var del proyecto.

⚠️ `@saastro-io/docs-theme@0.2.0` declara `peer @saastro-io/shell@^0.1.0` pero el repo instala shell `0.2.0` → pnpm avisa de peer no satisfecho en cada install. Es ruido conocido, el build pasa. Se arregla en saastro-infra subiendo el rango del peer.
