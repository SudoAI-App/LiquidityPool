---
title: "TVL Explained: What Total Value Locked Can—and Cannot—Tell You"
seoTitle: "TVL Explained: What Total Value Locked Really Tells You"
description: "How one dollar becomes five dollars of headline deposits, why a big pool can fill your trade worse than a smaller one, and what to read instead."
category: "Foundations"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "TVL explained"
keywords: "TVL explained, total value locked, DeFi TVL, liquidity pool TVL, restaking leverage, TVL liquidity pool, pool utilization DeFi"
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

Total value locked is the number most DeFi dashboards lead with, and it is easy to misread.

It tells you what is sitting in a set of contracts. It does not tell you whether any of that money can fill your trade, whether the same dollar is counted several times, or whether you could get it out in a hurry.

This guide shows how the number is built, three specific ways it misleads, and what to read instead. By the end you can judge whether a pool's headline figure means anything for your trade or your deposit.

<figure class="article-figure">
  <img src="/images/guides/tvl-explained.webp" alt="A large pool reservoir and a narrow active channel distinguish total value from usable depth." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Headline value and executable depth are not the same measurement. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> This is one of the easiest numbers in DeFi to inflate. Through recursive borrowing and layers of wrapper tokens, one real dollar can be reported several times over. When you evaluate a pool, look at liquidity that is not borrowed from somewhere else, and at the fees generated against that real figure.

## It is a valuation, not a score

The number, TVL for short, sums up what a protocol's contracts hold, priced at whatever the dashboard thinks those tokens are worth. Researchers treat it as DeFi's version of assets under management [6]. There is no agreed accounting standard for it [1].

A Bank for International Settlements study of 939 Ethereum protocols found that 10.5% relied on external servers to produce the figure. In a detailed look at 400 of them, an estimate built only from on-chain data matched the published figure for 46.5% [1].

Two things follow. The number depends on what the dashboard chose to count and how it priced it. And different aggregators can publish very different totals: at the end of 2024, published estimates of Ethereum's TVL ranged from about \$80 billion to \$190 billion [1].

So it is not a measure of safety, solvency, code quality, or trading activity. It is a snapshot of a balance sheet, and it is only useful if you know how it was assembled.

## How the number is built

The calculation itself is simple: add up each token the contracts hold, multiplied by a price.

$$
\text{TVL} = \sum_{i} B_i \times P_i
$$

Where:

- $B_i$ is how much of token $i$ the contracts hold.
- $P_i$ is whatever price the dashboard uses for it.

Three choices decide the answer, and none of them is standardised [1]:

- **What counts.** Which contracts belong to the protocol? Treasury, staking, governance tokens, borrowed tokens? Aggregators let you include or exclude several of these.
- **Where the prices come from.** A deep market, a time-weighted average, or a thin pool that somebody could push around?
- **Whether claims get netted.** If a token is a claim on another token, do both get counted?

## Misread one: the same dollar, counted five times

This is the largest distortion, and it is worth following step by step.

| Step | What happens | What gets added |
| :--- | :--- | ---: |
| 1 | You deposit 10 ETH, worth \$35,000, with a staking service | +\$35,000 |
| 2 | You get a staked-ETH token back | Nothing new held |
| 3 | You deposit that token with a restaking service | +\$35,000 |
| 4 | It delegates the stake to a restaking network, which counts it too | +\$35,000 |
| 5 | You put the restaked token into a vault that supplies a pool | +\$35,000 |
| 6 | You post the vault share as collateral in a lending market | +\$35,000 |
| | **Sum of the five protocols' reported figures** | **\$175,000** |
| | **What actually exists** | **\$35,000** |

One deposit of \$35,000 becomes \$175,000 of reported deposits. Researchers call this double counting, and it is the best-known flaw in the metric [1]. Nothing dishonest happened at any step. Each protocol genuinely holds what it says it holds.

But there is only one pile of ETH at the bottom. If it breaks, every layer built on it is hit at once. That kind of leverage and interconnection is what the BIS identifies as DeFi's main source of fragility [5]. See [Liquidity Pool Tokens Explained](/guides/liquidity-pool-tokens/).

## Misread two: a big pool that fills your trade worse

You want to sell 100 ETH, worth \$350,000 at \$3,500. Two pools each show \$25,000,000. In each one, the money not in the narrow band sits in full-range positions.

| | Pool 1 | Pool 2 |
| :--- | ---: | ---: |
| Headline figure | \$25,000,000 | \$25,000,000 |
| Money in positions within 1.5% of the price | \$500,000 | \$12,000,000 |
| Price impact on your sale, before the swap fee | about 0.76% | about 0.04% |

What you pay here is price impact — how far your own order pushes the price against you. In a range-based pool, only the liquidity covering the current price absorbs it [2]. Pool 1 has 98% of its money spread across every price from zero to infinity, so little of it sits where you are trading. Pool 2 holds nearly half its money close to the price.

Same headline, roughly eighteen times the cost: about \$2,650 against about \$150 on this sale. The same logic means a low-fee pool with dense depth near the price can cost you less in total than a higher-fee pool that looks bigger. For small trades the comparison shifts again, because gas is a fixed cost that weighs more heavily the smaller the trade [7].

## Misread three: the money is not actually there

Some pools do not hold the tokens they appear to hold. Curve's older lending pools pair wrapped tokens, such as Compound's cDAI, while the underlying assets are lent out on another protocol [3].

A pool like that showing \$50,000,000 holds:

- **Receipt tokens, not the underlying assets.** The actual dollars have been borrowed by somebody else.
- **A withdrawal path that can close.** If the external lending market is fully borrowed or takes bad debt, getting the underlying assets out can stall, even while the dashboard still shows millions.
- **Two contracts' worth of risk.** The pool contract and the lending market's contracts both have to work.

Two identical figures can mean different things. One is unencumbered. The other is a claim on somebody else's borrowers.

## Why a growing number can mean nothing at all

A protocol reports deposits up 40% in two weeks. Treat it like a fund reporting assets under management.

**Did prices go up?** If the tokens it holds rose 40% over the same period, the balances did not move at all. Nobody deposited anything. It is pure revaluation.

**Are they counting their own token?** Whether governance tokens are included is a choice each aggregator makes [1]. If a protocol's own token has thin markets, the valuation is a price nobody could actually get for the whole amount.

## A high figure does not protect you

People assume a big pool is a safe pool. Size offers no protection against the mechanics.

- **Arbitrage scales with size.** Faster traders take stale quotes in any pool, and the value they take grows in proportion to the liquidity supplied [4].
- **Divergence works at any scale.** If the two tokens move apart, the pool sells the winner and buys the loser, whatever its size [2].
- **Busy pools attract just-in-time liquidity.** Some providers add liquidity for a single large swap, collect a large share of its fee, and withdraw. That can cut the fees passive providers earn on those trades [8].

That gap against holding is impermanent loss — how far a pool position trails keeping the same tokens in your wallet. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## What to read instead

| Metric | What it measures | What it still misses |
| :--- | :--- | :--- |
| Headline figure | What the contracts hold | Depth at the price, solvency, whether it is lent out |
| Money within 2% of the price | What can actually fill your trade | Everything about the rest of the protocol |
| Volume divided by pool size | Whether the money is working | Whether the volume is profitable for you |
| Fees divided by pool size | Cash generated per dollar deposited | What the position loses to volatility |

## How to make the number useful

1. **Find out what is being counted.** Which contracts, and does it include treasury, staking or the protocol's own token [1]?
2. **Check what is at the bottom.** Base assets, or several layers of wrapper tokens?
3. **Measure depth at the price.** Within 1% and 2%, not the total.
4. **Check where the prices come from.** A deep market, or a thin pool?
5. **Divide volume by the figure.** A \$5M pool doing \$15M a day turns its money over three times daily. A \$50M pool doing \$100,000 turns over 0.2%.

## When something looks off

- **Deposits spiked in days.** A reward programme or points campaign may have pulled in money that leaves when it ends. Check the schedule before you plan your exit around that liquidity.
- **Most of it is one obscure token.** The figure is being held up by something with no real market. Filter to the assets you could actually sell.
- **Money is leaving but prices are flat.** Withdrawals can come before public news of a problem. Check the protocol's announcements and consider reducing exposure until you understand why.

## Where to watch the numbers

- **Cross-chain totals with options to exclude double-counted assets:** [DeFiLlama](https://defillama.com).
- **Protocol revenue and real capital:** [Token Terminal](https://tokenterminal.com).
- **Who is actually moving money and where:** [Nansen](https://nansen.ai) or [Dune Analytics](https://dune.com).

## Where to go next

Thin depth costs you slippage — the gap between the price you were quoted and the price you got — covered in [Slippage and Price Impact](/guides/slippage-and-price-impact/). [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/) covers the measurement that replaces the headline figure, and [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/) shows how the same denominator problem distorts quoted yields. For how scattered pools combine into one market, read [Onchain Liquidity Explained](/guides/onchain-liquidity-explained/), then model fee income with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/).

## References

1. [Towards verifiability of total value locked (TVL) in decentralized finance (Saggese et al., BIS Working Paper No 1268, 2025)](https://www.bis.org/publ/work1268.htm)
2. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Legacy StableSwap Pools Overview (Curve Documentation)](https://docs.curve.finance/developer/amm/legacy/stableswap/pools/overview)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
6. [SoK: Decentralized Finance (DeFi) (Werner et al., 2021)](https://arxiv.org/abs/2101.08778)
7. [On The Quality Of Cryptocurrency Markets: Centralized Versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
8. [Strategic Analysis of Just-In-Time Liquidity Provision in Concentrated Liquidity Market Makers (Trotti et al., 2025)](https://arxiv.org/abs/2509.16157)

[1]: https://www.bis.org/publ/work1268.htm "Towards verifiability of total value locked (TVL) in decentralized finance"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core"
[3]: https://docs.curve.finance/developer/amm/legacy/stableswap/pools/overview "Legacy StableSwap Pools Overview"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion"
[6]: https://arxiv.org/abs/2101.08778 "SoK: Decentralized Finance (DeFi)"
[7]: https://arxiv.org/abs/2112.07386 "On The Quality Of Cryptocurrency Markets: Centralized Versus Decentralized Exchanges"
[8]: https://arxiv.org/abs/2509.16157 "Strategic Analysis of Just-In-Time Liquidity Provision in Concentrated Liquidity Market Makers"
