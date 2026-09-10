---
title: "Uniswap v3 vs v4 Liquidity: What Actually Changed for LPs"
description: "A side-by-side comparison of Uniswap v3 and v4 liquidity: singleton architecture, flash accounting, hooks, dynamic fees, and the LP exposures that did not change at all."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-09-10"
author: "Dr. Kieran Thorne"
readTime: "12 min read"
keywords: "Uniswap v3 vs v4, Uniswap v4 liquidity pool, Uniswap v3 liquidity pool, singleton PoolManager, flash accounting, Uniswap v4 hooks, ERC-6909"
featured: true
faq:
  - q: "What is the main difference between Uniswap v3 and v4?"
    a: "v3 deploys one contract per pool; v4 holds every pool inside a single PoolManager contract and settles net balances at the end of a transaction using transient storage. v4 also allows each pool to attach a hook contract that can run custom logic around swaps and liquidity changes, including setting a dynamic fee."
  - q: "Does Uniswap v4 change impermanent loss?"
    a: "No. Both versions use the same concentrated-liquidity range math, so a position with the same bounds carries the same divergence exposure. What v4 changes is the cost of interacting with the pool and the ability to price volatility through a dynamic fee, which affects net outcomes rather than the underlying exposure."
  - q: "Are Uniswap v4 pools riskier than v3 pools?"
    a: "They add one specific surface: the hook. A hook is arbitrary code with permissions over swap and liquidity lifecycle callbacks, so a v4 pool inherits the trust assumptions of its hook. A pool with no hook or an immutable, audited hook is comparable to v3; a pool with an upgradeable hook holding broad permissions is not."
  - q: "Should an LP migrate positions from v3 to v4?"
    a: "Only where the destination pool has the depth and routed volume to pay for the migration. Moving costs gas twice and realises the current composition. The architecture is cheaper to trade against, which tends to attract routing over time, but liquidity depth on the specific pair is what decides fee income."
---

Uniswap v4 did not change how a concentrated liquidity position prices trades. It changed where pool state lives, how tokens move during a transaction, and who is allowed to run code when a swap touches the pool. For a liquidity provider, that means the exposure is familiar and the operating environment is not.

Separating those two things is the difference between a useful migration decision and a marketing one.

<figure class="article-figure">
  <img src="/images/guides/uniswap-v3-vs-v4.webp" alt="Row-by-row comparison of Uniswap v3 and v4 across deployment, settlement, fees, extensibility, accounting and LP risk." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What changed between v3 and v4, and the one row that did not change at all. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"Read the hook address before you read the APR. In v4 the pool key includes the hook, so two pools on the same pair with different hooks are different markets with different trust assumptions. I have seen teams treat a hooked pool as a drop-in replacement for the v3 pool and never check which lifecycle callbacks the hook actually holds permission for."*

## 1. One Contract Per Pool Versus One Contract For All Pools

In v3, the factory deploys a new contract for every pool, identified by token pair and fee tier [1]. Each contract holds its own reserves, and multi-hop routes transfer ERC-20 tokens between those contracts at every hop.

In v4, a single `PoolManager` contract holds every pool as internal state, keyed by a `PoolKey` structure containing the two currencies, the fee, the tick spacing and the hook address [2]. Creating a pool becomes a state update rather than a contract deployment, which reduces the cost of launching a new market by orders of magnitude and makes fragmentation across fee tiers cheaper to create and cheaper to route across.

The routing consequence is direct: a three-hop swap in v3 performs several token transfers, while the same route in v4 updates internal balances and transfers only the net amounts at the end.

---

## 2. Flash Accounting and Transient Storage

The settlement change rests on EIP-1153 transient storage, which provides storage slots that are cleared automatically at the end of the transaction [3]. During a v4 transaction, the manager records net balance deltas for each currency in transient storage. The caller must settle every outstanding delta before the lock is released, or the transaction reverts.

Three practical effects follow:

1. **Gas cost falls sharply on multi-hop and multi-pool operations**, because intermediate transfers disappear.
2. **Composability improves**: a contract can rebalance across several pools inside one lock and settle once.
3. **Internal balances become useful.** v4 uses ERC-6909 claim tokens so frequent traders and integrators can hold balances inside the manager rather than moving ERC-20s in and out [2].

None of this changes the price a swap receives. The invariant, the tick math and the fee accrual mechanics are inherited from v3.

---

## 3. Hooks: The Real Change for Liquidity Providers

A hook is an external contract attached to a pool at creation, invoked at defined points in the pool lifecycle: before and after a swap, before and after liquidity is added or removed, and on donation [2]. The permissions a hook holds are encoded in its address, so a pool's capabilities are visible from the key itself.

What hooks make possible:

- **Dynamic fees.** A pool can raise its fee when volatility rises, charging arbitrage more for repricing a stale quote. This is the most direct protocol-level response to the adverse selection described in [Loss-Versus-Rebalancing: The LP's Real Hurdle Rate](/guides/loss-versus-rebalancing/).
- **Custom curves.** A hook can override default swap behaviour, allowing designs that would previously have required a separate protocol.
- **Onchain limit orders and automated range management** implemented inside the pool rather than in periphery contracts.
- **Fee routing and donations**, including directing part of the fee to a treasury, an insurance fund or an incentive programme.

What hooks also introduce:

- **Arbitrary code in the swap path**, which is a security surface. A hook can, if permitted, impose withdrawal conditions or fees that did not exist in v3 pools.
- **Upgradeability risk** where the hook is behind a proxy with an admin key.
- **Behavioural uncertainty** in stress conditions, when a hook's logic interacts with volatility in ways that were never tested at scale.

The architecture and its audit surface are covered in [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).

---

## 4. What Did Not Change

For a liquidity provider, this is the important section.

| LP concern | v3 | v4 |
| :--- | :--- | :--- |
| Range math | Translated constant product on $[p_a, p_b]$ | Identical |
| Divergence exposure | Full, amplified by range width | Identical |
| Out-of-range behaviour | Position converts, fee accrual stops | Identical |
| Fee accrual model | Per-tick fee growth accumulators | Identical |
| Adverse selection | Arbitrage against stale quotes | Identical, unless a hook prices it |

A ±5% ETH/USDC position behaves the same way on both versions. The reasons to prefer one are gas, routed volume, and whether a hook improves the fee side of the ledger. The reasons to be cautious about a specific v4 pool are entirely about the hook attached to it.

If the underlying range mechanics are unfamiliar, start with [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/) and [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

---

## 5. Evaluating a v4 Pool Before Supplying

1. **Resolve the hook address** from the pool key and check whether the contract is verified and audited.
2. **Enumerate hook permissions** encoded in the address: which lifecycle callbacks it may implement, and specifically whether it can act on liquidity removal.
3. **Check for upgradeability.** A proxy hook with an active admin key means the pool's rules can change after you deposit.
4. **Read the fee logic.** If the fee is dynamic, understand the function that sets it and the bounds it can reach.
5. **Compare routed volume against the equivalent v3 pool.** Architecture does not pay fees; flow does.
6. **Simulate a full lifecycle** with [Tenderly](https://tenderly.co) or a local fork: mint, swap through the range, collect, and withdraw. Confirm the withdrawal path returns what you expect with the hook in place.
7. **Run the standard pool checks** from [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/) on top of the v4-specific ones.

---

## 6. Migration Arithmetic

Migration is a real trade with real costs: two gas payments, realisation of the current composition, and possible price impact if the ratio must be adjusted. Compare against the incremental fee income you expect from the destination pool, and require a payback period you would actually tolerate.

One more consideration applies to teams running many positions. In v3, every pool is a separate address, so position management tooling tracks a set of contracts. In v4, the manager is one address and pools are identified by key, which simplifies indexing but means monitoring must resolve the hook for each pool rather than assuming pools on the same pair behave alike. Treat the hook as part of the pool's identity in every internal record you keep.

A reasonable default: migrate when the destination pool's routed volume per unit of liquidity exceeds the source pool's by a clear margin and the hook is either absent or immutable and audited. Otherwise, let the market decide where flow concentrates and follow it with new capital rather than by churning existing positions.

The architecture is better. That is a statement about execution cost and extensibility, not a promise about LP returns, which continue to be decided by volume, volatility, competition for the same ticks, and the discipline of the person choosing the range.

## Where to Go Next

The exposure both versions share is derived in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/), and the tier or dynamic-fee decision is covered in [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [EIP-1153: Transient Storage Opcodes (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-1153)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://eips.ethereum.org/EIPS/eip-1153 "EIP-1153: Transient Storage Opcodes"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
