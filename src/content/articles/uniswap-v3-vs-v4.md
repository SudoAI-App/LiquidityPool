---
title: "Uniswap v3 vs v4 Liquidity: What Actually Changed for LPs"
description: "Side-by-side for LPs: same range math in both versions, cheaper settlement in v4, and a migration decision that depends on depth, gas, and hook risk."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "Uniswap v3 vs v4"
keywords: "Uniswap v3 vs v4, Uniswap v4 liquidity pool, Uniswap v3 liquidity pool, migrate liquidity v3 to v4, Uniswap v4 dynamic fees, v4 gas costs for LPs"
featured: true
faq:
  - q: "What is the main difference between Uniswap v3 and v4?"
    a: "v3 deploys one contract per pool; v4 holds every pool inside a single PoolManager contract and settles net balances at the end of a transaction using transient storage. v4 also lets each pool attach a hook contract that can run custom logic around swaps and liquidity changes, including setting a dynamic fee, and it drops v3's fixed fee tiers."
  - q: "Does Uniswap v4 change impermanent loss?"
    a: "No. Both versions use the same concentrated-liquidity range math, so a position with the same bounds carries the same divergence exposure. What v4 changes is the cost of interacting with the pool and the ability to price volatility through a dynamic fee, which affects net outcomes rather than the underlying exposure."
  - q: "Are Uniswap v4 pools riskier than v3 pools?"
    a: "They add one specific surface: the hook. A hook is code with permissions over swap and liquidity callbacks, so a v4 pool inherits the trust assumptions of its hook. A pool with no hook, or an immutable and audited hook, is comparable to v3; a pool whose hook is upgradeable and holds broad permissions is not."
  - q: "Should an LP migrate positions from v3 to v4?"
    a: "Only where the destination pool has the depth and routed volume to pay for the migration. Moving costs gas twice and locks in the current composition. Compare fee income net of each pool's protocol fee, and remember that liquidity depth on the specific pair, not the architecture, decides what you earn."
---

Your exposure is the same on both versions. A band of plus or minus 5% on ETH against dollars behaves identically on Uniswap v3 and v4.

What changed is where the pool's state lives, how tokens move during a transaction, and who is allowed to run code when a swap arrives.

The first two make trading and managing positions cheaper. The third is the part you need to inspect. By the end you should be able to judge a specific v4 pool and decide whether moving a v3 position there is worth the cost.

<figure class="article-figure">
  <img src="/images/guides/uniswap-v3-vs-v4.webp" alt="Row-by-row comparison of Uniswap v3 and v4 across deployment, settlement, fees, extensibility, accounting and LP risk." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What changed between v3 and v4, and the one row that did not change at all. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Read the hook before the yield. In v4 the hook is part of the pool's identity, so two pools on the same pair with different hooks are different markets with different code paths and trust assumptions. Before you migrate, identify every callback the hook can run.

## One contract instead of thousands

In v3, every pool is a separate contract, identified by its pair and fee tier [1]. Each one holds its own tokens, so a route through three pools moves tokens three times.

In v4, one contract, the PoolManager, holds every pool as internal state. A pool is identified by its two tokens, its fee, its tick spacing and its hook address [8]. Creating a pool becomes an entry in that contract rather than a new deployment, which makes launching a market much cheaper [8].

v4 also drops v3's fixed fee tiers. A pool can set any fee from 0% to 100%, or let its hook set the fee dynamically [10].

The routing effect is direct. A three-hop swap in v3 moves tokens at every step. The same route in v4 updates internal balances and moves tokens once, at the end [8].

## Why settling once is so much cheaper

Ethereum added a kind of storage that lasts only for one transaction and then clears itself [3]. v4 keeps its running tally there.

During a transaction the PoolManager records what each side owes. Before the transaction finishes, every one of those debts must be settled, or the whole thing reverts [2].

| What that buys | Why it matters |
| :--- | :--- |
| Lower gas on multi-hop and multi-pool operations | Intermediate token transfers disappear [8] |
| Composability | One contract can rebalance across several pools in one transaction, settling once |
| Internal balances | Frequent traders can hold token claims inside the PoolManager instead of moving tokens back and forth [5] |

Those internal claims use ERC-6909 — a lightweight standard for holding many token balances in one contract [5]. Your liquidity position is still an NFT, minted by the position manager, just as v3 positions were [13].

None of that changes the price a swap gets. The pricing rule and tick math are inherited from v3 [2].

## Hooks: the change that affects you

A hook is a contract attached to a pool when it is created. It can run at defined moments: when the pool is initialised, around each swap, around liquidity going in or out, and around donations [6]. Its permissions are encoded in its own address, so you can read what it is allowed to do without trusting anybody's description [6]. Once the pool exists, its hook cannot be added, removed or swapped [6].

| What hooks make possible | What hooks also introduce |
| :--- | :--- |
| Fees that rise with volatility, charging arbitrage more when it takes most [9] | Code sitting in the swap path |
| Custom pricing rules that used to need a separate protocol | Conditions on withdrawal that did not exist in v3 |
| Limit orders and automatic range management inside the pool | Upgradeability, if the hook's logic sits behind a proxy with an admin key |
| Fee routing to a treasury, insurance fund or reward programme | Behaviour under stress that may not have been tested at scale |

The first row on the left matters most to anyone supplying liquidity. A dynamic fee gives the pool a way to charge for loss-versus-rebalancing — the value arbitrageurs extract because the pool's price lags the wider market [12] [9]. See [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/) and [Uniswap v4 Architecture and Hooks](/guides/uniswap-v4-architecture-and-hooks/).

## What did not change at all

| Your concern | v3 | v4 |
| :--- | :--- | :--- |
| The range maths | The shifted curve between your two bounds | Identical |
| Divergence | Full, amplified by how narrow your band is | Identical |
| Out of range | You convert and stop earning | Identical |
| How fees accrue | Pro rata to liquidity in range at each swap | Identical |
| Being picked off | Arbitrage against a stale quote | Identical, unless a hook prices it |

A band of plus or minus 5% behaves the same way on both. The reasons to prefer one are gas, where the volume goes, and whether a hook improves the fee side. The reasons to be careful about a specific v4 pool are mostly about its hook. Because the range maths is inherited, the [Uniswap v3 liquidity calculator](/tools/uniswap-v3-liquidity-calculator/) prices a v4 band exactly as it prices a v3 one.

If the range mechanics are new, start with [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/) and [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

## The protocol fee is different on each side

One thing that does differ is how much of the swap fee reaches you. Uniswap governance switched on protocol fees in December 2025 [10]. On v3, LPs now keep three-quarters of the fee in the 0.01% and 0.05% tiers and five-sixths in the 0.30% and 1% tiers [10].

On v4, protocol fees began in July 2026 on a subset of pools: those without hooks, pools launched through Uniswap's auction hook, and aggregator hook pools [11]. For hookless pools, the protocol's share follows a curve set by governance rather than a fixed fraction [11]. Pools with other hooks were left out of that vote [11].

So when you compare two pools, compare fee income net of the protocol fee on each. Governance can change these settings, so check the current values before you decide [10].

## Checking a v4 pool before you supply

1. **Resolve the hook address** from the pool key, and check whether it is verified and audited.
2. **Decode its permissions** from that address. Specifically, can it act when liquidity is removed [6]?
3. **Check for a proxy.** If the hook's logic can be replaced, the rules can change after you deposit.
4. **Read the fee logic.** If the fee moves, understand what sets it and how far it can go [9].
5. **Compare routed volume with the equivalent v3 pool.** Architecture does not pay fees; volume does.
6. **Simulate the whole lifecycle** on [Tenderly](https://tenderly.co) or a fork: mint, swap through your range, collect, withdraw. Confirm the exit returns what you expect with the hook in place.
7. **Run the ordinary checks too**, from [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/). Contract risk and out-of-range risk apply to every version [4].

## A migration decision, worked

You hold \$50,000 in a v3 ETH and USDC band earning about \$18 a day after the protocol fee. The equivalent v4 pool, with no hook, pays about \$21 a day after its protocol fee for the same band, because routers now send it more volume.

| | Value |
| :--- | ---: |
| Extra income from moving | about \$3 a day |
| Cost of moving: two transactions and a small swap | about \$60 on a quiet day |
| Time to repay the move | about 20 days |

That is a reasonable trade if the extra volume is steady rather than a one-week spike. Now suppose the v4 pool has a hook that can change its fee. Add the time it takes to read and verify that hook, and ask for a longer track record before you trust the higher number.

## Whether to migrate

Migration has real costs: two gas payments, locking in your current composition, and price impact (the cost of your own swap moving the price) if the ratio has to be adjusted. Compare that against the extra fee income you expect, and set a payback period you would actually accept.

One operational note for anyone running many positions. In v3 every pool is its own address, so tooling tracks a set of contracts. In v4 there is one address and pools are identified by key. That simplifies indexing, but your monitoring has to resolve the hook for each pool rather than assuming pools on the same pair behave alike.

A sensible default: migrate when the destination's volume per unit of liquidity clearly beats the source, and the hook is either absent or immutable and audited. Otherwise let the market decide where the flow settles, and follow it with new money rather than churning what you have.

The architecture is cheaper to use, and it allows things v3 could not do. Returns are still decided by volume, volatility, who else is in your band, and how actively the position is managed [7].

## Where to go next

The exposure both versions share, impermanent loss (how far a range position falls behind holding the same tokens), is derived in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/), and the fee decision is in [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/). For how all three generations sit side by side, including v2, read [Uniswap Liquidity Pools](/guides/uniswap-liquidity-pools/) and the earlier comparison in [Uniswap v2 vs v3](/guides/uniswap-v2-vs-v3/).

## References

1. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [EIP-1153: Transient storage opcodes (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-1153)
4. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
5. [ERC-6909: Minimal Multi-Token Interface (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-6909)
6. [Uniswap v4 Hooks (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/hooks)
7. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
8. [PoolManager (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/poolmanager)
9. [Dynamic Fees (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/dynamic-fees)
10. [Fees (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/fees)
11. [Activate v4 Protocol Fees, Part 1/2 (Uniswap Governance Proposal 100, 2026)](https://vote.uniswapfoundation.org/proposals/100)
12. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
13. [Position Manager (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/guides/position-manager)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core (Adams et al., 2021)"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core (Adams et al., 2024)"
[3]: https://eips.ethereum.org/EIPS/eip-1153 "EIP-1153: Transient storage opcodes (Ethereum Improvement Proposals)"
[4]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity? (Uniswap Labs)"
[5]: https://eips.ethereum.org/EIPS/eip-6909 "ERC-6909: Minimal Multi-Token Interface (Ethereum Improvement Proposals)"
[6]: https://developers.uniswap.org/docs/protocols/v4/concepts/hooks "Uniswap v4 Hooks (Uniswap Developer Documentation)"
[7]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[8]: https://developers.uniswap.org/docs/protocols/v4/concepts/poolmanager "PoolManager (Uniswap Developer Documentation)"
[9]: https://developers.uniswap.org/docs/protocols/v4/concepts/dynamic-fees "Dynamic Fees (Uniswap Developer Documentation)"
[10]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees (Uniswap Developer Documentation)"
[11]: https://vote.uniswapfoundation.org/proposals/100 "Activate v4 Protocol Fees, Part 1/2 (Uniswap Governance Proposal 100, 2026)"
[12]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[13]: https://developers.uniswap.org/docs/protocols/v4/guides/position-manager "Position Manager (Uniswap Developer Documentation)"
