/**
 * check-previews.mjs — gate de CI: cada item de registry.json debe tener sus
 * dos capturas commiteadas en public/previews/. Si falta alguna, el commit
 * tocó bloques sin correr `pnpm capture` (o sin --force tras cambiarlos).
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const registry = JSON.parse(
  await readFile(new URL('../../../packages/ui-registry/registry.json', import.meta.url), 'utf8'),
);
const dir = fileURLToPath(new URL('../public/previews/', import.meta.url));

const missing = [];
for (const { name } of registry.items) {
  for (const theme of ['light', 'dark']) {
    if (!existsSync(`${dir}${name}-${theme}.png`)) missing.push(`${name}-${theme}.png`);
  }
}

if (missing.length) {
  console.error(`✗ Faltan ${missing.length} capturas en public/previews/:`);
  for (const m of missing) console.error(`  - ${m}`);
  console.error('\nCorre: pnpm --filter @saastro/ui-docs build && pnpm --filter @saastro/ui-docs capture');
  process.exit(1);
}
console.log(`✓ ${registry.items.length * 2} capturas presentes.`);
