---
title: "Automated Market Makers Explained: How an AMM Actually Works"
description: "How an AMM quotes a price from its own reserves, what three generations of design changed, where your execution cost really comes from, and what to check first."
category: "Foundations"
date: 2026-09-08
lastReviewed: "2026-09-12"
author: "Dr. Kieran Thorne"
readTime: "8 min read"
keywords: "automated market maker, AMM explained, AMM pool, DeFi exchange, singleton contract, hooks, flash accounting, how does an AMM work, what is an AMM, AMM crypto, AMM liquidity pool"
featured: true
faq:
  - q: "How does an AMM work?"
    a: "An automated market maker prices trades from a formula applied to its reserves rather than from an order book. Traders deposit one asset and withdraw another, the reserves change, and the formula returns a new price. Arbitrage keeps that price aligned with external markets."
  - q: "What is the difference between an AMM and a DEX?"
    a: "A decentralised exchange is the venue; an automated market maker is one mechanism a venue can use to price trades. Some decentralised exchanges run order books instead, and intent-based systems settle through solvers rather than either."
  - q: "How does a liquidity pool set price?"
    a: "By the invariant. In a constant-product pool the marginal price is the ratio of the two reserves, so buying an asset reduces its reserve and raises its price for the next trade. Other curve designs change how quickly that happens."
---

On a normal exchange, your buy order waits until somebody posts a matching sell. An automated market maker, or AMM, removes the waiting. It always has a price, because it works one out from what it is holding right now.

That is the whole trick, and it is also the whole problem. The contract has no idea what your token is worth anywhere else. It quotes from its own shelves, and it keeps quoting the old number until someone trades against it.

This guide covers how that pricing works, how the design has changed over three generations, where your real trading cost comes from, and what to check before you trade or deposit.

<figure class="article-figure">
  <img src="/images/guides/automated-market-maker-explained.webp" alt="An automated market mechanism moves token inventory along a pricing curve." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>An automated market maker operates as an inventory rule governed by an invariant curve. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"People read the pool rule as a price formula. It is not. It is a boundary the contract is not allowed to cross, and everything else follows from that. If you are writing pool logic yourself, round every number in the pool's favour. Round up what a trader must put in, round down what they take out. The rounding errors are where the money leaks."*

## An AMM is a shelf, not a price feed

Picture a shop with two shelves. One holds ETH, the other holds USDC. The rule says the two shelf counts multiplied together must never fall [1].

Take ETH off the first shelf and you have to put enough USDC on the second to keep that number level. Take more and you have to put on proportionally more still. That is where the price comes from, and it is why the rate gets worse as your order gets bigger.

The pool never checks anywhere else. It does not know ETH just moved on Binance. It keeps offering yesterday's rate until someone walks in and takes the good side, which is exactly what arbitrage traders do all day. The formal treatment is in [Constant Product Formula](/guides/constant-product-formula/).

The one relationship the pool refuses to break is called its invariant — the rule holding the shelves in line. Different pools use different ones, and that choice decides how the price behaves.

## How AMM design changed over three generations

| Generation | What it looked like | Where money sat | Fee | The catch |
| :--- | :--- | :--- | :--- | :--- |
| First, Uniswap v1 and v2 | One contract per pair | Spread across every price | Fixed 0.30% | Tokens moved on every hop, so routing was expensive |
| Second, Uniswap v3 | One contract per pair, money in bands | Only in the band you chose | Four fixed tiers | Money outside the live band does nothing |
| Third, Uniswap v4 and Ambient | Every pool in one contract | Bands, plus custom code | Can move with volatility | Hooks are code, and code can be written badly |

### First generation: one contract per pair

Every pair got its own contract. Every swap moved real tokens in and real tokens out. A trade routed through three pools paid for all of it, which made multi-hop routing costly [1] [3].

### Second generation: money in a chosen band

Uniswap v3 let you put money into a price band instead of across the whole range [2]. The same deposit could absorb far more trading, so it earned far more. But depth became patchy: money outside the live band earns nothing and fills nothing [2] [3].

### Third generation: one contract for everything

Newer designs put every pool inside a single contract — a pattern called a singleton, because one contract holds them all [1]. Three things follow:

- **The tokens stay put during a trade.** The contract keeps a running tally and settles once at the end. This is flash accounting — bookkeeping in scratch memory rather than real transfers at every step — and it cuts routing gas by most of what it used to cost [1].
- **Balances can live inside the contract.** Routers and depositors can hold internal claims rather than moving tokens back and forth [1].
- **Pools can run their own code.** Hooks fire at set moments: before and after a swap, before and after liquidity moves, and so on.

Hooks are what make modern pools interesting and what make them worth checking. They can raise the fee when the market gets jumpy, run limit orders inside the pool, or sweep fees somewhere. They can also do things you would not want. Read what a hook does before you deposit behind it.

## Where your trading cost actually comes from

Most people look at the fee tier and stop. The fee is usually the small part.

Two things decide what you pay. The fee is the advertised one. The other is price impact — the amount your own order moves the rate while it executes.

$$
\Delta y = y - \frac{k}{x + (1 - f) \cdot \Delta x}
$$

Where:

- $\Delta x$ is what you put in.
- $\Delta y$ is what you get out.
- $x$ and $y$ are the two pool balances before your trade.
- $f$ is the fee rate, so a 0.30% pool has $f = 0.003$.
- $k$ is the number the pool holds level.

The thing to take from it is the denominator. Your input sits at the bottom of a fraction, so the more you send, the less each extra unit gets back. Small trades barely notice. Large ones pay for the whole curve.

Three practical consequences:

- **The quoted price is not your price.** The screen shows the rate for an infinitely small trade. Yours is worse, and how much worse depends on your size against the money actually working near that price.
- **A cheap fee tier can be the expensive choice.** A 0.05% pool with thin depth often costs more in total than a 0.30% pool with real depth [1] [3].
- **Your tolerance setting is a backstop, not a plan.** It caps slippage — the gap between the quote you saw and the fill you got, usually because somebody traded in front of you. Set it wide on a public transaction and bots will take the whole difference [1] [5].

See [AMM vs Order Book](/guides/amm-vs-order-book/) for how this compares to matching buyers and sellers directly.

## How fees actually reach you

A swap fee is what you are paid for standing in the middle. In the older design it is simply added back to the pool, so your share is worth a little more each time [3]. In band-based pools it goes only to the money that was live for that particular trade [2] [3].

Newer pools let the fee move rather than sit fixed:

- **Fees that track volatility.** Trader Joe and hook-enabled Uniswap v4 pools watch how fast the price is moving and widen the fee while it lasts. That charges more to the traders picking off stale quotes [1] [3].
- **Fees that track imbalance.** Curve pools charge more when a trade pushes the pool further out of balance [4].

Two rules fall out of this. If you are trading, a low headline fee guarantees nothing about your total cost. If you are depositing, your fees stop the instant the price leaves your band, and they stop completely, not partially [2] [3].

## What happens when the price leaves your band

| Where the price is | What you are holding | What you earn |
| :--- | :--- | :--- |
| Above your band | All of the quote token, having sold the whole way up | Nothing |
| Inside your band | A mix, shifting as the price moves | Fees on every swap that crosses you |
| Below your band | All of the risky token, having bought the whole way down | Nothing |

A narrower band earns more per dollar while the price stays inside it, and pushes you outside it more often [2] [3]. That is the entire trade-off, and no setting removes it.

## What people get wrong about AMMs

| What people assume | What actually happens |
| :--- | :--- |
| The quoted price is what I will pay | That is the rate for a trade of almost nothing. Check the depth within 1% of it before sending size |
| A wide slippage setting is safer | It is an open invitation. Bots read public transactions and take exactly what you allowed |
| A band position is passive income | It needs watching. Out of range you earn nothing and hold the losing token |
| Big pool means good execution | The headline number counts idle money too. Only what sits near the price fills your trade |

## What to check before you trade or deposit

1. **Which rule is the pool using?** Full range, chosen band, stepped bins, or a stable-pair curve. Each behaves differently under stress [1] [4].
2. **Does the pool have hooks, and what do they do?** Check whether they can change fees, limit withdrawals, or pause trading [1].
3. **How much money sits near the price?** Look within 1% and 2% of the current rate, and compare that to your order size [1] [2].
4. **Is the pool balanced?** For pegged pairs, a lopsided pool is already near the steep part of its curve [4].
5. **How are you sending the order?** Anything large should go through a private relay or a batch auction rather than the open queue [5].

For how the fee side adds up, see [Liquidity Provider Fees](/guides/liquidity-provider-fees/).

## Where to watch the numbers

- **Simulate a trade before sending it:** [Tenderly](https://tenderly.co) replays swaps against the real contract.
- **Volume against pool size across protocols:** [DeFiLlama Yields](https://defillama.com/yields).
- **Your own position and fees earned:** [Revert Finance](https://revert.finance).

## When something goes wrong

- **A swap keeps reverting with a K error.** The pool's rule was breached, usually because fees were taken in the wrong order or a rounding step went the wrong way. Deduct fees before the check and round in the pool's favour.
- **The pool's price has drifted from everywhere else.** If the gap is smaller than the fees an arbitrage trader would pay to close it, nobody profits by closing it, and that is normal. If it is larger, check whether a transfer tax or a pause is blocking arbitrage.
- **Your position is losing money fast.** Faster traders are picking off a stale quote. Compare the fee tier against how much the pair has actually been moving.

## Where to go next

What a trader pays is broken down in [Slippage and Price Impact](/guides/slippage-and-price-impact/). What the same curve hands to arbitrage is measured by loss-versus-rebalancing — the money a pool loses simply because its quote is a block behind — covered in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/). The version comparison is in [Uniswap v3 vs v4](/guides/uniswap-v3-vs-v4/), the curve families in [Bonding Curves and AMM Invariants](/guides/bonding-curves-and-amm-invariants/), and the fee side in [Dynamic Fees in AMMs](/guides/dynamic-fees-in-amms/).

## References

1. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Fees in Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/fees)
4. [Curve StableSwap Exchange: Overview (Curve Knowledge Hub)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
5. [Maximal Extractable Value (MEV) Documentation (Ethereum.org)](https://ethereum.org/en/developers/docs/mev/)
6. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
7. [Constant Function Market Makers: Multi-Asset Trades via Convex Optimization (Angeris et al., Stanford)](https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf)
8. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees in Concentrated Liquidity"
[4]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview"
[5]: https://ethereum.org/en/developers/docs/mev/ "Maximal Extractable Value (MEV) Documentation"
[6]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[7]: https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf "Constant Function Market Makers: Multi-Asset Trades via Convex Optimization (Angeris et al., Stanford)"
[8]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
