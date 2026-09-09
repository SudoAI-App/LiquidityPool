---
title: "Automated Market Makers Explained: The Engine Behind AMM Pools"
description: "AMMs price trades from reserves and rules. Learn how invariants, fees, active liquidity, price impact, and MEV shape execution and LP risk before you act."
category: "Foundations"
date: 2026-09-08
lastReviewed: "2026-09-09"
author: "LiquidityPool Research"
readTime: "10 min read"
keywords: "automated market maker, AMM explained, AMM pool, DeFi exchange"
featured: true
---

You open a pool page and see an attractive spot price and a low fee. You plan a swap—until you notice the pool is thin and your trade is large. The number on screen is not a promise; it’s the current quote implied by the pool’s reserves and pricing rule. In an automated market maker, the only way to understand what you’ll actually get—or what you’ll earn and hold as a liquidity provider—is to trace the invariant, the depth of active liquidity, the fee flow, and the transaction-ordering environment from your specific action.

This article explains how AMMs turn balances into executable prices, why fees and price movement drive liquidity-provider returns and risks, and how to evaluate a pool before swapping or supplying capital. If you’ve only seen AMMs described as “decentralized exchanges,” start here and reframe them as a rule plus inventory that continuously trades against you.

<figure class="article-figure">
  <img src="/images/guides/automated-market-maker-explained.webp" alt="Three golden gears aligned vertically on a black surface" width="1600" height="1064" loading="lazy" decoding="async" />
  <figcaption>A dark mechanism of interlocking gears. Image by <a href="https://www.pexels.com/photo/round-gears-on-black-surface-3785928/" target="_blank" rel="noreferrer">Miguel Á. Padriñán</a> under the <a href="https://www.pexels.com/license/" target="_blank" rel="noreferrer">Pexels License</a>.</figcaption>
</figure>

## An AMM is a pricing rule with inventory, not a price oracle

In a constant-product pool such as Uniswap’s classic design, two token reserves x and y are linked by the rule x*y = k. That rule, and only that rule, sets the pool’s price as a function of its current reserves; it does not guarantee any external market price. When you trade, you change the reserves, which changes the price. The larger your trade relative to the depth of reserves, the more you move the price—this is price impact [1].

That framing corrects a common misconception: the AMM doesn’t “know” the fair price; it quotes what its inventory and invariant imply. Arbitrage and other flows move reserves until the pool’s price is economically consistent with outside markets, but the quoted price you see is still a function of the pool state you are about to change [1]. If you want a refresher on the constant-product math, see our guide: [The constant-product formula](/guides/constant-product-formula).

## Scenario: a large swap in a shallow constant-product pool

Consider a pool with reserves x (input token) and y (output token), obeying x*y = k. You plan to trade an amount Δx of the input token. With a fee rate f, only (1 − f)·Δx effectively increases x before the output is computed. The post-trade output is:

- Output amount: Δy = y − k / (x + (1 − f)·Δx)
- Average execution price you pay: Δx / Δy
- New spot price (marginal price after your trade): (x + (1 − f)·Δx) / (y − Δy)

Three practical implications follow directly from these expressions:

- If your Δx is small relative to x, Δy is close to the displayed quote; as Δx approaches x, Δy falls sharply. That is what “thinner pool, greater price impact” means in concrete terms [1].
- A low fee does not offset the impact of size. A 0.30% fee in a deep pool can be cheaper than a 0.05% fee in a much thinner one because the invariant, not the sticker fee, dominates your effective price when you are large relative to active depth [1] [3].
- Your slippage setting should cap the acceptable new spot price you’re willing to reach. If you must move the pool a lot to complete your size, the slippage ceiling is the last line of defense against overpaying due to impact or reordering side-effects (see MEV below) [1] [5].

For Uniswap v2, the standard fee is 0.30% taken from the input before the invariant is applied [3]. In Uniswap v3, pools can use multiple fee tiers, but the same logic holds: the effective input is reduced by the fee, and the invariant then determines output and the new price [3]. The key discipline is to compute from the reserves and fee tier of the actual pool you intend to use—don’t assume the displayed spot equals your execution.

For a broader comparison of how AMMs differ from order books when processing size, see our explainer: [AMM vs order book](/guides/amm-vs-order-book).

## Fees, where they go, and what they do—and don’t—offset

Swap fees compensate liquidity providers. In Uniswap v2, the standard pool fee is 0.30% [3]. In Uniswap v3, pools introduced multiple fee tiers (for example, lower fees for pairs intended to trade tightly, higher fees for more volatile pairs), and fees accrue pro rata to active liquidity in the price range that actually facilitated the trade [3].

This has two immediate consequences for both sides of the market:

- For traders: a low displayed swap fee does not guarantee good execution. If your trade is large relative to the active liquidity at your price, the invariant-driven impact will dominate your outcome regardless of the fee tier [1].
- For liquidity providers: fees are paid only to the liquidity that is active at the time of the swap. In Uniswap v3 and v4, you choose a finite price range; liquidity placed outside the current price is inactive and does not earn swap fees until the price re-enters the range [2] [3]. Your fee income therefore depends on where price spends time relative to your range.

Fees compensate for taking the other side of trades, but they do not remove inventory risk. As price moves, your position’s asset mix changes. If price keeps moving in one direction, you may end up heavily exposed to one token at a worse average rate than if you had not provided liquidity. This is not a claim about future returns; it is the mechanical result of trading against flow at the pool’s rule-generated prices.

## Scenario: providing a narrow Uniswap v3 range on a stablecoin pair

Suppose you, as a liquidity provider, place a position on a stablecoin pair with a narrow range around 1.00. The appeal is clear: if most trades happen inside that band, your capital is concentrated where volume occurs, and you accrue fees only while your liquidity is active in-range [2] [3]. The key risks follow from the same design:

- If the market price leaves your range, your position becomes one-sided in the out-of-range direction (e.g., mostly the token whose price fell relative to the other) and stops earning fees until price re-enters your band [2].
- The narrower the range, the more quickly it can be left by relatively small price moves. This increases the likelihood of inactivity and leaves you holding mainly one asset while waiting for re-entry—your outcome hinges on whether and when trading brings price back.

These facts are often misunderstood as “LPing is like passively collecting yield.” It isn’t. You are continuously quoting both sides of the pair within your range and taking inventory as trades hit you; your compensation is the stream of fees you capture while active [2] [3]. If you choose to concentrate tightly, you are making a view—explicitly or implicitly—about where the price will spend time.

## When “stable” isn’t flat: Curve StableSwap versus constant product

Constant-product pools handle all price levels the same way: the product x*y remains constant, so the curve is equally curved everywhere. This means slippage is present even when two assets are very close to a 1:1 rate [1]. Curve’s StableSwap design changes this shape: it blends constant-sum behavior near balance (which reduces slippage around the target ratio) and moves toward constant-product behavior as the pool becomes imbalanced. It is built for assets intended to trade near one another (e.g., stablecoins) [4].

The practical read is simple: if a stablecoin pair is currently balanced, StableSwap will typically offer lower slippage for modest trades near 1:1 because the curve is flatter there; if the pool becomes skewed, it increasingly behaves like constant product, and slippage rises accordingly [4]. A “stablecoin pool” label does not imply zero risk or fixed pricing: both the model’s behavior and the assets’ pegs matter [4].

### Comparing invariants for near-parity pairs

| Model | Invariant behavior | Near 1:1 slippage | When balances skew | What this implies |
|---|---|---|---|---|
| Constant product (e.g., Uniswap-style) | x*y = k at all times [1] | Always curved; slippage present even close to parity [1] | Slippage increases smoothly with skew [1] | Treat displayed quote as indicative only; compute impact from reserves |
| Curve StableSwap | Blends constant-sum near balance, approaches constant-product as skew grows [4] | Flatter near 1:1; modest trades face lower slippage [4] | Becomes more like constant product as imbalance increases [4] | Check current balance skew; don’t assume “stable” means flat execution |

When comparing two pools for a parity pair, inspect the invariant and the current reserve balance rather than assuming identical outcomes. This is especially important if one pool is visibly skewed while another is balanced.

## Transaction ordering and MEV: sandwich risk is about your size and visibility

AMMs execute on public blockchains where transaction ordering affects outcomes. Ethereum’s documentation defines a “sandwich” as a searcher buying just before a large DEX trade and selling just after it, exploiting the price impact caused by the user’s trade [5]. A large, visible transaction with a generous slippage tolerance is an attractive target because your own trade moves the AMM’s price in a predictable way.

Two practical mitigations flow from this reality:

- Set a slippage limit that reflects the price movement you are actually willing to accept from the invariant and your size.
- Consider privacy-preserving submission or private routing options that can reduce exposure to generalized frontrunners by keeping your trade out of the public mempool prior to inclusion [5].

Neither mitigation changes the AMM’s math—but both can help ensure the only entity moving the price with your trade is you, not a searcher adding pre- and post-trades around you.

## Reading a pool from your action backward

Whether you are trading or providing liquidity, start with the specific action and trace backward through the mechanism:

- Identify the invariant and current reserves relevant to your price. For constant-product pools, apply x*y = k and compute outputs from the actual reserves and your size [1]. For StableSwap, check whether the pool is balanced or skewed to gauge whether you are near the flatter or more curved part of the function [4].
- Locate the fee tier and how it is applied. In Uniswap v2, the default is 0.30% taken from input; in v3, multiple fee tiers exist and fees accrue to the active range that facilitated the trade [3].
- For liquidity providers using Uniswap v3 or v4, define your intended range and explicitly note what occurs if price exits it: fee accrual halts and your inventory becomes one-sided until re-entry [2].
- Consider the transaction-ordering environment for your trade size: visibility plus impact creates sandwich risk; use slippage protections and private channels as appropriate [5].

This is the practical edge: you’re not memorizing AMM buzzwords; you’re running the mechanism on your own intended action.

## What to check before you act

- Which invariant governs this pair, and what are the current reserves (or balance skew) at the price you care about [1] [4]?
- What fee tier applies, how is it levied, and who collects it at your price (global v2 fee versus v3 fee tiers accruing to active liquidity) [3]?
- If you are providing liquidity, what exact price range defines “active,” and what happens to fee accrual and your inventory if price leaves it [2]?
- How far will your trade move the pool price if executed as a single transaction, and what slippage limit reflects that movement [1]?
- How will you submit the transaction—publicly or via a private channel—and what is your exposure to sandwich-style MEV given your size and tolerance [5]?

## The limits of invariants—and why you measure before trusting

Invariants are powerful because they are simple and verifiable on-chain, but they describe how a pool prices trades given its current inventory; they do not predict where external prices will go. Constant product is a reliable model to reason about execution and inventory changes across all price levels, but it can be expensive near parity for stable pairs. StableSwap improves pricing for near-1:1 trades but reverts toward constant-product behavior as imbalances grow. Concentrated liquidity increases fee capture when you are in-range but introduces periods of inactivity and one-sided holdings when you are out-of-range [1] [2] [4].

Your evaluation loop is therefore consistent across pools: start from your trade or position, run the invariant with the actual reserves and fee tier, check whether your liquidity is active at the relevant price, and account for ordering risk. When you can narrate those mechanics clearly, you have a real understanding of the AMM you are about to use.

## References

1. [How Uniswap Works](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)
2. [Concentrated Liquidity](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
3. [Fees](https://developers.uniswap.org/docs/get-started/concepts/fees)
4. [Curve StableSwap Exchange: Overview](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
5. [Maximal Extractable Value (MEV)](https://ethereum.org/developers/docs/mev/)


[1]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works"
[2]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity"
[3]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees"
[4]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview"
[5]: https://ethereum.org/developers/docs/mev/ "Maximal Extractable Value (MEV)"
