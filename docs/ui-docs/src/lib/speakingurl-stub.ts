// ESM stub for speakingurl — CJS `module.exports` breaks in Cloudflare Workers.
// Minimal slug implementation covering the same API surface used by limax.
export default function getSlug(input: string, opts?: Record<string, unknown>): string {
  const separator = (typeof opts === 'string' ? opts : opts?.separator ?? '-') as string;
  return input
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric
    .replace(/[\s_]+/g, separator)   // spaces/underscores → separator
    .replace(new RegExp(`[${separator}]+`, 'g'), separator) // collapse separators
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), ''); // trim separators
}
