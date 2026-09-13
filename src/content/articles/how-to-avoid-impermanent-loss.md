---
title: "How to Avoid Impermanent Loss (and What Each Method Costs)"
description: "You cannot remove it while quoting two assets. Six things genuinely reduce it, each buys the reduction with something else, and here is what each one costs."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "6 min read"
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

You cannot avoid it. Impermanent loss — the gap between a pool position and simply holding the tokens — is what the pricing rule does, not a bug in it. Anything claiming to remove it entirely has either changed what you hold or moved the cost somewhere you cannot see.

What you can do is choose which cost you would rather pay.

Six things genuinely reduce it. Each one buys that reduction with something else, and this guide is about what each one actually costs.

<figure class="article-figure">
  <img src="/images/guides/how-to-avoid-impermanent-loss.webp" alt="Six cards describing mitigations for impermanent loss and the cost each one carries." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six mitigations that reduce divergence, and what each one gives up in exchange. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"The most common request I get is for a pool with high fees and no divergence. It does not exist, because both are paid by the same person. High fees compensate for volatility, and volatility is what produces the divergence. Anything promising one without the other has hidden the cost inside a token you are being paid in."*

## One: pick tokens that move together

The formula depends only on how far the two tokens move relative to each other. So the most direct fix is picking two that barely move apart.

- **Two fiat stablecoins** hold a near-constant ratio, so divergence is negligible in normal conditions.
- **A staked-ETH token against ETH** drifts slowly and predictably as rewards accrue.
- **A wrapped token against the real one** should track exactly.

**What it costs:** a much thinner fee stream, because these pairs trade in a narrow band and compete at the lowest tiers. And a tail. A flat curve keeps buying a token that breaks its peg at near-par. See [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

## Two: change the split

A weighted pool holds fixed value proportions. When the heavy token doubles, an 80/20 pool sells about 13% of it, against about 29% for a 50/50 pool.

| Split | Cost at a 2x relative move |
| :--- | ---: |
| 50/50 | -5.72% |
| 80/20 | -3.27% |
| 95/5 | -0.93% |

**What it costs:** you keep the exposure instead. That is a feature if you wanted to hold that token anyway and a concentration risk if you did not. See [Balancer Weighted Pools](/guides/balancer-and-weighted-pools/).

## Three: widen the band, or drop it entirely

A narrow band amplifies the divergence while the price is inside it. Widening reduces the amplification and keeps you in range longer.

**What it costs:** fee income per dollar. There is an interior optimum that moves with volatility, covered in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/).

For anyone who will not actually watch a position, a full-range deposit is the honest answer. Less income per dollar, no boundary to fall out of, and no rebalancing bill.

## Four: hold it for less time

Divergence grows as the prices separate, and they separate more over longer periods. Days rather than months reduces the chance of a large move.

**What it costs:** friction, every time. Each entry and exit pays gas, a swap to reach the ratio, and impact on the way in and out. Below a certain size, a short holding period guarantees the friction exceeds the fees. See [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

A related tactic is supplying only around events that create volume without creating a trend, like index rebalances or scheduled unlocks. That needs a view on flow, which is research rather than a passive strategy.

## Five: hedge the price exposure

Your position is long the risky token by an amount that changes with price. Short that amount on a futures venue and you are left with fee income against funding cost.

Three things make this harder than it sounds:

1. **The amount keeps changing.** As the price moves, your holdings shift, so a static hedge drifts out of line and needs adjusting.
2. **The curvature stays.** A hedge that cancels the direction still loses on large moves either way.
3. **Funding is real money.** It is often positive for shorts in calm markets, and it can invert violently in stress.

**What it costs:** funding, margin, and the operational discipline to rebalance on rules. Desks do this deliberately. For most people, a hedge adjusted occasionally and imprecisely does worse than no hedge at all. See [Market Making on AMMs](/guides/market-making-on-amms/).

## Six: charge more

Charging more does not reduce the divergence. It improves the net result, which is what actually matters.

A higher tier collects more per trade. Code that raises the fee during volatility charges more specifically when the pool is most exposed.

**What it costs:** volume. Routers send orders wherever they fill best, so a higher tier usually sees less. Whether it improves things is pair-specific. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/) and [Dynamic Fees in AMMs](/guides/dynamic-fees-in-amms/).

## Two routes, worked

\$40,000 against ETH over a quarter in which ETH rises 35% and volatility averages 55%. The divergence figures are exact for that move. The fee figures are round, illustrative numbers.

| | A 0.05% band from 30% below to 40% above the entry price | An 80/20 ETH-heavy pool |
| :--- | ---: | ---: |
| Divergence | about -7.0%, or -\$2,800 | about -0.7%, or -\$270 |
| Fee income | about \$2,400 | about \$450 |
| Net against holding | about -\$400 | about +\$180 |
| ETH you still hold at the end | About a tenth of it | About 94% of it |

The band earned five times the fees and still finished behind. A steady trend is exactly what a band sells into, and its multiplier applies to the divergence as well as the fees. The weighted pool earned little and behaved much more like simply owning ETH.

Swap the trend for a choppy quarter that ends where it started, and the band wins comfortably. So the choice is a portfolio decision about which market you expect. Framing it as a hunt for the lowest divergence gets you the wrong answer.

## Choosing between them

| Method | How much it helps | What it costs | Who it suits |
| :--- | :--- | :--- | :--- |
| Tokens that track each other | A lot, normally | Thin fees, and a peg tail | Conservative capital |
| Weighted pools | Moderate | Concentrated exposure | Treasuries holding one token |
| Wider bands | Moderate | Lower income per dollar | Anyone who will not monitor |
| Shorter holds | Moderate | Friction, every time | Large, event-driven positions |
| Hedging | A lot on direction, none on curvature | Funding, margin, operations | Desks with the infrastructure |
| Higher or adaptive fees | Nothing directly | Less volume | Volatile pairs with captive flow |

The right combination depends on which cost is cheapest for you specifically. A desk with a futures account should hedge. An individual paying expensive gas on a small position should widen the band and stop rebalancing.

## A quick way to choose

Answer three questions, in this order.

1. **Do you want to keep exposure to one of the two tokens?** If yes, look first at a weighted pool or a one-sided range.
2. **Will you really look at the position every week?** If not, use full range or a very wide band, and accept the lower income.
3. **Does the pair move a lot relative to the fees it pays?** If yes, the honest answer may be not to supply it at all, or to hedge it if you can run a futures position properly.

Whatever you pick, write down which cost you chose to pay. That one sentence stops you from switching strategy halfway through a move, which is the most expensive thing you can do with a pool position.

## What not to rely on

| What people try | Why it does not work |
| :--- | :--- |
| Auto-compounding vaults | They raise fee income and touch divergence not at all, while adding a contract |
| Bots that chase the price | Each re-centre turns an unrealised loss into a realised one, and pays gas for it |
| High rewards | They can outpay the divergence for a while, on a published schedule everyone can read |
| Waiting for the price to come back | Sometimes it does. Planning on it is a directional bet wearing risk-management clothing |

Run the comparison before you enter, not after. The [impermanent loss calculator](/tools/impermanent-loss-calculator/) gives you the cost side, and the fee side is measurable from published pool data.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
3. [Balancer Whitepaper: A non-custodial portfolio manager and liquidity provider](https://balancer.fi/whitepaper.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[3]: https://balancer.fi/whitepaper.pdf "Balancer Whitepaper"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
