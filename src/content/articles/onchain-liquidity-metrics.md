---
title: "Onchain Liquidity Metrics: What to Measure Beyond TVL and Volume"
seoTitle: "Onchain Liquidity Metrics: Measuring Beyond TVL and Volume"
description: "The five numbers that decide whether a pool is worth your money, why the two headline figures mislead, and two pools whose dashboards point the wrong way."
category: "Risk & Research"
date: 2026-09-09
lastReviewed: "2026-09-12"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "onchain liquidity metrics"
keywords: "onchain liquidity metrics, executable depth, AMM analytics, LVR rate, order flow toxicity, turnover velocity, JIT dilution factor, TVL verifiability, liquidity pool data, pool analytics DeFi, liquidity pool volume, how to research a DeFi pool"
featured: false
faq:
  - q: "Which liquidity metrics actually matter?"
    a: "Depth within a defined band around the current price, routed volume for the specific pool, fee revenue relative to the liquidity supplying it, the share of volume that is arbitrage, and time in range for concentrated positions."
  - q: "How do I research a DeFi pool onchain?"
    a: "Start with the pool contract and its parameters, then read the liquidity distribution, then reconstruct swap history to separate ordinary flow from arbitrage, then compare fee accrual against a hold benchmark for a representative position."
  - q: "What is pool utilisation?"
    a: "A measure of how much of the supplied liquidity is actually being used to price trades. In tick-based pools it is closer to the share of liquidity that is in range and receiving flow, rather than a lending-style utilisation figure."
  - q: "Which single metric best predicts whether a pool will earn?"
    a: "None alone. Routed volume relative to active depth at the price where trades happen, after incentives, is the closest summary. Pair it with the share of volume that is arbitrage, and use a 30-day window so a single spike does not stand in for normal conditions."
---

Every pool dashboard leads with two numbers: how much money is in the pool, and how much traded yesterday. On their own, both mislead.

The first counts money parked at prices nobody trades at. The second counts arbitrage bots, which take value out of the pool, as though they were customers paying you.

By the end you will know the five numbers that decide whether a pool is worth your money. You will also see them applied to two pools whose headline figures point the wrong way.

<figure class="article-figure">
  <img src="/images/guides/onchain-liquidity-metrics.webp" alt="A price curve is measured by active depth bars, transaction flow, and reserve imbalance." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Depth, flow, and imbalance reveal more than a single TVL figure. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Any single number will mislead you. A big pool can be money waiting to leave the day the rewards end. Heavy volume can be bots. A high advertised rate is often token issuance. Look at three things together: how much of the money actually works, how much of the volume is arbitrage, and what is left after the bleed. If a pool cannot pay its way on real fees, it is a bet, not a position.

## Why the headline number is wrong

The money-in-the-pool figure — total value locked, or TVL — counts everything in the contract. In a range-based pool it says nothing about whether any of it is near the price where trading happens [1].

Three ways it misleads:

- **It can come from somewhere unverifiable.** A 2025 Bank for International Settlements study of 939 protocols found that 10.5% relied on off-chain data sources for the figure [2]. Those numbers are hard to check independently.
- **Most of it can be asleep.** Deposit \$10M into a range from \$4,000 to \$5,000 while ETH trades at \$3,000, and none of it is active [1]. It fills nothing and earns nothing. A pool advertising \$100M can have a small fraction of that doing work.
- **The same money gets counted repeatedly.** Staked ETH becomes a receipt, the receipt gets restaked, and the second receipt goes into a pool. One pile of ETH can be counted two or three times; the BIS study proposes a measure that avoids this double counting [2]. See [TVL Explained](/guides/tvl-explained/).

## The five numbers worth reading

### One: how much money sits near the price

This is the number the headline figure pretends to be: the capital within 1% and 2% of the current price, and therefore able to fill your trade.

In a range-based pool, the money needed to move the price depends on the liquidity active at that price [7]. For a 2% move upward it reduces to one line.

$$
\Delta y \approx 0.00995 \cdot L \cdot \sqrt{P}
$$

Where:

- $\Delta y$ is the money needed to push the price up by 2%.
- $L$ is the liquidity live at the current price.
- $P$ is the current price.

The 0.00995 is simply the square root of 1.02, minus one. Twice the live liquidity takes twice the money to move the price, whatever the headline says.

You rarely compute this by hand. Most pool pages show liquidity by price, so read the chart. A pool with \$20M on the dashboard but \$150,000 within 2% of the price is fragile, and a large order will move it sharply. The full method is in [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/).

### Two: how hard the money is working

Divide yesterday's volume by the money actually near the price. Then multiply by the fee tier and by 365. The result is the gross fee yield on the working money, before any losses.

| Daily volume ÷ money near the price | Gross yield at a 0.05% fee tier | Gross yield at a 0.30% fee tier |
| :--- | ---: | ---: |
| 0.2 | 3.7% | 21.9% |
| 1 | 18.3% | 109.5% |
| 5 | 91.3% | 547.5% |

Very high turnover is not automatically good news. It often comes from a volatile day when arbitrage is busy, or from volume that is not genuine. Check who is trading before you trust it.

### Three: what the pair's volatility costs you

Your pool quotes a price that lags the wider market. Faster traders take the difference. That cost is loss-versus-rebalancing, or LVR — the value a pool gives up to arbitrageurs compared with a portfolio that holds the same tokens and rebalances at market prices [4]. For a full-range constant-product pool it has a simple estimate.

$$
\text{Annual LVR rate} \approx \frac{\sigma^2}{8}
$$

Where:

- $\sigma$ is the pair's annual volatility, so 100% means $\sigma = 1.0$.

This one settles most decisions. A pair that moves 100% a year costs a full-range position about 12.5% annually against that rebalancing benchmark, before fees. A narrow band costs several times that. Because volatility is squared, doubling it quadruples the cost. If the pool's fee yield is lower, you lose on average [4].

It is a better planning number than impermanent loss — the shortfall against simply holding the tokens — because it does not depend on where the price happens to finish. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

### Four: who the volume comes from

Split the volume into customers and arbitrage.

Trades from aggregators, solver networks and ordinary wallets are customers. Their fees are payment for a service.

Trades from bot contracts at the top of a block, cross-venue arbitrage bundles and multi-hop flash loans are mostly correcting your stale price. They pay a fee too, but they buy from the pool below market and sell to it above market. A large empirical study found that losses to arbitrageurs exceeded fee income across many of the largest Uniswap pools [3].

The larger the arbitrage share, the more of a pool's fee income arrives bundled with that loss. Use it to discount the fee yield from step two.

### Five: how much of the fee goes to one-block liquidity

In range-based pools, a bot can see a big trade coming, add liquidity at exactly that price, take most of the fee, and withdraw in the same block. This is just-in-time liquidity [5]. Uniswap Labs found it rare across Uniswap v3: about 0.3% of liquidity demand between May 2021 and July 2022, aimed at very large swaps [5].

Rare on average does not mean rare in your pool. Measure the share of fees on the pool's largest swaps that went to liquidity existing for less than one block. That share goes to someone who carried no risk while you carried it all month. This is one form of MEV — profit taken by controlling the order in which transactions run [6]. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## The old numbers against the useful ones

| What you want to know | The dashboard number | The one to use instead |
| :--- | :--- | :--- |
| How deep is it | Total money in the pool | Money within 2% of the price [1] |
| Is the money working | Yesterday's volume | Volume divided by money near the price |
| What does volatility cost | Impermanent loss | Annual variance divided by eight [4] |
| Who is trading here | Transaction count | Share of volume that is arbitrage [3] |
| What will I earn | The advertised rate | Fees from ordinary users, minus the bleed |

## Two pools that look nothing like their dashboards

Both are ETH against dollars at the same 0.05% fee tier. The fee yields below are volume times 0.05% times 365, divided by the money in the pool.

| | Pool Alpha | Pool Beta |
| :--- | ---: | ---: |
| Money in the pool | \$80,000,000 | \$25,000,000 |
| Volume yesterday | \$60,000,000 | \$27,000,000 |
| Advertised rate | 27.3% | 19.7% |
| Of which, token rewards | 13.6 points | None |
| Of which, trading fees | 13.7 points | 19.7 points |
| Money within 2% of price | \$1,200,000 | \$8,500,000 |
| Share of volume that is arbitrage | 82% | 34% |
| Fees paid by non-arbitrage volume | 2.5 points | 13.0 points |

Pool Alpha wins on every number a leaderboard shows. It has three times the money, more than twice the volume, and a rate nearly eight points higher.

It also has 98.5% of its capital parked where nothing trades, and four out of five trades are arbitrage. Its working money turns over 50 times a day, a sign of arbitrage rather than demand. Take out the reward tokens and the arbitrage, and ordinary users pay about 2.5% a year on the pool's capital. The rest of the fee line comes bundled with losses to the same arbitrageurs.

Pool Beta has seven times the usable depth on under a third of the capital, and most of its volume comes from routers sending real users. Its ordinary users pay about 13% a year. Follow the dashboard and you choose the pool whose income depends on rewards and arbitrage. See [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/).

## What to check before you commit

1. **What share of the pool sits within 2% of the price?** The smaller it is, the more the headline overstates usable depth.
2. **Does the real fee yield clear the bleed?** Annual volatility squared, divided by eight, for a full-range position [4].
3. **How much of the volume comes from actual users?** Check where the trades originate, and discount fee income from arbitrage.
4. **How often do big trades meet one-block liquidity?** Look at the pool's largest recent swaps and check for liquidity that appeared and vanished around them [5].
5. **Are you reading the chain or a dashboard?** Use balances from the contract, not an indexer you cannot check [2]. For how liquidity actually lives onchain across pools, see [Onchain Liquidity Explained](/guides/onchain-liquidity-explained/).

## Where to watch the numbers

- **Pool size, volume and fee turnover:** [DeFiLlama](https://defillama.com).
- **Depth by price and where volume comes from:** [Dune Analytics](https://dune.com).
- **Protocol revenue and valuation ratios:** [Token Terminal](https://tokenterminal.com).

## When something looks wrong

- **The pool is growing but your yield is falling.** Money is arriving faster than volume. Check whether the rewards justify the dilution, and move if they do not.
- **Volume jumped five-fold for a day, then vanished.** A volatile day or a reward programme distorted the trailing figure. Use a 30-day average before committing.
- **Two dashboards report very different rates.** They use different windows, compounding assumptions and price sources; [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/) explains why quoted rates diverge. Read the fee growth from the contract yourself.
- **One token makes up most of a pool's exit route.** Measure how much of it you could actually sell, as set out in [Token Liquidity Analysis](/guides/token-liquidity-analysis/).

## From metrics to a decision

Put the working-money turnover and your share of it into the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) to estimate income. Then weigh that income against the cost of divergence using [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/). A pool earns a place in your portfolio only if it clears both steps.

## References

1. [Concentrated Liquidity (Uniswap Developers documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Towards verifiability of total value locked (TVL) in decentralized finance (BIS Working Paper No 1268, 2025)](https://www.bis.org/publ/work1268.htm)
3. [Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)](https://arxiv.org/abs/2404.05803)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
6. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
7. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developers documentation)"
[2]: https://www.bis.org/publ/work1268.htm "Towards verifiability of total value locked (TVL) in decentralized finance (BIS Working Paper No 1268, 2025)"
[3]: https://arxiv.org/abs/2404.05803 "Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[5]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[6]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[7]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
