export function calculatePoolFeeReturns({
  feeTierPercent,
  capital,
  dailyVolume,
  activeLiquidity,
  timeInRangePercent,
  days,
  gasPerTransaction = 0,
  transactionCount = 0,
  incentiveAprPercent = 0,
}) {
  if (!(capital > 0 && days > 0) || feeTierPercent < 0 || dailyVolume < 0 || activeLiquidity < 0) {
    throw new RangeError('Capital and days must be positive; rates, volume, and liquidity cannot be negative.');
  }
  const share = capital / (activeLiquidity + capital);
  const timeInRange = Math.min(100, Math.max(0, timeInRangePercent)) / 100;
  const dailyFeeIncome = (feeTierPercent / 100) * dailyVolume * share * timeInRange;
  const feeIncome = dailyFeeIncome * days;
  const feeAprPercent = (feeIncome / capital) * (365 / days) * 100;
  const incentiveIncome = capital * (Math.max(0, incentiveAprPercent) / 100) * (days / 365);
  const gasCost = Math.max(0, gasPerTransaction) * Math.max(0, transactionCount);
  const netIncome = feeIncome + incentiveIncome - gasCost;
  return {
    share,
    dailyFeeIncome,
    feeIncome,
    feeAprPercent,
    incentiveIncome,
    incentiveAprPercent: Math.max(0, incentiveAprPercent),
    grossIncome: feeIncome + incentiveIncome,
    gasCost,
    netIncome,
    netPeriodYieldPercent: netIncome / capital * 100,
    combinedAprPercent: (netIncome / capital) * (365 / days) * 100,
    dailyFeeYieldBps: dailyFeeIncome / capital * 10000,
  };
}
