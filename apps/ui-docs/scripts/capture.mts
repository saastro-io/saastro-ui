/**
 * capture.mts — screenshots light+dark de cada bloque contra /preview/<name>.
 *
 * Requiere `pnpm build` previo (levanta `astro preview` sobre dist/) y el
 * Chrome de puppeteer (una vez: `pnpm exec puppeteer browsers install chrome`
 * — pnpm 10 bloquea el postinstall que lo bajaría solo).
 *
 * Uso:  pnpm capture [--force] [--only=<name>]
 *   - skip-existing por defecto: solo captura lo que falta.
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
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

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

const server = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORT)], {
  cwd: APP,
  stdio: 'ignore',
  detached: false,
});

async function waitForServer(url: string, timeoutMs = 30_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* aún no */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`preview server no respondió en ${timeoutMs}ms: ${url}`);
}

mkdirSync(OUT, { recursive: true });
let captured = 0;
let skipped = 0;

try {
  await waitForServer(`http://localhost:${PORT}/preview/${names[0]}`);
  const browser = await puppeteer.launch();
  try {
    for (const name of names) {
      const light = `${OUT}${name}-light.png`;
      const dark = `${OUT}${name}-dark.png`;
      if (!FORCE && existsSync(light) && existsSync(dark)) {
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
        if (!FORCE && existsSync(file)) continue;
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
    }
  } finally {
    await browser.close();
  }
} finally {
  server.kill();
}

console.log(`\n${captured} capturas nuevas, ${skipped} bloques ya al día.`);
