---
title: "AMM vs. Order Book: Three Ways to Get a Trade Done"
description: "Three ways to get a trade done, what each costs, and a decision rule you can actually remember. Plus why the good flow is quietly leaving pools."
category: "Foundations"
date: 2026-09-06
lastReviewed: "2026-09-12"
author: "Marcus Vance"
readTime: "7 min read"
keywords: "AMM vs order book, automated market maker vs order book, DEX market structure, intent solver, CLOB, AMM vs DEX, liquidity pool vs order book, AMM vs order book exchange"
featured: false
faq:
  - q: "What is the difference between an AMM and an order book?"
    a: "An order book matches discrete bids and offers posted by traders who can cancel at any time. An automated market maker quotes continuously from a formula and cannot cancel, which is why it is systematically exposed to informed flow."
  - q: "Which gives better execution?"
    a: "It depends on size and pair. Deep order books usually execute large orders on major pairs more cheaply. Pools are competitive for smaller sizes, long-tail assets, and anything where posting a resting quote onchain is impractical."
  - q: "Why do decentralised exchanges use AMMs at all?"
    a: "Because continuous quoting requires no active operator, no cancellation traffic and no matching engine, which suits a blockchain where every message costs gas and block times are long relative to market updates."
  - q: "What is the difference between a liquidity pool vs exchange order book?"
    a: "A liquidity pool vs exchange comparison comes down to who quotes. On a centralised exchange, market makers post and cancel orders continuously. In a pool, deposited capital quotes automatically from an invariant and cannot be cancelled, which is why pools serve any size at any hour and why their providers carry adverse selection."
---

There are three ways to get a trade done onchain now, and most people only know one of them.

A pool quotes you a price from a formula, always, instantly, whatever you ask. An order book matches you against somebody who actually wants the other side. An intent network lets professionals bid for your business while you do nothing.

Each one is better at something different. This guide covers how each works, what each actually costs you, and a decision rule short enough to remember.

<figure class="article-figure">
  <img src="/images/guides/amm-vs-order-book.webp" alt="A continuous AMM curve is contrasted with discrete stacked order-book levels." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Continuous pool pricing and discrete order levels solve different problems. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"Desks comparing these usually look at the headline fee and stop. The real cost in a pool is invisible: its quote does not move until somebody trades, so anyone faster gets free money whenever the market shifts. If your fee does not cover that, you are subsidising them."*

## Three mechanisms, side by side

| | Pool | Order book | Intent network |
| :--- | :--- | :--- | :--- |
| Where the price comes from | A formula on its own balances | Whatever people have posted | Professionals bidding to fill you |
| Who provides it | Anyone who deposited | Active market makers | Solvers, using any source |
| Can they cancel | No, ever | Yes, in milliseconds | Not applicable |
| Their main problem | Getting picked off on stale quotes | Needing fast infrastructure | Needing enough solvers |
| Your main problem | Your order moves the price | Nobody may be there | Waiting for the auction |

### Pools

Money sits in a contract, and a formula turns the balances into a price [1]. Somebody can always trade, at any hour, in any size.

That availability is the point, and it is also the flaw. The quote does not update until a transaction happens, so whenever a real market moves, the pool is briefly wrong and somebody takes the difference.

### Order books

People post prices they are willing to trade at, and an engine matches them by price and time. This used to be impossible onchain because of speed and cost, and now runs on purpose-built chains such as Hyperliquid and dYdX [4].

You get exact control over your price and no cost from your own order sitting there. The catch is that liquidity is voluntary. In a crash, market makers pull their quotes in milliseconds and the book empties exactly when you need it.

### Intent networks

You sign a message rather than a transaction: swap 5 ETH for at least \$15,000, before this time. Solvers compete to fill it, using their own inventory, a centralised exchange, or a pool [3].

Nobody can trade in front of you because nobody sees it until it is done. The solver pays the gas and eats the cost if it fails. See [Automated Market Makers Explained](/guides/automated-market-maker-explained/).

## What actually happens to your order

**Through a pool.** You get a quote from the current balances. Your transaction goes out. Anything that lands before it changes the balances, so your fill is whatever the formula says at that moment. Submitted publicly with a loose tolerance, somebody can wrap your trade and take the difference [3].

**Through an order book.** A market order eats resting offers up the book, so you pay the spread plus whatever depth you consume. A limit order guarantees your price and guarantees nothing about whether it fills.

**Through an intent network.** Your signed order goes into an auction. The winner settles it onchain at or better than your limit. They carry all the execution risk [3].

Short version: pools give you certainty of execution, books give you certainty of price, intents give you protection and competition.

## Scenario one: swapping \$250,000 between stablecoins

| Route | What happens | When it is right |
| :--- | :--- | :--- |
| Stable-pair pool | Nearly free if the pool is balanced. Expensive fast if it is 85/15 skewed [2] | Check the balance first. If it is even, this is the cleanest route |
| Order book | Fills against resting depth at 0.9999 or 1.0001. Fine if the depth is real | When the book is deep and you can see it |
| Intent network | Solvers source from exchanges and pools at once, with no public exposure [3] | When the pool is skewed or you want the best of both |

The decision rule: look at the pool's balance before anything else. A balanced stable pool is hard to beat. A skewed one will cost you far more than it looks like it should [2] [3].

## Scenario two: selling a large position in a thin token

| Route | What happens | The risk |
| :--- | :--- | :--- |
| Pool | You climb through the liquidity that exists. When it runs out, the cost jumps sharply [1] | Exhausting the active depth and paying for the gap |
| Order book | You can see exactly what you will hit | Shallow bids, or your limit order never filling while the token drops |
| Intent auction | The price starts favourable and walks down until somebody can fill it [3] | Waiting, and the market moving while you do |

For anything large and illiquid, the auction usually wins. It finds the clearing price across every venue without leaving your order sitting in public for somebody to trade against.

## What it is like to provide liquidity in each

This is where the differences matter most, and it explains a trend worth knowing about.

**In a pool**, you deposit and the contract quotes on your behalf forever. A tighter range earns more and goes inactive more often [1]. Because your quote is always a block behind, you bleed continuously to faster traders. That cost is loss-versus-rebalancing — what a pool pays out for quoting late [4].

**On an order book**, professionals stream two-sided quotes and cancel them in milliseconds when something changes. They avoid the bleed entirely, at the cost of serious infrastructure and constant attention [4].

**As a solver**, you hold almost nothing. You fill an order and hedge it immediately somewhere else, or match it against somebody wanting the opposite [3].

Now the trend. Research on venues coexisting shows informed traders exploit the pool's latency while ordinary traders like its simplicity [4]. But intent networks are now intercepting the ordinary traders off-chain. Solvers match the easy orders themselves and only route the hard ones to pools.

So the mix hitting pools is getting worse. Less of the flow that pays you, more of the flow that costs you [3] [4]. Much of that cost is MEV — value taken by controlling the order transactions run in. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## Everyone can see your order before it happens

Public chains leak your intentions.

- **A pool swap** shows the size, the pool, and your tolerance setting. That is everything somebody needs to wrap it [3] [5].
- **An onchain limit order** shows your price and size the moment you post it. You can cancel, unless the network is busy and somebody takes it first.
- **A private relay or an intent** shows nothing until it is settled [3].

## What people get wrong choosing a venue

| What people assume | What actually happens |
| :--- | :--- |
| A big pool will fill anything | Only the money near the current price fills your trade |
| A loose tolerance is convenient | It is an open offer. Set it as tight as the pair allows, or route privately |
| Order books always have liquidity | Makers pull quotes in a crash, exactly when you want to trade |
| A pool is low-maintenance market making | A tight range concentrates the bleed and needs constant attention |

## The rule worth keeping

- **Use a pool** when you want guaranteed execution on a normal pair with real depth, and you can send it privately or set a tight tolerance [1].
- **Use an order book** when you want an exact price, deep resting liquidity, or to manage orders actively without paying a curve [4].
- **Use an intent network** for anything sizeable, when you want competition across venues, no gas on failure, and nobody trading in front of you [3].

This is an engineering trade-off, not a debate about ideology. Judge each route on depth, speed, and who gets to see your order first.

## What to check before you trade

1. **How much depth is within 1% of the price**, in the pool and in the book [1]?
2. **Is the pool balanced**, or will your size push it into the steep part of the curve [1] [2]?
3. **Would an auction beat both**, by aggregating venues and costing no gas [3]?
4. **If you supply liquidity, do you understand the flow shift?** Solvers are taking the good trades off-chain [3] [4].
5. **How are you sending it?** Public queue, matching engine, or private relay [3] [5]?

## Where to watch the numbers

- **How much of a pool's volume is arbitrage:** [EigenPhi](https://eigenphi.io).
- **Where the depth actually sits across venues:** [Dune Analytics](https://dune.com).
- **How solvers are routing real orders:** [CowSwap Explorer](https://explorer.cow.fi).

## When something goes wrong

- **A modest trade cost far more than expected.** There was not enough depth at the price. Route through an auction that can aggregate several venues.
- **Your pool position loses money despite heavy volume.** The volume is arbitrage. Move to a higher fee tier, or a pool whose fee rises with volatility.
- **Market making on an order book is eaten by gas.** Cancellations cost more than the spread earns. Move to a chain with sub-second blocks, or one that matches off-chain and settles on-chain.

## Where to go next

The cost comparison — price impact, meaning the way your own order moves the rate, against slippage, the gap between quote and fill — is worked through in [Slippage and Price Impact](/guides/slippage-and-price-impact/). What a quote that cannot be cancelled costs is measured in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/). The wider system of routers and solvers is described in [Onchain Liquidity](/guides/onchain-liquidity-explained/).

## References

1. [Concentrated Liquidity | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [StableSwap pools (Curve Documentation)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
3. [Flashbots Auction: Overview](https://docs.flashbots.net/flashbots-auction/overview)
4. [Coexisting Exchange Platforms: Limit Order Books and Automated Market Makers](https://doi.org/10.1086/732831)
5. [Maximal Extractable Value (MEV) | ethereum.org](https://ethereum.org/en/developers/docs/mev/)
6. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
7. [The Adoption of Blockchain-based Decentralized Exchanges (Capponi & Jia, 2021)](https://arxiv.org/abs/2103.08842)
8. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity | Uniswap Developers"
[2]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "StableSwap pools (Curve Documentation)"
[3]: https://docs.flashbots.net/flashbots-auction/overview "Flashbots Auction: Overview"
[4]: https://doi.org/10.1086/732831 "Coexisting Exchange Platforms: Limit Order Books and Automated Market Makers"
[5]: https://ethereum.org/en/developers/docs/mev/ "Maximal Extractable Value (MEV) | ethereum.org"
[6]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[7]: https://arxiv.org/abs/2103.08842 "The Adoption of Blockchain-based Decentralized Exchanges (Capponi & Jia, 2021)"
[8]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
