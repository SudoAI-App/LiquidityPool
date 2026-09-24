import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';

export const staticRouteDefinitions = [
  { path: '/', source: 'src/pages/index.astro', priority: '1.0', changefreq: 'weekly' },
  { path: '/guides/', source: 'src/pages/guides/index.astro', priority: '0.9', changefreq: 'weekly' },
  { path: '/topics/', source: 'src/pages/topics.astro', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/', source: 'src/pages/tools/index.astro', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/impermanent-loss-calculator/', source: 'src/pages/tools/impermanent-loss-calculator.astro', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/liquidity-pool-calculator/', source: 'src/pages/tools/liquidity-pool-calculator.astro', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/lp-profit-calculator/', source: 'src/pages/tools/lp-profit-calculator.astro', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/uniswap-v3-liquidity-calculator/', source: 'src/pages/tools/uniswap-v3-liquidity-calculator.astro', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/meteora-dlmm-calculator/', source: 'src/pages/tools/meteora-dlmm-calculator.astro', priority: '0.9', changefreq: 'monthly' },
  { path: '/methodology/', source: 'src/pages/methodology.astro', priority: '0.8', changefreq: 'monthly' },
  { path: '/glossary/', source: 'src/pages/glossary.astro', priority: '0.7', changefreq: 'monthly' },
  { path: '/about/', source: 'src/pages/about.astro', priority: '0.6', changefreq: 'monthly' },
];

export function sourceLastModified(source, root = process.cwd()) {
  const absolute = resolve(root, source);
  try {
    const dirty = execFileSync('git', ['status', '--porcelain=v1', '--', source], { cwd: root, encoding: 'utf8' }).trim();
    if (!dirty) {
      const committed = execFileSync('git', ['log', '-1', '--format=%cs', '--', source], { cwd: root, encoding: 'utf8' }).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(committed)) return committed;
    }
  } catch {
    // A source archive may not include Git history; filesystem metadata remains available.
  }
  return statSync(absolute).mtime.toISOString().slice(0, 10);
}
