---
title: "Gas Costs for Liquidity Providers: The Minimum Viable Position"
seoTitle: "Gas Costs for LPs: The Minimum Viable Position Size"
description: "Gas does not scale with your position, so it decides which strategies you can even use. One table tells you whether yours is viable before you deposit."
category: "Risk & Research"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "gas fees providing liquidity"
keywords: "gas fees providing liquidity, LP gas costs, minimum liquidity position size, rebalancing cost, liquidity pool withdrawal risk, cost of providing liquidity"
featured: false
faq:
  - q: "How much gas does providing liquidity cost?"
    a: "It depends on the network, the hour and the operation. On Ethereum mainnet a new Uniswap v3 position used about 450,000 gas in early October 2026, which cost well under a dollar at the low fees of that month and about $24 at 20 gwei with ETH at $2,700. On a major rollup the same steps usually cost cents or less."
  - q: "What is the minimum size for a liquidity position?"
    a: "The size at which the gas for your whole management cycle is a small share of the fees you expect over the time you hold it. Work it out as days of fees per cycle: if one cycle eats a week or more of fees, the strategy needs a larger position, fewer transactions or a cheaper network."
  - q: "Does rebalancing a position cost more than it earns?"
    a: "Frequently, on small positions. Each re-centre pays gas, locks in the current composition, and may pay a swap fee and price impact. The fee income from the new range has to clear all three before rebalancing is worth doing."
  - q: "How do I reduce gas costs as a liquidity provider?"
    a: "Use wider ranges so rebalancing is rare, claim fees when the amount is large relative to the transaction cost rather than on a calendar, prefer cheaper networks for smaller positions, and avoid strategies whose economics depend on frequent transactions at a size that cannot support them."
---

Gas costs the same whether you deposit \$500 or \$500,000. That one fact decides which strategies are open to you, and it never appears in a yield quote.

It is also why two people running identical ranges on the same pair can end up with opposite results. One was large enough to absorb the transactions. The other was not.

The arithmetic takes two minutes. By the end you will know whether your position size can carry the strategy you have in mind, before the first deposit rather than after the third rebalance.

<figure class="article-figure">
  <img src="/images/guides/lp-gas-costs.webp" alt="Bar chart: one management cycle costs 43% of a year of fees on a $500 position at 20 gwei, 11% on $2,000, 2.2% on $10,000, 0.4% on $50,000, and 2.2% on $500 at 1 gwei." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Gas for one management cycle as a share of a year of fee income: four position sizes at a congested 20 gwei, and the smallest at 1 gwei. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Divide the cost of one complete management cycle by the fees you expect in a week. A ratio above one means a week of fees does not pay for that cycle, however attractive the annualised yield looks.

## Every transaction a position needs

A position needs more transactions than most people expect. Gas is charged per transaction, as the gas the operation uses multiplied by the price per unit of gas at that moment [3]. Your deposit size does not enter the bill.

The gas column below is our own measurement. We took the median of recent Uniswap v3 position-manager transactions on Ethereum mainnet on 1–2 October 2026, about 500 transactions in all.

| What | When | Typical gas on Uniswap v3 | Note |
| :--- | :--- | ---: | :--- |
| Approvals | Before your first deposit | Small, one-off | Signature-based approvals reduce this, they do not remove it |
| An entry swap | When you do not hold the right ratio | Varies | Costs a swap fee and moves the rate, as well as gas |
| Minting | Opening the position | about 450,000 | The position is created as an NFT with its own bookkeeping [1] |
| Collecting | Every time you claim fees | about 185,000 | Fees sit apart from your liquidity until you collect them [1] |
| Rebalancing | Every re-centre | about 1,000,000 | A withdrawal plus a new mint, often plus a swap |
| Exiting | Closing | about 220,000 | Withdrawal and a final collection, often in one transaction |

A passive full-range position uses three of those rows. An actively managed narrow band can use all of them several times a month. Uniswap v4 trims some of this by holding every pool in a single contract and settling balances once per transaction [2]. It lowers the cost of each step, not the number of steps.

## How many days of fees does one cycle eat?

The test is one division. Add up the gas for everything your strategy does in one cycle, then see how many days of fee income that consumes.

$$
T = \frac{n \times g}{R}
$$

Where:

- $n$ is how many transactions your cycle needs.
- $g$ is what one transaction costs in dollars.
- $R$ is your expected daily fee income in dollars.
- $T$ is how many days of fees that cycle consumes.

Because $R$ grows with your deposit and $n \times g$ does not, $T$ falls in direct proportion as the position gets bigger. Double the deposit and the same cycle eats half as many days.

What one transaction costs depends on where you are and when. The figures below use the measured 450,000-gas mint and ETH at \$2,700.

| Where and when | Cost of one mint |
| :--- | :--- |
| Ethereum mainnet at 0.2 gwei, about the usual level from July to September 2026 | about \$0.24 |
| Ethereum mainnet at 3 gwei, about the busiest hour in a hundred over that period | about \$3.65 |
| Ethereum mainnet at 20 gwei, a congested day | about \$24 |
| A major rollup such as Base or Arbitrum | a few cents or less |
| Solana | about \$0.0006 base fee at \$118 per SOL, plus any priority fee and a refundable account deposit [6] |

The mainnet levels come from base fees we sampled hourly over the 90 days to 1 October 2026: median about 0.09 gwei, 99th percentile about 2.5 gwei.

Plan against the busy figure, not the quiet one. The base fee can rise by up to 12.5% per full block [4]. From 0.1 gwei, about 45 full blocks in a row, roughly nine minutes, take it to 20 gwei. The hours you most want to act are often those hours. Rollups are cheap partly because they now post their data to Ethereum in a cheaper format called blobs [5].

Now the worked example. Your cycle is five transactions totalling about 1 million gas, and you expect a 25% annual gross fee yield. At 1 gwei that cycle costs \$2.70. At 20 gwei it costs \$54.

| Your position | Daily fees | Days of fees per cycle at 1 gwei | Days of fees per cycle at 20 gwei |
| ---: | ---: | ---: | ---: |
| \$500 | \$0.34 | 7.9 | 158 |
| \$2,000 | \$1.37 | 2.0 | 39 |
| \$10,000 | \$6.85 | 0.4 | 7.9 |
| \$50,000 | \$34.25 | 0.1 | 1.6 |

At 1 gwei, even the smallest row spends about a week of fees per cycle, which a slow cadence can carry. Under congestion, the first two rows spend more than a month of fees on each cycle, so an active strategy at that size cannot pay for itself. The third row works only with a slow cadence. The fourth absorbs active management comfortably.

If your position sits in one of the top rows, you have three options. Add capital until a cycle costs a few days of fees at most. Cut the plan to one or two transactions a quarter. Or move to a network where the same cycle costs cents.

The same arithmetic runs in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/#gas=15&txCount=4&capital=5000), which puts gas straight into the net figure.

## Rebalancing is the expensive habit

Re-centring costs more than gas. Each one does three things:

1. **Locks in where you are.** An unrealised divergence from simply holding the two tokens becomes a realised one.
2. **Pays a swap fee, and moves the rate against you,** if what you withdrew does not match the new range.
3. **Restarts the clock** in a band where the competing liquidity may be denser than where you were.

Research on real Uniswap v3 positions found that the larger returns went to providers who accepted more risk and actively managed, and that outcomes varied widely [7]. Active management has to pay for its own transactions first. The question is always whether the new range's fees clear all three costs over the time you expect to hold it. See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

## Network choice changes what strategies exist

Execution costs differ by orders of magnitude between networks. That does not just shrink a cost line. It changes what is possible at a given size.

| | Expensive network | Cheap network |
| :--- | :--- | :--- |
| What works | Large positions, wide bands, rare management | Narrow bands and frequent moves, at retail size |
| What does not | Narrow bands below institutional size | Little, on gas grounds alone |
| The catch | Every action has a meaningful cost | Often thinner volume, so lower fees per dollar supplied |

The comparison is never gas alone. A cheap network with a fifth of the volume can still net out worse than an expensive one, so both numbers belong in the same calculation. Spreading liquidity across networks also thins depth everywhere, covered in [Cross-Chain Liquidity Explained](/guides/cross-chain-liquidity-explained/).

## Three costs that behave exactly like gas

These scale with how many transactions you make rather than with position size, so they belong in the same budget.

- **Entry and exit costs.** Price impact is how far your own order moves the rate; slippage is the gap between the quote and the fill. Getting into the ratio and unwinding both consume depth. Research on decentralised exchanges found that gas, as a fixed cost, weighs most heavily on small trades [8]. See [Slippage and Price Impact](/guides/slippage-and-price-impact/).
- **Harvest-and-sell cycles for reward tokens.** Claiming and selling every week costs gas every time, plus price impact on a thin market.
- **Failed transactions.** A reverted mint or swap still pays for the computation it used [3]. On volatile pairs with tight settings this recurs rather than being a one-off.

## The compounding threshold, worked

Auto-compounding sounds free. It is not.

Compounding daily turns a 20% simple annual rate into about 22.1%. The gain is about 2.1 points of your position per year. On a \$3,000 position that is about \$64.

On Uniswap v3 the fees do not compound by themselves; each reinvestment is a collect plus a fresh deposit [1]. From the measurements above, that pair uses about 415,000 gas. At 12.5 gwei and ETH at \$2,700 it costs about \$14. Doing it 365 times costs \$5,110.

The break-even position is where the yearly gain matches the yearly cost. At \$14 a harvest, daily compounding breaks even at about \$240,000. Weekly compounding at the same cost breaks even at about \$35,000. At the quiet-mainnet level of 0.2 gwei, a harvest costs about \$0.22 and daily compounding breaks even at about \$3,800.

Vaults pool many depositors and harvest once for everybody. That is a real service, and a reason to prefer one at small size, provided its performance fee is smaller than the gas you would have spent.

The same logic applies to claiming generally. Claim when the amount is a large multiple of the transaction cost, not on a calendar.

## Six ways to reduce the bill

- **Widen the range** so you rarely rebalance. Lower fee density often beats the gas a tight band would have burned.
- **Batch your claims** on accrued value, not on habit.
- **Prefer one larger position** to several small ones on the same pair. Gas is per transaction, not per dollar.
- **Pick the network for the strategy**, not the strategy for the network.
- **Skip auto-compounding at small size.** The gain is a percentage and the cost is fixed, so below the break-even above it loses money.
- **Use range orders rather than repeated market entries** when adjustments are not urgent.

## Before you commit

1. **Count the transactions** your strategy needs in a month.
2. **Multiply by the gas cost** on your network at a busy hour, not a quiet one.
3. **Divide by expected monthly fees** at your size.
4. **Ask what is left.** Whatever share gas takes, the remaining fees still have to cover divergence from holding. If gas alone takes a large share, change the structure rather than the pair.
5. **Add expected entry and exit impact** to the same budget.
6. **Redo it when conditions change.** Gas prices move with demand [3].

Fee yield is quoted as a percentage. Gas is charged as a fixed amount. Most of what makes small positions hard follows from that mismatch. Run the full comparison, gas against fees and divergence, in the [LP profit and return calculator](/tools/lp-profit-calculator/). Then use [Is Providing Liquidity Profitable?](/guides/is-providing-liquidity-profitable/) to decide whether the position is worth opening at all.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Ethereum gas and fees: technical overview (ethereum.org)](https://ethereum.org/en/developers/docs/gas/)
4. [EIP-1559: Fee market change for ETH 1.0 chain (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-1559)
5. [EIP-4844: Shard Blob Transactions (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-4844)
6. [Fees (Solana Documentation)](https://solana.com/docs/core/fees)
7. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
8. [On The Quality Of Cryptocurrency Markets: Centralized Versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://ethereum.org/en/developers/docs/gas/ "Ethereum gas and fees: technical overview"
[4]: https://eips.ethereum.org/EIPS/eip-1559 "EIP-1559: Fee market change for ETH 1.0 chain"
[5]: https://eips.ethereum.org/EIPS/eip-4844 "EIP-4844: Shard Blob Transactions"
[6]: https://solana.com/docs/core/fees "Fees (Solana Documentation)"
[7]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[8]: https://arxiv.org/abs/2112.07386 "On The Quality Of Cryptocurrency Markets: Centralized Versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
