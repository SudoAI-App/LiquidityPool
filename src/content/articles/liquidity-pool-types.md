---
title: "Types of Liquidity Pools: Matching the Curve to the Pair"
description: "Constant product, concentrated, stable, weighted, discrete bin and lending pools compared: what each invariant optimises for and which exposure it hands the LP."
category: "Foundations"
date: 2026-09-10
lastReviewed: "2026-09-10"
author: "Aria Chen"
readTime: "12 min read"
keywords: "types of liquidity pools, liquidity pool types, stablecoin liquidity pool, weighted liquidity pool, correlated asset liquidity pool, lending pool vs liquidity pool"
featured: false
faq:
  - q: "What are the main types of liquidity pools?"
    a: "Constant-product pools spanning all prices, concentrated liquidity pools that restrict depth to a chosen range, amplified stable pools for pegged assets, weighted multi-asset pools, discrete bin pools that quote in fixed steps, and lending pools, which are a different instrument that shares the name."
  - q: "Which liquidity pool type is best for stablecoins?"
    a: "An amplified stable curve, because it holds price near the peg with very low slippage for the bulk of trading. The trade-off is that the same flatness causes the pool to absorb large quantities of an asset that is depegging before price impact rises meaningfully."
  - q: "What is the difference between a lending pool and a liquidity pool?"
    a: "A lending pool matches suppliers with borrowers and pays interest set by a utilisation curve, with no automated price quoting and no divergence loss. A liquidity pool quotes prices for swaps from its reserves, so the supplier is short volatility rather than long a credit exposure."
  - q: "Do 80/20 weighted pools reduce impermanent loss?"
    a: "They reduce it relative to a 50/50 pool for the same price move, because less of the portfolio rotates. They do not eliminate it, and they leave the position with more concentrated directional exposure to the heavier asset."
---

Every liquidity pool implements a rule that maps reserves to prices. The choice of rule decides how much depth exists near the current price, how fast the pool rotates inventory when the market moves, and which failure mode the liquidity provider is underwriting. Selecting a pool is therefore mostly a question of matching the curve to the statistical behaviour of the pair.

The taxonomy below is organised by that criterion rather than by protocol brand, because the same invariant appears across many venues.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-types.webp" alt="Price curves for constant product, amplified stable and weighted pools beside cards describing four pool families." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Three invariants plotted against reserve ratio, with the exposure each pool family hands its liquidity providers. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"Most disappointing LP outcomes I review are curve mismatches, not bad luck. A liquid staking token paired against its base asset belongs on an amplified curve; putting it on a plain constant-product pool wastes most of the capital in price regions that will never trade, and the LP funds that waste through foregone fees."*

## 1. Constant Product: Uniform Depth, Uniform Risk

The original design holds $x \cdot y = k$ across all prices from zero to infinity [1]. Depth is spread uniformly in a specific mathematical sense: the pool can always quote, at any price, with impact rising as a proportion of the reserve consumed.

- **Optimises for**: robustness and simplicity. The pool never runs out of liquidity, never needs management, and cannot go out of range.
- **Costs**: capital efficiency. Most of the deposited value backs price regions the market will never visit.
- **LP exposure**: the standard divergence profile, symmetric in log price.
- **Appropriate for**: passive positions, long-tail pairs with unpredictable ranges, and anyone unwilling to manage bounds.

The mechanics are treated in [The Constant Product Formula: How x × y = k Shapes AMM Prices](/guides/constant-product-formula/).

---

## 2. Concentrated Liquidity: Depth Where You Choose

Tick-based pools let each position specify bounds $[p_a, p_b]$ and translate the constant-product curve so that reserves reach zero at those bounds [2]. Capital efficiency inside the band rises by a factor that grows as the band narrows.

- **Optimises for**: fee density per dollar deployed.
- **Costs**: active management, and zero income whenever price is outside the band.
- **LP exposure**: amplified divergence inside the range, full conversion at the boundary.
- **Appropriate for**: pairs with a view on the trading range, and LPs who will actually monitor and rebalance.

See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/) and [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) for the two halves of that trade.

---

## 3. Amplified Stable Curves: Flat Near the Peg

StableSwap-style invariants blend constant-sum and constant-product behaviour through an amplification coefficient $A$ [3]:

$$A n^n \sum x_i + D = A D n^n + \frac{D^{n+1}}{n^n \prod x_i}$$

Near balance the curve is almost flat, so large trades clear with minimal slippage. As reserves skew, the curve steepens toward constant-product behaviour.

- **Optimises for**: execution quality on assets expected to trade near a fixed ratio.
- **Costs**: a sharply asymmetric tail. If one asset depegs, the pool absorbs it at near-par until reserves are heavily imbalanced.
- **LP exposure**: small, steady fee income with a large, rare loss attached to peg failure.
- **Appropriate for**: fiat stablecoin pairs, liquid staking tokens against their base asset, and wrapped representations of the same asset.

The tail behaviour is examined in [Stablecoin Liquidity Pools: Peg Defense, Yield, and Systemic Risk](/guides/stablecoin-liquidity-pools/).

---

## 4. Weighted and Multi-Asset Pools

Constant-mean invariants generalise the two-asset product to arbitrary weights:

$$\prod_i B_i^{w_i} = k, \qquad \sum_i w_i = 1$$

An 80/20 pool holds most of its value in one asset while still quoting both. For a given price move, less of the portfolio rotates, so divergence is smaller than in a 50/50 pool, and the position retains more directional exposure to the heavy asset.

- **Optimises for**: index-like exposure with a fee stream, and for token launches where a project wants to seed a market without a large treasury of the quote asset.
- **Costs**: less depth for the light asset, and concentrated directional risk.
- **LP exposure**: partial divergence, dominated by the heavy asset's price path.
- **Appropriate for**: treasury-managed positions and portfolio-style allocations.

Covered in detail in [Balancer Weighted Pools](/guides/balancer-and-weighted-pools/).

---

## 5. Discrete Bin Pools

Bin-based designs quote a fixed price within each bin and move between bins in steps, so trades that stay inside a bin execute with no slippage at all [4]. Liquidity is distributed across bins by the LP, which permits shapes that continuous curves cannot express.

- **Optimises for**: precise liquidity shaping and zero intra-bin slippage.
- **Costs**: price can gap across empty bins during volatility, and shapes require active management.
- **LP exposure**: similar to concentrated liquidity, with bin-level granularity and, in some implementations, a volatility-linked dynamic fee.
- **Appropriate for**: active market makers who want an explicit distribution rather than a single band.

See [Discretized Liquidity (DLMM)](/guides/discretized-liquidity-dlmm-explained/).

---

## 6. Lending Pools Are a Different Instrument

A lending pool shares the word and almost nothing else. Suppliers deposit a single asset; borrowers post collateral and pay interest set by a utilisation curve. There is no automated price quoting, no inventory rotation, and therefore no divergence loss.

| Dimension | Liquidity pool | Lending pool |
| :--- | :--- | :--- |
| Assets supplied | Two or more, in ratio | One |
| Revenue | Swap fees | Borrower interest |
| Primary risk | Divergence, adverse selection | Bad debt, oracle failure, liquidation shortfalls |
| Capacity constraint | Depth at the traded price | Utilisation and available liquidity to withdraw |
| Withdrawal | Any block, at current ratio | Subject to utilisation; can be blocked when fully drawn |

Both are legitimate; conflating them produces mis-sized positions and the wrong monitoring stack.

## 6b. Where the Same Curve Appears Under Different Names

Protocol branding obscures how much overlap exists between venues. A concentrated liquidity pool on one chain and a "v3-style" fork on another implement the same translated constant-product invariant with different tick spacing and fee tiers. An amplified stable curve appears under several names with different parameter defaults for the amplification coefficient. The consequence for research is that the questions transfer: whatever the interface calls it, ask which invariant governs pricing, what the parameters are, where the curve is flat and where it steepens, and what the position holds at the extremes.

The one place branding does matter is implementation maturity. The same mathematics deployed in an unaudited fork, with an admin key over the fee parameters, is a materially different risk from a long-lived deployment with immutable core contracts. Read the invariant to understand the exposure, and read the deployment to understand the counterparty.

---

## 7. Selection Checklist

- [ ] Classify the pair: pegged, correlated, or independent. This alone eliminates most curves.
- [ ] Measure trailing realised volatility and the typical trading range over one to three months.
- [ ] Choose the invariant that concentrates depth where the pair actually trades.
- [ ] For range-based curves, size the band against volatility rather than against a target yield.
- [ ] Check where volume actually routes for the pair; the best curve with no flow earns nothing.
- [ ] Confirm the failure mode you are accepting: boundary conversion, peg absorption, or gap risk.
- [ ] Verify contract maturity and audits for the specific implementation, not the family.

The correct question is never which pool type is best. It is which pricing rule you want standing in the market on your behalf when this particular pair moves.

## Where to Go Next

Once the curve is chosen, size the position with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) and check the exposure with the [impermanent loss calculator](/tools/impermanent-loss-calculator/).

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [StableSwap: efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Trader Joe Liquidity Book Whitepaper](https://docs.traderjoexyz.com/concepts/concentrated-liquidity)
5. [Balancer Whitepaper: A non-custodial portfolio manager and liquidity provider](https://balancer.fi/whitepaper.pdf)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap: efficient mechanism for Stablecoin liquidity"
[4]: https://docs.traderjoexyz.com/concepts/concentrated-liquidity "Trader Joe Liquidity Book documentation"
[5]: https://balancer.fi/whitepaper.pdf "Balancer Whitepaper"
