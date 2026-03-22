'use client';

import { BlogGrid01 } from '@blocks/blog-grid-01';
import { Cta01 } from '@blocks/cta-01';
import { Faq01 } from '@blocks/faq-01';
import { Features01 } from '@blocks/features-01';
import { Features02 } from '@blocks/features-02';
import { Footer01 } from '@blocks/footer-01';
import { Hero01 } from '@blocks/hero-01';
import { Hero02 } from '@blocks/hero-02';
import { Hero03 } from '@blocks/hero-03';
import { Logos01 } from '@blocks/logos-01';
import { Navbar01 } from '@blocks/navbar-01';
import { Newsletter01 } from '@blocks/newsletter-01';
import { Pricing01 } from '@blocks/pricing-01';
import { Stats01 } from '@blocks/stats-01';
import { Testimonials01 } from '@blocks/testimonials-01';

function ZapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

const previews: Record<string, () => React.ReactElement> = {
  'hero-01': () => (
    <Hero01
      badge="Just launched"
      title="Build your landing page in minutes"
      description="Beautiful, responsive blocks for Astro. Install via shadcn CLI. Zero config required."
      primaryCta={{ label: 'Get Started', href: '#' }}
      secondaryCta={{ label: 'View Docs', href: '#' }}
    />
  ),
  'hero-02': () => (
    <Hero02
      badge="New release"
      title="Ship faster with pre-built blocks"
      description="A collection of landing page blocks built with shadcn/ui. Copy and paste into your Astro project."
      primaryCta={{ label: 'Browse Blocks', href: '#' }}
      secondaryCta={{ label: 'Documentation', href: '#' }}
    />
  ),
  'hero-03': () => (
    <Hero03
      badge="Open Source"
      title="The block registry for modern websites"
      description="Production-ready landing page sections. Fully customizable. Designed for Astro and Next.js."
      cta={{ label: 'Start Building', href: '#' }}
    />
  ),
  'features-01': () => (
    <Features01
      title="Everything you need"
      description="All the tools to build great landing pages, out of the box."
      features={[
        {
          icon: <ZapIcon />,
          title: 'Lightning Fast',
          description:
            'Built for performance. Server-rendered by default with zero JavaScript shipped.',
        },
        {
          icon: <ShieldIcon />,
          title: 'Type-Safe',
          description: 'Full TypeScript support with proper prop types for every block component.',
        },
        {
          icon: <CodeIcon />,
          title: 'Copy & Paste',
          description:
            'Install with the shadcn CLI or copy the source code directly into your project.',
        },
      ]}
    />
  ),
  'features-02': () => (
    <Features02
      title="Built for developers"
      description="Blocks designed to accelerate your workflow."
      features={[
        {
          badge: 'Performance',
          title: 'Zero JS by default',
          description:
            'In Astro, React components render as pure HTML on the server. No JavaScript shipped unless you add client directives.',
        },
        {
          badge: 'Customizable',
          title: 'Make it yours',
          description:
            'Every block uses standard Tailwind CSS classes and shadcn/ui components. Customize colors, spacing, and typography with CSS variables.',
        },
      ]}
    />
  ),
  'pricing-01': () => (
    <Pricing01
      title="Simple, transparent pricing"
      description="Choose the plan that fits your needs."
      plans={[
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
      ]}
    />
  ),
  'cta-01': () => (
    <Cta01
      title="Ready to get started?"
      description="Start building beautiful landing pages today. No credit card required."
      primaryCta={{ label: 'Start Free', href: '#' }}
      secondaryCta={{ label: 'Talk to Sales', href: '#' }}
    />
  ),
  'faq-01': () => (
    <Faq01
      title="Frequently Asked Questions"
      description="Everything you need to know about the blocks."
      items={[
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
            'Yes. Blocks are built on top of Radix UI primitives which follow WAI-ARIA patterns for full keyboard and screen reader support.',
        },
      ]}
    />
  ),
  'testimonials-01': () => (
    <Testimonials01
      title="What people are saying"
      description="Hear from developers who use our blocks."
      testimonials={[
        {
          quote:
            'These blocks saved me hours of work. The quality is outstanding and they integrate seamlessly with my Astro site.',
          author: 'Sarah Chen',
          role: 'Frontend Developer',
          company: 'Vercel',
        },
        {
          quote:
            'Finally a block library that gets the developer experience right. Install, customize, ship.',
          author: 'Marco Rivera',
          role: 'CTO',
          company: 'StartupCo',
        },
        {
          quote:
            'The attention to detail in these components is impressive. Responsive, accessible, and beautifully designed.',
          author: 'Emily Park',
          role: 'Designer',
          company: 'Studio',
        },
      ]}
    />
  ),
  'footer-01': () => (
    <Footer01
      logo={<span className="text-xl font-bold">Acme</span>}
      columns={[
        {
          title: 'Product',
          links: [
            { label: 'Features', href: '#' },
            { label: 'Pricing', href: '#' },
            { label: 'Docs', href: '#' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Careers', href: '#' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { label: 'Privacy', href: '#' },
            { label: 'Terms', href: '#' },
          ],
        },
      ]}
    />
  ),
  'navbar-01': () => (
    <Navbar01
      logo={<span>Acme</span>}
      links={[
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Docs', href: '#' },
        { label: 'Blog', href: '#' },
      ]}
      cta={{ label: 'Get Started', href: '#' }}
    />
  ),
  'blog-grid-01': () => (
    <BlogGrid01
      title="Latest from the blog"
      description="Read our latest articles and tutorials."
      posts={[
        {
          title: 'Getting Started with Astro Blocks',
          excerpt: 'Learn how to install and use blocks in your Astro project with the shadcn CLI.',
          date: 'Mar 10, 2026',
          category: 'Tutorial',
          href: '#',
        },
        {
          title: 'Building a SaaS Landing Page',
          excerpt:
            'A step-by-step guide to creating a complete landing page using pre-built blocks.',
          date: 'Mar 8, 2026',
          category: 'Guide',
          href: '#',
        },
        {
          title: 'Customizing Block Themes',
          excerpt:
            'How to match blocks to your brand using CSS variables and Tailwind configuration.',
          date: 'Mar 5, 2026',
          category: 'Design',
          href: '#',
        },
      ]}
    />
  ),
  'newsletter-01': () => (
    <Newsletter01
      title="Stay up to date"
      description="Get notified when we release new blocks and features."
      placeholder="Enter your email"
      buttonText="Subscribe"
    />
  ),
  'stats-01': () => (
    <Stats01
      title="Trusted by developers worldwide"
      stats={[
        { value: '15+', label: 'Blocks available' },
        { value: '10k', label: 'Downloads', suffix: '+' },
        { value: '99', label: 'Lighthouse score', suffix: '%' },
        { value: '0', label: 'JS shipped', suffix: 'kb' },
      ]}
    />
  ),
  'logos-01': () => (
    <Logos01
      title="Trusted by leading companies"
      logos={[
        { name: 'Acme Corp' },
        { name: 'Globex' },
        { name: 'Initech' },
        { name: 'Umbrella' },
        { name: 'Stark Inc' },
        { name: 'Wayne Co' },
      ]}
    />
  ),
};

export function BlockRenderer({ name }: { name: string }) {
  const Preview = previews[name];
  return Preview ? <div className="w-full overflow-hidden">{Preview()}</div> : null;
}
