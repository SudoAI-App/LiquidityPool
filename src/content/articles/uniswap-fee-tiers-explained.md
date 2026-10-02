---
title: "Uniswap Fee Tiers Explained: Choosing 1, 5, 30, or 100 bps"
description: "The tier with the biggest number usually earns the least. Why routers decide your income, and how to pick a tier from measured volume rather than instinct."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "Uniswap fee tiers explained"
keywords: "Uniswap fee tiers explained, pool fee tier, what is a pool fee tier, liquidity pool fees explained, dynamic fees, who pays liquidity pool fees"
featured: false
faq:
  - q: "What are the Uniswap fee tiers?"
    a: "Uniswap v3 launched with 5, 30 and 100 basis point tiers, and governance later added a 1 basis point tier for pegged pairs. Each tier is a separate pool with its own liquidity and its own tick spacing. Uniswap v4 drops the fixed menu: a pool creator can set any static fee, or a dynamic fee managed by a hook."
  - q: "Which fee tier should a liquidity provider choose?"
    a: "The tier where the fee you receive, times the volume actually routed to that pool, times your share of its active liquidity, is highest, and where that income still covers what arbitrage takes from the pair. Pegged pairs concentrate in the lowest tiers because traders choose on price; volatile and thin pairs need higher tiers to cover larger arbitrage losses."
  - q: "Who pays liquidity pool fees?"
    a: "The trader pays the fee on each swap, and it accrues to the liquidity that was in range for that swap, in proportion to each position's share of active liquidity. On pools where Uniswap's protocol fee is switched on, part of it goes to the protocol first. In tick-based pools the providers' part is tracked through fee growth accumulators rather than being added back to reserves."
  - q: "Is a higher fee tier always better for LPs?"
    a: "No. Aggregators route to the cheapest executable path, so a higher tier usually receives less volume. Revenue is the product of the fee and the volume you capture, and for a given pair that product can peak at any tier, depending on where volume and competing liquidity sit."
---

Picking a fee tier feels like picking a yield. It works more like bidding for business. Routers compare every pool for a pair and send each trade to whichever fills it best.

Raise the tier and you earn more per trade but are shown fewer trades. The right answer is whichever combination brings in the most money, and that depends on the pair.

By the end you will be able to estimate, from measured data, which tier would have paid your deposit the most.

<figure class="article-figure">
  <img src="/images/guides/uniswap-fee-tiers-explained.webp" alt="Four fee tiers with the pairs that usually sit in each and where each tier tends to win order flow." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee tiers, the pairs that cluster in each, and the conditions under which each one wins flow. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> People pick the 30 basis point pool — a basis point is a hundredth of a percent, so 0.30% — because the number is bigger, then see the fee counter barely move. Before you deposit, look at where aggregators actually route the pair. On major pairs most volume usually goes to the cheapest tier that has real depth, and the higher tiers see what is left.

## How the fee reaches you

The fee comes off the trader's input and is credited to whichever liquidity was active for that swap [1]. The contract tracks it with running totals per unit of liquidity, plus a snapshot at each initialized price step, so your position can work out what it is owed.

One detail catches people out. Those fees sit as a claimable balance. They are not added back into your position, so they earn nothing until you collect them and put them back to work yourself [6].

The bigger structural point: **each tier is a completely separate pool** [1]. ETH against dollars at 0.05% and at 0.30% are different pools with different money in them. Arbitrage keeps their prices aligned, so the cheaper, deeper pool usually sets the price and the others fill what it cannot absorb as cheaply. The pools underneath are covered from the ground up in [Uniswap Liquidity Pools](/guides/uniswap-liquidity-pools/).

On v3, tick spacing is tied to the tier [1]. A tick is one price step of 0.01%, and spacing is how many ticks apart your range edges may sit. Cheaper tiers allow finer steps, which suits pairs that barely move. The 1% tier only allows edges about 2% apart, which can rule out a tight range your strategy assumed. On v4, the pool creator chooses tick spacing separately from the fee [2].

## Why volume clusters where it does

| Tier | What usually lives there | Why the volume goes there |
| :--- | :--- | :--- |
| 0.01% | Fiat stablecoins, pegged staked-ETH tokens | The price barely moves, so the fee is most of the cost of trading. Cheapest wins [3] |
| 0.05% | ETH against dollars, BTC against ETH | Deep enough that price impact is small, so the fee decides close calls |
| 0.30% | Mid-cap and volatile pairs | Few providers will supply at 0.05%, so traders have no cheaper option with depth |
| 1.00% | Thin, newly launched, or long-tail pairs | The only fee high enough to cover holding a token that can jump in price |

The 1 basis point tier was added by governance in 2021 to compete for stablecoin pairs. The proposal's reasoning was that on such pairs, the fee itself is what decides where volume goes [3].

The wider pattern is a balance rather than a convention. Providers supply the lowest tier where fees still cover what the pair costs them, and traders route to the cheapest pool that can fill them. Stable pairs settle at the bottom, thin ones at the top, and mid-caps split according to how volatile they actually are.

The cost side of that balance is loss-versus-rebalancing — the value arbitrage traders take because a pool's price trails the wider market [4]. Higher fees reduce it, because small mispricings stop being worth correcting [7]. They also let the pool's price drift further from the market before anyone trades, which is the other side of the tradeoff [5]. That tradeoff is covered in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).

## The arithmetic that decides it

Your daily income from a tier is the fee rate, times the volume that tier actually receives, times your share of the liquidity there.

$$
R = f \times V_f \times s_f
$$

Where:

- $R$ is your daily fee income from that tier.
- $f$ is the fee providers receive in that tier.
- $V_f$ is the daily volume routed to that specific tier.
- $s_f$ is your share of the liquidity working there.

The tier changes all three, and not in the same direction. Here is the same \$100,000 on a mid-cap pair, with all of it in range, using the headline fee before any protocol fee:

| Tier | Volume to that tier | Total liquidity there, including yours | Your share | Daily fees |
| ---: | ---: | ---: | ---: | ---: |
| 0.05% | \$12,000,000 | \$9,000,000 | 1.11% | \$67 |
| 0.30% | \$300,000 | \$1,200,000 | 8.33% | \$75 |
| 1.00% | \$40,000 | \$250,000 | 40.00% | \$160 |

The expensive tier wins here, and not because the fee is large. It wins because little other liquidity is there, so you own 40% of a small pot rather than 1% of a big one.

Change the volume split and the answer can flip. That is why this decision has to come from measured routing data for your pair, not from a rule of thumb. See [Liquidity Provider Fees](/guides/liquidity-provider-fees/) and [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

Use the providers' share for $f$, not the headline fee. Since December 2025, Uniswap's protocol fee is switched on for selected v3 pools [6]. On those pools providers receive 0.0375% of a 0.05% fee, 0.25% of a 0.30% fee, and 0.8334% of a 1% fee.

## Fees that move on their own

Uniswap v4 lets a pool be created with a dynamic fee, which its hook can update per swap or on a schedule [2] [6].

The idea is sound. Charge more when the pool's price is most likely to be stale, which is when arbitrage is repricing it. Charge less when markets are calm and the flow is mostly ordinary traders.

For you, two things change. Your income starts to rise in the conditions that cost you money, which narrows the gap between what you earn and what you lose. In exchange, you now have to read the code: what sets the fee, how high and low it can go, and who can change the settings.

A moving fee also changes the pool's place in the routing table from block to block. In calm conditions it may undercut a fixed 0.30% pool and take its business. During a sharp repricing it may price itself out on purpose, which is the point of the design.

So the income is lumpier. A week of observation tells you less than it would for a fixed tier. Ask for the distribution of the fee, not just the average. A fee that sits at its floor and spikes occasionally behaves very differently from one sitting near its ceiling.

## When the right tier changes

The best tier today may not be the best tier next quarter. Four things move it, and each has a sign you can watch for.

| What happens | What it does to you | What to do |
| :--- | :--- | :--- |
| A reward programme starts on one tier | Liquidity floods in and your share of every fee falls | Re-run the arithmetic within days, not at quarter end |
| The pair's volatility doubles | Arbitrage losses roughly quadruple, and the cheap tier may stop covering them [4] | Consider moving up a tier, or widening your band |
| A large depositor joins your band | Your share can halve overnight | Check your share weekly, not just the pool total |
| Routers add a new pool for the pair | Volume shifts without your pool changing at all | Track volume routed to your pool, not the pair total |

Moving tiers is not free. You withdraw from one pool and mint in another, and each transaction pays gas at that moment's price [8]. Move when the measured gap in income repays that cost within your holding period.

## How to pick

1. **Pull 30 days of volume by tier**, for that exact pair. Not the pair's total.
2. **Measure the liquidity already in the band you want**, in each candidate tier.
3. **Run the arithmetic for each one**: providers' fee, times routed volume, times your projected share.
4. **Check the winner clears the volatility hurdle.** A tier whose income cannot cover the pair's arbitrage losses should be rejected, whatever its rank in the table [4].
5. **Check the tick spacing** allows the range width your strategy needs [1].
6. **On v4, read the hook** and find what sets the fee and within what bounds [2].
7. **Re-check quarterly.** Routing shifts when reward programmes start, new pools launch, or volatility changes.

The tier that pays best is rarely the one with the biggest number. It is the one where the least competing liquidity meets the most volume that has nowhere cheaper to go.

## Test a tier before you commit

Run each candidate through the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/#feeTier=0.05&capital=50000&volume=20000000&liquidity=2500000). Then check it against impermanent loss — how far a pool position falls behind simply holding the tokens — in [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/). If you are weighing a v4 pool with a moving fee, read [Dynamic Fees in AMMs](/guides/dynamic-fees-in-amms/) first.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Proposal - Add 1 Basis Point Fee Tier (Uniswap Governance, 2021)](https://gov.uniswap.org/t/proposal-add-1-basis-point-fee-tier/14745)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
6. [Fees | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/fees)
7. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)](https://arxiv.org/abs/2305.14604)
8. [Ethereum gas and fees: technical overview | ethereum.org](https://ethereum.org/en/developers/docs/gas/)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://gov.uniswap.org/t/proposal-add-1-basis-point-fee-tier/14745 "Proposal - Add 1 Basis Point Fee Tier (Uniswap Governance)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[6]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees | Uniswap Developers"
[7]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)"
[8]: https://ethereum.org/en/developers/docs/gas/ "Ethereum gas and fees: technical overview | ethereum.org"
