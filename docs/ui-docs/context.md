# Plantilla **enloAstro** — Guía completa de arquitectura, flujo y futuro

Este documento es el “contexto maestro” para seguir desarrollando la plantilla en Cursor. Explica **cómo está construida**, **cómo se usa** y **cómo la vamos a escalar**. Si alguien nuevo entra al repo con este texto, debería entender las piezas clave y por qué tomamos estas decisiones.

---

## 0) Objetivo y filosofía

- **Objetivo:** una plantilla **rápida**, **tipada** y **extensible** para **landing pages** y **sitios** más complejos (blog, docs…), usando **Astro + React (shadcn) + Tailwind**.
- **Filosofía:**
  - **1 sola verdad por ámbito.**
    - _Plataforma_ (URLs canónicas, sitemap): `astro.config.*`.
    - _Contenido/tema_ (branding, SEO base, toggles): `src/data/settings.yaml`.

  - **Server-first:** toda lectura de configuración y composición de SEO sucede **en el servidor** (páginas/layouts `.astro`). Lo que necesita el cliente se pasa **como props**.
  - **Capa estable “enlolab/” fuera de `src`** con helpers, head y SEO reutilizables, e **imports por alias**.

---

## 1) Stack técnico

- **Astro** (pages, layouts, islands React cuando convenga).
- **React + shadcn** para UI en islas o layouts.
- **Tailwind** vía `@tailwindcss/vite`.
- **Content Collections** de Astro para **config global tipada** (Opción 3).
- **`astro-seo`** para el `<SEO />` con un helper propio (`buildSeoProps`).
- **Cloudflare (opcional)** para SSR: se soporta con `@astrojs/cloudflare`.

---

## 2) Estructura actual (simplificada)

```
enlolab/
  config.ts                 # accessor a settings.yaml (server-only)
  head/
    CommonHead.astro
    Favicons.astro
    Meta.astro              # wrapper fino para <SEO />
  seo/
    buildSeoProps.ts        # helper central de SEO
src/
  content.config.ts         # define la colección "settings"
  data/
    settings.yaml           # fuente de verdad de branding + SEO + toggles
  layouts/
    BaseLayout.astro        # consume CommonHead, Favicons, Meta
  pages/
    index.astro             # ejemplo de uso con metadata por página
  styles/
    global.css
astro.config.mjs            # site, trailingSlash, alias, integrations
tsconfig.json               # paths @ y @enlolab
```

---

## 3) “Una sola verdad” bien definida

- **`astro.config.mjs`**
  - `site`: URL pública del sitio → canónicas + sitemap.
  - `trailingSlash`: `'never' | 'always'` → cómo terminan las URLs.

- **`src/data/settings.yaml`**
  - Branding (**`site.name`**, **favicons**, etc.).
  - **SEO base** (title default/template, description, OG, twitter).
  - **Toggles** de apps (p. ej., `apps.blog.isEnabled` y sus rutas).

- **Regla clave:** Las canónicas **no** leen del YAML, se construyen con `new URL(Astro.url.pathname, Astro.site)`.

> Si prefieres editar también `site`/`trailingSlash` desde YAML, puedes **sincronizar** `astro.config` leyendo el YAML al arrancar. Por simplicidad y robustez, mantenemos `site` en `astro.config`.

---

## 4) Configuración global tipada con **Content Collections**

- **`src/content.config.ts`** define una **colección “settings”** con loader `glob()` que lee `src/data/settings.yaml`. Se valida con **Zod** y queda **tipado**.
- **`enlolab/config.ts`** expone:
  - `getSettings()` → devuelve el objeto tipado.
  - `getConfigCached()` → cache simple en SSR (sin caché en dev).
  - `getConfigSlices()` → devuelve `{ SITE, I18N, METADATA, APP_BLOG, UI, ANALYTICS }`.

> **Server-only:** `astro:content` solo existe en servidor. No importes `@enlolab/config` en islas React ni scripts cliente.

---

## 5) SEO centralizado con `astro-seo` + helper

- **`enlolab/seo/buildSeoProps.ts`**:
  - Lee `{ SITE, I18N, METADATA }`.
  - Calcula **canonical** con `Astro.site`.
  - Normaliza **robots** a `noindex/nofollow`.
  - Construye `openGraph` _solo si_ puede completar `basic.{title,type,image,url}` (API de `astro-seo`).
  - `extend.meta` añade verificación Google si está en settings.

- **`enlolab/head/Meta.astro` (wrapper recomendado)**:
  - Llama a `buildSeoProps(Astro, Astro.props)` y pinta `<SEO {...seoProps} />`.
  - Ventaja: punto único para añadir **JSON-LD**, `languageAlternates`, etc., más adelante.

- **Uso en Layout**:

  ```astro
  ---
  ```

// src/layouts/BaseLayout.astro
import { SEO } from "astro-seo"; // si prefieres sin wrapper
import CommonHead from "@enlolab/head/CommonHead.astro";
import Favicons from "@enlolab/head/Favicons.astro";
import Meta from "@enlolab/head/Meta.astro"; // wrapper fino (opción recomendada)
import type { PageSeo } from "@enlolab/seo/types";

export interface Props { metadata?: PageSeo; showAnnouncement?: boolean }
const { metadata = {}, showAnnouncement = true } = Astro.props;

---

  <html lang="es">
    <head>
      <CommonHead />
      <Favicons />
      <Meta {...metadata} />          <!-- o <SEO {...await buildSeoProps(Astro, metadata)} /> -->
    </head>
    <body><slot /></body>
  </html>
  ```

- **Override por página**:

  ```astro
  ---
  ```

// src/pages/index.astro
import BaseLayout from "@/layouts/BaseLayout.astro";

const metadata = {
title: "Landing — TuMarca",
ignoreTitleTemplate: true,
description: "Landing ultrarrápida",
openGraph: { images: ["/og/landing.png"] },
};
--

  <BaseLayout metadata={metadata}>
    ...
  </BaseLayout>
  ```

- **Desde Markdown/MDX**: el `frontmatter` puede mapearse a `metadata` en el layout.

---

## 6) `Head` y favicons

- **`CommonHead.astro`**: meta base + `<link rel="sitemap" ...>`.
- **`Favicons.astro`**: lee colores y paths desde `settings.yaml` vía `getConfigSlices()`.

```astro
---
import favIco from "@/assets/favicons/favicon.ico";
import favSvg from "@/assets/favicons/favicon.svg";
import apple from "@/assets/favicons/apple-touch-icon.png";
import { getConfigSlices } from "@enlolab/config";
const { SITE } = await getConfigSlices();
---
<link rel="shortcut icon" href={favIco} />
<link rel="icon" type="image/svg+xml" href={favSvg.src} />
<link rel="mask-icon" href={favSvg.src} color={SITE?.favicon?.colors?.icon} />
<link rel="apple-touch-icon" sizes="180x180" href={apple.src} />
<meta name="theme-color" content={SITE?.favicon?.colors?.theme} />
```

---

## 7) URLs y permalinks (factory server-only)

- **`enlolab/urls/permalinks.ts`** exporta `makePermalinks(Astro)` que devuelve helpers:
  - `getCanonical(path)`, `getPermalink(slug, type)`, `getAsset(path)`, `applyGetPermalinks(menu)`…
  - Usa `Astro.site` (canónicas), `import.meta.env.BASE_URL` (base) y `settings.yaml` (blog paths, `trailingSlash` si lo usas).

**Ejemplo:**

```astro
---
import { makePermalinks } from "@enlolab/urls/permalinks";
const { getAsset } = await makePermalinks(Astro);
---
<link rel="sitemap" href={getAsset("sitemap-index.xml")} />
```

> Esto reemplaza utilidades antiguas acopladas a un “módulo virtual”; ahora es explícito y **SSR-safe**.

---

## 8) Aliases y rutas fuera de `src/`

- Tenemos carpeta **`enlolab/` en la raíz** con piezas estables.
- **Aliases**:
  - `@` → `./src`
  - `@enlolab` → `./enlolab`

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://tumarca.com',
  trailingSlash: 'never',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@enlolab': fileURLToPath(new URL('./enlolab', import.meta.url)),
      },
    },
  },
});
```

---

## 9) Server vs Client: reglas claras

- **Server-only** (OK en páginas/layouts `.astro`):
  - `astro:content` y `@enlolab/config`.
  - `makePermalinks(Astro)`.
  - `buildSeoProps(Astro, ...)`.

- **Cliente (islas React / scripts `client:*`)**:
  - **No** importes `astro:content` ni `@enlolab/config`.
  - Pasa lo que necesites desde el layout como **props serializadas**.

---

## 10) React + shadcn

- Puedes usar shadcn en islas (`client:load`, `client:idle`, `client:visible`) o en SSR si son componentes estáticos.
- Mantén el **JS del cliente al mínimo**: Astro debe seguir sirviendo páginas rápidas, y React se usa **solo** donde aporta.

---

## 11) Despliegue

- **Estático (SSG):** simple, ultra-rápido.
- **SSR (Cloudflare Pages/Workers):** añade `output: "server"` + `adapter cloudflare`. Asegúrate de que tus imports server-only no se cuelan al cliente (seguir regla de props).

---

## 12) Entornos y secretos

- Usa `astro:env` / `.env` para claves privadas.
- Cualquier cosa pública (IDs de GA) puede ir en `settings.yaml` **o** en `PUBLIC_*` env (tu elección).
- No metas secretos en YAML.

---

## 13) “Cómo añado Blog más adelante”

1. Crea colecciones `posts`, `tags`, `categories` en `src/content.config.ts`.
2. Páginas MD/MDX en `src/content/posts/**`.
3. Páginas de lista/detalle (`src/pages/blog/[slug].astro`) usando `getCollection('posts')`.
4. Rutas (pathname) toman valores de `settings.yaml` (`apps.blog.*`) para construir permalinks.
5. El **SEO** por post se compone con `buildSeoProps(Astro, frontmatter)`.

_No necesitas `injectRoute()`; Content Collections + filesystem routing de Astro son suficientes y más claros._

---

## 14) Pruebas y calidad

- **Typecheck** (`tsc --noEmit`) y **ESLint** para DX.
- **Vitest** para helpers puros (permalinks, normalizadores SEO).
- “Smoke test” de build: validar que `<SEO />` está presente y que canónicas son correctas.

---

## 15) Rendimiento y accesibilidad

- Minimiza JS en cliente; prioriza HTML/SSR.
- Carga **imágenes** y **fuentes** correctamente (preload si aplica).
- Asegura que `<title>`, `meta[name=description]` y `og:*` estén presentes en cada página.
- Considera un helper para **JSON-LD** (producto, artículo, org…).

---

## 16) Roadmap (futuro)

- **Virtual module `enlolab:config`** (fase 2):
  - Mantener imports estables aunque cambie el backend de la config.

- **Generador/CLI**: scaffolding de landing con prompts → rellena `settings.yaml`, crea secciones base, añade shadcn UI.
- **Support multi-tenant**: separar `settings.yaml` por proyecto/brand y build matrix.
- **Plugins**:
  - `enlolab-analytics` (inyectar GA/umami/plausible).
  - `enlolab-schema` (JSON-LD por tipo de página).

- **i18n**: colección `locales/**` y helper para `<link rel="alternate" hreflang>`.
- **Docs**: layout con TOC, breadcrumbs, versionado simple (si hace falta).

---

## 17) Checklist de “estado OK”

- [ ] `astro.config.mjs` con `site`, `trailingSlash`, `alias`, `tailwind`, `react`, `sitemap`.
- [ ] `src/content.config.ts` y `src/data/settings.yaml` válidos (corre `astro sync`).
- [ ] `enlolab/config.ts` y `buildSeoProps.ts` funcionando.
- [ ] `BaseLayout.astro` usando `CommonHead`, `Favicons`, `Meta`.
- [ ] Una página con `metadata` override y OG image de ejemplo.
- [ ] `makePermalinks(Astro)` usado en `CommonHead` (sitemap link) y donde toque.
- [ ] Ningún import de `@enlolab/config` en islas/cliente.
- [ ] Build sin warnings de tipos.

---

## 18) Resumen ejecutivo

- **Config tipada + HMR** vía Content Collections (YAML → Zod).
- **SEO robusto** con `astro-seo` y helper centralizado.
- **Head y favicons** en componentes reutilizables.
- **Permalinks** server-only con factory ligado a `Astro`.
- **BaseLayout** recibe `metadata` para overrides por página/MDX.
- **Aliases** para importar limpio desde `/enlolab` (fuera de `src`).
- **Futuro**: virtual module, generador, blog, i18n, plugins.

Con esto tienes un **esqueleto sólido** para construir landings rápidas hoy y escalar a sitios completos mañana sin rehacer foundational code.
