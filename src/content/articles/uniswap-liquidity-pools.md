---
title: "Uniswap Liquidity Pools: How v2, v3 and v4 Pools Work"
description: "Three generations of Uniswap pools run side by side. What each one asks you to decide, what your position actually holds, and how to pick a tier and a range."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "Uniswap liquidity pools"
keywords: "Uniswap liquidity pools, Uniswap liquidity provider, Uniswap pool fees, Uniswap price impact, Uniswap v3 price range, Uniswap v2 liquidity pool"
featured: true
faq:
  - q: "How do Uniswap liquidity pools work?"
    a: "Each pool holds reserves of two tokens and prices swaps from a rule applied to those reserves. Liquidity providers deposit the pair and receive a claim on the pool; traders swap against the reserves and pay a fee that accrues to the liquidity active for that trade, minus any protocol fee governance has switched on."
  - q: "How do I provide liquidity on Uniswap?"
    a: "Select the pair and fee tier, choose a price range on v3 and v4, approve both tokens, and mint the position. The interface computes the token ratio required at the current price. Confirm what the position will hold at each end of the range before signing."
  - q: "What are Uniswap pool fees?"
    a: "v2 charges 0.30% per swap. v3 offers 0.01%, 0.05%, 0.30% and 1% tiers as separate pools. v4 has no fixed tiers: a pool can set any fixed fee or let its hook set a dynamic one. Since the December 2025 UNIfication vote, a protocol fee takes part of the swap fee: 0.05 points of v2's 0.30%, a quarter of the fee on v3's two lower tiers and a sixth on the two higher ones."
  - q: "What causes price impact on Uniswap?"
    a: "The pricing rule. Buying an asset removes it from the reserve, which raises its price for the rest of the same trade. Impact grows with order size relative to the liquidity available near the current price, not relative to total value locked."
  - q: "Which Uniswap version should a liquidity provider use?"
    a: "The version and pool where the pair has routed volume and where you can maintain the position you intend to hold. v2-style full-range positions need no management; v3 and v4 ranges earn more per dollar while in range and require monitoring."
  - q: "What is a Uniswap v3 price range?"
    a: "The pair of prices between which your liquidity is active. The contract stores them as ticks, and the position holds both assets inside the range, entirely the base asset below it, and entirely the quote asset above it."
---

Three generations of Uniswap pools are live at the same time, and the interface does not make the difference obvious. Pick the wrong one and your position may not do what you thought it did.

They all price trades the same way. What changes is how many decisions they hand to you, how the fee is split, and how much attention the position then needs.

By the end you should be able to choose a version, a fee tier and a range, and estimate what a trade through your position actually pays you.

<figure class="article-figure">
  <img src="/images/guides/uniswap-liquidity-pools.webp" alt="Table comparing Uniswap v2, v3 and v4 across price coverage, fees, LP claim, deployment, management and capital efficiency." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What changes for a liquidity provider across three generations of Uniswap pools. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> The front end hides how much of this is a contract choice. The fee tier, the tick spacing and, on v4, the attached hook are all part of what the pool is. Two pools on the same pair at different tiers are different markets with different depth. Routers treat them that way even when the screen shows you one price.

## What all three versions have in common

Every Uniswap pool works out its price from what it is holding. The original rule keeps the two balances multiplied together at a fixed number [1]:

$$
x \cdot y = k
$$

Where:

- $x$ and $y$ are the two token balances.
- $k$ is the number the pool keeps level.

The price is one balance divided by the other, so every trade moves it against the trader. That is the same in all three versions.

v3 and v4 use the same curve, shifted so your money runs out at the two prices you chose rather than at zero and infinity [2]. Only where your money sits, and what it costs to touch it, change. The head-to-head between the passive v2 deposit and the managed v3 position is worked through in [Uniswap v2 vs v3](/guides/uniswap-v2-vs-v3/).

| | v2 | v3 | v4 |
| :--- | :--- | :--- | :--- |
| Where your money sits | Every possible price | The band you choose | The band you choose |
| Swap fee | Fixed 0.30% | Four standard tiers | Any fixed fee, or a hook-set dynamic fee |
| Your position is | A fungible ERC-20 token | An NFT | An NFT from the position manager |
| Attention needed | None | Regular | Regular, unless a hook handles it |
| Extra thing to check | Nothing | Your range | Your range, and the attached hook |

## Picking a fee tier is bidding for volume

v2 charges 0.30% on every swap [1]. v3 launched with 0.05%, 0.30% and 1% tiers, each a separate pool with its own tick spacing, and governance added a 0.01% tier in late 2021 [2] [6]. v4 drops fixed tiers altogether: a pool can set any fee, and a hook can change it per swap [3] [6].

| v3 tier | Tick spacing | What it is for | What it means for you |
| :--- | ---: | :--- | :--- |
| 0.01% | 1 | Stablecoins and pegged pairs | High volume, least revenue per trade |
| 0.05% | 10 | ETH against dollars, the deep majors | Where many large orders clear |
| 0.30% | 60 | Volatile and mid-cap pairs | Pays for a higher risk of trading against informed flow |
| 1.00% | 200 | Long-tail and thin pairs | Little volume, wide spread |

Tick spacing sets how finely you can place your range: every tick is a 0.01% price step, and the spacing says which ticks a position may start or end on [2].

The key point people miss: each tier is a separate pool with its own money. Routers send each trade wherever it fills best. So choosing a tier is not choosing a yield. It is bidding for order flow, and you can lose that bid. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).

## How much of the fee you keep

Uniswap governance switched on protocol fees in December 2025 with the UNIfication proposal [7]. By mid-2026 they applied to every v2 and v3 pool on eleven chains, including Ethereum, Arbitrum, Base and BNB Chain [8]. Part of each swap fee now goes to collection contracts, where it can only be claimed by burning UNI, and the rest goes to LPs [6].

| Pool | Swap fee paid by the trader | Share kept by LPs | LP fee |
| :--- | ---: | ---: | ---: |
| v2, any pair | 0.30% | five-sixths | 0.25% |
| v3, 0.01% tier | 0.01% | three-quarters | 0.0075% |
| v3, 0.05% tier | 0.05% | three-quarters | 0.0375% |
| v3, 0.30% tier | 0.30% | five-sixths | 0.25% |
| v3, 1% tier | 1.00% | five-sixths | 0.8334% |

On v4, a vote executed in July 2026 started charging a protocol fee on a subset of pools: those without hooks, pools launched through Uniswap's auction hook, and aggregator hook pools [8]. The fee on hookless pools follows a curve set by governance rather than a fixed fraction [8]. Governance can change any of these values, so check the current setting for your pool before you model fee income [6].

## What you actually get back

On v2, an ERC-20 token representing a slice of the whole pool [1] [9]. On v3, an NFT recording your two bounds and your size [2] [10]. On v4, an NFT minted by Uniswap's position manager [13], while the pool itself lives inside one shared contract [3].

That difference matters in practice:

- **The v2 token travels anywhere.** Stake it, borrow against it, send it. Its fees are added to the pool's reserves, so they compound inside the token automatically [6].
- **The v3 NFT does not travel as easily.** Every one is unique, which is why lending markets struggle with them, and fees build up as a separate balance you collect in its own transaction [6].
- **v4 settles once per transaction**, rather than moving tokens at every step, which makes touching several pools at once cheaper [3].

See [Liquidity Pool Tokens Explained](/guides/liquidity-pool-tokens/) and [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/).

## How to actually do it

1. **Pick the pair, and be honest.** Would you hold either token on its own? The pool will decide the proportions, not you.
2. **Pick the tier on measured volume.** Look at what routes through that specific tier, not the pair overall.
3. **Pick the range, and do the arithmetic first.** At your lower bound you hold only the base asset. At your upper bound, only the quote asset. Work out both amounts in the [Uniswap v3 liquidity calculator](/tools/uniswap-v3-liquidity-calculator/) before you continue.
4. **Approve only what you are depositing.** Read the amount and the expiry on any approval or signature request.
5. **Mint it, and check the ratio** the interface asks for against what you meant to put in.
6. **Write down where you started.** Quantities, prices, transaction hash. Without that you can never tell later whether this worked.
7. **Decide your rules now.** When do you re-centre? When do you leave? Decide while you are calm.

See [How to Provide Liquidity](/guides/how-to-provide-liquidity/) and [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

## What a trade actually costs, from both sides

Two things make up a trader's cost. Price impact — how far your own order pushes the rate — is knowable before you sign. Slippage — the extra gap between the quote you saw and the fill you got, caused by somebody else trading first — is not, and your tolerance setting caps it.

The number that decides price impact is money near the current price, not the pool's headline size. Research on Uniswap depth finds that how tightly liquidity is concentrated matters as much as total value locked [11]. A pool with large deposits parked in distant ranges can fill you worse than a small one with dense liquidity right at the current price.

Work an example. Somebody buys \$120,000 of ETH from a 0.05% pool with \$3,000,000 working within 1% either side of the current price of \$2,400.

| | The trader's side | The depositor's side |
| :--- | :--- | :--- |
| Order against active depth | 4% | — |
| Price impact | the price moves about 0.08%, so the average fill is about 0.04% worse | — |
| Average fill, before the fee | about \$2,401 | — |
| Fee paid | \$60 | \$45 to LPs in range, \$15 protocol fee |
| A position holding 2% of that depth | — | earns \$0.90 |

Send the same order to a 0.30% pool with \$400,000 working in the same band and it pays about 0.30% in impact plus the 0.30% fee. That is about 0.60% in total against 0.09%, roughly seven times the cost. That is why aggregators split orders rather than sending them to whichever pool shows the biggest total.

The depositor's row is the one to sit with. One sizeable trade pays \$0.90. Real income is thousands of those, which is why routed volume matters far more than any single transaction. See [Slippage and Price Impact](/guides/slippage-and-price-impact/) and [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/).

## Two risks specific to these pools

Uniswap's own help centre lists the general risks: impermanent loss (falling behind simply holding the two tokens), volatility, positions going out of range, contract vulnerabilities, unverified token teams and unlocked liquidity [4]. Research on real v3 positions adds that returns vary widely, and that higher returns came with more risk and more active management [12].

Two risks are version-specific:

- **Out of range on v3 and v4, you earn nothing** while staying fully exposed to whichever token you converted into [4].
- **Hooks on v4 are code with real permissions over the pool.** A hook is fixed when the pool is created, and its address encodes which moments it can act on, including liquidity removal [5]. A pool inherits whatever its hook can do, so read the hook before you read the yield. See [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).

## What to check before you deposit

1. **Would you hold either token alone?** If not, this is the wrong pair.
2. **Where does volume actually route?** Compare tiers for that pair, not pair-level totals.
3. **How much money is inside the band you want?** That is your competition for fees.
4. **What do you hold at each bound?** Compute both. Accept both.
5. **What share of the fee reaches LPs?** Check the protocol fee for that pool and tier.
6. **On v4, who wrote the hook and can it change?** Resolve the address, its permissions, and whether it sits behind an upgradeable proxy.
7. **Estimate fees and divergence separately**, then compare them. One number cannot tell you both.
8. **Is the position big enough to absorb the gas** of how often you plan to touch it?
9. **Set an alert near your boundary**, so you never discover a conversion weeks later.

Most bad outcomes on Uniswap trace back to a range chosen without looking at how much the pair moves, or a tier chosen without looking at where the volume goes. To see what moving an existing range position to v4 involves, read [Uniswap v3 vs v4](/guides/uniswap-v3-vs-v4/). The same mechanics run on BNB Chain with an incentive layer on top in [PancakeSwap liquidity pools](/guides/pancakeswap-liquidity-pools/).

## References

1. [Uniswap v2 Core (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Uniswap v4 Core (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
5. [Uniswap v4 Hooks (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/hooks)
6. [Fees (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/fees)
7. [UNIfication (Uniswap Governance Proposal 93, 2025)](https://vote.uniswapfoundation.org/proposals/93)
8. [Activate v4 Protocol Fees, Part 1/2 (Uniswap Governance Proposal 100, 2026)](https://vote.uniswapfoundation.org/proposals/100)
9. [ERC-20: Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-20)
10. [ERC-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-721)
11. [What Drives Liquidity on Decentralized Exchanges? Evidence from the Uniswap Protocol (Zhu et al., 2024)](https://arxiv.org/abs/2410.19107)
12. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
13. [Position Manager (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/guides/position-manager)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core (Adams et al., 2020)"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core (Adams et al., 2021)"
[3]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core (Adams et al., 2024)"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity? (Uniswap Labs)"
[5]: https://developers.uniswap.org/docs/protocols/v4/concepts/hooks "Uniswap v4 Hooks (Uniswap Developer Documentation)"
[6]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees (Uniswap Developer Documentation)"
[7]: https://vote.uniswapfoundation.org/proposals/93 "UNIfication (Uniswap Governance Proposal 93, 2025)"
[8]: https://vote.uniswapfoundation.org/proposals/100 "Activate v4 Protocol Fees, Part 1/2 (Uniswap Governance Proposal 100, 2026)"
[9]: https://eips.ethereum.org/EIPS/eip-20 "ERC-20: Token Standard (Ethereum Improvement Proposals)"
[10]: https://eips.ethereum.org/EIPS/eip-721 "ERC-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)"
[11]: https://arxiv.org/abs/2410.19107 "What Drives Liquidity on Decentralized Exchanges? Evidence from the Uniswap Protocol (Zhu et al., 2024)"
[12]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[13]: https://developers.uniswap.org/docs/protocols/v4/guides/position-manager "Position Manager (Uniswap Developer Documentation)"
