# LiquidityPool.app

A modern, SEO-first Astro editorial publication focused on decentralized-finance liquidity. The site is designed as a durable research library rather than a price-prediction or trading interface.

## What ships

The launch build includes twenty long-form, mechanism-first guides organized into four research tracks: Foundations, LP Mechanics, Risk & Research, and Advanced. The project includes a homepage, all-guides library, topic hubs, an editorial standards page, RSS feed, `robots.txt`, generated sitemap, semantic metadata, canonical URLs, Open Graph metadata, and Organization/Article JSON-LD.

## Local development

```bash
pnpm install
pnpm dev
```

The site uses Astro and runs on `http://localhost:4321` by default. The Vite configuration allows managed preview hosts, which is useful in cloud development environments.

## Production build

```bash
pnpm build
pnpm check
```

The static production output is written to `dist/public`. The project has been verified with Astro build and type checks.

## Content architecture

Guide content lives in `src/content/articles/`. Each Markdown article contains title, description, category, publication date, reading time, keyword theme, and featured status in frontmatter. The guide pages and XML sitemap are generated statically during the build.

The launch SEO strategy and the full 20-article plan are documented in [`SEO-LAUNCH-PLAN.md`](./SEO-LAUNCH-PLAN.md).

## Deployment

The output is compatible with Cloudflare Workers static assets. Before deploying, create or confirm a Cloudflare Worker and bind the `liquiditypool.app` custom domain to the Worker route. Do not store Cloudflare credentials in this repository.
