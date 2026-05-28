# 个性化网站设计规范

## 概述

搭建一个以"梦幻玻璃"为主题的个人品牌网站，包含名片展示、作品集、简历、文章分享和访客交流功能。基于 Astro v5 构建，内容与样式完全分离，为未来迁移至 Next.js 社区平台预留空间。

---

## 一、架构原则：内容与样式分离

所有可迁移内容存放在 `content/` 目录，所有样式集中在 `src/styles/` 管理。组件与框架绑定，迁移时仅需改写组件壳，内容和样式零修改。

```
project-root/
├── content/                        # 纯内容 → 100% 可迁移至 Next.js
│   ├── posts/                      # Markdown 文章
│   │   ├── 2026-05-28-hello-world.md
│   │   └── ...
│   ├── projects/                   # Markdown 作品
│   │   ├── project-1.md
│   │   └── ...
│   ├── resume.json                 # 简历结构化数据
│   └── config.ts                   # 站点全局配置（昵称/头像/社交链接等）
│
├── public/                         # 静态资源 → 100% 可迁移
│   ├── images/
│   │   ├── avatar.webp             # 个人头像
│   │   ├── projects/               # 作品截图
│   │   └── og/                     # Open Graph 社交预览图
│   └── favicon.svg
│
├── src/
│   ├── components/                 # UI 组件 → 迁移时改写为 JSX
│   │   ├── Header.astro            # 顶部导航栏 + 主题切换按钮
│   │   ├── Footer.astro            # 底部版权 + 社交链接
│   │   ├── Hero.astro              # 首页毛玻璃 Hero 区域
│   │   ├── ProjectCard.astro       # 作品卡片（列表用）
│   │   ├── ProjectGrid.astro       # 作品卡片容器（含分类筛选）
│   │   ├── PostCard.astro          # 文章摘要卡片
│   │   ├── PostList.astro          # 文章列表容器（含标签筛选）
│   │   ├── Timeline.astro          # 简历时间线
│   │   ├── SkillTags.astro         # 技能标签组
│   │   ├── ThemeSwitcher.astro     # 主题下拉选择器
│   │   ├── GiscusComments.astro    # Giscus 评论组件封装
│   │   ├── BackToTop.astro         # 回到顶部按钮
│   │   └── SEO.astro               # SEO meta 标签组件
│   │
│   ├── layouts/                    # 页面布局壳
│   │   ├── BaseLayout.astro        # 基础布局（Header + Footer + 插槽）
│   │   ├── PostLayout.astro        # 文章详情布局（正文 + 评论区）
│   │   └── ProjectLayout.astro     # 作品详情布局
│   │
│   ├── pages/                      # 路由页面（文件即路由）
│   │   ├── index.astro             # 首页 `/`
│   │   ├── projects/
│   │   │   ├── index.astro         # 作品列表 `/projects`
│   │   │   └── [slug].astro        # 作品详情 `/projects/[slug]`
│   │   ├── posts/
│   │   │   ├── index.astro         # 文章列表 `/posts`
│   │   │   └── [slug].astro        # 文章详情 `/posts/[slug]`
│   │   ├── resume.astro            # 简历 `/resume`
│   │   ├── guestbook.astro         # 留言板 `/guestbook`
│   │   ├── rss.xml.js              # RSS 订阅源生成
│   │   └── 404.astro              # 404 页面
│   │
│   ├── styles/
│   │   ├── global.css              # 全局样式 + CSS 变量默认值
│   │   ├── reset.css               # CSS Reset (Andy Bell 现代版)
│   │   ├── typography.css          # 排版系统
│   │   ├── utilities.css           # 工具类
│   │   └── themes/                 # 主题变量文件
│   │       ├── glass.css           # 梦幻玻璃（默认）
│   │       ├── neon.css            # 渐变霓虹（备用）
│   │       ├── warm.css            # 手绘温暖（备用）
│   │       └── cyber.css           # 赛博朋克（备用）
│   │
│   ├── utils/
│   │   ├── themes.ts               # 主题注册表
│   │   ├── posts.ts                # 文章数据获取（frontmatter 解析）
│   │   └── projects.ts             # 作品数据获取
│   │
│   └── types.ts                    # TypeScript 类型定义
│
├── astro.config.mjs                # Astro 配置
├── tsconfig.json                   # TypeScript 配置
├── package.json
└── .gitignore
```

---

## 二、技术栈

| 项 | 选型 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Astro | ^5.0 | 零 JS 默认输出，Markdown 原生支持 |
| 样式方案 | CSS 变量 + 主题层 | — | 一套变量定义，多套主题值 |
| 内容格式 | Markdown + JSON | — | 纯数据，框架无关，迁移零成本 |
| 评论系统 | Giscus | — | 基于 GitHub Discussions，免费托管 |
| 部署 | Vercel | — | 自动 CI/CD，免费额度 100GB/月 |
| 包管理 | npm | 10.x | 已预装 |
| 语言 | TypeScript | ^5.0 | 类型安全 |
| 图标 | 内联 SVG | — | 零依赖，按需使用 |
| 字体 | 系统字体栈 + Google Fonts | — | 无 Flash，fallback 可靠 |

---

## 三、数据模型

### 3.1 站点配置 `content/config.ts`

```ts
export const siteConfig = {
  name: "你的名字",
  title: "个人网站",
  bio: "一句话简介，不超过 30 字",
  avatar: "/images/avatar.webp",
  social: {
    github: "https://github.com/你的用户名",
    email: "你的邮箱",
    // 可扩展：twitter, bilibili, zhihu...
  },
  nav: [
    { label: "首页", href: "/" },
    { label: "作品", href: "/projects" },
    { label: "文章", href: "/posts" },
    { label: "简历", href: "/resume" },
    { label: "留言", href: "/guestbook" },
  ],
  footer: "© 2026 你的名字. All rights reserved.",
}
```

### 3.2 文章 Frontmatter `content/posts/*.md`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 文章标题 |
| `date` | Date | 是 | 发布日期 |
| `updated` | Date | 否 | 最后更新日期 |
| `tags` | string[] | 否 | 标签列表 |
| `description` | string | 否 | 摘要，不填则取正文前 150 字 |
| `draft` | boolean | 否 | 草稿，默认 false |
| `image` | string | 否 | 封面图路径 |

### 3.3 作品 Frontmatter `content/projects/*.md`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 作品名称 |
| `date` | Date | 是 | 完成日期 |
| `tags` | string[] | 否 | 技术栈标签 |
| `category` | string | 否 | 分类（用于筛选） |
| `image` | string | 否 | 封面图路径 |
| `featured` | boolean | 否 | 是否精选（显示在首页） |
| `link` | string | 否 | 在线演示链接 |
| `repo` | string | 否 | GitHub 仓库链接 |
| `description` | string | 否 | 简短描述 |
| `order` | number | 否 | 排序权重（越大越前） |

### 3.4 简历数据 `content/resume.json`

```json
{
  "basics": {
    "name": "",
    "title": "",
    "summary": "",
    "location": "",
    "email": "",
    "skills": ["", ""]
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "startDate": "2023-01",
      "endDate": "2025-06",
      "description": "",
      "highlights": ["", ""]
    }
  ],
  "education": [
    {
      "school": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": ""
    }
  ]
}
```

---

## 四、组件树与数据流

### 4.1 页面-组件映射关系

```
BaseLayout (全局壳)
├── Header
│   ├── Logo/名称
│   ├── 导航链接列表
│   └── ThemeSwitcher
├── <slot /> 页面内容
│   ├── Hero                  ← 仅在首页
│   │   ├── 头像 + 简介
│   │   └── 社交链接
│   ├── ProjectGrid           ← 作品列表页
│   │   ├── 分类筛选栏
│   │   └── ProjectCard[]
│   ├── PostList              ← 文章列表页
│   │   ├── 标签筛选栏
│   │   └── PostCard[]
│   ├── Timeline              ← 简历页
│   │   ├── 经历条目
│   │   └── SkillTags
│   ├── GiscusComments        ← 文章详情/留言板
│   └── BackToTop
└── Footer
```

### 4.2 数据流

```
content/posts/*.md  ──→  src/utils/posts.ts  ──→  pages/posts/*.astro
                         (getCollection)            (遍历渲染)

content/projects/*.md  ──→  src/utils/projects.ts  ──→  pages/projects/*.astro

content/resume.json  ──→  pages/resume.astro  (直接 import JSON)

content/config.ts  ──→  BaseLayout / Hero / Footer  (站点全局信息)
```

### 4.3 关键数据函数

```ts
// src/utils/posts.ts
export async function getPosts(limit?: number)           // 获取文章列表
export async function getPostsByTag(tag: string)         // 按标签筛选
export async function getAllTags()                       // 获取所有标签

// src/utils/projects.ts
export async function getProjects(category?: string)    // 获取作品列表
export async function getFeaturedProjects()             // 获取精选作品（首页用）
export async function getAllCategories()                // 获取所有分类
```

---

## 五、路由表

| 路由 | 页面文件 | 页面标题 | 数据源 |
|------|----------|----------|--------|
| `/` | `index.astro` | 首页 | `config.ts` + `getFeaturedProjects()` + `getPosts(5)` |
| `/projects` | `projects/index.astro` | 作品集 | `getProjects()` |
| `/projects/[slug]` | `projects/[slug].astro` | 作品名 | 单篇 `*.md` |
| `/posts` | `posts/index.astro` | 文章 | `getPosts()` |
| `/posts/[slug]` | `posts/[slug].astro` | 文章标题 | 单篇 `*.md` |
| `/resume` | `resume.astro` | 简历 | `resume.json` |
| `/guestbook` | `guestbook.astro` | 留言板 | Giscus |
| `/rss.xml` | `rss.xml.js` | — | `getPosts()` |
| `*` | `404.astro` | 404 | 无 |

---

## 六、主题系统设计

### 6.1 核心机制

所有视觉属性通过 CSS 自定义属性（`--var`）定义。主题切换通过修改 `<html data-theme="xxx">` 实现。组件代码只引用变量名，不硬编码任何颜色值。

### 6.2 完整 CSS 变量规范

```css
/* ===== 背景系统 ===== */
--color-bg-primary          /* 页面主背景 */
--color-bg-secondary        /* 次级背景（区块） */
--color-bg-card             /* 卡片背景 */
--color-bg-hover            /* hover 状态背景 */

/* ===== 文字系统 ===== */
--color-text-primary        /* 正文 */
--color-text-secondary      /* 次要文字 */
--color-text-muted          /* 辅助/灰色文字 */
--color-text-inverse        /* 深色背景上的文字 */

/* ===== 强调色 ===== */
--color-accent              /* 主强调色（链接、按钮、高亮） */
--color-accent-hover        /* hover 变体 */
--color-accent-muted        /* 强调色淡版（标签背景等） */

/* ===== 边框与阴影 ===== */
--color-border              /* 边框颜色 */
--color-shadow              /* 阴影颜色 */

/* ===== 玻璃效果 ===== */
--glass-bg                  /* 毛玻璃背景 (rgba) */
--glass-border              /* 毛玻璃边框 */
--glass-blur                /* 模糊量 (px) */
--glass-shadow              /* 毛玻璃阴影 */

/* ===== 圆角 ===== */
--radius-sm                 /* 小圆角 (4px) */
--radius-md                 /* 中圆角 (8px) */
--radius-lg                 /* 大圆角 (16px) */
--radius-full               /* 圆形 (9999px) */

/* ===== 间距 ===== */
--space-xs, --space-sm, --space-md, --space-lg, --space-xl, --space-2xl

/* ===== 排版 ===== */
--font-heading              /* 标题字体 */
--font-body                 /* 正文字体 */
--font-mono                 /* 代码/等宽字体 */
--text-base                 /* 基础字号 */
--text-sm, --text-lg, --text-xl, --text-2xl, --text-3xl
--line-height-base, --line-height-heading

/* ===== 渐变 ===== */
--gradient-hero             /* Hero 区域渐变 */
--gradient-card             /* 卡片渐变 */
--gradient-accent           /* 强调渐变 */

/* ===== 过渡 ===== */
--transition-base           /* 基础过渡 (200ms ease) */
--transition-slow           /* 慢过渡 (500ms ease) */

/* ===== 布局 ===== */
--max-width                 /* 内容最大宽度 (1200px) */
--header-height             /* 导航栏高度 */
```

### 6.3 新增主题流程

1. 在 `src/styles/themes/` 新建 `theme-name.css`
2. 定义上述所有变量（或继承默认值，只覆盖差异项）
3. 在 `src/utils/themes.ts` 注册表中添加：
   ```ts
   { id: "theme-name", name: "主题显示名", file: "theme-name.css" }
   ```
4. 完成。组件零改动，切换即时生效。

### 6.4 预置主题

| ID | 名称 | 主要特征 |
|------|------|------|
| `glass` | 梦幻玻璃 | 柔和渐变背景(紫→蓝→粉→橙) + 毛玻璃卡片 + 白色文字 |
| `neon` | 渐变霓虹 | 深色底 + 紫/粉/蓝三色渐变 + 霓虹光效 + 高饱和度 |
| `warm` | 手绘温暖 | 浅米色底 + 暖橙/绿/黄手绘风色块 + 圆润设计 + 深色正文 |
| `cyber` | 赛博朋克 | 纯黑底(#0a0a0a) + 荧光绿/紫/青 + 等宽字体 + 扫描线纹理 |

### 6.5 主题切换交互

- `ThemeSwitcher` 组件：下拉菜单，显示当前主题名称
- 选择后即时切换（无页面刷新）
- 选择记录到 `localStorage`，回访时自动恢复
- SSR 时从 Cookie 读取，避免闪烁

---

## 七、页面详细规格

### 7.1 首页 `/`

**布局**（自上而下）：
1. **Header** — 透明背景，随滚动变为毛玻璃
2. **Hero** — 全屏高度(100vh)，流动渐变背景
   - 居中：大头像(120px 圆形) + 姓名 + 一句话介绍
   - 社交图标行（GitHub / 邮箱 / 更多）
   - 向下滚动指示箭头（CSS 动画）
3. **精选作品区** — "精选作品" 标题 + 2×2 卡片网格
4. **最新文章区** — "最新文章" 标题 + 纵向文章摘要列表
5. **Footer** — 版权信息 + 社交链接 + 导航链接

### 7.2 作品列表 `/projects`

- 顶部：页面标题 + 分类筛选按钮组（全部 / Flutter / Android / Web / ...）
- 卡片网格（桌面 3 列，平板 2 列，手机 1 列）
- 每张卡片：图片 → 标题 → 简述 → 标签
- 点击进入详情

### 7.3 作品详情 `/projects/[slug]`

- 大图/视频（全宽，限高 500px）
- 标题 + 标签 + 日期
- Markdown 正文（图片懒加载）
- 底部：演示链接按钮 + 仓库链接按钮
- 返回作品集链接

### 7.4 简历 `/resume`

- 顶部：姓名 + 职位 + 所在地 + 邮箱
- 技能标签云（SkillTags 组件）
- 经历时间线（Timeline 组件）：左侧时间，右侧内容
- 教育时间线

### 7.5 文章列表 `/posts`

- 标签筛选栏（同作品集逻辑）
- 文章卡片列表，每项包含：日期 → 标题 → 摘要 → 标签
- 右侧或顶部可选：年份分组

### 7.6 文章详情 `/posts/[slug]`

- 顶部：标题 + 日期 + 标签
- 封面图（如有）
- Markdown 正文（代码块语法高亮）
- 底部：上一篇 / 下一篇导航
- Giscus 评论区

### 7.7 留言板 `/guestbook`

- 简短引导语
- Giscus 评论组件（使用独立 discussion 分类）

### 7.8 404 页面

- 居中：大号 "404" + "页面不存在" + 返回首页按钮

---

## 八、响应式断点

| 断点 | 宽度 | 布局变化 |
|------|------|------|
| 手机 | < 640px | 单列，导航折叠为汉堡菜单，Hero 头像缩小 |
| 平板 | 640px - 1024px | 双列卡片，导航保持展开 |
| 桌面 | > 1024px | 三列卡片，最大内容宽度 1200px |
| 宽屏 | > 1440px | 内容居中，背景延伸 |

---

## 九、内容管理

### 9.1 新增文章
在 `content/posts/` 新建 `.md` 文件：
```md
---
title: "文章标题"
date: 2026-05-28
updated: 2026-05-29
tags: ["Flutter", "Android"]
description: "一句话摘要"
draft: false
image: "/images/posts/cover.webp"
---
正文内容（Markdown 语法）...
```

### 9.2 新增作品
在 `content/projects/` 新建 `.md` 文件：
```md
---
title: "作品名"
date: 2026-05-28
tags: ["Flutter", "Firebase"]
category: "移动应用"
image: "/images/projects/demo.webp"
featured: true
link: "https://play.google.com/..."
repo: "https://github.com/..."
order: 1
---
作品详细描述...
```

### 9.3 更新简历
直接编辑 `content/resume.json`。

### 9.4 修改站点信息
编辑 `content/config.ts`，全局生效。

---

## 十、图片与水印策略

### 10.1 分层展示方案

| 场景 | 图片类型 | 水印 | 尺寸 |
|------|------|------|------|
| 缩略图（卡片/列表） | 裁剪压缩版 | 无（太小不可见） | 400×300 |
| 全屏查看 | 纯净展示图 | 右下角小水印（半透明） | 1200×900 |
| 下载按钮 | 带水印版 | 居中大水印 | 原始分辨率 |

### 10.2 水印规范

- 内容：你的名字/品牌标识
- 格式：半透明白色或黑色（根据图片明暗自适应）
- 位置：右下角，距边缘 20px
- 字体大小：图片宽度的 3%
- 缩略图 → 无水印（太小，加了也看不见）
- 展示图 → 小水印（不干扰观看，但盗用有标识）
- 下载图 → 覆盖型水印（对角线重复平铺，居中叠加，难以去除）

### 10.3 上传时自动处理

在 `public/images/` 目录放置图片后，构建时自动：

1. 生成缩略图（400×300，无水印）
2. 生成展示图（1200×900，右下角小水印）
3. 保留原始图（下载版，添加覆盖型水印）

通过 Astro 的 `getImage()` 函数 + Sharp 库实现自动化处理。

### 10.4 技术限制

诚实地：懂技术的人仍可通过浏览器开发者工具查看纯净图。水印是**增加门槛**，不是绝对防护。这是所有网页的物理限制。

## 十一、评论系统 (Giscus) 配置

1. 在 GitHub 仓库 Settings → Features → 开启 Discussions
2. 安装 [Giscus App](https://github.com/apps/giscus)
3. 访问 [giscus.app](https://giscus.app) 生成配置
4. 将配置写入环境变量 `PUBLIC_GISCUS_REPO` / `PUBLIC_GISCUS_REPO_ID` / `PUBLIC_GISCUS_CATEGORY_ID`
5. 文章详情页和留言板使用不同 `category` 区分

访客需要 GitHub 账号登录才能评论，评论自动同步到仓库 Discussions。

---

## 十二、部署配置

### Vercel

```json
// vercel.json (可选，默认零配置)
{
  "buildCommand": "astro build",
  "outputDirectory": "dist"
}
```

配置步骤：
1. `git push` 到 GitHub
2. Vercel → New Project → 导入仓库
3. 框架自动检测为 Astro，无需手动配置
4. 设置环境变量（Giscus 相关）
5. 每次 `git push` 自动构建部署

可选自定义域名：Vercel → Settings → Domains → 添加域名 + 配置 DNS

---

## 十三、非功能需求与验收标准

### 性能
- Lighthouse Performance ≥ 90
- First Contentful Paint < 1.5s
- Time to Interactive < 2s
- 所有图片使用 WebP 格式 + 懒加载
- Astro 默认零 JS，只有 Giscus 和主题切换引入少量 JS

### 响应式
- 375px / 768px / 1024px / 1440px 四个断点测试通过
- 无水平滚动条
- 触摸目标 ≥ 44px

### 可访问性
- 语义化 HTML（`<header> <nav> <main> <article> <footer>`）
- 所有图片有 `alt` 属性
- 颜色对比度 ≥ AA 级（4.5:1）
- Tab 键可完整导航

### SEO
- 每页独立 `<title>` / `<meta description>`
- Open Graph 标签（`og:title` / `og:description` / `og:image`）
- 自动生成 `sitemap.xml`
- 自动生成 `rss.xml`

### 代码质量
- TypeScript strict 模式
- `astro check` 零错误
- `astro build` 构建成功

---

## 十四、主题切换防错机制

### Bug 预防策略

1. **变量完整性检查**：`ThemeSwitcher` 切换时，JS 遍历必填变量列表，缺失的自动 fallback 到默认主题值
2. **类型安全**：`src/utils/themes.ts` 中的主题注册表使用 TypeScript 严格类型
3. **CSS fallback**：`global.css` 定义完整默认值，所有 `var(--xxx)` 使用 fallback 语法 `var(--xxx, fallback)`
4. **切换无闪烁**：SSR 阶段从 Cookie 读取主题设置 `<html data-theme>`，客户端 hydration 前后一致

### 升级保护
- 新增组件若需新颜色 → 先在 `global.css` 加默认值 → 再在各主题文件加对应值
- 主题文件版本号管理：每个主题文件头部注释 `/* theme-v2 */` 标记格式版本

---

## 十五、扩展路径：迁移至 Next.js 社区平台

当需要升级为多用户社区时，以下部分零修改迁移：

| 可迁移 | 迁移方式 | 修改量 |
|------|------|------|
| `content/` 全部 | 直接复制 | 0% |
| `public/` 全部 | 直接复制 | 0% |
| `src/styles/` 全部 | 直接复制 | 0% |
| `src/utils/` 数据函数 | 改写 import 路径 | ~10% |
| `src/components/` | `.astro` → `.tsx` 重写 | ~60% |
| `src/layouts/` | `.astro` → `.tsx` 重写 | ~50% |
| `src/pages/` | 文件路由 → Next.js App Router | ~70% |
| Giscus 评论 | 可直接复用或替换为自建评论 | 0-100% |
