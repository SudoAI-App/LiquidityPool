---
title: "The Constant Product Formula: How x × y = k Shapes AMM Prices"
description: "What x × y = k actually does to your trade: why the quote is never your fill, how impact scales with size, and how other curves change the answer."
category: "Foundations"
date: 2026-09-07
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "6 min read"
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

Almost every pool in decentralised finance runs on one line of arithmetic. Multiply the two token balances together. Never let that number fall.

From that single rule comes every price the pool quotes, every cost you pay to trade, and most of what happens to your money if you deposit. It is worth an hour of your time.

This guide shows you what the rule does, why your fill is always worse than the quote on the screen, how much worse at each trade size, and how other pool designs change the answer.

<figure class="article-figure">
  <img src="/images/guides/constant-product-formula.webp" alt="A pricing curve shows trade size moving through changing pool reserves." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The constant product curve forces larger transactions to incur progressively higher execution friction. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"The rule is beautiful and it is completely unhedged. Holding a position on this curve is selling volatility. You collect fees drip by drip, and you pay out whenever the asset moves hard in either direction. Everything about your exposure comes from how steeply the curve bends, and the curve bends hardest exactly when the pool is thinnest."*

## What the rule actually says

A pool holds two balances. Call them $x$ and $y$. The contract enforces one thing [1] [2]:

$$
x \cdot y = k
$$

Where:

- $x$ is how many units of the first token the pool holds.
- $y$ is how many of the second.
- $k$ is the number their product must stay at.

Everything else is a consequence. The price is simply one balance divided by the other. Trade in one direction and you raise one balance and lower the other, which moves the price against you.

The word for that fixed relationship is the pool's invariant — the one thing the contract will not let change. It never consults a price feed, it never looks at another exchange, and it never gets an opinion. It just refuses to let $k$ fall.

## Why your fill is always worse than the quote

The number on the screen is the rate for a trade of almost nothing. Your trade is not nothing, so it moves the balances while it executes, and you pay the average across that whole move.

With a fee of $f$ taken off your input first, here is what you actually receive:

$$
\Delta y = \frac{y \cdot \Delta x \cdot (1 - f)}{x + \Delta x \cdot (1 - f)}
$$

Where:

- $\Delta x$ is what you put in.
- $\Delta y$ is what you get out.
- $f$ is the fee rate, so 0.30% means $f = 0.003$.
- $x$ and $y$ are the balances before your trade.

Look at where your input sits. It is in the denominator. Every extra unit you send makes the bottom of that fraction bigger, which means each extra unit brings back a little less than the one before it.

That penalty is price impact — the cost of moving the pool's own balances to get your trade done. It is not a fee anyone charges you. It is geometry. The architecture that executes it is covered in [Automated Market Makers Explained](/guides/automated-market-maker-explained/).

## How bad it gets at each size

Here is the whole thing in one table. Each row is your order measured against the pool's balance of the token you are paying in.

| Your order, as a share of the pool | Roughly what the curve costs you |
| :--- | ---: |
| 1% | 0.99% |
| 5% | 4.76% |
| 10% | 9.09% |
| 25% | 20.00% |
| 50% | 33.33% |

Fees are on top of those numbers. A \$10,000 trade into a pool holding \$100,000 of the token you are paying with loses about 9% to the curve before you pay a cent of fee.

Three things follow, and all three are worth internalising:

- **Your tolerance setting does not reduce the cost.** It only decides whether the trade reverts. Raising it from 1% to 5% does not get you a better rate. It just authorises the contract to fill you at the bad one [2].
- **Splitting the order helps.** Spreading it across several pools, or letting an aggregator do it, lowers the share of each pool you consume. The curve punishes size because the cost grows faster than the order does [1] [4].
- **Somebody is waiting behind you.** A large trade leaves the pool's price out of line with the rest of the market, and a bot corrects it in the same block and keeps the difference [5].

## How other curves change the answer

The constant product rule is the general-purpose one. Other designs trade that generality for depth in a narrower place.

| Pool design | What it does differently | Where the money sits | How it fails |
| :--- | :--- | :--- | :--- |
| Constant product, Uniswap v2 | Nothing, this is the base case | Spread across every possible price | Large orders get expensive fast [3] |
| Chosen ranges, Uniswap v3 and v4 | Same curve, shifted to run out at your band's edges | Packed into your band | Price leaves the band and depth vanishes [1] |
| Stable pairs, Curve | Nearly flat near the peg, curved further out | Piled up around a one-to-one rate | Cost accelerates once the pair skews badly [4] |
| Stepped bins | Flat price inside each step | Sorted into fixed steps | A fast move can jump empty steps |

For the range-based version of this maths, see [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## What people get wrong about the formula

| What people assume | What actually happens |
| :--- | :--- |
| A 1% tolerance caps my loss at 1% | It caps the drift from an estimate that already includes impact. If the estimate baked in 8%, you can still lose 9% |
| Twice the pool size means half the cost | Only if the extra money sits near the price. In range-based pools, most of it often does not |
| The rule protects depositors | It guarantees one thing: the product holds. It also forces the pool to sell the winner and buy the loser every time prices move |
| Price impact is a fee somebody charges | Nobody charges it. It is the shape of the curve, and it goes to the pool, not to a company |

## What to check before you trade

1. **Work out the output yourself.** Read the two balances from the contract and run them through the formula above. Compare that with what the interface quotes [1] [2].
2. **Set a real floor.** Decide the worst rate you will accept in absolute terms, and pass that number rather than a percentage you picked by habit [2].
3. **In range-based pools, look at the live band.** Check that enough money sits at and around the current price to absorb your order without jumping into an empty stretch [1].
4. **Protect anything above \$20,000.** Send it through a private relay so bots cannot read your order and trade in front of it [5].

For what this same curve costs a depositor — impermanent loss, the gap between a pool position and simply holding the tokens — see [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## Where to watch the numbers

- **Simulate the trade first:** [Tenderly](https://tenderly.co) runs it against the live contract.
- **Volume and fee turnover by pool:** [DeFiLlama](https://defillama.com).
- **Your position against simply holding:** [Revert Finance](https://revert.finance).

## When something goes wrong

- **Your cost was worse than the formula predicted.** Either the balances were smaller than you assumed, or somebody traded in front of you in the same block. Read the reserves immediately before trading and use a private relay.
- **One side of the pool keeps draining.** The market has moved somewhere else, and the pool is a one-way door for arbitrage. If the falling token looks permanently broken, take out what is left.
- **Fees are coming in below what the page promised.** Volume has moved to pools that quote better, so routers no longer send trades your way. Move to a design that competes on execution.

## Where to go next

The same rule produces two separate costs. What a trader pays — price impact plus slippage, the gap between quote and fill — is in [Slippage and Price Impact](/guides/slippage-and-price-impact/). What a depositor absorbs is impermanent loss, the gap between the pool position and simply holding, worked out in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/). For how other curves change both, see [Types of Liquidity Pools](/guides/liquidity-pool-types/).

## References

1. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
2. [Uniswap v2 Core Whitepaper (Adams, 2020)](https://uniswap.org/whitepaper.pdf)
3. [Understanding Swaps on Uniswap (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/traders/swaps)
4. [Curve StableSwap Exchange: Overview (Curve Knowledge Hub)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
5. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
6. [An Analysis of Uniswap Markets (Angeris et al., 2019)](https://arxiv.org/abs/1911.03380)
7. [Constant Function Market Makers: Multi-Asset Trades via Convex Optimization (Angeris et al., Stanford)](https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf)
8. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)

[1]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[2]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[3]: https://developers.uniswap.org/docs/get-started/concepts/traders/swaps "Understanding Swaps on Uniswap"
[4]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview"
[5]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[6]: https://arxiv.org/abs/1911.03380 "An Analysis of Uniswap Markets (Angeris et al., 2019)"
[7]: https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf "Constant Function Market Makers: Multi-Asset Trades via Convex Optimization (Angeris et al., Stanford)"
[8]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
