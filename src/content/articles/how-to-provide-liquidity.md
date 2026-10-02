---
title: "How to Provide Liquidity: A Mechanism-First Walkthrough"
description: "Every choice in the deposit screen is a decision about what you will be holding later. What each one does, two worked scenarios, and the sums that decide it."
category: "LP Mechanics"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "9 min read"
primaryQuery: "how to provide liquidity"
keywords: "how to provide liquidity, provide liquidity AMM, liquidity provider guide, DeFi LP, Permit2, hooks, how to provide liquidity on Uniswap, liquidity provision DeFi, do I need both tokens to provide liquidity"
featured: true
faq:
  - q: "How much do you need to provide liquidity?"
    a: "There is no protocol minimum, but there is an economic one. Gas for approving, minting, collecting and withdrawing is a fixed cost per transaction, so it is a larger share of a small position. If those costs are a large fraction of the fees you expect, the position cannot work at that size on that network."
  - q: "How long should I provide liquidity?"
    a: "Long enough for fee income to clear what the position gives up to arbitrage, which depends on volume and volatility rather than on a calendar. Results over a few days are dominated by price noise, so judge a position over weeks."
  - q: "When should I remove liquidity?"
    a: "When the reason for the position no longer holds: the pair's volatility has risen beyond what the fee tier compensates, volume has moved to another pool, an incentive programme has ended, or you no longer want exposure to either asset."
  - q: "Should I deposit both assets in the exact pool ratio?"
    a: "For a full-range constant-product pool, yes. The pool credits you only for the part that matches its current ratio, so routers deposit at that ratio and return the remainder; a one-click zap that swaps first pays the swap fee on the part it swaps. For a concentrated band, the band and the current price set the ratio, and the interface computes it for you."
---

The deposit screen makes this look like choosing a savings account. Pick a pool, pick an amount, confirm.

What you are actually doing is hiring a contract to trade your money, all day, at prices it sets by formula, against anyone who wants to. Every setting on that screen decides what you will be holding when you come back.

By the end you should be able to tell, before you sign anything, which token you could end up holding and whether the fees can plausibly pay for the position.

<figure class="article-figure">
  <img src="/images/guides/how-to-provide-liquidity.webp" alt="Two assets enter a pool through a chosen active price range and produce a position receipt." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Providing liquidity means choosing a pool, assets, and active range. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Once you deposit, you are running a small market-making business, and every step has a cost. Each transaction pays gas: the units of work it uses times the price per unit at that moment [8]. Suppose approving two tokens, minting and later collecting fees uses about 700,000 gas in total, with ETH at \$3,000. At 2 gwei that is about \$4. At 50 gwei it is about \$105, which on a \$1,000 deposit puts you more than 10% behind before the first trade.

## What the pool does with your money

A pool holds two tokens and follows one pricing rule. When somebody buys one token, they leave the other behind, and the price moves.

When the price moves somewhere else first, arbitrage traders trade against your pool until its price catches up. The pool sells whichever token went up and buys whichever went down. That rotation is the source of impermanent loss — the gap between what you end up with and what simply holding the tokens would have given you [4].

In a range-based pool you also choose two prices, and your money only works between them [1]. Outside them, it fills no trades and earns no fees.

| Where the price goes | What happens to your position |
| :--- | :--- |
| Rises toward your upper bound | Traders buy your ETH and leave dollars. At the top, you hold only dollars [1] |
| Sits inside your band | A mix that shifts with every trade, earning fees |
| Falls toward your lower bound | Traders sell you ETH. At the bottom, you hold only ETH [1] |

So your token balance is not something you set. It follows from where the price is relative to the bounds you chose.

## What each setting on the screen actually does

| The choice | What it decides |
| :--- | :--- |
| Full range or a band | Full range needs no attention and spreads your money thinly. A band earns more per dollar while the price is inside it and needs watching [1] [6] |
| The approval you sign | Uniswap's Permit2 lets you approve a set amount with an expiry date rather than an unlimited, permanent allowance [7] |
| The fee tier | On Uniswap v3, a menu from 0.01% to 1%. On v4 the pool creator can set any fee, or let a hook change it [2] [9] |
| The hook, if there is one | Custom code attached to a v4 pool. It can change the fee, charge a fee on withdrawals, or replace the pricing entirely. Read it first [9] |
| How you exit | Withdrawing returns whatever the position holds now. Outside your range, that is all one token [1] |

## Scenario one: a tight band on a stablecoin pair

You supply USDC and USDT with a band from 0.9990 to 1.0010. That is 0.2% wide, or twenty basis points (a basis point is one hundredth of a percent).

The logic is sound. These tokens rarely move far from a dollar, so a band this narrow makes your money back about two thousand times the depth of a full-range deposit of the same size. That figure comes from the efficiency formula in [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

**While it works:** the price wanders inside your band, and you collect fees on every trade that crosses it.

**When it breaks:** one token drops to 0.9850. The price moves straight through your lower bound. You now hold only the weaker token, and fees have stopped [1].

**What happens next:** nothing automatic. The position does not rebalance itself. It sits there until the price returns or you pay gas to close it at the current price.

Use this when you have reason to believe both tokens will hold their peg. If one has a real problem, the tight band has concentrated your exposure in exactly that token.

## Scenario two: wide or narrow on a volatile pair

ETH against dollars. The choice is a real trade-off, not a preference.

| | Wide, about plus or minus 50% | Narrow, about plus or minus 5% |
| :--- | :--- | :--- |
| Time spent earning | Most of it | Often a few days at a time |
| Fee income per dollar | Low | Much higher, while in range |
| How fast it converts | Over large moves | Within a single volatile day |
| What you must do | Almost nothing | Watch it, or automate it |

A narrow band pays well in a quiet, range-bound market. In a trend it turns one-sided quickly and stops earning. While it is in range, it gives up value to arbitrage at a rate multiplied by its concentration [4]. Research on real Uniswap v3 positions finds that the larger returns come with more risk and active management, while simple low-risk strategies earn modest returns [6].

If you cannot watch it, either widen the band to match how much the pair actually moves, or use an automated range manager (a vault) that re-centres it for you, at the cost of a fee and another contract. The width decision itself is worked through in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/).

## If you are using a stable-pair pool

Curve-style pools use a different curve for assets meant to trade near a fixed ratio. A setting called the amplification coefficient decides how flat that curve stays near the peg [3].

A higher setting lets the pool absorb large trades near the peg with very little price movement. The same flatness means that if one asset's backing deteriorates, the pool keeps quoting close to 1:1 while sellers swap the weak asset in. Curve's own documentation warns that after a permanent depeg, providers are left holding the devalued asset [5].

One check before you deposit: look at the pool's current balance. A heavily skewed pool means traders have been selling one asset into it. A deposit in proportion to the pool gives you mostly that asset, which is the one the market currently doubts.

## The sum that decides it

The rate on the screen is recent volume projected forward. It leaves out three costs:

- **Divergence.** The gap between your position and simply holding the tokens [4].
- **What arbitrage takes.** Value that leaks continuously because your pool's price updates only when someone trades against it [4].
- **Time out of range.** Hours or weeks earning nothing [1].

In plain terms, a position works only if the fees you collect are larger than what arbitrage takes plus everything you pay to run it.

$$
\text{Net} = \text{fees} - \text{arbitrage losses} - \text{gas and management}
$$

Where:

- **Fees** is your share of trading fees while you were actually in range.
- **Arbitrage losses** is roughly the pair's annual volatility, squared, divided by eight, as a yearly share of a full-range position [4]. A band loses faster while it is in range, in proportion to its concentration.
- **Gas and management** is every transaction from approval to exit.

If that comes out negative, holding the tokens or lending them out would have done better than the pool. The fee side is worked through in [Liquidity Provider Fees](/guides/liquidity-provider-fees/).

## Who is trading against you

The kind of trading that reaches your pool affects your return, not just the amount.

**Some trades are reordered for profit.** Pending transactions on a public network can be seen before they run. Searchers profit by placing their own trades around them, which is maximal extractable value (MEV) — value taken by choosing the order transactions run in [12].

**Large trades can attract just-in-time liquidity.** A searcher adds a very tight position right before a big swap and removes it right after, taking most of that swap's fee. Uniswap Labs' own analysis found this rare, under 0.5% of monthly volume in most months it studied, and concentrated on very large swaps [10].

**Not every trade reaches the pool.** Intent-based routers such as UniswapX let competing fillers settle an order from their own inventory or from other venues [11]. The trades your pool does see are partly the ones those fillers chose to route to it.

## How pool designs differ in one table

| Design | Where your money works | What happens to your holdings | When earning stops | What you are really exposed to |
| :--- | :--- | :--- | :--- | :--- |
| Full range, v2 | Every price | Rotates continuously | Never, while volume lasts | Divergence over large moves [4] |
| Narrow band, v3 or v4 | Your band [1] | Turns into one token at the edge [1] | The moment the price leaves the band [1] | Idle time plus faster loss to arbitrage [4] |
| Hook pools, v4 | Your band, plus custom rules [9] | Depends on the hook | Set by your band and the code | Whatever that code is allowed to do [9] |
| Stable pairs, Curve | Clustered near the peg [3] | Little change near balance, large shifts when skewed | Never stops, but fees dry up | A peg breaking [5] |

## Step by step

1. **Pick the pair, and check both tokens.** Look at how much they have actually moved, and how closely they track each other.
2. **Sign a scoped approval** for the amount you are depositing, with an expiry [7].
3. **Set the bounds from volatility**, not from a yield you would like. If there is a hook, read what it can do [9].
4. **Watch the price against your bounds.** Track fees earned against what the pair is costing you.
5. **Exit deliberately.** Remove liquidity, collect fees, and record what you actually received.

## What to check before you deposit

1. **Exactly which prices will your position earn between?**
2. **If the price breaks through a bound, which token will you hold, and would you want it?**
3. **Is there a hook, and what is it allowed to do?**
4. **For a pegged pair, how skewed is the pool right now, and can either token be redeemed directly with its issuer?**
5. **Do the fees plausibly beat what volatility costs you?**

## When something goes wrong

- **Your deposit reverts with a price error.** The price moved while your transaction waited. Widen the tolerance slightly, or send it through a private relay so nobody trades in front of you.
- **You went out of range immediately.** Your band was narrower than a normal day's move for this pair. Before re-ranging, check how much the pair actually moves, then choose a width that fits it.
- **Gas is eating the fees.** Each claim costs the same gas whatever its size, so claiming \$20 of fees with \$5 of gas gives up a quarter of it. Claim less often, and only when the balance is large relative to the gas.

## Run your own numbers next

Price the edge case in [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) and the tier choice in [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/). Then estimate the two sides of the sum: fees in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/#feeTier=0.05&capital=10000&volume=15000000&liquidity=2000000), and divergence in the [impermanent loss calculator](/tools/impermanent-loss-calculator/#mode=weighted&a0=3000&a1=3600&capital=10000). For depositing one asset, see [Single-Sided Liquidity](/guides/single-sided-liquidity/); for the protocol walkthrough, [Uniswap Liquidity Pools](/guides/uniswap-liquidity-pools/); and for volatile pairs on Curve, [Curve v2 Explained](/guides/curve-v2-cryptoswap-explained/).

## References

1. [Concentrated Liquidity | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [StableSwap - efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://docs.curve.finance/assets/files/whitepaper_stableswap-fc0bb370db9fe3a91afdde8662e78206.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Stableswap and Cryptoswap Pools | Curve Knowledge Hub](https://docs.curve.finance/user/dex/stableswap-vs-cryptoswap)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [Allowance Transfer | Uniswap Developers (Permit2)](https://developers.uniswap.org/docs/protocols/permit2/concepts/allowance-transfer)
8. [Ethereum gas and fees: technical overview | ethereum.org](https://ethereum.org/en/developers/docs/gas/)
9. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
10. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
11. [UniswapX Overview | Uniswap Developers](https://developers.uniswap.org/docs/liquidity/uniswapx/overview)
12. [Maximal extractable value (MEV) | ethereum.org](https://ethereum.org/en/developers/docs/mev/)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity | Uniswap Developers"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://docs.curve.finance/assets/files/whitepaper_stableswap-fc0bb370db9fe3a91afdde8662e78206.pdf "StableSwap - efficient mechanism for Stablecoin liquidity"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://docs.curve.finance/user/dex/stableswap-vs-cryptoswap "Stableswap and Cryptoswap Pools | Curve Knowledge Hub"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://developers.uniswap.org/docs/protocols/permit2/concepts/allowance-transfer "Allowance Transfer | Uniswap Developers"
[8]: https://ethereum.org/en/developers/docs/gas/ "Ethereum gas and fees: technical overview | ethereum.org"
[9]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[10]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[11]: https://developers.uniswap.org/docs/liquidity/uniswapx/overview "UniswapX Overview | Uniswap Developers"
[12]: https://ethereum.org/en/developers/docs/mev/ "Maximal extractable value (MEV) | ethereum.org"
