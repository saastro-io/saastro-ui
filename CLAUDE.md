# Saastro UI

Block registry and showcase site for the Saastro ecosystem.

## Structure

```
packages/
  ui-registry/     → @saastro/ui-registry     (15 bloques de landing + button-pro, que es
                                                una primitiva registry:ui, no un bloque)
apps/
  ui-docs/         → @saastro/ui-docs         (showcase site at ui.saastro.io)
```

## Tech Stack

- **Runtime/PM**: Node 24 + pnpm 10.33.2 — pinned via `package.json#packageManager`
  (SSOT, read by CI and corepack) and `mise.toml` for local dev. Workspace globs
  live in `pnpm-workspace.yaml`. **No uses `bun`/`bunx` en este repo.**
- **Orchestration**: Turborepo
- **Language**: TypeScript strict
- **Blocks**: React + shadcn/ui primitives
- **Docs site**: Astro 6 estático servido por un Worker CF de static assets (deploy vía Actions + wrangler)
- **Publishing**: Changesets → npm (public)

## Commands

```bash
pnpm install              # Install deps
pnpm run build            # Build all
pnpm run dev              # Dev mode (docs + registry watch)
pnpm run typecheck        # Type check all
pnpm run format           # Prettier write

# Publishing
pnpm run changeset        # Create changeset
pnpm run version-packages # Bump versions
pnpm run release          # Build + publish to npm
```

## Products

- **Blocks**: Install via `npx shadcn@latest add saastro/hero-01`
- **Docs**: Deployed at ui.saastro.io

## Rules

1. Blocks use React + shadcn/ui primitives — zero JS in final Astro output
2. `@saastro/ui-registry` es **`private: true`** y NO se publica a npm: los bloques se
   consumen copy-in con el CLI de shadcn contra `ui.saastro.io/r/{name}.json`, nunca por
   `npm install`. Ojo: la sección Publishing de arriba describe el flujo genérico de
   changesets del monorepo — sobre este paquete `changeset publish` no hace nada, porque
   salta los `private` en silencio
3. Docs site serves registry JSON at `/r/{name}.json`
4. Conventional commits: `feat(blocks):`, `docs(ui-docs):`

## External Dependencies

- `@saastro-io/config` (from saastro-infra, GitHub Packages)
- `@saastro-io/shell` (from saastro-infra, GitHub Packages) — used by ui-docs for layout
