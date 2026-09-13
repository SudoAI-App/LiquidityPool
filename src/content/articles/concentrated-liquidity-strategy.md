---
title: "Concentrated Liquidity Strategy: Choosing a Range Width"
description: "The width is the only thing you control. Set it from how much the pair actually moves and how much attention you have, not from a yield you would like."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "6 min read"
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

The width of your band is the only thing you genuinely control. And most people pick it from a yield they would like rather than from what the pair actually does.

That is backwards. The width decides how much of the time your position is even participating in the market.

This guide gives you three measurable inputs, a table for how long each width survives, and four strategies that need no price forecast at all.

<figure class="article-figure">
  <img src="/images/guides/concentrated-liquidity-strategy.webp" alt="Indexed curves for fee density, time in range and the net product against band width." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee density falls and time in range rises with width; the net of rebalancing cost peaks in between. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Ask what the position does if you go away for three weeks. If the honest answer is that it converts on day four and then sits there, the width was chosen for a spreadsheet rather than for the market. Set it so the position survives your own attention span."*

## Three things to measure first

**How much the pair actually moves.** Compute it from recent returns, not from memory or an implied figure. Look at seven days and thirty days together, so you can see whether right now is unusual.

**What the width buys you.**

$$
C = \frac{1}{1 - \left(\frac{p_a}{p_b}\right)^{1/4}}
$$

Where:

- $p_a$ and $p_b$ are your two bounds.
- $C$ is how many times harder your money works.

Roughly twenty times at plus or minus 10%, a hundred at plus or minus 2%. That multiplier only applies while you are actually in range.

**What one management cycle costs.** Gas for the rebalance, plus the swap fee and the rate moving against you, plus the divergence you lock in at each re-centre. Fixed per cycle, so it scales inversely with your size. See [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

## How long each width survives

Roughly how long before the price touches a boundary, by width and by how much the pair moves in a typical day:

| Band | Moves 2% a day | Moves 4% a day | Moves 7% a day |
| :--- | ---: | ---: | ---: |
| Plus or minus 2% | about 1 day | about 6 hours | about 2 hours |
| Plus or minus 5% | about 6 days | about 1.5 days | about half a day |
| Plus or minus 10% | about 25 days | about 6 days | about 2 days |
| Plus or minus 20% | about 3 months | about 25 days | about 8 days |

These are average times for a price with no trend, worked out as the band width divided by the daily move, squared. A real trend gets you out sooner. They are not guarantees.

The pattern is the whole point. Halving the band roughly quarters how long it survives, while only doubling what it earns. That asymmetry is why very tight bands disappoint so reliably.

## What you are actually maximising

$$
\text{net} = F \times C \times t - (n \times c) - D
$$

Where:

- $F$ is what the same money would earn in fees across the full price range.
- $C$ is the efficiency multiplier from the width.
- $t$ is the fraction of the period you are in range.
- $n$ is how many times you re-centre.
- $c$ is what one re-centre costs.
- $D$ is the divergence you realise.

Every term is estimable before you start. The multiplier and the time in range pull against each other. The re-centring cost rises as the band narrows, because you re-centre more. The divergence grows with both the multiplier and the number of moves.

So there is an optimum in the middle. Neither the tightest band nor the widest, and it shifts wider as volatility rises or as your position gets smaller.

## Four strategies, none needing a forecast

**A wide band you leave alone.** Set it to two or three months of expected movement and forget it. Low income per dollar, almost always in range, one or two transactions a quarter. Suits smaller positions and anyone who will not monitor.

**A band scaled to volatility.** Roughly two standard deviations of expected movement over your intended period, re-centred only when the price actually leaves. Suits medium positions on liquid pairs.

**Two bands.** Split between a wide base and a narrow one near the price. The base keeps earning when the narrow one converts, which takes the urgency out of every rebalancing decision.

**One-sided.** Place everything on one side to accumulate or distribute across a chosen band. See [Single-Sided Liquidity](/guides/single-sided-liquidity/).

None of these requires knowing where the price is going. All of them require an honest estimate of volatility and of how much attention you actually have.

## Rebalancing rules that survive contact

Decide these before you mint, not while watching a chart.

1. **Trigger on exit plus time.** Re-centre only after the price has been outside for a defined period, which filters out spikes.
2. **Require a payback test.** Expected fees in the new band must exceed the full cost of moving, including the divergence you lock in.
3. **Cap the frequency.** One or two re-centres a month, hard limit. That alone prevents the reactive churn that destroys returns in choppy markets.
4. **Widen rather than chase.** If volatility has changed regime, widen. Re-centring at the same width just repeats the exit.
5. **Have a stop.** Write down what would end the strategy: volume drying up, a volatility regime this tier cannot support, or a measured shortfall against holding.

See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) for the diagnostic sequence when it does exit.

## A width decision, worked

\$60,000 into ETH against dollars at the 0.05% tier, for a month. Thirty-day volatility is 52% annualised, which is about 2.7% a day.

| | Plus or minus 15% | Plus or minus 5% |
| :--- | ---: | ---: |
| Efficiency multiplier | about 14x | about 40x |
| Expected time before touching a bound | Most of the month | About three days |
| Re-centres in the month | 0 | About 8 |
| Gas, at \$14 a transaction | \$28 to enter and exit | about \$250 |
| Plus swap costs and locked-in divergence | Once | About eight times |

The wide band earns less per day and is quoted almost the whole month with two transactions total. Run both through the arithmetic above and the wider band wins at this volatility and this size.

Halve the volatility or triple the position and the answer flips. Which is exactly why this has to be computed per pair rather than adopted as a rule of thumb.

## What people get wrong choosing a width

| What people assume | What actually happens |
| :--- | :--- |
| Tighter earns more | Tighter earns more per day and far fewer days. Multiply the two |
| I can just re-centre when it moves | Each re-centre locks in a loss and pays gas. Six of those is a bad month |
| A wide band is lazy | It is often the correct answer, especially on a small position |
| A vault removes the decision | It makes the decision for you, on rules that may not be yours |

## If you use an automated manager

Vaults handle the monitoring, re-centring and compounding. They charge a fee and add a contract.

| What they solve | What they do not |
| :--- | :--- |
| The operational burden | The rule itself may not match your view |
| Gas efficiency, through batching | Frequent re-centring in choppy markets locks in losses repeatedly |
| Consistent execution | Their incentive is often size, not your net result |

If you use one, benchmark it exactly as you would benchmark yourself. Net result against holding the two tokens, after fees, on your own data.

## Setting a range, step by step

1. **Compute seven-day and thirty-day volatility** for the pair.
2. **Choose your holding period** before you choose a width.
3. **Set the band to about two standard deviations** of movement over that period.
4. **Compute the multiplier and the expected time in range** for that width.
5. **Estimate the number of cycles and what each costs** at your size.
6. **Compute what you hold at both bounds**, and confirm you accept both.
7. **Write the rebalancing rule and the stop rule down** before minting.
8. **Record what you deposited**, so you can judge this against holding later.

The width that maximises a spreadsheet is almost always narrower than the width that survives a month of real prices. Choose for the second one.

## Where to go next

Test a candidate band in the [Uniswap v3 liquidity calculator](/tools/uniswap-v3-liquidity-calculator/), which reports the efficiency and what you hold at each bound. For the bin-based version of the same decision, see [Meteora DLMM Strategy](/guides/meteora-dlmm-strategy/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
8. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[8]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
