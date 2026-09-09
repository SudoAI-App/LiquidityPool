---
title: "Market Making on AMMs: A Practical Framework for Understanding LP Behavior"
description: "A clear framework for LPs: how invariants, ranges, fees, and correlations drive inventory, fee accrual, and risk across Uniswap v2/v3 and Curve."
category: "Advanced"
date: 2026-08-22
lastReviewed: "2026-09-09"
author: "LiquidityPool Research"
readTime: "9 min read"
keywords: "market making AMM, AMM liquidity provider, DeFi market making, LP strategy mechanics"
featured: false
---

Picture a volatile token rallying hard against ETH. You’ve provided liquidity to that token/ETH pool. Swaps are flowing, fees are accruing—and your inventory is quietly rotating away from the winner. That sequence is not a bug of “passive” yield; it is the core of delegated, rule-based market making. The AMM’s invariant decides how your inventory is rebalanced; the market’s path decides whether you are earning fees while moving into or out of the asset that just moved; and your chosen range or curve decides whether you keep earning at all when price migrates. This piece translates those mechanics into position-management questions you can answer before depositing.

<figure class="article-figure">
  <img src="/images/guides/market-making-on-amms.webp" alt="A liquidity provider inventory cabinet connects to an AMM curve and a fee collection path." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>AMM liquidity provision is inventory management with fee compensation. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

## You are market making by rule, not chasing APR

Automated market makers hold reserves of two tokens and quote prices as a function of those balances. In Uniswap’s constant-product design, the pool maintains x*y=k; the larger a trade relative to the pool’s depth, the larger the price impact [1]. Uniswap v2 pairs use that invariant and apply a 30 bps fee per trade; liquidity providers receive the fee unless a governance-controlled protocol-fee switch is on, in which case LPs receive 25 bps and 5 bps are redirected [2].

Uniswap v3 and v4 let liquidity providers allocate their liquidity to a custom finite price range rather than across the full 0→∞ interval. When market price exits that range, the position’s liquidity is inactive and no longer earns fees; further, as price moves in one direction, the position’s inventory can become entirely one asset [3].

Curve StableSwap blends constant-sum and constant-product behavior to lower slippage around a common price (e.g., stablecoins near parity). As a pool becomes imbalanced, its behavior shifts toward constant-product, increasing price impact and reducing that near-peg smoothness [4].

These are rules, not forecasts. Any fee APR displayed is only what trades happened to pay the pool over some window. Economic outcome depends on two additional facts: (1) your inventory will be rebalanced by the invariant and market flow, and (2) concentrated liquidity can stop earning altogether when out of range [1] [2] [3]. “Impermanent loss” is a benchmark comparison, not a fee charged at withdrawal; the gap between your AMM position and a reference such as “hold the tokens” depends on price path, the invariant, and earned fees. If this concept is new, read our guide: [Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes](/guides/impermanent-loss-explained).

## From invariant to inventory: tracing a Uniswap v2 rally

Consider a volatile token rallying against ETH in a Uniswap v2 constant-product pool. The outside market moves first; the pool’s price lags until trades push its reserve ratio to the new level [1] [2]. How do you get there?

- External price rises: the token becomes more valuable relative to ETH.
- Arbitrageurs bridge the gap by buying the appreciating token from the pool and paying in ETH. That removes the appreciating token from reserves and adds ETH [1] [2].
- Each trade pays the configured swap fee to liquidity providers [2].

Mechanically, your position’s token mix shifts toward the asset flowing in (ETH) and away from the one flowing out (the appreciating token). This is exactly how the pool’s price moves: fewer tokens, more ETH, new ratio. You collected fees on the trades that effected this rotation, but you also sold some of the winner along the way because that is how x*y=k market making works [1] [2].

How to think about outcome:

- Fees are path-dependent. If the rally was choppy and volumes high, fee intake may be larger. If it was a fast gap with little pool turnover, fees may be small relative to the inventory rotation.
- Inventory ending state is determined by the final reserve ratio. If price settled much higher, you hold less of the appreciating token and more ETH than you started with.
- The economic question isn’t “were fees high?” but “did fees offset the value given up by selling the winner to keep the pool’s price in line?” That comparison is what many call impermanent loss versus a benchmark like “hold the initial tokens” (see [Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes](/guides/impermanent-loss-explained)). There is no line-item “IL fee”; there is only the realized portfolio you end up with and the fees you collected along the way.

This is why liquidity provision on constant-product pools should be framed as delegated, rule-driven market making. The rule is public and simple, but the realized inventory outcome depends on market path and size of order flow through the pool [1] [2].

## Concentrated ranges turn off and can strand you in one asset

Now switch to Uniswap v3 and imagine you place a stablecoin/stablecoin position narrowly around 1.00. Concentrating liquidity increases your price density within that range, so you earn more fees per unit of capital if meaningful volume trades inside it. But the mechanism is binary at the edges: when price leaves your bounds, your liquidity is inactive and stops earning immediately [3]. If price has drifted upward slightly, your position may be nearly or entirely the lower-priced stablecoin; if it drifts downward, the reverse can occur. When price returns, fees resume; while outside, you earn nothing until you adjust the range or price comes back [3].

Operationally, this introduces two decisions that constant-product across the full price spectrum never forces:

- How often do you check whether price has left the range?
- If you re-center, do you accept the realized one-sided inventory that the last move produced, or do you add capital to rebalance the mix?

There is no free yield here. The narrower the range, the more often you will confront out-of-range inactivity and one-sided exposure, especially during transient moves. Understanding why and when your fees can drop to zero is as important as counting bps in-range [3]. If you need a refresher on how ranges work, see [Concentrated Liquidity Explained: Range, Capital Efficiency, and Risk](/guides/concentrated-liquidity-explained).

## Range width versus workload on a volatile v3 pair

Take a volatile token/ETH pair on Uniswap v3. You face a spectrum:

- Wide range: Lower price density, but price is less likely to leave the bounds. Fees accrue more consistently; inventory shifts more gradually. Monitoring burden is lower. However, a large share of your capital may be sitting in parts of the curve where little trading happens.
- Narrow range: Higher price density in your chosen band. If significant volume occurs inside, fee intensity per unit of capital can be high. But price can exit quickly, halting fees; you will also spend more time as a one-asset position during trends. Monitoring and repositioning are now part of the strategy [3].

Mechanically, these trade-offs all flow from the concentratability of liquidity and the off/on nature of fee accrual at the range edges [3]. Which configuration is appropriate depends on how you expect to manage the position, not on an abstract idea that “narrow is better.” The model is helpful for mapping inventory at different prices and determining your “inactive zones.” The model stops being sufficient when you try to predict future trade flow or the statistical properties of price moves; that is a separate forecasting problem.

## Correlated pools behave differently under stress

Curve’s StableSwap invariant is engineered to give lower slippage near a shared price level by blending constant-sum and constant-product behavior. When balances are close to even, trades face a flatter curve—more capacity at low impact—than a pure constant-product pool would. But as imbalance grows, the mechanism transitions toward constant-product to protect reserves; price impact rises accordingly [4].

Consider a persistent depeg or one-sided demand that drains one side of the pool. In that state, LPs are increasingly exposed to the weaker asset—the pool pays out the strong asset to traders and accumulates the weaker one—and the slippage advantage decays as the curve moves toward constant-product [4]. The design aims to be efficient for stable assets when they remain near parity; it is not a guarantee that each asset remains stable, nor that the pool cannot become severely imbalanced under stress [4]. For an LP, that means fee income earned during the initial imbalance must be weighed against the inventory you’re left holding if the imbalance persists.

## Quick reference: how AMM designs shape exposure

| Design | Price rule | Where fees accrue | When fees stop | Inventory behavior in a move | Slippage profile |
|---|---|---|---|---|---|
| Uniswap v2 (constant-product) | x*y=k; price set by reserve ratio [1] [2] | On each swap at pool’s fee (30 bps in v2 unless protocol fee is on) [2] | Fees do not “turn off”; always active while capital is in pool | Inventory rotates toward the asset being added by traders (you sell the appreciating asset to buyers) [1] [2] | Standard constant-product impact; larger trades vs depth move price more [1] |
| Uniswap v3 (concentrated) | Same invariant within chosen bounds [3] | On swaps that cross your active ticks [3] | Immediately when market price leaves your range [3] | Can become entirely one asset as price moves to an edge [3] | Within-range like v2; out-of-range you’re inactive |
| Curve StableSwap | Blends constant-sum near parity with constant-product as imbalance grows [4] | On swaps per pool settings (per protocol design) | N/A; no discrete off-switch, but behavior changes with imbalance | Accumulates the side traders are selling into the pool; under depeg, tends to hold more of the weaker asset [4] | Low near-peg slippage; moves toward constant-product under imbalance [4] |

Use the table to pre-compute two things before entering: (1) your inventory at different prices, given the design; and (2) the conditions under which you stop earning or face higher price impact. The first is a function of the invariant and your chosen parameters; the second is design-specific and event-driven.

## What to check before you act

- For the pair I’m considering, what inventory will I hold if price moves by ±X%? Where will my Uniswap v3 position stop earning, and what side will I be left with [3]?
- Does the displayed fee APR reflect high recent volume that may not persist? What fee actually accrues to LPs in this pool version [2]?
- In a v3 range, how often am I willing to reposition? What will I do if price exits and leaves me one-sided for days [3]?
- For a stable-asset pool, what happens if one asset depegs or the pool becomes imbalanced? How does the StableSwap curve change as that imbalance grows [4]?
- Relative to a benchmark like “hold the tokens,” what paths would likely make LPing underperform versus outperform? See [Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes](/guides/impermanent-loss-explained) for framing.

## Closing the loop: models to decisions

Start with the invariant: it tells you how your position will be rebalanced as prices move and trades clear [1] [2] [3] [4]. Add the fee rule: it tells you when and how you get paid to facilitate that rebalancing [1] [2] [3]. Then overlay the design-specific edges: ranges can turn off; stable curves can lose their near-peg advantage under imbalance [3] [4]. The result is not a promise of return but a map of exposures.

Where the model is useful:

- Determining your inventory at different prices.
- Identifying the price points at which you will stop earning fees (v3) or face different slippage dynamics (StableSwap) [3] [4].
- Stress-testing how adverse selection looks when one asset trends or depegs.

Where it stops being enough:

- Predicting the amount of volume that will trade through your active band.
- Forecasting the price path or how quickly arbitrage will occur.

Your decision, then, is operational: does the invariant-driven inventory path, plus the fee rule and your monitoring plan, constitute a market-making stance you are comfortable owning? If you cannot explain in advance what inventory you’ll hold after a move, where your fees can cease, and what would make you rebalance or exit, you are not ready to deposit.

## References

1. [How Uniswap Works](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)
2. [Uniswap v2 Core](https://app.uniswap.org/whitepaper.pdf)
3. [Concentrated Liquidity](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
4. [Curve StableSwap Exchange: Overview](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)


[1]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works"
[2]: https://app.uniswap.org/whitepaper.pdf "Uniswap v2 Core"
[3]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity"
[4]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview"
