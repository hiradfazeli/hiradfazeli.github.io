// @ts-check
import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * @astrojs/sitemap emits `sitemap-index.xml`, but `/sitemap.xml` is the path
 * people and tools actually reach for — it is what Search Console's own field
 * suggests, and submitting it against this site returned a 404. GitHub Pages
 * cannot issue redirects, so we publish the index under both names.
 * @returns {import('astro').AstroIntegration}
 */
function sitemapAlias() {
  return {
    name: 'sitemap-alias',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const from = fileURLToPath(new URL('sitemap-index.xml', dir));
        const to = fileURLToPath(new URL('sitemap.xml', dir));
        if (!existsSync(from)) {
          logger.warn('sitemap-index.xml missing; /sitemap.xml not created');
          return;
        }
        copyFileSync(from, to);
        logger.info('aliased sitemap-index.xml -> sitemap.xml');
      },
    },
  };
}

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
    sitemapAlias(),
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
