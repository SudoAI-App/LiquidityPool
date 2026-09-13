/**
 * Divergence of a two-token constant-mean pool against holding the entry basket.
 * `weightA` is expressed as a fraction, so an 80/20 pool uses 0.8.
 */
export function weightedImpermanentLoss(relativePriceRatio, weightA = 0.5) {
  if (!(relativePriceRatio > 0)) throw new RangeError('Relative price ratio must be positive.');
  if (!(weightA > 0 && weightA < 1)) throw new RangeError('Token A weight must be between 0 and 1.');
  const poolGrowth = relativePriceRatio ** weightA;
  const holdGrowth = weightA * relativePriceRatio + (1 - weightA);
  return poolGrowth / holdGrowth - 1;
}

export function calculateWeightedPosition({
  priceA0,
  priceA1,
  priceB0,
  priceB1,
  capital,
  weightA = 0.5,
  feesEarned = 0,
  days = 1,
}) {
  if (!(priceA0 > 0 && priceA1 > 0 && priceB0 > 0 && priceB1 > 0 && capital > 0)) {
    throw new RangeError('Prices and capital must be positive.');
  }
  if (!(weightA > 0 && weightA < 1)) throw new RangeError('Token A weight must be between 0 and 1.');
  const ratioA = priceA1 / priceA0;
  const ratioB = priceB1 / priceB0;
  const relativePriceRatio = ratioA / ratioB;
  const holdValue = capital * (weightA * ratioA + (1 - weightA) * ratioB);
  const poolValue = capital * ratioA ** weightA * ratioB ** (1 - weightA);
  const impermanentLoss = poolValue / holdValue - 1;
  const divergence = poolValue - holdValue;
  const netVsHold = divergence + feesEarned;
  const feeAprPercent = (feesEarned / capital) * (365 / Math.max(1, days)) * 100;
  return {
    relativePriceRatio,
    holdValue,
    poolValue,
    impermanentLoss,
    divergence,
    feesEarned,
    netVsHold,
    breakEvenFees: Math.abs(divergence),
    feeAprPercent,
  };
}

export function weightedIlCurve(weightA, minimumRatio = 0.25, maximumRatio = 4, points = 41) {
  const logarithmicSpan = Math.log(maximumRatio / minimumRatio);
  return Array.from({ length: points }, (_, index) => {
    const ratio = minimumRatio * Math.exp(logarithmicSpan * index / (points - 1));
    return { ratio, impermanentLoss: weightedImpermanentLoss(ratio, weightA) };
  });
}
