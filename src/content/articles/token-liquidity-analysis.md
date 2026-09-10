---
title: "Token Liquidity Analysis: Measuring What Can Actually Be Sold"
description: "How to analyse a token's real liquidity: active depth, exit size, venue fragmentation, holder concentration, volume quality and lock status, all from public chain data."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Marcus Vance"
readTime: "11 min read"
keywords: "token liquidity analysis, on-chain pool analytics, how to research a DeFi pool, exit liquidity, volume quality, holder concentration, liquidity pool data"
featured: false
faq:
  - q: "How do you analyse a token's liquidity?"
    a: "Measure the capital available within a defined price band across every venue, compute the trade size that moves price by a set percentage, then check how much of the reported volume is organic rather than arbitrage or wash activity."
  - q: "What is exit liquidity?"
    a: "The size that can be sold without moving price beyond your tolerance. It is a function of active depth on the sell side, not of market capitalisation or headline volume, and it sets the practical cap on any position."
  - q: "Is high trading volume a good sign?"
    a: "Only if the volume is organic. A large share of reported volume on thin tokens comes from arbitrage between venues or from wash trading, neither of which indicates that a position could be exited at the quoted price."
  - q: "How much liquidity is enough?"
    a: "Enough that your intended position is a small fraction of the depth you could exit into under stress, not under current conditions. A common institutional rule is that a full exit should move price by less than a few percent."
  - q: "What onchain data should I check first?"
    a: "Pool addresses and their reserves, liquidity distribution around the current price, holder concentration excluding known contracts, the lock status of pooled liquidity, and a breakdown of recent swaps by counterparty type."
---

Market capitalisation describes an accounting identity. Volume describes activity that may or may not be real. Neither answers the only question that matters before taking a position in a token: how much of it can actually be sold, at what price, under conditions worse than today's.

Six measurements answer that, and all six come from public chain data.

<figure class="article-figure">
  <img src="/images/guides/token-liquidity-analysis.webp" alt="Six cards describing active depth, exit size, venue spread, holder shape, volume quality and lock status." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six measurements that describe a token's real liquidity, none of which is market capitalisation. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"The number I want is the one nobody publishes: what does it cost to get out of this position in a bad week. Everything else, the market cap, the daily volume, the holder count, is decoration around that single figure, and it is computable in about ten minutes from pool state."*

## 1. Active Depth, Not Total Liquidity

Start with the pools themselves. For each venue holding meaningful liquidity in the token, compute the capital within a defined band of the current price, typically two percent in each direction.

In constant-product pools that follows from reserves. In concentrated pools it requires summing liquidity across ticks in the band, because deposits sitting in distant ranges contribute nothing. The full method is in [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/).

Record both sides separately. Depth is frequently asymmetric after a trend, and the side you need is often the thin one.

---

## 2. Exit Size at a Tolerated Impact

Convert depth into the number that governs sizing:

$$S_{\text{exit}} = \text{the trade that moves price by } \delta$$

Compute it for several values of $\delta$, since the shape of the curve matters more than any single point.

| Impact tolerated | Sell size supported | Interpretation |
| :--- | ---: | :--- |
| 1% | \$85,000 | Routine exits, no urgency |
| 3% | \$270,000 | A full position exit for most participants |
| 5% | \$460,000 | Stressed exit, still orderly |
| 10% | \$900,000 | Forced liquidation territory |

A position larger than the three percent figure is a position that cannot be exited without moving the market against yourself, which is a different risk from the one most people think they are taking.

---

## 3. Venue Fragmentation

The same token may trade across several pools, fee tiers and chains. Aggregate depth overstates what is available at any one of them, and routing between them carries its own costs.

Three checks:

- **List every venue** with more than a trivial share of depth, including centralised venues if the token trades there.
- **Check whether the venues are actually connected** by arbitrage. Persistent price differences indicate that they are not, which means depth cannot be combined.
- **For cross-chain deployments**, note that each chain's liquidity is separate, and bridging to reach it takes time and carries its own risk, as covered in [Cross-Chain Liquidity Explained](/guides/cross-chain-liquidity-explained/).

---

## 4. Holder Concentration and Supply Overhang

Depth answers what can be sold now. Concentration answers who else is likely to be selling.

- **Top-holder share** excluding known contracts, staking pools and burn addresses.
- **Unlock schedules** for team, investor or incentive allocations, read from vesting contracts rather than from documentation.
- **Emission rate** if the token is being issued to farms, since that supply arrives continuously and is largely sold, as discussed in [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

A token with thin exit depth and a large cliff unlock approaching is a specific, dateable risk rather than a general one.

---

## 5. Volume Quality

Reported volume mixes several activities that mean very different things:

| Volume type | What it indicates | How to identify |
| :--- | :--- | :--- |
| Organic swaps | Genuine demand and supply | Diverse counterparties, varied sizes |
| Arbitrage | Price alignment across venues | Paired trades in the same block, bot addresses |
| Wash trading | Nothing | Repeating addresses, round sizes, self-matching |
| Just-in-time liquidity | Depth that was never really there | Mint and burn in the same block as a large swap |

Attribution tools such as [EigenPhi](https://eigenphi.io) separate arbitrage and sandwich flow from ordinary trading. For a liquidity provider the mix matters directly: arbitrage volume pays a fee while repricing the pool at your expense, a relationship developed in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).

### Depth is a moving target

Every figure above is a measurement of a single moment, and the moments that matter are the ones you cannot measure in advance.

Active depth thins during volatility as concentrated positions convert and stop quoting, and as providers withdraw rather than hold inventory through a move. Volume rises at the same time. The result is that the exit size supported during a stressed hour is materially smaller than the calm-market figure, often by half or more.

Two adjustments make the analysis usable. First, discount the current depth reading substantially when sizing, treating a stressed measurement rather than a comfortable one as the constraint. Second, look up historical depth during the pair's previous volatile episodes, which is recoverable from tick-level history and is a far better guide to how the exit will behave than anything measured on a quiet afternoon.

---

## 6. Lock Status and Control

Liquidity that can be withdrawn by one party is not liquidity you can rely on. Check where the pool's LP claim sits, how much of it is locked, and until when. Then check the token contract for permissions that could impair transfers.

The full sequence is in [Rug Pulls and Locked Liquidity](/guides/liquidity-pool-rug-pulls/). For an established token this check takes a minute and usually passes; for a recent launch it is the single highest-value thing on this list.

### Two tokens, same market capitalisation

Token A and Token B both show a \$40m market capitalisation and roughly \$2m of reported daily volume. The analysis separates them completely.

Token A has \$3.1m of active depth within two percent, spread across two pools on one chain, with 62% of recent volume attributable to ordinary swaps and the top ten wallets holding 18% of supply. A three percent exit supports roughly \$210,000.

Token B has \$340,000 of active depth, split across five venues on three chains with visible price differences between them, 78% of volume attributable to arbitrage and repeated address pairs, and 61% of supply in four wallets with a cliff unlock in six weeks. A three percent exit supports roughly \$22,000.

The headline figures are identical. The maximum sensible position differs by an order of magnitude, and only one of the two tokens can absorb an ordinary allocation without the exit becoming the dominant risk. That gap is invisible on any listing page and takes ten minutes to establish from chain data.

---

## 7. Assembling the Analysis

A workable one-page output for any token:

- [ ] Active depth within ±2%, both sides, summed by venue.
- [ ] Exit size at 1%, 3%, 5% and 10% impact.
- [ ] Venue list with depth share and evidence of arbitrage linkage.
- [ ] Top-ten holder share excluding contracts, plus upcoming unlocks.
- [ ] Weekly emission as a share of circulating supply, if any.
- [ ] Volume split into organic, arbitrage and suspicious.
- [ ] Lock status of pooled liquidity with amounts and unlock dates.
- [ ] Maximum position size implied by the three percent exit figure.

The last line is the deliverable. Everything above it exists to produce a number you can size against, and a position sized from that number behaves very differently in a bad week from one sized against a market capitalisation.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Trading in the DeFi era: automated market-maker (Bank for International Settlements, 2023)](https://www.bis.org/publications/trading-defi-era-automated-market-maker)
3. [Quantifying Blockchain Extractable Value: How dark is the forest? (Qin et al., 2021)](https://arxiv.org/abs/2101.05511)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://www.bis.org/publications/trading-defi-era-automated-market-maker "Trading in the DeFi era: automated market-maker"
[3]: https://arxiv.org/abs/2101.05511 "Quantifying Blockchain Extractable Value: How dark is the forest?"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
