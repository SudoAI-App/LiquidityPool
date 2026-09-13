---
title: "Uniswap v4 Architecture: Singleton Design, Hooks, and Flash Accounting"
description: "What changed in Uniswap v4 and what it means for you: one contract for every pool, settle-once accounting, custom pool code, and how to read a hook."
category: "LP Mechanics"
date: 2026-09-08
lastReviewed: "2026-09-12"
author: "Dr. Kieran Thorne"
readTime: "7 min read"
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

Uniswap v3 gave every trading pair its own contract. Swap through three pools and your tokens were physically moved three times, and you paid for each move.

Uniswap v4 collapses all of that into one contract. Tokens stop shuffling between pools, and a pool can now run code that somebody wrote specially for it.

Both changes are good for your costs. The second one hands you a new job: working out whether the code attached to a pool is safe to stand behind. This guide covers what changed, why it is cheaper, and exactly what to check before you deposit.

<figure class="article-figure">
  <img src="/images/guides/uniswap-v4-architecture-and-hooks.webp" alt="Six cards describing the single contract, settle-once accounting, hook address permissions, swap and liquidity callbacks, and returns-delta flags." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>What changed in Uniswap v4, and the hook permissions a depositor should read before trusting a pool. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"Hooks are the biggest security change in this corner of the market since reentrancy was first understood. Custom code runs at the exact moments money is moving. Badly written, it can freeze the pool or drain balances. Never deposit into a pool without reading what its hook is allowed to do, and whether somebody can change it later."*

## One contract instead of thousands

In the old design, creating a pool meant deploying a whole new contract. That was expensive on its own, and it made every trade that touched more than one pool expensive too [1] [2].

| | v3, one contract per pool | v4, one contract for all |
| :--- | :--- | :--- |
| Creating a pool | Deploy a contract, over 4,000,000 gas | Add an entry to a table, roughly 99% cheaper |
| A three-hop trade | Three contracts, three token transfers | One contract, one settlement at the end |
| Moving between fee tiers | Separate approvals, separate calls | Handled inside the same contract |
| Where your tokens sit | In each individual pool | In the one contract, tracked per pool |

That single contract is called a singleton — one contract holding every pool rather than one per pair [1]. Creating a pool now costs almost nothing, which matters more than it sounds: it makes long-tail pairs and experimental fee settings economically possible. The pricing rule inside is unchanged, and is covered in [Constant Product Formula](/guides/constant-product-formula/).

## Why settling once makes everything cheaper

The second change is how the contract keeps score during a transaction.

Writing to permanent storage is one of the most expensive things a contract does. Ethereum added a cheap scratchpad that lasts only as long as one transaction, and Uniswap v4 keeps its running tally there [1] [3].

The pattern is called flash accounting — tally everything in scratch memory, move real tokens once at the end.

| Step | What happens |
| :--- | :--- |
| You open a session | The contract hands you temporary rights to operate |
| You do whatever you need | Several swaps, mint a position, claim fees, all recorded as running balances |
| You settle up | You pay in what you owe and take out what you are owed |
| The session closes | The contract checks every balance nets to exactly zero, or the whole thing reverts |

That last line is the safety net. If a single unit is unaccounted for, nothing happens at all [1] [4].

In code, the session looks like this:

```solidity
function unlock(bytes calldata data) external returns (bytes memory) {
    if (Lock.isUnlocked()) revert AlreadyUnlocked();
    Lock.unlock();

    bytes memory result =
        IUnlockCallback(msg.sender).unlockCallback(data);

    if (NonzeroDeltaCount.read() != 0) revert CurrencyNotSettled();
    Lock.lock();
    return result;
}
```

This is a simplified version of the real function. The idea is exactly as described: open the session, let your code run, and refuse to close unless every balance nets to zero.

The practical effect is that complex work in one transaction stopped being expensive. Rebalancing a range, claiming fees, and re-minting used to be three costly steps. Now it is one. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## What a hook can do, and when

A hook is a contract attached to a pool when the pool is created. The main contract calls it at set moments, and the hook can change what happens [1] [2].

There are eight of these moments, in four pairs:

- **When a pool is created.** The hook can set up a fee rule, restrict who may use the pool, or check an authorisation.
- **When liquidity goes in.** It can check credentials, take a management fee, or lend idle reserves out.
- **When liquidity comes out.** It can require a minimum holding time, which kills the just-in-time fee-stealing trick, or charge an exit fee.
- **Around every swap.** This is the important pair. Before a swap it can set the fee from current volatility, or replace the pricing rule entirely. After a swap it can capture arbitrage profit, fill a resting order, or update an internal price record [1] [5].

There is a ninth and tenth around donations, which let a protocol push rewards straight to whoever is live at the current price without moving it.

## How you can tell what a hook is allowed to do

This part is unusually elegant, and it is the single most useful thing to know as a depositor.

A hook does not get to say which callbacks it uses. Its permissions are written into the last few bits of its own contract address [1]. Developers have to search for a deployment address whose final bits match exactly the permissions they want.

So the address is the permission list. If a hook tries to run code before a swap but its address does not carry that bit, the main contract rejects it on the spot.

| Permission | What it lets the hook do |
| :--- | :--- |
| Before or after initialize | Configure or restrict the pool at creation |
| Before or after add liquidity | Gate deposits, charge a fee, move reserves |
| Before or after remove liquidity | Enforce a holding period, charge an exit fee |
| Before or after swap | Set fees, replace pricing, capture value |
| Before or after donate | Push rewards to live liquidity |
| The four "returns delta" flags | Change the actual amounts settled, not just the parameters |

Those last four deserve attention. A hook with a returns-delta flag can alter the money that changes hands, not just the rules around it. Treat one as a much higher trust requirement than a hook without.

## Balances that never leave the contract

Your liquidity position itself is still normally an NFT, issued by Uniswap's position manager, much as in v3 [1] [2].

What v4 adds is a way to keep token balances inside the main contract, recorded under a light multi-token standard [6]. You can take proceeds as an internal credit rather than a real transfer, then spend that credit on your next action without any token moving at all.

For anyone trading or rebalancing frequently, this is the difference between viable and not. The trade-off is that the credit exists only inside that one contract. If you are holding size, settle it out to real tokens periodically. See [Liquidity Pool Tokens](/guides/liquidity-pool-tokens/).

## What people get wrong about hooks

| What people assume | What actually happens |
| :--- | :--- |
| A verified contract is a safe one | Verified means you can read it, not that it is harmless. A hook can block your withdrawal or take your fees |
| Hooks stop bots taking value | They can blunt the worst tricks. They cannot change who decides the order of transactions in a block |
| A fee that adapts always helps me | Set too high, routers send the volume elsewhere and you earn less than a fixed tier |
| An internal credit is just like a token | It exists only inside the one contract. It has no independent backing if that contract fails |

## What to check before you deposit

1. **Decode the hook address.** It tells you exactly which permissions the hook holds, with no trust required.
2. **Look for the returns-delta flags.** A hook that can change settled amounts needs far more scrutiny than one that cannot.
3. **Find out if it can be replaced.** Immutable, or behind an upgradeable proxy? If upgradeable, is there a delay before a change takes effect?
4. **Ask whether it protects against fee sniping.** Does it require a minimum holding time, or charge on a fast exit [5]?
5. **Check the fee rule covers the bleed.** If the fee adapts, does it rise enough to cover loss-versus-rebalancing — what arbitrage takes because the pool quotes a block late? On a pair moving 80% a year that is roughly 8% of a full-range position, and several times that for a band, so a 0.05% tier on thin volume will not clear it [7].
6. **Check what the hook adds to swap gas.** Traders pay it, and routers steer volume away from pools that cost more to trade through, which reaches your fee income.

## Where to watch the numbers

- **Replaying a transaction through a hook:** [Tenderly](https://tenderly.co) shows exactly where it went wrong.
- **Checking a hook's permissions and behaviour:** [Foundry](https://getfoundry.sh) for tests and static analysis.
- **Live pools and their hook settings:** the official Uniswap v4 interface and developer tooling.

## When something goes wrong

- **Your swap reverts inside the hook.** The hook's own code stopped it. Replay the transaction to see the reason, and check whether the pool has been paused.
- **You get a currency-not-settled error.** Something in your transaction did not balance. Confirm the exact amount owed is paid in, or settled as an internal credit.
- **Your hook fails the permission check at creation.** The deployed address does not carry the bits for the callbacks it declares. Re-mine the deployment salt until it does.

## Where to go next

For the migration decision rather than the architecture, see [Uniswap v3 vs v4](/guides/uniswap-v3-vs-v4/). For what an adaptive fee is trying to price, see [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/) and [Dynamic Fees in AMMs](/guides/dynamic-fees-in-amms/).

## References

1. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
2. [Uniswap v4 Developer Documentation: Hooks Architecture](https://docs.uniswap.org/contracts/v4/concepts/hooks)
3. [EIP-1153: Transient Storage Opcodes](https://eips.ethereum.org/EIPS/eip-1153)
4. [Uniswap v3 Core Technical Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
5. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
6. [EIP-6909: Minimal Multi-Token Interface](https://eips.ethereum.org/EIPS/eip-6909)
7. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
8. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)

[1]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper (Adams et al., 2024)"
[2]: https://docs.uniswap.org/contracts/v4/concepts/hooks "Uniswap v4 Developer Documentation: Hooks Architecture"
[3]: https://eips.ethereum.org/EIPS/eip-1153 "EIP-1153: Transient Storage Opcodes"
[4]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Technical Whitepaper"
[5]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[6]: https://eips.ethereum.org/EIPS/eip-6909 "EIP-6909: Minimal Multi-Token Interface"
[7]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[8]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
