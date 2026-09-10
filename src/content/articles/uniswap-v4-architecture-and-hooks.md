---
title: "Uniswap v4 Architecture: Singleton Design, Hooks, and Flash Accounting"
description: "A comprehensive technical guide to Uniswap v4: the PoolManager singleton, EIP-1153 transient storage, hook lifecycle bitmasks, ERC-6909 tokens, and security."
category: "LP Mechanics"
date: 2026-09-08
lastReviewed: "2026-09-10"
author: "Dr. Kieran Thorne"
readTime: "14 min read"
keywords: "Uniswap v4 architecture, Uniswap v4 hooks, PoolManager.sol, transient storage EIP-1153, flash accounting, ERC-6909, dynamic fee hook, Uniswap v4 hooks liquidity pools, Uniswap v4 singleton, Uniswap v4 flash accounting, Uniswap v4 liquidity pool"
featured: true
faq:
  - q: "What are Uniswap v4 hooks?"
    a: "Contracts attached to a pool at creation that run at defined points in the pool lifecycle, such as before and after a swap or a liquidity change. They can implement dynamic fees, custom curves, onchain orders and fee routing."
  - q: "Are hooks dangerous for liquidity providers?"
    a: "They are arbitrary code with permissions over the pool's lifecycle, so a pool inherits the trust assumptions of its hook. Check whether the hook is verified, audited, immutable, and what it may do on liquidity removal."
  - q: "What is flash accounting?"
    a: "Settlement that records net balance changes in transient storage during a transaction and transfers only the net amounts at the end, rather than moving tokens at each hop. It sharply reduces gas on multi-hop and multi-pool operations."
---

Uniswap v4 fundamentally restructures decentralized exchange architecture on Ethereum. In prior iterations (Uniswap v2 and v3), every trading pair existed as an independently deployed smart contract factory instance. Multi-hop swaps required token balances to transfer physically across multiple contract boundaries, incurring cumulative ERC-20 transfer overhead, state writes, and gas friction.

Uniswap v4 consolidates all liquidity pools into a single central contract: `PoolManager.sol`. Enabled by Ethereum's Cancun-Deneb upgrade and EIP-1153 transient storage opcodes (`TSTORE` and `TLOAD`), this singleton engine implements *flash accounting*. Instead of transferring tokens during intermediate operations, contract balances are updated in temporary memory, requiring token settlement strictly at the conclusion of the overarching transaction lock. Coupled with modular, programmable plugins known as *hooks*, Uniswap v4 transforms the automated market maker from a rigid bonding curve into an extensible execution platform [1] [2] [3].

<figure class="article-figure">
  <img src="/images/guides/uniswap-v4-architecture-and-hooks.webp" alt="Isometric diagram of Uniswap v4 singleton contract vault with pre-swap and post-swap hook plugins and transient storage." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The Uniswap v4 singleton architecture centralizes token balances while delegating execution logic to modular hooks. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"Uniswap v4's hook architecture represents the greatest paradigm shift in AMM security since reentrancy was discovered. Because hooks execute arbitrary code during critical state transitions, a malicious or poorly written hook contract can re-enter the singleton, manipulate internal balances, or freeze pool liquidity entirely. Never deposit capital into a v4 pool without verifying the hook address bitmask permissions and auditing the hook contract's upgradeability."*

## 1. The Singleton Architecture vs. Factory Model

In Uniswap v2 and v3, pool deployment was decentralized across thousands of discrete bytecode instances:

```
Uniswap v3 (Factory Model):
[Trader] ---> [SwapRouter] ---> [USDC/ETH Pool Contract] ---> [ETH/WBTC Pool Contract]
                   |                       |                               |
                   +-- (Transfer USDC) ----+-- (Transfer ETH) -------------+-- (Transfer WBTC)
                   Gas: 3 separate contract state updates + 3 distinct ERC-20 transfers
```

This factory architecture imposed significant architectural penalties:
1. **Multi-Hop Gas Inefficiency**: Swapping from Token A to Token C via Token B required transferring Token B out of Pool 1 and into Pool 2. Each transfer invoked the ERC-20 `transfer` function, consuming 20,000+ gas per hop [1].
2. **Pool Creation Overhead**: Initializing a new pool required deploying an entire contract via `CREATE2`, costing upwards of 4,000,000 gas.
3. **Fragmented Liquidity Management**: Rebalancing capital across different fee tiers or pairs required multiple approvals and independent contract calls [2].

```
Uniswap v4 (Singleton Architecture):
                                  [Trader]
                                     |
                                     v
                       +---------------------------+
                       |      PoolManager.sol      |
                       | (Holds ALL token balances)|
                       +---------------------------+
                       | Pool: USDC/ETH            |
                       | Pool: ETH/WBTC            |
                       | Pool: DAI/USDC            |
                       +---------------------------+
                                     |
                    (Transient Ledger: Delta Netting)
                                     |
                                     v
                  Single Net Settlement at Transaction End
```

In Uniswap v4, `PoolManager.sol` holds the balances of all tokens across all pools. Creating a new pool does not deploy a new contract; it simply initializes a new key entry in the singleton's internal mapping, reducing pool creation costs by up to 99% [1]. To understand how classical constant-product curves operate within this structure, review our foundational guide on the [Constant Product Formula: Math and Mechanics](/guides/constant-product-formula/).

---

## 2. Flash Accounting and EIP-1153 Transient Storage

The engineering foundation of Uniswap v4 is **flash accounting**, made possible by Ethereum's EIP-1153 transient storage opcodes:
- `TSTORE`: Writes a 32-byte word to transient memory (cost: 100 gas, compared to 20,000 gas for `SSTORE`).
- `TLOAD`: Reads a 32-byte word from transient memory (cost: 100 gas, compared to 2,100 gas for `SLOAD`).

Transient storage behaves like persistent contract storage, but its state is completely cleared at the end of the transaction execution frame [1] [3].

### The Lock and Delta Settlement Cycle

When an external caller (a router, swapper, or liquidity provider) interacts with `PoolManager.sol`, execution follows a strict locking pattern:

```solidity
// Simplified architectural flow of PoolManager lock execution
function unlock(bytes calldata data) external returns (bytes memory) {
    require(!isLocked(), "Already Locked");
    setLocked(true);

    // Callback to caller contract (e.g., Router or Hook)
    bytes memory result = ILockCallback(msg.sender).unlockCallback(data);

    // Verify that all currency deltas in transient storage have resolved to zero
    require(areAllDeltasZero(), "Currency Not Settled");
    setLocked(false);
    return result;
}
```

1. **Transaction Entry (`unlock`)**: The caller requests a lock. `PoolManager` grants temporary execution rights to the caller via an `unlockCallback`.
2. **Internal Operation Churn**: The caller can execute multiple swaps, mint concentrated liquidity, burn positions, and donate fees. Each action updates the caller's transient currency balance delta (`currencyDelta`). No actual ERC-20 tokens move.
3. **Delta Settlement**: If the caller swapped USDC for ETH, transient storage records a negative delta for USDC (owed to the pool) and a positive delta for ETH (owed to the caller).
4. **Final Resolution (`take` and `settle`)**:
   - The caller calls `settle()` and transfers the owed USDC into `PoolManager`.
   - The caller calls `take()` and withdraws the credited ETH out of `PoolManager`.
5. **Lock Release Verification**: Before `unlock` terminates, `PoolManager` asserts that every currency delta equals exactly zero. If a single wei remains unpaid or unclaimed, the entire transaction reverts [1] [4].

Flash accounting enables complex multi-pool arbitrage and rebalancing loops with near-zero intermediate gas drag. For a detailed breakdown of how concentrated liquidity behaves within these boundaries, see [Concentrated Liquidity Explained: Range, Capital Efficiency, and Risk](/guides/concentrated-liquidity-explained/).

---

## 3. The Hook Lifecycle: 8 Execution Interception Points

Hooks are external smart contracts associated with a specific pool key at initialization. When pool actions occur, `PoolManager.sol` executes callbacks to the hook contract, allowing custom logic to modify transaction parameters, fees, or balances [1] [2].

```
                     UNISWAP v4 HOOK EXECUTION LIFECYCLE
                     
  [Pool Initialization]             [Swap Execution]             [Liquidity Modification]
           |                                |                               |
           v                                v                               v
    beforeInitialize                   beforeSwap                  beforeAddLiquidity
           |                                |                               |
     (Initialize)                        (Execute)                   beforeRemoveLiquidity
           |                                |                               |
           v                                v                               v
    afterInitialize                    afterSwap                   afterAddLiquidity
                                                                            |
                                                                   afterRemoveLiquidity
```

### The Hook Callback Inventory:

1. **`beforeInitialize` / `afterInitialize`**: Executed when a pool key is first registered. Allows the hook to configure initial dynamic fee curves, restrict pool parameters, or verify authorization.
2. **`beforeAddLiquidity` / `afterAddLiquidity`**: Triggered when an LP deposits capital. Hooks can verify KYC credentials, collect custom management fees, or rebalance collateral into external lending markets.
3. **`beforeRemoveLiquidity` / `afterRemoveLiquidity`**: Triggered during capital withdrawal. Hooks can enforce minimum holding cooldowns (mitigating JIT liquidity) or compute exit taxes.
4. **`beforeSwap` / `afterSwap`**: The core execution interception points. 
   - `beforeSwap` can inspect swapper address, dynamically calculate swap fees based on volatility, or override swap execution entirely via custom curves.
   - `afterSwap` can capture MEV profits, trigger automated in-pool limit order fills, or update internal TWAP accumulators [1] [5].
5. **`beforeDonate` / `afterDonate`**: Allows protocols to inject native rewards directly to active in-range liquidity providers without changing tick prices.

---

## 4. Hook Address Bitmasks and Permission Flags

To prevent unauthorized or unexpected contract calls, Uniswap v4 implements **deterministic address bitmasking** [1]. 

A hook contract cannot simply declare which callbacks it implements. Instead, the permissions of a hook contract are encoded directly into the leading bits of its deployed Ethereum contract address. During contract initialization, `PoolManager.sol` checks the hook address against the required permission bitmask:

```
Hook Address Permission Bitmask Schema (14 Flags):
0x[ Flag Bits (14 bits) ][ Mining Salt / Address Bytes (146 bits) ]

Bit 0:  BEFORE_INITIALIZE_FLAG
Bit 1:  AFTER_INITIALIZE_FLAG
Bit 2:  BEFORE_ADD_LIQUIDITY_FLAG
Bit 3:  AFTER_ADD_LIQUIDITY_FLAG
Bit 4:  BEFORE_REMOVE_LIQUIDITY_FLAG
Bit 5:  AFTER_REMOVE_LIQUIDITY_FLAG
Bit 6:  BEFORE_SWAP_FLAG
Bit 7:  AFTER_SWAP_FLAG
Bit 8:  BEFORE_DONATE_FLAG
Bit 9:  AFTER_DONATE_FLAG
Bit 10: BEFORE_SWAP_RETURNS_DELTA_FLAG
Bit 11: AFTER_SWAP_RETURNS_DELTA_FLAG
Bit 12: AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG
Bit 13: AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA_FLAG
```

Developers must mine salt values using tools like `CREATE2` to deploy their hook bytecode to an address that matches their exact declared permissions. If a hook attempts to execute `beforeSwap` but its address does not possess the `BEFORE_SWAP_FLAG` bit set, `PoolManager` immediately reverts [1]. This mathematical constraint provides transparency: any LP or router can immediately inspect a hook contract's address to determine its operational capabilities.

---

## 5. Native ERC-6909 Singleton Accounting

In Uniswap v2 and v3, liquidity positions and claimable balances were represented through discrete token standards: v2 utilized standard ERC-20 LP tokens, while v3 utilized ERC-721 non-fungible tokens (NFTs) to track custom price bounds [1] [2].

Uniswap v4 introduces native support for **ERC-6909 Multi-Token Standard** directly inside `PoolManager.sol` [6]. 

ERC-6909 is a minimalist, gas-optimized alternative to ERC-1155. Instead of transferring external ERC-20 tokens in and out of the singleton, users and hooks can maintain balance credits inside `PoolManager`:
- When withdrawing liquidity or collecting fees, an LP can mint an ERC-6909 claim instead of requesting an ERC-20 transfer.
- When executing subsequent swaps, the user spends their ERC-6909 credit with zero ERC-20 transfer overhead.
- This creates an ultra-fast internal balance economy for active market makers and automated rebalancers.

Learn more about how token representations govern claims across AMMs in our guide to [Liquidity Pool Tokens: ERC-20, NFTs, and Accounting Claims](/guides/liquidity-pool-tokens/).

---

## 6. Common Hook Misconceptions & Smart Contract Audit Pitfalls

| Hook Misconception | Smart Contract & Execution Reality | Institutional Risk Mitigation |
|---|---|---|
| **"Any verified hook on Etherscan is secure."** | A hook can execute arbitrary logic in `beforeSwap` or `beforeRemoveLiquidity`, including draining fee deltas or restricting withdrawals. | Audit whether the hook is an immutable deployment or behind an upgradeable proxy with a centralized multisig key. |
| **"Hooks can prevent all MEV."** | Hooks can mitigate atomic JIT liquidity and dynamic LVR, but cannot eliminate block builder transaction ordering dominance or cross-DEX arbitrage. | Combine hook protections with private RPC relays (Flashbots Protect, MEV-Blocker) when routing orders. |
| **"Dynamic fee hooks always benefit LPs."** | If a dynamic fee algorithm is calibrated improperly, raising fees excessively drives organic aggregator flow to competing v3 or Curve pools. | Verify that hook fee scaling formulas utilize rolling volatility rather than lagging single-block volume spikes. |
| **"ERC-6909 tokens carry identical risks to ERC-20."** | ERC-6909 credits exist solely within `PoolManager.sol`. If `PoolManager` suffers a catastrophic vulnerability, internal credits have no independent external backing. | Periodically settle internal ERC-6909 claims into native canonical assets on high-value positions. |

---

## 7. Institutional Pre-Flight Checklist for Uniswap v4 Pools

Before allocating capital to a Uniswap v4 pool deployment, institutional risk managers execute this technical checklist:

- [ ] **Hook Address Bitmask Inspection**: Have you decoded the hook contract address prefix to confirm that only declared permissions are active?
- [ ] **Transient Delta Audit**: Does the hook contract implement `take` or `settle` with custom delta modifications (`BEFORE_SWAP_RETURNS_DELTA`)? Ensure delta accounting cannot leave an unresolved balance deficit.
- [ ] **Proxy and Timelock Verification**: Is the hook contract immutable, or does it utilize an upgradeable proxy (UUPS/Transparent)? If upgradeable, is there a mandatory 48-hour timelock?
- [ ] **Anti-JIT Mechanics**: Does the hook enforce a minimum liquidity holding duration or tick exit fee to neutralize atomic Just-In-Time sandwich attacks [5]?
- [ ] **LVR Hurdle Validation**: If the pool implements dynamic fees, does the fee expansion curve adequately compensate for the pair's expected Loss-Versus-Rebalancing ($\frac{\sigma^2}{8}$) during market shocks [7]?
- [ ] **Gas Amortization**: Does your position size amortize the hook callback compute overhead relative to standard v3 execution?

Uniswap v4 transforms automated market makers into programmable financial infrastructure. By understanding the interaction between singleton flash accounting, deterministic hook bitmasks, and transient storage, liquidity providers can harness institutional flexibility while rigorously mitigating smart contract attack surfaces.

---

## Monitoring & Onchain Tooling Stack

To inspect Uniswap v4 singleton pools, hook execution, and transient storage:

- **Hook Contract Simulation & Gas Tracing**: Simulate hook callbacks and trace EIP-1153 transient storage gas execution using [Tenderly](https://tenderly.co).
- **Uniswap v4 Pool Explorer & Analytics**: Inspect active singleton pool deployments, hook configurations, and fee settings on official Uniswap v4 developer tooling.
- **Hook Security & Bitmask Verification**: Audit hook permission flags and address bitmasks using [Foundry](https://getfoundry.sh) test suites and static analysis tools.

## Diagnostic Troubleshooting Decision Tree

Follow this diagnostic decision tree when building or interacting with Uniswap v4 pools:

1. **Transaction Reverts with Hook Execution Failure**:
   - *Diagnostic*: A custom hook contract reverted during beforeSwap or afterSwap, blocking swap execution.
   - *Action*: Simulate the transaction in Tenderly to inspect the exact revert reason in the hook frame; check if the hook has paused execution or reached an unhandled edge case.
2. **Transient Accounting Fails to Settle ('CurrencyNotSettled')**:
   - *Diagnostic*: Net token deltas recorded in transient storage were not fully settled to zero before the unlock context closed.
   - *Action*: Ensure the calling contract transfers the exact required net token balance to PoolManager.sol or settles claims via ERC-6909 tokens.
3. **Hook Address Bitmask Verification Fails at Initialization**:
   - *Diagnostic*: The deployed hook contract address does not possess the exact leading bitmask matching its declared permission flags.
   - *Action*: Re-mine the hook deployment salt using CREATE2 (via Foundry) until the deployed contract address matches the exact bitwise permissions required by PoolManager.

## Where to Go Next

For the migration decision stated as a comparison rather than an architecture tour, see [Uniswap v3 vs v4 Liquidity](/guides/uniswap-v3-vs-v4/). For what a dynamic-fee hook is actually trying to price, see [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).

## References

[1]: https://github.com/Uniswap/v4-core/blob/main/docs/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper (Adams et al., 2024)"

[2]: https://docs.uniswap.org/contracts/v4/concepts/hooks "Uniswap v4 Developer Documentation: Hooks Architecture"

[3]: https://eips.ethereum.org/EIPS/eip-1153 "EIP-1153: Transient Storage Opcodes"

[4]: https://app.uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Technical Whitepaper"

[5]: https://arxiv.org/abs/2305.19211 "Just-In-Time Liquidity: Characteristics and Impact on Concentrated AMMs"

[6]: https://eips.ethereum.org/EIPS/eip-6909 "EIP-6909: Minimal Multi-Token Interface"

[7]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
