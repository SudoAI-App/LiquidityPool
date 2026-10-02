---
title: "Uniswap v2 vs v3: Which Liquidity Position Suits You"
description: "v2 is a deposit. v3 is a job. The efficiency multiplier is real while you are in range, and here is what it looks like after you multiply by time in range."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "Uniswap v2 vs v3 liquidity"
keywords: "Uniswap v2 vs v3 liquidity, Uniswap v2 liquidity pool, v2 vs v3 capital efficiency, full range liquidity, passive liquidity provision"
featured: false
faq:
  - q: "What is the difference between Uniswap v2 and v3?"
    a: "v2 spreads liquidity across every possible price and requires no management. v3 lets each provider choose a price range, which concentrates depth and multiplies fee income per dollar while introducing time out of range and a management workload."
  - q: "Is Uniswap v3 always better than v2?"
    a: "No. v3 earns more per dollar only while the position is in range, and it costs gas to keep it there. On volatile pairs, small positions, or for providers who will not monitor, a full-range position can do better after costs."
  - q: "Can you provide full-range liquidity on Uniswap v3?"
    a: "Yes. Minting a position across the full tick range reproduces v2-style behaviour with v3 fee tiers. It costs more gas than a v2 deposit, and like v2 it never goes out of range."
  - q: "Does Uniswap v2 have impermanent loss?"
    a: "Yes, and it follows the standard curve: about 5.7% against holding at a doubling or halving of the price ratio, and 20% at a four-times move. A v3 band takes the same divergence amplified while the price is inside it. Once the position converts it stops rotating, but its shortfall against holding keeps growing if the price keeps moving."
  - q: "Which version pays more in fees?"
    a: "Whichever one holds liquidity where the volume actually trades. A concentrated position in a well-chosen band earns several times more per dollar than a full-range one while in range; the same position out of range earns nothing at all."
---

People describe the move from v2 to v3 as an efficiency upgrade. For you it is closer to a change of job.

v2 is a deposit. v3 is a position that needs managing, and the higher fee income is payment for that work rather than something you get for free.

So the question is not which contract is more advanced. It is which one matches how much attention you will actually give it, and this guide helps you answer that with numbers.

<figure class="article-figure">
  <img src="/images/guides/uniswap-v2-vs-v3.webp" alt="Comparison table of Uniswap v2 and v3 across deposit, capital efficiency, fee tiers, divergence, time in range and work required." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same pair, two products: a passive claim and a managed position. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> The efficiency multiple is quoted as a big number, and it is real while the price sits inside your band. Multiply it by the fraction of the month you were actually in range and it shrinks quickly. A comparison that leaves out that second term compares a best case against an average.

## What actually changed

In v2, every provider supplies the same curve across every price from zero upward [1]. Your share is a fungible ERC-20 token — interchangeable with everyone else's, like any standard token [7]. There is one fee, 0.30%, and nothing to maintain.

Since governance passed the UNIfication proposal in December 2025, a protocol fee takes one-sixth of that 0.30%, so v2 providers now receive 0.25% of each trade [8]. On v3 the protocol fee applies only to selected pools.

In v3 you choose two prices. The same curve is shifted so your money runs out at those bounds, which means it backs far more depth inside the band and none outside it [2]. Each fee tier is a separate pool, and your claim becomes a non-fungible token (NFT) under the ERC-721 standard, because no two ranges are interchangeable [2] [9].

The pricing maths inside a band is the same. Divergence, losses to arbitrage, and fee accrual all work the same way. The difference is where the liquidity sits. The machinery both versions share is laid out in [Uniswap Liquidity Pools](/guides/uniswap-liquidity-pools/).

## The efficiency multiple, honestly

A band backs more depth than a full-range deposit of the same size, and the narrower the band, the bigger the multiple.

$$
C = \frac{1}{1 - \left(\frac{p_a}{p_b}\right)^{1/4}}
$$

Where:

- $p_a$ and $p_b$ are the bottom and top of your band, with the current price near the middle.
- $C$ is how many times more depth your money backs than the same money spread across all prices.

A band of plus or minus 10% gives about twenty times. Plus or minus 2% gives about a hundred. The [concentrated liquidity calculator](/tools/uniswap-v3-liquidity-calculator/) works out the multiple, the fee projection, and the token mix at both edges for a specific band.

Now apply the second term. The time-in-range figures below are illustrative assumptions, not measurements:

| What you supply | The multiple | Assumed time in range | Effective multiple |
| :--- | ---: | ---: | ---: |
| Full range, like v2 | 1x | 100% | 1x |
| Plus or minus 20% | about 10x | 80% | about 8x |
| Plus or minus 10% | about 20x | 55% | about 11x |
| Plus or minus 2% | about 100x | 15% | about 15x |

Read the last column. Going from a hundred times to fifteen is not a rounding error, and every exit and re-entry costs gas on top.

The point is not that narrow is bad. It is that the gain flattens out while gas and attention costs keep climbing. Research on real v3 positions reaches the same place: the larger returns go to providers who accept more risk and manage actively [5]. See [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/).

## Divergence behaves differently at the edges

On a v2 position, the shortfall against holding keeps growing as the price ratio moves further from where you entered. You always hold some of both tokens [1].

On a v3 position, that shortfall is amplified inside the band. For small moves it scales by roughly the same multiple as the fees [6]. Once the price crosses a bound and the position fully converts, the pool stops trading it, but the market keeps moving. Every further move widens the gap against the basket you started with.

That gap is still impermanent loss — the shortfall between a pool position and simply holding — measured at today's price. A tool that stops measuring at the edge of your band will make a converted position look far better than it is. See [Impermanent Loss Examples](/guides/impermanent-loss-examples/).

## A month, two providers

\$30,000 each into ETH against dollars, for thirty days. The pair drifts 9% higher, with volatility around 55% a year.

| | Full range | Plus or minus 8% band |
| :--- | :--- | :--- |
| Fee income per dollar | Baseline, all month | About 25 times, while in range |
| What happened | Nothing. Never touched | Price left the band around day eleven |
| Transactions | One mint, one exit | Mint, exit, two re-centres, exit |
| Divergence against holding | About 0.1% from the 9% drift | Amplified while in range, and locked in at each re-centre |
| Attention required | None | Watching, and two decisions |

Whether the second provider comes out ahead depends on how much of the month the band was in range, what the two re-centres cost, and whether the pool's fees outpace what arbitrage takes [4]. On a cheap network with a disciplined rule, it can win comfortably. On an expensive one at a small size, the same strategy can finish behind the position that needed no attention at all.

## Which one fits how you work

| If this describes you | Choose | Why |
| :--- | :--- | :--- |
| You will look at the position once a month or less | Full range, v2 style | It degrades gradually and asks nothing of you |
| You can check weekly and act on a written rule | A wide v3 band, plus or minus 20% or more | Several times the income, and exits stay rare |
| You watch daily, or run automation | A narrower v3 band | The extra income is paid for by attention you actually have |
| Your position is a few thousand dollars on a high-gas network | Full range, or a cheaper network | Gas for re-centring can outrun the extra fees |

Be honest about the first column. Planning to watch a narrow band daily and then checking it every couple of weeks is the worst combination of the four. Uniswap's own risk guidance names both out-of-range time and the network cost of managing a range [3].

## What migrating actually costs

Moving a position is not free. You withdraw, possibly swap to reach the new ratio, and mint again. That pays gas more than once, locks in your current token mix, and moves the price against you on the swap.

One practical test before you move anything. Take the fees your v2 position actually earned over the last thirty days. Estimate what the same money would have earned in the v3 band you have in mind, multiplied by the share of that month the price really spent inside it. If the difference does not repay the gas and the swap within a month, stay where you are.

A sensible default is to migrate with new money rather than churning what you have. The exception is when the destination's volume per unit of liquidity is clearly and persistently higher.

Where a pair has moved wholesale to a newer version, a month of data makes that obvious. Where it has not, migrating is a cost with no extra revenue attached.

## Four numbers before you choose

1. **Volume routed to that specific pool and tier**, not the pair's total.
2. **How much liquidity already sits in the band you want**, from the pool's liquidity distribution rather than its headline size.
3. **How much the pair actually moved** over seven and thirty days.
4. **Your own past time in range**, if you have run anything similar. [Revert Finance](https://revert.finance) reconstructs it.

With those four, the choice usually makes itself, and for individuals it often favours the simpler structure. In aggregate, a 2021 study of large v3 pools found that providers' impermanent loss exceeded the fees they earned [6].

Attention is a real budget. A concentrated position watched for a fortnight and then forgotten can end up holding one token and earning nothing while you believe your money is working.

A full-range position that gets forgotten just keeps quoting. For a portfolio that already needs attention elsewhere, the structure that degrades gradually is worth a lower headline number. See [Types of Liquidity Pools](/guides/liquidity-pool-types/).

## The checklist

1. **Decide the cadence you will genuinely maintain**, then pick the structure that matches it.
2. **Compute the effective multiple**, not the advertised one, with an honest time-in-range estimate.
3. **Compare gas for that cadence** against expected fee income at your size.
4. **For a band, compute what you hold at both edges** and accept both.
5. **Check where volume routes** before assuming the newer pool is deeper.
6. **Record what you deposited**, either way, so you can compare the two approaches on your own data later.

## Before you migrate

The newer contract is more capable. Whether it is more profitable for you is an operational question, and the answer is often no. Read [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/) for how a band is stored, and [Uniswap v3 vs v4](/guides/uniswap-v3-vs-v4/) for what a later move would change. If you are comparing the same design on Solana, the [Raydium CLMM Liquidity Guide](/guides/raydium-clmm-liquidity-guide/) applies the same arithmetic.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
7. [ERC-20: Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-20)
8. [Fees | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/fees)
9. [ERC-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-721)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[7]: https://eips.ethereum.org/EIPS/eip-20 "ERC-20: Token Standard"
[8]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees | Uniswap Developers"
[9]: https://eips.ethereum.org/EIPS/eip-721 "ERC-721: Non-Fungible Token Standard"
