---
title: "Impermanent Loss Explained: Why Pools Trail Simply Holding"
description: "Why a pool position falls behind simply holding, how much at each price move, and the cost volatility adds that fees have to cover."
category: "Risk & Research"
date: 2026-08-29
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "8 min read"
keywords: "impermanent loss explained, Loss-Versus-Rebalancing, LVR, AMM market microstructure, Uniswap v3 IL, adverse selection, toxic flow, what is impermanent loss, how to avoid impermanent loss, impermanent loss calculator, divergence loss"
featured: true
faq:
  - q: "What is impermanent loss?"
    a: "The shortfall between a pooled position and simply holding the deposited tokens, caused by the pool selling whichever asset appreciates and accumulating whichever falls. It becomes permanent when you withdraw at a different relative price than you entered."
  - q: "How to avoid impermanent loss?"
    a: "It cannot be removed while supplying a two-sided pool, only reduced or offset: correlated or pegged pairs diverge less, weighted pools rotate less, fee income offsets what remains, and a hedge can neutralise the delta at a cost."
  - q: "Is impermanent loss vs permanent loss a real distinction?"
    a: "Only until you withdraw. The word impermanent refers to the possibility that relative prices return to their entry ratio, which closes the gap. Withdrawing crystallises whatever gap exists at that moment."
---

You put \$10,000 into an ETH/USDC pool when ETH was \$3,000. A month later ETH is \$6,000. You are up, but less up than the friend who did nothing and just held the same tokens.

That gap has a name. Impermanent loss — the shortfall between a pool position and simply holding the same tokens — happens because the pool sold your ETH on the way up, a little at a time, the whole way.

This guide shows you exactly how big that gap is at each price move, why a narrow range makes it far worse, and why the word "impermanent" is misleading in a way that costs people real money.

<figure class="article-figure">
  <img src="/images/guides/impermanent-loss-explained.webp" alt="A balanced pool evolves into an uneven inventory while a hold-only basket preserves its original mix." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Pool rebalancing changes inventory relative to simply holding. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"The name is the problem. The headline number does reset if the price comes all the way back, and people take comfort in that. But you do not get to pick the exit price, and every re-range along the way locks the loss in. Price the position on the cost volatility creates, not on the hope of a round trip."*

## Why the pool sells your winner

A pool holds two tokens and follows one rule. It never checks the market, so when ETH rises somewhere else, the pool is still offering it at the old price.

Traders notice immediately. They buy the cheap ETH out of your pool and sell it at the real price elsewhere. They keep doing that until the pool's price catches up.

So the pool ends up with less ETH and more dollars, every single time ETH goes up. It sold the winner. Not because anyone decided to, but because that is what the rule does.

The reverse happens when ETH falls. Traders sell ETH into the pool cheaply, and you end up holding more of the thing that dropped. Either way, you are on the wrong side.

## How much it costs at each price move

Here is the whole thing in one table. Each row is how far the price moved from where you deposited.

| Price move | Impermanent loss vs holding |
| :--- | ---: |
| Up 25%, or down 20% | -0.62% |
| Up 50%, or down a third | -2.02% |
| Doubles or halves | -5.72% |
| Triples | -13.40% |
| Up 5x | -25.46% |

Two things stand out. First, small moves cost almost nothing, so a pair that stays put is a comfortable place to be. Second, the cost accelerates. Doubling costs you nine times what a 25% move costs.

The rule behind that table is short [1]:

$$
\text{IL} = \frac{2\sqrt{k}}{1 + k} - 1
$$

Where:

- $k$ is the price now divided by the price when you deposited.
- The answer is negative, and it is the fraction of value you gave up.

Notice that $k$ and $1/k$ give the same answer. A token that doubles hurts exactly as much as one that halves. Direction does not matter to this formula, only distance. The pool mechanics behind it are in [Constant Product Formula](/guides/constant-product-formula/).

## Why a narrow range multiplies it

Picking a tight price band packs your money where the trading happens, so you earn much more per dollar. The same packing multiplies the loss by the same factor [2] [4].

Worse, a band has edges. Cross one and the conversion is complete.

| Where the price goes | What you are left holding |
| :--- | :--- |
| Below your lower bound | All of the token that fell, and you bought it the whole way down |
| Inside your band | A mix, shifting with every trade |
| Above your upper bound | All of the quote token, and you stopped gaining at the edge |

A band of plus or minus 5% around the current price speeds the divergence up by about forty times compared with a full-range position [2] [5]. That is not a reason to avoid ranges. It is a reason to size them against how much the pair actually moves. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## Why "impermanent" is the wrong word

Partly it is the right word. If the price comes all the way back and you never touched the position, an ordinary pool really is level with holding again, plus whatever fees it earned.

The word misleads in two other ways, and both cost people money.

**You rarely get the round trip.** You withdraw at whatever price exists on the day you need to. If you re-range along the way, each move withdraws at the current price and locks that part of the loss in for good.

**The formula hides a steady cost.** Every time the market moves, fast traders correct your pool's stale price and keep the difference. That cost is loss-versus-rebalancing, or LVR — the gap between making those trades at your pool's late price and making them at the real one [3].

$$
\frac{d(\text{LVR})}{dt} = \frac{\sigma^2}{4} \cdot L \cdot \sqrt{P}
$$

Where:

- $\sigma$ is how much the pair moves, as annual volatility.
- $L$ is how much liquidity you have working at the current price.
- $P$ is the current price.

If the price has no built-in trend, then averaged over every path it could take, impermanent loss and LVR come to the same number. On any single path they differ. A round trip shows zero impermanent loss, and a steady trend shows a lot. LVR is the version you can estimate before you deposit, which makes it the fair number to compare fees against.

For a \$10,000 full-range position held for a year:

| How much the pair moves a year | Expected cost from LVR |
| :--- | ---: |
| 40% | \$200 |
| 80% | \$800 |
| 120% | \$1,800 |

Three things follow from that shape, and each one changes a decision:

- **It builds steadily.** It does not depend on where the price ends up, so it keeps accruing in a choppy market that goes nowhere [3].
- **Volatility is squared.** A pair that moves twice as much costs you roughly four times as much.
- **Volume is not in it at all.** Your fees depend on volume. Your bleed depends on volatility. Those are two different things, and profitability is the race between them [3] [6].

## Who is actually trading with you

Not all volume is worth the same to you. Split it in two [6].

**Ordinary traders** are swapping because they want the token, rebalancing a portfolio, or routing through an aggregator. They have no edge on the next ten minutes. Their fees are genuine payment for a service.

**Fast traders** are bots watching a real exchange and hitting your pool the instant it lags. Every trade they make is a transfer from you to them. They still pay a fee, but the fee is usually smaller than what they take [6] [7].

So the test for any pool is:

$$
\text{Profit} = \text{fees from ordinary traders} - \text{LVR} - \text{gas}
$$

Where:

- **Fees from ordinary traders** is the part of volume that is not arbitrage, times the fee rate.
- **LVR** is the bleed above.
- **Gas** is everything you pay to enter, claim, adjust, and exit.

Academic audits of major Uniswap v3 pools have found that arbitrage extraction often exceeds total fee income, which makes unmanaged provision on those pairs a losing position in real terms [6] [7]. Much of that extraction is MEV — value captured purely by choosing the order transactions run in. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/) for how it works.

## What people get wrong about impermanent loss

| What people assume | What actually happens |
| :--- | :--- |
| The loss is not real until I withdraw | The trades already happened, on chain, one at a time. Withdrawing just tells you the total |
| A high advertised yield means I am fine | A 40% yield on a pair that moves 100% a year still loses money. Compare the yield to the bleed, not to zero |
| A tighter range is always better | It multiplies the earnings and the bleed by the same number, and adds the risk of falling out entirely |
| If the price comes back, I am even | Only if you never re-ranged, paid little gas, and the price returns exactly. Most positions meet none of those |

## What to check before you deposit

1. **Pick your benchmark first.** Are you measuring against holding, or against a portfolio somebody actively rebalances? They give different answers, and only one of them is honest about volatility.
2. **Compare the yield to the bleed.** Take annual volatility, square it, divide by eight. If the pool's fee yield is not comfortably above that, the position loses on average.
3. **Look at who trades there.** What share of volume comes from aggregators and ordinary users, rather than arbitrage bots?
4. **Size the band to the pair.** Wide enough that you are not knocked out by a normal week, or automated enough that something moves it for you.
5. **Ask whether you want a trade instead.** If you have a view on direction, a range order may express it better than providing liquidity. See [Range Orders on AMMs](/guides/range-orders-on-amms/).

## Where to watch the numbers

- **Your position against holding, side by side:** [Revert Finance](https://revert.finance).
- **Pool-level arbitrage and historical volatility:** [Dune Analytics](https://dune.com).
- **Your own scenario:** the [impermanent loss calculator](/tools/impermanent-loss-calculator/).

## When something goes wrong

- **The price has moved more than 30% from where you entered.** You are roughly 3% behind on a full-range position, far more in a band. Compare the fees you have earned against that, and decide whether to keep holding the converted position.
- **The price is back near your entry but you are still behind holding.** Divergence is not the cause. Look at gas, re-ranges that locked in losses, time spent out of range, and reward tokens that fell.
- **Fees are comfortably ahead of the divergence.** The pool has real volume and modest volatility. Keep going, and put the fees back to work.

## Where to go next

For the step-by-step derivation, read [The Impermanent Loss Formula](/guides/impermanent-loss-formula/). To test whether fees clear the gap over a holding period, use [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/). For five worked positions, see [Impermanent Loss Examples](/guides/impermanent-loss-examples/), and for what each mitigation costs, [How to Avoid Impermanent Loss](/guides/how-to-avoid-impermanent-loss/).

## References

1. [Uniswap Support: What is Impermanent Loss?](https://support.uniswap.org/hc/en-us/articles/20904453751693-What-is-Impermanent-Loss)
2. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
3. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
4. [Uniswap v3 Core Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)](https://arxiv.org/abs/2404.05803)
7. [Trading Fast and Slow: Colocation and Liquidity (Brogaard et al., 2015)](https://doi.org/10.1093/rfs/hhv045)
8. [Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)](https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873)
9. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
10. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://support.uniswap.org/hc/en-us/articles/20904453751693-What-is-Impermanent-Loss "Uniswap Support: What is Impermanent Loss?"
[2]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[3]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[4]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://arxiv.org/abs/2404.05803 "Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)"
[7]: https://doi.org/10.1093/rfs/hhv045 "Trading Fast and Slow: Colocation and Liquidity (Brogaard et al., 2015)"
[8]: https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873 "Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)"
[9]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[10]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
