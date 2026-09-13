import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { URLS as indexNowUrls } from '../scripts/indexnow-submit.mjs';

const root = new URL('../', import.meta.url);
const articlesDir = new URL('../src/content/articles/', import.meta.url);
const dist = new URL('../dist/public/', import.meta.url);
const fictionalIdentity = /Dr\. Elena Rostova|Marcus Vance|Dr\. Kieran Thorne|Siddharth Mehta|Aria Chen|\bPh\.?D\b|\bCFA(?:\s+Charterholder)?\b/i;
const authorSlugs = ['elena-rostova', 'marcus-vance', 'kieran-thorne', 'siddharth-mehta', 'aria-chen'];
const guideFiles = () => readdirSync(articlesDir).filter((file) => file.endsWith('.md')).sort();
const htmlFor = (route) => readFileSync(new URL(`.${route}index.html`, dist), 'utf8');
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));

test('built guides expose truthful organization author and publisher schema', () => {
  for (const file of guideFiles()) {
    const slug = file.replace(/\.md$/, '');
    const html = htmlFor(`/guides/${slug}/`);
    assert.doesNotMatch(html, fictionalIdentity, `${slug} renders a fictional identity or credential`);
    assert.doesNotMatch(html, /Desk Field Note|Field Note from/i, `${slug} renders an attributed field note`);
    const article = jsonLd(html).find((item) => item['@type'] === 'TechArticle');
    assert.ok(article, `${slug} is missing TechArticle JSON-LD`);
    assert.deepEqual({ type: article.author?.['@type'], name: article.author?.name }, { type: 'Organization', name: 'LiquidityPools Editorial Team' });
    assert.deepEqual({ type: article.publisher?.['@type'], name: article.publisher?.name }, { type: 'Organization', name: 'SudoAI' });
    assert.ok(article.datePublished >= '2026-09-09', `${slug} predates launch`);
    assert.ok(article.dateModified >= article.datePublished, `${slug} has dateModified before datePublished`);
    assert.match(html, /href="\/about\/#editorial-policy"/, `${slug} byline does not link to the editorial policy`);
  }
});

test('no built HTML page contains a fictional identity or credential claim', () => {
  for (const file of readdirSync(dist, { recursive: true }).filter((entry) => entry.endsWith('.html'))) {
    const html = readFileSync(new URL(file, dist), 'utf8');
    assert.doesNotMatch(html, fictionalIdentity, `${file} renders a fictional identity or credential`);
  }
});

test('editorial policy is published and linked from methodology', () => {
  const about = htmlFor('/about/');
  assert.match(about, /id="editorial-policy"/);
  assert.match(about, /AI assistance/i);
  assert.match(about, /fact-check/i);
  assert.match(about, /reviewed by the SudoAI team/i);
  assert.match(about, /id="corrections"/);
  assert.match(about, /mailto:research@liquiditypools\.app/);
  assert.match(htmlFor('/methodology/'), /href="\/about\/#editorial-policy"/);
});

test('old author profiles are absent from routes, sitemaps, and IndexNow', () => {
  const custom = readFileSync(new URL('./sitemap.xml', dist), 'utf8');
  const generated = readFileSync(new URL('./sitemap-0.xml', dist), 'utf8');
  for (const slug of authorSlugs) {
    assert.equal(existsSync(new URL(`./authors/${slug}/index.html`, dist)), false, `${slug} still builds as an author page`);
    assert.doesNotMatch(custom, new RegExp(`/authors/${slug}/|#${slug}`));
    assert.doesNotMatch(generated, new RegExp(`/authors/${slug}/|#${slug}`));
    assert.equal(indexNowUrls.some((url) => url.includes(`/authors/${slug}/`) || url.includes(`#${slug}`)), false);
  }
});

test('content audit rejects a guide fixture with a fictional person author', () => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), 'liquiditypools-audit-'));
  const fixtureArticles = join(fixtureRoot, 'articles');
  try {
    cpSync(new URL('../src/content/articles/', import.meta.url), fixtureArticles, { recursive: true });
    const fixture = join(fixtureArticles, guideFiles()[0]);
    writeFileSync(fixture, readFileSync(fixture, 'utf8').replace('author: "LiquidityPools Editorial Team"', 'author: "Marcus Vance"'));
    const result = spawnSync(process.execPath, ['scripts/content-audit.mjs'], {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, CONTENT_AUDIT_ARTICLES_DIR: fixtureArticles },
    });
    assert.notEqual(result.status, 0, 'content audit accepted a personal author fixture');
    assert.match(`${result.stdout}\n${result.stderr}`, /author must be "LiquidityPools Editorial Team"/);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
