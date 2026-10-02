---
title: "Single-Sided Liquidity: What One-Sided Provision Really Does"
description: "Depositing one token does not avoid holding two. It changes when the second one arrives and lets you choose the price, a real advantage with a real cost."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "single-sided liquidity"
keywords: "single-sided liquidity, one-sided liquidity provision, zap into liquidity pool, single asset deposit, range order conversion, do I need both tokens to provide liquidity"
featured: false
faq:
  - q: "What is single-sided liquidity?"
    a: "A position funded with one asset. In a range-based pool it means placing liquidity entirely above or below the current price, so the deposit converts into the other asset as the market moves through the range. In other designs it means a contract or the pool itself swaps part of your deposit for you."
  - q: "Do I need both tokens to provide liquidity?"
    a: "For a standard two-sided position at the current price, yes. Interfaces that accept one asset either swap part of it first, which costs a fee and price impact, or place the liquidity outside the current price so the conversion happens through trading instead."
  - q: "Is single-sided liquidity safer?"
    a: "It removes the need to hold both assets up front; it does not remove the two-asset exposure. The conversion still happens, just later and through the pool rather than through a swap. Once it starts converting, the position carries the same divergence from holding as any range position."
  - q: "What is a zap into a liquidity pool?"
    a: "A contract that takes one asset, swaps the required portion, and mints the position in one transaction. It saves steps, and it pays the swap fee and price impact that any manual route would have paid, sometimes with an additional contract fee."
  - q: "When does a one-sided position stop converting?"
    a: "When price passes the far boundary of the range. At that point the deposit has been fully exchanged for the other asset, the position is out of range, and it stops earning fees until price returns or you withdraw and place a new position."
---

Depositing one token is often sold as a way to avoid holding two. It is not. It changes when the second one arrives.

The pool still converts your deposit. It just does it through trading over time, instead of through a swap the moment you enter.

Seen that way, the structure is useful, because a conversion that pays you fees while it happens beats one that charges you for it. By the end you will be able to tell the three products sold under this name apart, and set a band that converts at a price you chose.

<figure class="article-figure">
  <img src="/images/guides/single-sided-liquidity.webp" alt="Five-step flow showing a one-sided deposit converting into the other asset as price moves through the range." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A one-sided position is a scheduled conversion that earns fees while it fills. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> The clean way to think about it: you are not avoiding the other token, you are choosing the price at which you buy it. That is a real edge over a market order. It also has a real cost, which is that the market may never come to you, or may come through and keep going.

## Three different things with the same name

| What it is | What happens | Do you choose the price |
| :--- | :--- | :--- |
| A range on one side of the market | The pool converts your deposit as the price moves through it | Yes, that is the point |
| A zap | A contract swaps the right portion at today's price and mints for you | No, you get today's price |
| A single-token join into a weighted or stable pool | The pool treats it as a balanced deposit plus an internal swap | No, and the swapped part pays the swap fee |

Only the first gives you control over the conversion price. The other two convert at whatever the market is doing when you press the button.

The first works because a range-based pool only asks for the token it would actually need. A range above the current price can only ever be bought into, so it holds just the risky token; a range below holds just the quote token [1]. It is the same mechanism as a [range order](/guides/range-orders-on-amms/).

The third is easy to mistake for the first. Balancer, for example, accepts a deposit of one token, but its documentation describes that as a proportional deposit combined with a swap, and requires the swap fee on it to be no lower than on a direct swap [2].

## What the conversion actually looks like

ETH is at \$2,400. You deposit \$10,000 of USDC into a range from \$2,200 to \$2,300, entirely below the market.

| | ETH price | What you hold | Worth, against \$10,000 cash | What it is doing |
| :--- | ---: | :--- | ---: | :--- |
| You mint | \$2,400 | \$10,000 of USDC | \$10,000 | Waiting, earning nothing |
| Price falls into your range | \$2,280 | About \$8,018 USDC and 0.87 ETH | About \$9,991 | Converting, and earning fees |
| Price falls through | \$2,180 | About 4.45 ETH | About \$9,691 | Done, earning nothing again |
| Price comes back up | \$2,250 | About \$5,028 USDC and 2.19 ETH | About \$9,946 | Converting back the other way |

The values exclude fees. Two things to take from the table. You earn fees only while it is converting, which is a useful alignment. And the conversion reverses. If the price comes back up through your range, the pool sells the ETH back for dollars [1]. That is the main difference from a limit order.

The ETH you end with also gives your average purchase price: \$10,000 divided by the 4.4455 ETH you receive is about \$2,249. That is the geometric mean of the two bounds, the square root of \$2,200 times \$2,300, not the simple midpoint.

## The same conversion, three ways

Converting \$10,000 into ETH with the market at \$2,400. For the swap, assume a 0.05% pool fee and 0.17% price impact — how far your own order moves the rate.

| How | Average price | Fees paid | Fees earned | You end up with |
| :--- | ---: | ---: | ---: | :--- |
| Swap it now | about \$2,404 | \$5 | \$0 | about 4.158 ETH |
| One-sided range, filled | about \$2,249 | \$0 | Some, set by volume through the band | about 4.45 ETH, plus fees |
| One-sided range, never filled | none | \$0 | \$0 | Still \$10,000 of USDC |

The middle row is what people picture, and it is better: a lower price, plus fee income. But it needed ETH to fall about 8% first, and the two rows are not compared at the same moment.

The bottom row is what that option costs. Your money sat idle while the market went the other way, and you own no ETH at all.

## What it is good for

- **Buying below the market.** Set the band where you would be happy to buy, and get paid fees while the market trades there.
- **Selling above the market.** The same thing in reverse.
- **Avoiding a large market order.** Converting gradually rather than all at once reduces price impact, and with it slippage — the gap between the quote you saw and the fill you got [3]. See [Slippage and Price Impact](/guides/slippage-and-price-impact/).
- **Expressing a range view.** You profit from the market coming to you, with no forecast needed beyond that.

## Setting the band, worked

ETH is at \$2,400 and you would happily buy below \$2,250. Here are three ways to place the same \$10,000 of USDC.

| Band | Average price if it fills | How far ETH must fall to fill completely | What it suits |
| :--- | ---: | ---: | :--- |
| \$2,240 to \$2,260 | about \$2,250 | about 6.7% | Buying at one price, like a limit order |
| \$2,100 to \$2,300 | about \$2,198 | 12.5% | Averaging in across a normal pullback |
| \$1,900 to \$2,300 | about \$2,090 | about 20.8% | Building a position slowly through a deeper fall |

The narrow band gives you the price you named, but only if ETH actually reaches it. The wide band gets you a lower average, and asks for a much bigger fall before you own all of it.

Width also changes the fee side. The same deposit spread over a wider band is thinner at each price, so it earns less per trade but stays in play across more of the move. Research on range choice frames exactly this trade-off: narrow ranges earn more while price stays inside and less once it leaves [4].

## Three things it does not fix

**It does not remove divergence.** Once the conversion is done, you hold a token you bought at an average price inside your band. If the market keeps going, you hold the falling side exactly as a two-sided position would. In the example above, the filled position is worth about \$9,691 at \$2,180, against \$10,000 if you had kept the cash.

**It does not guarantee a fill.** If the price never arrives, the money sits there earning nothing, and the opportunity cost is easy to miss because nothing shows up on a screen.

**It does not avoid being picked off.** A zap pays a swap fee up front. A one-sided range earns fees instead, but it tends to fill when arbitrageurs — traders who close gaps between the pool and other markets — already know the price has moved. Researchers measure that cost as loss-versus-rebalancing — the shortfall of a pool position against rebalancing the same holdings at market prices [5]. Part of the apparent discount is not a discount at all.

[Out-of-Range Liquidity](/guides/out-of-range-liquidity/) covers what a fully converted position is worth while it waits.

## Three choices, none of them forecasts

1. **How far from the market.** Close bands fill often. Distant bands may never fill.
2. **How wide.** A narrow band converts almost all at one price, like a limit order. A wide band averages across a range, which cuts timing risk and thins the fee income.
3. **How big, relative to what is already there.** In a crowded band you get a smaller share of both the fees and the conversion, so it takes longer in real time.

If the conversion matters more than the income, go narrow and treat fees as a rebate. If you want the income, go wider across a plausible trading range.

## How it compares with a limit order

They look similar and behave differently in four specific ways.

| | Limit order | One-sided range |
| :--- | :--- | :--- |
| How it fills | At your price or better, once | Gradually across the band |
| Does it pay you while waiting | Sometimes a maker rebate | Yes, fees while converting |
| What it costs to place | Usually nothing | Gas to mint and to withdraw |
| When it is done | Finished | Still trading, unless you close it |

The last row matters most. A filled limit order is finished. A filled range is a live position, and the conversion you wanted can be undone by a reversal you did not want [6].

Setting an alert for full conversion, and acting on it, is what turns this into a usable execution tool rather than an accidental market-making position. Gas on both ends — the network fee each transaction pays [7] — sets a minimum size below which this stops making sense, covered in [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

## Before you place one

1. **Do you actually want the other token** at the prices inside your band? That is the whole trade.
2. **Check what your interface is doing.** A real one-sided range, or a swap presented as one?
3. **For a zap, read the route**, the quoted impact, and any extra fee.
4. **Work out what you hold** if the band fills completely. The [Uniswap v3 liquidity calculator, preset to the \$2,200–\$2,300 example](/tools/uniswap-v3-liquidity-calculator/#price=2400&lower=2200&upper=2300&capital=10000&exit=2180&tier=0.0005), shows the full conversion.
5. **Set an alert for full conversion**, so a finished position does not sit there for weeks.
6. **Decide now** whether a fill means withdraw, or means leave it exposed to a reversal.
7. **Size the band to how the pair actually moves**, so it is reachable in your timeframe.

## Where to go next

This is a scheduling tool, not an exemption from how pools work; used deliberately, it is one of the few ways to get paid for being patient. If you want the resting-order version with ways to stop it reversing, read [Range Orders on AMMs](/guides/range-orders-on-amms/) next.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Liquidity invariant approximation (Balancer Documentation)](https://docs.balancer.fi/concepts/vault/liquidity-invariant-approximation.html)
3. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
4. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
5. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
6. [Understanding Range Orders (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/range-orders)
7. [Ethereum gas and fees: technical overview (ethereum.org)](https://ethereum.org/en/developers/docs/gas/)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://docs.balancer.fi/concepts/vault/liquidity-invariant-approximation.html "Liquidity invariant approximation (Balancer Documentation)"
[3]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[4]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[5]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[6]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/range-orders "Understanding Range Orders (Uniswap Developer Documentation)"
[7]: https://ethereum.org/en/developers/docs/gas/ "Ethereum gas and fees: technical overview (ethereum.org)"
