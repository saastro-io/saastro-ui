# previews — las capturas de cada bloque, y el guardián que las exige

`apps/ui-docs/scripts/` son tres utilidades, y dos de ellas sostienen la
galería del sitio.

## `capture.mts`

Saca dos capturas por bloque, clara y oscura, contra `/preview/<name>` con
puppeteer. Necesita `pnpm build` antes —levanta `astro preview` sobre `dist/`—
y el Chrome de puppeteer instalado a mano, porque pnpm 10 bloquea el
postinstall que lo bajaría solo.

Tres detalles que costaron encontrarse y que están comentados en el fichero:

- el tema se fija por `localStorage` **antes** de cargar la página
  (`evaluateOnNewDocument`), con la misma clave que usa el shell del sitio;
- esperar a `networkidle2` **no basta** para los bloques interactivos: hay que
  esperar a que `astro-island` borre su atributo `ssr`, que es cuando de verdad
  ha hidratado;
- `document.fonts.ready` antes de disparar, o la captura sale con FOUT.

Por defecto salta lo que ya existe; `--force` rehace y `--only=<name>` acota.

## `check-previews.mjs`

Puerta de CI: lee `registry.json` y exige que cada item tenga sus dos PNG
commiteados en `public/previews/`. Si falta alguno, es que se tocaron bloques
sin correr `pnpm capture`. Las capturas **se commitean** y viven fuera de
`public/r/` a propósito: ese directorio lo regenera el build y está ignorado.

## `analyze-performance.js`

Análisis puntual del rendimiento del sitio. No entra en CI.
