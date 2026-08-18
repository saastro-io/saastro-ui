// Demo props de hero-01 — datos serializables, los consume /preview/[name].
import type { ComponentProps } from 'react';
import type { Hero01 } from '@blocks/hero-01';

export const props = {
  badge: 'Just launched',
  title: 'Build your landing page in minutes',
  description:
    'Beautiful, responsive blocks for Astro. Install via shadcn CLI. Zero config required.',
  primaryCta: { label: 'Get Started', href: '#' },
  secondaryCta: { label: 'View Docs', href: '#' },
} satisfies ComponentProps<typeof Hero01>;
