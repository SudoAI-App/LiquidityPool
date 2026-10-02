---
title: "Lending Pool vs Liquidity Pool: Two Different Instruments"
description: "Same word, different thing. One pays you for time and keeps your tokens. The other pays you for trades and changes them. Plus a worked rate comparison."
category: "Foundations"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "lending pool vs liquidity pool"
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

This guide separates them on three questions: where the money comes from, what happens to your balance, and what stops you getting out. By the end you can tell which one fits what you need to hold a year from now.

<figure class="article-figure">
  <img src="/images/guides/lending-pool-vs-liquidity-pool.webp" alt="Table comparing lending pools and liquidity pools across assets supplied, revenue, rate setting, principal risk, withdrawal and quantity held." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Same word, different instrument: what each pool type actually does with a deposit. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> The tell is what happens when nothing happens. A lending deposit ticks along during a flat week. A liquidity position in a flat week with no trading earns exactly nothing. One is paid for time, the other for flow. That should drive the allocation before anybody compares a rate.

## Where the money comes from

**A lending pool** matches you with borrowers. They post collateral worth more than the loan, borrow, and pay interest [1]. The rate is set by how much of the supply is currently borrowed, a ratio called utilisation [2]. Aave, for example, uses two slopes: a gentle one up to a target utilisation and a steep one above it, to pull the pool back toward spare cash [3].

**A liquidity pool** holds two tokens and prices trades from them. Traders pay a fee per swap, which goes to the providers whose liquidity covered that price [4]. Your income depends on volume, not on the calendar. See [Liquidity Provider Fees](/guides/liquidity-provider-fees/).

That single difference explains most of the rest. Lending income accrues like interest. Pool income is lumpy, tends to cluster in busy stretches, and is zero when nobody trades the pair.

## What happens to your balance

| | Lending | A liquidity pool |
| :--- | :--- | :--- |
| What you supply | One token | Two, in a ratio |
| Your token count | Goes up with interest | Rotates with the relative price |
| Your exposure | Unchanged, plus yield | Constantly rebalanced |
| After a price move | Value follows the token | Value follows the pair, minus the divergence |
| What to compare against | Holding the token unlent | Holding both tokens untouched |

The fourth row is the one that surprises people. Lend ETH through a 40% drawdown and you still have ETH, slightly more of it. Pool ETH through the same drawdown and your mix has shifted, because the pool bought ETH the whole way down [5]. You finish with more ETH and fewer dollars than you put in.

Here is that drawdown in numbers. You start with \$10,000 when ETH is \$2,000, and ETH falls 40% to \$1,200. The lending deposit earns 2% over the period. The pool is a full-range constant-product pool, shown before any fee income.

| | Lend 5 ETH at 2% | Pool 2.5 ETH and \$5,000 |
| :--- | ---: | ---: |
| What you hold afterwards | 5.1 ETH | 3.23 ETH and \$3,873 |
| Worth at \$1,200 | \$6,120 | \$7,746 |
| The right benchmark | 5 ETH untouched, \$6,000 | The same basket untouched, \$8,000 |
| Against that benchmark | +\$120 | -\$254 |

The pool lost less in dollars, but only because half of it started in dollars. Against its own benchmark it is \$254 behind, and the lending deposit is \$120 ahead. The pool's gap is impermanent loss — what a pool position gives up against keeping the same tokens in your wallet. Fees earned over the period would offset some or all of it.

See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/). The full comparison for a pool position — fees, divergence and gas against holding the basket — is what the [LP profit and return calculator](/tools/lp-profit-calculator/) works out.

## How each one breaks

| Lending goes wrong when | A pool goes wrong when |
| :--- | :--- |
| A liquidation does not cover the loan, and suppliers absorb the shortfall | The two tokens move apart and the pool sold the winner |
| A price feed is wrong or manipulated, so loans get made that cannot be liquidated | Faster traders pick off a quote that is a block behind |
| Liquidators hold back during a sharp move, because the collateral may fall before they can sell it | A peg breaks and the curve fills you with the broken token |
| Everything is borrowed, so you cannot withdraw | The price leaves your range and you earn nothing |

The lending column comes from how collateral and liquidation work [1] [6], and price-feed attacks are a documented weakness across DeFi [7]. Neither list is a subset of the other, so holding both spreads you across different failures. A market-wide crash can still hit both at once [6].

The pool-side cost of trading against faster traders is loss-versus-rebalancing — the value arbitrageurs take because the pool's quote lags the market [8] — covered in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).

## Getting out is not the same

This is the operational difference that is easiest to miss.

**A pool position exits in any block.** What varies is what you get back and at what price, not whether you can. A standard pool contract returns your share of whatever it holds when you withdraw [5].

**A lending deposit exits only if somebody has not borrowed it.** At high utilisation you wait for repayments or new deposits. Rates rise steeply to attract supply and push borrowers out [3], which usually resolves it. A study of Compound, Aave and dYdX found that stretches where most funds were lent out and unavailable to withdraw were common [2].

Anyone treating a lending deposit as cash should test that assumption at the utilisation levels the market actually reaches, not the average one.

## Comparing the rates honestly

A lending rate and a pool yield are not comparable as printed. Five steps first:

1. **Put both on the same basis**, simple or compounded, with the assumption stated. See [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/).
2. **Subtract expected divergence** from the pool figure, over your intended horizon.
3. **Subtract gas** for how often each needs touching.
4. **Haircut any part funded by token issuance**, at prices you could actually realise.
5. **Price the certainty of withdrawal.** It is worth something, and it is easy to leave out.

Work it. A lending market quotes a 6.4% APY on USDC, compounded daily. A stablecoin pool quotes 9.1% simple, of which 3.0 points are token rewards. Assume you can realise about two-thirds of the reward value when you sell.

| Step | Lending | The pool |
| :--- | ---: | ---: |
| Put on a common basis | about 6.2% simple | 9.1% simple |
| Haircut the reward portion | unchanged | 3.0 points becomes about 2.0 |
| After that | about 6.2% | about 8.1% |
| What it is underwriting | Bad debt, and being gated at high utilisation | Both tokens holding their peg |
| Gas on \$25,000 for a quarter | Immaterial | Immaterial |

The ranking holds. The pool pays about 1.9 points more, and it pays more because it is underwriting a different tail: two stablecoins holding their peg.

That is a different conclusion from "the pool is the better product". The extra yield is payment for a risk the lending deposit does not carry, and the lending deposit carries bad-debt and withdrawal risk the pool does not.

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

These are complements. Lending answers "how do I earn on a fixed amount of one token?" A pool answers "how do I earn from trading in a pair I am happy to hold in any mix?" Pick the one whose question matches yours.

## References

1. [DeFi lending: intermediation without information? (BIS Bulletin No 57, 2022)](https://www.bis.org/publ/bisbull57.htm)
2. [DeFi Protocols for Loanable Funds: Interest Rates, Liquidity and Market Efficiency (Gudgeon et al., 2020)](https://arxiv.org/abs/2006.13922)
3. [Interest Rate Strategy (Aave Protocol Documentation)](https://aave.com/docs/aave-v3/smart-contracts/interest-rate-strategy)
4. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
5. [Uniswap v2 Core (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
6. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
7. [SoK: Decentralized Finance (DeFi) (Werner et al., 2021)](https://arxiv.org/abs/2101.08778)
8. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)

[1]: https://www.bis.org/publ/bisbull57.htm "DeFi lending: intermediation without information?"
[2]: https://arxiv.org/abs/2006.13922 "DeFi Protocols for Loanable Funds: Interest Rates, Liquidity and Market Efficiency"
[3]: https://aave.com/docs/aave-v3/smart-contracts/interest-rate-strategy "Interest Rate Strategy"
[4]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core"
[5]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core"
[6]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion"
[7]: https://arxiv.org/abs/2101.08778 "SoK: Decentralized Finance (DeFi)"
[8]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
