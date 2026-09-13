const FEE_PRECISION = 1_000_000_000;
const MAX_FEE_PERCENT = 10;

export function binPrice(anchorPrice, binId, binStepBps) {
  if (!(anchorPrice > 0 && binStepBps > 0)) throw new RangeError('Anchor price and bin step must be positive.');
  return anchorPrice * (1 + binStepBps / 10_000) ** binId;
}

export function dlmmDistribution(shape, lowerBin, upperBin) {
  if (!['spot', 'curve', 'bidAsk'].includes(shape)) throw new RangeError('Unknown DLMM distribution.');
  if (!(Number.isInteger(lowerBin) && Number.isInteger(upperBin) && lowerBin <= 0 && upperBin >= 0)) {
    throw new RangeError('The bin range must use integer bounds around active bin zero.');
  }
  const standardDeviation = Math.max((upperBin - lowerBin) / 4, 1);
  const variance = standardDeviation ** 2;
  const raw = [];
  for (let id = lowerBin; id <= upperBin; id += 1) {
    const gaussianDensity = Math.exp(-(id ** 2) / (2 * variance));
    const value = shape === 'spot' ? 1 : shape === 'curve' ? gaussianDensity : 1 / gaussianDensity;
    raw.push({ id, rawWeight: value });
  }
  const totalX = raw.reduce((sum, bin) => sum + (bin.id > 0 ? bin.rawWeight : bin.id === 0 ? bin.rawWeight / 2 : 0), 0);
  const totalY = raw.reduce((sum, bin) => sum + (bin.id < 0 ? bin.rawWeight : bin.id === 0 ? bin.rawWeight / 2 : 0), 0);
  return raw.map(({ id, rawWeight }) => {
    const xWeight = id > 0 ? rawWeight / totalX : id === 0 ? rawWeight / 2 / totalX : 0;
    const yWeight = id < 0 ? rawWeight / totalY : id === 0 ? rawWeight / 2 / totalY : 0;
    return { id, xWeight, yWeight, weight: (xWeight + yWeight) / 2 };
  });
}

export function dlmmFeeRates({
  binStepBps,
  baseFactor,
  baseFeePowerFactor = 0,
  variableFeeControl = 0,
  volatilityAccumulator = 0,
}) {
  const baseRaw = baseFactor * binStepBps * 10 * 10 ** baseFeePowerFactor;
  const variableRaw = Math.ceil(
    variableFeeControl * (volatilityAccumulator * binStepBps) ** 2 / 100_000_000_000,
  );
  const baseFeePercent = baseRaw / FEE_PRECISION * 100;
  const variableFeePercent = variableRaw / FEE_PRECISION * 100;
  return {
    baseFeePercent,
    variableFeePercent,
    totalFeePercent: Math.min(MAX_FEE_PERCENT, baseFeePercent + variableFeePercent),
  };
}

export function calculateDlmmScenario({
  anchorPrice,
  binStepBps,
  binsBelow,
  binsAbove,
  shape,
  capital,
  endBin,
  baseFactor,
  baseFeePowerFactor = 0,
  variableFeeControl = 0,
  volatilityAccumulator = Math.abs(endBin) * 10_000,
  dailyVolume = 0,
  activeLiquidity = 0,
  timeInRangePercent = 100,
  days = 1,
  lpFeeSharePercent = 90,
  initialBaseSharePercent = 50,
}) {
  if (!(capital > 0 && Number.isInteger(binsBelow) && Number.isInteger(binsAbove)
    && binsBelow >= 0 && binsAbove >= 0 && Number.isInteger(endBin))) {
    throw new RangeError('Capital must be positive and bin counts and movement must be integers.');
  }
  const lowerBin = -binsBelow;
  const upperBin = binsAbove;
  const distribution = dlmmDistribution(shape, lowerBin, upperBin);
  const baseShare = Math.min(100, Math.max(0, initialBaseSharePercent)) / 100;
  const totalBase = capital * baseShare / anchorPrice;
  const totalQuote = capital * (1 - baseShare);
  const bins = distribution.map(({ id, xWeight, yWeight }) => {
    const price = binPrice(anchorPrice, id, binStepBps);
    const initialBase = totalBase * xWeight;
    const initialQuote = totalQuote * yWeight;
    const liquidityValue = price * initialBase + initialQuote;
    return {
      id,
      xWeight,
      yWeight,
      weight: (initialBase * anchorPrice + initialQuote) / capital,
      price,
      liquidityValue,
      initialBase,
      initialQuote,
    };
  });

  const exitPrice = binPrice(anchorPrice, endBin, binStepBps);
  const valueAtExit = (bin) => {
    if (bin.id < endBin) return bin.liquidityValue;
    if (bin.id > endBin) return bin.liquidityValue / bin.price * exitPrice;
    return bin.liquidityValue;
  };
  const positionValue = bins.reduce((sum, bin) => sum + valueAtExit(bin), 0);
  const initialBase = bins.reduce((sum, bin) => sum + bin.initialBase, 0);
  const initialQuote = bins.reduce((sum, bin) => sum + bin.initialQuote, 0);
  const holdValue = initialBase * exitPrice + initialQuote;
  const rangeState = endBin < lowerBin ? 'below' : endBin > upperBin ? 'above' : 'inside';
  const activeBin = bins.find((bin) => bin.id === endBin);
  const activePositionValue = activeBin ? activeBin.liquidityValue : 0;
  const activeShare = activePositionValue / (Math.max(0, activeLiquidity) + activePositionValue || 1);
  const fees = dlmmFeeRates({
    binStepBps,
    baseFactor,
    baseFeePowerFactor,
    variableFeeControl,
    volatilityAccumulator,
  });
  const feeIncome = rangeState === 'inside' ? Math.max(0, dailyVolume) * Math.max(1, days) * (fees.totalFeePercent / 100)
    * activeShare * (Math.min(100, Math.max(0, timeInRangePercent)) / 100)
    * (Math.min(100, Math.max(0, lpFeeSharePercent)) / 100) : 0;
  return {
    bins,
    lowerPrice: binPrice(anchorPrice, lowerBin, binStepBps),
    upperPrice: binPrice(anchorPrice, upperBin, binStepBps),
    exitPrice,
    positionValue,
    holdValue,
    impermanentLoss: positionValue / holdValue - 1,
    rangeState,
    activePositionValue,
    activeShare,
    feeIncome,
    netVsHold: positionValue - holdValue + feeIncome,
    ...fees,
  };
}
