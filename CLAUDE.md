# Saastro UI

Block registry and showcase site for the Saastro ecosystem.

## Structure

```
packages/
  ui-registry/     → @saastro-io/ui-registry  (16 shadcn-compatible landing page blocks)
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
- **Docs site**: Astro 6 SSR + Cloudflare Pages
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
2. `@saastro-io/ui-registry` is private (blocks consumed via shadcn CLI, not npm install)
3. Docs site serves registry JSON at `/r/{name}.json`
4. Conventional commits: `feat(blocks):`, `docs(ui-docs):`

## External Dependencies

- `@saastro-io/config` (from saastro-infra, GitHub Packages)
- `@saastro-io/shell` (from saastro-infra, GitHub Packages) — used by ui-docs for layout
