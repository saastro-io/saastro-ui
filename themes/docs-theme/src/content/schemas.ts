import { z } from 'astro/zod';

/**
 * Schema for the site-wide settings.yaml file.
 * Used by @saastro-io/shell for configuration.
 */
export const settingsSchema = z.object({
  site: z.object({
    name: z.string(),
    site: z.string().optional(),
    base: z.string().default('/'),
    trailingSlash: z.enum(['always', 'never', 'ignore']).default('ignore'),
    googleSiteVerificationId: z.string().optional().nullable(),
    favicon: z.any().optional(),
  }),
  i18n: z.object({
    language: z.string().default('en'),
    textDirection: z.enum(['ltr', 'rtl']).default('ltr'),
  }),
  metadata: z.object({
    title: z
      .object({
        default: z.string(),
        template: z.string().optional(),
      })
      .optional(),
    description: z.string().optional(),
    robots: z.any().optional(),
    openGraph: z.any().optional(),
    twitter: z.any().optional(),
  }),
  apps: z.any().default({}),
  ui: z.any().optional(),
  analytics: z.any().optional(),
  cookieConsent: z.any().optional(),
});

/**
 * Schema for documentation pages (content collection).
 * Each doc has a title, optional description, section for sidebar grouping,
 * order for sorting, and published flag.
 */
export const docsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  section: z.string().default('getting-started'),
  order: z.number().default(0),
  published: z.boolean().default(true),
});
