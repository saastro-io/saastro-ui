import type { ComponentProps } from 'react';
import type { Stats01 } from '@blocks/stats-01';

export const props = {
  title: 'Trusted by developers worldwide',
  stats: [
    { value: '15+', label: 'Blocks available' },
    { value: '10k', label: 'Downloads', suffix: '+' },
    { value: '99', label: 'Lighthouse score', suffix: '%' },
    { value: '0', label: 'JS shipped', suffix: 'kb' },
  ],
} satisfies ComponentProps<typeof Stats01>;
