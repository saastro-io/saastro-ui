import type { ComponentProps } from 'react';
import type { Pricing01 } from '@blocks/pricing-01';

export const props = {
  title: 'Simple, transparent pricing',
  description: 'Choose the plan that fits your needs.',
  plans: [
    {
      name: 'Starter',
      description: 'For personal projects',
      monthlyPrice: 0,
      annualPrice: 0,
      features: ['5 blocks', 'Community support', 'MIT license'],
      cta: { label: 'Get Started', href: '#' },
    },
    {
      name: 'Pro',
      description: 'For professional sites',
      monthlyPrice: 19,
      annualPrice: 15,
      features: ['All blocks', 'Priority support', 'Premium templates', 'Early access'],
      popular: true,
      cta: { label: 'Start Free Trial', href: '#' },
    },
    {
      name: 'Team',
      description: 'For agencies and teams',
      monthlyPrice: 49,
      annualPrice: 39,
      features: ['Everything in Pro', 'Team licenses', 'Custom blocks', 'White-label'],
      cta: { label: 'Contact Sales', href: '#' },
    },
  ],
} satisfies ComponentProps<typeof Pricing01>;
