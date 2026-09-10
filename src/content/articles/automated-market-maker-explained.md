---
title: "Automated Market Makers Explained: How an AMM Actually Works"
description: "AMMs price trades from reserves and rules. Trace invariants, singleton architectures, programmable hooks, dynamic fees, and execution conditions before you act."
category: "Foundations"
date: 2026-09-08
lastReviewed: "2026-09-10"
author: "Dr. Kieran Thorne"
readTime: "11 min read"
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

An automated market maker (AMM) prices financial assets using a deterministic mathematical function rather than an order book. Instead of matching a buyer's bid with a seller's ask, the AMM quotes an exchange rate directly from the ratio of token reserves held within its smart contracts.

When an order executes against an AMM, the transaction shifts reserve balances, mechanically adjusting the marginal price along the bonding curve. For traders, this produces price impact proportional to order size relative to active depth. For liquidity providers, it forces continuous, un-hedged inventory rebalancing against informed market participants.

This guide analyzes the mechanics of AMM pricing engines, details their architectural evolution from isolated factory pairs to hook-enabled singletons, and establishes an operational framework to evaluate pools before trading or committing capital.

<figure class="article-figure">
  <img src="/images/guides/automated-market-maker-explained.webp" alt="An automated market mechanism moves token inventory along a pricing curve." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>An automated market maker operates as an inventory rule governed by an invariant curve. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"The biggest mistake engineers make when designing or integrating AMMs is treating the invariant function as a mere price formula. The invariant is actually a state machine boundary condition enforced by the EVM. When implementing custom AMM logic, every call to reserve balances introduces reentrancy risks and rounding precision errors. Always ensure math operations round in favor of the protocol reserves—round up on token input requirements, and round down on token output distributions."*

## 1. The Core Mechanism: An AMM Is an Inventory Rule, Not an Oracle

In a constant-product pool, two token reserves ($x$ and $y$) are linked by the invariant equation $x \cdot y = k$. This rule determines the pool's internal exchange rate strictly as a function of its current reserves; it does not query an external oracle or track broader market sentiment [1].

When a swap executes, reserves change, moving the marginal exchange rate ($P = y/x$) along the curve. The larger the transaction relative to active reserves, the further the marginal price moves—producing price impact [1].

A fundamental principle of AMM market microstructure is that **the contract does not know the fair market price**. It quotes exclusively what its invariant and token balances dictate. When external reference prices shift on centralized exchanges, atomic arbitrageurs execute trades against the stale onchain quote until pool reserves rebalance to match external market levels. The quoted price is strictly a function of the local contract state modified by the transaction [1]. For a formal mathematical treatment of this curve, consult [The Constant Product Formula: How x × y = k Shapes AMM Prices](/guides/constant-product-formula/).

---

## 2. Architectural Evolution: From Factory Pairs to Programmable Singletons

Understanding AMM behavior requires tracking the smart contract execution architecture across three distinct protocol generations:

```
+--------------------------------------------------------------------------------+
|                        EVOLUTION OF THE AMM ENGINE                             |
+--------------------------------------------------------------------------------+
|                                                                                |
|  Gen 1: Factory-Pair Architecture (Uniswap v1 & v2)                            |
|  - Standalone pair contract per token pair                                     |
|  - Uniform liquidity across (0, infinity)                                      |
|  - Static swap fee (30 bps)                                                   |
|  - Physical ERC-20 transfers at every swap hop                                 |
|                                                                                |
|  Gen 2: Concentrated Liquidity Ticks (Uniswap v3)                              |
|  - Piecewise virtual reserve curves within ticks [P_l, P_u]                   |
|  - Factory-deployed isolated pool contracts                                    |
|  - Static discrete fee tiers (1, 5, 30, 100 bps)                               |
|  - Capital efficiency gains up to 4,000x in-range                              |
|                                                                                |
|  Gen 3: Singleton State Engines & Hooks (Uniswap v4, Ambient)                  |
|  - Unified contract (PoolManager.sol) holding all token reserves               |
|  - Flash accounting via transient storage (EIP-1153)                           |
|  - Internal token balances tracked via ERC-6909                                |
|  - 8-point programmable lifecycle hooks                                        |
|  - Dynamic volatility-adjusted swap fees                                       |
|                                                                                |
+--------------------------------------------------------------------------------+
```

### Generation 1: Isolated Pair Contracts
Early AMMs deployed an independent contract for every trading pair. Every swap required transferring ERC-20 tokens into the pair contract, updating state, and transferring tokens out. Multi-hop routing (e.g., Token A $\to$ Token B $\to$ Token C) incurred high gas costs due to repetitive external calls and redundant token transfers [1] [3].

### Generation 2: Concentrated Liquidity Ticks
Uniswap v3 introduced concentrated liquidity, allowing LPs to allocate capital within finite price bounds $[P_l, P_u]$. Capital efficiency increased substantially, but depth became piecewise: each tick boundary acts as an independent virtual reserve, and capital outside the active tick sits idle [2] [3].

### Generation 3: Singleton Engines and Flash Accounting
Modern architectures discard the factory-pair model entirely. All pools, fee tiers, and hook configurations exist inside a single state contract (`PoolManager.sol`) [1].
- **Transient Storage (EIP-1153)**: During multi-hop swaps, intermediate balances are tracked as memory deltas via a lock/unlock mechanism. Physical tokens are not moved between intermediate hops; only the net delta is settled at the end of the transaction (`take` and `settle`). This cuts routing gas costs by over 90% [1].
- **Native Credit Accounting (ERC-6909)**: LPs and routers can maintain internal balance claims directly inside the singleton, avoiding ERC-20 approve and transfer overhead [1].

### Programmable Lifecycle Hooks
Modern AMMs permit developers to attach custom logic to pools via hooks. A hook contract intercepts pool lifecycle events at eight execution points:
- `beforeInitialize` / `afterInitialize`
- `beforeAddLiquidity` / `afterAddLiquidity`
- `beforeRemoveLiquidity` / `afterRemoveLiquidity`
- `beforeSwap` / `afterSwap`
- `beforeDonate` / `afterDonate`

Hooks enable dynamic fee adjustments based on volatility, onchain limit orders, custom TWAP oracles, and automated treasury management directly within the swap pipeline [1].

---

## 3. Mathematical Execution: Calculating Output and Price Impact

In a constant-product pool obeying $x \cdot y = k$, sending an input $\Delta x$ into the pool increases reserve $x$ to $x + (1 - f) \cdot \Delta x$, where $f$ represents the pool swap fee rate. The output $\Delta y$ received by the swapper is calculated as:

$$\Delta y = y - \frac{k}{x + (1 - f) \cdot \Delta x}$$

From this formula, three operational realities emerge:
1. **Marginal vs. Average Execution Price**: The marginal spot price before the trade is $P_{\text{spot}} = y/x$. The actual average execution price received by the trader is $\bar{P} = \Delta x / \Delta y$. As order size $\Delta x$ increases, $\bar{P}$ degrades monotonically relative to $P_{\text{spot}}$ [1].
2. **Impact Dominates Low Fees**: A 0.05% fee tier in a shallow pool often yields worse execution than a 0.30% fee tier in a deep pool, because invariant curvature and reserve depletion dominate the total transaction cost [1] [3].
3. **Slippage Bounds as Last Defense**: The `amountOutMinimum` parameter in a swap transaction sets an absolute floor on the acceptable output. Setting an excessively wide slippage tolerance invites MEV searchers to extract the difference [1] [5].

For a detailed comparative analysis between AMM execution and order books, read [AMM vs. Order Book: Two Ways to Organize a Market](/guides/amm-vs-order-book/).

---

## 4. Fee Mechanics: Static Tiers vs. Dynamic Volatility Curves

Swap fees compensate liquidity providers for underwriting inventory risk. In classical v2 AMMs, a static 0.30% fee is withheld from input tokens and added directly to pool reserves, growing the redeemable value of LP tokens [3]. In concentrated AMMs, fees accrue pro rata to active liquidity strictly within the price ticks traversed by trades [2] [3].

In modern AMMs, static fee tiers are increasingly replaced by dynamic fees:
- **Volatility-Adjusted Fees**: Protocols like Trader Joe (Liquidity Book) and Uniswap v4 hook pools monitor market volatility (e.g., via bin transition frequency or price variance) and automatically widen the fee during volatile intervals. This extracts higher compensation from arbitrageurs and protects LPs against adverse selection (Loss-Versus-Rebalancing, or LVR) [1] [3].
- **Directional & Imbalance Fees**: In Curve cryptoswap and StableSwap pools, fees adjust dynamically based on pool balance, charging higher fees when a trade pushes the pool deeper into imbalance [4].

Operational rules for market participants:
- **For Traders**: A low headline fee tier does not guarantee good execution. If your trade is large relative to active liquidity, invariant impact dominates your cost. Dynamic fees may also widen execution cost during market volatility [1].
- **For Liquidity Providers**: Fees accrue only to liquidity that is active at the time of the swap. If price exits your range, fee accrual halts instantly [2] [3]. Fees are compensation for continuous rebalancing against informed flow.

---

## 5. Concentrated Ranges: Active Management and Boundary Liquidity

Concentrated liquidity allows providers to set finite bounds $[P_l, P_u]$ around the market price. The operational trade-off is structural:

```
+--------------------------------------------------------------------------------+
|                   CONCENTRATED LIQUIDITY INVENTORY TRANSITION                  |
+--------------------------------------------------------------------------------+
|                                                                                |
|   Price Regime                     Position Inventory Composition              |
|   --------------------------------------------------------------------------   |
|   Price > Upper Bound (P_u)   -->  100% Token Y (Quote Asset)                  |
|                                    Fee accrual halts; zero active depth.       |
|                                                                                |
|   Price Inside Range          -->  Mixture of Token X and Token Y              |
|   [P_l <= P <= P_u]                Continuous fee accrual; active depth.       |
|                                                                                |
|   Price < Lower Bound (P_l)   -->  100% Token X (Base / Risky Asset)           |
|                                    Fee accrual halts; zero active depth.       |
|                                                                                |
+--------------------------------------------------------------------------------+
```

When market price leaves your designated bounds, your position converts 100% into the underperforming asset and deactivates. A narrower range produces higher fee yield while active, but accelerates the frequency of range breaches and single-asset lockup [2] [3].

---

## 6. Common Pitfalls and Execution Mistakes

Review these operational mistakes before interacting with automated market makers:

```
+--------------------------------------------------------------------------------+
|                 COMMON AMM EXECUTION MISTAKES TO AVOID                         |
+--------------------------------------------------------------------------------+
|                                                                                |
|  [x] Mistake: Treating spot price as execution price on large swaps.           |
|  [v] Correction: Pre-compute marginal price impact and average fill price       |
|      before submitting transactions; check depth within +/-1% of spot.         |
|                                                                                |
|  [x] Mistake: Submitting public mempool transactions with > 0.5% slippage.     |
|  [v] Correction: High slippage tolerances on public mempools are targeted      |
|      by MEV sandwich bots; route via private RPCs or intent batch auctions.    |
|                                                                                |
|  [x] Mistake: Assuming concentrated liquidity positions earn passive yield.   |
|  [v] Correction: Concentrated ticks require active monitoring; out-of-range    |
|      positions earn zero fees while bearing 100% directional inventory risk.   |
|                                                                                |
|  [x] Mistake: Confusing gross TVL with available execution depth.              |
|  [v] Correction: Gross TVL includes idle out-of-range capital; measure active   |
|      liquidity density at the specific tick range your trade will cross.       |
|                                                                                |
+--------------------------------------------------------------------------------+
```

---

## 7. Step-by-Step Pre-Flight Evaluation Framework

Follow this sequential verification before executing a trade or supplying capital:

1. **Identify the Governing Invariant**: Is the pool constant-product ($x \cdot y = k$), concentrated tick-based, discrete bin, or hybrid StableSwap [1] [4]?
2. **Check Singleton and Hook Permissions**: In Uniswap v4 pools, verify whether attached hooks introduce dynamic volatility fees, withdrawal limits, or custom routing rules [1].
3. **Assess Active Market Depth**: Determine how much capital is concentrated within $\pm 1\%$ and $\pm 2\%$ of the active tick. Confirm that your trade size will not exhaust in-range liquidity [1] [2].
4. **Inspect Reserve Balance Skew**: For stablecoin and correlated pools, verify whether token reserves are balanced (50/50) or heavily skewed. Skewed pools operate near their liquidity cliff [4].
5. **Select Transaction Routing**: Route large trades through private RPC endpoints (such as Flashbots Protect) or intent-based RFQ solvers (UniswapX, CoW Swap) to prevent MEV sandwich attacks [5].

For further analysis on fee generation and return calculations, consult [Liquidity Provider Fees: Calculation, Structure, and Optimization](/guides/liquidity-provider-fees/).

---

## Monitoring & Onchain Tooling Stack

To monitor AMM state changes, reserve balances, and smart contract execution in real time:

- **Contract State Tracing**: Use [Tenderly](https://tenderly.co) to simulate multi-hop swaps and debug transaction execution traces against AMM pool contracts.
- **Protocol TVL & Volume Distribution**: Monitor historical reserve balances and volume-to-TVL ratios on [DeFiLlama Yields](https://defillama.com/yields).
- **Position Health & Accounting**: Track real-time LP performance, fee accruals, and impermanent divergence loss via [Revert Finance](https://revert.finance).

## Diagnostic Troubleshooting Decision Tree

Use this operational decision tree when troubleshooting AMM pool execution anomalies:

1. **Transaction Reverting with 'K' Invariant Error**:
   - *Diagnostic*: The product of virtual reserves after fees $(x_{\text{new}} \cdot y_{\text{new}})$ is strictly less than the pre-swap constant $k$, typically caused by incorrect fee deduction ordering or integer truncation.
   - *Action*: Ensure fee percentages are deducted prior to invariant verification and verify that integer rounding favors pool reserves.
2. **Pool Price Significantly Decoupled from External Spot Rates**:
   - *Diagnostic*: Arbitrageurs are unable to restore price balance due to transaction gas costs exceeding the absolute price disparity.
   - *Action*: If the price delta is within the no-arbitrage band ($\Delta P < 2 \times \text{fee}$), the divergence is normal friction; otherwise, check if token transfer taxes or pause mechanisms are blocking arbitrage transactions.
3. **LP Position Incurring Rapid Capital Depletion**:
   - *Diagnostic*: Toxic order flow is exploiting stale reserves before onchain transactions can adjust to external market shocks.
   - *Action*: Evaluate whether the pool's fee tier provides adequate compensation for trailing realized volatility ($\sigma$).

## Where to Go Next

The execution cost a trader pays against these curves is broken down in [Slippage and Price Impact](/guides/slippage-and-price-impact/). The value the same curves hand to arbitrageurs is quantified in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/). For the architectural comparison between the two most widely used versions, see [Uniswap v3 vs v4 Liquidity](/guides/uniswap-v3-vs-v4/). The curve families themselves are compared in [Bonding Curves and AMM Invariants](/guides/bonding-curves-and-amm-invariants/), and the fee side of the same design space in [Dynamic Fees in AMMs](/guides/dynamic-fees-in-amms/).

## References

1. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Fees in Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/fees)
4. [Curve StableSwap Exchange: Overview (Curve Knowledge Hub)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
5. [Maximal Extractable Value (MEV) Documentation (Ethereum.org)](https://ethereum.org/en/developers/docs/mev/)
6. [SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
7. [Constant Function Market Makers: Multi-Asset Trades via Convex Optimization (Angeris et al., Stanford)](https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf)
8. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees in Concentrated Liquidity"
[4]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview"
[5]: https://ethereum.org/en/developers/docs/mev/ "Maximal Extractable Value (MEV) Documentation"
[6]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)"
[7]: https://web.stanford.edu/~boyd/papers/pdf/cfmm.pdf "Constant Function Market Makers: Multi-Asset Trades via Convex Optimization (Angeris et al., Stanford)"
[8]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
