---
title: "Slippage and Price Impact: What a Swap Actually Costs"
description: "Two different costs, one word. One you can compute before you sign. The other is whatever your tolerance setting tells bots they are allowed to take."
category: "Foundations"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Marcus Vance"
readTime: "6 min read"
keywords: "slippage in liquidity pools, price impact AMM, slippage tolerance, execution price vs spot price, sandwich attack, swap cost"
featured: false
faq:
  - q: "What is the difference between slippage and price impact?"
    a: "Price impact is the movement along the pool's curve caused by your own order, and it is computable before you sign. Slippage is the additional difference between the price you were quoted and the price you actually received, caused by other transactions landing before yours."
  - q: "What slippage tolerance should I set?"
    a: "Tight enough that a sandwich attack is unprofitable, loose enough that ordinary block-to-block movement does not revert your trade. On deep, stable pairs a few tenths of a percent is normal; on volatile or thin pairs a tight tolerance will simply fail repeatedly, which is a signal to reduce order size or route privately."
  - q: "Why did my swap execute at a worse price than quoted?"
    a: "Either the pool moved between quote and execution, or a searcher placed a buy in front of your transaction and a sell behind it, capturing the difference your tolerance allowed. The second case is a sandwich, and it is bounded exactly by the tolerance you set."
  - q: "How do I reduce price impact on a large trade?"
    a: "Split the order across pools and time, route through an aggregator that can use several venues, or use an intent-based system where solvers compete to fill the order. On concentrated liquidity pools, check the depth inside the active tick rather than total value locked."
  - q: "What is the difference between spot price and execution price on an AMM?"
    a: "Spot is the marginal price for an infinitesimally small trade. Execution price is the average received across the whole order, which is always worse because the order moves along the curve as it fills."
---

Your swap costs you two separate things, and almost everybody calls both of them slippage — the gap between the price you expected and the price you got.

The first is price impact — the way your own order pushes the rate as it fills. You can work it out exactly before you sign, and no one else affects it.

The second is slippage — the extra gap between the price you were quoted and the one you got, caused by somebody else trading in between. That part you do not control, but your tolerance setting decides how much of it a bot is allowed to take.

Telling them apart changes how you size an order, what you set the slider to, and how much you hand to strangers.

<figure class="article-figure">
  <img src="/images/guides/slippage-and-price-impact.webp" alt="Execution price curves for a shallow and a deep pool against trade size, beside a worked example of a fifty thousand dollar swap." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Execution price against order size for two depths, with a worked example showing where a tolerance setting binds. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"A 3% tolerance on a thin pair is a public offer. You have told every bot watching exactly how much they may take, and the good ones take exactly that, not a hundredth of a percent less. If a trade only goes through with a wide setting, the answer is a smaller order or a different route. Never a wider setting."*

## The part you can compute

For an ordinary pool, what you get out follows directly from what you put in:

$$
\Delta y = \frac{y \cdot \Delta x}{x + \Delta x}
$$

Where:

- $\Delta x$ is what you put in.
- $\Delta y$ is what you get out.
- $x$ and $y$ are the two pool balances before your trade.

Your input sits in the denominator, so each extra unit you send brings back less than the one before. That is the whole cost, and it has a simple shape:

$$
\text{impact} \approx \frac{\Delta x / x}{1 + \Delta x / x}
$$

Where:

- $\Delta x / x$ is your order as a fraction of the pool's balance of what you are paying in.

| Your order against the pool | Roughly what it costs |
| :--- | ---: |
| 1% | 1% |
| 10% | 9% |
| 25% | 20% |
| 50% | 33% |

The cost rises faster than the size, which is why splitting an order helps, but only in the right way. Halves sent to different pools each pay the lower rate. Halves sent to the same pool one after the other, with nothing refilling it in between, cost exactly the same as one whole order.

One trap in range-based pools. The number that matters is the money working near the current price, not the pool's headline total. A pool showing \$80M with its liquidity parked away from the price fills worse than a \$6M pool with dense liquidity right where you are trading. See [TVL Explained](/guides/tvl-explained/).

## The part you cannot

You get a quote against the pool as it is now. Your trade executes against the pool as it will be, one or more blocks later. Anything in between changes your fill.

- **Other people trading.** Ordinary flow, in either direction.
- **Arbitrage correcting the price.** The same trades that cost pool depositors money.
- **Somebody deliberately wrapping your trade.** A bot buys just before you, letting you fill at the worse price, then sells just after. Their profit is capped by exactly the tolerance you set, which makes your setting a parameter of the attack rather than a defence against it [5].

That last point is worth sitting with. The slider does not protect you from the attack. It sizes it.

So set it from the arithmetic, not from habit. Take the impact the curve will charge at your size, add a small buffer for one block of ordinary movement, and stop there. On a deep pair that is often a few tenths of a percent. If the honest number on a thin pair is several percent, the order is too big for that pool.

## A real trade, two settings

Somebody buys \$50,000 of ETH from a pool holding \$2,500,000 of USDC in its working range, with ETH quoted at \$2,000.

| | Value |
| :--- | ---: |
| Order as a share of the pool's USDC | 2.00% |
| ETH received, against the quote | about 1.96% less |
| Average price paid | about \$2,040 |
| Fee at 0.05% | \$25 |
| Tolerance set to | 0.50% |
| Outcome | Reverts, and the gas is gone |

Note what happened. The trade did not fail because the market moved. It failed because the tolerance was set below the cost the pool was always going to charge. The fixes are to split the order, route across venues, or set the tolerance just above the real impact.

Now change one input. Set the tolerance to 4%. The trade goes through, and a bot watching can push the pool right up to that bound before your trade lands. The gap between the 2% the curve needed and the 4% you allowed is that bot's budget, funded by you.

## Five ways to send the same order

| How you send it | What changes | When it is worth it |
| :--- | :--- | :--- |
| One pool, publicly | Nothing. Fully exposed | Small orders on deep pairs |
| Through an aggregator | Splits across pools, so the curve bites less | Mid-size orders where several venues have depth |
| Through a private relay | Nobody sees it until it executes | Any order large enough to be worth attacking |
| As an intent | Solvers compete, and can beat the pool quote | Large or awkward orders |
| As a range order | You place liquidity at your price instead of taking | When you are not in a hurry |

See [Range Orders on AMMs](/guides/range-orders-on-amms/) and [AMM vs Order Book](/guides/amm-vs-order-book/).

## Why this matters if you are supplying liquidity

These look like trader problems. They define your revenue too.

- **Impact is your income.** Every bit of it reflects depth that had to be consumed. Concentrating your money narrows impact for traders and raises your share of the volume that crosses you.
- **Sandwiching costs you customers.** The fee on the bot's two legs is real, but the trader who got wrapped will route privately next time, and that flow leaves your pool for good.
- **Routers avoid unpredictable pools.** Aggregators send trades where execution is reliable, so thin active liquidity loses flow no matter how large the headline number is.

## What people get wrong about the slider

| What people assume | What actually happens |
| :--- | :--- |
| A higher tolerance gets me a better price | It gets you a worse one. It authorises the fill, it does not improve it |
| A failed trade means the market moved | Usually it means the tolerance was below what the pool was always going to charge |
| A bigger pool means less impact | Only money near the current price counts. The rest is decoration |
| The lowest fee tier is the cheapest | A cheap tier with thin depth costs more in total than an expensive one with real depth |

## What to do before you swap

1. **Measure your order against working depth**, not against the pool's total.
2. **Read the quoted impact, and check it** against the arithmetic above for anything large.
3. **Set the tolerance just above the real impact**, plus a little for one block of movement. Not more.
4. **Send anything above a few thousand dollars privately**, or as an intent.
5. **Split large orders across pools or over time.** Halves only cost less if they reach different pools, or if arbitrage refills the pool between them.
6. **Compare fee tiers on total cost**, not on the headline rate. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).
7. **Log what you actually got** against what you were quoted. A consistent gap means your route is leaking value.

The cost of a swap is knowable in advance. Most of what people lose in decentralised trading is lost by treating the tolerance slider as a convenience setting rather than as the number that prices their own order.

## Where to go next

For the other side of the same trade, see [Liquidity Provider Fees](/guides/liquidity-provider-fees/), and model what a position would capture with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/).

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [Quantifying Blockchain Extractable Value: How dark is the forest? (Qin et al., 2021)](https://arxiv.org/abs/2101.05511)
5. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)](https://arxiv.org/abs/1904.05234)
6. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
7. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[4]: https://arxiv.org/abs/2101.05511 "Quantifying Blockchain Extractable Value: How dark is the forest?"
[5]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges"
[6]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[7]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
