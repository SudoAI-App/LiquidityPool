---
title: "Gas Costs for Liquidity Providers: The Minimum Viable Position"
description: "Gas does not scale with your position, so it decides which strategies you can even use. One table tells you whether yours is viable before you deposit."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
keywords: "gas fees providing liquidity, LP gas costs, minimum liquidity position size, rebalancing cost, liquidity pool withdrawal risk, cost of providing liquidity"
featured: false
faq:
  - q: "How much gas does providing liquidity cost?"
    a: "It depends on the network and the operation. A full cycle on a concentrated position involves approvals, a mint, one or more fee collections, any rebalances, and a withdrawal. On a congested layer one that can total a meaningful share of a small position; on a layer two it is usually negligible."
  - q: "What is the minimum size for a liquidity position?"
    a: "The size at which the full round trip of gas is a small fraction of expected fee income over your intended holding period. A practical test: if one rebalance costs more than a week of expected fees, the position is too small for the strategy you have chosen."
  - q: "Does rebalancing a position cost more than it earns?"
    a: "Frequently, on small positions. Each re-centre pays gas, realises the current composition, and may incur price impact on a swap. The fee income from the new range has to clear all three before rebalancing is worth doing."
  - q: "How do I reduce gas costs as a liquidity provider?"
    a: "Use wider ranges so rebalancing is rare, batch collections rather than claiming frequently, prefer networks with cheaper execution for smaller positions, and avoid strategies whose economics depend on frequent transactions at a size that cannot support them."
---

Gas costs the same whether you deposit \$500 or \$500,000. That one fact decides which strategies are available to you, and it never appears in a yield quote.

It is also why two people running identical ranges on the same pair can get opposite results. One was large enough to absorb the transactions. The other was not.

The arithmetic takes two minutes. Do it before the first deposit rather than after the third rebalance.

<figure class="article-figure">
  <img src="/images/guides/lp-gas-costs.webp" alt="Bars showing round-trip gas cost as a share of annual fee income across five position sizes." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same management cadence across five position sizes, expressed as a share of a year of fee income. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"We keep one number on the sheet: the cost of a management cycle, divided by expected weekly fees. Above one, the strategy is paying the network instead of the mandate. It rejects proposals in ten seconds that otherwise look perfectly reasonable on a page of annualised yields."*

## Every transaction a position needs

More than people expect.

| What | When | Note |
| :--- | :--- | :--- |
| Approvals | Before your first deposit | Signature-based approvals reduce this, they do not remove it |
| An entry swap | When you do not hold the right ratio | Costs a fee and moves the rate, as well as gas |
| Minting | Opening the position | More expensive when your range crosses fresh price steps |
| Collecting | Every time you claim fees | A separate transaction from withdrawing |
| Rebalancing | Every re-centre | A burn plus a mint, often plus a swap |
| Exiting | Closing | Plus one final collection |

A passive full-range position uses three of those. An actively managed narrow band can use all of them several times a month.

## The table that decides it

$$
T = \frac{n \times g}{R}
$$

Where:

- $n$ is how many transactions your cycle needs.
- $g$ is what one transaction costs.
- $R$ is your expected daily fee income.
- $T$ is how many days of fees that cycle consumes.

What one transaction costs depends heavily on where you are and when.

| Where | Rough cost of a liquidity transaction |
| :--- | :--- |
| Ethereum mainnet, quiet hours | Under a dollar to a few dollars |
| Ethereum mainnet, a busy day | Tens of dollars |
| A major rollup | Cents |
| Solana | A fraction of a cent, plus a small refundable account deposit |

Plan against the busy figure for whichever network you use, because the days you most want to act are the days fees spike.

Say gas averages \$14, your cycle is five transactions, and you expect a 25% annual gross yield.

| Your position | Daily fees | Cost of one cycle | Days of fees it eats |
| ---: | ---: | ---: | ---: |
| \$500 | \$0.34 | \$70 | 205 |
| \$2,000 | \$1.37 | \$70 | 51 |
| \$10,000 | \$6.85 | \$70 | 10 |
| \$50,000 | \$34.25 | \$70 | 2 |

The first two rows are not marginal. They are strategies that cannot work at all. The third works with a slow cadence. Only the fourth supports active management with room to spare.

If your position sits in one of the top rows, you have three honest options. Add capital until a cycle costs a few days of fees at most. Cut the plan to one or two transactions a quarter. Or move to a network where the same cycle costs cents. Anything else is paying the network for the privilege of watching a chart.

The same arithmetic runs in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), which puts gas straight into the net figure.

## Rebalancing is the expensive habit

Re-centring is not just gas. Each one does three things:

1. **Locks in where you are.** An unrealised divergence becomes a realised one.
2. **Pays a swap fee, and moves the rate against you,** if what you withdrew does not match the new range.
3. **Restarts the clock** in a band where the competing liquidity may be denser than where you were.

That is why chasing the price with frequent re-centres tends to lose to a wider band left alone. The question is always whether the new range's fees clear all three costs over the time you expect to hold it. See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

## Network choice changes what strategies exist

Execution costs differ by orders of magnitude, and that does not just shrink a cost line. It changes what is possible.

| | Expensive network | Cheap network |
| :--- | :--- | :--- |
| What works | Large positions, wide bands, rare management | Narrow bands and frequent moves, at retail size |
| What does not | Narrow bands below institutional size | Nothing, on cost grounds |
| The catch | Everything costs | Usually much thinner volume, so lower fees per dollar |

The comparison is never gas alone. A cheap network with a fifth of the volume can still net out worse than an expensive one, which is why both numbers belong in the same calculation. Spreading liquidity across networks also thins depth everywhere, covered in [Cross-Chain Liquidity Explained](/guides/cross-chain-liquidity-explained/).

## Three costs that behave exactly like gas

They scale with transaction count rather than position size, so they belong in the same budget.

- **Entry and exit costs.** Price impact — the way your own order moves the rate — plus slippage, the gap between the quote and the fill. Getting into the ratio and unwinding both consume depth. See [Slippage and Price Impact](/guides/slippage-and-price-impact/).
- **Harvest-and-sell cycles for reward tokens.** Weekly claiming and selling costs gas every time, plus impact on a thin market.
- **Failed transactions.** A reverted mint or swap still pays. On volatile pairs with tight settings this is recurring, not exceptional.

## The compounding threshold, worked

Auto-compounding sounds free and is not.

Compounding turns a 20% annual rate into about 22% if done daily. So the gain is roughly two points of your position per year. On a \$3,000 position that is \$60.

Doing it 365 times at \$14 each costs \$5,110.

The break-even is where the gain exceeds the cost. At a 20% rate compounded daily on an expensive network, that is a position around \$250,000. Much smaller at weekly cadence, and far smaller again on a cheap network.

Vaults solve this by pooling many depositors and harvesting once for everybody. That is a genuine service, worth its performance fee, and a real reason to prefer one to doing it yourself at small size.

The same logic applies to claiming generally. Claim when the amount is a large multiple of the transaction cost, not on a calendar.

## What people get wrong about gas

| What people assume | What actually happens |
| :--- | :--- |
| Gas is a small percentage | It is a fixed amount. On a small position it is the whole return |
| Compounding is free money | Two points a year against a fixed cost per harvest. Do the sum |
| A cheap network is always better | Cheap execution with thin volume can still net out worse |
| Rebalancing protects the position | It locks in where you are and restarts the clock somewhere more crowded |

## Six ways to reduce the bill

- **Widen the range** so you rarely rebalance. Lower fee density often beats the gas a tight band would have burned.
- **Batch your claims** on accrued value, not on habit.
- **Prefer one larger position** to several small ones on the same pair. Gas is per transaction, not per dollar.
- **Pick the network for the strategy**, not the strategy for the network.
- **Do not auto-compound at small size.** The gain is a percentage, the cost is fixed, and below a threshold it is negative.
- **Use range orders rather than repeated market entries** when adjustments are not urgent.

## Before you commit

1. **Count the transactions** your strategy needs in a month. Honestly.
2. **Multiply by current gas** on the network you will use.
3. **Divide by expected monthly fees** at your size.
4. **If that is more than about a fifth, reject the strategy.** Change the structure, not the pair.
5. **Add expected entry and exit impact** to the same budget.
6. **Redo it when conditions change.** Gas is not a constant.

Fee yield is quoted as a percentage. Gas is charged as a fixed amount. Everything difficult about small liquidity positions follows from that mismatch.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Gas and fees (Ethereum Foundation)](https://ethereum.org/en/developers/docs/gas/)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://ethereum.org/en/developers/docs/gas/ "Gas and fees"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
