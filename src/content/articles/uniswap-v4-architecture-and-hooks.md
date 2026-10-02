---
title: "Uniswap v4 Architecture: Singleton Design, Hooks, and Flash Accounting"
seoTitle: "Uniswap v4 Architecture: Singleton, Hooks & Flash Accounting"
description: "What changed in Uniswap v4 and what it means for you: one contract for every pool, settle-once accounting, custom pool code, and how to read a hook."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "Uniswap v4 architecture"
keywords: "Uniswap v4 architecture, Uniswap v4 hooks, PoolManager.sol, transient storage EIP-1153, flash accounting, ERC-6909, dynamic fee hook, Uniswap v4 hooks liquidity pools, Uniswap v4 singleton, Uniswap v4 flash accounting"
featured: true
faq:
  - q: "What are Uniswap v4 hooks?"
    a: "Contracts attached to a pool at creation that run at defined points in the pool lifecycle, such as before and after a swap or a liquidity change. They can implement dynamic fees, custom curves, onchain orders and fee routing."
  - q: "Are hooks dangerous for liquidity providers?"
    a: "They are arbitrary code with permissions over the pool's lifecycle, so a pool inherits the trust assumptions of its hook. Check whether the hook is verified, audited, immutable, and what it may do on liquidity removal."
  - q: "What is flash accounting?"
    a: "Settlement that records each party's net balance changes in transient storage during a transaction and transfers only the net amounts at the end, rather than moving tokens at each hop. If any balance is left unsettled when the transaction ends, the whole transaction reverts. It reduces gas on multi-hop and multi-pool operations."
  - q: "Do Uniswap v4 positions still use NFTs?"
    a: "Yes. Positions are minted as ERC-721 NFTs by the v4 position manager. ERC-6909 inside the PoolManager tracks claims on token balances left in the contract; it does not replace the NFT that represents your range."
---

Uniswap v3 gave every trading pair its own contract. Swap through three pools and your tokens were physically moved three times, and you paid for each move.

Uniswap v4 collapses all of that into one contract. Tokens stop shuffling between pools, and a pool can now run code that somebody wrote specially for it.

The first change lowers your costs. The second gives you a new job: judging whether the code attached to a pool is safe to stand behind. By the end you will know what changed, why it is cheaper, and what to check before you deposit.

<figure class="article-figure">
  <img src="/images/guides/uniswap-v4-architecture-and-hooks.webp" alt="Six cards describing the single contract, settle-once accounting, hook address permissions, swap and liquidity callbacks, and returns-delta flags." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What changed in Uniswap v4, and the hook permissions a depositor should read before trusting a pool. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Hooks put custom code at the exact moments money moves in and out of a pool. Well written, that code can price risk better than a fixed fee. Badly written or upgradeable, it can block withdrawals or redirect value. Before you deposit, read what the pool's hook is allowed to do and whether somebody can change it later.

## One contract instead of thousands

In earlier versions, creating a pool meant deploying a whole new contract. That was expensive on its own, and it made every trade that touched more than one pool more expensive too [1].

| | v3, one contract per pool | v4, one contract for all |
| :--- | :--- | :--- |
| Creating a pool | Deploy a new contract | Update the shared contract's state, about 99% cheaper [1] |
| A three-hop trade | Three contracts, tokens transferred at each hop | One contract, net amounts settled at the end |
| Native ETH | Must be wrapped as WETH first | Supported directly [1] |
| Where your tokens sit | In each individual pool | In the one contract, tracked per pool |

That single contract is called the PoolManager, and the design is a singleton — one contract holding every pool rather than one per pair [1]. Cheap pool creation matters more than it sounds: it makes long-tail pairs and experimental fee settings economically possible.

The pricing inside an ordinary v4 pool is unchanged from v3. It is still concentrated liquidity on ticks, so the [Uniswap v3 liquidity calculator](/tools/uniswap-v3-liquidity-calculator/) models a v4 position directly, and the underlying rule is covered in [Constant Product Formula](/guides/constant-product-formula/).

## Why settling once makes everything cheaper

The second change is how the contract keeps score during a transaction.

Writing to permanent storage is one of the most expensive things a contract does. Ethereum's Cancun upgrade added transient storage — a cheap scratchpad that is wiped at the end of each transaction — and v4 keeps its running tally there [1] [3].

The pattern is called flash accounting — record what each party owes as a running balance, then move real tokens only once, at the end.

| Step | What happens |
| :--- | :--- |
| You open a session | The contract unlocks and calls back into your code |
| You do whatever you need | Several swaps, mint a position, collect fees, all recorded as running balances |
| You settle up | You pay in what you owe and take out what you are owed |
| The session closes | The contract checks every balance nets to zero, or the whole transaction reverts |

That last line is the safety net. If a single unit is unaccounted for, nothing happens at all [1] [4].

In code, the session looks like this:

```solidity
function unlock(bytes calldata data)
    external
    returns (bytes memory result)
{
    if (Lock.isUnlocked()) revert AlreadyUnlocked();
    Lock.unlock();

    // the caller does everything here, including paying what it owes
    result = IUnlockCallback(msg.sender).unlockCallback(data);

    if (NonzeroDeltaCount.read() != 0) revert CurrencyNotSettled();
    Lock.lock();
}
```

This is a lightly simplified copy of the deployed function [4]. Open the session, let the caller's code run, and refuse to close unless every balance nets to zero.

The practical effect is that multi-step work in one transaction got cheaper. Removing a range, collecting fees and adding a new range no longer transfer tokens in and out between steps; only the net difference moves. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## What a hook can do, and when

A hook is a separate contract attached to a pool when the pool is created. The PoolManager calls it at set moments, and the hook can change what happens. A pool can also have no hook at all, in which case it behaves like a plain concentrated-liquidity pool [2].

There are ten of these moments, in five before-and-after pairs [2]:

- **When a pool is created.** The hook can set up a fee rule, or restrict which pools may use it.
- **When liquidity goes in.** It can check who is depositing, take a management fee, or track positions for rewards.
- **When liquidity comes out.** It can charge an exit fee or require a minimum holding time. That blunts just-in-time liquidity — a position minted right before a large swap and removed right after to collect most of its fee. JIT is rare on v3, but it dilutes ordinary LPs when it happens [5].
- **Around every swap.** This is the important pair. Before a swap it can set the fee from current volatility, or replace the pricing rule entirely. After a swap it can fill a resting order or update a custom price record [1].
- **Around donations.** A donation pays tokens straight to the liquidity active at the current price without moving the price, which lets a protocol route rewards to in-range LPs [1].

The whitepaper's own list of intended uses includes orders executed over time, on-chain limit orders, volatility-based dynamic fees and ways to return MEV — value captured by whoever controls transaction order — to LPs [1].

## How you can tell what a hook is allowed to do

This is the single most useful thing to know as a depositor.

A hook cannot simply declare which callbacks it uses. Its permissions are encoded in the lowest 14 bits of its own contract address [2] [6]. Developers search for a deployment salt that produces an address whose final bits match exactly the permissions they want.

So the address is the permission list. If a pool's hook address does not carry the bit for a callback, the PoolManager never calls that callback.

| Permission | What it lets the hook do |
| :--- | :--- |
| Before or after initialize | Configure or restrict the pool at creation |
| Before or after add liquidity | Gate deposits, charge a fee, move reserves |
| Before or after remove liquidity | Enforce a holding period, charge an exit fee |
| Before or after swap | Set fees, replace pricing, capture value |
| Before or after donate | Act on rewards paid to live liquidity |
| The four "returns delta" flags | Change the actual amounts settled, not just the parameters |

Those last four need the most attention. A hook with a returns-delta flag can alter the money that changes hands, not just the rules around it [6]. Treat one as a much higher trust requirement than a hook without.

## Where your position and balances live

Your liquidity position itself is an NFT under the ERC-721 standard, issued by Uniswap's v4 position manager, much as in v3 [7].

What v4 adds is a way to keep token balances inside the PoolManager, recorded under ERC-6909 — a lightweight standard for many token balances in one contract [8]. Instead of withdrawing real tokens, you can leave them in the PoolManager and receive a claim. You then burn that claim to pay on your next action, without any external transfer [9].

For anyone trading or rebalancing frequently, those saved transfers add up. The trade-off is that the claim exists only inside that one contract, so it carries that contract's risk. ERC-6909 here tracks token balances; it does not replace the NFT that represents your range. See [Liquidity Pool Tokens](/guides/liquidity-pool-tokens/).

## What people get wrong about hooks

| What people assume | What actually happens |
| :--- | :--- |
| A verified contract is a safe one | Verified means you can read it, not that it is harmless. A hook can block your withdrawal or take your fees |
| Hooks stop bots taking value | They can blunt specific tactics. They cannot change who decides the order of transactions in a block |
| A fee that adapts always helps me | Set too high, routers send the volume elsewhere and you earn less than a fixed fee would |

The first row is not hypothetical. One study counted at least \$3.24 billion lost by DeFi users, LPs and operators to attacks and accidents between April 2018 and April 2022 [10].

## What to check before you deposit

1. **Decode the hook address.** Its low bits tell you exactly which permissions the hook holds, with no trust required.
2. **Look for the returns-delta flags.** A hook that can change settled amounts needs far more scrutiny than one that cannot.
3. **Find out if it can be replaced.** Immutable, or behind an upgradeable proxy? If upgradeable, is there a delay before a change takes effect?
4. **Check how it treats short-lived positions.** Does it require a minimum holding time, or charge on a fast exit?
5. **Check the fee rule against the bleed.** If the fee adapts, does it rise enough to cover loss-versus-rebalancing (LVR) — how far the position trails a strategy that rebalances the same holdings at market prices [11]? For a full-range position, LVR is roughly the yearly variance divided by eight. A pair with 80% annual volatility costs about 8% of the position a year, and a narrow band several times that, so low fees on thin volume will not cover it.
6. **Check what the hook adds to swap gas.** Traders pay it, and routers steer volume away from pools that cost more to trade through, which reaches your fee income.

## Where to watch the numbers

- **Replaying a transaction through a hook:** [Tenderly](https://tenderly.co) shows exactly where it reverted.
- **Testing a hook's behaviour on a fork:** [Foundry](https://getfoundry.sh).
- **Live pools and their hook settings:** the official Uniswap v4 interface and developer tooling.

## When something goes wrong

- **Your swap reverts inside the hook.** The hook's own code stopped it. Replay the transaction to see the reason, and check whether the hook has paused the pool.
- **You get a currency-not-settled error.** Something in your transaction did not balance. Confirm the exact amount owed is paid in, or settled from an ERC-6909 claim.
- **Your hook fails the permission check at creation.** The deployed address does not carry the bits for the callbacks it declares. Mine a new deployment salt until it does [2].

## Where to go next

If you are deciding whether to move a position, [Uniswap v3 vs v4](/guides/uniswap-v3-vs-v4/) covers the migration trade-offs. To judge whether an adaptive-fee hook is pricing risk sensibly, read [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/) and then [Dynamic Fees in AMMs](/guides/dynamic-fees-in-amms/).

## References

1. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
2. [Uniswap v4 Hooks (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/hooks)
3. [EIP-1153: Transient storage opcodes](https://eips.ethereum.org/EIPS/eip-1153)
4. [PoolManager.sol (Uniswap v4-core source code)](https://github.com/Uniswap/v4-core/blob/main/src/PoolManager.sol)
5. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
6. [Hooks.sol (Uniswap v4-core source code)](https://github.com/Uniswap/v4-core/blob/main/src/libraries/Hooks.sol)
7. [PositionManager.sol (Uniswap v4-periphery source code)](https://github.com/Uniswap/v4-periphery/blob/main/src/PositionManager.sol)
8. [ERC-6909: Minimal Multi-Token Interface](https://eips.ethereum.org/EIPS/eip-6909)
9. [ERC-6909 in Uniswap v4 (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/erc-6909)
10. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
11. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)

[1]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper (Adams et al., 2024)"
[2]: https://developers.uniswap.org/docs/protocols/v4/concepts/hooks "Uniswap v4 Hooks (Uniswap Developer Documentation)"
[3]: https://eips.ethereum.org/EIPS/eip-1153 "EIP-1153: Transient storage opcodes"
[4]: https://github.com/Uniswap/v4-core/blob/main/src/PoolManager.sol "PoolManager.sol (Uniswap v4-core source code)"
[5]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[6]: https://github.com/Uniswap/v4-core/blob/main/src/libraries/Hooks.sol "Hooks.sol (Uniswap v4-core source code)"
[7]: https://github.com/Uniswap/v4-periphery/blob/main/src/PositionManager.sol "PositionManager.sol (Uniswap v4-periphery source code)"
[8]: https://eips.ethereum.org/EIPS/eip-6909 "ERC-6909: Minimal Multi-Token Interface"
[9]: https://developers.uniswap.org/docs/protocols/v4/concepts/erc-6909 "ERC-6909 in Uniswap v4 (Uniswap Developer Documentation)"
[10]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[11]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
