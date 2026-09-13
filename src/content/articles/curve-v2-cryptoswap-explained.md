---
title: "Curve v2 Explained: Cryptoswap, Internal Oracles and TriCrypto Pools"
description: "How Curve v2 moves its own liquidity to follow the market, why it only pays for that out of fees, and when a TriCrypto pool is and is not the right place to be."
category: "LP Mechanics"
date: 2026-09-05
lastReviewed: "2026-09-12"
author: "Aria Chen"
readTime: "7 min read"
keywords: "Curve v2, Cryptoswap invariant, dynamic pegging, internal EMA oracle, TriCrypto pool, AMM repegging, Curve liquidity pool, volatile pair liquidity pool"
featured: false
faq:
  - q: "What is Curve v2 used for?"
    a: "Volatile pairs that still benefit from concentrated depth. It keeps liquidity clustered around an internally tracked price and repegs that centre automatically as the market moves, without the LP choosing bounds."
  - q: "How is Curve v2 different from Uniswap v3?"
    a: "Uniswap v3 asks the liquidity provider to choose and maintain a range. Curve v2 concentrates liquidity automatically around an internal oracle price and shoulders the rebalancing decision at the protocol level, funded by trading fees."
  - q: "What are the risks of an internal oracle?"
    a: "The repegging mechanism relies on the pool's own exponentially weighted price. Sharp moves can leave the centre lagging, and repegging itself consumes pool profits, so LP returns depend on the interaction between volatility and the repeg schedule."
---

Choosing a price range is the part of liquidity provision most people get wrong. Pick it too wide and you earn almost nothing. Too narrow and the market walks out of it while you sleep.

Curve v2 takes that decision away from you. The pool concentrates its own money around the current price, and when the market moves, the pool moves itself to follow. You deposit and you leave it alone.

The interesting part is how it pays for moving. This guide covers the rule it follows, the price it uses, the strict condition it puts on rebalancing, and when this design is the wrong choice.

<figure class="article-figure">
  <img src="/images/guides/curve-v2-cryptoswap-explained.webp" alt="A liquidity curve centred on an internal price, shown before and after the pool moves its centre, with a profit budget that funds the move." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The pool concentrates depth around its own smoothed price, and only moves that centre when fees it has already earned can pay for the move. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Aria Chen:**
> *"The clever part is the budget. In a range-based pool you personally pay for every re-centring. Here the pool pays, and only out of fees it has already banked. If the market moves faster than the pool earns, it simply declines to move. That protects your money. It also means a quiet pool in a fast market can quote a stale price for a long time."*

## The problem this design solves

Two older approaches, two bad outcomes.

A full-range pool spreads money across every price that could ever exist. It never needs attention, and almost none of the money ever does any work.

A range-based pool packs money where the trading happens, which works beautifully until the price leaves. Then you are out of range, earning nothing, and re-centring by hand at the worst possible moment [1] [2]. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/) for what that costs.

Curve v2, also called Cryptoswap, keeps the density and automates the moving [4].

## How the curve changes shape as it goes

The older Curve design assumed the two tokens should trade one-for-one. Curve v2 drops that assumption. It keeps an internal idea of what each token is worth, and measures the pool against that instead [4].

The shape of the curve is then controlled by two dials.

| Dial | What it controls | Turning it up |
| :--- | :--- | :--- |
| Amplification | How flat the curve is at the centre | Deeper liquidity right at the current price |
| Gamma | How wide the flat part is, and how fast it steepens | A broader comfortable zone before costs climb |

The behaviour is what matters. Near the middle, the curve is nearly flat, so trades clear at almost no cost. Push the pool badly out of balance and it steepens smoothly into an ordinary constant-product curve.

That steepening is a safety feature, not a flaw. A curve that stayed flat forever would let a falling asset drain everything the pool holds before the price moved enough to stop it [4] [5]. Compare with the pegged-pair case in [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

## The price the pool believes

A pool cannot call an exchange. It has to work out a price from what happens to it, and it has to do that without letting one trader rewrite it in a single block [4] [6].

Curve v2 keeps a smoothed average of its own trade prices:

$$
P_{\text{EMA}} = \alpha \cdot P_{\text{last}} + (1 - \alpha) \cdot P_{\text{previous}}
$$

Where:

- $P_{\text{last}}$ is the price of the most recent trade through the pool.
- $P_{\text{previous}}$ is the smoothed price from before that trade.
- $\alpha$ is how much weight the newest trade gets, set by a half-life usually between ten minutes and two hours [4].

The averaging is the defence. A trader who slams the price in one block barely moves a number built from hours of history, so there is nothing worth attacking [4] [6]. The cost is lag. This pool is never the fastest quote in the market, by design.

## The rule that stops it rebalancing badly

Automated vaults that re-centre on a schedule have a well-known failure. During a trend they sell the loser at the bottom and buy the winner at the top, again and again, and the drag compounds [2].

Curve v2 avoids that with one condition. It only moves if it can afford to.

The pool tracks a number called virtual price, which is its depth divided by the number of shares outstanding. Every trade pays a fee, typically a few hundredths of a percent when the pool is balanced and rising toward several tenths when it is lopsided. That fee pushes virtual price up, and the pool keeps a separate running record of all the profit it has ever made. That record is its rebalancing budget.

When the pool wants to shift its centre toward the smoothed price, it simulates the move first and checks one condition:

$$
VP_{\text{after}} \ge 1 + \frac{X - 1}{2}
$$

Where:

- $VP_{\text{after}}$ is what the virtual price would be if the move went ahead.
- $X$ is the pool's running profit record, which starts at 1 when the pool opens and only goes up.

In plain terms, a move may spend profit, but never more than half of everything the pool has earned so far. If the move would cost more than that, the pool refuses and waits for more fee income [4]. So rebalancing never comes out of your principal. The pool behaves like a business that only reinvests from profit, and keeps half of it in reserve.

The consequence is worth stating plainly. In a busy pool, this works well. In a quiet pool during a fast market, the centre lags badly, because there is no profit to fund the catch-up.

## What a TriCrypto pool actually holds

The flagship use of this design is the TriCrypto family, which puts three quite different assets in one pool [4].

| Slot | Typical asset | Why it is there |
| :--- | :--- | :--- |
| The quote | USDT or USDC | A dollar reference that barely moves |
| The macro asset | Wrapped BTC | Large, liquid, moves slowly relative to the rest |
| The chain asset | Wrapped ETH | The most volatile leg |

The practical gain is routing. On most venues, going from Bitcoin to Ethereum means two hops and two fees, or a thin direct pair [1]. In a TriCrypto pool, all three trade against each other inside one contract, and the pool rebalances across all three at once [4].

## Where Curve v1 and v2 differ

| | Curve v1, StableSwap | Curve v2, Cryptoswap |
| :--- | :--- | :--- |
| Built for | Assets meant to track each other | Assets that move freely |
| Centre of liquidity | Fixed at one-for-one | Moves to follow a smoothed internal price [4] |
| Needs a price source | No | Yes, its own average [4] |
| Fee | Fixed and low, often 0.01% to 0.04% | Rises with imbalance, set per pool |
| Work for you | None | None, the protocol does the rebalancing |

## What people get wrong about Curve v2

| What people assume | What actually happens |
| :--- | :--- |
| The pool tracks the market closely | It tracks a smoothed average with a lag measured in tens of minutes. It is not a venue for trading news |
| Virtual price going up means I am making money | Virtual price measures pool depth per share. If ETH and BTC both fall, you still lose money in dollars |
| I can pull out one token freely | Taking one asset out of an unbalanced pool costs you internal slippage plus a withdrawal fee |
| Any volatile pair suits this design | It needs real volume. Without fees there is no rebalancing budget, and the quote goes stale |

## What to check before you deposit

1. **How much does it actually trade?** Daily volume against pool size tells you whether there will be enough fee income to fund rebalancing.
2. **How fast is the averaging set?** Check the half-life in the contract and ask whether it suits how this pair usually moves.
3. **Does the fee cover the bleed?** Compare the fee range against how much the pair moves, since a fast pair hands more away to arbitrage [7].
4. **What are the wrapped assets actually backed by?** In a TriCrypto pool, confirm the Bitcoin and Ethereum legs are the canonical wrapped versions and not a thinner synthetic.
5. **How much of the yield is emissions?** Separate real fee income from token rewards, because only one of them survives an incentive programme ending [5].

## Where to watch the numbers

- **Pool state, internal price and the profit counter:** [Curve Finance](https://curve.fi).
- **Yield split between fees and emissions:** [DeFiLlama](https://defillama.com).
- **How much aggregator flow the pool actually gets:** [Dune Analytics](https://dune.com/curve).

## When something goes wrong

- **The pool's price is well away from the market.** Prices moved faster than trades arrived, so the average has not caught up. Do nothing. The contract adjusts as volume returns and pays for it out of profit.
- **The pool has stopped re-centring during a big move.** Fees are not covering the cost, so the rule is blocking the move to protect your money. Watch whether the trend holds before adding more.
- **You are behind a simple hold.** Choppy sideways markets trigger many small adjustments that eat fee income without ever settling. Ask whether this pair suits this design at all.

## Where to go next

For the manual version of the same decision, see [Out-of-Range Liquidity](/guides/out-of-range-liquidity/). For where this sits among the alternatives, see [Types of Liquidity Pools](/guides/liquidity-pool-types/).

## References

1. [Uniswap v3 Core Technical Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
2. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
3. [StableSwap pools (Curve Documentation)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
4. [Automatic market-making with dynamic peg (Egorov, Curve Cryptoswap whitepaper, 2021)](https://docs.curve.finance/pdf/whitepapers/whitepaper_cryptoswap.pdf)
5. [StableSwap - Efficient Mechanism for Stablecoin Liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
6. [Price Oracles and Time-Weighted Averages in AMMs](https://developers.uniswap.org/docs/protocols/v3/concepts/price-oracles)
7. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
8. [When Does the Tail Wag the Dog? Curvature and Market Making (Angeris et al., 2020)](https://arxiv.org/abs/2012.08040)
9. [While Stability Lasts: A Stochastic Model of Non-Custodial Stablecoins (Klages-Mundt & Minca, 2020)](https://arxiv.org/abs/2004.01304)
10. [Primary and Secondary Markets for Stablecoins (Federal Reserve FEDS Notes, 2024)](https://www.federalreserve.gov/econres/notes/feds-notes/primary-and-secondary-markets-for-stablecoins-20240223.html)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Technical Whitepaper"
[2]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[3]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "StableSwap pools (Curve Documentation)"
[4]: https://docs.curve.finance/pdf/whitepapers/whitepaper_cryptoswap.pdf "Automatic market-making with dynamic peg (Egorov, Curve Cryptoswap whitepaper, 2021)"
[5]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap - Efficient Mechanism for Stablecoin Liquidity (Egorov, 2019)"
[6]: https://developers.uniswap.org/docs/protocols/v3/concepts/price-oracles "Price Oracles and Time-Weighted Averages in AMMs"
[7]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[8]: https://arxiv.org/abs/2012.08040 "When Does the Tail Wag the Dog? Curvature and Market Making (Angeris et al., 2020)"
[9]: https://arxiv.org/abs/2004.01304 "While Stability Lasts: A Stochastic Model of Non-Custodial Stablecoins (Klages-Mundt & Minca, 2020)"
[10]: https://www.federalreserve.gov/econres/notes/feds-notes/primary-and-secondary-markets-for-stablecoins-20240223.html "Primary and Secondary Markets for Stablecoins (Federal Reserve FEDS Notes, 2024)"
