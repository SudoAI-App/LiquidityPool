---
title: "Raydium Liquidity Pools: CLMM, CPMM and Choosing Between Them"
description: "How Raydium's concentrated and constant-product pools differ, what a CLMM position holds at each end of its range, and the Solana checks to run first."
category: "LP Mechanics"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Aria Chen"
readTime: "8 min read"
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

Raydium gives you two kinds of pool, and picking between them is your first decision.

One spreads your money across every price and asks nothing of you afterwards. The other concentrates it into a price band you choose, quotes far more depth per dollar, and can sit there earning nothing for weeks if you chose the band badly.

Most disappointing positions on this venue come from treating the second one like the first. This guide shows you what each holds, what each pays, and the four Solana-specific checks that do not carry over from Ethereum.

<figure class="article-figure">
  <img src="/images/guides/raydium-clmm-liquidity-guide.webp" alt="A constant-product curve beside a tick-bounded concentrated range, showing token composition at each bound." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Full-range constant product against a bounded tick range, and what each holds as price moves. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"On Solana the cost of managing a range is trivial, which removes the usual excuse for leaving a position alone. That cuts both ways. Cheap rebalancing makes narrow ranges practical, and it also makes it painless to re-centre into a trend twelve times and realise the loss at every step. The constraint that disciplined the behaviour on Ethereum is simply absent here."*

## Which of the two pools is which?

**The constant-product pool** quotes every price from zero to infinity. You deposit both tokens in whatever ratio the pool currently holds and get back a fungible claim. There is no range, nothing to maintain, and no way for the position to go idle.

The rule it follows never changes, and that rule is its invariant — the thing a pool keeps constant no matter what trades arrive.

$$
x \cdot y = k
$$

Where:

- $x$ is how much of the first token the pool holds.
- $y$ is how much of the second token it holds.
- $k$ is the number the pool keeps constant as it trades.

Most of that money backs prices the market will never visit, which is why this design earns so little per dollar. The mechanics are worked out in [The Constant Product Formula](/guides/constant-product-formula/).

**The concentrated pool** puts your money between a lower and an upper bound you pick. Inside that band the pool behaves like a constant-product pool with a much larger pretend reserve, so the depth at the current price is amplified. Raydium follows the same tick accounting as Uniswap v3 [1][2]. Each position has its own bounds, so your claim is not fungible with anyone else's.

| | Constant product | Concentrated |
| :--- | :--- | :--- |
| Prices it covers | All of them | Only between your bounds |
| Work your money does | Little per dollar | A lot, while in range |
| What you have to manage | Nothing | Watching and re-centring the range |
| Can it stop earning | No | Yes, the moment price leaves |
| Shortfall against holding | Standard | Amplified inside the band |
| Your claim | A fungible pool token | Per-position state |
| Suits | Long-tail pairs, set and forget | Liquid pairs with an active operator |

## What will you actually be holding?

This is the part that surprises people, and it is entirely predictable before you deposit. The composition of a bounded position depends on where the price sits relative to your two bounds.

$$
x = L\left(\frac{1}{\sqrt{P}} - \frac{1}{\sqrt{P_b}}\right), \qquad y = L\left(\sqrt{P} - \sqrt{P_a}\right)
$$

Where:

- $P$ is the current price, and $P_a$ and $P_b$ are your lower and upper bounds.
- $L$ is the size of your position.
- $x$ and $y$ are how much of each token you end up holding.

Three outcomes follow. Below your lower bound you hold nothing but the first token, because the pool bought all the way down. Above your upper bound you hold nothing but the second, because it sold all the way up. In between you hold a mixture that shifts as price moves.

Read that plainly: a range is a promise to sell the asset as it rises through your band, and to buy it as it falls. If you hold a token because you expect it to outperform, a tight upper bound guarantees you sell it on the way. See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) and [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/).

## How much harder does a narrow band work?

Concentrated pools come at several fee tiers, and the tier belongs to the pool rather than to your position. Picking one is a bid for order flow. A lower tier attracts routed volume from aggregators. A higher tier earns more per trade but may see fewer of them. The same logic as [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/) applies.

How much harder your money works is computable before you deposit.

$$
\frac{L_{\text{range}}}{L_{\text{full}}} = \frac{2\sqrt{P}}{2\sqrt{P} - \frac{P}{\sqrt{P_b}} - \sqrt{P_a}}
$$

Where:

- The left side is how many times more depth you provide than the same money spread across all prices.
- $P$ is the current price, with $P_a$ and $P_b$ your bounds.

| Band around the price | Times harder your money works | Roughly how much of the time it is in range |
| :--- | ---: | ---: |
| Plus or minus 2% | 100x | 18% |
| Plus or minus 5% | 40x | 37% |
| Plus or minus 10% | 20x | 58% |
| Plus or minus 25% | 8x | 81% |
| Plus or minus 50% | 4x | 93% |

The middle column is what a marketing page quotes at you. The right column decides your outcome, and it is specific to your pair. Substitute the share of the last thirty days your candidate pair actually spent inside each band.

Multiply the two columns together and you get the thing you are really trying to maximise. It peaks somewhere in the middle, never at the narrow end. [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/) derives that properly.

## The same money, both ways

Take \$15,000 for 45 days on one Solana pair, once in the constant-product pool and once in a plus or minus 10% band.

| | Constant product | Concentrated, 10% band |
| :--- | ---: | ---: |
| How hard the money works | 1x | 20x |
| Share of routed volume you capture | 0.31% | 2.8% |
| Fee income while active | \$196 | \$1,772 |
| Share of the period in range | 100% | 58% |
| Fee income you actually keep | \$196 | \$1,028 |
| Divergence over the period | -\$188 | -\$714 |
| Transaction costs, three rebalances included | -\$1 | -\$4 |
| **Net against just holding** | **+\$7** | **+\$310** |

Note that the share of volume is not the multiplier applied to the first column. A concentrated pool is full of other concentrated providers competing for the same ticks. The multiplier says how much depth your capital contributes. The share says how much of the pool's active depth that turned out to be.

The concentrated position won here. It did so while taking nearly four times the shortfall against holding and spending 42% of the period earning nothing at all. Swap in a pair that trended instead of oscillating and the table inverts. The advantage is real, and it is a bet that the pair stays near where you put it.

## Why rewards are not fees

Raydium pools often carry emission rewards on top of swap fees. Those are two different cash flows with two different lifespans, and quoting them as one annual rate hides the only question worth asking: does this pool still work when the reward stops?

Value the reward token at what you could realistically sell it for, not at the price it accrues at. Everybody receiving it is selling into the same depth you are.

Then run the whole position again with the reward line set to zero. If it looks unattractive, you are trading an emission schedule and you need an exit tied to that calendar. The accounting is in [Yield Farming Explained](/guides/yield-farming-explained/), the incentive design in [Liquidity Mining Explained](/guides/liquidity-mining-explained/), and the distinction in [Liquidity Mining vs Yield Farming vs Staking](/guides/liquidity-mining-vs-yield-farming/).

## What is different about Solana?

Most pool diligence carries over from Ethereum unchanged. Four items do not.

- **The token's mint and freeze authority.** Confirm both are revoked, and check whether the token uses extensions such as transfer hooks or transfer fees that change how a pool handles it. A token whose authority can freeze accounts carries a risk no audit of the pool will surface.
- **Anyone can create a pool.** That includes a pool for a token whose ticker imitates an established asset. Verify the mint address, never the symbol an interface shows you.
- **Who can upgrade the program.** Solana programs can be upgradeable. Find out who holds that authority for the pool program, and whether a timelock or a multisig stands in front of it.
- **Whether the flow will last.** Volume on Solana migrates between venues fast. A pool with large deposits and falling routed flow pays a falling fee rate no matter how well you shaped your position.

Everything else follows the standard framework in [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/) and the failure list in [Liquidity Pool Risks](/guides/liquidity-pool-risks/). Structural work on automated market makers finds the same pressures across every venue and chain. Supplying liquidity is paid where volume is deep relative to how much the pair moves, and penalised where it is not [3][4].

## What people get wrong about Raydium pools

| What people assume | What actually happens |
| :--- | :--- |
| A 20x multiplier means 20x the fees | Only while in range, and only against the providers beside you |
| Concentrated is simply better | It is better on a pair that stays put, worse on one that trends |
| Cheap gas means rebalance freely | Each re-centre still locks in the loss, gas or no gas |
| The ticker identifies the token | Anyone can create a pool. Check the mint address |
| Rewards and fees are the same income | One is paid by traders, the other has an end date |

## What to check before you deposit

1. **The pool type, chosen deliberately**, with constant product as the default for anything you will not monitor.
2. **Mint addresses for both tokens**, with authority status checked on each.
3. **Thirty days of routed volume** for that specific pool, from pool data rather than a listing page.
4. **How much liquidity already sits near the current price.** That is your dilution.
5. **For a bounded position, the share of the last thirty days** the pair spent inside your proposed band.
6. **What the position holds at each bound**, computed before you sign.
7. **The whole return again, with rewards set to zero.**

Both designs are usable. They fail differently, and the failure that catches people out is the concentrated one that quietly stopped earning while the interface still displayed a rate.

## Where to go next

Model the range decision in the [Uniswap v3 liquidity calculator](/tools/uniswap-v3-liquidity-calculator/), which implements the same tick mathematics Raydium uses, and the shortfall side in the [impermanent loss calculator](/tools/impermanent-loss-calculator/). For the Solana bin-based alternative, read [Meteora DLMM Strategy](/guides/meteora-dlmm-strategy/).

## References

1. [Raydium CLMM Program Repository](https://github.com/raydium-io/raydium-clmm)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
4. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
5. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
6. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://github.com/raydium-io/raydium-clmm "Raydium CLMM Program Repository"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[4]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[5]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[6]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
