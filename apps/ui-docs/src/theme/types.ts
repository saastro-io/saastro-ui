export interface SidebarItem {
  /** Display label */
  label: string;
  /** Link href */
  href: string;
  /** Optional badge text (e.g. "beta", "new") */
  badge?: string;
  /** Whether this item is the current page */
  active?: boolean;
}

export interface SidebarSection {
  /** Section heading */
  title: string;
  /** Items in this section */
  items: SidebarItem[];
}
