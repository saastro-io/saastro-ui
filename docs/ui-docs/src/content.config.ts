import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const settingsSchema = z.object({
  site: z.object({
    name: z.string(),
    site: z.string().optional(),
    base: z.string().default('/'),
    trailingSlash: z.enum(['always', 'never', 'ignore']).default('ignore'),
    googleSiteVerificationId: z.string().optional().nullable(),
    favicon: z.any().optional(),
  }),
  i18n: z.object({
    language: z.string().default('es'),
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

const settings = defineCollection({
  loader: glob({ pattern: 'settings.yaml', base: 'src/data' }),
  schema: settingsSchema,
});

const docsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  section: z.string().default('getting-started'),
  order: z.number().default(0),
  published: z.boolean().default(true),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: docsSchema,
});

export const collections = { settings, docs };
