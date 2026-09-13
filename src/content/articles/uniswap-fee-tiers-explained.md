---
title: "Uniswap Fee Tiers Explained: Choosing 1, 5, 30, or 100 bps"
description: "The tier with the biggest number usually earns the least. Why routers decide your income, and how to pick a tier from measured volume rather than instinct."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Marcus Vance"
readTime: "6 min read"
keywords: "Uniswap fee tiers explained, pool fee tier, what is a pool fee tier, liquidity pool fees explained, dynamic fees, who pays liquidity pool fees"
featured: false
faq:
  - q: "What are the Uniswap fee tiers?"
    a: "Uniswap v3 launched with 5, 30 and 100 basis point tiers and later added a 1 basis point tier for pegged pairs. Each tier is a separate pool with its own liquidity and its own tick spacing. Uniswap v4 keeps fixed tiers and adds the option of a dynamic fee set by a hook."
  - q: "Which fee tier should a liquidity provider choose?"
    a: "The tier that maximises fee tier multiplied by the volume actually routed to it. Pegged pairs concentrate in the lowest tiers because routing is decided by price; volatile and long-tail pairs need higher tiers to compensate for adverse selection, and they retain volume because no cheaper path has depth."
  - q: "Who pays liquidity pool fees?"
    a: "The trader pays the fee on each swap, and it accrues to the liquidity that was in range for that swap, in proportion to each position's share of active liquidity. In tick-based pools it is tracked through per-position fee growth accumulators rather than being added back to reserves."
  - q: "Is a higher fee tier always better for LPs?"
    a: "No. Aggregators route to the cheapest executable path, so a higher tier usually receives less volume. Revenue is the product of tier and captured volume, and that product often peaks in the middle of the range for a given pair."
---

Picking a fee tier feels like picking a yield. It is not. It is a bid for business in a market where routers compare every path and send the trade to whichever fills best.

Raise the tier and you earn more per trade and get shown fewer trades. The right answer is whichever combination produces the most money, and that depends entirely on the pair.

This guide explains how the fee actually reaches you, why volume clusters where it does, and how to work out the right tier from measured data.

<figure class="article-figure">
  <img src="/images/guides/uniswap-fee-tiers-explained.webp" alt="Four fee tiers with the pairs that usually sit in each and where each tier tends to win order flow." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee tiers, the pairs that cluster in each, and the conditions under which each one wins flow. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"People pick the 30 basis point pool — that is 0.30% — because the number is bigger, then wonder why the fee counter barely moves. Look at where the aggregator actually routes before you deposit. On major pairs almost everything clears through the cheapest tier with real depth, and the expensive tier is left holding the trades nobody wanted."*

## How the fee reaches you

The fee comes off the trader's input and goes to whichever liquidity was live for that swap [1]. The contract tracks it with running totals per price step, so your position can work out what it is owed.

One detail catches people out. Those fees sit as a claimable balance. They are not added back into your position, so they earn nothing until you collect them and put them back to work yourself.

The bigger structural point: **each tier is a completely separate pool.** ETH against dollars at 0.05% and at 0.30% are different contracts with different money in them. Arbitrage keeps their prices aligned, which means the cheap one sets the reference and the expensive one only sees what the cheap one could not absorb.

Tick spacing is tied to the tier too. Cheaper tiers allow finer price steps, suitable for pairs that barely move. Expensive tiers use coarser ones.

## Why volume clusters where it does

| Tier | What lives there | Why the volume goes there |
| :--- | :--- | :--- |
| 0.01% | Fiat stablecoins, pegged staked-ETH tokens | The price barely moves, so the fee is almost the entire cost. Cheapest wins |
| 0.05% | ETH against dollars, BTC against ETH | Deep enough that impact is small, so the fee is the tiebreaker |
| 0.30% | Mid-cap and volatile pairs | Nobody will supply at 0.05%, and traders have no cheaper option with depth |
| 1.00% | Long-tail, thin, newly launched | The only compensation available for holding something that can gap |

That pattern is not a convention. It is an equilibrium. Providers supply the lowest tier where the fees clear what the pair costs them, and traders route to the cheapest place that can fill them. Stable pairs settle at the bottom, thin ones at the top, and mid-caps split depending on how volatile they actually are.

The cost side of that balance is loss-versus-rebalancing — what a pool pays out because its quote runs a block late — covered in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).

## The arithmetic that decides it

$$
R = f \times V_f \times s_f
$$

Where:

- $f$ is the fee rate for that tier.
- $V_f$ is the daily volume routed to that specific tier.
- $s_f$ is your share of the liquidity working there.

The tier changes all three, and not in the same direction. Here is the same \$100,000 on a mid-cap pair:

| Tier | Volume to that tier | Liquidity competing | Your share | Daily fees |
| ---: | ---: | ---: | ---: | ---: |
| 0.05% | \$12,000,000 | \$9,000,000 | 1.11% | \$66 |
| 0.30% | \$300,000 | \$1,200,000 | 8.33% | \$75 |
| 1.00% | \$40,000 | \$250,000 | 40.00% | \$160 |

The expensive tier wins here, and not because the fee is large. It wins because almost nobody else is there, so you own 40% of a small pot rather than 1% of a big one.

Change the volume distribution and the answer flips completely. That is why this decision has to come from measured routing data for your specific pair, not from a rule of thumb. See [Liquidity Provider Fees](/guides/liquidity-provider-fees/) and [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

## Fees that move on their own

Uniswap v4 lets a pool hand the fee to attached code, which can set it for each individual swap [2].

The idea is sound. Charge more exactly when your quote is most likely to be wrong, which is when arbitrage is repricing you, and less when things are calm and the flow is ordinary traders.

For you, two changes follow. The good one is that your income starts correlating with the conditions that cost you money, which narrows the gap between what you earn and what you lose. The obligation is that you now have to read the code: what sets the fee, how high and low it can go, who can change the parameters, and whether the contract can be replaced.

One more consequence worth naming. A moving fee changes the pool's position in the routing table block by block. In calm conditions it may undercut a fixed 0.30% venue and take its business. During a repricing it may price itself out on purpose, which is the whole idea.

So the income is lumpier. A week of observation tells you much less than it would for a fixed tier. Ask for the distribution, not the average. A fee that sits at its floor and spikes occasionally behaves very differently from one sitting near its ceiling.

## When the right tier changes

The best tier today is not the best tier next quarter. Four things move it, and each has a tell you can watch for.

| What happens | What it does to you | What to do |
| :--- | :--- | :--- |
| A reward programme starts on one tier | Liquidity floods in and your share of every fee falls | Re-run the arithmetic within days, not at quarter end |
| The pair's volatility doubles | The cheap tier stops covering what arbitrage takes | Consider moving up a tier, or widening your band |
| A large depositor joins your band | Your share can halve overnight | Check your share weekly, not just the pool total |
| Routers add a new venue for the pair | Volume shifts without the pool changing at all | Track volume routed to your pool, not the pair total |

## What people get wrong choosing a tier

| What people assume | What actually happens |
| :--- | :--- |
| The highest tier earns most | It usually receives almost no volume. Your deposit sits there |
| The lowest tier is efficient | On a volatile pair the fees cannot cover what the pair costs you |
| My share is fixed | One large depositor minting the same band halves it overnight |
| The tiers share liquidity | They are separate pools. Money in one fills nothing in another |
| Tick spacing is a detail | A coarse spacing can prevent the tight range your strategy assumed |
| Fees compound | They sit uncollected earning nothing until you move them |

## How to pick

1. **Pull 30 days of volume by tier**, for that exact pair. Not the pair's total.
2. **Measure the liquidity already in the band you want**, in each candidate tier.
3. **Run the arithmetic for each one**: fee rate, times routed volume, times your projected share.
4. **Check the winner clears the volatility hurdle.** A tier that cannot should be rejected whatever its rank in the table.
5. **Check the tick spacing** allows the range width your strategy needs.
6. **On v4, resolve the hook** and read what sets the fee and within what bounds.
7. **Re-check quarterly.** Routing shifts when reward programmes start, new pools launch, or volatility changes regime.

The tier that pays best is rarely the one with the biggest number. It is the one where the least competing capital meets the most flow that has nowhere cheaper to go.

## Where to go next

Test each candidate with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), then check it against impermanent loss — the gap between a pool position and simply holding — in [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
6. [Fees (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/fees)
7. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
8. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[6]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees (Uniswap Developer Documentation)"
[7]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[8]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
