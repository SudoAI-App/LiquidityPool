#!/usr/bin/env node
/**
 * IndexNow submission script for LiquidityPools.app
 * Submits all pages to Bing, Yandex, Naver, Seznam for instant indexing
 */

const HOST = 'liquiditypools.app';
const KEY = '8d7f2a1b9c3e4056a782d1e9f4c3b5a6';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/about/`,
  `https://${HOST}/guides/`,
  `https://${HOST}/topics/`,
  `https://${HOST}/guides/amm-vs-order-book/`,
  `https://${HOST}/guides/automated-market-maker-explained/`,
  `https://${HOST}/guides/concentrated-liquidity-explained/`,
  `https://${HOST}/guides/constant-product-formula/`,
  `https://${HOST}/guides/cross-chain-liquidity-explained/`,
  `https://${HOST}/guides/how-to-evaluate-a-liquidity-pool/`,
  `https://${HOST}/guides/how-to-provide-liquidity/`,
  `https://${HOST}/guides/impermanent-loss-explained/`,
  `https://${HOST}/guides/liquidity-mining-explained/`,
  `https://${HOST}/guides/liquidity-pool-research-checklist/`,
  `https://${HOST}/guides/liquidity-pool-risks/`,
  `https://${HOST}/guides/liquidity-pool-tokens/`,
  `https://${HOST}/guides/liquidity-provider-fees/`,
  `https://${HOST}/guides/market-making-on-amms/`,
  `https://${HOST}/guides/mev-and-liquidity-providers/`,
  `https://${HOST}/guides/onchain-liquidity-metrics/`,
  `https://${HOST}/guides/range-orders-on-amms/`,
  `https://${HOST}/guides/stablecoin-liquidity-pools/`,
  `https://${HOST}/guides/tvl-explained/`,
  `https://${HOST}/guides/what-is-a-liquidity-pool/`
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
