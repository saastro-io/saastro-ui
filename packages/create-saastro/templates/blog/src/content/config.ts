/**
 * Content Collections configuration
 * Define your content schemas here
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Anonymous'),
  }),
});

export const collections = { posts };
