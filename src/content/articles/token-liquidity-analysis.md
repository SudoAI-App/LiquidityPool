---
title: "Token Liquidity Analysis: Measuring What Can Actually Be Sold"
description: "How to measure a token's real liquidity: active depth, exit size, venue spread, holder concentration, volume quality and lock status, from public chain data."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Marcus Vance"
readTime: "6 min read"
keywords: "token liquidity analysis, on-chain pool analytics, how to research a DeFi pool, exit liquidity, volume quality, holder concentration, liquidity pool data"
featured: false
faq:
  - q: "How do you analyse a token's liquidity?"
    a: "Measure the capital available within a defined price band across every venue, compute the trade size that moves price by a set percentage, then check how much of the reported volume is organic rather than arbitrage or wash activity."
  - q: "What is exit liquidity?"
    a: "The size that can be sold without moving price beyond your tolerance. It is a function of active depth on the sell side, not of market capitalisation or headline volume, and it sets the practical cap on any position."
  - q: "Is high trading volume a good sign?"
    a: "Only if the volume is organic. A large share of reported volume on thin tokens comes from arbitrage between venues or from wash trading, neither of which indicates that a position could be exited at the quoted price."
  - q: "How much liquidity is enough?"
    a: "Enough that your intended position is a small fraction of the depth you could exit into under stress, not under current conditions. A common institutional rule is that a full exit should move price by less than a few percent."
  - q: "What onchain data should I check first?"
    a: "Pool addresses and their reserves, liquidity distribution around the current price, holder concentration excluding known contracts, the lock status of pooled liquidity, and a breakdown of recent swaps by counterparty type."
---

You can buy almost any token. The question nobody puts on a listing page is whether you can sell it again, and at what price.

Market capitalisation is an accounting identity. Volume is activity that may or may not be real. Neither tells you what it costs to get out on a bad day.

Six measurements do tell you, and all six come from public chain data. This guide walks you through each one and ends with the single number they produce.

<figure class="article-figure">
  <img src="/images/guides/token-liquidity-analysis.webp" alt="Six cards describing active depth, exit size, venue spread, holder shape, volume quality and lock status." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six measurements that describe a token's real liquidity, none of which is market capitalisation. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"The number I want is the one nobody publishes: what does it cost to get out of this position in a bad week. Everything else, the market cap, the daily volume, the holder count, is decoration around that single figure, and it is computable in about ten minutes from pool state."*

## How much money is actually near the price?

Start with the pools. For every venue holding real liquidity in the token, add up the capital sitting within a defined band of the current price. Two percent in each direction is a good default.

In a simple constant-product pool that follows straight from the reserves. In a concentrated pool you have to sum the liquidity across the ticks inside your band, because deposits parked in distant ranges contribute nothing to your exit. The full method is in [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/).

Record the two sides separately. Depth is often lopsided after a trend, and the side you need is usually the thin one.

## What can you sell before the price moves?

Now turn that depth into the number that governs how big your position can be.

Exit size is the trade that moves the price by exactly as much as you are willing to tolerate. Write it down as a function of that tolerance rather than as a single figure.

$$
S_{\text{exit}} = \text{the trade that moves price by } \delta
$$

Where:

- $S_{\text{exit}}$ is the amount you could sell in one go.
- $\delta$ is how far you are willing to let the price move against you.

Compute it at several tolerances, because the shape of the curve tells you more than any single point on it.

| Impact you tolerate | Sell size it supports | What that means |
| :--- | ---: | :--- |
| 1% | \$85,000 | Routine exits, no urgency |
| 3% | \$270,000 | A full position exit for most people |
| 5% | \$460,000 | A stressed exit, still orderly |
| 10% | \$900,000 | Forced liquidation territory |

A position bigger than the three percent figure is a position you cannot leave without moving the market against yourself. That is a different risk from the one most people think they are taking.

## Is the depth in one place or scattered?

The same token may trade across several pools, fee tiers and chains. Adding it all up overstates what is available at any one of them, and moving between them costs you.

Three checks:

- **List every venue** holding more than a trivial share of the depth, including centralised exchanges if the token trades there.
- **Check whether the venues are actually linked** by arbitrage. Persistent price differences mean they are not, and depth you cannot reach is depth you cannot count.
- **For cross-chain deployments**, treat each chain's liquidity as separate. Bridging to reach it takes time and carries its own risk. See [Cross-Chain Liquidity Explained](/guides/cross-chain-liquidity-explained/).

## Who else is going to be selling?

Depth answers what you can sell now. Concentration answers who is standing behind you in the queue.

- **Top-holder share**, excluding known contracts, staking pools and burn addresses.
- **Unlock schedules** for team, investor and incentive allocations, read out of the vesting contracts rather than from a blog post.
- **Emission rate**, if the token is being printed for farms. That supply arrives continuously and is largely sold. See [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

A token with thin exit depth and a large cliff unlock approaching is a specific, dateable risk rather than a vague one.

## How much of the volume is real?

Reported volume mixes several activities that mean completely different things.

| Volume type | What it tells you | How to spot it |
| :--- | :--- | :--- |
| Organic swaps | Genuine demand and supply | Many different counterparties, varied sizes |
| Arbitrage | Prices being pulled back into line | Paired trades in the same block, bot addresses |
| Wash trading | Nothing at all | Repeating addresses, round sizes, self-matching |
| Just-in-time liquidity | Depth that was never really there | Money minted and burned around one large swap |

Attribution tools such as [EigenPhi](https://eigenphi.io) separate arbitrage and sandwich flow from ordinary trading. If you are supplying liquidity, the mix matters directly to you. Arbitrage volume pays you a fee while repricing the pool at your expense, a relationship measured by loss-versus-rebalancing — what a pool pays out because its quote runs a block behind the wider market. See [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).

### Every number above expires

Each of these figures describes one moment, and the moments that matter are the ones you cannot measure ahead of time.

Depth thins during volatility. Concentrated positions convert and stop quoting, and providers pull money out rather than hold inventory through a move. Volume rises at the same instant. So the exit you could actually get during a stressed hour is materially smaller than the calm-market figure, often by half or more.

Two adjustments make the analysis usable. Discount your current depth reading substantially when sizing, so the constraint you plan around is a stressed measurement rather than a comfortable one. Then look up what depth actually did during the pair's last volatile episodes. That history is recoverable from tick-level data and is a far better guide than anything you measure on a quiet afternoon.

## Can the liquidity simply be removed?

Liquidity one party can withdraw at will is not liquidity you can rely on. Check where the pool's claim sits, how much of it is locked, and until when. Then check the token contract for permissions that could impair transfers.

The full sequence is in [Rug Pulls and Locked Liquidity](/guides/liquidity-pool-rug-pulls/). For an established token this takes a minute and usually passes. For a recent launch it is the highest-value item on this list.

### Two tokens, identical on paper

Token A and Token B both show a \$40m market capitalisation and roughly \$2m of daily volume. The analysis separates them completely.

Token A has \$3.1m of depth within two percent, across two pools on one chain. Sixty-two percent of recent volume is ordinary swaps, and the top ten wallets hold 18% of supply. A three percent exit supports about \$210,000.

Token B has \$340,000 of depth, split across five venues on three chains with visible price gaps between them. Seventy-eight percent of volume traces to arbitrage and repeated address pairs, 61% of supply sits in four wallets, and a cliff unlock lands in six weeks. A three percent exit supports about \$22,000.

The headline figures are identical. The sensible position size differs by an order of magnitude. Only one of these two can absorb an ordinary allocation without the exit becoming the dominant risk, and that gap is invisible on any listing page.

## What people get wrong about liquidity

| What people assume | What actually happens |
| :--- | :--- |
| A big market cap means I can sell | Market cap is a multiplication. Depth is money actually in the pool |
| High volume means a liquid token | Much of it can be bots trading with each other |
| The pool shows \$5m, so I can sell \$5m | Only the part near the current price is reachable |
| Depth today is depth tomorrow | It thins fastest exactly when you want to leave |
| Locked liquidity means safe | It means one specific risk is handled. The rest are not |

## Putting it on one page

- [ ] Depth within plus or minus 2%, both sides, by venue.
- [ ] Exit size at 1%, 3%, 5% and 10% impact.
- [ ] Venue list with depth share and evidence they are linked by arbitrage.
- [ ] Top-ten holder share excluding contracts, plus upcoming unlocks.
- [ ] Weekly issuance as a share of circulating supply, if any.
- [ ] Volume split into organic, arbitrage and suspicious.
- [ ] Lock status of pooled liquidity, with amounts and dates.
- [ ] Your maximum position size, implied by the three percent exit figure.

That last line is the deliverable. Everything above it exists to produce one number you can size against, and a position sized from that number behaves very differently in a bad week from one sized against a market capitalisation.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
3. [Quantifying Blockchain Extractable Value: How dark is the forest? (Qin et al., 2021)](https://arxiv.org/abs/2101.05511)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
5. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
6. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
7. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[3]: https://arxiv.org/abs/2101.05511 "Quantifying Blockchain Extractable Value: How dark is the forest?"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[5]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[6]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[7]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
