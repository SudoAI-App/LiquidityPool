import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://liquiditypools.app',
  trailingSlash: 'always',
  output: 'static',
  outDir: './dist/public',
  integrations: [sitemap()],
  vite: {
    css: { devSourcemap: true },
    server: { allowedHosts: true }
  }
});
