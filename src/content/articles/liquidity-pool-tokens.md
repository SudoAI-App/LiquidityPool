---
title: "Liquidity Pool Tokens Explained: What an LP Position Represents"
description: "LP tokens are claims on dynamic pool states, not simple receipts. Learn how Uniswap v2, v3, and Curve account for fees, ranges, and redemption."
category: "Foundations"
date: 2026-09-05
lastReviewed: "2026-09-09"
author: "LiquidityPool Research"
readTime: "11 min read"
keywords: "liquidity pool tokens, LP tokens explained, liquidity position NFT, DeFi LP token"
featured: false
---

A reader opens a DEX interface and sees a pool advertising double-digit fees. The button says “Deposit.” The small print shows an LP token will be minted. If that LP token were a simple receipt for a stable deposit, the decision would be easy. It is not. A liquidity provider token is a protocol-specific claim on a live pool that is constantly repricing and collecting fees. What that claim entitles you to, when it earns fees, and how you redeem it differ markedly between designs like Uniswap v2, Uniswap v3, and Curve. Understanding those mechanics is the difference between a position you can explain and a number on a dashboard.

This article maps the claim structure behind common LP tokens, follows two concrete scenarios through to redemption, and ends with a checklist you can apply before committing capital.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-tokens.webp" alt="Glass jar of coins with a small green plant" width="1600" height="1068" loading="lazy" decoding="async" />
  <figcaption>A living ledger of pooled value. Image by <a href="https://unsplash.com/photos/a-glass-jar-filled-with-coins-and-a-plant-joqWSI9u_XM" target="_blank" rel="noreferrer">Towfiqu barbhuiya</a> under the <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash License</a>.</figcaption>
</figure>

## Why the “deposit receipt” metaphor breaks down

A deposit receipt implies your principal is parked somewhere and accrues a known return. In automated market makers (AMMs), your deposit is merged into a pool of reserves that changes with every trade. Fees are added to the pool, altering the reserve balances and your share of them. In concentrated-liquidity designs, whether you earn fees at all depends on the current price relative to the price band you chose.

- In Uniswap v2, adding liquidity mints fungible ERC‑20 pool tokens that represent your pro‑rata claim on both assets in the pool. Burning those tokens redeems your share of current reserves plus your share of accrued trading fees. The fee is 0.3% per trade and is paid to liquidity providers via this mechanism [1] [2].
- In Uniswap v3, your liquidity is a position bound to a price range. If the market leaves that range, the position becomes inactive, is composed entirely of one asset, and stops earning fees until price re‑enters your range [3].
- In Curve, LP tokens represent your ownership stake in the pool and are burned when you withdraw. Staking those LP tokens in a gauge to earn CRV or other rewards is a separate, optional step from being a liquidity provider in the pool itself [4].

Each model encodes a different claim, fee accounting, and redemption path. Treating them as fungible “yield wrappers” invites category errors.

## Uniswap v2: fungible LP tokens and proportional claims

Mechanism in brief. When you deposit an equal‑value pair (say, token A and token B) into a Uniswap v2 pool, you receive fungible ERC‑20 liquidity tokens representing your ownership share. The number of tokens you receive is determined by how much you contribute relative to the pool’s existing reserves. Your rights are simple: at any time you can burn some or all of your LP tokens to withdraw the same proportion of the pool’s current reserves—both assets—plus your share of fees that have been added to the pool by trading. The protocol charges a 0.3% fee on each swap; those fees accumulate in the pool and reach you through your LP token share at withdrawal [1] [2].

Scenario: deposit, then partial redemption. Imagine you supply an equal dollar value of A and B to a v2 pool and receive 1,000 LP tokens in a pool that now has 100,000 LP tokens outstanding. Your ownership is 1%. Over time, traders change the price in the pool and pay 0.3% per trade into the pool reserves. Weeks later you burn 500 of your LP tokens. You now withdraw 0.5% of the pool’s then‑current reserves of A and B, not the amounts you originally put in. Because fees were added to the pool over time, your withdrawn amounts will implicitly include your proportional share of those fees. Your remaining 500 LP tokens continue to represent 0.5% of the pool and can be burned later for your share at that time [1] [2].

What this implies for accounting. A v2 LP token does not track “principal plus interest.” It tracks “percent of a two‑asset reserve that evolves with price and fees.” Your unit of account is the pool’s state at redemption, not your original deposit mix. If the relative price of A and B has shifted, your asset mix on withdrawal will reflect that shift—regardless of whether you withdrew early or held to the end. The fee line item is not a separate balance; it is embedded in the reserves you redeem proportionally [2].

When this model is useful. If you want simple exposure to the pool’s two assets and pro‑rata fee income, and you value fungibility (your LP tokens are identical to others’), v2’s model is easy to reason about at redemption. It stops being enough when you need control over where your capital sits on the price curve or you want to avoid providing liquidity where there is little trading.

## Uniswap v3: range‑bound positions that can go inactive

Mechanism in brief. Uniswap v3 concentrates your liquidity into a price range you choose. Your position is represented on‑chain as a non‑fungible position bounded by two ticks (prices). Within that range, you act like a market maker: when traders swap, your liquidity is used, and your position accrues fees. If the market price moves outside your range, your position becomes composed entirely of one of the two assets; while out of range, it is inactive and earns no fees. It becomes active again if price returns to the range [3].

Scenario: a narrow ETH/USDC range that goes out of bounds. You choose a tight ETH/USDC range just above the current price to seek higher fee density. ETH rallies. Once price crosses your upper bound, your position has been converted fully into USDC and stops earning fees. You still own the position, but it now holds a single asset and sits idle until ETH trades back down into your range—or until you pay gas to reposition your range to where trading is occurring [3].

Operational implication. In v3, “when do I earn fees?” is an explicit function of your chosen range and the realized path of price. Narrow ranges can generate higher fees per unit of capital while active, but they are more likely to spend time inactive and require more frequent rebalancing. Empirical research on Uniswap v3 liquidity provision finds that higher‑return strategies are associated with greater financial risk and a need for active management, rather than passive set‑and‑forget behavior [5].

Redemption path. To exit, you decrease your position’s liquidity and collect the two underlying assets currently in your range interval. If you exit while out of range, you will predominantly (or entirely) receive one asset—the state your position now holds. The key is that your claim is not a fungible token representing a fixed percent of total pool reserves; it is a discrete position with its own price band and fee accrual history, and its value depends on where price has traveled relative to that band [3].

When this model is useful. If you have a view on where trading will occur and are prepared to monitor and adjust ranges, v3 offers precision and capital efficiency. It stops being enough when you lack the bandwidth for active range management or when you prefer a fungible claim you can trade or split without tracking unique ranges.

## Curve pools: LP tokens and separate gauge staking

Mechanism in brief. Curve LP tokens represent your ownership in a pool’s assets. Withdrawing liquidity burns the LP tokens and returns your share of the pool’s reserves. Curve also offers “gauges,” which are contracts where you can stake those LP tokens to receive CRV or other token rewards in addition to any pool fees. Staking in a gauge is a separate, optional step from providing liquidity in the pool itself; your base pool claim remains embodied by the LP tokens [4].

Scenario: supply USDC and USDT and consider gauge staking. You deposit stablecoins into a Curve pool and receive LP tokens. You can redeem them directly from the pool contract for your share of the pool’s assets. If you want additional rewards, you can stake those LP tokens in the pool’s gauge, which may pay CRV or other incentives. The gauge staking does not change the fact that the LP token is the claim on the pool; it is an additional wrapper for rewards, not the custody of your principal claim [4].

Decision point. When comparing Curve opportunities, separate “what do I own?” (the LP token claim on the pool) from “what else can I earn?” (gauge rewards). Do not conflate a gauge’s reward rate with the pool’s fee accrual mechanics or with the redemption path for your base LP tokens [4].

## Comparing LP claims and workflows across designs

A compact way to see why these tokens are not interchangeable is to compare what you actually hold, when it earns, and how you get out.

| Protocol/design | Form of the claim | When it earns fees | Redemption path |
|---|---|---|---|
| Uniswap v2 | Fungible ERC‑20 LP token representing a pro‑rata share of both pool assets [1] | Fees from 0.3% swaps accrue to pool and are paid out pro‑rata when you withdraw [2] | Burn LP tokens to redeem your share of current reserves (both assets) [1] |
| Uniswap v3 | Non‑fungible, range‑bounded position with chosen price ticks [3] | Earns only while price is inside your range; inactive outside the range [3] | Decrease position liquidity and collect assets held by the position at that time [3] |
| Curve | Fungible LP token representing ownership in pool; optional separate gauge staking [4] | Pro‑rata pool fees; gauge staking can add separate token rewards [4] | Burn LP tokens to withdraw; gauge staking is a separate contract and step [4] |

## How fee accrual and redemption actually flow

- Uniswap v2: The pool takes a 0.3% fee on each swap. Those fees are added to the reserves. Liquidity providers do not receive a separate stream; instead, their proportional claim on the enlarged reserves is realized when they burn LP tokens to withdraw [2]. This is why partial redemptions simply return a percentage of whatever the pool holds at that moment, inclusive of fees accumulated since deposit [1] [2].
- Uniswap v3: A position earns fees only while its liquidity is active within the specified range. When the market exits the range, the position holds only one asset and stops accruing fees until price returns. Fees are tied to the position, not to a fungible token share of the entire pool [3].
- Curve: Your LP token represents your share of pool assets and their fee accrual. If you stake in a gauge, that is an extra rewards mechanism on top of the base LP token claim and does not alter how the base claim is redeemed [4].

These differences mean that two pools showing identical recent “APR” can lead to very different realized outcomes. One provider might earn fees steadily with a wide or fungible claim; another might see higher fee density while active but periods of zero earnings if price leaves a narrow band.

## A practical comparison: same fee display, different outcomes

Suppose you compare two opportunities that both show, say, a similar historical fee rate over the past week:

- A Uniswap v2 volatile pair with fungible LP tokens and the standard 0.3% fee. Your outcome will track the pool’s trading volume and the price path between the two assets; your redemption will be a mix of both assets plus embedded fees, in proportion to your share [1] [2].
- A Uniswap v3 pool in the same pair with a narrow range around the current price. While price sits in your range, fees per unit of capital can be higher. If price moves outside your band, your position stops earning and flips into a single asset until you reposition or price returns [3]. Evidence suggests strategies that pursue higher returns also bear higher financial risk and require more active oversight [5].

The question is not “which APR is bigger?” It is “does the structure of the claim and its requirement for active management align with my risk tolerance and operational capacity?” Measure fee income against the probability of being out of range (for v3), the cost and frequency of adjustments, how divergence between the assets affects your end basket, and the fact that realized returns are a function of pool mechanics rather than a linear interest model [3] [5].

For a walk‑through of the mechanics and trade‑offs of provisioning liquidity, see our guide: [How to provide liquidity](/guides/how-to-provide-liquidity). For a deeper dive into range selection and its consequences, see [Concentrated liquidity explained](/guides/concentrated-liquidity-explained).

## What to check before you act

- Exactly what token or position will I hold, and is it fungible (ERC‑20) or a range‑specific position? Where on‑chain is that claim recorded? [1] [3] [4]
- When, precisely, does my position earn fees? Continuously while deposited, only while price is in range, or only if I take an extra staking step? [2] [3] [4]
- How do I redeem? Do I burn LP tokens for a pro‑rata share of pool reserves, or do I decrease a position and collect what it currently holds (possibly just one asset)? [1] [3] [4]
- If the market moves, what happens to my asset mix? Can my position become inactive and stop earning, and what would it cost (gas, spreads) to reposition? [3] [5]
- Are displayed rewards mixing base pool fees with separate incentive programs (e.g., gauges)? If so, can I clearly separate those components? [4]

## Bottom line: treat LP tokens as live claims, not static IOUs

Across designs, the consistent theme is that an LP token or position is a claim on a changing pool state. In v2, that claim is a fungible share of two reserves enlarged by fees. In v3, it is a non‑fungible, range‑dependent claim that can go inactive and turn into a single‑asset holding. In Curve, it is a pool share that you can optionally stake elsewhere for extra rewards. Before depositing, ensure you can articulate the precise asset claim you will hold, how and when it earns, and the exact path to redemption.

## References

1. [Pools — Uniswap Developers](https://developers.uniswap.org/docs/protocols/v2/concepts/pools)
2. [Pools — Uniswap Developers](https://developers.uniswap.org/docs/protocols/v2/concepts/pools)
3. [Uniswap v3 Core](https://app.uniswap.org/whitepaper-v3.pdf)
4. [Providing Liquidity in Pools — Curve Knowledge Hub](https://docs.curve.finance/user/yield/lp)
5. [Risks and Returns of Uniswap V3 Liquidity Providers](https://doi.org/10.1145/3558535.3559772)


[1]: https://developers.uniswap.org/docs/protocols/v2/concepts/pools "Pools — Uniswap Developers"

[2]: https://developers.uniswap.org/docs/protocols/v2/concepts/pools "Pools — Uniswap Developers"

[3]: https://app.uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core"

[4]: https://docs.curve.finance/user/yield/lp "Providing Liquidity in Pools — Curve Knowledge Hub"

[5]: https://doi.org/10.1145/3558535.3559772 "Risks and Returns of Uniswap V3 Liquidity Providers"
