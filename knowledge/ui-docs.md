# ui-docs

Site de documentación y showcase de bloques para Saastro UI. Sirve tres propósitos: galería de bloques con previews live, endpoint de registry para shadcn CLI, y documentación de instalación/configuración.

## Stack
- Astro 6.0.3 con SSR (Cloudflare adapter)
- Tailwind CSS 4 con `@tailwindcss/vite`
- 43+ componentes React de Radix UI (shadcn/ui patterns)
- @saastro-io/shell para layout compartido (Header, Footer, SEO, Analytics)
- Puerto dev: 4911 (ui.saastro.io en prod)

## Bloques (16 free)

7 categorías:
- **Hero** (3): Centered, Split with Image, Gradient
- **Features** (2): Icon Grid, Alternating
- **Pricing** (1): 3-tier con toggle
- **CTA** (2): Gradient Banner, Newsletter Signup
- **FAQ** (1): Accordion
- **Testimonials** (1): Card Grid
- **Navigation** (2): Navbar responsive, Footer multi-column
- **Content** (1): Blog Grid
- **Social Proof** (2): Stats Counter, Logo Cloud
- **Buttons** (1): Button Pro (UI primitive)

## Sistema de Registry

Los bloques se instalan via shadcn CLI:
```bash
npx shadcn@latest add saastro/hero-01
```

### Build pipeline (shadcn v4)

El registry usa el sistema oficial de shadcn v4:

1. **`registry.json`** — definición de bloques en formato shadcn v4 (`$schema: https://ui.shadcn.com/schema/registry.json`). Define nombre, tipo, dependencias (Button, Badge, etc.), archivos source y categorías.
2. **`npx shadcn@latest build --output ./public/r`** — el CLI oficial de shadcn lee `registry.json` y genera un JSON por bloque en `public/r/` (ej: `public/r/hero-01.json`). Este es el script `build` del package.json de ui-registry.
3. **ui-docs sirve los JSON** en `https://ui.saastro.io/r/{name}.json`
4. **Los usuarios instalan** con `npx shadcn@latest add saastro/hero-01` — shadcn consume el JSON, resuelve deps y descarga componentes.

Config del usuario en `components.json` apunta al registry `saastro`.

## Páginas

### Landing (`pages/index.astro`)
Hero + bloques destacados.

### Galería (`pages/blocks/index.astro`)
Todos los bloques con filtro por categoría.

### Detalle de bloque (`pages/blocks/[name].astro`)
Preview live + código fuente + comando de instalación. Usa `import.meta.glob('?raw')` para extraer source code en build-time desde `packages/ui-registry/registry/default/blocks/*.tsx`.

### Docs (`pages/docs/[...slug].astro`)
Documentación MDX con 8 páginas:
1. Introduction — qué son los bloques
2. Installation — prereqs y setup del registry
3. CLI Usage — instalación de bloques y resolución de deps
4. Components JSON — configuración del registry
5. Theming — CSS variables y colores
6. Dark Mode — patrones de implementación
7. Typography — estilos base
8. Changelog — historial de versiones

## Layouts

### BaseLayout.astro
Layout raíz: @saastro-io/shell components (Header, Footer, Meta, Analytics), color mode switching, Astro transitions.

### DocsLayout.astro
Sidebar sticky (hidden mobile, visible lg+):
- "Getting Started" con docs ordenados por campo `order`
- Bloques agrupados por categoría
- Active link highlighting

## Componentes clave

### block-renderer.tsx
Importa los 16 bloques desde `@blocks/*` alias. Renderiza con datos sample hardcodeados. Usa `client:visible` para lazy hydration.

### code-viewer.tsx
- `InstallCommand` — comando copiable `npx shadcn@latest add saastro/{name}`
- `CodeViewer` — source code con copy-to-clipboard (feedback 2s)

## Navegación
- **Header**: Home, GitHub
- **Footer**: Resources (Docs, Components, GitHub), Legal, Social links

## Config técnica

### astro.config.mjs
- Output: `server` (SSR + Cloudflare)
- Image: passthrough (no Sharp en Workers)
- Vite aliases: `@` → src, `@blocks` → registry
- Stubs: debug-stub.ts (CJS workaround), speakingurl-stub.ts (limax polyfill)

### content.config.ts
- Settings collection (Zod schema: site, i18n, metadata, analytics)
- Docs collection (glob loader, schema: title, description, section, order, published)

## Modelo de negocio futuro
- 16 bloques free en repo público
- Pro blocks en repo privado separado (saastro/blocks-pro)
- Compra = acceso GitHub al repo privado (sin auth middleware)
- Usuarios configuran múltiples registries en `components.json`

## Workarounds conocidos
- `debug` module: alias a `src/lib/debug-stub.ts` por incompatibilidad CJS
- Zod v4 con OG/twitter fields: usa `z.any()` para campos no críticos
- Glob paths: 5 niveles de `../` desde pages/blocks/ hasta registry source
