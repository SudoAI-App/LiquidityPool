---
title: "Liquidity Depth and Execution: The Only Number That Trades"
description: "Why liquidity depth, not total value locked, decides execution quality. How to measure depth within a price band, read a depth chart, and size orders against it."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Marcus Vance"
readTime: "11 min read"
keywords: "liquidity depth crypto, liquidity pool depth, executable depth, market depth DeFi, pool depth vs volume, spot price vs execution price AMM"
featured: false
faq:
  - q: "What is liquidity depth in crypto?"
    a: "The amount of capital available to absorb a trade within a defined price band. In a pool it is the liquidity active near the current price, and it is the quantity that determines execution cost, unlike total value locked which counts deposits regardless of where they sit."
  - q: "How do you measure pool depth?"
    a: "Compute the value that can be traded before price moves by a set percentage, typically two percent in each direction. In concentrated pools this means summing liquidity across the ticks inside that band rather than reading a headline figure."
  - q: "Why does a large pool sometimes have bad execution?"
    a: "Because most of its capital can sit in price ranges the market is not trading in. A pool with large deposits parked far from the current price offers less executable depth than a smaller pool concentrated at the touch."
  - q: "What is the difference between spot price and execution price?"
    a: "Spot is the marginal price for an infinitesimally small trade. Execution price is the average you actually receive across the whole order, which is always worse because the trade moves along the curve as it fills."
  - q: "How much of a pool can I trade against?"
    a: "As much as your tolerance for price impact allows. A practical cap for most participants is the size that moves price by two to five percent, computed from active depth rather than from the pool's total value."
---

Total value locked counts deposits. Depth counts what can actually be traded. On concentrated pools those two numbers routinely differ by an order of magnitude, and only the second one has any bearing on what a trade costs or what a position can earn.

Measuring depth properly takes a few minutes and changes both trading and liquidity decisions.

<figure class="article-figure">
  <img src="/images/guides/liquidity-depth-and-execution.webp" alt="Price impact curves against order size for three pools with different active depth." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Three pools with the same headline deposits and very different executable depth. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"We size every position from the two percent depth on both sides, never from total value locked. It is the number that tells you what happens when you need to leave in a hurry, and it is usually a fraction of what the front page of an analytics site displays."*

## 1. Defining Depth Precisely

Depth is a function of a price band, so it is meaningless without one. The standard formulation: the notional value that can be traded before the price moves by $\delta$ percent from the current level.

For a constant-product pool, depth follows directly from the reserves, and a trade of size $\Delta x$ against reserve $x$ produces roughly:

$$\text{impact} \approx \frac{\Delta x / x}{1 + \Delta x / x}$$

For a concentrated pool the calculation runs over ticks. Liquidity is constant within each tick range, so depth within a band is the sum of liquidity across the ticks it spans, converted to notional at the prices involved. Bin-based designs are simpler still: each bin holds a known amount at a known price, and depth is the sum across bins in the band.

The mechanics of tick-level accounting are covered in [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/).

---

## 2. Why It Diverges From TVL

Four effects separate deposits from executable depth:

1. **Range placement.** Capital in ranges far from the current price contributes nothing to current execution.
2. **Asymmetry.** Depth above the price and below it are different numbers, often very different after a trend.
3. **Fragmentation.** The same pair split across fee tiers, chains and venues has less usable depth at any single one than the aggregate suggests.
4. **Just-in-time liquidity.** Some depth appears only for the block containing a large trade and disappears immediately after, which flatters measured depth without helping anyone else.

The TVL side of this distinction is developed in [TVL Explained](/guides/tvl-explained/).

---

## 3. A Worked Measurement

Two pools on the same pair, both showing \$40m in an analytics interface.

| | Pool A | Pool B |
| :--- | ---: | ---: |
| Total value locked | \$40m | \$40m |
| Liquidity within ±2% | \$26m | \$3.5m |
| Trade moving price 1% | \$1.9m | \$260,000 |
| Cost of a \$500k buy | roughly 0.27% | roughly 1.9% |
| Cost of a \$2m buy | roughly 1.05% | roughly 6.8% |

Pool B is not defective. It may hold most of its liquidity in ranges placed for a different price regime, or it may be a wide-range pool on a volatile pair. But a router will send size to Pool A, which means Pool A's providers earn the fees, and anyone assuming the two pools were interchangeable pays the difference.

For traders, the same measurement sets the maximum order that should be routed to a single venue, discussed in [Slippage and Price Impact](/guides/slippage-and-price-impact/).

---

## 4. Depth From the Provider's Side

Depth is the denominator of your fee share. Supplying into a band that already holds substantial liquidity means your position captures a small fraction of the fees generated there.

That produces a specific, counterintuitive result: a pool with thin active depth can be more attractive to supply than a deep one, provided volume still routes to it. The quantity to compare is fee revenue per unit of liquidity in the band, not pool size, which is exactly what the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) computes.

The competitive dynamic matters too. Depth in a band is not static: an incentive campaign or a large mint can double it overnight, halving everyone's share without any change in volume.

---

## 5. Reading Depth in Practice

- **Pool interfaces** publish a liquidity distribution chart. Read the ticks around the current price rather than the shape as a whole.
- **Analytics dashboards** on [Dune Analytics](https://dune.com) expose tick-level liquidity for major pools, which allows a proper band calculation.
- **Aggregator quotes** are a practical shortcut: request quotes for several sizes and observe where the marginal cost curve steepens.
- **Direct contract reads** give the authoritative answer: current tick, liquidity, and the initialised ticks around it.

Whichever source, take the measurement at the moment you intend to act. Depth changes with every block, and it thins fastest during exactly the conditions where you are most likely to want it.

---

## 6. Depth and Volatility Together

Depth alone is incomplete. A pool with substantial depth on a pair with very high volatility still produces poor outcomes for providers, because the same depth is repeatedly arbitraged.

The pairing that matters is depth against turnover and turnover against volatility:

- **Deep, high turnover, moderate volatility.** The healthy case for both traders and providers.
- **Deep, low turnover.** Good execution, thin fee income; capital is idle.
- **Thin, high turnover.** Excellent fee density, severe execution costs, fragile in stress.
- **Thin, high volatility.** Avoid supplying, and route trades elsewhere.

### What depth looks like when it disappears

The measurement above is a snapshot, and the moments that matter most are the ones where the snapshot is least representative.

During a sharp move, three things happen simultaneously. Active liquidity thins as concentrated positions are pushed out of range and stop quoting. Providers who monitor actively withdraw rather than hold inventory through the move. And the trades arriving are larger than usual, because everyone reacts at once.

The result is that depth measured in calm conditions can overstate what is available during the exact window you would need it. A pool showing \$26m within two percent on a quiet afternoon may show a small fraction of that during a liquidation cascade, and the difference is not visible in any average.

Two defences follow. Size positions against a stressed depth assumption rather than a current one, discounting the calm-market measurement substantially. And check historical depth during previous volatile episodes, which is available from tick-level history and is a far better guide to exit conditions than today's reading.

---

## 7. Checklist

- [ ] Measure depth within ±2% on both sides before trading or supplying.
- [ ] Convert depth into a maximum order size at your tolerated price impact.
- [ ] Compare depth across fee tiers and venues for the same pair, not in aggregate.
- [ ] For supplying, compute fee revenue per unit of liquidity in your intended band.
- [ ] Re-measure after any incentive programme starts, since depth moves before volume does.
- [ ] Check depth asymmetry after a trend; the side you need may be the thin one.
- [ ] Never treat total value locked as a proxy for any of the above.

Depth is the only liquidity number that participates in a trade. Everything else is an accounting summary of capital that may or may not be standing where the market is.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
3. [Trading in the DeFi era: automated market-maker (Bank for International Settlements, 2023)](https://www.bis.org/publications/trading-defi-era-automated-market-maker)
4. [Quantifying Blockchain Extractable Value: How dark is the forest? (Qin et al., 2021)](https://arxiv.org/abs/2101.05511)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[3]: https://www.bis.org/publications/trading-defi-era-automated-market-maker "Trading in the DeFi era: automated market-maker"
[4]: https://arxiv.org/abs/2101.05511 "Quantifying Blockchain Extractable Value: How dark is the forest?"
