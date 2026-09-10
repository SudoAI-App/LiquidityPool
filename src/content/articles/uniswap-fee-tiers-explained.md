---
title: "Uniswap Fee Tiers Explained: Choosing 1, 5, 30, or 100 bps"
description: "How Uniswap fee tiers work, why aggregator routing decides which tier earns, and how to pick a tier from pair volatility, turnover, and competing liquidity depth."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-09-10"
author: "Marcus Vance"
readTime: "11 min read"
keywords: "Uniswap fee tiers explained, pool fee tier, what is a pool fee tier, liquidity pool fees explained, dynamic fees, who pays liquidity pool fees"
featured: false
faq:
  - q: "What are the Uniswap fee tiers?"
    a: "Uniswap v3 launched with 5, 30 and 100 basis point tiers and later added a 1 basis point tier for pegged pairs. Each tier is a separate pool with its own liquidity and its own tick spacing. Uniswap v4 keeps fixed tiers and adds the option of a dynamic fee set by a hook."
  - q: "Which fee tier should a liquidity provider choose?"
    a: "The tier that maximises fee tier multiplied by the volume actually routed to it. Pegged pairs concentrate in the lowest tiers because routing is decided by price; volatile and long-tail pairs need higher tiers to compensate for adverse selection, and they retain volume because no cheaper path has depth."
  - q: "Who pays liquidity pool fees?"
    a: "The trader pays the fee on each swap, and it accrues to the liquidity that was in range for that swap, in proportion to each position's share of active liquidity. In tick-based pools it is tracked through per-position fee growth accumulators rather than being added back to reserves."
  - q: "Is a higher fee tier always better for LPs?"
    a: "No. Aggregators route to the cheapest executable path, so a higher tier usually receives less volume. Revenue is the product of tier and captured volume, and that product often peaks in the middle of the range for a given pair."
---

A fee tier is not a yield setting. It is a bid for order flow in a market where routers compare every available path and send the order to whichever one delivers the best execution. Raising the tier raises revenue per unit of volume and lowers the volume you are shown, and the correct choice is the one that maximises the product for a specific pair.

That framing explains most of what looks strange about tier distribution in practice.

<figure class="article-figure">
  <img src="/images/guides/uniswap-fee-tiers-explained.webp" alt="Four fee tiers with typical pair types and their share of routed volume shown as bars." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee tiers, the pairs that cluster in each, and the share of routed volume each typically captures. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"LPs pick the 30 bps pool because the number is bigger and then wonder why the fee counter barely moves. Check where the aggregator actually routes before you deposit. On majors, almost everything clears through the cheapest tier with depth, and the higher tier is left holding inventory for the trades nobody wanted."*

## 1. How the Fee Is Charged and Accrued

In v3 and v4, the fee is deducted from the input amount of each swap and credited to the liquidity that was active for that swap [1]. Accounting is done through global and per-tick fee growth accumulators, so each position can compute its owed fees from the difference in accumulator values between mint and collect. Fees are not automatically added back into the position; they sit as claimable balances until collected, which means they are not compounding unless you actively redeposit.

Each tier is a distinct pool. USDC/ETH at 5 bps and USDC/ETH at 30 bps are separate contracts in v3, and separate pool keys in v4, with independent liquidity, independent prices, and arbitrage between them. That last point matters: the tiers are kept aligned by arbitrageurs, which means the cheaper tier sets the reference and the more expensive tier tends to see only the flow the cheap tier could not absorb.

Tick spacing is tied to the tier. Lower tiers have finer tick spacing, permitting tighter ranges appropriate for pairs that trade in a narrow band; higher tiers use coarser spacing suited to volatile pairs.

---

## 2. Why Volume Concentrates Where It Does

| Tier | Typical pairs | Why volume goes there |
| :--- | :--- | :--- |
| **1 bps** | Fiat stablecoin pairs, pegged LSTs | Price barely moves; execution cost is dominated by the fee itself, so the cheapest venue wins. |
| **5 bps** | ETH/USDC, WBTC/ETH, major correlated pairs | Deep enough that impact is low; the fee is the tiebreaker for routers. |
| **30 bps** | Mid-cap and volatile pairs | Adverse selection is high enough that LPs will not supply at 5 bps; traders have no cheaper path with depth. |
| **100 bps** | Long-tail, illiquid, newly launched | The only compensation available for holding inventory in a pair that can gap. |

The pattern is not a convention; it is an equilibrium. LPs supply the lowest tier at which expected fee income clears their expected adverse selection cost, and traders route to the cheapest venue that can fill their size. The result is that stable pairs cluster at the bottom and long-tail pairs at the top, with mid-caps splitting depending on realised volatility.

The adverse selection side of that trade is quantified in [Loss-Versus-Rebalancing: The LP's Real Hurdle Rate](/guides/loss-versus-rebalancing/).

---

## 3. The Arithmetic of Picking a Tier

Expected daily revenue for a position is:

$$R = f \times V_f \times s_f$$

where $f$ is the tier, $V_f$ is the daily volume routed to that specific tier, and $s_f$ is your share of active liquidity in it. The tier choice moves all three terms, and they do not move together.

Worked comparison for the same \$100,000 on a hypothetical mid-cap pair:

| Tier | Daily volume to tier | Active liquidity in band | Your share | Daily fees |
| ---: | ---: | ---: | ---: | ---: |
| 5 bps | \$12,000,000 | \$9,000,000 | 1.11% | \$66 |
| 30 bps | \$3,000,000 | \$1,200,000 | 8.33% | \$75 |
| 100 bps | \$400,000 | \$250,000 | 40.00% | \$160 |

The highest tier wins in this example precisely because so little liquidity competes there. Change the volume distribution and the answer inverts. This is why the tier decision has to be made against measured routing data for the pair rather than from a rule of thumb.

For where these numbers come from, see [Liquidity Provider Fees: How LP Revenue Is Generated and Measured](/guides/liquidity-provider-fees/) and [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

---

## 4. Dynamic Fees in v4

Uniswap v4 allows a pool to delegate the fee to a hook, which can set it per swap [2]. The design intent is to charge more when the quote is most likely to be stale, which is exactly when arbitrage is repricing the pool, and less during calm conditions when the flow is more likely to be uninformed.

For an LP, a dynamic-fee pool changes the evaluation in two ways. The upside is that fee income becomes correlated with the conditions that generate divergence, which narrows the gap between revenue and cost. The obligation is that you must read the hook: what function sets the fee, what bounds it can reach, whether the parameters are governed, and whether the contract is upgradeable.

One consequence deserves emphasis. A dynamic fee moves the pool's competitiveness in the routing table from block to block. During calm periods the pool may undercut a fixed 30 bps venue and take its flow; during a repricing it may price itself out deliberately, which is the point. Fee income becomes lumpier and more closely tied to conditions, so a single week of observation says less about the pool than it would for a fixed tier.

Pools without a hook behave exactly as they did in v3, with the tier fixed at creation. Where a pool key specifies a dynamic fee, the interface will usually display the current value rather than a constant, and historical averages become the only meaningful basis for comparison with fixed-tier alternatives. Ask for the distribution, not the mean: a fee that spends most of its life at the floor and spikes during arbitrage produces very different LP economics from one that sits near its cap.

---

## 5. Common Mistakes When Selecting a Tier

| Mistake | Consequence |
| :--- | :--- |
| Choosing the highest available tier by default | Deposits sit in a pool that receives almost no routed volume. |
| Choosing the lowest tier on a volatile pair | Fee income cannot clear the adverse selection the pair generates. |
| Ignoring competing depth | Your share of fees is diluted the moment a large LP mints the same band. |
| Treating tiers as interchangeable | They are separate pools; liquidity in one does not serve trades in another. |
| Forgetting tick spacing | A coarse spacing prevents the tight range the strategy assumed. |
| Assuming fees compound | Uncollected fees earn nothing until they are collected and redeposited. |

---

## 6. Selection Checklist

- [ ] Pull 30 days of volume by tier for the pair, not aggregate pair volume.
- [ ] Measure active liquidity in the band you intend to occupy, in each candidate tier.
- [ ] Compute expected revenue as tier times routed volume times your projected share, for each tier.
- [ ] Compare against the volatility hurdle for the pair; a tier that cannot clear it should be rejected regardless of its rank.
- [ ] Check tick spacing against the range width your strategy requires.
- [ ] For v4 pools, resolve the hook and read the fee-setting logic and its bounds.
- [ ] Re-check quarterly. Routing shifts after incentive campaigns, new pool launches and volatility regime changes.

The tier that pays best is rarely the tier with the largest number on it. It is the one where the least competing capital meets the most flow that has nowhere cheaper to go.

## Where to Go Next

Test each candidate tier with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), then check the result against the divergence hurdle in [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
