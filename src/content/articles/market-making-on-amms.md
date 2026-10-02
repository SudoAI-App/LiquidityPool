---
title: "Market Making on AMMs: How Professional Liquidity Providers Work"
seoTitle: "Market Making on AMMs: How Professional LPs Work"
description: "What professional liquidity providers actually do: sizing ranges to volatility, hedging price risk, clearing the LVR hurdle, and reading vault strategies."
category: "Advanced"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "13 min read"
primaryQuery: "market making AMM"
keywords: "market making AMM, AMM liquidity provider, delta hedging AMM, automated liquidity management, LVR minimization, concentrated liquidity market maker, passive market making DeFi, liquidity pool vs market making, market making DeFi"
featured: false
faq:
  - q: "Is providing liquidity the same as market making?"
    a: "Structurally yes: you post continuous two-sided quotes and earn a spread. The difference is that a pooled quote cannot be cancelled or repriced between trades, which is why adverse selection is larger than for an active market maker."
  - q: "How do professional LPs manage inventory?"
    a: "By sizing ranges against realised volatility, rebalancing on rules rather than reactions, hedging delta on a perpetual or options venue when the position is large, and measuring performance against a rebalancing benchmark rather than a dollar return."
  - q: "Is passive liquidity provision viable?"
    a: "On pairs where turnover is high relative to volatility, yes. On volatile pairs with modest volume, passive positions tend to underperform holding once divergence and gas are included."
  - q: "Is passive AMM market making still viable after MEV and LVR?"
    a: "It is viable where fees and flow quality compensate for adverse selection. Heavy toxic flow and thin fee tiers make the same range uneconomic. The hurdle is loss-versus-rebalancing plus gas, not a headline APR."
---

A market maker on a normal exchange quotes a price to buy and a price to sell, and changes those quotes whenever the market moves. Cancel, requote, repeat, thousands of times a second.

When you put money into a pool, you are doing the same job with one hand tied. Your quote is written into a contract. It does not move until somebody trades against it. You cannot cancel it, and you cannot widen it because the news looks bad.

That single difference explains most of how pool returns behave. By the end, you should be able to estimate the cost your fees have to beat, see how larger desks hedge the price risk, and decide whether a pool is worth your capital.

<figure class="article-figure">
  <img src="/images/guides/market-making-on-amms.webp" alt="A token inventory feeding a curved pool, with price feeds from outside markets and a hedge line running back to the inventory." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A pool position is a quote you cannot cancel, so desks watch the outside price and hedge the inventory the pool leaves them with. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> A desk on a traditional exchange can requote in microseconds. Onchain, your pool's price changes only when somebody trades against it. The main cost is not holding the wrong token overnight. It is trading with someone who saw the price move before your pool did. Most of what a professional desk does here is aimed at that one problem.

## How a pool quotes without a trader

An ordinary market maker watches a reference price and shades its quotes. When it holds too much of a token, it quotes that token a little cheaper, so the market takes some off its hands. Standard market-making models build exactly this inventory adjustment into the quote [1].

A pool has no such judgement. It follows one rule written in the contract, called its invariant — the fixed relationship between the token balances that the pool refuses to break [3]. Its price follows from the ratio of what it holds, and nothing else.

So the pool never knows the market moved. It keeps quoting yesterday's price until somebody comes and takes the good side of it. Those traders are arbitrageurs — people who make money on the gap between one venue's price and another's — and they are the reason your quote is worth less than it looks.

| What a desk does | Order book venue | Pool, full range | Pool, chosen range |
| :--- | :--- | :--- | :--- |
| Update a quote | Any time, in microseconds | Only when a swap lands | Only when a swap lands |
| React to bad news | Cancel instantly | No defence at all | No defence at all |
| Rebalance holdings | Shade quotes, pull orders | Happens automatically along the curve | Happens automatically inside your band |
| Widen in a panic | Yes, spreads move with volatility | No, the fee is fixed | Fixed, unless a hook changes it |
| Capital used well | High, with margin and netting | Low, money spread everywhere | High, money packed where you chose |

Put plainly, a deposit is a standing instruction to trade, open to anyone, that you cannot change between trades. Chosen ranges did improve the market for traders: research comparing venues found that more flexible liquidity provision measurably improved decentralised exchange market quality [8]. The rule behind it is covered in [Automated Market Makers Explained](/guides/automated-market-maker-explained/) and [Constant Product Formula](/guides/constant-product-formula/).

## Why a narrow range is really a short options bet

Picking a price band changes the job. A full-range deposit takes on a mild version of the options-like exposure. A narrow band concentrates it, which raises both the fees and the risk, much like selling options with leverage [10].

Here is why. Inside your band, the pool sells whichever token is rising and buys whichever is falling. It does that on every tick of the way. You end up with a position that gains less than holding when the price rises and loses more than holding when it falls. Whichever way a big move goes, it trails holding.

Traders call that being short gamma. The plain version: you make a steady trickle while the market is quiet, and you lose when it moves fast. The fee stream is your premium for taking that bet.

| Where the price is | What you hold | What you earn | What it feels like |
| :--- | :--- | :--- | :--- |
| Below your band | All of the risky token | Nothing | You bought the whole way down and stopped |
| Inside your band | A mix that shifts as price moves | Fees on every swap | The good case, as long as it lasts |
| Above your band | All of the stable token | Nothing | You sold the whole way up and stopped |

Outside the band your position is entirely one token and earns nothing until the price returns [3]. So the strategy reduces to one question. Does the fee income while you sit inside the band beat what the band costs you on the way out? Band width is covered in [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/). For a specific band, the [Uniswap v3 liquidity calculator](/tools/uniswap-v3-liquidity-calculator/) prices both sides of that question — the fee income and the shortfall against holding.

## The number your fees have to beat

Most people measure a pool position against holding the tokens. That gap is impermanent loss — the difference between what your deposit is worth now and what the same tokens would have been worth untouched.

It is a poor yardstick for anyone doing this seriously. Impermanent loss only looks at where the price started and where it ended. A token can swing wildly for a month, come back to the same price, and show zero impermanent loss. Against holding, that is accurate. Against running the same exposure yourself at market prices, you fell behind on every swing, and that is the gap your fees exist to cover.

The better yardstick is loss-versus-rebalancing (LVR). It measures the value your pool gives up to faster traders because its quote lags the market, against a benchmark that holds the same tokens but trades at market prices [4]. It counts every swing, not just the endpoints.

For a constant-product position, the research gives the rate at which LVR builds up:

$$
\frac{d(\text{LVR})}{dt} = \frac{\sigma^2}{4} \cdot L \cdot \sqrt{P}
$$

Where:

- $\sigma$ is how much the pair moves, measured as annual volatility.
- $L$ is how much liquidity you have working at the current price.
- $P$ is the current price.

Volatility is squared, so doubling how much a pair moves quadruples what your quote costs you. Volume does not appear at all. A pair that moves twice as hard needs about four times the fee income to stay level against the benchmark.

That gives you a single test for any pool:

$$
\text{Net} = \text{fees earned} - \text{LVR} - \text{gas and rebalancing costs}
$$

Where:

- **Fees earned** is your expected yearly fee yield: daily volume times the fee rate, times 365, divided by the liquidity active at the current price.
- **LVR** is the rate above, as a yearly share of your position. For a full-range position it is about the squared annual volatility divided by eight. A band multiplies it, roughly in step with how much it multiplies your fee share.
- **Gas and rebalancing costs** is what you pay to move, claim and re-mint, as a yearly share of your position.

If that comes out negative at full range, narrowing the band will not fix it, because concentration scales the fee and LVR terms together. The pool is the problem. The full derivation sits in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/) and [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

## How professionals hedge the price risk

A desk that wants the fee income but not the bet on ETH hedges the price exposure away. The idea is simple even if the execution is not.

Your pool position is long the risky token by some amount. That amount changes as the price moves. So you take an offsetting short on a futures venue, sized to match, and adjust it as the pool's holding shifts.

For a position in a chosen band, the amount of risky token you hold is:

$$
\Delta = L \left( \frac{1}{\sqrt{P}} - \frac{1}{\sqrt{P_u}} \right)
$$

Where:

- $\Delta$ is how many units of the risky token the position holds right now.
- $L$ is your liquidity size.
- $P$ is the current price.
- $P_u$ is the top of your band.

Read the shape rather than the symbols. At the top of your band the bracket goes to zero, so you hold none of the risky token. At the bottom you hold the most. Everywhere in between you hold something in the middle, and it changes every time the price moves.

| The pool leg | The hedge leg |
| :--- | :--- |
| Long the risky token, amount varies with price | Short the same token on a futures venue |
| Loses when the price moves fast either way | Flat with respect to that curvature |
| Earns swap fees | Pays or receives funding |
| Cannot be cancelled | Can be resized at any moment |

Two costs come with this. First, keeping the hedge sized right means buying back the short as the price rises and adding to it as it falls, which is the expensive direction. A fully hedged position removes the bet on price, and what remains is fee income minus LVR. That is the central result of the LVR research, and the reason LVR is the hurdle [4].

Second is funding. When funding is positive, as it often is in strong bull markets, shorts collect it and your yield improves. When it turns negative, shorts pay it, and over a long stretch that cost can exceed your fee income.

## What automated range managers do for you

Moving a range by hand costs gas and attention. So a layer of automated liquidity managers grew up to do it for you, usually as vaults. You deposit, and the vault picks and moves the range. Each move trades higher in-range fees against the gas and the risk of the price leaving the range again [6].

They mostly run one of three playbooks.

### Re-centre on the current price

Keep a symmetric band around the price. When the price drifts past a trigger, pull everything out, swap back to an even split, and mint a fresh band around the new price.

This is the simplest approach and the most exposed in a trend. Each re-centre locks in the loss from the move that triggered it, and a trending market keeps triggering it.

### Wide base plus a one-sided limit

Keep most of the money in a wide, quiet band that earns a base fee. Park the rest just outside the current price, on one side only.

Incoming trades then do the rebalancing for you. Nothing gets swapped at a market price, so you avoid price impact — the way your own order pushes the rate against you — and you skip the cost of a separate swap.

### Widen and narrow with volatility

Set the band from a volatility estimate rather than a fixed width. When the market gets jumpy, widen out so you stay in range. When it calms down, tighten up and earn more per dollar.

Vaults that re-centre rigidly can trail a simple hold through strong trends, for the reason above. How a vault sends its rebalancing trades matters too. A trade broadcast to the public mempool — the waiting area for unconfirmed transactions — can be front-run by bots [5]. Profit from controlling transaction order is known as MEV [9]. Routing through batch auctions or private relays reduces the exposure. [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/) covers the whole attack surface.

## Where market makers lose money

| The mistake | What actually goes wrong | What a desk does instead |
| :--- | :--- | :--- |
| Not checking the hurdle | Fee yield sits below the bleed rate, so the position loses on average | Work out the hurdle first, and leave when the seven-day fee rate drops under it |
| Blind re-centring | Forcing an even split at the edge of a band locks in the worst price of the move | Rebalance with one-sided ranges or batch auctions, gradually |
| Tight ranges through known events | A rate decision or a fork blows straight through a narrow band | Widen before scheduled events, or buy a cheap option hedge |
| Ignoring funding | A short hedge bleeds funding faster than the pool earns fees | Watch the funding rate and move the hedge venue when it inverts |
| Treating it as savings | Expecting a steady rate from something that is a volatility bet | Size it as a trade, not as a deposit |

## What Uniswap v4 hooks change

Uniswap v4 puts every pool inside one contract, called a singleton — a single contract holding all pools rather than one contract per pair [2]. A pool can attach its own code, called a hook, which can run before or after each swap [7].

Four of those uses matter to anyone quoting seriously.

- **Fees that rise with volatility.** Rather than a flat 30 basis points (0.30%) through a crash, a dynamic-fee pool's hook can read a volatility measure and lift the fee while it lasts [2].
- **Limit orders inside the pool.** A range can be minted on one side and switched off the moment it fills, so the pool does not sell it back when the price retraces [2]. See [Range Orders on AMMs](/guides/range-orders-on-amms/).
- **Auctioning the right to trade first.** A pool manager role can be auctioned, so the value of correcting stale prices is paid back to depositors rather than kept by searchers [11].
- **Cheaper repositioning.** Flash accounting — running the tally in scratch memory and settling once at the end — lets a desk claim fees and re-mint several ranges in one transaction [2].

The two swap callbacks a hook implements look like this in the deployed v4.0.0 release:

```solidity
interface IHooks {
    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external returns (bytes4, BeforeSwapDelta, uint24);

    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata hookData
    ) external returns (bytes4, int128);
}
```

## Which venue fits which pair

| | Full range, Uniswap v2 | Chosen range, Uniswap v3 | Stepped bins | Hooks, Uniswap v4 | Stable pairs, Curve |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Work required | None, set and forget | High, constant watching | High, bin and step choices | Varies, hooks can automate | Low, until a peg breaks |
| Exposure to stale-quote bleed | Moderate | Severe, a tight band magnifies it | Concentrated in the bins the price crosses | Lower where fees adapt | Low, then sudden |
| Ease of hedging | Simple, smooth | Awkward, changes shape at the edges | Jumpy, moves in steps | Depends on the hook | Near zero, then a jump |
| Pairs it suits | Thin, unpegged, long-tail | Deep majors such as ETH/USDC | Volatile pairs needing adaptive fees | Custom strategies | Assets meant to track each other |

For pegged pairs and yield-bearing collateral, see [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/) and [Liquidity Provider Fees](/guides/liquidity-provider-fees/).

## What to check before you commit capital

1. **Work out the hurdle.** Take the pair's annual volatility, square it, divide by eight. Compare that with daily volume times the fee rate, times 365, divided by the liquidity working near the price. If the margin is thin, a small error in your volatility estimate wipes it out [4].
2. **Find out who you are trading with.** What share of volume comes from bots correcting stale prices, rather than ordinary users? Arbitrage volume pays fees but brings LVR with it, so the higher that share, the less each dollar of volume is worth to you.
3. **Write the rebalancing rule down first.** Decide the trigger before you deposit: a time-based rule, or a rule on how lopsided the position gets. Then check that the fees you expect to earn between rebalances clearly exceed the gas of one rebalance.
4. **Stress the hedge, not just the pool.** If you are hedging, ask what happens when the venue's interface goes down, or when the price gaps. Confirm your collateral survives a move far larger than last month's.
5. **Size it as a trade.** This is underwriting, not a deposit. Work out what you would hold, and what it would be worth, if the price ran through your lower bound, and size so that outcome is acceptable.

## Where to watch the numbers

- **Your position's live exposure:** [Revert Finance](https://revert.finance) shows how much of each token you hold across active ranges.
- **Funding and open interest for hedging:** [Hyperliquid](https://hyperliquid.xyz) and [dYdX](https://dydx.exchange).
- **How long the price actually stays in a band:** [Dune Analytics](https://dune.com).

## When something goes wrong

- **The position has gone badly lopsided.** The market trended and you are holding mostly the loser. Check funding, then either short the balance or rebalance gradually rather than in one order.
- **The hedge is bleeding funding.** Funding costs have overtaken fee income. Cut the hedge ratio, or switch to an option that caps the downside for an upfront premium instead of a daily funding cost.
- **The price keeps leaving your band.** The market moves more than your band is wide. Widen it. You earn less per dollar and stay in the game.

## Where to go next

The hurdle every quoting strategy has to clear is derived in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/). For the fee side of the equation, see [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/) and [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## References

1. [High-frequency trading in a limit order book (Avellaneda & Stoikov, 2008)](https://www.math.nyu.edu/~avellane/HighFrequencyTrading.pdf)
2. [Uniswap v4 Core (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)](https://arxiv.org/abs/1904.05234)
6. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
7. [Uniswap v4 Hooks (Uniswap developer documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/hooks)
8. [On The Quality Of Cryptocurrency Markets: Centralized Versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
9. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
10. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
11. [am-AMM: An Auction-Managed Automated Market Maker (Adams et al., 2024)](https://arxiv.org/abs/2403.03367)

[1]: https://www.math.nyu.edu/~avellane/HighFrequencyTrading.pdf "High-frequency trading in a limit order book (Avellaneda & Stoikov, 2008)"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core (Adams et al., 2024)"
[3]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core (Adams et al., 2021)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[5]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)"
[6]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[7]: https://developers.uniswap.org/docs/protocols/v4/concepts/hooks "Uniswap v4 Hooks (Uniswap developer documentation)"
[8]: https://arxiv.org/abs/2112.07386 "On The Quality Of Cryptocurrency Markets: Centralized Versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[9]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[10]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[11]: https://arxiv.org/abs/2403.03367 "am-AMM: An Auction-Managed Automated Market Maker (Adams et al., 2024)"
