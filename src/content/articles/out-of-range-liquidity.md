---
title: "Out-of-Range Liquidity: Why an LP Position Stops Earning Fees"
description: "Your position stopped earning because the price left your band. What you are holding now, what waiting costs, and how to decide whether to move it."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "6 min read"
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

Your fees stopped. The position looks fine, the tokens are all there, and nothing is accruing.

Almost certainly the price has moved outside the band you chose. Your money is not stuck and nothing is broken. It is simply no longer part of what traders can trade against.

This guide explains what the contract actually did, what it costs you per day, and how to decide between waiting and moving.

<figure class="article-figure">
  <img src="/images/guides/out-of-range-liquidity.webp" alt="Price axis showing an in-range liquidity band earning fees and out-of-range zones holding idle inventory." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fee accrual is a step function of price: full participation inside the interval, zero outside it. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Going out of range is not the mistake. The mistake is treating it as an accident rather than as the outcome you chose when you set the width. Mint a 3% band on a pair that moves 80% a year and it is designed to exit within days. That is fine, if the fees inside pay for the round trip. Almost nobody works that out first."*

## What the contract actually did

Your position is defined by a size and two prices. Inside them, it holds both tokens, and how much of each depends on where the price sits [1].

$$
x = L\left(\frac{1}{\sqrt{P}} - \frac{1}{\sqrt{p_b}}\right)
$$

Where:

- $x$ is how much of the risky token you hold.
- $L$ is your position's size.
- $P$ is the current price.
- $p_b$ is the top of your band.

Read what happens at the edges. As the price rises toward the top, those two terms converge and your holding of the risky token goes to zero. You hold only the quote token. Fall to the bottom and the reverse happens.

So crossing the boundary is not an event. It is the end of a rotation the pool has been doing the whole time, one trade at a time.

The fee side, though, is a switch. Fees are tracked per price step, and you earn only during blocks when the price is inside your band [1]. Once it passes your top bound, trades walk past you to the next liquidity along, and you get nothing. Fees already earned stay yours.

See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## What it looks like in numbers

A \$20,000 position on ETH against dollars, opened at \$2,500, with bounds at \$2,375 and \$2,625. A 5% band at the 0.05% tier.

| | Price | What you hold | Worth | Earning |
| :--- | ---: | :--- | ---: | :--- |
| You mint | \$2,500 | 3.90 ETH and \$10,247 | \$20,000 | Yes |
| Drifts up | \$2,560 | 1.99 ETH and \$15,074 | \$20,176 | Yes |
| Hits the top | \$2,625 | 0 ETH and \$20,241 | \$20,241 | Stops here |
| Keeps running | \$2,900 | 0 ETH and \$20,241 | \$20,241 | No |

Two things in that last row.

**You stopped tracking ETH.** Good in a crash, painful in a rally. Against simply holding the original basket, you gave up all the appreciation on the 3.9 ETH you sold on the way up. That basket would now be worth \$21,560, and your position is still \$20,241.

**Every block above \$2,625 earns nothing** on \$20,241 of deployed money.

Put a number on the second one. At that tier, with \$8M of daily volume against \$4M of liquidity in your band, you were making about \$20 a day. Ten days out of range costs \$200 in foregone income, plus whatever the divergence turns out to be.

Now compare that to moving. It is not just gas. Closing crystallises where you are, and re-minting pays a swap fee plus price impact — the way your own rebalancing order pushes the rate against you. See [Range Orders on AMMs](/guides/range-orders-on-amms/).

## The number that tells you if your width was right

Time in range. That is it. And you can only know it after the fact, against what the pair actually did.

- **Your own history:** [Revert Finance](https://revert.finance) reconstructs a position and shows time in range, fees collected, and how it did against holding. Start here.
- **Where everyone else put their money:** [Dune Analytics](https://dune.com) shows the liquidity distribution. If your band overlaps a crowded one, your share of the fees is diluted even while you are in range.
- **How much the pair actually moves:** compare your band width to trailing volatility. Narrower than one daily move and you will exit constantly.
- **Whether the pool is worth it at all:** [DeFiLlama](https://defillama.com) publishes fees against pool size.

The arithmetic for daily income is: the fee rate, times the volume through your band, times your share of the liquidity there, times the fraction of the day the price spends inside. Three of those four are out of your hands. The width is the only one you set.

## What people get wrong about this

| What people assume | What actually happens |
| :--- | :--- |
| My funds are stuck | You can withdraw in any block. The constraint is the price you exit at, not access |
| I lost my tokens | The pool converted them along the way. The loss, if any, is measured against holding |
| Out of range means less risk | You hold 100% of one token with no fee income. More concentrated, not less |
| I should always re-centre straight away | Re-minting locks in where you are and pays gas plus swap costs. In choppy markets, waiting often wins |
| A wide band removes the problem | It swaps range risk for earning less per dollar. Repriced, not removed |

Uniswap's own risk documentation lists this alongside divergence and contract risk, because it is a structural property of range-based provision rather than an edge case [3].

## What to do when the fees stop

1. **Confirm it is actually out of range.** Compare the pool's current price to your bounds. If the price is inside and fees are still flat, your problem is volume, not range.
2. **If it is inside and earning nothing**, check your share. A large depositor minting the same band dilutes everybody proportionally.
3. **If it is outside, classify the move.** A spike around an event, or a repricing that has held for days everywhere? One argues for patience, the other does not.
4. **Price the rebalance before you do it.** Gas, plus the swap fee, plus price impact, plus the divergence you lock in. Compare that total against what the new band plausibly earns over your holding period.
5. **Ask whether this pair still deserves a narrow band.** If volatility has doubled since you minted, last month's width guarantees this month's exits.
6. **Consider that wider might be the honest answer.** Not everybody wants an active job. A wider band earning less per dollar but staying in range can net out better after gas.

See [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/) and [Liquidity Pool Risks](/guides/liquidity-pool-risks/).

## What to settle before you mint the next one

1. **Work out what you hold at both edges**, and confirm you would be happy with either.
2. **Compare the width to how the pair has actually moved** over seven and thirty days.
3. **Estimate daily income from real volume and real in-band liquidity**, not from an advertised annual rate.
4. **Cost one rebalance**, then divide expected income by it. If that ratio is small, the band is too tight for your size.
5. **Decide the rule now.** A price trigger, a time trigger, or deliberately none.
6. **Set an alert before the edge**, so you never discover this weeks later.

Out of range is not a malfunction. It is the price of the efficiency that made the narrow band attractive, and it should be worked out before you deposit rather than diagnosed afterwards.

## Where to go next

Price the trade-off before you mint: expected fees in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), and impermanent loss — the gap between the position and simply holding — at each edge in the [impermanent loss calculator](/tools/impermanent-loss-calculator/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
7. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[7]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
