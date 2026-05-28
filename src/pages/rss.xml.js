import rss from "@astrojs/rss";
import { getPosts } from "../utils/posts";

const base = import.meta.env.BASE_URL;

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: "个人网站",
    description: "文章 RSS 订阅",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description || "",
      pubDate: post.data.date,
      link: `${base}posts/${post.id}`,
    })),
  });
}
