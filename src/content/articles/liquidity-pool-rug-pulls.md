---
title: "Rug Pulls and Locked Liquidity: Six Checks Before You Deposit"
description: "How liquidity pool rug pulls work, what locked liquidity actually proves, and the six onchain checks that eliminate most pool-level fraud before capital moves."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Dr. Kieran Thorne"
readTime: "11 min read"
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

Pool-level fraud is not subtle and it is not hard to detect. It relies on people reading a chart instead of a contract, and on the gap between the moment capital is committed and the moment anyone checks whether it can leave.

Six checks, all verifiable onchain, eliminate most of it. None of them require reading Solidity.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-rug-pulls.webp" alt="Six cards describing pre-deposit security checks including locked liquidity, token permissions, ownership and exit simulation." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six pre-deposit checks, each answerable from public chain data in minutes. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"Every incident review I have run on a pool exit came down to a permission that was visible before the deposit. Not a clever exploit, not a novel vector: a mint function, an unrenounced owner, or an LP balance sitting in a wallet rather than a locker. The information was public and nobody looked."*

## 1. What a Rug Pull Actually Is

The term covers several distinct mechanisms with the same outcome.

- **Liquidity removal.** The creator holds the LP claim and withdraws the pooled assets, leaving the token with no market to sell into.
- **Privileged token functions.** A mint function dilutes holders, a blacklist prevents specific addresses from selling, and an adjustable transfer tax can be raised to make selling uneconomic.
- **Upgradeable contracts.** A proxy with an active admin key can have its implementation replaced after deposits arrive.
- **Slow drains.** Fees or rewards routed to an address controlled by the team, accumulating quietly rather than in a single event.

Only the first is addressed by locking liquidity. The others require reading token and contract permissions, which is why treating a lock as sufficient is the most common mistake in this area.

---

## 2. Check One: Where the LP Claim Actually Sits

Find the pool's LP token, then look at its holders. There are three meaningful outcomes:

| What you find | What it means |
| :--- | :--- |
| Balance in a burn address | Permanently removed. Nobody can withdraw the pooled assets. |
| Balance in a locker contract | Removed until the unlock timestamp, which you can read directly. |
| Balance in an externally owned wallet | Withdrawable at any moment by whoever controls the key. |
| Balance split across several wallets | Partial exposure; compute the share that is genuinely locked. |

Read the lock entry itself: amount, unlock time, and beneficiary. A lock covering 20% of the pool with a two-week expiry is technically a lock and practically meaningless. Locked liquidity is a floor under one failure mode, not a safety rating.

---

## 3. Check Two: Token Permissions

Read the token contract for functions still callable by an address:

- **Mint.** New supply can be created and sold into the pool you funded.
- **Pause or blacklist.** Transfers can be blocked selectively, which prevents selling.
- **Fee or tax setters.** A transfer tax that can be raised to a high percentage is functionally a sell block.
- **Owner-only transfer restrictions.** Any function that gates transfers based on caller address.

Then check who holds those permissions. Renounced ownership, a timelock, or a multisig with named signers are meaningfully different from a single externally owned account, and all three are verifiable from the contract rather than from a project's documentation.

---

## 4. Check Three: Verification, Audits and Upgradeability

Unverified bytecode on a token or pool contract is a refusal rather than a risk to be priced: you cannot review what you cannot read.

Where contracts are verified, three further questions apply. Is there a proxy, and who can upgrade it? Has an audit been performed, and does the audited commit match what is deployed? Does the deployment differ from the well-known implementation it claims to fork, which a bytecode comparison will reveal.

Audit reports are evidence about a specific commit at a specific time, not a guarantee about the contract you are interacting with today. The wider framework for reading them is in [Liquidity Pool Risks](/guides/liquidity-pool-risks/) and [The Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/).

---

## 5. Check Four: Holder Concentration and Exit Capacity

Even with locked liquidity and clean permissions, a token whose supply is concentrated in a few wallets has a structural problem: the exit you are planning may be behind someone else's much larger one.

Two measurements matter more than the holder count. First, the share of circulating supply held by the top ten addresses, excluding known contracts. Second, the trade size that moves price by five percent, which is the practical cap on any position you take. The second number is the one that decides sizing, and it is computed from active depth rather than from headline liquidity, as covered in [Token Liquidity Analysis](/guides/token-liquidity-analysis/).

---

## 6. Check Five and Six: Simulate the Exit, Then Size for It

Simulation is the fastest of all these checks and the most frequently skipped. Before buying, simulate a sell of the size you intend to hold. Transaction simulators will surface a revert, an unexpected tax, or a transfer restriction immediately.

Then size the position on the assumption that the entire pool could become unavailable. For newly created pools with short histories, that is not pessimism; it is the base rate. Position sizing is the only control that works against the failure modes you did not anticipate.

## 6b. What the Checks Cannot Tell You

Three exposures survive every check above, and honest research names them rather than implying the list is complete.

**Future governance.** A protocol with a functioning multisig today can vote tomorrow to change fee routing, gauge weights or upgrade authority. Locked liquidity says nothing about parameters that governance can still move.

**Off-chain dependencies.** Oracles, bridges, sequencers and centralised issuers sit behind many pools. A stablecoin whose issuer freezes an address, or a bridge whose validators fail, affects a pool whose own contracts are flawless.

**Social engineering of the deployer.** Ownership held by a named team is protection against anonymous exit, not against a compromised key. The same permissions that a team can use responsibly can be used by whoever obtains their signing device.

The correct response to all three is position sizing rather than further inspection. A pool that passes every check and still carries these exposures should be sized as though the exposure exists, because it does.

---

## 7. A Ten-Minute Pre-Deposit Routine

- [ ] Locate the pool and LP token contract addresses from the chain, not from a link in a chat.
- [ ] Read the LP token holder list and confirm where the claim sits, with amounts and unlock times.
- [ ] Read the token contract for mint, pause, blacklist and tax functions, and identify who can call them.
- [ ] Confirm contract verification, check for a proxy, and identify the upgrade authority.
- [ ] Measure top-holder concentration and the five percent depth on both sides of the book.
- [ ] Simulate a buy and a sell at your intended size.
- [ ] Size the position so that a total loss on this pool is survivable.

None of this proves a pool is sound. It removes the failures that are visible in advance, which is most of them, and leaves you underwriting only the risks you actually chose.

## References

1. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
2. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
3. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [Smart Contract Security Field Guide (Ethereum Foundation)](https://ethereum.org/en/developers/docs/smart-contracts/security/)
5. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
6. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)
7. [ERC-20: Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-20)

[1]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[2]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[3]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[4]: https://ethereum.org/en/developers/docs/smart-contracts/security/ "Smart contract security"
[5]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[6]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
[7]: https://eips.ethereum.org/EIPS/eip-20 "ERC-20: Token Standard (Ethereum Improvement Proposals)"
