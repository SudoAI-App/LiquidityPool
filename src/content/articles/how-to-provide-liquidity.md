---
title: "How to Provide Liquidity: A Mechanism-First Walkthrough"
description: "Providing liquidity is choosing an exposure to a pricing rule. Learn how ranges, pool types, fees, and flow shape your inventory, activity, and risk."
category: "LP Mechanics"
date: 2026-09-03
lastReviewed: "2026-09-09"
author: "LiquidityPool Research"
readTime: "9 min read"
keywords: "how to provide liquidity, provide liquidity AMM, liquidity provider guide, DeFi LP"
featured: true
---

You are about to add ETH and a stablecoin to a Uniswap pool. The interface asks for a fee tier and a price range. Before you click approve, pause and translate the UI into what the contract will do with your assets. Providing liquidity is not passive deposit-taking; it is selecting how your capital participates in an automated pricing rule, and over which prices that rule will use your assets.

<figure class="article-figure">
  <img src="/images/guides/how-to-provide-liquidity.webp" alt="Two assets enter a pool through a chosen active price range and produce a position receipt." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Providing liquidity means choosing a pool, assets, and active range. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

## Start from the pricing rule: the invariant and your active region

Most retail-accessible pools use an automated market maker (AMM). A constant-product AMM is the canonical example: the pool enforces a simple pricing rule that moves the price as inventory changes, and liquidity providers earn a share of fees collected from swappers. When prices diverge from your entry point, a liquidity provider can end up worse off than if they had simply held the tokens; fees may or may not compensate for this divergence loss, often called impermanent loss [4].

On Uniswap v3 and v4, the critical twist is concentrated liquidity. Instead of spreading your liquidity over all prices, you choose a finite price interval where your assets are available to the market. Within that interval, you earn fees; outside it, your position becomes inactive and does not earn until price re-enters your range [1]. As trades push the price through your range, your position’s inventory tilts: you accumulate more of one token as swappers demand the other, and at a boundary your position can end up entirely in a single asset [2].

Those two facts—finite active range and inventory migration—define what you actually hold at any instant. Your inventory is not fixed; it is a function of the pool’s invariant and where the current price sits relative to your range.

## Map interface choices to contract exposures

Each decision in the deposit flow picks an exposure in the contract:

- Pool type: A constant-product AMM exposes you to price divergence against your initial terms; a stable-swap pool modifies the pricing curve to tolerate greater inventory imbalance when assets are closely related [3][4].
- Range: On Uniswap v3/v4, a narrow range concentrates price support and fee earning within tight bounds but increases sensitivity to price movement and time out-of-range [1]. A very wide range keeps you active longer but dilutes capital across more prices.
- Fee tier: Higher fee tiers collect more per trade but may attract less flow. The choice should match the expected trade sizes and volatility in your active region; do not read a displayed fee APR as a forecast of net returns.
- Approval and deposit: Approving and depositing authorize the pool’s code to exchange your assets according to its rule. From that point, your balance evolves with swaps in your active region and with any price moves that traverse your range [1][2].
- Exit: Withdrawing returns your current inventory. If price has moved to a boundary, expect a single-asset withdrawal at that edge [2].

## Scenario 1: A stablecoin/stablecoin Uniswap position around the peg

Suppose you add liquidity to a USDC/DAI pool on Uniswap v3, setting a narrow price band bracketing 1.00. The intention is capital efficiency: you supply meaningful depth where you believe most trades will occur.

Mechanically, your deposit mints a position that provides both sides within that interval. If the spot price trades inside your range, you are active and earn a share of fees paid by swappers who trade one stablecoin for the other [1]. As repeated trades nudge price within the band, your inventory gradually skews—if more traders buy DAI with USDC, you accumulate USDC and reduce DAI, and the reverse if the flow flips [2].

What if the peg slips to 0.99 or 1.01 and then pushes further? Once the price exits your band, the position becomes inactive and fee accrual stops until the price returns [1]. If price exits at the lower bound, you will have been converted toward the relatively stronger asset and can end up entirely in that asset at the boundary [2]. Importantly, the position does not automatically rebalance itself back to a 50/50 inventory or continuously earn in perpetuity—you must monitor and decide whether to adjust the range, close, or wait for re-entry.

When is this model useful? If you have a concrete view that the peg will remain in a tight corridor most of the time, concentrating liquidity near 1.00 is capital efficient. Where does the model fail on its own? It does not assess depeg risk or the probability that price leaves your interval and stays away. Nor does it say whether accrued fees during active periods will be sufficient to compensate for any divergence relative to simply holding the two stablecoins; that trade-off exists even in constant-product designs [4].

## Scenario 2: A volatile ETH/token pair on Uniswap v3—full-range versus narrow

Consider ETH/Token on Uniswap v3. Compare two choices:

- Wide range spanning most plausible outcomes.
- Narrow range tightly centered on today’s price.

With a wide range, you remain active across larger price moves, and your inventory gradually morphs as the market trades through the curve. If ETH rallies meaningfully, your position sells ETH to buyers and accumulates more of the other token; your share of fees grows while active, but you are increasingly long the underperforming side as price moves [1][2][4].

With a narrow range, your initial capital supports very tight spreads near the current price. Fee density is higher per unit of capital when trades occur within the band, but the position can go inactive quickly if price trends. If ETH rallies beyond the upper bound, you will typically end up holding mostly the non-ETH token at the edge and earn no further fees until re-entry [1][2]. If ETH dumps below the lower bound, you wind up mostly in ETH at that edge and inactive.

The risk comparison is concrete:

- Inventory path: Narrow ranges pivot you more quickly into a single-asset state at the boundary [2].
- Fee opportunity: Narrow ranges can collect meaningful fees while active but can spend long periods inactive if price drifts away [1].
- Divergence loss: Sustained one-way moves realize larger divergence versus holding the pair, and fees may not offset this effect [4].

“Safer” is not a property of narrower ranges. They are simply different bets about where trading happens.

## Stable-swap pools: amplification and imbalance tolerance

Curve’s StableSwap design changes the pricing curve for closely related assets (multiple stablecoins or wrapped variants). The pool’s amplification coefficient A modulates how tolerant the pool is to imbalance: a higher A makes the pool more tolerant to slippage while imbalanced, within limits appropriate to the assets; the correct A depends on how tightly the assets should track one another [3].

What does that mean for a deposit? If assets are meant to stay close, a higher A supports larger trades near the peg with low slippage, encouraging volume that may translate to fees. But if correlation breaks, the design’s tolerance for imbalance can carry your inventory further into the depreciating side before price adjusts more sharply. The same deposit workflow therefore cannot be interpreted without inspecting asset correlation, potential depeg paths, and whether the A parameter matches that economic reality [3].

Your decision is not just “add stables to earn.” It is “choose a pricing curve, given a correlation hypothesis, and accept how that curve will reshape my inventory if the hypothesis is wrong.”

## Fees versus divergence: what a quoted APR omits

Displayed APRs often summarize recent fees relative to pool value, but your realized result depends on whether and how long your range stays active, how your inventory shifts as price moves, and what path prices take while you are providing liquidity. In constant-product AMMs, divergence from your entry terms can leave you worse off than holding, and trading fees may not offset that loss [4]. In concentrated designs, that interaction is intensified by range selection: no fees accrue outside your band [1]. Treat fee APRs as a backward-looking measure of flow, not a forecast of net return.

If you need a refresher on how fees accrue and are distributed across ticks or tranches, see our guide to fee mechanics in different pool designs at [Liquidity Provider Fees: How LP Revenue Is Generated and Measured](/guides/liquidity-provider-fees).

## Order flow and transaction ordering: trader versus liquidity-provider exposure

A separate but related dimension is how trades reach the pool. In public mempools, pending orders and predictable price impact can be visible before execution. Attackers can place transactions immediately before and after a target trade—front-running and sandwich attacks—by exploiting transaction ordering [5]. Security researchers have proposed and implemented order-flow auctions intended to shield users from such attacks [5].

How does this touch liquidity providers? The direct sandwich risk is borne by the trader whose swap is being manipulated. The liquidity provider’s exposure is structural: they are paid to face flow according to the pool’s rule in their active region. Large, adverse-flow bursts can accelerate inventory migration along your curve and push you to a boundary faster, where you stop earning until re-entry [1][2]. A trader’s slippage tolerance, the path their order takes, and any protections their wallet or relayer applies can therefore shape the realized flow your position faces—even though the manipulation risk itself targets the trader [5].

For an overview of pool-level and platform-level risk categories, including economic, smart-contract, and execution concerns, read [Liquidity Pool Risks: A Complete Framework for LP Due Diligence](/guides/liquidity-pool-risks).

## Compact comparison: how designs shape inventory and activity

| Design choice | Where liquidity is active | How inventory shifts | When fees stop | Main sensitivity |
|---|---|---|---|---|
| Uniswap v3/v4 narrow range | Only inside the chosen band [1] | Moves quickly toward one asset; can end single-sided at boundary [2] | Immediately when price leaves band [1] | Time out-of-range; divergence if trend persists [4] |
| Uniswap v3/v4 wide range | Broad set of prices within band [1] | Gradual rebalancing along path [2] | Only outside the wide band [1] | Diluted fees; slower but persistent divergence [4] |
| Curve StableSwap (higher A) | Around intended peg [3] | Tolerates larger imbalances near peg [3] | N/A—design remains active but pricing response varies with A [3] | Correlation break/depeg; parameter–asset mismatch [3] |

## From approval to exit: trace the state changes

- Before deposit: Decide pool type and fee tier. On Uniswap v3/v4, pick a price band that encodes where you want to be active [1].
- Approve and add: Approving authorizes the contract to use your tokens; supplying both sides mints a position whose balances evolve as traders move price through your band [1][2].
- While active: Fees accrue from swaps in your band, and your inventory migrates as one asset is demanded over the other [1][2].
- At the edge: If price reaches a boundary, you can be entirely in one asset and earn no further fees until price re-enters the band [1][2].
- Exit: Withdrawing crystallizes your current inventory; divergence relative to holding is realized on exit, and fees either offset it or not depending on the path and flow [4].

The model is simple to state and demanding to manage: you must align range, fee tier, and pool design with the volatility and correlation you expect in your active region—and be honest about how wrong you could be.

## What to check before you act

- Can I state the pool’s pricing rule and, for Uniswap v3/v4, the exact price interval where my position earns fees [1]?
- If price moves beyond my band, which asset will I end up holding at that boundary, and am I comfortable holding that inventory [2]?
- For a stable-swap pool, does the A parameter make sense for these assets’ correlation and peg behavior [3]?
- If price trends, do I have a plan to widen, shift, or close my range—and a view on whether fees plausibly offset divergence risk in this market [4]?
- How might transaction ordering and order routing affect the flow my position faces, even though sandwich risk targets the trader [5]?

## References

1. [Concentrated Liquidity](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Concentrated Liquidity](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
3. [Curve StableSwap: Pools](https://curve.readthedocs.io/exchange-pools.html)
4. [Trading in the DeFi era: automated market-maker](https://www.bis.org/publications/trading-defi-era-automated-market-maker)


[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity"

[2]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity"

[3]: https://curve.readthedocs.io/exchange-pools.html "Curve StableSwap: Pools"

[4]: https://www.bis.org/publications/trading-defi-era-automated-market-maker "Trading in the DeFi era: automated market-maker"

[5]: https://www.bis.org/publications/trading-defi-era-automated-market-maker; https://writings.flashbots.net/state-of-wallets-2024 "Trading in the DeFi era: automated market-maker; State of Wallets 2024"
