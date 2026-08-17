# overview

> Grafo de workspaces de saastro-ui. Los globs viven en `pnpm-workspace.yaml`
> (`packages/*`, `apps/*`) — el campo `workspaces` de `package.json` desapareció
> con la migración a pnpm del 2026-08-17.

## Workspaces

| Workspace | Directorio | Deps internas | Deps externas del ecosistema |
|-----------|-----------|---------------|------------------------------|
| `@saastro/ui-registry` | `packages/ui-registry` | — | `@saastro-io/config` (dev) |
| `@saastro/ui-docs` | `apps/ui-docs` | consume los bloques por alias de Vite (`@blocks`, `@ui-registry`), no por dependencia de package.json | `@saastro-io/shell` 0.2.0, `@saastro-io/docs-theme` 0.2.0, `@saastro-io/config` ^0.1.0 |

**Nota sobre el acoplamiento ui-docs ↔ ui-registry:** no hay `dependency` declarada
entre ambos. `apps/ui-docs/astro.config.mjs` resuelve los bloques con alias que
apuntan a `../../packages/ui-registry/registry/default/{blocks,ui}`. Turbo los
ordena por el `dependsOn: ["^build"]` de `turbo.json`, no por el grafo de npm.

## Orquestación

`turbo.json` define tres tareas: `build` (outputs `dist/**` y `public/r/**`),
`dev` (persistent, sin cache) y `clean`. Raíz: `pnpm run build` → `turbo run build`.

## Tooling pineado

- `package.json#packageManager` → `pnpm@10.33.2` (SSOT).
- `mise.toml` → node 24 + pnpm 10.33.2 (dev local = CI).
- CI: `pnpm/action-setup@v6` sin `version:` (lee el SSOT) + `actions/setup-node@v6` node 24.
