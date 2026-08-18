/**
 * Trivial slugify / permalink helpers used by the docs-theme internal layout.
 *
 * Self-contained replacement for `makePermalinks` from `@saastro-io/shell`.
 * No dependency on `limax` or astro:content settings — kept minimal because
 * documentation sites generally have flat, predictable URL structures.
 */

/** Remove leading and trailing slashes. */
export function trimSlash(s: string): string {
  return (s ?? '').replace(/^\/+|\/+$/g, '')
}

/**
 * Slugify a single string segment.
 * Lowercase, strip diacritics, replace non-alphanumerics with hyphens.
 */
export function slugifySegment(text: string): string {
  return (text ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Slugify a path, preserving `/` separators. */
export function cleanSlug(text = ''): string {
  return trimSlash(text).split('/').map(slugifySegment).filter(Boolean).join('/')
}

/** Build a permalink-friendly path. */
export function makePermalink(slug = ''): string {
  const cleaned = cleanSlug(slug)
  return cleaned ? `/${cleaned}` : '/'
}

/**
 * Factory compatible con `makePermalinks(Astro)` de `@saastro-io/shell`, que
 * es como la usan los layouts (`const { getPermalink } = await makePermalinks(Astro)`).
 *
 * La del shell resolvía el `base` y el `trailingSlash` leyendo `settings.yaml`.
 * Aquí se toma de la propia config de Astro: `import.meta.env.BASE_URL` (que
 * Astro rellena con `base`) y el `trailingSlash` del sitio, que en ui.saastro.io
 * es "never". `async` para mantener la firma, aunque ya no haya nada que await.
 */
export async function makePermalinks(_astro?: unknown): Promise<{
  getPermalink: (slug?: string) => string;
  getHomePermalink: () => string;
}> {
  const base = trimSlash(import.meta.env.BASE_URL ?? '');
  const withBase = (path: string) => (base ? `/${base}${path === '/' ? '' : path}` : path);

  return {
    getPermalink: (slug = '') => withBase(makePermalink(slug)),
    getHomePermalink: () => withBase('/'),
  };
}
