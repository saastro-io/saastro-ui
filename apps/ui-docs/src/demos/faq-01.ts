import type { ComponentProps } from 'react';
import type { Faq01 } from '@blocks/faq-01';

export const props = {
  title: 'Frequently Asked Questions',
  description: 'Everything you need to know about the blocks.',
  items: [
    {
      question: 'How do I install a block?',
      answer:
        'Use the shadcn CLI: npx shadcn@latest add @saastro/hero-01. The CLI will add the component to your project along with any required dependencies.',
    },
    {
      question: 'Do blocks work with Next.js?',
      answer:
        'Yes! Blocks are standard React components that work with any React framework including Next.js, Remix, and Astro.',
    },
    {
      question: 'Can I customize the blocks?',
      answer:
        'Absolutely. Blocks use Tailwind CSS and shadcn/ui components. Customize colors, fonts, and spacing using CSS variables or edit the source directly.',
    },
    {
      question: 'Are blocks accessible?',
      answer:
        'Yes. Blocks are built on top of Base UI primitives which follow WAI-ARIA patterns for full keyboard and screen reader support.',
    },
  ],
} satisfies ComponentProps<typeof Faq01>;
