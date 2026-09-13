---
title: "Market Making on AMMs: How Professional Liquidity Providers Work"
description: "What professional liquidity providers actually do: sizing ranges to volatility, hedging price risk, clearing the LVR hurdle, and reading vault strategies."
category: "Advanced"
date: 2026-08-22
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "12 min read"
keywords: "market making AMM, AMM liquidity provider, delta hedging AMM, automated liquidity management, LVR minimization, concentrated liquidity market maker, passive market making DeFi, liquidity pool vs market making, market making DeFi"
featured: false
faq:
  - q: "Is providing liquidity the same as market making?"
    a: "Structurally yes: you post continuous two-sided quotes and earn a spread. The difference is that a pooled quote cannot be cancelled or repriced between trades, which is why adverse selection is larger than for an active market maker."
  - q: "How do professional LPs manage inventory?"
    a: "By sizing ranges against realised volatility, rebalancing on rules rather than reactions, hedging delta on a perpetual or options venue when the position is large, and measuring performance against a rebalancing benchmark rather than a dollar return."
  - q: "Is passive liquidity provision viable?"
    a: "On pairs where turnover is high relative to volatility, yes. On volatile pairs with modest volume, passive positions tend to underperform holding once divergence and gas are included."
---

A market maker on a normal exchange quotes a price to buy and a price to sell, and changes those quotes whenever the market moves. Cancel, requote, repeat, thousands of times a second.

When you put money into a pool, you are doing the same job with one hand tied. Your quote is written into a contract. It does not move until somebody trades against it. You cannot cancel it, and you cannot widen it because the news looks bad.

That single difference explains almost everything about how pool returns behave. This guide covers what your quote is really worth, the number your fees have to beat, how larger desks hedge the price risk, and what to check before you commit money.

<figure class="article-figure">
  <img src="/images/guides/market-making-on-amms.webp" alt="A token inventory feeding a curved pool, with price feeds from outside markets and a hedge line running back to the inventory." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A pool position is a quote you cannot cancel, so desks watch the outside price and hedge the inventory the pool leaves them with. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"A desk on Nasdaq repositions in microseconds. Onchain, you reprice once per block, and only when somebody trades. Your real enemy is not holding the wrong token overnight. It is the trader who saw the price move before your pool did. Everything a professional desk does here is aimed at that one problem."*

## How a pool quotes without a trader

An ordinary market maker watches a reference price and shades its quotes. Sitting on too much of a token? Quote it a little cheaper, so the market takes it off your hands.

A pool has no such judgement. It follows one rule written in the contract, called its invariant — the fixed relationship between the token balances that the pool refuses to break [2]. Price falls out of the ratio of what it holds. Nothing else.

So the pool never knows the market moved. It keeps quoting yesterday's price until somebody comes and takes the good side of it. Those traders are arbitrageurs — people who make money on the gap between one venue's price and another's — and they are the reason your quote is worth less than it looks.

| What a desk does | Order book venue | Pool, full range | Pool, chosen range |
| :--- | :--- | :--- | :--- |
| Update a quote | Any time, in microseconds | Only when a swap lands | Only when a swap lands |
| React to bad news | Cancel instantly | No defence at all | No defence at all |
| Rebalance holdings | Shade quotes, pull orders | Happens automatically along the curve | Happens automatically inside your band |
| Widen in a panic | Yes, spreads move with volatility | No, the fee is fixed | Fixed, unless a hook changes it |
| Capital used well | High, with margin and netting | Low, money spread everywhere | High, money packed where you chose |

Put plainly, a deposit is a standing instruction to trade, handed to the whole internet, that you cannot take back. The rule behind it is covered in [Automated Market Makers Explained](/guides/automated-market-maker-explained/) and [Constant Product Formula](/guides/constant-product-formula/).

## Why a narrow range is really a short options bet

Picking a price band changed the job. A full-range deposit behaves like a slow index fund. A narrow band behaves like selling options [3].

Here is why. Inside your band, the pool sells whichever token is rising and buys whichever is falling. It does that on every tick of the way. You end up with a position that gains less than holding when the price rises and loses more than holding when it falls. Whichever way a big move goes, it trails holding.

Traders call that being short gamma. The plain version: you make a steady trickle while the market is quiet, and you lose when it moves fast. The fee stream is your premium for taking that bet.

| Where the price is | What you hold | What you earn | What it feels like |
| :--- | :--- | :--- | :--- |
| Below your band | All of the risky token | Nothing | You bought the whole way down and stopped |
| Inside your band | A mix that shifts as price moves | Fees on every swap | The good case, as long as it lasts |
| Above your band | All of the stable token | Nothing | You sold the whole way up and stopped |

So the whole strategy reduces to one question. Does the fee income while you sit inside the band beat what the band costs you on the way out? Band width is covered in [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## The number your fees have to beat

Most people measure a pool position against holding the tokens. That gap is impermanent loss — the difference between what your deposit is worth now and what the same tokens would have been worth untouched.

It is a poor yardstick for anyone doing this seriously. Impermanent loss only looks at where the price started and where it ended. A token can swing wildly for a month, come back to the same price, and show zero impermanent loss. Against holding, that is accurate. Against running the same exposure yourself at market prices, you fell behind on every swing, and that is the gap your fees exist to cover.

The better yardstick is loss-versus-rebalancing, or LVR — the money your pool hands to faster traders simply because its quote is always a block behind [4]. It counts every swing, not just the endpoints.

Research puts the bleed rate at a simple shape:

$$
\frac{d(\text{LVR})}{dt} = \frac{\sigma^2}{4} \cdot L \cdot \sqrt{P}
$$

Where:

- $\sigma$ is how much the pair moves, measured as annual volatility.
- $L$ is how much liquidity you have working at the current price.
- $P$ is the current price.

The shape is the lesson. Volatility is squared, so doubling how much a pair moves roughly quadruples what your quote costs you. Volume does not appear at all. A pair that moves twice as hard needs about four times the fee income to stay level.

That gives you a single test for any pool:

$$
\text{Net} = \text{fees earned} - \text{LVR} - \text{gas and rebalancing costs}
$$

Where:

- **Fees earned** is 24-hour volume times the fee rate, divided by the money actually working at the current price.
- **LVR** is the bleed above. For a full-range position you can approximate it as annual variance divided by eight, and a band multiplies it.
- **Gas and rebalancing costs** is what you pay to move, claim, and re-mint.

If that comes out negative, no amount of range tuning fixes it. You are in the wrong pool. The full derivation sits in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/) and [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

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

Two costs come with this. First, keeping the hedge sized right means buying as the price rises and selling as it falls, which is the expensive direction. Over time those adjustment costs converge on the LVR number above, which is exactly what the research predicts [4] [6].

Second is funding. In a strong bull market, shorts collect funding and your yield improves. In a long bear market, shorts pay it, and that drag can swallow your fees whole.

## What automated range managers do for you

Moving a range by hand costs gas and attention. So a layer of vaults grew up to do it for you, from teams such as Arrakis, Gamma, DefiEdge and Bunni. You deposit, and the vault picks and moves the range.

They mostly run one of three playbooks.

### Re-centre on the current price

Keep a symmetric band around the price. When the price drifts past a trigger, pull everything out, swap back to an even split, and mint a fresh band around the new price.

This is the simplest approach and the most dangerous one in a trend. The vault sells the falling token at the bottom and buys the rising one at the top, over and over.

### Wide base plus a one-sided limit

Keep most of the money in a wide, quiet band that earns a base fee. Park the rest just outside the current price, on one side only.

Incoming trades then do the rebalancing for you. Nothing gets swapped at a market price, so you avoid price impact — the way your own order pushes the rate against you — and you skip the gas as well.

### Widen and narrow with volatility

Set the band from a volatility estimate rather than a fixed width. When the market gets jumpy, widen out so you stay in range. When it calms down, tighten up and earn more per dollar.

Vaults that re-centre rigidly have tended to trail a simple hold through strong trends, for exactly the reason above. Newer ones route their rebalancing trades through batch auctions instead of firing market orders into the open queue [5]. That keeps bots from front-running the move and taking a cut, a practice known as MEV. [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/) covers the whole attack surface.

## Where market makers lose money

| The mistake | What actually goes wrong | What a desk does instead |
| :--- | :--- | :--- |
| Not checking the hurdle | Fee yield sits below the bleed rate, so the position loses on average | Work out the hurdle first, and leave when the seven-day fee rate drops under it |
| Blind re-centring | Forcing an even split at the edge of a band locks in the worst price of the move | Rebalance with one-sided ranges or batch auctions, gradually |
| Tight ranges through known events | A rate decision or a fork blows straight through a narrow band | Widen before scheduled events, or buy a cheap option hedge |
| Ignoring funding | A short hedge bleeds funding faster than the pool earns fees | Watch the funding rate and move the hedge venue when it inverts |
| Treating it as savings | Expecting a steady rate from something that is a volatility bet | Size it as a trade, not as a deposit |

## What Uniswap v4 hooks change

Uniswap v4 puts every pool inside one contract, called a singleton — a single contract holding all pools rather than one contract per pair [2] [7]. A pool can now attach its own code, and that code runs before or after each swap.

Four of those uses matter to anyone quoting seriously.

- **Fees that rise with volatility.** Rather than a flat 30 basis points (hundredths of a percent) through a crash, a hook can read a volatility measure and lift the fee while the danger lasts [4] [7].
- **Limit orders inside the pool.** A range can be minted on one side and switched off the moment it fills, so the pool does not sell it back when the price retraces [2]. See [Range Orders on AMMs](/guides/range-orders-on-amms/).
- **Auctioning the first trade of a block.** The right to correct a stale price gets sold to the highest bidder, and the proceeds go back to depositors rather than to searchers [5] [7].
- **Cheaper repositioning.** Flash accounting — running the tally in scratch memory and settling once at the end — lets a desk claim fees and re-mint several ranges in one transaction [2].

The interface a hook implements looks like this:

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
| Exposure to stale-quote bleed | Moderate | Severe, a tight band magnifies it | Severe in the live bin, none outside | Lower where fees adapt | Low, then sudden |
| Ease of hedging | Simple, smooth | Awkward, changes shape at the edges | Jumpy, moves in steps | Depends on the hook | Near zero, then a jump |
| Pairs it suits | Thin, unpegged, long-tail | Deep majors such as ETH/USDC | Volatile pairs needing adaptive fees | Custom strategies | Assets meant to track each other |

For pegged pairs and yield-bearing collateral, see [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/) and [Liquidity Provider Fees](/guides/liquidity-provider-fees/).

## What to check before you commit capital

1. **Work out the hurdle.** Take the pair's annual volatility, square it, divide by eight. Compare that to 24-hour volume times the fee rate, divided by the money working near the price. If it is close, the pool is not worth the effort [4].
2. **Find out who you are trading with.** What share of volume comes from bots correcting stale prices, rather than ordinary users? Above roughly 60%, fees rarely cover what those trades cost you [5].
3. **Write the rebalancing rule down first.** Decide the trigger before you deposit. A time-based rule, or a rule on how lopsided the position gets. Aim for daily fees at least five times your expected gas.
4. **Stress the hedge, not just the pool.** If you are hedging, ask what happens when the venue's interface goes down, or when the price gaps. Confirm your collateral survives a move far larger than last month's.
5. **Size it as a trade.** This is underwriting, not a deposit. If the position would hurt at ten times the size, it is already too large.

## Where to watch the numbers

- **Your position's live exposure:** [Revert Finance](https://revert.finance) shows how much of each token you hold across active ranges.
- **Funding and open interest for hedging:** [Hyperliquid](https://hyperliquid.xyz) and [dYdX](https://dydx.exchange).
- **How long the price actually stays in a band:** [Dune Analytics](https://dune.com).

## When something goes wrong

- **The position has gone badly lopsided.** The market trended and you are holding mostly the loser. Check funding, then either short the balance or rebalance gradually rather than in one order.
- **The hedge is bleeding funding.** Funding costs have overtaken fee income. Cut the hedge ratio, or switch to an option that caps the downside without a daily cost.
- **The price keeps leaving your band.** The market moves more than your band is wide. Widen it. You earn less per dollar and stay in the game.

## Where to go next

The hurdle every quoting strategy has to clear is derived in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/). For the fee side of the equation, see [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/) and [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## References

1. [High-frequency trading in a limit order book (Avellaneda & Stoikov, 2008)](https://www.math.nyu.edu/~avellane/HighFrequencyTrading.pdf)
2. [Uniswap v4 Core Whitepaper](https://uniswap.org/whitepaper-v4.pdf)
3. [Uniswap v3 Core Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing](https://arxiv.org/abs/2208.06046)
5. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges](https://arxiv.org/abs/1904.05234)
6. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
7. [Uniswap v4 Developer Documentation: Hooks Architecture](https://docs.uniswap.org/contracts/v4/concepts/hooks)
8. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
9. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
10. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://www.math.nyu.edu/~avellane/HighFrequencyTrading.pdf "High-frequency trading in a limit order book (Avellaneda & Stoikov, 2008)"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges"
[6]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[7]: https://docs.uniswap.org/contracts/v4/concepts/hooks "Uniswap v4 Developer Documentation: Hooks Architecture"
[8]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[9]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[10]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
