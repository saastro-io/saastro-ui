/**
 * previews-caducadas.mjs — ¿qué capturas de public/previews/ son más viejas que
 * la fuente que fotografían?
 *
 * Lo usan el gate de CI (check-previews.mjs) y `pnpm capture`, que regenera las
 * que salgan de aquí sin necesidad de --force.
 *
 * La FUENTE de un item es lo que pinta /preview/<name>:
 *   - los `files` del item en registry.json (el .astro/.tsx del registry);
 *   - src/demos/<name>.* (el wrapper .preview.astro, su .demo.tsx y las props .ts).
 * NO entran el layout, el CSS global ni lib/: un cambio de tema no caduca nada.
 *
 * El criterio es por CONTENIDO: `capture` apunta en public/previews/fuentes.json
 * el sha256 de las fuentes de cada item que fotografía, y se commitea con los
 * PNG. Una captura está caducada si el hash actual de su fuente no es el
 * apuntado. Por qué no fechas:
 *   - el mtime no vale: en CI el checkout pone todo a «ahora»;
 *   - la fecha/ascendencia de commits tampoco: si la fuente cambia sin cambiar
 *     píxeles (un export, un tipo), la recaptura sale byte a byte igual, git no
 *     ve cambio en el PNG y el gate quedaría rojo para siempre. Con el manifiesto
 *     recapturar SIEMPRE deja al día, y no hace falta la historia de git en CI.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const REGISTRY_DIR = fileURLToPath(new URL('../../../packages/ui-registry/', import.meta.url));
const DEMOS_DIR = fileURLToPath(new URL('../src/demos/', import.meta.url));
export const PREVIEWS_DIR = fileURLToPath(new URL('../public/previews/', import.meta.url));
const MANIFIESTO = `${PREVIEWS_DIR}fuentes.json`;

export function leerRegistry() {
  return JSON.parse(readFileSync(`${REGISTRY_DIR}registry.json`, 'utf8'));
}

/** Rutas de lo que pinta /preview/<name>, relativas y ordenadas (el hash no depende del orden de readdir). */
export function fuentesDe(item) {
  const fuentes = item.files.map((f) => `packages/ui-registry/${f.path}`);
  for (const f of readdirSync(DEMOS_DIR)) {
    if (f.startsWith(`${item.name}.`)) fuentes.push(`apps/ui-docs/src/demos/${f}`);
  }
  return fuentes.sort();
}

const RAIZ = fileURLToPath(new URL('../../../', import.meta.url));

/** sha256 de (ruta + contenido) de cada fuente. Una fuente que desaparece también cambia el hash. */
export function hashFuentes(item) {
  const h = createHash('sha256');
  for (const rel of fuentesDe(item)) {
    h.update(`${rel}\0`);
    h.update(existsSync(`${RAIZ}${rel}`) ? readFileSync(`${RAIZ}${rel}`) : '<no existe>');
    h.update('\0');
  }
  return h.digest('hex');
}

export function leerManifiesto() {
  return existsSync(MANIFIESTO) ? JSON.parse(readFileSync(MANIFIESTO, 'utf8')) : {};
}

/** Apunta que las capturas de `names` se hicieron sobre la fuente actual. */
export function apuntarCapturas(names, registry = leerRegistry()) {
  const m = leerManifiesto();
  for (const item of registry.items) if (names.includes(item.name)) m[item.name] = hashFuentes(item);
  // Solo items vivos, en orden estable: el diff del manifiesto se lee.
  const vivos = new Set(registry.items.map((i) => i.name));
  const out = Object.fromEntries(
    Object.keys(m)
      .filter((k) => vivos.has(k))
      .sort()
      .map((k) => [k, m[k]]),
  );
  writeFileSync(MANIFIESTO, `${JSON.stringify(out, null, 2)}\n`);
}

/** Items cuyas capturas existen pero no corresponden a la fuente actual. */
export function previewsCaducadas(registry = leerRegistry()) {
  const m = leerManifiesto();
  const caducadas = [];
  for (const item of registry.items) {
    const tiene = ['light', 'dark'].some((t) => existsSync(`${PREVIEWS_DIR}${item.name}-${t}.png`));
    if (!tiene) continue; // eso es «falta», no «caducada»
    if (m[item.name] !== hashFuentes(item)) {
      caducadas.push({ name: item.name, apuntado: m[item.name] ?? null, fuentes: fuentesDe(item) });
    }
  }
  return caducadas;
}
