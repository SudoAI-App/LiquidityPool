---
title: "Bonding Curves and AMM Invariants: How Curve Shape Sets Risk"
description: "What a bonding curve is, how constant-sum, constant-product and amplified invariants differ, and how curve shape decides slippage, inventory rotation and tail risk."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Dr. Elena Rostova"
readTime: "11 min read"
keywords: "bonding curve crypto, invariant AMM, constant sum market maker, constant product market maker, curve shape slippage, AMM invariant design"
featured: false
faq:
  - q: "What is a bonding curve in crypto?"
    a: "A rule that maps a contract's reserves to a price. In an automated market maker the curve is the invariant: given the reserves, it determines the price of the next trade and how that price changes as the trade executes."
  - q: "What is an AMM invariant?"
    a: "The quantity the pool holds constant across a trade, before fees. Constant product keeps the product of reserves fixed, constant sum keeps their sum fixed, and amplified curves interpolate between the two using a coefficient."
  - q: "Which invariant has the least slippage?"
    a: "Constant sum, which quotes a fixed price until one reserve is exhausted. It is only usable for assets expected to trade at a fixed ratio, because it offers no defence when that assumption fails."
  - q: "Why do most pools use constant product?"
    a: "Because it never runs out of liquidity and requires no assumption about where the pair should trade. Price impact rises with order size, which is the mechanism that keeps reserves available at any price."
  - q: "How does curve shape affect impermanent loss?"
    a: "Flatter curves near the operating point rotate inventory faster for a given price move, so they lose more when the assumption behind the flatness breaks. Convex curves rotate gradually and produce the familiar divergence profile."
---

Every automated market maker is a curve plus a fee. The curve decides how much depth exists at each price, how fast reserves rotate when the market moves, and which failure the liquidity provider is underwriting. Choosing a pool is therefore, at bottom, choosing a curve.

Three canonical shapes bound the design space, and every production invariant sits somewhere between them.

<figure class="article-figure">
  <img src="/images/guides/bonding-curves-and-amm-invariants.webp" alt="Three curve families plotted on the same axes: constant product, amplified stable and constant sum." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Three invariants on the same axes, from perfectly flat to perfectly convex. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Curvature is the price of being wrong. A flat curve gives excellent execution as long as the assumption holds and no defence at all when it breaks. A convex curve charges everyone a little on every trade and, in exchange, never leaves the pool without inventory. That is the entire design conversation."*

## 1. Constant Sum: Perfect Execution, No Defence

The simplest invariant holds the sum of reserves constant:

$$
x + y = k
$$

Price is fixed at one for one regardless of the reserve balance, so trades execute with no slippage at all. The problem is what happens when the true market price moves away from that ratio: arbitrageurs drain the cheaper asset entirely, and the pool is left holding only the asset nobody wants.

Constant-sum curves are therefore never used alone in production. They appear as one component of hybrid designs, contributing flatness near the expected ratio.

---

## 2. Constant Product: Always Solvent, Always Charging

The workhorse invariant holds the product constant [1]:

$$
x \cdot y = k
$$

The marginal price is the reserve ratio, and the curve is a hyperbola: reserves approach but never reach zero, so the pool can quote at any price. Price impact for an order of size $\Delta x$ against reserve $x$ is approximately:

$$
\text{impact} \approx \frac{\Delta x / x}{1 + \Delta x / x}
$$

The properties that matter to a provider: the pool never runs out, the divergence profile is the familiar symmetric one, and depth is spread across every price including those the pair will never visit. The derivation and its consequences are in [The Constant Product Formula](/guides/constant-product-formula/).

---

## 3. Amplified Curves: Flat Where It Matters

Hybrid invariants interpolate. The StableSwap design combines constant-sum and constant-product behaviour through an amplification coefficient $A$ [3]:

$$
A n^n \sum x_i + D = A D n^n + \frac{D^{n+1}}{n^n \prod x_i}
$$

Near balance the curve is almost flat, giving stable-pair execution close to constant sum. As reserves skew, it steepens toward constant product, which preserves solvency. The coefficient sets where that transition happens: high amplification means a flatter centre and a sharper cliff.

The trade is explicit. Flatness is efficiency while the peg holds and absorption when it does not, examined in [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

---

## 4. Concentration Is a Third Axis

Concentrated liquidity is not a different curve. It is the constant-product curve translated so that reserves reach zero at chosen bounds [2]:

$$
\left(x + \frac{L}{\sqrt{p_b}}\right)\left(y + L\sqrt{p_a}\right) = L^2
$$

Inside the band, the same capital backs far more depth. Outside it, the position holds one asset and quotes nothing. Discrete bin designs go further, quoting a fixed price within each bin so that intra-bin trades have no slippage at all, then stepping between bins as liquidity is consumed.

That means two independent choices exist: which curve family, and how concentrated within it. See [Types of Liquidity Pools](/guides/liquidity-pool-types/) for the practical matrix.

---

## 5. What Curvature Costs the Provider

Curvature and adverse selection are linked. For a constant-function market maker tracking an external reference price, the rate at which value leaks to arbitrage depends on the curve's second derivative at the operating point and on the variance of the reference price [4].

The intuition without the algebra: a flatter curve gives away more inventory for a given price move, because it barely adjusts its quote until reserves have shifted substantially. That is desirable when the reference price genuinely does not move and expensive when it does.

| Curve | Slippage for traders | Inventory rotation | Failure mode |
| :--- | :--- | :--- | :--- |
| Constant sum | None until exhausted | Immediate and total | Pool holds only the weak asset |
| Amplified | Very low near balance | Fast near balance | Absorbs a depegging asset |
| Constant product | Proportional to size | Gradual, symmetric | Standard divergence |
| Concentrated | Very low in band | Fast in band | Conversion at the bound |

---

## 6. Reading a New Design

When a protocol proposes a novel curve, four questions establish what it actually does:

1. **Where is the curve flat, and what assumption is that flatness pricing?**
2. **What happens at the extremes of the reserve ratio?** Every design has a corner; find it before depositing.
3. **How does it behave when the assumption fails?** Simulate a 10% dislocation and read the resulting composition.
4. **Who sets the parameters, and can they change them after deposits arrive?** An amplification coefficient under governance control is a live parameter, not a constant.

A curve that answers all four cleanly is usually a small variation on one of the families above. One that cannot answer the second or fourth is not a curve innovation, it is an unpriced governance risk.

### Why fees and curvature are usually mismatched

A curve determines how much value leaks to informed flow. A fee tier determines how much the pool charges for it. Those two numbers are set separately, often by different parties, and they are frequently inconsistent.

A flat amplified curve on a pair whose peg is genuinely reliable can support a one basis point fee, because adverse selection is minimal. The same curve on a pair whose peg is questionable is dramatically underpriced at that fee, since the pool absorbs the dislocation at close to par while charging almost nothing for the privilege.

The reverse also occurs. A 100 basis point tier on a constant-product pool for a stable pair charges far more than the curvature requires, and simply loses the volume to a cheaper venue.

The practical test is to compare the fee against the pair's realised volatility rather than against other pools. If a pool's fee has not changed while the pair's volatility has doubled, the pool is now underpriced regardless of what its neighbours charge, which is precisely the gap dynamic fees are designed to close.

---

## 7. Checklist Before Supplying an Unfamiliar Curve

- [ ] Identify the invariant equation and which family it belongs to.
- [ ] Locate the region where the curve is flat and confirm the pair belongs there.
- [ ] Compute the composition at a 70/30 and a 90/10 reserve skew.
- [ ] Check who controls curve parameters and whether changes are timelocked.
- [ ] Compare quoted depth against a constant-product pool of the same size for a realistic trade.
- [ ] Read whether concentration is a separate choice on top of the curve family.
- [ ] Size the position against the failure mode implied by the flat region.

Every invariant is a bet that the pair will behave a certain way. The curve is where that bet is written down, and it is worth reading before signing.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [StableSwap: efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Balancer Whitepaper: A non-custodial portfolio manager and liquidity provider](https://balancer.fi/whitepaper.pdf)
6. [When Does the Tail Wag the Dog? Curvature and Market Making (Angeris et al., 2020)](https://arxiv.org/abs/2012.08040)
7. [Improved Price Oracles: Constant Function Market Makers (Angeris & Chitra, 2020)](https://arxiv.org/abs/2003.10001)
8. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
9. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap: efficient mechanism for Stablecoin liquidity"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://balancer.fi/whitepaper.pdf "Balancer Whitepaper"
[6]: https://arxiv.org/abs/2012.08040 "When Does the Tail Wag the Dog? Curvature and Market Making (Angeris et al., 2020)"
[7]: https://arxiv.org/abs/2003.10001 "Improved Price Oracles: Constant Function Market Makers (Angeris & Chitra, 2020)"
[8]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[9]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
