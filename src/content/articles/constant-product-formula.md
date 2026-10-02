---
title: "The Constant Product Formula: How x × y = k Shapes AMM Prices"
seoTitle: "Constant Product Formula: How x × y = k Shapes AMM Prices"
description: "What x × y = k actually does to your trade: why the quote is never your fill, how impact scales with size, and how other curves change the answer."
category: "Foundations"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "constant product formula"
keywords: "constant product formula, x y k AMM, Uniswap formula, AMM pricing curve, virtual reserves, constant product AMM, constant product market maker, pool reserves AMM, bonding curve crypto"
featured: false
faq:
  - q: "What is the x times y equals k formula?"
    a: "It is the constant-product invariant: the product of the two reserve balances stays constant across a trade, before fees. It defines the price for every possible trade size and guarantees the pool can always quote, at increasingly unfavourable prices for larger orders."
  - q: "Why does price impact increase with trade size?"
    a: "Because the invariant is a hyperbola. Removing a fixed fraction of one reserve requires adding a proportionally larger amount of the other, so the average execution price degrades convexly as the order grows relative to the reserve."
  - q: "Does the constant product formula apply to Uniswap v3?"
    a: "Yes, in translated form. A v3 position uses the same curve shifted so that reserves reach zero at the position bounds, which is why the mathematics of price impact inside a range is familiar even though capital efficiency is much higher."
  - q: "Does every liquidity pool use x*y=k?"
    a: "No. It is the rule for constant-product pools such as Uniswap v2. Stable-pair pools, weighted pools and bin-based pools use different rules, and concentrated liquidity pools apply the same curve only inside each position's chosen range."
  - q: "Why does liquidity pool price change?"
    a: "Because price is a function of the reserve ratio. Every swap changes the reserves, so the marginal price moves against the trade, and arbitrage then aligns that price with the wider market."
---

The most widely copied pool design in decentralised finance runs on one line of arithmetic. Multiply the two token balances together. Never let that number fall.

From that single rule comes every price the pool quotes, every cost you pay to trade, and much of what happens to your money if you deposit.

By the end you should be able to work out what a trade will really cost you at a given size, and judge when a different pool design gives a better answer.

<figure class="article-figure">
  <img src="/images/guides/constant-product-formula.webp" alt="A pricing curve shows trade size moving through changing pool reserves." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The constant product curve forces larger transactions to incur progressively higher execution friction. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Holding a position on this curve means selling volatility. You collect fees a little at a time, and you give up value whenever the price moves far in either direction. The rule guarantees one thing — the product holds — and to keep it, the pool must sell whichever token is rising and buy whichever is falling.

## What the rule actually says

A pool holds two balances. Call them $x$ and $y$. The contract enforces one thing: after every trade, their product must be at least what it was before [1].

$$
x \cdot y = k
$$

Where:

- $x$ is how many units of the first token the pool holds.
- $y$ is how many of the second.
- $k$ is the number their product must stay at.

Everything else is a consequence. The price, before fees, is simply one balance divided by the other [1]. Trade in one direction and you raise one balance and lower the other, which moves the price against you.

The word for that fixed relationship is the pool's invariant — the one thing the contract will not let change. It never consults a price feed or another exchange. It just refuses to let $k$ fall, and arbitrage traders keep its price close to the wider market [7]. How invariants generalise beyond this one is covered in [Bonding Curves and AMM Invariants](/guides/bonding-curves-and-amm-invariants/), and formally in the constant function market maker framework [8].

## Why your fill is always worse than the quote

The number on the screen is the rate for a trade of almost nothing. Your trade is not nothing, so it moves the balances while it executes, and you pay the average across that whole move.

The pool takes its fee off your input first, then pays out whatever keeps the product level [1]. Here is what you actually receive:

$$
\Delta y = \frac{y \cdot \Delta x \cdot (1 - f)}{x + \Delta x \cdot (1 - f)}
$$

Where:

- $\Delta x$ is what you put in.
- $\Delta y$ is what you get out.
- $f$ is the fee rate, so 0.30% means $f = 0.003$.
- $x$ and $y$ are the balances before your trade.

Look at where your input sits. It is in the denominator. Every extra unit you send makes the bottom of that fraction bigger, which means each extra unit brings back a little less than the one before it.

That penalty is price impact — the cost of moving the pool's own balances to get your trade done. It is not a fee anyone charges you. It is the shape of the curve, and the value stays in the pool rather than going to a company. The less liquidity sits at the current price, the larger it is [3]. The architecture that executes it is covered in [Automated Market Makers Explained](/guides/automated-market-maker-explained/).

## How bad it gets at each size

Here is the whole thing in one table. Each row is your order measured against the pool's balance of the token you are paying in. The cost is the share of output you lose against the quoted rate, before fees.

| Your order, as a share of the pool | What the curve costs you |
| :--- | ---: |
| 1% | 0.99% |
| 5% | 4.76% |
| 10% | 9.09% |
| 25% | 20.00% |
| 50% | 33.33% |

Fees are on top of those numbers. A \$10,000 trade into a pool holding \$100,000 of the token you are paying with loses about 9% to the curve before you pay a cent of fee.

The pattern is exact: an order worth a share $s$ of the pool loses $s / (1 + s)$ of its output. Double the pool and you halve $s$, which roughly halves the cost of a small order. In range-based pools that only holds if the extra money sits near the current price, and often most of it does not.

Three things follow:

- **Your tolerance setting does not reduce the cost.** Interfaces quote you an output that already includes the impact, and the tolerance only allows extra movement beyond that quote [3]. If the quote baked in 8% of impact, a 1% tolerance still lets you end up about 9% below the starting rate. Raising the tolerance does not get you a better rate. It only widens what the contract will accept.
- **Splitting the order helps.** Spreading it across several pools, or letting an aggregator do it, lowers the share of each pool you consume. Because the cost grows faster than the order, smaller pieces cost less in total.
- **Somebody is waiting behind you.** A large trade leaves the pool's price out of line with the rest of the market, and an arbitrage bot will trade it back, often in the same block, and keep the difference [6].

## How other curves change the answer

The constant product rule is the general-purpose one. Other designs trade that generality for depth in a narrower place [9].

| Pool design | What it does differently | Where the money sits | How it fails |
| :--- | :--- | :--- | :--- |
| Constant product, Uniswap v2 | Nothing, this is the base case | Spread across every possible price | Large orders get expensive fast |
| Chosen ranges, Uniswap v3 and v4 | Same curve, shifted to run out at your band's edges [2] | Packed into your band | Price leaves the band and depth vanishes |
| Stable pairs, Curve | Nearly flat near the peg, curved further out [4] | Piled up around a one-to-one rate | Cost accelerates once the pair skews badly |
| Stepped bins, such as LFJ's Liquidity Book | Flat price inside each bin [5] | Sorted into fixed steps | A fast move can jump empty steps |

For the range-based version of this maths, see [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## What to check before you trade

1. **Work out the output yourself.** Read the two balances from the contract and run them through the formula above. Compare that with what the interface quotes.
2. **Set a real floor.** Decide the worst rate you will accept in absolute terms, and pass that number rather than a percentage you picked by habit.
3. **In range-based pools, look at the live band.** Check that enough money sits at and around the current price to absorb your order without jumping into an empty stretch.
4. **Send orders that move the pool privately.** The further your trade moves the price, the more a bot can take by trading in front of it, up to your tolerance. A private relay keeps the order out of view until it lands [6].

For what this same curve costs a depositor — impermanent loss, how far a pool position falls behind the same tokens held outright — see [Impermanent Loss Explained](/guides/impermanent-loss-explained/). A specific price ratio, run through the [impermanent loss calculator](/tools/impermanent-loss-calculator/), shows what that reserve shift hands back to a depositor.

## Where to watch the numbers

- **Simulate the trade first:** [Tenderly](https://tenderly.co) runs it against the live contract.
- **Volume and fee turnover by pool:** [DeFiLlama](https://defillama.com).
- **Your position against simply holding:** [Revert Finance](https://revert.finance).

## When something goes wrong

- **Your cost was worse than the formula predicted.** Either the balances were smaller than you assumed, or somebody traded in front of you in the same block. Read the reserves immediately before trading and use a private relay.
- **One side of the pool keeps draining.** The market has moved somewhere else, and arbitrage keeps trading the pool toward it. If the falling token looks permanently broken, take out what is left.
- **Fees are coming in below what the page promised.** Volume has moved to pools that quote better, so routers no longer send trades your way. Move to a design that competes on execution.

## Where to go next

The same rule produces two separate costs. What a trader pays — price impact plus slippage, the gap between quote and fill — is in [Slippage and Price Impact](/guides/slippage-and-price-impact/). What a depositor absorbs is worked out in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/), and how professionals quote on this curve is covered in [Market Making on AMMs](/guides/market-making-on-amms/). For how other curves change both, see [Types of Liquidity Pools](/guides/liquidity-pool-types/).

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Understanding Swaps on Uniswap (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/traders/swaps)
4. [Curve StableSwap Exchange: Overview (Curve Knowledge Hub)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
5. [Concentrated Liquidity (LFJ Developer Docs)](https://developers.lfj.gg/concepts/concentrated-liquidity)
6. [Maximal extractable value (MEV) (ethereum.org)](https://ethereum.org/en/developers/docs/mev/)
7. [An Analysis of Uniswap Markets (Angeris et al., 2019)](https://arxiv.org/abs/1911.03380)
8. [Constant Function Market Makers: Multi-asset Trades via Convex Optimization (Angeris et al., Stanford)](https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf)
9. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://developers.uniswap.org/docs/get-started/concepts/traders/swaps "Understanding Swaps on Uniswap"
[4]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview"
[5]: https://developers.lfj.gg/concepts/concentrated-liquidity "Concentrated Liquidity (LFJ Developer Docs)"
[6]: https://ethereum.org/en/developers/docs/mev/ "Maximal extractable value (MEV)"
[7]: https://arxiv.org/abs/1911.03380 "An Analysis of Uniswap Markets (Angeris et al., 2019)"
[8]: https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf "Constant Function Market Makers: Multi-asset Trades via Convex Optimization (Angeris et al., Stanford)"
[9]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
