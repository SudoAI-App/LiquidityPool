---
title: "The Constant Product Formula: How x × y = k Shapes AMM Prices"
description: "How x × y = k sets AMM execution: marginal vs average price, virtual reserves, bin invariants, slippage controls, and LP inventory paths before you trade."
category: "Foundations"
date: 2026-09-07
lastReviewed: "2026-09-10"
author: "Dr. Elena Rostova"
readTime: "10 min read"
keywords: "constant product formula, x y k AMM, Uniswap formula, AMM pricing curve, virtual reserves, constant product AMM, constant product market maker, pool reserves AMM, bonding curve crypto"
featured: false
faq:
  - q: "What is the x times y equals k formula?"
    a: "It is the constant-product invariant: the product of the two reserve balances stays constant across a trade, before fees. It defines the price for every possible trade size and guarantees the pool can always quote, at increasingly unfavourable prices for larger orders."
  - q: "Why does price impact increase with trade size?"
    a: "Because the invariant is a hyperbola. Removing a fixed fraction of one reserve requires adding a proportionally larger amount of the other, so the average execution price degrades convexly as the order grows relative to the reserve."
  - q: "Does the constant product formula apply to Uniswap v3?"
    a: "Yes, in translated form. A v3 position uses the same curve shifted so that reserves reach zero at the position bounds, which is why the mathematics of price impact inside a range is familiar even though capital efficiency is much higher."
  - q: "What is the x*y=k formula?"
    a: "It is the constant-product invariant: the product of the two reserve balances stays constant across a trade before fees. It defines the execution price for any trade size and guarantees the pool can always quote, at increasingly unfavourable prices for larger orders."
  - q: "Why does liquidity pool price change?"
    a: "Because price is a function of the reserve ratio. Every swap changes the reserves, so the marginal price moves against the trade, and arbitrage then aligns that price with the wider market."
---

The constant product formula, $x \cdot y = k$, is the foundational deterministic pricing rule of decentralized exchange microstructure. It establishes the mathematical relationship between pooled token reserves and executable market prices without relying on an external order matching engine.

When an order executes against a constant-product automated market maker (AMM), the transaction shifts the reserve ratio, creating mechanical price impact. The swapper never executes at the pre-trade marginal spot price; they execute along the harmonic curvature of the curve, receiving an average execution price strictly worse than the spot quote.

This guide presents the mathematical derivation of execution prices and price impact, contrasts full-range constant product with discrete bin and concentrated virtual reserves, and examines the inventory drift that liquidity providers underwrite.

<figure class="article-figure">
  <img src="/images/guides/constant-product-formula.webp" alt="A pricing curve shows trade size moving through changing pool reserves." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The constant product curve forces larger transactions to incur progressively higher execution friction. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"The constant product formula $x \cdot y = k$ is elegant in theory but inherently unhedged in practice. Every continuous AMM position represents a short options straddle: you collect a stream of premium (trading fees) in exchange for paying out variance to informed traders whenever the underlying asset trends strongly. Understanding the curvature $\frac{d^2y}{dx^2} = \frac{2k}{x^3}$ tells you everything about your marginal slippage and exposure profile."*

## 1. The Mathematical Execution Invariant Inside the Pool

In a constant-product pool, a smart contract holds two token reserves: $x$ (representing token $X$) and $y$ (representing token $Y$). The contract enforces the invariant:

$$x \cdot y = k$$

The instantaneous exchange rate between the two assets is the marginal spot price ($P_{\text{spot}}$), defined as the infinitesimal ratio of reserves:

$$P_{\text{spot}} = \frac{y}{x}$$

When a trader swaps $\Delta x$ for token $Y$, the input amount increases reserve $x$ and decreases reserve $y$ while preserving the product $k$ before protocol fees [1] [2].

### Incorporating Swap Fees into Output Calculations
In Uniswap v2 and equivalent constant-product architectures, a swap fee rate $f$ (e.g., 0.30% or $0.003$) is deducted from the input amount. The effective input added to the pool's reserves is:

$$\Delta x_{\text{eff}} = \Delta x \cdot (1 - f)$$

The conservation invariant requires that:

$$(x + \Delta x_{\text{eff}}) \cdot (y - \Delta y_{\text{out}}) = k = x \cdot y$$

Solving algebraically for the exact token output $\Delta y_{\text{out}}$ received by the trader:

$$\Delta y_{\text{out}} = y - \frac{x \cdot y}{x + \Delta x_{\text{eff}}} = \frac{y \cdot \Delta x_{\text{eff}}}{x + \Delta x_{\text{eff}}}$$

### Marginal Spot Price vs. Average Execution Price
Traders frequently confuse the spot price visible on dashboards with their actual execution price:
- **Marginal Spot Price ($P_{\text{spot}}$)**: The instantaneous derivative $\frac{dy}{dx} = \frac{y}{x}$ before the swap executes.
- **Average Execution Price ($\bar{P}$)**: The total quantity of input asset surrendered divided by the total output received:

$$\bar{P} = \frac{\Delta x}{\Delta y_{\text{out}}} = \frac{x + \Delta x_{\text{eff}}}{y \cdot (1 - f)} = \frac{P_{\text{spot}}^{-1} + \frac{\Delta x_{\text{eff}}}{y}}{1 - f}$$

Because $\Delta x_{\text{eff}} > 0$, the average execution price is **strictly worse than the marginal spot price**. Price impact is not an exchange commission; it is the mathematical penalty imposed by traversing a convex hyperbolic curve [2] [3].

For an architectural breakdown of how modern singletons execute this math, see [Automated Market Makers Explained: The Engine Behind AMM Pools](/guides/automated-market-maker-explained/).

---

## 2. Taylor Approximation: Small Trades in Deep Liquidity

When an order size $\Delta x$ is small relative to total reserves $x$ ($\Delta x_{\text{eff}} \ll x$), the denominator $(x + \Delta x_{\text{eff}})$ can be expanded using a first-order Taylor series [1]:

$$\Delta y_{\text{out}} \approx \frac{y}{x} \cdot \Delta x_{\text{eff}} \cdot \left(1 - \frac{\Delta x_{\text{eff}}}{x}\right) \approx P_{\text{spot}} \cdot \Delta x \cdot (1 - f)$$

In deep liquidity pools where trade size is negligible relative to reserves, price impact approaches zero, and the execution price converges to the marginal spot price scaled by the fee factor $(1 - f)$. In this regime, the protocol fee constitutes almost the entire difference between quote and execution [1] [3].

---

## 3. Large Swaps and Price Impact in Shallow Reserves

When order size $\Delta x$ represents a meaningful percentage of pool reserves $x$, the linear approximation fails completely. As $\Delta x$ expands, each incremental unit of input purchases fewer units of output, causing the effective exchange rate to degrade rapidly [1] [2].

```
+--------------------------------------------------------------------------------+
|                        PRICE IMPACT DYNAMICS ON CPMM                           |
+--------------------------------------------------------------------------------+
|                                                                                |
|  Trade Size relative to Pool x     Approximate Price Impact (excl. fee)        |
|  ----------------------------------------------------------------------------  |
|  Delta x = 0.01 * x  (1% of pool)  -->  ~0.99% Price Impact                    |
|  Delta x = 0.05 * x  (5% of pool)  -->  ~4.76% Price Impact                    |
|  Delta x = 0.10 * x (10% of pool)  -->  ~9.09% Price Impact                    |
|  Delta x = 0.25 * x (25% of pool)  --> ~20.00% Price Impact                    |
|  Delta x = 0.50 * x (50% of pool)  --> ~33.33% Price Impact                    |
|                                                                                |
+--------------------------------------------------------------------------------+
```

Key operational takeaways for market participants:
- **Slippage Tolerance Does Not Reduce Impact**: Slippage tolerance only establishes a revert threshold (`minAmountOut`). Setting a higher slippage tolerance (e.g., 5%) does not improve your execution; it simply authorizes the smart contract to fill your order at the degraded rate dictated by the curve [2].
- **Order Splitting**: Routing portions of an order across multiple independent liquidity pools or DEX aggregators reduces the effective $\Delta x / x$ in each venue, minimizing aggregate price impact [1] [4].
- **Immediate Arbitrage Backrunning**: A swap that shifts an AMM's marginal price away from external market consensus creates an immediate arbitrage opportunity. Searchers will execute backrunning swaps in the same block, pocketing the price discrepancy [5].

---

## 4. Invariant Comparison: CPMM, Virtual Ticks, and Discrete Bins

Modern decentralized finance has developed specialized invariants optimized for different volatility and correlation regimes:

| Invariant Architecture | Formula / Governing Equation | Capital Density | Primary Failure Mode |
| :--- | :--- | :--- | :--- |
| **Constant Product (Uniswap v2)** | $x \cdot y = k$ across $(0, \infty)$ | Uniform, low density across all prices [1] | High slippage on large orders relative to total reserves [3] |
| **Concentrated Virtual Reserves (v3/v4)** | $(x + \frac{L}{\sqrt{P_b}})(y + L\sqrt{P_a}) = L^2$ | Hyper-dense within tick interval $[P_a, P_b]$ [1] | Severe price cliff once active tick liquidity is exhausted [1] |
| **Curve StableSwap** | $A n^n \sum x_i + D = A D n^n + \frac{D^{n+1}}{n^n \prod x_i}$ | Ultra-dense near parity; flat curve [4] | Sharp slippage acceleration when reserves skew past 80/20 [4] |
| **Discrete Bin AMM (Liquidity Book)** | $P \cdot x + y = L_{\text{bin}}$ per discrete bin | Zero intra-bin slippage; step transitions [1] | Gaps between bins during fast directional momentum |

For a comprehensive analysis of concentrated tick mathematics, review [Concentrated Liquidity Explained: Range, Capital Efficiency, and Risk](/guides/concentrated-liquidity-explained/).

---

## 5. Common Mathematical Misconceptions & Slippage Errors

Review these common execution mistakes before interacting with constant-product contracts:

```
+--------------------------------------------------------------------------------+
|                 COMMON AMM MATHEMATICAL MISCONCEPTIONS                         |
+--------------------------------------------------------------------------------+
|                                                                                |
|  [x] Misconception: "Setting 1% slippage caps total execution loss at 1%."     |
|  [v] Reality: Slippage tolerance only caps deviation from the estimated quote. |
|      If the estimated quote already baked in 8% price impact, a 1% slippage   |
|      setting permits a 9% total execution penalty.                            |
|                                                                                |
|  [x] Misconception: "Double the pool TVL means half the price impact."         |
|  [v] Reality: In concentrated AMMs, gross TVL does not dictate impact. Depth   |
|      in the active tick dictates execution. A $10M pool with dense ticks       |
|      yields lower impact than a $100M pool with dispersed liquidity.           |
|                                                                                |
|  [x] Misconception: "The AMM invariant protects LPs from trading losses."      |
|  [v] Reality: The invariant guarantees only that x * y = k holds. It forces    |
|      LPs to sell the appreciating asset and accumulate the depreciating asset  |
|      whenever external prices diverge (Loss-Versus-Rebalancing).               |
|                                                                                |
+--------------------------------------------------------------------------------+
```

---

## 6. Pre-Trade Quantitative Verification Checklist

Execute this verification sequence before routing swaps through constant-product pools:

1. **Calculate Price Impact Independently**: Use the formula $\Delta y_{\text{out}} = \frac{y \cdot \Delta x_{\text{eff}}}{x + \Delta x_{\text{eff}}}$ to verify the interface's quoted output against raw contract reserves [1] [2].
2. **Set a Mathematical Floor on Output**: Calculate the minimum acceptable output based on maximum allowable price impact, and pass that explicit value to `minAmountOut` [2].
3. **Inspect Tick Density (Concentrated Pools)**: In Uniswap v3 and v4 pools, verify that the active tick and adjacent ticks hold sufficient liquidity $L$ to absorb your order without jumping across empty tick intervals [1].
4. **Evaluate Private RPC Routing**: For trades exceeding $20,000, submit transactions through private RPC endpoints (e.g., Flashbots Protect) to prevent sandwich bots from exploiting your deterministic price impact [5].

For further analysis of LP rebalancing mechanics, consult our foundation guide: [Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes](/guides/impermanent-loss-explained/).

---

## Monitoring & Onchain Tooling Stack

To track constant-product reserve ratios, price impact, and divergence metrics:

- **Reserve Tracking & Slip Calculations**: Simulate marginal price impact for varying trade sizes against constant-product reserves using [Tenderly](https://tenderly.co).
- **Historical Pool Volumes & Fees**: Audit fee turnover and capital productivity on [DeFiLlama](https://defillama.com).
- **LP Position Benchmark Accounting**: Calculate realized impermanent divergence versus a static buy-and-hold strategy on [Revert Finance](https://revert.finance).

## Diagnostic Troubleshooting Decision Tree

Follow this diagnostic decision tree when analyzing constant product pool execution:

1. **Slippage Significantly Exceeds Theoretical Formula Calculations**:
   - *Diagnostic*: The pool reserves onchain are substantially smaller than assumed, or a frontrunning transaction has altered reserve balances in the same block.
   - *Action*: Verify current onchain reserves via contract call prior to trade execution and utilize private RPC endpoints to prevent sandwich extraction.
2. **Pool Suffers Persistent Reserve Depletion on One Side**:
   - *Diagnostic*: Structural price divergence on external markets has turned the pool into a one-way liquidity drain for informed arbitrageurs.
   - *Action*: If providing liquidity, assess whether the depreciating asset is undergoing permanent failure; if so, withdraw remaining healthy reserves immediately.
3. **Fee Accruals Lagging Behind Projected APY**:
   - *Diagnostic*: Trading volume on the pair has migrated to concentrated liquidity AMMs (Uniswap v3/v4) that offer superior execution pricing to aggregators.
   - *Action*: Reallocate capital from classic $x \cdot y = k$ pools to concentrated tick-based or discretized bin protocols.

## Where to Go Next

The same invariant produces two consequences worth studying separately: the cost a trader pays, in [Slippage and Price Impact](/guides/slippage-and-price-impact/), and the cost a liquidity provider absorbs, in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/). For how other curve families change both, see [Types of Liquidity Pools](/guides/liquidity-pool-types/).

## References

1. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
2. [Uniswap v2 Core Whitepaper (Adams, 2020)](https://app.uniswap.org/whitepaper.pdf)
3. [Understanding Swaps on Uniswap (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/traders/swaps)
4. [Curve StableSwap Exchange: Overview (Curve Knowledge Hub)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
5. [Trading in the DeFi era: automated market-maker (Bank for International Settlements, 2023)](https://www.bis.org/publications/trading-defi-era-automated-market-maker)

[1]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[2]: https://app.uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[3]: https://developers.uniswap.org/docs/get-started/concepts/traders/swaps "Understanding Swaps on Uniswap"
[4]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview"
[5]: https://www.bis.org/publications/trading-defi-era-automated-market-maker "Trading in the DeFi era: automated market-maker"


