---
title: "Raydium Liquidity Pools: CLMM, CPMM and Choosing Between Them"
description: "How Raydium's concentrated and constant-product pools differ in practice, what a CLMM position holds at each end of its range, and the diligence a Solana pool needs before deposit."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Aria Chen"
readTime: "12 min read"
keywords: "Raydium liquidity pool, Raydium CLMM explained, how to provide liquidity on Raydium, Raydium liquidity pool fees, Raydium CPMM, Solana liquidity pools, Raydium liquidity pool rewards"
featured: false
faq:
  - q: "What is Raydium CLMM?"
    a: "Raydium's concentrated liquidity market maker, a tick-based pool where a provider funds a bounded price range instead of the whole price axis. Inside the range the position quotes with amplified depth; outside it the position holds a single asset and stops earning fees."
  - q: "What is the difference between Raydium CLMM and CPMM?"
    a: "A CPMM pool spreads liquidity across all prices under a constant-product rule and needs no management. A CLMM pool concentrates it inside bounds you choose, which raises fee density per dollar and introduces range maintenance, amplified divergence, and the possibility of earning nothing while the price sits outside."
  - q: "How do I provide liquidity on Raydium?"
    a: "Choose the pair and the pool type, and for a CLMM pool choose the price range and fee tier. The interface derives the token ratio required at the current price, you approve both tokens, and the position is minted. Confirm what the position will hold at each bound before signing."
  - q: "Does Raydium have impermanent loss?"
    a: "Yes, in both pool types. Any pricing curve that rebalances a basket as the market moves imposes it. A bounded CLMM range amplifies it inside the bounds and converts the position fully to one asset once price passes an edge."
  - q: "Are Raydium pool rewards the same as fees?"
    a: "No. Fees are a share of swap volume paid by traders. Rewards are emitted tokens funded by dilution and scheduled to end. Model the position with rewards set to zero before deciding whether the pool is worth supplying."
---

Raydium runs two pool designs side by side, and the choice between them is the first decision a liquidity provider makes there. One is a constant-product pool that needs no attention. The other is a tick-based concentrated pool that behaves nothing like it, quotes far more depth per dollar, and can sit idle for weeks if the range was chosen badly.

Most disappointing positions on the venue come from treating the second like the first.

<figure class="article-figure">
  <img src="/images/guides/raydium-clmm-liquidity-guide.webp" alt="A constant-product curve beside a tick-bounded concentrated range, showing token composition at each bound." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Full-range constant product against a bounded tick range, and what each holds as price moves. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"On Solana the transaction cost of managing a range is trivial, which removes the usual excuse for leaving a position unmanaged. That cuts both ways. Cheap rebalancing makes narrow ranges practical, and it also makes it painless to re-centre into a trend twelve times and realise the conversion at every step. The constraint that disciplined the behaviour on Ethereum is simply absent here."*

## 1. The Two Pool Types

**CPMM (constant product).** Reserves $x$ and $y$ satisfy $x \cdot y = k$, and the pool quotes every price from zero to infinity. A depositor supplies both assets in the current ratio and receives a fungible pool token representing a proportional claim. There is no range, nothing to maintain, and no possibility of the position going inactive. Capital efficiency is low because most of it backs prices the market will never visit. The mechanics are derived in [The Constant Product Formula](/guides/constant-product-formula/).

**CLMM (concentrated liquidity).** Liquidity is placed between a lower and an upper tick. Within the range the pool behaves like a constant-product pool with a much larger virtual reserve, so depth at the current price is amplified. The reference design is Uniswap v3, and Raydium's implementation follows the same tick and liquidity accounting [1][2]. Position state is not fungible, since each position has its own bounds.

| | Raydium CPMM | Raydium CLMM |
|---|---|---|
| Price coverage | All prices | Between chosen ticks |
| Capital efficiency | Low | High while in range |
| Management required | None | Range monitoring and rebalancing |
| Can stop earning | No | Yes, when price exits the range |
| Divergence loss | Standard | Amplified inside the range |
| Position claim | Fungible pool token | Per-position state |
| Suits | Long-tail pairs, set-and-forget | Liquid pairs with an active operator |

## 2. What a CLMM Position Holds

This is the part that surprises people, and it is entirely predictable in advance. For a position between $P_a$ and $P_b$ at current price $P$:

$$ x = L\left(\frac{1}{\sqrt{P}} - \frac{1}{\sqrt{P_b}}\right), \qquad y = L\left(\sqrt{P} - \sqrt{P_a}\right) $$

Three regimes follow. Below $P_a$ the position is entirely the base asset, because the curve bought all the way down. Above $P_b$ it is entirely the quote asset, because the curve sold all the way up. Between them it holds a mixture that shifts continuously.

The practical reading is that a range is a commitment to sell the asset as it rises through the band and buy it as it falls. If you hold the base asset because you expect it to outperform, a narrow upper bound guarantees you sell it. [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) covers what happens after the edge is crossed, and [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/) covers the tick accounting that produces these three regimes.

## 3. Fee Tiers and Capital Efficiency

Raydium CLMM pools exist at several fee tiers, and the tier is a property of the pool rather than of your position. Selecting one is a bid for order flow: a lower tier attracts routed volume from aggregators, a higher tier earns more per unit of volume but may see less of it. The same logic as [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/) applies.

Capital efficiency from concentration is computable before deposit. Relative to a full-range position of the same value, the liquidity achieved is

$$ \frac{L_{\text{range}}}{L_{\text{full}}} = \frac{2\sqrt{P}}{2\sqrt{P} - \frac{P}{\sqrt{P_b}} - \sqrt{P_a}} $$

| Range around current price | Efficiency multiplier | Illustrative time in range |
|---|---|---|
| ±2% | 100.5× | 18% |
| ±5% | 40.5× | 37% |
| ±10% | 20.4× | 58% |
| ±25% | 8.3× | 81% |
| ±50% | 4.2× | 93% |

The left column is what a marketing page quotes. The right column is what decides the outcome, and it is pair-specific: substitute the fraction of the last thirty days your candidate pair actually spent inside each band. Multiplying the two columns gives the quantity you are really optimising, and it peaks in the middle rather than at the narrow end. [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/) derives that objective function properly.

## 4. A Worked Comparison

$15,000 for 45 days on the same Solana pair, once in a CPMM pool and once in a ±10% CLMM range.

| | CPMM | CLMM ±10% |
|---|---|---|
| Effective liquidity multiplier | 1.0× | 20.4× |
| Share of routed volume captured | 0.31% | 2.8% |
| Fee income while active | $196 | $1,772 |
| Time in range | 100% | 58% |
| Realised fee income | $196 | $1,028 |
| Divergence over the period | −$188 | −$714 |
| Transaction costs, including 3 rebalances | −$1 | −$4 |
| Net vs holding the deposit | +$7 | +$310 |

The share figures are not the multiplier applied to the CPMM share, because a concentrated pool contains other concentrated providers competing for the same ticks. The multiplier describes how much depth your capital contributes; the share describes how much of the pool's active depth that turned out to be.

The concentrated position won here, and it did so while taking nearly four times the divergence and spending 42% of the period earning nothing. Change the pair to one that trended instead of oscillating and the same table inverts. The CLMM advantage is real and conditional; it is a bet that the pair stays near where you put it.

## 5. Rewards Are Not Fees

Raydium pools frequently carry emission rewards on top of swap fees. These are two different cash flows with two different lifespans, and quoting them as one annual rate obscures the only question worth asking: does the pool work when the reward ends?

Value emission tokens at a realisable price rather than at accrual spot, since every recipient is being paid in the same token and selling into the same depth. Then run the position with the reward line set to zero. If it is unattractive, the position is a trade on an emission schedule and needs an exit tied to that calendar. The full accounting is in [Yield Farming Explained](/guides/yield-farming-explained/), with the incentive design in [Liquidity Mining Explained](/guides/liquidity-mining-explained/) and the distinction developed in [Liquidity Mining vs Yield Farming vs Staking](/guides/liquidity-mining-vs-yield-farming/).

## 6. Solana-Specific Diligence

Most pool diligence transfers unchanged from Ethereum. Four items do not.

- **Token program and mint authority.** Confirm whether the mint authority and freeze authority are revoked, and whether the token uses extensions such as transfer hooks or transfer fees that change how a pool interacts with it. A pool holding a token whose authority can freeze accounts carries a risk no audit of the pool itself will surface.
- **Permissionless pool creation.** Anyone can create a pool for any mint, including one whose ticker imitates an established asset. Verify the mint address, not the symbol shown in an interface.
- **Program upgrade authority.** Solana programs can be upgradeable. Establish who holds the upgrade authority for the pool program and whether it is under a timelock or a multisig.
- **Flow durability rather than deposits.** Routed volume on Solana migrates between venues quickly. A pool with substantial deposits and declining routed flow pays a declining fee rate regardless of how it is shaped.

Everything else, including invariant behaviour, depth measurement and incentive analysis, follows the standard framework in [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/) and the failure taxonomy in [Liquidity Pool Risks](/guides/liquidity-pool-risks/). Structural analysis of automated market makers finds the same economic pressures across venues and chains: liquidity provision is compensated where volume is deep relative to volatility, and penalised where it is not [3][4].

## 7. Pre-Deposit Checklist

1. Pool type chosen deliberately, with CPMM as the default for anything you will not monitor.
2. Mint addresses verified for both assets, with authority status checked.
3. Thirty-day routed volume for the specific pool, from pool data rather than a listing page.
4. Liquidity already active near the current price, which is your dilution.
5. For a CLMM position, the fraction of the last thirty days the pair spent inside your proposed band.
6. What the position holds at each bound, computed before signing.
7. The whole return recomputed with rewards set to zero.

Both designs are usable. They fail differently, and the failure that surprises people is the concentrated one that quietly stopped earning while the interface still displayed a rate.

## Where to Go Next

Model the range decision in the [Uniswap v3 liquidity calculator](/tools/uniswap-v3-liquidity-calculator/), which implements the same tick mathematics Raydium's CLMM uses, and the divergence side in the [impermanent loss calculator](/tools/impermanent-loss-calculator/). For the Solana bin-based alternative, read [Meteora DLMM Strategy](/guides/meteora-dlmm-strategy/).

## References

1. [Raydium CLMM Program Repository](https://github.com/raydium-io/raydium-clmm)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
4. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
5. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
6. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://github.com/raydium-io/raydium-clmm "Raydium CLMM Program Repository"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)"
[4]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[5]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[6]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
