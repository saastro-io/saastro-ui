import type { ComponentProps } from 'react';
import type { Hero03 } from '@blocks/hero-03';

export const props = {
  badge: 'Open Source',
  title: 'The block registry for modern websites',
  description:
    'Production-ready landing page sections. Fully customizable. Designed for Astro and Next.js.',
  cta: { label: 'Start Building', href: '#' },
} satisfies ComponentProps<typeof Hero03>;
