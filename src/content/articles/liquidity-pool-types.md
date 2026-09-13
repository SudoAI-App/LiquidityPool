---
title: "Types of Liquidity Pools: Matching the Curve to the Pair"
description: "Six pool families, what each one is built for, and what the same deposit does in each. Picking the wrong one is the most common mistake, and the quietest."
category: "Foundations"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Aria Chen"
readTime: "7 min read"
keywords: "types of liquidity pools, liquidity pool types, stablecoin liquidity pool, weighted liquidity pool, correlated asset liquidity pool, lending pool vs liquidity pool"
featured: false
faq:
  - q: "What are the main types of liquidity pools?"
    a: "Constant-product pools spanning all prices, concentrated liquidity pools that restrict depth to a chosen range, amplified stable pools for pegged assets, weighted multi-asset pools, discrete bin pools that quote in fixed steps, and lending pools, which are a different instrument that shares the name."
  - q: "Which liquidity pool type is best for stablecoins?"
    a: "An amplified stable curve, because it holds price near the peg with very low slippage for the bulk of trading. The trade-off is that the same flatness causes the pool to absorb large quantities of an asset that is depegging before price impact rises meaningfully."
  - q: "What is the difference between a lending pool and a liquidity pool?"
    a: "A lending pool matches suppliers with borrowers and pays interest set by a utilisation curve, with no automated price quoting and no divergence loss. A liquidity pool quotes prices for swaps from its reserves, so the supplier is short volatility rather than long a credit exposure."
  - q: "Do 80/20 weighted pools reduce impermanent loss?"
    a: "They reduce it relative to a 50/50 pool for the same price move, because less of the portfolio rotates. They do not eliminate it, and they leave the position with more concentrated directional exposure to the heavier asset."
---

Every pool is a rule that turns what it holds into a price. The rule decides how much depth sits near the market, how fast your holdings flip from one token to the other, and which specific disaster you are being paid to absorb.

So picking a pool is really picking a rule, and the right rule depends entirely on how the pair behaves. A pair that barely moves wants a different shape from one that moves 4% a day.

This guide runs through six families by what they are built for, not by brand, and then shows what the same deposit does in each.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-types.webp" alt="Price curves for constant product, amplified stable and weighted pools beside cards describing four pool families." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Three invariants plotted against reserve ratio, with the exposure each pool family hands its liquidity providers. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"Most disappointing outcomes I look at are not bad luck. They are the wrong curve. A staked-ETH token paired against ETH belongs on a flat curve. Put it on an ordinary one and most of your money sits at prices that pair will never reach, and you pay for that in fees you never earn."*

## The six families at a glance

| Family | Built for | What you give up | How it fails |
| :--- | :--- | :--- | :--- |
| Full range | Anything, with no attention | Most of your money never works | Ordinary divergence from holding |
| Chosen range | Earning much more per dollar | It needs watching | Price leaves, you earn nothing |
| Flat stable curve | Pairs meant to hold a ratio | Almost nothing, until the ratio breaks | You absorb the broken token |
| Weighted | Keeping exposure to one token | Depth on the light side, and routing | Concentrated in whatever you weighted |
| Stepped bins | Precise control over placement | Active management | A fast move skips empty steps |
| Lending | A completely different thing | No swap fees at all | Bad debt and withdrawal limits |

## Full range: nothing to manage, most of it idle

The original design keeps the two balances multiplied together at a fixed number, across every price from zero upward [1]. The pool can always quote, at any price, and it can never be emptied.

**What it does well.** Nothing to manage, never runs dry, never goes out of range. You can genuinely ignore it.

**What it costs.** Almost all your money backs prices the market will never visit. It earns nothing there.

**Who it suits.** Passive positions, unpredictable pairs, and anyone who will not actually monitor a range. See [Constant Product Formula](/guides/constant-product-formula/).

## Chosen range: more fees, more attention

Range-based pools let you set two prices and put all your money between them [2]. The narrower the band, the more each dollar earns while the price stays inside it.

**What it does well.** Much higher fee income per dollar, sometimes by a factor of fifty.

**What it costs.** Your attention, and everything the moment the price leaves. Out of range you earn nothing and hold only the token that fell.

**Who it suits.** Pairs where you have a view on the range, and people who will actually check on it. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/) and [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

## Flat stable curves: superb, right up to the cliff

For pairs meant to trade at a fixed ratio, the curve is nearly flat around that ratio and steepens as the balances skew [3].

**What it does well.** Enormous trades at almost no cost. That is why these pools dominate stablecoin volume.

**What it costs.** A rare and severe tail. If one token breaks its peg, the flat part means the pool keeps buying it at almost full price until the healthy side is gone.

**Who it suits.** Fiat stablecoin pairs, staked-ETH tokens against ETH, wrapped versions of the same asset. See [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

## Weighted: keeping the exposure you wanted

Rather than an even split, you choose the proportions. An 80/20 pool holds most of its value in one token while still quoting both.

$$
\prod_i B_i^{w_i} = k
$$

Where:

- $B_i$ is how much of token $i$ the pool holds.
- $w_i$ is that token's share of value, and all the weights add up to 1.
- $k$ is the number the pool keeps level.

The consequence is what matters. Less of the position rotates for a given price move, so you fall less far behind holding, and you keep more exposure to the heavy token.

**What it costs.** Thin depth on the light side, so exits hurt, and routers often skip you.

**Who it suits.** Treasuries, long-term holders, and token launches where a project has no large pile of the quote asset. See [Balancer Weighted Pools](/guides/balancer-and-weighted-pools/), and for the version that follows a moving price automatically, [Curve v2 Explained](/guides/curve-v2-cryptoswap-explained/).

## Stepped bins: placing money exactly where you want it

Bin designs quote one fixed price per step, so a trade inside a step costs nothing extra, and the price moves in jumps [4]. You decide how much goes in each step.

**What it does well.** Real control. You can build shapes a single band cannot express, including one-sided ladders that work as limit orders.

**What it costs.** A fast move can jump through empty steps, and shapes need managing.

**Who it suits.** Anyone running this actively. See [DLMM Explained](/guides/discretized-liquidity-dlmm-explained/).

## Lending pools share the word and nothing else

Worth stating plainly because the confusion causes real mistakes. You deposit one token, somebody borrows it against collateral, you earn interest set by how much is borrowed. No price quoting, no rotation, no divergence.

| | Liquidity pool | Lending pool |
| :--- | :--- | :--- |
| What you put in | Two or more tokens, in ratio | One token |
| Where income comes from | Swap fees | Borrower interest |
| Main risk | Divergence, and faster traders | Bad debt, price feed failure, liquidations |
| What limits it | Depth at the traded price | How much is already borrowed |
| Getting out | Any block | Blocked if everything is lent out |

Both are legitimate. Confusing them produces the wrong position size and the wrong things to watch.

## The same deposit, four ways

Put \$25,000 into an ETH/USDC pair and hold it while ETH rises 35%.

| Structure | Shortfall against holding | Fee income | What you hold at the end |
| :--- | ---: | :--- | :--- |
| Full range | about -1.1% | Low | Both tokens, less ETH than before |
| Chosen range, plus or minus 10% | about -12.3% | High, but only until ETH passes the top of the band | All USDC, sold on the way to the top |
| 80/20 weighted toward ETH | about -0.7% | Low to moderate | Mostly ETH |
| Flat stable curve, wrong fit | Not applicable | Almost none | Money sitting where nothing trades |

None of these is a forecast. Each shortfall follows from the rule and the price move. The narrow band looks worst because the last 25% of the rally happened after it had already sold all its ETH. The last row is there on purpose, because putting a volatile pair on a pegged-asset curve is the most common structural mistake, and it produces no dramatic loss. Just capital earning nothing, quietly, for months.

## The same curve appears under many names

Branding hides how much overlap there is. A range-based pool on one chain and a fork of it on another are the same rule with different step sizes and tiers. A flat stable curve appears under several names with different default settings.

So the questions transfer. Whatever it is called, ask which rule prices the trades, what the settings are, where the curve is flat and where it bends, and what you hold at each extreme.

The one thing branding does tell you is maturity. The same mathematics in an unaudited fork, with somebody holding a key over the fee setting, is a completely different risk from a long-lived deployment with immutable contracts. Read the rule to understand the exposure. Read the deployment to understand who you are trusting.

## What people get wrong about pool types

| What people assume | What actually happens |
| :--- | :--- |
| A stable curve is the safe choice | It is the safe choice for pairs that genuinely hold their ratio, and the worst one otherwise |
| A tighter range is a better pool | It is the same pool with more of your money exposed. Higher fees, higher bleed, more attention |
| More tokens in a pool means diversification | One broken token in a multi-asset pool drains the healthy ones |
| A lending pool is a lower-risk liquidity pool | Different instrument. Different income, different risks, different way of being stuck |

## How to pick

1. **Classify the pair first.** Pegged, correlated, or independent. That alone rules out most curves.
2. **Look at how it has actually moved** over one to three months. Not how you feel about it.
3. **Pick the rule that puts depth where the pair trades.** That is the whole decision.
4. **If it is range-based, size the band to the volatility**, not to a yield you would like.
5. **Check where the volume actually goes.** The perfect curve with no flow earns nothing.
6. **Name the failure you are accepting.** Out of range, peg absorption, or gapping. Say it out loud.
7. **Check the specific deployment**, not the family. Audits and admin keys are per-contract.

The question is never which pool type is best. It is which pricing rule you want standing in the market on your behalf when this particular pair moves.

## Where to go next

Once the curve is chosen, size the position with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) and check impermanent loss — the gap between a pool position and simply holding — with the [impermanent loss calculator](/tools/impermanent-loss-calculator/). Lending markets are compared properly in [Lending Pool vs Liquidity Pool](/guides/lending-pool-vs-liquidity-pool/).

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [StableSwap: efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)](https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873)
5. [Balancer Whitepaper: A non-custodial portfolio manager and liquidity provider](https://balancer.fi/whitepaper.pdf)
6. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
7. [When Does the Tail Wag the Dog? Curvature and Market Making (Angeris et al., 2020)](https://arxiv.org/abs/2012.08040)
8. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap: efficient mechanism for Stablecoin liquidity"
[4]: https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873 "Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)"
[5]: https://balancer.fi/whitepaper.pdf "Balancer Whitepaper"
[6]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[7]: https://arxiv.org/abs/2012.08040 "When Does the Tail Wag the Dog? Curvature and Market Making (Angeris et al., 2020)"
[8]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
