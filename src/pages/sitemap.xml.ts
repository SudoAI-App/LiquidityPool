import type { APIRoute } from 'astro';
import { articles } from '../lib/articles';

export const GET: APIRoute = () => {
  const baseUrl = 'https://liquiditypools.app';

  const staticPages = [
    { url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily', lastmod: '2026-09-10' },
    { url: `${baseUrl}/guides/`, priority: '0.9', changefreq: 'daily', lastmod: '2026-09-10' },
    { url: `${baseUrl}/topics/`, priority: '0.8', changefreq: 'weekly', lastmod: '2026-09-10' },
    { url: `${baseUrl}/about/`, priority: '0.6', changefreq: 'monthly', lastmod: '2026-09-10' },
  ];

  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/guides/${article.slug}/`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: article.lastReviewed || article.date || '2026-09-10',
  }));

  const allUrls = [...staticPages, ...articlePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
