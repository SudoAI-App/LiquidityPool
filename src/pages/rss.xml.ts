import type { APIRoute } from 'astro';
import { articles } from '../lib/articles';

const escapeXml = (value: unknown) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export const GET: APIRoute = () => {
  const base = 'https://liquiditypool.app';
  const items = articles.map((article) =>
    '<item><title>' + escapeXml(article.title) + '</title>' +
    '<description>' + escapeXml(article.description) + '</description>' +
    '<pubDate>' + new Date(article.date).toUTCString() + '</pubDate>' +
    '<link>' + base + '/guides/' + article.slug + '</link>' +
    '<guid isPermaLink="true">' + base + '/guides/' + article.slug + '</guid></item>'
  ).join('');
  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0"><channel><title>LiquidityPool.app</title>' +
    '<description>Independent research about decentralized liquidity.</description>' +
    '<link>' + base + '</link>' + items + '</channel></rss>';
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
