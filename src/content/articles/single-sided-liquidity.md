---
title: "Single-Sided Liquidity: What One-Sided Provision Really Does"
description: "Depositing one token does not avoid holding two. It changes when the second one arrives and lets you choose the price, a real advantage with a real cost."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Aria Chen"
readTime: "6 min read"
keywords: "single-sided liquidity, one-sided liquidity provision, zap into liquidity pool, single asset deposit, range order conversion, do I need both tokens to provide liquidity"
featured: false
faq:
  - q: "What is single-sided liquidity?"
    a: "A position funded with one asset. In a range-based pool it means placing liquidity entirely above or below the current price, so the deposit converts into the other asset as the market moves through the range. In other designs it means a contract swaps half your deposit for you."
  - q: "Do I need both tokens to provide liquidity?"
    a: "For a standard two-sided pool at the current price, yes. Interfaces that accept one asset either swap part of it first, which costs a fee and price impact, or place the liquidity outside the current price so the conversion happens through trading instead."
  - q: "Is single-sided liquidity safer?"
    a: "It removes the need to hold both assets up front; it does not remove the two-asset exposure. The conversion still happens, just later and through the pool rather than through a swap. The final position carries the same divergence characteristics."
  - q: "What is a zap into a liquidity pool?"
    a: "A contract that takes one asset, swaps the required portion, and mints the position in one transaction. It saves steps and gas, and it charges the swap fee and price impact that any manual route would have paid, sometimes with an additional contract fee."
  - q: "When does a one-sided position stop converting?"
    a: "When price passes the far boundary of the range. At that point the deposit has been fully exchanged for the other asset, the position is out of range, and it stops earning fees until price returns or you re-mint."
---

Depositing one token is usually sold as a way to avoid holding two. It is not. It changes when the second one arrives.

The pool still converts your deposit. It just does it through trading over time instead of through a swap the moment you enter.

Once you see it that way the structure becomes genuinely useful, because a conversion that pays you while it happens beats one that charges you for it.

<figure class="article-figure">
  <img src="/images/guides/single-sided-liquidity.webp" alt="Five-step flow showing a one-sided deposit converting into the other asset as price moves through the range." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A one-sided position is a scheduled conversion that earns fees while it fills. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"The clean way to think about it: you are not avoiding the other token, you are choosing the price at which you buy it. That is a real edge over a market order. It also has a real cost, which is that the market may never come to you, or may come through and keep going."*

## Three different things with the same name

| What it is | What happens | Do you choose the price |
| :--- | :--- | :--- |
| A range on one side of the market | The pool converts your deposit as the price moves through it | Yes, that is the point |
| A zap | A contract swaps the right portion at today's price and mints for you | No, you get today's price |
| A protocol vault taking one asset | Somebody else supplies the other side | No, and you pay them for it |

Only the first gives you control over the conversion price. The other two convert at whatever the market is doing when you press the button.

The first one is the same mechanism as a [range order](/guides/range-orders-on-amms/).

## What the conversion actually looks like

ETH at \$2,400. You deposit \$10,000 of USDC into a range from \$2,200 to \$2,300, entirely below the market.

| | Price | What you hold | What it is doing |
| :--- | ---: | :--- | :--- |
| You mint | \$2,400 | \$10,000 of USDC | Waiting, earning nothing |
| Price falls into your range | \$2,280 | A mix of both | Converting, and earning fees |
| Price falls through | \$2,180 | About 4.44 ETH | Done, earning nothing again |
| Price comes back up | \$2,250 | A mix again | Converting back the other way |

Two things to take from that. You earn fees only while it is converting, which is a nice alignment. And the conversion reverses. If the price comes back up through your range, the pool sells the ETH back for dollars. That is the main difference from a limit order.

## The same conversion, three ways

Converting \$10,000 into ETH with the market at \$2,400.

| How | Average price | Fees paid | Fees earned | You end up with |
| :--- | ---: | ---: | ---: | :--- |
| Swap it now | \$2,404, 0.17% impact | \$5 | \$0 | 4.159 ETH |
| One-sided range, filled | about \$2,250 | \$0 | about \$35 | about 4.44 ETH |
| One-sided range, never filled | none | \$0 | \$0 | Still \$10,000 |

The middle row is what people picture, and it genuinely is better. Lower price, plus fee income.

The bottom row is what that option costs. Not free, because your money sat idle while the market went the other way.

## What it is good for

- **Buying below the market.** Set the band where you would be happy to buy, and get paid fees while the market trades there.
- **Selling above the market.** The same thing in reverse.
- **Avoiding a large market order.** Converting gradually rather than all at once reduces price impact — the way your own order pushes the rate. It also cuts slippage — the gap between the quote you saw and the fill you got. See [Slippage and Price Impact](/guides/slippage-and-price-impact/).
- **Expressing a range view.** You profit from the market coming to you, with no forecast needed beyond that.

## Setting the band, worked

ETH is at \$2,400 and you would happily buy below \$2,250. Here are three ways to place the same \$10,000 of USDC.

| Band | Average price if it fills | How far ETH must fall to fill completely | What it suits |
| :--- | ---: | ---: | :--- |
| \$2,240 to \$2,260 | about \$2,250 | about 7% | Buying at one price, like a limit order |
| \$2,100 to \$2,300 | about \$2,198 | about 13% | Averaging in across a normal pullback |
| \$1,900 to \$2,300 | about \$2,090 | about 21% | Building a position slowly through a deeper fall |

The narrow band gives you the price you named, but only if ETH actually reaches it. The wide band gets you a better average, and asks for a much bigger fall before you own all of it.

## Three things it does not fix

**It does not remove divergence.** Once the conversion is done, you hold a token you bought at an average price inside your band. If the market keeps going, you hold the wrong side exactly as a two-sided position would.

**It does not guarantee a fill.** If the price never arrives, the money sits there earning nothing, and the opportunity cost is invisible because nothing shows up on a screen.

**It does not dodge being picked off.** A zap pays a swap fee up front. A one-sided range earns fees instead, but it tends to fill exactly when fast traders already know the price has moved, so part of its apparent discount is not a discount at all.

See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

## Three choices, none of them forecasts

1. **How far from the market.** Close bands fill often. Distant bands may never fill.
2. **How wide.** A narrow band converts almost all at one price, like a limit order. A wide band averages across a range, which cuts timing risk and thins the fee income.
3. **How big, relative to what is already there.** In a crowded band you get a smaller share of both the fees and the conversion, and it takes longer in real time.

If the conversion matters more than the income, go narrow and treat fees as a rebate. If you want the income, go wider across a plausible trading range.

## Against an actual limit order

They look similar and behave differently in three specific ways.

| | Limit order | One-sided range |
| :--- | :--- | :--- |
| How it fills | At your price or better, once | Gradually across the band |
| Does it pay you while waiting | Sometimes a rebate | Yes, fees while converting |
| What it costs to place | Usually nothing | Gas to mint and to withdraw |
| When it is done | Done. Finished | Still trading, unless you close it |

That last row is the one that bites. A filled limit order is finished. A filled range is a live position, and the conversion you wanted can be undone by a reversal you did not want.

Setting an alert for full conversion, and acting on it, is what turns this into a usable execution tool rather than an accidental market-making position. Gas on both ends reintroduces a minimum size, covered in [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

## What people get wrong about one-sided deposits

| What people assume | What actually happens |
| :--- | :--- |
| I avoid holding the other token | You hold it later, at prices inside your band |
| A zap is single-sided | It is a swap with extra steps, at today's price |
| A filled position is finished | It is still live and will reverse if the price comes back |
| It is lower risk | Same exposure, different timing, plus the risk of never filling |

## Before you place one

1. **Do you actually want the other token** at the prices inside your band? That is the whole trade.
2. **Check what your interface is doing.** A real one-sided range, or a swap dressed up as one?
3. **For a zap, read the route**, the quoted impact, and any extra fee.
4. **Work out what you hold** if the band fills completely.
5. **Set an alert for full conversion**, so a finished position does not sit there for weeks.
6. **Decide now** whether a fill means withdraw, or means leave it exposed to a reversal.
7. **Size the band to how the pair actually moves**, so it is reachable in your timeframe.

This is a scheduling tool, not an exemption from how pools work. Used deliberately, it is one of the few ways to get paid for being patient.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [How Uniswap Works (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)
5. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
6. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
7. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
8. [Gas and Fees (Ethereum Foundation Documentation)](https://ethereum.org/en/developers/docs/gas/)
9. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works"
[5]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[6]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[7]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[8]: https://ethereum.org/en/developers/docs/gas/ "Gas and Fees (Ethereum Foundation Documentation)"
[9]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
