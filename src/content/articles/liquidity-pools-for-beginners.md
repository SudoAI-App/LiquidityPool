---
title: "Liquidity Pools for Beginners: Five Decisions, In Order"
description: "Five decisions settle almost everything about how your first position turns out. None requires predicting a price, and the yield is the last thing to check."
category: "Foundations"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
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

Most guides tell you what a pool is and then show you a yield. That is backwards.

The yield is the only number you cannot check in advance. Everything else about your outcome you can work out before you deposit a cent, and it comes down to five decisions.

None of them requires predicting a price. This guide takes them in the order they actually arrive.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pools-for-beginners.webp" alt="Five sequential decisions: pick the pair, pick the curve, pick the tier, size the position, set the exit rule." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The five decisions in the order they actually arrive, none of which requires predicting a price. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"Before depositing, write down exactly what you will own if the volatile token halves, and if it triples. If either answer is one you cannot live with, this is the wrong instrument and no yield figure changes that. It takes two minutes and prevents most of the disappointment I see."*

## What you are actually agreeing to

Three things become true the moment you deposit.

1. **You hold both tokens**, in amounts the contract will keep changing.
2. **You are quoting a price continuously**, and you cannot cancel or adjust it.
3. **You get paid per trade, not per day.** No volume, no income, however long you wait.

The first two together mean the pool sells whatever is rising and buys whatever is falling. That is the mechanism doing its job, not a fault. It opens up impermanent loss — the gap between what the pool position is worth and what simply holding the tokens would have been worth. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/), and [What Is a Liquidity Pool?](/guides/what-is-a-liquidity-pool/) if any of this is new.

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
| Two stablecoins | A flat stable-pair curve | Depth sits where the pair actually trades |
| A major against dollars | Full range, or a wide band | Predictable, nothing to fall out of |
| Assets that track each other | Stable curve or a narrow band | The relative price moves slowly |
| A volatile pair | Full range | Never runs dry at any price |

Narrow ranges are more efficient and only stay that way if you manage them. Learn on something that still works when you are not watching. See [Uniswap v2 vs v3](/guides/uniswap-v2-vs-v3/).

## Three: the fee tier

Where tiers exist, the higher one earns more per trade and usually gets fewer trades, because routers send orders wherever they fill best.

The right one maximises the fee times the volume that actually arrives, and both are measurable rather than guessable. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).

A sensible default for a first position: whichever tier the pair's volume already sits in. Any pool listing shows you that.

## Four: size

Gas costs the same whether you deposit \$500 or \$500,000. That sets a floor below which no strategy works.

The test: count the transactions your plan needs in a month, multiply by what a transaction costs, and divide by expected monthly fees. More than about a fifth and you need a bigger position, a simpler plan, or a cheaper network. On a network where a transaction costs a few cents, that floor almost disappears and a few hundred dollars is enough to learn with. On a busy day on Ethereum mainnet, it can sit in the thousands. See [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

## Five: the exit rule

Decide now what ends this position. A holding period, a measured shortfall against holding, volume drying up, or a reward programme ending.

Write it down before you deposit. A rule invented while a position is losing money is not a rule. It is a reaction.

## A first position, with real numbers

A \$4,000 deposit into a major pair at 0.05%, held 30 days, on a network where a transaction costs about \$3.

| | Value |
| :--- | ---: |
| Expected fees at typical turnover | \$46 |
| Gas across three transactions | -\$9 |
| Divergence if the pair moves 20% apart | -\$18 |
| Net against holding | +\$19 |

The margin is thin, and that is the point. At this size this is a learning exercise, not an allocation.

Now change one input. Move to a network where transactions cost \$18 and the same position is negative before the market has done anything at all.

## What people get wrong at the start

| What people assume | What actually happens |
| :--- | :--- |
| The advertised yield is what I earn | It excludes divergence, gas, and which token you end up holding |
| I can supply tokens I do not want | The pool converts you into the one you wanted less |
| A tight range is just more efficient | Unattended, it converts, stops earning, and stays that way |
| Gas is a rounding error | On a small position it consumes the entire return |
| A week tells me whether it worked | Both fees and divergence are noise over a week |

## What the first month should teach you

Treat it as an experiment with a measurement attached, not as an allocation.

At the end, work out three numbers. What the position is worth now. What the same tokens would be worth if you had never pooled them. What you paid in gas.

The gap between the first two, plus the fees you collected, is the entire result. It is the only comparison that means anything.

Keep it in a record like this from the day you deposit, because reconstructing it later is harder than it sounds.

| Date | Tokens in the position | Worth if simply held | Worth in the pool | Fees collected | Gas paid so far |
| :--- | :--- | ---: | ---: | ---: | ---: |
| Day 1 | 1 ETH and \$2,000 | \$4,000 | \$4,000 | \$0 | \$6 |
| Day 30, ETH up 20% | 0.91 ETH and \$2,191 | \$4,400 | \$4,382 | \$46 | \$9 |

In that example the pool trailed holding by \$18, collected \$46 and cost \$9 in gas, so it came out \$19 ahead.

If you beat holding, note why. Was it fees clearing a small divergence, or just a flat month where nothing happened? If you lost to holding, note that too. A trend that rotated you, a range that converted early, or costs that were too large for the size.

Either answer is worth more than a month of reading, because it happened to your money, on a pair you chose, in conditions you watched. Scale up after two or three cycles, and only into the things that worked for reasons you can explain.

## Your first position, step by step

1. **Pick a pair you would hold in a wallet anyway.**
2. **Pick the simplest structure that fits it.**
3. **Check the contracts** are audited, verified, and not changeable by one key.
4. **Estimate the income** with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/).
5. **Estimate the cost** with the [impermanent loss calculator](/tools/impermanent-loss-calculator/).
6. **Size it so gas is small** against expected income.
7. **Write down what you deposited**, at what prices, with the transaction hash.
8. **Set a review date and a written exit rule.**
9. **Review against holding the two tokens**, not against what you paid in dollars.

If the first position teaches you the pair was wrong, that is a cheap lesson and the right one to learn first. Everything else in this subject is refinement on top of these five decisions.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
5. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
6. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)
7. [How Uniswap Works (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[5]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[6]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
[7]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works (Uniswap Developer Documentation)"
