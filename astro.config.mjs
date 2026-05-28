// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://vsimonlink.github.io',
  base: '/-l/',
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: 'prism',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
