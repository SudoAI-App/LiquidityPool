import type { APIRoute } from 'astro';
export const GET: APIRoute = () => {
  const content = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://liquiditypools.app/sitemap.xml
Sitemap: https://liquiditypools.app/sitemap-index.xml
`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
