import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateWeightedPosition,
  weightedImpermanentLoss,
} from '../src/lib/calculators/impermanent-loss.mjs';
import { calculateConcentratedPosition } from '../src/lib/calculators/concentrated-liquidity.mjs';
import { calculatePoolFeeReturns } from '../src/lib/calculators/pool-fees.mjs';
import { calculateLpProfit } from '../src/lib/calculators/lp-profit.mjs';
import {
  binPrice,
  calculateDlmmScenario,
  dlmmDistribution,
} from '../src/lib/calculators/meteora-dlmm.mjs';
import { workedExamples } from '../src/lib/calculators/worked-examples.mjs';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected} within ${tolerance}`);
};

test('methodology exposes five fixed vectors for every calculator model', () => {
  assert.deepEqual(Object.fromEntries(Object.entries(workedExamples).map(([name, examples]) => [name, examples.length])), {
    impermanentLoss: 5,
    concentratedLiquidity: 5,
    poolFees: 5,
    lpProfit: 5,
    meteoraDlmm: 5,
  });
});

test('50/50 and weighted-pool IL match the methodology vectors', () => {
  for (const example of workedExamples.impermanentLoss) {
    const result = calculateWeightedPosition(example.inputs);
    closeTo(result.impermanentLoss, example.expected.impermanentLoss, 1e-10);
    closeTo(result.holdValue, example.expected.holdValue, 1e-6);
  }
  closeTo(weightedImpermanentLoss(2, 0.5), -0.057190958417936644, 1e-12);
  closeTo(weightedImpermanentLoss(4, 0.5), -0.2, 1e-12);
});

test('concentrated-liquidity ranges match every methodology vector', () => {
  for (const example of workedExamples.concentratedLiquidity) {
    const result = calculateConcentratedPosition(example.inputs);
    closeTo(result.positionValue, example.expected.positionValue, 1e-6);
    closeTo(result.holdValue, example.expected.holdValue, 1e-6);
    closeTo(result.impermanentLoss, example.expected.impermanentLoss, 1e-10);
    assert.equal(result.rangeState, example.expected.rangeState);
  }
  const atUpper = calculateConcentratedPosition({ entryPrice: 120, lowerPrice: 80, upperPrice: 120, exitPrice: 120, capital: 10000 });
  closeTo(atUpper.positionValue, 10000, 1e-6);
  assert.equal(atUpper.rangeState, 'inside');
});

test('fee and reward APR are separate and match the methodology vectors', () => {
  for (const example of workedExamples.poolFees) {
    const result = calculatePoolFeeReturns(example.inputs);
    closeTo(result.feeAprPercent, example.expected.feeAprPercent, 1e-8);
    closeTo(result.incentiveIncome, example.expected.incentiveIncome, 1e-6);
    closeTo(result.netIncome, example.expected.netIncome, 1e-6);
  }
});

test('LP net-return ledger matches every methodology vector', () => {
  for (const example of workedExamples.lpProfit) {
    const result = calculateLpProfit(example.inputs);
    closeTo(result.netVsHold, example.expected.netVsHold, 1e-6);
    closeTo(result.netReturnPercent, example.expected.netReturnPercent, 1e-8);
  }
});

test('Meteora uses geometric bin prices, distinct discrete shapes, and official fee units', () => {
  closeTo(binPrice(20, 1, 25), 20.05, 1e-12);
  assert.deepEqual(dlmmDistribution('spot', -2, 2).map((bin) => bin.weight), [0.2, 0.2, 0.2, 0.2, 0.2]);
  closeTo(dlmmDistribution('curve', -2, 2)[2].weight, 0.4026199468942474, 1e-12);
  closeTo(dlmmDistribution('bidAsk', -2, 2)[0].weight, 0.38735733769893455, 1e-12);
  closeTo(dlmmDistribution('curve', -2, 2).reduce((sum, bin) => sum + bin.xWeight, 0), 1, 1e-12);
  closeTo(dlmmDistribution('curve', -2, 2).reduce((sum, bin) => sum + bin.yWeight, 0), 1, 1e-12);

  for (const example of workedExamples.meteoraDlmm) {
    const result = calculateDlmmScenario(example.inputs);
    closeTo(result.lowerPrice, example.expected.lowerPrice, 1e-8);
    closeTo(result.upperPrice, example.expected.upperPrice, 1e-8);
    closeTo(result.totalFeePercent, example.expected.totalFeePercent, 1e-8);
    closeTo(result.positionValue, example.expected.positionValue, 1e-6);
    assert.equal(result.rangeState, example.expected.rangeState);
  }
  const activeBinFees = calculateDlmmScenario({ anchorPrice: 20, binStepBps: 25, binsBelow: 2, binsAbove: 2, shape: 'curve', capital: 10000, endBin: 1, baseFactor: 10000, dailyVolume: 1000000, activeLiquidity: 500000, days: 1 });
  assert.ok(activeBinFees.feeIncome > 0);
  closeTo(activeBinFees.activePositionValue, activeBinFees.bins.find((bin) => bin.id === 1).liquidityValue, 1e-12);
  const outsideFees = calculateDlmmScenario({ anchorPrice: 20, binStepBps: 25, binsBelow: 2, binsAbove: 2, shape: 'curve', capital: 10000, endBin: 3, baseFactor: 10000, dailyVolume: 1000000, activeLiquidity: 500000, days: 1 });
  assert.equal(outsideFees.feeIncome, 0);
});
