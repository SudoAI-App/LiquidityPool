---
title: "The Constant Product Formula: How x × y = k Shapes AMM Prices"
description: "How x × y = k actually sets AMM execution: marginal vs average price, fees, depth, slippage controls, MEV risk, and LP exposure—before you trade or provide."
category: "Foundations"
date: 2026-09-07
lastReviewed: "2026-09-09"
author: "LiquidityPool Research"
readTime: "9 min read"
keywords: "constant product formula, x y k AMM, Uniswap formula, AMM pricing curve"
featured: false
---

You open a wallet, route to an ETH/USDC pool, and see a quote. If you press swap, you won’t “get the spot price.” You will get whatever the pool’s reserves imply at the moment your trade clears, after the trade has pushed through the curve and after the fee has been applied. The constant product formula is not a slogan for decentralized pricing; it is the execution rule inside the contract. Understanding that rule—what it guarantees inside the pool, and what it cannot guarantee against external markets and block ordering—tells you whether a trade or a liquidity position fits your risk and your timing [1] [2] [3].

<figure class="article-figure">
  <img src="/images/guides/constant-product-formula.webp" alt="Dark symmetrical curved geometric forms create a layered abstract pattern." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Curves tracing liquidity through dark geometry. Image by <a href="https://unsplash.com/photos/symmetrical-abstract-pattern-of-dark-curved-shapes-QRTINALdbq8" target="_blank" rel="noreferrer">Mike Hindle</a> under the <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash License</a>.</figcaption>
</figure>

## The execution rule inside the pool

In a constant-product automated market maker (AMM), the pool holds reserves of two tokens. Call the reserves x (token X) and y (token Y). The contract enforces an invariant: x × y = k. The pool’s instantaneous relative price of X in terms of Y is the ratio y/x. If you trade X for Y, your order adds to x and removes from y while keeping the product near k. The larger the order relative to reserves, the more the ratio changes during your own execution [1] [2].

Uniswap v2 makes the rule explicit with fees: for a single-sided input of Δx, the effective input is Δx_eff = Δx × (1 − 0.003). The post-trade balances must satisfy (x + Δx_eff) × (y − Δy_out) ≥ x × y. Solving for output, Δy_out = y × Δx_eff / (x + Δx_eff). The fee is retained in the pool (accruing to liquidity providers), and the invariant binds after the fee is applied [3].

Two prices matter for you:
- The marginal price: the pool’s y/x ratio at a point on the curve (before your trade and after it).
- The average execution price: what you actually paid per unit across the entire trade, which is Δx (your input) divided by Δy_out (your output).

Because the curve is convex, the average execution price is always worse than the starting marginal price for a buy and better for a sell, even before considering the fee. The fee shifts your execution further in the expensive direction [2] [3].

## Small trade in a deep pool: from reserves to average vs marginal price

Consider a trade that is small relative to a deep ETH/USDC pool’s reserves. If your input is a tiny fraction of x, then Δx_eff ≪ x and the output formula simplifies: Δy_out ≈ y × Δx_eff / x. Your average price is therefore close to the initial marginal price y/x, but not identical; the fee and the slight change in the ratio make it a bit worse [1] [2] [3].

What this means in practice:
- Quote formation: The interface may show an indicative output based on current reserves and the formula above. That is not a promise. It is a calculation at a point in time, before your transaction competes for block space [2].
- Minimum output and deadline: You can set a minimum output and a deadline so the trade only executes if the received amount is at least that floor and within a time window. These checks protect you from adverse movements while pending but do not change the pool’s curve or fee [2].
- Expected deviation: For small orders in deep pools, the difference between marginal and average price is small. But it exists, and ignoring it means you might systematically overestimate what you’ll receive [1] [2].

This is the essence of price impact: your own order moves you along the curve during execution. Even when “slippage” is set to zero in the UI, the curve itself enforces that larger inputs get worse rates because x increases and y decreases across the trade [2].

## Large swaps and shallow depth: curve math forces worse rates

Now flip the context. You submit a large swap into a shallow pool for a long-tail token. Here, Δx_eff is not small compared to x. The denominator (x + Δx_eff) grows substantially, so Δy_out grows sublinearly relative to input. Later units of your order get progressively worse prices because the pool must maintain x × y ≈ k [1] [2] [3].

Three consequences follow from the rule, not from any UI setting:
- Widening slippage tolerance does not improve your underlying execution. It only lets the transaction clear at the worse rate implied by the curve if the market moves or if your order itself pushes the pool that far [2].
- Splitting the route across deeper liquidity (or a different invariant better suited to the assets) can change outcomes because reserves—and the rule used on those reserves—determine price impact [1] [2] [4].
- If the pool is shallow enough, your own trade may move the marginal price far from external markets. Arbitrageurs later restore balance by trading the other way; your fill remains what the invariant implied at your size and timing [1] [2].

### A compact map of execution frictions

| Concept | What determines it | When it increases | Can you control it? | Source |
|---|---|---|---|---|
| Price impact | Curve shape and active reserves at your price | Larger trade vs active depth | By sizing, routing, timing | [1] [2] |
| Slippage (execution vs quote) | Market changes and ordering while pending | Volatile markets, delayed inclusion | By min-output and deadline | [2] |
| Trading fee | Protocol’s fee schedule applied to input | Fixed per trade regardless of size | No; you can route to a different pool | [3] |
| MEV/front-running risk | Public mempool and predictable curve | When orders are visible and profitable to reorder | Use protective limits; cannot remove system-wide | [5] |

## Depth isn’t uniform: concentrated ranges and stable-asset curves

Pool depth is not a single number you can use everywhere along the price axis.

- Concentrated liquidity: In designs like Uniswap’s concentrated-liquidity pools, liquidity providers choose price ranges. The constant-product rule still governs execution, but only within the ranges that currently have active liquidity. Outside those ranges, the effective depth can drop sharply because positions become inactive at prices they did not cover [1]. For a trader, “how large is my trade relative to active reserves” means “relative to liquidity at the prices my order will traverse,” not the pool’s TVL.

- Stable-asset trades: Curve’s StableSwap combines constant-sum behavior near balance (to offer lower slippage when assets trade near a common peg) and shifts toward constant-product behavior as the pool becomes imbalanced. The intent is to achieve lower slippage for stable pairs than a pure constant-product AMM would provide, but the curve reverts to more protective constant-product dynamics when balances diverge materially [4]. For a trader, this means excellent local pricing near the peg and quickly worsening rates if one asset deviates; for a liquidity provider, it means inventory can concentrate in the asset moving away from the peg if the deviation persists [4].

These designs are responses to the same question: what reserves are actually available at the prices your order will hit? Active depth determines execution more than headline pool size [1] [2] [4].

## Pending transactions, slippage limits, and MEV risk

The constant-product invariant governs how a single transaction maps reserves to an output. It does not control what happens between your submission and execution. Two external forces matter while your transaction is pending:

- Market changes and block ordering: If other trades move the pool or external prices change, your final execution differs from your initial quote. Minimum-output and deadline checks let you cancel the trade on-chain if conditions move against you beyond your tolerance or if the transaction is not mined in time [2].

- Transaction visibility and MEV: Public pending orders and the predictability of bonding-curve price impact can enable front-running and related miner-extractable value (MEV) behaviors. An attacker can, for instance, insert a trade before yours to move price and profit from the change, then reverse after, leaving you with a worse fill. This is a structural risk of transparent, on-chain batching that the constant-product rule does not mitigate [5].

Practical response: set realistic minimum-output and deadline parameters, size orders relative to active depth, and understand that the final state is a function of both the invariant and the block in which you are included [2] [5].

## Liquidity-provider inventory and impermanent loss

The same rule that gives traders mechanical execution also rebalances the inventory of liquidity providers. When relative prices move externally, the pool’s ratio updates only when trades occur; the curve then rebalances inventory toward the asset that is falling relative to the other. If you withdraw after a divergence, your token mix can leave you worse off than passively holding the initial amounts outside the pool; the shortfall relative to a hold-only benchmark is commonly labeled impermanent loss. Fee income may or may not offset that shortfall depending on volume and the path of prices [5].

Three implications for would-be liquidity providers:
- Inventory risk is intrinsic to the bonding curve. The invariant assures that trades clear against reserves; it does not assure your final wealth is insulated from relative price moves [5].
- Concentrated-liquidity positions magnify both fee earnings at active prices and inventory risk if the market moves out of your range; when out of range, your position stops earning trading fees while becoming an increasingly one-sided holding [1].
- For stable-asset pools, the hybrid invariant helps when assets track their peg closely; if one asset becomes materially impaired or loses its peg, the pool can fill with the weaker asset as the curve shifts back toward constant-product behavior and trades exhaust the stronger side [4] [5].

If your goal is fee income, examine depth and turnover at the prices you plan to cover, and understand how divergence translates into inventory changes. Our overview of inventory risk frameworks is here: [Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes](/guides/impermanent-loss-explained). For assessing actual on-chain depth and activity around target prices, see [Onchain Liquidity Metrics: What to Measure Beyond TVL and Volume](/guides/onchain-liquidity-metrics).

## What to check before you act

- Which reserves—and which invariant—will apply to my execution? Is the pool constant-product everywhere, concentrated around ranges, or hybrid for stables [1] [4]?
- How large is my trade relative to active liquidity at the prices my order will traverse, not just relative to TVL [1] [2]?
- What minimum-output and deadline will I use so pending-order risk (market moves and ordering) does not produce an unacceptable fill [2]?
- If I am routing a stable-asset trade, do I expect the assets to remain near peg through execution, or could the curve flip into the higher-slippage regime [4]?
- If I am providing liquidity, can I explain how my position’s withdrawal mix would differ from simply holding, and under what conditions fees might be insufficient to offset that divergence [5]?

## The bottom line

The constant-product formula is an execution rule: it maps reserves to fills under a fee-adjusted constraint. Everything else—who trades before you, how deep the pool is where your order crosses, whether assets remain pegged, and how public ordering can be exploited—is outside the invariant but inside your realized outcome. If you can trace your path from reserves to average execution price, and set clear limits on pending risk, you’ll know when a constant-product pool is the right tool—and when it’s the wrong mechanism for the trade you actually intend to make [1] [2] [3] [4] [5].

## References

1. [How Uniswap Works](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)
2. [Understanding Swaps on Uniswap](https://developers.uniswap.org/docs/get-started/concepts/traders/swaps)
3. [Uniswap v2 Core](https://app.uniswap.org/whitepaper.pdf)
4. [Curve StableSwap Exchange: Overview](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
5. [Trading in the DeFi era: automated market-maker](https://www.bis.org/publications/trading-defi-era-automated-market-maker)


[1]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works"
[2]: https://developers.uniswap.org/docs/get-started/concepts/traders/swaps "Understanding Swaps on Uniswap"
[3]: https://app.uniswap.org/whitepaper.pdf "Uniswap v2 Core"
[4]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview"
[5]: https://www.bis.org/publications/trading-defi-era-automated-market-maker "Trading in the DeFi era: automated market-maker"
