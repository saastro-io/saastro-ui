#!/usr/bin/env node
/**
 * Enlaza en `knowledge/` de la raíz el conocimiento que vive dentro de cada
 * workspace, para que la office lo encuentre.
 *
 * EL PORQUÉ. `office watch` lee de UNA carpeta plana
 * (`<knowledgePath>/<seccion>.md`), pero el conocimiento debe estar donde está
 * el código: quien trabaja en un workspace lo tiene al lado y se va con él si
 * el workspace muere. Un symlink por sección resuelve las dos cosas sin copias.
 * Sin esto convivían las dos disposiciones y el índice apuntaba a la vieja: el
 * 19-ago el Hub servía como «hub-react» un listado de directorios de junio
 * mientras el snapshot bueno —1,4 MB, del día anterior— estaba en
 * `apps/hub-react/` sin que nadie lo leyera.
 *
 * LO QUE SE ESPERA SALE DE `.saastro-office`, NO DEL DISCO. Es la diferencia
 * entre un gate que protege y uno que decora. Los `*.snap.md` los genera
 * `office watch` y están gitignorados, así que en un clon limpio —CI— no
 * existen: derivar de ellos hacía que `--check` no viera ninguna sección y
 * saliera verde sin comprobar nada. Las secciones declaradas sí viajan en git,
 * y con ellas el check dice lo mismo en tu máquina y en CI. De paso caza el
 * fallo que teníamos: una sección declarada cuyo workspace no tiene
 * `knowledge/` propio (era `docs/hub-docs`, cuyo snap de 29 KB acabó como
 * fichero real en la raíz, tapando el enlace y congelando el workspace).
 *
 *   node scripts/office-link.mjs          # regenera los enlaces
 *   node scripts/office-link.mjs --check  # falla si están desincronizados
 */

import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, readlinkSync, symlinkSync, unlinkSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const MARCADOR = join(RAIZ, '.saastro-office')
/** Ficheros de la raíz que son NUESTROS: hechos del repo, no de un workspace. */
const PROPIOS = new Set(['README.md', 'gotchas.md'])

const comprobar = process.argv.includes('--check')

const marcador = JSON.parse(readFileSync(MARCADOR, 'utf8'))
const SECCIONES = marcador.watch?.sections ?? {}
const KNOWLEDGE = join(RAIZ, marcador.watch?.knowledge ?? './knowledge')

function esEnlace(p) {
  try {
    return lstatSync(p).isSymbolicLink()
  } catch {
    return false
  }
}

// 1. Lo que DEBE haber: un enlace por sección declarada, apunte o no a un
//    fichero que ya exista (el snap lo escribe `office watch` después).
const esperados = new Map() // nombre de fichero → destino relativo desde knowledge/
/**
 * Secciones cuyo workspace todavía no tiene `knowledge/`. Es un AVISO, no un
 * fallo, y la diferencia importa: una carpeta que solo contiene el snap está
 * gitignorada entera, así que en un clon limpio —CI— no existe aunque aquí sí.
 * Hacerlo fallar daba resultados distintos en local y en CI, que es como se
 * acaba ignorando un gate. El enlace sí se exige siempre; la carpeta la crea
 * `office watch` al escribir el primer snapshot.
 */
const sinCarpeta = []

/**
 * El `knowledge/` de una sección vive en su WORKSPACE, no necesariamente en
 * la carpeta que la sección declara. En hub coinciden —cada sección es un
 * workspace— pero en `saastro-ui` hay secciones que son subcarpetas
 * (`packages/ui-registry/registry` → «bloques»), y su ficha vive en el
 * `knowledge/` del paquete que las contiene. Derivar sin esto rompió la
 * vista de ui el 28-ago: los enlaces apuntaban a carpetas que no existen.
 */
const CONTENEDORES = ['apps', 'packages', 'docs']
function workspaceDe(ruta) {
  const partes = ruta.split('/')
  if (CONTENEDORES.includes(partes[0]) && partes.length > 2) {
    return partes.slice(0, 2).join('/')   // apps/x/lo/que/sea → apps/x
  }
  return ruta
}

for (const [ruta, seccion] of Object.entries(SECCIONES)) {
  const dir = join(RAIZ, workspaceDe(ruta), 'knowledge')
  esperados.set(`${seccion}.snap.md`, relative(KNOWLEDGE, join(dir, `${seccion}.snap.md`)))
  if (!existsSync(dir)) {
    sinCarpeta.push(`${workspaceDe(ruta)} (sección «${seccion}»)`)
    continue
  }
  // La narrativa, si la hay. Se enlaza SOLO `<sección>.md`, que es lo que
  // `office watch` sabe leer: cualquier otro `.md` del workspace es material de
  // consulta local (lo lee quien abre esa carpeta) y enlazarlo aquí solo
  // ensuciaría la vista con ficheros que la office no ingiere igualmente.
  if (existsSync(join(dir, `${seccion}.md`))) {
    esperados.set(`${seccion}.md`, relative(KNOWLEDGE, join(dir, `${seccion}.md`)))
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
    sobran.length && `enlaces huérfanos (sección no declarada en .saastro-office): ${sobran.join(', ')}`,
    faltan.length && `faltan o apuntan mal: ${faltan.map(([f]) => f).join(', ')}`,
    intrusos.length && `copias en la raíz que tapan al workspace: ${intrusos.join(', ')}`,
  ].filter(Boolean)
  for (const s of sinCarpeta) console.warn(`  aviso: ${s} — sin knowledge/ propio todavía`)
  if (problemas.length) {
    console.error(`knowledge/ desincronizado —\n  ${problemas.join('\n  ')}\nArregla con: node scripts/office-link.mjs`)
    process.exit(1)
  }
  console.log(`knowledge/ al día (${Object.keys(SECCIONES).length} secciones declaradas, ${esperados.size} enlaces)`)
  process.exit(0)
}

for (const ruta of sinCarpeta) console.log(`  ! ${ruta}: sin knowledge/ propio — créalo o quita la sección`)
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
console.log(`knowledge/: ${esperados.size} enlaces desde ${Object.keys(SECCIONES).length} secciones declaradas`)
