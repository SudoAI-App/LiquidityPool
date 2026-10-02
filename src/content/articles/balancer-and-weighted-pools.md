---
title: "Balancer Weighted Pools: How 80/20 and Multi-Asset Pools Work"
seoTitle: "Balancer Weighted Pools: How 80/20 & Multi-Asset Pools Work"
description: "Why an 80/20 pool sells less of your token on the way up, how weighted pricing works, what a liquidity bootstrapping pool does, and what Balancer v3 changed."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "10 min read"
primaryQuery: "Balancer weighted pools"
keywords: "Balancer weighted pools, 80/20 liquidity pools, constant mean formula, impermanent loss 80/20, Balancer v3, LBP, weighted liquidity pool, Balancer weighted pool, 80/20 liquidity pool"
featured: false
faq:
  - q: "What is a weighted liquidity pool?"
    a: "A pool whose assets are held at fixed value proportions such as 80/20 rather than 50/50, priced by a constant-mean invariant. It behaves like a continuously rebalanced index with a fee stream attached."
  - q: "Do 80/20 pools reduce impermanent loss?"
    a: "For the same price move, yes, because less of the portfolio rotates. The position keeps more directional exposure to the heavier asset, which is a feature for some mandates and a risk for others."
  - q: "What is a liquidity bootstrapping pool?"
    a: "A weighted pool whose weights shift over time, typically starting heavily weighted toward the token being sold. The shifting weights create downward price pressure that discourages early buying at inflated prices."
  - q: "Is an 80/20 pool always better than a 50/50 pool for the heavy asset?"
    a: "It rotates less when the heavy asset moves, so divergence against holding shrinks. The cost is depth on the light side: the same capital quotes a wider spread, and fee income depends on routed volume clearing that wider cost."
---

Say you hold a token you believe in and you want to earn fees on it. A normal pool makes you put in half your money in USDC, then sells your token every time it goes up. You wanted exposure. The pool keeps taking it away.

Balancer lets you set the split yourself. An 80/20 pool holds 80% of its value in your token and 20% in the quote asset. When the price rises, it still sells. But if your token doubles, a 50/50 pool sells about 29% of its tokens and an 80/20 pool sells about 13%.

That one change is why treasuries, DAOs and long-term holders use these pools. By the end you should be able to judge whether the exposure you keep is worth the fee income you give up.

<figure class="article-figure">
  <img src="/images/guides/balancer-and-weighted-pools.webp" alt="Table comparing 50/50, 80/20 and 95/5 pools on shortfall against holding, tokens sold when the price doubles, and price impact." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Heavier weighting cuts the shortfall against holding, and pays for it with thinner depth on the light side. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> An 80/20 pool is a rebalancing rule with a fee stream attached. On the same rise it sells well under half as many tokens as a 50/50 pool, and its shortfall against holding is roughly 40% to 45% smaller. The cost is thinner depth on the light side, which tends to mean less routed volume and less fee income. You are buying exposure and paying for it in yield.

## How a weighted pool sets its price

Every pool has an invariant — the one relationship between its token balances that it refuses to break. An ordinary pool keeps two balances multiplied together at a fixed number. A weighted pool does the same thing, except each balance is raised to the power of its weight first [1] [3].

$$
V = \prod_{i=1}^n B_i^{w_i}
$$

Where:

- $B_i$ is how much of token $i$ the pool holds.
- $w_i$ is that token's share of the pool's value, and all the weights add up to 1.
- $n$ is how many tokens are in the pool. Balancer v3 allows up to eight, and no weight may be below 1% [2].
- $V$ is the number the pool keeps level as it trades.

You do not need to compute that to use it. What matters is the consequence: the weights never change. What changes is how many tokens the pool holds. If your token doubles in price, the pool sells just enough of it to get back to an 80/20 value split, and no more.

Price works out the same way. Divide each balance by its weight, then compare the two [1].

In a 50/50 pool the weights cancel and you get the familiar ratio of balances. In an 80/20 pool they do not cancel. The heavy side always holds four times the value of the light side, so the light side is the one a large trade runs through first. The two-token version is covered in [Constant Product Formula](/guides/constant-product-formula/).

## Why the smaller side sets your trading cost

A weighted pool is only as deep as its smaller side. In an 80/20 pool that is the 20% slice, and it limits trades in both directions [2].

The table shows how much less you receive than the pre-trade price would give, before fees, in two pools holding the same total value.

| Trade size, as a share of pool value | 50/50 pool | 80/20, buying the heavy token | 80/20, selling the heavy token |
| :--- | ---: | ---: | ---: |
| 1% | 2.0% | 3.0% | 3.0% |
| 2% | 3.8% | 5.8% | 6.0% |
| 5% | 9.1% | 13.2% | 13.9% |
| 10% | 16.7% | Rejected | Rejected |

Three things stand out. The same money buys you less depth in an 80/20 pool, whichever way you trade. Selling the heavy token gets expensive slightly faster than buying it, because every sale drains the small slice. And the 10% row does not trade at all in the 80/20 pool. Balancer caps any single swap at 30% of the relevant token balance [2], and a trade worth 10% of the pool would need half of the light side.

Plan your exit before your entry. A large holder leaving an 80/20 pool in a hurry has to pay for that thin side, possibly over several trades.

## How much less an 80/20 pool costs you

Impermanent loss is the gap between what your deposit is worth and what the same tokens would have been worth if you had just held them. Balancer's own documentation describes the trade-off plainly: heavier weighting means far less of that loss, and more slippage — a worse rate on each trade — for the people trading against the pool [2].

Each row below is the same price move for the heavy token, measured against holding.

| Token price moves | 50/50 pool | 80/20 pool | 90/10 pool | 95/5 pool |
| :--- | ---: | ---: | ---: | ---: |
| Halves | -5.72% | -4.28% | -2.57% | -1.40% |
| Up 25% | -0.62% | -0.38% | -0.21% | -0.11% |
| Up 50% | -2.02% | -1.20% | -0.66% | -0.35% |
| Doubles | -5.72% | -3.27% | -1.79% | -0.93% |
| Up 4x | -20.00% | -10.84% | -5.89% | -3.06% |
| Up 5x | -25.46% | -13.72% | -7.46% | -3.89% |

Read the bottom row. Your token goes up fivefold. In a 50/50 pool you end up about 25% behind simply holding. In an 80/20 pool you end up about 14% behind. That is a real difference on a treasury position, and it is still not zero.

Now read the top row. When the heavy token halves, the 80/20 pool trails holding by 4.28% against 5.72% for 50/50. Weighting helps less on the way down, because the pool keeps buying the falling token with its small quote reserve.

The table comes from one rule. Raise the price ratio to the power of the weight, then divide by what holding the same mix would be worth:

$$
\text{IL} = \frac{k^{w}}{w \cdot k + (1 - w)} - 1
$$

Where:

- $k$ is the price now divided by the price when you deposited.
- $w$ is the weight of the token that moved, so 0.8 in an 80/20 pool.
- The result is negative, and it is how far behind holding you are, before fees.

Push $w$ toward 1 and the whole expression goes to zero. A pool that is 100% one token never sells anything, so it never falls behind. It also never earns a fee. Everything in between is that trade-off priced out. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/) for the same idea from the 50/50 side.

## What you give up for that protection

Lower drag is not free, and the cost shows up in three places.

- **Thinner depth.** Only a fifth of the pool sits on the quote side, so large sells run out of room quickly.
- **Less routing.** Aggregators send trades where the fill is best. A lopsided pool often loses that comparison, so volume and fees go elsewhere.
- **Kept exposure.** You still hold 80% of a falling token on the way down. Weighting cuts the selling, not the risk.

Fees are also shared. Balancer v3 sends 25% of swap fees and 10% of yield on yield-bearing tokens to the protocol [8]. What reaches you is the remainder.

Before accepting that trade-off, run the pool's volume and your share of its liquidity through the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) to see the income the weighting gives up.

## How token launches use shifting weights

A liquidity bootstrapping pool, or LBP, is a two-token weighted pool whose weights move on a schedule [4]. Projects use it to sell a new token without needing much cash up front.

A normal launch has two problems. The project must fund a large quote side, and bots buy the first block cheaply and sell into the crowd. A falling weight schedule addresses both.

| Point in the sale | Weights (project token / reserve) | What it does |
| :--- | :--- | :--- |
| Start | 90% / 10% | High starting price, little reserve needed |
| Halfway | 55% / 45% | Price has drifted down unless people bought |
| End | 20% / 80% | Sale closes; swaps stop at the end time |

Those start and end weights are the example Balancer's documentation gives, and the weights move in a straight line between them, so halfway is 55/45 [4]. Swaps run only between the start and end times [4].

As the weights walk down, the quoted price falls unless people buy. That steady downward pull means buyers can wait for a price they think is fair rather than racing bots at the open [4]. Buying in the first minutes usually means paying near the top of the schedule. Launch pools are typically set to block selling the token back into the pool during the sale [4], so check whether you can exit before you buy.

## What Balancer v3 changed under the hood

Balancer v3 holds every pool's tokens in one vault contract, a design called a singleton — all pools living in a single contract rather than one contract per pool [5].

- **One place for the tokens.** Pool contracts only do the math. The vault records each step of a trade as a debt or credit and settles the net amounts once, at the end [5]. A trade routed through several pools does not move tokens at every hop.
- **Pools can run custom code.** Hooks are separate contracts that the vault calls at set points, such as before a swap or before a withdrawal [6]. Balancer lists dynamic fees, buy or sell limits, and cutting what depositors lose to arbitrage as uses [6].
- **Your share is a token.** Depositors receive Balancer Pool Tokens, which the vault manages and which follow the ERC-20 standard [9] [11].

Which hook a pool uses is fixed when the pool is registered and cannot change afterwards [6]. The hook contract itself, though, is code somebody wrote. It may have its own settings an owner can adjust, and it can change fees or block withdrawals. [Uniswap v4 Architecture](/guides/uniswap-v4-architecture-and-hooks/) covers the same shift on the other side of the market.

## What to check before you deposit

1. **Does the split match what you want to hold?** An 80/20 pool keeps you long. That is the point, and it is also the risk if you are not sure about the token.
2. **Have you looked at every token in the pool?** A token that collapses gets sold into the pool for every healthy token it holds, so in a multi-token pool your exposure runs to the weakest token in the basket. Check each token for mint and blacklist powers.
3. **Does the fee income justify it?** The more the pair moves, the more the pool loses to arbitrageurs (traders who close the gap between the pool and the market), and only fees offset that [10]. Compare the pool's daily fees against how much the pair moves.
4. **Who can change the fee?** A weighted pool's fee can sit anywhere from 0.001% to 10% [2]. Governance can change a static fee unless the pool named its own swap manager at creation [7].
5. **What does the hook do?** Read what it controls and whether its owner can change those settings [6].
6. **How will you get out?** Model a proportional exit and a single-token exit. Balancer charges the swap fee on the unbalanced part of a deposit or withdrawal [7], so a one-sided exit from the heavy side costs more than you might expect.

## Where to watch the numbers

- **Live pools, weights and fees:** [Balancer's Dune dashboards](https://dune.com/balancer).
- **Pool size and incentive flows across protocols:** [DeFiLlama](https://defillama.com).

## When something goes wrong

- **One token in the pool is draining fast.** Its market price is falling and traders are selling it into the pool for the healthy assets. If the fall looks permanent, exit before the healthy reserves are gone.
- **Fees are lower than you expected.** Routers may be sending volume to deeper pools. Compare the pool's share of volume for the pair with its share of liquidity before you add more.
- **Your allocation has drifted from what you wanted.** The pool keeps an 80/20 value split, but a strong trend changes what that split is worth in dollars. Resize the position, or offset the exposure elsewhere.

## Where to go next

To see where weighted pools sit among the other designs, read [Types of Liquidity Pools](/guides/liquidity-pool-types/). If you want to rework the table above for your own weights, [The Impermanent Loss Formula](/guides/impermanent-loss-formula/) walks through the arithmetic that weighting softens but never removes. For a pool that moves its own price centre instead of fixing its weights, read [Curve v2 CryptoSwap Explained](/guides/curve-v2-cryptoswap-explained/).

## References

1. [Balancer Whitepaper: A Non-Custodial Portfolio Manager, Liquidity Provider, and Price Sensor (Martinelli & Mushegian, 2019)](https://docs.balancer.fi/whitepaper.pdf)
2. [Weighted Pool (Balancer Documentation)](https://docs.balancer.fi/concepts/explore-available-balancer-pools/weighted-pool/weighted-pool.html)
3. [Constant Function Market Makers: Multi-Asset Trades via Convex Optimization (Angeris et al., 2021)](https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf)
4. [Liquidity Bootstrapping Pool (Balancer Documentation)](https://docs.balancer.fi/concepts/explore-available-balancer-pools/liquidity-bootstrapping-pool/liquidity-bootstrapping-pool.html)
5. [Architecture (Balancer Documentation)](https://docs.balancer.fi/concepts/core-concepts/architecture.html)
6. [Hooks (Balancer Documentation)](https://docs.balancer.fi/concepts/core-concepts/hooks.html)
7. [Swap Fee (Balancer Documentation)](https://docs.balancer.fi/concepts/vault/swap-fee.html)
8. [Protocol Fee Operations (Balancer Documentation)](https://docs.balancer.fi/concepts/governance/protocol-fees.html)
9. [Balancer Pool Tokens (BPT) (Balancer Documentation)](https://docs.balancer.fi/concepts/core-concepts/balancer-pool-tokens.html)
10. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
11. [ERC-20: Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-20)

[1]: https://docs.balancer.fi/whitepaper.pdf "Balancer Whitepaper: A Non-Custodial Portfolio Manager, Liquidity Provider, and Price Sensor (Martinelli & Mushegian, 2019)"
[2]: https://docs.balancer.fi/concepts/explore-available-balancer-pools/weighted-pool/weighted-pool.html "Weighted Pool (Balancer Documentation)"
[3]: https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf "Constant Function Market Makers: Multi-Asset Trades via Convex Optimization (Angeris et al., 2021)"
[4]: https://docs.balancer.fi/concepts/explore-available-balancer-pools/liquidity-bootstrapping-pool/liquidity-bootstrapping-pool.html "Liquidity Bootstrapping Pool (Balancer Documentation)"
[5]: https://docs.balancer.fi/concepts/core-concepts/architecture.html "Architecture (Balancer Documentation)"
[6]: https://docs.balancer.fi/concepts/core-concepts/hooks.html "Hooks (Balancer Documentation)"
[7]: https://docs.balancer.fi/concepts/vault/swap-fee.html "Swap Fee (Balancer Documentation)"
[8]: https://docs.balancer.fi/concepts/governance/protocol-fees.html "Protocol Fee Operations (Balancer Documentation)"
[9]: https://docs.balancer.fi/concepts/core-concepts/balancer-pool-tokens.html "Balancer Pool Tokens (BPT) (Balancer Documentation)"
[10]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[11]: https://eips.ethereum.org/EIPS/eip-20 "ERC-20: Token Standard (Ethereum Improvement Proposals)"
