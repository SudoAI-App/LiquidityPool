---
title: "Dynamic Fees in AMMs: Charging for Volatility"
description: "How dynamic fee mechanisms work in automated market makers, what they are trying to price, where they help liquidity providers, and what a fee hook can and cannot fix."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Marcus Vance"
readTime: "11 min read"
keywords: "dynamic fees AMM, Uniswap v4 dynamic fee hook, volatility accumulator, fee tier vs dynamic fee, adverse selection pricing, AMM fee design"
featured: false
faq:
  - q: "What is a dynamic fee in an AMM?"
    a: "A pool fee that changes with conditions rather than staying fixed at deployment. Implementations raise the fee when recent volatility or trade intensity rises, so that trades most likely to be exploiting a stale quote pay more than ordinary flow does."
  - q: "Why do dynamic fees help liquidity providers?"
    a: "Because adverse selection scales with volatility while a fixed fee does not. Raising the charge precisely when the pool is most likely to be arbitraged narrows the gap between what the pool earns and what it loses to informed flow."
  - q: "How does a volatility accumulator work?"
    a: "It tracks how far and how fast price has moved across bins or ticks recently, decaying over time. The accumulated value feeds a fee function, so a rapid sequence of price-moving trades raises the fee while a quiet market lets it decay back to a floor."
  - q: "Do dynamic fees eliminate loss-versus-rebalancing?"
    a: "No. They reduce the amount extractable per unit of volatility but do not remove the structural disadvantage of a quote that cannot be cancelled. Auctions, oracle-referenced pricing and batching address different parts of the same problem."
  - q: "Where are dynamic fees available?"
    a: "In Uniswap v4 through hooks that set the fee per swap, in discrete bin designs that derive a fee from a volatility accumulator, and in several protocol-specific implementations that adjust fees from realised volatility or pool imbalance."
---

A fixed fee tier prices every trade the same way, which means it is wrong most of the time. It is too expensive for ordinary flow in calm markets and far too cheap for the arbitrage trade that reprices a stale quote after a sharp move.

Dynamic fees are the attempt to close that gap inside the pool, rather than asking liquidity providers to absorb it.

<figure class="article-figure">
  <img src="/images/guides/dynamic-fees-in-amms.webp" alt="Chart comparing two fixed fee tiers against a dynamic fee that rises with realised volatility." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What a pool charges as conditions change, under fixed tiers and under a volatility-linked hook. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"From a searcher's perspective, a fixed-fee pool during a volatile minute is the cheapest inventory on the market. You are paying five basis points to take a quote that is thirty basis points stale. A fee that moves with realised volatility does not stop the trade; it just means the pool keeps a larger share of what the trade was worth."*

## 1. What the Fee Is Actually Pricing

A pool fee compensates liquidity providers for two distinct services, and they have different costs.

**Supplying depth to uninformed flow.** A trader who wants to swap for their own reasons pays the fee and leaves. This is the profitable half of the business, and it is not very sensitive to volatility.

**Standing still while informed traders reprice you.** Someone who knows the external price has moved trades against the pool until the quote catches up. The value transferred grows with the square of volatility, as formalised by loss-versus-rebalancing [4].

A single fixed fee has to cover both. Set it low and the second group extracts freely; set it high and the first group routes elsewhere. Dynamic fees separate the two by charging more in exactly the conditions where the second group is active.

---

## 2. How Implementations Work

Three mechanisms appear in production.

**Volatility accumulators.** Discrete bin designs track how many bins price has crossed in a recent window, decaying the measure over time. Rapid movement raises the accumulator, which raises the fee; calm lets it decay to a floor. The design is described in [Discretized Liquidity (DLMM)](/guides/discretized-liquidity-dlmm-explained/).

**Fee hooks.** Uniswap v4 allows a pool to delegate its fee to a hook contract that can set it per swap [2]. The function can reference recent price movement, trade size, oracle deviation, or anything else the hook can observe onchain.

**Imbalance-linked fees.** Some stable pool designs raise the fee as reserves skew away from balance, which charges more for the trades that push the pool toward its dangerous region.

All three share a limitation: they can only react to what has already happened onchain. A fee that responds to realised volatility is always slightly behind the move that motivated it.

---

## 3. What It Is Worth to a Liquidity Provider

Consider a pool where fee income and adverse selection are both measurable over a month.

| Regime | Days | Fixed 5 bps fee income | Adverse selection | Net |
| :--- | ---: | ---: | ---: | ---: |
| Calm | 22 | \$4,400 | \$900 | +\$3,500 |
| Volatile | 8 | \$3,200 | \$5,600 | −\$2,400 |
| Month total | 30 | \$7,600 | \$6,500 | +\$1,100 |

Now apply a dynamic fee that averages 5 bps in calm conditions and 22 bps during the volatile days. Assume the higher fee costs some volume, say a third of it.

| Regime | Fee income | Adverse selection | Net |
| :--- | ---: | ---: | ---: |
| Calm | \$4,400 | \$900 | +\$3,500 |
| Volatile | \$9,400 | \$5,600 | +\$3,800 |
| Month total | \$13,800 | \$6,500 | +\$7,300 |

The volume lost during the volatile period is the cost. The arithmetic favours the dynamic fee here because the trades that left were the expensive ones. Whether it does in a specific pool depends on the mix of informed and uninformed flow, which is measurable with the tools listed in [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

---

## 4. Where It Fails

Dynamic fees are not a solution to adverse selection, only a partial repricing of it. Four limitations are structural:

1. **Reaction lag.** The fee rises after the move begins, so the first and most valuable arbitrage trade still pays the floor rate.
2. **Routing sensitivity.** Aggregators compare paths at execution time. A pool whose fee has spiked is skipped, including by flow that would have been profitable.
3. **Parameter risk.** The function that sets the fee is code with parameters, and those parameters can be set badly or changed by governance.
4. **It does not touch the ordering advantage.** The searcher still chooses when to trade. Auctions and batch settlement address that; a fee does not.

---

## 5. What a Provider Should Check

Before supplying a dynamic-fee pool:

- **Read the hook or fee contract.** What inputs does it use, what is the floor, what is the cap, and can either be changed?
- **Check the upgrade authority.** A fee function behind an upgradeable proxy is a live governance exposure.
- **Look at the realised distribution, not the mean.** A pool that spends most of its life at the floor and spikes occasionally behaves very differently from one sitting near its cap.
- **Compare against the fixed-tier alternative on the same pair.** If a fixed 30 bps pool holds the volume, the dynamic pool may be an interesting design with no flow.
- **Confirm the hook's other permissions.** Fee setting is often bundled with lifecycle callbacks that can affect liquidity operations, as covered in [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).

---

## 6. How This Fits the Broader Design Space

Dynamic fees are one of four families of response to the same problem, and they are the least invasive.

| Approach | What it changes | Cost |
| :--- | :--- | :--- |
| Dynamic fees | Price of the arbitrage trade | Lost volume when the fee spikes |
| First-trade auctions | Who captures the arbitrage | Auction infrastructure and latency |
| Oracle-referenced pricing | The quote itself | Oracle dependency and manipulation surface |
| Batch settlement | The ordering advantage | Execution moves off the curve |

None removes the underlying condition, which is that a passive quote cannot be cancelled. They redistribute who keeps the value that condition creates.

### The parameter that decides everything

Every dynamic fee implementation reduces to a function mapping some observable to a fee. The observable is usually recent price movement; the function is usually monotonic with a floor and a cap. Two parameters do most of the work.

**The decay rate** sets how quickly the fee falls after a volatile period. Decay too fast and the pool returns to underpricing before the volatility has actually finished. Decay too slowly and the pool stays expensive through the calm period that follows, losing exactly the benign flow it wanted.

**The cap** sets the worst case for traders and the best case for providers. A cap set high enough to matter during a genuine dislocation is also high enough to make the pool uncompetitive at moments when the mechanism has misread ordinary movement as informed flow.

Neither parameter has a universally correct value, and both are usually set once at deployment for a pair whose behaviour will change. Ask when the parameters were last reviewed and against what data, because a fee function tuned for one volatility regime is simply a differently wrong fixed fee in another.

---

## 7. Checklist

- [ ] Identify whether the pool's fee is fixed or hook-set before comparing yields.
- [ ] Read the fee function's inputs, floor, cap and governance controls.
- [ ] Request or reconstruct the realised fee distribution over at least a month.
- [ ] Compare routed volume against fixed-tier pools on the same pair.
- [ ] Check the hook's full permission set, not only its fee behaviour.
- [ ] Re-evaluate after any parameter change, since the pool you deposited into is defined by that function.

A dynamic fee is a better instrument than a fixed tier for pairs whose volatility varies. It is not protection, and a pool advertising one still needs the same volume and security checks as any other.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Trader Joe Liquidity Book documentation](https://docs.traderjoexyz.com/concepts/concentrated-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
6. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)](https://arxiv.org/abs/2305.14604)
7. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://docs.traderjoexyz.com/concepts/concentrated-liquidity "Trader Joe Liquidity Book documentation"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[6]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)"
[7]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
