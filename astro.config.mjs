// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// User site: served from the root of hiradfazeli.github.io, so `base` must stay unset.
export default defineConfig({
  site: 'https://hiradfazeli.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      lastmod: new Date(),
      changefreq: 'monthly',
      // 404 is intentionally kept out of the index.
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        if (item.url === 'https://hiradfazeli.github.io/') item.priority = 1.0;
        else if (item.url.includes('/work/zeeberton')) item.priority = 0.9;
        else item.priority = 0.7;
        return item;
      },
    }),
  ],
  image: {
    responsiveStyles: true,
  },
  vite: {
    build: {
      // Keep the JS Art layer in one small file rather than many chunks.
      assetsInlineLimit: 2048,
    },
  },
});
