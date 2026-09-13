---
title: "The Impermanent Loss Formula: How to Calculate IL Step by Step"
description: "One short formula, one variable, and a full worked example in dollars. Plus the range-position variant and everything the formula deliberately leaves out."
category: "Risk & Research"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "6 min read"
keywords: "impermanent loss formula, how to calculate impermanent loss, impermanent loss example, IL calculation, divergence loss, HODL benchmark"
featured: true
faq:
  - q: "What is the impermanent loss formula?"
    a: "For a two-asset constant-product pool, IL(k) = 2·√k / (1 + k) − 1, where k is the current price of one asset divided by its price at deposit, measured in units of the other asset. The result is negative and expresses the shortfall of the pooled position against simply holding the deposited basket."
  - q: "How do I calculate impermanent loss on a real position?"
    a: "Take the price ratio between exit and entry, apply the formula to get the percentage shortfall, then multiply by the value the basket would have had if held. Subtract fees earned to get the net result. A 2x move produces a 5.72% shortfall, a 4x move 20.0%, and a 5x move 25.5%."
  - q: "Is impermanent loss ever permanent?"
    a: "It becomes permanent the moment you withdraw at a price ratio different from your entry ratio. Until then it is an unrealised gap against a hold benchmark that closes if relative prices return to where they started."
  - q: "Does the formula work for concentrated liquidity?"
    a: "Not directly. Inside its band a range position diverges faster, roughly in proportion to its capital-efficiency multiplier. Once price leaves the band the position holds a single asset, so it stops rotating, but its shortfall against holding keeps growing as the price moves further. The article gives the holdings formula for a range position."
---

Impermanent loss — the gap between a pool position and simply holding the same tokens — is not a fee, and nobody charges it. It is arithmetic: what your tokens would be worth sitting in a wallet, against what they are worth in a pool that kept trading them while the market moved.

The formula for that gap is one line and it has exactly one input. You can work out your own number in about a minute.

This guide derives it, gives you a table to memorise, walks a real position through in dollars, covers the range-position version, and lists what the formula deliberately ignores.

<figure class="article-figure">
  <img src="/images/guides/impermanent-loss-formula.webp" alt="Curve of impermanent loss against price ratio with marked values at 1.25x, 2x and 4x, beside a worked dollar example." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Impermanent loss as a function of the price ratio, with a worked dollar example on an ETH/USDC deposit. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Everyone can recite that a doubling costs 5.7%. Almost nobody can give you the number for their own position, because it was minted at three different prices, collected fees in two tokens, and paid gas twice. The formula is the easy part. Keeping records good enough to use it is the hard part."*

## Where the formula comes from

A pool holds two tokens and keeps their product at a fixed number. Price is one balance divided by the other.

You deposit at some price. The market moves. Arbitrage traders keep pulling the pool's price back in line with the market, and that completely determines what the pool ends up holding.

Define one number:

$$
k = \frac{P_1}{P_0}
$$

Where:

- $P_0$ is the price when you deposited.
- $P_1$ is the price now.
- $k$ is the ratio between them, so a doubling gives $k = 2$.

Because the product stays fixed and price is the ratio, the new balances are the old ones divided and multiplied by the square root of $k$. Value the pool position at the new price, value the untouched basket at the same price, take the ratio, and everything cancels into one line:

$$
\text{IL}(k) = \frac{2\sqrt{k}}{1 + k} - 1
$$

Where:

- $k$ is the price ratio above.
- The answer is negative, and it is the fraction by which the pool trails simply holding.

Three things fall out of it immediately, and all three are worth holding onto.

- **It is never positive.** The only case where it is zero is $k = 1$, meaning the price came back exactly.
- **Direction does not matter.** Halving and doubling cost exactly the same. Only distance matters.
- **Only the relative price counts.** If both tokens fall 40% together, this formula says zero, because the pool did no rotating. You lost money, but not to the pool.

The mechanism behind all of it is in [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## The table worth memorising

| Price ratio | What that means | Shortfall against holding | What the pool did |
| ---: | :--- | ---: | :--- |
| 0.25 | Down 75% | -20.00% | Doubled its holding of the falling token |
| 0.50 | Down 50% | -5.72% | Bought about 41% more of it |
| 0.80 | Down 20% | -0.62% | Bought about 12% more |
| 1.00 | Flat | 0.00% | Nothing |
| 1.25 | Up 25% | -0.62% | Sold about 11% |
| 1.50 | Up 50% | -2.02% | Sold about 18% |
| 2.00 | Doubled | -5.72% | Sold about 29% of it |
| 4.00 | Up 4x | -20.00% | Sold half of it |
| 5.00 | Up 5x | -25.46% | Sold about 55% of it |

An ordinary pool always keeps half its value in each token. What changes is how many of each it holds.

The shape is the lesson, not the individual rows. Small moves cost almost nothing. Past a doubling it accelerates hard. That is the whole reason pegged pairs and volatile pairs behave so differently on the same curve.

## A real position, start to finish

Deposit into an ETH/USDC pool at \$2,000 per ETH.

- **What goes in:** 1 ETH and \$2,000 of USDC, \$4,000 total, an even split.
- **Price at exit:** \$4,000 per ETH, so $k = 2$.

**Step one, what holding would have been worth.** One ETH at \$4,000 plus \$2,000 of USDC comes to \$6,000.

**Step two, what the pool holds now.** The balances rotate by the square root of 2. You now have 0.7071 ETH and \$2,828 of USDC. At the new price that is \$5,657.

**Step three, the gap.** \$5,657 divided by \$6,000, minus one, is -5.72%. In dollars, -\$343. Exactly what the table said.

**Step four, the part that actually decides it.** Say the position earned \$420 in fees over that period. You are ahead of holding by \$77, about 1.3%.

That last step is the whole game. The position was profitable and it beat holding, but only because the fees cleared the gap with something to spare. See [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).

## The version for range positions

A range position does not follow that curve, and the differences cut both ways [1].

Inside your band the divergence is larger than the formula says, roughly in proportion to how much your range multiplies your capital. Outside the band the position has fully converted and stops trading, but the market keeps moving without you.

$$
x(P) = L\left(\frac{1}{\sqrt{P}} - \frac{1}{\sqrt{p_b}}\right)
$$

Where:

- $x(P)$ is how much of the risky token the position holds at price $P$.
- $L$ is your liquidity size.
- $p_b$ is the top of your band.

Read the shape. As $P$ rises toward $p_b$, the two terms converge and your holding of the risky token goes to zero. You have sold all of it, and the selling stops there.

Stopped selling is not the same as stopped losing. A tight band that converts fully and then watches the asset double finishes far behind holding, because the whole rest of the move happened without you. Always measure against holding at today's price, not at the edge of your band. See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

## What the formula ignores on purpose

Run the number on its own and you will get a misleading answer, in either direction.

- **Fees.** The entire reason to be there, and not in the formula at all.
- **Token rewards.** Value them at the price you could actually have sold them, not the price on the day they accrued.
- **Gas.** Minting, claiming, re-ranging and withdrawing. On a small position this can be the whole result.
- **Time spent out of range.** Earning nothing while still fully exposed.
- **Entry and exit costs.** Price impact — the way your own order moves the rate — plus slippage, the gap between quote and fill, both bite when a large deposit has to be swapped into the right ratio first. See [Slippage and Price Impact](/guides/slippage-and-price-impact/).
- **The cost of volatility along the way.** A pool that ran to 3x and came back shows zero here, which is accurate against holding. It says nothing about the steady cost that volatility created, which is what the fees were meant to cover. That is measured by loss-versus-rebalancing — what the pool gives up because its quote runs a block late — rather than by this formula [4].

## How to compute your own number

1. **Write down where you started.** Quantities, both prices, the time, the transaction hash. Without this you cannot reconstruct anything later.
2. **Value holding at the exit price**, not at some high point you remember.
3. **Apply the formula, then check it** against what you actually withdrew. A mismatch usually means fees were compounded in, which moves the starting point.
4. **Add fees in the same units**, at the prices you actually got.
5. **Subtract all the friction.** Gas, swap costs, and any exit fee a vault or hook charges.
6. **Compare against what you could really have done.** Holding the basket, holding one token, or a different pool. A benchmark you never had access to is not a benchmark.
7. **Check it against independent accounting.** [Revert Finance](https://revert.finance) rebuilds position history and separates fees from divergence.

Use this before you deposit, not after you are disappointed. Run at deposit time with an honest view of how much the pair moves and how much the pool earns, it tells you exactly what the market has to do before the position stops being worth holding.

## Where to go next

Run your own numbers through the [impermanent loss calculator](/tools/impermanent-loss-calculator/), then check whether fees cleared the gap using [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
6. [An Analysis of Uniswap Markets (Angeris et al., 2019)](https://arxiv.org/abs/1911.03380)
7. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[6]: https://arxiv.org/abs/1911.03380 "An Analysis of Uniswap Markets (Angeris et al., 2019)"
[7]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
