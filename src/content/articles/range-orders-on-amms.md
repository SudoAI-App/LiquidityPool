---
title: "Range Orders on AMMs: How Liquidity Can Express a Price View"
description: "A one-sided deposit works like a limit order that earns fees while it fills. It also un-fills if the price comes back, which is what catches people out."
category: "LP Mechanics"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "9 min read"
primaryQuery: "range orders AMM"
keywords: "range orders AMM, concentrated liquidity limit order, Uniswap v4 limit hook, Ambient knock-out liquidity, AMM order execution, LVR, range order liquidity"
featured: false
faq:
  - q: "What is a range order?"
    a: "A single-asset liquidity position placed entirely above or below the current price, so that price movement through the range converts the deposit into the other asset. It behaves like a limit order that earns fees while it fills."
  - q: "How is a range order different from a limit order?"
    a: "A limit order rests unfilled until price touches it, then settles at your price. A range order is live liquidity across a band: it fills gradually as price crosses, at the geometric mean of the two bounds, earns fees while it fills, and converts back if price returns through the band before you withdraw."
  - q: "What happens after a range order fills?"
    a: "The position sits fully converted and stops earning. Unless you withdraw, a reversal will convert it back, which is the main operational difference from a conventional limit order."
  - q: "Can I place a stop-loss with a range order?"
    a: "No. In a Uniswap-style pool the band above the current price can only hold the risky token and the band below can only hold the quote token. So you can sell above the market or buy below it, but you cannot sell below it or buy above it."
---

You want to sell ETH at \$3,200 but it is trading at \$3,000. On an exchange you would leave a limit order and wait.

There is an equivalent in a pool. Put ETH into a range that sits entirely above the current price, and as the market rises through it, the pool sells your ETH for you. You even collect fees on the way.

It works, but it has one trap that catches most people the first time. By the end you will know what price you actually get, how the trap works, and which of three designs removes it.

<figure class="article-figure">
  <img src="/images/guides/range-orders-on-amms.webp" alt="One asset transforms into another as price moves through a bounded corridor." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A bounded position can express a conditional exchange range. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> The catch is that it is reversible. A limit order on a normal exchange executes and the tokens are yours. A range order stays in the pool. If the price crosses your range and comes back, your completed sale is undone and you are holding the original token again. Withdraw the moment it fills, or use a design that locks it.

## How a one-sided deposit works

Normally a pool makes you deposit both tokens in the ratio it currently holds. Range-based pools do not, as long as your range sits entirely on one side of the current price [1].

Put a range above the market and you deposit only the risky token. The pool has no reason to hold any dollars up there yet [2]. Put it below and you deposit only the quote token. The same one-sided placement exists on Solana's tick-based CLMMs — see [Raydium Liquidity Pools](/guides/raydium-clmm-liquidity-guide/).

Then the market does the work. As the price rises into your range, traders buy your ETH and leave dollars behind. By the time it passes your upper bound, the conversion is complete.

That geometry also limits which orders you can place. Above the price you can only sell the risky token; below it you can only buy it. A stop-loss (selling below the market) or a buy-stop (buying above it) cannot be built this way [2].

## The price you actually get

Not the top of your range, and not the bottom. Your fill averages out at the geometric mean of the two bounds, which always sits a little below their simple midpoint.

$$
\bar{P} = \sqrt{P_l \cdot P_u}
$$

Where:

- $P_l$ is the bottom of your range.
- $P_u$ is the top.
- $\bar{P}$ is the average price your whole fill achieves.

Put numbers on it. You deposit 1 ETH in a range from \$3,100 to \$3,300. Once the price passes \$3,300 you hold about 3,198 USDC plus fees, an average of \$3,198, not \$3,300. The [concentrated liquidity calculator preset for this order](/tools/uniswap-v3-liquidity-calculator/#price=3000&lower=3100&upper=3300&capital=3000&exit=3400&tier=0.003) shows the same conversion: zero ETH and about \$3,198 of USDC at the upper bound.

So the width is the whole decision. Bounds must sit on the pool's tick spacing — the fixed price step a range edge can snap to. In a 0.3% Uniswap v3 pool one step is about 0.6% [1], so a one-step range starting at \$3,200 ends near \$3,219 and fills at about \$3,210. A wide range spreads the fill across the whole move.

One genuine advantage over a limit order: you are providing liquidity, not taking it. You pay no trading fee on the conversion, and you collect the pool's fee from every trade that runs through your range while it fills [2]. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## Why a filled range order can un-fill

This is the difference that matters most in practice.

| What happens | A limit order on an exchange | A range order in a pool |
| :--- | :--- | :--- |
| Price crosses your level | Fills, settles, done | Fills, and stays in the pool |
| Price comes back | Nothing. You have the money | It fills back the other way |
| You need to do something | No | Yes, withdraw promptly |

When your range order completes, it does not disappear. It becomes an ordinary out-of-range position, still live in the contract. If the price comes back down through your range, the pool sells your dollars and buys the ETH back, at the same band of prices, unless you have withdrawn first [1] [2].

So a range order matches a limit order only if you withdraw once it fills. Uniswap's own documentation says as much: watch the order and remove it yourself, or use a third-party position manager to do it for you [2]. The designs below remove the need.

## Three ways to make it stick

### Code that settles it inside the transaction

Uniswap v4 lets a pool attach hooks — small contracts that run at fixed points such as just after each swap. Its whitepaper lists on-chain limit orders that fill at tick prices as one intended use [3]. A limit-order hook records your order, sees the swap that crossed your level, and pulls your liquidity out in that same transaction.

Because the removal is atomic, nothing later in the block can trade it back. You claim the converted tokens when you like. The limits are practical: it only works in a pool created with that hook, and you are trusting the hook's code with your deposit.

### A protocol that locks it natively

Ambient builds this into its core contract as knockout liquidity [4]. You mark the position as a bid below the price or an ask above it. Once the price moves fully through the range, the protocol removes the liquidity atomically and permanently, so the fill cannot reverse.

Two caveats from Ambient's own documentation. Every knockout order in a pool has the same, usually narrow, width. And a partly crossed knockout can still convert back if price retreats before reaching the far edge [4].

### Skipping the pool entirely

Intent systems like UniswapX and CoW Swap take a different route [5]. An intent is a signed message saying what you want and by when. Solvers — third parties competing to fill orders — fill it from their own inventory, from pool routes, or by matching you with somebody who wants the opposite trade.

Nothing is locked up, signing costs no gas, and there is nothing to reverse. You do give up the fees a range order earns. See [AMM vs Order Book](/guides/amm-vs-order-book/).

| | Plain range order | v4 limit hook | Knockout liquidity | Intent auction |
| :--- | :--- | :--- | :--- | :--- |
| Can it reverse | Yes, unless you withdraw | No, removed in the crossing transaction | Not once fully crossed | No, filled once |
| Cost to place | A normal transaction | A normal transaction | A normal transaction | A signature (a token approval may be needed once) |
| Do you earn fees | Yes, while filling | Yes, until it fills | Yes, until it knocks out | No |
| Where your money sits | In the pool | In the v4 pool manager, via the hook | In the protocol | In your wallet until it fills |

## Why passive orders fill at the wrong moments

There is a pattern here worth understanding before you rely on any resting order.

A resting order gets filled when somebody wants to trade against it. On a fast-moving market, the traders most eager to hit a stale price are arbitrageurs — traders who profit from the gap between a pool's price and the wider market. They compete to be first to trade on that gap [6].

The sequence goes like this. News breaks, the price jumps on a centralized exchange, and arbitrageurs sweep your resting order at the old price before you could react. Your sell filled at a price that was already out of date.

The reverse also holds. If the price approaches your level and bounces without crossing, you do not get filled at all, even though that was the outcome you wanted.

So these orders tend to fill when the move continues and stay unfilled when it reverses. Researchers measure this cost as loss-versus-rebalancing (LVR): the shortfall of a pool position against a trader who rebalances the same holdings at market prices [7]. It applies to range orders exactly as it does to ordinary positions.

## Two things people actually use this for

### Bidding for a discounted stablecoin

A stable token trades at \$0.999 and you expect a brief liquidity squeeze to push it lower. You place a one-sided range below the price, from \$0.9975 to \$0.9985, funded with the other dollar token. If the price dips through it, you convert fully at an average of about \$0.9980 and keep the fees. If the peg then recovers, you hold a token bought below par.

The risk sits in the reason for the discount. If the market is correctly pricing a solvency problem rather than a temporary squeeze, your order buys the full amount of a token that may not recover.

### Selling a treasury position gradually

A project wants to diversify out of its own token without pushing the price down hard. With the token trading below \$10, a wide one-sided range from \$10 to \$15 turns the treasury into a patient seller. Demand absorbs the tokens over time, the treasury accumulates dollars at an average of about \$12.25 if the whole range is crossed, and it earns fees the whole way.

Here the wide range is the point rather than a mistake, because the goal is gradual execution rather than a single price.

## What to check before you place one

1. **Which design are you using?** A plain range order needs you or a bot to withdraw. A hook or a knockout position does not.
2. **Does your range fit the pool's tick spacing?** Bounds snap to the pool's own price steps, which sets how narrow the order can be.
3. **Will the fees cover adverse selection** — the tendency for the traders filling you to already know the price has moved? On a volatile pair over a short window, often not.
4. **If you need to withdraw manually, can you do it promptly?** If not, plan on the order reversing at some point.
5. **Would an intent order fit better?** No lock-up, no gas to sign, no reversal, and no bot to run, at the cost of the fees.

## Where to watch the numbers

- **Whether your position has crossed, and fees earned:** [Revert Finance](https://revert.finance).
- **Automatic withdrawal on a full crossing:** [Aperture Finance](https://aperture.finance).
- **How close the price is to your bounds:** [Dune Analytics](https://dune.com).

## When something goes wrong

- **The price crossed but you are only half filled.** It entered your range and turned around before going all the way through. Decide whether to keep the partial position or withdraw the mixed balance.
- **It filled and then un-filled.** The price came back before you withdrew. Automate the withdrawal, or use a design that locks on crossing.
- **It is earning a lot of fees while slowly filling.** The price is oscillating inside your range. That is the favourable case; collect the fees and let it work.

## Where to go next

A range order is a deliberate out-of-range position, so [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) covers what it is worth while it waits. If you would rather take the price now, [Slippage and Price Impact](/guides/slippage-and-price-impact/) explains the two costs of a market order instead — price impact (how far your own trade moves the rate) and slippage (the gap between quote and fill). [Single-Sided Liquidity](/guides/single-sided-liquidity/) covers the other one-sided deposit designs.

## References

1. [Uniswap v3 Core Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
2. [Understanding Range Orders (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/range-orders)
3. [Uniswap v4 Core Whitepaper](https://uniswap.org/whitepaper-v4.pdf)
4. [Knockout Liquidity (Ambient Documentation)](https://docs.ambient.finance/concepts/knockout-liquidity)
5. [CoW Protocol Documentation](https://docs.cow.fi/)
6. [Maximal extractable value (MEV) (ethereum.org)](https://ethereum.org/en/developers/docs/mev/)
7. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/range-orders "Understanding Range Orders (Uniswap Developer Documentation)"
[3]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[4]: https://docs.ambient.finance/concepts/knockout-liquidity "Knockout Liquidity (Ambient Documentation)"
[5]: https://docs.cow.fi/ "CoW Protocol Documentation"
[6]: https://ethereum.org/en/developers/docs/mev/ "Maximal extractable value (MEV) (ethereum.org)"
[7]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
