---
title: "Balancer Weighted Pools: How 80/20 and Multi-Asset Pools Work"
description: "Why an 80/20 pool sells less of your token on the way up, how weighted pricing works, what a liquidity bootstrapping pool does, and what Balancer v3 changed."
category: "LP Mechanics"
date: 2026-09-06
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "8 min read"
keywords: "Balancer weighted pools, 80/20 liquidity pools, constant mean formula, impermanent loss 80/20, Balancer v3, LBP, weighted liquidity pool, Balancer weighted pool, 80/20 liquidity pool"
featured: false
faq:
  - q: "What is a weighted liquidity pool?"
    a: "A pool whose assets are held at fixed value proportions such as 80/20 rather than 50/50, priced by a constant-mean invariant. It behaves like a continuously rebalanced index with a fee stream attached."
  - q: "Do 80/20 pools reduce impermanent loss?"
    a: "For the same price move, yes, because less of the portfolio rotates. The position keeps more directional exposure to the heavier asset, which is a feature for some mandates and a risk for others."
  - q: "What is a liquidity bootstrapping pool?"
    a: "A weighted pool whose weights shift over time, typically starting heavily weighted toward the token being sold. The shifting weights create downward price pressure that discourages early buying at inflated prices."
---

Say you hold a token you believe in and you want to earn fees on it. A normal pool makes you put in half your money in USDC, then sells your token every time it goes up. You wanted exposure. The pool keeps taking it away.

Balancer lets you set the split yourself. An 80/20 pool holds 80% of its value in your token and 20% in the quote asset. When the price rises, it still sells. But if your token doubles, a 50/50 pool sells about 29% of your tokens and an 80/20 pool sells about 13%.

That one change is why treasuries, DAOs and long-term holders use these pools. This guide covers how weighted pricing works, how much less it costs you, how token launches use shifting weights, and what to check before you deposit.

<figure class="article-figure">
  <img src="/images/guides/balancer-and-weighted-pools.webp" alt="Table comparing 50/50, 80/20 and 95/5 pools on shortfall against holding, tokens sold when the price doubles, and price impact." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Heavier weighting cuts the shortfall against holding, and pays for it with thinner depth on the light side. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"An 80/20 pool is a rebalancing rule with a fee stream bolted on. It sells well under half of what a 50/50 pool sells on the same move, so the drag against holding roughly halves. But nothing is free. Your money is spread thinner, routers send you less flow, and the fee income falls with it. You are buying exposure and paying for it in yield."*

## How a weighted pool sets its price

Every pool has an invariant — the one relationship between its token balances that it refuses to break. An ordinary pool keeps two balances multiplied together at a fixed number. A weighted pool does the same thing, except each balance is raised to the power of its weight first [1] [4].

$$
V = \prod_{i=1}^n B_i^{w_i}
$$

Where:

- $B_i$ is how much of token $i$ the pool holds.
- $w_i$ is that token's share of the pool's value, and all the weights add up to 1.
- $n$ is how many tokens are in the pool, from two up to eight.
- $V$ is the number the pool keeps level as it trades.

You do not need to compute that to use it. What matters is the consequence: the pool always steers its holdings back toward the value split you chose. Token doubles in price? The pool sells just enough to get back to 80/20, and no more.

Price works out the same way. Divide each balance by its weight, then compare the two.

In a 50/50 pool the weights cancel and you get the familiar ratio of balances. In an 80/20 pool they do not cancel. At any given price the heavy side holds four times the value of the light side, so the light side is the one that runs out first [1] [3]. The two-token version is covered in [Constant Product Formula](/guides/constant-product-formula/).

## Why the smaller side sets your trading cost

A weighted pool is only as deep as its smaller side. In an 80/20 pool that is the 20% slice, and it limits trades in both directions.

Here is what a trade moves the rate by, before fees, in two pools holding the same total value.

| Trade size, as a share of the pool | 50/50 pool | 80/20, buying the heavy token | 80/20, selling the heavy token |
| :--- | ---: | ---: | ---: |
| 1% | 2.0% | 3.0% | 3.0% |
| 10% | 16.7% | 22.9% | 24.9% |
| 20% | 28.6% | 36.4% | 41.0% |

Two things stand out. The same money buys you less depth in an 80/20 pool, whichever way you trade. And at size, selling the heavy token gets expensive faster than buying it, because every sale drains the small slice.

Plan your exit before your entry. A large holder leaving an 80/20 pool in a hurry pays for that thin side.

## How much less an 80/20 pool costs you

Impermanent loss is the gap between what your deposit is worth and what the same tokens would have been worth if you had just held them [2]. Weighting shrinks that gap, because the pool sells less on the way up.

The numbers are worth sitting with. Each row is the same price move, measured against holding.

| Token price moves | 50/50 pool | 80/20 pool | 90/10 pool | 95/5 pool |
| :--- | ---: | ---: | ---: | ---: |
| Up 25% | -0.62% | -0.38% | -0.21% | -0.11% |
| Up 50% | -2.02% | -1.20% | -0.66% | -0.35% |
| Doubles | -5.72% | -3.27% | -1.79% | -0.93% |
| Up 4x | -20.00% | -10.84% | -5.89% | -3.06% |
| Up 5x | -25.46% | -13.72% | -7.46% | -3.89% |

Read the bottom row. Your token goes up fivefold. In a 50/50 pool you end up about 25% behind simply holding. In an 80/20 pool you end up about 14% behind. That is a real difference on a treasury position, and it is still not zero.

Here is the rule behind the table:

$$
\text{IL} = \frac{k^{w}}{w \cdot k + (1 - w)} - 1
$$

Where:

- $k$ is the price now divided by the price when you deposited.
- $w$ is the weight of the token that moved, so 0.8 in an 80/20 pool.
- The result is negative, and it is how far behind holding you are.

Push $w$ toward 1 and the whole expression goes to zero. A pool that is 100% one token never sells anything, so it never falls behind. It also never earns a fee. Everything in between is that trade-off priced out. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/) for the same idea from the 50/50 side.

## What you give up for that protection

Lower drag is not free, and the cost shows up in three places.

- **Thinner depth.** Only a fifth of the pool sits on the quote side, so large sells run out of room quickly.
- **Less routing.** Aggregators send trades where the fill is best. A lopsided pool often loses that comparison, so volume and fees go elsewhere.
- **Kept exposure.** You still hold 80% of a falling token on the way down. Weighting cuts the selling, not the risk.

## How token launches use shifting weights

A liquidity bootstrapping pool, or LBP, is a weighted pool whose weights move on a schedule [5]. Projects use it to sell a new token without needing much cash up front.

The usual problem with a launch is that a project must fund half the pool in stablecoins, and bots buy the first block cheaply and sell into the crowd. Shifting weights fix both.

| Point in a 72-hour sale | Weights | What it does |
| :--- | :--- | :--- |
| Start | 95% token, 5% USDC | High starting price, almost no cash needed |
| Halfway | 60% token, 40% USDC | Price drifts down on its own |
| End | 50% token, 50% USDC | Normal trading from here |

As the contract walks the weights down, the quoted price falls unless people buy. That constant downward pull does three useful things. Bots that snipe the open are immediately underwater. Buyers can wait for a price they think is fair. And the project launches deep liquidity with a fraction of the usual collateral.

If you are buying in one of these, the first two hours are the worst time to do it.

## What Balancer v3 changed under the hood

Balancer v3 moved every pool into one vault contract, a design called a singleton — all pools living in a single contract rather than one contract per pool [3] [6].

- **One place for the tokens.** Pool logic and token custody are separate now, so a trade routed through several pools moves tokens once at the end rather than at every hop.
- **Pools can run custom code.** Hooks let a pool change its own behaviour: raising the fee when the market gets jumpy, sending arbitrage profit back to depositors, or lending idle reserves out for extra yield.

A hook is code somebody wrote, and it can change fees or restrict withdrawals. Find out whether it is fixed or can be changed later. [Uniswap v4 Architecture](/guides/uniswap-v4-architecture-and-hooks/) covers the same shift on the other side of the market.

## What people get wrong about weighted pools

| What people assume | What actually happens |
| :--- | :--- |
| The weights drift as prices move | The weights are fixed. The pool moves the token quantities to keep the value split, which means selling the winner |
| More tokens in a pool means more safety | One broken token in an eight-token pool drains the rest, because traders dump it in and take the good assets out |
| An LBP is a cheap way to buy early | The price is designed to fall. Buying at the open means buying the highest price of the sale |
| Exiting is as cheap as entering | Pulling out one-sided from the heavy side runs straight into the thin side and costs you |

## What to check before you deposit

1. **Does the split match what you want to hold?** An 80/20 pool keeps you long. That is the point, and it is also the risk if you are not sure about the token.
2. **Have you looked at every token in the pool?** In a pool with more than two assets, one bad contract puts all of them at risk. Check each one for mint and blacklist powers.
3. **Does the fee income justify it?** Compare the pool's daily fees against how much the pair moves. Thin routing plus a volatile token is a losing combination [7].
4. **Can the hooks change?** In v3, find out whether a hook is fixed forever or sits behind a key somebody holds [6].
5. **How will you get out?** Model a proportional exit and a single-token exit. The difference is usually larger than people expect.

## Where to watch the numbers

- **Live pool balances, invariant values and fee yields:** [Balancer Analytics](https://dune.com/balancer).
- **Pool size and incentive flows across protocols:** [DeFiLlama](https://defillama.com).
- **Position modelling across different weightings:** [Revert Finance](https://revert.finance).

## When something goes wrong

- **One token in the pool is draining fast.** Its market price is falling and traders are dumping it into the pool to take out the healthy assets. If the damage looks permanent, exit before the reserve runs dry.
- **Fees are lower than a plain 50/50 pool.** Heavy weighting made the pool unattractive to routers. Move toward 80/20, or use a fee that rises with volatility.
- **Your allocation has drifted from what you wanted.** A strong trend has pushed the dollar split away from target. Rebalance, or offset the exposure elsewhere.

## Where to go next

For where weighted pools sit among the other designs, see [Types of Liquidity Pools](/guides/liquidity-pool-types/). For the arithmetic that weighting softens but never removes, see [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

## References

1. [Balancer: A Non-Custodial Portfolio Manager, Liquidity Provider, and Price Sensor (Martinelli & Mushegian, 2019)](https://balancer.fi/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
3. [Weighted Pool (Balancer Documentation)](https://docs.balancer.fi/concepts/explore-available-balancer-pools/weighted-pool/weighted-pool.html)
4. [Constant Function Market Makers: Multi-asset Trades via Convex Optimization (Angeris et al., 2020)](https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf)
5. [Liquidity Bootstrapping Pool (Balancer Documentation)](https://docs.balancer.fi/concepts/explore-available-balancer-pools/liquidity-bootstrapping-pool/liquidity-bootstrapping-pool.html)
6. [Balancer v3 Core Architecture and Monorepo](https://github.com/balancer/balancer-v3-monorepo)
7. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
8. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)

[1]: https://balancer.fi/whitepaper.pdf "Balancer: A Non-Custodial Portfolio Manager, Liquidity Provider, and Price Sensor (Martinelli & Mushegian, 2019)"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://docs.balancer.fi/concepts/explore-available-balancer-pools/weighted-pool/weighted-pool.html "Weighted Pool (Balancer Documentation)"
[4]: https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf "Constant Function Market Makers: Multi-asset Trades via Convex Optimization (Angeris et al., 2020)"
[5]: https://docs.balancer.fi/concepts/explore-available-balancer-pools/liquidity-bootstrapping-pool/liquidity-bootstrapping-pool.html "Liquidity Bootstrapping Pool (Balancer Documentation)"
[6]: https://github.com/balancer/balancer-v3-monorepo "Balancer v3 Core Architecture and Monorepo"
[7]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[8]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
