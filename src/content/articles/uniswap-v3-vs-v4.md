---
title: "Uniswap v3 vs v4 Liquidity: What Actually Changed for LPs"
description: "Your exposure is identical. What changed is the cost of touching the pool and who may run code when a swap arrives, and that second part is the decision."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Dr. Kieran Thorne"
readTime: "6 min read"
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

Here is the short version. Your exposure did not change at all. A band of plus or minus 5% on ETH against dollars behaves identically on both versions.

What changed is where the pool's state lives, how tokens move during a transaction, and who is allowed to run code when a swap arrives.

The first two make things cheaper. The third is the entire decision, and it is the one people skip.

<figure class="article-figure">
  <img src="/images/guides/uniswap-v3-vs-v4.webp" alt="Row-by-row comparison of Uniswap v3 and v4 across deployment, settlement, fees, extensibility, accounting and LP risk." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What changed between v3 and v4, and the one row that did not change at all. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"Read the hook before you read the yield. In v4 the hook is part of the pool's identity, so two pools on the same pair with different hooks are different markets with different people to trust. I have watched teams treat a hooked pool as a drop-in replacement and never check which callbacks that hook actually holds."*

## One contract instead of thousands

In v3, every pool is a separate contract, identified by its pair and fee tier [1]. Each one holds its own tokens, so a route through three pools moves tokens three times.

In v4, one contract holds every pool as internal state, keyed by the two tokens, the fee, the step size, and the hook address [2]. Creating a pool is now a table entry rather than a deployment, which drops the cost of launching a market by orders of magnitude.

The routing effect is direct. A three-hop swap in v3 physically moves tokens at every step. The same route in v4 updates internal numbers and moves tokens once, at the end.

## Why settling once is so much cheaper

Ethereum added storage that lasts only as long as one transaction and then clears itself [3]. v4 keeps its running tally there.

During a transaction the contract records what each side owes. Before it finishes, every one of those must net to zero, or the whole thing reverts.

| What that buys | Why it matters |
| :--- | :--- |
| Much lower gas on multi-hop and multi-pool operations | Intermediate transfers simply disappear |
| Composability | One contract can rebalance across several pools inside one session, settling once |
| Internal balances | Frequent traders can hold credits in the contract rather than moving tokens back and forth [2] |

None of that changes the price a swap gets. The rule, the price steps and the fee accounting are inherited unchanged from v3.

## Hooks: the actual change for you

A hook is a contract attached to a pool when it is created, called at defined moments: around a swap, around liquidity going in or out, and on donations [2]. Its permissions are encoded in its own address, so you can read what it is allowed to do without trusting anybody.

| What hooks make possible | What hooks also introduce |
| :--- | :--- |
| Fees that rise with volatility, charging arbitrage more when it takes most | Arbitrary code sitting in the swap path |
| Custom pricing rules that used to need a whole separate protocol | Conditions on withdrawal that did not exist in v3 |
| Limit orders and automatic range management inside the pool | Upgradeability, if the hook sits behind a proxy with a key |
| Fee routing to a treasury, insurance fund or reward programme | Behaviour under stress that nobody has tested at scale |

The first row on the left is the most interesting thing in v4 for anyone supplying liquidity. It is the first protocol-level answer to loss-versus-rebalancing — what a pool pays out because its quote runs a block late — described in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/). See [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).

## What did not change at all

This is the section that matters most, and it is the shortest.

| Your concern | v3 | v4 |
| :--- | :--- | :--- |
| The range maths | The shifted curve between your two bounds | Identical |
| Divergence | Full, amplified by how narrow your band is | Identical |
| Out of range | You convert and stop earning | Identical |
| How fees accrue | Per price step | Identical |
| Being picked off | Arbitrage against a stale quote | Identical, unless a hook prices it |

A band of plus or minus 5% behaves the same way on both. The reasons to prefer one are gas, where the volume goes, and whether a hook improves the fee side. The reasons to be careful about a specific v4 pool are entirely about its hook.

If the range mechanics are new, start with [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/) and [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

## What people get wrong about v4

| What people assume | What actually happens |
| :--- | :--- |
| v4 reduces impermanent loss | It does not. The gap between a pool position and holding is identical |
| A v4 pool is a drop-in replacement | The hook is part of the pool's identity. Two pools on the same pair are different markets |
| Cheaper architecture means better returns | Architecture does not pay fees. Volume does |
| The audit covers the pool I am using | It covers the core. Your pool's hook is somebody else's code |

## Checking a v4 pool before you supply

1. **Resolve the hook address** from the pool key, and check whether it is verified and audited.
2. **Decode its permissions** from that address. Specifically, can it act when liquidity is removed?
3. **Check for a proxy.** A hook that can be replaced means the rules can change after you deposit.
4. **Read the fee logic.** If the fee moves, understand what sets it and how far it can go.
5. **Compare routed volume with the equivalent v3 pool.** Architecture does not pay fees.
6. **Simulate the whole lifecycle** on [Tenderly](https://tenderly.co) or a fork: mint, swap through your range, collect, withdraw. Confirm the exit returns what you expect with the hook in place.
7. **Run the ordinary checks too**, from [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/).

## A migration decision, worked

You hold \$50,000 in a v3 ETH and USDC band earning about \$18 a day. The equivalent v4 pool, with no hook, pays about \$21 a day for the same band because routers now send it more volume.

| | Value |
| :--- | ---: |
| Extra income from moving | about \$3 a day |
| Cost of moving, two transactions and a small swap | about \$60 on a quiet day |
| Time to repay the move | about three weeks |

That is a reasonable trade, as long as the extra volume is steady rather than a one-week spike. Now suppose the v4 pool has a hook that can change its fee. Add the time it takes to read and verify that hook, and demand a longer track record before you believe the higher number.

## Whether to migrate

Migration is a real trade with real costs. Two gas payments, locking in your current composition, and impact if the ratio has to be adjusted. Compare that against the extra fee income you expect, and demand a payback period you would actually accept.

One operational note for anyone running many positions. In v3 every pool is its own address, so tooling tracks a set of contracts. In v4 there is one address and pools are identified by key, which simplifies indexing but means your monitoring has to resolve the hook for each pool rather than assuming pools on the same pair behave alike.

Treat the hook as part of the pool's identity in every record you keep.

A sensible default: migrate when the destination's volume per unit of liquidity clearly beats the source, and the hook is either absent or immutable and audited. Otherwise let the market decide where the flow settles and follow it with new money rather than churning what you have.

The architecture is better. That is a statement about execution cost and what is now possible, not a promise about returns, which are still decided by volume, volatility, who else is in your band, and the discipline of whoever chose it.

## Where to go next

The exposure both versions share is impermanent loss — the gap between a pool position and simply holding — derived in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/), and the fee decision in [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/). For the earlier comparison that still matters to most people, see [Uniswap v2 vs v3](/guides/uniswap-v2-vs-v3/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [EIP-1153: Transient Storage Opcodes (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-1153)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
5. [ERC-6909: Minimal Multi-Token Interface (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-6909)
6. [Hooks (Uniswap v4 Documentation)](https://docs.uniswap.org/contracts/v4/concepts/hooks)
7. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://eips.ethereum.org/EIPS/eip-1153 "EIP-1153: Transient Storage Opcodes"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[5]: https://eips.ethereum.org/EIPS/eip-6909 "ERC-6909: Minimal Multi-Token Interface (Ethereum Improvement Proposals)"
[6]: https://docs.uniswap.org/contracts/v4/concepts/hooks "Hooks (Uniswap v4 Documentation)"
[7]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
