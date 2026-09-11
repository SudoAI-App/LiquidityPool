---
title: "What Is a Liquidity Provider? The LP Role, Explained"
description: "What a liquidity provider actually does, how LPs are paid, what the role costs, and the difference between supplying liquidity and every other DeFi yield position."
category: "Foundations"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Siddharth Mehta"
readTime: "11 min read"
keywords: "liquidity provider, what is an LP in crypto, how do liquidity providers make money, liquidity provision DeFi, LP role, how much can you earn providing liquidity"
featured: false
faq:
  - q: "What is a liquidity provider in crypto?"
    a: "Anyone who deposits assets into a pool so that others can trade against them. In exchange the provider receives a claim on the pool and a share of the fees paid by every swap that executes against their liquidity while it is active."
  - q: "What is an LP in crypto?"
    a: "LP is shorthand for liquidity provider, and by extension for the position itself. An LP token or LP position is the claim recording how much of a pool you own and, in range-based pools, at which prices that claim is active."
  - q: "How do liquidity providers make money?"
    a: "From the fee charged on each swap routed through their liquidity, and sometimes from incentive tokens issued by the protocol. Both are gross revenue: the net result also depends on how the pool rebalanced the deposited assets while the market moved."
  - q: "How much can you earn providing liquidity?"
    a: "There is no reliable single figure. Income is fee tier multiplied by the volume routed to your position multiplied by your share of the active liquidity, and the net result subtracts divergence against holding plus gas. The same pool can pay well one month and lose to holding the next."
  - q: "Is being a liquidity provider passive income?"
    a: "No. The revenue arrives without effort, but the position is an active short-volatility exposure that continuously sells whichever asset is appreciating. Treating it as passive income is the most common way LPs are surprised by their own results."
---

A liquidity provider is a market maker who cannot cancel quotes. If the pool itself is the unfamiliar part, start with [What Is a Liquidity Pool?](/guides/what-is-a-liquidity-pool/). That single constraint explains almost everything about the role: where the revenue comes from, who takes the other side, and why the outcome depends more on what the market did than on what the provider intended.

The mechanics are simple enough to describe in a sentence. Deposit two assets into a pool, receive a claim, collect a share of the fee on every trade that executes against your share of the liquidity. The interesting part is what that bargain costs.

<figure class="article-figure">
  <img src="/images/guides/what-is-a-liquidity-provider.webp" alt="Two panels comparing what a liquidity provider is paid against what the same position underwrites." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The two halves of the liquidity provider bargain, only one of which is quoted as a yield. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"When an allocator asks me what an LP is, I tell them it is an options seller with a fee schedule. The position is short gamma: it gains a small, steady premium and takes a loss that grows with the square of how far the market moves. Once you say it that way, the position sizing question answers itself."*

## 1. What the Role Actually Involves

Supplying liquidity has three obligations that a depositor into a savings product does not have.

**You must supply both assets.** A constant-product pool requires the pair in the ratio implied by the current price. Interfaces that accept a single asset perform a swap first, which costs a fee and price impact rather than removing the requirement. See [Single-Sided Liquidity: What One-Sided Provision Really Does](/guides/single-sided-liquidity/).

**You quote continuously, at a price you do not set.** The invariant prices every trade from the reserves. When the external market moves, the pool's quote is stale until someone trades against it, and the person who does is not doing you a favour.

**You are paid per unit of flow, not per unit of time.** A pool with no volume pays nothing regardless of how much capital sits in it. This is the structural difference from lending or staking, both of which accrue with the passage of time.

---

## 2. How LPs Are Paid

Fee revenue over a period is the product of three measurable quantities:

$$
F = f \times V_{\text{routed}} \times s
$$

where $f$ is the fee tier, $V_{\text{routed}}$ is the volume that actually executes against your pool, and $s$ is your share of the liquidity that was active for those trades. In range-based pools, multiply again by the fraction of the period your position was in range.

A worked example on \$25,000 supplied to a 5 bps pool with \$20m of daily routed volume and \$8m of active liquidity in the band:

| Quantity | Value |
| :--- | ---: |
| Your share of active liquidity | 0.312% |
| Gross fees per day | \$31.20 |
| Gross fees over 30 days | \$936 |
| Annualised gross yield | 45.5% |
| Divergence if the pair moves 30% apart | roughly −0.9%, or −\$225 |
| Gas across five transactions | −\$90 |

The annualised figure is the number a pool interface would show. The two rows beneath it are the reason that figure is not the return. Model both sides with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) and the [impermanent loss calculator](/tools/impermanent-loss-calculator/).

Some pools add incentive tokens on top. Those are funded by issuance rather than by trading activity, which makes them a different kind of revenue with a different decay profile, examined in [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

---

## 3. What the Role Costs

Four costs sit against the fee line, and only the first is specific to automated market making.

1. **Inventory rotation.** The invariant sells whichever asset is appreciating. Withdrawing after a divergence returns less than holding the original basket would have, quantified in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).
2. **Adverse selection.** Because the quote cannot be cancelled, informed traders transact against it first. The measure of that transfer is [loss-versus-rebalancing](/guides/loss-versus-rebalancing/).
3. **Friction.** Gas on entry, collection, rebalancing and exit, plus any swap needed to reach the deposit ratio. On small positions this dominates, as set out in [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).
4. **Contract exposure.** The pool, any hook, and any farm or vault wrapper must all keep working for the position to return capital.

---

## 4. Passive Versus Active Providers

The same word covers two quite different jobs.

| | Passive provider | Active provider |
| :--- | :--- | :--- |
| Typical position | Full-range or constant-product | Narrow band, managed |
| Time commitment | Deposit and monitor occasionally | Continuous monitoring and rebalancing |
| Fee density | Low per dollar | High while in range |
| Main risk | Divergence over long horizons | Time out of range and rebalancing cost |
| Suitable size | Any size where gas is immaterial | Large enough to absorb management costs |
| Measurement | Compare against holding, quarterly | Track time in range and net PnL weekly |

Neither is more sophisticated than the other. The mistake is choosing the active structure and then managing it passively, which produces the worst combination: amplified divergence with none of the fee capture that was supposed to pay for it.

### The threshold question nobody asks first

Before any of the arithmetic, there is a prior question: would you hold this basket at all? A liquidity position is a leveraged expression of a view you may not have formed. Supplying ETH against a stablecoin means you are content holding more ETH if it falls and less if it rises. Supplying two volatile assets against each other means you are content holding whichever one underperforms.

Providers who answer that question honestly rarely end up disappointed by divergence, because divergence is simply the pool doing what the invariant promised. Providers who answer it by looking at a yield figure end up holding an asset they never wanted, at a price they would not have chosen, and calling the mechanism unfair.

---

## 5. Where Liquidity Providers Fit in Market Structure

An LP sits between two groups. On one side are traders and aggregators who need executable depth and pay for it. On the other are arbitrageurs and searchers who keep pool prices aligned with the wider market and are compensated out of LP inventory.

That position has consequences worth internalising:

- **Your counterparty is anonymous and often better informed.** Volume is not uniformly valuable; flow from an aggregator routing a retail order is very different from a bot repricing a stale quote. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).
- **Your competition is other LPs.** Adding liquidity to a crowded band dilutes everyone's share, including yours, before a single trade happens.
- **Your leverage is selection, not effort.** The decisions that matter are which pair, which curve, which tier, which range and what size. After that the market decides.

---

## 6. A Checklist Before Taking the Role On

- [ ] Confirm you would hold both assets in the pair, in any ratio, for the intended horizon.
- [ ] Estimate fee income from measured routed volume and current active liquidity, with your capital added to the denominator.
- [ ] Estimate divergence for a realistic price move and check that fee income plausibly clears it.
- [ ] Total the gas for the management cadence you actually intend, at your position size.
- [ ] Read the pool contract, and any hook or wrapper, and confirm the withdrawal path is unconditional.
- [ ] Decide the exit rule before entering: a price, a date, or a measured shortfall against holding.
- [ ] Record entry quantities and prices so the benchmark can be reconstructed later.

The role is legitimate, useful and frequently profitable. It is not a savings account with a better rate, and the providers who do well are the ones who priced the second half of the bargain before signing the first.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
7. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)"
[7]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
