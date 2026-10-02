---
title: "AMM vs. Order Book: Three Ways to Get a Trade Done"
description: "Three ways to get a trade done, what each costs, and a decision rule you can actually remember. Plus why the good flow is quietly leaving pools."
category: "Foundations"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "AMM vs order book"
keywords: "AMM vs order book, automated market maker vs order book, DEX market structure, intent solver, CLOB, AMM vs DEX, liquidity pool vs order book, AMM vs order book exchange"
featured: false
faq:
  - q: "What is the difference between an AMM and an order book?"
    a: "An order book matches discrete bids and offers posted by traders who can cancel at any time. An automated market maker quotes continuously from a formula and cannot cancel, which is why it is systematically exposed to informed flow."
  - q: "Which gives better execution?"
    a: "It depends on size, pair and network. On Ethereum mainnet, gas is a fixed cost that makes pools relatively expensive for small trades, while research has found their costs for larger trades competitive with centralised exchanges. Deep order books remain strong on major pairs, and pools are often the only venue for long-tail assets."
  - q: "Why do decentralised exchanges use AMMs at all?"
    a: "Because continuous quoting requires no active operator, no cancellation traffic and no matching engine, which suits a blockchain where every message costs gas and block times are long relative to market updates."
  - q: "What is the difference between a liquidity pool vs exchange order book?"
    a: "A liquidity pool vs exchange comparison comes down to who quotes. On a centralised exchange, market makers post and cancel orders continuously. In a pool, deposited capital quotes automatically from an invariant and cannot be cancelled, which is why pools serve any size at any hour and why their providers carry adverse selection."
---

There are three ways to get a trade done onchain now, and most people only know one of them.

A pool quotes you a price from a formula, always, instantly, whatever you ask. An order book matches you against somebody who actually wants the other side. An intent network lets professional fillers bid for your order while you wait.

Each one is better at something different. By the end you should be able to pick a route for a given trade, and know what each choice means if you are the one supplying the liquidity.

<figure class="article-figure">
  <img src="/images/guides/amm-vs-order-book.webp" alt="A continuous AMM curve is contrasted with discrete stacked order-book levels." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Continuous pool pricing and discrete order levels solve different problems. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Comparisons of these venues often stop at the headline fee. The larger cost in a pool is harder to see: its quote does not move until somebody trades, so anyone faster can trade against the stale price at a profit whenever the market shifts. If the pool's fee does not cover that, its depositors are subsidising the faster traders.

## Three mechanisms, side by side

| | Pool | Order book | Intent network |
| :--- | :--- | :--- | :--- |
| Where the price comes from | A formula on its own balances | Whatever people have posted | Fillers competing to fill you |
| Who provides it | Anyone who deposited | Active market makers | Solvers, using any source |
| Can they cancel | No, ever | Yes, at any time | Not applicable |
| Their main problem | Getting picked off on stale quotes | Needing fast infrastructure | Needing enough solvers |
| Your main problem | Your order moves the price | Nobody may be there | Waiting for the auction |

### Pools

Money sits in a contract, and a formula turns the balances into a price [1]. Somebody can always trade, at any hour, in any size. What sits in that contract is a liquidity pool, and the inventory side of it is covered in [What Is a Liquidity Pool?](/guides/what-is-a-liquidity-pool/).

That availability is the point, and it is also the flaw. The quote does not update until a transaction happens, so whenever a real market moves, the pool is briefly wrong and somebody takes the difference. The formula itself varies by design — two-asset constant product, multi-asset weighted baskets as in [Balancer Weighted Pools](/guides/balancer-and-weighted-pools/), or stepped bins — but every one of them quotes from its own balances.

### Order books

People post prices they are willing to trade at, and an engine matches them by price and time. On a general-purpose blockchain this is costly, because every order and cancellation is a paid transaction. That cost is a large part of why decentralised exchanges adopted pools in the first place [1]. Purpose-built chains now run order books fully onchain. Hyperliquid, for example, matches orders in price-time priority much as a centralised exchange does [4].

You get exact control over your price and no cost from your own order sitting there. The catch is that liquidity is voluntary. Market makers can pull their quotes in a fast market, so the book can thin out exactly when you need it.

### Intent networks

You sign a message rather than a transaction: swap 5 ETH for at least \$15,000, before this time. Solvers compete to fill it, using onchain pools, matching your order against an opposite one, or other sources [5].

Your order never sits in the public queue of pending transactions, so the usual sandwich bots cannot see it [5]. On UniswapX, the filler pays the gas, and a failed fill costs you nothing [6]. For how pools fit into this wider plumbing, see [Automated Market Makers Explained](/guides/automated-market-maker-explained/).

## What actually happens to your order

**Through a pool.** You get a quote from the current balances. Your transaction goes out. Anything that lands before it changes the balances, so your fill is whatever the formula says at that moment. Submitted publicly with a loose tolerance, somebody can wrap your trade and take the difference [10].

**Through an order book.** A market order eats resting offers up the book, so you pay the spread plus whatever depth you consume. A limit order guarantees your price and guarantees nothing about whether it fills.

**Through an intent network.** Your signed order goes into an auction. The winner settles it onchain at or better than your limit, and carries the execution risk [5].

Short version: pools give you certainty of execution, books give you certainty of price, intents give you protection and competition.

## Scenario one: swapping \$250,000 between stablecoins

| Route | What happens | When it is right |
| :--- | :--- | :--- |
| Stable-pair pool | Nearly free if the pool is balanced. Expensive fast if it is 85/15 skewed [3] | Check the balance first. If it is even, this is the cleanest route |
| Order book | Fills against resting depth at 0.9999 or 1.0001. Fine if the depth is real | When the book is deep and you can see it |
| Intent network | Solvers source from exchanges and pools at once, with no public exposure | When the pool is skewed or you want the best of both |

The decision rule: look at the pool's balance before anything else. A stable-pair curve is close to flat when balanced and behaves like an ordinary curve when lopsided [3]. A balanced stable pool is hard to beat. A skewed one will cost you far more than its headline depth suggests.

## Scenario two: selling a large position in a thin token

| Route | What happens | The risk |
| :--- | :--- | :--- |
| Pool | You climb through the liquidity that exists. When it runs out, the cost jumps sharply | Exhausting the active depth and paying for the gap |
| Order book | You can see exactly what you will hit | Shallow bids, or your limit order never filling while the token drops |
| Intent auction | The price starts favourable and walks down until somebody can fill it [6] | Waiting, and the market moving while you do |

For anything large and illiquid, the auction is often the better first try. It lets fillers search every venue without leaving your order sitting in public for somebody to trade against.

## What it is like to provide liquidity in each

This is where the differences matter most.

**In a pool**, you deposit and the contract quotes on your behalf until you withdraw. A tighter range earns more while the price is inside it and goes inactive more often [2]. Because your quote always trails the market, you lose a steady amount to faster traders. Researchers call that cost loss-versus-rebalancing — what a pool gives up for repricing only when someone trades with it [7].

**On an order book**, professionals stream two-sided quotes and cancel them quickly when something changes. That limits how often they are caught on a stale price, at the cost of serious infrastructure and constant attention.

**As a solver**, you hold little inventory. You fill an order and hedge it immediately somewhere else, or match it against somebody wanting the opposite [5].

Theory shows why the mix of traders matters. In a model where informed and uninformed traders each choose a venue, a pool provider's return is the profit from uninformed trading minus the cost of informed trading [8].

That points to a trend worth watching. Intent networks now match many ordinary orders directly, and those matched orders never touch a pool [5]. If that grows, a larger share of the flow left for pools will be arbitrage, which costs providers rather than paying them. Much of that cost is MEV — profit taken by choosing the order in which transactions run [10]. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## Everyone can see your order before it happens

Public chains leak your intentions.

- **A pool swap** shows the size, the pool, and your tolerance setting while it waits to be included. That is everything somebody needs to wrap it [1] [10].
- **An onchain limit order** shows your price and size the moment you post it. You can cancel, unless the network is busy and somebody takes it first.
- **A private relay or an intent** keeps the order out of the public queue until it settles [5] [11].

## The rule worth keeping

- **Use a pool** when you want guaranteed execution on a normal pair with real depth, and you can send it privately or set a tight tolerance.
- **Use an order book** when you want an exact price, deep resting liquidity, or to manage orders actively without paying a curve.
- **Use an intent network** for anything sizeable, when you want competition across venues, no gas on failure, and protection from front-running [6].

Network costs shift the answer too. A study comparing centralised and decentralised venues found that gas fees made decentralised exchanges costly for small trades, while their costs for larger trades were competitive [9]. On a cheap network that small-trade penalty mostly disappears.

This is an engineering trade-off, not a debate about ideology. Judge each route on depth, speed, and who gets to see your order first.

## What to check before you trade

1. **How much depth is within 1% of the price**, in the pool and in the book?
2. **Is the pool balanced**, or will your size push it into the steep part of the curve?
3. **Would an auction beat both**, by searching several venues and charging no gas on failure?
4. **If you supply liquidity, do you understand the flow shift?** Orders matched off the pool never pay its fee.
5. **How are you sending it?** Public queue, matching engine, or private relay?

## Where to watch the numbers

- **How much of a pool's volume is arbitrage:** [EigenPhi](https://eigenphi.io).
- **Where the depth actually sits across venues:** [Dune Analytics](https://dune.com).
- **How solvers are routing real orders:** [CowSwap Explorer](https://explorer.cow.fi).

## When something goes wrong

- **A modest trade cost far more than expected.** There was not enough depth at the price. Route through an auction that can draw on several venues.
- **Your pool position loses money despite heavy volume.** Much of that volume may be arbitrage. Consider a higher fee tier, or a pool whose fee rises with volatility.
- **Market making on an order book is eaten by gas.** Cancellations cost more than the spread earns. Move to a chain built for order books, or one that matches off-chain and settles on-chain.

## Where to go next

The trader's side of the comparison — price impact, meaning the way your own order moves the rate, against slippage, the gap between quote and fill — is worked through in [Slippage and Price Impact](/guides/slippage-and-price-impact/). The provider's side starts with [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/), and you can test whether a pool's fees cover it in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/). The wider system of routers and solvers is described in [Onchain Liquidity](/guides/onchain-liquidity-explained/).

## References

1. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Curve StableSwap Exchange: Overview (Curve Knowledge Hub)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
4. [Order book (Hyperliquid Docs)](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-book)
5. [Intents (CoW Protocol Documentation)](https://docs.cow.fi/cow-protocol/concepts/introduction/intents)
6. [UniswapX Overview (Uniswap Developer Documentation)](https://docs.uniswap.org/contracts/uniswapx/overview)
7. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
8. [Coexisting Exchange Platforms: Limit Order Books and Automated Market Makers (Aoyagi & Ito, 2025)](https://doi.org/10.1086/732831)
9. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
10. [Maximal extractable value (MEV) (ethereum.org)](https://ethereum.org/en/developers/docs/mev/)
11. [MEV Protection Overview (Flashbots Docs)](https://docs.flashbots.net/flashbots-protect/overview)

[1]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview"
[4]: https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-book "Order book (Hyperliquid Docs)"
[5]: https://docs.cow.fi/cow-protocol/concepts/introduction/intents "Intents (CoW Protocol Documentation)"
[6]: https://docs.uniswap.org/contracts/uniswapx/overview "UniswapX Overview"
[7]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[8]: https://doi.org/10.1086/732831 "Coexisting Exchange Platforms: Limit Order Books and Automated Market Makers"
[9]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[10]: https://ethereum.org/en/developers/docs/mev/ "Maximal extractable value (MEV)"
[11]: https://docs.flashbots.net/flashbots-protect/overview "MEV Protection Overview (Flashbots Docs)"
