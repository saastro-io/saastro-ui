# Saastro UI

Block registry and showcase site for the Saastro ecosystem.

## Structure

```
packages/
  ui-registry/     → @saastro-io/ui-registry  (16 shadcn-compatible landing page blocks)
docs/
  ui-docs/         → @saastro-io/ui-docs      (showcase site at ui.saastro.io)
```

## Tech Stack

- **Runtime/PM**: Bun
- **Orchestration**: Turborepo
- **Language**: TypeScript strict
- **Blocks**: React + shadcn/ui primitives
- **Docs site**: Astro 6 SSR + Cloudflare Pages
- **Publishing**: Changesets → npm (public)

## Commands

```bash
bun install              # Install deps
bun run build            # Build all
bun run dev              # Dev mode (docs + registry watch)
bun run typecheck        # Type check all
bun run format           # Prettier write

# Publishing
bun run changeset        # Create changeset
bun run version-packages # Bump versions
bun run release          # Build + publish to npm
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
