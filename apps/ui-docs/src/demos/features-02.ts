// Demo props de features-02 — objeto plano: el bloque es .astro (las Props viven en su frontmatter).
export const props = {
  title: 'Built for developers',
  description: 'Blocks designed to accelerate your workflow.',
  features: [
    {
      badge: 'Performance',
      title: 'Zero JS by default',
      description:
        'In Astro, React components render as pure HTML on the server. No JavaScript shipped unless you add client directives.',
    },
    {
      badge: 'Customizable',
      title: 'Make it yours',
      description:
        'Every block uses standard Tailwind CSS classes and shadcn/ui components. Customize colors, spacing, and typography with CSS variables.',
    },
  ],
};
