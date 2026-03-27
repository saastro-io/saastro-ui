import type { FooterLink, FooterLinksGroup } from '@saastro-io/shell';

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
          { text: 'Blocks', href: '/blocks' },
          { text: 'UI Primitives', href: '/ui' },
          { text: 'GitHub', href: 'https://github.com/saastro-io/saastro-ui' },
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
          { text: 'Blocks', href: getPermalink('/blocks') },
          { text: 'UI Primitives', href: getPermalink('/ui') },
        ],
      },
    ],
    socialLinks: [
      { text: 'GitHub', href: 'https://github.com/saastro-io', icon: 'tabler:brand-github' },
      { text: 'X', href: 'https://x.com/saastro', icon: 'tabler:brand-x' },
    ],
  };
}
