---
title: "Is Providing Liquidity Profitable? The Full Arithmetic"
description: "It depends on numbers you can get before depositing, and almost nobody gets them. Here is the inequality, every term in it, and two positions worked in full."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "7 min read"
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

The honest answer is that it depends on numbers you can get before you deposit, and that almost nobody gets them.

This is not a property of liquidity provision as an activity. It is a property of one pool over one period, and it comes down to a single inequality that either holds or does not.

This guide gives you that inequality, takes apart every term in it, and works two real positions end to end. One wins. One does not, and it is not the one you would guess.

<figure class="article-figure">
  <img src="/images/guides/is-providing-liquidity-profitable.webp" alt="A revenue bar for fee income set against stacked deductions for divergence, gas and emission decay, resolving to a net result." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee revenue against the four deductions that decide whether a position beat holding. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"Every disappointing position I have reviewed was modelled correctly and scoped wrongly. The fee maths was fine. What was missing was the gas, the fraction of the time the position sat out of range, and a realistic price for the reward token. Those three account for almost the whole gap between the quoted rate and the real one."*

## The inequality

$$
F + E > |D| + G + O
$$

Where:

- $F$ is the trading fees you collected.
- $E$ is what you actually got for any reward tokens, after selling them.
- $D$ is how far you fell behind simply holding the two tokens.
- $G$ is gas and every other transaction cost.
- $O$ is what the same money would have done in its next-best use.

Nothing else belongs in there. The pool's size is not in it. The protocol's reputation is not in it. The advertised rate appears only as an optimistic estimate of the first term.

## Where the fees actually come from

$$
F = V \times f \times s \times t
$$

Where:

- $V$ is the volume that actually routed through your pool.
- $f$ is the fee rate.
- $s$ is your share of the liquidity live at the traded price.
- $t$ is the fraction of the period your liquidity was active at all.

The last two are where estimates fall apart.

**Your share is measured against live liquidity, not total deposits.** Money parked in distant ranges earns nothing and does not dilute you. Money crowded into your exact band dilutes you heavily. See [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/) and [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

**Time in range is a straight multiplier**, and nobody measures it before depositing. A position earning a 60% annual rate while live, in range 40% of the time, earned 24%. See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

Here is how the fee rate and turnover interact:

| Fee tier | What lives there | At 1x daily turnover | At 4x |
| :--- | :--- | ---: | ---: |
| 0.01% | Stablecoin pairs | 3.7% | 14.6% |
| 0.05% | Correlated majors | 18.3% | 73.0% |
| 0.30% | Ordinary volatile pairs | 109.5% | 438.0% |
| 1.00% | Long tail | 365.0% | 1,460.0% |

Turnover means daily routed volume divided by the liquidity competing for it. The right column looks absurd because it is. Sustained 4x turnover at 0.30% does not last, because that much revenue attracts liquidity until your share collapses.

The table's real use is directional. Fee income is governed by turnover, not by the tier. Turnover is what to research.

## The deduction dashboards leave out

That shortfall is impermanent loss — the gap between a pool position and simply holding the two tokens — and you can compute it in advance:

$$
\text{IL}(k) = \frac{2\sqrt{k}}{1 + k} - 1
$$

Where:

- $k$ is how far the two tokens moved relative to each other.

A pair that diverges 2x costs 5.72% against holding. 4x costs 20.00%. Those figures are for a full-range position.

A narrow range amplifies it inside the band. Research measuring real Uniswap v3 positions found that most of the sampled positions underperformed holding, once divergence was netted against fees [1].

The forward-looking version is loss-versus-rebalancing — what the pool hands to arbitrage every time its quote goes stale. It builds with volatility along the route the price takes, so you can estimate it before you deposit rather than waiting to see where the price ends [2].

The practical consequence: the endpoint number tells you what happened on one path. The rebalancing figure tells you what the pair costs on average, and it is highest in exactly the volatile pairs that advertise the highest rates. See [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).

## Why position size decides it

Gas is a fixed cost per transaction, which makes it a variable cost per dollar you deposit. A managed position is not one transaction. It is two approvals, a mint, some claims, one or more rebalances, and a burn.

| Your position | 8 transactions at \$9 | As a share of your capital |
| ---: | ---: | ---: |
| \$500 | \$72 | 14.4% |
| \$2,500 | \$72 | 2.9% |
| \$10,000 | \$72 | 0.7% |
| \$50,000 | \$72 | 0.1% |

At the bottom of that table it rounds to nothing. At the top it exceeds any plausible fee income. That single table answers the most common version of this question. See [LP Gas Costs](/guides/lp-gas-costs/).

The fourth deduction is reward tokens losing value. They accrue at one price and get realised at whatever survives everybody else selling the same issuance into the same market. Valuing them at the accrual price and calling it yield is the standard error. See [Yield Farming Explained](/guides/yield-farming-explained/) and [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

## Two positions, ninety days, same operator

\$20,000 each.

| | Stable pair, 0.01% | Volatile major, 0.30% |
| :--- | ---: | ---: |
| Fees earned while live | \$412 | \$2,190 |
| Time in range | 99% | 61% |
| Fees after time in range | \$408 | \$1,336 |
| Divergence over the period | -\$11 | -\$1,704 |
| Gas, six transactions | -\$54 | -\$54 |
| Reward tokens, after selling | \$0 | \$290 |
| **Net against holding** | **+\$343** | **-\$132** |
| Annualised | 7.0% | -2.7% |

The volatile pool collected more than three times the fees and still lost to holding.

That is the characteristic shape of this problem. The fee line is on every dashboard. The three lines that reversed the result are not. Build this same table for a specific pool in the [LP profit calculator](/tools/lp-profit-calculator/) before depositing rather than after.

## What people get wrong about profitability

| What people assume | What actually happens |
| :--- | :--- |
| More fees means more profit | The volatile pool above earned triple and still lost |
| The advertised rate is the return | It estimates one of five terms, optimistically |
| A bigger pool is better for me | Only money near the price counts, and it dilutes your share |
| Small positions work the same way | Gas is fixed. Below a threshold nothing works |

## What the winners have in common

- **High turnover against the liquidity competing for it.** The single strongest predictor, because it drives the only revenue that persists without a budget.
- **Tokens that move together.** Divergence depends on relative movement, so pairs that track each other barely pay it. That is why stablecoin and staked-ETH pairs stay viable at rates that look trivial. See [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/) for the exception that ends this abruptly.
- **A range you will actually maintain, or none at all.** A full-range position with modest fees beats a narrow one that sat idle half the time and was re-centred at a loss twice.
- **Enough size that gas is noise.**
- **Economics that work with rewards at zero.** If it does not, you are trading an incentive schedule, and should size it as one.

Public-sector analysis reaches the same structural conclusion consistently: the economics favour providers in deep, busy, low-volatility pairs and work against them in thin volatile ones [3]. That is the exact inverse of how advertised rates are ordered. The pools paying most are paying you to take the risks they pay you for.

## Seven numbers to write down first

1. **Thirty-day routed volume** for that specific pool, from chain data rather than a marketing page.
2. **Money working near the current price**, not the pool's total.
3. **Your resulting share**, and the fee income it implies at that volume.
4. **How much the pair has actually moved**, and the divergence that implies.
5. **For a range, what fraction of the time you expect to be in it.**
6. **Gas for your whole intended lifecycle**, including how often you claim.
7. **The same calculation with rewards set to zero.**

If number seven is negative, you are buying an incentive schedule. That can be a reasonable trade, but it is a different trade, and it needs an exit tied to the emission calendar rather than to the pair.

## Where to go next

Run the pool through the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) and the [impermanent loss calculator](/tools/impermanent-loss-calculator/), then apply the structured version in [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/). For the loss side in full, see [Can You Lose Money in a Liquidity Pool?](/guides/can-you-lose-money-in-a-liquidity-pool/).

## References

1. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
2. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
3. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
5. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
6. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)

[1]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[2]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[3]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[4]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[5]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[6]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
