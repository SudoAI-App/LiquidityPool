---
title: "Liquidity Pools for Beginners: Five Decisions, In Order"
description: "A beginner's guide to liquidity pools that skips the hype: what you are agreeing to, the five decisions that decide the outcome, and the mistakes that cost the most."
category: "Foundations"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Siddharth Mehta"
readTime: "11 min read"
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

Most introductions to liquidity pools explain what a pool is and then move directly to yields. The more useful order is the opposite: understand what the position holds, what changes it, and what it costs to enter and leave. The yield is the last thing you should look at, because it is the only figure that cannot be verified in advance.

Five decisions determine almost everything about the outcome.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pools-for-beginners.webp" alt="Five sequential decisions: pick the pair, pick the curve, pick the tier, size the position, set the exit rule." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The five decisions in the order they actually arrive, none of which requires predicting a price. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"I tell people to write down, before depositing, exactly what they will own if the volatile asset halves and if it triples. If either answer is unacceptable, the pool is the wrong instrument, and no yield figure changes that. It takes two minutes and it prevents most of the disappointment I see."*

## 1. What You Are Actually Agreeing To

A liquidity pool is a contract holding two or more assets that prices trades from its reserves. When you deposit, three things become true:

1. **You hold both assets**, in proportions the contract will change as the market moves.
2. **You are quoting a price continuously**, and you cannot cancel or adjust it.
3. **You are paid per trade**, not per day, so income depends on volume rather than time.

The consequence of the first two is that the pool sells whichever asset is rising and accumulates whichever is falling. That behaviour is the mechanism, not a malfunction, and it is explained in [Impermanent Loss Explained](/guides/impermanent-loss-explained/). If any of the vocabulary here is unfamiliar, start with [What Is a Liquidity Pool?](/guides/what-is-a-liquidity-pool/).

---

## 2. Decision One: The Pair

The pair decides most of your outcome, because you will hold both assets in changing amounts.

- **Two stablecoins** produce small, steady fee income and very little rotation, with a real tail risk if one loses its peg.
- **A major asset against a stablecoin** is the common starting structure: meaningful fee income and moderate rotation.
- **Two volatile assets** rotate heavily and require a strong reason.
- **A newly launched token against anything** carries contract and exit risk that dominates every other consideration, examined in [Rug Pulls and Locked Liquidity](/guides/liquidity-pool-rug-pulls/).

Choose from what you would be content to hold, not from what is paying the most this week.

---

## 3. Decision Two: The Pool Type

Different curves suit different pairs, and the fit matters more than the protocol brand.

| Pair type | Suitable structure | Why |
| :--- | :--- | :--- |
| Two stablecoins | Amplified stable pool | Depth concentrated where the pair actually trades |
| Major against stablecoin | Constant product, or a wide range | Predictable, no boundary risk |
| Correlated assets | Stable or narrow range | Relative price moves slowly |
| Volatile pair | Constant product | Never runs out of liquidity at any price |

Concentrated ranges are more capital efficient and require active management to stay that way. Beginners are better served learning on a structure where an unattended position still functions, as compared in [Uniswap v2 vs v3](/guides/uniswap-v2-vs-v3/).

---

## 4. Decision Three: The Fee Tier

Where tiers exist, the higher one earns more per trade and usually receives less volume, because routers send orders to the cheapest executable path. The right tier is the one that maximises fee multiplied by the volume that actually arrives, which is measurable rather than guessable. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).

A reasonable default for a first position: the tier where the pair's volume already concentrates, which is visible in any pool listing.

---

## 5. Decision Four: Size

Gas is charged per transaction and does not scale with position size, so it sets a floor below which a strategy cannot work.

A simple test: total the transactions your plan needs in a month, multiply by current gas cost, and divide by expected monthly fee income. If the answer is more than about a fifth, either increase the size, simplify the strategy, or use a cheaper network. The arithmetic is worked through in [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

---

## 6. Decision Five: The Exit Rule

Decide in advance what ends the position. Reasonable rules include a target holding period, a measured shortfall against holding the basket, a volume decline that removes the fee case, or the end of an incentive programme that was the reason for entering.

Write it down before depositing. A rule chosen while a position is losing money is not a rule, it is a reaction.

### A first position with real numbers

A \$4,000 deposit into a major pair at a 5 bps fee tier, held for 30 days on a network where transactions cost about \$3.

| Line | Value |
| :--- | ---: |
| Expected fee income at 0.05% and typical turnover | \$46 |
| Gas across three transactions | −\$9 |
| Divergence if the pair moves 20% apart | −\$18 |
| Net against holding the basket | +\$19 |

The margin is thin, which is the point: at this size the position is a learning exercise rather than an allocation. Change the network to one costing \$18 per transaction and the same position is negative before the market does anything at all.

---

## 7. The Mistakes That Cost the Most

| Mistake | What happens |
| :--- | :--- |
| Choosing by advertised yield | The rate excludes divergence, gas and the assets you end up holding |
| Supplying assets you would not hold | The pool converts you into the one you wanted less |
| Using a narrow range without monitoring | The position converts, stops earning, and stays that way |
| Ignoring transaction costs at small size | Gas consumes the fee income entirely |
| Skipping the contract checks | The whole position is exposed to a permission you never read |
| Judging over a week | Both fee income and divergence are noisy over short windows |

### What the first month should teach you

Treat the first position as an experiment with a measurement, not as an allocation.

At the end of the month, compute three numbers. What the pooled position is worth today. What the same deposited assets would be worth if you had never pooled them. And what you paid in gas across the whole cycle. The difference between the first two, plus the fees you collected, is the entire result, and it is the only comparison that means anything.

If the position beat holding, note why: was it fee income clearing a small divergence, or a flat market where nothing happened? If it lost to holding, note that too: a trend that rotated your assets, or a range that converted early, or transaction costs that were simply too large for the size.

Either answer is worth more than a month of reading, because it is measured on your own capital, on a pair you chose, under conditions you observed. Scale up only after two or three such cycles, and only into the structures that worked for reasons you can articulate.

---

## 8. A First Position, Step by Step

- [ ] Choose a pair you would hold in a wallet regardless of the pool.
- [ ] Choose the simplest structure that suits the pair.
- [ ] Verify the contracts are audited, verified and not upgradeable by a single key.
- [ ] Estimate fee income with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/).
- [ ] Estimate divergence for a realistic move with the [impermanent loss calculator](/tools/impermanent-loss-calculator/).
- [ ] Size the position so that gas is a small fraction of expected income.
- [ ] Record entry quantities, prices and the transaction hash.
- [ ] Set a review date and a written exit rule.
- [ ] Review against holding the basket, not against your entry in dollars.

If the first position teaches you that the pair was wrong, that is a cheap lesson and the correct one to learn first. Everything else in liquidity provision is refinement on top of these five decisions.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
5. [SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
6. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)
7. [How Uniswap Works (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)
[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[5]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)"
[6]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
[7]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works (Uniswap Developer Documentation)"
