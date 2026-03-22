/**
 * Content Collections configuration
 * Documentation site with docs collection
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    section: z.string().default('Getting Started'),
  }),
});

export const collections = { docs };
