export type BlockMeta = {
  name: string;
  title: string;
  description: string;
  category: string;
  section: 'blocks' | 'ui';
  dependencies: string[];
};

export const blocks: BlockMeta[] = [
  {
    name: 'hero-01',
    title: 'Hero — Centered',
    description: 'Centered hero with badge, heading, description, and dual CTA buttons.',
    category: 'Hero',
    section: 'blocks',
    dependencies: ['button', 'badge'],
  },
  {
    name: 'hero-02',
    title: 'Hero — Split with Image',
    description: 'Split hero with content on the left and image/screenshot on the right.',
    category: 'Hero',
    section: 'blocks',
    dependencies: ['button', 'badge'],
  },
  {
    name: 'hero-03',
    title: 'Hero — Gradient',
    description:
      'Hero section with gradient background, floating badge, and a single prominent CTA.',
    category: 'Hero',
    section: 'blocks',
    dependencies: ['button', 'badge'],
  },
  {
    name: 'features-01',
    title: 'Features — Icon Grid',
    description: '3-column feature grid with icons, titles, and descriptions in cards.',
    category: 'Features',
    section: 'blocks',
    dependencies: ['card'],
  },
  {
    name: 'features-02',
    title: 'Features — Alternating',
    description: 'Alternating image and text sections to showcase features.',
    category: 'Features',
    section: 'blocks',
    dependencies: ['badge'],
  },
  {
    name: 'pricing-01',
    title: 'Pricing — 3 Tiers',
    description: 'Three-tier pricing cards with monthly/annual toggle and feature lists.',
    category: 'Pricing',
    section: 'blocks',
    dependencies: ['button', 'card', 'badge', 'separator'],
  },
  {
    name: 'cta-01',
    title: 'CTA — Gradient Banner',
    description: 'Full-width CTA banner with gradient background, heading, and action buttons.',
    category: 'CTA',
    section: 'blocks',
    dependencies: ['button'],
  },
  {
    name: 'faq-01',
    title: 'FAQ — Accordion',
    description: 'FAQ section with accordion for expandable questions and answers.',
    category: 'FAQ',
    section: 'blocks',
    dependencies: ['accordion'],
  },
  {
    name: 'testimonials-01',
    title: 'Testimonials — Card Grid',
    description: 'Testimonial grid with avatar, name, role, and quote cards.',
    category: 'Testimonials',
    section: 'blocks',
    dependencies: ['card', 'avatar'],
  },
  {
    name: 'footer-01',
    title: 'Footer — Multi-Column',
    description: 'Multi-column footer with navigation links, social icons, and copyright.',
    category: 'Navigation',
    section: 'blocks',
    dependencies: ['separator'],
  },
  {
    name: 'navbar-01',
    title: 'Navbar — Responsive',
    description: 'Responsive navbar with desktop navigation and mobile hamburger menu.',
    category: 'Navigation',
    section: 'blocks',
    dependencies: ['button', 'sheet'],
  },
  {
    name: 'blog-grid-01',
    title: 'Blog — Post Grid',
    description: 'Responsive grid of blog post cards with image, title, excerpt, and metadata.',
    category: 'Content',
    section: 'blocks',
    dependencies: ['card', 'badge'],
  },
  {
    name: 'newsletter-01',
    title: 'Newsletter — Signup',
    description: 'Email newsletter signup section with input and submit button.',
    category: 'CTA',
    section: 'blocks',
    dependencies: ['button', 'input'],
  },
  {
    name: 'stats-01',
    title: 'Stats — Counter Row',
    description: 'Row of key statistics with large numbers and labels.',
    category: 'Social Proof',
    section: 'blocks',
    dependencies: [],
  },
  {
    name: 'logos-01',
    title: 'Logos — Trusted By',
    description: '"Trusted by" logo cloud section with grayscale hover effect.',
    category: 'Social Proof',
    section: 'blocks',
    dependencies: [],
  },
  {
    name: 'button-pro',
    title: 'Button Pro',
    description:
      'Enhanced button with CVA variants, icon effects, shine, gooey, underline, and gradient animations.',
    category: 'Buttons',
    section: 'ui',
    dependencies: ['@base-ui/react', 'class-variance-authority'],
  },
];

export const categories = [...new Set(blocks.map((b) => b.category))];

export const blockItems = blocks.filter((b) => b.section === 'blocks');
export const uiItems = blocks.filter((b) => b.section === 'ui');

export const blockCategories = [...new Set(blockItems.map((b) => b.category))];
export const uiCategories = [...new Set(uiItems.map((b) => b.category))];
