---
title: "Lending Pool vs Liquidity Pool: Two Different Instruments"
description: "A lending pool and a liquidity pool share a word and almost nothing else. Compare revenue, risk, withdrawal conditions and the exposure each one hands the depositor."
category: "Foundations"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Siddharth Mehta"
readTime: "11 min read"
keywords: "lending pool vs liquidity pool, Aave liquidity pool, DeFi lending vs liquidity provision, utilisation curve, supply APY, liquidity pool comparison"
featured: false
faq:
  - q: "What is the difference between a lending pool and a liquidity pool?"
    a: "A lending pool takes one asset and lends it to borrowers who post collateral, paying interest set by a utilisation curve. A liquidity pool takes two or more assets and uses them to quote prices for swaps, paying a share of trading fees. Only the second creates divergence loss."
  - q: "Is Aave a liquidity pool?"
    a: "Aave operates lending pools. Depositors supply a single asset that borrowers draw against collateral, and the interest rate moves with utilisation. It shares the pooled-deposit structure with an automated market maker but not the pricing function or the two-asset exposure."
  - q: "Which is safer, lending or providing liquidity?"
    a: "They fail differently. Lending risk concentrates in collateral quality, oracle accuracy and liquidation performance during stress. Liquidity provision risk concentrates in divergence and adverse selection. Neither dominates the other; they suit different mandates."
  - q: "Can you withdraw from a lending pool at any time?"
    a: "Only if there is unutilised liquidity. When borrowing demand consumes the supplied assets, withdrawals queue until borrowers repay or rates rise enough to attract new supply. A liquidity pool, by contrast, can always be exited at the current reserve ratio."
  - q: "Do lending pools have impermanent loss?"
    a: "No. Nothing rebalances the deposit, so the supplied quantity only grows with accrued interest. The equivalent tail risk is bad debt: a liquidation that fails to cover a loan leaves a shortfall borne by suppliers."
---

Both are called pools, both accept deposits, and both quote an annual percentage figure. Underneath, one is a credit market with a utilisation curve and the other is a quoted two-sided market with a pricing rule. Sizing one as though it behaved like the other is a common and expensive mistake.

The comparison below is the version worth keeping: revenue source, what changes your balance, and what happens under stress.

<figure class="article-figure">
  <img src="/images/guides/lending-pool-vs-liquidity-pool.webp" alt="Table comparing lending pools and liquidity pools across assets supplied, revenue, rate setting, principal risk, withdrawal and quantity held." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Same word, different instrument: what each pool type actually does with a deposit. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"The tell is what happens when nothing happens. A lending deposit accrues quietly during a flat week. A liquidity position in a flat week with no volume earns nothing at all. One is compensated for time, the other for flow, and that difference should drive the allocation before any rate is compared."*

## 1. How Each One Generates Revenue

**Lending pools** match suppliers with borrowers. Borrowers post collateral, draw a loan, and pay interest. The rate is set algorithmically from utilisation, the fraction of supplied assets currently borrowed, usually with a kink beyond which rates rise steeply to restore liquidity.

**Liquidity pools** hold reserves and price swaps from an invariant. Traders pay a fee on each swap, which accrues to the liquidity that was active for that trade. Revenue depends on volume routed to the pool rather than on time elapsed, as set out in [Liquidity Provider Fees](/guides/liquidity-provider-fees/).

That difference explains most of the behavioural contrast. Lending income is smooth and rate-like. Liquidity income is lumpy, clustered around volatile periods, and zero when the pair is quiet.

---

## 2. What Happens to Your Balance

| | Lending pool | Liquidity pool |
| :--- | :--- | :--- |
| Assets supplied | One | Two or more, in ratio |
| Quantity over time | Increases with interest | Rotates with relative price |
| Exposure to the asset | Unchanged, plus yield | Continuously rebalanced |
| Effect of a price move | Value moves with the asset | Value moves with the pair, minus divergence |
| Benchmark | Holding the asset unlent | Holding the deposited basket |

The third row is the one that surprises people. A lending deposit in ETH is still ETH after a 40% drawdown, with slightly more units. A pooled ETH position is partly something else, because the invariant sold ETH as it fell and bought it back as it recovered. The mechanics are derived in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

---

## 3. How Each One Fails

**Lending pool failure modes**

- **Bad debt.** A liquidation that does not cover the loan leaves a shortfall shared by suppliers.
- **Oracle failure.** Collateral valued incorrectly permits loans that cannot be liquidated at the assumed price.
- **Liquidation congestion.** During sharp moves, liquidators may not clear positions fast enough, converting a collateral buffer into a deficit.
- **Utilisation lockout.** Full utilisation means suppliers cannot withdraw until borrowers repay or new supply arrives.

**Liquidity pool failure modes**

- **Divergence and adverse selection**, discussed in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).
- **Depeg absorption** on amplified curves, where the pool accumulates a failing asset near par.
- **Out-of-range idleness** in concentrated positions.
- **Contract and hook risk**, shared with lending but with an extra surface in newer pool designs.

Both categories are real. Neither is a subset of the other, which is why a portfolio holding both is diversified in a meaningful sense.

---

## 4. Withdrawal Conditions Are Not Comparable

This is the operational difference most often overlooked.

A liquidity position can be exited in any block. What varies is the composition and the price, not access: the contract will always return your share of current reserves.

A lending deposit can be exited only while unutilised liquidity exists. At high utilisation, withdrawal is queued behind repayments. Rates rise to attract new supply and discourage borrowing, which usually resolves it, but "usually" is doing real work in that sentence during a stress event.

Anyone treating a lending deposit as cash-equivalent should test the assumption at the utilisation levels the market actually reaches, not the average.

---

## 5. When Each One Fits

**Lending suits** mandates that must retain a fixed quantity of a specific asset, portfolios wanting predictable income, and allocations where operational attention is scarce.

**Liquidity provision suits** allocations comfortable holding either asset in a pair, pairs where turnover is high relative to volatility, and providers willing to measure results against a hold benchmark rather than against a rate.

A third structure combines them: supplying a liquid staking receipt to a lending pool, or supplying the same receipt against its base asset in an amplified pool. Both stack yields and both stack risks, as covered in [Liquidity Pool vs Staking](/guides/liquidity-pool-vs-staking/).

---

## 6. Comparing the Two Rates Honestly

A lending supply rate and a pool fee yield are not directly comparable. Normalise both before deciding:

1. **Convert both to the same basis**, APR or APY, with the compounding assumption stated. See [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/).
2. **Subtract expected divergence** from the pool figure over the intended horizon.
3. **Subtract gas** for the management cadence each requires.
4. **Haircut any part of either rate funded by token emissions**, valuing them at realisable prices.
5. **Adjust for withdrawal certainty**, which is worth something and is rarely priced.

Only after those five steps does the comparison mean anything, and the ranking frequently changes between step one and step five.

### A worked rate comparison

A lending market quotes 6.4% supply APY on USDC. A stablecoin liquidity pool quotes 9.1% APR, of which 3.0 points come from token emissions.

Normalising: the lending figure is an APY, so its simple-rate equivalent is roughly 6.2%. The pool figure is an APR already, and the emission component should be haircut to what selling it weekly would realise, say 2.0 points, giving roughly 8.1%.

Now the adjustments the headline numbers omit. The pool position carries depeg exposure on both assets and needs two transactions per cycle. The lending deposit carries bad-debt exposure and can be gated at high utilisation. On a \$25,000 allocation held for a quarter, gas is immaterial for both, so the ranking holds: the pool pays more, and it pays more because it is underwriting a different and less familiar tail.

That is the correct conclusion to reach, and it is very different from concluding that the pool is simply the better product.

---

## 7. Checklist

- [ ] Name the instrument correctly before comparing rates.
- [ ] For lending: check collateral factors, oracle sources, liquidation history and current utilisation.
- [ ] For liquidity: check routed volume, active depth, fee tier and the divergence hurdle for the pair.
- [ ] Confirm the withdrawal path and what blocks it under stress in each case.
- [ ] Decide whether your mandate requires holding a fixed quantity of one asset. If so, the choice is already made.
- [ ] Size each position against its own failure mode rather than against a shared yield figure.

The two structures are complements. The error is not choosing one over the other; it is failing to notice they are different questions.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
3. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [DeFi lending: intermediation without information? (Bank for International Settlements, 2022)](https://www.bis.org/publ/bisbull57.htm)
5. [DeFi Protocols for Loanable Funds (Gudgeon et al., 2020)](https://arxiv.org/abs/2006.13922)
6. [Aave Protocol Documentation](https://aave.com/docs)
7. [Global Financial Stability Report, April 2022 (International Monetary Fund)](https://www.imf.org/en/Publications/GFSR/Issues/2022/04/19/global-financial-stability-report-april-2022)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[3]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[4]: https://www.bis.org/publ/bisbull57.htm "DeFi lending: intermediation without information?"
[5]: https://arxiv.org/abs/2006.13922 "DeFi Protocols for Loanable Funds (Gudgeon et al., 2020)"
[6]: https://aave.com/docs "Aave Protocol Documentation"
[7]: https://www.imf.org/en/Publications/GFSR/Issues/2022/04/19/global-financial-stability-report-april-2022 "Global Financial Stability Report, April 2022 (International Monetary Fund)"
