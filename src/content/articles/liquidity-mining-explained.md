---
title: "Liquidity Mining Explained: Incentives, Emissions and Lasting Depth"
description: "Where a headline yield really comes from, four generations of incentive design, and how to tell a pool that outlives its rewards from one that empties."
category: "Advanced"
date: 2026-08-23
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
keywords: "liquidity mining, DeFi incentives, ve-tokenomics, bribe markets, Hidden Hand, Votium, points programs, Uniswap v4 hook incentives, mercenary capital, liquidity mining vs yield farming, liquidity incentives"
featured: false
faq:
  - q: "What is liquidity mining?"
    a: "A protocol issuing its own token to reward deposits, usually to bootstrap depth on pairs that would not attract enough liquidity from fees alone. It is the incentive programme, distinct from the user-side activity of farming it."
  - q: "What is the difference between liquidity mining and yield farming?"
    a: "Liquidity mining describes the protocol issuing incentives. Yield farming describes the user moving capital toward whatever combination of fees and incentives currently pays most."
  - q: "What happens when liquidity mining rewards end?"
    a: "Capital that arrived for emissions usually leaves quickly, depth falls, routers send less volume, and fee income for remaining LPs declines. Pools that were viable on fees alone survive the transition; others do not."
---

A pool advertising 45% is almost never earning 45% from trading. Most of it is a protocol printing its own token to persuade you to show up.

That is liquidity mining. It is a marketing budget, paid in equity, and it works exactly as long as the budget lasts.

This guide shows you how to split the headline number into its parts, how the design has evolved through four generations, and how to tell a pool that survives the rewards ending from one that empties overnight.

<figure class="article-figure">
  <img src="/images/guides/liquidity-mining-explained.webp" alt="A fading reward-emission stream and a separate trade-flow channel feed a liquidity pool." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Incentive-funded liquidity and organic market flow are different inputs. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"This is a customer acquisition cost for the protocol, not an income stream for you. The classic cycle is guaranteed: money arrives while rewards are high, farms the token, sells it, the price falls, the yield falls, and the money leaves. The pools worth being in are the ones moving toward real fee sharing or owning their own liquidity."*

## Split the headline number first

Before anything else, break the advertised rate into where the money comes from.

| Where it comes from | In a 45% headline | What happens to it |
| :--- | ---: | :--- |
| Real trading fees, paid by swappers | 4.5% | Continues as long as people trade |
| The protocol printing its own token | 28.5% | Ends when the programme ends |
| Payments from outside sponsors | 12.0% | Ends when the sponsor stops paying |

Only the first row is income. The other two are a schedule with an end date, and everybody farming alongside you knows when it is.

Run the protocol's side of the same sum:

$$
\text{Efficiency} = \frac{\text{trading fees the pool generated}}{\text{value of tokens handed out}}
$$

Where:

- The top is real revenue paid by traders.
- The bottom is what the protocol gave away to get it.

A protocol handing out \$1,000,000 a month to attract \$20,000,000, on a pool generating \$40,000 in fees, is running at 0.04. It hands out \$25 of its own token for every \$1 of fees traders actually pay. That is not sustainable and everyone involved knows it. See [Liquidity Provider Fees](/guides/liquidity-provider-fees/).

Watch the direction as well as the level. A ratio climbing from 0.1 toward 0.5 over a few months suggests the rewards are turning into real trading that will stay. A ratio stuck near zero while the programme runs tells you the depth is rented, and it will leave with the rewards.

## Four generations, and what each one broke

### First: print tokens, watch them get sold

The 2020 model. Deposit, and the contract mints you tokens every block [1].

The flaw was immediate. Farmers harvest continuously and sell straight away, which pushes the token price down, which lowers the advertised rate, which makes the farmers leave for the next programme. Depth collapses, the token falls further, and the pool is left empty.

### Second: make people lock up, then sell the votes

Curve's answer was to make rewards depend on locking [2]. Lock the governance token for up to four years and you get voting power that decays over time. That power directs where the emissions go, and boosts the rewards paid on your own deposits.

Then a second market appeared on top. Rather than buying and locking tokens, outside protocols simply pay the lockers cash to vote for their pool [4]. It works, and it turned emission routing into an open auction. It also produced voter apathy and a handful of entities controlling the outcome.

### Third: promise points, decide later

As token issuance attracted regulatory attention, protocols started awarding points instead. Deposit, bridge, or trade, and a number goes up on an off-chain ledger.

Protocols got enormous headline deposits with no dilution and no promises. Depositors got no contractual right to anything: no redemption rate, no timeline, no guarantee. When the tokens eventually arrived, the dilution was usually worse than expected, and deposits left en masse.

### Fourth: pay only for liquidity that actually works

The current generation ties rewards to whether your money is doing anything [6]. Code attached to a pool can inspect exactly where your liquidity sits, and pay accordingly:

- **Only pay in-range positions**, within a fraction of a percent of the current price. Money parked far away earns nothing.
- **Pay more when it is hardest.** The code can measure how fast arbitrage is draining the pool and lift rebates during volatile stretches.
- **Pay for volume actually executed**, not for capital sitting there.

## The exploit the old designs allowed

This one is worth understanding because it explains why the new generation exists.

In a range-based pool, you can put \$1,000,000 into a range 50% away from the current price. If the reward contract only looks at how much liquidity you staked, you collect rewards while:

| | An honest in-range position | A parked far-away position |
| :--- | :--- | :--- |
| Does it fill trades | Yes, constantly | Never |
| Does it carry trading risk | Yes, it is rotated by every move | No. It just sits in one token |
| Does it earn rewards | Yes | Yes, the same |

So the farmer with no risk and no contribution collected the same rewards as the person actually making the market. Newer programmes check the position was genuinely in range over time, or verify it through the pool's own code [6]. See [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

## What people get wrong about incentives

| What people assume | What actually happens |
| :--- | :--- |
| A triple-digit rate is a great opportunity | The reward token usually falls faster than the rewards accumulate |
| Locking for four years to boost yield is smart | The governance token can lose 90% while you are locked in |
| Points will be worth something | There is no contract, no rate, and no date. It is an expectation, not an asset |
| Rewards make a bad pool good | They delay the reckoning. When they stop, everything that was wrong is still wrong |

## What to check before farming a pool

| What to check | What good looks like | Walk away if |
| :--- | :--- | :--- |
| What the reward is paid in | A liquid asset, or a token with real depth | A farm token nobody can sell in size |
| When you can sell it | Immediately | A hidden twelve-month vest, during which the price falls |
| How stable the routing is | Predictable programme with a published schedule | A vote next week can send it all somewhere else [2] |
| Whether you must be in range | Rewards require active liquidity [6] | Parked money earns the same as working money |
| Whether it clears the bleed | Fees plus rewards comfortably beat the pair's volatility cost | A huge rate hiding severe adverse selection [3] |

See the [Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/).

## Where to watch the numbers

- **Token issuance, unlock dates and vesting cliffs:** [Token Unlocks](https://tokenunlocks.app) and [DeFiLlama](https://defillama.com).
- **How much of the reward token is being sold daily:** [Dune Analytics](https://dune.com).
- **Your own position, rewards and net result:** [Revert Finance](https://revert.finance).

## When something goes wrong

- **The advertised rate halved in two days.** Money flooded in and diluted the rewards per dollar. Recalculate, and if it no longer covers what the pair costs you, leave.
- **The reward token keeps falling.** Daily selling by farmers exceeds anyone's demand for it. Harvest and sell every day into something real. Never hold it unhedged.
- **You cannot withdraw because of a lockup.** Ask the question before you lock next time: does the maximum possible reward justify the reward token going to zero while you are stuck?

## Where to go next

The user's side of the same mechanism is in [Yield Farming Explained](/guides/yield-farming-explained/). To compare against a simple staked position, see [Liquidity Pool vs Staking](/guides/liquidity-pool-vs-staking/), and to read the rate correctly, [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/). The test that separates durable income from issuance is in [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/), and the three activities are separated in [Liquidity Mining vs Yield Farming vs Staking](/guides/liquidity-mining-vs-yield-farming/).

## References

1. [SoK: Decentralized Finance (DeFi) (Werner et al., 2021)](https://arxiv.org/abs/2101.08778)
2. [Curve Finance Gauges & Incentives Architectural Overview](https://docs.curve.finance/protocol/gauge/overview)
3. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
4. [Hidden Hand Bribe Marketplace Architecture and Documentation](https://docs.hiddenhand.finance/)
5. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
6. [Uniswap v4 Core Whitepaper](https://uniswap.org/whitepaper-v4.pdf)
7. [SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)](https://arxiv.org/abs/2105.13891)
8. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)

[1]: https://arxiv.org/abs/2101.08778 "SoK: Decentralized Finance (DeFi) (Werner et al., 2021)"
[2]: https://docs.curve.finance/protocol/gauge/overview "Curve Finance Gauges & Incentives Architectural Overview"
[3]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[4]: https://docs.hiddenhand.finance/ "Hidden Hand Bribe Marketplace Architecture and Documentation"
[5]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[6]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[7]: https://arxiv.org/abs/2105.13891 "SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)"
[8]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
