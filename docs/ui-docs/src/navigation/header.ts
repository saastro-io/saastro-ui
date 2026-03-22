import type { MenuItem } from '@saastro/shell';
import { createPermalinkFactory } from '@saastro/shell';

export function getHeaderMenu(): MenuItem[] {
  const { getPermalink } = createPermalinkFactory();

  return [
    {
      text: 'Home',
      href: '/',
    },
    {
      text: 'Blocks',
      href: getPermalink('/blocks'),
    },
    {
      text: 'Docs',
      href: getPermalink('/docs/introduction'),
    },
  ];
}

export function getHeaderData(helpers?: { getPermalink?: (path: string) => string }) {
  const getPermalink = helpers?.getPermalink || ((path: string) => path);

  return {
    menu: [
      {
        title: 'Home',
        url: '/',
      },
      {
        title: 'Blocks',
        url: getPermalink('/blocks'),
      },
      {
        title: 'Docs',
        url: getPermalink('/docs/introduction'),
      },
    ],
  };
}
