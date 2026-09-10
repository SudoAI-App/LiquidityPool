---
title: "APR vs APY in DeFi: How to Read a Pool Yield Quote"
description: "The difference between APR and APY in DeFi pools, why compounding assumptions inflate headline numbers, and how to convert any quote into a comparable net figure."
category: "Foundations"
date: 2026-09-10
lastReviewed: "2026-09-10"
author: "Siddharth Mehta"
readTime: "11 min read"
keywords: "APR vs APY, pool APR vs APY, what is the difference between APR and APY in DeFi, real yield liquidity pools, liquidity pool APY calculator, annualised yield"
featured: false
faq:
  - q: "What is the difference between APR and APY in DeFi?"
    a: "APR is a simple annualised rate with no compounding assumption. APY assumes the return is harvested and redeposited a set number of times per year, so it is always the larger number for the same underlying performance. Converting between them requires knowing the compounding frequency the quote assumed."
  - q: "Is a higher APY always better?"
    a: "No. A quoted APY says nothing about where the yield comes from, how volatile it is, whether it is paid in a token you can sell, or what divergence loss the position carries. Two pools quoting the same number can have completely different net outcomes."
  - q: "How is liquidity pool APR calculated?"
    a: "Usually as the trailing fee revenue of the pool over a short window, divided by the value of liquidity supplying it, then scaled to a year. That makes it a backward-looking estimate that is highly sensitive to the window chosen and to how much liquidity is competing for the same volume."
  - q: "What is real yield?"
    a: "Revenue paid from fees actually collected from users rather than from newly issued tokens. It is a useful distinction because emission-funded yield depends on the token price holding up against continuous issuance, while fee-funded yield does not."
---

A pool advertising 22% and a pool advertising 20% can pay identical money. One quote assumed daily compounding, the other assumed none. Neither figure told you what the position will actually return, because both are extrapolations from a trailing window with no adjustment for the exposure being underwritten.

Reading these numbers correctly is a mechanical exercise, and it is the cheapest risk control available to a liquidity provider.

<figure class="article-figure">
  <img src="/images/guides/apr-vs-apy-in-defi.webp" alt="Comparison of the same twenty percent APR under different compounding frequencies beside a list of costs the headline rate omits." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same underlying rate under five compounding conventions, and the five costs that no headline rate includes. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"On an institutional mandate the first question is never the yield, it is the denominator and the window. A 40% figure computed from a single high-volume day, on a pool where our own deposit would double the liquidity, is not a forecast. It is a description of a market state that our participation will change."*

## 1. The Conversion, In Both Directions

APR is a simple rate. APY includes an assumption that returns are periodically realised and redeposited:

$$\text{APY} = \left(1 + \frac{\text{APR}}{n}\right)^n - 1$$

where $n$ is the number of compounding periods per year. Inverting it:

$$\text{APR} = n\left[(1 + \text{APY})^{1/n} - 1\right]$$

For a 20% APR:

| Compounding | APY |
| :--- | ---: |
| None | 20.00% |
| Quarterly | 21.55% |
| Monthly | 21.94% |
| Weekly | 22.09% |
| Daily | 22.13% |
| Continuous | 22.14% |

The spread between never compounding and continuous compounding is a little over two percentage points at this level, and it widens sharply at higher rates: a 100% APR compounds to 171% APY daily. Any comparison between a pool quoting APR and one quoting APY must convert to a common basis first.

Crucially, compounding in a liquidity pool is not automatic. Fees accrue as claimable balances in tick-based pools, and turning them into more liquidity requires a transaction that costs gas. A quoted APY therefore embeds an operational assumption that the LP will actually perform those harvests, which is only economical above a certain position size.

---

## 2. Where the Numerator Comes From

Most interfaces compute pool APR as:

$$\text{APR} = \frac{\text{fees over window}}{\text{liquidity supplying them}} \times \frac{365}{\text{window in days}}$$

Three sensitivities follow immediately.

1. **Window choice.** A 24-hour window during an event produces a number that will not repeat. A 30-day window smooths but lags regime changes.
2. **Denominator definition.** Some interfaces divide by total value locked, others by active liquidity. On a concentrated pool these differ by an order of magnitude, and the second is the honest one.
3. **Your own impact.** Adding liquidity increases the denominator. If your deposit is large relative to the band, the rate you will actually receive is lower than the rate you saw.

For the metrics that make these differences visible, see [Onchain Liquidity Metrics: Reading Depth, Volume, and Fee Data](/guides/onchain-liquidity-metrics/) and [TVL Explained](/guides/tvl-explained/).

---

## 3. What the Headline Rate Excludes

A quoted yield is a gross revenue estimate. The net result subtracts:

- **Divergence against holding**, which for volatile pairs routinely exceeds fee income over the same window. The arithmetic is in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).
- **Time out of range**, during which the numerator stops growing while capital remains committed.
- **Gas**, on entry, each harvest, each rebalance and exit.
- **Emission token price decay**, where part of the yield is paid in a token being continuously issued.
- **Swap costs to enter the correct ratio**, particularly for single-asset deposits routed through a zap.
- **Withdrawal conditions** imposed by a vault wrapper or, in v4, by a hook.

An honest comparison expresses everything as a net result over a defined holding period against a defined benchmark, which for a two-asset position is holding the deposited basket.

A further subtlety applies to auto-compounding vaults. These wrap a position, harvest on a schedule and redeposit, which makes the APY assumption real rather than notional. The trade-off is an extra contract in the trust chain, a performance fee, and a harvest cadence chosen by the vault rather than by you. Read the vault's realised harvest frequency instead of its advertised one: gas conditions often push the actual cadence far below the schedule used to compute the quoted rate.

Finally, note that a rate expressed on a stablecoin pair and a rate expressed on a volatile pair are not comparable even after conversion. The first is close to a cash-like return with a tail risk attached to the peg; the second is a short-volatility position with an income leg. Comparing the two on the same axis is the most common error in pool selection.

---

## 4. Fee Yield Versus Emission Yield

The two components of a quoted rate behave differently and should never be summed without labelling.

| Property | Fee yield | Emission yield |
| :--- | :--- | :--- |
| Funded by | Traders paying the pool fee | New token issuance |
| Persistence | Tracks trading activity | Ends when the programme ends |
| Price sensitivity | Denominated in the pool's assets | Depends on the emitted token's market |
| Dilution | None | Continuous, and borne by existing holders |
| Realisable value | Collect and hold or sell | Only what the book absorbs on sale |

A pool quoting 45% where 40 points come from emissions is a different instrument from one quoting 12% entirely from fees. The mechanics of incentive programmes are covered in [Liquidity Mining Explained](/guides/liquidity-mining-explained/) and [Yield Farming Explained](/guides/yield-farming-explained/).

---

## 5. Normalising Two Competing Quotes

A worked comparison. Pool A quotes 18% APY with daily compounding assumed and pays entirely in fees. Pool B quotes 26% APR, of which 17 points are emissions in a token that has declined 4% per month over the last quarter.

1. **Convert to a common basis.** Pool A's 18% APY is a 16.6% APR. Pool B is quoted as APR already.
2. **Haircut the emission component.** If the token loses roughly 4% monthly and you sell weekly, the realisable value of 17 points is materially lower; assume conservatively that it is worth 11 points.
3. **Compare like with like.** Pool A: 16.6% fee APR. Pool B: 9 points of fee APR plus roughly 11 points of realisable emissions, so about 20%.
4. **Subtract the divergence estimate for each pair.** If Pool B's pair is twice as volatile, its divergence hurdle is roughly four times higher.
5. **Subtract friction.** Pool B requires weekly harvest and sale transactions; on a small position that alone can consume the difference.

The ranking frequently inverts between step one and step five. That is the entire point of doing the exercise.

---

## 6. Checklist for Reading Any Yield Quote

- [ ] Identify whether the figure is APR or APY, and the compounding frequency assumed.
- [ ] Find the window used to compute it and ask whether that window was representative.
- [ ] Check the denominator: total value locked, or liquidity actually in range.
- [ ] Split the rate into fee-funded and emission-funded components.
- [ ] Estimate the divergence hurdle for the pair over the same window.
- [ ] Add your own deposit to the denominator and recompute.
- [ ] Subtract gas for the harvest cadence the APY assumed.
- [ ] Express the result as a net figure against holding the basket, and only then compare pools.

Yield quotes are not dishonest by design; they are simply summaries that discard the information an LP needs. Restoring that information takes a few minutes and changes the decision more often than not.

## Where to Go Next

Rebuild any quoted rate from its inputs with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), and subtract the divergence it omits with the [impermanent loss calculator](/tools/impermanent-loss-calculator/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
3. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [DeFiLlama Yields methodology](https://defillama.com/yields)
5. [SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)](https://arxiv.org/abs/2105.13891)
6. [Global Financial Stability Report, April 2022 (International Monetary Fund)](https://www.imf.org/en/Publications/GFSR/Issues/2022/04/19/global-financial-stability-report-april-2022)
7. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[3]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[4]: https://defillama.com/yields "DeFiLlama Yields"
[5]: https://arxiv.org/abs/2105.13891 "SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)"
[6]: https://www.imf.org/en/Publications/GFSR/Issues/2022/04/19/global-financial-stability-report-april-2022 "Global Financial Stability Report, April 2022 (International Monetary Fund)"
[7]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
