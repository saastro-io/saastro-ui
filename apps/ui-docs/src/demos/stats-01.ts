// Demo props de stats-01 — objeto plano: el bloque es .astro (las Props viven en su frontmatter).
export const props = {
  title: 'Trusted by developers worldwide',
  stats: [
    { value: '15+', label: 'Blocks available' },
    { value: '10k', label: 'Downloads', suffix: '+' },
    { value: '99', label: 'Lighthouse score', suffix: '%' },
    { value: '0', label: 'JS shipped', suffix: 'kb' },
  ],
};
