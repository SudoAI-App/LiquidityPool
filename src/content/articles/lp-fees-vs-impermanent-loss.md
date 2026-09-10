---
title: "LP Fees vs Impermanent Loss: Finding the Break-Even"
description: "When trading fees actually beat divergence loss: the volatility hurdle, fee density arithmetic, and how to test whether a liquidity position was worth holding."
category: "Risk & Research"
date: 2026-09-10
lastReviewed: "2026-09-10"
author: "Marcus Vance"
readTime: "12 min read"
keywords: "LP fees vs impermanent loss, do liquidity pools make money, is providing liquidity profitable, fee yield break-even, LVR hurdle rate, liquidity provider profitability"
featured: false
faq:
  - q: "Do trading fees cancel out impermanent loss?"
    a: "Sometimes, and only in specific conditions. Fee income scales with trading volume, while divergence scales with the variance of the price path. On pairs where volume is high relative to volatility, fees clear the hurdle; on pairs where a sharp repricing arrives without a matching surge in routed volume, they do not."
  - q: "How do I know if a liquidity position was profitable?"
    a: "Compare the withdrawn value plus collected fees against the value of simply holding the deposited basket over the same window, then subtract gas and any swap costs. A position can be up in dollars and still have underperformed the basket it started from."
  - q: "Is providing liquidity profitable on average?"
    a: "Studies of tick-based pools consistently find that a large share of positions underperform holding once divergence and gas are included, with results concentrated in a minority of well-managed positions. Profitability depends on the pair, the fee tier, the range and the holding period, not on the pool being popular."
  - q: "What volatility level makes a pool unprofitable for LPs?"
    a: "There is no universal number. The condition is that fee capture per unit of time must exceed the LVR accrual rate, which grows with the square of volatility. For a given fee tier and turnover ratio you can solve for the volatility at which the two lines cross and treat that as the pair's hurdle."
---

Liquidity provision is an income strategy stacked on top of a short-volatility position. Fee revenue accrues steadily with trading activity; divergence accrues with the variance of the price path and is collected almost entirely by arbitrageurs. Whether an LP made money is the question of which of those two lines was steeper over the holding period.

Both lines are measurable. Neither is described by the annual percentage rate shown on a pool page.

<figure class="article-figure">
  <img src="/images/guides/lp-fees-vs-impermanent-loss.webp" alt="Chart comparing daily fee capture against divergence loss as realised volatility increases, with the break-even point marked." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee capture grows roughly linearly with volatility; adverse selection grows with its square. The crossing point is the pair's hurdle. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"When a desk asks me whether a pool 'pays', I ask for two series: routed volume and realised volatility, both hourly. If volume spikes come from retail flow chasing a move, the LP wins the week. If they come from arbitrage bots repricing a stale quote, the same volume figure is a bill, not revenue. Volume is not a quality; it has a direction and a counterparty."*

## 1. The Two Sides of the Ledger

Gross fee income over a period is straightforward:

$$F = f \times V_{\text{routed}} \times s$$

where $f$ is the fee tier, $V_{\text{routed}}$ is the volume that actually executes against your liquidity, and $s$ is your share of the active liquidity while in range. Note that routed volume, not headline pool volume, is the correct input: aggregators split orders across venues and tiers, and a position that is out of range receives none of it.

The other side is the value the pool hands to arbitrageurs when its quote is stale. For a constant-product pool tracking an external reference price, the loss-versus-rebalancing rate is approximately [4]:

$$\text{LVR rate} \approx \frac{\sigma^2}{8}$$

per unit of time, where $\sigma$ is the annualised volatility of the pair. The quadratic term is the whole story. Doubling volatility quadruples the drag while roughly doubling, at best, the volume that pays you for it.

The break-even condition is therefore:

$$f \times \text{turnover} \geq \frac{\sigma^2}{8}$$

where turnover is daily routed volume divided by the liquidity backing it. This inequality, not the advertised yield, is the test.

---

## 2. Working the Numbers on a Real Pair

Take a 5 bps ETH/USDC position with \$100,000 deployed, sitting in range for the full period, holding a 2% share of active liquidity in the band.

| Input | Value |
| :--- | ---: |
| Fee tier | 0.05% |
| Daily routed volume through the band | \$40,000,000 |
| Your share of active liquidity | 2.0% |
| Daily gross fees | \$400 |
| Daily fee yield on deployed capital | 40 bps |
| Realised annualised volatility | 60% |
| Daily LVR drag ($\sigma^2/8$, annual, per day) | ≈ 1.2 bps |

At 60% volatility the arithmetic is comfortable: 40 bps of fee capture against roughly 1.2 bps of adverse selection. Now change one input. If competition doubles the liquidity in your band, your share halves and fee capture falls to 20 bps while the drag is unchanged. If volatility jumps to 150% during a repricing event, the drag rises to roughly 7.7 bps per day and, critically, your position is likely to exit range partway through, capturing a fraction of the volume while retaining the full inventory rotation.

That asymmetry is the recurring pattern: the fee side is capped by competition, and the loss side is unbounded in volatility.

The mechanics of the divergence term itself are derived in [The Impermanent Loss Formula: How to Calculate IL Step by Step](/guides/impermanent-loss-formula/).

---

## 3. Why Impermanent Loss Understates the Problem

Impermanent loss compares two endpoints. It says nothing about the path between them, which is where the value actually leaves the pool.

Consider a pair that starts at 2,000, rallies to 3,000, and returns to 2,000 within a week. Endpoint IL is zero. But every leg of that path was arbitraged against a stale pool quote, and each arbitrage transferred value from the LP to the searcher. Loss-versus-rebalancing captures exactly that flow, which is why it has become the reference metric for institutional LP desks [4].

The practical implication: a choppy market with no net price change can be far worse for an LP than a smooth trend of equal magnitude, even though the IL formula reports the same or better result. For the full treatment see [Loss-Versus-Rebalancing: The LP's Real Hurdle Rate](/guides/loss-versus-rebalancing/).

---

## 4. Measuring the Real Answer for Your Positions

- **Position-level PnL against a hold benchmark**: [Revert Finance](https://revert.finance) decomposes a tick position into fees collected, divergence, and net result versus holding. This is the single most useful check an LP can run, and most run it too late.
- **Flow toxicity**: [EigenPhi](https://eigenphi.io) attributes swaps to arbitrage and sandwich activity. A pool where most volume is atomic arbitrage is paying you a fee to take the other side of a losing trade.
- **Fee-to-TVL by pool**: [DeFiLlama](https://defillama.com) publishes fee and TVL series so you can compute realised fee yield rather than an extrapolated rate.
- **Tick-level competition**: A [Dune Analytics](https://dune.com) query on the pool's liquidity distribution shows how crowded your band is and how fast that changes after an incentive campaign starts.

Run the comparison over at least one full volatility cycle. A single quiet fortnight makes almost any pool look profitable, and a single event week makes almost any pool look ruinous.

---

## 5. Common Errors in the Comparison

| Error | Why it distorts the answer |
| :--- | :--- |
| Annualising a good day | Fee yield is mean-reverting; volume clusters around events and then decays. |
| Ignoring time out of range | Fees stop; exposure does not. The denominator of your yield keeps counting. |
| Valuing emissions at accrual price | Farm tokens are usually sold into thin books; realised value is lower than quoted. |
| Comparing against cash | The correct benchmark is holding the deposited basket, not holding dollars. |
| Ignoring gas | For positions under a few thousand dollars, rebalancing costs can exceed all fee income. |
| Treating stable pairs as riskless | Divergence is small until a depeg, at which point the curve absorbs the failing asset. |

Uniswap's risk documentation makes the same point in plain terms: fee income is not guaranteed, and it does not eliminate the exposure created by supplying two assets to a pricing rule [3].

---

## 6. A Decision Framework Before Supplying

1. **Estimate turnover**: divide the pool's realised daily routed volume by the liquidity actually in the active band, not by total value locked.
2. **Multiply by the fee tier** to get a daily fee yield in basis points.
3. **Estimate the drag** using trailing realised volatility and the $\sigma^2/8$ rate, then adjust upward for a concentrated range.
4. **Compare, then add a margin.** If the two numbers are within a factor of two, the position is a coin flip once gas and competition are included.
5. **Decide the exit rule before entering**: a volatility trigger, a time-in-range floor, or a drawdown limit against the hold benchmark.
6. **Size for the friction.** If a full round trip of gas is more than a few days of expected fees, the position is too small for active management and belongs in a wider, passive range.

For the wider due-diligence process that surrounds this arithmetic, use [How to Evaluate a Liquidity Pool: A Five-Part Research Framework](/guides/how-to-evaluate-a-liquidity-pool/) and the pre-deposit questions in [The Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/).

## Where to Go Next

Model the revenue side with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) and the cost side with the [impermanent loss calculator](/tools/impermanent-loss-calculator/). For the tier decision underneath both, see [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/). Both sides resolve into one figure in the [LP profit and return calculator](/tools/lp-profit-calculator/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Trading in the DeFi era: automated market-maker (Bank for International Settlements, 2023)](https://www.bis.org/publications/trading-defi-era-automated-market-maker)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://www.bis.org/publications/trading-defi-era-automated-market-maker "Trading in the DeFi era: automated market-maker"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
