---
title: "Rug Pulls and Locked Liquidity: Six Checks Before You Deposit"
description: "Six checks you can run from public chain data in ten minutes. None needs code reading, and together they catch almost every failure visible in advance."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Dr. Kieran Thorne"
readTime: "6 min read"
keywords: "rug pull liquidity pool, locked liquidity meaning, how to check locked liquidity, pool liquidity locked or unlocked, liquidity pool smart contract audit, how to check if a liquidity pool is safe"
featured: false
faq:
  - q: "What is a rug pull in a liquidity pool?"
    a: "A pool where the party who created it can remove the liquidity backing a token, or can use privileged token functions to prevent selling. Holders are left with a token that has no executable market, which is a total loss regardless of what the chart showed beforehand."
  - q: "What does locked liquidity mean?"
    a: "The LP claim for a pool has been transferred to a locker contract with a time condition, or to a burn address. Locked liquidity means the creator cannot withdraw the pooled assets during the lock, which removes one specific attack while leaving several others intact."
  - q: "How do I check if liquidity is locked?"
    a: "Find the pool's LP token contract, look at its largest holders, and confirm the balance sits in a recognised locker contract or a burn address. Then read the locker entry for the amount and unlock timestamp. A claim in documentation or a screenshot is not verification."
  - q: "Does locked liquidity make a token safe?"
    a: "No. A locked pool holding a token with an active mint function, a blacklist, or a transfer tax controlled by an address is still exposed. Both the pool and the assets inside it have to pass their own checks."
  - q: "How can I tell if a token can be sold?"
    a: "Simulate a sell before buying, using a transaction simulator or a small test transaction. Tokens that can be bought but not sold are a recognised pattern and become visible immediately under simulation."
---

Pool fraud is not clever. It works because you read a chart instead of a contract, and because nobody checks whether the money can leave until the moment they want it to leave.

Six checks catch almost all of it. All six use public chain data, none of them requires reading code, and together they take about ten minutes.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-rug-pulls.webp" alt="Six cards describing pre-deposit security checks including locked liquidity, token permissions, ownership and exit simulation." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six pre-deposit checks, each answerable from public chain data in minutes. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"Every one of these I have reviewed came down to a permission that was visible before anybody deposited. Not a clever exploit. A mint function, an owner who never gave up control, or a pool claim sitting in somebody's wallet rather than a locker. The information was public and nobody looked."*

## Four different things, one outcome

| What happens | How |
| :--- | :--- |
| The pool disappears | Whoever holds the claim withdraws everything, leaving the token with no market |
| You cannot sell | A mint function dilutes you, a blacklist blocks you, or a transfer tax gets raised until selling is pointless |
| The contract changes | A proxy with a live key gets a new implementation after your money arrives |
| It drains slowly | Fees or rewards routed to an address the team controls, accumulating quietly |

Only the first is addressed by locking liquidity. That is the single most important sentence here, because treating a lock as proof of safety is the most common mistake in this whole area.

## One: where the pool claim actually sits

Find the pool's LP token, then look at who holds it.

| What you find | What it means |
| :--- | :--- |
| A burn address | Gone permanently. Nobody can withdraw the pooled assets |
| A locker contract | Gone until the unlock time, which you can read yourself |
| An ordinary wallet | Withdrawable right now, by whoever holds that key |
| Split across several wallets | Work out what fraction is genuinely locked |

Read the lock entry, not the claim about it. Amount, unlock time, beneficiary. A lock covering 20% of the pool that expires in two weeks is technically a lock and practically nothing.

## Two: what the token itself can do

Read the token contract for functions somebody can still call:

- **Mint.** New supply can be created and sold into the pool you funded.
- **Pause or blacklist.** Transfers can be blocked for specific addresses, which stops you selling.
- **An adjustable tax.** A transfer fee that can be raised to a high number is a sell block wearing a different hat.
- **Any transfer gate.** Anything that decides who may move tokens based on who is asking.

Then find out who holds those powers. Ownership renounced, a delay before changes take effect, or a multisig with named signers are all meaningfully different from one ordinary wallet. All three are readable from the contract rather than from the project's own documentation.

## Three: can you even read the code

Unverified code on a token or pool is a refusal, not a risk to price. You cannot review what you cannot see.

Where it is verified, three more questions:

- **Is there a proxy, and who can upgrade it?**
- **Has it been audited, and does the audited version match what is actually deployed?**
- **Does it differ from the well-known thing it claims to be a copy of?** A bytecode comparison answers this.

An audit is evidence about one version at one moment, not a guarantee about what you are interacting with today. See [Liquidity Pool Risks](/guides/liquidity-pool-risks/) and [The Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/).

## Four: who else is holding, and can you get out

Even with liquidity locked and permissions clean, a token held by a handful of wallets has a structural problem. Your exit may be queued behind somebody else's much larger one.

Two numbers matter more than the holder count:

- **What share the top ten addresses hold**, excluding known contracts.
- **What trade size moves the price 5%.** That is the practical cap on your position, and it comes from the money actually working near the price rather than the headline figure.

See [Token Liquidity Analysis](/guides/token-liquidity-analysis/).

## Five and six: simulate the exit, then size for it

Simulation is the fastest check here and the most skipped. Before buying, simulate selling the amount you intend to hold. A simulator will surface a revert, an unexpected tax, or a transfer block immediately.

Then size the position assuming the whole pool could become unreachable. On a newly created pool with no history, that is not pessimism. It is the base rate.

## What a rug looks like before it happens

Most rug pulls leave the same traces on a brand-new pool. None of them proves fraud on its own. Several together should end your research.

| What you see | Why it matters |
| :--- | :--- |
| The pool is under a day old and already advertises a huge yield | There is no history to judge it by, and the yield exists to pull deposits in |
| The deployer was funded from a freshly created wallet | Nobody can connect the launch to a reputation they would lose |
| Most early buys come from a handful of new wallets | Coordinated buying makes a chart look like real demand |
| Sells are rare, or tiny next to the buys | A token that blocks or taxes selling produces exactly this pattern |
| The pool claim is locked for days rather than months | A short lock only delays the withdrawal |

Treat the chart as a symptom, not as the check. The six checks above tell you whether the door is open. These signs tell you whether somebody is already standing next to it.

## What these checks cannot tell you

Three exposures survive all six, and honest research names them rather than implying the list is complete.

**Future governance.** A protocol with a working multisig today can vote tomorrow to change fee routing, reward weights, or who can upgrade what. A lock says nothing about parameters a vote can still move.

**Things off the chain.** Price feeds, bridges, sequencers and issuers sit behind many pools. A stablecoin whose issuer freezes an address, or a bridge whose validators fail, damages a pool whose own contracts are flawless.

**Somebody's keys.** Ownership held by a named team protects against an anonymous exit, not against a compromised device. The same powers a team uses responsibly work identically for whoever gets their signing key.

The right response to all three is position sizing, not more inspection. A pool that passes every check and still carries these should be sized as though they exist, because they do.

## What people get wrong here

| What people assume | What actually happens |
| :--- | :--- |
| Locked liquidity means safe | It closes one door. The mint function, the blacklist and the tax are all still open |
| An audit means it is fine | It covers one version at one moment. Check the deployed code matches |
| A big holder list means distribution | Ten wallets holding most of it means your exit is behind theirs |
| I will check when I want to sell | That is the moment the answer stops being useful |

## The ten-minute routine

1. **Get the pool and token addresses from the chain**, not from a link somebody sent you.
2. **Read the LP token holder list.** Confirm where the claim sits, with amounts and unlock times.
3. **Read the token contract** for mint, pause, blacklist and tax functions, and find out who can call them.
4. **Confirm verification**, check for a proxy, and identify who can upgrade it.
5. **Measure top-holder concentration** and what moves the price 5% in each direction.
6. **Simulate a buy and a sell** at the size you actually intend.
7. **Size it so a total loss here is survivable.**

None of this proves a pool is sound. It removes the failures that were visible in advance, which is most of them, and leaves you underwriting only the risks you actually chose.

## References

1. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
2. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
3. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [Smart Contract Security Field Guide (Ethereum Foundation)](https://ethereum.org/en/developers/docs/smart-contracts/security/)
5. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
6. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)
7. [ERC-20: Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-20)

[1]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[2]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[3]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[4]: https://ethereum.org/en/developers/docs/smart-contracts/security/ "Smart contract security"
[5]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[6]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
[7]: https://eips.ethereum.org/EIPS/eip-20 "ERC-20: Token Standard (Ethereum Improvement Proposals)"
