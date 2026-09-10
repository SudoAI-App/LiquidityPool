# DeFi Onchain Tooling & Metrics Reference Stack

Every guide produced under the `defi-article-writer` skill must cite specific, battle-tested onchain analytics tools and quantitative metrics to anchor theoretical concepts in executable practice.

---

## 1. Core Analytics & Position Tracking Tools

| Tool | Category | Primary Use Case in Articles | Citation Example |
| :--- | :--- | :--- | :--- |
| **Revert Finance** | LP Performance & Accounting | Tracking net PnL, fee accrual, divergence loss, and HODL benchmark comparison for Uniswap v3/v4 positions. | *"Monitor real-time position health and uncollected fee growth using [Revert Finance](https://revert.finance)."* |
| **Dune Analytics** | Onchain SQL Queries & Dashboards | Querying tick liquidity distributions, historical swap volume, toxic flow ratios, and pool-level LVR. | *"Inspect the historical tick volume distribution on [Dune Analytics](https://dune.com)."* |
| **DeFiLlama** | Cross-Protocol Metrics & TVL | Auditing protocol TVL, fee-to-TVL ratios, incentive emission schedules, and treasury liquidity. | *"Verify historical TVL stability and fee yields on [DeFiLlama Pools](https://defillama.com/yields)."* |
| **EigenPhi / Zeromev** | MEV & Microstructure Analytics | Quantifying sandwich volume, JIT liquidity extraction, and toxic arbitrage extraction per block. | *"Audit the frequency of Just-In-Time liquidity attacks on your target pool via [EigenPhi](https://eigenphi.io)."* |
| **Tenderly / Foundry** | Simulation & Execution Profiling | Simulating swap execution, inspecting hook bitmasks, and tracing gas consumption before submitting transactions. | *"Simulate multi-hop pool routing and hook callback gas overhead using [Tenderly Virtual TestNets](https://tenderly.co)."* |
| **Token Terminal** | Financial Statement Analytics | Institutional protocol revenue, fee generation, price-to-fees ratios, and treasury health. | *"Examine protocol fee generation and capital retention metrics on [Token Terminal](https://tokenterminal.com)."* |

---

## 2. Quantitative Metrics Dictionary

When discussing liquidity pool performance, authors must use standard financial engineering terminology:

1. **Loss-Versus-Rebalancing (LVR)**:
   - The adverse selection cost of providing liquidity relative to an actively rebalanced portfolio with equivalent instantaneous exposure.
   - Formula: $\text{LVR}_t = \int_0^t \frac{\sigma^2}{8} S_u L_u \, du$.
2. **Capital Efficiency Multiplier ($C$)**:
   - The ratio of virtual liquidity obtained within a concentrated interval $[p_a, p_b]$ compared to an infinite range ($[0, \infty]$).
   - Formula: $C = \frac{1}{1 - (p_a / p_b)^{1/4}}$.
3. **Fee-to-TVL Ratio (Capital Turnover)**:
   - Annualized or 24-hour fee generation divided by active capital. Measures capital productivity regardless of total pool size.
4. **Toxic Flow Ratio**:
   - The proportion of pool volume executed by latency arbitrageurs and MEV searchers taking stale quotes versus uninformed retail flow.
5. **Gamma / Tick Breakout Probability**:
   - The rate of change of an LP's delta with respect to spot price changes, representing the velocity of inventory rebalancing into depreciating assets.
