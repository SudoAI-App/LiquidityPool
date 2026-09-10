---
title: "Impermanent Loss Examples: Five Positions, Fully Worked"
description: "Five impermanent loss examples with real numbers: a modest drift, a doubling, a four-times run, a halving, and a stablecoin depeg, each net of fee income."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Dr. Elena Rostova"
readTime: "11 min read"
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

Formulas convince nobody. Five positions with real quantities, priced end to end, make the shape of divergence obvious in a way that the closed form does not: small moves cost almost nothing, large moves cost a great deal, and the fee line decides whether either matters.

Each example uses a balanced deposit and the constant-product case, then states what fee income would have been required to break even.

<figure class="article-figure">
  <img src="/images/guides/impermanent-loss-examples.webp" alt="Five scenarios with bars showing impermanent loss for each price move." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Five position outcomes on the same formula, scaled to the four-times case. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Ask any LP what a 4x costs them and most will guess a few percent. It is twenty. The function is flat enough near parity that intuition trained on small moves fails badly in the tail, which is exactly where position sizing decisions get made."*

## 1. Example One: A Modest Drift

**Position**: \$10,000 into ETH/USDC at 2,000 per ETH, so 2.5 ETH and \$5,000.
**Move**: ETH rises to 2,500. Price ratio $k = 1.25$.

Holding the basket would be worth $2.5 \times 2{,}500 + 5{,}000 = \$11{,}250$. The pool rebalances to $2.5 / \sqrt{1.25} = 2.236$ ETH and $5{,}000 \times \sqrt{1.25} = \$5{,}590$, worth \$11,180.

| Line | Value |
| :--- | ---: |
| Hold value | \$11,250 |
| Pool value before fees | \$11,180 |
| Divergence | −\$70, or −0.62% |
| Fees required to break even | \$70 |

At a 5 bps tier with reasonable turnover, seventy dollars is a few days of income. This is the regime where liquidity provision is comfortably profitable and where most positions spend most of their life.

---

## 2. Example Two: The Asset Doubles

**Position**: 1 ETH and \$2,000 at 2,000 per ETH, a \$4,000 basket.
**Move**: ETH reaches 4,000. $k = 2$.

Reserves rotate to 0.7071 ETH and \$2,828.

| Line | Value |
| :--- | ---: |
| Hold value | \$6,000 |
| Pool value before fees | \$5,657 |
| Divergence | −\$343, or −5.72% |
| Fees required to break even | \$343 |

The position is up \$1,657 in dollar terms and still trails holding by \$343. Both statements are true, and confusing them is the single most common misreading of an LP result. The derivation is in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

---

## 3. Example Three: A Four-Times Run

**Position**: \$20,000 split across a mid-cap token and USDC at \$5.00 per token, so 2,000 tokens and \$10,000.
**Move**: The token reaches \$20.00. $k = 4$.

Reserves rotate to 1,000 tokens and \$20,000.

| Line | Value |
| :--- | ---: |
| Hold value | \$50,000 |
| Pool value before fees | \$40,000 |
| Divergence | −\$10,000, or −20.00% |
| Fees required to break even | \$10,000 |

Ten thousand dollars of fees on a \$20,000 position requires extraordinary turnover. In practice this position sold half its winner on the way up, and no realistic fee tier compensates for it. If the thesis was that the token would run, the pool was the wrong instrument for expressing it.

---

## 4. Example Four: A Halving

**Position**: The same \$20,000 basket at \$5.00 per token.
**Move**: The token falls to \$2.50. $k = 0.5$.

| Line | Value |
| :--- | ---: |
| Hold value | \$15,000 |
| Pool value before fees | \$14,142 |
| Divergence | −\$858, or −5.72% |
| Fees required to break even | \$858 |

Note the symmetry with example two: the same 5.72%, because the formula depends on the log of the ratio. Note also what dominates the outcome. The position lost \$5,000 to the market and \$858 to the invariant. Attributing the whole loss to impermanent loss, as many post-mortems do, misidentifies the problem: the pair selection cost six times more than the pool mechanics did.

---

## 5. Example Five: A Stablecoin Depeg

**Position**: \$50,000 into an amplified stable pool, split evenly between two dollar stablecoins.
**Move**: One asset trades to \$0.90 and stays there.

Endpoint divergence computed from the ratio alone looks trivial, roughly −0.14%. The realised outcome is not, because the amplified curve holds price near par while reserves skew. By the time the pool's quote reflects the dislocation, the pool holds far more of the distressed asset than of the sound one.

| Line | Approximate value |
| :--- | ---: |
| Pool composition after absorption | roughly 80% distressed asset |
| Marked value at \$0.90 | roughly \$45,500 |
| Loss against holding a 50/50 basket | roughly −\$2,000 |
| Fee income over the same window | typically a few hundred dollars |

The lesson is that the ratio-based formula understates risk on curves designed to resist ratio changes. The exposure is in the reserve composition, not in the endpoint ratio, and it is developed in [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

## 5b. The Same Five Cases in a Concentrated Range

Every example above assumes an unbounded curve. A range position changes two things: divergence inside the band is amplified by roughly the capital-efficiency multiplier, and it stops accruing once price leaves the band and the position is fully converted.

Take example two again, the doubling from 2,000 to 4,000, but supplied in a ±10% band. The position converts entirely to the quote asset once price passes 2,200, long before the move completes. From that point it holds no ETH at all, so it captures none of the run from 2,200 to 4,000.

| Structure | Divergence realised | Participation above the band |
| :--- | ---: | :--- |
| Full range | −5.72% | Keeps 0.71 ETH throughout |
| ±10% band | Bounded at conversion | None: fully in USDC above 2,200 |
| ±40% band | Larger than full range while in band | Partial, converts near 2,800 |

The bounded figure looks smaller in the formula and feels considerably worse in the account, because the opportunity cost of missing the remainder of the move does not appear in any impermanent loss calculation. That gap is the subject of [Out-of-Range Liquidity](/guides/out-of-range-liquidity/), and it is the reason narrow bands on trending pairs disappoint even when the arithmetic says divergence was modest.

Fee income partially compensates, since a narrow band earns far more per dollar while price is inside it. Whether it compensates enough is decided by how long the price stayed in the band, which is measurable after the fact and estimable in advance from realised volatility.

---

## 6. What the Five Cases Have in Common

1. **Divergence is small until it is not.** Below a 25% relative move it rounds to nothing; past a 3x it dominates.
2. **The benchmark is the basket, not cash.** Examples two and four are the same divergence with opposite dollar outcomes.
3. **Fees are the only offset that is actually paid to you.** Everything else is either a different exposure or a different instrument.
4. **Curve design changes where the risk lives.** Amplified curves move it from the ratio into the composition.
5. **The decision is made at deposit, not at exit.** Every number above was computable in advance from a price assumption.

Run your own position through the [impermanent loss calculator](/tools/impermanent-loss-calculator/), then check whether the fee side clears it using the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/). For the ways to reduce the exposure and what each costs, see [How to Avoid Impermanent Loss](/guides/how-to-avoid-impermanent-loss/).

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [StableSwap: efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
5. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
8. [An Analysis of Uniswap Markets (Angeris et al., 2019)](https://arxiv.org/abs/1911.03380)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap: efficient mechanism for Stablecoin liquidity"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[5]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[8]: https://arxiv.org/abs/1911.03380 "An Analysis of Uniswap Markets (Angeris et al., 2019)"
