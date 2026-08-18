/**
 * Minimal navigation/menu types used by the docs-theme internal layout.
 *
 * Decoupled from `@saastro-io/shell` so the theme is self-contained.
 */
export interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: string
  items?: MenuItem[]
}
