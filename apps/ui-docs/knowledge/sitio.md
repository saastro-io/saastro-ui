# sitio — las nueve páginas de ui.saastro.io

`apps/ui-docs/src/pages/` es la superficie pública. Nueve rutas Astro, y cada
una tiene un motivo:

- **`index.astro`** — portada.
- **`blocks/index.astro`** y **`blocks/[name].astro`** — la galería y la ficha
  de cada bloque: capturas clara y oscura, el snippet de instalación con el CLI
  de shadcn, y el campo `docs` que viene de `registry.json`.
- **`preview/[name].astro`** — el bloque **solo**, sin chrome del sitio. Es lo
  que carga el iframe de la ficha y lo que fotografía `capture.mts`. Su alto lo
  fija `meta.iframeHeight` de cada item del registry.
- **`ui/index.astro`** — las primitivas (`registry:ui`), que no son bloques.
- **`templates/index.astro`** — plantillas completas.
- **`docs.astro`** y **`docs/[...slug].astro`** — la documentación, que sale de
  la colección de contenido.
- **`404.astro`** — lo sirve el Worker de assets con status 404.

## Lo que decide la forma de las URL

`src/data/settings.yaml` declara `trailingSlash: "never"` y el sitio es
`https://ui.saastro.io`. Eso tiene consecuencias en el despliegue, no solo
estéticas: ver la sección `ui-docs`.
