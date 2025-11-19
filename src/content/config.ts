import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    author: z.string(),
    authorRole: z.string(),
    authorAvatar: z.string(),
    category: z.string(),
    image: z.string(),
  }),
});

export const collections = { posts };
