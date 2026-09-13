import { calculateWeightedPosition } from './impermanent-loss.mjs';

export function calculateLpProfit({
  priceA0,
  priceA1,
  priceB0,
  priceB1,
  capital,
  feesEarned = 0,
  rewardsEarned = 0,
  costs = 0,
  days = 1,
  weightA = 0.5,
}) {
  const position = calculateWeightedPosition({
    priceA0,
    priceA1,
    priceB0,
    priceB1,
    capital,
    weightA,
    feesEarned: 0,
    days,
  });
  const netVsHold = position.divergence + feesEarned + rewardsEarned - costs;
  return {
    ...position,
    feesEarned,
    rewardsEarned,
    costs,
    netVsHold,
    netReturnPercent: netVsHold / capital * 100,
    annualizedNetReturnPercent: (netVsHold / capital) * (365 / Math.max(1, days)) * 100,
  };
}
