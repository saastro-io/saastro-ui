/**
 * comprobar-previews-vivas.mts — el gate que faltaba.
 *
 * `check-previews.mjs` comprueba que EXISTAN los PNG. Eso no mira la preview:
 * el 6-sep-2026 /preview/dropdown-menu llevaba reventando en producción al
 * primer clic (Base UI #31, «MenuGroupContext is missing») con sus dos
 * capturas presentes y el gate en verde — la captura fotografía el menú
 * CERRADO, así que el fallo no sale ni en la miniatura.
 *
 * Esto abre cada preview, espera la hidratación real y PULSA los disparadores,
 * que es donde monta el contenido de los overlays. Falla si la página lanza o
 * si escribe un error en consola.
 *
 * Requiere `pnpm build` previo y el Chrome de puppeteer
 * (`pnpm exec puppeteer browsers install chrome`).
 *
 * Uso:  pnpm comprobar:previews [--only=<name>]
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
const PORT = 4914;
const APP = fileURLToPath(new URL('..', import.meta.url));

const registry = JSON.parse(
  await readFile(new URL('../../../packages/ui-registry/registry.json', import.meta.url), 'utf8'),
);
const names: string[] = registry.items
  .map((i: { name: string }) => i.name)
  .filter((n: string) => !only || n === only);

if (!existsSync(`${APP}dist`)) {
  console.error('✗ No hay dist/ — corre `pnpm build` antes de comprobar.');
  process.exit(1);
}

const server = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORT)], {
  cwd: APP,
  stdio: 'ignore',
});

async function esperarServidor(url: string, timeoutMs = 30_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* aún no */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`preview server no respondió en ${timeoutMs}ms: ${url}`);
}

/** Un 404 de favicon no es un componente roto; un error de React sí. */
const RUIDO = /favicon|Failed to load resource/i;

const rotas: { name: string; error: string }[] = [];

try {
  await esperarServidor(`http://localhost:${PORT}/preview/${names[0]}`);
  // El runner de GitHub (Ubuntu 24.04) restringe los user namespaces con
  // AppArmor y Chrome muere al arrancar con «No usable sandbox». Sólo se le
  // quita ahí: en local mantiene el sandbox, y aquí sólo carga localhost.
  const browser = await puppeteer.launch({
    args: process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : [],
  });
  try {
    for (const name of names) {
      const fallos: string[] = [];
      const page = await browser.newPage();
      await page.setViewport({ width: 720, height: 520 });
      page.on('pageerror', (e) => fallos.push(`lanzó: ${e.message}`));
      page.on('console', (m) => {
        if (m.type() === 'error' && !RUIDO.test(m.text())) fallos.push(`consola: ${m.text()}`);
      });

      await page.goto(`http://localhost:${PORT}/preview/${name}`, { waitUntil: 'networkidle2' });
      await page
        .waitForFunction(() => !document.querySelector('astro-island[ssr]'), { timeout: 15_000 })
        .catch(() => fallos.push('no hidrató en 15s'));

      // Los overlays no montan su contenido hasta que se abren: sin este clic
      // el gate volvería a mirar el menú cerrado, que es como se coló el fallo.
      const disparadores = await page.$$('button, [role="button"], [role="combobox"]');
      for (const d of disparadores.slice(0, 6)) {
        await d.click().catch(() => {});
        await new Promise((r) => setTimeout(r, 250));
        await page.keyboard.press('Escape').catch(() => {});
        await new Promise((r) => setTimeout(r, 100));
      }

      await page.close();
      if (fallos.length) {
        rotas.push({ name, error: fallos[0] });
        console.error(`✗ ${name} — ${fallos[0]}`);
      } else {
        console.log(`✓ ${name} (${disparadores.length} disparadores)`);
      }
    }
  } finally {
    await browser.close();
  }
} finally {
  server.kill();
}

if (rotas.length) {
  console.error(`\n✗ ${rotas.length} de ${names.length} previews rotas.`);
  process.exit(1);
}
console.log(`\n✓ ${names.length} previews vivas: ninguna lanza al interactuar.`);
