---
title: "Liquidity Pool Tokens Explained: What an LP Position Represents"
seoTitle: "LP Tokens Explained: What a Liquidity Position Represents"
description: "What you get back for a deposit: how pool shares, position NFTs, in-contract balances and vault shares each track your money, and what to check first."
category: "Foundations"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "liquidity pool tokens"
keywords: "liquidity pool tokens, LP tokens explained, liquidity position NFT, DeFi LP token, ERC-6909, singleton accounting, what is an LP token, liquidity pool token, LP token risks, pool share crypto"
featured: false
faq:
  - q: "What is an LP token?"
    a: "A claim on a share of a pool. In full-range pools such as Uniswap v2 and Curve it is a fungible ERC-20 whose supply grows and shrinks as liquidity is added and removed. In range-based pools such as Uniswap v3 and v4, each position has its own price bounds, so it is issued as a distinct ERC-721 NFT instead."
  - q: "What are the risks of holding LP tokens?"
    a: "The claim inherits everything about the underlying pool, including divergence and contract risk, and adds any risk from wherever the token is staked. A wrapped or staked LP claim depends on that additional contract functioning correctly."
  - q: "What happens when I remove liquidity?"
    a: "The contract burns your claim and returns your share of the current reserves, in whatever ratio the pool holds them at that moment, plus any uncollected fees. The quantities returned will usually differ from what you deposited."
  - q: "Can I lose my LP token and still have a claim?"
    a: "The token is the claim. Without it you cannot withdraw through the standard interface. An NFT position works the same way: losing the token or its ID is losing the ability to exit, which is why custody and recovery paths matter before you deposit."
---

Put money into a pool and you do not get a receipt for what you put in. You get a claim on a share of what the pool holds, whenever you decide to leave.

Those are very different things. Your deposit was two specific token amounts. Your claim is a slice of whatever the pool has ended up with, which will not be the same mix and may not be the same value.

By the end you will know which kind of claim a pool gives you, where your fees sit under each one, and what to check before you deposit, stake, or unwind. If the pool mechanics underneath are still new, [Liquidity Pools for Beginners](/guides/liquidity-pools-for-beginners/) covers them from the ground up.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-tokens.webp" alt="A pool-share token is linked to a two-sided reserve vault." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>A pool token is a claim on a share of whatever the pool holds when you leave, not a receipt for what you put in. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Each generation of pool share traded one convenience for another. The fungible share plugs into wallets and lending markets easily but cannot express a price range. The position NFT can express a range but is hard for other protocols to value. Newer designs keep balances inside the pool contract itself, which is cheaper to use and harder for an ordinary wallet to display.

## Your claim changes value while you hold it

A bank deposit entitles you to a fixed amount back, plus interest. A pool share does not work like that. Its value moves for three reasons.

- **Fees accumulate.** Every trade pays a fee. Depending on the design, it either grows the pool or sits in a separate tally with your name on it [1] [3].
- **The pool trades on your behalf.** When prices move elsewhere, arbitrage traders — people who profit from the gap between one venue's price and another's — reshuffle what the pool holds. Your share follows [8].
- **In range-based pools, earning is all or nothing.** You collect fees only while the price sits inside the band you chose [3].

Which standard your claim uses decides how those three play out, and how easily you can do anything else with it.

| Standard | Used by | How fees reach you | The awkward part |
| :--- | :--- | :--- | :--- |
| Fungible share (ERC-20) | Uniswap v2, Curve | Added straight into the pool, so your share grows | No way to pick a price range |
| Position NFT (ERC-721) | Uniswap v3 | Held in a separate tally until you collect | Lending markets cannot easily price it |
| Position NFT, tokens held in one shared contract | Uniswap v4 | Paid out when you change or collect the position | Reading its value needs the protocol's tools |
| Vault share | Gamma and similar managers | Whatever the vault's strategy produces | You inherit the strategy's mistakes |

## The simple case: a fungible share of everything

The original design is the easiest to reason about. Deposit both tokens in the ratio the pool holds them, and the contract mints you shares in proportion [1]. Those shares follow ERC-20, the standard interface for interchangeable tokens, so any wallet can show and transfer them [9]. Curve's pool tokens work the same way [4].

$$
\frac{\Delta S}{S} = \frac{\Delta x}{x} = \frac{\Delta y}{y}
$$

Where:

- $\Delta S$ is how many new shares you are issued.
- $S$ is how many shares already exist.
- $\Delta x$ and $\Delta y$ are what you deposit.
- $x$ and $y$ are what the pool already holds.

In plain terms, you get exactly the fraction of the pool that you funded. Deposit 1% of each reserve and you receive shares equal to 1% of those already issued.

Fees make this design convenient. They are not paid out separately; they are left in the pool [3]. The pool gets bigger, the number of shares does not, so each share quietly becomes worth more. There is nothing to claim and nothing to compound by hand. On Uniswap v2, providers now keep 0.25 points of the 0.30% fee; since December 2025 the other 0.05 goes to the protocol [12].

When you leave, the contract destroys your shares and hands back that same fraction of whatever the pool currently holds [1]. If prices moved while you were in, you get back more of the token that fell and less of the one that rose [8]. The reason is in [Constant Product Formula](/guides/constant-product-formula/). What that exit is worth after fees, divergence and gas, measured against holding, is what the [LP profit and return calculator](/tools/lp-profit-calculator/) works out.

## The range case: every position is its own thing

Uniswap v3 let you choose a price band [3]. That broke fungibility. Your band, your size and your fee tier differ from everyone else's, so your position cannot be interchangeable with theirs.

So the pool contract stopped issuing ERC-20 shares, and Uniswap's periphery mints each position as an NFT under the ERC-721 standard, a numbered token with its own terms [3] [6]. A typical position looks like this.

| Field | Example |
| :--- | :--- |
| Pool | ETH / USDC at the 0.05% tier |
| Lower bound | \$1,980 per ETH |
| Upper bound | \$2,420 per ETH |
| Earns fees | Only while the price sits between those two numbers |
| Holdings below the band | All ETH |
| Holdings above the band | All USDC |

Three things behave differently here, and all three surprise people.

- **Fees do not compound.** They are stored separately in the tokens they were paid in, earning nothing and adding no depth, until you send a transaction to collect them [3].
- **Earning stops outside the band.** The moment the price leaves your range, fees stop. Your position then sits entirely in one token, the one that lost ground [3].
- **It does not travel well.** A lending market cannot value a position NFT the way it values a plain token. Using one as collateral needs a market built to price it, or a wrapper that turns it back into a fungible share [3].

Range selection is covered in [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## The newest case: a claim inside the pool itself

Uniswap v4 puts every pool inside one contract, a design called a singleton — one contract holding all the pools instead of one per pair [2]. That one contract keeps the record of every position in every pool.

Most people never touch that record directly. They deposit through Uniswap's position manager, which mints an ERC-721 NFT for the position, much like v3 [10]. Fees are paid out to you whenever you change the position or collect them [10].

What changed is how tokens move around. The singleton lets anyone keep token balances inside it instead of withdrawing them every time. Those balances are recorded under a light multi-token standard known as ERC-6909 — one contract tracking many token balances by ID [2] [7]. Its core functions are short.

```solidity
interface IERC6909 {
    function balanceOf(address owner, uint256 id)
        external view returns (uint256);

    function transfer(address receiver, uint256 id, uint256 amount)
        external returns (bool);
}
```

That design buys three things [2]:

- **Lower gas.** Moving an internal balance avoids calling each token's own contract, so frequent swaps and position changes cost less.
- **Settling once at the end.** During a multi-step trade or rebalance, balances move on an internal ledger and only the net result is paid out. This is flash accounting — keeping the running tally in temporary memory rather than transferring at every step.
- **Custom accounting.** A hook, an add-on contract attached to a pool, can change what is credited or debited. The v4 whitepaper gives withdrawal fees on liquidity positions as one example [2], so read a pool's hook before you deposit.

The trade-off is visibility. Balances held inside the contract this way are not ordinary tokens, so most wallets will not show them. You check them through the protocol's own interface.

## The wrapped case: someone manages the range for you

Moving a range by hand costs gas and needs attention. Research on Uniswap v3 found that the higher returns go to providers who accept more risk and manage positions actively [5]. Managed vaults exist to do that work for you.

Gamma, for example, runs automated rebalancing vaults on Uniswap v3, v4 and similar pools. You deposit both tokens, the vault decides where the range goes, and you receive the vault's own LP token [11]. Your position is fungible and transferable again.

Be clear about what you are holding. It is not a direct claim on pool reserves. It is a claim on a strategy that holds a claim on pool reserves. You pay the vault's fees and rebalancing costs on top of everything the pool itself does. If the strategy rebalances repeatedly during a strong trend, it can lock in losses at each step and finish behind simply holding the two tokens.

## What to check before you deposit or unwind

1. **Know which kind of claim you have.** A fungible share, a position NFT, or a vault share. They behave differently at every step.
2. **Find out where your fees are.** Already in the pool, waiting in a tally, or paid out when you touch the position [1] [3] [10].
3. **If you have a band, look at where the price is.** How close is it to either edge, and what will you do when it crosses?
4. **If a vault runs it, read the strategy.** How often does it move, who can trigger it, what does it charge, and has the contract been audited?
5. **If the pool has a hook, read what it does.** It can change fees or add a charge on withdrawal [2].
6. **Add up the round trip.** Approving, minting, collecting and burning all cost gas. Check that expected fees cover it at your position size.

For the full risk picture, see [Liquidity Pool Risks](/guides/liquidity-pool-risks/).

## Where to watch the numbers

- **Range positions and uncollected fees:** [Revert Finance](https://revert.finance).
- **Token transfers and balances of any standard:** [Etherscan](https://etherscan.io).
- **What actually moved inside a singleton transaction:** [Tenderly](https://tenderly.co).

## When something goes wrong

- **You sold a position NFT and lost the fees.** Uncollected fees belong to the NFT, so they went with it. Collect before transferring or pledging one.
- **A lending protocol is liquidating your pool collateral.** The mix inside the position shifted and its value fell below the threshold. Repay or top up before the price feed crosses it.
- **Your wallet does not show what a v4 position is worth.** The NFT only identifies the position. Its tokens sit inside the shared contract, so check the value through the protocol's interface or a position tracker.

## Where to go next

What your claim is worth on the way out depends on impermanent loss — how far the position falls behind just holding the tokens you deposited — worked out in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/). If you plan to stake the claim for extra rewards, read [Yield Farming Explained](/guides/yield-farming-explained/) first, because staking adds a contract and a reward token to the risk. For the NFT itself, see [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/), and for who holds these claims and why, [What Is a Liquidity Provider?](/guides/what-is-a-liquidity-provider/).

## References

1. [Uniswap v2 Core (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v4 Core (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
4. [Providing Liquidity in Pools (Curve Finance Documentation)](https://docs.curve.finance/user/yield/lp)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://doi.org/10.1145/3558535.3559772)
6. [ERC-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-721)
7. [ERC-6909: Minimal Multi-Token Interface (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-6909)
8. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
9. [ERC-20: Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-20)
10. [Managing Liquidity (Uniswap v4 Documentation)](https://developers.uniswap.org/docs/protocols/v4/guides/managing-liquidity/overview)
11. [Developer Portal (Gamma LP Vaults Documentation)](https://docs.gamma.xyz/gamma/lp-vaults/developer-portal)
12. [Fees (Uniswap Developers Documentation)](https://developers.uniswap.org/docs/get-started/concepts/fees)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core"
[3]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core"
[4]: https://docs.curve.finance/user/yield/lp "Providing Liquidity in Pools"
[5]: https://doi.org/10.1145/3558535.3559772 "Risks and Returns of Uniswap V3 Liquidity Providers"
[6]: https://eips.ethereum.org/EIPS/eip-721 "ERC-721: Non-Fungible Token Standard"
[7]: https://eips.ethereum.org/EIPS/eip-6909 "ERC-6909: Minimal Multi-Token Interface"
[8]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols"
[9]: https://eips.ethereum.org/EIPS/eip-20 "ERC-20: Token Standard"
[10]: https://developers.uniswap.org/docs/protocols/v4/guides/managing-liquidity/overview "Managing Liquidity"
[11]: https://docs.gamma.xyz/gamma/lp-vaults/developer-portal "Developer Portal"
[12]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees"
