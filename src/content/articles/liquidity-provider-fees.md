---
title: "Liquidity Provider Fees: How LP Revenue Is Generated and Measured"
seoTitle: "Liquidity Provider Fees: How LP Revenue Is Generated"
description: "Where the fee actually goes, why it differs by pool generation, and the one subtraction that turns a fee number into an actual return."
category: "LP Mechanics"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "liquidity provider fees"
keywords: "liquidity provider fees, LP fees, AMM fee tier, liquidity pool APR, dynamic fees, LVR, liquidity pool fees explained, who pays liquidity pool fees, pool fee tier"
featured: false
faq:
  - q: "Who pays liquidity pool fees?"
    a: "The trader pays the fee on each swap. It accrues to the liquidity that was active for that trade, in proportion to each position's share of that active liquidity. Where a protocol fee is switched on, part of the fee goes to the protocol before providers are paid."
  - q: "Are liquidity pool fees guaranteed?"
    a: "No. Fees depend on volume actually routing through your pool and, in concentrated pools, on your position being in range when it does. Both can fall to zero without anything failing."
  - q: "Do liquidity pool fees compound automatically?"
    a: "In Uniswap v2-style pools, fees are added to the reserves, so they compound inside your share. In Uniswap v3 and v4 they accrue as separate claimable balances and only compound if you collect and redeposit them, which costs gas."
  - q: "How much can you earn providing liquidity?"
    a: "Fee income equals the fee providers receive per trade, times the volume routed to your price range, times your share of the liquidity active there, adjusted for the time your position spends in range. It varies widely by pair and period, so estimate it from the pool's own recent volume, then subtract what arbitrage takes and your gas."
---

A trader pays a fee. Between their wallet and yours, different pool designs do different things with it. Those differences decide whether your fees compound, whether they stop, and how much of them you receive.

This guide traces the money from the swap to your balance and shows why volume alone tells you little. It ends with the one subtraction that turns a fee number into an actual return. If the role receiving those fees is new to you, it is profiled in [What Is a Liquidity Provider?](/guides/what-is-a-liquidity-provider/).

<figure class="article-figure">
  <img src="/images/guides/liquidity-provider-fees.webp" alt="Swap flow moves through an active liquidity range while a smaller fee stream accumulates separately." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fees accrue from eligible active flow, not from a fixed yield source. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Fee volume and fee capture are different things. Suppose a pool does \$50M a day, and \$40M of that is arbitrage traders correcting a price the pool has not yet updated. The pool collects fees on all of it while its inventory loses value to those same trades. Heavy volume helps you most when much of it comes from traders who are not trading on better price information.

## Where the fee actually goes

| Design | What happens to the fee | What it means for you |
| :--- | :--- | :--- |
| Uniswap v2 | Added to the pool's reserves [1] | It compounds inside your share. You receive it when you withdraw |
| Uniswap v3 | Credited to the liquidity active at that price, held as a separate claimable balance [2] | You must collect it, and it earns nothing until you redeposit it |
| Uniswap v4 | Also a claimable balance, paid out whenever you change the position, including a zero-size change made just to collect [2] [4] | The fee can be set by a hook and can move per swap, so read that code [3] |
| Curve Stableswap-NG | Half to the pool's depositors, half to veCRV holders, a split fixed in the contract [6] | Depositors may also receive CRV emissions, a second stream funded very differently [7] |

The row that catches people out is the second. In a range-based pool, if the price sits outside your band you collect nothing, whatever the pool's headline volume that day [2].

There is a second deduction on some Uniswap pools. Since governance passed the UNIfication proposal in December 2025, a protocol fee applies to all v2 pools and selected v3 pools [2]. On those pools, providers receive five-sixths of a 0.30% fee, so 0.25% of each trade.

## The full-range case, worked

An ordinary ETH and dollars pool, charging 0.30% on every swap.

You own 2% of it, and the pool does \$10M of volume in a day. If providers receive the full 0.30%, your gross fee is 2% of 0.30% of \$10M, so \$600. On a Uniswap v2 pool, where providers now receive 0.25%, the same day pays \$500 [2].

Now the part the fee number does not show. During that day, ETH rose. Arbitrage traders bought ETH from the pool at its lagging price until it caught up. The pool sold ETH and accumulated dollars.

So when you withdraw, you hold less ETH and more dollars than you put in. Two separate things have happened to you [5]:

- **The market itself.** Whatever the two tokens did. Holding them would have given you that too.
- **Trading at a stale price.** The steady loss from a pool that only updates its price when someone trades against it.

If the day's fees do not cover the second one, the position falls behind simply holding even as the fee counter climbs [5]. The total shortfall against holding is impermanent loss — what you gave up by depositing instead of keeping the tokens in your wallet. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## The range case: why fees stop dead

In a range-based pool, three things follow from the band you chose [2]:

- **Inside it, you earn much more per dollar.** For bands from about plus or minus 20% down to plus or minus 2%, the fee income per dollar is roughly ten to a hundred times a full-range position.
- **Outside it, you earn nothing.** Fees already earned stay claimable, but new volume pays you zero.
- **Past an edge, you have fully converted.** Above your top bound you hold only dollars. If ETH keeps rising, you miss the rest of the rally and earn nothing.

So two numbers dominate your income: your share of the liquidity at the current price, and the fraction of time you are in range. A pool's advertised rate says little about your position if it spends half its life outside the band [2].

## Why some pools now move the fee

Uniswap v3 offers a menu of fixed tiers: 0.01% for stable pairs, 0.05% for closely related or very liquid pairs, 0.30% for most volatile pairs, and 1% for thin ones [2]. A fixed number can be wrong in two opposite directions.

**In calm markets it can be too high.** Aggregators compare every pool for the same pair. A higher tier usually receives less volume, because routers send trades to the cheapest path that can fill them.

**In a fast market it can be too low.** Prices move far between trades, so arbitrage takes more from the pool's stale price. Research on fees finds they cut arbitrage profits roughly in proportion to how often a mispricing is too small to be worth correcting [8]. When prices are jumping, a fixed 0.30% leaves more of each move to arbitrage traders.

Two designs respond to this:

- **Fees that count price movement.** Liquidity Book, built by Trader Joe (now LFJ), tracks how many price steps recent trades have crossed. When that count rises, the fee rises with it [9].
- **Fees set by code.** A Uniswap v4 pool can be created with a dynamic fee that its hook sets per swap or on a schedule [2] [3].

Both aim to charge arbitrage more when arbitrage is taking the most. Choosing the fee is a balance: higher fees compensate providers but also make the pool's price less accurate and can cost it volume [10].

## Curve pays from two different places

Worth separating, because the two streams behave differently:

- **Swap fees** come from trades in the pool you supplied. Providers keep their share, and the rest goes to veCRV holders [6].
- **CRV emissions** are new tokens paid to providers through the pool's gauge. veCRV holders, who lock CRV for up to four years, vote on how those emissions are split between pools [7].

When you look at a Curve pool's advertised rate, split it. The fee part is paid by traders and lasts as long as the volume does. The emission part is paid by issuance, and it can shrink or end when a gauge vote moves the weights [7].

## The one subtraction that matters

In plain terms: the fees count as income only after you subtract what arbitrage took from your inventory and what you spent on gas.

$$
\text{Net} = \text{fees} - \text{LVR} - \text{gas}
$$

Where:

- **Fees** is everything you collected while your liquidity was live.
- **LVR** is loss-versus-rebalancing — the value arbitrage traders take because your pool's price lags the wider market [5].
- **Gas** is every transaction from entry to exit [11].

A rough yardstick for LVR on a full-range position is the pair's annual volatility, squared, divided by eight, per year [5]. On a pair that moves 80% a year, that is 0.8 × 0.8 ÷ 8, or about 8% of the position a year. A band loses at a multiple of that while it is in range, so a 15% fee rate on a narrow band can still lose money.

That is not hypothetical. A 2021 study of 17 large Uniswap v3 pools found that providers earned \$199.3M in fees but lost \$260.1M to impermanent loss over the same period [12]. If the fees beat the bleed, you were paid for making a market. If not, the difference went to arbitrage traders. See [Market Making on AMMs](/guides/market-making-on-amms/).

## Which number is which

| The figure | What it actually measures | Where it goes wrong |
| :--- | :--- | :--- |
| The fee rate, 0.30% | What the trader pays on each swap [1] [2] | Part may go to the protocol, and a higher rate can mean little volume |
| The advertised rate | Recent volume, projected forward | Counts no future range exits and no divergence |
| Fees collected | Real tokens you can claim [2] | Can be outweighed by what happened to your inventory [5] |
| Net against the bleed | Fees minus what arbitrage took | The one that tells you whether it worked [5] |

## What to check before you deposit

1. **How does this pool handle fees?** Compounding into reserves, or held as a claim you must collect [1] [2]?
2. **Is there a protocol fee on this pool?** If so, use the providers' share, not the headline rate [2].
3. **Is the fee fixed or does it move?** If it moves, read the code that sets it and the bounds it can reach [3].
4. **How much of the last 30 days would your band have been in range?**
5. **Does historical fee income comfortably beat the bleed** for this pair [5]?
6. **How much of the advertised rate is real fees** rather than token emissions [7]?

Treat this as payment for quoting prices continuously with real money, not as interest. If the fees do not outpace what arbitrage takes, no headline number makes the position work.

## When something goes wrong

- **The fees are not covering the losses.** The pair moves more than this tier compensates. Move to a higher tier, or to a pair that moves less.
- **Routers stopped sending you volume.** A competing pool offers better execution. Change tier, or tighten your band to compete on depth.
- **Claiming costs more than it earns.** Every claim costs the same gas whatever its size [11]. Claim and reinvest less often, so each transaction moves an amount that is large relative to its gas.

## Next: pick a tier and test the numbers

The tier choice moves this number more than anything else, so start with [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/). Then model expected income with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), and read any quoted rate with [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/) in mind. For the result after divergence and gas, use the [LP profit and return calculator](/tools/lp-profit-calculator/) alongside [Is Providing Liquidity Profitable?](/guides/is-providing-liquidity-profitable/).

## References

1. [Pools | Uniswap Developers](https://developers.uniswap.org/docs/protocols/v2/concepts/pools)
2. [Fees | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/fees)
3. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
4. [Collect Fees | Uniswap Developers](https://developers.uniswap.org/docs/protocols/v4/guides/managing-liquidity/collect-fees)
5. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
6. [Stableswap-NG plainpool | Curve Knowledge Hub](https://docs.curve.finance/developer/amm/stableswap-ng/pools/plainpool)
7. [What is veCRV? | Curve Knowledge Hub](https://docs.curve.finance/user/vecrv/what-is-vecrv)
8. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)](https://arxiv.org/abs/2305.14604)
9. [Fees | LFJ Developer Docs](https://developers.lfj.gg/concepts/fees)
10. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
11. [Ethereum gas and fees: technical overview | ethereum.org](https://ethereum.org/en/developers/docs/gas/)
12. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)

[1]: https://developers.uniswap.org/docs/protocols/v2/concepts/pools "Pools | Uniswap Developers"
[2]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees | Uniswap Developers"
[3]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[4]: https://developers.uniswap.org/docs/protocols/v4/guides/managing-liquidity/collect-fees "Collect Fees | Uniswap Developers"
[5]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[6]: https://docs.curve.finance/developer/amm/stableswap-ng/pools/plainpool "Stableswap-NG plainpool | Curve Knowledge Hub"
[7]: https://docs.curve.finance/user/vecrv/what-is-vecrv "What is veCRV? | Curve Knowledge Hub"
[8]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)"
[9]: https://developers.lfj.gg/concepts/fees "Fees | LFJ Developer Docs"
[10]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[11]: https://ethereum.org/en/developers/docs/gas/ "Ethereum gas and fees: technical overview | ethereum.org"
[12]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
