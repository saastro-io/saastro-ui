import type { ComponentProps } from 'react';
import type { Logos01 } from '@blocks/logos-01';

export const props = {
  title: 'Trusted by leading companies',
  logos: [
    { name: 'Acme Corp' },
    { name: 'Globex' },
    { name: 'Initech' },
    { name: 'Umbrella' },
    { name: 'Stark Inc' },
    { name: 'Wayne Co' },
  ],
} satisfies ComponentProps<typeof Logos01>;
