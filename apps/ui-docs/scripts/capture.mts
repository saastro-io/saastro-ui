/**
 * capture.mts — screenshots light+dark de cada bloque contra /preview/<name>.
 *
 * Requiere `pnpm build` previo (sirve dist/ con el `preview()` de astro, en
 * proceso) y el chrome-headless-shell de puppeteer (una vez:
 * `pnpm exec puppeteer browsers install chrome-headless-shell` — pnpm 10
 * bloquea el postinstall que lo bajaría solo).
 *
 * Uso:  pnpm capture [--force] [--only=<name>]
 *   - por defecto captura lo que FALTA y lo CADUCADO (la fuente del item cambió
 *     desde su captura; ver previews-caducadas.mjs). --force, todo.
 *   - cada item capturado apunta el hash de su fuente en
 *     public/previews/fuentes.json, que se commitea con los PNG: sin él, el gate
 *     de CI (check-previews.mjs) lo da por caducado.
 *   - la salida va a public/previews/<name>-{light,dark}.png y SE COMMITEA.
 *     Vive fuera de public/r a propósito: ese directorio lo regenera el build.
 *
 * Detalles que importan (aprendidos del capture de shadcn y verificados aquí):
 *   - tema por localStorage ANTES de cargar (evaluateOnNewDocument), la misma
 *     clave que usa el shell del sitio;
 *   - espera de hidratación real: astro-island borra su atributo `ssr` al
 *     hidratar — networkidle2 NO basta para los bloques interactivos;
 *   - document.fonts.ready para no capturar con FOUT.
 */
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { preview } from 'astro';
import puppeteer from 'puppeteer';
import { apuntarCapturas, fuentesDe, previewsCaducadas } from './previews-caducadas.mjs';

const FORCE = process.argv.includes('--force');
const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
const PORT = 4913;
const OUT = fileURLToPath(new URL('../public/previews/', import.meta.url));
const APP = fileURLToPath(new URL('..', import.meta.url));

const registry = JSON.parse(
  await readFile(new URL('../../../packages/ui-registry/registry.json', import.meta.url), 'utf8'),
);
const names: string[] = registry.items
  .map((i: { name: string }) => i.name)
  .filter((n: string) => !only || n === only);

/**
 * Los BLOQUES son secciones de página: llenan un viewport de 1440 y su
 * miniatura se lee bien. Los PRIMITIVOS no — un `button` centrado en 1440×400
 * se convierte, escalado a la tarjeta de ~320px de la galería, en un punto
 * rodeado de vacío. Se capturan en un lienzo estrecho para que el componente
 * ocupe el encuadre.
 */
const esPrimitivo = new Set<string>(
  registry.items
    .filter((i: { type: string }) => i.type === 'registry:ui')
    .map((i: { name: string }) => i.name),
);
const VIEWPORT_BLOQUE = { width: 1440, height: 900 };
const VIEWPORT_PRIMITIVO = { width: 720, height: 420 };

if (!existsSync(`${APP}dist`)) {
  console.error('✗ No hay dist/ — corre `pnpm build` antes de capturar.');
  process.exit(1);
}

const caducadas = new Set(previewsCaducadas(registry).map((c: { name: string }) => c.name));

// Capturar un dist/ más viejo que la fuente apuntaría el hash NUEVO sobre una foto
// VIEJA: el gate quedaría verde con la captura mal. Aquí el mtime sí vale (es
// local, lo escribió el build de esta máquina), así que se compara la página
// construida de cada item a capturar con sus fuentes.
const RAIZ = fileURLToPath(new URL('../../../', import.meta.url));
const distViejo = names.filter((name) => {
  const light = `${OUT}${name}-light.png`;
  const dark = `${OUT}${name}-dark.png`;
  if (!FORCE && !caducadas.has(name) && existsSync(light) && existsSync(dark)) return false;
  const html = `${APP}dist/preview/${name}/index.html`;
  if (!existsSync(html)) return true;
  const item = registry.items.find((i: { name: string }) => i.name === name);
  const t = statSync(html).mtimeMs;
  return fuentesDe(item).some((f: string) => existsSync(`${RAIZ}${f}`) && statSync(`${RAIZ}${f}`).mtimeMs > t);
});
if (distViejo.length) {
  console.error(`✗ dist/ es más viejo que la fuente de: ${distViejo.join(', ')}`);
  console.error('  Corre `pnpm build` (desde la raíz: construye también el registry) y vuelve a capturar.');
  process.exit(1);
}

// El servidor va EN PROCESO, con la API de astro, no como subproceso. Con
// `spawn('pnpm', ['exec', 'astro', 'preview'])` astro 7 detecta que lo corre un
// agente (am-i-vibing) y se relanza en background: PPID 1, su propio grupo, y
// el server.kill() mataba pnpm y dejaba vivo el servidor en el puerto. En
// proceso no hay daemon ni lock file: server.stop() lo cierra de verdad.
const server = await preview({ root: APP, server: { port: PORT }, logLevel: 'error' });

mkdirSync(OUT, { recursive: true });
let captured = 0;
let skipped = 0;
const hechos: string[] = [];

try {
  // headless:'shell' (chrome-headless-shell): el headless por defecto no
  // compone en una sesión sin pantalla (claude --bg) y page.screenshot cuelga.
  const browser = await puppeteer.launch({ headless: 'shell' });
  try {
    for (const name of names) {
      const light = `${OUT}${name}-light.png`;
      const dark = `${OUT}${name}-dark.png`;
      const rehacer = FORCE || caducadas.has(name);
      if (!rehacer && existsSync(light) && existsSync(dark)) {
        skipped++;
        continue;
      }
      const page = await browser.newPage();
      const vp = esPrimitivo.has(name) ? VIEWPORT_PRIMITIVO : VIEWPORT_BLOQUE;
      await page.setViewport({ ...vp, deviceScaleFactor: 2 });
      for (const [theme, file] of [
        ['light', light],
        ['dark', dark],
      ] as const) {
        if (!rehacer && existsSync(file)) continue;
        await page.evaluateOnNewDocument((t: string) => localStorage.setItem('theme', t), theme);
        await page.goto(`http://localhost:${PORT}/preview/${name}`, {
          waitUntil: 'networkidle2',
        });
        await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'), {
          timeout: 15_000,
        });
        await page.evaluate(() => document.fonts.ready);
        // Fotografiar el ELEMENTO, no la página: los bloques más cortos que el
        // viewport dejaban una banda muerta debajo. Fallback a fullPage con aviso.
        const target = await page.$('[data-capture-target]');
        if (target) {
          await target.screenshot({ path: file as `${string}.png` });
        } else {
          console.warn(`  ! ${name}: sin [data-capture-target], capturando la página entera`);
          await page.screenshot({ path: file as `${string}.png`, fullPage: true });
        }
        console.log(`✓ ${name} ${theme}`);
        captured++;
      }
      await page.close();
      hechos.push(name);
    }
  } finally {
    await browser.close();
  }
} finally {
  await server.stop();
  // En el finally: si la tanda revienta a medias, lo capturado ya queda apuntado.
  if (hechos.length) apuntarCapturas(hechos, registry);
}

console.log(`\n${captured} capturas nuevas, ${skipped} bloques ya al día.`);
