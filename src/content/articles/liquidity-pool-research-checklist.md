---
title: "The Liquidity Pool Research Checklist: Questions to Ask Before You Act"
description: "A practical checklist to model pool mechanics, ranges, fees, and execution so you can explain inventory, inactivity, and risk before adding liquidity."
category: "Advanced"
date: 2026-08-21
lastReviewed: "2026-09-09"
author: "LiquidityPool Research"
readTime: "9 min read"
keywords: "liquidity pool checklist, DeFi liquidity research checklist, LP due diligence checklist"
featured: false
---

You open your wallet and see a double-digit APY on a USDC/DAI “narrow range” pool. It looks like free basis points. Pause. A liquidity pool is not a passive yield account. It is a rule-bound market-making position whose inventory, fee accrual, and risk profile change as price moves. Treat it that way.

This checklist frames one decision: before you supply liquidity or press swap, can you explain—using one concrete example—what the pool will hold after a large move, when your liquidity stops earning fees, who extracts value from your trades, and which risks remain even if the displayed APY is zero or disappears? If not, do not act yet.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-research-checklist.webp" alt="A pool model is reviewed by an ordered set of visual checks for assets, curve, depth, flow, and controls." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A durable review starts with the pool mechanism and its exit conditions. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

## Start from the position, not the APY

Displayed APY can be a lagging or incentive-inflated number. It is not the same as realized fee income. Incentives can end, your position’s price range can deactivate, and your asset mix can shift in ways the APY widget never modeled. You are choosing a payoff shape tied to a specific pricing function and execution environment.

A core result from academic analysis: ignoring fees, a constant-function AMM gives a liquidity provider a concave payoff that is inferior to simply holding the assets outside the pool because liquidity takers and arbitrageurs perform price discovery at your expense; fees must compensate for this adverse selection and rebalancing cost [4]. This is the sober meaning behind “impermanent loss”: it is the structural cost of market making in these designs, and it does not have to reverse.

Your first task is to reconstruct the mechanism and when it pays you. Only then compare fees and incentives against the risks that mechanism creates. For a step-by-step framework, see our guide: [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool).

## Rebuild the invariant in plain language

- Concentrated liquidity (as implemented by Uniswap’s design) lets a liquidity provider choose a specific price interval rather than spreading funds across the entire curve. That deepens liquidity around the mid-price, but a position becomes inactive and stops earning fees when price leaves its interval; as price moves toward a bound, the inventory can end up entirely in one asset [1].
- Curve’s StableSwap blends constant-sum and constant-product behavior to keep pricing flatter when assets track each other closely, and it shifts toward constant-product behavior as balances become more imbalanced [2]. The “amplification coefficient” tunes that trade-off: a lower value makes pricing closer to constant-product, a higher value keeps the curve flatter near balance, and—crucially—the pool still retains liquidity as the portfolio moves away from its ideal balance [3].

These mechanics tell you: where your liquidity is active, how your inventory evolves with price, and who collects the spread when the pool reprices to external markets.

## Scenario 1: A narrow USDC/DAI range that goes out of range

Set-up: You supply USDC and DAI into a narrow concentrated-liquidity interval. Initially, trades cross your tick range and you earn fees. Then USDC trades outside your selected interval.

What the mechanism implies:
- As price moved toward your bound, your inventory migrated toward a single asset held at that edge. Once price left your interval, your position stopped earning fees and sat as inventory in one asset [1].
- The displayed APY did not protect you; it likely assumed continuous activity in-range. Your realized return now depends on the fees you captured while active versus the cost of ending up with a single-asset exposure you may not want.

What you must decide:
- Did the active period’s fees plausibly compensate for range risk and the management overhead of rebalancing (moving or widening your range) if you want to be active again?
- Are you comfortable being entirely in one stablecoin if it later faces issuer, redemption, oracle, bridge, governance, or smart-contract risks that dominate the gentle swap curve you modeled? A “stablecoin pool” is not automatically low risk; the invariant is tuned for similarly valued assets, but non-curve risks can dominate outcomes.

Useful model boundary: Modeling fee accrual while you were in-range is useful. It stops being enough when price leaves your interval, incentives change, or one stablecoin’s non-market risks become the driver of return.

## Scenario 2: ETH/USDC during a one-way rally—who earns what?

Set-up: You consider providing liquidity to an ETH/USDC pool to “earn fees” or staking incentives. Instead of quoting APY, compare the position with simply holding ETH and USDC.

What the mechanism implies:
- When ETH rallies relative to USDC, arbitrageurs and informed traders update the pool’s price to match external markets. In a constant-function AMM, this rebalancing gives you a concave payoff absent fees; the takers earn the gains from information and inventory shifts, and your pool position must be compensated by fees to beat the hold benchmark [4].
- In concentrated-liquidity designs, a narrower range can earn higher fees per unit of capital while active, but it can deactivate sooner and end as a one-asset position at the bound [1].

What you must decide:
- Can you outline the asset mix you would hold after, say, a large one-way ETH move, and estimate whether the realized fees (plus any expiring incentives) plausibly cover the rebalancing cost implied by that move? If not, you are comparing a theoretical APY to a hold benchmark you have not reconstructed.

A compact way to compare outcomes qualitatively:

| Setup | Inventory after a large upward ETH move | Fee earning status | Who captures most price update | Key risk if incentives/APY vanish |
|---|---|---|---|---|
| Hold ETH and USDC off-pool | More ETH gains in value; inventory unchanged | N/A | You retain full exposure to ETH’s move | Market risk only; no AMM rebalancing costs |
| Broad range liquidity | Mix shifts toward USDC as price moves; still two-sided | Active longer, lower fee density | Takers/arbitrageurs set price; you collect fees | Fees may not cover adverse selection [4] |
| Narrow range liquidity | Moves quickly to one asset at bound | Becomes inactive out-of-range [1] | Takers/arbitrageurs set price; you collect fees while active | Range risk: ending one-sided plus missed fees |
| Out-of-range position | Single-asset inventory persists | Inactive; no fees [1] | None—you’re not trading | Exposure to that one asset only |

Note: The table is qualitative by design; the right comparison is your modeled realized fees plus incentives versus the hold benchmark—not the widget APY.

## Scenario 3: StableSwap under stress—a depeg test

Set-up: You review a Curve-style pool for similarly valued assets during a depeg event.

What the mechanism implies:
- Near balance, StableSwap’s pricing is intentionally flatter than a simple constant-product curve, which reduces slippage for small imbalances. As the pool becomes imbalanced, pricing moves toward constant-product behavior [2]. The amplification coefficient controls this trade-off and aims to keep swaps efficient near balance; it does not eliminate the possibility that the pool accumulates more of the asset being sold during a depeg [3].
- Even as the portfolio drifts away from its ideal balance, the design retains liquidity across states rather than snapping off entirely [3]. You still have two-sided inventory unless the market relentlessly trades against one side.

What you must decide:
- Which asset will the pool likely accumulate if the market prefers one over the other? If it is the depegging asset, are you underwriting its redemption and issuer risk? The invariant can smooth swap pricing; it cannot fix issuer, oracle, bridge, governance, or smart-contract exposures.
- Are the fees during stress sufficient to compensate for taking the other side of urgent exits? Fees do not erase adverse selection; they aim to compensate it [4].

Useful model boundary: Modeling the StableSwap curve and amplification setting is useful for estimating execution quality when assets are near parity [2][3]. It stops being enough when the driver of outcomes is redemption mechanics and counterparty promises outside the curve.

## Quotes, routing, and ordering: you trade the execution you get

A displayed spot price is not the executed price of your transaction. Between your wallet and final settlement lie routing choices, available active liquidity, price impact, your minimum-out settings, and the transaction-ordering environment.

- Active liquidity, not headline TVL, determines the depth available at your trade size and price. Concentrated-liquidity designs localize depth; outside that range, your order may walk the book quickly [1].
- Routing matters. A route that looks cheap may traverse an inactive tick range or a thin side of a stable pool; the quote can change materially under load.
- Ordering and MEV risk are real in stateful blockchains. Flashbots frames MEV as a negative externality and emphasizes user protection and transparency around transaction ordering. A pool checklist should examine execution and ordering risk, not only the invariant [5]. In practice, a large swap broadcast to the public mempool can be disadvantaged by transaction ordering; set robust slippage bounds and understand how your route is submitted.

Useful model boundary: Price-impact math helps you size trades and set slippage. It stops being enough when you ignore the ordering environment that turns a quote into a fill [5]. For a deeper execution-risk overview, read [Liquidity Pool Risks](/guides/liquidity-pool-risks).

## Put it together: a disciplined checklist

You are underwriting a specific payoff and execution path. Here is a compact way to make trade-offs visible before you act:

- Reconstruct the pool’s pricing function and your active region. For concentrated liquidity, write down your range and the inventory you will hold at each bound, and the condition that deactivates fees [1]. For StableSwap, note how the amplification setting affects flatness near balance and how pricing changes as the pool imbalances [2][3].
- Identify who updates the pool price and at whose expense. Accept that arbitrageurs implement price discovery and that your payoff is concave absent fees; assess whether fees realistically compensate for adverse selection in your scenarios [4].
- Specify a benchmark. Compare your modeled realized PnL to holding the assets outside the pool, not to a headline APY.
- Make non-curve risks explicit. For stable-asset pools, inventory can concentrate in the asset the market is selling; list what would still worry you if APY = 0 (issuer, redemption, oracle, bridge, governance, contract).
- Test execution, not just state. For a planned swap, check active depth at your size, route selection, minimum-out, and ordering exposure; do not assume the quote equals your fill [5].

## What to check before you act

- After a large price move, what exact inventory will I hold, and will my liquidity still be active and earning fees [1]?
- Who updates this pool’s price to external markets, and are historical/expected fees likely to compensate for adverse selection in my scenario [4]?
- For stable-asset pools, which asset will the pool likely accumulate in a stress, and am I underwriting its non-curve risks [2][3]?
- Does active liquidity at my trade size support the route I’m shown, and what are my minimum-out and slippage limits [1]?
- How is my transaction being ordered and relayed, and what MEV or ordering risks could alter my execution [5]?

If you cannot answer these with a concrete example, keep the funds in your wallet and keep modeling. Use our primers—[How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool) and [Liquidity Pool Risks](/guides/liquidity-pool-risks)—to turn APY screenshots into positions you can explain.

## References

1. [Concentrated Liquidity | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Curve StableSwap Exchange: Overview | Curve Knowledge Hub](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
3. [StableSwap - efficient mechanism for Stablecoin liquidity](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Automated Market Makers: Mean-Variance Analysis of LPs Payoffs and Design of Pricing Functions](https://arxiv.org/html/2212.00336v6)
5. [Welcome to Flashbots](https://docs.flashbots.net/)


[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity | Uniswap Developers"
[2]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview | Curve Knowledge Hub"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap - efficient mechanism for Stablecoin liquidity"
[4]: https://arxiv.org/html/2212.00336v6 "Automated Market Makers: Mean-Variance Analysis of LPs Payoffs and Design of Pricing Functions"
[5]: https://docs.flashbots.net/ "Welcome to Flashbots"
