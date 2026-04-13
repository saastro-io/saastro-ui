import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { settingsSchema, docsSchema } from '@saastro-io/docs-theme/content/schemas';

const settings = defineCollection({
  loader: glob({ pattern: 'settings.yaml', base: 'src/data' }),
  schema: settingsSchema,
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: docsSchema,
});

export const collections = { settings, docs };
