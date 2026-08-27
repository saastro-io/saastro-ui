#!/usr/bin/env node
/**
 * Enlaza en `knowledge/` de la raíz el knowledge que vive dentro de cada
 * workspace, para que la office lo encuentre.
 *
 * EL PORQUÉ. `office watch` lee las narrativas de UNA carpeta plana
 * (`<knowledgePath>/<seccion>.md`), pero desde el esquema v2 escribe los
 * snapshots DENTRO del workspace que describen —y la office hace lo mismo—.
 * Sin esto conviven las dos
 * disposiciones y el índice se queda apuntando a la vieja: el 19-ago el Hub
 * servía como «hub-react» un listado de directorios de junio mientras el
 * snapshot bueno —1,4 MB, del día anterior— estaba en `apps/hub-react/`
 * sin que nadie lo leyera.
 *
 * Un symlink por sección resuelve las dos cosas a la vez: el fichero vive
 * junto al código que describe (y se va con él si el workspace desaparece) y
 * la office lo encuentra donde espera. Cero copias.
 *
 *   node scripts/office-link.mjs          # regenera los enlaces
 *   node scripts/office-link.mjs --check  # falla si están desincronizados
 */

import { existsSync, lstatSync, mkdirSync, readdirSync, readlinkSync, symlinkSync, unlinkSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const KNOWLEDGE = join(RAIZ, 'knowledge')
/** Ficheros de la raíz que son NUESTROS: hechos del repo, no de un workspace. */
const PROPIOS = new Set(['README.md'])
/** Dónde buscar workspaces con knowledge propio. */
const CONTENEDORES = ['apps', 'packages', 'docs']

const comprobar = process.argv.includes('--check')

function esEnlace(p) {
  try {
    return lstatSync(p).isSymbolicLink()
  } catch {
    return false
  }
}

// 1. Recolectar el knowledge de cada workspace.
const esperados = new Map() // nombre de fichero → destino relativo desde knowledge/
for (const contenedor of CONTENEDORES) {
  const base = join(RAIZ, contenedor)
  if (!existsSync(base)) continue
  for (const ws of readdirSync(base)) {
    const dir = join(base, ws, 'knowledge')
    if (!existsSync(dir)) continue
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.md')) continue
      esperados.set(f, relative(KNOWLEDGE, join(dir, f)))
    }
  }
}

// 2. Comparar con lo que hay en la raíz.
if (!existsSync(KNOWLEDGE)) mkdirSync(KNOWLEDGE)
const actuales = readdirSync(KNOWLEDGE).filter((f) => !PROPIOS.has(f))

const sobran = actuales.filter((f) => esEnlace(join(KNOWLEDGE, f)) && !esperados.has(f))
const faltan = [...esperados].filter(([f, destino]) => {
  const p = join(KNOWLEDGE, f)
  return !esEnlace(p) || readlinkSync(p) !== destino
})
/** Ficheros REALES en la raíz que deberían vivir en un workspace. */
const intrusos = actuales.filter((f) => !esEnlace(join(KNOWLEDGE, f)) && esperados.has(f))

if (comprobar) {
  const problemas = [
    sobran.length && `enlaces huérfanos: ${sobran.join(', ')}`,
    faltan.length && `faltan o apuntan mal: ${faltan.map(([f]) => f).join(', ')}`,
    intrusos.length && `copias en la raíz que tapan al workspace: ${intrusos.join(', ')}`,
  ].filter(Boolean)
  if (problemas.length) {
    console.error(`knowledge/ desincronizado —\n  ${problemas.join('\n  ')}\nArregla con: node scripts/office-link.mjs`)
    process.exit(1)
  }
  console.log(`knowledge/ al día (${esperados.size} secciones enlazadas)`)
  process.exit(0)
}

for (const f of sobran) {
  unlinkSync(join(KNOWLEDGE, f))
  console.log(`  - ${f} (enlace huérfano)`)
}
for (const f of intrusos) {
  // Una copia real en la raíz GANA sobre el symlink y deja el workspace mudo:
  // es exactamente el bug que esto viene a matar.
  unlinkSync(join(KNOWLEDGE, f))
  console.log(`  - ${f} (copia en la raíz que tapaba al workspace)`)
}
for (const [f, destino] of faltan) {
  const p = join(KNOWLEDGE, f)
  if (esEnlace(p) || existsSync(p)) unlinkSync(p)
  symlinkSync(destino, p)
  console.log(`  + ${f} → ${destino}`)
}
console.log(`knowledge/: ${esperados.size} secciones enlazadas desde ${CONTENEDORES.join('/')}`)
