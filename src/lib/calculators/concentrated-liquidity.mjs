export function concentratedTokenAmounts(liquidity, price, lowerPrice, upperPrice) {
  const boundedPrice = Math.min(Math.max(price, lowerPrice), upperPrice);
  const sqrtPrice = Math.sqrt(boundedPrice);
  return {
    base: Math.max(0, liquidity * (1 / sqrtPrice - 1 / Math.sqrt(upperPrice))),
    quote: Math.max(0, liquidity * (sqrtPrice - Math.sqrt(lowerPrice))),
  };
}

export function calculateConcentratedPosition({
  entryPrice,
  lowerPrice,
  upperPrice,
  exitPrice,
  capital,
  dailyVolume = 0,
  activeLiquidity = 0,
  feeRate = 0,
  timeInRange = 1,
  days = 1,
}) {
  if (!(lowerPrice > 0 && upperPrice > lowerPrice && entryPrice >= lowerPrice && entryPrice <= upperPrice && exitPrice > 0 && capital > 0)) {
    throw new RangeError('Use positive prices with the entry price inside the lower and upper bounds.');
  }
  const sqrtEntry = Math.sqrt(entryPrice);
  const denominator = 2 * sqrtEntry - entryPrice / Math.sqrt(upperPrice) - Math.sqrt(lowerPrice);
  const liquidity = capital / denominator;
  const entryTokens = concentratedTokenAmounts(liquidity, entryPrice, lowerPrice, upperPrice);
  const exitTokens = concentratedTokenAmounts(liquidity, exitPrice, lowerPrice, upperPrice);
  const positionValue = exitTokens.base * exitPrice + exitTokens.quote;
  const holdValue = entryTokens.base * exitPrice + entryTokens.quote;
  const divergence = positionValue - holdValue;
  const share = activeLiquidity > 0 ? capital / (activeLiquidity + capital) : 0;
  const feeIncome = Math.max(0, dailyVolume) * Math.max(1, days) * Math.max(0, feeRate)
    * share * Math.min(1, Math.max(0, timeInRange));
  const rangeState = exitPrice < lowerPrice ? 'below' : exitPrice > upperPrice ? 'above' : 'inside';
  const entryBaseShare = (entryTokens.base * entryPrice) / capital;
  const exitBaseShare = positionValue > 0 ? (exitTokens.base * exitPrice) / positionValue : 0;
  return {
    liquidity,
    capitalEfficiency: 2 * sqrtEntry / denominator,
    entryTokens,
    exitTokens,
    entryBaseShare,
    exitBaseShare,
    positionValue,
    holdValue,
    divergence,
    impermanentLoss: positionValue / holdValue - 1,
    feeIncome,
    feeAprPercent: (feeIncome / capital) * (365 / Math.max(1, days)) * 100,
    netVsHold: divergence + feeIncome,
    breakEvenFees: Math.abs(divergence),
    rangeState,
  };
}

export function concentratedIlCurve(inputs, minimumRatio = 0.25, maximumRatio = 4, points = 41) {
  const logarithmicSpan = Math.log(maximumRatio / minimumRatio);
  return Array.from({ length: points }, (_, index) => {
    const ratio = minimumRatio * Math.exp(logarithmicSpan * index / (points - 1));
    const result = calculateConcentratedPosition({ ...inputs, exitPrice: inputs.entryPrice * ratio });
    return { ratio, impermanentLoss: result.impermanentLoss };
  });
}
