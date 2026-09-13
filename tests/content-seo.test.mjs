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
  };
  for (const [file, query] of Object.entries(expected)) {
    const source = readFileSync(new URL(file, articlesDir), 'utf8');
    assert.match(source, new RegExp(`^primaryQuery: "${query}"$`, 'm'));
  }
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

test('guide authors, dates, review dates, and Desk Field Notes stay unchanged', () => {
  for (const file of readdirSync(articlesDir).filter((name) => name.endsWith('.md'))) {
    const current = readFileSync(new URL(file, articlesDir), 'utf8');
    const before = execFileSync('git', ['show', `HEAD:src/content/articles/${file}`], { encoding: 'utf8' });
    for (const field of ['author', 'date', 'lastReviewed']) {
      assert.equal(current.match(new RegExp(`^${field}:.*$`, 'm'))?.[0], before.match(new RegExp(`^${field}:.*$`, 'm'))?.[0], `${field} changed in ${file}`);
    }
    assert.deepEqual(current.match(/^> \[!TIP\][\s\S]*?(?=\n\n)/gm) ?? [], before.match(/^> \[!TIP\][\s\S]*?(?=\n\n)/gm) ?? [], `field note changed in ${file}`);
  }
});
