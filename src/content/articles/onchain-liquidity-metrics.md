---
title: "Onchain Liquidity Metrics: What to Measure Beyond TVL and Volume"
description: "The five numbers that decide whether a pool is worth your money, why the two headline figures mislead, and two pools whose dashboards point the wrong way."
category: "Risk & Research"
date: 2026-08-24
lastReviewed: "2026-09-12"
author: "Marcus Vance"
readTime: "7 min read"
keywords: "onchain liquidity metrics, executable depth, AMM analytics, LVR rate, order flow toxicity, turnover velocity, JIT dilution factor, TVL verifiability, liquidity pool data, pool analytics DeFi, liquidity pool volume, how to research a DeFi pool"
featured: false
faq:
  - q: "Which liquidity metrics actually matter?"
    a: "Depth within a defined band around the current price, routed volume for the specific pool, fee revenue relative to liquidity supplying it, the share of volume that is arbitrage, and time in range for concentrated positions."
  - q: "How do I research a DeFi pool onchain?"
    a: "Start with the pool contract and its parameters, then read the liquidity distribution, then reconstruct swap history to separate ordinary flow from arbitrage, then compare fee accrual against a hold benchmark for a representative position."
  - q: "What is pool utilisation?"
    a: "A measure of how much of the supplied liquidity is actually being used to price trades. In tick-based pools it is closer to the share of liquidity that is in range and receiving flow, rather than a lending-style utilisation figure."
---

Every pool dashboard leads with two numbers: how much money is in the pool, and how much traded yesterday. Both are close to useless on their own.

The first counts money parked at prices nobody trades at. The second counts bots taking value out of your position as though it were a customer paying you.

This guide gives you the five numbers that actually decide whether a pool is worth your money, and walks through two real-shaped pools where the headline figures point exactly the wrong way.

<figure class="article-figure">
  <img src="/images/guides/onchain-liquidity-metrics.webp" alt="A price curve is measured by active depth bars, transaction flow, and reserve imbalance." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Depth, flow, and imbalance reveal more than a single TVL figure. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"Any single number will mislead you. A big pool can be money waiting to leave the day the rewards end. Heavy volume can be bots. A high advertised rate is often just token issuance. Look at three things together: how much of the money actually works, how much of the volume is arbitrage, and what is left after the bleed. If a pool cannot pay its way on real fees, it is a bet, not a position."*

## Why the headline number is wrong

The money-in-the-pool figure counts everything in the contract. It says nothing about whether any of it is near the price where trading happens [1] [2].

Three ways it misleads:

- **It can come from somewhere unverifiable.** A 2025 Bank for International Settlements study of 939 protocols found more than one in ten relied on off-chain sources for the figure [2]. Thinly traded assets get marked at whatever price the source says.
- **Most of it can be asleep.** Deposit \$10M into a range from \$4,000 to \$5,000 while ETH trades at \$3,000, and every cent of it is inert [1]. It fills nothing and earns nothing. A pool advertising \$100M can have under \$5M doing work.
- **The same money gets counted repeatedly.** Staked ETH becomes a receipt, the receipt gets restaked, the second receipt goes into a pool. One pile of ETH, counted two or three times. See [TVL Explained](/guides/tvl-explained/).

## The five numbers worth reading

### One: how much money sits near the price

This is the number the headline figure is pretending to be. How much capital is within 1% and 2% of the current price, and therefore able to fill your trade.

$$
\Delta y \approx 0.00995 \cdot L \cdot \sqrt{P}
$$

Where:

- $\Delta y$ is the money needed to push the price up by 2%.
- $L$ is the liquidity live at the current price.
- $P$ is the current price.

You rarely compute this by hand. Most pool pages show liquidity by price, so read the chart. A pool with \$20M on the dashboard but \$150,000 within 2% of the price is fragile, and any decent order will find out the hard way.

### Two: how hard the money is working

Divide yesterday's volume by the money actually near the price.

| What you get | What it means |
| :--- | :--- |
| Under 0.2 | The money is idle. Fees will be thin against the risk you carry |
| 0.2 to 5 | Healthy. Real flow, tight spreads, a normal working pool |
| 5 to 10 | Very busy. Check who is doing the trading before you celebrate |
| Over 10 | Something is off. Wash trading, flash-loan churn, or a violent day where arbitrage is eating the pool [3] [4] |

### Three: what the pair's volatility costs you

Your pool quotes a price that is always one block behind. Faster traders take the difference. That cost is loss-versus-rebalancing, or LVR — the money handed over purely because the quote is late [4].

$$
\text{Annual LVR rate} \approx \frac{\sigma^2}{8}
$$

Where:

- $\sigma$ is the pair's annual volatility, so 100% means $\sigma = 1.0$.

This one is easy and it settles most decisions. A pair that moves 100% a year costs a full-range position about 12.5% annually before any fee, and a band several times that. If the pool's fee yield is less than that, you lose money on average, no matter how the page presents it [4]. It is a better planning number than impermanent loss — the simple gap between a pool position and holding — because it does not depend on where the price happens to finish. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

### Four: who the volume comes from

Split the volume into people and bots [3].

Trades from aggregators, solver networks and ordinary wallets are customers. Their fees are real payment.

Trades from bot contracts at the top of a block, cross-venue arbitrage bundles, and multi-hop flash loans are the opposite. Each one takes more from your position than it pays in fee.

If more than 70% of a pool's volume is the second kind, the fee income is a rebate on a loss, not a return.

### Five: how much fee gets stolen at the last second

In range-based pools, a bot can see a big trade coming, flood the exact price with liquidity, take almost the whole fee, and pull out in the same block [5].

Measure it as the share of total fees captured by liquidity that existed for less than one block. Above about 25%, you are carrying the risk all week and somebody else is collecting on the days that matter [5]. This is MEV — value taken by controlling the order transactions run in. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## The old numbers against the useful ones

| What you want to know | The dashboard number | The one to use instead |
| :--- | :--- | :--- |
| How deep is it | Total money in the pool | Money within 2% of the price [1] |
| Is the money working | Yesterday's volume | Volume divided by money near the price |
| What does volatility cost | Impermanent loss | Annual variance divided by eight [4] |
| Who is trading here | Transaction count | Share of volume that is arbitrage [3] |
| What will I earn | The advertised rate | Real fees from real users, minus the bleed |

## Two pools that look nothing like their dashboards

Both are ETH against dollars at the same fee tier.

| | Pool Alpha | Pool Beta |
| :--- | ---: | ---: |
| Money in the pool | \$80,000,000 | \$25,000,000 |
| Volume yesterday | \$60,000,000 | \$27,000,000 |
| Advertised rate | 27.3% | 19.7% |
| Of which, token rewards | 13.6 points | None |
| Money within 2% of price | \$1,200,000 | \$8,500,000 |
| Share of volume that is arbitrage | 82% | 34% |
| What you actually end up with | -4.2% | +8.1% |

Pool Alpha wins on every number a leaderboard shows. It has three times the money, more than twice the volume, and a rate nearly eight points higher.

It also has 98.5% of its capital parked where nothing trades, and four out of five trades are bots taking a stale quote. After the bleed, it loses money.

Pool Beta has seven times the usable depth on a third of the capital, and most of its volume comes from routers sending real users. Follow the dashboard and you put money in the one that loses it. See [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/).

## What people get wrong about pool data

| What people assume | What actually happens |
| :--- | :--- |
| A bigger pool means a better fill | Money parked in dead ranges counts toward the total and fills nothing |
| Volume means revenue | Arbitrage volume drains the pool faster than its fee pays you |
| Doubling volatility doubles the cost | It roughly quadruples it. The number is squared |
| The rate on the page is what I earn | It assumes the price stops moving, volume continues, and nothing bleeds |

## What to check before you commit

1. **What share of the pool sits within 2% of the price?** Under 10% and the headline number is fiction.
2. **Does the real fee yield clear the bleed?** Annual volatility squared, divided by eight [4].
3. **Is at least half the volume from actual users?** Check where the trades originate.
4. **How often do big trades get fee-sniped?** Look at swaps over \$50,000 in the last thousand blocks, and check for liquidity that appeared and vanished around them [5].
5. **Are you reading the chain or a dashboard?** Balances from the contract, not from an indexer you cannot check [2].

## Where to watch the numbers

- **Pool size, volume and fee turnover:** [DeFiLlama](https://defillama.com).
- **Depth by price and where volume comes from:** [Dune Analytics](https://dune.com).
- **Protocol revenue and valuation ratios:** [Token Terminal](https://tokenterminal.com).

## When something looks wrong

- **The pool is growing but your yield is falling.** Money is arriving faster than volume. Check whether the rewards justify the dilution, and move if they do not.
- **Volume jumped five-fold for a day, then vanished.** A volatile day or a reward programme distorted the trailing figure. Use a 30-day average before committing.
- **Two dashboards report very different rates.** They use different windows, compounding assumptions, and price sources. Read the fee growth from the contract yourself.

## Where to go next

Turn these into an income estimate with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), and a cost estimate with [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/). For why quoted rates rarely match measurement, see [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/). Depth gets its own treatment in [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/), and exit capacity in [Token Liquidity Analysis](/guides/token-liquidity-analysis/).

## References

1. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Towards Verifiability of Total Value Locked (TVL) in Decentralized Finance | BIS Working Paper 1268](https://www.bis.org/publ/work1268.htm)
3. [Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)](https://arxiv.org/abs/2404.05803)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
6. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
7. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
8. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[2]: https://www.bis.org/publ/work1268.htm "Towards Verifiability of Total Value Locked (TVL) in Decentralized Finance | BIS Working Paper 1268"
[3]: https://arxiv.org/abs/2404.05803 "Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[5]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[6]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[7]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[8]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
