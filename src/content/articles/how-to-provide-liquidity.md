---
title: "How to Provide Liquidity: A Mechanism-First Walkthrough"
description: "Providing liquidity is choosing an exposure to a pricing rule. Learn how ranges, Permit2 approvals, hooks, fees, and order flow shape your inventory."
category: "LP Mechanics"
date: 2026-09-03
lastReviewed: "2026-09-10"
author: "Siddharth Mehta"
readTime: "11 min read"
keywords: "how to provide liquidity, provide liquidity AMM, liquidity provider guide, DeFi LP, Permit2, hooks, how to provide liquidity on Uniswap, liquidity provision DeFi, do I need both tokens to provide liquidity"
featured: true
faq:
  - q: "How much do you need to provide liquidity?"
    a: "There is no protocol minimum, but there is an economic one. If gas for minting, collecting and withdrawing is a large fraction of expected fee income, the position cannot work. On high-fee networks that threshold rules out small positions entirely."
  - q: "How long should I provide liquidity?"
    a: "Long enough for fee income to clear the divergence the position takes on, which depends on turnover and volatility rather than on a calendar. Positions judged over a few days are dominated by noise."
  - q: "When should I remove liquidity?"
    a: "When the reason for the position no longer holds: the pair's volatility has risen beyond what the fee tier compensates, volume has migrated elsewhere, the incentive programme has ended, or you no longer want exposure to either asset."
---

Providing liquidity to an automated market maker (AMM) is not a passive yield deposit; it is an active underwriting agreement in which a capital allocator authorizes an immutable smart contract to trade against inventory at deterministic price levels. In return for collecting swap fee cash flow, the liquidity provider (LP) accepts directional inventory drift, continuous options-like adverse selection (Loss-Versus-Rebalancing), and transaction ordering risk from arbitrageurs [1] [2] [4].

In modern decentralized finance, providing liquidity involves concrete technical choices: selecting between full-range curves and tick-based concentrated intervals, auditing singleton contracts with programmable hooks, executing signature-based Permit2 authorizations, and managing inventory decay through automated vault managers. This walkthrough details each step of the capital lifecycle—from token authorization to exit settlement—providing an institutional framework for deploying capital on-chain [1] [2] [4].

<figure class="article-figure">
  <img src="/images/guides/how-to-provide-liquidity.webp" alt="Two assets enter a pool through a chosen active price range and produce a position receipt." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Providing liquidity means choosing a pool, assets, and active range. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"The moment you sign an approval and deposit liquidity into an onchain pool, you are running an active market-making business. Beginners frequently fail to account for the transaction cost friction of entering and exiting pools. On Ethereum mainnet, approving two ERC-20 tokens, minting a position NFT, and collecting fees can easily cost $80–$150 in gas. If your initial deposit is only $1,000, you are starting with an immediate 10% performance handicap."*

## Start from the Pricing Rule: Invariant and Active Region

Most decentralized exchanges execute trades through automated market makers. In a standard constant-product AMM, the pool enforces the invariant $x \cdot y = k$. When traders purchase one token, they deposit the other, shifting the marginal price along the hyperbolic curve. Whenever external market prices shift, arbitrageurs trade against the pool to bring its quotes back into line with external reference venues. In doing so, the pool continuously sells the appreciating asset and accumulates the depreciating asset, inflicting divergence loss (impermanent loss) relative to holding the original tokens [4].

In concentrated-liquidity protocols (Uniswap v3 and v4), an LP specifies a finite price interval $[P_{\text{lower}}, P_{\text{upper}}]$. Within that interval, capital acts as a dense virtual constant-product curve, earning a share of fees from trades crossing the chosen ticks [1]. Outside that interval, liquidity is completely inactive: it facilitates zero trades and earns zero fees [1].

As trades push spot price through your interval, inventory composition migrates deterministically:
- As spot price rises toward $P_{\text{upper}}$, traders buy the base asset (e.g., ETH) from the position and deposit the quote asset (e.g., USDC). At the upper boundary, the position becomes 100% USDC [2].
- As spot price falls toward $P_{\text{lower}}$, traders buy USDC and deposit ETH. At the lower boundary, the position becomes 100% ETH [2].

An LP position's balance is not static; it is a mathematical function of current spot price relative to initialized tick boundaries.

## Map Interface Choices to Contract Exposures

Every configuration decision in the deposit flow selects a specific contract exposure:

- **Pool Architecture**: A classic full-range pool spreads capital across $0 \to \infty$, minimizing maintenance at the expense of capital efficiency. A concentrated pool packs depth into tight bands, dramatically increasing fee capture but requiring active monitoring [1] [2].
- **Permit2 and Token Approvals**: Modern protocols utilize Uniswap's Permit2 standard. Rather than granting unlimited ERC-20 allowances directly to router contracts, you sign an off-chain EIP-712 permit that grants temporary, time-bound transfer rights, reducing gas overhead and smart-contract exposure [1].
- **Fee Tier Selection**: Standard fee tiers (0.01%, 0.05%, 0.30%, 1.00%) reflect expected asset volatility. In hook-enabled pools (Uniswap v4), pools can implement dynamic fee algorithms that raise fees during volatile market conditions to offset adverse selection [1].
- **Hook Contract Inspection**: When depositing into modern singleton pools, verify the associated hook address. Hooks have rights to intercept pool operations and can alter swap fees, implement withdrawal conditions, or allocate idle liquidity to external lending markets [1].
- **Redemption & Exit**: Withdrawing burns your LP claim (ERC-721 NFT or ERC-6909 tokens) and returns your current inventory. If the spot price has exited your range, you will withdraw 100% of the underperforming asset [2].

## Scenario 1: A Stablecoin Position Around Parity

Consider supplying capital to a USDC/USDT pool, setting a narrow price band around parity (e.g., 0.9990 to 1.0010). The objective is capital efficiency: because pegged stablecoins rarely trade far from $1.00, concentrating capital into a 20-basis-point corridor delivers hundreds of times the fee density of a full-range position [1].

Mechanics inside the contract:
- While price fluctuates between 0.9990 and 1.0010, the position is active, capturing fees from swappers and aggregators [1].
- If an asset depegs (for example, if USDT trades down to 0.9850), the market sweeps through your lower boundary. Your position is rapidly converted 100% into USDT, and fee accrual stops entirely [2].
- You are now fully exposed to the distressed asset. The position will not automatically rebalance itself back into USDC; it sits idle unless price recovers or you pay transaction fees to close the position and accept the realized loss.

When is this useful? When you have strong structural confidence that both assets will maintain their pegs. Where does it fail? When an asset suffers credit impairment, concentrated liquidity transforms into concentrated exposure to the impaired token [2] [4].

## Scenario 2: Volatile ETH/USDC Pair—Wide Range vs Narrow Range

Consider supplying liquidity to an ETH/USDC pool. You face a strategic trade-off:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Wide Range vs. Narrow Range Trade-off                │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Wide Range (e.g. ±50%)   │ Narrow Range (e.g. ±5%)                     │
├──────────────────────────┼─────────────────────────────────────────────┤
│ • Stays in-range longer  │ • High fee density per dollar deployed      │
│ • Low management burden  │ • Rapidly exits range during trends         │
│ • Lower capital yield    │ • Severe adverse selection during breakouts │
│ • Slower inventory drift │ • Requires automated rebalancing or vaults  │
│ └──────────────────────────┴─────────────────────────────────────────────┘
```

With a narrow range, an LP collects higher fee cash flow during quiet, range-bound market regimes. However, during momentum breakouts, the position becomes single-sided in seconds, forfeiting fee income while suffering full divergence loss [2] [4].

For allocators unable to adjust tick ranges continuously, utilizing an **Automated Liquidity Management (ALM) vault** (such as Arrakis or Gamma) or choosing a wider interval calibrated to historical volatility is required [1].

For a deeper dive into range boundaries and execution math, explore [Concentrated Liquidity Explained: Range, Capital Efficiency, and Risk](/guides/concentrated-liquidity-explained/).

## Stable-Swap Pools: Amplification and Imbalance Tolerance

Curve Finance uses a hybrid invariant designed specifically for correlated assets (stablecoins, liquid staking tokens, wrapped assets). The amplification coefficient ($A$) controls how flat the curve remains near parity [3]:
- A high $A$ parameter allows the pool to absorb large trades with negligible slippage [3].
- However, if the fundamental backing of one asset deteriorates, the high $A$ parameter delays price discovery, causing the pool to absorb enormous amounts of the depegging asset before the curve steepens [3].

When providing liquidity to Curve pools, check the pool's reserve balance. If a pool is already 80/20 skewed, new LPs are essentially taking on immediate depeg risk [3].

## Fees Versus Divergence: Evaluating Real Profitability

Displayed APR figures on DEX interfaces are backward-looking metrics calculated from past 24-hour volume. They do not account for:
1. **Divergence Loss (Impermanent Loss)**: The reduction in portfolio value caused by asset price movement along the curve [4].
2. **Loss-Versus-Rebalancing (LVR)**: The continuous value leaked to informed arbitrageurs who exploit stale pool prices [4].
3. **Out-of-Range Inactivity**: Time spent outside your chosen price ticks where your capital generates zero yield [1] [2].

Net LP profitability is determined by:

$$\text{Net Return} = \text{Fee Revenue} - \text{LVR} - \text{Gas \& Management Costs}$$

If fee revenue fails to exceed LVR, holding the underlying assets or deploying them into money market vaults yields a superior risk-adjusted return.

For a detailed analysis of fee mechanics and accrual models, see [Liquidity Provider Fees: How LP Revenue Is Generated and Measured](/guides/liquidity-provider-fees/).

## Monitoring & Onchain Tooling Stack

To execute and manage liquidity provision operations efficiently:

- **Position Management & Auto-Compounding**: Track open positions, fee accrual, and net return vs. HODL via [Revert Finance](https://revert.finance).
- **Gas Profiling & Simulation**: Simulate deposit transactions and estimate exact execution gas costs using [Tenderly](https://tenderly.co).
- **Pool TVL & Volume Monitoring**: Audit target pool health and fee tiers on [DeFiLlama](https://defillama.com).

## Common Operational Mistakes & Pre-Deposit Failures

| Operational Mistake | Contract-Level Consequence | Institutional Risk Mitigation |
|---|---|---|
| **Depositing into Unverified Hook Contracts** | In Uniswap v4, malicious or upgradeable hooks can siphon fees or restrict withdrawals. | Audit the hook bytecode and permissions bitmask; verify hooks are verified and immutable on Etherscan. |
| **Granting Unlimited Infinite Approvals** | Stale unlimited ERC-20 allowances expose wallet balances to router contract vulnerabilities. | Use Permit2 signed allowances with explicit expiration timestamps and deposit allowances capped to exact size. |
| **Entering Heavily Skewed Correlated Pools** | Depositing 50/50 into an 85/15 StableSwap pool instantly trades your healthy tokens for depegged inventory at unfavorable rates. | Inspect current pool reserves; avoid depositing healthy assets into pools exhibiting structural depeg skew. |
| **Ignoring Range Boundary Liquidation Decay** | Leaving an out-of-range volatile position unattended during an adverse trend turns an LP into a bag-holder of declining assets. | Implement automated stop-loss thresholds or use automated liquidity vaults with dynamic rebalancing logic. |

## Transaction Ordering and Execution Flow

How trades reach your pool directly affects LP returns:
- **Public Mempool Swaps**: Public trades expose LPs to **Just-In-Time (JIT) Liquidity**. Searchers observe pending swaps, mint a hyper-concentrated position in the active tick immediately ahead of the swap, extract the fee, and burn the position in the same block, diluting passive LP earnings [5].
- **Intent-Based Solver Flow (UniswapX, CoW Swap)**: Retail traders increasingly route orders through off-chain solver networks. Solvers match benign orders off-chain and only route difficult or arbitrage trades through on-chain AMMs, increasing the proportion of toxic flow that hits passive pools [5].

## Compact Comparison: How Designs Shape Inventory and Activity

| Pool Design | Where Liquidity is Active | Inventory Behavior | When Fee Accrual Stops | Primary Exposure |
|---|---|---|---|---|
| Uniswap v2 | $0 \to \infty$ full range | Continuous rebalancing along $x \cdot y = k$ [1] | Never; always active [1] | Broad divergence loss across large price trends [4] |
| Uniswap v3/v4 Narrow | Custom tick interval $[P_a, P_b]$ [1] | Rapidly flips to single asset at edge [2] | Immediately upon exiting interval [1] | Inactivity periods and adverse selection [2] |
| Uniswap v4 Hook Pools | Custom tick interval with hook logic [1] | Dynamic fees, lending hooks, or limit logic [1] | Controlled by tick range and hook rules [1] | Smart-contract hook security and parameters [1] |
| Curve StableSwap | Clustered near peg via parameter $A$ [3] | Flatter near balance; steepens under skew [3] | Never halts, but fees shrink if volume dries up [3] | Depeg events and asset correlation collapse [3] |

## From Approval to Exit: Trace the State Changes

1. **Asset Selection & Diligence**: Identify the pair, verify token contracts, and evaluate historical volatility and correlation [1] [3].
2. **Permit2 Authorization**: Sign an EIP-712 permit granting the router permission to transfer specified token quantities [1].
3. **Tick Interval Selection**: Define price bounds that reflect your volatility horizon. For hook pools, audit hook parameters [1] [2].
4. **Active Position Monitoring**: Monitor spot price relative to tick boundaries. Track collected fees and calculate net return against LVR [4].
5. **Withdrawal and Settlement**: Call the exit function to decrease liquidity, collect accrued fees, and receive your final token inventory [2].

## What to Check Before You Act

- What is the exact price interval where my position will earn swap fees [1]?
- If spot price breaks through my bounds, which asset will I be left holding, and am I prepared to hold it [2]?
- In Uniswap v4, does the pool have a hook contract attached, and what permissions does that hook possess [1]?
- For stablecoin or pegged asset pools, what is the current reserve balance skew, and what are the underlying redemption mechanisms [3]?
- Does historical pool fee volume plausibly exceed the cost of adverse selection (LVR) [4]?

## Diagnostic Troubleshooting Decision Tree

Use this operational troubleshooting tree when executing liquidity deposits:

1. **Deposit Transaction Reverts with Slippage Error**:
   - *Diagnostic*: Spot price moved during transaction confirmation, violating the minimum token amounts (amount0Min, amount1Min) specified in the call.
   - *Action*: Increase slippage tolerance slightly (e.g., from 0.1% to 0.5%) or submit transaction through a private RPC to eliminate mempool frontrunning.
2. **Position Immediately Exits Active Range After Deposit**:
   - *Diagnostic*: Tick range was configured too narrowly without accounting for intraday market volatility.
   - *Action*: Do not panic rebalance; assess trailing volatility on Dune before deciding whether to expand range boundaries or hold converted inventory.
3. **Fee Accruals Lagging Behind Gas Expenditure**:
   - *Diagnostic*: Position capital size is too small relative to onchain transaction costs.
   - *Action*: Batch fee collection operations; do not claim fees until accumulated yield exceeds at least 5x transaction gas costs.

## Where to Go Next

Before choosing bounds, price the boundary case in [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) and the tier in [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/). Then run the two numbers that decide the position: expected fees in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) and expected divergence in the [impermanent loss calculator](/tools/impermanent-loss-calculator/). For depositing with one asset, see [Single-Sided Liquidity](/guides/single-sided-liquidity/); for the protocol-level walkthrough, see [Uniswap Liquidity Pools](/guides/uniswap-liquidity-pools/).

## References

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity | Uniswap Developers"

[2]: https://app.uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"

[3]: https://curve.readthedocs.io/exchange-pools.html "Curve StableSwap: Pools | Curve Documentation"

[4]: https://www.bis.org/publications/trading-defi-era-automated-market-maker "Trading in the DeFi era: automated market-maker | Bank for International Settlements"

[5]: https://ethereum.org/developers/docs/mev/ "Maximal Extractable Value (MEV) | ethereum.org"
