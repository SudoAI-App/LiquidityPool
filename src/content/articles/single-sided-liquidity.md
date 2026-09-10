---
title: "Single-Sided Liquidity: What One-Sided Provision Really Does"
description: "Single-sided and one-sided liquidity provision explained: what the pool converts, when the exposure arrives, and why a zap is a swap with extra steps."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Aria Chen"
readTime: "11 min read"
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

Single-sided provision is often presented as a way to avoid holding a pair. It is more accurate to say it changes when the pair arrives. The pool still converts your deposit; the conversion simply happens through trading over time rather than through a swap at the moment of entry.

Once that is clear, the structure becomes genuinely useful, because a conversion that pays you while it happens is better than one that charges you for it.

<figure class="article-figure">
  <img src="/images/guides/single-sided-liquidity.webp" alt="Five-step flow showing a one-sided deposit converting into the other asset as price moves through the range." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A one-sided position is a scheduled conversion that earns fees while it fills. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"The clean way to think about it: you are not avoiding the other asset, you are choosing the price at which you acquire it. That is a real advantage over a market swap, and it comes with a real cost, which is that the market may never reach your range, or may pass through and keep going."*

## 1. Two Different Things Called Single-Sided

The phrase covers structures that behave differently.

**A range position placed entirely on one side of the current price.** You deposit only the base asset above the price, or only the quote asset below it. As price moves into and through your range, the invariant exchanges your deposit for the other asset. This is native to concentrated liquidity and is the same mechanism as a [range order](/guides/range-orders-on-amms/).

**A zap.** A router contract accepts one asset, swaps the appropriate portion at the current price, and mints a two-sided position in one transaction. Convenient, and functionally identical to doing the swap yourself, plus whatever the router charges.

**Protocol-level single-sided vaults.** Some designs accept one asset and pair it internally, either against protocol-owned liquidity or against a counterparty deposit. The exposure does not vanish; it is transferred to whoever supplies the other side, usually in exchange for a share of fees or a fee on withdrawal.

Only the first gives you control over the conversion price. The other two convert at the market price at the moment of entry.

---

## 2. The Mechanics of the Conversion

Take a position on ETH/USDC with spot at 2,400, funded with 10,000 USDC placed in a range from 2,200 to 2,300, entirely below the current price.

| Stage | Spot | Position holds | Status |
| :--- | ---: | :--- | :--- |
| Mint | 2,400 | 10,000 USDC | Out of range, waiting |
| Price falls into range | 2,280 | Mixed USDC and ETH | In range, earning fees |
| Price exits below | 2,180 | roughly 4.44 ETH | Converted, no longer earning |
| Price recovers into range | 2,250 | Mixed again | Converting back |

Two features matter. The position earns fees only while price is inside the band, which is exactly while it is converting. And the conversion is reversible: if price re-enters the range from below, the pool sells the ETH back for USDC, which is the main behavioural difference from a limit order.

### The same conversion, priced two ways

Compare converting \$10,000 of USDC into ETH at a spot price of 2,400.

| Route | Average price achieved | Fees paid | Fees earned | Net position |
| :--- | ---: | ---: | ---: | :--- |
| Market swap now | 2,404 (0.17% impact) | \$5 | \$0 | 4.159 ETH |
| One-sided range 2,200 to 2,300 | roughly 2,250 if filled | \$0 | roughly \$35 | roughly 4.44 ETH |
| One-sided range, never filled | none | \$0 | \$0 | Still \$10,000 USDC |

The middle row is the case people have in mind, and it is genuinely better: a lower average price plus fee income. The third row is the cost of that option, and it is not free, because the capital sat idle while the market moved away.

---

## 3. What It Is Good For

- **Accumulating an asset below the market.** You set the price band at which you are willing to buy, and you are paid fees while the market trades there.
- **Distributing an asset above the market.** The same in reverse, converting a holding into the quote asset across a chosen band.
- **Avoiding an entry swap.** For large deposits, converting through trading rather than through a single market order can reduce price impact, an effect covered in [Slippage and Price Impact](/guides/slippage-and-price-impact/).
- **Expressing a range view without leverage.** The position profits from movement into the band and does not require a directional forecast beyond it.

---

## 4. What It Does Not Solve

Three claims deserve correcting.

**It does not remove divergence.** Once the conversion completes, you hold an asset acquired at an average price inside the band. If the market keeps moving, you hold the losing side of the trade in exactly the way a two-sided position would.

**It does not guarantee the fill.** If price never reaches the range, the position sits idle earning nothing, with the capital committed and the opportunity cost invisible.

**It does not avoid the fee.** A zap pays the swap fee and price impact immediately. A one-sided range pays it implicitly, by converting at prices inside the band rather than at the best available price.

The bounded outcomes are the same ones described in [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

---

## 5. Sizing and Placement

Three parameters decide the outcome, and all three are choices rather than forecasts.

1. **Distance from the current price.** Closer bands fill sooner and more often; distant bands may never fill.
2. **Band width.** A narrow band converts almost entirely at one price, behaving like a limit order. A wide band averages the conversion across a range of prices, which reduces timing risk and dilutes fee density.
3. **Size relative to band liquidity.** In a crowded band your share of both fees and conversion is proportionally smaller, and the fill takes longer in wall-clock terms.

For pairs where the conversion matters more than the fee income, prefer the narrow band and treat fees as a rebate. For pairs where you want the fee income, a wider band around a plausible trading range performs better.

### Comparing a one-sided range against a limit order

The two structures look similar and behave differently in three specific ways.

A limit order on an order book fills at your price or better, once, and stays filled. A one-sided range fills gradually across the band, pays you fees while filling, and unfills if price returns through the range before you withdraw. The averaging is an advantage when you have no view on the exact price and a disadvantage when you do.

The second difference is cost. A resting limit order costs nothing until it fills, and typically pays a maker rebate on venues that offer one. A one-sided range costs gas to mint and to withdraw, which reintroduces the minimum position size discussed in [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

The third is certainty. A filled limit order is done. A filled range is a position that keeps trading unless you close it, which means the conversion you wanted can be undone by a reversal you did not want. Setting an alert for full conversion, and acting on it, is what turns the structure into a usable execution tool rather than an accidental market-making position.

---

## 6. Operational Checklist

- [ ] Decide whether you actually want the other asset at the prices inside your band. That is the trade.
- [ ] Confirm whether your interface is placing a true one-sided range or performing a zap swap.
- [ ] For a zap, check the swap route, the price impact quoted, and any router fee.
- [ ] Compute the quantity you will hold if the band fills completely.
- [ ] Set an alert for full conversion, so a filled position does not sit idle for weeks.
- [ ] Decide in advance whether a fill is a signal to withdraw or to leave the position exposed to a reversal.
- [ ] Size the band against realised volatility so it is reachable within your holding horizon.

Single-sided provision is a scheduling tool, not an exemption from the mechanics of pooled liquidity. Used deliberately it is one of the few ways to be paid for patience.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [How Uniswap Works (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works"
