---
title: "Rug Pulls and Locked Liquidity: Six Checks Before You Deposit"
seoTitle: "Rug Pulls and Locked Liquidity: Six Checks Before Depositing"
description: "Six checks you can run from public chain data in ten minutes. None needs code reading, and together they catch almost every failure visible in advance."
category: "Risk & Research"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "rug pull liquidity pool"
keywords: "rug pull liquidity pool, locked liquidity meaning, how to check locked liquidity, pool liquidity locked or unlocked, liquidity pool smart contract audit, how to check if a liquidity pool is safe"
featured: false
faq:
  - q: "What is a rug pull in a liquidity pool?"
    a: "A pool where the party who created it can remove the liquidity backing a token, or can use privileged token functions to drain the pool or prevent selling. Holders are left with a token that has no usable market, which is a total loss regardless of what the chart showed beforehand."
  - q: "What does locked liquidity mean?"
    a: "The claim on the pool's assets — an LP token, or a position NFT on Uniswap v3 and v4 — has been sent to a locker contract with an unlock time, or to a burn address. The creator cannot withdraw those pooled assets during the lock. That removes one specific attack and leaves the others intact."
  - q: "How do I check if liquidity is locked?"
    a: "Find who holds the pool's LP token or position NFTs, and confirm the claim sits in a recognised locker contract or a burn address. Then read the locker entry for the amount and unlock time. A claim in documentation or a screenshot is not verification."
  - q: "Does locked liquidity make a token safe?"
    a: "No. A locked pool holding a token with an active mint function, a blacklist, or a transfer tax controlled by an address is still exposed. Researchers have documented scams that lock liquidity to build trust, then mint new tokens to drain the pool anyway."
  - q: "How can I tell if a token can be sold?"
    a: "Simulate a sell before buying, using a transaction simulator or a small test transaction. Tokens that can be bought but not sold are a recognised pattern and become visible immediately under simulation."
---

Most pool fraud is not sophisticated. It works because buyers read a chart instead of the contract, and nobody checks whether money can leave until the moment they want it to leave.

Six checks catch most of the failures you can see in advance. All six use public chain data, none requires reading code, and together they take about ten minutes. By the end you will know which risks a pool has ruled out and which ones you are still carrying.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-rug-pulls.webp" alt="Six cards describing pre-deposit security checks including locked liquidity, token permissions, ownership and exit simulation." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six pre-deposit checks, each answerable from public chain data in minutes. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Check visible permissions before depositing: token minting, upgrade authority, ownership controls, and who holds the pool claim. These facts do not prove safety, but they can reveal a direct control path that makes the advertised yield irrelevant. For proxy contracts, compare the deployed implementation with the audited commit and inspect who retains authority to replace it.

## Four different things, one outcome

Researchers who studied scam tokens on Uniswap describe several distinct ways a pool gets emptied [3]. They reduce to four.

| What happens | How |
| :--- | :--- |
| The pool disappears | Whoever holds the claim withdraws everything, leaving the token with no market |
| You cannot sell | A blacklist blocks you, a rewritten transfer function rejects sales, or a transfer tax gets raised until selling is pointless |
| The pool gets drained by new supply | A mint function creates fresh tokens that are sold into the pool for the real asset |
| The contract changes | A proxy with a live key gets a new implementation after your money arrives |

Only the first is addressed by locking liquidity. Treating a lock as proof of safety is the most common mistake in this area. One study describes scams that lock or burn the pool claim to build confidence, then mint new tokens and sell them into the pool to take nearly all of the real asset [3].

## One: where the pool claim actually sits

When you deposit into a Uniswap v2-style pool, you receive pool shares, an ERC-20 token that can be redeemed for a slice of the reserves [1]. On Uniswap v3 and v4, each position is an NFT instead. Either way, find the claim and look at who holds it.

| What you find | What it means |
| :--- | :--- |
| A burn address | Gone permanently. Nobody can withdraw those pooled assets |
| A locker contract | Gone until the unlock time, which you can read yourself |
| An ordinary wallet | Withdrawable right now, by whoever holds that key |
| Split across several wallets | Work out what fraction is genuinely locked |

Read the lock entry, not the claim about it. Check the amount, the unlock time and the beneficiary. A lock covering 20% of the pool that expires in two weeks is technically a lock and practically nothing.

## Two: what the token itself can do

The ERC-20 standard defines how tokens are transferred and approved [2]. Anything beyond that is the issuer's own code. Read the token contract for extra functions somebody can still call:

- **Mint.** New supply can be created and sold into the pool you funded [3].
- **Pause or blacklist.** Transfers can be blocked for specific addresses, which stops you selling.
- **An adjustable tax.** A transfer fee that can be raised to a high number works as a sell block.
- **Any transfer gate.** Anything that decides who may move tokens based on who is asking. One documented pattern rewrites the transfer function so that only the owner can sell into the pool [3].

Then find out who holds those powers. Ownership renounced, a timelock that delays changes, and a multisig that needs several signers to agree are all meaningfully different from one ordinary wallet [6]. All three are readable from the contract rather than from the project's own documentation.

## Three: can you even read the code?

Unverified code on a token or pool is a reason to stop, not a risk to price in. You cannot review what you cannot see.

Where it is verified, ask three more questions:

- **Is there a proxy, and who can upgrade it?** A proxy keeps your balances in one contract and runs logic from another. Replacing that logic contract changes what the code does [6].
- **Has it been audited, and does the audited version match what is actually deployed?**
- **Does it differ from the well-known contract it claims to copy?** Comparing the deployed bytecode answers this. Researchers found that bytecode similarity checks can flag known vulnerable and adversarial contracts [5].

An audit is evidence about one version at one moment, not a guarantee about what you are interacting with today. See [Liquidity Pool Risks](/guides/liquidity-pool-risks/) and [The Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/).

## Four: who else is holding, and can you get out?

Even with liquidity locked and permissions clean, a token held by a handful of wallets has a structural problem. Your exit may be queued behind somebody else's much larger one.

Two numbers matter more than the holder count:

- **What share the top ten addresses hold**, excluding known contracts.
- **What trade size moves the price 5%.** That is the practical cap on your position. It comes from the money actually working near the price, not the headline figure.

See [Token Liquidity Analysis](/guides/token-liquidity-analysis/).

## Five and six: simulate the exit, then size for it

Simulation is the fastest check here and the most skipped. Before buying, simulate selling the amount you intend to hold. A simulator will surface a revert, an unexpected tax or a transfer block immediately.

Then size the position as if the whole pool could become unreachable. On a newly created pool with no history, that is a realistic starting assumption. One study of Uniswap v2 classified roughly half of the tokens listed there as scam tokens, all of them built for rug pulls [4].

## What a rug looks like before it happens

Rug pulls tend to leave similar traces on a brand-new pool. None of these proves fraud on its own. Several together should end your research.

| What you see | Why it matters |
| :--- | :--- |
| The pool is under a day old and already advertises a huge yield | There is no history to judge it by, and the yield exists to pull deposits in |
| The deployer was funded from a freshly created wallet | Nobody can connect the launch to a reputation they would lose |
| Most early buys come from a handful of new wallets | Coordinated buying makes a chart look like real demand; studies found thousands of colluding addresses helping scam pools [4] |
| Sells are rare, or tiny next to the buys | A token that blocks or taxes selling produces exactly this pattern |
| The pool claim is locked for days rather than months | A short lock only delays the withdrawal |

Treat the chart as a symptom, not as the check. The six checks above tell you whether the door is open. These signs suggest whether somebody is already standing next to it.

## What these checks cannot tell you

Three exposures survive all six, and honest research names them rather than implying the list is complete.

**Future governance.** A protocol with a working multisig today can vote tomorrow to change fee routing, reward weights, or who can upgrade what. The Bank for International Settlements argues that the need for governance makes some centralisation in DeFi inevitable [7]. A lock says nothing about parameters a vote can still move.

**Things off the chain.** Price feeds, bridges, sequencers and issuers sit behind many pools. A stablecoin whose issuer freezes an address, or a bridge whose validators fail, damages a pool whose own contracts are flawless.

**Somebody's keys.** Ownership held by a named team protects against an anonymous exit, not against a compromised device. The same powers a team uses responsibly work identically for whoever gets their signing key.

The right response to all three is position sizing, not more inspection. A pool that passes every check still carries these risks, so size it as though they exist.

## The ten-minute routine

1. **Get the pool and token addresses from the chain**, not from a link somebody sent you.
2. **Find who holds the pool claim.** Confirm where it sits, with amounts and unlock times.
3. **Read the token contract** for mint, pause, blacklist and tax functions, and find out who can call them.
4. **Confirm verification**, check for a proxy, and identify who can upgrade it.
5. **Measure top-holder concentration** and what moves the price 5% in each direction.
6. **Simulate a buy and a sell** at the size you actually intend.
7. **Size it so a total loss here is survivable.**

None of this proves a pool is sound. It removes the failures that were visible in advance and leaves you carrying only the risks you chose. File the rest under [Liquidity Pool Risks](/guides/liquidity-pool-risks/), and run the numbers you can compute with the [LP profit and return calculator](/tools/lp-profit-calculator/).

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [ERC-20: Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-20)
3. [Do not rug on me: Zero-dimensional Scam Detection (Mazorra et al., 2022)](https://arxiv.org/abs/2201.07220)
4. [Trade or Trick? Detecting and Characterizing Scam Tokens on Uniswap Decentralized Exchange (Xia et al., 2021)](https://arxiv.org/abs/2109.00229)
5. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
6. [Smart contract security (ethereum.org)](https://ethereum.org/en/developers/docs/smart-contracts/security/)
7. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://eips.ethereum.org/EIPS/eip-20 "ERC-20: Token Standard (Ethereum Improvement Proposals)"
[3]: https://arxiv.org/abs/2201.07220 "Do not rug on me: Zero-dimensional Scam Detection (Mazorra et al., 2022)"
[4]: https://arxiv.org/abs/2109.00229 "Trade or Trick? Detecting and Characterizing Scam Tokens on Uniswap Decentralized Exchange (Xia et al., 2021)"
[5]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[6]: https://ethereum.org/en/developers/docs/smart-contracts/security/ "Smart contract security"
[7]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
