import type { ComponentProps } from 'react';
import type { BlogGrid01 } from '@blocks/blog-grid-01';

export const props = {
  title: 'Latest from the blog',
  description: 'Read our latest articles and tutorials.',
  posts: [
    {
      title: 'Getting Started with Astro Blocks',
      excerpt: 'Learn how to install and use blocks in your Astro project with the shadcn CLI.',
      date: 'Mar 10, 2026',
      category: 'Tutorial',
      href: '#',
    },
    {
      title: 'Building a SaaS Landing Page',
      excerpt: 'A step-by-step guide to creating a complete landing page using pre-built blocks.',
      date: 'Mar 8, 2026',
      category: 'Guide',
      href: '#',
    },
    {
      title: 'Customizing Block Themes',
      excerpt: 'How to match blocks to your brand using CSS variables and Tailwind configuration.',
      date: 'Mar 5, 2026',
      category: 'Design',
      href: '#',
    },
  ],
} satisfies ComponentProps<typeof BlogGrid01>;
