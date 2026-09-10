---
title: "Uniswap v2 vs v3: Which Liquidity Position Suits You"
description: "Uniswap v2 and v3 compared for liquidity providers: capital efficiency, fee tiers, divergence, time in range, management workload, and when the simpler pool wins."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Dr. Elena Rostova"
readTime: "11 min read"
keywords: "Uniswap v2 vs v3 liquidity, Uniswap v2 liquidity pool, v2 vs v3 capital efficiency, full range liquidity, passive liquidity provision"
featured: false
faq:
  - q: "What is the difference between Uniswap v2 and v3?"
    a: "v2 spreads liquidity across every possible price and requires no management. v3 lets each provider choose a price range, which concentrates depth and multiplies fee income per dollar while introducing time out of range and a management workload."
  - q: "Is Uniswap v3 always better than v2?"
    a: "No. v3 earns more per dollar only while the position is in range, and it costs gas to keep it there. On volatile pairs, small positions, or for providers who will not monitor, a full-range position behaves better after costs."
  - q: "Can you provide full-range liquidity on Uniswap v3?"
    a: "Yes. Minting a position across the full tick range reproduces v2-style behaviour with v3 fee tiers, at higher gas than v2 and with the same absence of boundary risk."
  - q: "Does Uniswap v2 have impermanent loss?"
    a: "Yes, and it follows the standard curve: 5.72% at a doubling, 20% at a four-times move. v3 experiences the same divergence amplified while price is inside a narrow band, then bounded once the position converts."
  - q: "Which version pays more in fees?"
    a: "Whichever one holds liquidity where the volume actually trades. A concentrated position in a well-chosen band earns several times more per dollar than a full-range one; the same position out of range earns nothing at all."
---

The migration from Uniswap v2 to v3 is usually described as a capital efficiency upgrade. For a liquidity provider it is closer to a change of job: v2 is a deposit, v3 is a position that has to be managed, and the higher fee density is compensation for that work rather than a free improvement.

Choosing between them is a question about your own constraints, not about which contract is more advanced.

<figure class="article-figure">
  <img src="/images/guides/uniswap-v2-vs-v3.webp" alt="Comparison table of Uniswap v2 and v3 across deposit, capital efficiency, fee tiers, divergence, time in range and work required." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same pair, two products: a passive claim and a managed position. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Capital efficiency is quoted as a multiple, usually a large one, and it is real while price sits inside the band. Multiply it by the fraction of the period the position was actually in range and the number gets ordinary very quickly. Anyone comparing v2 and v3 without that second term is comparing a best case against an average."*

## 1. What Actually Changed

In v2 every liquidity provider supplies the same curve across all prices from zero to infinity [1]. Shares are fungible, the pool has one fee, and there is nothing to maintain.

In v3 each provider chooses bounds. The curve is translated so reserves reach zero at those bounds, which means the same capital backs far more quoted depth inside the band and none outside it [2]. Fee tiers become separate pools, and the claim becomes a position NFT.

The pricing mathematics is the same. Divergence, adverse selection and fee accrual all behave identically; the difference is the distribution of liquidity across price.

---

## 2. Capital Efficiency, Honestly Stated

The multiplier for a symmetric band from $p_a$ to $p_b$ around the current price is approximately:

$$C = \frac{1}{1 - \left(\frac{p_a}{p_b}\right)^{1/4}}$$

A ±10% band gives roughly 20 times the depth of a full-range position for the same capital. A ±2% band gives roughly 100 times.

Now apply the second term. If that ±2% band on a volatile pair is in range 30% of the month, the realised multiple is closer to 30 times, and every exit and re-entry costs gas. If it is in range 10% of the month because the pair trended, the realised multiple can fall below what a wide band would have produced.

| Structure | Nominal multiple | Plausible time in range | Realised multiple |
| :--- | ---: | ---: | ---: |
| Full range (v2 equivalent) | 1x | 100% | 1x |
| ±20% band | roughly 10x | 80% | 8x |
| ±10% band | roughly 20x | 55% | 11x |
| ±2% band | roughly 100x | 15% | 15x |

The pattern is not that narrow is bad. It is that the marginal gain flattens while gas and attention costs keep rising, which is the trade-off modelled in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/).

---

## 3. Divergence Behaves Differently at the Edges

On a v2 position, divergence follows the unbounded curve indefinitely: the position always holds some of both assets, and the shortfall against holding grows with the price ratio.

On a v3 position, divergence is amplified inside the band and then stops growing once price passes a bound and the position is fully converted. Bounded is not the same as small: the converted position stops participating in the remainder of the move, which is an opportunity cost the impermanent loss formula never displays.

Worked examples of both cases are in [Impermanent Loss Examples](/guides/impermanent-loss-examples/).

---

## 4. Where Each Version Wins

**v2-style full-range positions are better when:**

- The position is small enough that gas for rebalancing is a material share of fee income.
- The pair is volatile or trending, so any reasonable band exits quickly.
- Nobody will be monitoring the position week to week.
- The provider wants exposure that behaves predictably and needs no operational attention.

**v3 concentrated positions are better when:**

- The pair trades in a recognisable range and realised volatility is moderate.
- The position is large enough to absorb management costs comfortably.
- There is a rule-based process for rebalancing rather than reactive re-centring.
- The fee tier with the routed volume happens to be one where competing liquidity is thin.

### A worked comparison over one month

Two providers each deploy \$30,000 into ETH/USDC for thirty days. The pair drifts 9% higher with 55% annualised volatility.

The first supplies a full-range position and earns a modest fee yield the whole month, never touching the position. Gas: one mint, one exit. Divergence at that ratio: roughly −0.2%.

The second supplies a ±8% band at the same tier. While in range the position earns roughly fifteen times the fee density, but the drift pushes price through the upper bound around day eleven. The provider re-centres twice, paying gas each time and realising the composition at each re-centre.

Whether the second position wins depends almost entirely on how much of the month it spent quoted and how much the two re-centres cost. On a cheap network with disciplined rebalancing it wins comfortably. On mainnet at a small size, the same strategy can end the month behind the passive position that required no attention at all.

---

## 5. What Migration Actually Costs

Moving a position is not free. It requires withdrawing from one pool, possibly swapping to reach the new deposit ratio, and minting again. That sequence pays gas twice, realises the current composition, and can incur price impact on the rebalancing swap.

A reasonable rule is to migrate with new capital rather than by churning existing positions, unless the destination pool's routed volume per unit of liquidity is clearly and persistently higher. Where a pair has moved to a newer version wholesale, the volume difference is usually obvious in a month of data; where it has not, migration is a cost with no offsetting revenue.

---

## 6. Reading the Data Before Choosing

- **Routed volume per pool and tier**, not aggregate pair volume, from pool analytics or a Dune query.
- **Active liquidity in your intended band**, read from the pool's liquidity distribution rather than from total value locked.
- **Realised volatility over 7 and 30 days**, which sets how long any band will hold.
- **Your own historical time in range**, if you have run similar positions, reconstructed on [Revert Finance](https://revert.finance).

With those four numbers, the choice usually makes itself, and it frequently favours the simpler structure for individual providers.

One more consideration favours the simpler structure more often than providers expect: attention is a real budget. A concentrated position that is monitored for a fortnight and then forgotten reverts to the worst version of itself, holding a single asset and earning nothing while the provider believes capital is working. A full-range position that is forgotten simply keeps quoting. For a portfolio that already demands attention elsewhere, the structure that fails gracefully is worth a lower headline yield. The wider taxonomy of pool structures is in [Types of Liquidity Pools](/guides/liquidity-pool-types/).

---

## 7. Checklist

- [ ] Decide the management cadence you will genuinely maintain, then choose the structure that matches it.
- [ ] Compute the realised capital multiple, not the nominal one, using an honest time-in-range estimate.
- [ ] Compare gas for that cadence against expected fee income at your position size.
- [ ] For a concentrated band, compute holdings at both bounds and accept both.
- [ ] Check where volume actually routes for the pair before assuming the newer pool is deeper.
- [ ] Record entry state either way, so the two approaches can be compared on your own data later.

The newer contract is more capable. Whether it is more profitable for a specific provider is an operational question, and the answer is often no.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
7. [SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
8. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[7]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)"
[8]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
