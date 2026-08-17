# saastro-ui

UI toolkit y block registry del ecosistema Saastro.

## URL de producción
**ui.saastro.io** — dominio asignado para el site de docs/showcase. Pendiente de configurar en Cloudflare.

## Qué es
- **ui-registry** — Registry de bloques React (shadcn pattern) para landing pages
- **ui-docs** — Site de documentación y showcase de bloques con previews live + registry endpoint

## Stack
TypeScript, Astro 6, React 19, Radix UI, Tailwind CSS 4, shadcn/ui, Cloudflare Workers, pnpm, Turborepo

## Modelo
15 bloques free en repo público. Bloques Pro en repo privado (saastro/blocks-pro). Compra = acceso GitHub al repo. Referencia: shadcnblocks.com

## Dependencias cross-repo
Depende de saastro-infra: @saastro/shell (layout), @saastro/config (presets). Linked via `link:` en package.json para desarrollo local.
