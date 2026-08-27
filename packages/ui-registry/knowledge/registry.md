# registry — el contrato para consumir `@saastro`

> **Esta ficha es CONTRATO.** La leen agentes de otros repos —theme, los nueve
> sites de ENLOLAB, hub— antes de instalar nada de aquí. Si cambias el contrato,
> cambia esta ficha en el mismo commit.
>
> **Describe `main`, y el registry sirve lo desplegado.** Aquí no hay
> versiones que pinear (es copy-in), pero lo que tú tengas copiado en tu
> repo es de cuando lo bajaste: si algo no cuadra, vuelve a bajarlo con
> `ui:sync` antes de dar por falsa esta ficha.

## Qué es

`packages/ui-registry` es el paquete `@saastro/ui-registry`, y su corazón es
`registry.json`: **41 entradas** —15 bloques de landing y 26 primitivos— que
describen cada pieza para el CLI de shadcn.

`registry.json` es la **fuente única**. El catálogo del showcase se deriva de
él (`apps/ui-docs/src/lib/catalog.ts` lo importa), así que el drift entre lo
publicado y lo listado es imposible por construcción.

## Cómo se consume

```bash
npx shadcn@latest add @saastro/hero-01     # un bloque
npx shadcn@latest add @saastro/button      # un primitivo
```

Requiere declarar el registry una vez en tu `components.json`:

```jsonc
{
  "style": "base-nova",
  "registries": { "@saastro": "https://ui.saastro.io/r/{name}.json" }
}
```

**`style` no es decoración: es lo que fija la base UI.** `base-nova` significa
Base UI. Un consumidor que se deje `"default"` recibirá piezas que no casan con
sus primitivos.

## Las cuatro cosas que no se rompen

**1. Nada resuelve fuera de `@saastro`.** Todas las `registryDependencies`
llevan el prefijo. Un nombre pelado —`"button"`— lo resolvería el CLI contra el
registry de shadcn y metería un componente **Radix** en un proyecto Base UI.
Es el fallo que este registry existe para impedir; si algún día vuelve a
aparecer un nombre sin prefijo, es un bug, no un atajo.

**2. Los primitivos son Base UI.** Se usa `render={<a/>}`, nunca el `asChild`
de Radix. Seis de los 26 no llevan primitivo externo —`card`, `label`,
`textarea`, `field`, `native-select`, `input-group` son markup puro— y otros
dos van sobre librerías propias (`calendar` sobre `react-day-picker`,
`input-otp` sobre `input-otp`). El campo `docs` de cada item lo dice.

**3. `render` NO funciona dentro de un fichero `.astro`.** Ahí las llaves no
son JSX de React: Astro compila su propio elemento y React recibe `undefined`.
En `.astro` se usan las clases sobre el elemento nativo
(`class={buttonVariants(...)}`).

**4. El paquete no se publica a npm y no debe publicarse.** `private: true`.
El modelo es copy-in: te llevas el fichero y es tuyo. `changeset publish` salta
los `private` en silencio, así que el flujo de release del monorepo pasa por
encima sin hacer nada — eso está bien y es la regla 2 del CLAUDE.md del repo,
que conviene leer porque la sección «Publishing» de arriba parece decir lo
contrario.

**Por qué copy-in y no un paquete npm**: Tailwind no escanea `node_modules`, así
que las clases que viven dentro de un paquete no entran en el CSS generado.
Está intentado varias veces y no funciona. No se vuelve a proponer.

## Qué lleva cada entrada

`name`, `type` (`registry:block` o `registry:ui`), título y descripción,
`registryDependencies` (siempre con prefijo `@saastro/`), `dependencies` npm
—casi todos los primitivos declaran alguna: `@base-ui/react`,
`class-variance-authority`, `lucide-react`…—, `files` con su `target`, y un
`meta.group` que agrupa la galería.

## Lo que está fuera a propósito

**`command`.** `cmdk@1.1.1` depende de cuatro paquetes de Radix
(`react-compose-refs`, `react-dialog`, `react-id`, `react-primitive`).
Publicarlo reintroduciría Radix en todos los consumidores, que es exactamente
lo que este registry evita. Se reescribirá sobre el `combobox`/`autocomplete`
que Base UI trae desde la 1.7; hasta entonces vive solo en `saastro-theme`.

## Build

`pnpm build` en este paquete ejecuta
`shadcn build --output ../../apps/ui-docs/public/r`: los JSON se generan
**dentro del sitio de docs**, que es quien los sirve. Ojo con dos cosas: el
build **no borra** los JSON de items eliminados —hay que purgarlos a mano— y
`pnpm run deploy` de ui-docs **no reconstruye**, solo sube `dist/`.
