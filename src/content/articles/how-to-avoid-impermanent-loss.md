---
title: "How to Avoid Impermanent Loss (and What Each Method Costs)"
description: "You cannot remove it while quoting two assets. Six things genuinely reduce it, each buys the reduction with something else, and here is what each one costs."
category: "Risk & Research"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "how to avoid impermanent loss"
keywords: "how to avoid impermanent loss, reduce impermanent loss, impermanent loss protection, delta hedging LP, correlated asset liquidity pool, single sided liquidity"
featured: false
faq:
  - q: "How can you avoid impermanent loss?"
    a: "You cannot remove it entirely while supplying two assets to a pricing rule, because the rule is what creates it. You can reduce it by choosing correlated or pegged pairs, using weighted pools, widening ranges, shortening the holding period, or hedging the price exposure. Each of those has a cost that must be weighed against the divergence avoided."
  - q: "Do stablecoin pools have impermanent loss?"
    a: "Very little while both assets hold their peg, because the relative price barely moves. The exposure returns violently if one asset depegs, since the curve keeps buying the failing asset near par until reserves are heavily skewed."
  - q: "Does hedging eliminate impermanent loss?"
    a: "A delta hedge neutralises the directional part of the exposure, not the convexity. The position remains short gamma, so a hedge has to be adjusted as price moves, and the funding cost plus rebalancing friction can exceed the divergence it offsets."
  - q: "Is there impermanent loss protection in DeFi?"
    a: "Some protocols have offered compensation schemes that pay out part of the divergence after a minimum holding period, usually funded by token emissions. Treat these as an insurance product funded by issuance, and read what happens to the payout when the token price falls."
  - q: "Is it better to hold or to provide liquidity?"
    a: "Holding wins whenever fee income over the period is smaller than the divergence the pool creates. Providing wins when turnover is high relative to volatility. The comparison is computable in advance for any pair with published volume data."
---

You cannot avoid it entirely. Impermanent loss — how far a pool position falls behind just holding the same tokens — is what the pricing rule does, not a bug in it. Anything claiming to remove it completely has either changed what you hold or moved the cost somewhere you cannot see.

What you can do is choose which cost you would rather pay.

Six things genuinely reduce it. Each one buys that reduction with something else. By the end you should be able to name the cost you are choosing, and check that it is cheaper for you than the divergence it replaces.

<figure class="article-figure">
  <img src="/images/guides/how-to-avoid-impermanent-loss.webp" alt="Six cards describing mitigations for impermanent loss and the cost each one carries." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six mitigations that reduce divergence, and what each one gives up in exchange. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> A pool cannot promise high fees with no divergence risk. Volatile trading can produce fee opportunities, while the same relative price movement changes pool inventory against holding. If a quoted return appears to remove that trade-off, check whether token incentives or another exposure are carrying the cost.

## One: pick tokens that move together

The formula depends only on how far the two tokens move relative to each other. So the most direct fix is picking two that barely move apart.

- **Two fiat stablecoins** hold a near-constant ratio, so divergence is negligible in normal conditions.
- **A staked-ETH token against ETH** drifts slowly as rewards accrue, in normal conditions.
- **A wrapped token against the real one** should track exactly.

**What it costs:** a much thinner fee stream, because these pairs trade in a narrow band and compete at the lowest tiers. Research on Uniswap v3 found profitable simple strategies in pools with negligible volatility, but only modest returns [6].

And a tail. A stable curve keeps buying a token that breaks its peg at close to par until its balances are badly skewed [8]. Staked tokens can break too: in May 2022, stETH fell in value relative to ETH in the stress that followed the TerraUSD collapse [7]. See [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

## Two: change the split

A weighted pool keeps a fixed share of its value in each token, such as 80% in one and 20% in the other [3]. When the heavy token doubles, an 80/20 pool sells about 13% of it, against about 29% for a 50/50 pool.

| Split | Shortfall against holding, heavy token doubles | Heavy token halves |
| :--- | ---: | ---: |
| 50/50 | -5.72% | -5.72% |
| 80/20 | -3.27% | -4.28% |
| 95/5 | -0.93% | -1.40% |

Unlike a 50/50 pool, a weighted pool is not symmetric: a fall in the heavy token costs more than a rise of the same size. Each cell is the pool's value divided by the value of the untouched basket, minus one.

**What it costs:** you keep the exposure instead. That is a feature if you wanted to hold that token anyway and a concentration risk if you did not. See [Balancer Weighted Pools](/guides/balancer-and-weighted-pools/).

## Three: widen the band, or drop it entirely

A narrow band amplifies the divergence while the price is inside it [6]. Widening reduces the amplification and keeps you in range longer, and a position out of range earns nothing [1].

**What it costs:** fee income per dollar. There is an interior optimum that moves with volatility, covered in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/).

For anyone who will not actually watch a position, a full-range deposit is the honest answer. Less income per dollar, no boundary to fall out of, and no rebalancing bill.

## Four: hold it for less time

Divergence grows as the prices separate, and they separate more over longer periods. Days rather than months reduces the chance of a large move.

**What it costs:** friction, every time. Each entry and exit pays gas, a swap to reach the ratio, and price impact (how far your own trade moves the price) on the way in and out [2]. Below a certain size, a short holding period all but guarantees the friction exceeds the fees. See [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

A related tactic is supplying only around events that create volume without creating a trend, like index rebalances or scheduled unlocks. That needs a view on flow, which is research rather than a passive strategy.

## Five: hedge the price exposure

Your position is long the risky token by an amount that changes with price. Short that amount on a futures venue and you are left with fee income against funding cost.

Three things make this harder than it sounds:

1. **The amount keeps changing.** As the price moves, your holdings shift, so a static hedge drifts out of line and needs adjusting.
2. **The curvature stays.** Impermanent loss is the curvature part of the position, the part a straight short cannot offset [5]. A perfectly hedged position still loses loss-versus-rebalancing — the steady amount a pool gives up to arbitrage because its price trails the market [4].
3. **Funding is real money.** It can run in your favour or against you, and it can swing quickly in stress.

**What it costs:** funding, margin, and the operational discipline to rebalance on rules. Desks do this deliberately. A hedge adjusted occasionally and imprecisely can cost more in funding and trading than it saves. See [Market Making on AMMs](/guides/market-making-on-amms/).

## Six: charge more

Charging more does not reduce the divergence. It improves the net result, which is what actually matters.

A higher tier collects more per trade. On Uniswap v4, a pool's hook can set a dynamic fee, for example one that rises during volatility, so the pool charges more when it is most exposed [9].

**What it costs:** volume. Routers send orders wherever they fill best, so a higher tier usually sees less. Whether it improves things is pair-specific. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/) and [Dynamic Fees in AMMs](/guides/dynamic-fees-in-amms/).

## Two routes, worked

\$40,000 against ETH over a quarter in which ETH rises 35%. The divergence figures are computed exactly for that move, each against holding the basket that went in. The fee figures are round, illustrative numbers.

| | A 0.05% band from 30% below to 40% above the entry price | An 80/20 ETH-heavy pool |
| :--- | ---: | ---: |
| Holding the deposited basket would be worth | about \$46,800 | \$51,200 |
| Divergence against that | about -7.0%, or -\$3,300 | about -0.7%, or -\$350 |
| Fee income, illustrative | about \$2,400 | about \$450 |
| Net against holding | about -\$900 | about +\$100 |
| ETH you still hold at the end | About a tenth of it | About 94% of it |

The band earned about five times the fees and still finished behind. A steady trend is exactly what a band sells into, and its multiplier applies to the divergence as well as the fees. The weighted pool earned little and behaved much more like simply owning ETH. You can rerun the band in the [impermanent loss calculator's range mode](/tools/impermanent-loss-calculator/#mode=concentrated&a0=2000&a1=2700&b0=1&b1=1&capital=40000&fees=2400&days=90&lower=1400&upper=2800).

Swap the trend for a choppy quarter that stays inside the band and ends where it started, and the band wins comfortably: at the round trip its divergence is back to zero and it keeps the fees. So the choice is a portfolio decision about which market you expect. Framing it as a hunt for the lowest divergence gets you the wrong answer.

## Choosing between them

| Method | How much it helps | What it costs | Who it suits |
| :--- | :--- | :--- | :--- |
| Tokens that track each other | A lot, normally | Thin fees, and a peg tail | Conservative capital |
| Weighted pools | Moderate | Concentrated exposure | Treasuries holding one token |
| Wider bands | Moderate | Lower income per dollar | Anyone who will not monitor |
| Shorter holds | Moderate | Friction, every time | Large, event-driven positions |
| Hedging | A lot on direction, none on curvature | Funding, margin, operations | Desks with the infrastructure |
| Higher or adaptive fees | Nothing directly | Less volume | Volatile pairs with captive flow |

The right combination depends on which cost is cheapest for you specifically. A desk with a futures account can hedge. An individual paying expensive gas on a small position is usually better off widening the band and rebalancing rarely.

## A quick way to choose

Answer three questions, in this order.

1. **Do you want to keep exposure to one of the two tokens?** If yes, look first at a weighted pool or a one-sided range.
2. **Will you really look at the position every week?** If not, use full range or a very wide band, and accept the lower income.
3. **Does the pair move a lot relative to the fees it pays?** If yes, the honest answer may be not to supply it at all, or to hedge it if you can run a futures position properly.

Whatever you pick, write down which cost you chose to pay. That one sentence stops you from switching strategy halfway through a move, which is one of the most expensive things you can do with a pool position.

## What not to rely on

| What people try | Why it does not work |
| :--- | :--- |
| Auto-compounding vaults | They raise fee income and touch divergence not at all, while adding a contract |
| Bots that chase the price | Each re-centre turns an unrealised loss into a realised one, and pays gas for it |
| High rewards | They can outpay the divergence for a while, on a published schedule everyone can read |
| Waiting for the price to come back | Sometimes it does. Planning on it is a directional bet wearing risk-management clothing |

Run the comparison before you enter, not after. The [impermanent loss calculator](/tools/impermanent-loss-calculator/#mode=weighted&a0=2000&a1=3000&b0=1&b1=1&capital=10000&fees=260&weight=0.8) gives you the cost side for a weighted pool, and the fee side is measurable from published pool data. To see the same arithmetic on five full positions first, read [Impermanent Loss Examples](/guides/impermanent-loss-examples/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
3. [Balancer Whitepaper: A non-custodial portfolio manager, liquidity provider, and price sensor (Martinelli & Mushegian, 2019)](https://docs.balancer.fi/whitepaper.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)
8. [StableSwap: efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
9. [Fees (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/fees)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[3]: https://docs.balancer.fi/whitepaper.pdf "Balancer Whitepaper: A non-custodial portfolio manager, liquidity provider, and price sensor"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
[8]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap: efficient mechanism for Stablecoin liquidity"
[9]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees (Uniswap Developer Documentation)"
