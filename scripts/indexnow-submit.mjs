#!/usr/bin/env node
/**
 * IndexNow submission script for LiquidityPools.app
 * Submits all pages to Bing, Yandex, Naver, Seznam for instant indexing
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOST = 'liquiditypools.app';
const KEY = '8d7f2a1b9c3e4056a782d1e9f4c3b5a6';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const articlesDir = path.resolve(__dirname, '../src/content/articles');
const articleSlugs = fs.readdirSync(articlesDir)
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.replace(/\.md$/, ''))
  .sort();

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/about/`,
  `https://${HOST}/guides/`,
  `https://${HOST}/topics/`,
  `https://${HOST}/tools/`,
  `https://${HOST}/tools/impermanent-loss-calculator/`,
  `https://${HOST}/tools/liquidity-pool-calculator/`,
  `https://${HOST}/tools/lp-profit-calculator/`,
  `https://${HOST}/tools/uniswap-v3-liquidity-calculator/`,
  ...articleSlugs.map((slug) => `https://${HOST}/guides/${slug}/`)
];

async function submitIndexNow(endpoint, serviceName) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS
  };

  try {
    console.log(`[IndexNow] Submitting ${URLS.length} URLs to ${serviceName} (${endpoint})...`);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log(`[IndexNow] ${serviceName} responded: HTTP ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
      console.log(`✅ [IndexNow] ${serviceName} successfully accepted the batch!`);
      return true;
    } else {
      const text = await res.text();
      console.warn(`⚠️ [IndexNow] ${serviceName} returned status ${res.status}: ${text}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ [IndexNow] Error submitting to ${serviceName}:`, err.message);
    return false;
  }
}

async function main() {
  console.log(`=== LiquidityPools.app Instant Search Indexing Submission ===`);
  console.log(`Target Host: ${HOST}`);
  console.log(`Key File: ${KEY_LOCATION}`);
  console.log(`Total URLs: ${URLS.length}\n`);

  const endpoints = [
    { url: 'https://api.indexnow.org/indexnow', name: 'IndexNow Global (Bing/Yandex/Seznam)' },
    { url: 'https://www.bing.com/indexnow', name: 'Microsoft Bing Direct' }
  ];

  for (const ep of endpoints) {
    await submitIndexNow(ep.url, ep.name);
  }
  console.log(`\n🎉 IndexNow submission cycle finished.`);
}

main().catch(console.error);
