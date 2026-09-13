import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_IMPERMANENT_LOSS_STATE,
  decodeImpermanentLossState,
  encodeImpermanentLossState,
} from '../src/lib/calculators/url-state.mjs';

test('impermanent-loss share state round-trips through a stable query string', () => {
  const state = {
    ...DEFAULT_IMPERMANENT_LOSS_STATE,
    mode: 'concentrated',
    weightA: 0.8,
    priceA1: 4200,
    lowerPrice: 1800,
    upperPrice: 4800,
    feesEarned: 412.5,
  };
  const encoded = encodeImpermanentLossState(state);
  assert.equal(encoded, 'mode=concentrated&a0=2000&a1=4200&b0=1&b1=1&capital=10000&fees=412.5&days=45&weight=0.8&lower=1800&upper=4800');
  assert.deepEqual(decodeImpermanentLossState(`?${encoded}`), state);
});

test('invalid share parameters fall back without accepting unsafe model values', () => {
  const restored = decodeImpermanentLossState('?mode=wallet&a0=-1&days=0&weight=2&lower=nope');
  assert.deepEqual(restored, DEFAULT_IMPERMANENT_LOSS_STATE);
});
