---
title: "How to Provide Liquidity: A Mechanism-First Walkthrough"
description: "Every choice in the deposit screen is a decision about what you will be holding later. What each one does, two worked scenarios, and the sums that decide it."
category: "LP Mechanics"
date: 2026-09-03
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "7 min read"
keywords: "how to provide liquidity, provide liquidity AMM, liquidity provider guide, DeFi LP, Permit2, hooks, how to provide liquidity on Uniswap, liquidity provision DeFi, do I need both tokens to provide liquidity"
featured: true
faq:
  - q: "How much do you need to provide liquidity?"
    a: "There is no protocol minimum, but there is an economic one. If gas for minting, collecting and withdrawing is a large fraction of expected fee income, the position cannot work. On high-fee networks that threshold rules out small positions entirely."
  - q: "How long should I provide liquidity?"
    a: "Long enough for fee income to clear the divergence the position takes on, which depends on turnover and volatility rather than on a calendar. Positions judged over a few days are dominated by noise."
  - q: "When should I remove liquidity?"
    a: "When the reason for the position no longer holds: the pair's volatility has risen beyond what the fee tier compensates, volume has migrated elsewhere, the incentive programme has ended, or you no longer want exposure to either asset."
---

The deposit screen makes this look like choosing a savings account. Pick a pool, pick an amount, confirm.

What you are actually doing is hiring a contract to trade your money, all day, at prices you agreed in advance, against anyone who wants to. Every setting on that screen decides what you will be holding when you come back.

This guide walks through what each choice does, two scenarios worked end to end, and the sums that tell you whether the position makes sense at all.

<figure class="article-figure">
  <img src="/images/guides/how-to-provide-liquidity.webp" alt="Two assets enter a pool through a chosen active price range and produce a position receipt." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Providing liquidity means choosing a pool, assets, and active range. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"The moment you sign that approval you are running a small market-making business. Beginners forget the cost of getting in and out. On Ethereum, approving two tokens, minting the position and claiming fees can cost a few dollars on a quiet day and well over \$100 on a busy one. On a \$1,000 deposit, a busy day starts you 10% behind."*

## What the pool does with your money

A pool holds two tokens and follows one rule. When somebody buys one, they leave the other behind, and the price moves.

When the price moves somewhere else first, arbitrage traders come and trade against your pool until it catches up. The pool sells whichever token went up and buys whichever went down. That is where impermanent loss comes from — the gap between what you end up with and what holding would have given you [4].

In a range-based pool you also choose two prices, and your money only works between them [1]. Outside, it fills nothing and earns nothing.

| Where the price goes | What happens to your position |
| :--- | :--- |
| Rises toward your upper bound | Traders buy your ETH, leave dollars. At the top, you hold only dollars [2] |
| Sits inside your band | A mix that shifts with every trade, earning fees |
| Falls toward your lower bound | Traders sell you ETH. At the bottom, you hold only ETH [2] |

So your balance is not something you set. It is a function of where the price is relative to the bounds you chose.

## What each setting on the screen actually does

| The choice | What it decides |
| :--- | :--- |
| Full range or a band | Full range needs no attention and uses your money poorly. A band earns far more and needs watching [1] [2] |
| The approval you sign | Sign a scoped, expiring permission rather than an unlimited one. It costs less gas and exposes less [1] |
| The fee tier | 0.01% to 1.00%, reflecting how much the pair moves. Some newer pools let code move the fee with volatility [1] |
| The hook, if there is one | Custom code that can change fees, restrict withdrawals, or lend out idle reserves. Read it first [1] |
| How you exit | Burning your claim returns whatever you hold now. Outside your range, that is all of one token [2] |

## Scenario one: a tight band on a stablecoin pair

You supply USDC and USDT, with a band from 0.9990 to 1.0010. Twenty basis points wide.

The logic is sound. These tokens rarely move far from a dollar, so packing everything into a tiny corridor makes your money work about two thousand times harder than a full-range position [1].

**While it works:** the price wanders inside your band, and you collect fees on everything that crosses you.

**When it breaks:** one token drops to 0.9850. The market sweeps straight through your lower bound. You now hold only the distressed token, and fees have stopped [2].

**What happens next:** nothing. It does not rebalance itself. It sits there until the price recovers or you pay gas to close it and take the loss.

Use this when you genuinely believe both tokens will hold. Understand that if one has a real problem, your tight band has concentrated your exposure to precisely that token [2] [4].

## Scenario two: wide or narrow on a volatile pair

ETH against dollars. The choice is a real trade, not a preference.

| | Wide, say plus or minus 50% | Narrow, say plus or minus 5% |
| :--- | :--- | :--- |
| Time spent earning | Most of it | Often very little |
| Fee income per dollar | Low | High, while it lasts |
| How fast it converts | Slowly | In seconds during a breakout |
| What you must do | Almost nothing | Watch it, or automate it |

A narrow band pays well in a quiet, range-bound market. During a trend it goes one-sided in seconds, stops earning, and takes the full divergence anyway [2] [4].

If you cannot watch it, either widen the band to match how much the pair actually moves, or use a vault such as Arrakis or Gamma that moves it for you [1]. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## If you are using a stable-pair pool

Curve-style pools use a different curve for assets meant to track each other, controlled by a setting called amplification [3].

Turn it up and the pool absorbs huge trades with almost no cost. Turn it up and, if one asset's backing deteriorates, the pool delays reacting and absorbs an enormous amount of the failing token before the price moves [3].

One check before you deposit: look at the current balance. If a pool is already 80/20 skewed, you are not earning fees. You are buying the skew [3].

## The sum that decides it

The rate on the screen is yesterday's volume projected forward. It ignores three things:

- **Divergence.** The gap between your position and simply holding [4].
- **What arbitrage takes.** The value that leaks continuously because your quote is a block behind [4].
- **Time out of range.** Hours or weeks earning nothing at all [1] [2].

$$
\text{Net} = \text{fees} - \text{arbitrage losses} - \text{gas and management}
$$

Where:

- **Fees** is your share of trading fees while you were actually in range.
- **Arbitrage losses** is roughly the pair's annual volatility, squared, divided by eight, as a yearly share of a full-range position. A band loses faster, in proportion to its multiplier.
- **Gas and management** is every transaction from approval to exit.

If that comes out negative, holding the tokens or lending them out beats the pool. See [Liquidity Provider Fees](/guides/liquidity-provider-fees/).

## Who is trading against you

The flow reaching your pool changes your return, and it has been getting worse for passive positions [5].

**Public transactions attract fee sniping.** Somebody sees a large swap coming, mints a very tight position right where it will execute, takes almost the whole fee, and pulls out in the same block.

**Good flow is leaving.** Ordinary traders increasingly route through solver networks that match orders off-chain. Solvers only send you the trades they cannot match elsewhere, which are disproportionately the ones that cost you.

## How pool designs differ in one table

| Design | Where your money works | What happens to your holdings | When earning stops | What you are really exposed to |
| :--- | :--- | :--- | :--- | :--- |
| Full range, v2 | Everywhere | Rotates continuously [1] | Never [1] | Broad divergence over large moves [4] |
| Narrow band, v3 or v4 | Your band [1] | Flips to one token at the edge [2] | The moment you exit the band [1] | Idle time plus faster bleed [2] |
| Hook pools, v4 | Your band, plus custom rules [1] | Depends on the hook [1] | Set by your band and the code [1] | Whatever that code can do [1] |
| Stable pairs, Curve | Clustered near the peg [3] | Flat near balance, steep when skewed [3] | Never stops, but fees dry up [3] | A peg breaking [3] |

## Step by step

1. **Pick the pair, and check both tokens.** Look at how much they have actually moved, and how closely they track each other [1] [3].
2. **Sign a scoped approval**, for the amount you are depositing, with an expiry [1].
3. **Set the bounds from volatility**, not from a yield you would like. If there is a hook, read what it can do [1] [2].
4. **Watch the price against your bounds.** Track fees earned against what the pair is costing you [4].
5. **Exit deliberately.** Decrease liquidity, claim fees, and note what you actually received [2].

## What to check before you deposit

1. **Exactly which prices will your position earn between [1]?**
2. **If it breaks through, which token will you hold, and would you want it [2]?**
3. **Is there a hook, and what is it allowed to do [1]?**
4. **For a pegged pair, how skewed is the pool right now, and can you redeem directly [3]?**
5. **Does the fee volume plausibly beat what volatility costs you [4]?**

## When something goes wrong

- **Your deposit reverts with a price error.** The price moved while your transaction waited. Widen the tolerance slightly, or send it through a private relay so nobody trades in front of you.
- **You went out of range immediately.** Your band was tighter than a normal day for this pair. Do not panic and re-range. Look at how much it actually moves first, then decide.
- **Gas is eating the fees.** The position is too small for how often you are touching it. Batch your fee claims, and do not claim until the amount is at least five times the gas.

## Where to go next

Price the boundary case in [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) and the tier in [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/). Then run the two numbers: expected fees in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), expected divergence in the [impermanent loss calculator](/tools/impermanent-loss-calculator/). For depositing one asset, see [Single-Sided Liquidity](/guides/single-sided-liquidity/), and for the protocol walkthrough, [Uniswap Liquidity Pools](/guides/uniswap-liquidity-pools/).

## References

1. [Concentrated Liquidity | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Uniswap v3 Core Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
3. [StableSwap pools (Curve Documentation)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
4. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
5. [Maximal Extractable Value (MEV) | ethereum.org](https://ethereum.org/en/developers/docs/mev/)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
8. [Gas and Fees (Ethereum Foundation Documentation)](https://ethereum.org/en/developers/docs/gas/)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity | Uniswap Developers"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "StableSwap pools (Curve Documentation)"
[4]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[5]: https://ethereum.org/en/developers/docs/mev/ "Maximal Extractable Value (MEV) | ethereum.org"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[8]: https://ethereum.org/en/developers/docs/gas/ "Gas and Fees (Ethereum Foundation Documentation)"
