---
title: "Liquidity Provider Fees: How LP Revenue Is Generated and Measured"
description: "LP fees pay you for supplying executable inventory. Trace Uniswap v2/v3 flows, active-liquidity accrual, fee tiers, and Curve veCRV; measure net vs holding."
category: "LP Mechanics"
date: 2026-09-02
lastReviewed: "2026-09-09"
author: "LiquidityPool Research"
readTime: "9 min read"
keywords: "liquidity provider fees, LP fees, AMM fee tier, liquidity pool APR"
featured: false
---

You open an AMM interface, see a tempting APR next to a pool, and consider depositing. Before you click, ask a stricter question: who pays you, exactly when, and for what service? Liquidity provider fees are not free yield; they are payment for keeping executable inventory at a quoted price and getting “hit” by traders. Your outcome depends on when your liquidity is active, how prices move through your range, and how the protocol credits fees to your specific position.

This article traces the cash flow from a trader’s swap to your position-level accrual, then shows how to evaluate fee income against the counterfactual of simply holding the assets. We use Uniswap v2 and v3/v4 for mechanics, and Curve for a governance-linked fee flow.

<figure class="article-figure">
  <img src="/images/guides/liquidity-provider-fees.webp" alt="Abstract flowing liquid-metal surface with reflective ridges and dark shadows" width="1600" height="1182" loading="lazy" decoding="async" />
  <figcaption>Flowing value across a reflective surface. Image by <a href="https://unsplash.com/photos/abstract-liquid-metal-reflective-surface-JEqyIGOyvA8" target="_blank" rel="noreferrer">MARIOLA GROBELSKA (@mariolagr)</a> under the <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash License</a>.</figcaption>
</figure>

## From a trader’s swap to your wallet: the fee path

- Uniswap v2: Each swap charges a 0.30% fee that is added to the pool, enlarging reserves. Liquidity providers receive these fees pro rata by burning their LP tokens to redeem the underlying plus accrued fees [1]. The fee is not a side balance—it’s embedded in bigger reserves you partially own via LP tokens.
- Uniswap v3 and v4: Fees accrue only to liquidity that is active at the swap price (i.e., within the position’s chosen price range). Unlike v2’s reserve growth, v3/v4 track fees separately as claimable balances tied to each position [2]. Your redeemable tokens and your claimable fees are distinct buckets.
- Fee tiers are a pool parameter: In v3, the same token pair can have pools with different fee tiers—commonly 0.05%, 0.30%, and 1%. The “rate” is not a protocol-wide constant; it is set per pool and drives trader routing and LP compensation in that specific pool [3].

Those three rules determine who is the fee recipient and how accrual happens. In v2, every LP in the pool shares fees continuously via reserve growth. In v3/v4, only the liquidity in-range at the swap price earns fees, and each position tracks its own claimable fees. If your range is inactive, you collect nothing during that period—even if the overall pool shows high volume [2].

## Scenario 1: a Uniswap v2 50/50 position — what you earn and how to compare it

Mechanism
- Every trade pays 0.30% into the pool [1]. Over any period with total traded notional V (in either direction), total fees added to the pool are 0.003 × V. 
- If your LP tokens entitle you to a share s of the pool, your share of fees for that period is s × 0.003 × V. You realize these fees when you burn LP tokens to withdraw your underlying plus accrued fees [1].

What this implies (and where that simplicity stops)
- Pro rata sharing is straightforward, but your net performance is not “fees alone.” As prices move, the AMM constantly rebalances your inventory between the two assets. Compared with simply holding your starting amounts, you may end up with more of the underperforming asset and less of the outperformer. The value difference versus holding is often called “impermanent loss.” See our explainer to frame it correctly: [[Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes](/guides/impermanent-loss-explained)].
- Research decomposes AMM returns into a market-risk component (your exposure to the assets) plus a microstructure component that is accrued fees minus losses to arbitrageurs. The latter can offset or even outweigh the fees you collect [5]. In other words, the fee flow is necessary to compensate you for being rebalanced by informed flow, but it is not a complete measure of return.

A decision-useful view is to track two ledgers over your holding period: 
- Fees earned per the v2 formula above (you can infer from pool growth and your share), and 
- The marked-to-market value of your pool position versus a hold-only counterfactual of the same initial token amounts. 

If the second ledger shows that rebalancing and price exposure reduced your position’s value relative to holding by more than the first ledger’s fees added, you underperformed holding despite “earning fees.”

For a full picture of inventory risk and execution, see [[Market Making on AMMs: A Practical Framework for Understanding LP Behavior](/guides/market-making-on-amms)].

## Scenario 2: a Uniswap v3 position that falls out of range — why fees stop

Mechanism
- In v3/v4, only liquidity in the active tick range at the time of a swap accrues fees [2]. If the market price leaves your range, your position becomes inactive and earns no fees. Your uncollected fees to date remain claimable (they’re tracked separately), but new swaps do not pay you while you are out of range [2].
- Your fee share at any moment depends on your fraction of the active liquidity at that price. The same notional deposit can earn very different fees depending on how much competing liquidity crowds your range, and on how often the price trades inside versus outside your range.

What this implies
- Tight ranges can increase fee density while active, but they go inactive more often. Wide ranges stay active longer but dilute your per-swap share.
- The wallet still holds your concentrated position even when inactive; your token composition is whatever the AMM’s bonding curve implies at the edge of your range. Price can keep moving against that inventory while you collect zero fees during the inactive period [2].

This is the core behavioral difference from v2: v3/v4 make “time in range” and “share of active liquidity” central to your revenue. A displayed “pool APR” or nominal fee rate does not transfer to your position unless you are in range when volume happens [2] [3].

## Fee tier choice: 0.05% vs 0.30% vs 1% is a design parameter, not a payout ladder

Mechanism
- Uniswap v3 introduced multiple fee tiers (commonly 0.05%, 0.30%, 1%). Each pair can have several parallel pools, each with its own tier. The choice is a pool-level parameter [3].

What this implies
- Your realized revenue is not mechanically higher in the “higher fee” pool. A higher tier may attract less trader flow, or attract flow only when other routes are worse. A lower tier might capture more volume. In every case, your payout depends on three multiplicative factors:
  1) the pool’s fee rate (set by the tier),
  2) the pool’s realized in-range volume for your position, and
  3) your share of the active liquidity while that volume occurs.

Two pools in the same pair with different fee tiers will produce different results because volume distribution and active-liquidity competition differ. The only honest shortcut is to express your expected revenue as: fee rate × in-range volume × your active-share. If any term is small, your outcome is small—even with a “high” nominal rate [3].

## Table: fee rate, APR, collected fees, and net performance — don’t confuse them

| Concept | What it measures | Where it accrues | Why it can mislead |
|---|---|---|---|
| Pool fee rate (e.g., 0.30%) | Per-swap fee charged in that pool | v2: into reserves; v3/v4: tracked per position | A higher rate can coincide with less volume or less time in range [1] [2] [3] |
| Displayed APR | Backward-looking estimate from past fees/TVL | UI-level metric | Not guaranteed; ignores your future active share and price path |
| Collected fees | Cash flow you can claim from swaps | v2: via LP token redemption; v3/v4: claimable fees | Positive but incomplete; says nothing about inventory P&L [1] [2] |
| Net LP performance | Fees minus loss-versus-rebalancing vs a hold-only baseline | Your position value vs counterfactual | Can be negative despite “high fees” due to arbitrage and price exposure [5] |

## Curve note: pooling and veCRV are separate decisions

Curve adds a governance layer that many participants conflate with LP fees. The core distinction:
- Pool trading fees arise from swaps in the pool where you provide liquidity.
- veCRV is received by locking CRV for between one week and four years; veCRV holders receive a share of trading fees and some interest from Curve’s stablecoin markets, and the veCRV balance decays as the lock approaches expiry [4].

What this implies
- Pooling and locking are separate cash flows with different risks and time horizons. If you also lock CRV, part of your aggregate “returns” may come from protocol-level fee sharing paid to veCRV rather than from the pool where you supply inventory [4]. 
- The lock is a commitment: the veCRV voting power and reward weight decay over time until unlock [4]. Treat it as a governance position with its own cost, not as a simple boost to pool fees.

## Measuring whether fees are enough: the counterfactual check

A useful framework to decide whether LP fees are sufficient compensation is to compare against a hold-only baseline at the same end time.

- Define your starting bundle of tokens (the exact numbers you deposit). Track two paths over the period: 
  1) Hold-only: Mark the starting tokens to end-of-period prices.
  2) LP path: Mark your position’s tokens plus unclaimed and claimed fees to end-of-period prices.
- The difference between the LP path and the hold-only path is your LP performance. 
- Research suggests this difference can be decomposed into a market-risk component (exposure to the tokens themselves) and a microstructure component equal to accrued fees minus losses to arbitrageurs who rebalance you at informative prices [5]. 

Where the model helps
- It stops you from treating fees as “return” in isolation.
- It highlights the role of realized in-range volume, your active share, and price variance in driving performance.

Where the model stops being enough
- It does not predict future volume, competition for the same range, or how routing will shift across fee tiers. Those are empirical and path-dependent. 
- It does not capture operational frictions like gas for repositioning or claiming, or governance lock costs. You must layer those on separately.

For background on how AMM inventory rebalancing creates and destroys value, see [[Market Making on AMMs: A Practical Framework for Understanding LP Behavior](/guides/market-making-on-amms)] and [[Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes](/guides/impermanent-loss-explained)].

## What to check before you act

- Who exactly receives the swap fees, and how do they accrue? For v2, fees enlarge pool reserves and are redeemed via LP tokens [1]. For v3/v4, fees accrue only while your range is active and are tracked as claimable balances per position [2].
- What fee tier does this specific pool use (e.g., 0.05%, 0.30%, 1%)? Remember the tier is a pool parameter, not a universal protocol rate [3].
- How will you estimate your share of active liquidity during the times you expect volume to occur? If you can’t, you can’t map “pool APR” to your position.
- Under what price moves will your v3 range go inactive, and for how long might that persist? What is your token inventory at the edges of your range while fees are zero [2]?
- Are there protocol-level fee shares outside the pool that matter to your outcome? Example: veCRV distributes a share of trading fees and some interest from Curve’s stablecoin markets and requires a decaying time lock [4].

## The practical takeaway

Treat LP fees as compensation for making a firm quote with inventory, not as a standalone yield. In v2, everyone shares fee growth pro rata. In v3/v4, only active liquidity earns, and the protocol records fees per position. Your realized outcome is fee income minus the cost of being rebalanced against price moves—measured against holding the same assets. If you can identify the fee recipient and accrual mechanism, estimate your active share, and outline the price paths that switch off your fees or erode your inventory value, you have the minimum toolkit to decide whether the advertised pool is a market you actually want to make.

## References

1. [Pools | Uniswap Developers](https://developers.uniswap.org/docs/protocols/v2/concepts/pools)
2. [Fees | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/fees)
3. [Fees | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/fees)
4. [What is veCRV? | Curve Knowledge Hub](https://docs.curve.finance/user/vecrv/what-is-vecrv)
5. [Automated Market Making and Loss-Versus-Rebalancing](https://arxiv.org/abs/2208.06046)


[1]: https://developers.uniswap.org/docs/protocols/v2/concepts/pools "Pools | Uniswap Developers"
[2]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees | Uniswap Developers"
[3]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees | Uniswap Developers"
[4]: https://docs.curve.finance/user/vecrv/what-is-vecrv "What is veCRV? | Curve Knowledge Hub"
[5]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
