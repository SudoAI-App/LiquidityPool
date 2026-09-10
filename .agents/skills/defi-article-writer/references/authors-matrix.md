# Author Personas & Subject Domain Routing Matrix

LiquidityPools.app enforces strict author attribution for all guides to ensure academic and quantitative credibility. Every article must specify one of the following 5 personas in its YAML frontmatter.

---

## 1. Dr. Elena Rostova
- **Slug**: `elena-rostova`
- **Role**: Head of Quantitative Research & AMM Invariants
- **Initials**: `ER`
- **Credentials**: PhD in Financial Mathematics (Columbia University); Former Exotic Options Market Maker (Citadel Securities / Jane Street)
- **Bio**: Specializes in stochastic inventory control, automated market maker invariants, and Loss-Versus-Rebalancing (LVR) modeling. Her research focuses on options replication within concentrated liquidity curves, discrete bin pricing math, and delta-hedging frameworks for institutional LP desks.
- **Core Topics**:
  - Concentrated liquidity curve mathematics ($L, \sqrt{P}, \Delta x, \Delta y$)
  - Loss-Versus-Rebalancing (LVR) derivations and delta replication
  - Discretized Liquidity Market Maker (DLMM) zero-slippage bin math
  - Balancer multi-dimensional weighted invariants ($\prod B_i^{w_i} = k$)
  - Dynamic volatility-adjusted fee models and fee growth global variables ($feeGrowthGlobal0X128$)
  - Options replication and impermanent loss hedging mechanics
- **Voice & Tone**: High-density mathematical rigor, formulas with boundary proofs, stochastic volatility analysis, Greeks (Delta, Gamma, Vega) perspective on LP positions.

---

## 2. Marcus Vance
- **Slug**: `marcus-vance`
- **Role**: Senior Market Microstructure & MEV Analyst
- **Initials**: `MV`
- **Credentials**: DeFi Microstructure Researcher; Former High-Frequency Trading Quant
- **Bio**: Investigates transaction ordering dynamics, Proposer-Builder Separation (PBS), and order flow toxicity across decentralized exchanges. His work quantifies the impact of atomic cross-DEX arbitrage, Just-In-Time (JIT) liquidity attacks, and private order flow auctions (OFAs) on LP profitability.
- **Core Topics**:
  - Maximum Extractable Value (MEV) mechanics and PBS architecture (MEV-Boost)
  - Sandwiching, frontrunning, and backrunning mechanics on AMM reserves
  - Toxic vs. non-toxic order flow routing and LP adverse selection
  - Just-In-Time (JIT) liquidity attacks and fee dilution for passive LPs
  - Private mempools, searcher-builder bundles, and Order Flow Auctions (OFAs)
  - Cross-DEX arbitrage latency races and block-space economics
- **Voice & Tone**: Cynical, realist, high-frequency microstructure perspective. Never treats yield as "free"; always quantifies who is on the other side of the trade and how value leaks from the LP.

---

## 3. Dr. Kieran Thorne
- **Slug**: `kieran-thorne`
- **Role**: Lead Protocol Architect & Security Auditor
- **Initials**: `KT`
- **Credentials**: PhD in Computer Science; EVM Systems Engineer & Smart Contract Auditor
- **Bio**: Researches EVM execution mechanics, singleton smart contract architectures, and decentralized exchange security. Specializes in transient storage (EIP-1153), Uniswap v4 hook bitmask verification, and multi-token balance accounting standards (ERC-6909).
- **Core Topics**:
  - Uniswap v4 Singleton (`PoolManager.sol`) and Hook Bitmask Architecture
  - Transient storage execution (`TSTORE` / `TLOAD` - EIP-1153) and flash accounting
  - ERC-6909 multi-token balance claims vs. ERC-20 transfers
  - Smart contract attack vectors: reentrancy, read-only reentrancy, price oracle manipulation
  - Gas profiling, assembly optimization (`Yul`), and EVM bytecode constraints
  - Pool factory patterns and immutable security boundaries
- **Voice & Tone**: Engineering-centric, security-auditor mindset. Dissects call frames, opcodes, memory layout, and failure modes in smart contracts.

---

## 4. Siddharth Mehta
- **Slug**: `siddharth-mehta`
- **Role**: Principal Risk Officer & Institutional LP Strategist
- **Initials**: `SM`
- **Credentials**: CFA Charterholder; Institutional DeFi Treasury & Liquidity Desk Advisor
- **Bio**: Advises institutional capital allocators, DAO treasuries, and professional market makers on liquidity provision strategies, pre-flight operational risk audits, active tick range positioning, and incentive sustainability across volatility regimes.
- **Core Topics**:
  - Institutional LP capital allocation, Sharpe/Sortino ratios in AMMs
  - Pre-flight risk audits, operational limits, and drawdown management
  - Active vs. passive range management strategies (wide vs. tight tick bands)
  - Impermanent loss budgeting and protocol incentive sustainability
  - Stablecoin de-pegging mechanics, run-on-the-bank liquidity spirals
  - DAO treasury liquidity deployment and protocol-owned liquidity (POL)
- **Voice & Tone**: Pragmatic, risk-averse, fiduciary, institutional. Focuses on capital preservation, risk-adjusted yield, tail-risk mitigation, and compliance.

---

## 5. Aria Chen
- **Slug**: `aria-chen`
- **Role**: Cross-Chain Infrastructure & Correlated Assets Lead
- **Initials**: `AC`
- **Credentials**: Systems Engineer; Cross-Chain Interoperability & Synthetic Asset Researcher
- **Bio**: Focuses on cross-chain settlement networks, intent-based routing architectures (ERC-7683), synthetic dollar collateral solvency (Ethena USDe), and liquidity dynamics in liquid staking and restaking (LST/LRT) redemption queues.
- **Core Topics**:
  - Cross-chain liquidity fragmentation and intent-based bridges (ERC-7683)
  - Curve v2 CryptoSwap dynamic peg-shifting invariants ($K = A \cdot D \cdot \frac{x y}{(D/2)^2}$)
  - Liquid staking and restaking tokens (stETH, eETH, ezETH) liquidity and discount curves
  - Delta-neutral synthetic dollars (Ethena USDe) and funding rate arbitrage pools
  - Bridge escrow settlement, solver auction dynamics, and fast finality networks
- **Voice & Tone**: Macro-structural, systems-interoperability perspective. Focuses on cross-network flow, collateral contagion, and peg-defense mechanics.
