import type { ComponentProps } from 'react';
import type { Navbar01 } from '@blocks/navbar-01';

export const props = {
  logo: 'Acme',
  links: [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'Docs', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  cta: { label: 'Get Started', href: '#' },
} satisfies ComponentProps<typeof Navbar01>;
