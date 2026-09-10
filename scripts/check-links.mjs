#!/usr/bin/env node
/**
 * Verify that every cited source in the guide library and on the tool pages
 * still resolves. Network access is required, so this is a manual check rather
 * than part of `pnpm content:audit`.
 *
 * Usage:
 *   pnpm links:check            # every unique source URL
 *   pnpm links:check --slow     # 1 request at a time, for rate-limited hosts
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const articlesDir = join(root, 'src/content/articles');
const toolsDir = join(root, 'src/pages/tools');
const concurrency = process.argv.includes('--slow') ? 1 : 6;
const timeoutMs = 20000;

const sources = new Map();

const record = (url, origin) => {
  if (!sources.has(url)) sources.set(url, new Set());
  sources.get(url).add(origin);
};

for (const file of readdirSync(articlesDir).filter((name) => name.endsWith('.md'))) {
  const body = readFileSync(join(articlesDir, file), 'utf8');
  for (const match of body.matchAll(/^\[\d+\]:\s+(https?:\/\/\S+)/gm)) {
    record(match[1], file.replace(/\.md$/, ''));
  }
}

for (const file of readdirSync(toolsDir).filter((name) => name.endsWith('.astro'))) {
  const body = readFileSync(join(toolsDir, file), 'utf8');
  const sourceBlock = body.slice(body.indexOf('id="sources"'));
  for (const match of sourceBlock.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
    record(match[1], `tools/${file.replace(/\.astro$/, '')}`);
  }
}

const urls = [...sources.keys()].sort();
console.log(`Checking ${urls.length} unique sources across ${readdirSync(articlesDir).length} guides and the tool pages...\n`);

const failures = [];

async function head(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    // Some hosts reject HEAD but serve GET.
    if (response.status === 403 || response.status === 405 || response.status === 501) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal });
    }
    return { status: response.status, finalUrl: response.url };
  } catch (error) {
    return { status: 0, error: error.name === 'AbortError' ? 'timeout' : error.message };
  } finally {
    clearTimeout(timer);
  }
}

let index = 0;
async function worker() {
  while (index < urls.length) {
    const url = urls[index++];
    const result = await head(url);
    const cited = [...sources.get(url)].sort().join(', ');
    if (result.status >= 200 && result.status < 400) {
      console.log(`  ok   ${result.status}  ${url}`);
    } else {
      console.log(`  FAIL ${result.status || result.error}  ${url}`);
      failures.push({ url, status: result.status || result.error, cited });
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));

const statuses = new Set(failures.map((failure) => failure.status));
if (failures.length === urls.length && statuses.size === 1) {
  const [status] = statuses;
  console.error(`\nLINK CHECK INCONCLUSIVE — every request returned ${status}.`);
  console.error('That pattern means outbound network access is blocked or proxied, not that the sources are dead.');
  console.error('Re-run this check from a machine with direct internet access before acting on the result.');
  process.exit(2);
}

if (failures.length) {
  console.error(`\nLINK CHECK FAILED — ${failures.length} of ${urls.length} sources did not resolve:`);
  for (const failure of failures) {
    console.error(`- ${failure.url} (${failure.status})`);
    console.error(`  cited in: ${failure.cited}`);
  }
  process.exit(1);
}

console.log(`\nLINK CHECK PASSED — all ${urls.length} cited sources resolved.`);
