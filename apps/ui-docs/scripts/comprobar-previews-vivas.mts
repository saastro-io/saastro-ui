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
 * Requiere `pnpm build` previo (sirve dist/ con el `preview()` de astro, en
 * proceso) y el chrome-headless-shell de puppeteer
 * (`pnpm exec puppeteer browsers install chrome-headless-shell`).
 *
 * Uso:  pnpm comprobar:previews [--only=<name>]
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { preview } from 'astro';
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

// El servidor va EN PROCESO, como en capture.mts (#39). Con
// `spawn('pnpm', ['exec', 'astro', 'preview'])` astro 7 detecta que lo corre un
// agente (am-i-vibing) y se relanza en background: PPID 1, su propio grupo, y
// server.kill() mataba pnpm y dejaba vivo el servidor en :4914. En proceso,
// preview() resuelve cuando ya escucha y server.stop() lo cierra de verdad.
const server = await preview({ root: APP, server: { port: PORT }, logLevel: 'error' });

/** Un 404 de favicon no es un componente roto; un error de React sí. */
const RUIDO = /favicon|Failed to load resource/i;

const rotas: { name: string; error: string }[] = [];

try {
  // El runner de GitHub (Ubuntu 24.04) restringe los user namespaces con
  // AppArmor y Chrome muere al arrancar con «No usable sandbox». Sólo se le
  // quita ahí: en local mantiene el sandbox, y aquí sólo carga localhost.
  // headless:'shell' (chrome-headless-shell), como capture.mts: con el headless
  // por defecto, en una sesión sin pantalla (claude --bg) el click() de faq-01
  // se quedaba colgado para siempre.
  const browser = await puppeteer.launch({
    headless: 'shell',
    args: process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : [],
  });
  try {
    for (const name of names) {
      const fallos: string[] = [];
      const page = await browser.newPage();
      await page.setViewport({ width: 720, height: 520 });
      page.on('pageerror', (e) =>
        fallos.push(`lanzó: ${e instanceof Error ? e.message : String(e)}`),
      );
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
  await server.stop();
}

if (rotas.length) {
  console.error(`\n✗ ${rotas.length} de ${names.length} previews rotas.`);
  process.exit(1);
}
console.log(`\n✓ ${names.length} previews vivas: ninguna lanza al interactuar.`);
