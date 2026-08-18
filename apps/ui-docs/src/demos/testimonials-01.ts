// Demo props de testimonials-01 — objeto plano: el bloque es .astro (las Props viven en su frontmatter).
export const props = {
  title: 'What people are saying',
  description: 'Hear from developers who use our blocks.',
  testimonials: [
    {
      quote:
        'These blocks saved me hours of work. The quality is outstanding and they integrate seamlessly with my Astro site.',
      author: 'Sarah Chen',
      role: 'Frontend Developer',
      company: 'Vercel',
    },
    {
      quote:
        'Finally a block library that gets the developer experience right. Install, customize, ship.',
      author: 'Marco Rivera',
      role: 'CTO',
      company: 'StartupCo',
    },
    {
      quote:
        'The attention to detail in these components is impressive. Responsive, accessible, and beautifully designed.',
      author: 'Emily Park',
      role: 'Designer',
      company: 'Studio',
    },
  ],
};
