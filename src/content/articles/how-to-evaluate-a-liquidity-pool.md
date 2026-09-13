---
title: "How to Evaluate a Liquidity Pool: A Five-Part Research Framework"
description: "Five questions that tell you whether a pool is worth your money, in the order that matters, with the arithmetic that settles most cases in under a minute."
category: "Risk & Research"
date: 2026-08-25
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
keywords: "how to evaluate liquidity pool, DeFi LP due diligence, AMM pool evaluation, LVR hurdle rate, Uniswap v4 hook audit, active depth metrics, how to choose a liquidity pool, how to compare liquidity pools, liquidity pool due diligence, is providing liquidity profitable"
featured: true
faq:
  - q: "How do I choose a liquidity pool?"
    a: "Match the curve to the pair, check that fee income at realistic volume clears the volatility hurdle, verify the contracts and any hook, confirm depth at the price where trades actually happen, and decide whether you would hold either asset alone."
  - q: "How do I compare two liquidity pools?"
    a: "Normalise both to a net figure: fee-only yield at current routed volume with your capital added to the denominator, minus an estimate of divergence for the pair, minus gas for the management cadence each requires."
  - q: "Is a high APY liquidity pool safe?"
    a: "A persistently high rate is compensation for something specific: volatility, thin liquidity, emissions that will taper, or an unreviewed contract. Identify which before deciding whether the rate is adequate."
  - q: "Is liquidity providing worth it?"
    a: "It is worth it when fee income over your holding period exceeds the divergence the pair generates plus the gas your management cadence costs. That comparison is computable in advance for any pool with published volume data, and it answers the question far better than a quoted yield does."
  - q: "What is a good liquidity pool?"
    a: "One where the curve matches the pair, routed volume is high relative to the liquidity competing for it, the contracts are verified and unprivileged, and you would be content holding either asset alone. A high advertised rate is not on that list."
---

A pool showing 38% on \$50M looks like an easy decision. It tells you almost nothing.

That rate is yesterday's fees projected forward as though nothing changes. The \$50M counts money parked at prices nobody trades at. Neither number says whether you will make money.

Five questions do. This guide works through them in order, and the third one settles most cases on its own.

<figure class="article-figure">
  <img src="/images/guides/how-to-evaluate-a-liquidity-pool.webp" alt="A central pool is examined by connected instruments for assets, depth, fees, incentives, and controls." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A pool deserves a mechanism-by-mechanism review before capital is committed. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"A pool advertising 80% is usually a trap. If 60 points of that is a farm token being sold as fast as it is issued, and the other 20 is fees on a wildly volatile pair, your real return is negative. Split the yield into real trading fees and token issuance every time, then ask what the position looks like after a 20% drawdown."*

## One: does the curve match the pair?

Different pool designs fail in different ways. Putting a pair into the wrong one is the mistake that no amount of monitoring fixes.

| Pool design | What it does well | How it fails you |
| :--- | :--- | :--- |
| Range-based, Uniswap v3 and v4 | Packs money where trading happens | Price leaves your band, you hold the loser and earn nothing [1] [4] |
| Bin-based, Liquidity Book | Flat pricing inside each step, fees that adapt | Fast moves skip through empty steps [5] |
| Stable-pair, Curve | Near-zero cost around a peg | Past a certain imbalance the cost explodes and you hold the broken token [2] |
| Full range, Uniswap v2 | Nothing to manage, never runs dry | Most of your money never does any work |

The test is simple. Ask what this pair actually does, then ask which design is built for that. A high-amplification stable curve on two tokens that might genuinely diverge is not a yield opportunity. It is a wager that they will not. See [Constant Product Formula](/guides/constant-product-formula/).

## Two: how much of the money is actually working?

The headline total counts everything in the contract. Only the part near the current price fills trades or earns fees [6].

| Pool holding \$50,000,000 | |
| :--- | ---: |
| Parked in ranges nowhere near the price | \$35,000,000, earning nothing |
| Working within reach of the price | \$15,000,000, doing all the work |

So read the liquidity-by-price chart, not the headline. Two things to pull from it:

- **How much sits within 2% of the price?** That is what absorbs a real order. A pool with \$10M on the dashboard and \$200,000 near the price is thin, and a single trade will prove it.
- **How busy is that money?** Divide daily volume by the money near the price. Between 0.2 and 5 is healthy. Below 0.2 and your capital is sitting still while carrying full risk [6].

See [TVL Explained](/guides/tvl-explained/).

## Three: does the fee income beat the bleed?

This is the question that decides most pools, and it takes about a minute.

Your pool quotes a price one block behind the real market. Faster traders take the difference all day. That cost is loss-versus-rebalancing, or LVR — value handed over purely because the quote is late [3].

$$
\text{Annual bleed} \approx \frac{\sigma^2}{8}
$$

Where:

- $\sigma$ is the pair's annual volatility, so 80% means $\sigma = 0.80$.

This is the yearly bleed as a share of a full-range position. A concentrated band bleeds faster, in proportion to how much harder its money works.

Work it for a real pair. At 80% volatility the bleed is 8.0% a year. If the pool earns 5.0% from actual trading fees, it loses 3.0% a year on average. Every day the money stays there, arbitrage takes more than trading pays.

| Pair volatility | Full-range fee yield you need to break even |
| :--- | ---: |
| 40% | 2.0% |
| 60% | 4.5% |
| 80% | 8.0% |
| 100% | 12.5% |
| 150% | 28.1% |

Then check where the volume comes from [7]. Trades routed by aggregators, bots people use to buy tokens, and ordinary wallets are customers. Trades placed by arbitrage contracts at the top of blocks are not. Above roughly 70% of the second kind and the fee pool is being funded out of your principal. That is a harsher measure than impermanent loss — the simple gap between a pool position and holding — which at least reverses if the price returns. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## Four: who else is taking a cut?

How transactions get ordered on a given chain changes what actually reaches you.

In range-based pools, check for fee sniping [8]. A bot sees a large trade coming, floods the exact price with liquidity, takes almost the whole fee, and withdraws in the same block. Where that happens regularly, the advertised rate is mostly going to searchers while passive depositors carry the volatility.

The chain matters too. Ethereum has a mature, aggressive market for transaction ordering, so arbitrage and sandwiching are fast and precise. Rollups usually have a single sequencer, which means less sandwiching but a new risk: if the sequencer goes down during a volatile hour, your money is stuck. All of this is MEV — value taken by controlling the order transactions run in. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## Five: what can go wrong with the code and the tokens?

Four layers, each of which can fail on its own: the chain, the core pool contract, any code attached to the pool, and the tokens themselves.

**If it is a v4 pool, read the hook** [4]. Can it interfere with adding or removing liquidity? Is it behind an upgradeable proxy with a key somebody holds? Can it change the fee without limit?

**Trace each token to what backs it.** For staked and restaked ETH tokens, how long is the redemption queue and what can go wrong upstream? For synthetic dollars, where is the hedge held and what happens if funding inverts [2]? For tokenised real-world assets, can a transfer restriction freeze your withdrawal?

See [Liquidity Pool Risks](/guides/liquidity-pool-risks/).

## What people get wrong when evaluating pools

| What people assume | What actually happens |
| :--- | :--- |
| The rate on the dashboard is the rate | It extrapolates yesterday forward and counts none of the bleed or range breaches |
| An audited protocol means an audited pool | The core is audited. The hook attached to your pool is somebody else's code |
| A stable-pair curve prevents depegs | It holds the price flat until roughly 85/15 imbalance, then falls away suddenly |
| A staked token is as liquid as the real thing | It trades near par until people want out, then the queue is the whole story |

## The scorecard

| The question | What you are checking | Reject if |
| :--- | :--- | :--- |
| Does the curve fit | The design matches what the pair does | A flat stable curve on tokens that can genuinely diverge |
| Is the money working | Depth within 2% of the price | Big headline, almost nothing near the price [6] |
| Does the maths work | Real fee yield against the bleed | Fee yield under half the bleed, or volume over 70% arbitrage [3] [7] |
| Who takes a cut | Fee sniping and ordering | Regular same-block fee capture in recent history [8] |
| What can break | Hooks, tokens, price feeds | A mutable hook nobody audited, or a multi-week redemption queue [4] |

See the [Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/) for the operational version.

## Where to watch the numbers

- **Comparing pools across protocols:** [DeFiLlama Yields](https://defillama.com/yields) for stability, volume against size, and reward schedules.
- **Contracts, keys and delays:** [Etherscan](https://etherscan.io).
- **Backtesting what a position would have done:** [Revert Finance](https://revert.finance).

## When a pool fails a check

- **Volume against pool size is under 0.05.** The capital is not being used. Reject it, unless rewards are large and durable enough to justify locking money up.
- **One address holds over 40% of the pool.** When they leave, depth collapses and your exit gets expensive. Watch that address, and size so you can get out first.
- **Rewards are over 70% of the advertised rate.** This is money chasing issuance. When it stops, the pool empties and you are holding a depreciating farm token. Harvest and sell daily, or avoid it.

## Where to go next

Match the curve to the pair in [Types of Liquidity Pools](/guides/liquidity-pool-types/), then price the income with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) and the cost with the [impermanent loss calculator](/tools/impermanent-loss-calculator/). The decisive comparison is in [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/). Exit capacity is in [Token Liquidity Analysis](/guides/token-liquidity-analysis/), and the yield-provenance test in [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

## References

1. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Curve StableSwap Exchange Architecture Overview](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
3. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
4. [Uniswap v4 Core Whitepaper](https://uniswap.org/whitepaper-v4.pdf)
5. [Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)](https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873)
6. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
7. [Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)](https://arxiv.org/abs/2404.05803)
8. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
9. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
10. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[2]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange Architecture Overview"
[3]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[4]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[5]: https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873 "Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)"
[6]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[7]: https://arxiv.org/abs/2404.05803 "Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)"
[8]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[9]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[10]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
