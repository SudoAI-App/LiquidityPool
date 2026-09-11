---
title: "Uniswap Liquidity Pools: How v2, v3 and v4 Pools Work"
description: "How Uniswap liquidity pools work across v2, v3 and v4: pricing, fee tiers, price impact, what an LP position holds, and how to provide liquidity on Uniswap."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Dr. Kieran Thorne"
readTime: "12 min read"
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

Uniswap pools are the reference implementation most other automated market makers are measured against, and three generations of them are in production simultaneously. They share one pricing idea and differ in what they ask the liquidity provider to decide.

Understanding which decisions belong to which version is what makes the difference between a position that behaves as expected and one that quietly stops working.

<figure class="article-figure">
  <img src="/images/guides/uniswap-liquidity-pools.webp" alt="Table comparing Uniswap v2, v3 and v4 across price coverage, fees, LP claim, deployment, management and capital efficiency." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What changes for a liquidity provider across three generations of Uniswap pools. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"The interface hides how much of this is a contract-level choice. Fee tier, tick spacing and, in v4, the hook are all part of the pool's identity. Two pools on the same pair with different tiers are different markets with different depth, and routing treats them that way even when the front end presents one price."*

## 1. The Pricing Rule Common to All Versions

Every Uniswap pool prices swaps from reserves. In v2 the invariant is the constant product across all prices [1]:

$$
x \cdot y = k
$$

The marginal price is the reserve ratio $y/x$, so each trade moves the price against the trader. In v3 and v4 the same curve is translated so that a position's reserves reach zero at its chosen bounds [2]:

$$
\left(x + \frac{L}{\sqrt{p_b}}\right)\left(y + L\sqrt{p_a}\right) = L^2
$$

Nothing about divergence, adverse selection or fee accrual changes between versions because of this equation. What changes is where liquidity sits and what it costs to interact with it.

---

## 2. Fee Tiers and What They Signal

v2 charges a single 30 basis point fee on every swap. v3 introduced separate pools per fee tier, and v4 keeps them while adding hook-set dynamic fees [2] [3].

| Tier | Typical use | Consequence for LPs |
| :--- | :--- | :--- |
| 1 bps | Fiat stablecoin pairs, pegged assets | Highest volume share, lowest revenue per unit |
| 5 bps | ETH/USDC and other deep majors | Where most routed size clears |
| 30 bps | Volatile and mid-cap pairs | Compensation for higher adverse selection |
| 100 bps | Long-tail and illiquid pairs | Thin volume, wide quoted spread |

Each tier is a separate pool with its own liquidity, and aggregators route to whichever path executes best. Choosing a tier is therefore a bid for order flow rather than a yield setting, developed in [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).

---

## 3. What a Uniswap LP Position Holds

In v2 the claim is a fungible ERC-20 token representing a share of the whole pool. In v3 it is an ERC-721 position NFT recording lower tick, upper tick and liquidity. In v4 the manager tracks positions internally, with ERC-6909 claims used for balances and NFTs available through periphery contracts [3].

The practical differences:

- **Fungible v2 claims** can be staked in farms, used as collateral and transferred without reference to price bounds.
- **v3 position NFTs** are unique because each carries its own range, which is why they cannot be pooled trivially and why fee collection is a separate transaction.
- **v4 accounting** avoids token transfers during a transaction, which reduces gas for anyone interacting with several pools at once.

The mechanics of each claim type are covered in [Liquidity Pool Tokens Explained](/guides/liquidity-pool-tokens/) and the tick internals in [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/).

---

## 4. Providing Liquidity, Step by Step

1. **Choose the pair and confirm you would hold both assets.** The pool will change the proportions.
2. **Choose the fee tier**, using measured routed volume for the specific tier rather than pair-level volume.
3. **Choose the price range** on v3 or v4. Compute the exact holdings at each bound before proceeding: entirely the base asset at the lower bound, entirely the quote asset at the upper bound.
4. **Approve both tokens.** Modern interfaces use Permit2 signatures, which set allowances with expiries rather than unlimited approvals.
5. **Mint the position**, checking the deposit ratio the interface computes against your intended exposure.
6. **Record entry state**: quantities, prices, transaction hash. Without it, no benchmark can be reconstructed later.
7. **Decide the management rule in advance**: when you re-centre, when you exit, and what evidence triggers each.

A fuller mechanism-first walkthrough is in [How to Provide Liquidity](/guides/how-to-provide-liquidity/), and the boundary case in [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

---

## 5. Price Impact and Execution on Uniswap

For traders, the cost of a swap has two components. Price impact is deterministic and computable from the pool's state before signing. Slippage is the additional difference caused by other transactions landing first, and it is bounded by the tolerance the trader sets.

On concentrated pools, the correct denominator for impact is liquidity active near the current price, not headline total value locked. A pool with large deposits parked in distant ranges can execute worse than a smaller pool with dense liquidity at the touch. Both effects are worked through with numbers in [Slippage and Price Impact](/guides/slippage-and-price-impact/) and [Liquidity Depth and Execution](/guides/liquidity-depth-and-execution/).

### A worked execution example

A trader buys \$120,000 of ETH against a 5 bps pool holding \$3,000,000 of liquidity active within one percent of the current price of 2,400.

The order consumes 4% of the active depth, producing roughly 2% of price impact and an average execution near 2,448. The pool fee adds \$60. If the same order were routed to a 30 bps pool with \$400,000 of active depth, price impact alone would exceed 12% before the higher fee is counted, which is why aggregators split orders rather than sending them to whichever pool advertises the largest total value locked.

For the liquidity provider on the other side, that single trade paid \$60 in fees, distributed across every position in range in proportion to its share. A position holding 2% of the active liquidity earned \$1.20 from it. Fee income at realistic scale is the accumulation of thousands of such trades, which is why routed volume matters more to an LP than any individual transaction.

---

## 6. Risks Specific to Uniswap Pools

Uniswap's own documentation lists the exposures plainly: impermanent loss, price volatility, positions moving out of range, smart contract vulnerability, unverified token teams, liquidity lock status and network costs [4].

Two are version-specific and worth restating:

- **Out-of-range positions on v3 and v4** stop earning while remaining fully exposed to the asset they converted into.
- **Hooks on v4** are arbitrary contracts with permissions over the pool lifecycle. A pool inherits the trust assumptions of its hook, including any ability to affect liquidity removal. Read the hook before reading the yield, as set out in [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).

---

## 7. Checklist Before Supplying a Uniswap Pool

- [ ] Confirm the pair and that you would hold either asset alone.
- [ ] Compare routed volume across tiers for that pair, not aggregate volume.
- [ ] Measure active liquidity inside the band you intend to occupy.
- [ ] Compute holdings at both range bounds and accept both outcomes.
- [ ] For v4 pools, resolve the hook address, its permissions and whether it is upgradeable.
- [ ] Estimate fee income and divergence separately, then compare the two.
- [ ] Size the position so that gas across the intended management cadence is immaterial.
- [ ] Set an alert near the range boundary so a conversion is never discovered weeks later.

The protocol is well documented and the contracts are mature. Most disappointing outcomes on Uniswap pools trace not to the protocol but to a range chosen without reference to volatility, or a tier chosen without reference to where the volume actually routes.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
5. [How Uniswap Works (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
8. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[5]: https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works "How Uniswap Works"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)"
[8]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
