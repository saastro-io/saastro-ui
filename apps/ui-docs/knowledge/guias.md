# guias — la documentación que se lee, no la que se genera

`apps/ui-docs/src/content/docs/` son ocho `.mdx`, una colección de contenido de
Astro tipada en `src/content.config.ts` y servida por `docs/[...slug].astro`.

- **`introduction`** — qué es esto y para quién.
- **`installation`** — poner los bloques en un proyecto Astro.
- **`cli`** — el CLI de shadcn contra `ui.saastro.io/r/{name}.json`, que es la
  vía de instalación, no npm.
- **`components-json`** — el `components.json` del proyecto de destino: los
  alias (`@components`, `@ui`) que hacen que los `target` del registry aterricen
  donde deben.
- **`theming`** y **`dark-mode`** — los tokens y el cambio de tema.
- **`typography`**.
- **`changelog`**.

Son `.mdx` y no `.md`: llevan componentes dentro. Eso importa para la office —
el watcher tuvo que aprender la extensión para verlos.
