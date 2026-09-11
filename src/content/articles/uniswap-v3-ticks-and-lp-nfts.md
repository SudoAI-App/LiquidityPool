---
title: "Uniswap v3 Ticks and Position NFTs Explained"
description: "How Uniswap v3 ticks, tick spacing, fee growth accumulators and the ERC-721 position NFT work, and why each one shows up in day-to-day LP operations."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Dr. Kieran Thorne"
readTime: "11 min read"
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

Every operational surprise in a Uniswap v3 position traces back to four contract-level mechanics: ticks, tick spacing, the position NFT and the fee growth accumulators. None of them are visible in the deposit interface, and all of them decide what the position can do.

This guide covers what each one is, and where it shows up when something looks wrong.

<figure class="article-figure">
  <img src="/images/guides/uniswap-v3-ticks-and-lp-nfts.webp" alt="Six cards describing ticks, tick spacing, the position NFT, fee growth accumulators, tick crossing and fee claiming." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The six internals that define what a v3 position is and what it can earn. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"When someone says their range was rejected or their bounds moved slightly from what they typed, it is always tick spacing. The contract stores integers, not prices. Anything you enter is rounded to the nearest usable tick for that fee tier, and on a 100 basis point pool that rounding can be a couple of percent."*

## 1. Prices Are Stored as Integers

Uniswap v3 does not store prices as floating-point numbers. It stores a tick index $i$, where the price is defined as [1]:

$$
p(i) = 1.0001^{i}
$$

One tick is therefore one basis point of price movement, and the whole usable range of prices maps to integers roughly between −887,272 and 887,272. Internally the contract works with the square root of price in Q64.96 fixed-point format, because the range mathematics needs $\sqrt{P}$ rather than $P$ and fixed-point arithmetic avoids rounding drift.

Two consequences follow for anyone reading pool state directly. The current price is exposed as `sqrtPriceX96` and a `tick` value, not as a human-readable number, and converting between the two requires the same exponentiation the contract uses.

---

## 2. Tick Spacing Constrains What You Can Mint

Not every tick is usable. Each fee tier defines a spacing, and positions must start and end on a multiple of it [1]:

| Fee tier | Tick spacing | Narrowest legal band |
| :--- | ---: | :--- |
| 1 bps | 1 | roughly 0.01% |
| 5 bps | 10 | roughly 0.1% |
| 30 bps | 60 | roughly 0.6% |
| 100 bps | 200 | roughly 2% |

The design reason is gas. Crossing a tick during a swap costs storage operations, so coarser spacing on volatile pairs keeps swaps affordable. The practical consequence is that a strategy requiring a very tight band cannot be expressed on a high fee tier, and any bounds you enter are snapped to the nearest usable tick.

This interacts directly with range selection, covered in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/).

---

## 3. The Position NFT

Because each position carries its own bounds, positions are not interchangeable. Uniswap v3 records each one as an ERC-721 token minted by the position manager, storing the pool key, lower tick, upper tick, liquidity, and the fee growth snapshots taken at the last update [1].

What this means in practice:

- **Transferring the NFT transfers the position**, including any uncollected fees, which are computed from the snapshots rather than held as a balance.
- **Two positions with identical bounds are separate NFTs.** Adding to an existing position and minting a new one are different operations with different gas costs.
- **Approvals matter.** Granting an approval on a position NFT to a management contract grants control of the underlying liquidity, which is a permission worth reading carefully before signing.
- **Composability is limited.** A range position cannot be used as fungible collateral the way a v2 claim can, which is why automated management vaults wrap positions rather than pooling them directly.

The full comparison of claim types is in [Liquidity Pool Tokens Explained](/guides/liquidity-pool-tokens/).

---

## 4. How Fees Are Attributed

The pool maintains a global accumulator of fees earned per unit of liquidity, and each initialised tick stores a snapshot of that accumulator. To compute the fees owed to a position, the contract takes global growth and subtracts the growth recorded outside the position's range, then multiplies the difference by the position's liquidity [1].

Three implications an LP notices:

1. **Fees accrue only while the active tick is inside the range.** Time out of range contributes nothing, as covered in [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).
2. **Fees are not reinvested.** They sit as owed amounts until collected, so a quoted annual percentage yield assuming compounding requires you to collect and redeposit, paying gas each time.
3. **Collection is a separate transaction.** Withdrawing liquidity and collecting fees are distinct operations, which is why some interfaces show a position at zero liquidity with a fee balance still attached.

---

## 5. Tick Crossing During a Swap

When a swap consumes all the liquidity available at the current tick, the pool moves to the next initialised tick, updates the fee growth accumulators, and applies the net liquidity change recorded at that boundary [1].

This is the mechanism behind several observable behaviours:

- **Liquidity depth is a step function.** Depth can change abruptly as price crosses a boundary where a large position starts or ends.
- **Large swaps cost more than the marginal price suggests**, because they cross several ticks and consume progressively thinner liquidity.
- **Gas for a swap depends on how many ticks it crosses.** A trade during a volatile period on a fine-spacing pool can be materially more expensive than the same trade in calm conditions.

The execution consequences are worked through in [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/).

### Why ranges drift from what you typed

A provider enters a band from 2,350 to 2,650 on a 30 basis point ETH/USDC pool. The contract stores ticks, and with a spacing of 60 the nearest usable ticks correspond to roughly 2,344 and 2,657. The position is minted at those prices instead, which is close enough to be invisible in an interface and far enough to matter if the strategy assumed exact bounds.

On a 100 basis point pool the same request rounds by more than a percent in each direction. Anyone building a systematic strategy should compute the usable ticks first and design the band around them, rather than choosing round numbers and accepting whatever the contract snaps to. The same rounding explains why two positions that look identical in a dashboard can have slightly different boundaries and therefore different time in range.

---

## 6. Reading Position State Directly

Verifying a position without trusting an interface takes three reads:

1. **The pool contract's `slot0`** gives the current `sqrtPriceX96` and tick. Compare that tick with your bounds to establish whether the position is in range.
2. **The position manager's `positions(tokenId)`** returns bounds, liquidity, and the fee growth snapshots plus tokens owed.
3. **The pool's `ticks(tick)`** for each bound shows the liquidity gross and net recorded there, which indicates how much competing liquidity shares your boundary.

Anyone running more than a handful of positions should automate these reads rather than relying on a dashboard, if only because a position that appears healthy in an interface and one that is actually accruing fees are different claims.

---

## 7. Checklist for Working With v3 Positions

- [ ] Confirm the tick spacing for your fee tier before designing a range width.
- [ ] Expect entered bounds to be snapped to usable ticks, and check the resulting prices.
- [ ] Record the token ID, bounds and mint transaction for every position you open.
- [ ] Collect fees on a schedule that makes sense against gas, not on every visit.
- [ ] Treat any approval over a position NFT as an approval over the underlying assets.
- [ ] Verify in-range status from the pool's current tick rather than from a cached interface value.
- [ ] Before migrating or transferring, collect outstanding fees so the accounting is clean.

None of this changes the economics of a position, which are decided by volume, volatility and range width. It changes whether you can diagnose the position accurately when the economics disappoint.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [How Uniswap Works (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
5. [EIP-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-721)
6. [Strategic Liquidity Provision in Uniswap v3 (Neuder et al., 2021)](https://arxiv.org/abs/2106.12033)
7. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[5]: https://eips.ethereum.org/EIPS/eip-721 "EIP-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)"
[6]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Neuder et al., 2021)"
[7]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
