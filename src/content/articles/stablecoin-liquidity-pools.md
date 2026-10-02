---
title: "Stablecoin Liquidity Pools: Efficient Curves and Depeg Risk"
description: "Why stablecoin pools feel safe, exactly how they fail, and the one number to watch that tells you to leave before the price does."
category: "LP Mechanics"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "stablecoin liquidity pool"
keywords: "stablecoin liquidity pool, StableSwap invariant, Curve amplification factor, Ethena USDe, RWA treasury tokens, depeg risk, Uniswap v4 hooks, stablecoin pool risks, correlated asset liquidity pool, peg defense"
featured: false
faq:
  - q: "Are stablecoin liquidity pools safe?"
    a: "They have low divergence while both assets hold their peg and a severe tail when one does not. The amplified curve absorbs a failing asset at close to par, so LPs end up holding predominantly the broken one."
  - q: "Why do stablecoin pools use a different formula?"
    a: "Because assets expected to trade near a fixed ratio need depth concentrated at that ratio. An amplified curve is nearly flat near the peg, allowing large trades with minimal slippage, and steepens as reserves skew."
  - q: "What happens if a stablecoin depegs?"
    a: "Traders sell it into the pool while the curve still quotes near par. The pool accumulates it until reserves are heavily imbalanced, at which point price impact rises sharply and the LP position is dominated by the depegged asset."
  - q: "What should I watch first in a stablecoin pool?"
    a: "The peg of each asset and the pool’s exposure to the weak side. Depth near one, the curve’s amplification, and how quickly the pool can be drained of the depegging token matter more than the headline APY."
---

A stablecoin pool looks like the sensible choice. Both sides are meant to be worth a dollar, so little seems able to go wrong, and you collect a fee yield for doing very little.

That holds right up until one of the tokens loses its peg. The design that makes these pools so efficient also makes them the easiest place to sell a failing token at close to full price, and the pool's depositors are the buyers.

By the end you should know why the curve is shaped the way it is, what happens to your position during a depeg, and which number warns you before the price does.

<figure class="article-figure">
  <img src="/images/guides/stablecoin-liquidity-pools.webp" alt="Two reserve vessels connect through a flat channel that bends as one side becomes imbalanced." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Stable-asset curves are efficient near balance and defensive under stress. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Your upside is a modest fee yield, because stable pairs trade with small fees. Your downside, if one token breaks, is ending up with most of your position in the broken token. The curve keeps quoting near par while sellers swap the broken token for your healthy one, so the price tells you late. The reserve split tells you early.

## Why these pools use a different curve

Two ordinary approaches, two weak outcomes [2] [3].

An ordinary pool spreads money across every price from zero upward. For a pair meant to trade at one-for-one, most of it sits at prices that never trade, and even small trades cost something.

A perfectly flat curve fixes the cost but has no defence. Once the real price moves a fraction of a cent, traders can empty one side completely.

The stable-pair design, StableSwap, sits between them. Near balance it behaves like the flat rule, so large trades cost almost nothing. As the balances skew, it bends toward the ordinary rule, which keeps the pool from being drained outright [2] [3]. The same idea stretched over volatile pairs, with the flat zone following the market, is [Curve v2 Explained](/guides/curve-v2-cryptoswap-explained/).

One setting, called amplification (A), decides how long the curve stays flat [4]. The table shows the trade-off.

| Amplification | What the curve looks like | Consequence |
| :--- | :--- | :--- |
| Lower, such as 50 to 200 | Liquidity spread more evenly | Price drifts from the peg gradually as the pool skews |
| Higher, such as 1,000 to 20,000 | Liquidity packed tightly at the peg | Pool can become very lopsided before the price moves, then drops sharply |

Turn it up and the quote stays near par long after the balances have shifted. At A = 1,000, a two-token pool that started balanced still quotes 0.999 with about half of its healthy side gone. Research on curve shape makes the same trade-off formal: flat curves suit coins with a stable value, and steeper curves protect depositors better when traders know more than the pool does [10]. For the constant-product baseline, see [Constant Product Formula](/guides/constant-product-formula/).

## Not all stable tokens are the same

Four different kinds of pegged token end up in these pools, and they break in four different ways.

| Type | Examples | What holds the value | How it breaks |
| :--- | :--- | :--- | :--- |
| Backed by bank deposits and bills | USDC, USDT | Issuer reserves; only approved customers can redeem directly [6] | A reserve bank fails, or redemptions stall [6] |
| Hedged synthetic dollars | Ethena USDe | Crypto held with short futures hedges, plus stable assets [7] | Long negative funding, or a custody or exchange failure |
| Tokenised treasury funds | Various issuers | Short-term government debt | Holder restrictions can limit who can buy from you |
| Liquid staking tokens | wstETH, eETH | Staked ETH and its rewards | Exiting staking means waiting in a queue [8] |

Three of those deserve a note.

**Dollar-backed tokens depend on banking hours.** When Silicon Valley Bank failed in March 2023, Circle said USDC issuance and redemption were constrained by US banking hours [6]. Only Circle's direct customers can redeem at all [6]. USDC fell below 90 cents, and decentralised exchange volume passed $20 billion on March 11, against a typical $1 billion to $3 billion a day [6].

**Hedged synthetic dollars depend on the hedge.** USDe pairs its volatile backing with short futures of about the same size, and keeps the backing with off-exchange custodians [7]. Periods when the protocol's revenue turns negative, as it can when funding rates do, are absorbed by a reserve fund [7]. A long stretch of that, or a failure at a custodian or exchange, would test the buffer.

**Liquid staking tokens depend on a queue.** Leaving Ethereum staking means waiting in a withdrawal queue whose length depends on demand [8]. When many holders want out at once, selling into a pool is faster than waiting, so the pool takes the selling.

## What happens to your position during a depeg

The pattern repeats across depegs.

1. **Informed holders move first.** Large holders and bots react to the news, or to the first signs of it.
2. **They sell into your pool.** They swap the suspect token for the healthy one. Because the curve is flat near balance, they get close to par [2].
3. **The healthy side runs down.** The quoted price barely moves while it happens.
4. **You withdraw and get mostly the broken one.** A proportional withdrawal hands you whatever mix the pool now holds.

Here is a worked example, before fees. You deposit $10,000 as 5,000 of each token into a pool with A = 100. One token falls to $0.90 on the wider market, and arbitrage trades the pool until it quotes the same price.

- **The pool now holds**, for your share, about 9,324 of the weak token and 742 of the healthy one. That is worth about $9,133.
- **Holding the original tokens** would be worth $9,500. You are 3.9% behind holding.
- **Against the $10,000 you put in**, you are 8.7% down.

An ordinary constant-product pool would trail holding by only 0.14% on the same move. At A = 1,000 the stable pool trails by 4.8%. The flat curve is what bought you the extra weak tokens on the way down. That shortfall against holding is known as impermanent loss. The [impermanent loss calculator](/tools/impermanent-loss-calculator/) models the constant-product case, so treat its result as the floor for a stable pool, not the estimate.

The Federal Reserve's study of the March 2023 event stresses who can reach the issuer's own redemption, because that access shapes how far market prices can stray [6]. Headline pool size shows none of this; [TVL Explained](/guides/tvl-explained/) covers what it leaves out.

## The one number to watch

Watch the reserve split, not the price. The table shows what a two-token pool quotes, before fees, as one token is sold in.

| Pool split (weak / healthy) | Healthy side gone | Quoted price, A = 100 | Quoted price, A = 1,000 |
| :--- | ---: | ---: | ---: |
| 60/40 | 20% | 0.9978 | 0.9998 |
| 70/30 | 40% | 0.9944 | 0.9994 |
| 80/20 | 60% | 0.9857 | 0.9985 |
| 90/10 | 80% | 0.9430 | 0.9939 |
| 95/5 | 90% | 0.8074 | 0.9758 |

At A = 1,000 the price stays above 0.99 until four-fifths of the healthy side is gone. The split moves long before that.

There is no universal exit line. What matters is how fast you can act and how far the split has moved.

Once the pool is lopsided, a proportional withdrawal hands you the lopsided mix. Taking out only the healthy token is priced like a trade, so it costs you price impact — the worse rate a trade gets because it shifts the pool's balances. The earlier you act on a steady drift, the cheaper leaving is. Setting an alert on the split, rather than the price, is the cheapest protection you can add.

## How newer pools can defend themselves

Older pools are passive. They charge the same fee during a run as on a quiet day.

Curve's Stableswap-NG pools already raise the fee when the balances are far from even, using a setting called the off-peg fee multiplier [5]. Uniswap v4 goes further and lets a pool attach hooks — custom code the pool runs at set points such as before a swap or withdrawal [9]. Designs that hooks make possible include:

- **A fee that rises on a discount.** Hooks can set a dynamic fee [9]. A pool could raise its fee sharply when its price falls away from an outside reference, so panic sellers pay more to the depositors still providing liquidity.
- **Limits on withdrawals.** A hook can run before liquidity is removed [9], so it could slow one-sided withdrawals during a run. The same power can trap you, so read what any hook is allowed to do.
- **Yield paid straight to depositors.** The v4 design lets hooks donate tokens directly to in-range liquidity providers [9].

## What to check before you deposit

1. **What backs each token?** Read the reserve disclosure. For synthetic dollars, compare the reserve fund with the size of what it insures.
2. **How high is the amplification setting?** A higher setting gives cheaper trades and later warning. Know which trade you are making.
3. **Could you redeem directly in a crisis?** If not, the pool is your only exit, and other holders will use it too [6].
4. **If you use a price range, where is the bottom?** A concentrated position is only active inside its range and converts fully to one token outside it [1]. A band of 0.9995 to 1.0005 converts completely on a move of five basis points (0.05%). Set the band from how far this token has actually strayed before.
5. **What else is in the contract?** Rebasing tokens, metapools and bridge wrappers each add a way to lose money that has nothing to do with the peg [11]. See [Liquidity Pool Risks](/guides/liquidity-pool-risks/).

## Where to watch the numbers

- **Peg deviations, supply and backing:** [DeFiLlama Stablecoins](https://defillama.com/stablecoins).
- **Pool balance and the amplification setting:** [Curve Finance](https://curve.fi).
- **Alerts:** set one on a steady shift in the reserve split, not on the price.

## When something goes wrong

- **The split is drifting steadily one way.** Somebody is selling the over-represented token. Find out why before the price confirms it, because each hour of drift makes your exit worse.
- **The amplification setting is being changed.** The curve's shape is changing under you. Check that the new value suits how far these assets can actually diverge.
- **The market price is below par but redemption still works.** Work out whether the issuer's queue is congested or actually broken. A congested queue tends to clear. A broken one does not.

## Where to go next

To see where these curves sit among the alternatives, read [Types of Liquidity Pools](/guides/liquidity-pool-types/). [Can You Lose Money in a Liquidity Pool?](/guides/can-you-lose-money-in-a-liquidity-pool/) covers the tail case in full. If you are weighing a stable pool against lending the same tokens, [Lending Pool vs Liquidity Pool](/guides/lending-pool-vs-liquidity-pool/) compares the two.

## References

1. [Concentrated Liquidity (Uniswap Developers)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Curve StableSwap Exchange: Overview (Curve Documentation)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
3. [StableSwap - Efficient Mechanism for Stablecoin Liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Cryptoswap: In Depth (Curve Documentation)](https://docs.curve.finance/developer/amm/cryptoswap-in-depth)
5. [Stableswap-NG: Overview (Curve Documentation)](https://docs.curve.finance/developer/amm/stableswap-ng/overview)
6. [Primary and Secondary Markets for Stablecoins (Federal Reserve FEDS Notes, 2024)](https://www.federalreserve.gov/econres/notes/feds-notes/primary-and-secondary-markets-for-stablecoins-20240223.html)
7. [How USDe Works (Ethena Documentation)](https://docs.ethena.fi/overview/how-usde-works)
8. [Staking withdrawals (ethereum.org)](https://ethereum.org/en/staking/withdrawals/)
9. [Uniswap v4 Core (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
10. [When does the tail wag the dog? Curvature and market making (Angeris et al., 2020)](https://arxiv.org/abs/2012.08040)
11. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developers)"
[2]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview (Curve Documentation)"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap - Efficient Mechanism for Stablecoin Liquidity (Egorov, 2019)"
[4]: https://docs.curve.finance/developer/amm/cryptoswap-in-depth "Cryptoswap: In Depth (Curve Documentation)"
[5]: https://docs.curve.finance/developer/amm/stableswap-ng/overview "Stableswap-NG: Overview (Curve Documentation)"
[6]: https://www.federalreserve.gov/econres/notes/feds-notes/primary-and-secondary-markets-for-stablecoins-20240223.html "Primary and Secondary Markets for Stablecoins (Federal Reserve FEDS Notes, 2024)"
[7]: https://docs.ethena.fi/overview/how-usde-works "How USDe Works (Ethena Documentation)"
[8]: https://ethereum.org/en/staking/withdrawals/ "Staking withdrawals (ethereum.org)"
[9]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core (Adams et al., 2024)"
[10]: https://arxiv.org/abs/2012.08040 "When does the tail wag the dog? Curvature and market making (Angeris et al., 2020)"
[11]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
