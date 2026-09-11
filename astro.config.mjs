import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { satteriKatex } from './src/lib/satteri-katex.mjs';

export default defineConfig({
  site: 'https://liquiditypools.app',
  trailingSlash: 'always',
  output: 'static',
  outDir: './dist/public',
  integrations: [sitemap()],
  markdown: {
    processor: satteri({
      features: { math: true },
      mdastPlugins: [satteriKatex]
    }),
    shikiConfig: { theme: 'github-dark', wrap: false }
  },
  vite: {
    css: { devSourcemap: true },
    server: { allowedHosts: true }
  }
});
