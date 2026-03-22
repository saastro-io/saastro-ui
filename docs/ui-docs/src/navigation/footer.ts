import type { FooterLink, FooterLinksGroup } from '@saastro/shell';

/**
 * Footer data structure
 */
export interface FooterData {
  tagline?: string;
  links: FooterLinksGroup[];
  socialLinks: FooterLink[];
}

// Re-export types for backwards compatibility
export type { FooterLink, FooterLinksGroup };

/**
 * Generates footer navigation data for the UI docs site.
 *
 * @returns Footer navigation data
 */
export function getFooterMenu(): FooterData {
  return {
    tagline: 'UI components for Astro',
    links: [
      {
        title: 'Resources',
        links: [
          { text: 'Documentation', href: '/docs' },
          { text: 'Components', href: '/docs/components' },
          { text: 'GitHub', href: 'https://github.com/saastro-io/saastro-hub' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { text: 'Privacy Policy', href: '/privacy' },
          { text: 'Terms of Service', href: '/terms' },
        ],
      },
    ],
    socialLinks: [
      { text: 'GitHub', href: 'https://github.com/saastro-io', icon: 'tabler:brand-github' },
      { text: 'X', href: 'https://x.com/saastro', icon: 'tabler:brand-x' },
    ],
  };
}

// Legacy function for backwards compatibility with enlolab
export function getFooterData(helpers?: { getPermalink?: (path: string) => string }): FooterData {
  const getPermalink = helpers?.getPermalink || ((path: string) => path);

  return {
    tagline: 'UI components for Astro',
    links: [
      {
        title: 'Resources',
        links: [
          { text: 'Documentation', href: getPermalink('/docs') },
          { text: 'Components', href: getPermalink('/docs/components') },
        ],
      },
      {
        title: 'Legal',
        links: [
          { text: 'Privacy Policy', href: getPermalink('/privacy') },
          { text: 'Terms of Service', href: getPermalink('/terms') },
        ],
      },
    ],
    socialLinks: [
      { text: 'GitHub', href: 'https://github.com/saastro-io', icon: 'tabler:brand-github' },
      { text: 'X', href: 'https://x.com/saastro', icon: 'tabler:brand-x' },
    ],
  };
}
