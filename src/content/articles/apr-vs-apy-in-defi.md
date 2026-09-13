---
title: "APR vs APY in DeFi: How to Read a Pool Yield Quote"
description: "Two pools quoting different numbers can pay exactly the same. How to convert any quote to a comparable figure, and the six costs no headline rate includes."
category: "Foundations"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
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

A pool advertising 22% and a pool advertising 20% can pay you exactly the same money. One assumed you would compound daily, the other assumed nothing.

Neither number tells you what you will actually make, because both are yesterday's figures projected forward with no adjustment for what you are taking on.

Reading these properly is mechanical and takes a few minutes. It is the cheapest risk control available to anyone supplying a pool.

<figure class="article-figure">
  <img src="/images/guides/apr-vs-apy-in-defi.webp" alt="Comparison of the same twenty percent APR under different compounding frequencies beside a list of costs the headline rate omits." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same underlying rate under five compounding conventions, and five of the costs that no headline rate includes. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"My first question is never the yield. It is the denominator and the window. A 40% figure computed from one busy day, on a pool where our own deposit would double the liquidity, is not a forecast. It is a description of a market state that our arrival will destroy."*

## Converting between the two

$$
\text{APY} = \left(1 + \frac{\text{APR}}{n}\right)^n - 1
$$

Where:

- $\text{APR}$ is the simple rate, with no compounding.
- $n$ is how many times a year the quote assumes you harvest and redeposit.
- $\text{APY}$ is the result of doing that.

For a 20% simple rate:

| How often you compound | What it becomes |
| :--- | ---: |
| Never | 20.00% |
| Quarterly | 21.55% |
| Monthly | 21.94% |
| Weekly | 22.09% |
| Daily | 22.13% |
| Continuously | 22.14% |

Two points of difference at this level, and it widens fast. A 100% simple rate becomes 171% if compounded daily. So any comparison between a pool quoting one convention and a pool quoting the other has to convert first.

One thing the maths hides. Compounding in a pool is not automatic. In range-based pools your fees sit as a claim, and turning them back into liquidity costs a transaction. So a quoted compounded rate assumes you will actually do those harvests, which only makes sense above a certain position size.

## When compounding is worth the gas

Compounding only pays if the extra yield beats what the harvests cost you. The arithmetic is short enough to do before you deposit.

Take \$5,000 at a 20% simple rate.

| How often you harvest | Extra a year from compounding | Harvests a year | Most you can pay per harvest and still gain |
| :--- | ---: | ---: | ---: |
| Monthly | \$97 | 12 | \$8.08 |
| Weekly | \$105 | 52 | \$2.01 |
| Daily | \$107 | 365 | \$0.29 |

Read the right-hand column against what a harvest actually costs you on your chain. On a busy mainnet day a single claim-and-redeposit can cost more than the whole year's compounding benefit on a position this size.

The pattern holds at any size. The benefit of compounding grows with your position, but the gas per harvest does not. So a small position should harvest rarely or not at all, and a quote that assumes daily compounding on a small deposit describes income you will never collect.

## Where the number comes from

$$
\text{APR} = \frac{\text{fees over a window}}{\text{liquidity supplying them}} \times \frac{365}{\text{days in the window}}
$$

Where:

- **Fees over a window** is what the pool collected in that period.
- **Liquidity supplying them** is the denominator, and it varies by interface.

Three things follow, and all three can flip the answer.

- **The window.** A 24-hour window during a busy day produces a number that will not repeat. Thirty days smooths it but lags a change in conditions.
- **The denominator.** Some interfaces divide by the pool's total, some by the money actually working near the price. On a range-based pool those differ by an order of magnitude, and only the second is honest.
- **You.** Your deposit joins the denominator. If you are large relative to the band, the rate you actually get is lower than the one you saw.

See [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/) and [TVL Explained](/guides/tvl-explained/).

## Six costs no headline rate includes

- **Impermanent loss** — the gap between the pool position and simply holding the two tokens. On a volatile pair this routinely exceeds the fee income over the same window. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).
- **Time out of range.** The income stops while your capital stays committed.
- **Gas.** Entry, every harvest, every rebalance, exit.
- **Reward tokens losing value.** If part of the rate is paid in a token being continuously issued, what you realise is lower than what accrued.
- **Swapping into the right ratio**, especially for single-asset deposits routed through a converter.
- **Exit conditions** imposed by a vault or, on newer pools, by attached code.

An honest comparison expresses everything as a net result over a stated period, against a stated benchmark. For a two-token position, that benchmark is holding the two tokens.

Two footnotes worth having.

**Auto-compounding vaults** make the compounding assumption real rather than notional, because they actually do the harvesting. In exchange you add a contract to the trust chain, a performance fee, and a schedule somebody else chose. Read the realised harvest frequency rather than the advertised one, because gas conditions often push the real cadence far below the schedule used to compute the quote.

**Do not compare a stablecoin rate with a volatile-pair rate**, even after converting. The first is close to a cash return with a tail risk attached to a peg. The second is a bet on volatility with an income leg. Putting them on the same axis is the most common mistake in pool selection.

## Real fees against printed tokens

Two components, behaving completely differently, and they should never be summed without labels.

| | Fee income | Token issuance |
| :--- | :--- | :--- |
| Who funds it | Traders paying the pool | New supply, printed |
| Does it last | As long as people trade | Until the programme ends |
| What it depends on | The pool's own assets | Whether anyone will buy the token |
| Who it dilutes | Nobody | Everybody already holding |
| What you actually get | Collect and keep, or sell | Whatever the market absorbs when you sell |

A pool quoting 45% where 40 points come from issuance is a different instrument from one quoting 12% entirely from fees. See [Liquidity Mining Explained](/guides/liquidity-mining-explained/) and [Yield Farming Explained](/guides/yield-farming-explained/).

## Normalising two competing quotes

Pool A quotes 18%, compounded daily, entirely from fees. Pool B quotes 26% simple, of which 17 points are a token that has fallen about 4% a month.

| Step | Pool A | Pool B |
| :--- | ---: | ---: |
| Convert to a common basis | 16.6% simple | 26% simple |
| Haircut the token portion | unchanged | 17 points becomes about 11 |
| Compare like with like | 16.6% | about 20% |
| Subtract divergence for the pair | small | four times larger, if twice as volatile |
| Subtract the weekly harvest and sale costs | none | material on a small position |

The ranking flips somewhere between the first row and the last. That is exactly why the exercise is worth doing.

## What people get wrong reading a quote

| What people assume | What actually happens |
| :--- | :--- |
| A bigger number means more money | Two conventions can describe the same income. Convert first |
| The rate will continue | It is a trailing window, extrapolated. It will not |
| The rate is mine | Your deposit dilutes it the moment it lands |
| All yield is the same | Fees continue. Issuance stops, on a schedule everybody else knows |

## The checklist

1. **Is it simple or compounded**, and at what frequency?
2. **What window produced it**, and was that window representative?
3. **What is the denominator**, the pool total or the money actually working?
4. **Split it** into fees and issuance.
5. **Estimate the divergence** for this pair over the same window.
6. **Add your own deposit** to the denominator and recompute.
7. **Subtract gas** for the harvest cadence the quote assumed.
8. **Express it net, against holding the basket**, and only then compare.

These numbers are not dishonest by design. They are summaries that happen to discard exactly the information you need. Putting it back takes a few minutes and changes the decision more often than not.

## Where to go next

Rebuild any quoted rate from its inputs with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), then subtract what it leaves out with the [impermanent loss calculator](/tools/impermanent-loss-calculator/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
3. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [DeFiLlama Yields methodology](https://defillama.com/yields)
5. [SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)](https://arxiv.org/abs/2105.13891)
6. [Global Financial Stability Report, April 2022 (International Monetary Fund)](https://www.imf.org/en/Publications/GFSR/Issues/2022/04/19/global-financial-stability-report-april-2022)
7. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[3]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[4]: https://defillama.com/yields "DeFiLlama Yields"
[5]: https://arxiv.org/abs/2105.13891 "SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)"
[6]: https://www.imf.org/en/Publications/GFSR/Issues/2022/04/19/global-financial-stability-report-april-2022 "Global Financial Stability Report, April 2022 (International Monetary Fund)"
[7]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
