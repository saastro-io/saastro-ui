# ui-docs — el sitio, y cómo se sirve

`apps/ui-docs` es `@saastro/ui-docs`: Astro 6 estático en `ui.saastro.io`.
Dentro tiene sus propias secciones —`sitio`, `guias`, `tema`, `previews`— y
esta cubre lo que las envuelve: configuración y despliegue.

## Se sirve como assets, sin Worker

`wrangler.jsonc` no declara `main`: es cien por cien estático y no hace falta
código de Worker. Las peticiones a assets estáticos son gratis e ilimitadas.

Los dos ajustes que no son evidentes:

- **`html_handling: "drop-trailing-slash"`.** Astro genera `carpeta/index.html`
  (`build.format: 'directory'`) y el sitio declara `trailingSlash: "never"` en
  `src/data/settings.yaml`. Esta opción sirve `/docs` con 200 y redirige
  `/docs/` → `/docs`, que es la forma canónica que emite Astro. Con el valor por
  defecto, cada enlace interno se comería un 307 de más.
- El **404** sale de `src/pages/404.astro` y lo sirve con status 404.

`workers_dev: false`: solo se llega por el dominio.

## Qué se construye y qué se ignora

`pnpm build` en el registry escribe `public/r/*.json` dentro de este sitio, y
ese directorio está **ignorado en git**: es generado, y la única copia viva es
la que acaba en `dist/`. Lo que sí se commitea es `public/previews/*.png`, las
capturas de la galería.

## Dependencias externas

`@saastro-io/config` y `@saastro-io/shell`, ambas de saastro-infra por GitHub
Packages. El tema de docs ya **no** es una de ellas: ver la sección `tema`.
