/**
 * Catálogo del showcase — DERIVADO de packages/ui-registry/registry.json,
 * que es la ÚNICA fuente de verdad del registry (títulos, descripciones,
 * grupos, deps y orden). Antes esto era src/data/blocks.ts, una copia a mano
 * de 16 entradas que ya había derivado dos veces (deps de navbar-01, bug
 * "15 vs 16"). Ahora el drift es imposible: se importa el JSON directamente.
 *
 * El ORDEN de registry.json#items es semántico: define prev/next en
 * /blocks/[name] y el orden de la galería y del sidebar de docs.
 *
 * Exporta los mismos nombres que exportaba blocks.ts para que el swap de
 * consumidores sea drop-in.
 */
import registry from '../../../../packages/ui-registry/registry.json';

export type CatalogItem = {
  name: string;
  title: string;
  description: string;
  /** Grupo display (Title Case, curado): viene de meta.group del item. */
  category: string;
  section: 'blocks' | 'ui';
  /** registryDependencies (primitivas shadcn) + dependencies (npm), juntos. */
  dependencies: string[];
  /** files[0].path — para leer el fuente y elegir lang del resaltado. */
  file: string;
  ext: 'astro' | 'tsx';
  /** Altura del iframe de preview en /blocks/[name] (meta.iframeHeight). */
  iframeHeight: string;
};

type RawItem = (typeof registry)['items'][number] & {
  dependencies?: string[];
  meta?: { group?: string; iframeHeight?: string };
};

export const blocks: CatalogItem[] = (registry.items as RawItem[]).map((item) => ({
  name: item.name,
  title: item.title,
  description: item.description,
  category: item.meta?.group ?? 'Other',
  section: item.type === 'registry:ui' ? 'ui' : 'blocks',
  dependencies: [...(item.registryDependencies ?? []), ...(item.dependencies ?? [])],
  file: item.files[0].path,
  ext: item.files[0].path.endsWith('.astro') ? 'astro' : 'tsx',
  iframeHeight: item.meta?.iframeHeight ?? '930px',
}));

export const categories = [...new Set(blocks.map((b) => b.category))];

export const blockItems = blocks.filter((b) => b.section === 'blocks');
export const uiItems = blocks.filter((b) => b.section === 'ui');

export const blockCategories = [...new Set(blockItems.map((b) => b.category))];
export const uiCategories = [...new Set(uiItems.map((b) => b.category))];
