---
title: "Loss-Versus-Rebalancing: The LP's Real Hurdle Rate"
description: "The number your fees actually have to beat. How it differs from impermanent loss, how to work it out in ten seconds, and what pools are doing to shrink it."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "loss versus rebalancing"
keywords: "loss versus rebalancing, LVR DeFi, what is LVR, adverse selection AMM, arbitrage profit LP, oracle AMM, dynamic fees"
featured: false
faq:
  - q: "What is LVR in DeFi?"
    a: "Loss-versus-rebalancing measures the value an automated market maker hands to arbitrageurs because its quote updates only when someone trades against it. It compares the pool against a benchmark portfolio that holds the same tokens but trades at the external market price, which isolates the cost of being picked off from ordinary market movement."
  - q: "How is LVR different from impermanent loss?"
    a: "Impermanent loss compares the pool with holding, and depends only on where the price starts and ends. LVR compares the pool with a rebalancing benchmark, and depends on how much the price moved along the way. A price that goes out and comes back leaves zero impermanent loss but a positive LVR. When the price has no trend, the two are equal on average."
  - q: "How large is LVR in practice?"
    a: "For a full-range constant-product position it runs at about sigma-squared over eight of the position's value per year, where sigma is annual volatility, before fees. At 60% volatility that is 4.5% a year. A concentrated range multiplies it, and trading fees and block timing reduce how much arbitrageurs actually capture."
  - q: "Can protocols reduce LVR?"
    a: "Partially. Fees that rise with volatility, auctions for the right to trade first against the pool, pricing anchored to an outside feed, and batch settlement all reduce what arbitrage can take. None removes it while the pool posts a quote it cannot update on its own."
---

Your pool's price only changes when somebody trades against it. Everywhere else in the market, prices move continuously.

Each time the outside price moves first, your pool is still offering the old terms. Whoever trades against it first keeps the difference. Loss-versus-rebalancing (LVR) measures how much value leaves your position this way [1].

It answers a question that impermanent loss — your result compared with simply holding the tokens — cannot. Impermanent loss depends only on where the price starts and ends. LVR tells you what the market-making itself cost, separate from whether the tokens went up or down. By the end, you can estimate that cost for a pool and decide whether its fees are likely to cover it.

<figure class="article-figure">
  <img src="/images/guides/loss-versus-rebalancing.webp" alt="Three value paths over time comparing a rebalancing benchmark, pool value with LVR drag, and pool value including fee income." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>LVR is the widening gap between the pool and a benchmark that rebalances at the external price; fees close part of it. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Impermanent loss compares your position with holding, so it depends only on the start and end prices. LVR compares it with a portfolio that holds the same tokens but trades at the market price, so it grows with every price move along the way. For a full-range pool it runs at about σ²/8 of the position's value per year before fees. That is the rate your fee income has to beat.

## What the benchmark measures

The construction is simple. Imagine a second portfolio that holds exactly what your pool holds at every moment. The only difference is that it does its trading at the real market price, not along the pool's curve.

Both hold the same tokens at the same times. So any gap between them cannot come from the market going up or down. It comes entirely from the prices the pool traded at.

That gap is LVR. For a full-range constant-product pool — the standard design where the two token balances multiplied together stay fixed — it has a short form [1]:

$$
\ell = \frac{\sigma^2}{8}
$$

Where:

- $\sigma$ is the pair's annual volatility, so 60% means $\sigma = 0.60$.
- $\ell$ is the share of the position's value that LVR takes per year, measured against the rebalancing benchmark, before fees.

At 60% volatility that is 4.5% a year. Per unit of liquidity, the same rate is $\tfrac{\sigma^2}{4} L\sqrt{P}$ per year. The two agree, because a full-range position is worth $2L\sqrt{P}$.

Three things follow, and each changes a decision.

- **Direction does not matter.** LVR accrues on moves up and moves down alike. What drives it is variance, not trend.
- **The path matters, not the destination.** A price that wanders and returns still produces LVR, even where impermanent loss reads zero.
- **Volatility is squared.** Halve how much a pair moves and the rate falls to a quarter. Double it and the rate quadruples.

Two adjustments apply in practice. A concentrated range packs more liquidity near the current price, so it multiplies LVR by roughly the same factor it multiplies your fee share [2]. And fees cut what arbitrageurs — traders who profit from gaps between the pool and the market — actually capture, because a trade only happens once the price gap exceeds the fee. Faster blocks shrink it further [3]. Treat σ²/8 as the full-range, no-fee rate, and adjust from there.

## Why a round trip still costs something

Take a \$10,000 full-range position in a pair at \$2,000. Over a week the price runs to \$2,300, falls to \$1,750, and finishes back at \$2,000. Assume arbitrage corrects the pool once at each turning point.

Against holding, you are level. A constant-product pool's value depends only on the current price, so at \$2,000 the position is worth \$10,000 again, plus fees.

Against the rebalancing benchmark, you are behind. On each leg the pool traded with an arbitrage bot at its stale price:

| Leg | Pool's change in value | Benchmark's change | LVR on the leg |
| :--- | ---: | ---: | ---: |
| \$2,000 to \$2,300 | +\$723.81 | +\$750.00 | \$26.19 |
| \$2,300 to \$1,750 | −\$1,369.66 | −\$1,282.19 | \$87.47 |
| \$1,750 to \$2,000 | +\$645.86 | +\$668.15 | \$22.30 |
| **Week** | **\$0.00** | **+\$135.96** | **\$135.96** |

The benchmark finishes \$136 ahead, about 1.4% of the position. That \$136 went to arbitrageurs, and it is what that week's fees needed to cover.

The same logic separates the two measures across other weeks, on the same \$10,000 deposit:

| How the price moved | Short of holding | Short of the rebalancing benchmark |
| :--- | ---: | ---: |
| Barely at all | About \$0 | About \$0 |
| Out and back, as above | \$0 | \$136 |
| Doubled in a single gap | \$858 | \$858 |
| Doubled in ten equal percentage steps | \$858 | \$73 |

Against holding, only the endpoints matter. Against the benchmark, what matters is the path, and specifically how much variance it carried. When the price has no trend, the two are equal on average, which is why LVR is the expected cost and impermanent loss is one draw of it [1]. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/) for the endpoint view.

## Who collects it

The value goes to identifiable traders competing in a specific auction.

- **The first trade of the block.** A centralised exchange reprices. The first onchain transaction in the next block moves your pool to match, and whoever sent it keeps the gap.
- **The bidding for that right.** Searchers compete by paying for priority, so much of the profit passes to whoever orders the block [4] [5]. That is why the money shows up in the fee market rather than in any pool statistic.
- **Fee sniping on the best trades.** A trader adds a very tight position just before a large swap, collects most of its fee, and withdraws straight after. This is called just-in-time liquidity. It avoids holding inventory, and it dilutes passive depositors on exactly the trades least likely to be arbitrage [6].

Together these are forms of MEV (maximal extractable value), the profit available to whoever controls the order of transactions in a block. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/) and [Market Making on AMMs](/guides/market-making-on-amms/).

## Four ways pools try to shrink it

None of them removes the cost. Each one reduces it, and each has a price.

| Mechanism | How it helps | What it costs |
| :--- | :--- | :--- |
| Fees that rise with volatility | Arbitrage pays more when your quote is most likely stale | Wide fees also push ordinary traders to other pools |
| Auctioning the right to trade first | The winner pays for that right, and the proceeds go to depositors [7] | Needs auction infrastructure and a manager role |
| Quoting around an outside price | The pool no longer waits to be traded against | You now depend on a price feed, and feeds can be manipulated |
| Batching trades | Everyone in a batch clears at one price, so being first is worth little [8] | Execution moves off the curve, and needs real competition between solvers |

Uniswap v4 makes the first option programmable. A pool can be created with a dynamic fee, and code attached to it — a hook — can set that fee for each swap [9]. That lets a pool price volatility instead of fixing a tier at launch. See [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).

## How to measure it on a position you hold

- **Line the prices up.** Pull minute-by-minute prices from a deep exchange and match them against your pool's swap events.
- **Separate the traders from the bots.** [EigenPhi](https://eigenphi.io) labels arbitrage and sandwich trades. If arbitrage is most of the volume, your fee income and your LVR are rising together.
- **Compare against the rebalancing benchmark.** [Dune Analytics](https://dune.com) hosts dashboards for major pools. Check how often each one assumes the benchmark rebalances, because that choice drives the answer.
- **Read your tracker for what it measures.** [Revert Finance](https://revert.finance) shows your result against holding: fees minus impermanent loss. Over many weeks with no clear trend, the impermanent-loss part should average out close to LVR.

Real data shows why this matters. A study of 17 large Uniswap v3 pools found \$199.3m in fees against \$260.1m of impermanent loss from launch to its cut-off date. Measured against holding, those providers were \$60.8m behind in aggregate [10].

The quick version: annualise the fee yield you actually earned, estimate LVR from trailing volatility, and look for a margin wide enough to survive an error in your volatility estimate. If fees do not clear it, you are being paid less for providing liquidity than the liquidity costs you.

## What to check before you add capital

1. **Estimate LVR over two windows**, seven days and thirty. A single trailing number hides regime changes.
2. **Check the fee tier clears it at realistic volume**, not at last week's spike. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).
3. **Find out whether the pool has an adaptive fee**, and read exactly what that code is allowed to do.
4. **Track the arbitrage share monthly.** A rising share with flat fee income means the position is getting worse.
5. **Know what hedging does and does not do.** A delta hedge removes the price bet. A fully hedged position earns fees minus LVR, which is exactly why LVR is the hurdle [1].
6. **Re-run the numbers when a reward programme starts or ends.** Both change how much liquidity competes with you, and so your share of every fee.

## Where to go next

LVR does not make providing liquidity pointless. It turns it into a trade with a known hurdle, which is more useful than a yield with no cost attached. Price the fee side with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), and keep the endpoint view from [The Impermanent Loss Formula](/guides/impermanent-loss-formula/) for comparisons against holding.

## References

1. [Automated Market Making and Loss-Versus-Rebalancing (Milionis, Moallemi, Roughgarden & Zhang, 2022)](https://arxiv.org/abs/2208.06046)
2. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis, Moallemi & Roughgarden, 2023)](https://arxiv.org/abs/2305.14604)
4. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)](https://arxiv.org/abs/1904.05234)
5. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
6. [The Paradox Of Just-in-Time Liquidity in Decentralized Exchanges: More Providers Can Sometimes Mean Less Liquidity (Capponi, Jia & Zhu, 2023)](https://arxiv.org/abs/2311.18164)
7. [am-AMM: An Auction-Managed Automated Market Maker (Adams et al., 2024)](https://arxiv.org/abs/2403.03367)
8. [Arbitrageurs' profits, LVR, and sandwich attacks: batch trading as an AMM design response (Canidio & Fritsch, 2023)](https://arxiv.org/abs/2307.02074)
9. [Uniswap v4 Core (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
10. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)

[1]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis, Moallemi, Roughgarden & Zhang, 2022)"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core (Adams et al., 2021)"
[3]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis, Moallemi & Roughgarden, 2023)"
[4]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)"
[5]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[6]: https://arxiv.org/abs/2311.18164 "The Paradox Of Just-in-Time Liquidity in Decentralized Exchanges: More Providers Can Sometimes Mean Less Liquidity (Capponi, Jia & Zhu, 2023)"
[7]: https://arxiv.org/abs/2403.03367 "am-AMM: An Auction-Managed Automated Market Maker (Adams et al., 2024)"
[8]: https://arxiv.org/abs/2307.02074 "Arbitrageurs' profits, LVR, and sandwich attacks: batch trading as an AMM design response (Canidio & Fritsch, 2023)"
[9]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core (Adams et al., 2024)"
[10]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
