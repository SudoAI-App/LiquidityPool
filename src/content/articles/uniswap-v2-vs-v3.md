---
title: "Uniswap v2 vs v3: Which Liquidity Position Suits You"
description: "v2 is a deposit. v3 is a job. The efficiency multiplier is real while you are in range, and here is what it looks like after you multiply by time in range."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "6 min read"
keywords: "Uniswap v2 vs v3 liquidity, Uniswap v2 liquidity pool, v2 vs v3 capital efficiency, full range liquidity, passive liquidity provision"
featured: false
faq:
  - q: "What is the difference between Uniswap v2 and v3?"
    a: "v2 spreads liquidity across every possible price and requires no management. v3 lets each provider choose a price range, which concentrates depth and multiplies fee income per dollar while introducing time out of range and a management workload."
  - q: "Is Uniswap v3 always better than v2?"
    a: "No. v3 earns more per dollar only while the position is in range, and it costs gas to keep it there. On volatile pairs, small positions, or for providers who will not monitor, a full-range position behaves better after costs."
  - q: "Can you provide full-range liquidity on Uniswap v3?"
    a: "Yes. Minting a position across the full tick range reproduces v2-style behaviour with v3 fee tiers, at higher gas than v2 and with the same absence of boundary risk."
  - q: "Does Uniswap v2 have impermanent loss?"
    a: "Yes, and it follows the standard curve: 5.72% at a doubling, 20% at a four-times move. v3 experiences the same divergence amplified while price is inside a narrow band. Once the position converts it stops rotating, but its shortfall against holding keeps growing if the price keeps moving."
  - q: "Which version pays more in fees?"
    a: "Whichever one holds liquidity where the volume actually trades. A concentrated position in a well-chosen band earns several times more per dollar than a full-range one; the same position out of range earns nothing at all."
---

People describe the move from v2 to v3 as an efficiency upgrade. For you it is closer to a change of job.

v2 is a deposit. v3 is a position that needs managing, and the higher fee income is payment for that work rather than something you get for free.

So the question is not which contract is more advanced. It is which one matches how much attention you will actually give it.

<figure class="article-figure">
  <img src="/images/guides/uniswap-v2-vs-v3.webp" alt="Comparison table of Uniswap v2 and v3 across deposit, capital efficiency, fee tiers, divergence, time in range and work required." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same pair, two products: a passive claim and a managed position. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"The efficiency multiple is quoted as a big number, and it is real while the price sits inside your band. Multiply it by the fraction of the month you were actually in range and it gets ordinary very fast. Anyone comparing these two without that second term is comparing a best case against an average."*

## What actually changed

In v2, every provider supplies the same curve across every price from zero upward [1]. Shares are interchangeable, there is one fee, and there is nothing to maintain.

In v3 you choose two prices. The same curve gets shifted so your money runs out at those bounds, which means it backs far more depth inside the band and none outside it [2]. Each fee tier becomes a separate pool, and your claim becomes an NFT.

The pricing maths is identical. Divergence, being picked off, and fee accrual all work the same way. The only difference is where the liquidity sits.

## The efficiency multiple, honestly

$$
C = \frac{1}{1 - \left(\frac{p_a}{p_b}\right)^{1/4}}
$$

Where:

- $p_a$ and $p_b$ are the bottom and top of your band.
- $C$ is how many times more depth your money backs.

A band of plus or minus 10% gives roughly twenty times. Plus or minus 2% gives roughly a hundred.

Now apply the second term, which nobody quotes:

| What you supply | The advertised multiple | Realistic time in range | What you actually get |
| :--- | ---: | ---: | ---: |
| Full range, like v2 | 1x | 100% | 1x |
| Plus or minus 20% | about 10x | 80% | 8x |
| Plus or minus 10% | about 20x | 55% | 11x |
| Plus or minus 2% | about 100x | 15% | 15x |

Read the last column. Going from a hundred times to fifteen is not a rounding error, and every exit and re-entry costs gas on top.

The point is not that narrow is bad. It is that the gain flattens out while the gas and attention costs keep climbing. See [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/).

## Divergence behaves differently at the edges

On a v2 position, the shortfall against holding grows with the price ratio forever. You always hold some of both.

On a v3 position, it is amplified inside the band. Once you cross a bound and fully convert, the pool stops trading your position, but the market does not stop. Every further move widens the gap against the basket you started with.

That gap is still impermanent loss — the shortfall between a pool position and simply holding — measured at today's price. A tool that stops measuring at the edge of your band will make a converted position look far better than it is. See [Impermanent Loss Examples](/guides/impermanent-loss-examples/).

## A month, two providers

\$30,000 each into ETH against dollars, for thirty days. The pair drifts 9% higher, with volatility around 55%.

| | Full range | Plus or minus 8% band |
| :--- | :--- | :--- |
| Fee density | Modest, all month | About fifteen times, while in range |
| What happened | Nothing. Never touched | Price left the band around day eleven |
| Transactions | One mint, one exit | Mint, exit, two re-centres, exit |
| Divergence | about -0.1% | Amplified, and locked in at each re-centre |
| Attention required | None | Watching, and two decisions |

Whether the second one wins depends almost entirely on how much of the month it was quoted and what the two re-centres cost. On a cheap network with discipline it wins comfortably. On an expensive one at a small size, the same strategy finishes behind the position that required no attention at all.

## Which one fits how you work

| If this describes you | Choose | Why |
| :--- | :--- | :--- |
| You will look at the position once a month or less | Full range, v2 style | It fails gracefully and asks nothing of you |
| You can check weekly and act on a written rule | A wide v3 band, plus or minus 20% or more | Several times the income, and exits stay rare |
| You watch daily, or run automation | A narrower v3 band | The extra income is paid for by attention you actually have |
| Your position is a few thousand dollars on mainnet | Full range, or a cheaper network | Gas for re-centring will outrun the extra fees |

Be honest about the first column. Most people who pick a narrow band plan to watch it daily and actually check it every couple of weeks, which is the worst combination of the four.

## What migrating actually costs

Moving a position is not free. You withdraw, possibly swap to reach the new ratio, and mint again. That pays gas twice, locks in where you are, and moves the rate against you on the swap.

One practical test before you move anything. Take the fees your v2 position actually earned over the last thirty days. Estimate what the same money would have earned in the v3 band you have in mind, multiplied by the share of that month the price really spent inside it. If the difference does not repay two rounds of gas and a swap within a month, stay where you are.

A reasonable rule: migrate with new money rather than churning what you have, unless the destination's volume per unit of liquidity is clearly and persistently higher.

Where a pair has moved wholesale to a newer version, a month of data makes that obvious. Where it has not, migrating is a cost with no revenue attached.

## What people get wrong comparing them

| What people assume | What actually happens |
| :--- | :--- |
| v3 is simply better | v3 earns more per dollar while in range, and nothing outside it |
| The efficiency multiple is what I get | Multiply it by time in range. It gets ordinary fast |
| A narrow band caps my losses | It stops the rotation, not the shortfall. Once converted, the rest of the move happens without you |
| I can always switch later | Switching costs gas twice and locks in where you are |

## Four numbers before you choose

1. **Volume routed to that specific pool and tier**, not the pair's total.
2. **How much liquidity already sits in the band you want**, from the distribution rather than the headline.
3. **How much the pair actually moved** over seven and thirty days.
4. **Your own past time in range**, if you have run anything similar. [Revert Finance](https://revert.finance) reconstructs it.

With those four, the choice usually makes itself, and for individuals it frequently favours the simpler structure.

One more consideration that matters more than people expect: attention is a real budget. A concentrated position watched for a fortnight and then forgotten reverts to the worst version of itself, holding one token and earning nothing while you believe your money is working.

A full-range position that gets forgotten just keeps quoting. For a portfolio that already needs attention elsewhere, the structure that fails gracefully is worth a lower headline number. See [Types of Liquidity Pools](/guides/liquidity-pool-types/).

## The checklist

1. **Decide the cadence you will genuinely maintain**, then pick the structure that matches it.
2. **Compute the realised multiple**, not the advertised one, with an honest time-in-range estimate.
3. **Compare gas for that cadence** against expected fee income at your size.
4. **For a band, compute what you hold at both edges** and accept both.
5. **Check where volume routes** before assuming the newer pool is deeper.
6. **Record what you deposited**, either way, so you can compare the two approaches on your own data later.

The newer contract is more capable. Whether it is more profitable for you specifically is an operational question, and the answer is often no.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
7. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
8. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[7]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[8]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
