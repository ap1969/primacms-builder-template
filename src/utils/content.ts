import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Get all posts merged from both the regular posts collection and PrimaCMS posts collection
 */
export async function getAllPosts() {
  const [regularPosts, primacmsPosts] = await Promise.all([
    getCollection('posts'),
    getCollection('primacms-posts')
  ]);

  // Merge both collections
  const allPosts = [...regularPosts, ...primacmsPosts];

  // Sort by date (newest first)
  allPosts.sort((a, b) => {
    const dateA = new Date(a.data.date).getTime();
    const dateB = new Date(b.data.date).getTime();
    return dateB - dateA;
  });

  return allPosts;
}

/**
 * Get a specific post by slug, checking both collections
 */
export async function getPostBySlug(slug: string): Promise<CollectionEntry<'posts'> | CollectionEntry<'primacms-posts'> | undefined> {
  const allPosts = await getAllPosts();
  return allPosts.find(post => post.slug === slug);
}

/**
 * Get all PrimaCMS pages
 */
export async function getAllPrimaCMSPages() {
  return await getCollection('primacms-pages');
}

/**
 * Get a specific PrimaCMS page by slug
 */
export async function getPrimaCMSPageBySlug(slug: string) {
  const pages = await getAllPrimaCMSPages();
  return pages.find(page => page.slug === slug);
}
