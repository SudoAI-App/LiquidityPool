---
title: "Concentrated Liquidity Strategy: Choosing a Range Width"
description: "How to choose a liquidity range width from realised volatility, expected time in range and rebalancing cost, with a worked framework and the rules that keep it honest."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Dr. Elena Rostova"
readTime: "12 min read"
keywords: "concentrated liquidity strategy, liquidity range width, how to choose a price range, rebalancing strategy LP, time in range, Uniswap v3 price range"
featured: false
faq:
  - q: "How wide should a liquidity range be?"
    a: "Wide enough that the position stays quoted through normal movement in the pair, which means scaling the band to realised volatility rather than to a target yield. A common starting point is roughly one to two standard deviations of expected price movement over the intended holding period."
  - q: "Is a narrow range better for earning fees?"
    a: "It earns more per dollar while price is inside it and nothing when price is outside. The product of fee density and time in range peaks at an intermediate width, and the location of that peak moves with volatility."
  - q: "How often should I rebalance a concentrated position?"
    a: "As rarely as the strategy allows. Each rebalance realises the current composition and pays gas plus swap costs, so the trigger should be a rule tied to expected fee income in the new range rather than a reaction to price."
  - q: "What is a good time in range percentage?"
    a: "There is no universal figure, but positions spending less than half their life in range rarely justify the management cost unless fee density is exceptional. Measure it on your own positions rather than assuming."
  - q: "Should I use an automated range manager?"
    a: "It removes the operational burden and adds a contract plus a fee. Automated managers rebalance on rules that may not match your view, and frequent re-centring in choppy markets crystallises divergence repeatedly."
---

Range width is the only parameter a concentrated liquidity provider genuinely controls, and it is usually chosen from a yield target rather than from the pair's behaviour. That is backwards. The width determines how much of the time the position exists as a market participant at all.

A defensible framework needs three inputs, all measurable, and one decision about how much work you will do.

<figure class="article-figure">
  <img src="/images/guides/concentrated-liquidity-strategy.webp" alt="Indexed curves for fee density, time in range and the net product against band width." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee density falls and time in range rises with width; the net of rebalancing cost peaks in between. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Ask what the position does if you go on holiday for three weeks. If the honest answer is that it converts on day four and sits idle, the width was chosen for a spreadsheet rather than for the market. Width should be set so the position survives your own attention span."*

## 1. The Three Inputs

**Realised volatility.** Compute it from recent returns on the pair, not from an implied figure or a memory of last year. Seven-day and thirty-day windows together show whether the current regime is unusual.

**Fee density.** The capital efficiency multiplier for a symmetric band is approximately:

$$C = \frac{1}{1 - \left(\frac{p_a}{p_b}\right)^{1/4}}$$

which gives roughly 20 times for a ±10% band and 100 times for ±2%. That multiplier applies only while the position is in range.

**Cost per management cycle.** Gas for a rebalance, plus swap fees and price impact on any rebalancing trade, plus the divergence realised at each re-centre. This is a fixed cost per cycle, so it scales inversely with position size, as set out in [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

---

## 2. Estimating Time in Range

For a band of ±$w$ percent and daily volatility $\sigma_d$, the probability of remaining inside the band over $T$ days can be approximated with a random walk. A workable heuristic without simulation:

| Band width | Daily volatility 2% | Daily volatility 4% | Daily volatility 7% |
| :--- | ---: | ---: | ---: |
| ±2% | roughly 2 days | roughly 1 day | under a day |
| ±5% | roughly 8 days | roughly 3 days | roughly 1 day |
| ±10% | roughly 30 days | roughly 9 days | roughly 3 days |
| ±20% | months | roughly 30 days | roughly 10 days |

These are expected times to first touch a boundary, not guarantees. The important pattern is that halving the band roughly quarters the expected time in range, while only doubling the fee density. That asymmetry is why very narrow bands underperform expectations so often.

---

## 3. The Objective Function

What you actually want to maximise over the holding period is:

$$\text{net} = (\text{fee density}) \times (\text{time in range}) - (\text{cycles} \times \text{cost per cycle}) - (\text{realised divergence})$$

Every term is estimable in advance. The first two pull in opposite directions, the third rises as the band narrows because rebalancing becomes more frequent, and the fourth grows with both amplification and the number of re-centres.

The result is an interior optimum: neither the tightest nor the widest band, and a peak that shifts wider as volatility rises or as position size falls. The shape is plotted in the figure above.

---

## 4. Four Workable Strategies

**Passive wide band.** Set the width to two or three months of expected movement and leave it. Low fee density, very high time in range, one or two transactions per quarter. Suits smaller positions and providers who will not monitor.

**Volatility-scaled band.** Set width to roughly two standard deviations of expected movement over the intended horizon, and re-centre only when price exits. Suits medium positions on liquid pairs.

**Dual-band.** Split capital between a wide base position and a narrow one near the current price. The base keeps earning when the narrow one converts, which reduces the urgency of every rebalance decision.

**Directional single-sided.** Place liquidity entirely on one side to accumulate or distribute an asset across a chosen band, as covered in [Single-Sided Liquidity](/guides/single-sided-liquidity/).

None of these requires a price forecast. Each one requires an honest estimate of volatility and of your own management capacity.

---

## 5. Rebalancing Rules That Survive Contact

The decision to re-centre should be made in advance, not while watching a chart.

1. **Trigger on exit plus persistence.** Re-centre only after price has been outside the band for a defined period, filtering transient spikes.
2. **Require a payback test.** Expected fee income in the new band over the intended horizon must exceed the full cost of the move, including realised divergence.
3. **Cap the frequency.** A hard limit of one or two re-centres per month prevents the reactive churn that destroys returns in choppy markets.
4. **Prefer widening to chasing.** If the pair's volatility has changed regime, widen the band rather than re-centring at the same width and repeating the exit.
5. **Have a stop.** Define what evidence would end the strategy entirely: sustained volume decline, a volatility regime the fee tier cannot support, or a measured shortfall against holding.

The diagnostic sequence when a position exits its band is in [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

---

## 6. Automated Managers

Vaults and managers automate the mechanics: monitoring, re-centring, compounding. They charge a performance or management fee and add a contract to the trust chain.

What they solve: operational burden, gas efficiency through batching, and consistent execution of a rule.

What they do not solve: the rule itself may not match your view, frequent re-centring in choppy conditions crystallises divergence repeatedly, and the manager's incentive is often assets under management rather than net performance against a hold benchmark.

If you use one, benchmark it exactly as you would benchmark yourself: net result against holding the deposited basket, after fees, on your own data.

### A worked width decision

An ETH/USDC position of \$60,000 at a 5 bps tier, intended to run for a month. Thirty-day realised volatility is 52% annualised, which is roughly 2.7% per day.

Two standard deviations of movement over thirty days is approximately 30%, so a band of roughly ±15% would be expected to hold for most of the period. That width gives a capital multiplier near 13 times.

A ±5% band gives roughly 40 times the density and would be expected to touch a boundary within four days at this volatility, implying six or seven re-centres in the month. At \$14 per transaction and two transactions per re-centre, that is roughly \$190 of gas, plus swap costs and the divergence realised each time.

The wider band earns less per day in range and is quoted nearly all month with two transactions total. Running both estimates through the objective function, the wider band wins at this volatility and this position size. Halve the volatility or triple the position size and the answer flips, which is exactly why the calculation has to be redone per pair rather than adopted as a rule of thumb.

---

## 7. Checklist for Setting a Range

- [ ] Compute 7-day and 30-day realised volatility for the pair.
- [ ] Choose an intended holding period before choosing a width.
- [ ] Set the band to roughly two standard deviations of movement over that period.
- [ ] Compute the capital multiplier and the expected time in range for that width.
- [ ] Estimate cycles and cost per cycle at your position size.
- [ ] Compute holdings at both bounds and confirm you accept both outcomes.
- [ ] Write the rebalancing rule and the stop rule down before minting.
- [ ] Record entry state so the strategy can be evaluated against the benchmark later.

The width that maximises a spreadsheet is usually narrower than the width that survives a month of real price action. Choose for the second.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Strategic Liquidity Provision in Uniswap v3 (Neuder et al., 2021)](https://arxiv.org/abs/2106.12033)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
8. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Neuder et al., 2021)"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[8]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
