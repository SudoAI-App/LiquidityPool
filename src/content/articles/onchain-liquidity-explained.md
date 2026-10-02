---
title: "Onchain Liquidity: How Decentralized Markets Are Assembled"
description: "There is no single onchain market. Five layers stitch thousands of independent pools into something that behaves like one, and each takes a share of your trade."
category: "Foundations"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "on-chain liquidity"
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

There is no single onchain market. There are thousands of separate contracts, each quoting from its own reserves, none of them aware of the others.

What makes them behave like one market is two things sitting on top: routers that split your order across them, and traders who profit whenever any two of them disagree.

Once you see that assembly, most of what looks strange about trading here makes sense, starting with why the best price is rarely at one venue. By the end you can map where a pair's liquidity sits and who takes a cut of your trade.

<figure class="article-figure">
  <img src="/images/guides/onchain-liquidity-explained.webp" alt="Five-layer flow from deposits through pools, routers, solvers and arbitrage." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>From a single deposit to the quote a trader receives, five layers deep. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> People call fragmentation a flaw to be fixed. It is closer to a property of letting anyone deploy a market. The useful engineering is not consolidating it. It is making scattered liquidity behave like one venue at the moment somebody trades.

## The five layers

| Layer | What it does | What it costs |
| :--- | :--- | :--- |
| Deposits | Somebody commits tokens under a pricing rule | The quote cannot be cancelled |
| Pools | Each one quotes from its own reserves | They do not talk to each other |
| Routers | Search across them and split orders | Fee tiers now compete directly for your flow |
| Solvers | Fill your stated outcome however they can | An intermediary who sees the order first |
| Arbitrage | Keeps every venue agreeing on a price | Paid for out of depositor inventory |

## One: somebody puts money in

Everything starts with deposits into a pool contract. Those are not orders. They are inventory placed under a rule that quotes continuously, without anybody supervising it.

Two things follow. The quote is always live, which is why you can trade at three in the morning with no human on the other side. And the quote cannot be pulled when the market moves, which is why depositors lose value to faster traders [4]. See [What Is a Liquidity Provider?](/guides/what-is-a-liquidity-provider/).

## Two: each pool quotes alone

Every pool prices trades from its own balances using its own rule. That rule decides where the depth sits and how the holdings rotate [6]. See [Bonding Curves and AMM Invariants](/guides/bonding-curves-and-amm-invariants/).

The key point: **pools do not communicate.** On Uniswap v3, the same pair can have a separate pool at each fee tier [1]. Each one is its own market with its own price, kept in line only by traders acting on the gap. The same holds across protocols and across chains.

## Three: routers search across them

Because the pools are independent, finding the best price means looking everywhere. Aggregators do that at the moment you trade: list the paths, split your order when splitting is cheaper, and hand you one quote.

Three consequences:

- **Depth is effectively pooled when you trade**, even though it sits scattered the rest of the time. Uniswap v4 puts all its pools in one contract partly to make routing across them cheaper [2].
- **Fee tiers compete head to head.** Raise your fee and you lose volume to a cheaper path with enough depth. That is why choosing a tier is a bid for flow rather than a yield setting. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).
- **Advertised pool volume is not your volume.** What matters is what routes to your specific pool and your specific band.

## Four: solvers skip the question entirely

A newer layer asks you to state an outcome rather than a route, a signed request known as an intent. Solvers — independent parties that compete to fill those requests — then deliver it, using pools, their own inventory, or by matching you against somebody wanting the opposite trade [8].

**What it gives you:** competition between solvers can beat any single pool's quote [8]. When two orders cancel out, they swap directly and skip pool fees altogether [9].

**What it costs:** solvers are intermediaries with their own economics, and the settlement contract joins your trust chain. Orders they match against each other never reach a pool, so depositors earn no fee on them [9]. See [Cross-Chain Liquidity Explained](/guides/cross-chain-liquidity-explained/).

## Five: arbitrage holds it together

Nothing forces two pools to agree. Arbitrage traders do, by buying where something is cheap and selling where it is dear until the gap is smaller than their costs. Bots compete for these trades, often by bidding up transaction fees to be first [5].

This is the layer that turns a collection of contracts into a market, and depositors pay for it. Every trade that corrects a stale quote moves value from pool inventory to the trader. Loss-versus-rebalancing measures that cost — the value a pool hands to arbitrageurs because it trades at a price the wider market has already moved past [4].

The trade-off is built in. Consistent prices across every venue are a service, and the bill goes to whoever is standing still. Where trading costs are high, gaps between venues can persist instead of closing [7].

## What each layer takes from a \$100,000 trade

Take a \$100,000 USDC-to-ETH swap. Assume the best single pool charges 0.05% and is as deep as a \$200 million constant-product pool, with \$100 million on each side. A router can split the order evenly with a second pool of the same depth and fee. Gas is 150,000 units at 2 gwei with ETH at \$3,500.

| Layer | Who gets it | One pool | Split across two |
| :--- | :--- | ---: | ---: |
| The pool's fee | Depositors, less any protocol fee | \$50 | \$50 |
| Price impact | Your own order moving the rate | about \$100 | about \$50 |
| Gas | Base fee burned, tip to the validator [12] | about \$1 | a little more |
| Arbitrage afterwards | Comes out of depositor inventory | Not shown | Not shown |

The \$50 fee is what you pay. On a Uniswap v3 0.05% pool with the protocol fee switched on, depositors keep \$37.50 of it and the protocol takes \$12.50 [11].

Splitting halves the price impact — the cost of your own order moving the rate — because each half moves a pool only half as far. That saving is what the router is for. Gas, at about 0.001% here, barely registers at this size. On a small trade the same fixed gas weighs far more [7].

The last row appears on no confirmation screen. After your trade the pools sit off the market price, and arbitrageurs pull them back, taking value from depositors [4]. Value captured by controlling the order of transactions in a block is known as maximal extractable value (MEV), and arbitrage after large trades is one of its main forms [3] [10].

## Where the liquidity actually lives

This is worth writing down for any pair you care about, because the answer is rarely what an interface implies.

**For a major token against dollars**, depth splits across two or three fee tiers on the dominant protocol, a competitor on the same chain, several rollup deployments, and centralised exchanges most routers cannot reach. Each pocket serves different flow, and the differences between them are what the arbitrage feeds on.

**For a long-tail token**, it inverts. Almost everything sits in one pool on one chain, often at a high fee tier, with a thin second venue that mainly exists to be arbitraged. There is no routing decision to make, and that one pool's health is the token's entire liquidity.

Knowing which picture you are in changes the research. In the first case, measure routed volume per venue. In the second, measure that one pool carefully and find out who controls it.

## Why the layers keep multiplying

Each layer exists because the one below left a cost unaddressed. That pattern is worth naming, because it suggests what comes next.

Pools removed the need for a counterparty, at the cost of quoting continuously to better-informed traders. Routers fixed fragmentation, at the cost of making fee tiers compete directly. Solvers addressed public ordering, at the cost of an intermediary who sees your order first.

Each addition improved execution for the trader and moved the cost somewhere less visible.

For anyone supplying liquidity, the practical implication is that how much flow reaches your pool is decided further and further away from it. In early AMMs, depth attracted trades directly. Now depth attracts trades through a routing decision made against every alternative, and increasingly through a solver who may never touch a pool at all.

That does not make supplying liquidity worse. It means competitiveness is a systems question as much as a capital question, and a pool that routers rarely reach loses flow regardless of how much money is sitting in it.

## Reading the structure for a specific pair

1. **List the venues** holding real depth, across protocols and chains.
2. **Measure depth at each**, within a defined price band.
3. **Check where volume actually lands** over thirty days, not the pair's total.
4. **Look for persistent price gaps** between venues, which mean weak arbitrage linkage.
5. **Estimate what share of volume is arbitrage** rather than real flow.
6. **If supplying, compute fee revenue per unit of liquidity** at each venue and compare.
7. **If trading, compare an aggregator quote** against the best single pool at your size.

Treat the layers as separate systems with separate incentives, not as one exchange. For working one token's depth and flow end to end, see [Token Liquidity Analysis](/guides/token-liquidity-analysis/), then turn the picture into a position scenario with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/).

## References

1. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)](https://arxiv.org/abs/1904.05234)
6. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
7. [On The Quality Of Cryptocurrency Markets: Centralized Versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
8. [Solvers (CoW Protocol Documentation)](https://docs.cow.fi/cow-protocol/concepts/introduction/solvers)
9. [Coincidence of Wants (CoW Protocol Documentation)](https://docs.cow.fi/cow-protocol/concepts/how-it-works/coincidence-of-wants)
10. [Maximal extractable value (MEV) (ethereum.org)](https://ethereum.org/en/developers/docs/mev/)
11. [Fees (Uniswap Developers Documentation)](https://developers.uniswap.org/docs/get-started/concepts/fees)
12. [Ethereum gas and fees: technical overview (ethereum.org)](https://ethereum.org/en/developers/docs/gas/)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core"
[3]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges"
[6]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols"
[7]: https://arxiv.org/abs/2112.07386 "On The Quality Of Cryptocurrency Markets: Centralized Versus Decentralized Exchanges"
[8]: https://docs.cow.fi/cow-protocol/concepts/introduction/solvers "Solvers"
[9]: https://docs.cow.fi/cow-protocol/concepts/how-it-works/coincidence-of-wants "Coincidence of Wants"
[10]: https://ethereum.org/en/developers/docs/mev/ "Maximal extractable value (MEV)"
[11]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees"
[12]: https://ethereum.org/en/developers/docs/gas/ "Ethereum gas and fees: technical overview"
