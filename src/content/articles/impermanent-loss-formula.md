---
title: "The Impermanent Loss Formula: How to Calculate IL Step by Step"
description: "The impermanent loss formula derived from first principles, with worked examples, a concentrated-liquidity variant, and the fee threshold that decides the net result."
category: "Risk & Research"
date: 2026-09-10
lastReviewed: "2026-09-10"
author: "Dr. Elena Rostova"
readTime: "12 min read"
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
    a: "Not directly. A range position experiences the same divergence amplified by the capital-efficiency multiplier of the range, and the loss stops growing once price exits the interval and the position is fully converted. The article gives the bounded form for a range position."
---

Impermanent loss is not a fee, a penalty, or a bug. It is the arithmetic difference between two portfolios: tokens sitting in a wallet, and the same tokens supplied to a constant-function market maker that continuously rebalanced them as the market moved. The formula that quantifies that difference is short, closed-form, and depends on exactly one variable.

Everything else people attach to the term, including whether the position was actually profitable, sits outside the formula and belongs to the fee accounting.

<figure class="article-figure">
  <img src="/images/guides/impermanent-loss-formula.webp" alt="Curve of impermanent loss against price ratio with marked values at 1.25x, 2x and 4x, beside a worked dollar example." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Impermanent loss as a function of the price ratio, with a worked dollar example on an ETH/USDC deposit. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Every LP can recite that a 2x move costs 5.7%. Very few can tell you the number for their actual position, because their actual position was minted at three different prices, collected fees in two assets, and paid gas twice. The formula is the easy part. The discipline is maintaining a ledger that lets you compute the benchmark at all."*

## 1. Deriving the Formula From the Invariant

Start with a constant-product pool holding reserves $x$ and $y$ with invariant $x \cdot y = k$ and price $P = y / x$. Deposit at price $P_0$ with reserves $x_0$ and $y_0$, so the deposited value in units of the quote asset is $V_{\text{hold}} = x_0 P_0 + y_0$.

Let the price move to $P_1$ and define the price ratio:

$$k = \frac{P_1}{P_0}$$

Arbitrage keeps the pool's marginal price aligned with the market, which fixes the new reserves. Because the invariant holds and $P = y/x$, the reserves after the move are:

$$x_1 = \frac{x_0}{\sqrt{k}}, \qquad y_1 = y_0 \sqrt{k}$$

The pool position is therefore worth $V_{\text{pool}} = x_1 P_1 + y_1$, while holding the original basket is worth $V_{\text{hold}} = x_0 P_1 + y_0$. Taking the ratio for a balanced 50/50 deposit gives the standard closed form:

$$\text{IL}(k) = \frac{V_{\text{pool}}}{V_{\text{hold}}} - 1 = \frac{2\sqrt{k}}{1 + k} - 1$$

Three properties fall out immediately. The function is always less than or equal to zero, with equality only at $k = 1$. It is symmetric in log price, so a halving and a doubling produce the identical shortfall. And it depends only on the *relative* price of the two assets, not on whether the market went up or down in dollar terms.

The mechanism that produces this, continuous selling of the appreciating asset, is the same one described in [Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes](/guides/impermanent-loss-explained/).

---

## 2. The Reference Table Every LP Should Memorise

| Price ratio $k$ | Move | IL vs. hold | Pool composition drift |
| ---: | :--- | ---: | :--- |
| 0.25 | −75% | −20.00% | Heavily into the falling asset |
| 0.50 | −50% | −5.72% | Accumulating the falling asset |
| 0.80 | −20% | −0.62% | Mild rotation |
| 1.00 | flat | 0.00% | Unchanged |
| 1.25 | +25% | −0.62% | Mild rotation |
| 1.50 | +50% | −2.02% | Selling the winner |
| 2.00 | 2x | −5.72% | Half the winner sold |
| 4.00 | 4x | −20.00% | Most of the winner sold |
| 5.00 | 5x | −25.46% | Position dominated by the quote asset |

The shape matters more than any individual row. Losses are negligible for small divergences and accelerate sharply past a 2x, which is why correlated and pegged pairs behave so differently from volatile pairs supplied on the same curve.

---

## 3. A Worked Dollar Example, End to End

Deposit into an ETH/USDC pool at 2,000 USDC per ETH:

- **Deposit**: 1 ETH and 2,000 USDC, total \$4,000 at entry, a balanced 50/50 basket.
- **Exit price**: 4,000 USDC per ETH, so $k = 2$.

Step one, the hold benchmark. The unpooled basket is worth $1 \times 4{,}000 + 2{,}000 = \$6{,}000$.

Step two, the pool position. Reserves rotate to $1/\sqrt{2} = 0.7071$ ETH and $2{,}000 \times \sqrt{2} = 2{,}828$ USDC. Valued at the new price: $0.7071 \times 4{,}000 + 2{,}828 = \$5{,}657$.

Step three, the divergence. $5{,}657 / 6{,}000 - 1 = -5.72\%$, or −\$343 in dollar terms, matching the formula exactly.

Step four, the net result. Suppose the position collected \$420 in trading fees over the holding period. The net outcome against holding is $+\$77$, roughly +1.3%. The position was profitable in absolute terms and beat the hold benchmark, but only because fee income cleared the divergence with room to spare.

That fourth step is the one that decides whether supplying liquidity was the right decision, and it is developed in [LP Fees vs Impermanent Loss: Finding the Break-Even](/guides/lp-fees-vs-impermanent-loss/).

---

## 4. The Concentrated Liquidity Variant

A range position does not follow the unbounded curve. Inside its interval it experiences amplified divergence, because the same capital backs a larger quoted depth; outside the interval the divergence stops growing, because the position is fully converted and no longer rebalances [1].

For a position with bounds $[p_a, p_b]$ and entry price $P_0$, the value of the position at price $P$ inside the range can be computed from the reserve expressions:

$$x(P) = L\left(\frac{1}{\sqrt{P}} - \frac{1}{\sqrt{p_b}}\right), \qquad y(P) = L\left(\sqrt{P} - \sqrt{p_a}\right)$$

Two consequences follow. First, the divergence for a narrow band at a given price ratio is materially larger than the unbounded formula predicts, scaling roughly with the capital-efficiency multiplier of the range. Second, the loss is bounded: once price passes $p_b$, the position is entirely quote asset and its value is fixed in those units regardless of how much further the market runs.

Bounded does not mean small. A ±5% band that converts fully and then watches the asset double has forgone the entire subsequent move, which is an opportunity cost the formula does not display. See [Out-of-Range Liquidity: Why an LP Position Stops Earning Fees](/guides/out-of-range-liquidity/) for that side of the ledger.

---

## 5. What the Formula Deliberately Excludes

Running the number without these adjustments produces a benchmark that flatters or punishes the position incorrectly:

- **Trading fees**, which are the entire reason to supply liquidity and are not part of the IL expression.
- **Incentive emissions**, which must be valued at the price you could actually sell them, not at the price when they accrued.
- **Gas costs** for minting, collecting, rebalancing and withdrawing, which dominate the outcome for small positions.
- **Time out of range**, during which a concentrated position earns nothing while remaining fully exposed.
- **Price impact and slippage on entry and exit**, particularly when a large deposit must be swapped into the correct ratio first. See [Slippage and Price Impact: What a Swap Actually Costs](/guides/slippage-and-price-impact/).
- **The path taken**, which matters for realised outcomes: a pool that round-tripped through a 3x and back to par shows zero impermanent loss at the endpoints while having handed real value to arbitrageurs along the way. That gap is measured by loss-versus-rebalancing rather than by IL [4].

---

## 6. Diagnostic Checklist for Computing Your Own Number

1. **Record the entry state**: token quantities, both prices, timestamp, transaction hash. Without this, no benchmark can be reconstructed later.
2. **Value the hold benchmark at the exit price**, not at some intermediate high.
3. **Apply the formula to the price ratio** and confirm it against the actual withdrawn quantities. A mismatch usually means fees were auto-compounded into the position, which changes the base.
4. **Add fee income in the same units** as the benchmark, at realised prices.
5. **Subtract all friction**: gas, swap costs, and any withdrawal fee imposed by a hook or vault wrapper.
6. **Compare against the alternatives you actually had**: holding the basket, holding one asset, or supplying to a different curve. Benchmarks are only useful when they are the ones you could have chosen.
7. **Verify with independent accounting** on [Revert Finance](https://revert.finance), which reconstructs position history and separates fee income from divergence for tick-based positions.

The formula is a tool for pricing a decision in advance, not a post-hoc explanation for a disappointing outcome. Used at deposit time, with a realistic view of the volatility of the pair and the fee density of the pool, it tells you what the market has to do before the position stops being worth holding.

## Where to Go Next

Run your own numbers through the [impermanent loss calculator](/tools/impermanent-loss-calculator/), then test whether fee income cleared the gap using [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
