import type { SiteConfig } from "../types";

export const siteConfig: SiteConfig = {
  name: "LINKWang",
  title: "LINKWang",
  bio: "这是好事儿啊",
  avatar: "/images/avatar.jpg",
  social: {
    github: "https://github.com/vsimonlink",
    email: "your-email@example.com",
  },
  nav: [
    { label: "首页", href: "/" },
    { label: "作品", href: "/projects" },
    { label: "文章", href: "/posts" },
    { label: "简历", href: "/resume" },
    { label: "留言", href: "/guestbook" },
  ],
  footer: "© 2026 LINKWang. All rights reserved.",
};
