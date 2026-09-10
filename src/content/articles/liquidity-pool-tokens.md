---
title: "Liquidity Pool Tokens Explained: What an LP Position Represents"
description: "LP tokens are dynamic protocol claims, not static deposit IOUs. Learn how ERC-20 shares, ERC-721 NFTs, ERC-6909 singleton claims, and vaults account for value."
category: "Foundations"
date: 2026-09-05
lastReviewed: "2026-09-10"
author: "Dr. Kieran Thorne"
readTime: "11 min read"
keywords: "liquidity pool tokens, LP tokens explained, liquidity position NFT, DeFi LP token, ERC-6909, singleton accounting, what is an LP token, liquidity pool token, LP token risks, pool share crypto"
featured: false
faq:
  - q: "What is an LP token?"
    a: "A claim on a share of a pool. In constant-product pools it is a fungible ERC-20 whose supply grows and shrinks as liquidity is added and removed. In tick-based pools each position is a distinct non-fungible claim because it has its own price bounds."
  - q: "What are the risks of holding LP tokens?"
    a: "The claim inherits everything about the underlying pool, including divergence and contract risk, and adds any risk from wherever the token is staked. A wrapped or staked LP claim depends on that additional contract functioning correctly."
  - q: "What happens when I remove liquidity?"
    a: "The contract burns your claim and returns your share of the current reserves, in whatever ratio the pool holds them at that moment, plus any uncollected fees. The quantities returned will usually differ from what you deposited."
---

A liquidity pool token is not a static deposit receipt; it is a programmable claim on an automated market maker's dynamic reserve inventory. Depositing capital into an AMM converts liquid balances into continuous market-making exposure governed by bonding curves and protocol accounting rules.

As decentralized exchange architectures have evolved, the representation of liquidity claims has diversified: from fungible ERC-20 shares in constant-product pools, to non-fungible ERC-721 position tokens in concentrated AMMs, to native ERC-6909 multi-token claims in singleton engines, and automated liquidity management (ALM) vault wrappers.

This guide details the accounting mechanics of each LP token standard, traces how swap fees and inventory drift alter redeemable balances over time, and outlines the operational verification steps required before managing or unwinding LP positions.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-tokens.webp" alt="A pool-share token is linked to a two-sided reserve vault." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>An LP token represents a continuously rebalancing contractual claim on underlying pool reserves. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"The evolution of LP token standards reflects the balance between composability and execution efficiency. Uniswap v2's fungible ERC-20 LP tokens were effortless to collateralize in lending protocols, but lacked range expressiveness. Uniswap v3's ERC-721 NFTs enabled customized price bounds but fragmented money markets. Now, Uniswap v4's ERC-6909 multi-token standard brings back gas-efficient tokenized balance claims directly within the singleton contract."*

## 1. The Core Architecture: LP Tokens as Dynamic Contractual Claims

In traditional banking, a deposit receipt represents a legal entitlement to retrieve a fixed quantity of currency, potentially supplemented by a predictable interest yield. In automated market makers, depositing assets into a pool contract surrenders custody in exchange for a protocol-minted accounting token [1].

The redeemable value of that token is not fixed. It evolves continuously based on three market dynamics:
1. **Trading Fee Accrual**: Each transaction crossing the pool pays a swap fee, which either expands underlying reserves or accumulates in a dedicated fee ledger.
2. **Deterministic Inventory Rebalancing**: When market prices diverge, external arbitrageurs execute swaps against the pool, altering the ratio of tokens backing the LP position.
3. **In-Range vs. Out-of-Range Status**: In concentrated liquidity systems, fee accumulation is strictly binary: positions earn fees exclusively while the market price trades within the designated tick range [2] [3].

Understanding the specific token standard and accounting architecture used by an AMM is essential to evaluating its fee compounding mechanics, gas overhead, and composability within broader DeFi protocols.

---

## 2. Fungible Claims: ERC-20 Reserve Proportions (Uniswap v2 & Curve)

The original decentralized exchange accounting model relies on fungible ERC-20 tokens to track liquidity ownership. In Uniswap v2, when a provider deposits Token A and Token B in proportion to current reserves, the factory-pair contract mints fungible LP tokens [1].

The quantity of minted LP tokens ($\Delta S$) relative to the circulating total supply ($S$) matches the depositor's contribution relative to existing reserves:

$$
\frac{\Delta S}{S} = \frac{\Delta x}{x} = \frac{\Delta y}{y}
$$

### Automatic Fee Compounding
In this architecture, swap fees (e.g., 30 bps per trade) are not distributed to separate balances. They are retained directly within the pool's token reserves ($x$ and $y$). As trading volume clears through the contract, the constant product $k = x \cdot y$ grows over time.

Because the total supply of LP tokens remains static unless capital is added or removed, **each circulating LP token represents an expanding claim on underlying assets** [1].

### Mechanics of Capital Redemption
When an LP redeems their ERC-20 pool tokens, they call `burn()`, which destroys the tokens and transfers a pro-rata share of current reserves back to the wallet:

$$
\text{Redeemed } x = \frac{\text{LP Tokens Burned}}{S} \cdot x_{\text{current}}, \quad \text{Redeemed } y = \frac{\text{LP Tokens Burned}}{S} \cdot y_{\text{current}}
$$

If the relative price between Token A and Token B shifted during the deposit period, the returned basket will contain more of the depreciating asset and less of the appreciating asset compared to the original deposit [1]. For the mathematical foundation of this shift, see [The Constant Product Formula: How x × y = k Shapes AMM Prices](/guides/constant-product-formula/).

---

## 3. Non-Fungible Positions: ERC-721 Concentrated Ticks (Uniswap v3)

Uniswap v3 overhauled liquidity accounting by introducing concentrated liquidity. Instead of spreading reserves across the entire price spectrum $(0, \infty)$, providers allocate capital within discrete price boundaries $[P_l, P_u]$ [3].

Because every provider's position can have unique parameters (lower tick, upper tick, liquidity density $L$, and fee growth inside the range), individual positions cannot be fungible. The protocol therefore mints a non-fungible token (ERC-721) via a specialized `NonfungiblePositionManager.sol` contract [3].

```
+--------------------------------------------------------------------------------+
|                        ERC-721 LP POSITION ANATOMY                             |
+--------------------------------------------------------------------------------+
|                                                                                |
|  NFT Token ID: #482910                                                         |
|  +--------------------------------------------------------------------------+  |
|  | Underlying Pool: ETH / USDC (0.05% Fee Tier)                             |  |
|  | Lower Tick Bound: 1980 USDC per ETH                                      |  |
|  | Upper Tick Bound: 2420 USDC per ETH                                      |  |
|  | Liquidity Parameter (L): 18,492,019,284                                  |  |
|  +--------------------------------------------------------------------------+  |
|                                                                                |
|  Operational Characteristics:                                                  |
|  - Fee Accrual: Active strictly while 1980 <= Spot Price <= 2420.             |
|  - Fee Storage: Tracked in separate uncollected fee ledger (not compounded).   |
|  - Inventory Drift: 100% ETH at P <= 1980; 100% USDC at P >= 2420.          |
|                                                                                |
+--------------------------------------------------------------------------------+
```

### Key Differences from Fungible Shares
1. **Uncollected Fee Separation**: Fees do not automatically compound into virtual reserves. They sit in an uncollected fee accumulator tied to the NFT until the user manually triggers a `collect()` transaction [3].
2. **Deactivation Risk**: If spot price migrates outside the tick bounds, fee accrual halts instantly. The capital sits idle while bearing 100% directional inventory risk [3].
3. **Composability Friction**: Because positions are NFTs, they cannot be natively deposited into lending protocols (like Aave or Compound) without custom wrapper contracts that standardize the position [3] [5].

To explore how range selection alters capital efficiency, review our deep dive: [Concentrated Liquidity Explained: Range, Capital Efficiency, and Risk](/guides/concentrated-liquidity-explained/).

---

## 4. Singleton Multi-Token Claims: ERC-6909 in Uniswap v4

To eliminate the gas inefficiency of minting and transferring ERC-721 NFTs, modern singleton AMMs utilize the **ERC-6909 multi-token standard** [2].

In a singleton architecture such as Uniswap v4 (`PoolManager.sol`), all pools share a single contract state. Tracking positions and balance claims through full ERC-721 or ERC-20 deployments introduces substantial storage overhead. ERC-6909 provides a lightweight alternative:

```solidity
// ERC-6909 Minimal Multi-Token Interface (Uniswap v4 Singleton)
interface IERC6909 {
    function balanceOf(address owner, uint256 id) external view returns (uint256);
    function transfer(address receiver, uint256 id, uint256 amount) external returns (bool);
    function transferFrom(address sender, address receiver, uint256 id, uint256 amount) external returns (bool);
}
```

### Architectural Advantages of ERC-6909 Claims
- **Gas Reduction**: ERC-6909 maintains internal balance mappings (`mapping(address => mapping(uint256 => uint256))`) inside the singleton, removing external contract calls and reducing token management gas by over 70% [2].
- **Flash Accounting Settlement**: During multi-hop swaps or rebalancing operations, routers and LPs can hold positive or negative balance deltas inside the singleton until the final transaction lock clears, settling net amounts without moving ERC-20 tokens onchain [2].
- **Custom Hook-Managed Derivatives**: Hooks can issue specialized ERC-6909 token IDs to represent structured LP positions, dynamic fee rebates, or senior/junior liquidity tranches [2].

---

## 5. Layered Claims: Automated Liquidity Management (ALM) Vault Wrappers

Because active tick management on concentrated AMMs is complex and gas-intensive on Layer 1, an ecosystem of **Automated Liquidity Managers (ALMs)**—including Arrakis Finance, Gamma Strategies, DefiEdge, and Steer Protocol—has developed [5].

These protocols deploy smart contract vaults that re-fungibilize concentrated liquidity:
1. **Capital Pooling**: The vault contract accepts deposits of Token A and Token B from multiple users.
2. **Automated Tick Management**: The vault algorithmically deploys and re-ranges liquidity on Uniswap v3/v4 ticks based on predefined rules (e.g., Bollinger Bands, volatility thresholds, or off-chain keeper triggers).
3. **Fungible Vault Shares**: Depositors receive standard ERC-20 vault share tokens representing their fractional ownership of the underlying multi-tick positions [5].

```
+--------------------------------------------------------------------------------+
|                         THE LAYERED CLAIM HIERARCHY                            |
+--------------------------------------------------------------------------------+
|                                                                                |
|  [User Wallet]                                                                 |
|       | Holds Fungible ERC-20 Vault Share (e.g., Arrakis / Gamma LP Token)     |
|       v                                                                        |
|  [ALM Smart Contract Vault]                                                    |
|       | Executes Algorithmic Rebalancing & Re-Ranging                          |
|       v                                                                        |
|  [Concentrated AMM Singleton / Pool]                                           |
|       | Holds Underlying Tokens in Active / Inactive Tick Ranges               |
|       v                                                                        |
|  [Public Mempool Arbitrage Flow]                                               |
|                                                                                |
+--------------------------------------------------------------------------------+
```

When holding an ALM vault token, you do not simply hold pool reserves: **you hold a claim on an active management algorithm that holds a claim on a concentrated AMM**. If the vault executes naive re-centering during a sharp market trend, it can crystallize adverse selection losses, causing vault shares to underperform passive holding [5].

---

## 6. Common Misconceptions and Accounting Pitfalls

Review these operational misconceptions before managing or valuing LP tokens:

```
+--------------------------------------------------------------------------------+
|                   COMMON LP TOKEN MISCONCEPTIONS & REALITIES                   |
+--------------------------------------------------------------------------------+
|                                                                                |
|  [x] Misconception: "Burn value of an LP token equals initial deposit value."   |
|  [v] Reality: Burn value is determined by current pool reserves. If relative   |
|      prices shifted, you will receive fewer appreciating tokens and more of    |
|      the depreciating asset (adverse selection).                               |
|                                                                                |
|  [x] Misconception: "Uniswap v3 NFTs automatically compound collected fees."   |
|  [v] Reality: Fees in v3 accumulate in a separate ledger. They earn zero       |
|      yield and provide zero depth until manually collected and re-minted.      |
|                                                                                |
|  [x] Misconception: "An LP token in an ALM vault carries zero management risk."|
|  [v] Reality: Vault strategies can suffer severe execution drag from frequent  |
|      rebalancing, rebalance slippage, and management fee deductions.           |
|                                                                                |
|  [x] Misconception: "All LP tokens are composable as lending collateral."      |
|  [v] Reality: Most lending protocols cannot price raw NFT positions without   |
|      standardized ERC-20 wrapper contracts or specialized oracle adapters.    |
|                                                                                |
+--------------------------------------------------------------------------------+
```

---

## 7. Operational Due Diligence Checklist for LP Positions

Before acquiring, staking, or unwinding LP tokens, verify these five operational criteria:

1. **Identify the Token Standard**: Confirm whether your position is represented as a fungible ERC-20 token, an ERC-721 NFT, or an ERC-6909 internal singleton balance [1] [2] [3].
2. **Inspect Fee Accounting Mechanics**: Verify whether fees compound automatically into reserves (v2), sit in an uncollected ledger (v3), or settle via flash accounting (v4) [1] [2] [3].
3. **Verify Range Boundaries**: For concentrated positions, check the active price interval $[P_l, P_u]$. Calculate how close the current market price is to your boundaries and prepare an action plan for range breaches [3].
4. **Evaluate Vault Middleware Risks**: If using an automated vault token, review the protocol's rebalancing frequency, keeper addresses, fee structure, and contract audit history [5].
5. **Calculate Round-Trip Gas Overhead**: Ensure projected fee revenues comfortably amortize the gas costs of approving, minting, collecting fees, and burning the LP position [2] [3].

For detailed technical analysis of pool vulnerabilities and attack surfaces, read [Liquidity Pool Risks: A Complete Framework for LP Due Diligence](/guides/liquidity-pool-risks/).

---

## Monitoring & Onchain Tooling Stack

To track LP token balances, NFT positions, and ERC-6909 claims:

- **NFT Position Management**: Inspect and manage concentrated liquidity NFT positions via [Revert Finance](https://revert.finance).
- **Token Contract Balances & Transfers**: Audit ERC-20, ERC-721, and ERC-6909 transfer events on [Etherscan](https://etherscan.io).
- **Singleton Balance Delta Inspection**: Trace transient claims and singleton token balances using [Tenderly](https://tenderly.co).

## Diagnostic Troubleshooting Decision Tree

Follow this diagnostic tree when managing LP token accounting claims:

1. **LP NFT Transferred, but Uncollected Fees Not Received**:
   - *Diagnostic*: In concentrated AMMs, uncollected trading fees accrue directly to the NFT position; transferring the NFT transfers all uncollected fees to the new recipient.
   - *Action*: Always collect accumulated fees prior to transferring or collateralizing LP position NFTs.
2. **Lending Protocol Liquidating LP Token Collateral**:
   - *Diagnostic*: Price movement has altered the asset composition of the LP position, reducing its net collateral valuation below the liquidation threshold.
   - *Action*: Repay borrowed debt or deposit additional collateral before the lending oracle executes automated liquidation.
3. **ERC-6909 Claims Not Visible in Standard Web3 Wallets**:
   - *Diagnostic*: Traditional wallets only track ERC-20 and ERC-721 token standards; ERC-6909 claims exist as internal balance mappings inside the singleton.
   - *Action*: Inspect position balances directly through the protocol's official interface or query the singleton contract's balanceOf view function.

## Where to Go Next

What the claim is worth when you redeem it depends on the divergence the pool accumulated, derived in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/). Where staking that claim into a farm adds exposure is covered in [Yield Farming Explained](/guides/yield-farming-explained/).

## References

1. [Uniswap v2 Core Whitepaper (Adams, 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v4 Core Whitepaper & Architecture (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
4. [Providing Liquidity in Pools (Curve Finance Documentation)](https://docs.curve.finance/user/yield/lp)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://doi.org/10.1145/3558535.3559772)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper & Architecture"
[3]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[4]: https://docs.curve.finance/user/yield/lp "Providing Liquidity in Pools"
[5]: https://doi.org/10.1145/3558535.3559772 "Risks and Returns of Uniswap V3 Liquidity Providers"


