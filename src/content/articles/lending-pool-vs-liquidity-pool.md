---
title: "Lending Pool vs Liquidity Pool: Two Different Instruments"
description: "Same word, different thing. One pays you for time and keeps your tokens. The other pays you for trades and changes them. Plus a worked rate comparison."
category: "Foundations"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
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

Both are called pools. Both take deposits. Both quote an annual percentage. Underneath they are completely different instruments, and sizing one as though it were the other is a common and expensive mistake.

One lends your token to somebody who pays interest. The other uses two of your tokens to quote prices for strangers.

This guide separates them on the three things that matter: where the money comes from, what happens to your balance, and what stops you getting out.

<figure class="article-figure">
  <img src="/images/guides/lending-pool-vs-liquidity-pool.webp" alt="Table comparing lending pools and liquidity pools across assets supplied, revenue, rate setting, principal risk, withdrawal and quantity held." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Same word, different instrument: what each pool type actually does with a deposit. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"The tell is what happens when nothing happens. A lending deposit ticks along during a flat week. A liquidity position in a flat week with no trading earns exactly nothing. One is paid for time, the other for flow. That should drive the allocation before anybody compares a rate."*

## Where the money comes from

**A lending pool** matches you with borrowers. They post collateral, take a loan, and pay interest. The rate is set by how much of the supply is currently borrowed, usually with a sharp increase past a threshold to pull the pool back toward liquidity.

**A liquidity pool** holds two tokens and prices trades from them. Traders pay a fee per swap, which goes to whoever was live at that price. Your income depends on volume, not on the calendar. See [Liquidity Provider Fees](/guides/liquidity-provider-fees/).

That single difference explains most of the rest. Lending income is smooth and rate-like. Pool income is lumpy, clusters around volatile stretches, and is zero when the pair is quiet.

## What happens to your balance

| | Lending | A liquidity pool |
| :--- | :--- | :--- |
| What you supply | One token | Two, in a ratio |
| Your token count | Goes up with interest | Rotates with the relative price |
| Your exposure | Unchanged, plus yield | Constantly rebalanced |
| After a price move | Value follows the token | Value follows the pair, minus the divergence |
| What to compare against | Holding the token unlent | Holding both tokens untouched |

The third row is the one that surprises people. Lend ETH through a 40% drawdown and you still have ETH, slightly more of it. Pool ETH through the same drawdown and your mix has shifted, because the pool bought ETH the whole way down. You finish with more ETH and fewer dollars than you put in.

Here is that drawdown in numbers. You start with \$10,000 when ETH is \$2,000, and ETH falls 40% to \$1,200.

| | Lend 5 ETH at 2% | Pool 2.5 ETH and \$5,000 |
| :--- | ---: | ---: |
| What you hold afterwards | 5.1 ETH | 3.23 ETH and \$3,873 |
| Worth at \$1,200 | \$6,120 | \$7,746 |
| The right benchmark | 5 ETH untouched, \$6,000 | The same basket untouched, \$8,000 |
| Against that benchmark | +\$120 | -\$254 |

The pool lost less in dollars, but only because half of it started in dollars. Against its own benchmark it is behind, and the lending deposit is ahead. That gap is impermanent loss — the shortfall between the pool position and simply keeping the tokens. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

## How each one breaks

| Lending goes wrong when | A pool goes wrong when |
| :--- | :--- |
| A liquidation does not cover the loan, and suppliers eat the shortfall | The two tokens move apart and the pool sold the winner |
| A price feed is wrong, so loans get made that cannot be liquidated | Faster traders pick off a quote that is a block behind |
| Liquidators cannot clear fast enough during a sharp move | A peg breaks and the curve fills you with the broken token |
| Everything is borrowed, so you cannot withdraw | Your range is out of range and earning nothing |

Both lists are real. Neither is a subset of the other, which is why a portfolio holding both is genuinely diversified rather than just spread around. The pool-side bleed is loss-versus-rebalancing — what a pool pays out for quoting a block late — covered in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).

## Getting out is not the same

This is the operational difference people miss most.

**A pool position exits in any block.** What varies is what you get back and at what price, not whether you can. The contract always returns your share of what it holds.

**A lending deposit exits only if somebody has not borrowed it.** At high utilisation you are queued behind repayments. Rates rise to attract new supply and push borrowers out, which usually resolves it, and "usually" is doing real work in that sentence during a crisis.

Anyone treating a lending deposit as cash should test that assumption at the utilisation levels the market actually reaches, not the average one.

## Comparing the rates honestly

A lending rate and a pool yield are not comparable as printed. Five steps first:

1. **Put both on the same basis**, simple or compounded, with the assumption stated. See [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/).
2. **Subtract expected divergence** from the pool figure, over your intended horizon.
3. **Subtract gas** for how often each needs touching.
4. **Haircut any part funded by token issuance**, at prices you could actually realise.
5. **Price the certainty of withdrawal.** It is worth something and almost nobody counts it.

Work it. A lending market quotes 6.4% compounded on USDC. A stablecoin pool quotes 9.1% simple, of which 3.0 points are token rewards.

| Step | Lending | The pool |
| :--- | ---: | ---: |
| Put on a common basis | about 6.2% simple | 9.1% simple |
| Haircut the reward portion | unchanged | 3.0 points becomes about 2.0 |
| After that | about 6.2% | about 8.1% |
| What it is underwriting | Bad debt, and being gated at high utilisation | Both tokens holding their peg |
| Gas on \$25,000 for a quarter | Immaterial | Immaterial |

The ranking holds. The pool pays more, and it pays more precisely because it is underwriting a different and less familiar tail.

That is the right conclusion, and it is very different from concluding the pool is simply the better product.

## What people get wrong comparing them

| What people assume | What actually happens |
| :--- | :--- |
| Both are pools, so compare the rates | One keeps your tokens, one changes them. Different instruments |
| Lending has no equivalent of divergence | True. It has bad debt instead, and that is a total-loss tail |
| A lending deposit is like cash | Only while somebody has not borrowed it |
| A pool is riskier because it is more complicated | Different risk, not more. Lending concentrates in collateral and liquidations |

## When each one fits

**Lend when** you need to keep a fixed quantity of one token, you want predictable income, or you will not be paying attention.

**Supply a pool when** you are happy holding either token in the pair, the pair trades a lot relative to how much it moves, and you will measure the result against holding.

A simple test settles most cases. Write down how many of each token you need to hold a year from now. If that number is fixed, lend. If you only care about the total dollar value and would accept any mix, a pool is on the table.

A third structure combines them: supplying a staked-ETH receipt to a lending market, or against its base asset in a stable-pair pool. Both stack yields and both stack risks. See [Liquidity Pool vs Staking](/guides/liquidity-pool-vs-staking/).

## Before you decide

1. **Name the instrument correctly** before you compare anything.
2. **For lending:** check collateral factors, where the prices come from, past liquidation performance, and current utilisation.
3. **For a pool:** check routed volume, depth near the price, the fee tier, and the divergence hurdle.
4. **Confirm the exit path** and what blocks it under stress, in each case.
5. **Ask whether you need a fixed quantity of one token.** If yes, the choice is already made.
6. **Size each one against its own failure**, not against a shared yield figure.

These are complements. The error is not picking one over the other. It is failing to notice they answer different questions.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
3. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [DeFi lending: intermediation without information? (Bank for International Settlements, 2022)](https://www.bis.org/publ/bisbull57.htm)
5. [DeFi Protocols for Loanable Funds (Gudgeon et al., 2020)](https://arxiv.org/abs/2006.13922)
6. [Aave Protocol Documentation](https://aave.com/docs)
7. [Global Financial Stability Report, April 2022 (International Monetary Fund)](https://www.imf.org/en/Publications/GFSR/Issues/2022/04/19/global-financial-stability-report-april-2022)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[3]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[4]: https://www.bis.org/publ/bisbull57.htm "DeFi lending: intermediation without information?"
[5]: https://arxiv.org/abs/2006.13922 "DeFi Protocols for Loanable Funds (Gudgeon et al., 2020)"
[6]: https://aave.com/docs "Aave Protocol Documentation"
[7]: https://www.imf.org/en/Publications/GFSR/Issues/2022/04/19/global-financial-stability-report-april-2022 "Global Financial Stability Report, April 2022 (International Monetary Fund)"
