---
title: "DLMM Explained: Bin-Based Liquidity, Dynamic Fees and Meteora"
description: "How bin-based pools give trades a flat price, how the fee raises itself when the market moves fast, and how to shape your deposit across the bins."
category: "LP Mechanics"
date: 2026-09-07
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "7 min read"
keywords: "DLMM, discretized liquidity, Trader Joe Liquidity Book, Meteora DLMM, zero slippage bins, volatility accumulator, bin step, DLMM explained, DLMM vs concentrated liquidity, liquidity bins crypto, Liquidity Book, volatility accumulator DLMM"
featured: false
faq:
  - q: "What is DLMM?"
    a: "A Dynamic Liquidity Market Maker, the name Meteora uses for pools that divide the price axis into fixed bins. Each bin quotes a single price, so trades inside a bin have zero slippage and price moves in steps as bins are consumed."
  - q: "How is DLMM different from concentrated liquidity?"
    a: "Concentrated liquidity uses a continuous curve within a chosen range; DLMM uses discrete bins that can be filled in arbitrary shapes. Bins also allow fees that respond to how fast price is moving across them."
  - q: "What is a volatility accumulator?"
    a: "A running measure of how many bins price has crossed recently, used to raise the fee during fast moves. It is a protocol-level attempt to charge arbitrage more when the pool's quote is most likely to be stale."
  - q: "What are zero slippage liquidity bins?"
    a: "In a bin-based design, each bin quotes a single fixed price, so a trade that stays inside one bin executes with no price movement at all. Price changes only when a trade exhausts a bin and moves to the next one."
  - q: "What is a volatility accumulator in DLMM?"
    a: "A volatility accumulator in DLMM tracks how many bins price has crossed recently, decaying over time. The accumulated value feeds the fee function, so rapid movement raises the fee while a quiet market lets it fall back to the base rate."
---

In most pools, your price gets worse as your trade executes. Even a small swap nudges it. That is just how a curve works.

Bin-based pools do something different. They stack the price axis into shelves, and every trade inside one shelf happens at exactly one price. No drift, no curve, nothing moving against you until the shelf runs empty.

Two designs work this way: Liquidity Book, built by Trader Joe (now LFJ), and Meteora on Solana. This guide covers how the shelves work, how these pools raise their own fee when the market gets fast, and how to spread your deposit across them.

<figure class="article-figure">
  <img src="/images/guides/discretized-liquidity-dlmm-explained.webp" alt="Price bins with the active bin holding both tokens, bins above holding one token and bins below holding the other, beside a fee that rises with recent bin crossings." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Each bin quotes one price, only the active bin holds both tokens, and the fee rises while price is crossing bins quickly. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"The flat price inside a bin is the headline, but the fee mechanism is the real innovation. On a fixed-fee pool, a violent move is a gift to whoever is fastest. Here the pool notices the move itself, from its own trades, and raises the fee while it lasts. No price feed, no delay. That is the part worth deposit money for."*

## Shelves instead of a curve

Picture the price axis cut into rungs. Each rung holds inventory and quotes one fixed price [3].

Only one rung is live at any moment. Every rung above it holds only the risky token, waiting to be sold as the price rises. Every rung below it holds only the quote token, waiting to buy as the price falls. The live rung holds a bit of both, and that is where trading happens.

$$
P_i \cdot x + y = L_i
$$

Where:

- $P_i$ is the one price this rung quotes.
- $x$ and $y$ are how much of each token the rung holds.
- $L_i$ is the rung's total value.

The consequence is what matters. Because the price in that line is a fixed number rather than a ratio that shifts, trading inside a rung costs nothing extra. You get exactly $P_i$ until the rung runs out of what you are buying [3] [4].

Then the price steps. Not slides, steps, straight to the next rung.

## How far apart the rungs sit

The gap between rungs is a setting called the bin step, quoted in basis points (hundredths of a percent) [3].

$$
P_i = \left(1 + \frac{\text{binStep}}{10{,}000}\right)^i
$$

Where:

- $\text{binStep}$ is the gap setting, so 10 means each rung is 0.1% above the last.
- $i$ is which rung you are counting to.

Make it concrete. With a 10 basis point step — 0.1% between rungs — and a rung at \$1,000, the one above sits at \$1,001 and the one below at \$999.

Choosing this well is the main decision you make. A tight step means smooth prices and lots of rung crossings, each adding to the trader's gas. A wide step means fewer crossings and bigger jumps, which sends traders elsewhere. Pegged pairs want one or two basis points. Liquid volatile majors often use 10 to 25. Thin or very volatile tokens use 50 to 100 or more. See [Constant Product Formula](/guides/constant-product-formula/) for what the curve-based alternative does instead.

## The fee that raises itself

Fixed fees have one bad property. During a violent move, when your quote is most likely to be wrong, the fee is exactly the same as on a quiet Sunday. That is when arbitrage makes its money [5].

Bin pools fix this without any external price feed. The pool counts how many rungs the price has crossed recently, and lets that count decay when things calm down [3].

$$
f_{\text{total}} = f_{\text{base}} + A \cdot (V_a \cdot s)^2
$$

Where:

- $f_{\text{base}}$ is the floor fee, set by the bin step.
- $V_a$ is the running count of recent rung crossings.
- $s$ is the bin step.
- $A$ is a multiplier the protocol sets.

That count is squared, so the fee climbs steeply rather than gently. In practice:

| What the market is doing | What the count does | What you charge |
| :--- | :--- | :--- |
| Quiet, trades stay in one or two rungs | Decays toward zero | The base fee, maybe 0.05% |
| Fast, a trade sweeps 25 rungs in two blocks | Spikes | Much higher, sometimes near 2% |

The effect is that arbitrage pays a wide spread exactly when it is taking the most from you, and ordinary traders get a tight spread the rest of the time [3] [5]. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/) for impermanent loss — the gap between a pool position and simply holding — which is what that cost looks like with no protection at all.

## Three ways to spread your deposit

Because each rung is separate, you choose how much goes in each one. That is more control than a single range gives you [3] [6].

| Shape | What it looks like | Suits | The catch |
| :--- | :--- | :--- | :--- |
| Spot | The same amount in every rung you pick | Most pairs, when you have no strong view | Moderate fees, but it keeps working as price moves across your range |
| Curve | Heavy in the middle, thinning toward the edges | Pegged pairs and range-bound markets | Highest fees while price sits still, and it converts fastest when price leaves |
| Bid-ask | Light in the middle, heavy at the edges | Buying dips and selling rallies | Behaves like a ladder of limit orders rather than passive market making |

Any of the three can also be placed on one side of the price only. A one-sided deposit above the market sells as the price rises through it, at exactly the prices you chose. There is no slippage — the gap between the price you expected and the one you got — and no order book.

## What your position is, technically

Uniswap v3 gives you an NFT, because every range is unique and cannot be interchanged [2].

Liquidity Book gives you a share of each rung you funded, and those shares are fungible [3]. Two people in rung 1,420 hold the same thing. Meteora instead records each deposit as its own position account on Solana [4].

Fungible rung shares have two practical benefits. Lending markets can price a bin share without unpicking a custom range, and you can put earned fees straight back into a rung without any wrapper contract. See [Liquidity Pool Tokens](/guides/liquidity-pool-tokens/).

## How this compares with range-based pools

| | Range-based, Uniswap v3 and v4 | Bin-based, Liquidity Book and Meteora |
| :--- | :--- | :--- |
| Price inside your zone | Moves continuously with every trade | Completely flat until the rung empties |
| Defence against fast markets | A fixed tier, or custom code | Built in, the pool raises its own fee |
| Your position | An NFT, recorded inside the pool contract on v4 | Rung shares on Liquidity Book, a position account on Meteora |
| Cost of crossing | Loading the next step | Stepping to the next rung |
| Where you find it | Ethereum, Arbitrum, Base, Optimism | Avalanche, Arbitrum, Solana |

## What people get wrong about bin pools

| What people assume | What actually happens |
| :--- | :--- |
| A wide bin step protects me | It makes the price jump in big steps, so traders route around you and your volume falls |
| Piling everything on the live rung is best | It gives the highest headline yield and stops earning on the first real move |
| The yield I see will continue | Much of it can be the volatility fee, which collapses back the moment the market calms |
| Re-centring after a move fixes things | Moving a drained rung by hand sells the loser and buys the winner at the worst possible price |

## What to check before you deposit

1. **Match the bin step to the pair.** Look at how far the price typically travels in an hour, and pick a step that does not force constant crossings.
2. **Pick the shape on purpose.** Spot, curve or bid-ask, chosen from what you expect the market to do, not from which shows the biggest number.
3. **Read the fee settings.** How fast does the count decay, and how big is the multiplier? Those decide how much protection you actually get.
4. **Write down your out-of-range rule** before the price gets there.
5. **Check the gas maths.** Fees accrue per rung, so claiming across many rungs costs more. On a small position that can be the whole return.

## Where to watch the numbers

- **Bin distribution, live rung and current fee:** [Meteora](https://app.meteora.ag).
- **Rung crossings and volume over time:** [Dune Analytics](https://dune.com).
- **Per-rung fee growth:** the protocol's own indexing interface.

## When something goes wrong

- **The price has left your live rung.** That rung ran out of one token and trading moved on. If your shape spans a wider set of rungs, earning resumes when the price comes back through.
- **The fee has jumped a long way.** The market is moving fast and the pool is protecting you. Leave it alone. That high fee is the compensation.
- **Transaction costs are eating your returns.** Claiming and moving liquidity across many rungs costs more than a small position earns. Claim less often, or fund fewer rungs.

## Where to go next

For how bin designs sit among the alternatives, see [Types of Liquidity Pools](/guides/liquidity-pool-types/). For the boundary problem every range design shares, see [Out-of-Range Liquidity](/guides/out-of-range-liquidity/). For the operating decisions on top of this, see [Meteora DLMM Strategy](/guides/meteora-dlmm-strategy/).

## References

1. [Uniswap v3 Core Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
2. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
3. [Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)](https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873)
4. [What is DLMM? (Meteora Documentation)](https://docs.meteora.ag/core-products/dlmm/what-is-dlmm)
5. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
6. [An Introduction to Liquidity Shapes (LFJ Documentation)](https://docs.lfj.gg/liquidity-book-resources/liquidity-book-dlmm-shapes-and-strategies/an_introduction_to_liquidity_shapes_6707938)
7. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
8. [When Does the Tail Wag the Dog? Curvature and Market Making (Angeris et al., 2020)](https://arxiv.org/abs/2012.08040)
9. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[3]: https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873 "Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)"
[4]: https://docs.meteora.ag/core-products/dlmm/what-is-dlmm "What is DLMM? (Meteora Documentation)"
[5]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[6]: https://docs.lfj.gg/liquidity-book-resources/liquidity-book-dlmm-shapes-and-strategies/an_introduction_to_liquidity_shapes_6707938 "An Introduction to Liquidity Shapes (LFJ Documentation)"
[7]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[8]: https://arxiv.org/abs/2012.08040 "When Does the Tail Wag the Dog? Curvature and Market Making (Angeris et al., 2020)"
[9]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
