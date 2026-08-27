# bloques — qué instalas cuando pides un bloque

> **Esta ficha es CONTRATO.** La leen agentes de otros repos antes de meter un
> bloque en un site. Si cambia la frontera Astro/isla, cambia aquí.

## Los quince

Viven en `registry/default/blocks/`. Cubren una landing entera: tres heroes,
dos de features, pricing, CTA, FAQ, testimonios, navbar, footer, blog-grid,
newsletter, stats y logos.

**Doce son `.astro` puros y tres son `.tsx`.** No es una casualidad histórica:
es la frontera del adaptador, y es lo que define qué te llevas al instalarlos.

| | Cuáles | Qué te llevas |
|---|---|---|
| `.astro` (12) | hero-01/02/03, features-01/02, cta-01, testimonials-01, footer-01, blog-grid-01, newsletter-01, stats-01, logos-01 | HTML y clases. **Cero JS, cero dependencias**: su `registryDependencies` está vacío |
| `.tsx` (3) | `faq-01` (acordeón), `navbar-01` (menú móvil), `pricing-01` (mensual/anual) | React + los primitivos `@saastro/*` que declaren. Necesitan `client:*` para hidratar |

Los tres `.tsx` son exactamente los que llevan estado. Sus dependencias son del
**propio registry** y van sobre Base UI:

```
faq-01      → @saastro/accordion
navbar-01   → @saastro/button, @saastro/sheet
pricing-01  → @saastro/button, @saastro/card, @saastro/badge, @saastro/separator
```

## La frontera, y por qué la aprendimos rompiéndola

**Las props de un componente Astro cruzan serializadas. Una función no cruza.**

`newsletter-01` era React con un `onSubmit` por props y era inutilizable desde
Astro: el handler llegaba `undefined`. Se rehízo con `action` y `method`
nativos, y ahora funciona incluso con JavaScript desactivado.

De ahí la regla del repo:

| Qué | Cómo |
|---|---|
| Sección visual | `.astro` |
| Captura simple (email → endpoint) | `.astro` con `action`/`method` nativos |
| Acordeón, menú, toggle | isla `.tsx` + `client:*` |
| **Validación, pasos, lógica condicional, submit a API** | isla `.tsx` con **`@saastro/forms`** |

**El registry no es el sitio de los formularios de negocio.** Un bloque puede
traer el *maquetado* de un formulario; la *lógica* es `@saastro/forms`, que se
instala por npm y se monta como isla. Meter RHF y Zod en un `.astro` sería
reimplementar la librería a mano.

## Al instalar en un site

Los bloques son **presentacionales**: el contenido entra **solo por props**,
nunca hardcodeado. Sin i18n y sin `data-saastro` — esa instrumentación la pone
el site, no el bloque.

Y ojo con `render={<a/>}` de Base UI: **no funciona dentro de un `.astro`**.
Ahí van las clases sobre el elemento nativo.
