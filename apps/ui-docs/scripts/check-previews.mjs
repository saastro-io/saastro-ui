/**
 * check-previews.mjs — gate de CI de las capturas de public/previews/.
 *
 * Falla si a un item de registry.json:
 *   1. le FALTA alguna de sus dos capturas (light/dark), o
 *   2. sus capturas están CADUCADAS: su fuente (el .astro/.tsx del registry o
 *      su demo) ya no es la que `capture` fotografió. El 9-sep compare-01 se
 *      editó, la foto siguió siendo la vieja y este gate —que entonces solo
 *      contaba ficheros— pasó. Criterio en previews-caducadas.mjs.
 */
import { existsSync } from 'node:fs';
import { leerRegistry, PREVIEWS_DIR, previewsCaducadas } from './previews-caducadas.mjs';

const registry = leerRegistry();

const missing = [];
for (const { name } of registry.items) {
  for (const theme of ['light', 'dark']) {
    if (!existsSync(`${PREVIEWS_DIR}${name}-${theme}.png`)) missing.push(`${name}-${theme}.png`);
  }
}
const caducadas = previewsCaducadas(registry);

if (missing.length) {
  console.error(`✗ Faltan ${missing.length} capturas en public/previews/:`);
  for (const m of missing) console.error(`  - ${m}`);
}
if (caducadas.length) {
  console.error(`✗ ${caducadas.length} items con capturas más viejas que su fuente:`);
  for (const c of caducadas) {
    const por = c.apuntado ? 'la fuente cambió desde la captura' : 'sin entrada en fuentes.json';
    console.error(`  - ${c.name} (${por}): ${c.fuentes.join(', ')}`);
  }
}
if (missing.length || caducadas.length) {
  console.error(
    '\nCorre: pnpm --filter @saastro/ui-docs build && pnpm --filter @saastro/ui-docs capture' +
      '\n(regenera las que faltan y las caducadas) y commitea los PNG con public/previews/fuentes.json.',
  );
  process.exit(1);
}
console.log(`✓ ${registry.items.length * 2} capturas presentes y al día con su fuente.`);
