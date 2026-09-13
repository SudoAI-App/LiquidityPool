---
title: "LP Fees vs Impermanent Loss: Finding the Break-Even"
description: "One inequality decides whether a pool is worth supplying. Here it is, worked on a real position, plus why the fee side is capped and the loss side is not."
category: "Risk & Research"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Marcus Vance"
readTime: "6 min read"
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

Supplying a pool is two things at once. You earn a steady trickle from trading, and you lose money whenever the price moves. Whether you made anything is just a question of which line was steeper.

Both lines can be measured. Neither one is the number on the pool page.

This guide gives you the single inequality that decides it, works it on a real position, and shows why the earning side has a ceiling while the losing side does not.

<figure class="article-figure">
  <img src="/images/guides/lp-fees-vs-impermanent-loss.webp" alt="Chart comparing daily fee capture against divergence loss as realised volatility increases, with the break-even point marked." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee capture grows roughly linearly with volatility; adverse selection grows with its square. The crossing point is the pair's hurdle. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"When somebody asks me whether a pool pays, I want two things: hourly volume and hourly volatility. If the volume is people chasing a move, you had a good week. If it is bots repricing your stale quote, the same number is a bill. Volume is not a virtue. It has a direction and a counterparty."*

## The two lines

Fee income is simple:

$$
F = f \times V \times s
$$

Where:

- $f$ is the fee rate, so 0.05% means 0.0005.
- $V$ is the volume that actually executed against your liquidity.
- $s$ is your share of the money working in that band while you were live.

The second term matters more than people think. Aggregators split orders across venues and tiers, and a position out of range gets none of it. Use routed volume, not the pool's headline number.

The other line is what leaves when your quote is stale [4]:

$$
\text{drag} \approx \frac{\sigma^2}{8}
$$

Where:

- $\sigma$ is the pair's annual volatility.

The square is the whole story. Double how much a pair moves and this quadruples, while the volume paying you roughly doubles at best.

So the test is:

$$
f \times \text{turnover} \geq \frac{\sigma^2}{8}
$$

Where:

- **Turnover** is daily routed volume divided by the liquidity backing it.

That inequality, not the advertised rate, is the whole question.

## Working it on a real position

A \$100,000 position at the 0.05% tier on ETH against dollars, in range the whole time, holding 2% of the liquidity in that band.

| | Value |
| :--- | ---: |
| Fee rate | 0.05% |
| Daily volume through your band | \$40,000,000 |
| Your share of the liquidity there | 2.0% |
| Daily fees | \$400 |
| Daily yield on your capital | 40 basis points |
| Pair's annual volatility | 60% |
| Drag on a full-range position | about 1.2 basis points a day |
| Your band, plus or minus 10%, multiplies that by | about 20 |
| Daily drag on your band | about 25 basis points |

At 60% volatility this still clears. Forty basis points coming in, about twenty-five going out. That is a real margin, but a much thinner one than the fee number on its own suggests.

Now change one thing at a time and watch how differently the two sides behave.

| What changes | What happens to fees | What happens to the drag |
| :--- | :--- | :--- |
| Competition doubles the liquidity in your band | Halves, to 20 basis points | Unchanged |
| Volatility jumps to 150% | Rises somewhat, then you exit range | Rises to about 150 basis points a day in this band |
| Volume dries up | Falls toward zero | Unchanged |

That is the asymmetry to remember. Your earning is capped by how many other people want to do the same thing. Your losing is capped by nothing at all. The endpoint version of that loss — impermanent loss, the gap between a pool position and simply holding — is derived in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

## How much trading a pair needs

Turn the inequality around and it tells you the daily turnover a full-range position needs just to stand still, before gas.

| Pair volatility | At the 0.05% tier | At the 0.30% tier |
| :--- | ---: | ---: |
| 40% a year | 0.11 times the liquidity, every day | 0.02 times |
| 80% a year | 0.44 times | 0.07 times |
| 120% a year | 0.99 times | 0.16 times |

Read the bottom left cell. A pair moving 120% a year at the cheapest tier needs the whole pool's liquidity to trade every single day to break even. Very few pools manage that for long. That is why volatile pairs drift to higher tiers, and why a low tier on a wild pair is usually a slow loss.

## Why the endpoint measure is not enough

Impermanent loss compares where the price started with where it ended. It says nothing about the journey.

Take a pair that starts at \$2,000, runs to \$3,000, and comes back to \$2,000 inside a week. The endpoint measure says zero, and against simply holding that is right, plus the fees you earned.

But the fees were meant to pay you for standing in the market, and every leg of that path was traded against a pool quoting the old price. Against somebody running the same exposure at market prices, you are behind by that path cost. Loss-versus-rebalancing — what a pool gives up because its quote is always a block late — measures exactly that, which is why serious desks use it [4].

The practical version: judge a pool by whether its fees beat that cost over a full cycle, not by whether the price happened to come back. See [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).

## How to check what actually happened

- **Your position against holding:** [Revert Finance](https://revert.finance) splits a position into fees, divergence, and net result. Most people run this far too late.
- **Who you were trading with:** [EigenPhi](https://eigenphi.io) attributes swaps to arbitrage and sandwiching. A pool where most volume is arbitrage is paying you to take the losing side.
- **Realised rather than projected yield:** [DeFiLlama](https://defillama.com) publishes fee and size series so you can compute what actually happened.
- **How crowded your band is:** [Dune Analytics](https://dune.com) shows the liquidity distribution, and how fast it changes when a reward programme starts.

Look at a full cycle, not a fortnight. A quiet two weeks makes any pool look good, and one bad week makes any pool look ruinous.

## What people get wrong in this comparison

| The mistake | Why it gives the wrong answer |
| :--- | :--- |
| Annualising a good day | Fee income clusters around events and then decays. It does not continue |
| Ignoring time out of range | The fees stop. The exposure does not, and neither does the denominator |
| Valuing reward tokens at the accrual price | They get sold into thin markets. What you actually realise is lower |
| Comparing against cash | The right benchmark is holding the two tokens, not holding dollars |
| Ignoring gas | Under a few thousand dollars, rebalancing can exceed every fee you earn |
| Assuming stable pairs are safe | Small divergence until a peg breaks, then the curve fills you with the broken token |

Uniswap's own risk documentation says the same thing plainly: fee income is not guaranteed, and it does not remove the exposure that supplying two assets creates [3].

## The decision, step by step

1. **Work out turnover.** Daily routed volume divided by the liquidity actually in the active band. Not the pool's total.
2. **Multiply by the fee rate** to get a daily yield in basis points.
3. **Work out the drag** from trailing volatility, then raise it for a concentrated range.
4. **Compare, and demand a margin.** Within a factor of two and it is a coin flip once gas and competition arrive.
5. **Set the exit rule now.** A volatility trigger, a floor on time in range, or a drawdown limit against holding.
6. **Size for the friction.** If one round trip of gas costs more than a few days of fees, this position belongs in a wide passive range instead.

See [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/) and [The Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/).

## Where to go next

Model the income with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) and the cost with the [impermanent loss calculator](/tools/impermanent-loss-calculator/). For the tier decision underneath both, see [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/). Both sides resolve into one figure in the [LP profit and return calculator](/tools/lp-profit-calculator/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)](https://arxiv.org/abs/2305.14604)
7. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)"
[7]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
