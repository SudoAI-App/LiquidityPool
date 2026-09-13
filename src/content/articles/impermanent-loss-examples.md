---
title: "Impermanent Loss Examples: Five Positions, Fully Worked"
description: "Five real positions in dollars: a small drift, a doubling, a four-times run, a halving, and a stablecoin breaking. Each one with the fees needed to break even."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "6 min read"
keywords: "impermanent loss example, impermanent loss calculation example, IL worked example, divergence loss scenario, stablecoin depeg example, impermanent loss vs permanent loss"
featured: false
faq:
  - q: "Can you show a simple impermanent loss example?"
    a: "Deposit 1 ETH and 2,000 USDC at 2,000 per ETH, a 4,000 dollar basket. If ETH doubles to 4,000, holding is worth 6,000 while the pool position is worth 5,657. The 343 dollar gap is a 5.72% impermanent loss, which fee income may or may not cover."
  - q: "What is impermanent loss at 50%, 2x, and 4x?"
    a: "A halving and a doubling each produce a 5.72% shortfall against holding, because the formula is symmetric in log price. A four-times move produces 20.0%, and a five-times move 25.5%."
  - q: "Is impermanent loss the same as losing money?"
    a: "No. It measures performance against holding the deposited basket, not against your starting currency. A position can be up in dollar terms and still show impermanent loss, or down in dollars with no impermanent loss at all if both assets fell equally."
  - q: "When does impermanent loss become permanent?"
    a: "When you withdraw at a price ratio different from your entry ratio. Until then, the gap closes if relative prices return to where they started, which is the whole reason the word impermanent is used."
---

Formulas convince nobody. Five positions with real dollars make the shape obvious in a way the algebra does not.

Small moves cost you almost nothing. Large moves cost a great deal. Impermanent loss — the gap between a pool position and simply holding — is what we are measuring, and in every case the fee line decides whether it mattered.

Each one below uses an even deposit in an ordinary pool, then tells you exactly what the fees would have had to be to break even.

<figure class="article-figure">
  <img src="/images/guides/impermanent-loss-examples.webp" alt="Five scenarios with bars showing impermanent loss for each price move." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Five position outcomes on the same formula, scaled to the four-times case. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Ask anybody what a four-times move costs them and most will guess a few percent. It is twenty. The function is flat enough near the middle that intuition trained on small moves fails badly in the tail, which is exactly where the sizing decisions get made."*

## One: a modest drift

**You deposit** \$10,000 into ETH against dollars at \$2,000 per ETH, so 2.5 ETH and \$5,000.

**ETH rises to \$2,500.** A 25% move.

| | Value |
| :--- | ---: |
| Holding would be worth | \$11,250 |
| The pool position is worth | \$11,180 |
| The gap | -\$70, or -0.62% |
| Fees needed to break even | \$70 |

At a 0.05% tier with reasonable turnover, \$70 is a few days of income. This is the regime where pools work comfortably, and where most positions spend most of their life.

## Two: it doubles

**You deposit** 1 ETH and \$2,000 at \$2,000 per ETH. A \$4,000 basket.

**ETH reaches \$4,000.** The pool rotates you to 0.7071 ETH and \$2,828.

| | Value |
| :--- | ---: |
| Holding would be worth | \$6,000 |
| The pool position is worth | \$5,657 |
| The gap | -\$343, or -5.72% |
| Fees needed to break even | \$343 |

Read both numbers. You are up \$1,657 in dollars and behind holding by \$343. Both are true at the same time, and confusing them is the single most common misreading of a pool result. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

## Three: a four-times run

**You deposit** \$20,000 split between a mid-cap token and dollars at \$5.00, so 2,000 tokens and \$10,000.

**The token reaches \$20.00.** The pool rotates you to 1,000 tokens and \$20,000.

| | Value |
| :--- | ---: |
| Holding would be worth | \$50,000 |
| The pool position is worth | \$40,000 |
| The gap | -\$10,000, or -20.00% |
| Fees needed to break even | \$10,000 |

Ten thousand dollars of fees on a \$20,000 position needs extraordinary turnover. On any ordinary pool it will not happen, however long you wait.

What actually occurred is simple: the pool sold half your winner on the way up. If your thesis was that this token would run, a pool was the wrong instrument for holding it.

## Four: it halves

**The same \$20,000 basket** at \$5.00.

**The token falls to \$2.50.**

| | Value |
| :--- | ---: |
| Holding would be worth | \$15,000 |
| The pool position is worth | \$14,142 |
| The gap | -\$858, or -5.72% |
| Fees needed to break even | \$858 |

Notice the symmetry with example two. Exactly 5.72% again, because the formula only cares about distance, not direction.

Now notice what actually dominates. You lost \$5,000 to the market and \$858 to the pool. Blaming the whole loss on impermanent loss, as most post-mortems do, misidentifies the problem. Picking that pair cost six times what the pool mechanics did.

## Five: a stablecoin breaks

**You deposit** \$50,000 into a flat stable-pair pool, split evenly between two dollar tokens.

**One of them trades to \$0.90 and stays there.**

Computed from the endpoint ratio alone, this looks trivial. About -0.14%. That number is badly wrong, and here is why.

The flat curve holds the price near par while the balances skew. By the time the pool's quote reflects reality, it holds far more of the broken token than the good one.

| | Roughly |
| :--- | ---: |
| What the pool holds afterwards | About 80% the broken token |
| Marked at \$0.90 | About \$45,500 |
| Against holding an even basket | About -\$2,000 |
| Fees over the same window | A few hundred dollars |

The lesson: on curves designed to resist ratio changes, the ratio-based formula understates the risk badly. The exposure lives in the composition, not the endpoint. See [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

## How fast the fees had to arrive

The dollar gap is only half the story. The other half is how long the move took, because fees accrue with time and divergence does not wait for them.

| Example | Gap as a share of the deposit | Fee rate needed if the move took a month | If it took a year |
| :--- | ---: | ---: | ---: |
| One, up 25% | 0.7% | about 8.5% a year | 0.7% a year |
| Two, doubles | 8.6% | about 104% a year | 8.6% a year |
| Three, four times | 50% | about 608% a year | 50% a year |
| Four, halves | 4.3% | about 52% a year | 4.3% a year |

The same move is trivial spread over a year and brutal packed into a month. So a quoted fee rate only means something next to how fast the pair actually moves. Before you compare two pools on their rates, check how quickly each pair has moved over the last few months. A pool paying 30% a year on a pair that can double in a month is not paying you enough, however generous 30% sounds.

## The same five, in a narrow band

Everything above assumes a full-range position. A band changes two things. Inside it, the loss grows faster, because your money is concentrated there. Past the edge, you hold only one token and stop rotating, but the market keeps moving without you, so the shortfall against holding keeps growing.

Take example two again, ETH going from \$2,000 to \$4,000, but in a band.

| Structure | Shortfall when ETH reaches the band's top | Shortfall when ETH reaches \$4,000 | What you hold at \$4,000 |
| :--- | ---: | ---: | :--- |
| Full range | No edge | -5.7% | 0.71 ETH and \$2,828 |
| Plus or minus 40% | -7.6% at \$2,800 | -23.6% | Only dollars |
| Plus or minus 10% | -2.3% at \$2,200 | -30.7% | Only dollars |

The narrow band looks mild at its edge and finishes far behind. Every dollar of the run from \$2,200 to \$4,000 happened after the band had already sold your ETH. A tool that stops measuring at the edge hides this, so always compare against holding at today's price.

That gap is the subject of [Out-of-Range Liquidity](/guides/out-of-range-liquidity/), and it is why narrow bands on trending pairs disappoint so reliably.

Fees partly compensate, because a narrow band earns much more per dollar while you are inside it. Whether they compensate enough depends on how long the price stayed there, which you can estimate in advance from how much the pair actually moves.

## What all five have in common

1. **It is small until it is not.** Below a 25% move it rounds to nothing. Past three times, it dominates everything else.
2. **Your benchmark is the basket, not cash.** Examples two and four have identical divergence and opposite dollar outcomes.
3. **Fees are the only offset actually paid to you.** Everything else is a different exposure or a different instrument.
4. **The curve decides where the risk lives.** Flat curves move it out of the ratio and into the composition, where the usual formula cannot see it.
5. **The decision happens at deposit, not at exit.** Every number above was computable in advance from a price assumption.

Run your own position through the [impermanent loss calculator](/tools/impermanent-loss-calculator/), then check whether the fees clear it with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/). For what each mitigation costs, see [How to Avoid Impermanent Loss](/guides/how-to-avoid-impermanent-loss/).

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [StableSwap: efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
5. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
8. [An Analysis of Uniswap Markets (Angeris et al., 2019)](https://arxiv.org/abs/1911.03380)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap: efficient mechanism for Stablecoin liquidity"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[5]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[8]: https://arxiv.org/abs/1911.03380 "An Analysis of Uniswap Markets (Angeris et al., 2019)"
