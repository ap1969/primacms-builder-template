import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      excerpt: z.string().optional(),
      date: z.string().optional(),
      author: z.string().optional(),
      authorRole: z.string().optional(),
      authorAvatar: z.string().optional(),
      category: z.string().optional(),
      image: z.string().optional(),
    }),
  });

export const collections = { posts };
