---
title: "Real Yield in Liquidity Pools: Who Actually Pays You"
description: "Two pools quote 24%. One is paid by traders, the other by a printer. Both figures are accurate and they describe completely different instruments."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
keywords: "real yield liquidity pools, real yield DeFi, fee yield vs emissions, emission funded yield, sustainable DeFi yield, is high APY liquidity pool safe"
featured: false
faq:
  - q: "What is real yield in DeFi?"
    a: "Income paid out of fees actually collected from users, rather than out of newly issued tokens. It matters because fee-funded income persists while the protocol has activity, whereas emission-funded income ends when the schedule ends and dilutes existing holders while it runs."
  - q: "How do I tell how much of a pool's yield is real?"
    a: "Split the quoted rate into base fee yield and reward yield, which most yield aggregators publish separately, then verify the base figure against the pool's own fee and liquidity data over at least thirty days."
  - q: "Is emission-funded yield always bad?"
    a: "No. Bootstrapping depth on a new pair is a legitimate use of issuance, and being paid to provide that depth can be a sound trade. The error is counting issuance as income without pricing what issuing it costs the token you are being paid in."
  - q: "Is a high APY liquidity pool safe?"
    a: "A persistently high rate is compensation for something specific: volatility, thin liquidity, a taper schedule, or an unreviewed contract. Identify which before deciding whether the rate is adequate for the exposure."
  - q: "What happens to a pool when emissions stop?"
    a: "Capital that arrived for the emissions usually leaves within days. Depth falls, routers send less volume, and fee income for the remaining providers declines. Pools that were viable on fees alone survive the transition; the others do not."
---

Two pools quote 24%. In the first, every point comes from traders who wanted to swap. In the second, four points come from traders and twenty come from a token the protocol is printing.

Both numbers are accurate. They describe completely different instruments, and only one of them is still paying you next year.

Splitting those two lines before comparing anything is the whole discipline. This guide shows you how, prices what the printing costs, and walks through a taper from inside a position.

<figure class="article-figure">
  <img src="/images/guides/real-yield-liquidity-pools.webp" alt="Two panels comparing fee-funded and emission-funded yield across source, persistence, dilution and denomination." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same headline percentage, paid from two very different balance sheets. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"I ask one question of any farm proposal. If issuance stopped this evening, what is the position earning tomorrow morning? If the answer is near zero, we are not running a liquidity business. We are holding a token with extra steps, and it should be sized like one."*

## The two revenue lines

| | Paid by traders | Paid by printing |
| :--- | :--- | :--- |
| What it is a claim on | Activity that already happened | Supply that does not exist yet |
| How long it lasts | As long as the pair trades | Until a published date, or a vote |
| Who it dilutes | Nobody | Everybody holding the token |
| Does your own selling affect it | No | Yes, and everybody sells at once |
| What you receive | The pool's own assets | Whatever the market absorbs |

That fourth row is the one you should sit with. Fee income is unaffected by your decision to take it. Reward income is not, because everybody receiving it faces the same decision at the same moment.

## Splitting any quoted rate

Most aggregators publish the two separately. Where they do not:

$$
\text{fee APR} = \frac{\text{fees over a window}}{\text{liquidity supplying them}} \times \frac{365}{\text{days in the window}}
$$

Where:

- **Fees over a window** is what the pool actually collected.
- **Liquidity supplying them** is the money competing for those fees.

Everything above that figure in the quoted rate is issuance. Verify the base over at least thirty days, because volume clusters around events and one day will not repeat.

Worked:

| | Value |
| :--- | ---: |
| What the pool quotes | 41.0% |
| Fees collected over 30 days | \$96,000 |
| Average liquidity | \$14,000,000 |
| So the real fee yield is | 8.3% |
| Which makes the issuance portion | 32.7% |
| Reward token's price over 90 days | -38% |
| Realistic value if sold weekly | about 20% |
| **Adjusted total** | **about 28%** |

That adjustment is not a forecast. It is the observation that a token issued continuously and sold weekly has been realising materially less than its quoted price, and that pattern is measurable rather than assumed.

## What the printing actually costs

$$
\text{weekly selling pressure} = \alpha \times e
$$

Where:

- $e$ is the weekly issuance as a fraction of circulating supply.
- $\alpha$ is the fraction of recipients who sell within the week.

For the quoted rate to hold, genuine demand has to absorb that flow without the price falling. Three checks make it concrete:

1. **Read the schedule from the contract**, not the interface. Note the rate, the decay, and whether governance can change it.
2. **Compute weekly issuance as a share of supply.** Above one or two percent a week is a heavy load on a thin market.
3. **Compare issuance against the token's actual trading volume.** A token issuing more per week than it trades in a day cannot absorb its own supply.

See [Liquidity Mining Explained](/guides/liquidity-mining-explained/) and [Yield Farming Explained](/guides/yield-farming-explained/).

## The test that takes ten seconds

Set the rewards to zero and ask whether you would still supply at what remains, given how much the pair moves.

| Pool | Quoted | Fees only | What it must beat | What it actually is |
| :--- | ---: | ---: | :--- | :--- |
| Mature stable pair | 6.5% | 6.1% | Very little | A liquidity business |
| Deep ETH tier | 19.0% | 14.5% | Moderate | A liquidity business |
| Mid-cap, incentivised | 44.0% | 3.2% | High | A token position |
| New launch, heavy farm | 180.0% | 0.9% | Very high | Entirely a bet on the token |

Rows three and four are not automatic rejections. They are reclassifications. Size them, watch them and exit them as token exposures, because that is what you are holding.

## Not all fee income is durable either

Three things separate income that lasts from a temporary spike:

- **Who the volume comes from.** Arbitrage reprices the pool at your expense while paying a fee, so the same headline volume can be worth much less than it looks. The measure of that is loss-versus-rebalancing — what a pool pays out because its quote runs a block late. See [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).
- **Why the pool has the volume.** A pool that holds routed volume because it is the deepest venue keeps it. One holding volume because of a temporary reward does not.
- **Whether the tier fits.** A tier chosen for the pair's volatility earns through cycles. A mismatched one loses volume in calm markets or loses money in volatile ones.

## A taper, from inside a position

A pool paying 38%, of which 30 points are rewards, announces a halving in two weeks.

| | Liquidity | Quoted rate | Fee-only yield |
| :--- | ---: | ---: | ---: |
| Week zero | \$60M | 38% | 8% |
| Week one, people start leaving | \$48M | about 48% | 10% |
| Week two, the halving lands | \$28M | about 49%, on paper | 17%, on paper |

The quoted rate went up, because the money left faster than the rewards were cut. That is the first thing that fools people.

Now the second-order effect nobody models. With less depth, large orders cost more, routers send a smaller share of flow, and realised volume falls by perhaps a third. The fee-only yield lands near 11%, and the quoted rate near 43%.

So the fee-only yield ends up above where it started and well below the naive calculation that assumed volume was independent of depth.

Whoever modelled fee-only yield at entry knew roughly where this would land, and either stayed deliberately or left early. Whoever annualised the launch week discovered the taper as a surprise and exited through a thinner market than the one they entered, paying the difference.

Neither the issuance nor the taper was hidden. Both were in the contract before the first deposit.

## What people get wrong about real yield

| What people assume | What actually happens |
| :--- | :--- |
| A 40% rate is a 40% return | Most of it is printing, being sold by everybody who receives it |
| Rewards are a bonus on top | They are often the entire rate, and the fee part is the bonus |
| I will be early enough to exit | So will everybody else, on the same published schedule |
| Real yield means low yield | It means yield somebody actually paid for. Sometimes that is high |

## A portfolio policy that works

- **Core positions** in pools that clear their hurdle on fees alone, sized for a long horizon.
- **Satellite positions** in incentivised pools, sized as token exposure, with a fixed selling schedule and a defined exit when the taper starts.
- **No positions** justified only by a rate you have not taken apart.

That policy is dull, which is the point. It removes the failure mode where a portfolio quietly drifts into holding a basket of farm tokens that nobody ever decided to buy.

## The checklist

1. **Split every quoted rate** into fees and issuance before comparing anything.
2. **Verify the fee part** against thirty days of pool data.
3. **Read the schedule and its decay** from the contract.
4. **Compute weekly issuance** as a share of supply, and against the token's volume.
5. **Haircut the reward value** to what a realistic selling schedule actually gets.
6. **Run the zero test** and classify the position accordingly.
7. **Set an alert** for proposals that change reward weights or rates.

Real yield is not a marketing category. It is a question about who is paying you, and the answer changes how you should size the position.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [DeFiLlama Yields methodology](https://defillama.com/yields)
5. [SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)](https://arxiv.org/abs/2105.13891)
6. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://defillama.com/yields "DeFiLlama Yields"
[5]: https://arxiv.org/abs/2105.13891 "SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)"
[6]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
