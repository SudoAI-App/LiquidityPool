---
title: "Is Providing Liquidity Profitable? The Full Arithmetic"
description: "What liquidity providers actually earn after divergence, gas, time out of range and emission decay, with the break-even conditions that decide the answer for a specific pool."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Siddharth Mehta"
readTime: "12 min read"
keywords: "is providing liquidity profitable, are liquidity pools profitable, how do liquidity providers make money, are liquidity pools worth it, liquidity pool returns, how do liquidity pools make money"
featured: true
faq:
  - q: "Is providing liquidity profitable?"
    a: "Sometimes, and the answer is pool-specific rather than general. Profitability requires fee income to exceed divergence loss plus gas plus the opportunity cost of the same exposure held unpooled. Pools with high routed volume relative to the liquidity competing for it clear that bar; pools paying a headline rate funded by token issuance usually do not once the reward token is valued at its realisable price."
  - q: "How do liquidity providers make money?"
    a: "From a share of the swap fee charged on every trade routed through the pool, proportional to how much of the liquidity active at the traded price is theirs. Some pools add token incentives on top. Fees are revenue from traders; incentives are dilution of token holders, and only the first persists without a budget."
  - q: "Are liquidity pools worth it for small amounts?"
    a: "Frequently not on high-fee chains. Entry, exit and each claim cost gas regardless of position size, so a $500 position on a network charging $12 per transaction has spent roughly 7% of capital before earning anything. The same position on a low-fee chain can be viable."
  - q: "How much do liquidity providers earn on average?"
    a: "There is no reliable average because the distribution is wide and venue-specific. Academic measurement of concentrated liquidity positions found that a majority underperformed holding the deposited assets over the studied period once divergence was netted against fees. Treat any single quoted average as a marketing figure until you can reproduce it from pool data."
  - q: "What makes a liquidity position unprofitable?"
    a: "Four things, usually in this order: a pair that trended hard in one direction, a range the price left, gas and claim costs on a position too small to absorb them, and reward tokens that lost most of their value between accrual and sale."
---

The honest answer is that it depends on numbers you can obtain before depositing, and that most people deposit without obtaining them. Profitability is not a property of liquidity provision as an activity. It is a property of one pool over one holding period, and it resolves into a single inequality that either holds or does not.

This guide works through that inequality, each term in it, and the conditions under which it flips.

<figure class="article-figure">
  <img src="/images/guides/is-providing-liquidity-profitable.webp" alt="A revenue bar for fee income set against stacked deductions for divergence, gas and emission decay, resolving to a net result." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee revenue against the four deductions that decide whether a position beat holding. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"Every disappointing LP position I have reviewed was modelled correctly and scoped wrongly. The fee arithmetic was fine. What was missing was the gas line, the fraction of the period the position spent out of range, and a realistic price for the reward token. Those three omissions account for almost the entire gap between the quoted rate and the realised one."*

## 1. The Inequality That Decides It

A liquidity position beat the alternative if, over the holding period:

$$ F + E_{\text{realised}} \;>\; |D| + G + O $$

where $F$ is trading fee income, $E_{\text{realised}}$ is the sale value of any incentive tokens, $D$ is divergence against holding the deposited basket, $G$ is gas and transaction friction, and $O$ is the opportunity cost of the same capital in its next-best use, which for most pairs is simply holding them.

Nothing else is in the expression. Total value locked is not in it. The protocol's brand is not in it. The quoted annual percentage rate appears only as a compressed and usually optimistic estimate of the first term.

## 2. Where Fee Income Actually Comes From

Fee income is a share of routed volume, not a rate the pool pays you:

$$ F = V \times f \times s \times t $$

Routed volume $V$ over the period, fee tier $f$, your share $s$ of the liquidity active at the traded price, and $t$, the fraction of the period your liquidity was actually active. The last two terms are where the estimate usually breaks.

Share is measured against **active** liquidity, not total deposits. On a concentrated pool, capital parked in distant ranges earns nothing and does not dilute you; capital crowded into the same tick as yours dilutes you heavily. A pool showing large total value locked can still have thin depth at the touch, which is the distinction developed in [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/) and [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

Time in range is a multiplier, and it is the one nobody measures before depositing. A position earning a 60% annualised rate while active, in range 40% of the period, earned 24%. The mechanism and its diagnosis are covered in [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

| Fee tier | Typical pair character | Annual fee income at 1× daily turnover | At 4× daily turnover |
|---|---|---|---|
| 1 bp | Stable-to-stable | 3.7% | 14.6% |
| 5 bp | Correlated majors | 18.3% | 73.0% |
| 30 bp | Standard volatile | 109.5% | 438.0% |
| 100 bp | Long tail | 365.0% | 1,460.0% |

Turnover here means daily routed volume divided by the liquidity value competing for it. The right-hand columns look implausible because they are: sustained 4× turnover at a 30 basis point tier does not persist, since that level of revenue attracts liquidity until the share term falls. The table's use is directional. It shows that fee income is governed by turnover, and that turnover, not the tier, is the variable worth researching.

## 3. The Deduction Most Dashboards Omit

Divergence loss is mechanical and computable in advance. For a constant-product pool it depends only on the ratio $k$ of how far the two assets moved relative to each other:

$$ \text{IL}(k) = \frac{2\sqrt{k}}{1 + k} - 1 $$

A pair that diverges 2× costs 5.72% against holding; 4× costs 20.00%. Those figures are the floor, not the expectation. A concentrated range amplifies the loss inside its bounds, and research measuring realised outcomes across Uniswap v3 positions found that the majority of sampled positions underperformed holding the deposited assets once divergence was netted against collected fees [1].

The deeper version of the same cost is loss-versus-rebalancing, which prices what the pool hands to arbitrageurs each time its quote goes stale. That measurement is path-dependent and scales with volatility, so two pairs ending at the same price can have cost very different amounts to market-make [2]. The practical consequence is that divergence calculated from endpoint prices understates the true cost, and it does so most in exactly the volatile pairs that quote the highest fee rates. [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/) develops the framework.

## 4. Friction, and Why Position Size Decides It

Gas is a fixed cost per transaction and therefore a variable cost per dollar of capital. The lifecycle of a managed concentrated position is not one transaction. It is two approvals, a mint, a claim on some cadence, one or more rebalances, and a burn.

| Position size | 8 transactions at $9 each | Friction as % of capital |
|---|---|---|
| $500 | $72 | 14.4% |
| $2,500 | $72 | 2.9% |
| $10,000 | $72 | 0.7% |
| $50,000 | $72 | 0.1% |

At the top of that table friction is a rounding error. At the bottom it exceeds any plausible fee income. This single table answers the most common version of the question, which is whether providing liquidity is worthwhile for a small amount on a high-fee network. [LP Gas Costs](/guides/lp-gas-costs/) works through the claim-cadence optimisation that follows.

The fourth deduction is emission decay. Incentive tokens accrue at spot and are realised at whatever price survives every other recipient selling the same issuance into the same depth. Valuing accruals at spot and calling the result yield is the standard error, and it is discussed with the surrounding incentive design in [Yield Farming Explained](/guides/yield-farming-explained/) and [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

## 5. A Worked Case, Both Directions

Two positions, $20,000 each, ninety days, same capital and same operator.

| | Stable pair, 1 bp | Volatile major, 30 bp |
|---|---|---|
| Routed volume share earned | $412 | $2,190 |
| Time in range | 99% | 61% |
| Fee income after time in range | $408 | $1,336 |
| Divergence over the period | −$11 | −$1,704 |
| Gas, 6 transactions | −$54 | −$54 |
| Emission tokens realised | $0 | $290 |
| Net vs holding the deposits | +$343 | −$132 |
| Net rate, annualised | 7.0% | −2.7% |

The volatile pool collected more than three times the fees and still lost to holding. That is the characteristic shape of the problem: the fee line is visible on every dashboard, and the three lines that reversed the result are not. Reproduce this structure for a specific candidate pool in the [LP profit calculator](/tools/lp-profit-calculator/) before depositing rather than after.

## 6. The Conditions That Make It Work

Positions that clear the inequality tend to share a small number of properties.

- **High turnover relative to competing liquidity.** This is the single strongest predictor, because it drives the only revenue term that persists without a budget.
- **Correlated or pegged pairs.** Divergence is a function of relative movement, so a pair that moves together has a small deduction. This is why stable and liquid-staking pairs remain viable at fee tiers that look negligible. [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/) covers the depeg exception that ends this advantage abruptly.
- **A range you will actually maintain, or none at all.** A full-range position with modest fees beats a narrow range that spent half the period inactive and was rebalanced at a loss twice.
- **Position size large enough that friction is noise.** See the table in section four.
- **Fee-funded economics.** If the position is unattractive with emissions set to zero, the position is a trade on an incentive schedule and should be sized as one.

Public-sector analysis of automated market making reaches a consistent structural conclusion: the economics favour liquidity providers in deep, high-volume, low-volatility pairs and work against them in thin, volatile ones, which is the inverse of how quoted yields are ordered [3]. The pools advertising the highest rates are advertising the highest compensation for risks the rate is paying you to take.

## 7. Decision Checklist

Before depositing, put these seven numbers on paper:

1. Thirty-day routed volume for the specific pool, from pool data rather than a marketing page.
2. The value of liquidity active near the current price, not total value locked.
3. Your resulting share, and the fee income it implies at that volume.
4. Realised volatility of the pair over your intended holding period, and the divergence it implies.
5. For a concentrated position, the expected fraction of the period spent in range.
6. Gas cost of your full intended lifecycle, including claim cadence.
7. The same calculation with emissions set to zero.

If line seven is negative, you are buying an incentive schedule. That can be a reasonable trade, but it is a different trade from providing liquidity, and it requires an exit plan tied to the emission calendar rather than to the pair.

## Where to Go Next

Run the specific pool through the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) and the [impermanent loss calculator](/tools/impermanent-loss-calculator/), then apply the structured version of the checklist in [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/). For the loss side in full, [Can You Lose Money in a Liquidity Pool?](/guides/can-you-lose-money-in-a-liquidity-pool/) enumerates the six paths and their relative sizes.

## References

1. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
2. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
3. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
5. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
6. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)

[1]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[2]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[3]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[4]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[5]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[6]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
