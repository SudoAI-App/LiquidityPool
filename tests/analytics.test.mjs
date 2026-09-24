import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const routes = [
  ['impermanent-loss-calculator', 'impermanent_loss'],
  ['liquidity-pool-calculator', 'liquidity_pool_fee'],
  ['lp-profit-calculator', 'lp_profit'],
  ['uniswap-v3-liquidity-calculator', 'uniswap_v3_liquidity'],
  ['meteora-dlmm-calculator', 'meteora_dlmm'],
];

function executeAnalytics(slug, calculator) {
  const html = readFileSync(new URL(`../dist/public/tools/${slug}/index.html`, import.meta.url), 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]).find((source) => source.includes('calculatorInteraction'));
  assert.ok(script, `analytics script missing from ${slug}`);
  const listeners = {};
  const document = {
    head: { appendChild() {} },
    readyState: 'complete',
    createElement: () => ({}),
    getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }],
    addEventListener: (name, handler) => { listeners[name] = handler; },
    querySelector: () => null,
  };
  const storage = new Map();
  const context = {
    document,
    location: { hostname: 'liquiditypools.app', search: '', href: `https://liquiditypools.app/tools/${slug}/` },
    navigator: { userAgent: 'Mozilla/5.0', webdriver: false },
    screen: { width: 1440, height: 900 },
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    URL,
    URLSearchParams,
    Date,
    console,
    addEventListener: (name, handler) => { listeners[name] = handler; },
  };
  context.window = context;
  vm.runInNewContext(script, context);
  const form = { getAttribute: () => calculator };
  const input = { closest: (selector) => selector === '[data-calculator]' ? form : null };
  listeners.input({ type: 'input', target: input });
  listeners.input({ type: 'input', target: input });
  listeners.change({ type: 'change', target: input });
  const events = context.dataLayer.filter((args) => args[0] === 'event' && args[1] === 'calculator_used');
  return events;
}

for (const [slug, calculator] of routes) {
  test(`calculator_used fires once per page view on ${slug}`, () => {
    const events = executeAnalytics(slug, calculator);
    assert.equal(events.length, 1);
    assert.equal(events[0][2].calculator, calculator);
  });
}
