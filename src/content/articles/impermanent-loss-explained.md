---
title: "Impermanent Loss Explained: Why Pools Trail Simply Holding"
description: "Why a pool position falls behind simply holding, how much at each price move, and the cost volatility adds that fees have to cover."
category: "Risk & Research"
date: 2026-09-09
lastReviewed: "2026-09-12"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "impermanent loss explained"
keywords: "impermanent loss explained, Loss-Versus-Rebalancing, LVR, AMM market microstructure, Uniswap v3 IL, adverse selection, toxic flow, what is impermanent loss, divergence loss"
featured: true
faq:
  - q: "What is impermanent loss?"
    a: "The shortfall between a pooled position and simply holding the deposited tokens, caused by the pool selling whichever asset appreciates and accumulating whichever falls. It becomes permanent when you withdraw at a different relative price than you entered."
  - q: "How to avoid impermanent loss?"
    a: "It cannot be removed while supplying a two-sided pool, only reduced or offset: correlated or pegged pairs diverge less, weighted pools rotate less, fee income offsets what remains, and a hedge can neutralise the directional part at a cost."
  - q: "Is impermanent loss vs permanent loss a real distinction?"
    a: "Only until you withdraw. The word impermanent refers to the possibility that relative prices return to their entry ratio, which closes the gap. Withdrawing crystallises whatever gap exists at that moment."
  - q: "Is impermanent loss permanent once it appears?"
    a: "The word is misleading. The gap is measurable at any moment and is locked in when you withdraw. If price returns to the entry level, the gap closes; if you exit elsewhere, you realise whatever gap exists then."
---

You put \$10,000 into an ETH/USDC pool when ETH was \$3,000. A month later ETH is \$6,000. Your position is worth about \$14,140. A friend who deposited nothing and just held the same tokens has \$15,000.

That gap has a name. Impermanent loss — the shortfall between a pool position and simply holding the same tokens — happens because the pool sold your ETH on the way up, a little at a time, the whole way.

By the end you will know how big that gap is at each price move, why a narrow range makes it far worse, and which number to compare a pool's fees against before you deposit.

<figure class="article-figure">
  <img src="/images/guides/impermanent-loss-explained.webp" alt="A balanced pool evolves into an uneven inventory while a hold-only basket preserves its original mix." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Pool rebalancing changes inventory relative to simply holding. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> The name is the problem. The headline number does reset if the price comes all the way back, and people take comfort in that. But you do not get to pick the exit price, and every re-range along the way locks part of the loss in. Price the position on the cost volatility creates, not on the hope of a round trip.

## Why the pool sells your winner

A pool holds two tokens and follows one rule. It never checks the market, so when ETH rises somewhere else, the pool is still offering it at the old price.

Traders notice immediately. They buy the cheap ETH out of your pool and sell it at the market price elsewhere, and they keep doing it until the pool's price lines up with the wider market [1].

So the pool ends up with less ETH and more dollars every time ETH goes up. It sold the winner. Nobody decided to; that is simply what the rule does.

The reverse happens when ETH falls. Traders sell ETH into the pool cheaply, and you end up holding more of the token that dropped. Either way, you finish behind what you would have had by keeping your funds outside the pool, and the fees may or may not make up the difference [2].

## How much it costs at each price move

Here is the whole thing in one table. Each row is how far the price moved from where you deposited, for an ordinary full-range pool.

| Price move | Impermanent loss vs holding |
| :--- | ---: |
| Up 25%, or down 20% | -0.62% |
| Up 50%, or down a third | -2.02% |
| Doubles or halves | -5.72% |
| Triples | -13.40% |
| Up 5x | -25.46% |

Two things stand out. First, small moves cost almost nothing, so a pair that stays put is a comfortable place to be. Second, the cost accelerates. Doubling costs you about nine times what a 25% move costs.

The rule behind that table is short [3]:

$$
\text{IL} = \frac{2\sqrt{k}}{1 + k} - 1
$$

Where:

- $k$ is the price now divided by the price when you deposited.
- The answer is negative, and it is the fraction of value you gave up against holding.

Notice that $k$ and $1/k$ give the same answer. A token that doubles hurts exactly as much as one that halves. Direction does not matter to this formula, only distance. The pool mechanics behind it are in [Constant Product Formula](/guides/constant-product-formula/).

## Why a narrow range multiplies it

Picking a tight price band packs your money where the trading happens, so you earn much more per dollar [4]. Near the middle of the band, the same packing multiplies the divergence by roughly the same factor [5] [6].

A band also has edges. Cross one and the conversion is complete.

| Where the price goes | What you are left holding |
| :--- | :--- |
| Below your lower bound | All of the token that fell, bought the whole way down |
| Inside your band | A mix, shifting with every trade |
| Above your upper bound | All of the quote token, sold the whole way up |

Past either edge the position stops trading, but it does not stop falling behind. If the price keeps moving, the gap against holding keeps widening, because the rest of the move happens without you.

A band of plus or minus 5% around the current price packs your money about forty times more densely than a full-range position, and speeds the divergence near the middle by about the same factor. That is not a reason to avoid ranges. It is a reason to size them against how much the pair actually moves. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## Why "impermanent" is the wrong word

Partly it is the right word. If the price comes all the way back and you never touched the position, an ordinary pool really is level with holding again, plus whatever fees it earned [7].

The word misleads in three other ways, and each costs people money.

**The trades are real.** They already happened, on chain, one at a time. Withdrawing does not create the loss; it only tells you the total.

**You rarely get the round trip.** You withdraw at whatever price exists on the day you need to. If you re-range along the way, each move withdraws at the current price and locks that part of the loss in for good.

**The formula hides a steady cost.** Every time the market moves, fast traders correct your pool's stale price and keep the difference. That cost is loss-versus-rebalancing, or LVR — the gap between making those trades at your pool's late price and making them at the market price [8].

$$
\frac{d(\text{LVR})}{dt} = \frac{\sigma^2}{4} \cdot L \cdot \sqrt{P}
$$

Where:

- $\sigma$ is how much the pair moves, as annual volatility.
- $L$ is how much liquidity you have working at the current price.
- $P$ is the current price.
- The left side is how fast the cost builds, per year.

For a full-range position, that rate works out to volatility squared divided by eight, as a yearly share of the position's value [8]. If the price has no built-in trend, then averaged over every path it could take, impermanent loss and LVR come to the same number. On any single path they differ. A round trip shows zero impermanent loss, and a steady trend shows a lot. LVR is the version you can estimate before you deposit, which makes it the fair number to compare fees against.

For a \$10,000 full-range position held for a year:

| How much the pair moves a year | Expected cost from LVR |
| :--- | ---: |
| 40% | \$200 |
| 80% | \$800 |
| 120% | \$1,800 |

Three things follow from that shape, and each one changes a decision:

- **It builds steadily.** It does not depend on where the price ends up, so it keeps accruing in a choppy market that goes nowhere [8].
- **Volatility is squared.** A pair that moves twice as much costs you roughly four times as much.
- **Volume is not in it at all.** Your fees depend on volume. Your cost depends on volatility. Those are two different things, and profitability is the race between them.

## Who is actually trading with you

Not all volume is worth the same to you. Split it in two.

**Ordinary traders** are swapping because they want the token, rebalancing a portfolio, or routing through an aggregator. They have no edge on the next ten minutes. Their fees are genuine payment for a service.

**Fast traders** are bots watching a large exchange and hitting your pool the instant it lags. They pay the fee too, but they only trade when the gap is bigger than the fee, so they usually take more than they pay. Arbitrage of this kind is one form of MEV — profit from controlling which transactions run first. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/) for how it works.

So the test for any pool, measured against a portfolio that makes the same trades at market prices, is:

$$
\text{Result} = \text{all trading fees} - \text{LVR} - \text{gas}
$$

Where:

- **All trading fees** includes what the arbitrage bots paid, which offsets part of what they take.
- **LVR** is the cost above.
- **Gas** is everything you pay to enter, claim, adjust, and exit.

Measurement studies find that this race is often lost. One study of the largest Uniswap pools found losses to arbitrageurs exceeded the fees providers earned across many of them, and that passive providers did better in v2 pools than in their v3 counterparts [9]. An earlier study of 17 Uniswap v3 pools in 2021 counted \$260.1 million of impermanent loss against \$199.3 million of fees [3].

## What to check before you deposit

1. **Pick your benchmark first.** Are you measuring against holding, or against a portfolio somebody actively rebalances? They give different answers, and only the second counts the cost of volatility along the way.
2. **Compare the yield to the cost, not to zero.** Take annual volatility, square it, and divide by eight: that is the yearly cost of a full-range position as a share of its value. For a band, multiply by how densely the band packs your money. A pair moving 100% a year costs about 12.5% a year at full range, so a 10% fee yield there loses on average.
3. **Look at who trades there.** What share of volume comes from aggregators and ordinary users, rather than arbitrage bots?
4. **Size the band to the pair.** Wide enough that a normal week does not knock you out, or automated enough that something moves it for you.
5. **Ask whether you want a trade instead.** If you have a view on direction, a range order may express it better than providing liquidity. See [Range Orders on AMMs](/guides/range-orders-on-amms/).

## Where to watch the numbers

- **Your position against holding, side by side:** [Revert Finance](https://revert.finance).
- **Pool-level arbitrage and historical volatility:** [Dune Analytics](https://dune.com).
- **Your own scenario:** the [impermanent loss calculator](/tools/impermanent-loss-calculator/#mode=weighted&a0=2000&a1=3000&b0=1&b1=1&capital=10000&fees=260&days=45&weight=0.5).

## When something goes wrong

- **The price has moved 30% from where you entered.** A full-range position is only about 0.9% behind holding after a 30% rise, or 1.6% after a 30% fall. A band can be many times further behind. Compare the fees you have earned against that, and decide whether to keep the converted position.
- **The price is back near your entry but you are still behind holding.** Divergence is not the cause. Look at gas, re-ranges that locked in losses, time spent out of range, and reward tokens that fell.
- **Fees are comfortably ahead of the divergence.** The pool has real volume and modest volatility. Keep going, and put the fees back to work.

## Where to go next

For the step-by-step derivation, read [The Impermanent Loss Formula](/guides/impermanent-loss-formula/). To test whether fees clear the gap over a holding period, use [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/). For five worked positions, see [Impermanent Loss Examples](/guides/impermanent-loss-examples/), and for what each mitigation costs, [How to Avoid Impermanent Loss](/guides/how-to-avoid-impermanent-loss/).

## References

1. [An analysis of Uniswap markets (Angeris et al., 2019)](https://arxiv.org/abs/1911.03380)
2. [DeFi risks and the decentralisation illusion (Aramonte, Huang & Schrimpf, BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
3. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
4. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
5. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [Uniswap Support: What is Impermanent Loss?](https://support.uniswap.org/hc/en-us/articles/20904453751693-What-is-Impermanent-Loss)
8. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
9. [Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)](https://arxiv.org/abs/2404.05803)

[1]: https://arxiv.org/abs/1911.03380 "An analysis of Uniswap markets (Angeris et al., 2019)"
[2]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[3]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[4]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[5]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://support.uniswap.org/hc/en-us/articles/20904453751693-What-is-Impermanent-Loss "Uniswap Support: What is Impermanent Loss?"
[8]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[9]: https://arxiv.org/abs/2404.05803 "Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)"
