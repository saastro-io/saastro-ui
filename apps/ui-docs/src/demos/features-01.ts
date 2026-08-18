// Demo props de features-01 — objeto plano: los iconos son claves del set
// interno del bloque .astro ('zap' | 'shield' | 'code' | …), serializables.
export const props = {
  title: 'Everything you need',
  description: 'All the tools to build great landing pages, out of the box.',
  features: [
    {
      icon: 'zap',
      title: 'Lightning Fast',
      description:
        'Built for performance. Server-rendered by default with zero JavaScript shipped.',
    },
    {
      icon: 'shield',
      title: 'Type-Safe',
      description: 'Full TypeScript support with proper prop types for every block component.',
    },
    {
      icon: 'code',
      title: 'Copy & Paste',
      description:
        'Install with the shadcn CLI or copy the source code directly into your project.',
    },
  ],
};
