import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { URLS as indexNowUrls } from '../scripts/indexnow-submit.mjs';

const dist = new URL('../dist/public/', import.meta.url);
const calculatorRoutes = [
  '/tools/impermanent-loss-calculator/',
  '/tools/liquidity-pool-calculator/',
  '/tools/lp-profit-calculator/',
  '/tools/uniswap-v3-liquidity-calculator/',
  '/tools/meteora-dlmm-calculator/',
];
const expectedStaticRoutes = [
  '/', '/about/', '/guides/', '/topics/', '/tools/', '/methodology/', '/glossary/',
  '/tools/impermanent-loss-calculator/', '/tools/liquidity-pool-calculator/',
  '/tools/lp-profit-calculator/', '/tools/uniswap-v3-liquidity-calculator/',
  '/tools/meteora-dlmm-calculator/',
];
const htmlFor = (route) => readFileSync(new URL(`.${route}index.html`, dist), 'utf8');
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));

test('new and changed pages build with title, description, clean canonical, and valid JSON-LD', () => {
  const expectations = {
    '/methodology/': 'Calculator Methodology, Formulas &amp; Test Cases',
    '/tools/impermanent-loss-calculator/': 'Weighted &amp; Range Impermanent Loss Calculator',
    '/tools/uniswap-v3-liquidity-calculator/': 'Uniswap v3 &amp; Concentrated Liquidity Calculator',
    '/tools/meteora-dlmm-calculator/': 'Meteora DLMM Calculator: Bins, Fees &amp; IL',
  };
  for (const [route, title] of Object.entries(expectations)) {
    assert.equal(existsSync(new URL(`.${route}index.html`, dist)), true, `${route} was not built`);
    const html = htmlFor(route);
    assert.match(html, new RegExp(`<title>${title}`));
    assert.match(html, /<meta name="description" content="[^"]{50,160}">/);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://liquiditypools\\.app${route}">`));
    assert.ok(jsonLd(html).length >= 2);
  }
});

test('every calculator links to methodology and exposes complete WebApplication schema', () => {
  for (const route of calculatorRoutes) {
    const html = htmlFor(route);
    assert.match(html, /href="\/methodology\/"/);
    assert.match(html, /tool-result--above-fold/);
    const app = jsonLd(html).find((item) => item['@type'] === 'WebApplication');
    assert.equal(app.applicationCategory, 'FinanceApplication');
    assert.match(app.dateModified, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('methodology renders all five calculator models and their shared test-vector tables', () => {
  const html = htmlFor('/methodology/');
  for (const model of ['impermanent-loss', 'concentrated-liquidity', 'pool-fees', 'lp-profit', 'meteora-dlmm']) {
    assert.match(html, new RegExp(`data-test-vectors="${model}"`));
  }
});

test('the established Uniswap v3 URL still resolves while targeting general concentrated-liquidity intent', () => {
  const html = htmlFor('/tools/uniswap-v3-liquidity-calculator/');
  assert.match(html, /Uniswap v3 &amp; Concentrated Liquidity Calculator/);
  assert.match(html, /data-calculator="uniswap_v3_liquidity"/);
});

test('fee calculator separates incentives and exposes a source timestamp', () => {
  const html = htmlFor('/tools/liquidity-pool-calculator/');
  assert.match(html, /id="incentiveApr"/);
  assert.match(html, /id="dataAsOf"/);
  assert.match(html, /id="out-data"/);
});

test('no-JavaScript fallback results match the default calculator inputs', () => {
  const concentrated = htmlFor('/tools/uniswap-v3-liquidity-calculator/');
  assert.match(concentrated, /id="out-fees">\$287\.88</);
  assert.match(concentrated, /id="out-net">\+\$151\.17</);
  const dlmm = htmlFor('/tools/meteora-dlmm-calculator/');
  assert.match(dlmm, /id="out-varfee">0\.4000%/);
  assert.match(dlmm, /id="out-totalfee">0\.6500%/);
  assert.match(dlmm, /id="out-fees">\$295\.36/);
  assert.match(dlmm, /id="out-net">\+\$285\.79/);
});

test('sitemap index points only at the custom sitemap, which lists every route once, as does IndexNow', () => {
  const sitemap = readFileSync(new URL('./sitemap.xml', dist), 'utf8');
  const index = readFileSync(new URL('./sitemap-index.xml', dist), 'utf8');
  assert.deepEqual([...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]), ['https://liquiditypools.app/sitemap.xml']);
  assert.equal(existsSync(new URL('./sitemap-0.xml', dist)), false, 'a second sitemap would list every URL twice');
  assert.doesNotMatch(sitemap, /<changefreq>daily<\/changefreq>/);
  assert.doesNotMatch(sitemap, /<loc>[^<]*\?/);
  for (const route of expectedStaticRoutes) {
    const url = `https://liquiditypools.app${route}`;
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), `${route} missing from custom sitemap`);
    assert.ok(indexNowUrls.includes(url), `${route} missing from IndexNow list`);
  }
  const articleCount = readdirSync(new URL('../src/content/articles/', import.meta.url)).filter((file) => file.endsWith('.md')).length;
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, expectedStaticRoutes.length + articleCount);
});

test('every built page keeps its document title and meta description within search-result limits', () => {
  const pages = [...expectedStaticRoutes, ...readdirSync(new URL('./guides/', dist), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => `/guides/${entry.name}/`)];
  const decode = (text) => text.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  for (const route of pages) {
    const html = htmlFor(route);
    const title = decode(html.match(/<title>([^<]*)<\/title>/)[1]);
    const description = decode(html.match(/<meta name="description" content="([^"]*)"/)[1]);
    assert.ok(title.length <= 60, `${route} title is ${title.length} characters: ${title}`);
    assert.ok(description.length <= 160, `${route} description is ${description.length} characters`);
  }
});

test('guide links to calculator presets carry state in the fragment, not crawlable query strings', () => {
  for (const entry of readdirSync(new URL('./guides/', dist), { withFileTypes: true }).filter((item) => item.isDirectory())) {
    const html = htmlFor(`/guides/${entry.name}/`);
    assert.doesNotMatch(html, /href="\/tools\/[^"]*\?/, `${entry.name} links to a parameterised calculator URL`);
  }
});

test('topics collection schema nests only CreativeWork types under hasPart', () => {
  const collection = jsonLd(htmlFor('/topics/')).find((item) => item['@type'] === 'CollectionPage');
  assert.equal(collection.hasPart.length, 4);
  for (const track of collection.hasPart) {
    assert.equal(track['@type'], 'Collection');
    assert.ok(track.hasPart.length > 0);
    assert.ok(track.hasPart.every((article) => article['@type'] === 'Article' && article.url.startsWith('https://liquiditypools.app/guides/')));
  }
});

test('robots and analytics privacy invariants remain present, and guide rail language is neutral', () => {
  const robots = readFileSync(new URL('./robots.txt', dist), 'utf8');
  for (const crawler of ['GPTBot', 'ClaudeBot', 'PerplexityBot']) assert.match(robots, new RegExp(`User-agent: ${crawler}\\nAllow: /`));
  const home = htmlFor('/');
  assert.match(home, /anonymize_ip:\s*true/);
  assert.match(home, /allow_google_signals:\s*false/);
  assert.match(home, /allow_ad_personalization_signals:\s*false/);
  const guide = htmlFor('/guides/impermanent-loss-explained/');
  assert.match(guide, /Data sources we use/);
  assert.doesNotMatch(guide, /Recommended research tools/);
});
