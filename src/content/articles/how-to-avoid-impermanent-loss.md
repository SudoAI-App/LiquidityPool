---
title: "How to Avoid Impermanent Loss (and What Each Method Costs)"
description: "Impermanent loss cannot be eliminated while quoting two assets. Six mitigations that actually reduce it, the cost each one carries, and how to choose between them."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Dr. Elena Rostova"
readTime: "11 min read"
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

Impermanent loss is not a defect to be patched. It is the mechanical result of a rule that sells whichever asset appreciates, and any strategy claiming to remove it entirely has either changed what you hold or moved the cost somewhere less visible.

What can be done is choosing which cost you would rather pay. Six mitigations are genuinely effective, and each one buys a reduction in divergence with something else.

<figure class="article-figure">
  <img src="/images/guides/how-to-avoid-impermanent-loss.webp" alt="Six cards describing mitigations for impermanent loss and the cost each one carries." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six mitigations that reduce divergence, and what each one gives up in exchange. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"The request I hear most often is for a pool with high fees and no divergence. That pool does not exist, because both quantities are paid by the same counterparty. High fees are compensation for volatility, and volatility is what produces divergence. Any structure promising one without the other has hidden the cost in a token you are being paid in."*

## 1. Choose Pairs That Do Not Diverge

The formula depends only on the relative price ratio, so the most direct mitigation is supplying assets whose relative price barely moves.

- **Fiat stablecoin pairs** hold a near-constant ratio and produce negligible divergence in normal conditions.
- **Liquid staking receipts against their base asset** drift slowly and predictably as staking rewards accrue.
- **Wrapped representations against their canonical asset** should track one to one.

The cost is a much thinner fee stream, because these pairs trade in a narrow band and compete on the lowest fee tiers. The other cost is a tail: an amplified curve absorbs a depegging asset at close to par, which is examined in [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

---

## 2. Change the Weights

A constant-mean pool holds assets at fixed value proportions. An 80/20 pool rotates less of the portfolio for a given price move, so divergence for the same move is materially smaller than in a 50/50 pool.

| Weighting | Divergence at a 2x relative move |
| :--- | ---: |
| 50/50 | −5.72% |
| 80/20 | −2.0% approximately |
| 95/5 | −0.4% approximately |

What you keep instead is directional exposure to the heavy asset. That is a feature if you wanted to hold it anyway and a concentration risk if you did not. The mechanics are in [Balancer Weighted Pools](/guides/balancer-and-weighted-pools/).

---

## 3. Widen the Range, or Do Not Use One

In concentrated pools, a narrow band amplifies divergence while price sits inside it. Widening the band reduces amplification and increases time in range, at the cost of fee density per dollar deployed.

The trade-off has an interior optimum that moves with realised volatility, developed in [Concentrated Liquidity Strategy: Choosing a Range Width](/guides/concentrated-liquidity-strategy/). For providers unwilling to monitor a position, a full-range position on a constant-product pool is the honest choice: less fee income per dollar, no boundary risk, and no rebalancing bill.

---

## 4. Shorten the Exposure Window

Divergence grows with how far relative prices separate, which grows with time. Holding for days rather than months reduces the chance of a large ratio move.

The offsetting cost is friction. Every entry and exit pays gas, a swap to reach the deposit ratio, and price impact on the way in and out. Below a certain position size, a short holding period guarantees that friction exceeds fee income, as set out in [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

A related tactic is supplying only around events that generate volume without generating trend, such as index rebalances or scheduled unlocks. That requires a view on flow, which is a research activity rather than a passive one.

---

## 5. Hedge the Price Exposure

A liquidity position has a delta that changes with price. Shorting the volatile asset on a perpetual futures venue offsets the directional component, leaving fee income against funding cost.

Three things make this harder than it sounds:

1. **The delta moves.** As price changes, the pool's composition changes, so a static hedge drifts out of alignment and must be adjusted.
2. **Convexity remains.** The position is short gamma. A hedge that neutralises delta still loses on large moves in either direction.
3. **Funding is a real cost.** Perpetual funding rates are frequently positive for shorts in calm markets and can invert violently in stress.

Institutional desks run this structure deliberately, sizing the hedge from the position's computed delta and rebalancing on rules. The framework is in [Market Making on AMMs](/guides/market-making-on-amms/). For most providers, a hedge that is adjusted occasionally and imprecisely produces worse results than not hedging at all.

---

## 6. Raise the Fee, or Let a Hook Raise It

Divergence is not reduced by charging more, but the net result is. A higher fee tier collects more per unit of volume, and a dynamic fee hook raises the charge specifically when volatility is high, which is when the pool is most exposed.

The constraint is routing: aggregators send orders to the cheapest executable path, so a higher tier usually receives less volume. Whether the product improves is a pair-specific question, worked through in [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/) and [Dynamic Fees in AMMs](/guides/dynamic-fees-in-amms/).

### A worked comparison of two mitigations

Take \$40,000 to deploy against ETH over a quarter in which ETH rises 35% and realised volatility averages 55%.

Route one, a 5 bps ETH/USDC position with a ±20% band. Divergence at that ratio on an amplified band is roughly −1.6%, or −\$640, assuming the position stays in range. Fee income at a 0.4% daily turnover on the band might reach \$1,500 over the quarter. Net against holding the basket: approximately +\$860 before gas.

Route two, the same capital in an 80/20 ETH-heavy weighted pool. Divergence falls to roughly −0.5%, or −\$200, but the pool's fee tier and volume are lower, so fee income might be \$450. Net: approximately +\$250, with materially more ETH exposure retained.

Neither route is wrong. Route one earns more and holds less ETH at the end; route two behaves closer to simply owning ETH. The choice is a portfolio decision, and framing it as a search for the lowest divergence produces the wrong answer.

---

## 7. Choosing Between Them

| Mitigation | Divergence reduction | What it costs | Suits |
| :--- | :--- | :--- | :--- |
| Correlated pairs | Very high in normal regimes | Thin fees, depeg tail | Conservative capital |
| Weighted pools | Moderate | Concentrated directional exposure | Treasuries holding one asset |
| Wider ranges | Moderate | Lower fee density | Providers who will not monitor |
| Shorter holds | Moderate | Repeated friction | Large positions, event-driven |
| Delta hedging | High on direction, none on convexity | Funding, margin, operations | Desks with hedging infrastructure |
| Higher or dynamic fees | None directly | Less routed volume | Volatile pairs with captive flow |

The right combination depends on which cost is cheapest for you specifically. A desk with a futures account and an operations team should hedge; an individual paying mainnet gas on a small position should widen the range and stop rebalancing.

---

## 8. What Not to Rely On

- **Auto-compounding vaults.** They increase fee income; they do not touch divergence, and they add a contract.
- **Rebalancing bots that chase price.** Each re-centre realises the current composition, converting unrealised divergence into a realised loss and paying gas for the privilege.
- **High emissions.** An incentive programme can outpay divergence for a while. It ends on a published schedule, and the token used to pay it is being continuously issued.
- **Waiting for the price to come back.** Sometimes it does. Planning on it is a directional bet dressed as risk management.

Run the comparison before entering, not after. The [impermanent loss calculator](/tools/impermanent-loss-calculator/) makes the divergence side explicit, and the fee side is measurable from published pool data.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
3. [Balancer Whitepaper: A non-custodial portfolio manager and liquidity provider](https://balancer.fi/whitepaper.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[3]: https://balancer.fi/whitepaper.pdf "Balancer Whitepaper"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
