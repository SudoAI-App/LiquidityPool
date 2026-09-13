export const workedExamples = {
  impermanentLoss: [
    { label: '50/50 unchanged', inputs: { priceA0: 100, priceA1: 100, priceB0: 1, priceB1: 1, capital: 10000, weightA: 0.5 }, expected: { impermanentLoss: 0, holdValue: 10000 } },
    { label: '50/50 doubles', inputs: { priceA0: 100, priceA1: 200, priceB0: 1, priceB1: 1, capital: 10000, weightA: 0.5 }, expected: { impermanentLoss: -0.057190958417936644, holdValue: 15000 } },
    { label: '50/50 quadruples', inputs: { priceA0: 100, priceA1: 400, priceB0: 1, priceB1: 1, capital: 10000, weightA: 0.5 }, expected: { impermanentLoss: -0.2, holdValue: 25000 } },
    { label: '80/20 doubles', inputs: { priceA0: 100, priceA1: 200, priceB0: 1, priceB1: 1, capital: 10000, weightA: 0.8 }, expected: { impermanentLoss: -0.032721596337639824, holdValue: 18000 } },
    { label: '95/5 halves', inputs: { priceA0: 100, priceA1: 50, priceB0: 1, priceB1: 1, capital: 10000, weightA: 0.95 }, expected: { impermanentLoss: -0.01403340586535462, holdValue: 5250 } },
  ],
  concentratedLiquidity: [
    { label: 'No price move', inputs: { entryPrice: 3000, lowerPrice: 2500, upperPrice: 3600, exitPrice: 3000, capital: 10000 }, expected: { positionValue: 10000, holdValue: 10000, impermanentLoss: 0, rangeState: 'inside' } },
    { label: 'Inside range at 3300', inputs: { entryPrice: 3000, lowerPrice: 2500, upperPrice: 3600, exitPrice: 3300, capital: 10000 }, expected: { positionValue: 10363.28881754693, holdValue: 10500, impermanentLoss: -0.013020112614577695, rangeState: 'inside' } },
    { label: 'At lower bound', inputs: { entryPrice: 3000, lowerPrice: 2500, upperPrice: 3600, exitPrice: 2500, capital: 10000 }, expected: { positionValue: 8731.02131254305, holdValue: 9166.666666666664, impermanentLoss: -0.047524947722576205, rangeState: 'inside' } },
    { label: 'Below range', inputs: { entryPrice: 3000, lowerPrice: 2500, upperPrice: 3600, exitPrice: 2000, capital: 10000 }, expected: { positionValue: 6984.8170500344395, holdValue: 8333.333333333332, impermanentLoss: -0.16182195399586718, rangeState: 'below' } },
    { label: 'Above range', inputs: { entryPrice: 3000, lowerPrice: 2500, upperPrice: 3600, exitPrice: 4200, capital: 10000 }, expected: { positionValue: 10477.225575, holdValue: 12000, impermanentLoss: -0.1268978688, rangeState: 'above' } },
  ],
  poolFees: [
    { label: 'Fees only', inputs: { feeTierPercent: 0.05, capital: 100000, dailyVolume: 40000000, activeLiquidity: 5000000, timeInRangePercent: 100, days: 30 }, expected: { feeAprPercent: 143.1372549, incentiveIncome: 0, netIncome: 11764.705882 } },
    { label: 'Half time in range', inputs: { feeTierPercent: 0.05, capital: 100000, dailyVolume: 40000000, activeLiquidity: 5000000, timeInRangePercent: 50, days: 30 }, expected: { feeAprPercent: 71.56862745, incentiveIncome: 0, netIncome: 5882.352941 } },
    { label: 'Separate 12% rewards', inputs: { feeTierPercent: 0.01, capital: 50000, dailyVolume: 10000000, activeLiquidity: 2000000, timeInRangePercent: 80, days: 90, incentiveAprPercent: 12 }, expected: { feeAprPercent: 14.24390244, incentiveIncome: 1479.452055, netIncome: 3235.549616 } },
    { label: 'Gas exceeds fees', inputs: { feeTierPercent: 0.01, capital: 1000, dailyVolume: 100000, activeLiquidity: 1000000, timeInRangePercent: 100, days: 7, gasPerTransaction: 25, transactionCount: 4 }, expected: { feeAprPercent: 0.36463536, incentiveIncome: 0, netIncome: -99.93006993 } },
    { label: 'Zero routed volume', inputs: { feeTierPercent: 0.3, capital: 25000, dailyVolume: 0, activeLiquidity: 1000000, timeInRangePercent: 100, days: 365, incentiveAprPercent: 8 }, expected: { feeAprPercent: 0, incentiveIncome: 2000, netIncome: 2000 } },
  ],
  lpProfit: [
    { label: 'Fees cover 2x IL', inputs: { priceA0: 100, priceA1: 200, priceB0: 1, priceB1: 1, capital: 10000, feesEarned: 1000, days: 30 }, expected: { netVsHold: 142.135624, netReturnPercent: 1.42135624 } },
    { label: 'No fees, no move', inputs: { priceA0: 100, priceA1: 100, priceB0: 1, priceB1: 1, capital: 10000, days: 30 }, expected: { netVsHold: 0, netReturnPercent: 0 } },
    { label: 'Rewards shown separately', inputs: { priceA0: 100, priceA1: 100, priceB0: 1, priceB1: 1, capital: 10000, rewardsEarned: 250, days: 30 }, expected: { netVsHold: 250, netReturnPercent: 2.5 } },
    { label: 'Costs exceed revenue', inputs: { priceA0: 100, priceA1: 100, priceB0: 1, priceB1: 1, capital: 5000, feesEarned: 20, costs: 75, days: 7 }, expected: { netVsHold: -55, netReturnPercent: -1.1 } },
    { label: 'Weighted 80/20 move', inputs: { priceA0: 100, priceA1: 200, priceB0: 1, priceB1: 1, capital: 10000, weightA: 0.8, feesEarned: 300, days: 30 }, expected: { netVsHold: -288.9887340775167, netReturnPercent: -2.889887340775167 } },
  ],
  meteoraDlmm: [
    { label: 'Spot, no move', inputs: { anchorPrice: 20, binStepBps: 25, binsBelow: 2, binsAbove: 2, shape: 'spot', capital: 10000, endBin: 0, baseFactor: 10000 }, expected: { lowerPrice: 19.90037375, upperPrice: 20.100125, totalFeePercent: 0.25, positionValue: 10000, rangeState: 'inside' } },
    { label: 'Curve, two bins up', inputs: { anchorPrice: 20, binStepBps: 25, binsBelow: 4, binsAbove: 4, shape: 'curve', capital: 10000, endBin: 2, baseFactor: 10000 }, expected: { lowerPrice: 19.801243777234788, upperPrice: 20.200751250781245, totalFeePercent: 0.25, positionValue: 10015.40517123013, rangeState: 'inside' } },
    { label: 'Bid-Ask, below range', inputs: { anchorPrice: 20, binStepBps: 50, binsBelow: 3, binsAbove: 3, shape: 'bidAsk', capital: 10000, endBin: -5, baseFactor: 10000 }, expected: { lowerPrice: 19.702975186196202, upperPrice: 20.30150249999999, totalFeePercent: 0.5, positionValue: 9813.56771818139, rangeState: 'below' } },
    { label: 'One-bin spot', inputs: { anchorPrice: 1, binStepBps: 1, binsBelow: 0, binsAbove: 0, shape: 'spot', capital: 5000, endBin: 0, baseFactor: 10000 }, expected: { lowerPrice: 1, upperPrice: 1, totalFeePercent: 0.01, positionValue: 5000, rangeState: 'inside' } },
    { label: 'Dynamic fee capped', inputs: { anchorPrice: 100, binStepBps: 100, binsBelow: 2, binsAbove: 2, shape: 'curve', capital: 20000, endBin: 3, baseFactor: 10000, variableFeeControl: 1000000000, volatilityAccumulator: 1000000 }, expected: { lowerPrice: 98.02960494069208, upperPrice: 102.01, totalFeePercent: 10, positionValue: 20070.744719589606, rangeState: 'above' } },
  ],
};
