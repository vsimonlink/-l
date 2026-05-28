import { getCollection } from "astro:content";

export async function getProjects(category?: string) {
  const projects = await getCollection("projects");
  const filtered = category
    ? projects.filter((p) => p.data.category === category)
    : projects;
  return filtered.sort(
    (a, b) => (b.data.order ?? 0) - (a.data.order ?? 0) || b.data.date.valueOf() - a.data.date.valueOf()
  );
}

export async function getFeaturedProjects() {
  const projects = await getCollection("projects");
  return projects
    .filter((p) => p.data.featured)
    .sort((a, b) => (b.data.order ?? 0) - (a.data.order ?? 0))
    .slice(0, 4);
}

export async function getAllCategories() {
  const projects = await getCollection("projects");
  const catSet = new Set<string>();
  projects.forEach((p) => {
    if (p.data.category) catSet.add(p.data.category);
  });
  return Array.from(catSet).sort();
}
