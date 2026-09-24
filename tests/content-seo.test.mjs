import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const articlesDir = new URL('../src/content/articles/', import.meta.url);
const toolQueries = new Set(['impermanent loss calculator', 'liquidity pool calculator', 'lp profit calculator', 'uniswap v3 liquidity calculator', 'concentrated liquidity calculator', 'meteora dlmm calculator']);

test('all guides declare one unique primary query and do not target calculator queries', () => {
  const owners = new Map();
  const files = readdirSync(articlesDir).filter((file) => file.endsWith('.md'));
  assert.equal(files.length, 59);
  for (const file of files) {
    const source = readFileSync(new URL(file, articlesDir), 'utf8');
    const primary = source.match(/^primaryQuery:\s*"([^"]+)"/m)?.[1].trim().toLowerCase();
    assert.ok(primary, `${file} is missing primaryQuery`);
    assert.equal(owners.has(primary), false, `${file} duplicates ${primary} from ${owners.get(primary)}`);
    owners.set(primary, file);
    const keywords = source.match(/^keywords:\s*"([^"]+)"/m)?.[1].split(',').map((value) => value.trim().toLowerCase()) ?? [];
    assert.deepEqual(keywords.filter((keyword) => toolQueries.has(keyword)), [], `${file} collides with a tool query`);
  }
});

test('known cannibalization clusters have one declared owner', () => {
  const expected = {
    'impermanent-loss-explained.md': 'impermanent loss explained',
    'how-to-avoid-impermanent-loss.md': 'how to avoid impermanent loss',
    'liquidity-mining-explained.md': 'liquidity mining',
    'liquidity-mining-vs-yield-farming.md': 'liquidity mining vs yield farming',
    'yield-farming-explained.md': 'yield farming liquidity pools',
    // Comparison intent owns the head term; the architecture guide owns the internals vocabulary.
    'uniswap-v3-vs-v4.md': 'Uniswap v3 vs v4',
    'uniswap-v4-architecture-and-hooks.md': 'Uniswap v4 architecture',
    // Framework owns evaluation language; the checklist owns operational check language.
    'how-to-evaluate-a-liquidity-pool.md': 'how to evaluate liquidity pool',
    'liquidity-pool-research-checklist.md': 'liquidity pool checklist',
  };
  for (const [file, query] of Object.entries(expected)) {
    const source = readFileSync(new URL(file, articlesDir), 'utf8');
    assert.match(source, new RegExp(`^primaryQuery: "${query}"$`, 'm'));
  }
  const v3v4 = readFileSync(new URL('uniswap-v3-vs-v4.md', articlesDir), 'utf8');
  const v4arch = readFileSync(new URL('uniswap-v4-architecture-and-hooks.md', articlesDir), 'utf8');
  const v3v4Keywords = v3v4.match(/^keywords:\s*"([^"]+)"/m)?.[1] ?? '';
  const v4archKeywords = v4arch.match(/^keywords:\s*"([^"]+)"/m)?.[1] ?? '';
  assert.equal(/singleton poolmanager/i.test(v3v4Keywords), false, 'architecture vocabulary must not sit on the comparison page');
  assert.equal(/flash accounting/i.test(v3v4Keywords), false, 'architecture vocabulary must not sit on the comparison page');
  assert.match(v4archKeywords, /flash accounting/i);
});

test('launch copy uses the sourced 49.5% result and discloses Bancor funding', () => {
  const source = readFileSync(new URL('../docs/launch-and-community-drafts.md', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /80% of Uniswap v3 LPs underperform/i);
  assert.match(source, /49\.5%/);
  assert.match(source, /commissioned by Bancor/i);
  assert.doesNotMatch(source, /Over the past few months, our team has been compiling/i);
  assert.doesNotMatch(source, /open-source research publication/i);
});

test('phase-one calculators contain no pool API, wallet, or transaction integration', () => {
  for (const file of ['impermanent-loss-calculator.astro', 'uniswap-v3-liquidity-calculator.astro', 'meteora-dlmm-calculator.astro']) {
    const source = readFileSync(new URL(`../src/pages/tools/${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /\bfetch\s*\(/);
    assert.doesNotMatch(source, /window\.ethereum|connectWallet|signTransaction|GeckoTerminal|DefiLlama API/i);
  }
});

test('guide bylines are organizational and publication dates are honest', () => {
  for (const file of readdirSync(articlesDir).filter((name) => name.endsWith('.md'))) {
    const source = readFileSync(new URL(file, articlesDir), 'utf8');
    const author = source.match(/^author:\s*"([^"]+)"/m)?.[1];
    const published = source.match(/^date:\s*"?([^"\n]+)"?/m)?.[1];
    const reviewed = source.match(/^lastReviewed:\s*"?([^"\n]+)"?/m)?.[1];
    const added = execFileSync('git', ['log', '--diff-filter=A', '--follow', '--format=%cs', '--', `src/content/articles/${file}`], { cwd: new URL('../', import.meta.url), encoding: 'utf8' })
      .trim().split('\n').filter(Boolean).at(-1);
    const expectedPublished = added < '2026-09-09' ? '2026-09-09' : added;
    assert.equal(author, 'LiquidityPools Editorial Team', `${file} has a personal or unknown byline`);
    assert.equal(published, expectedPublished, `${file} date does not match its first public date`);
    assert.ok(reviewed && published && reviewed >= published, `${file} was reviewed before publication`);
  }
});

test('guides contain no fictional bylines, credential claims, or attributed Desk Field Notes', () => {
  const prohibited = /Dr\. Elena Rostova|Marcus Vance|Dr\. Kieran Thorne|Siddharth Mehta|Aria Chen|\bPh\.?D\b|\bCFA(?:\s+Charterholder)?\b/i;
  for (const file of readdirSync(articlesDir).filter((name) => name.endsWith('.md'))) {
    const source = readFileSync(new URL(file, articlesDir), 'utf8');
    assert.doesNotMatch(source, prohibited, `${file} contains a fictional identity or credential`);
    assert.doesNotMatch(source, /Desk Field Note|Field Note from/i, `${file} contains an attributed field note`);
  }
});
