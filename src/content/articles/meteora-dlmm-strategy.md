---
title: "Meteora DLMM Strategy: Bin Step, Shape and When Positions Stop Earning"
description: "How to choose a bin step and shape on Meteora DLMM, what the volatility accumulator does to your fee rate, and rebalancing rules for a fast Solana market."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "9 min read"
keywords: "Meteora DLMM strategy, Meteora DLMM bin step, Meteora DLMM fees, how to provide liquidity on Meteora, DLMM rebalance, Meteora DLMM impermanent loss, Solana liquidity pools, spot curve bid-ask distribution"
featured: false
faq:
  - q: "What bin step should I use on Meteora DLMM?"
    a: "Match the bin step to the pair's typical move between trades. Narrow steps of 1 to 10 basis points suit pegged and stable pairs where price barely travels; wider steps of 50 to 200 basis points suit volatile pairs where a narrow grid would be crossed constantly and would cost more in bin traversal than it captures in density."
  - q: "Which Meteora liquidity shape is best for a volatile pair?"
    a: "Spot and curve behave differently rather than one dominating. Spot spreads liquidity evenly across the chosen bins and tolerates being wrong about direction; curve concentrates around the active bin and earns more while price stays put. Bid-ask places weight at the edges and is a range-order structure, not a passive market-making one."
  - q: "Does Meteora DLMM have impermanent loss?"
    a: "Yes. Bins convert into the other asset as price crosses them, exactly as ticks do on a concentrated liquidity pool, so a directional move leaves the position holding the weaker side. The bin structure changes the granularity of the conversion, not its economics."
  - q: "What is the volatility accumulator on Meteora?"
    a: "A protocol-level counter of how many bins price has recently crossed, decaying over time. Its value raises the swap fee above the base rate during fast movement, so the fee you earn is not fixed and rises precisely when the pool is most likely to be quoting a stale price."
  - q: "When does a Meteora DLMM position stop earning?"
    a: "The moment price leaves the bins you funded. Only the active bin earns fees on a given swap, so liquidity in bins that price never reaches contributes nothing. This is the same failure as an out-of-range concentrated position, made more visible by the discrete structure."
---

Meteora chops the price axis into a row of small boxes called bins. You choose which boxes to put money in, and how much goes in each one.

That sounds like a settings screen. It is really three decisions that decide how the position behaves: how wide each box is, how many you fund, and how you spread money across them.

This guide walks you through all three, shows you what the fee rate actually does during a fast market, and gives you rebalancing rules that hold up on Solana.

<figure class="article-figure">
  <img src="/images/guides/meteora-dlmm-strategy.webp" alt="A bin grid showing spot, curve and bid-ask liquidity distributions around an active bin, with a volatility accumulator trace." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Three distribution shapes across the same bin range, and the fee response as price crosses bins. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"The bin step is a microstructure decision disguised as a settings field. Pick it narrower than the pair's typical move between trades and you pay to cross boxes that one trade would have crossed anyway. Pick it far wider and you have given up the density you came for. Start from what the pair actually does, not from a yield target."*

## What the boxes actually change

Each bin quotes exactly one price. A trade small enough to fit inside a single bin executes with no price movement at all. Price only moves when a trade empties a bin and steps to the next one.

The step between bins is fixed when the pool is created. Inside each box the pool holds an invariant — the rule a pool keeps true no matter what trades pass through it.

$$
P_{i} = P_{0}\,(1 + s)^{\,i}
$$

Where:

- $P_i$ is the price quoted by bin number $i$.
- $P_0$ is the price of the bin the pool started from.
- $s$ is the bin step, the fixed percentage gap between one box and the next.

Inside one box that rule is constant-sum, which is why a trade that fits within a box moves the price not at all.

Two consequences follow, and both matter for strategy.

**Only the active bin earns.** A swap pays fees to whatever is sitting in the box where it happens, plus any boxes it runs through. Money in boxes that price never visits earns nothing at all. The grid makes that dead capital visible box by box rather than hiding it behind a single in-range indicator.

**Crossing a box changes what you hold.** As price climbs through your bins, each one is emptied of the first token and filled with the second. That is divergence loss — the gap between what a pool position is worth and what simply holding the two tokens would have been worth — executed in steps rather than smoothly. It is the same thing as impermanent loss — the shortfall a pool position runs against simply holding. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/) and [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## How wide should each box be?

The bin step sets the resolution of your position. The question to answer is simple: how far does this pair usually travel between trades that reach you?

| Bin step | Gap per box | Suits | What goes wrong if it is mismatched |
| :--- | :--- | :--- | :--- |
| 1 bp | 0.01% | Pegged pairs, stable against stable | Any real trade crosses boxes in bulk. Cost without benefit |
| 10 bp | 0.10% | Liquid-staking pairs, tight majors | You need many boxes to cover a normal day |
| 25 bp | 0.25% | Correlated majors | A reasonable default for a liquid volatile pair |
| 80 bp | 0.80% | Volatile majors, higher-beta tokens | Coarser quotes and more price impact inside each box |
| 200 bp and up | 2.00% and up | New listings, thin long tail | Close to one big flat box, with large impact inside it |

A workable rule is to size the step near the pair's typical move between the trades that actually reach your bins. On a pair trading continuously that is small. On a thin pair with minutes between swaps it is much larger, and a fine grid there just means every trade rips through a dozen boxes.

Meteora sets the bin step and the fee parameters when a pool is created, not when you deposit [1]. So your real decision is which existing pool to join, and the table above is the screening tool for that.

## Why your fee rate is not the number on the label

The fee on a Meteora swap is the base rate plus a variable piece. The variable piece is driven by a counter of how many boxes price has crossed recently, which decays back down when things go quiet. Fast movement raises the counter, and the counter raises the fee.

$$
f_{\text{total}} = f_{\text{base}} + f_{\text{variable}}(V_a)
$$

Where:

- $f_{\text{total}}$ is what a trader actually pays on the swap.
- $f_{\text{base}}$ is the pool's fixed floor rate.
- $V_a$ is the volatility accumulator, the count of recent box crossings.

The design charges more exactly when the pool's quote is most likely to be out of date. That is when traders who already know the new price are taking the most from you. Being picked off that way is adverse selection — you trade with people who know something you do not, and you lose a little every time.

The formal measure of that cost is loss-versus-rebalancing — what a pool pays out because its quote runs a block behind the wider market [2]. A rising fee reduces it. Nothing removes it.

The operating consequence is practical. A fee rate you sampled during a calm week understates both what the position earns in a volatile one and what it gives up at the same time. Measuring fee income over one quiet window is the most common mistake on these pools. See [Dynamic Fees in AMMs](/guides/dynamic-fees-in-amms/).

## Which shape should you spread money in?

Meteora gives you three ways to distribute capital across the boxes you fund. They encode different views.

**Spot** puts the same amount in every box you selected. It is the neutral choice when you have no view on where price will sit, and it fails gracefully. If price runs to the edge of your range, you still had money working the whole way there. Use it as the default for a pair you intend to hold through movement.

**Curve** piles weight around the current price and thins toward the edges. It earns the most while price stays near where you deposited, and it converts fastest when price does not. It suits range-bound pairs and short holding periods where you will be watching.

**Bid-ask** puts weight at the outer boxes and little in the middle. This is not passive market making. It is a pair of scaled limit orders: sell into strength above, buy into weakness below. Treat it as an execution tool and size it like a trade, not like an allocation. See [Range Orders on AMMs](/guides/range-orders-on-amms/).

| Shape | Fees while price sits still | What a trend does to it | Read it as |
| :--- | :--- | :--- | :--- |
| Spot | Moderate | Even conversion across the move | Passive market making |
| Curve | High | Fast conversion, then dead capital at the edge | An active, range-bound view |
| Bid-ask | Low near the middle | Fills at the edges, as intended | Scaled limit orders |

## A position, worked all the way through

Take \$12,000 into a volatile major. A 25 bp bin step, 60 boxes covering roughly plus or minus 7.5%, spot distribution, held for 30 days.

| Line | Value |
| :--- | ---: |
| Base fee tier | 0.20% |
| Average fee actually realised, variable piece included | 0.34% |
| Volume routed through the boxes you funded | \$2,900,000 |
| Your share of the money in those boxes | 4.1% |
| Fee income | \$404 |
| Share of the month price spent inside your range | 72% |
| Divergence over the period | -\$271 |
| Solana transaction and rent costs, 14 operations | -\$3 |
| **Net against just holding the deposit** | **+\$130** |
| **Annualised** | **13.2%** |

Two things here generalise.

The variable fee added 70% on top of the base rate over a month with ordinary movement. That is the main reason Meteora pools quote differently from fixed-tier pools, and why you cannot read the base rate as your income.

Transaction costs were three dollars. That inverts the gas arithmetic that dominates small positions on expensive chains, covered in [LP Gas Costs](/guides/lp-gas-costs/). Cheap operations make frequent rebalancing genuinely feasible here, which is a real structural advantage rather than a marketing line.

## Rebalancing rules that survive a fast market

Cheap transactions tempt you into over-managing. The trigger still has to be economic.

1. **Move on a fee forecast, not on price.** Re-centre only when expected fees in the new range over your remaining horizon beat the divergence you lock in by moving, plus the cost of moving. If that does not hold, leave the position alone even while it sits at the edge.
2. **Do not chase a trend box by box.** Re-centring repeatedly into a directional move realises the conversion at every step. It is the fastest way to turn a paper loss into a real one.
3. **Widen after a volatility change, never narrow.** The instinct after getting knocked out of range is to re-centre tightly and win the yield back. What just happened told you the opposite.
4. **Claiming is a separate decision from rebalancing.** Fees accrue outside the position on Meteora, so collecting them does not mean touching your liquidity.
5. **Check the pool still gets the volume you underwrote.** Flow migrates quickly between Solana venues, and a perfectly shaped position in a pool that stopped receiving trades earns nothing.

The general framework behind the first rule is in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/).

## What people get wrong about bins

| What people assume | What actually happens |
| :--- | :--- |
| More boxes means more fees | Only the box price is standing in pays you. The rest are idle |
| The bin step is something I choose | It is fixed at pool creation. You choose which pool to join |
| The advertised fee is what I earn | The variable piece can add half again, or nothing at all |
| Bins avoid impermanent loss | They deliver the same conversion, one step at a time |
| Cheap transactions mean rebalance often | Each re-centre still locks in the loss, gas or no gas |

## What to check before you deposit

1. **The bin step against the pair's typical move** between trades, using the table above.
2. **The base and variable fee settings** for that specific pool, read from pool data rather than assumed.
3. **Thirty days of routed volume**, and whether it reached the band of boxes you plan to fund.
4. **How much money already sits in those boxes.** That is your dilution, not the pool's headline total.
5. **How much the pair moves**, and what share of the last thirty days price spent inside your proposed band.
6. **Your shape, chosen deliberately**, with spot as the default unless you hold a specific view.
7. **Contract and program risk on the venue.** See [Liquidity Pool Risks](/guides/liquidity-pool-risks/) and [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/). Both apply unchanged on Solana.

Bins change the resolution of the decision. They do not change what the decision is: whether your fee income over your horizon beats what the pricing rule does to your basket along the way.

## Where to go next

Model the divergence side in the [impermanent loss calculator](/tools/impermanent-loss-calculator/) and the fee side in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/). For the mechanism underneath, read [DLMM Explained](/guides/discretized-liquidity-dlmm-explained/). For the continuous-curve version of the same decision, read [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## References

1. [Meteora DLMM Developer Documentation](https://docs.meteora.ag/developer-guides/dlmm)
2. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
3. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
4. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
5. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
6. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://docs.meteora.ag/developer-guides/dlmm "Meteora DLMM Developer Documentation"
[2]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[3]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[4]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[5]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[6]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
