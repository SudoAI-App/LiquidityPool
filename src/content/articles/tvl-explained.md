---
title: "TVL Explained: What Total Value Locked Can—and Cannot—Tell You"
description: "How one dollar becomes seven dollars of headline deposits, why a big pool can fill worse than a small one, and what to read instead."
category: "Foundations"
date: 2026-09-04
lastReviewed: "2026-09-12"
author: "Aria Chen"
readTime: "7 min read"
keywords: "TVL explained, total value locked, DeFi TVL, liquidity pool TVL, restaking leverage, executable depth, TVL liquidity pool, liquidity pool depth, pool utilization DeFi, liquidity depth crypto"
featured: false
faq:
  - q: "What does TVL mean in DeFi?"
    a: "Total value locked is the aggregate market value of assets held by a protocol or pool. It measures deposits, not the depth available to absorb a trade at the current price."
  - q: "Is high TVL good for a liquidity pool?"
    a: "Not on its own. In concentrated pools most of the value can sit in ranges the market never visits, so a smaller pool with dense active liquidity can offer better execution and better fee density."
  - q: "What should I look at instead of TVL?"
    a: "Active liquidity within a percentage band of the current price, routed volume for the specific pool and tier, and the ratio of fees generated to liquidity supplying them."
  - q: "Do liquidity pools affect token price?"
    a: "Within the pool, yes: price is a function of the reserve ratio, so every trade moves it. Across the market, a deep pool anchors price by making arbitrage cheap, while a thin pool can be moved sharply by a single order."
---

Total value locked is the number every dashboard leads with, and it is the one that misleads people most.

It tells you what is sitting in a contract. It does not tell you whether any of that money can fill your trade, whether it is the same dollar counted five times, or whether you could get it out in a hurry.

This guide shows you how the number is built, three specific ways it lies, and what to read instead.

<figure class="article-figure">
  <img src="/images/guides/tvl-explained.webp" alt="A large pool reservoir and a narrow active channel distinguish total value from usable depth." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Headline value and executable depth are not the same measurement. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"This is the easiest number in the industry to inflate. Through recursive borrowing and layers of wrapper tokens, one real dollar can be reported several times over. When you evaluate a pool, look at liquidity that is not borrowed from somewhere else, and at fees generated against that real figure."*

## It is a valuation, not a score

The number sums up what a protocol's contracts hold, priced at whatever the dashboard thinks those tokens are worth. There is no agreed accounting standard for this.

A Bank for International Settlements study of 939 Ethereum protocols found that more than one in ten relied on off-chain data to produce the figure. In a detailed look at 400 of them, fewer than half matched a standardised on-chain estimate [1].

Two things follow. The number depends entirely on what the dashboard chose to count and how it priced it. And the same protocol can show wildly different figures depending on which site you look at [1].

So it is not a measure of safety, solvency, code quality, or trading activity. It is a snapshot of a balance sheet, and it is only useful if you know how it was assembled.

## How the number is built

$$
\text{TVL} = \sum_{i} B_i \times P_i
$$

Where:

- $B_i$ is how much of token $i$ the contracts hold.
- $P_i$ is whatever price the dashboard uses for it.

Simple enough. Three choices decide the answer, and none of them is standardised:

- **What counts.** Which contracts belong to the protocol? Treasury, staking, hooks? Different sites answer differently [2].
- **Where the prices come from.** A deep market, a time-weighted average, or an illiquid pool that somebody could manipulate with a borrowed position [1]?
- **Whether claims get netted.** If a token represents a claim on something else, do both get counted [1] [3]?

## Lie one: the same dollar, counted five times

This is the big one, and it is worth following step by step.

| Step | What happens | What gets added |
| :--- | :--- | ---: |
| 1 | You deposit 10 ETH with a staking service | +\$35,000 |
| 2 | You get a staked-ETH token back | Nothing new held |
| 3 | You deposit that token with a restaking service | +\$35,000 |
| 4 | It delegates the stake to a restaking network, which counts it too | +\$35,000 |
| 5 | You put the restaked token into a vault that supplies a pool | +\$35,000 |
| 6 | You post the vault share as collateral in a lending market | +\$35,000 |
| | **What the dashboards show** | **\$175,000** |
| | **What actually exists** | **\$35,000** |

One deposit of \$35,000 becomes \$175,000 of reported deposits [1] [3]. Nothing dishonest happened at any step. Each protocol genuinely holds what it says it holds.

But there is only one pile of ETH at the bottom. If it breaks, all five layers unwind at once. See [Liquidity Pool Tokens Explained](/guides/liquidity-pool-tokens/).

## Lie two: a big pool that cannot fill your trade

You want to swap 100 ETH. Two pools, both showing \$25,000,000.

| | Pool 1 | Pool 2 |
| :--- | ---: | ---: |
| Headline figure | \$25,000,000 | \$25,000,000 |
| Money working within 1.5% of the price | \$500,000 | \$12,000,000 |
| What your trade costs | 2.5% | under 0.05% |

Pool 1 has 98% of its money in wide or abandoned ranges away from the market [2]. Pool 2 has professionals holding depth right where you need it.

Same headline, fifty times the cost. And a 0.05% fee pool with concentrated depth routinely beats a 0.30% pool with scattered depth on total cost, even though the second looks bigger [2].

## Lie three: the money is not actually there

Some pools do not hold the tokens they appear to hold. Curve's lending pools hold interest-bearing receipts, because the actual assets have been lent out to an external market [3].

A pool showing \$50,000,000 might hold:

- **Receipt tokens, not the real thing.** The actual dollars have been borrowed by somebody else.
- **A withdrawal path that can close.** If the external lending market runs hot or takes bad debt, withdrawals freeze. You cannot get your assets out, even though the dashboard still shows millions.
- **Two contracts' worth of risk.** The pool contract and the lending market's contracts both have to work.

Two identical figures can mean completely different things. One is unencumbered. The other is a claim on somebody else's borrowers [3].

## Why a growing number can mean nothing at all

A protocol reports deposits up 40% in two weeks. Treat it like a fund reporting assets under management.

**Did prices go up?** If ETH rose 40% over the same period, the token balances did not move at all. Nobody deposited anything. It is pure revaluation [1].

**Are they counting their own token?** Protocols paying rewards in their own token often count unvested or locked rewards in the figure. If that token has thin markets, the valuation is a price nobody could actually get [1].

## A high figure does not protect you

People assume a big pool is a safe pool. The number offers no protection against the mechanics at all.

- **Arbitrage does not care how big the pool is.** Faster traders take stale quotes regardless of size, and bigger pools attract more of them [4].
- **Divergence does not care either.** If the two tokens move apart, the pool sells the winner and buys the loser, at any scale [4].
- **Big busy pools attract fee sniping.** Bots inject liquidity for one block, take the fee on the largest trades, and leave [4].

That gap against holding is impermanent loss — the shortfall between a pool position and simply keeping the tokens. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## What to read instead

| Metric | What it measures | What it still misses |
| :--- | :--- | :--- |
| Headline figure | What the contracts hold [1] | Depth at the price, solvency, whether it is lent out [1] [3] |
| Money within 2% of the price | What can actually fill your trade [2] | Everything about the rest of the protocol |
| Volume divided by pool size | Whether the money is working | Whether the volume is profitable for you |
| Fees divided by pool size | Cash generated per dollar deposited | What the position loses to volatility [4] |

## What people get wrong about this number

| What people assume | What actually happens |
| :--- | :--- |
| A bigger pool means a cheaper trade | Most of it can sit in ranges the market never visits |
| Growth means adoption | Price moves and layered wrappers multiply the figure without new money |
| A big pool means I can get out | Lending wrappers and restaking queues can lock you in while the dashboard looks healthy |
| The number is verifiable | More than one in ten protocols report it from an off-chain source [1] |

## How to make the number useful

1. **Find out what is being counted.** Which contracts, and does it include treasury or staking [1]?
2. **Check what is at the bottom.** Base assets, or four layers of wrapper tokens [1] [3]?
3. **Measure depth at the price.** Within 1% and 2%, not the total [2].
4. **Check where the prices come from.** A manipulation-resistant feed, or a thin pool [1]?
5. **Divide volume by the figure.** A \$5M pool doing \$15M a day matters more than a \$50M pool doing \$100,000 [2].

## When something looks off

- **Deposits spiked in days.** A reward programme or points campaign pulled in money that will leave the moment it ends. Check the schedule and plan for the exit.
- **Most of it is one obscure token.** The figure is being held up by something with no real market. Filter to the assets you could actually sell.
- **Money is leaving but prices are flat.** Somebody knows something. Check the protocol's channels and reduce exposure until it settles.

## Where to watch the numbers

- **Cross-chain totals with double-counting filters:** [DeFiLlama](https://defillama.com).
- **Protocol revenue and real capital:** [Token Terminal](https://tokenterminal.com).
- **Who is actually moving money and where:** [Nansen](https://nansen.ai) or [Dune Analytics](https://dune.com).

## Where to go next

The practical consequence shows up in what a trade costs, covered in [Slippage and Price Impact](/guides/slippage-and-price-impact/), and in fee income, which you can model with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/). For how the same problem distorts quoted yields, see [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/). The measurement that replaces it is in [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/).

## References

1. [Towards verifiability of total value locked (TVL) in decentralized finance | BIS Working Paper 1268](https://www.bis.org/publ/work1268.htm)
2. [How Uniswap Works | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)
3. [StableSwap pools (Curve Documentation)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
4. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
5. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
6. [SoK: Decentralized Finance (DeFi) (Werner et al., 2021)](https://arxiv.org/abs/2101.08778)
7. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)

[1]: https://www.bis.org/publ/work1268.htm "Towards verifiability of total value locked (TVL) in decentralized finance | BIS Working Paper 1268"
[2]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works | Uniswap Developers"
[3]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "StableSwap pools (Curve Documentation)"
[4]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[5]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[6]: https://arxiv.org/abs/2101.08778 "SoK: Decentralized Finance (DeFi) (Werner et al., 2021)"
[7]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
