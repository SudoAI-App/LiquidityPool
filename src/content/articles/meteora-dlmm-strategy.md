---
title: "Meteora DLMM Strategy: Bin Step, Shape, and When a Position Stops Earning"
description: "How to choose a bin step and liquidity shape on Meteora DLMM, what the volatility accumulator does to your fee rate, and the rebalancing rules that survive a fast Solana market."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Dr. Elena Rostova"
readTime: "13 min read"
keywords: "Meteora DLMM strategy, Meteora DLMM bin step, Meteora DLMM fees, how to provide liquidity on Meteora, DLMM rebalance, Meteora DLMM impermanent loss, Solana liquidity pools, spot curve bid-ask distribution"
featured: false
faq:
  - q: "What bin step should I use on Meteora DLMM?"
    a: "Match the bin step to the pair's typical move between trades. Narrow steps of 1 to 10 basis points suit pegged and stable pairs where price barely travels; wider steps of 50 to 200 basis points suit volatile pairs where a narrow grid would be crossed constantly and would cost more in bin traversal than it captures in density."
  - q: "Which Meteora liquidity shape is best for a volatile pair?"
    a: "Spot and curve behave differently rather than one dominating. Spot spreads liquidity evenly across the chosen bins and tolerates being wrong about direction; curve concentrates around the active bin and earns more while price stays put. Bid-ask places weight at the edges and is a range-order structure, not a passive market-making one."
  - q: "Does Meteora DLMM have impermanent loss?"
    a: "Yes. Bins convert into the other asset as price crosses them, exactly as ticks do on a concentrated liquidity pool, so a directional move leaves the position holding the weaker side. The bin structure changes the granularity of the conversion, not its economics."
  - q: "What is the volatility accumulator on Meteora?"
    a: "A protocol-level counter of how many bins price has recently crossed, decaying over time. Its value raises the swap fee above the base rate during fast movement, so the fee you earn is not fixed and rises precisely when the pool is most likely to be quoting a stale price."
  - q: "When does a Meteora DLMM position stop earning?"
    a: "The moment price leaves the bins you funded. Only the active bin earns fees on a given swap, so liquidity in bins that price never reaches contributes nothing. This is the same failure as an out-of-range concentrated position, made more visible by the discrete structure."
---

Meteora's discretized liquidity market maker turns a price axis into a grid of fixed-price bins, and it hands the liquidity provider three decisions that a constant-product pool never asks: how wide each bin is, how many of them to fund, and what shape to spread capital across them in. Those three choices determine almost everything about how the position behaves.

The underlying mechanism is covered in [Discretized Liquidity (DLMM) Explained](/guides/discretized-liquidity-dlmm-explained/). This guide is about the operating decisions on top of it.

<figure class="article-figure">
  <img src="/images/guides/meteora-dlmm-strategy.webp" alt="A bin grid showing spot, curve and bid-ask liquidity distributions around an active bin, with a volatility accumulator trace." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Three distribution shapes across the same bin range, and the fee response as price crosses bins. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"The bin step is a microstructure decision disguised as a settings field. Choose it narrower than the pair's typical inter-trade move and you pay gas and complexity to traverse bins that a single trade would have crossed anyway. Choose it far wider and you have rebuilt a coarse constant-sum pool and given up the density you came for. Start from the pair's realised movement, not from a yield target."*

## 1. What the Bin Structure Actually Changes

Each bin quotes one price. Inside a bin the invariant is constant-sum, so a trade contained within a single bin executes with no price movement at all. Price moves only when a trade exhausts a bin and steps to the next one, and the step size is fixed by the bin step parameter $s$ in basis points:

$$ P_{i} = P_{0}\,(1 + s)^{\,i} $$

Two consequences follow directly, and both are strategy-relevant.

First, **only the active bin earns**. A swap pays fees to the liquidity sitting in the bin where the swap happens, and to any subsequent bins it traverses. Capital in bins price never visits earns nothing, in the same way that a concentrated position outside its range earns nothing. The difference is that the discrete structure makes the dead capital visible bin by bin rather than aggregated into a single range status.

Second, **crossing a bin converts your inventory**. As price moves up through your bins, each one is emptied of the base asset and filled with the quote asset. That is the same rebalancing that produces divergence loss on a continuous curve, executed in steps. The economics are identical; see [The Impermanent Loss Formula](/guides/impermanent-loss-formula/) for the closed form and [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/) for the continuous analogue.

## 2. Choosing a Bin Step

The bin step sets the price resolution of the position. The governing comparison is between the bin width and the typical distance price travels between trades on that pair.

| Bin step | Price gap per bin | Suits | Failure mode if mismatched |
|---|---|---|---|
| 1 bp | 0.01% | Pegged pairs, stable-to-stable | Bins traversed in bulk by any real trade; compute cost without density benefit |
| 10 bp | 0.10% | Liquid-staking pairs, tight majors | Position needs many bins to cover a normal day |
| 25 bp | 0.25% | Correlated majors | Reasonable default for a liquid volatile pair |
| 80 bp | 0.80% | Volatile majors, higher-beta tokens | Coarse quotes; more price impact inside each bin |
| 200 bp+ | 2.00%+ | New listings, thin long tail | Approaches a coarse constant-sum pool; large intra-bin impact |

A workable starting rule is to size the bin step near the pair's typical move over the interval between trades that actually reach your position. On a pair trading continuously, that is small. On a thin pair with minutes between swaps, it is much larger, and a fine grid there simply means each trade rips through a dozen bins.

Meteora's documentation specifies the bin step, base fee and variable fee parameters per pool, and those values are set at pool creation rather than chosen by the depositor [1]. In practice the decision is therefore which existing pool to join, and the table above is a screening tool for that choice.

## 3. The Volatility Accumulator and Your Realised Fee Rate

The fee on a DLMM swap is not the base rate. It is the base rate plus a variable component driven by a volatility accumulator, which counts recent bin crossings and decays over time. Fast movement raises the accumulator, which raises the fee.

$$ f_{\text{total}} = f_{\text{base}} + f_{\text{variable}}(V_a) $$

This matters strategically for one reason: the design deliberately charges more during the periods when the pool's quote is most likely to be stale, which is when arbitrage flow is extracting the most from liquidity providers. It is a protocol-level attempt to price adverse selection, the cost formalised as loss-versus-rebalancing [2]. It reduces that cost; it does not remove it.

The operating consequence is that a realised fee rate sampled during a calm week understates what the same position earns during a volatile one, and understates the divergence it takes at the same time. Sampling fee APR over a single quiet window is the most common measurement error on these pools. [Dynamic Fees in AMMs](/guides/dynamic-fees-in-amms/) covers the general family of designs.

## 4. Choosing a Shape

Meteora exposes three standard distributions across the bins you fund, and they encode different views.

**Spot** spreads liquidity uniformly across the selected bins. It is the neutral choice when you have no view on where price will sit, and it degrades gracefully: if price moves to the edge of the range, you still had capital working the whole way. Use it as the default for a pair you intend to hold through movement.

**Curve** concentrates weight around the active bin and thins toward the edges. It maximises fee capture while price stays near where you deposited and converts fastest when it does not. It suits range-bound pairs and short holding periods where you will be watching the position.

**Bid-ask** places weight at the outer bins and little in the middle. This is not a passive market-making shape. It is a pair of scaled limit orders: sell into strength above, buy into weakness below. Treat it as an execution tool, the DLMM equivalent of the structure described in [Range Orders on AMMs](/guides/range-orders-on-amms/), and size it as a trade rather than as an allocation.

| Shape | Fee capture while price is still | Behaviour on a trend | Best read as |
|---|---|---|---|
| Spot | Moderate | Even conversion across the move | Passive market making |
| Curve | High | Rapid conversion, then dead capital at the edge | Active, range-bound view |
| Bid-ask | Low near the middle | Fills at the edges as intended | Scaled limit orders |

## 5. A Worked Position

A $12,000 position on a volatile major, 25 bp bin step, 60 bins spanning roughly ±7.5%, spot distribution, held 30 days.

| Line | Value |
|---|---|
| Base fee tier | 0.20% |
| Average realised fee including variable component | 0.34% |
| Routed volume reaching the funded bins | $2.9M |
| Your share of liquidity in those bins | 4.1% |
| Fee income | $404 |
| Fraction of the period price was inside the range | 72% |
| Divergence on the pair over the period | −$271 |
| Solana transaction and rent costs, 14 operations | −$3 |
| Net result vs holding the deposit | +$130 |
| Annualised net rate | 13.2% |

Two features of this worked case generalise. The variable fee component added 70% to the base rate over a month with normal movement, which is the main reason DLMM pools quote differently from fixed-tier pools. And transaction costs are negligible on Solana, which inverts the gas arithmetic that dominates small positions on high-fee chains, covered in [LP Gas Costs](/guides/lp-gas-costs/). Low friction makes frequent rebalancing feasible here in a way it is not elsewhere, which is a genuine structural advantage of the venue rather than a marketing claim.

## 6. Rebalancing Rules That Survive Contact

Cheap transactions tempt over-management. The trigger should still be economic rather than emotional.

- **Rebalance on a fee-forecast rule, not on price.** Re-centre when the expected fee income in the new range over your remaining horizon exceeds the divergence you crystallise by moving plus the cost of moving. If that inequality does not hold, the position is better left alone even while it sits at the edge.
- **Do not chase a trend bin by bin.** Re-centring repeatedly into a directional move realises the conversion at every step and is the fastest way to convert a paper divergence into a realised one.
- **Widen after a volatility regime change, do not narrow.** The instinct after being knocked out of range is to re-centre tightly to recover the lost yield. The observed volatility has just told you the opposite.
- **Treat a claim as a separate decision from a rebalance.** Fees accrue outside the position on DLMM, so collecting them does not require touching the liquidity.
- **Check whether the pool still has the routed volume you underwrote.** Solana pool flow migrates quickly between venues, and a position can be correctly shaped in a pool that stopped receiving trades.

The general framework for width and rebalance triggers, including the objective function behind the first rule, is in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/).

## 7. Pre-Deposit Checklist for a DLMM Position

- Bin step against the pair's typical inter-trade movement, using the table in section two.
- Base fee and variable fee parameters for the specific pool, read from pool data rather than assumed.
- Routed volume over thirty days, and whether it reached the bin band you intend to fund.
- Liquidity already sitting in those bins, which is your dilution, not the pool's headline deposits.
- Realised volatility of the pair, and the fraction of the last thirty days price spent inside your proposed band.
- Shape chosen deliberately, with spot as the default unless you hold a specific view.
- Contract and program risk on the venue, assessed the same way as any other. [Liquidity Pool Risks](/guides/liquidity-pool-risks/) and [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/) apply unchanged on Solana.

Bins change the resolution of the decision. They do not change what the decision is: whether fee income over your horizon exceeds the conversion cost the pricing rule will impose on your basket.

## Where to Go Next

Model the divergence side in the [impermanent loss calculator](/tools/impermanent-loss-calculator/) and the fee side in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/). For the mechanism underneath, read [Discretized Liquidity (DLMM) Explained](/guides/discretized-liquidity-dlmm-explained/), and for the continuous-curve comparison, [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## References

1. [Meteora DLMM Developer Documentation](https://docs.meteora.ag/developer-guides/dlmm)
2. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
3. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
4. [SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
5. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
6. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://docs.meteora.ag/developer-guides/dlmm "Meteora DLMM Developer Documentation"
[2]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[3]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[4]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)"
[5]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[6]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
