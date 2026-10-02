---
title: "How to Evaluate a Liquidity Pool: A Five-Part Research Framework"
seoTitle: "How to Evaluate a Liquidity Pool: A Five-Part Framework"
description: "Five questions that tell you whether a pool is worth your money, in the order that matters, with the arithmetic that settles most cases in under a minute."
category: "Risk & Research"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "how to evaluate liquidity pool"
keywords: "how to evaluate liquidity pool, DeFi LP due diligence, AMM pool evaluation, LVR hurdle rate, Uniswap v4 hook audit, active depth metrics, how to choose a liquidity pool, how to compare liquidity pools, liquidity pool due diligence"
featured: true
faq:
  - q: "How do I choose a liquidity pool?"
    a: "Match the curve to the pair, check that fee income at realistic volume clears the volatility hurdle, verify the contracts and any hook, confirm depth at the price where trades actually happen, and decide whether you would hold either asset alone."
  - q: "How do I compare two liquidity pools?"
    a: "Normalise both to a net figure: fee-only yield at current routed volume with your capital added to the denominator, minus an estimate of the pair's loss to arbitrage, minus gas for the management cadence each requires."
  - q: "Is a high APY liquidity pool safe?"
    a: "A persistently high rate is compensation for something specific: volatility, thin liquidity, emissions that will taper, or an unreviewed contract. Identify which before deciding whether the rate is adequate."
  - q: "Is liquidity providing worth it?"
    a: "It is worth it when fee income over your holding period exceeds what the pair loses to arbitrage plus the gas your management cadence costs. That comparison can be estimated in advance for any pool with published volume data, and it answers the question far better than a quoted yield does."
  - q: "What is a good liquidity pool?"
    a: "One where the curve matches the pair, routed volume is high relative to the liquidity competing for it, the contracts are verified and unprivileged, and you would be content holding either asset alone. A high advertised rate is not on that list."
---

A pool showing 38% on \$50M looks like an easy decision. It tells you almost nothing.

That rate is yesterday's fees projected forward as though nothing changes. The \$50M counts money parked at prices nobody trades at. Neither number says whether you will make money.

Five questions do. By the end you will be able to reject most unsuitable pools in a few minutes, and the third question settles most cases on its own.

<figure class="article-figure">
  <img src="/images/guides/how-to-evaluate-a-liquidity-pool.webp" alt="A central pool is examined by connected instruments for assets, depth, fees, incentives, and controls." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A pool deserves a mechanism-by-mechanism review before capital is committed. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Split an advertised rate into trading fees and token issuance before anything else. Take an 80% rate where 60 points are a reward token sold as fast as it is issued and 20 points are fees on a pair with 150% annual volatility. The fees fall short of the roughly 28% a year a full-range position on that pair loses to arbitrage. Then ask what the position looks like after a 20% drawdown.

## One: does the curve match the pair?

Different pool designs fail in different ways [8]. Putting a pair into the wrong one is a mistake that no amount of monitoring fixes.

| Pool design | What it does well | How it fails you |
| :--- | :--- | :--- |
| Range-based, Uniswap v3 and v4 | Packs money where trading happens | Price leaves your band, you end up holding only the weaker token and earn nothing [1] |
| Bin-based, Liquidity Book | Flat pricing inside each price step, fees that rise with volatility [5] | Fast moves run through steps where little liquidity sits |
| Stable-pair, Curve | Very low cost while the two tokens stay close in price | As the pool becomes unbalanced the curve shifts toward constant-product pricing, and you hold more of the token people are selling [2] |
| Full range, Uniswap v2 | Nothing to manage, never runs dry | Most of your money never does any work |

That last row is not an exaggeration. Uniswap's own documentation notes that the v2 DAI/USDC pair used about 0.50% of its capital for trading between \$0.99 and \$1.01, where most of its volume happened [1].

The test is simple. Ask what this pair actually does, then ask which design is built for that. A high-amplification stable curve on two tokens that might genuinely diverge is not a yield opportunity. It is a wager that they will not. The design families are compared in [Types of Liquidity Pools](/guides/liquidity-pool-types/), and the baseline curve in [Constant Product Formula](/guides/constant-product-formula/). Lending markets are a different instrument rather than another row in this table — that comparison is in [Lending Pool vs Liquidity Pool](/guides/lending-pool-vs-liquidity-pool/).

## Two: how much of the money is actually working?

The headline total counts everything in the contract. In a range-based pool, only positions whose range includes the current price fill trades or earn fees [1].

| Pool holding \$50,000,000 | |
| :--- | ---: |
| Parked in ranges nowhere near the price | \$35,000,000, earning nothing |
| Working within reach of the price | \$15,000,000, doing all the work |

So read the liquidity-by-price chart, not the headline. Pull two numbers from it.

- **How much sits within 2% of the price?** That is what absorbs a real order. A pool with \$10M on the dashboard and \$200,000 near the price is thin, and a single large trade will show it.
- **How busy is that money?** Divide daily volume by the money near the price. Multiply the result by the fee tier and by 365, and you have the gross fee yield on the working money before any losses.

Two examples show the range. A turnover of 0.2 a day at a 0.05% fee tier earns 0.2 × 0.0005 × 365, or about 3.7% a year. The same turnover at a 0.30% tier earns about 21.9%. That gross figure is the input to question three. See [TVL Explained](/guides/tvl-explained/).

## Three: does the fee income beat the bleed?

This is the question that decides most pools, and it takes about a minute.

Your pool quotes a price that lags the wider market. Faster traders take the difference all day. That cost is loss-versus-rebalancing, or LVR — the value a pool gives up to arbitrageurs compared with a portfolio that holds the same tokens and rebalances at market prices [3]. For a full-range constant-product pool it has a simple estimate.

$$
\text{Annual bleed} \approx \frac{\sigma^2}{8}
$$

Where:

- $\sigma$ is the pair's annual volatility, so 80% means $\sigma = 0.80$.

The result is the yearly bleed as a share of a full-range position, before fees. A concentrated band bleeds faster, roughly in proportion to how much more liquidity it supplies per dollar. Because volatility is squared, doubling it quadruples the bleed.

Work it for a real pair. At 80% volatility the bleed is 8.0% a year. If the pool earns 5.0% from trading fees, the position trails the rebalancing benchmark by about 3.0% a year on average. Arbitrage takes more than trading pays.

| Pair volatility | Full-range fee yield you need to break even against rebalancing |
| :--- | ---: |
| 40% | 2.0% |
| 60% | 4.5% |
| 80% | 8.0% |
| 100% | 12.5% |
| 150% | 28.1% |

Then check where the volume comes from. Trades routed by aggregators, trading apps and ordinary wallets are customers. Trades placed by arbitrage contracts at the top of each block are correcting your stale price. A large empirical study found that losses to arbitrageurs exceeded the fees earned across many of the largest Uniswap pools [6]. The more of a pool's volume is arbitrage, the more of its fee income is offset by that loss.

LVR is a stricter measure than impermanent loss — the shortfall against simply holding the two tokens — which disappears if the price returns to where you entered. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## Four: who else is taking a cut?

How transactions get ordered on a given chain changes what actually reaches you.

In range-based pools, check for just-in-time liquidity, sometimes called fee sniping. A bot sees a large trade coming, adds a large amount of liquidity at exactly that price, takes most of the fee, and withdraws in the same block [7]. Uniswap Labs found it rare across all of Uniswap v3: about 0.3% of liquidity demand between May 2021 and July 2022, aimed at very large swaps [7]. Those large swaps are where passive depositors earn their biggest fees, so check a pool's own history rather than the average.

The chain matters too. Many rollups run a single sequencer, the operator that decides transaction order [10]. That changes how ordering profits are made, but it adds a new risk. If the sequencer halts during a volatile hour, you may be unable to adjust until it restarts or you force a transaction through the slower route via Ethereum [10]. Value taken by whoever controls transaction order is called MEV, short for maximal extractable value. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## Five: what can go wrong with the code and the tokens?

Four layers can each fail on their own: the chain, the core pool contract, any code attached to the pool, and the tokens themselves.

**If it is a v4 pool, read the hook.** Uniswap v4 lets a pool creator attach a hook contract that runs at set points in the pool's operations and can manage the pool's swap fee [4]. Can it interfere with adding or removing liquidity? Is it behind an upgradeable proxy with a key somebody holds? Can it change the fee without limit?

**Trace each token to what backs it.** For staked and restaked ETH tokens, how long is the redemption queue, and what can go wrong upstream? A staked token can trade near its underlying value until many holders want out at once. Then the queue sets the price.

For synthetic dollars, where is the hedge held? For tokenised real-world assets, can a transfer restriction freeze your withdrawal? The Financial Stability Board names interconnectedness, liquidity mismatches and operational fragilities among DeFi's core weaknesses [9]. Each token in your pool brings its own chain of them.

See [Liquidity Pool Risks](/guides/liquidity-pool-risks/).

## The scorecard

| The question | What you are checking | Reject if |
| :--- | :--- | :--- |
| Does the curve fit | The design matches what the pair does | A flat stable curve on tokens that can genuinely diverge [2] |
| Is the money working | Depth within 2% of the price | Big headline, almost nothing near the price [1] |
| Does the maths work | Real fee yield against the bleed | Fee yield below the pair's estimated bleed, with most volume from arbitrage [3] [6] |
| Who takes a cut | Same-block liquidity and ordering | Repeated same-block fee capture on the pool's largest trades [7] |
| What can break | Hooks, tokens, price feeds | A mutable hook nobody audited, or a multi-week redemption queue [4] |

See the [Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/) for the operational version.

## Where to watch the numbers

- **Comparing pools across protocols:** [DeFiLlama Yields](https://defillama.com/yields) for stability, volume against size, and reward schedules.
- **Contracts, keys and delays:** [Etherscan](https://etherscan.io).
- **Backtesting what a position would have done:** [Revert Finance](https://revert.finance).

## When a pool fails a check

- **The working money is barely used.** If turnover times fee tier times 365 lands below the bleed for the pair, the capital is not paid for the risk it carries. Rewards can close the gap only for as long as they last.
- **One address holds a large share of the liquidity.** When it leaves, depth collapses and your exit gets expensive. Watch that address, and size so you could get out first. [Token Liquidity Analysis](/guides/token-liquidity-analysis/) shows how to measure exit capacity.
- **Rewards make up most of the advertised rate.** That money is chasing issuance. When the rewards stop, the deposits they attracted tend to leave, and you hold a token whose price fell as it was sold. Plan how often you will sell rewards, with gas in the sum. The test for where yield comes from is in [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

## Putting the five answers together

Price the income with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/#feeTier=0.05&capital=20000&volume=10000000) and the divergence with the [impermanent loss calculator](/tools/impermanent-loss-calculator/#mode=weighted&a0=2000&a1=2500&capital=20000). Then set one against the other as shown in [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/). If the fees do not clear the cost at realistic volume, no score on the other four questions rescues the pool.

## References

1. [Concentrated Liquidity (Uniswap Developers documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Curve StableSwap Exchange: Overview (Curve Knowledge Hub)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
3. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
4. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
5. [Liquidity Book DLMM: Primer (LFJ Documentation)](https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873)
6. [Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)](https://arxiv.org/abs/2404.05803)
7. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
8. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
9. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)
10. [Optimistic Rollups (ethereum.org)](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developers documentation)"
[2]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview (Curve Knowledge Hub)"
[3]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[4]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[5]: https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873 "Liquidity Book DLMM: Primer (LFJ Documentation)"
[6]: https://arxiv.org/abs/2404.05803 "Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)"
[7]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[8]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[9]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
[10]: https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/ "Optimistic Rollups (ethereum.org)"
