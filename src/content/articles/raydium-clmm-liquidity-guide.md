---
title: "Raydium Liquidity Pools: CLMM, CPMM and Choosing Between Them"
seoTitle: "Raydium Liquidity Pools: CLMM vs CPMM and How to Choose"
description: "How Raydium's concentrated and constant-product pools differ, what a CLMM position holds at each end of its range, and the Solana checks to run first."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "9 min read"
primaryQuery: "Raydium liquidity pool"
keywords: "Raydium liquidity pool, Raydium CLMM explained, how to provide liquidity on Raydium, Raydium liquidity pool fees, Raydium CPMM, Solana liquidity pools, Raydium liquidity pool rewards"
featured: false
faq:
  - q: "What is Raydium CLMM?"
    a: "Raydium's concentrated liquidity market maker, a tick-based pool modelled on Uniswap v3 where you fund a bounded price range instead of every price. Each position is an NFT. Inside the range the position quotes far more depth per dollar; outside it, the position holds a single token and earns no fees."
  - q: "What is the difference between Raydium CLMM and CPMM?"
    a: "A CPMM pool spreads liquidity across all prices under a constant-product rule, gives you a fungible LP token and needs no management. A CLMM pool concentrates liquidity inside bounds you choose, which raises fee income per dollar while in range but adds range maintenance, a larger shortfall against holding, and the chance of earning nothing while price sits outside."
  - q: "How do I provide liquidity on Raydium?"
    a: "Choose the pair and the pool type, and for a CLMM pool choose the fee tier and the price range. The interface works out the token ratio required at the current price, you approve both tokens, and the position NFT is minted. Check what the position will hold at each bound before signing."
  - q: "Does Raydium have impermanent loss?"
    a: "Yes, in both pool types. Any pricing curve that rebalances your tokens as the market moves leaves you behind simply holding them when price moves away from your entry. A bounded CLMM range magnifies that shortfall inside the bounds and converts the position fully to one token once price passes an edge."
  - q: "Are Raydium pool rewards the same as fees?"
    a: "No. Fees are a share of swap volume paid by traders. Rewards are tokens a pool or farm creator funds for a set period; on CLMM pools they go only to in-range positions and stop at the stream's end time. Model the position with rewards set to zero before deciding whether the pool is worth supplying."
---

Raydium runs several pool programs, but as a liquidity provider your first choice is between two designs.

One spreads your money across every price and asks nothing of you afterwards. The other concentrates it into a price band you choose, quotes far more depth per dollar, and can sit there earning nothing for weeks if you chose the band badly.

Most disappointing positions on this venue come from treating the second one like the first. By the end you will know what each holds, what each pays, and which Solana-specific checks to run before you deposit.

<figure class="article-figure">
  <img src="/images/guides/raydium-clmm-liquidity-guide.webp" alt="A constant-product curve beside a tick-bounded concentrated range, showing token composition at each bound." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Full-range constant product against a bounded tick range, and what each holds as price moves. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> On Solana the cost of managing a range is small, which removes the usual reason for leaving a position alone. That cuts both ways. Cheap transactions make narrow ranges practical, and they also make it painless to re-centre into a trend a dozen times and lock in the loss at every step. The cost that disciplined this behaviour on Ethereum is mostly absent here.

## Which of the two pools is which?

**The constant-product pool** quotes every price from zero to infinity. Raydium's current version is called CPMM, shown as the Standard AMM in its interface. Older AMM v4 pools work the same way for an LP [1]. You deposit both tokens in whatever ratio the pool currently holds and get back a fungible LP token. There is no range, nothing to maintain, and no way for the position to go idle.

The rule it follows never changes, and that rule is its invariant — the thing a pool keeps constant no matter what trades arrive.

$$
x \cdot y = k
$$

Where:

- $x$ is how much of the first token the pool holds.
- $y$ is how much of the second token it holds.
- $k$ is the number the pool keeps constant as it trades.

Most of that money backs prices the market will never visit, which is why this design earns so little per dollar. The mechanics are worked out in [The Constant Product Formula](/guides/constant-product-formula/).

**The concentrated pool**, CLMM, puts your money between a lower and an upper bound you pick. Inside that band it behaves like a constant-product pool with a much larger pretend reserve, so the depth at the current price is multiplied. Raydium built CLMM on the same tick accounting as Uniswap v3 [1] [5] [6]. Each position has its own bounds, so Raydium issues it as an NFT rather than a shared token [1].

| | Constant product (CPMM) | Concentrated (CLMM) |
| :--- | :--- | :--- |
| Prices it covers | All of them | Only between your bounds |
| Work your money does | Little per dollar | A lot, while in range |
| What you have to manage | Nothing | Watching and re-centring the range |
| Can it stop earning | No | Yes, the moment price leaves |
| Shortfall against holding | Standard | Magnified inside the band |
| Your claim | A fungible LP token | An NFT for each position |
| Reward emissions | Through a separate farm | Built into the pool, up to three tokens |
| Suits | Long-tail pairs, set and forget | Liquid pairs with an active operator |

The last two rows come from Raydium's own comparison of its pool programs [1].

## What will you actually be holding?

This is the part that surprises people, and it is entirely predictable before you deposit. The mix of a bounded position depends on where the price sits relative to your two bounds.

$$
x = L\left(\frac{1}{\sqrt{P}} - \frac{1}{\sqrt{P_b}}\right), \qquad y = L\left(\sqrt{P} - \sqrt{P_a}\right)
$$

Where:

- $P$ is the current price, and $P_a$ and $P_b$ are your lower and upper bounds.
- $L$ is the size of your position.
- $x$ and $y$ are how much of each token you hold.

Three outcomes follow. Below your lower bound you hold only the first token, because the pool bought it all the way down. Above your upper bound you hold only the second, because it sold all the way up. In between you hold a mix that shifts as price moves [3].

Read that plainly: a range is a promise to sell the token as it rises through your band, and to buy it as it falls. If you hold a token because you expect it to outperform, a tight upper bound means you sell it on the way up. See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) and [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/).

## How much harder does a narrow band work?

The fee tier belongs to the pool, not to your position, and it is fixed when the pool is created [2]. In October 2026 Raydium's CLMM tiers ran from 0.01% to 4%. Each tier comes with a tick spacing, from 1 for the lowest tiers to 120 for 1% and above, which sets how finely you can place your bounds [2] [3].

You do not keep the whole fee. Raydium sends 12% of each trade fee to the protocol and 4% to a fund, so a 0.25% pool pays its liquidity providers 0.21% of volume [4]. Picking a tier is a bid for order flow: a lower tier attracts routed volume, a higher one earns more per trade but may see fewer. The same logic as [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/) applies.

How much harder your money works is computable before you deposit.

$$
\frac{L_{\text{range}}}{L_{\text{full}}} = \frac{2\sqrt{P}}{2\sqrt{P} - \frac{P}{\sqrt{P_b}} - \sqrt{P_a}}
$$

Where:

- The left side is how many times more depth you provide than the same money spread across all prices.
- $P$ is the current price, with $P_a$ and $P_b$ your bounds.

The right-hand column below is an illustration, not a forecast. It assumes a pair with 80% annual volatility, no trend, and a range set at the start of a 30-day window.

| Band around the price | Times harder your money works | Share of 30 days in range |
| :--- | ---: | ---: |
| Plus or minus 2% | 100x | 13% |
| Plus or minus 5% | 40x | 30% |
| Plus or minus 10% | 20x | 53% |
| Plus or minus 25% | 8x | 88% |
| Plus or minus 50% | 4x | 99% |

The middle column is the number a marketing page quotes. The right column depends on your pair, so replace it with the share of the last thirty days your pair actually spent inside each band.

Multiply the two columns and the narrow bands still look best on fees alone. What the product leaves out is cost. While you are in range, your shortfall against holding grows by roughly the same multiplier, and every re-centre locks part of it in. Narrowing scales up both the fee income and that loss, so it magnifies whichever is larger rather than turning a losing pool into a winning one [7] [10]. [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/) works through how to choose a width.

## The same money, both ways

Take \$15,000 for 45 days in one Solana pair priced at \$100, in a 0.25% pool. Put it once in the constant-product pool and once in a band from \$90 to \$110. Over the period, \$30 million trades through the pool. You make no rebalances, and the price finishes 15% higher, at \$115, above your band.

| | Constant product | Concentrated, \$90 to \$110 |
| :--- | ---: | ---: |
| How hard the money works | 1x | 20x |
| Your share of liquidity at the trading price | 0.31% | 2.8% while in range |
| Fee income if always in range, after Raydium's cut | \$195 | \$1,764 |
| Share of the period in range | 100% | 58% |
| Fee income you actually keep | \$195 | \$1,023 |
| Shortfall against holding at the end | -\$39 | -\$722 |
| Transaction costs | -\$1 | -\$4 |
| **Net against just holding** | **+\$155** | **+\$297** |

The share of volume is not the multiplier applied to the first column. A concentrated pool is full of other concentrated providers competing for the same ticks. The multiplier says how much depth your money contributes. The share says how much of the pool's active depth that turned out to be.

The concentrated position won here. It did so while taking about eighteen times the shortfall against holding and earning nothing for 42% of the period. Now change one thing: the pair trends to \$130 and spends only a quarter of the period in your band. The concentrated position then nets about -\$1,355 against holding, while the constant-product position still nets about +\$47.

That pattern shows up in real data. Across 17 large Uniswap v3 pools, liquidity providers' losses against holding exceeded the fees they earned, \$260.1 million against \$199.3 million [9]. Studies of individual positions find that the bigger returns come only with more risk and active management [8].

## Why rewards are not fees

Raydium pools often carry reward emissions on top of swap fees. On a CLMM pool, up to three reward tokens can stream at once, each funded up front for a set period, and only in-range positions earn them [2]. Constant-product pools pay rewards through a separate farm instead [1].

Those are two different cash flows with two different lifespans. Quoting them as one annual rate hides the question worth asking: does this pool still work when the reward stops?

Value the reward token at what you could realistically sell it for, not at the price it accrues at. Everybody receiving it is selling into the same depth you are.

Then run the whole position again with the reward line set to zero. If it looks unattractive, you are trading an emission schedule, and you need an exit tied to its end date. The accounting is in [Yield Farming Explained](/guides/yield-farming-explained/), the incentive design in [Liquidity Mining Explained](/guides/liquidity-mining-explained/), and the distinction in [Liquidity Mining vs Yield Farming vs Staking](/guides/liquidity-mining-vs-yield-farming/).

## What is different about Solana?

Most pool checks carry over from Ethereum unchanged. Four do not.

- **The token's mint and freeze authority.** Confirm whether each has been revoked. Check too whether the token uses Token-2022 extensions, such as transfer fees, that change how a pool handles it; Raydium accepts only a vetted list of extensions [1]. A token whose authority can freeze accounts carries a risk no audit of the pool will surface.
- **Anyone can create a pool.** That includes a pool for a token whose ticker imitates an established asset. Verify the mint address, never the symbol an interface shows you.
- **Who can upgrade the program.** Solana programs can be upgradeable. Find out who holds that authority for the pool program, and whether a timelock or a multisig stands in front of it. Systems that look decentralised often keep this kind of power with a small group [11].
- **Whether the trading will last.** Volume on Solana moves between venues fast. A pool with large deposits and falling volume pays a falling fee rate, however well you shaped your position.

Everything else follows the standard framework in [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/) and the failure list in [Liquidity Pool Risks](/guides/liquidity-pool-risks/). The economics are the same on every chain: supplying liquidity pays where fees outrun what arbitrage takes from the pool, and that cost rises with how much the pair moves [7].

## What to check before you deposit

1. **The pool type, chosen deliberately**, with constant product as the default for anything you will not monitor.
2. **Mint addresses for both tokens**, with authority status checked on each.
3. **Thirty days of volume** for that specific pool, from pool data rather than a listing page.
4. **How much liquidity already sits near the current price.** That is your dilution.
5. **For a bounded position, the share of the last thirty days** the pair spent inside your proposed band.
6. **What the position holds at each bound**, computed before you sign.
7. **The whole return again, with rewards set to zero.**

Both designs are usable. They fail differently, and the failure that catches people out is the concentrated position that quietly stopped earning while the interface still showed a rate.

## Where to go next

Rebuild the worked example in the [concentrated liquidity calculator](/tools/uniswap-v3-liquidity-calculator/#price=100&lower=90&upper=110&capital=15000&tier=0.0025), which uses the same tick maths as Raydium, and test end prices in the [impermanent loss calculator](/tools/impermanent-loss-calculator/#mode=concentrated&a0=100&a1=115&capital=15000&lower=90&upper=110&fees=1023&days=45). For the bin-based alternative on Solana, read [Meteora DLMM Strategy](/guides/meteora-dlmm-strategy/).

## References

1. [CLMM overview (Raydium Docs)](https://docs.raydium.io/products/clmm/overview)
2. [CLMM fees and rewards (Raydium Docs)](https://docs.raydium.io/products/clmm/fees)
3. [Ticks and positions (Raydium Docs)](https://docs.raydium.io/products/clmm/ticks-and-positions)
4. [CPMM fees (Raydium Docs)](https://docs.raydium.io/products/cpmm/fees)
5. [Raydium CLMM Program Repository (Raydium, GitHub)](https://github.com/raydium-io/raydium-clmm)
6. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
7. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
8. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
9. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
10. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
11. [DeFi risks and the decentralisation illusion (Aramonte et al., BIS Quarterly Review, 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://docs.raydium.io/products/clmm/overview "CLMM overview (Raydium Docs)"
[2]: https://docs.raydium.io/products/clmm/fees "CLMM fees and rewards (Raydium Docs)"
[3]: https://docs.raydium.io/products/clmm/ticks-and-positions "Ticks and positions (Raydium Docs)"
[4]: https://docs.raydium.io/products/cpmm/fees "CPMM fees (Raydium Docs)"
[5]: https://github.com/raydium-io/raydium-clmm "Raydium CLMM Program Repository (Raydium, GitHub)"
[6]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core (Adams et al., 2021)"
[7]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[8]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[9]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[10]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[11]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (Aramonte et al., BIS Quarterly Review, 2021)"
