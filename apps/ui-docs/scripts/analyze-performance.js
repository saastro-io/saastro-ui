#!/usr/bin/env node
/**
 * Performance Analysis Script
 *
 * Analiza el rendimiento de tu sitio usando Lighthouse CLI
 *
 * Uso:
 *   npm run analyze:performance <url>
 *   npm run analyze:performance https://tusitio.com
 */

import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = process.argv[2] || 'https://tusitio.com';

console.log(`🚀 Analizando performance de: ${url}\n`);

try {
  // Verificar si lighthouse está instalado
  try {
    execSync('lighthouse --version', { stdio: 'ignore' });
  } catch {
    console.log('📦 Instalando Lighthouse CLI...\n');
    execSync('npm install -g lighthouse', { stdio: 'inherit' });
  }

  const outputDir = join(__dirname, '../reports');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = join(outputDir, `lighthouse-${timestamp}.html`);

  console.log('⏳ Ejecutando análisis (esto puede tardar 1-2 minutos)...\n');

  execSync(
    `lighthouse ${url} ` +
      `--output=html ` +
      `--output-path=${outputPath} ` +
      `--chrome-flags="--headless" ` +
      `--only-categories=performance,accessibility,best-practices,seo ` +
      `--view`,
    { stdio: 'inherit' },
  );

  console.log(`\n✅ Análisis completado!`);
  console.log(`📊 Reporte guardado en: ${outputPath}`);
} catch (error) {
  console.error('❌ Error al analizar:', error.message);
  console.log('\n💡 Alternativas:');
  console.log('   1. Usa PageSpeed Insights: https://pagespeed.web.dev/');
  console.log('   2. Usa WebPageTest: https://www.webpagetest.org/');
  console.log('   3. Abre Chrome DevTools → Lighthouse');
  process.exit(1);
}
