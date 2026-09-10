---
title: "Slippage and Price Impact: What a Swap Actually Costs"
description: "Price impact is set by the curve, slippage by the delay between quote and execution. How to compute both, size orders against depth, and avoid paying sandwich searchers."
category: "Foundations"
date: 2026-09-10
lastReviewed: "2026-09-10"
author: "Marcus Vance"
readTime: "11 min read"
keywords: "slippage in liquidity pools, price impact AMM, slippage tolerance, execution price vs spot price, sandwich attack, swap cost"
featured: false
faq:
  - q: "What is the difference between slippage and price impact?"
    a: "Price impact is the movement along the pool's curve caused by your own order, and it is computable before you sign. Slippage is the additional difference between the price you were quoted and the price you actually received, caused by other transactions landing before yours."
  - q: "What slippage tolerance should I set?"
    a: "Tight enough that a sandwich attack is unprofitable, loose enough that ordinary block-to-block movement does not revert your trade. On deep, stable pairs a few tenths of a percent is normal; on volatile or thin pairs a tight tolerance will simply fail repeatedly, which is a signal to reduce order size or route privately."
  - q: "Why did my swap execute at a worse price than quoted?"
    a: "Either the pool moved between quote and execution, or a searcher placed a buy in front of your transaction and a sell behind it, capturing the difference your tolerance allowed. The second case is a sandwich, and it is bounded exactly by the tolerance you set."
  - q: "How do I reduce price impact on a large trade?"
    a: "Split the order across pools and time, route through an aggregator that can use several venues, or use an intent-based system where solvers compete to fill the order. On concentrated liquidity pools, check the depth inside the active tick rather than total value locked."
  - q: "What is the difference between spot price and execution price on an AMM?"
    a: "Spot is the marginal price for an infinitesimally small trade. Execution price is the average received across the whole order, which is always worse because the order moves along the curve as it fills."
---

Two different costs get collapsed into one word. Price impact is deterministic: given the pool's reserves and the size of your order, the execution price is fixed by the invariant before you sign anything. Slippage is what happens between the moment you were quoted and the moment your transaction lands in a block, and it is the part other market participants can influence.

Separating them changes how you size orders, how you set tolerances, and how much you hand to searchers.

<figure class="article-figure">
  <img src="/images/guides/slippage-and-price-impact.webp" alt="Execution price curves for a shallow and a deep pool against trade size, beside a worked example of a fifty thousand dollar swap." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Execution price against order size for two depths, with a worked example showing where a tolerance setting binds. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"A 3% slippage tolerance on a thin pair is a public offer. You have told every searcher in the mempool the maximum they may extract, and the profitable ones will take exactly that, not a basis point less. If a trade only clears with a wide tolerance, the correct response is a smaller order or a different execution path, not a wider setting."*

## 1. Price Impact Is the Curve Doing Its Job

For a constant-product pool with reserves $x$ and $y$, a trade of size $\Delta x$ returns:

$$\Delta y = \frac{y \cdot \Delta x}{x + \Delta x}$$

The marginal price before the trade is $P = y/x$, but the average price you actually receive is $\Delta y / \Delta x$, which is strictly worse. Expressed as a fraction of the pool's base reserve, the impact for a buy is approximately:

$$\text{impact} \approx \frac{\Delta x / x}{1 + \Delta x / x}$$

Trading 1% of the reserve costs roughly 1% in price; trading 10% costs roughly 9%; trading 50% costs 33%. The relationship is convex, which is why splitting large orders across pools reduces total cost even when each pool has the same nominal depth.

In concentrated liquidity pools the same logic applies, but the relevant denominator is the liquidity inside the active tick range, not the pool's total value locked. A pool with \$80m of TVL concentrated away from the current price can execute worse than a \$6m pool with dense liquidity at the touch. That distinction is developed in [TVL Explained: What Total Value Locked Does and Does Not Measure](/guides/tvl-explained/).

---

## 2. Slippage Is a Timing Problem

Your transaction is quoted against pool state at block $n$ and executes against pool state at block $n+1$ or later. Anything that changes the pool in between changes your fill:

- **Ordinary flow**: other traders moving the price in either direction.
- **Arbitrage**: a searcher repricing the pool after an external move, which is the same flow that generates the LP's adverse selection cost.
- **Sandwich attacks**: a searcher buys immediately before your transaction, letting your order execute at a worse price, then sells immediately after. The profit is bounded by your slippage tolerance, which is why the setting is a parameter of the attack rather than a protection against it [5].

The tolerance you set defines the worst acceptable fill. Too tight and the transaction reverts, costing gas without a trade. Too loose and you have published your own maximum acceptable loss.

---

## 3. A Worked Example

A trader buys \$50,000 of ETH against a pool with \$1,250,000 of active liquidity at a mid price of 2,000:

| Quantity | Value |
| :--- | ---: |
| Order size as share of active depth | 4.00% |
| Price impact from the curve | −1.96% |
| Average execution price | 2,039.20 |
| Pool fee at 5 bps | \$25 |
| Slippage tolerance set | 0.50% |
| Result | Reverts: impact alone exceeds the tolerance |

The important detail is that the trade did not fail because the market moved. It failed because the tolerance was set below the deterministic cost of the order in that pool. The correct fixes are to split the order, route across venues, or accept the impact explicitly with a tolerance set just above it.

Now change one input: raise the tolerance to 4%. The trade succeeds, and a searcher observing it in the mempool can profitably move the pool up to that bound before the trade lands. The difference between the 2% the curve demanded and the 4% permitted is the searcher's budget.

---

## 4. Execution Paths That Change the Arithmetic

| Path | What it changes | When it is worth it |
| :--- | :--- | :--- |
| **Single pool, public mempool** | Baseline. Full exposure to reordering. | Small orders on deep pairs. |
| **Aggregator routing** | Splits across pools and curves, reducing convex impact. | Mid-size orders where several venues have depth. |
| **Private transaction relay** | Removes mempool visibility, defeating sandwiches. | Any order large enough to be worth attacking. |
| **Intent-based settlement** | Solvers compete to fill; price improvement can exceed the pool quote. | Large or illiquid orders, where a solver can net against other flow. |
| **Limit-style range order** | You supply liquidity at a chosen price instead of taking. | When execution is not urgent. See [Range Orders on AMMs](/guides/range-orders-on-amms/). |

The structural comparison between curve-based and order-book execution is covered in [AMM vs. Order Book: Two Ways to Organize a Market](/guides/amm-vs-order-book/).

---

## 5. What Liquidity Providers Should Take From This

Slippage and price impact are usually framed as trader problems, but they define the LP's revenue too.

- **Impact is your fee opportunity.** Every unit of impact a trader pays reflects depth that had to be consumed. Concentrating liquidity narrows impact for traders and increases the share of volume your position captures while in range.
- **Sandwiches dilute LP economics indirectly.** The fee on the searcher's two legs is real revenue, but the flow that gets attacked is more likely to route privately next time, which removes it from your pool entirely.
- **Tolerance settings shape routing.** Aggregators favour paths with predictable execution, so pools with thin active liquidity lose flow even when their headline TVL is large.

---

## 6. Pre-Trade Checklist

- [ ] Compute the order size as a share of active liquidity, not of total value locked.
- [ ] Read the quoted price impact from the interface and confirm it against the curve arithmetic for large orders.
- [ ] Set tolerance just above the deterministic impact plus a realistic allowance for one block of movement.
- [ ] For orders above a few thousand dollars, use a private relay or an intent-based route rather than the public mempool.
- [ ] Split convex orders: two trades at half size cost materially less than one at full size on the same curve.
- [ ] Check the pool's fee tier: a cheaper tier with thin depth can be more expensive in total than a higher tier with dense liquidity. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).
- [ ] After execution, compare the realised price against the pre-trade quote and log the difference. Persistent negative differences mean your execution path is leaking value.

The cost of a swap is knowable in advance. Most of the value lost in DeFi execution is lost by treating a tolerance slider as a convenience setting rather than as the parameter that prices your own order flow.

## Where to Go Next

For the liquidity provider's side of the same execution, see [Liquidity Provider Fees](/guides/liquidity-provider-fees/) and model expected capture with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/).

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Trading in the DeFi era: automated market-maker (Bank for International Settlements, 2023)](https://www.bis.org/publications/trading-defi-era-automated-market-maker)
4. [Quantifying Blockchain Extractable Value: How dark is the forest? (Qin et al., 2021)](https://arxiv.org/abs/2101.05511)
5. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)](https://arxiv.org/abs/1904.05234)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://www.bis.org/publications/trading-defi-era-automated-market-maker "Trading in the DeFi era: automated market-maker"
[4]: https://arxiv.org/abs/2101.05511 "Quantifying Blockchain Extractable Value: How dark is the forest?"
[5]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges"
