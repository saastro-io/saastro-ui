import type { ComponentProps } from 'react';
import type { Newsletter01 } from '@blocks/newsletter-01';

export const props = {
  title: 'Stay up to date',
  description: 'Get notified when we release new blocks and features.',
  placeholder: 'Enter your email',
  buttonText: 'Subscribe',
} satisfies ComponentProps<typeof Newsletter01>;
