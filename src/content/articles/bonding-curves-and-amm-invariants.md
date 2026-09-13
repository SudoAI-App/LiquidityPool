---
title: "Bonding Curves and AMM Invariants: How Curve Shape Sets Risk"
description: "A pool is a curve plus a fee. The shape of the curve decides your execution, how fast your holdings rotate, and exactly which failure you are underwriting."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "6 min read"
keywords: "bonding curve crypto, invariant AMM, constant sum market maker, constant product market maker, curve shape slippage, AMM invariant design"
featured: false
faq:
  - q: "What is a bonding curve in crypto?"
    a: "A rule that maps a contract's reserves to a price. In an automated market maker the curve is the invariant: given the reserves, it determines the price of the next trade and how that price changes as the trade executes."
  - q: "What is an AMM invariant?"
    a: "The quantity the pool holds constant across a trade, before fees. Constant product keeps the product of reserves fixed, constant sum keeps their sum fixed, and amplified curves interpolate between the two using a coefficient."
  - q: "Which invariant has the least slippage?"
    a: "Constant sum, which quotes a fixed price until one reserve is exhausted. It is only usable for assets expected to trade at a fixed ratio, because it offers no defence when that assumption fails."
  - q: "Why do most pools use constant product?"
    a: "Because it never runs out of liquidity and requires no assumption about where the pair should trade. Price impact rises with order size, which is the mechanism that keeps reserves available at any price."
  - q: "How does curve shape affect impermanent loss?"
    a: "Flatter curves near the operating point rotate inventory faster for a given price move, so they lose more when the assumption behind the flatness breaks. Convex curves rotate gradually and produce the familiar divergence profile."
---

Every pool you can put money into is a curve plus a fee. Nothing else.

The curve decides how much depth sits at each price, how fast your holdings flip from one token to the other, and which specific disaster you are being paid to absorb. So picking a pool really means picking a curve.

There are three basic shapes, and every real pool is somewhere between them. This guide shows you what each one does, what it costs you, and how to read an unfamiliar one before you put money behind it.

<figure class="article-figure">
  <img src="/images/guides/bonding-curves-and-amm-invariants.webp" alt="Three curve families plotted on the same axes: constant product, amplified stable and constant sum." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Three invariants on the same axes, from perfectly flat to perfectly convex. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Curvature is the price of being wrong. A flat curve gives you wonderful fills right up until the assumption behind it breaks, and then no protection whatsoever. A bent curve charges everybody a little on every trade and never leaves the pool empty. That is the whole conversation."*

## The flat one: perfect fills, no defence

The simplest rule holds the two balances added together at a fixed number.

$$
x + y = k
$$

Where:

- $x$ and $y$ are the two token balances.
- $k$ is the total the pool keeps level.

Because the sum never changes, the price never changes either. One for one, always, whatever the balances look like. Trades cost nothing at all, which sounds ideal.

It is a disaster the moment the real price moves. If one token is worth 95 cents elsewhere, traders buy the whole supply of the other one at par and walk away. The pool ends up holding only the token nobody wants, and it had no way to stop them.

Nobody ships this on its own. It shows up as an ingredient in mixed designs, contributing flatness near the ratio the pair is supposed to hold.

## The workhorse: always solvent, always charging

The rule behind most pools holds the two balances multiplied together at a fixed number [1].

$$
x \cdot y = k
$$

Where:

- $x$ and $y$ are the balances.
- $k$ is the product the pool refuses to let fall.

Multiplying rather than adding changes everything. As one balance shrinks toward zero, the other must grow without limit, so the pool can never be fully drained. There is always a price at which it will trade.

The price you pay reflects that:

$$
\text{impact} \approx \frac{\Delta x / x}{1 + \Delta x / x}
$$

Where:

- $\Delta x$ is your order size.
- $x$ is the pool's balance of what you are paying in.
- The result is how much worse your average price is than the quoted one, before fees.

Pay in an amount equal to 10% of that balance and your price is about 9% worse. Pay in half the balance and it is a third worse. That rising cost is not a bug. It is the mechanism keeping inventory available at every price. The full derivation is in [The Constant Product Formula](/guides/constant-product-formula/).

## The compromise: flat where it matters

Mixed designs interpolate between the two. Curve's stable design is the best-known [3].

Near balance it behaves almost like the flat rule, so a pegged pair trades at near-zero cost. As the balances skew, it bends toward the multiplying rule, so the pool stays solvent.

A single setting, called amplification, decides where that handover happens. Turn it up and the middle gets flatter and the edge gets sharper. Turn it down and you approach an ordinary pool.

The trade is explicit and unavoidable. That flatness is efficiency while the peg holds, and it is absorption when the peg breaks. See [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/) for what that looks like in practice.

## Concentration is a separate choice

Here is a point that trips people up. Concentrated liquidity is not a fourth curve. It is the same multiplying curve, shifted so the balances run out at bounds you chose [2].

Inside your band, the same money backs far more depth. Outside it, you hold one token and quote nothing at all.

Bin designs push the idea further. Each bin quotes one flat price, so trades inside a bin cost nothing, and the price steps rather than slides as bins empty.

So there are two independent decisions. Which curve family, and how tightly concentrated within it. See [Types of Liquidity Pools](/guides/liquidity-pool-types/).

## What the shape costs you

Curvature and what arbitrage takes from you are linked directly [4].

Skip the algebra and keep the intuition. A flatter curve hands over more inventory for the same price move, because it barely adjusts its quote until the balances have shifted a long way. That is exactly what you want when the price genuinely does not move, and exactly what you do not want when it does.

| Curve | What traders pay | How fast your holdings flip | What goes wrong |
| :--- | :--- | :--- | :--- |
| Flat sum | Nothing, until it is empty | Immediately and completely | You hold only the weak token |
| Amplified | Almost nothing near balance | Fast near balance | You absorb a token that broke its peg |
| Constant product | Rises with order size | Gradual, symmetric | The ordinary divergence from holding |
| Concentrated | Almost nothing inside the band | Fast inside the band | Complete conversion at the edge |

## Why fees and curves are so often mismatched

The curve decides how much value leaks out. The fee decides how much the pool charges for it. Those two numbers are usually set by different people at different times, and they frequently disagree.

A flat amplified curve on a pair whose peg is genuinely solid can live on one basis point — a hundredth of a percent — because almost nothing leaks. Put the same curve on a shakier pair and it is badly underpriced. The pool will absorb the whole dislocation at near par and charge next to nothing for it.

It happens in reverse too. A 1% fee on an ordinary pool holding two stablecoins charges far more than the curve needs, so the volume simply goes somewhere cheaper.

The test is not what neighbouring pools charge. It is whether the fee has kept up with how much the pair actually moves. If volatility has doubled and the fee has not, the pool is underpriced no matter what anyone else does. Closing that gap is exactly what adjustable fees are for.

## What people get wrong about curves

| What people assume | What actually happens |
| :--- | :--- |
| A flat curve is the safe one | It is the most efficient and the most exposed. Flatness is a bet, not a protection |
| Concentrated liquidity is a different curve | It is the same curve with the ends moved in. All the familiar behaviour still applies |
| A novel curve means a novel advantage | Most are small variations on three shapes. The variation is usually in who holds the parameters |
| The amplification setting is fixed | On many pools it is a governance vote away from changing under you |

## How to read an unfamiliar curve

1. **Find where it is flat, and name the assumption.** Flatness always prices a belief. Work out what that belief is and whether you share it.
2. **Find the corner.** Every design has a point where behaviour changes sharply. Locate it before you deposit, not after.
3. **Simulate a 10% dislocation.** Work out what you would be holding. If the answer is uncomfortable, the pool is not for you.
4. **Ask who can change the settings.** An amplification coefficient under governance control is a live variable, not a constant. Is there a delay before a change takes effect?
5. **Compare quoted depth against an ordinary pool** of the same size, for a trade you would actually make.
6. **Check whether concentration is layered on top**, because that changes the answer to every question above.
7. **Size the position against the failure**, not against the yield.

A curve that answers all seven cleanly is almost always a small variation on one of the three shapes. One that cannot answer the second or fourth is not a new curve. It is an unpriced governance risk with a diagram attached.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [StableSwap: efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Balancer Whitepaper: A non-custodial portfolio manager and liquidity provider](https://balancer.fi/whitepaper.pdf)
6. [When Does the Tail Wag the Dog? Curvature and Market Making (Angeris et al., 2020)](https://arxiv.org/abs/2012.08040)
7. [Improved Price Oracles: Constant Function Market Makers (Angeris & Chitra, 2020)](https://arxiv.org/abs/2003.10001)
8. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
9. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap: efficient mechanism for Stablecoin liquidity"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://balancer.fi/whitepaper.pdf "Balancer Whitepaper"
[6]: https://arxiv.org/abs/2012.08040 "When Does the Tail Wag the Dog? Curvature and Market Making (Angeris et al., 2020)"
[7]: https://arxiv.org/abs/2003.10001 "Improved Price Oracles: Constant Function Market Makers (Angeris & Chitra, 2020)"
[8]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[9]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
