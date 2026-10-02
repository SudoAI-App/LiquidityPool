---
title: "Liquidity Pools for Beginners: Five Decisions, In Order"
description: "Five decisions settle almost everything about how your first position turns out. None requires predicting a price, and the yield is the last thing to check."
category: "Foundations"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "liquidity pool for beginners"
keywords: "liquidity pool for beginners, how to start providing liquidity, DeFi liquidity beginner guide, first liquidity position, liquidity pool basics"
featured: false
faq:
  - q: "How do beginners start with liquidity pools?"
    a: "Start by understanding what the position holds rather than what it pays. Choose a pair you would hold anyway, use a simple full-range or stable pool, size it so that gas is immaterial, and measure the result against holding the same assets before adding more capital."
  - q: "What is the safest liquidity pool for a beginner?"
    a: "There is no risk-free pool. The most predictable structures are mature, audited pools holding assets you understand, on pairs whose relative price moves little. Predictable is not the same as safe: even pegged pairs carry contract risk and depeg risk."
  - q: "How much money do you need to provide liquidity?"
    a: "Enough that transaction costs are a small fraction of expected fee income. On expensive networks that can mean several thousand dollars for an actively managed position, or considerably less for a passive one on a cheaper network."
  - q: "What is the most common beginner mistake?"
    a: "Choosing a pool by its advertised yield. The rate is a backward-looking estimate that excludes divergence, gas and the possibility of the position converting into an asset you did not want to hold."
  - q: "Should beginners use concentrated liquidity?"
    a: "Usually not at first. A concentrated position requires monitoring and rebalancing to work, and an unmanaged one converts and stops earning. Learn the mechanics on a full-range position where the outcome depends on fewer decisions."
---

Most guides start with what a pool is and finish with a yield figure. For a first position, the yield is the last thing to check.

It is the only number you cannot know in advance. Everything else about your outcome you can work out before you deposit a cent, and it comes down to five decisions.

None of them requires predicting a price. Taken in the order they arrive, they let you decide whether a first position is worth opening, and how large it should be.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pools-for-beginners.webp" alt="Five sequential decisions: pick the pair, pick the curve, pick the tier, size the position, set the exit rule." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The five decisions in the order they actually arrive, none of which requires predicting a price. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Before depositing, write down what you would own if the volatile token halved and if it tripled. If either inventory outcome is unacceptable, the pool is the wrong instrument regardless of its quoted yield. This quick check makes the rebalancing exposure concrete before money is committed.

## What you are actually agreeing to

Three things become true the moment you deposit.

1. **You hold both tokens**, in amounts the contract will keep changing. Your claim is a share of the pool, not a fixed number of tokens [1].
2. **You are quoting a price continuously**, and you cannot cancel or adjust it. The pool's formula sets the price from its balances, not you [1].
3. **You get paid per trade, not per day.** Each swap pays a fee to the liquidity that was active for it [3]. No volume, no income, however long you wait.

The first two together mean the pool sells whatever is rising and buys whatever is falling. That is the mechanism doing its job, not a fault. It opens up impermanent loss — the shortfall between your pool position and the same tokens left untouched in a wallet. Fees may not be large enough to cover it [1]. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/), and [What Is a Liquidity Pool?](/guides/what-is-a-liquidity-pool/) if any of this is new.

## One: the pair

This decides most of your outcome, because you will be holding both tokens in changing amounts for the whole time.

| What you pair | What it feels like | The catch |
| :--- | :--- | :--- |
| Two stablecoins | Small steady income, almost no rotation | Real damage if one breaks its peg |
| A major token against dollars | Meaningful income, moderate rotation | The usual starting point, and a fair one |
| Two volatile tokens | Heavy rotation both ways | Needs a strong reason |
| Anything newly launched | Whatever the yield says | Contract and exit risk dominate everything else |

Choose from what you would be happy to hold anyway, not from what is paying most this week. On new tokens, see [Rug Pulls and Locked Liquidity](/guides/liquidity-pool-rug-pulls/).

## Two: the pool type

Different curves suit different pairs, and the fit matters far more than the brand on the interface.

| Your pair | What suits it | Why |
| :--- | :--- | :--- |
| Two stablecoins | A flat stable-pair curve | Depth sits where the pair actually trades [4] |
| A major against dollars | Full range, or a wide band | Predictable, nothing to fall out of |
| Assets that track each other | Stable curve or a narrow band | The relative price moves slowly |
| A volatile pair | Full range | Never runs dry at any price |

Narrow ranges put more of your money to work per trade [2]. They only stay that way if you manage them. A study of real Uniswap v3 providers found that the strategies earning large returns needed active management and more risk, while the simple ones earned modest returns [5]. Learn on something that still works when you are not watching. See [Uniswap v2 vs v3](/guides/uniswap-v2-vs-v3/).

## Three: the fee tier

Where tiers exist, the higher one earns more per trade and usually gets fewer trades, because routers send orders wherever they fill best.

The right one maximises the fee times the volume that actually arrives, and both are measurable rather than guessable. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).

A sensible default for a first position: whichever tier the pair's volume already sits in. Any pool listing shows you that.

Check what share of the tier reaches you. On Uniswap, governance switched on a protocol fee in December 2025. Version 2 pools now pay providers 0.25% of the 0.30% fee, and enabled v3 pools pay providers between three-quarters and five-sixths of their tier, depending on the tier [3].

## Four: size

Gas is charged for the work a transaction does, not for the amount of money it moves [7]. A deposit of \$500 costs the same to make as a deposit of \$500,000. That sets a floor below which no strategy works.

The test: count the transactions your plan needs in a month, multiply by what a transaction costs, and set that against expected monthly fees. Whatever fee income is left over has to absorb any divergence from holding. In the example below, \$45 of fees and an \$18 divergence leave room for at most \$27 of gas before the position trails holding.

On a network where a transaction costs a few cents, that floor almost disappears and a few hundred dollars is enough to learn with. On a busy day on Ethereum mainnet, it can sit in the thousands. See [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

## Five: the exit rule

Decide now what ends this position. A holding period, a measured shortfall against holding, volume drying up, or a reward programme ending.

Write it down before you deposit. A rule invented while a position is losing money is not a rule. It is a reaction.

## A first position, with real numbers

A \$4,000 deposit, half ETH and half dollars, into a pool paying providers 0.05% per trade. You hold it 30 days on a network where a transaction costs about \$3. Assume the pool's daily volume runs at about three-quarters of its liquidity, and ETH rises 20% against the dollar.

| | Value |
| :--- | ---: |
| Expected fees | \$45 |
| Gas across three transactions | -\$9 |
| Divergence against holding, ETH up 20% | -\$18 |
| Net against holding | +\$18 |

The margin is thin, and that is the point. At this size this is a learning exercise, not an allocation.

Now change one input. Move to a network where transactions cost \$18. Gas becomes \$54, which is more than the fees, so the position trails holding even if the price never moves.

## What the first month should teach you

Treat it as an experiment with a measurement attached, not as an allocation.

At the end, work out three numbers. What the position is worth now. What the same tokens would be worth if you had never pooled them. What you paid in gas.

The gap between the first two, plus the fees you collected, minus the gas, is the entire result. It is the only comparison that means anything.

Keep it in a record like this from the day you deposit, because reconstructing it later is harder than it sounds.

| Date | Tokens in the position | Worth if simply held | Worth in the pool | Fees collected | Gas paid so far |
| :--- | :--- | ---: | ---: | ---: | ---: |
| Day 1, ETH at \$2,000 | 1 ETH and \$2,000 | \$4,000 | \$4,000 | \$0 | \$6 |
| Day 30, ETH at \$2,400 | 0.91 ETH and \$2,191 | \$4,400 | \$4,382 | \$45 | \$9 |

In that example the pool trailed holding by \$18, collected \$45 and cost \$9 in gas, so it came out \$18 ahead of holding.

Do not judge it on a week. Over a few days, both fees and divergence are mostly noise. Across a month, the pattern starts to show.

If you beat holding, note why. Was it fees clearing a small divergence, or just a flat month where nothing happened? If you lost to holding, note that too. A trend that rotated you, a range that converted early, or costs that were too large for the size. Losing to holding is common, not a sign you did something unusual: one study of large Uniswap v3 pools found providers' impermanent loss exceeded their fees in aggregate [6].

Either answer is worth more than a month of reading, because it happened to your money, on a pair you chose, in conditions you watched. Scale up after two or three cycles, and only into the things that worked for reasons you can explain.

## Your first position, step by step

1. **Pick a pair you would hold in a wallet anyway.**
2. **Pick the simplest structure that fits it.**
3. **Check the contracts** are audited, verified, and not changeable by one key.
4. **Estimate the income** with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/#feeTier=0.3&capital=5000&volume=2000000&liquidity=500000).
5. **Estimate the cost** with the [impermanent loss calculator](/tools/impermanent-loss-calculator/#mode=weighted&a0=2000&a1=2600&capital=5000).
6. **Size it so gas is small** against expected income.
7. **Write down what you deposited**, at what prices, with the transaction hash.
8. **Set a review date and a written exit rule.**
9. **Review against holding the two tokens**, not against what you paid in dollars.

If the first position teaches you the pair was wrong, that is a cheap lesson and the right one to learn first. For the mechanics of placing the deposit, read [How to Provide Liquidity](/guides/how-to-provide-liquidity/). For how the pool prices the trades that pay you, read [Automated Market Makers Explained](/guides/automated-market-maker-explained/).

## References

1. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Fees (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/fees)
4. [StableSwap - efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
7. [Ethereum gas and fees: technical overview (ethereum.org)](https://ethereum.org/en/developers/docs/gas/)

[1]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees (Uniswap Developer Documentation)"
[4]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap - efficient mechanism for Stablecoin liquidity"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3"
[7]: https://ethereum.org/en/developers/docs/gas/ "Ethereum gas and fees: technical overview"
