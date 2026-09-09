---
title: "Range Orders on AMMs: How Liquidity Can Express a Price View"
description: "A path-by-path explainer of Uniswap v3-style range orders: how inventory flips as price moves, when fees stop, and the costs and MEV risks you must weigh."
category: "LP Mechanics"
date: 2026-08-31
lastReviewed: "2026-09-09"
author: "LiquidityPool Research"
readTime: "9 min read"
keywords: "range orders AMM, liquidity range order, concentrated liquidity strategy, AMM limit order"
featured: false
---

You are watching a stablecoin pool trade close to parity. You want to “sell if it drifts above $1.001, buy if it dips below $0.999,” and collect some swap fees while waiting. A narrow Uniswap v3 range around the current price seems to match that view. But the moment you mint it, you’re not placing an invisible limit order. You’re entering a bounded liquidity position whose token inventory is continuously transformed as the market walks through your price ticks. Whether that’s useful depends on what you plan to hold at each boundary, how quickly you react after a crossing, and whether the fees you expect plausibly cover your execution, gas, slippage, and ordering risks.

<figure class="article-figure">
  <img src="/images/guides/range-orders-on-amms.webp" alt="Dark corridor with alternating patches of light and shadow" width="1538" height="1600" loading="lazy" decoding="async" />
  <figcaption>A corridor shaped by light and shadow. Image by <a href="https://www.pexels.com/photo/corridor-in-shadow-and-light-11570370/" target="_blank" rel="noreferrer">Francesco Ungaro</a> under the <a href="https://www.pexels.com/license/" target="_blank" rel="noreferrer">Pexels License</a>.</figcaption>
</figure>

## What a “range order” is in Uniswap v3 mechanics

Uniswap v3 lets a liquidity provider choose a finite price interval for their capital, rather than spreading it from 0 to infinity as in earlier versions. That finite interval is a position [1]. While price is inside your interval, your liquidity is active and earns a fraction of the pool’s trading fees. As price moves through the range, your inventory shifts between the two tokens. When price exits your bounds, your position becomes entirely one asset, goes inactive, and stops earning fees until price reenters [2].

The v3 whitepaper notes that very narrow positions function similarly to limit orders in effect, but with two crucial differences. First, a range cannot be arbitrarily narrow because of protocol tick spacing. Second, execution is not atomic; the position can be partially executed while price travels inside it. After a full crossing, the position must be withdrawn if you want a one-way sale to stay completed—otherwise a price reversal can trade you back through your own range, undoing the sale [3].

Those properties are the starting point, not a footnote. A workable mental model is: you’re market-making inside a price band. Your outcome is path-dependent. If you want a one-time trade, you must decide when to withdraw. If you want recurring fee income, you must accept that narrow ranges go inactive more often and demand more monitoring, swaps, and gas to stay useful [4]. For a broader primer, see our guide: [Concentrated liquidity explained](/guides/concentrated-liquidity-explained).

## Scenario 1: A narrow band on a stablecoin pair near parity

Setup. You add equal-value liquidity around the current price of a stablecoin pair, choosing a narrow interval bracketing the peg. Your plan is to earn fees while price oscillates, and to end up holding more of the stablecoin that got cheaper.

- Price stays inside. While the market trades inside your band, every swap that touches your ticks pays a bit of fee to your position. Your token mix drifts depending on net order flow, but you remain active and eligible for fees [2]. The position can be partially “filled” in the sense that you might end up with a slightly unbalanced inventory without ever leaving the range [3].
- Price touches a boundary, wicks back in. Hitting the edge does not close anything. It simply means you’ve reached the extreme of your set band. If price reenters, you continue to earn fees, and your inventory will move back toward a mix driven by subsequent trades [2].
- Price exits the range. Once price crosses out, your position stops accruing fees and becomes 100% one token: all lower-asset if price moved down through your lower bound, or all upper-asset if it moved up through your upper bound [2]. You now face an operational choice: leave it inactive (you’ll hold that single-asset exposure with no fee income), or pay gas to withdraw or rebalance. If you leave it and the market reenters your range, your position wakes up and can trade back in the opposite direction [2]. If you intended a one-way sale or purchase, you needed to withdraw after the crossing to prevent reversal [3].

Implication. A tight stablecoin band can harvest frequent fees when price oscillates, but you must accept that inactivity periods interrupt accrual. If your intent was “sell once at the edge,” you must explicitly withdraw at or after the crossing, or the market can undo your sale on a retrace [3].

## Scenario 2: A one-sided range intended to sell Token A above a target

Setup. You hold Token A and want to sell it for Token B if price rises. You set a range entirely above the current price so that your initial deposit is A-only. Your goal is to have B after price moves up through the band.

- Price enters from below. As the market rises into your interval, your liquidity becomes active, and trades in the pool buy your A and pay you in B. Execution is gradual and path-dependent—not an instant, all-or-nothing fill. If price pauses or reverses within your band, you may hold a mix of A and B [3].
- Price fully crosses the band. Once the market clears your upper bound, your position is 100% B and inactive (not earning fees) [2]. If your intent was a sale, it is “functionally complete” only if you withdraw the position or at least remove liquidity. Otherwise, if price falls back through your range later, the position will resume trading in the opposite direction and repurchase A, reversing some or all of your effective sale [3].

Contrast with a limit order. A centralized limit order executes atomically at a price and is done. A Uniswap v3 range position cannot be made arbitrarily thin, can be only partially executed, and will keep market-making unless you remove it after the crossing [3]. Treating a range as a hands-off limit order is a category error.

## Scenario 3: A volatile token races through your band—now what?

Setup. You place a moderately tight band around the current price of a volatile token pair, intending to earn fees while staying engaged with the market.

- Rapid up-move. The token rallies straight through your range and keeps going. You end up fully in the token on the other side and go inactive [2]. You can hold that inventory or incur costs to reposition.
- Repositioning costs. To bring your liquidity back “around” the new market price, you may need to swap some tokens to restore a two-sided mix and submit on-chain updates. Those actions introduce slippage on the swap and gas costs to mint or adjust positions [4]. The academic literature frames this as a core tradeoff: wider bands earn fewer fees per unit capital but avoid frequent reallocation; narrower bands can earn more fee density but go out of range more often, increasing monitoring, rebalancing, and cost exposure [4].

Implication. Your realized outcome is not “fees minus impermanent loss” in isolation; it is “fees while active minus the cost of staying active and the consequences of being out of range.” If you cannot or will not pay to chase the market, a narrow band can strand you as a single-asset bagholder without fee accrual until price returns [2] [4].

## Fees, costs, and the real PnL driver

- Fee eligibility is stateful. You only earn while price is within your interval; once out of range, you hold a single asset and fees stop until reentry [2].
- Narrow range ≠ free yield. Whitepaper-style “range orders” mimic limit orders only in a narrow sense and with explicit caveats: minimum range width, partial execution, and the risk of reversal unless you withdraw after a crossing [3].
- Operational costs matter. Moving a band or re-centering liquidity can require swaps (introducing slippage) and on-chain interactions (incurring gas), and those costs accumulate relative to fee income [4].
- Monitoring load is endogenous to width. Wider positions “cover” more possible prices and tend to require fewer interventions, at the cost of lower fee density per unit of capital. Narrow bands concentrate fees but demand more attention and budget for upkeep [4].

## Execution and MEV: your transaction is not alone in the block

AMMs set prices by formulas and pool balances. That price formation is separate from how your own transactions get into blocks. On Ethereum, maximal extractable value (MEV) is value captured by including, excluding, or reordering transactions in a block. Searchers run bots that look for DEX arbitrage and sandwich opportunities—buying before a large trade they’ve observed and selling after its price impact [5].

This matters when you mint, withdraw, or rebalance around volatile moments:

- AMM price impact vs ordering risk. If you rebalance by swapping into a pool before adding liquidity, the swap itself can move the pool price. Separately, the fact your transactions are visible may invite searchers to trade around you via arbitrage or sandwiches, depending on how your actions interact with other pending swaps [5].
- “Range orders” are not isolated. A visible mint right before a large swap may get sequenced in a way that changes how much of the swap’s fee flow you capture, or which side of the band you end up holding after the block. An in-band withdrawal just before a whale swap could be moved after it, leaving you exposed for one more block. These are block-level realities, not properties of the AMM formula [5].

If you are evaluating these risks and mitigations, see our explainer: [MEV and liquidity providers](/guides/mev-and-liquidity-providers).

## Position states at a glance

The table below summarizes how a v3 position behaves across states, to disentangle expectations that come from limit orders from what the AMM actually does.

| Position state | What you hold | Fee earning? | Execution character | If you want a one-way trade |
|---|---|---|---|---|
| Price inside range | Mix of both tokens that shifts with flow | Yes | Partial, continuous as price traverses ticks | Keep monitoring; no finality |
| At a boundary | Extreme of your band, but still in-range | Yes | Still partial; can reverse within band | Not complete; do nothing if you’re market-making |
| Just crossed out of range | 100% one token (upper or lower) | No | Range fully traversed | Withdraw now to lock the sale/purchase [2] [3] |
| Price reenters after crossing | Mix resumes changing | Yes | Can reverse prior effective trade | If you didn’t withdraw, expect reversal risk [2] [3] |

## Choosing a width: a working mental model

Start with your tolerance for being out of range and your willingness to pay to stay in range. The research frame is simple but powerful: wider positions generally earn lower fees per unit of capital but reduce how often you must alter the position; narrower positions can earn higher fee density but increase the frequency and cost of reallocations due to slippage and gas [4]. Constraints from the protocol mean you cannot set a band narrower than the tick spacing allows [3].

This model is useful for scoping your monitoring burden and cost budget, but it stops being sufficient when path-dependence and execution ordering bite. A single violent wick can flip you to a one-asset state that accrues no fees for days; a sandwich around your rebalance can change your entry mix in ways your spreadsheet did not assume [2] [5]. Treat any backtest that ignores these frictions as a starting sketch, not an answer.

For fundamentals on price bands, ticks, and inventory mechanics, review our [concentrated-liquidity guide](/guides/concentrated-liquidity-explained).

## What to check before you act

- At each boundary of my chosen range, which asset will I hold if price crosses, and am I comfortable holding that single-asset exposure while inactive [2]?
- If my intent is a one-way sale or purchase, when will I withdraw after a full crossing to prevent reversal on a retrace [3]?
- Do I have a credible estimate that expected fees while active exceed the gas and slippage I’ll spend to monitor and rebalance under this width in this pool [4]?
- What minimum width does tick spacing effectively impose here, and does that align with my “limit-like” intent [3]?
- How will I handle execution and MEV exposure when minting, swapping to rebalance, or withdrawing—especially around large, visible swaps [5]? See: [MEV and liquidity providers](/guides/mev-and-liquidity-providers).

## References

1. [Concentrated Liquidity | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Uniswap v3 Core](https://app.uniswap.org/whitepaper-v3.pdf)
3. [Uniswap v3 Core](https://app.uniswap.org/whitepaper-v3.pdf)
4. [Strategic Liquidity Provision in Uniswap v3](https://arxiv.org/html/2106.12033v5)
5. [Maximal extractable value (MEV)](https://ethereum.org/developers/docs/mev/)


[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity | Uniswap Developers"

[2]: https://app.uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core"

[3]: https://app.uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core"

[4]: https://arxiv.org/html/2106.12033v5 "Strategic Liquidity Provision in Uniswap v3"

[5]: https://ethereum.org/developers/docs/mev/ "Maximal extractable value (MEV)"
