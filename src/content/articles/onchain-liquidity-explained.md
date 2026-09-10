---
title: "Onchain Liquidity: How Decentralized Markets Are Assembled"
description: "How decentralized liquidity is organised across pools, routers, solvers and arbitrage, why it is not one order book, and what that structure means for traders and LPs."
category: "Foundations"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Aria Chen"
readTime: "11 min read"
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

Onchain liquidity is not a market in the way an exchange is a market. It is a set of independent contracts, each quoting from its own reserves, made to behave consistently by routers that split orders and arbitrageurs who profit from any disagreement between them.

Understanding that assembly explains most of what seems strange about DeFi execution, including why the best price is rarely at any single venue.

<figure class="article-figure">
  <img src="/images/guides/onchain-liquidity-explained.webp" alt="Five-layer flow from deposits through pools, routers, solvers and arbitrage." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>From a single deposit to the quote a trader receives, five layers deep. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"People describe fragmentation as a flaw to be fixed. It is closer to a property of permissionless deployment: anyone can create a market, so many markets exist. The interesting engineering is not consolidation, it is making dispersed liquidity behave like one venue at the moment of execution."*

## 1. Layer One: Deposits

Everything starts with liquidity providers committing assets to a pool contract. Those deposits are not orders; they are inventory placed under a pricing rule that will quote continuously without further instruction.

Two properties follow. The quote is always live, which is why an automated market maker can serve a trade at three in the morning when no human market maker is watching. And the quote cannot be pulled, which is why providers carry adverse selection, as set out in [What Is a Liquidity Provider?](/guides/what-is-a-liquidity-provider/).

---

## 2. Layer Two: Pools

Each pool prices trades from its reserves using an invariant. The choice of invariant determines where depth sits and how reserves rotate, which is the subject of [Bonding Curves and AMM Invariants](/guides/bonding-curves-and-amm-invariants/).

Critically, pools do not communicate. Two pools on the same pair with different fee tiers are separate markets with separate prices, kept aligned only by traders acting on the difference. The same is true across protocols and across chains.

---

## 3. Layer Three: Routers and Aggregators

Because pools are independent, finding the best execution means searching across them. Aggregators do this at execution time: they enumerate paths, split an order across several pools when convexity makes splitting cheaper, and return a single quote to the user.

This has three consequences worth noting:

- **Depth is effectively pooled at execution**, even though it is fragmented at rest.
- **Fee tiers compete directly.** A pool that raises its fee loses routed volume to a cheaper path with sufficient depth, which is why tier selection is a bid for flow rather than a yield setting. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).
- **Providers cannot rely on advertised pool volume.** What matters is volume routed to their specific pool and range.

---

## 4. Layer Four: Intents and Solvers

A newer layer asks the user to state an outcome rather than a route. Solvers compete to fill that intent, sourcing liquidity from pools, from their own inventory, or by netting the order against other users' opposing intents.

The structural advantages are real: netting removes trades from the market entirely, competition among solvers can beat any single pool quote, and the user is insulated from ordering games because execution is committed before the transaction is public.

The costs are equally real. Solvers are intermediaries with their own economics, the settlement contract becomes part of the trust chain, and orders that solvers net internally never reach the pools, which removes fee income from liquidity providers. The cross-chain version of this design is examined in [Cross-Chain Liquidity Explained](/guides/cross-chain-liquidity-explained/).

---

## 5. Layer Five: Arbitrage as the Consistency Mechanism

Nothing forces two pools to agree on a price. Arbitrageurs do, by buying where an asset is cheap and selling where it is expensive until the difference is smaller than their costs.

This is the layer that makes the whole system function as a market, and it is paid for by liquidity providers. Every arbitrage trade that aligns a stale pool quote transfers value from the pool's inventory to the searcher, which is precisely what loss-versus-rebalancing measures [4].

The trade-off is structural rather than fixable: consistent prices across venues are a service, and the fee for that service is charged to whoever is standing still.

### Where the liquidity actually lives

A useful exercise for any major pair is to write down where its depth sits, because the answer is rarely what an interface implies.

For a large asset against a dollar stablecoin, depth is typically split across two or three fee tiers on the dominant protocol, a competing protocol on the same chain, several deployments on layer two networks, and centralised venues that most onchain routers cannot reach. Each pocket serves different flow, and the price differences between them are the arbitrage opportunity that keeps them aligned.

For a long-tail token the picture inverts. Depth concentrates in one pool on one chain, often at a high fee tier, with a thin secondary venue that exists mainly to be arbitraged. There is no meaningful routing decision to make, and the single pool's health is the token's liquidity in its entirety.

Knowing which picture applies changes the research. In the first case, measure routed volume per venue. In the second, measure the one pool carefully and check who controls it.

---

## 6. What This Means for Participants

**For traders.** The best price is a routing result, not a venue. Requesting a single-pool quote and accepting it means paying for convexity that a split order would have avoided.

**For liquidity providers.** Your revenue depends on where routers send flow, which depends on depth, fee and the pair's competitive structure. Choosing a pool means choosing a position in the routing table.

**For protocol designers.** Fragmentation is not eliminated by building another venue. It is addressed by making liquidity reachable, which is why singleton architectures, hooks, and intent settlement all target the cost of reaching liquidity rather than the amount of it.

### Why the layers keep multiplying

Each layer above exists because the one below it left a cost unaddressed, and that pattern is worth naming because it predicts what comes next.

Pools solved the problem of needing a counterparty at all, at the cost of quoting continuously into informed flow. Routers solved the problem of fragmented pools, at the cost of making fee tiers compete directly for flow. Solvers solved the problem of public ordering, at the cost of introducing an intermediary who sees the order first. Each addition improved execution for the user and moved the cost somewhere less visible.

For a liquidity provider, the practical implication is that the amount of flow reaching a pool is decided further and further away from the pool itself. A decade ago, depth attracted trades directly. Today, depth attracts trades through a routing decision made by software that compares it against every alternative in milliseconds, and increasingly through a solver who may not touch a pool at all.

That does not make providing liquidity worse. It does mean that competitiveness is a systems question, not a capital question, and that pools which are hard to reach lose flow regardless of how much capital sits in them.

### What the layers cost, roughly

Each layer takes a share of the same trade. For a \$100,000 swap on a deep pair, a representative breakdown:

| Layer | What it charges | Typical share of the trade |
| :--- | :--- | ---: |
| Pool fee | Paid to liquidity providers | 0.05% |
| Price impact | Movement along the curve | 0.10% to 0.40% |
| Routing gain | Saved by splitting across venues | −0.05% to −0.20% |
| Priority fee and gas | Paid to the block producer | 0.01% to 0.05% |
| Arbitrage after the trade | Paid out of LP inventory | Not charged to the trader |

The last row is the one that never appears on a confirmation screen. It is the cost of keeping every venue's quote consistent, and it is settled from the inventory of whoever was standing still.

---

## 7. Reading the Structure for a Specific Pair

- [ ] List the venues holding meaningful depth in the pair, across protocols and chains.
- [ ] Measure active depth at each, within a defined price band.
- [ ] Check where routed volume actually lands over thirty days, not aggregate pair volume.
- [ ] Look for persistent price differences between venues, which indicate weak arbitrage linkage.
- [ ] Estimate what share of volume is arbitrage rather than organic flow.
- [ ] For providers, compute fee revenue per unit of liquidity at each venue and compare.
- [ ] For traders, compare an aggregator quote against the best single-pool quote at your size.

Decentralized liquidity works well when its layers are understood as separate systems with separate incentives. Treating the whole thing as one exchange produces expectations it was never built to meet.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)](https://arxiv.org/abs/1904.05234)
6. [SoK: Decentralized Finance (DeFi) (Werner et al., 2021)](https://arxiv.org/abs/2101.08778)
7. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
8. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0"
[6]: https://arxiv.org/abs/2101.08778 "SoK: Decentralized Finance (DeFi) (Werner et al., 2021)"
[7]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[8]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
