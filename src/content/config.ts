import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  excerpt: z.string().optional(),
  date: z.string().optional(),
  author: z.string().optional(),
  authorRole: z.string().optional(),
  authorAvatar: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
});

const posts = defineCollection({
  type: 'content',
  schema: postSchema,
});

const primacmsPosts = defineCollection({
  type: 'content',
  schema: postSchema,
});

const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
  // Add any other fields you need for pages
});

const primacmsPages = defineCollection({
  type: 'content',
  schema: pageSchema,
});

export const collections = {
  posts,
  'primacms-posts': primacmsPosts,
  'primacms-pages': primacmsPages,
};
