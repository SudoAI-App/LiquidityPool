---
title: "Dynamic Fees in AMMs: Charging for Volatility"
description: "A fixed fee is wrong most of the time. Too dear in calm markets, far too cheap when somebody is picking you off. What moving fees fix, and what they cannot."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Marcus Vance"
readTime: "6 min read"
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

A fixed fee charges everybody the same, which means it is wrong almost all the time.

Too expensive for ordinary traders on a quiet day, so they route elsewhere. Far too cheap for the trade that picks off your stale quote after a sharp move, which is exactly when you needed the money.

Moving fees are the attempt to fix that inside the pool rather than asking you to absorb it. This guide covers how they work, what one is actually worth in numbers, and the four things they cannot fix.

<figure class="article-figure">
  <img src="/images/guides/dynamic-fees-in-amms.webp" alt="Chart comparing two fixed fee tiers against a dynamic fee that rises with realised volatility." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What a pool charges as conditions change, under fixed tiers and under a volatility-linked hook. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"From the other side of the trade, a fixed-fee pool during a volatile minute is the cheapest inventory on the market. You pay five basis points to take a quote that is thirty basis points stale. A fee that moves with volatility does not stop that trade. It just means the pool keeps more of what the trade was worth."*

## What the fee is actually paying for

A pool fee covers two completely different services, and they cost different amounts.

**Serving ordinary traders.** Somebody swaps for their own reasons, pays the fee, and leaves. This is the profitable half, and it barely changes with volatility.

**Standing still while somebody reprices you.** A trader who knows the price moved elsewhere trades against you until your quote catches up. What they take grows with the square of volatility [4].

One fixed number has to cover both. Set it low and the second group takes freely. Set it high and the first group goes somewhere cheaper. A moving fee separates them by charging more precisely when the second group is active.

## Three ways it is done

| Mechanism | How it decides | Where you find it |
| :--- | :--- | :--- |
| Counting price movement | How many price steps have been crossed recently, decaying over time | Bin designs. See [DLMM Explained](/guides/discretized-liquidity-dlmm-explained/) |
| Custom code per swap | Whatever the code can observe on chain | Uniswap v4 hooks [2] |
| Imbalance | How far the pool's balances have skewed | Some stable-pair designs |

All three share one limitation. They can only react to what has already happened on chain, so the fee is always slightly behind the move that triggered it.

## What it is actually worth

A pool where both sides are measurable over a month, at a fixed 0.05%:

| | Days | Fees earned | What arbitrage took | Net |
| :--- | ---: | ---: | ---: | ---: |
| Calm | 22 | \$4,400 | \$900 | +\$3,500 |
| Volatile | 8 | \$3,200 | \$5,600 | -\$2,400 |
| **Month** | 30 | \$7,600 | \$6,500 | **+\$1,100** |

The volatile week wiped out most of the calm month. Now apply a fee averaging 0.05% when quiet and 0.22% during those eight days, and assume the higher fee costs a third of the volume:

| | Fees earned | What arbitrage took | Net |
| :--- | ---: | ---: | ---: |
| Calm | \$4,400 | \$900 | +\$3,500 |
| Volatile | \$9,400 | \$5,600 | +\$3,800 |
| **Month** | \$13,800 | \$6,500 | **+\$7,300** |

The lost volume is the cost, and it was worth paying because the trades that left were the expensive ones.

Whether it works out this way in a specific pool depends entirely on the mix of ordinary and informed flow, which is measurable. See [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

## Four things it cannot fix

1. **It reacts late.** The fee rises after the move starts, so the first and most valuable arbitrage trade still pays the floor.
2. **Routers notice immediately.** A pool whose fee has spiked gets skipped, including by flow that would have been profitable for you.
3. **It is code with settings.** Those settings can be chosen badly, or changed later by a vote.
4. **It does not touch who goes first.** The searcher still chooses when to trade. Auctions and batch settlement address that. A fee does not.

## The two settings that decide everything

Every implementation reduces to a function turning some observation into a fee, usually with a floor and a cap. Two parameters do most of the work.

**How fast it decays.** Too fast and the pool goes back to underpricing before the volatility has actually finished. Too slow and it stays expensive through the calm period afterwards, driving away exactly the benign flow it wanted.

**The cap.** Set it high enough to matter during a genuine dislocation and it is also high enough to make the pool uncompetitive when the mechanism mistakes ordinary movement for informed flow.

Neither has a universally correct value, and both are usually set once at deployment for a pair whose behaviour will change.

So ask when they were last reviewed and against what data. A fee function tuned for one volatility regime is just a differently wrong fixed fee in another.

## Reading a pool's fee history

Before you trust a moving fee, pull a month of what it actually charged, swap by swap. The shape of that record tells you more than the settings do.

| What the record looks like | What it tells you |
| :--- | :--- |
| At the floor almost always, with short spikes | Working as intended. Calm traders get a good rate, and fast moves get charged |
| Near the cap much of the time | Either the pair is extremely volatile, or the settings mistake normal movement for danger. Routers are probably skipping the pool |
| Flat at one level | The moving part never moves. You have a fixed tier with extra code attached |
| Spikes that start well after big price moves | The fee reacts too slowly. The valuable arbitrage trade has already paid the floor |

Then line the spikes up against the pool's volume. If volume collapses every time the fee rises, the pool is protecting depositors from arbitrage by also turning away the customers who pay them.

## What people get wrong about moving fees

| What people assume | What actually happens |
| :--- | :--- |
| It protects me from arbitrage | It charges arbitrage more. The trade still happens |
| Higher fees always mean more income | Routers skip you. Lost volume is the cost |
| The average fee is what I earn | Look at the distribution. Floor most of the time with spikes behaves very differently from sitting near the cap |
| It is a protocol feature | It is somebody's code, with settings, possibly changeable |

## Where dynamic fees sit among the alternatives

| Approach | What it changes | What it costs |
| :--- | :--- | :--- |
| Moving fees | The price of the arbitrage trade | Volume lost when the fee spikes |
| Auctioning the first trade | Who keeps the arbitrage profit | Infrastructure, and a delay |
| Quoting around an outside price | The quote itself | A price feed you now depend on |
| Batch settlement | The advantage of going first | Execution moves off the curve |

If you are choosing between two pools on the same pair, one fixed and one moving, compare them over the same month on three numbers. Fees earned per dollar of liquidity. The share of volume that was arbitrage. And how often routers skipped the moving pool when its fee was high. The moving pool should win the first two by more than it loses on the third.

None removes the underlying condition, which is that a passive quote cannot be cancelled. They redistribute who keeps the value that condition creates.

## Before you supply a dynamic-fee pool

1. **Read the fee code.** What does it look at, what is the floor, what is the cap, and can either change?
2. **Check who can upgrade it.** A fee function behind a proxy is a live governance exposure.
3. **Get the realised distribution, not the average.** At least a month of it.
4. **Compare routed volume against the fixed-tier pool** on the same pair. An interesting design with no flow pays nothing.
5. **Check the hook's other permissions.** Fee setting is often bundled with callbacks that can affect your liquidity. See [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).
6. **Re-evaluate after any parameter change.** The pool you deposited into is defined by that function.

A moving fee is a better instrument than a fixed tier for pairs whose volatility varies. It is not protection, and a pool advertising one still needs every other check.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)](https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
6. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)](https://arxiv.org/abs/2305.14604)
7. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873 "Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[6]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)"
[7]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
