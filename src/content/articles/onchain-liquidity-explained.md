---
title: "Onchain Liquidity: How Decentralized Markets Are Assembled"
description: "There is no single market. Five layers stitch thousands of independent pools into something that behaves like one, and each layer takes a share of your trade."
category: "Foundations"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Aria Chen"
readTime: "6 min read"
keywords: "on-chain liquidity, decentralized liquidity, onchain market structure, intent based liquidity, solver networks DeFi, liquidity fragmentation"
featured: false
faq:
  - q: "What is onchain liquidity?"
    a: "Capital committed to smart contracts that quote prices for trades, together with the routing and arbitrage systems that make those separate quotes behave like a single market. It is assembled from many independent pools rather than held in one order book."
  - q: "What is decentralized liquidity?"
    a: "Liquidity supplied by many independent parties into permissionless contracts, with no central operator deciding who may quote or who may trade. Prices emerge from the invariants of those contracts and from arbitrage between them."
  - q: "Why is onchain liquidity fragmented?"
    a: "Because anyone can deploy a pool, and each chain, protocol version and fee tier holds its own separate liquidity. Routers and arbitrageurs stitch these together at execution time, but the depth at any single venue is smaller than the total."
  - q: "What are solvers in DeFi?"
    a: "Agents that compete to fill a user's stated intent, such as a desired output amount, by sourcing liquidity wherever it is cheapest, netting orders against each other, or using their own inventory. The user commits to an outcome rather than to a route."
  - q: "Does fragmentation hurt liquidity providers?"
    a: "It dilutes depth per venue and makes fee income less predictable, since routing decides which pool receives flow. It also creates the arbitrage activity that keeps prices aligned, which is paid for out of LP inventory."
  - q: "What is AMM liquidity fragmentation?"
    a: "AMM liquidity fragmentation is the splitting of a pair's depth across many pools, fee tiers and chains. Routers and arbitrage make the pieces behave like one market at execution time, but depth at any single venue is smaller than the aggregate, and providers compete for a routing decision rather than for trades directly."
---

There is no single onchain market. There are thousands of separate contracts, each quoting from its own reserves, none of them talking to each other.

What makes them behave like one market is two things sitting on top: routers that split your order across them, and traders who profit whenever any two of them disagree.

Understanding that assembly explains most of what looks strange about trading here, starting with why the best price is almost never at one venue.

<figure class="article-figure">
  <img src="/images/guides/onchain-liquidity-explained.webp" alt="Five-layer flow from deposits through pools, routers, solvers and arbitrage." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>From a single deposit to the quote a trader receives, five layers deep. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"People call fragmentation a flaw to be fixed. It is closer to a property of letting anyone deploy a market. The interesting engineering is not consolidating it. It is making scattered liquidity behave like one venue at the moment somebody trades."*

## The five layers

| Layer | What it does | What it costs |
| :--- | :--- | :--- |
| Deposits | Somebody commits tokens under a pricing rule | The quote cannot be cancelled |
| Pools | Each one quotes from its own reserves | They do not talk to each other |
| Routers | Search across them and split orders | Fee tiers now compete directly for your flow |
| Solvers | Fill your stated outcome however they can | An intermediary who sees the order first |
| Arbitrage | Keeps every venue agreeing on a price | Paid for out of depositor inventory |

## One: somebody puts money in

Everything starts with deposits into a pool contract. Those are not orders. They are inventory placed under a rule that will quote continuously, forever, without anybody supervising it.

Two things follow. The quote is always live, which is why you can trade at three in the morning with no human on the other side. And the quote cannot be pulled, which is why depositors get picked off. See [What Is a Liquidity Provider?](/guides/what-is-a-liquidity-provider/).

## Two: each pool quotes alone

Every pool prices trades from its own balances using its own rule. That rule decides where the depth sits and how the holdings rotate. See [Bonding Curves and AMM Invariants](/guides/bonding-curves-and-amm-invariants/).

The crucial point: **pools do not communicate.** Two pools on the same pair at different fee tiers are separate markets with separate prices, kept in line only by traders acting on the gap. Same across protocols. Same across chains.

## Three: routers search across them

Because the pools are independent, finding the best price means looking everywhere. Aggregators do that at the moment you trade: enumerate the paths, split your order when splitting is cheaper, and hand you one quote.

Three consequences:

- **Depth is effectively pooled when you trade**, even though it sits scattered the rest of the time.
- **Fee tiers compete head to head.** Raise your fee and you lose volume to a cheaper path with enough depth. That is why choosing a tier is a bid for flow rather than a yield setting. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).
- **Advertised pool volume is not your volume.** What matters is what routes to your specific pool and your specific band.

## Four: solvers skip the question entirely

A newer layer asks you to state an outcome rather than a route. Solvers then compete to deliver it, using pools, their own inventory, or by matching you against somebody wanting the opposite trade.

**What it gives you:** matched trades never touch a market at all, competition can beat any single pool's quote, and nobody can trade in front of you because execution is settled before anything is public.

**What it costs:** solvers are intermediaries with their own economics, the settlement contract joins your trust chain, and orders they match internally never reach any pool, which removes that fee income from depositors entirely. See [Cross-Chain Liquidity Explained](/guides/cross-chain-liquidity-explained/).

## Five: arbitrage holds it together

Nothing forces two pools to agree. Arbitrage traders do, by buying where something is cheap and selling where it is dear until the gap is smaller than their costs.

This is the layer that turns a collection of contracts into a market, and depositors pay for it. Every trade that corrects a stale quote moves value from pool inventory to the trader. That is exactly what loss-versus-rebalancing measures — what a pool pays out because its quote runs a block late [4].

The trade-off is structural rather than fixable. Consistent prices across every venue are a service, and the bill goes to whoever is standing still.

## What each layer takes from a \$100,000 trade

| Layer | What it charges | Roughly |
| :--- | :--- | ---: |
| The pool's fee | Goes to depositors | 0.05% |
| Price impact | Your own order moving the rate | 0.10% to 0.40% |
| Routing | Saved by splitting across venues | -0.05% to -0.20% |
| Gas and priority | Goes to whoever builds the block | 0.01% to 0.05% |
| Arbitrage afterwards | Comes out of depositor inventory | Never shown to the trader |

That last row is the one that appears on no confirmation screen. It is the price of keeping every venue's quote consistent, and it is settled from the inventory of whoever was not paying attention.

## Where the liquidity actually lives

Worth writing down for any pair you care about, because the answer is rarely what an interface implies.

**For a major token against dollars**, depth splits across two or three fee tiers on the dominant protocol, a competitor on the same chain, several rollup deployments, and centralised venues most routers cannot reach. Each pocket serves different flow, and the differences between them are what the arbitrage is feeding on.

**For a long-tail token**, it inverts. Almost everything sits in one pool on one chain, often at a high fee tier, with a thin second venue that mainly exists to be arbitraged. There is no routing decision to make, and that one pool's health is the token's entire liquidity.

Knowing which picture you are in changes the research. In the first case, measure routed volume per venue. In the second, measure that one pool carefully and find out who controls it.

## Why the layers keep multiplying

Each layer exists because the one below left a cost unaddressed. That pattern is worth naming, because it predicts what comes next.

Pools removed the need for a counterparty, at the cost of quoting continuously into informed flow. Routers fixed fragmentation, at the cost of making fee tiers compete directly. Solvers fixed public ordering, at the cost of an intermediary who sees your order first.

Each addition improved execution for the trader and moved the cost somewhere less visible.

For anyone supplying liquidity, the practical implication is that how much flow reaches your pool is decided further and further away from your pool. A decade ago, depth attracted trades directly. Now depth attracts trades through a routing decision made in milliseconds against every alternative, and increasingly through a solver who may never touch a pool at all.

That does not make supplying liquidity worse. It means competitiveness is a systems question rather than a capital question, and pools that are hard to reach lose flow regardless of how much money is sitting in them.

## What people get wrong about the structure

| What people assume | What actually happens |
| :--- | :--- |
| It is one market | Thousands of separate contracts, stitched together at execution |
| The best price is at the biggest venue | It is a routing result, usually split across several |
| My pool's volume is the pair's volume | Only what routes to your specific pool and band counts |
| Arbitrage is somebody else's problem | It is paid out of depositor inventory, including yours |

## Reading the structure for a specific pair

1. **List the venues** holding real depth, across protocols and chains.
2. **Measure depth at each**, within a defined price band.
3. **Check where volume actually lands** over thirty days, not the pair's total.
4. **Look for persistent price gaps** between venues, which mean weak arbitrage linkage.
5. **Estimate what share of volume is arbitrage** rather than real flow.
6. **If supplying, compute fee revenue per unit of liquidity** at each venue and compare.
7. **If trading, compare an aggregator quote** against the best single pool at your size.

This all works well when you treat the layers as separate systems with separate incentives. Treating the whole thing as one exchange produces expectations it was never built to meet.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)](https://arxiv.org/abs/1904.05234)
6. [SoK: Decentralized Finance (DeFi) (Werner et al., 2021)](https://arxiv.org/abs/2101.08778)
7. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
8. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0"
[6]: https://arxiv.org/abs/2101.08778 "SoK: Decentralized Finance (DeFi) (Werner et al., 2021)"
[7]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[8]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
