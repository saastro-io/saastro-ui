import type { ComponentProps } from 'react';
import type { Cta01 } from '@blocks/cta-01';

export const props = {
  title: 'Ready to get started?',
  description: 'Start building beautiful landing pages today. No credit card required.',
  primaryCta: { label: 'Start Free', href: '#' },
  secondaryCta: { label: 'Talk to Sales', href: '#' },
} satisfies ComponentProps<typeof Cta01>;
