---
title: "Out-of-Range Liquidity: Why an LP Position Stops Earning Fees"
description: "Why a Uniswap v3 position stops earning fees when price exits its range, what inventory you are left holding, and how to decide between waiting and re-minting."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-09-10"
author: "Dr. Elena Rostova"
readTime: "12 min read"
keywords: "out of range liquidity, out of range position Uniswap v3, liquidity position not earning fees, liquidity range, concentrated liquidity risk, rebalancing cost"
featured: true
faq:
  - q: "Why is my Uniswap v3 liquidity position not earning fees?"
    a: "Almost always because the spot price has moved outside the range you selected. A concentrated position is only quoted to traders while price sits between your lower and upper bounds. Outside that interval the position holds a single asset, contributes no executable depth, and accrues no share of fee growth."
  - q: "What happens when liquidity goes out of range?"
    a: "The position converts fully into one of the two assets: entirely the quote asset if price rose through your upper bound, entirely the base asset if price fell through the lower bound. The tokens are not locked or lost, but they stop earning until price returns to the range or you withdraw and re-mint around the current price."
  - q: "Should I rebalance an out-of-range position?"
    a: "Only when the expected fee income from the new range clears the cost of exiting, swapping and re-minting, plus the divergence you realise by rebalancing. In choppy, mean-reverting markets waiting is often cheaper than paying gas to chase price; in a structural repricing, waiting simply extends the period of zero income."
  - q: "Do out-of-range positions still carry price risk?"
    a: "Yes, and it is concentrated. An out-of-range position holds 100% of one asset, so it takes the full directional exposure of that asset with none of the fee income that compensated you for holding it."
  - q: "Why am I not earning fees on Uniswap v3?"
    a: "Because the pool's current tick is outside your position's bounds. A concentrated position is only quoted to traders while price sits inside its range, so outside it the position holds one asset and accrues no share of fee growth."
  - q: "What happens when liquidity is out of range?"
    a: "The position converts fully into one of the two assets, keeps the full price exposure of that asset, and stops earning until price returns to the range or you withdraw and re-mint around the current price."
---

A concentrated liquidity position earns nothing the moment the market trades outside the interval it was minted into. The capital is not lost, not locked, and not at any greater smart-contract risk than before; it is simply no longer part of the quote. This is the most common support question in liquidity provision, and it is a mechanical consequence of how tick-based automated market makers allocate depth.

The trade-off is explicit at deposit time: narrowing a range multiplies fee capture per dollar deployed and simultaneously raises the probability that the position spends part of its life idle. Getting that trade-off right requires understanding exactly what happens at the boundary tick.

<figure class="article-figure">
  <img src="/images/guides/out-of-range-liquidity.webp" alt="Price axis showing an in-range liquidity band earning fees and out-of-range zones holding idle inventory." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee accrual is a step function of price: full participation inside the interval, zero outside it. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"The costly mistake is not going out of range. It is treating the boundary as an accident rather than as the outcome you priced when you chose the width. If you mint a ±3% band on a pair with 80% annualised volatility, the position is designed to exit range within days. That is a legitimate strategy only if the fee density inside the band pays for the round trip, and most LPs never compute that number before signing."*

## 1. What the Contract Does at the Boundary Tick

In a tick-based automated market maker, a position is defined by a liquidity amount $L$ and two boundary prices $[p_a, p_b]$. Inside the interval the position holds both assets and the reserves satisfy the translated constant-product invariant introduced in Uniswap v3 [1]:

$$\left(x + \frac{L}{\sqrt{p_b}}\right)\left(y + L\sqrt{p_a}\right) = L^2$$

Real reserves are derived from the current price $P$:

$$x = L\left(\frac{1}{\sqrt{P}} - \frac{1}{\sqrt{p_b}}\right), \qquad y = L\left(\sqrt{P} - \sqrt{p_a}\right)$$

Read those two expressions at the boundaries. When $P \to p_b$, the $x$ term collapses to zero and the position is entirely $y$, the quote asset. When $P \to p_a$, the $y$ term collapses and the position is entirely $x$, the base asset. Crossing the boundary is therefore not a discrete event that the LP must respond to; it is the endpoint of a continuous inventory rotation the invariant has been performing the whole time.

The fee consequence is discrete, though. Fee growth accumulators are tracked per tick, and a position accrues fees only over the blocks in which the active tick sits inside its interval [1]. Once the pool's active tick moves past $p_b$, the swap router walks to the next initialised tick that has liquidity, and your position is not part of the depth being consumed. Fees already earned remain claimable; new fees stop.

For the underlying range mathematics and why capital efficiency and range width are two sides of the same number, read [Concentrated Liquidity Explained: Range, Capital Efficiency, and Risk](/guides/concentrated-liquidity-explained/).

---

## 2. A Numerical Walkthrough of a Boundary Exit

Consider a position on ETH/USDC opened with \$20,000 at a spot price of 2,500 USDC per ETH, with bounds of 2,375 and 2,625 (a ±5% band) at the 5 bps fee tier.

| Stage | Spot price | Position composition | Approximate value | Fee accrual |
| :--- | ---: | :--- | ---: | :--- |
| Mint | 2,500 | 4.00 ETH + 10,000 USDC | \$20,000 | Active |
| Drift up | 2,560 | 3.11 ETH + 12,120 USDC | \$20,082 | Active |
| Boundary | 2,625 | 0.00 ETH + 20,395 USDC | \$20,395 | Stops at $p_b$ |
| Trend continues | 2,900 | 0.00 ETH + 20,395 USDC | \$20,395 | Zero |

Two facts matter in that last row. First, the position's dollar value stopped tracking ETH the instant it converted, which is favourable in a drawdown and costly in a rally. Against a 50/50 hold of the original basket, the position gives up the appreciation on the 4 ETH it sold on the way up. Second, every block spent above 2,625 is a block of zero revenue on \$20,395 of deployed capital.

At the 5 bps tier with, say, \$8m of daily volume against \$4m of active liquidity in that band, the in-range position was earning roughly \$20 per day. Ten days out of range is \$200 of foregone income, plus whatever the divergence against holding turns out to be. Compare that with the cost of rebalancing, which is not just gas: closing and re-minting realises the current composition and pays swap fees and price impact on the rebalancing trade itself.

The mechanics of that decision are covered further in [Range Orders on AMMs: Using Price Boundaries Deliberately](/guides/range-orders-on-amms/).

---

## 3. Measuring How Much Time Your Capital Actually Works

The metric that decides whether a range width was sensible is *time in range*, and it can only be measured after the fact against realised volatility.

- **Position-level accounting**: [Revert Finance](https://revert.finance) reconstructs the full history of a position, showing time in range, fees collected, and net performance against a hold benchmark. This is the fastest way to check whether narrow ranges have actually outperformed for your pairs.
- **Tick distribution**: A [Dune Analytics](https://dune.com) query on the pool's tick bitmap shows where competing liquidity is concentrated. If your interval overlaps a crowded band, your share of fee growth is diluted even while in range.
- **Realised volatility**: Compare the width of your band to trailing realised volatility on the pair. A band narrower than one daily standard deviation will exit range routinely.
- **Fee-to-TVL efficiency**: [DeFiLlama](https://defillama.com) publishes pool-level fee and TVL series, which gives a sanity check on whether the pool as a whole generates enough fee revenue to justify active management.

A practical rule for the arithmetic: expected daily revenue equals fee tier multiplied by volume routed through your band multiplied by your share of the liquidity in that band, multiplied by the fraction of the day the price spends inside it. Three of those four terms are outside your control. The fourth, the range width, is the only lever the LP actually sets.

---

## 4. Common Misconceptions About Out-of-Range Positions

| Assumption | What the contract does | Operational consequence |
| :--- | :--- | :--- |
| "My funds are stuck." | Withdrawal is permissionless in any block, at the current composition. | You can exit at any time; the constraint is the price you exit at, not access. |
| "I lost my tokens." | The invariant converted them along the curve as price moved. | The loss, if any, is measured against holding, not against the token count. |
| "Being out of range removes risk." | The position holds 100% of one asset with no fee income. | Exposure is more concentrated than at mint, not less. |
| "I should always re-centre immediately." | Re-minting realises the current composition and pays gas plus swap costs. | In mean-reverting markets, waiting often beats chasing price. |
| "A wide range makes the problem disappear." | Width trades range risk for fee dilution across more ticks. | You earn less per dollar for the same volume; the risk is repriced, not removed. |

Uniswap's own risk documentation lists out-of-range positions alongside impermanent loss and contract risk precisely because it is a structural property of range-based provision, not an edge case [3].

---

## 5. A Diagnostic Sequence When Fees Stop Accruing

1. **Confirm the position is actually out of range.** Compare the pool's current tick to your bounds in the position interface or directly on the pool contract. If price is inside the range and fees are still flat, the cause is volume, not range.
2. **If price is inside the range but revenue is negligible**, check your share of active liquidity. A large depositor minting the same interval dilutes everyone's fee growth proportionally.
3. **If price is outside the range**, classify the move. Was it a volatility spike around an event, or a repricing that has held for days across venues? Mean reversion argues for patience; a structural move argues for redeploying.
4. **Price the rebalance before executing it.** Add gas, the swap fee and price impact on the rebalancing trade, and the divergence you crystallise. Compare that total against the fee income the new range plausibly earns over your intended holding period.
5. **Check whether the pair still deserves a narrow band.** If realised volatility has doubled since you minted, the width that was appropriate last month guarantees repeated exits this month.
6. **Consider whether a passive full-range or wider position is the honest answer.** Not every LP wants an active management workload, and a wider band with lower fee density but far higher time in range can produce a better net result after gas.

For the wider evaluation framework that precedes any of this, see [How to Evaluate a Liquidity Pool: A Five-Part Research Framework](/guides/how-to-evaluate-a-liquidity-pool/) and the risk taxonomy in [Liquidity Pool Risks: A Complete Framework for LP Due Diligence](/guides/liquidity-pool-risks/).

---

## 6. Pre-Flight Checklist Before Choosing a Range

- [ ] Compute the exact token composition you will hold at both boundaries, and confirm you are willing to hold either one.
- [ ] Compare the band width to trailing 7-day and 30-day realised volatility on the pair.
- [ ] Estimate the fee income per day inside the band, using pool volume and current in-band liquidity rather than an advertised annual rate.
- [ ] Model the cost of one rebalance, including gas, swap fee and price impact, and divide the expected fee income by that cost.
- [ ] Decide the rebalancing rule in advance: a price trigger, a time trigger, or none at all.
- [ ] Set an alert at the 80th percentile of the range so a boundary exit is never a surprise discovered weeks later.

Out-of-range liquidity is not a malfunction. It is the price of the capital efficiency that made the narrow range attractive in the first place, and it should be priced at deposit time rather than diagnosed afterwards.

## Where to Go Next

Price the trade-off before you mint: expected fee income in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), and the divergence at each boundary in the [impermanent loss calculator](/tools/impermanent-loss-calculator/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
7. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[7]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
