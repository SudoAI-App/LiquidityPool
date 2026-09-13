---
title: "Uniswap Liquidity Pools: How v2, v3 and v4 Pools Work"
description: "Three generations of Uniswap pools run side by side. What each one asks you to decide, what your position actually holds, and how to pick a tier and a range."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Dr. Kieran Thorne"
readTime: "7 min read"
keywords: "Uniswap liquidity pools, Uniswap liquidity provider, how to provide liquidity on Uniswap, Uniswap pool fees, Uniswap price impact, Uniswap v3 price range, Uniswap v2 liquidity pool"
featured: true
faq:
  - q: "How do Uniswap liquidity pools work?"
    a: "Each pool holds reserves of two tokens and prices swaps from an invariant applied to those reserves. Liquidity providers deposit the pair and receive a claim on the pool; traders swap against the reserves and pay a fee that accrues to the liquidity active for that trade."
  - q: "How do I provide liquidity on Uniswap?"
    a: "Select the pair and fee tier, choose a price range on v3 and v4, approve both tokens, and mint the position. The interface computes the token ratio required at the current price. Confirm what the position will hold at each end of the range before signing."
  - q: "What are Uniswap pool fees?"
    a: "Uniswap charges a per-swap fee set by the pool. v2 uses a single 30 basis point fee; v3 offers 1, 5, 30 and 100 basis point tiers as separate pools; v4 supports those tiers plus hook-set dynamic fees that can change per swap."
  - q: "What causes price impact on Uniswap?"
    a: "The invariant. Buying an asset removes it from the reserve, which raises its price for the remainder of the same trade. Impact grows convexly with order size relative to the liquidity available at the current price, not relative to total value locked."
  - q: "Which Uniswap version should a liquidity provider use?"
    a: "The version and pool where the pair has routed volume and where you can maintain the position you intend to hold. v2-style full-range positions need no management; v3 and v4 ranges earn more per dollar and require monitoring."
  - q: "What is a Uniswap v3 price range?"
    a: "The pair of prices between which your liquidity is active. The contract stores them as ticks, and the position holds both assets inside the range, entirely the base asset below it, and entirely the quote asset above it."
---

Three generations of Uniswap pools are live at the same time, and the interface does not make the difference obvious. Pick the wrong one and your position quietly stops doing what you thought it did.

They all price trades the same way. What changes is how many decisions they hand to you, and how much attention the position then needs.

This guide covers what each version asks of you, what your position actually holds, how to pick a fee tier and a range, and what a real trade costs on either side of it.

<figure class="article-figure">
  <img src="/images/guides/uniswap-liquidity-pools.webp" alt="Table comparing Uniswap v2, v3 and v4 across price coverage, fees, LP claim, deployment, management and capital efficiency." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What changes for a liquidity provider across three generations of Uniswap pools. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"The front end hides how much of this is a contract choice. The fee tier, the tick spacing and, on v4, the attached code are all part of what the pool is. Two pools on the same pair at different tiers are different markets with different depth. Routers treat them that way even when the screen shows you one price."*

## What all three versions have in common

Every Uniswap pool works out its price from what it is holding. The oldest rule keeps the two balances multiplied together at a fixed number [1]:

$$
x \cdot y = k
$$

Where:

- $x$ and $y$ are the two token balances.
- $k$ is the number the pool keeps level.

The price is one balance divided by the other, so every trade moves it against the trader. That is the same in all three versions.

v3 and v4 use the same curve, shifted so your money runs out at the two prices you chose rather than at zero and infinity [2]. The consequences for you are identical either way. Only where your money sits, and what it costs to touch it, change.

| | v2 | v3 | v4 |
| :--- | :--- | :--- | :--- |
| Where your money sits | Every possible price | The band you choose | The band you choose |
| Fee | Fixed 0.30% | Four fixed tiers | Those tiers, or code that sets it per swap |
| Your position is | A fungible token | An NFT | An NFT, recorded inside one shared contract |
| Attention needed | None | Regular | Regular, unless a hook handles it |
| Extra thing to check | Nothing | Your range | Your range, and the attached code |

## Picking a fee tier is bidding for volume

v2 charges 0.30% on every swap. v3 split that into separate pools per tier, and v4 keeps them and adds fees that code can change per swap [2] [3].

| Tier | What it is for | What it means for you |
| :--- | :--- | :--- |
| 0.01% | Stablecoins and pegged pairs | Most of the volume, least revenue per trade |
| 0.05% | ETH against dollars, the deep majors | Where most large orders actually clear |
| 0.30% | Volatile and mid-cap pairs | Pays for the higher risk of being picked off |
| 1.00% | Long-tail and thin pairs | Little volume, wide spread |

The key point people miss: each tier is a completely separate pool with its own money. Routers send each trade wherever it fills best. So choosing a tier is not choosing a yield. It is bidding for order flow, and you can lose that bid. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).

## What you actually get back

On v2, a fungible token representing a slice of the whole pool. On v3, an NFT recording your two bounds and your size. On v4, a position recorded inside the single shared contract, which you normally hold as an NFT from Uniswap's position manager [3].

That difference matters in practice:

- **The v2 token travels anywhere.** Stake it, borrow against it, send it. It has no price bounds to explain.
- **The v3 NFT does not.** Every one is unique, which is why lending markets struggle with them and why claiming fees is a separate transaction.
- **v4 settles once per transaction**, rather than moving tokens at every step, which makes touching several pools at once much cheaper.

See [Liquidity Pool Tokens Explained](/guides/liquidity-pool-tokens/) and [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/).

## How to actually do it

1. **Pick the pair, and be honest.** Would you hold either token on its own? The pool will decide the proportions, not you.
2. **Pick the tier on measured volume.** Look at what routes through that specific tier, not the pair overall.
3. **Pick the range, and do the arithmetic first.** At your lower bound you hold only the base asset. At your upper bound, only the quote asset. Work out both amounts before you continue.
4. **Approve only what you are depositing.** Modern interfaces use signatures with expiry dates rather than unlimited approvals. Use them.
5. **Mint it, and check the ratio** the interface asks for against what you meant to put in.
6. **Write down where you started.** Quantities, prices, transaction hash. Without that you can never tell later whether this worked.
7. **Decide your rules now.** When do you re-centre? When do you leave? Decide while you are calm.

See [How to Provide Liquidity](/guides/how-to-provide-liquidity/) and [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

## What a trade actually costs, from both sides

Two things make up a trader's cost. Price impact — how far your own order pushes the rate — is knowable before you sign. Slippage — the extra gap between the quote you saw and the fill you got, caused by somebody else trading first — is not, and your tolerance setting caps it.

The number that decides price impact is money near the current price, not the pool's headline size. A pool with huge deposits parked in distant ranges can fill you worse than a small one with dense liquidity right at the touch.

Work an example. Somebody buys \$120,000 of ETH from a 0.05% pool with \$3,000,000 working within 1% of the current price of \$2,400.

| | The trader's side | The depositor's side |
| :--- | :--- | :--- |
| Order against active depth | 4% | — |
| Price impact | the price moves about 0.08%, so the average fill is about 0.04% worse | — |
| Average fill | about \$2,401 | — |
| Fee paid | \$60 | \$60 shared across everyone in range |
| A position holding 2% of that depth | — | earns \$1.20 |

Send the same order to a 0.30% pool with \$400,000 working and it pays about 0.3% in impact plus the 0.30% fee, roughly seven times the total cost. That is why aggregators split orders rather than sending them to whichever pool shows the biggest total.

The depositor's row is the one to sit with. One good trade pays \$1.20. Real income is thousands of those, which is why routed volume matters far more than any single transaction. See [Slippage and Price Impact](/guides/slippage-and-price-impact/) and [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/).

## What people get wrong about Uniswap pools

| What people assume | What actually happens |
| :--- | :--- |
| One pool per pair | Each fee tier is a separate pool with separate money. They compete for your trade |
| A lower fee tier is cheaper | Only if the depth is there. A cheap tier on a thin pool costs far more in impact |
| A range position is set and forget | It stops earning the moment the price leaves, while still fully exposed to the losing token |
| The protocol is audited, so a v4 pool is safe | The core is mature. The code attached to a specific pool is somebody else's work |

## Two risks specific to these pools

Uniswap's own documentation names them plainly: divergence from holding, volatility, positions going out of range, contract risk, unverified token teams, whether liquidity is locked, and gas [4].

Two are version-specific and worth repeating:

- **Out of range on v3 and v4, you earn nothing** while staying completely exposed to whichever token you converted into.
- **Hooks on v4 are arbitrary code** with real permissions over the pool. A pool inherits whatever its hook can do, including anything affecting withdrawals. Read the hook before you read the yield. See [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).

## What to check before you deposit

1. **Would you hold either token alone?** If not, this is the wrong pair.
2. **Where does volume actually route?** Compare tiers for that pair, not pair-level totals.
3. **How much money is inside the band you want?** That is your competition for fees.
4. **What do you hold at each bound?** Compute both. Accept both.
5. **On v4, who wrote the hook and can it change?** Resolve the address and its permissions.
6. **Estimate fees and divergence separately**, then compare them. One number cannot tell you both.
7. **Is the position big enough to absorb the gas** of how often you plan to touch it?
8. **Set an alert near your boundary**, so you never discover a conversion weeks later.

The contracts here are mature and well documented. Most bad outcomes on Uniswap trace back to two things: a range chosen without looking at how much the pair moves, and a tier chosen without looking at where the volume goes.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
5. [How Uniswap Works (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
8. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[5]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[8]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
