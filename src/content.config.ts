import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './.mintlify/docs' }),
  schema: z.object({ title: z.string(), description: z.string(), updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }),
});
export const collections = { docs };
