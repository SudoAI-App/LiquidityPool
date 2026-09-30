import type { APIRoute } from 'astro';
import { articles } from '../lib/articles';
import { sourceLastModified, staticRouteDefinitions } from '../lib/public-routes.mjs';

// Every URL lives in exactly one child sitemap (/sitemap.xml); this index only points at it,
// so crawlers that discovered /sitemap-index.xml never see a page listed twice.
export const GET: APIRoute = () => {
  const lastmod = [
    ...staticRouteDefinitions.map((route) => sourceLastModified(route.source)),
    ...articles.map((article) => article.lastReviewed || article.date),
  ].sort().at(-1);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://liquiditypools.app/sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
