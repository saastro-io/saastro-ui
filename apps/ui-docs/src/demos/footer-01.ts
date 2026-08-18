import type { ComponentProps } from 'react';
import type { Footer01 } from '@blocks/footer-01';

// `logo` acepta ReactNode; un string ES un ReactNode válido y además es
// serializable — no hace falta JSX para la demo.
export const props = {
  logo: 'Acme',
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Docs', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
      ],
    },
  ],
} satisfies ComponentProps<typeof Footer01>;
