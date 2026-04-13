import type { MenuItem } from '@saastro-io/shell';
import { createPermalinkFactory } from '@saastro-io/shell';

export function getHeaderMenu(): MenuItem[] {
  const { getPermalink } = createPermalinkFactory();

  return [
    {
      text: 'Home',
      href: '/',
    },
    {
      text: 'GitHub',
      href: 'https://github.com/saastro-io/saastro-ui',
    },
  ];
}

export function getHeaderData(helpers?: { getPermalink?: (path: string) => string }) {
  return {
    menu: [
      {
        title: 'Home',
        url: '/',
      },
      {
        title: 'GitHub',
        url: 'https://github.com/saastro-io/saastro-ui',
      },
    ],
  };
}
