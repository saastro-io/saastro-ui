import type { ComponentProps } from 'react';
import type { Hero02 } from '@blocks/hero-02';

export const props = {
  badge: 'New release',
  title: 'Ship faster with pre-built blocks',
  description:
    'A collection of landing page blocks built with shadcn/ui. Copy and paste into your Astro project.',
  primaryCta: { label: 'Browse Blocks', href: '#' },
  secondaryCta: { label: 'Documentation', href: '#' },
} satisfies ComponentProps<typeof Hero02>;
