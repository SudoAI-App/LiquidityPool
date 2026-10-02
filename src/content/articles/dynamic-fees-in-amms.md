---
title: "Dynamic Fees in AMMs: Charging for Volatility"
description: "A fixed fee is wrong most of the time. Too dear in calm markets, far too cheap when somebody is picking you off. What moving fees fix, and what they cannot."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "dynamic fees AMM"
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
    a: "In Uniswap v4 pools created with the dynamic-fee flag, where a hook can set the fee per swap; in bin designs such as LFJ Liquidity Book and Meteora DLMM, which add a variable fee driven by a volatility accumulator; and in Curve's Stableswap-NG pools, which raise the fee as the pool moves away from balance."
---

A fixed fee charges every trade the same, so it is rarely the right price for any of them.

On a quiet day it can be too expensive for ordinary traders, who route elsewhere. After a sharp move it is too cheap for the trader who picks off your stale quote, which is when you most need the income.

A dynamic fee tries to fix that inside the pool. By the end, you should be able to judge whether a pool's moving fee is likely to earn you more than a fixed tier, and what it still leaves you exposed to.

<figure class="article-figure">
  <img src="/images/guides/dynamic-fees-in-amms.webp" alt="Chart comparing two fixed fee tiers against a dynamic fee that rises with realised volatility." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What a pool charges as conditions change, under fixed tiers and under a volatility-linked hook. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> During a volatile minute, a fixed-fee pool can be the cheapest place to buy. An arbitrageur pays a fee of five basis points — 0.05% — to take a quote that is thirty basis points away from the market. A fee that rises with volatility does not stop that trade. It means the pool keeps more of what the trade was worth.

## What the fee is actually paying for

A pool fee covers two completely different services, and they cost different amounts.

**Serving ordinary traders.** Somebody swaps for their own reasons, pays the fee, and leaves. This is the profitable half, and it barely changes with volatility.

**Standing still while somebody reprices you.** A trader who knows the price moved elsewhere trades against you until your quote catches up. What they take grows with the square of volatility [4].

One fixed number has to cover both. Set it low and the second group takes freely. Set it high and the first group goes somewhere cheaper, and the pool's price also tracks the market less closely [5]. A moving fee tries to separate them by charging more when the second group is most active.

Fixed tiers have been the standard design for most of the history of onchain exchanges. Uniswap v3, for example, launched with three tiers of 0.05%, 0.30% and 1%, chosen when a pool is created [1].

## Three ways it is done

| Mechanism | How it decides | Where you find it |
| :--- | :--- | :--- |
| Counting price movement | How many price bins recent swaps have crossed, decaying over time [3] | Bin designs. See [DLMM Explained](/guides/discretized-liquidity-dlmm-explained/) |
| Custom code per swap | Whatever the code can observe on chain | Uniswap v4 hooks [2] [8] |
| Imbalance | How far the pool's balances have moved from the peg | Curve Stableswap-NG pools [10] |

The three share one limitation when they read only onchain history. They react to what has already happened, so the fee trails the move that triggered it.

In Uniswap v4 the choice is made at creation. A pool either has a static fee or carries the dynamic-fee flag, and only then can its hook change the fee, as often as every swap [2] [8].

## What it is actually worth

Take an illustrative pool over one month at a fixed 0.05%. "What arbitrage took" is the pool's LVR (loss-versus-rebalancing), the value it lost to arbitrageurs measured against a portfolio that trades at market prices [4].

| | Days | Fees earned | What arbitrage took | Net |
| :--- | ---: | ---: | ---: | ---: |
| Calm | 22 | \$4,400 | \$900 | +\$3,500 |
| Volatile | 8 | \$3,200 | \$5,600 | -\$2,400 |
| **Month** | 30 | \$7,600 | \$6,500 | **+\$1,100** |

The eight volatile days erased about two-thirds of the calm days' net. Now apply a fee of 0.05% when quiet and an average of 0.22% during those eight days. Assume the higher fee drives away a third of the volume. Keep the arbitrage loss at \$5,600, which is conservative, since a higher fee also shrinks what arbitrage can take [6]. On those assumptions:

| | Fees earned | What arbitrage took | Net |
| :--- | ---: | ---: | ---: |
| Calm | \$4,400 | \$900 | +\$3,500 |
| Volatile | \$9,400 | \$5,600 | +\$3,800 |
| **Month** | \$13,800 | \$6,500 | **+\$7,300** |

Volatile-day fees are \$3,200 × (0.22 ÷ 0.05) × ⅔ ≈ \$9,400. The lost third of volume is the cost. It was worth paying here because the fee on the remaining two-thirds rose 4.4 times.

Whether it works out this way in a specific pool depends entirely on the mix of ordinary and informed flow, which is measurable. See [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/). For a position you already hold, the [LP profit calculator](/tools/lp-profit-calculator/) nets that variable fee income against divergence and gas.

## Four things it cannot fix

1. **It reacts late.** A fee driven by onchain history rises after the move starts, so the first and most valuable arbitrage trade can still pay the floor.
2. **Routers notice immediately.** A pool whose fee has spiked gets skipped, including by flow that would have been profitable for you.
3. **It is code with settings.** Those settings can be chosen badly, or changed later by a vote.
4. **It does not change who goes first.** Searchers still compete to be first in the block, and much of the value goes to whoever orders it [7]. Auctions and batch settlement address that. A fee does not.

## The two settings that decide everything

Every implementation reduces to a function turning some observation into a fee, usually with a floor and a cap. Two parameters do most of the work.

**How fast it decays.** Too fast and the pool goes back to underpricing before the volatility has actually finished. Too slow and it stays expensive through the calm period afterwards, driving away exactly the benign flow it wanted.

**The cap.** Set it high enough to matter during a genuine dislocation and it is also high enough to make the pool uncompetitive when the mechanism mistakes ordinary movement for informed flow.

Neither has a universally correct value, and both are usually set once at deployment for a pair whose behaviour will change.

So ask when they were last reviewed and against what data. A fee function tuned for one volatility regime is just a differently wrong fixed fee in another. The bin-based design where the fee raises itself from price crossings is followed step by step in [Meteora DLMM Strategy](/guides/meteora-dlmm-strategy/).

## Reading a pool's fee history

Before you trust a moving fee, pull a month of what it actually charged, swap by swap. The shape of that record tells you more than the settings do.

| What the record looks like | What it tells you |
| :--- | :--- |
| At the floor almost always, with short spikes | Working as intended. Calm traders get a good rate, and fast moves get charged |
| Near the cap much of the time | Either the pair is extremely volatile, or the settings mistake normal movement for danger. Routers are probably skipping the pool |
| Flat at one level | The moving part never moves. You have a fixed tier with extra code attached |
| Spikes that start well after big price moves | The fee reacts too slowly. The valuable arbitrage trade has already paid the floor |

Then line the spikes up against the pool's volume. If volume collapses every time the fee rises, the pool is protecting depositors from arbitrage by also turning away the customers who pay them.

## Where dynamic fees sit among the alternatives

| Approach | What it changes | What it costs |
| :--- | :--- | :--- |
| Moving fees | The price of the arbitrage trade | Volume lost when the fee spikes |
| Auctioning the right to trade first | Who keeps the arbitrage profit [9] | Auction infrastructure and a manager role |
| Quoting around an outside price | The quote itself | A price feed you now depend on |
| Batch settlement | The advantage of going first | Execution moves off the curve |

If you are choosing between two pools on the same pair, one fixed and one moving, compare them over the same month on three numbers. Fees earned per dollar of liquidity. The share of volume that was arbitrage. And how often routers skipped the moving pool when its fee was high. The moving pool should win the first two by more than it loses on the third.

None removes the underlying condition, which is that a passive quote cannot be cancelled. They change how much of the resulting value stays with depositors. For a different approach, compare Curve's internal re-centring in [Curve v2 Explained](/guides/curve-v2-cryptoswap-explained/).

## Before you supply a dynamic-fee pool

1. **Read the fee code.** What does it look at, what is the floor, what is the cap, and can either change?
2. **Check who can upgrade it.** A fee function behind a proxy is a live governance exposure.
3. **Get the realised distribution, not the average.** At least a month of it.
4. **Compare routed volume against the fixed-tier pool** on the same pair. An interesting design with no flow pays nothing.
5. **Check the hook's other permissions.** Fee setting is often bundled with callbacks that can affect your liquidity. See [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).
6. **Re-evaluate after any parameter change.** The pool you deposited into is defined by that function.

A moving fee is a better instrument than a fixed tier for pairs whose volatility varies. It is not protection, so a pool advertising one still needs every other check. Remember that a moving fee charges arbitrage more but does not stop it, and that the average fee hides the distribution you actually earn.

## References

1. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Fees (LFJ Liquidity Book developer documentation)](https://developers.lfj.gg/concepts/fees)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Optimal Fees for Geometric Mean Market Makers (Evans, Angeris & Chitra, 2021)](https://arxiv.org/abs/2104.00446)
6. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis, Moallemi & Roughgarden, 2023)](https://arxiv.org/abs/2305.14604)
7. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
8. [Dynamic Fees (Uniswap v4 developer documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/dynamic-fees)
9. [am-AMM: An Auction-Managed Automated Market Maker (Adams et al., 2024)](https://arxiv.org/abs/2403.03367)
10. [Stableswap-NG: Overview (Curve documentation)](https://docs.curve.finance/developer/amm/stableswap-ng/overview)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core (Adams et al., 2021)"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core (Adams et al., 2024)"
[3]: https://developers.lfj.gg/concepts/fees "Fees (LFJ Liquidity Book developer documentation)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[5]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans, Angeris & Chitra, 2021)"
[6]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis, Moallemi & Roughgarden, 2023)"
[7]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[8]: https://developers.uniswap.org/docs/protocols/v4/concepts/dynamic-fees "Dynamic Fees (Uniswap v4 developer documentation)"
[9]: https://arxiv.org/abs/2403.03367 "am-AMM: An Auction-Managed Automated Market Maker (Adams et al., 2024)"
[10]: https://docs.curve.finance/developer/amm/stableswap-ng/overview "Stableswap-NG: Overview (Curve documentation)"
