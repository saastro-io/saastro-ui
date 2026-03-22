/**
 * Content Collections configuration
 * Minimal setup with a single pages collection
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { pages };
