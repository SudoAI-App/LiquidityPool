---
title: "Stablecoin Liquidity Pools: Efficient Curves and Depeg Risk"
description: "Why stablecoin pools feel safe, exactly how they fail, and the one number to watch that tells you to leave before the price does."
category: "LP Mechanics"
date: 2026-08-30
lastReviewed: "2026-09-12"
author: "Aria Chen"
readTime: "7 min read"
keywords: "stablecoin liquidity pool, StableSwap invariant, Curve amplification factor, Ethena USDe, RWA treasury tokens, depeg risk, Uniswap v4 hooks, stablecoin pool risks, correlated asset liquidity pool, peg defense"
featured: false
faq:
  - q: "Are stablecoin liquidity pools safe?"
    a: "They have low divergence while both assets hold their peg and a severe tail when one does not. The amplified curve absorbs a failing asset at close to par, so LPs end up holding predominantly the broken one."
  - q: "Why do stablecoin pools use a different formula?"
    a: "Because assets expected to trade near a fixed ratio need depth concentrated at that ratio. An amplified curve is nearly flat near the peg, allowing large trades with minimal slippage, and steepens as reserves skew."
  - q: "What happens if a stablecoin depegs?"
    a: "Traders sell it into the pool while the curve still quotes near par. The pool accumulates it until reserves are heavily imbalanced, at which point price impact rises sharply and the LP position is dominated by the depegged asset."
---

A stablecoin pool looks like the sensible choice. Both sides are meant to be worth a dollar, so nothing can really go wrong, and you collect a few percent for doing very little.

That is true right up until it is not. The same design that makes these pools so efficient also makes them the last place a failing token goes to be sold, and you are the buyer.

This guide covers why the curve is shaped the way it is, what actually happens during a depeg, and the one number to watch that tells you to leave well before the price does.

<figure class="article-figure">
  <img src="/images/guides/stablecoin-liquidity-pools.webp" alt="Two reserve vessels connect through a flat channel that bends as one side becomes imbalanced." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Stable-asset curves are efficient near balance and defensive under stress. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"Your upside here is 3% to 8% a year in fees. Your downside is the whole position. When a stable token breaks, the curve sells your healthy dollars to arbitrage at nearly full price and leaves you holding all of the broken one. The trade is fine as long as you are honest about what it actually is."*

## Why these pools use a different curve

Two ordinary approaches, two bad outcomes [1] [2].

An ordinary pool spreads money across every price from zero upward. For a pair meant to trade at one-for-one, almost all of it sits somewhere useless, and even small trades cost something.

A perfectly flat curve fixes the cost but has no defence. The moment the real price moves a fraction of a cent, traders empty one side completely.

The stable-pair design sits between them. Near balance it behaves like the flat rule, so large trades cost almost nothing. As the balances skew, it bends toward the ordinary rule, which keeps the pool from being drained [2].

One setting, called amplification, decides where that bend happens:

| Amplification | What the curve looks like | Consequence |
| :--- | :--- | :--- |
| Low | Close to an ordinary pool | Higher cost per trade, but the price warns you early |
| Typical for fiat stablecoins, 50 to 2,000 | Very flat around par | Huge trades at almost no cost, and no warning until late |
| Very high | Almost perfectly flat | Superb efficiency, and a cliff edge you cannot see coming |

Turn it up and the pool quotes 0.999 even when most of the healthy side is already gone. That is the whole problem in one sentence. See [Constant Product Formula](/guides/constant-product-formula/).

## Not all stable tokens are the same

Four different kinds of pegged token end up in these pools, and they break in four different ways.

| Type | Examples | Where the yield comes from | How it breaks |
| :--- | :--- | :--- | :--- |
| Backed by real dollars | USDC, USDT | The issuer keeps it | A bank fails, or an address gets frozen [5] |
| Hedged synthetic dollars | Ethena USDe | Staking yield plus futures funding | An exchange fails, or funding stays negative [6] |
| Tokenised treasuries | BUIDL, USDY | Government debt, passed through | Transfer restrictions freeze your exit [7] |
| Staked-ETH tokens | wstETH, eETH | Validator rewards | The redemption queue is weeks long [2] |

Three of those deserve a note.

**Dollar-backed tokens depend on banking hours.** When Silicon Valley Bank failed on a Friday in March 2023, the issuer's own redemption could not run over the weekend. Every trade went through pools instead, which is why the price moved as far as it did [5].

**Hedged synthetic dollars depend on somebody else's exchange.** The hedge lives on a centralised venue. If that venue fails, or if funding stays negative long enough, the backing erodes unless a reserve fund covers it [6].

**Staked-ETH tokens depend on a queue.** They trade near par until a lot of people want out at once. Then nobody waits weeks, so they all sell into the pool, and the pool is you.

## What actually happens during a depeg

The sequence is always the same, and it is faster than you think.

1. **Somebody finds out first.** Informed traders and bots see a credit event before it reaches the news [4] [5].
2. **They sell into your pool.** They borrow the suspect token, dump it, and take out the healthy one. Because the curve is flat, they get near-par prices for it [2] [5].
3. **The healthy side runs out.** By the time the price visibly falls to 0.80, the good token is gone. Nothing is left to sell.
4. **You withdraw and get the broken one.** All of it.

Follow the balances rather than the price. The pool can still be quoting 0.995 after 70% of the healthy reserves have been extracted. The price is the last thing to tell you, and by then there is nothing to save.

Federal Reserve research makes the same point from the other direction: pools provide excellent liquidity in normal conditions, and prices diverge fast under stress when the issuer's own redemption is slow or restricted [5]. See [TVL Explained](/guides/tvl-explained/) for how headline numbers hide this.

## The one number to watch

The reserve split. Not the price.

| Pool balance | What it means | What to do |
| :--- | :--- | :--- |
| Near 50/50 | Normal | Nothing |
| 60/40 | Somebody is selling steadily | Find out why |
| 65/35 | The healthy side is going | Leave. The exit cost is small now |
| 70/30 | Informed money is well ahead of you | Leave immediately and accept the cost |
| 85/15 and beyond | The cliff | The healthy side is effectively gone |

Set an alert on it. This is the single highest-value thing you can do in a stable pool, and almost nobody does it.

## What people get wrong about stable pools

| What people assume | What actually happens |
| :--- | :--- |
| The tight price proves the peg is fine | A high amplification setting quotes 0.999 with 75% of the healthy collateral already drained |
| Deep pool liquidity means I can always exit | Pool liquidity vanishes in minutes. Issuer redemption takes days and needs paperwork |
| A tight range on a stable pair is free money | A band of 0.9995 to 1.0005 converts completely on a five basis point move, which is a normal Tuesday |
| The hedge on a synthetic dollar is set and forget | Sustained negative funding bleeds the backing every day it continues |

## How newer pools can defend themselves

Older pools are passive. They cannot react to a run. Uniswap v4 lets a pool attach code that can [7].

- **A fee that spikes on a discount.** The pool compares its own price to an outside reference. If the gap passes a threshold, the fee jumps from 0.01% to several percent. Panic sellers pay for the privilege, and that money goes to whoever is still providing liquidity.
- **A circuit breaker.** If one token flows out faster than a set limit per hour, the pool pauses one-sided withdrawals. That buys time for the issuer to process real redemptions instead of letting bots drain the collateral first.
- **Yield paid straight into the pool.** For tokens that earn, the code can route that yield into the fee pot rather than rebasing balances, which keeps the accounting simple.

## What to check before you deposit

1. **What actually backs each token?** Read the reserve disclosure. For synthetic dollars, compare the insurance fund against the size of the position it is insuring.
2. **How high is the amplification setting?** A very high one means great efficiency and no warning. Know which trade you are making.
3. **Could you redeem directly in a crisis?** If the answer is no, the pool is the only exit and everybody will use it at once [5].
4. **If you are using a range, where is the bottom?** A band that assumes a perfect peg deactivates on the first wobble. Set it to survive a historically normal depeg, something like 0.985 to 1.015 [1].
5. **What else is in the contract?** Meta-tokens, rebasing assets and bridge wrappers each add a way to lose money that has nothing to do with the peg [8]. See [Liquidity Pool Risks](/guides/liquidity-pool-risks/).

## Where to watch the numbers

- **Peg deviations, supply and backing:** [DeFiLlama Stablecoins](https://defillama.com/stablecoins).
- **Pool balance and the amplification setting:** [Curve Finance](https://curve.fi).
- **Alerts:** set one on reserve imbalance past 60/40, not on price.

## When something goes wrong

- **The pool has skewed past 70/30.** Informed money is selling the over-represented token and they are ahead of you. Withdraw now and accept the exit cost. It is far smaller than what comes next.
- **Governance changed the amplification setting.** The curve's shape just changed under you. Check the new value suits how much these assets can actually diverge.
- **The market price is below par but redemption is fine.** Work out whether the issuer's queue is congested or actually broken. One is a buying opportunity and the other is a trap.

## Where to go next

For where these curves sit among the alternatives, see [Types of Liquidity Pools](/guides/liquidity-pool-types/). For the tail case in full, see [Can You Lose Money in a Liquidity Pool?](/guides/can-you-lose-money-in-a-liquidity-pool/). For how this compares with lending the same assets, see [Lending Pool vs Liquidity Pool](/guides/lending-pool-vs-liquidity-pool/).

## References

1. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [StableSwap pools (Curve Documentation)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
3. [StableSwap - Efficient Mechanism for Stablecoin Liquidity](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Maximal Extractable Value (MEV) Overview](https://ethereum.org/en/developers/docs/mev/)
5. [Primary and Secondary Markets for Stablecoins | Federal Reserve](https://www.federalreserve.gov/econres/notes/feds-notes/primary-and-secondary-markets-for-stablecoins-20240223.html)
6. [How USDe Works (Ethena Documentation)](https://docs.ethena.fi/overview/how-usde-works)
7. [Uniswap v4 Core Whitepaper](https://uniswap.org/whitepaper-v4.pdf)
8. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
9. [While Stability Lasts: A Stochastic Model of Non-Custodial Stablecoins (Klages-Mundt & Minca, 2020)](https://arxiv.org/abs/2004.01304)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[2]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "StableSwap pools (Curve Documentation)"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap - Efficient Mechanism for Stablecoin Liquidity"
[4]: https://ethereum.org/en/developers/docs/mev/ "Maximal Extractable Value (MEV) Overview"
[5]: https://www.federalreserve.gov/econres/notes/feds-notes/primary-and-secondary-markets-for-stablecoins-20240223.html "Primary and Secondary Markets for Stablecoins | Federal Reserve"
[6]: https://docs.ethena.fi/overview/how-usde-works "How USDe Works (Ethena Documentation)"
[7]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[8]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[9]: https://arxiv.org/abs/2004.01304 "While Stability Lasts: A Stochastic Model of Non-Custodial Stablecoins (Klages-Mundt & Minca, 2020)"
