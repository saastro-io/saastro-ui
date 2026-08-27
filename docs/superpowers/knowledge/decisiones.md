# decisiones — por qué el repo está como está

`docs/superpowers/` guarda dos documentos, y los dos son historia con moraleja.

## `specs/2026-04-08-docs-theme-design.md` — el paquete que no salió bien

Especificaba `@saastro/docs-theme`: `forms-docs` y `ui-docs` compartían un 80 %
de infraestructura y se estaban desincronizando, así que se propuso extraerla a
un paquete npm entre `@saastro-io/shell` y cada sitio. Aprobado el 2026-04-08.

**Lo que pasó después está contado en `apps/ui-docs/src/theme/README.md`, y es
lo contrario:** el paquete costó más de lo que ahorraba y el tema acabó
vendorizado. La regla que quedó —lógica con contrato a paquete versionado,
presentación copy-in— sale de este fracaso, no de un diseño previo. Por eso el
spec se conserva: sin él, la decisión de vendorizar parece un capricho.

## `plans/2026-03-27-audit-fixes.md` — el plan que no se reescribe

Ejecutado el 2026-03-27 con `bun`. El repo migró a pnpm el 2026-08-17 y el
documento lleva una nota arriba diciéndolo, pero **el cuerpo no se ha tocado**:
reescribir los comandos falsearía el registro de lo que se hizo aquel día.
