---
title: "Uniswap v3 Ticks and Position NFTs Explained"
description: "Why your range moved from what you typed, why your fees stopped, and why your position is an NFT. Four contract details that explain most operational surprises."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Dr. Kieran Thorne"
readTime: "6 min read"
keywords: "Uniswap v3 ticks explained, tick spacing, Uniswap v3 positions NFT, LP NFT, fee growth accumulator, liquidity range Uniswap v3"
featured: false
faq:
  - q: "What is a tick in Uniswap v3?"
    a: "A tick is a discrete price point. Each tick is 1.0001 times the price of the one below it, so tick index i corresponds to a price of 1.0001 raised to the power i. Positions are defined by a lower and upper tick rather than by arbitrary prices."
  - q: "What is tick spacing?"
    a: "The interval between usable ticks in a given pool. Each fee tier has its own spacing, so a 1 basis point pool allows very fine ranges while a 100 basis point pool only allows coarse ones. Tick spacing sets the narrowest legal band you can mint."
  - q: "Why is my Uniswap position an NFT?"
    a: "Because every position carries its own price bounds, two positions on the same pair are not interchangeable. A non-fungible token records lower tick, upper tick and liquidity, which a fungible token could not express."
  - q: "How does Uniswap v3 track fees for each position?"
    a: "Through fee growth accumulators. The pool records global fee growth per unit of liquidity and per-tick snapshots, so the fees owed to any position can be computed as the difference in accumulated growth inside its range since it was minted or last collected."
  - q: "Do Uniswap v3 fees compound automatically?"
    a: "No. Fees sit outside the position as claimable balances until you collect them, and turning them into more liquidity requires a separate transaction that costs gas. Advertised annual percentage yields usually assume compounding you have to perform yourself."
---

You typed \$2,350 and the position shows \$2,344. Your fees stopped without warning. Your position is an NFT and no lending market will take it.

All three trace back to four things the contract does that no deposit screen shows you. This guide covers each one, and where it turns up when something looks wrong.

<figure class="article-figure">
  <img src="/images/guides/uniswap-v3-ticks-and-lp-nfts.webp" alt="Six cards describing ticks, tick spacing, the position NFT, fee growth accumulators, tick crossing and fee claiming." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The six internals that define what a v3 position is and what it can earn. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"When somebody says their range was rejected or their bounds moved slightly, it is always tick spacing. The contract stores whole numbers, not prices. Whatever you type gets rounded to the nearest usable one for that fee tier, and on the widest tier that rounding can be about a percent."*

## The contract stores whole numbers, not prices

Uniswap v3 does not store prices. It stores an index, and the price is worked out from it [1]:

$$
p(i) = 1.0001^{i}
$$

Where:

- $i$ is the tick index, a whole number.
- $p(i)$ is the price that index represents.

So one tick is one hundredth of a percent of price movement, and every price you could care about maps to a whole number roughly between minus 887,272 and plus 887,272.

Internally the contract works with the square root of price in a fixed-point format, because the range maths needs the square root and fixed-point arithmetic avoids drift.

Two consequences if you read pool state directly. The current price comes out as a square-root value and a tick, not as a readable number, and converting needs the same exponentiation.

## Not every price is available

Each fee tier defines a spacing, and your bounds have to land on a multiple of it [1].

| Fee tier | Spacing | Narrowest band you can mint |
| :--- | ---: | :--- |
| 0.01% | 1 | about 0.01% |
| 0.05% | 10 | about 0.1% |
| 0.30% | 60 | about 0.6% |
| 1.00% | 200 | about 2% |

The reason is gas. Crossing a step during a swap costs storage writes, so coarser spacing on volatile pairs keeps trading affordable.

The consequence for you: a strategy needing a very tight band simply cannot be expressed on a high fee tier, and whatever you type gets snapped to the nearest usable step. See [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/).

## Why your range moved

Say you enter a band from \$2,350 to \$2,650 on a 0.30% pool. With a spacing of 60, the nearest usable steps land at roughly \$2,344 and \$2,657.

That is close enough to be invisible in an interface and far enough to matter if your strategy assumed exact bounds. On a 1.00% pool, where steps are about 2% apart, the same request can round by up to about a percent in each direction.

Anyone building something systematic should compute the usable steps first and design the band around them, rather than picking round numbers and accepting whatever the contract does.

The same rounding explains why two positions that look identical on a dashboard can have slightly different edges, and therefore different time in range.

## Why your position is an NFT

Because every position has its own bounds, no two are interchangeable. So each one is recorded as an NFT holding the pool, the two bounds, the size, and a snapshot of the fee accounting at the last update [1].

Four practical consequences:

- **Transferring the NFT transfers everything**, including uncollected fees, which are computed from the snapshot rather than held as a balance.
- **Two positions with the same bounds are still two NFTs.** Adding to an existing one and minting a new one are different operations with different costs.
- **An approval on the NFT is an approval over the money.** Granting one to a management contract gives it control of the underlying liquidity. Read that carefully before signing.
- **It does not travel.** A range position cannot be used as fungible collateral, which is why vaults wrap positions rather than pooling them.

See [Liquidity Pool Tokens Explained](/guides/liquidity-pool-tokens/).

## How the contract knows what you are owed

The pool keeps a running total of fees earned per unit of liquidity, and each price step stores a snapshot of it. Your fees are the global total, minus whatever accumulated outside your range, times your size [1].

Three things you will notice:

1. **Fees accrue only while the price is inside your band.** Time outside contributes exactly nothing. See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).
2. **They do not reinvest.** They sit as an amount owed until you claim, so any quoted compounded rate assumes you do that yourself and pay gas each time.
3. **Claiming is a separate transaction from withdrawing.** That is why an interface can show a position with zero liquidity and a fee balance still attached.

## What happens when a swap crosses a step

When a swap eats all the liquidity at the current step, the pool moves to the next one, updates the fee totals, and applies the net change in liquidity recorded at that boundary [1].

That mechanism explains three things you can observe:

- **Depth changes in jumps.** It can shift abruptly as the price crosses a boundary where a large position starts or ends.
- **Large swaps cost more than the quoted price suggests**, because they cross several steps and eat progressively thinner liquidity.
- **Gas depends on how many steps a swap crosses.** The same trade during a volatile hour on a fine-spaced pool costs meaningfully more than in calm conditions.

See [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/).

## Reading your own position without trusting a dashboard

Three reads do it:

1. **The pool's current state** gives you the live price and tick. Compare it to your bounds to know whether you are in range.
2. **The position manager, by token ID**, returns your bounds, size, fee snapshots and what you are owed.
3. **The pool's data at each of your bounds** shows how much liquidity shares that boundary with you.

A worked read makes this concrete. Say the pool reports tick 77,640 and your bounds are ticks 77,520 and 77,760, on a pool with a spacing of 60. You are in range, 120 ticks from each edge, which is about 1.2% of price either way. If the pool reached tick 77,760 exactly, you would already be out of range and holding only the quote token.

Anyone running more than a handful of positions should automate those reads. A position that looks healthy on a dashboard and one that is actually accruing fees are different things.

## What people get wrong about the internals

| What people assume | What actually happens |
| :--- | :--- |
| My bounds are the numbers I typed | They snap to usable steps, by up to about a percent on the widest tier |
| Uncollected fees are safe in the position | They travel with the NFT if you transfer it. Collect first |
| Approving the NFT is like approving a token | It hands over control of the underlying money |
| The dashboard knows if I am in range | Read the pool's current tick. Interfaces cache |

## The working checklist

1. **Check the tick spacing** for your fee tier before designing a band width.
2. **Expect your bounds to move**, and check the resulting prices.
3. **Record the token ID, bounds and mint transaction** for every position.
4. **Claim on a schedule that makes sense against gas**, not every time you look.
5. **Treat any approval over the NFT as an approval over the assets.**
6. **Verify in-range status from the pool**, not from a cached figure.
7. **Collect before transferring or migrating**, so the accounting stays clean.

None of this changes the economics, which are decided by volume, volatility and band width. It changes whether you can diagnose the position accurately when the economics disappoint.

## Where to go next

Apply the tick maths to a real position in the [Uniswap v3 liquidity calculator](/tools/uniswap-v3-liquidity-calculator/). The same accounting underpins [Raydium Liquidity Pools](/guides/raydium-clmm-liquidity-guide/) on Solana.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [How Uniswap Works (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
5. [EIP-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-721)
6. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
7. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[5]: https://eips.ethereum.org/EIPS/eip-721 "EIP-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)"
[6]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[7]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
