---
title: "Slippage and Price Impact: What a Swap Actually Costs"
description: "Two different costs, one word. One you can compute before you sign. The other is whatever your tolerance setting tells bots they are allowed to take."
category: "Foundations"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "slippage in liquidity pools"
keywords: "slippage in liquidity pools, price impact AMM, slippage tolerance, execution price vs spot price, sandwich attack, swap cost"
featured: false
faq:
  - q: "What is the difference between slippage and price impact?"
    a: "Price impact is the movement along the pool's curve caused by your own order, and it is computable before you sign. Slippage is the additional difference between the price you were quoted and the price you actually received, caused by other transactions landing before yours."
  - q: "What slippage tolerance should I set?"
    a: "Your quote already includes price impact, so the tolerance only needs to cover movement before the trade lands. Keep it loose enough that ordinary block-to-block movement does not revert the trade and no looser, because a sandwich bot can push your fill down to that limit. On deep, stable pairs a few tenths of a percent is normal; if a volatile or thin pair keeps failing at a tight setting, reduce the order or route privately."
  - q: "Why did my swap execute at a worse price than quoted?"
    a: "Either the pool moved between quote and execution, or a searcher placed a buy in front of your transaction and a sell behind it, capturing the difference your tolerance allowed. The second case is a sandwich, and the tolerance you set is its upper bound."
  - q: "How do I reduce price impact on a large trade?"
    a: "Split the order across pools and time, route through an aggregator that can use several venues, or use an intent-based system where solvers compete to fill the order. On concentrated liquidity pools, check the depth near the current price rather than total value locked."
  - q: "What is the difference between spot price and execution price on an AMM?"
    a: "Spot is the marginal price for an infinitesimally small trade. Execution price is the average received across the whole order, which is always worse because the order moves along the curve as it fills."
---

Your swap costs you two separate things, and almost everybody calls both of them slippage — the gap between the price you expected and the price you got.

The first is price impact — the way your own order pushes the rate as it fills. You can work it out exactly before you sign, and no one else affects it.

The second is slippage in the strict sense: the extra gap between the price you were quoted and the one you got, caused by somebody else trading in between. That part you do not control, but your tolerance setting decides how much of it a bot is allowed to take.

Telling them apart changes how you size an order, what you set the slider to, and how much you hand to strangers.

<figure class="article-figure">
  <img src="/images/guides/slippage-and-price-impact.webp" alt="Execution price curves for a shallow and a deep pool against trade size, beside a worked example of a fifty thousand dollar swap." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Execution price against order size for two pool depths, beside the fifty-thousand-dollar ETH purchase worked through below. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> A wide tolerance on a public swap is a standing offer. It tells every bot watching how far your fill may be pushed before the trade fails, and a sandwich bot will push it close to that limit. If a trade only goes through with a wide setting, the answer is a smaller order or a different route, not a wider setting.

## The part you can compute

For an ordinary constant-product pool, what you get out follows directly from what you put in [1].

$$
\Delta y = \frac{y \cdot \Delta x}{x + \Delta x}
$$

Where:

- $\Delta x$ is what you put in.
- $\Delta y$ is what you get out, before the fee.
- $x$ and $y$ are the two pool balances before your trade.

Your input sits in the denominator, so each extra unit you send brings back less than the one before. The shape is simple. If your order is a share $s$ of the pool's balance of what you are paying in, you lose $s / (1 + s)$ of your output against the quoted rate.

| Your order against the pool | Output lost to impact |
| :--- | ---: |
| 1% | 0.99% |
| 10% | 9.1% |
| 25% | 20% |
| 50% | 33% |

The cost rises faster than the size, which is why splitting an order helps, but only in the right way. Halves sent to different pools each pay the lower rate. Halves sent to the same pool one after the other, with nothing refilling it in between, cost about the same as one whole order.

One trap in range-based pools. The number that matters is the money working near the current price, not the pool's headline total: the more liquidity sits at the current price, the lower the impact [3]. A pool showing \$80M with its liquidity parked away from the price fills worse than a \$6M pool with dense liquidity right where you are trading. See [TVL Explained](/guides/tvl-explained/).

## The part you cannot

You get a quote against the pool as it is now. Your trade executes against the pool as it will be, a block or more later. Anything in between changes your fill.

- **Other people trading.** Ordinary flow, in either direction.
- **Arbitrage correcting the price.** The same trades that cost pool depositors money.
- **Somebody deliberately wrapping your trade.** A bot buys just before you, so you fill at a worse price, then sells just after. This is a sandwich attack, and Ethereum's own documentation lists it among the most common forms of MEV — profit from choosing the order transactions run in [6].

Your tolerance is the limit on how far that bot can push your fill. Research on these attacks shows the bot can take the difference between your tolerance and the price movement that would have happened anyway [4]. The slider does not protect you from the attack. It sizes it.

The amounts are not small. One study estimated that sandwich attacks, liquidations and arbitrage together yielded about \$540M in profit on Ethereum over 32 months [5].

So set it from the arithmetic, not from habit. The quote you see already includes the price impact at your size; the tolerance is the extra room beyond it [3]. It only has to cover what might change before your trade lands, which on a deep pair is often a few tenths of a percent. The same research found that a fixed default cannot fit every trade size and pool, and that a tolerance sized to the specific trade avoids most attacks at little risk of failure [4].

## A real trade, two settings

Somebody buys \$50,000 of ETH from a pool holding \$2,500,000 of USDC in its working range, with ETH quoted at \$2,000 and a 0.05% fee.

| | Value |
| :--- | ---: |
| Order as a share of the pool's USDC | 2.00% |
| ETH quoted, if nothing trades first | about 24.50 ETH, against 25 ETH at the headline rate |
| Average price paid, including the fee | about \$2,041 |
| Fee at 0.05% | \$25 |
| Most a sandwich can take at a 0.5% tolerance | about 0.12 ETH, roughly \$245 |
| Most a sandwich can take at a 4% tolerance | about 0.98 ETH, roughly \$1,960 |

The interface quotes 24.50 ETH. That quote already contains the 2% impact, so the tolerance is measured from 24.50, not from 25. At 0.5%, the floor is 24.38 ETH, and the trade only reverts if the pool moves against you by more than that before it lands.

Now set the tolerance to 4%. The floor drops to 23.52 ETH. A bot that sees the order can buy first, push the price until your fill sits just above that floor, and sell straight after you. In this pool that is worth roughly \$1,960 of your ETH, minus the bot's own fees and gas.

Notice that even 0.5% leaves about \$245 within reach on an order this size. A quick check is to multiply your order by your tolerance: that is roughly the most you are offering. When that figure is large, the route matters more than the slider.

## Five ways to send the same order

| How you send it | What changes | When it is worth it |
| :--- | :--- | :--- |
| One pool, publicly | Nothing. Fully exposed | Small orders on deep pairs |
| Through an aggregator | Splits across pools, so each pool moves less | Mid-size orders where several venues have depth |
| Through a private relay | Kept out of the public queue until it executes [7] | Any order large enough to be worth attacking |
| As an intent | Fillers compete, and you pay nothing if it fails [8] | Large or awkward orders |
| As a range order | You place liquidity at your price instead of taking [2] | When you are not in a hurry |

See [Range Orders on AMMs](/guides/range-orders-on-amms/) and [AMM vs Order Book](/guides/amm-vs-order-book/).

## Why this matters if you are supplying liquidity

These look like trader problems. They shape your revenue too.

- **Depth attracts volume.** More liquidity near the price means less impact for traders, so routers send more orders your way, and every order pays a fee.
- **Sandwiching costs you customers.** The fee on the bot's two legs is real, but a trader who got wrapped is likely to route privately next time, and that flow stops reaching your pool.
- **Routers avoid unpredictable pools.** Aggregators send trades where execution is reliable, so thin active liquidity loses flow no matter how large the headline number is.

## What to do before you swap

1. **Measure your order against working depth**, not against the pool's total.
2. **Read the quoted impact, and check it** against the arithmetic above for anything large.
3. **Set the tolerance to cover a block or two of movement.** The quote already includes impact. Not more.
4. **Multiply your order by your tolerance.** If that sum is worth a bot's effort, send the order privately or as an intent.
5. **Split large orders across pools or over time.** Halves only cost less if they reach different pools, or if arbitrage refills the pool between them.
6. **Compare fee tiers on total cost**, not on the headline rate. A cheap tier with thin depth can cost more than an expensive one with real depth. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).
7. **Log what you actually got** against what you were quoted. A consistent gap means your route is leaking value.

The cost of a swap is knowable in advance. Much of what people lose in decentralised trading comes from treating the tolerance slider as a convenience setting rather than as the number that prices their own order.

## Where to go next

For the other side of the same trade, see [Liquidity Provider Fees](/guides/liquidity-provider-fees/), and model what a position would capture with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/).

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Understanding Swaps on Uniswap (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/traders/swaps)
4. [Eliminating Sandwich Attacks with the Help of Game Theory (Heimbach & Wattenhofer, 2022)](https://arxiv.org/abs/2202.03762)
5. [Quantifying Blockchain Extractable Value: How dark is the forest? (Qin et al., 2021)](https://arxiv.org/abs/2101.05511)
6. [Maximal extractable value (MEV) (ethereum.org)](https://ethereum.org/en/developers/docs/mev/)
7. [MEV Protection Overview (Flashbots Docs)](https://docs.flashbots.net/flashbots-protect/overview)
8. [UniswapX Overview (Uniswap Developer Documentation)](https://docs.uniswap.org/contracts/uniswapx/overview)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://developers.uniswap.org/docs/get-started/concepts/traders/swaps "Understanding Swaps on Uniswap"
[4]: https://arxiv.org/abs/2202.03762 "Eliminating Sandwich Attacks with the Help of Game Theory"
[5]: https://arxiv.org/abs/2101.05511 "Quantifying Blockchain Extractable Value: How dark is the forest?"
[6]: https://ethereum.org/en/developers/docs/mev/ "Maximal extractable value (MEV)"
[7]: https://docs.flashbots.net/flashbots-protect/overview "MEV Protection Overview (Flashbots Docs)"
[8]: https://docs.uniswap.org/contracts/uniswapx/overview "UniswapX Overview"
