import { getCollection } from "astro:content";

export async function getPosts(limit?: number) {
  const posts = await getCollection("posts");
  return posts
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, limit);
}

export async function getAllTags() {
  const posts = await getPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.data.tags?.forEach((t: string) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export async function getPostsByTag(tag: string) {
  const posts = await getPosts();
  return posts.filter((p) => p.data.tags?.includes(tag));
}
