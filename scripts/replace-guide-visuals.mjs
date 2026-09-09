import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const metadata = JSON.parse(readFileSync(join(root, 'visual-metadata.json'), 'utf8'));
const articlesDir = join(root, 'src/content/articles');
const articleFiles = readdirSync(articlesDir).filter((file) => file.endsWith('.md'));
const missing = [];

for (const file of articleFiles) {
  const slug = file.replace(/\.md$/, '');
  const visual = metadata[slug];
  if (!visual) {
    missing.push(slug);
    continue;
  }

  const path = join(articlesDir, file);
  const source = readFileSync(path, 'utf8');
  const figure = `<figure class="article-figure">\n  <img src="/images/guides/${slug}.webp" alt="${visual.alt}" width="1600" height="1067" loading="lazy" decoding="async" />\n  <figcaption>${visual.caption} <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>\n</figure>`;
  const replaced = source.replace(/<figure class="article-figure">[\s\S]*?<\/figure>/, figure);

  if (replaced === source) missing.push(`${slug} (figure)`);
  else writeFileSync(path, replaced);
}

if (missing.length) {
  throw new Error(`Visual metadata or figure missing: ${missing.join(', ')}`);
}

const lines = [
  '# Editorial illustration record',
  '',
  'Every guide image in `public/images/guides/` is an original, AI-assisted editorial illustration commissioned for LiquidityPools.app on 2026-09-09. These images are designed to explain the specific market mechanism discussed in the associated guide, rather than serving as generic decorative stock imagery. No third-party stock assets, logos, screenshots, or text overlays are used in this collection.',
  '',
  'The visual system uses charcoal ground, ivory structures, mint for active liquidity and transaction flow, and amber for price movement, fees, or caution. Alt text and a mechanism-specific figure caption are embedded in each article.',
  '',
  '| Guide | Visual argument | Asset |',
  '| --- | --- | --- |',
  ...Object.entries(metadata).sort(([a], [b]) => a.localeCompare(b)).map(([slug, visual]) => `| \`${slug}\` | ${visual.caption} | \`public/images/guides/${slug}.webp\` |`),
  ''
];
writeFileSync(join(root, 'ASSET-SOURCES.md'), lines.join('\n'));
console.log(`Replaced article figures and refreshed the editorial illustration record for ${articleFiles.length} guides.`);
