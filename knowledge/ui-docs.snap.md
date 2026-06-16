# snapshot: ui-docs
> auto-generated — do not edit manually
> updated: 2026-04-13T08:59:14.406Z

## types & interfaces
```typescript
// ../../../saastro-ui/docs/ui-docs/src/data/blocks.ts:1
export type BlockMeta = {
  name: string;
  title: string;
  description: string;
  category: string;
  section: 'blocks' | 'ui';
  dependencies: string[];
};































// ../../../saastro-ui/docs/ui-docs/src/navigation/footer.ts:6
export interface FooterData {
  tagline?: string;
  links: FooterLinksGroup[];
  socialLinks: FooterLink[];
}
```

## exported functions
```typescript
// ../../../saastro-ui/docs/ui-docs/src/components/block-renderer.tsx:362
export function BlockRenderer({ name }: { name: string })









































// ../../../saastro-ui/docs/ui-docs/src/navigation/header.ts:4
export function getHeaderMenu(): MenuItem[]









































// ../../../saastro-ui/docs/ui-docs/src/navigation/header.ts:19
export function getHeaderData(helpers?: { getPermalink?: (path: string) => string })































// ../../../saastro-ui/docs/ui-docs/src/navigation/footer.ts:20
export function getFooterMenu(): FooterData






























// ../../../saastro-ui/docs/ui-docs/src/navigation/footer.ts:41
export function getFooterData(helpers?: { getPermalink?: (path: string) => string }): FooterData
```
