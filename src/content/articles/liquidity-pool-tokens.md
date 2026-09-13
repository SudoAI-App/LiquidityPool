---
title: "Liquidity Pool Tokens Explained: What an LP Position Represents"
description: "What you actually get back for a deposit: how pool shares, position NFTs, singleton claims and vault wrappers each track your money, and where each one bites."
category: "Foundations"
date: 2026-09-05
lastReviewed: "2026-09-12"
author: "Dr. Kieran Thorne"
readTime: "8 min read"
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

Put money into a pool and you do not get a receipt for what you put in. You get a claim on a share of what the pool holds, whenever you decide to leave.

Those are very different things. Your deposit was two specific token amounts. Your claim is a slice of whatever the pool has ended up with, which will not be the same mix and may not be the same value.

This guide covers the main ways pools track that claim, how fees reach you under each one, and what to check before you deposit, stake, or unwind a position.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-tokens.webp" alt="A pool-share token is linked to a two-sided reserve vault." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A pool token is a claim on a share of whatever the pool holds when you leave, not a receipt for what you put in. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"Each generation of pool share traded one thing for another. The old fungible share slotted into lending markets easily but could not express a price range. The position NFT could express a range but broke every money market that tried to price it. The newest claims live inside the pool contract itself, which is cheap and fast, and which most wallets still cannot see."*

## Your claim changes value while you hold it

A bank deposit entitles you to a fixed amount back, plus interest. A pool share does not work like that. Its value moves for three reasons [1].

- **Fees accumulate.** Every trade pays a fee. Depending on the design, it either grows the pool or sits in a separate tally with your name on it.
- **The pool trades on your behalf.** When prices move elsewhere, arbitrage traders — people who profit from the gap between one venue's price and another's — reshuffle what the pool holds. Your share follows.
- **In range-based pools, earning is all or nothing.** You collect fees only while the price sits inside the band you chose [2] [3].

Which standard your claim uses decides how those three play out, and how easily you can do anything else with it.

| Standard | Used by | How fees reach you | The awkward part |
| :--- | :--- | :--- | :--- |
| Fungible share (ERC-20) | Uniswap v2, Curve | Added straight into the pool, so your share grows | No way to pick a price range |
| Position NFT (ERC-721) | Uniswap v3 | Held in a separate tally until you claim | Lending markets cannot easily price it |
| Position NFT, recorded inside one shared contract | Uniswap v4 | Credited to the position when you change or collect it | Its tokens live in the shared contract, so reading it needs the protocol's tools |
| Vault share (ERC-20) | Arrakis, Gamma, others | Whatever the vault's strategy produces | You inherit the strategy's mistakes |

## The simple case: a fungible share of everything

The original design is the easiest to reason about. Deposit both tokens in the ratio the pool holds them, and the contract mints you shares in proportion [1].

$$
\frac{\Delta S}{S} = \frac{\Delta x}{x} = \frac{\Delta y}{y}
$$

Where:

- $\Delta S$ is how many new shares you are issued.
- $S$ is how many shares already exist.
- $\Delta x$ and $\Delta y$ are what you deposit.
- $x$ and $y$ are what the pool already holds.

In plain terms, you get exactly the fraction of the pool that you funded. Nothing clever happens.

Fees make this design pleasant. They are not paid out separately; they are simply left in the pool. The pool gets bigger, the number of shares does not, so each share quietly becomes worth more. There is nothing to claim and nothing to compound by hand.

When you leave, the contract destroys your shares and hands back that same fraction of whatever the pool currently holds. If prices moved while you were in, you get back more of the loser and less of the winner [1]. The reason is in [Constant Product Formula](/guides/constant-product-formula/).

## The range case: every position is its own thing

Uniswap v3 let you choose a price band [3]. That immediately broke fungibility. Your band, your size and your fee tier are all different from everyone else's, so your position cannot be interchangeable with theirs.

So the protocol mints you an NFT instead. A single, numbered position with its own terms:

| Field | Example |
| :--- | :--- |
| Pool | ETH / USDC at the 0.05% tier |
| Lower bound | \$1,980 per ETH |
| Upper bound | \$2,420 per ETH |
| Earns fees | Only while the price sits between those two numbers |
| Holdings below the band | All ETH |
| Holdings above the band | All USDC |

Three things behave differently here, and all three surprise people.

- **Fees do not compound.** They sit in a separate tally attached to the NFT, earning nothing and providing no depth, until you send a transaction to collect them [3].
- **Earning stops dead.** The moment the price leaves your band, fees stop. Your money sits there holding all of the losing token [3].
- **It does not travel well.** Lending protocols cannot easily value a position NFT, so using one as collateral needs a wrapper contract built for the purpose [3] [5].

Range selection is covered in [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## The newest case: a claim inside the pool itself

Uniswap v4 puts every pool inside one contract, a design called a singleton — one contract holding all the pools instead of one per pair [2]. That contract records each position by its owner, its two bounds and an extra identifier.

Most people never touch that record directly. They deposit through Uniswap's position manager, which hands back an NFT, much like v3.

What changed is how tokens move around. The singleton lets anyone keep token balances inside it instead of withdrawing them every time. Those balances are recorded under a light multi-token standard known as ERC-6909 [7]:

```solidity
interface IERC6909 {
    function balanceOf(address owner, uint256 id)
        external view returns (uint256);

    function transfer(address receiver, uint256 id, uint256 amount)
        external returns (bool);
}
```

That buys three things [2]:

- **Much less gas.** No external token contract to call, so managing a position costs a fraction of what it did.
- **Settling once at the end.** During a complex trade or rebalance, balances move on an internal ledger and only the net result is paid out. This is flash accounting — keeping the tally in scratch memory rather than transferring at every step.
- **Room for custom claims.** A hook can issue its own claim types, for example to split a pool into senior and junior slices.

The trade-off is visibility. Balances held inside the contract this way are not ordinary tokens, so most wallets will not show them. You check them through the protocol's own interface.

## The wrapped case: someone manages the range for you

Moving a range by hand is expensive and needs attention, so vaults appeared to do it. Arrakis, Gamma, DefiEdge and Steer all work roughly the same way [5].

You deposit both tokens. The vault decides where the range goes and moves it on its own rules. You get an ordinary ERC-20 share of the vault, which means your position is fungible and tradeable again.

Be clear about what you are holding. It is not a claim on pool reserves. It is a claim on a strategy that holds a claim on pool reserves. If the strategy rebalances badly during a strong trend, it locks in the worst prices of that move, and your share underperforms doing nothing at all [5].

## What people get wrong about pool shares

| What people assume | What actually happens |
| :--- | :--- |
| I get back what I put in | You get back a share of what the pool holds now, which means more of the token that fell |
| Fees on a v3 position compound | They sit in a separate tally doing nothing until you claim them and put them back |
| A vault share is a safer pool share | It adds the vault's strategy, its rebalancing costs and its management fee on top |
| Any pool share works as collateral | Most lending markets cannot price a position NFT without a purpose-built wrapper |

## What to check before you deposit or unwind

1. **Know which kind of claim you have.** A fungible share, a position NFT, or a vault share. They behave differently at every step [1] [2] [3].
2. **Find out where your fees are.** Already in the pool, waiting in a tally, or settled inside the contract [1] [2] [3].
3. **If you have a band, look at where the price is.** How close is it to either edge, and what will you do when it crosses [3]?
4. **If a vault runs it, read the strategy.** How often does it move, who can trigger it, what does it charge, and has the contract been audited [5]?
5. **Add up the round trip.** Approving, minting, collecting and burning all cost gas. Make sure the fees will cover that comfortably [2] [3].

For the full risk picture, see [Liquidity Pool Risks](/guides/liquidity-pool-risks/).

## Where to watch the numbers

- **Range positions and uncollected fees:** [Revert Finance](https://revert.finance).
- **Token transfers and balances of any standard:** [Etherscan](https://etherscan.io).
- **What actually moved inside a singleton transaction:** [Tenderly](https://tenderly.co).

## When something goes wrong

- **You sold a position NFT and lost the fees.** Uncollected fees belong to the NFT, so they went with it. Always collect before transferring or pledging one.
- **A lending protocol is liquidating your pool collateral.** The mix inside the position shifted and its value fell below the threshold. Repay or top up before the oracle acts.
- **Your wallet does not show what a v4 position is worth.** The NFT only identifies the position. Its tokens sit inside the shared contract, so check the value through the protocol's interface or a position tracker.

## Where to go next

What your claim is worth on the way out depends on impermanent loss — the gap between a pool position and simply holding the same tokens — worked out in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/). Staking that claim adds another layer, covered in [Yield Farming Explained](/guides/yield-farming-explained/). The position NFT gets its own treatment in [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/).

## References

1. [Uniswap v2 Core Whitepaper (Adams, 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v4 Core Whitepaper & Architecture (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
4. [Providing Liquidity in Pools (Curve Finance Documentation)](https://docs.curve.finance/user/yield/lp)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://doi.org/10.1145/3558535.3559772)
6. [EIP-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-721)
7. [ERC-6909: Minimal Multi-Token Interface (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-6909)
8. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper & Architecture"
[3]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[4]: https://docs.curve.finance/user/yield/lp "Providing Liquidity in Pools"
[5]: https://doi.org/10.1145/3558535.3559772 "Risks and Returns of Uniswap V3 Liquidity Providers"
[6]: https://eips.ethereum.org/EIPS/eip-721 "EIP-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)"
[7]: https://eips.ethereum.org/EIPS/eip-6909 "ERC-6909: Minimal Multi-Token Interface (Ethereum Improvement Proposals)"
[8]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
