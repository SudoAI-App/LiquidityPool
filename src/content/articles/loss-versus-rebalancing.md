---
title: "Loss-Versus-Rebalancing: The LP's Real Hurdle Rate"
description: "The number your fees actually have to beat. How it differs from impermanent loss, how to work it out in ten seconds, and what pools are doing to shrink it."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "6 min read"
keywords: "loss versus rebalancing, LVR DeFi, what is LVR, adverse selection AMM, arbitrage profit LP, oracle AMM, dynamic fees"
featured: false
faq:
  - q: "What is LVR in DeFi?"
    a: "Loss-versus-rebalancing measures the value an automated market maker hands to arbitrageurs because its quote updates only when someone trades against it. It compares the pool against a benchmark portfolio that rebalances continuously at the external market price, isolating adverse selection from ordinary market movement."
  - q: "How is LVR different from impermanent loss?"
    a: "Impermanent loss compares the endpoints of a price path against holding. LVR accumulates along the path itself, so a market that round-trips to its starting price shows zero impermanent loss while still generating LVR against the rebalancing benchmark. LVR is the quantity fee income actually has to beat."
  - q: "How large is LVR in practice?"
    a: "For a constant-product pool it accrues at roughly sigma-squared over eight per unit of time, where sigma is annualised volatility. At 60% annualised volatility that is about 4.5% per year of the pooled capital, before any fee income is counted."
  - q: "Can protocols reduce LVR?"
    a: "Partially. Dynamic fees that widen with volatility, auctions that sell the right to make the first trade in a block, oracle-referenced pricing, and batch settlement all reduce the amount extractable. None removes it, because the pool is still quoting continuously against informed flow."
---

Your pool's price only changes when somebody trades against it. Everywhere else in the market, prices move continuously. That gap is somebody's business model.

Every time the real price moves first, your pool is left offering last block's terms, and whoever gets there first keeps the difference. Loss-versus-rebalancing — LVR for short, and the plain version is "what your pool pays out for quoting a block late" — measures exactly how much leaves this way [4].

It matters because it answers the question impermanent loss — the endpoint gap between a pool position and simply holding — cannot: what did market making itself cost you, separately from whether the tokens went up or down.

<figure class="article-figure">
  <img src="/images/guides/loss-versus-rebalancing.webp" alt="Three value paths over time comparing a rebalancing benchmark, pool value with LVR drag, and pool value including fee income." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>LVR is the widening gap between the pool and a benchmark that rebalances at the external price; fees close part of it. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Impermanent loss flatters you because it only ever looks at two moments in time. Price the position the way a desk would price a short options book, marking it every block against a real venue, and the truth appears. You are selling volatility at a fixed price and letting the market decide how much to deliver."*

## The comparison that defines it

The construction is deliberately simple. Imagine a second portfolio that holds exactly what your pool holds at every instant, but does its trading at the real market price rather than along the pool's curve.

Both hold the same things at the same times. So any difference between them cannot be about the market going up or down. It is entirely about how the trading happened.

That difference is LVR, and it has a short formula [4]:

$$
\ell = \frac{\sigma^2}{8}
$$

Where:

- $\sigma$ is the pair's annual volatility, so 60% means $\sigma = 0.60$.
- $\ell$ is the fraction of your position that leaves per year.

At 60% volatility that is 4.5% a year, before you count a single fee. Three things follow, and each changes a decision.

- **Direction does not matter.** You lose to arbitrage in a rally and in a crash, equally.
- **The route matters, not just the destination.** Volatility that goes out and comes back still costs you against the rebalancing benchmark, even where impermanent loss says zero.
- **Volatility is squared.** Halve how much a pair moves and the drag falls by a factor of four. Double it and the drag quadruples.

The shape of the curve changes the number too. A flat stable-pair curve loses much less while the peg holds, and far more when it breaks.

## Why the round trip is the surprising case

Take a pair that starts the week at \$2,000, runs to \$2,300, falls to \$1,750, and finishes back at \$2,000.

Impermanent loss at the endpoints is zero. Nothing moved, net. But every leg of that journey was traded against a pool quoting the previous price, and somebody kept the difference on each one.

| What the week looked like | Impermanent loss | The path cost | How it feels |
| :--- | ---: | :--- | :--- |
| Quiet, nothing moved much | 0.00% | Near zero | Fees are almost pure income |
| Up 15%, down 15%, back to flat | 0.00% | Real and material | Fee counter went up, value quietly left |
| A smooth doubling | -5.72% | Real and material | You can see the shortfall when you withdraw |
| A sharp gap on news | Large | Very large | Most of the move was arbitraged in a few blocks |

Row two is the one nobody expects. Against simply holding, that position is level, plus its fees. Against running the same exposure yourself at market prices, it is behind by the path cost, and that gap is exactly what the fees were supposed to cover. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/) for the endpoint view.

## Who is actually taking it

Not an abstraction. A specific person, winning a specific auction [5].

- **The first trade of the block.** A real exchange reprices. The first onchain transaction in the next block moves your pool to match, and whoever sent it keeps the gap.
- **The bidding war for that right.** Competition pushes most of the profit to whoever builds the block, through priority fees. That is why this money shows up in the fee market rather than in any pool statistic.
- **Fee sniping on the good trades.** Somebody mints a very tight position right before a large swap, takes the fee, and burns it immediately after. No inventory risk at all, and it dilutes you precisely on the trades most worth having.

All of it is MEV — value taken by controlling the order transactions run in. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/) and [Market Making on AMMs](/guides/market-making-on-amms/).

## Four things pools are doing about it

None of them removes the problem. Each one shrinks it, and each has a real cost.

| Mechanism | How it helps | What it costs |
| :--- | :--- | :--- |
| Fees that rise with volatility | Arbitrage pays more when your quote is most likely wrong | Wide fees push ordinary traders away too, and routers notice |
| Auctioning the first trade | The right to correct your price is sold, and the money comes back to you | Needs auction infrastructure, and adds a delay |
| Quoting around an outside price | The pool is no longer purely reactive | You now depend on a price feed, and feeds can be manipulated |
| Batching and intents | Everyone in a window clears at one price, so being first is worthless | Execution moves off the curve, and needs real competition between solvers |

Uniswap v4 makes the first one programmable. Code attached to a pool can set the fee for each individual swap, so a pool can price volatility instead of fixing a tier at launch [2]. That is a genuine structural improvement. See [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).

## What people get wrong about this

| What people assume | What actually happens |
| :--- | :--- |
| If the price comes back, I am even | Even with holding, yes, before fees. But behind a trader who ran the same exposure at market prices, by the path cost |
| High volume means the pool is good for me | If most of that volume is arbitrage, the volume is the problem, not the solution |
| A higher fee tier always earns more | Only if the volume still comes. Too high and routers send it somewhere else |
| This makes providing liquidity pointless | It makes it a trade with a known hurdle, which is far more useful than a yield with no denominator |

## How to measure it on a position you hold

- **Line the prices up.** Pull minute-by-minute prices from a deep exchange and match them against your pool's swap events.
- **Separate the traders from the bots.** [EigenPhi](https://eigenphi.io) will split arbitrage and sandwiching out from ordinary flow. If arbitrage dominates the volume, your fees and your losses are moving together.
- **Compare against the rebalancing benchmark.** [Dune Analytics](https://dune.com) hosts dashboards for major pools. Check how often the benchmark rebalances, because that assumption drives the answer.
- **Sanity check your own result.** [Revert Finance](https://revert.finance) will show your net outcome. If the gap between fees and performance is bigger than divergence alone explains, the rest is the path cost.

The quick version: annualise the fee yield you actually earned, work out the bleed from trailing volatility, and require the first to beat the second with room to spare. If it does not, you are being paid to warehouse inventory for somebody else's arbitrage desk.

## What to check before you add capital

1. **Work out the bleed over two windows**, seven days and thirty. A single trailing number hides regime changes.
2. **Check the fee tier clears it at realistic volume**, not at last Tuesday's spike. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).
3. **Find out whether the pool has an adaptive fee**, and read exactly what that code is allowed to do.
4. **Track the arbitrage share monthly.** A rising share with flat fee income means the position is decaying.
5. **On a large position, consider hedging** rather than accepting the full short-volatility exposure.
6. **Re-run the numbers whenever a reward programme starts or ends.** Both change how much liquidity is competing with you, and therefore your share of every fee.

## Where to go next

Compare the hurdle against realistic fee capture using the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), and see the endpoint view in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)](https://arxiv.org/abs/1904.05234)
6. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)](https://arxiv.org/abs/2305.14604)
7. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges"
[6]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)"
[7]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
