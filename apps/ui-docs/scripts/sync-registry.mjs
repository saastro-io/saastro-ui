// Copia el registry construido (packages/ui-registry/public/r) a public/r de
// este sitio, que es lo que acaba en dist/ y se sirve en ui.saastro.io/r/*.json.
//
// Por qué existe: había DOS copias de public/r/ y habían derivado — el JSON
// servido no correspondía a las fuentes del registry, así que `shadcn add
// @saastro/<block>` entregaba bloques viejos. Este script hace que la copia de
// ui-docs sea siempre un derivado determinista, nunca algo editado a mano.
import { cp, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '../../../packages/ui-registry/public/r');
const dest = resolve(here, '../public/r');

if (!existsSync(src)) {
  console.error(
    `\n✗ No existe ${src}\n  Construye antes el registry:  pnpm --filter @saastro/ui-registry build\n`,
  );
  process.exit(1);
}

await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true, force: true });
console.log(`✓ registry sincronizado: ${(await readdir(dest)).length} ficheros → public/r`);
