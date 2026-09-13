---
title: "Range Orders on AMMs: How Liquidity Can Express a Price View"
description: "A one-sided deposit works like a limit order that earns fees while it fills. It also un-fills if the price comes back, which is what catches people out."
category: "LP Mechanics"
date: 2026-08-31
lastReviewed: "2026-09-12"
author: "Aria Chen"
readTime: "7 min read"
keywords: "range orders AMM, concentrated liquidity limit order, Uniswap v4 limit hook, Ambient knock-out liquidity, AMM order execution, LVR, range order liquidity, single-sided liquidity, one-sided liquidity provision"
featured: false
faq:
  - q: "What is a range order?"
    a: "A single-asset liquidity position placed entirely above or below the current price, so that price movement through the range converts the deposit into the other asset. It behaves like a limit order that earns fees while it fills."
  - q: "How is a range order different from a limit order?"
    a: "It fills gradually across the range rather than at one price, it earns fees while filling, and it can un-fill if price moves back through the range before you withdraw."
  - q: "What happens after a range order fills?"
    a: "The position sits fully converted and stops earning. Unless you withdraw, a reversal will convert it back, which is the main operational difference from a conventional limit order."
---

You want to sell ETH at \$3,200 but it is trading at \$3,000. On an exchange you would leave a limit order and wait.

There is an equivalent in a pool. Put ETH into a range that sits entirely above the current price, and as the market rises through it, the pool sells your ETH for you. You even collect fees on the way.

It works beautifully, and it has one trap that catches almost everyone the first time. This guide covers how it fills, exactly what price you get, the trap, and the three designs that fix it.

<figure class="article-figure">
  <img src="/images/guides/range-orders-on-amms.webp" alt="One asset transforms into another as price moves through a bounded corridor." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A bounded position can express a conditional exchange range. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"The catch is that it is reversible. A limit order on a normal exchange executes and the tokens are yours. A range order stays in the pool. If the price crosses your range and comes back, your completed sale is undone and you are holding the original token again. Withdraw the moment it fills, or use a design that locks it."*

## How a one-sided deposit works

Normally a pool makes you deposit both tokens in the ratio it currently holds. Range-based pools do not, as long as your range sits entirely on one side of the current price [1].

Put a range above the market and you deposit only the risky token. The pool has no reason to hold any dollars up there yet [2]. Put it below and you deposit only the quote token.

Then the market does the work. As the price rises into your range, traders buy your ETH and leave dollars behind. By the time it passes your upper bound, the conversion is complete.

## The price you actually get

Not the top of your range. Not the bottom. The geometric mean of the two:

$$
\bar{P} = \sqrt{P_l \cdot P_u}
$$

Where:

- $P_l$ is the bottom of your range.
- $P_u$ is the top.
- $\bar{P}$ is the average price your fill actually achieved.

Put numbers on it. A range from \$3,100 to \$3,300 fills at about \$3,198, not \$3,300. Set the range wide and you will be disappointed by the average.

So the width is the whole decision. A narrow range of one or two steps fills at almost exactly the price you wanted. A wide range spreads the fill across the whole move.

One genuine advantage over a limit order: you are the maker here, so you pay no taker fee and you collect fees from everyone trading through you while it fills [2] [4]. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## The trap

Here is the part nobody warns you about.

| What happens | A limit order on an exchange | A range order in a pool |
| :--- | :--- | :--- |
| Price crosses your level | Fills, settles, done | Fills, and stays in the pool |
| Price comes back | Nothing. You have the money | It fills back the other way |
| You need to do something | No | Yes, withdraw, immediately |

When your range order completes, it does not disappear. It becomes an ordinary out-of-range position, still live in the contract. If the price comes back down through your range, the pool sells your dollars and buys the ETH back, at prices you did not choose [2] [3].

So a range order is only equivalent to a limit order if you withdraw the moment it fills. In practice that means a bot watching for the crossing, or one of the designs below.

## Three ways to make it stick

### Code that settles it inside the transaction

Uniswap v4 lets a pool attach code that runs after each swap [3]. A limit-order hook registers your order, watches for the price crossing your level, and then claims your converted tokens and closes the position in the very same transaction that crossed it.

Because it settles atomically, nothing later in that block or any block after can reverse it.

### A protocol that locks it natively

Ambient builds this into its core contract as knock-out liquidity [6]. Your position comes with a direction. Once the price fully crosses it, the protocol locks the position against trading backwards. Your converted tokens sit safely until you claim them, with no bot and no race.

### Skipping the pool entirely

Intent systems like UniswapX and CoW Swap take a different route [7]. You sign a message saying what you want and by when. Solvers compete to fill it, using their own inventory, pool routes, or a match with somebody wanting the opposite trade.

Nothing is locked up, placing it costs no gas, and there is nothing to reverse. See [AMM vs Order Book](/guides/amm-vs-order-book/).

| | Plain range order | v4 limit hook | Knock-out liquidity | Intent auction |
| :--- | :--- | :--- | :--- | :--- |
| Can it reverse | Yes, unless you withdraw fast | No, settled in the same transaction | No, locked on crossing | No, filled once |
| Cost to place | A normal transaction | A normal transaction | A normal transaction | Nothing, just a signature |
| Do you earn fees | Yes, while filling | Yes, until it fills | Yes, until it knocks out | No |
| Where your money sits | In the pool | In the pool contract | In the protocol | In your wallet until it fills |

## Why passive orders fill at the wrong moments

There is an uncomfortable pattern here worth understanding before you rely on this.

A resting order gets filled when somebody wants to trade against it. On a fast-moving market, the people who want to trade against a stale price are the ones who already know the price has moved [4] [8].

So the sequence goes: news breaks, the price jumps on a fast exchange, and arbitrage traders sweep your resting order at the old price before you could possibly react. Your sell filled, at a price that was already wrong.

And the reverse also holds. If the price approaches your level and bounces without crossing, you do not get filled at all, even though that was the favourable outcome.

Put bluntly: these orders fill systematically when it suits somebody else, and sit unfilled when it would have suited you. That cost is loss-versus-rebalancing — what a pool pays out for quoting a block late — and it applies to range orders exactly as it does to ordinary positions [8].

## Two things people actually use this for

### Bidding for a discounted stablecoin

A stable token trades at \$0.999 and you expect a brief liquidity squeeze to push it lower. Place a one-sided range below the price, between \$0.9975 and \$0.9985, funded with the other dollar token, and you are bidding for the discount. If the price dips through it, you convert fully into the discounted token and keep the fees, and if the peg then recovers you hold a token bought below par [2].

The risk is obvious and severe. If that discount is the market correctly pricing insolvency rather than a temporary squeeze, you have just bought all of it.

### Selling a treasury position gradually

A project wants to diversify out of its own token without crashing it. With the token trading below \$10, a wide one-sided range from \$10 to \$15 turns the treasury into a patient seller [1]. Demand absorbs the tokens over time, the treasury accumulates dollars, and it earns fees the whole way.

Here the wide range is the point rather than a mistake, because the goal is gradual execution rather than a single price.

## What people get wrong about range orders

| What people assume | What actually happens |
| :--- | :--- |
| It fills at my target price | It fills at the geometric mean of the two bounds, which is lower than the top |
| Once it fills, I am done | It stays in the pool and reverses if the price comes back |
| It is a free limit order that pays me | The fees are real, and the adverse selection usually costs more |
| A wide range is more likely to fill | It is, and it fills at a much worse average price |

## What to check before you place one

1. **Which design are you using?** A plain range order needs a bot. A hook or a knock-out position does not.
2. **Does your range fit the pool's step size?** Bounds have to line up with the pool's own increments.
3. **Will the fees cover the adverse selection** — the pattern where the people trading with you already know the price moved? Usually not, on a volatile pair over a short window.
4. **If you need to withdraw manually, can you actually do it in the next block?** If not, assume the order will reverse at some point.
5. **Would an intent order be better?** No lock-up, no gas to place, no reversal, and no bot to run.

## Where to watch the numbers

- **Whether your position has crossed, and fees earned:** [Revert Finance](https://revert.finance).
- **Automatic withdrawal on a full crossing:** [Aperture Finance](https://aperture.finance).
- **How close the price is to your bounds:** [Dune Analytics](https://dune.com).

## When something goes wrong

- **The price crossed but you are only half filled.** It touched your range and turned around before going all the way through. Decide whether to keep the partial position or take the mixed balance.
- **It filled and then un-filled.** The price came back before you withdrew. Automate it, or use a design that locks on crossing.
- **It is earning a lot of fees while slowly filling.** The price is oscillating across your range. That is the good case. Collect the fees and let it work.

## Where to go next

A range order is a deliberate out-of-range position, so everything in [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) applies. For simply taking the price instead, and paying price impact — the way your order moves the rate — plus slippage, the gap between quote and fill, see [Slippage and Price Impact](/guides/slippage-and-price-impact/). The one-sided case is developed further in [Single-Sided Liquidity](/guides/single-sided-liquidity/).

## References

1. [Uniswap v3 Core Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
2. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
3. [Uniswap v4 Core Whitepaper](https://uniswap.org/whitepaper-v4.pdf)
4. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
5. [Trading Fast and Slow: Colocation and Liquidity (Brogaard et al., 2015)](https://doi.org/10.1093/rfs/hhv045)
6. [Knockout Liquidity (Ambient Documentation)](https://docs.ambient.finance/concepts/knockout-liquidity)
7. [CoW Protocol Documentation](https://docs.cow.fi/)
8. [An Analysis of Uniswap v3: Loss-Versus-Rebalancing and Market Microstructure](https://arxiv.org/abs/2208.06046)
9. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
10. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[3]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[4]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[5]: https://doi.org/10.1093/rfs/hhv045 "Trading Fast and Slow: Colocation and Liquidity (Brogaard et al., 2015)"
[6]: https://docs.ambient.finance/concepts/knockout-liquidity "Knockout Liquidity (Ambient Documentation)"
[7]: https://docs.cow.fi/ "CoW Protocol Documentation"
[8]: https://arxiv.org/abs/2208.06046 "An Analysis of Uniswap v3: Loss-Versus-Rebalancing and Market Microstructure"
[9]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[10]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
