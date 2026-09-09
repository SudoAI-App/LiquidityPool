---
title: "Stablecoin Liquidity Pools: Efficient Curves, Depeg Risk, and Due Diligence"
description: "Stablecoin pools aren’t savings accounts. Understand how AMM curves, ranges, and MEV shift inventory and exit paths when a dollar peg falters."
category: "LP Mechanics"
date: 2026-08-30
lastReviewed: "2026-09-09"
author: "LiquidityPool Research"
readTime: "9 min read"
keywords: "stablecoin liquidity pool, stable swap, stablecoin AMM, stablecoin depeg risk"
featured: false
---

You open a stablecoin dashboard and see a pool quoting 1.0001 with tiny slippage and an attractive APY. It looks like a savings account with extra yield. Then headlines hit: one constituent’s redemption becomes uncertain. The price still hovers near $1—for a moment. Which dollars are really yours, which liquidity is still active, and how exactly would you exit?

A stablecoin pool is a conditional risk-transfer mechanism. Near parity, the curve delivers tight execution and fee income. When a coin trades below its target, the same curve reassigns inventory to whoever stands in the way—often liquidity providers—while execution paths become sensitive to transaction ordering. Treat the peg, pool price, and APY as separate moving parts, not safety guarantees.

<figure class="article-figure">
  <img src="/images/guides/stablecoin-liquidity-pools.webp" alt="Seven smooth stones balanced in a vertical stack against a softly blurred background." width="1067" height="1600" loading="lazy" decoding="async" />
  <figcaption>Balance at the heart of liquidity. Image by <a href="https://unsplash.com/photos/selective-focus-photography-of-balance-stones-c1EbdHnxMdk" target="_blank" rel="noreferrer">Photoholgic</a> under the <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash License</a>.</figcaption>
</figure>

## What an AMM really promises: inventory rules, not a dollar floor

Two design choices dominate stablecoin pool behavior.

- Concentrated-liquidity ranges: On Uniswap v3/v4, a liquidity provider selects a finite price interval. Liquidity outside that interval is inactive and stops earning fees, and a position can become entirely one asset as price moves to a boundary [1]. This improves capital efficiency when the price stays in-range but creates a binary failure mode if it leaves.
- StableSwap invariant and amplification (A): Curve’s plain pools use the StableSwap invariant, which is relatively flat near balance (low slippage) and tends toward constant-product behavior as the portfolio becomes imbalanced [2][3]. The amplification coefficient A increases tolerance to imbalance near parity, but slippage accelerates as assets move away from balance [2]. Low slippage at $1 is not a promise of smooth exits during stress.

These are rules about inventory flow. They do not speak to an issuer’s redemption process or secondary market price formation. Primary issuance/redemption and secondary-market trading are distinct layers; arbitrage can help maintain a peg, but during stress secondary prices can diverge sharply from theoretical or redemption values [5].

## Scenario: a USDC/USDT or DAI/USDC pool when reliable redemption weakens

Assume a pool has traded near 1:1 and one token suddenly faces uncertainty around timely redemption. Three things change in fast sequence:

1) Quoted price vs. redemption reality. The pool still quotes an automated price from its invariant. That quote is not the issuer’s redemption value. Federal Reserve research emphasizes the distinction between primary issuance/redemption and secondary-market price formation, and notes that DeFi pools provide arbitrage venues that can support a peg, yet secondary prices can diverge sharply under stress [5].

2) Inventory direction. The StableSwap curve is designed to be flat near balance but becomes steeper as imbalance grows [3]. When the market prefers the “safer” coin, traders sell the riskier coin into the pool. The pool’s inventory skews toward the asset being sold as slippage rises for further sells. Curve documentation explains that a higher amplification parameter A increases tolerance near balance but does not eliminate the steeper response as imbalance increases [2]. Efficient at $1 does not mean forgiving at $0.97.

3) Withdrawal composition and exit venue. If you provide liquidity to a two-coin pool, your withdrawal exposure is to the current pool composition. In a depeg, that composition can be mostly the weaker coin because arbitrageurs have drained the stronger coin along the curve. Arbitrage between DEXs is a canonical MEV strategy—buying where cheaper and selling where dearer—with transaction ordering and inclusion controlling who captures the spread [4]. If outside liquidity is thin or primary redemption is uncertain, the pool price may not converge to $1 on your timetable [5]. Your practical exit becomes: accept pool slippage into the stronger coin, bridge to another venue, or wait for redemption clarity.

The lesson: don’t equate a tight quote near $1 with “dollar-neutral” exposure. Understand which path moves first when imbalance arrives—inventory does.

## Concentrated-liquidity ranges: fees turn off when the line is crossed

Now consider a liquidity provider who places a narrow Uniswap v3 range around 0.99–1.01 in a stablecoin pair. This works—until it doesn’t.

- While the market trades inside the band, capital efficiency is high and fee income can be attractive.
- When price crosses the lower boundary—say the quote drifts to 0.9899—the position goes out of range. Per Uniswap’s design, liquidity outside the set range becomes inactive and stops earning fees [1]. The position also becomes one-sided: as the price moved to the boundary, your inventory morphed toward the “weaker” coin [1].
- Until you rebalance by adding/removing liquidity or widening the range, you carry single-asset risk with no fees accruing. If the weaker coin continues to sell off, you are not getting paid to wait.

Concentrated liquidity is a precision instrument, not a cushion. The fee advantage is conditional on staying in-range; once out-of-range, it is equivalent to holding the asset that moved against you, with execution costs to reenter.

## Execution risk during volatile blocks: slippage, ordering, and adverse selection

During a depeg scare, you or a liquidator may submit a large swap. Even if you set a slippage limit, where and how your transaction lands matters.

- DEX-arbitrage is an atomic strategy: a searcher buys on a lower-priced pool and sells on a higher-priced venue within one bundle. Ethereum’s MEV documentation explains that transaction inclusion, exclusion, and ordering can create extractable value for block producers and searchers [4].
- Sandwiching is a known pattern around large DEX trades: a searcher can insert a buy before your swap and a sell after it, worsening your effective price while capturing the difference [4].
- If you broadcast to a public mempool during a volatile window, you invite this competition. Your displayed slippage tolerance becomes an upper bound for extractable value around your trade. Private relay or RFQ-style execution can reduce exposure, but the trade-off is fill certainty and price discovery. The protocol mechanics won’t protect a visible order from being repriced by ordering games [4].

MEV is not a footnote; during stablecoin stress it can be the difference between “I swapped at 0.997” and “I got clipped to 0.992 before the pool rebounded.”

## Curve amplification: what it gives you—and where it stops

Curve’s StableSwap invariant is engineered to make stable-to-stable swaps cheap near balance and to degrade gracefully toward constant-product performance as imbalance grows [3]. The amplification coefficient A tunes how flat that low-slippage region is; a higher A increases tolerance to small imbalances but results in slippage kicking in sooner once the pool starts to skew [2].

This makes sense for routine deviations around $1. It does not immunize the pool from a real depeg. As the weaker coin floods in, marginal prices move faster and inventory of the stronger coin disappears. Your withdrawal gains exposure to the coin the market is discarding. That is exactly how arbitrage restores pegs when it works—and exactly how risk transfers to pool inventory when it doesn’t on your timeline [5].

If the pool is not a plain two-asset configuration—say it routes through a base pool or contains wrapped claims—your effective exposure may include additional components. Before treating any stable-swap pool as “just” a two-token basket, verify the underlying token types, any dependencies on base pools or wrappers, applicable fees, and withdrawal functions. Plain-pool mechanics are documented; compositions beyond that require you to read the specific pool’s parameters and contracts [2].

## Reading a pool like a term sheet: liquidity at $1 vs. when stress hits

Treat the AMM’s behavior as a set of conditional clauses: “if price remains in this band, then fees accrue and execution is tight; if price exits, then inventory shifts and fees can stop; if imbalance grows, then slippage accelerates.” That framing helps compare pool types.

| Mechanism | Near-parity behavior | Under imbalance | Can position become one-sided? | Fee accrual during stress |
|---|---|---|---|---|
| Uniswap v3 concentrated range | Efficient use of capital inside the chosen band; fee income while in-range [1] | Price crossing a boundary renders liquidity inactive; execution requires rebalancing or widening [1] | Yes, at/beyond the boundary the position converts to the asset being sold into the pool [1] | Stops when out-of-range [1] |
| Curve StableSwap (plain pool) | Low slippage around $1; higher A increases tolerance near balance [2][3] | As imbalance grows, the curve shifts toward constant-product; slippage increases and the stronger coin may be drained [2][3] | Yes, inventory skews toward the asset traders are selling into the pool | Continues, but fees must offset slippage/inventory risk; slippage escalates as imbalance increases [2][3] |

This table is not a ranking; it is a reminder that “efficient” describes the shape near $1, not a guarantee about outcomes when one asset trades away from $1.

For context on why TVL and tight quotes can be misleading comfort during stress, see our primers on pool-level hazards and capital measures: [Liquidity pool risks](/guides/liquidity-pool-risks) and [TVL explained](/guides/tvl-explained).

## Putting scenarios together: who holds which bag, when

Combine the mechanics and the market structure:

- Secondary vs. primary. Secondary-market prices inside a pool are not the same as issuer redemption. Arbitrage can help align them in normal times, but under stress prices can diverge and stay divergent if redemption is slow, gated, or uncertain [5].
- Arbitrage and ordering. When a mispricing opens between two venues, an arbitrageur can buy low and sell high atomically, contingent on transaction ordering and inclusion [4]. If your assets are the “low” side of that trade, that flow is funded by your inventory as a provider.
- StableSwap tolerance is conditional. A high A smooths small wobbles at $1 but increases the speed at which slippage rises once the pool skews [2]. You get cheaper daily swaps but a sharper experience when the crowd runs for one asset.
- Concentrated ranges are brittle. The fee boost is conditional on staying in-range. During a depeg, ranges can flip to inactive, marooning providers in single-asset exposure until they rebalance [1].

None of these outcomes are failures of design; they are the design working as specified. The question is whether you can explain, in advance, where your dollars go when the clause is triggered.

## What to check before you act

- If one token trades 2–5% below target, which liquidity in this pool still executes my swap, and which positions go inactive?
- For my exact position, what asset mix would I withdraw if the pool balance skews—am I prepared to receive mostly the weaker coin?
- What is my exit venue if redemption is uncertain—am I depending on secondary liquidity only, or do I have a path to primary redemption timing [5]?
- Is my swap exposed in the public mempool, and how would sandwiching or reordering around it change my effective price [4]?
- For concentrated liquidity, what are my rebalance triggers and costs if price leaves the band [1]?
- For a Curve-style pool, what is the amplification parameter and pool composition; do wrappers or base pools add dependencies I must evaluate [2]?

Clear answers turn “APY plus a dollar sign” into a described, bounded position.

## References

1. [Concentrated Liquidity | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Curve StableSwap: Pools](https://curve.readthedocs.io/exchange-pools.html)
3. [StableSwap - efficient mechanism for Stablecoin liquidity](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Maximal extractable value (MEV) | ethereum.org](https://ethereum.org/developers/docs/mev/)
5. [Primary and Secondary Markets for Stablecoins | Federal Reserve](https://www.federalreserve.gov/econres/notes/feds-notes/primary-and-secondary-markets-for-stablecoins-20240223.html)


[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity | Uniswap Developers"
[2]: https://curve.readthedocs.io/exchange-pools.html "Curve StableSwap: Pools"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap - efficient mechanism for Stablecoin liquidity"
[4]: https://ethereum.org/developers/docs/mev/ "Maximal extractable value (MEV) | ethereum.org"
[5]: https://www.federalreserve.gov/econres/notes/feds-notes/primary-and-secondary-markets-for-stablecoins-20240223.html "Primary and Secondary Markets for Stablecoins | Federal Reserve"
